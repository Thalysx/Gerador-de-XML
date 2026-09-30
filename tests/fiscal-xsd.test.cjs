const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {Readable}=require('node:stream');
const {JSDOM}=require('jsdom');
const {identifyDocument,validateFiscalXml,verifySchemas}=require('../scripts/fiscal-xsd.cjs');
const {fiscalValidationRuntime}=require('../scripts/fiscal-validation-api.cjs');

const root=path.resolve(__dirname,'..');

async function generatedFiscal(type) {
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const dom=new JSDOM(html,{url:'http://localhost',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;
  w.URL.createObjectURL=()=> 'blob:teste';
  w.URL.revokeObjectURL=()=>{};
  w.HTMLElement.prototype.scrollIntoView=()=>{};
  const context=dom.getInternalVMContext();
  for(const file of [...html.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1])) {
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  }
  await new Promise(resolve=>w.document.readyState==='complete'?resolve():w.addEventListener('load',resolve,{once:true}));
  const xml=vm.runInContext(`${type==='cte'?"definirAmbiente('port');":''} gerarXMLComCampos(); serializarXml(xmlsGerados.${type})`,context);
  dom.window.close();
  return xml;
}

async function callApi(xml,{origin='http://localhost:4173',host='localhost:4173'}={}) {
  const req=Readable.from([JSON.stringify({xml})]);
  req.method='POST';
  req.headers={host,origin,'content-type':'application/json'};
  const headers={};let body='';
  const res={statusCode:200,setHeader:(name,value)=>{headers[name.toLowerCase()]=value;},end:value=>{body=String(value||'');}};
  await fiscalValidationRuntime(req,res);
  return {status:res.statusCode,headers,body:JSON.parse(body)};
}

test('manifesto fiscal confirma a integridade de todos os XSDs',()=>{
  assert.doesNotThrow(()=>verifySchemas());
});

test('identificação fiscal é derivada do XML, não do cliente',()=>{
  assert.deepEqual(identifyDocument('<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe versao="4.00"/></NFe>'),{kind:'nfe',root:'NFe',version:'4.00'});
});

test('validador recusa DTD antes de acionar o motor XSD',async()=>{
  await assert.rejects(()=>validateFiscalXml('<!DOCTYPE NFe [<!ENTITY x "y">]><NFe>&x;</NFe>'),error=>error.code==='xml-dtd-entidade');
});

test('NF-e sintética do gerador passa pelo schema oficial vigente',async()=>{
  const result=await validateFiscalXml(await generatedFiscal('nfe'));
  assert.equal(result.cobertura.xsd,'aprovado',result.achados.map(item=>item.mensagem).join('\n'));
});

test('CT-e sintético 4.00 é validado pelo pacote oficial incorporado',async()=>{
  const xml=(await generatedFiscal('cte'))
    .replaceAll('3.00','4.00')
    .replace('</enderEmit></emit>','</enderEmit><CRT>3</CRT></emit>')
    .replaceAll('infCteNorm','infCTeNorm')
    .replaceAll('infCteSupl','infCTeSupl');
  const result=await validateFiscalXml(xml);
  assert.equal(result.cobertura.xsd,'aprovado',result.achados.map(item=>item.mensagem).join('\n'));
});

test('versão fiscal sem pacote incorporado é reportada como não suportada',async()=>{
  const result=await validateFiscalXml('<CTe xmlns="http://www.portalfiscal.inf.br/cte"><infCte versao="3.00"/></CTe>');
  assert.equal(result.cobertura.xsd,'nao-suportado');
  assert.equal(result.achados.length,0);
});

test('erro XSD tem código e origem estáveis sem ecoar o XML-fonte',async()=>{
  const xml='<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe versao="4.00"/></NFe>';
  const response=await callApi(xml);
  assert.equal(response.status,200);
  assert.equal(response.body.cobertura.xsd,'reprovado');
  assert.ok(response.body.achados.every(item=>item.origem==='xsd'&&/^xsd-\d{3}$/.test(item.codigo)));
  assert.equal(JSON.stringify(response.body).includes(xml),false);
  assert.equal(response.headers['cache-control'],'no-store');
});

test('endpoint XSD exige mesma origem e JSON',async()=>{
  const response=await callApi('<NFe/>',{origin:'https://externo.example'});
  assert.equal(response.status,403);
  assert.equal(response.body.codigo,'xsd-indisponivel');
});
