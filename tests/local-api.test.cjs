const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createServer}=require('../scripts/serve.cjs');

test('Vercel e Netlify aposentam rotas remotas sem importar o motor IA',async()=>{
  for(const route of ['chat','status']) {
    const handler=require('../api/'+route+'.js');
    const headers={};let body='';const res={setHeader:(k,v)=>headers[k]=v,end:t=>body=t};
    handler({method:'POST'},res);assert.equal(res.statusCode,410);assert.equal(JSON.parse(body).mode,'local');assert.equal(headers['Cache-Control'],'no-store');
    const netlify=await import('../netlify/functions/'+route+'.mjs');
    const response=await netlify.default(new Request('https://example.com/api/'+route));assert.equal(response.status,410);assert.equal((await response.json()).mode,'local');
  }
});

test('servidor padrão usa apenas comandos locais e mantém rota XML',async()=>{
  const servidor=createServer();await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
  try {
    const base=`http://127.0.0.1:${servidor.address().port}`;
    for(const route of ['chat','status']) {
      const resposta=await fetch(base+'/api/'+route);assert.equal(resposta.status,410);assert.equal(resposta.headers.get('set-cookie'),null);
    }
    assert.equal((await fetch(base+'/api/validate-xml')).status,405);
    assert.equal((await fetch(base+'/assets/js/chat-ia.js')).status,404);
    assert.equal((await fetch(base+'/assets/js/command-parser.js')).status,200);
  } finally {await new Promise(resolve=>servidor.close(resolve));}
});
