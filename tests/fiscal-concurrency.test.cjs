const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const http=require('node:http');
const {PassThrough}=require('node:stream');
const {createServer}=require('../scripts/serve.cjs');
const source=fs.readFileSync(path.join(__dirname,'../scripts/fiscal-validation-api.cjs'),'utf8');
const success={documento:'cte',cobertura:{xsd:'nao-suportado'},achados:[]};

function isolatedRuntime(validateFiscalXml,clock={setTimeout,clearTimeout}) {
  const module={exports:{}};
  vm.runInNewContext(source,{
    module,Buffer,URL,...clock,
    require:id=>{assert.equal(id,'./fiscal-xsd.cjs');return {MAX_XML_BYTES:4*1024*1024,validateFiscalXml};}
  },{filename:'fiscal-validation-api.cjs'});
  return module.exports.fiscalValidationRuntime;
}
function capture() {
  const headers={};let text='';
  const res={statusCode:200,setHeader:(key,value)=>{headers[key.toLowerCase()]=value;},end:value=>{text=String(value);}};
  return {res,result:()=>({status:res.statusCode,headers,body:JSON.parse(text)})};
}
const headers={host:'localhost:4173',origin:'http://localhost:4173','content-type':'application/json'};
async function invoke(runtime,body={xml:'<CTe/>'}) {
  const result=capture();await runtime({method:'POST',headers,body},result.res);return result.result();
}

test('API XSD real reserva duas vagas enquanto lê corpos e recusa a terceira', {timeout:10000}, async()=>{
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port,host=`127.0.0.1:${port}`;
  const options={host:'127.0.0.1',port,path:'/api/validate-xml',method:'POST',agent:false,headers:{host,origin:`http://${host}`,'content-type':'application/json'}};
  const xml='<CTe xmlns="http://www.portalfiscal.inf.br/cte"><infCte versao="3.00"/></CTe>';
  let arrivals=0;const bodiesArrived=new Promise(resolve=>server.on('request',req=>{if(req.headers['x-test-slot']&&++arrivals===2)resolve();}));
  const collect=res=>new Promise((resolve,reject)=>{
    const chunks=[];res.on('data',chunk=>chunks.push(chunk));res.on('error',reject);
    res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:JSON.parse(Buffer.concat(chunks).toString('utf8'))}));
  });
  const held=[];
  for(const id of ['one','two']) {
    let req;const response=new Promise((resolve,reject)=>{req=http.request({...options,headers:{...options.headers,'x-test-slot':id}},res=>collect(res).then(resolve,reject));req.on('error',reject);req.write('{"xml":');});
    held.push({req,response});
  }
  try {
    await bodiesArrived;
    const third=await new Promise((resolve,reject)=>{const req=http.request(options,res=>collect(res).then(resolve,reject));req.on('error',reject);req.end(JSON.stringify({xml}));});
    assert.equal(third.status,429);
    assert.equal(third.headers['retry-after'],'5');
    assert.equal(third.body.codigo,'xsd-indisponivel');
  } finally {
    for(const {req} of held)req.end(JSON.stringify(xml)+'}');
    try {for(const result of await Promise.all(held.map(item=>item.response)))assert.equal(result.status,200);}
    finally {await new Promise(resolve=>server.close(resolve));}
  }
});

test('API libera vagas após JSON inválido, payload inválido e leitura interrompida', async()=>{
  const runtime=isolatedRuntime(async()=>success);
  for(const body of ['{','{',{},[],{xml:42}])assert.equal((await invoke(runtime,body)).status,400);
  for(let index=0;index<2;index++) {
    const req=new PassThrough();req.method='POST';req.headers=headers;
    const result=capture(),pending=runtime(req,result.res);req.destroy(new Error('Leitura de teste interrompida'));
    await pending;assert.equal(result.result().status,503);
  }
  assert.equal((await invoke(runtime)).status,200);
});

test('API libera vagas após erro síncrono ou rejeição do motor', async()=>{
  for(const mode of ['sync','async']) {
    let calls=0;
    const runtime=isolatedRuntime(()=>{
      if(++calls<=2) {
        const error=Object.assign(new Error('Falha sintética'),{status:422});
        if(mode==='sync')throw error;
        return Promise.reject(error);
      }
      return Promise.resolve(success);
    });
    assert.equal((await invoke(runtime)).status,422,mode);
    assert.equal((await invoke(runtime)).status,422,mode);
    assert.equal((await invoke(runtime)).status,200,mode);
  }
});

test('timeout HTTP não libera vaga enquanto a validação continua pendente', async()=>{
  const timers=[],pending=[];let ready;
  const bothStarted=new Promise(resolve=>{ready=resolve;});let calls=0;
  const runtime=isolatedRuntime(()=>{
    if(++calls>2)return Promise.resolve(success);
    return new Promise(resolve=>{pending.push(resolve);if(pending.length===2)ready();});
  },{setTimeout:callback=>{const timer={callback,cleared:false};timers.push(timer);return timer;},clearTimeout:timer=>{timer.cleared=true;}});
  const first=invoke(runtime),second=invoke(runtime);
  try {
    await bothStarted;timers[0].callback();
    assert.equal((await first).status,504);
    assert.equal((await invoke(runtime)).status,429);
    pending[0](success);await Promise.resolve();
    assert.equal((await invoke(runtime)).status,200);
    pending[1](success);assert.equal((await second).status,200);
    assert(timers.every(timer=>timer.cleared));
  } finally {for(const resolve of pending)resolve(success);await Promise.allSettled([first,second]);}
});
