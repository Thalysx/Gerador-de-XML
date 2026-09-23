const {createHmac,randomUUID,timingSafeEqual}=require('node:crypto');
const {isIP}=require('node:net');
const fail=(status,message)=>Object.assign(new Error(message),{status});
const COOKIE_DAYS=30;

function createHttpApi({assistant,secret,origins=[],production=false,now=Date.now}={}) {
  if(typeof secret!=='string'||secret.length<32) throw fail(503,'Identificação de visitantes não configurada.');
  const allowed=new Set(origins.map(origin=>new URL(origin).origin));
  const cookieName=production?'__Host-gerador-visitante':'gerador-visitante';
  const sign=value=>createHmac('sha256',secret).update(value).digest('base64url');
  function visitor(req,res,{create=true}={}) {
    const raw=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);
    let id;
    if(raw && raw.length<200) {
      const [uuid,expires,signature]=raw.split('.');
      if(/^[a-f0-9-]{36}$/.test(uuid||'') && /^\d{10,13}$/.test(expires||'') && Number(expires)>now() && signature) {
        const expected=Buffer.from(sign(uuid+'.'+expires));const actual=Buffer.from(signature);
        if(actual.length===expected.length&&timingSafeEqual(actual,expected)) id=uuid;
      }
    }
    if(!id) {
      if(!create) throw fail(401,'A identificação expirou. Inicie uma nova conversa.');
      id=randomUUID();const value=id+'.'+(now()+COOKIE_DAYS*86400000);
      res.setHeader('Set-Cookie',`${cookieName}=${value}.${sign(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${COOKIE_DAYS*86400}${production?'; Secure':''}`);
    }
    // Trust proxy headers only inside the Vercel deployment, never in local mode.
    const address=production ? req.headers['x-forwarded-for']?.split(',')[0].trim() : req.socket?.remoteAddress;
    if(!isIP(address||'')) throw fail(400,'Não foi possível identificar a origem do pedido.');
    return {owner:sign('visitor:'+id),ip:sign('ip:'+address)};
  }
  async function body(req) {
    let value=req.body;
    if(value===undefined) {
      const chunks=[];let size=0;
      for await(const chunk of req) { size+=Buffer.byteLength(chunk);if(size>120000)throw fail(413,'Pedido muito grande.');chunks.push(Buffer.from(chunk)); }
      value=Buffer.concat(chunks).toString('utf8');
    }
    if(Buffer.isBuffer(value)) value=value.toString('utf8');
    if(typeof value==='string') { if(Buffer.byteLength(value)>120000)throw fail(413,'Pedido muito grande.');try{value=JSON.parse(value);}catch{throw fail(400,'JSON inválido.');} }
    if(!value||typeof value!=='object'||Array.isArray(value))throw fail(400,'Pedido inválido.');
    if(Buffer.byteLength(JSON.stringify(value))>120000)throw fail(413,'Pedido muito grande.');
    if(value.sessionId!=null && (typeof value.sessionId!=='string'||!/^[a-f0-9-]{36}$/.test(value.sessionId)))throw fail(400,'Identificador de conversa inválido.');
    return value;
  }
  return async function handle(req,res,route) {
    const json=(status,value)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(JSON.stringify(value));};
    try {
      const origin=(production?'https://':'http://')+req.headers.host;
      if(!allowed.has(origin)) throw fail(403,'Host não permitido.');
      if(route==='status') {
        if(req.method!=='GET')throw fail(405,'Método não permitido.');
        visitor(req,res);
        return json(200,{configured:assistant.configured,provider:assistant.provider,retentionMinutes:30});
      }
      if(!['POST','DELETE'].includes(req.method))throw fail(405,'Método não permitido.');
      if(req.headers.origin!==origin || !req.headers['content-type']?.toLowerCase().startsWith('application/json'))throw fail(403,'Origem ou tipo de conteúdo não permitido.');
      const data=await body(req);
      const identity=visitor(req,res,{create:!data.sessionId});
      if(req.method==='DELETE') {
        if(!data.sessionId)throw fail(400,'Informe a conversa para apagar.');
        await assistant.clear(data.sessionId,identity.owner);
        return json(200,{cleared:true});
      }
      return json(200,await assistant.chat({message:data.message,xml:data.xml,sessionId:data.sessionId,mascara:data.mascara},identity));
    } catch(e) {
      const status=Number.isInteger(e.status)?e.status:502;
      if(status===429)res.setHeader('Retry-After','60');
      return json(status,{error:e.status?e.message:'Não foi possível concluir o pedido de IA. Tente novamente.'});
    }
  };
}
module.exports={createHttpApi};
