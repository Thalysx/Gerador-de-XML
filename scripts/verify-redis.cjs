// Opt-in integration check. Uses only a unique namespace and no model calls.
const fs=require('node:fs');
const {parseEnv}=require('node:util');
const {randomUUID}=require('node:crypto');
const assert=require('node:assert/strict');
const {createRedisStore}=require('./session-store.cjs');
async function main() {
  const env=process.argv[2]?parseEnv(fs.readFileSync(process.argv[2],'utf8')):process.env;
  const url=env.UPSTASH_REDIS_REST_URL?.trim(),token=env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if(!url||!token||new URL(url).protocol!=='https:')throw Error('Configure Redis REST antes de executar.');
  const prefix='gerador:verification:'+randomUUID();
  const touched=new Set();
  async function command(args) {
    if(args[0]==='EVAL')for(const key of args.slice(3,3+args[2])) {
      assert.ok(key.startsWith(prefix+':'));touched.add(key);
    }
    const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('Redis HTTP '+response.status);
    const data=await response.json();if(data.error)throw Error('Redis recusou o comando de teste.');return data.result;
  }
  const started=Date.now();
  const store=createRedisStore({command,prefix,now:()=>started,limits:{minute:2,visitorDay:3,ipDay:4,globalDay:5}});
  try {
    const identity={owner:'visitor',ip:'testip'};
    const results=await Promise.allSettled(Array.from({length:8},()=>store.begin(identity)));
    const admitted=results.filter(r=>r.status==='fulfilled').map(r=>r.value);
    assert.equal(admitted.length,2);
    assert.ok(results.filter(r=>r.status==='rejected').every(r=>r.reason.status===429));
    console.log('PASS: 8 reservas concorrentes admitem exatamente 2 pedidos.');
    const {session,lease}=admitted[0];
    const sessionKey=prefix+':session:'+session.id,lockKey=prefix+':lock:'+session.id;
    const ttl=await command(['TTL',sessionKey]);assert.ok(ttl>1700&&ttl<=1800);
    assert.ok(await command(['TTL',lockKey])>0);
    await assert.rejects(store.remove(session.id,'another'),e=>e.status===403);
    await assert.rejects(store.begin({...identity,sessionId:session.id}),e=>e.status===409);
    session.history=[{role:'user',content:'teste isolado'}];
    await store.finish(session,lease);
    const stored=JSON.parse(await command(['GET',sessionKey]));assert.equal(stored.history[0].content,'teste isolado');
    console.log('PASS: TTL de 30 minutos, bloqueio, isolamento e persistência.');
    const second=admitted[1];
    await command(['DEL',prefix+':lock:'+second.session.id]);
    await assert.rejects(store.finish(second.session,second.lease),e=>e.status===409);
    console.log('PASS: gravação com bloqueio perdido é recusada.');
    await command(['PEXPIRE',sessionKey,1]);
    // Read after server-side expiry; no production TTL is modified.
    await new Promise(resolve=>setTimeout(resolve,30));
    await assert.rejects(store.begin({...identity,sessionId:session.id}),e=>e.status===410);
    console.log('PASS: sessão expirada é recusada (TTL abreviado somente na chave de teste).');
    await store.remove(second.session.id,identity.owner);
    assert.equal(await command(['GET',prefix+':session:'+second.session.id]),null);
    await assert.rejects(store.begin(identity),e=>e.status===429);
    console.log('PASS: excluir sessão não apaga a cota.');
  } finally {
    if(touched.size)await command(['DEL',...touched]);
    console.log('Chaves exclusivas de teste removidas.');
  }
}
main().catch(error=>{console.error('Verificação falhou: '+error.message);process.exitCode=1;});
