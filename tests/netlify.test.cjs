const test=require('node:test');
const assert=require('node:assert/strict');
const {createNetlifyHandler}=require('../scripts/netlify-adapter.cjs');
const {createHttpApi}=require('../scripts/http-api.cjs');
const api=createHttpApi({secret:'x'.repeat(40),origins:['https://gerador.netlify.app'],production:true,assistant:{configured:true,provider:'groq',chat:async body=>({text:body.message})}});
test('Netlify: cookie seguro, POST e IP da plataforma',async()=>{
  const status=createNetlifyHandler(api,'status');
  const response=await status(new Request('https://gerador.netlify.app/api/status', {headers:{'x-forwarded-for':'forjado'}}),{ip:'203.0.113.1'});
  assert.equal(response.status,200);
  assert.match(response.headers.get('set-cookie'),/Secure/);
  assert.equal((await response.json()).provider,'groq');
  const chat=createNetlifyHandler(api,'chat');
  const reply=await chat(new Request('https://gerador.netlify.app/api/chat',{method:'POST',headers:{origin:'https://gerador.netlify.app','content-type':'application/json'},body:JSON.stringify({message:'teste'})}),{ip:'203.0.113.1'});
  assert.equal(reply.status,200);assert.equal((await reply.json()).text,'teste');
  assert.equal((await status(new Request('https://gerador.netlify.app/api/status',{headers:{'x-forwarded-for':'203.0.113.2'}}),{})).status,400);
});
test('Netlify: origem externa e corpo excessivo são rejeitados',async()=>{
  const chat=createNetlifyHandler(api,'chat');
  const request=(origin,body)=>new Request('https://gerador.netlify.app/api/chat',{method:'POST',headers:{origin,'content-type':'application/json'},body});
  assert.equal((await chat(request('https://externo.example','{}'),{ip:'203.0.113.1'})).status,403);
  assert.equal((await chat(request('https://gerador.netlify.app','x'.repeat(120001)),{ip:'203.0.113.1'})).status,413);
});
