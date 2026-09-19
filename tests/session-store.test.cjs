const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createMemoryStore,createRedisStore,BEGIN,FINISH}=require('../scripts/session-store.cjs');
const {createAssistant}=require('../scripts/ai.cjs');
const identity={owner:'visitor1',ip:'ip1'};
const hasStatus=status=>error=>error.status===status;

test('conversa continua em outra instância de assistente usando o mesmo armazenamento',async()=>{
  const store=createMemoryStore();
  const fetchImpl=async(_,options)=>{
    const body=JSON.parse(options.body);
    return {ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:body.input.filter(m=>m.role==='user').length+' pedidos'}]}]})};
  };
  const first=createAssistant({apiKey:'fake',store,fetchImpl});
  const result=await first.chat({message:'Primeiro'},identity);
  const second=createAssistant({apiKey:'fake',store,fetchImpl});
  assert.equal((await second.chat({message:'Segundo',sessionId:result.sessionId},identity)).text,'2 pedidos');
  await assert.rejects(second.chat({message:'Intruso',sessionId:result.sessionId},{owner:'visitor2',ip:'ip2'}),hasStatus(403));
  await second.clear(result.sessionId,identity.owner);
  await assert.rejects(first.chat({message:'Após apagar',sessionId:result.sessionId},identity),hasStatus(410));
});

test('admissão concorrente não ultrapassa limite por visitante nem global',async()=>{
  const store=createMemoryStore({limits:{minute:2,globalDay:3}});
  const results=await Promise.allSettled(Array.from({length:8},()=>store.begin(identity)));
  assert.equal(results.filter(r=>r.status==='fulfilled').length,2);
  const third=await store.begin({owner:'v2',ip:'ip2'});
  assert.ok(third.session.id);
  await assert.rejects(store.begin({owner:'v3',ip:'ip3'}),hasStatus(429));
});

test('lease impede atualização atrasada; expiração e exclusão respeitam propriedade',async()=>{
  let clock=0;
  const store=createMemoryStore({now:()=>clock});
  const a=await store.begin(identity);
  await assert.rejects(store.begin({...identity,sessionId:a.session.id}),hasStatus(409));
  await assert.rejects(store.remove(a.session.id,'other'),hasStatus(403));
  await assert.rejects(store.remove(a.session.id,identity.owner),hasStatus(409));
  clock=151000;
  const b=await store.begin({...identity,sessionId:a.session.id});
  await assert.rejects(store.finish(a.session,a.lease),hasStatus(409));
  await store.release(a.session.id,a.lease);
  await assert.rejects(store.begin({...identity,sessionId:b.session.id}),hasStatus(409));
  await store.finish(b.session,b.lease);
  clock+=1801000;
  await assert.rejects(store.begin({...identity,sessionId:b.session.id}),hasStatus(410));
});

test('limite por IP persiste entre visitantes e novas conversas',async()=>{
  const store=createMemoryStore({limits:{ipDay:1}});
  const a=await store.begin(identity);await store.finish(a.session,a.lease);
  await store.remove(a.session.id,identity.owner);
  await assert.rejects(store.begin({owner:'new',ip:identity.ip}),hasStatus(429));
});

test('erro do provedor consome reserva e libera bloqueio para nova tentativa',async()=>{
  const store=createMemoryStore({limits:{minute:1}});
  const ai=createAssistant({store,apiKey:'fake',fetchImpl:async()=>({ok:false,status:503})});
  await assert.rejects(ai.chat({message:'oi'},identity),/Verifique/);
  await assert.rejects(ai.chat({message:'oi'},identity),hasStatus(429));
});

test('Redis usa scripts atômicos com TTL e não devolve detalhes da falha',async()=>{
  const calls=[];
  const store=createRedisStore({command:async args=>{
    calls.push(args);
    if(args[1]===BEGIN) {
      const session=JSON.parse(args[11]);session.turns++;session.history={};session.artifacts={};
      return ['ok',JSON.stringify(session)];
    }
    if(args[1]===FINISH) return 'ok';
    return 1;
  }});
  const a=await store.begin(identity);
  assert.deepEqual(a.session.history,[]);
  await store.finish(a.session,a.lease);
  assert.equal(calls[0][0],'EVAL');assert.equal(calls[0][2],6);
  assert.equal(calls[0][13],1800);assert.equal(calls[0][14],150);
  const broken=createRedisStore({url:'https://redis.example',token:'secret',fetchImpl:async()=>{throw Error('secret');}});
  await assert.rejects(broken.begin(identity),e=>e.status===503&&!e.message.includes('secret'));
});

test('armazenamento indisponível impede qualquer chamada ao modelo',async()=>{
  let calls=0;
  const store=createRedisStore({url:'https://redis.example',token:'fake',fetchImpl:async()=>({ok:false,status:500})});
  const ai=createAssistant({store,apiKey:'fake',fetchImpl:async()=>{calls++;}});
  await assert.rejects(ai.chat({message:'oi'},identity),hasStatus(503));
  assert.equal(calls,0);
});
