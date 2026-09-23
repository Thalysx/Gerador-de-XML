const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createHttpApi}=require('../scripts/http-api.cjs');
const {createAssistant}=require('../scripts/ai.cjs');
const {createMemoryStore}=require('../scripts/session-store.cjs');
const secret='test-only-secret-with-at-least-32-characters';
const host='gerador.example',origin='https://'+host;
async function request(handler,{method='POST',body={message:'oi'},cookie,extra={},route='chat'}={}) {
  const req={method,body,headers:{host,origin,'content-type':'application/json','x-forwarded-for':'203.0.113.10',...(cookie?{cookie}:{}),...extra},socket:{remoteAddress:'127.0.0.1'}};
  const result={headers:{}};
  const res={statusCode:200,setHeader(k,v){result.headers[k]=v;},end(value){result.status=this.statusCode;result.body=JSON.parse(value);}};
  await handler(req,res,route);return result;
}
function setup(options={}) {
  const assistant=createAssistant({apiKey:'fake',store:createMemoryStore(),fetchImpl:async()=>({ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:'Olá'}]}]})})});
  return createHttpApi({assistant,secret,origins:[origin],production:true,...options});
}
test('API cria cookie seguro, continua sessão e apaga somente conversa do visitante',async()=>{
  const handler=setup();
  const status=await request(handler,{method:'GET',route:'status'});
  assert.equal(status.status,200);assert.equal(status.body.provider,'openai');
  assert.match(status.headers['Set-Cookie'],/HttpOnly; SameSite=Strict;.*Secure/);
  const cookie=status.headers['Set-Cookie'].split(';')[0];
  const first=await request(handler,{cookie});assert.equal(first.status,200);
  const sessionId=first.body.sessionId;
  assert.equal((await request(handler,{cookie,body:{message:'Segundo',sessionId}})).status,200);
  assert.equal((await request(handler,{body:{message:'Intruso',sessionId}})).status,401);
  const other=(await request(handler,{method:'GET',route:'status'})).headers['Set-Cookie'].split(';')[0];
  assert.equal((await request(handler,{cookie:other,method:'DELETE',body:{sessionId}})).status,403);
  assert.equal((await request(handler,{cookie,method:'DELETE',body:{sessionId}})).body.cleared,true);
  assert.equal((await request(handler,{cookie,body:{message:'Depois',sessionId}})).status,410);
});
test('API rejeita origem, host, cookie adulterado, tamanho e JSON inválido',async()=>{
  const handler=setup();
  assert.equal((await request(handler,{extra:{origin:'https://evil.example'}})).status,403);
  assert.equal((await request(handler,{extra:{host:'evil.example'}})).status,403);
  assert.equal((await request(handler,{extra:{'x-forwarded-for':'não é IP'}})).status,400);
  assert.equal((await request(handler,{body:'!'})).status,400);
  assert.equal((await request(handler,{body:{message:'x'.repeat(120001)}})).status,413);
  assert.equal((await request(handler,{method:'PUT'})).status,405);
  const response=await request(handler);const cookie=response.headers['Set-Cookie'].split(';')[0];
  assert.equal((await request(handler,{cookie:cookie+'x',body:{sessionId:response.body.sessionId,message:'adulterado'}})).status,401);
});
test('identidade usa hashes e ignora identificadores enviados no corpo',async()=>{
  let identity;
  const handler=setup({assistant:{configured:true,provider:'groq',chat:async(data,id)=>{identity=id;assert.equal(data.owner,undefined);return {text:'ok'};}}});
  const result=await request(handler,{body:{message:'oi',owner:'intruso',ip:'intruso'}});
  assert.equal(result.status,200);
  assert.match(identity.owner,/^[\w-]{43}$/);assert.match(identity.ip,/^[\w-]{43}$/);
  assert.ok(!JSON.stringify(identity).includes('203.0.113.10'));
});
test('cookie expirado não permite continuar sessão; detalhes internos não vazam',async()=>{
  let clock=Date.now();
  const handler=setup({now:()=>clock});
  const first=await request(handler);const cookie=first.headers['Set-Cookie'].split(';')[0];
  clock+=31*86400000;
  assert.equal((await request(handler,{cookie,body:{sessionId:first.body.sessionId,message:'oi'}})).status,401);
  const broken=setup({assistant:{chat:async()=>{throw Error('API_KEY=secret');}}});
  const error=await request(broken);assert.equal(error.status,502);assert.ok(!JSON.stringify(error.body).includes('secret'));
});
test('runtime público responde indisponível sem configuração de armazenamento',async()=>{
  const {runtime}=require('../scripts/public-runtime.cjs');
  const previous=process.env.AI_ALLOWED_ORIGINS;process.env.AI_ALLOWED_ORIGINS='';
  try {const result=await request(runtime);assert.equal(result.status,503);assert.equal(result.body.configured,false);}finally{if(previous===undefined)delete process.env.AI_ALLOWED_ORIGINS;else process.env.AI_ALLOWED_ORIGINS=previous;}
});
