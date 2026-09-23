const {randomUUID}=require('node:crypto');
const TTL=1800, LEASE=150;
const DEFAULT_LIMITS={minute:4,visitorDay:20,ipDay:60,globalDay:200};
const fail=(status,message)=>Object.assign(new Error(message),{status});
const codes={expired:[410,'A conversa expirou. Limpe a conversa para começar novamente.'],owner:[403,'Conversa indisponível para este visitante.'],busy:[409,'Aguarde a resposta anterior.'],turns:[429,'Limite de 20 pedidos por conversa. Limpe para iniciar outra.'],quota:[429,'Limite de uso atingido. Tente novamente mais tarde.'],lease:[409,'A operação expirou. Tente novamente.']};
function check(code) { if(codes[code]) throw fail(...codes[code]); }
function quotaKeys(prefix,owner,ip,now) {
  const day=Math.floor(now/86400000),minute=Math.floor(now/60000);
  return [`${prefix}:minute:${owner}:${minute}`,`${prefix}:day:${owner}:${day}`,`${prefix}:ip:${ip}:${day}`,`${prefix}:global:${day}`];
}
function validateIdentity(owner,ip) {
  if(!/^[a-zA-Z0-9_-]{1,128}$/.test(owner)||!/^[a-zA-Z0-9_-]{1,128}$/.test(ip)) throw fail(400,'Identidade inválida.');
}
function validateId(id) { if(id && !/^[a-f0-9-]{36}$/.test(id)) throw fail(400,'Identificador de conversa inválido.'); }
function bounded(session) { const value=JSON.stringify(session); if(Buffer.byteLength(value)>1000000) throw fail(413,'Conversa extensa. Limpe a conversa para continuar.'); return value; }

// Atomic admission: quotas, lease and session reservation succeed together.
const BEGIN=`
local raw=redis.call('GET',KEYS[1])
if ARGV[2]=='1' and not raw then return {'expired'} end
local s=raw and cjson.decode(raw) or cjson.decode(ARGV[3])
if s.owner~=ARGV[1] then return {'owner'} end
if redis.call('EXISTS',KEYS[2])==1 then return {'busy'} end
if s.turns>=20 then return {'turns'} end
for i=3,6 do if tonumber(redis.call('GET',KEYS[i]) or '0')>=tonumber(ARGV[i+4]) then return {'quota'} end end
for i=3,6 do local n=redis.call('INCR',KEYS[i]); if n==1 then redis.call('EXPIRE',KEYS[i],i==3 and 120 or 172800) end end
s.turns=s.turns+1
local value=cjson.encode(s)
redis.call('SET',KEYS[1],value,'EX',ARGV[5])
redis.call('SET',KEYS[2],ARGV[4],'EX',ARGV[6])
return {'ok',value}
`;
const FINISH=`
if redis.call('GET',KEYS[2])~=ARGV[1] then return 'lease' end
redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3])
redis.call('DEL',KEYS[2])
return 'ok'
`;
const RELEASE=`if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0`;
const REMOVE=`
local raw=redis.call('GET',KEYS[1])
if not raw then return 'ok' end
if cjson.decode(raw).owner~=ARGV[1] then return 'owner' end
if redis.call('EXISTS',KEYS[2])==1 then return 'busy' end
redis.call('DEL',KEYS[1])
return 'ok'
`;

