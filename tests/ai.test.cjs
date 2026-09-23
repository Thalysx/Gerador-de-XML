const { test }=require('node:test');
const assert=require('node:assert/strict');
const { createAssistant }=require('../scripts/ai.cjs');
const { createServer }=require('../scripts/serve.cjs');
const call=(name,args,id='call1')=>({type:'function_call',name,arguments:JSON.stringify(args),call_id:id});
const answer=text=>({type:'message',content:[{type:'output_text',text}]});

test('IA executa dados e XML reais, consulta artefato e preserva conversa',async()=>{
  let round=0, xmlId;
  const ai=createAssistant({apiKey:'fake-test-key',fetchImpl:async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    const body=JSON.parse(options.body);
    assert.equal(body.store,false);
    let output;
    if (round===0) output=[call('gerar_dados',{pedidos:[{tipo:'cpf',quantidade:3}],mascara:false,uf:null})];
    if (round===1) {
      assert.equal(JSON.parse(body.input.at(-1).output).total,3);
      output=[call('gerar_xml',{tipo:'nfe',itens:3},'call2')];
    }
    if (round===2) {
      const result=JSON.parse(body.input.at(-1).output); xmlId=result.id;
      assert.equal(result.relatorio.status,'sem-erros');
      output=[call('consultar_xml',{id:xmlId},'call3')];
    }
    if (round===3) { assert.match(JSON.parse(body.input.at(-1).output).xml,/<nfeProc/); output=[answer('Gerei os dados e analisei a NF-e.')]; }
    if (round===4) { assert.ok(body.input.some(m=>m.role==='user' && m.content==='Gere dados e XML')); output=[answer('A NF-e possui três produtos.')]; }
    round++; return {ok:true,json:async()=>({status:'completed',output})};
  }});
  const result=await ai.chat({message:'Gere dados e XML'});
  assert.equal(result.artifacts.length,2);
  assert.equal(result.artifacts[0].records.length,3);
  assert.equal((result.artifacts[1].text.match(/<det /g)||[]).length,3);
  assert.equal((await ai.chat({message:'Quantos produtos?',sessionId:result.sessionId})).text,'A NF-e possui três produtos.');
});

test('IA trata ausência de chave, erros do provedor e ferramentas inválidas',async()=>{
  await assert.rejects(createAssistant({apiKey:''}).chat({message:'oi'}),/OPENAI_API_KEY/);
  const ai=createAssistant({apiKey:'secret-test',fetchImpl:async()=>({ok:false,status:401})});
  await assert.rejects(ai.chat({message:'oi'}),/HTTP 401/);
  await assert.rejects(ai.chat({message:'a'.repeat(6001)}),/6.000/);
  await assert.rejects(ai.chat({message:'oi',xml:'x'.repeat(100001)}),/100 KB/);
  let round=0;
  const bad=createAssistant({apiKey:'test',fetchImpl:async(_,opts)=>{
    const body=JSON.parse(opts.body);
    if (round++) { assert.match(JSON.parse(body.input.at(-1).output).erro,/desconhecida/); return {ok:true,json:async()=>({output:[answer('Operação indisponível.')]})}; }
    return {ok:true,json:async()=>({output:[call('executar_codigo',{codigo:'process.exit()'})]})};
  }});
  assert.equal((await bad.chat({message:'Teste'})).text,'Operação indisponível.');
});

test('servidor restringe origem, corpo, métodos e arquivos internos',async()=>{
  const server=createServer(createAssistant({apiKey:''}));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  try {
    for(const file of ['/scripts/ai.cjs','/.env','/package.json','/tests/projeto.test.cjs']) assert.equal((await fetch(base+file)).status,404);
    assert.equal((await fetch(base+'/')).status,200);
    assert.equal((await (await fetch(base+'/api/status')).json()).configured,false);
    assert.equal((await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,403);
    const headers={'Content-Type':'application/json',Origin:base};
    assert.equal((await fetch(base+'/api/chat',{method:'POST',headers,body:'!'})).status,400);
    const res=await fetch(base+'/api/chat',{method:'POST',headers,body:JSON.stringify({message:'oi'})});
    assert.equal(res.status,503); assert.match((await res.json()).error,/OPENAI_API_KEY/);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
