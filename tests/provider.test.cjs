const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createAssistant}=require('../scripts/ai.cjs');
const {createProvider,chatMessages}=require('../scripts/provider.cjs');

test('Groq chama ferramentas reais e conserva mensagens de ferramenta na conversa',async()=>{
  let turn=0;
  const assistant=createAssistant({provider:'groq',apiKey:'fake',fetchImpl:async(url,options)=>{
    assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');
    const body=JSON.parse(options.body);
    assert.equal(body.model,'llama-3.3-70b-versatile');
    assert.equal(body.tools[0].function.name,'gerar_dados');
    assert.equal(body.store,undefined);
    if(turn++===0) return {ok:true,json:async()=>({choices:[{finish_reason:'tool_calls',message:{role:'assistant',content:null,tool_calls:[{id:'call_cpf',type:'function',function:{name:'gerar_dados',arguments:JSON.stringify({pedidos:[{tipo:'cpf',quantidade:2}],mascara:false,uf:null})}}]}}]})};
    const output=body.messages.find(m=>m.role==='tool');
    assert.equal(output.tool_call_id,'call_cpf');
    assert.equal(JSON.parse(output.content).total,2);
    return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{role:'assistant',content:'Dois CPFs gerados.'}}]})};
  }});
  const result=await assistant.chat({message:'Gere dois CPFs'});
  assert.equal(result.artifacts[0].records.length,2);
  assert.equal(result.text,'Dois CPFs gerados.');
  assert.equal(assistant.provider,'groq');
  await assistant.chat({sessionId:result.sessionId,message:'Obrigado'});
});

test('adaptador agrupa chamadas paralelas e ignora raciocínio privado',()=>{
  const messages=chatMessages([{type:'reasoning',encrypted_content:'private'},...['a','b'].map(call_id=>({type:'function_call',call_id,name:'f',arguments:'{}'})),{type:'function_call_output',call_id:'a',output:'{}'},{type:'function_call_output',call_id:'b',output:'{}'}],'system');
  assert.equal(messages.length,4);
  assert.equal(messages[1].tool_calls.length,2);
  assert.ok(!JSON.stringify(messages).includes('private'));
});

test('Groq: configuração ausente, cota excedida, resposta truncada e erro sem vazamento',async()=>{
  await assert.rejects(createAssistant({provider:'groq',apiKey:''}).chat({message:'oi'}),/GROQ_API_KEY/);
  const limited=createProvider({provider:'groq',apiKey:'secret',fetchImpl:async()=>({ok:false,status:429})});
  await assert.rejects(limited.respond({input:[],tools:[],instructions:''}),e=>e.status===429 && !e.message.includes('secret'));
  const partial=createAssistant({provider:'groq',apiKey:'secret',fetchImpl:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'length',message:{content:'Parcial'}}]})})});
  await assert.rejects(partial.chat({message:'oi'}),/incompleta/);
  const bad=createProvider({provider:'groq',apiKey:'secret',fetchImpl:async()=>{throw new Error('secret');}});
  await assert.rejects(bad.respond({input:[],tools:[],instructions:''}),e=>!e.message.includes('secret'));
  assert.throws(()=>createProvider({provider:'qualquer'}),/AI_PROVIDER/);
  for(const status of [400,401,403,404]) {
    const rejected=createProvider({provider:'groq',apiKey:'secret',fetchImpl:async()=>({ok:false,status,json:async()=>({error:'secret'})})});
    await assert.rejects(rejected.respond({input:[],tools:[],instructions:''}),e=>e.status===502 && e.message.includes(String(status)) && !e.message.includes('secret'));
  }
});
