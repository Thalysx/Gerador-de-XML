const {createAssistant}=require('./ai.cjs');
const {createRedisStore,DEFAULT_LIMITS}=require('./session-store.cjs');
const {createHttpApi}=require('./http-api.cjs');
let handler;
function number(name,fallback) {const value=process.env[name];if(!value)return fallback;const n=Number(value);if(!Number.isSafeInteger(n)||n<1)throw Error('Invalid limit');return n;}
function runtime(req,res,route) {
  try {
    if(!handler) {
      const origins=(process.env.AI_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
      if(!origins.length)throw Error('Missing origin');
      const store=createRedisStore({limits:{
        minute:number('AI_VISITOR_MINUTE',DEFAULT_LIMITS.minute),visitorDay:number('AI_VISITOR_DAY',DEFAULT_LIMITS.visitorDay),
        ipDay:number('AI_IP_DAY',DEFAULT_LIMITS.ipDay),globalDay:number('AI_GLOBAL_DAY',DEFAULT_LIMITS.globalDay)
      }});
      const assistant=createAssistant({provider:process.env.AI_PROVIDER||'groq',store});
      handler=createHttpApi({assistant,secret:process.env.AI_COOKIE_SECRET,origins,production:true});
    }
    return handler(req,res,route);
  } catch {
    res.statusCode=503;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({configured:false,error:'A IA pública ainda não está configurada. Use os comandos locais.'}));
  }
}
module.exports={runtime};