function createRedisStore({url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN,fetchImpl=fetch,command,limits={},now=Date.now,prefix='gerador:ai:v1'}={}) {
  const caps={...DEFAULT_LIMITS,...limits};
  if(Object.values(caps).some(n=>!Number.isSafeInteger(n)||n<1)) throw Error('Limites de IA inválidos.');
  if(!command && (!url || !token || new URL(url).protocol!=='https:')) throw fail(503,'Armazenamento de IA não configurado.');
  const execute=command || (async args=>{
    try {
      const response=await fetchImpl(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(5000)});
      if(!response.ok) throw Error('storage');
      const data=await response.json();
      if(data.error || !Object.hasOwn(data,'result')) throw Error('storage');
      return data.result;
    } catch { throw fail(503,'Não foi possível verificar a cota da IA. Tente novamente mais tarde.'); }
  });
  const keys=id=>[`${prefix}:session:${id}`,`${prefix}:lock:${id}`];
  return {
    persistent:true,
    async begin({sessionId,owner,ip}) {
      validateId(sessionId); validateIdentity(owner,ip);
      const id=sessionId || randomUUID(), lease=randomUUID();
      const initial={id,owner,turns:0,history:[],artifacts:[],time:now()};
      const allKeys=[...keys(id),...quotaKeys(prefix,owner,ip,now())];
      const result=await execute(['EVAL',BEGIN,6,...allKeys,owner,sessionId?'1':'0',JSON.stringify(initial),lease,TTL,LEASE,caps.minute,caps.visitorDay,caps.ipDay,caps.globalDay]);
      if(!Array.isArray(result)) throw fail(503,'Resposta inválida do armazenamento.');
      check(result[0]);
      if(result[0]!=='ok') throw fail(503,'Resposta inválida do armazenamento.');
      const session=JSON.parse(result[1]);
      // Redis Lua cjson may encode an empty JSON array as an empty object.
      if(!Array.isArray(session.history)) session.history=[];
      if(!Array.isArray(session.artifacts)) session.artifacts=[];
      return {session,lease};
    },
    async finish(session,lease) { const result=await execute(['EVAL',FINISH,2,...keys(session.id),lease,bounded(session),TTL]); check(result); if(result!=='ok') throw fail(503,'Não foi possível salvar a conversa.'); },
    async release(id,lease) { await execute(['EVAL',RELEASE,1,keys(id)[1],lease]); },
    async remove(id,owner) { validateId(id); const result=await execute(['EVAL',REMOVE,2,...keys(id),owner]);check(result);if(result!=='ok')throw fail(503,'Não foi possível apagar a conversa.'); }
  };
}

// Local development only. Vercel must explicitly supply the Redis store.
function createMemoryStore({now=Date.now,limits={}}={}) {
  const sessions=new Map(),locks=new Map(),quotas=new Map(),caps={...DEFAULT_LIMITS,...limits};
  return {
    persistent:false,
    async begin({sessionId,owner,ip}) {
      validateId(sessionId); validateIdentity(owner,ip);
      for(const [id,s] of sessions) if(s.expires<=now()) sessions.delete(id);
      for(const [key,q] of quotas) if(q.expires<=now()) quotas.delete(key);
      for(const [id,lock] of locks) if(lock.expires<=now()) locks.delete(id);
      let s=sessionId?sessions.get(sessionId):null;
      if(sessionId&&!s) check('expired');
      if(s&&s.owner!==owner) check('owner');
      if(s&&locks.has(s.id)) check('busy');
      if(s&&s.turns>=20) check('turns');
      const qkeys=quotaKeys('memory',owner,ip,now()),values=Object.values(caps);
      if(qkeys.some((k,i)=>(quotas.get(k)?.count||0)>=values[i])) check('quota');
      if(!s && sessions.size>=200) throw fail(429,'Limite de conversas atingido.');
      qkeys.forEach((k,i)=>quotas.set(k,{count:(quotas.get(k)?.count||0)+1,expires:now()+(i===0?120000:172800000)}));
      s ||= {id:randomUUID(),owner,turns:0,history:[],artifacts:[],time:now()};
      s.turns++;s.expires=now()+TTL*1000;sessions.set(s.id,s);
      const lease=randomUUID();locks.set(s.id,{lease,expires:now()+LEASE*1000});
      return {session:structuredClone(s),lease};
    },
    async finish(s,lease) { bounded(s);const lock=locks.get(s.id);if(!lock||lock.lease!==lease||lock.expires<=now())check('lease');sessions.set(s.id,{...structuredClone(s),expires:now()+TTL*1000});locks.delete(s.id); },
    async release(id,lease) { if(locks.get(id)?.lease===lease)locks.delete(id); },
    async remove(id,owner) { const s=sessions.get(id);if(s&&s.owner!==owner)check('owner');if(locks.get(id)?.expires>now())check('busy');sessions.delete(id); }
  };
}
module.exports={createRedisStore,createMemoryStore,DEFAULT_LIMITS,BEGIN,FINISH,RELEASE,REMOVE};
