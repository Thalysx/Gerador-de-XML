const {MAX_XML_BYTES,validateFiscalXml}=require('./fiscal-xsd.cjs');

const BODY_LIMIT=MAX_XML_BYTES+64*1024;
let active=0;
const MAX_ACTIVE=2;
const TIMEOUT_MS=15000;

function readBody(req) {
  if(req.body!==undefined) {
    if(typeof req.body==='object'&&!Buffer.isBuffer(req.body))return Promise.resolve(req.body);
    const text=Buffer.isBuffer(req.body)?req.body.toString('utf8'):String(req.body);
    if(Buffer.byteLength(text)>BODY_LIMIT)throw Object.assign(new Error('Pedido muito grande.'),{status:413});
    try{return Promise.resolve(JSON.parse(text));}catch{throw Object.assign(new Error('JSON inválido.'),{status:400});}
  }
  return (async()=>{
    const chunks=[];let size=0;
    for await(const chunk of req) {
      size+=Buffer.byteLength(chunk);
      if(size>BODY_LIMIT)throw Object.assign(new Error('Pedido muito grande.'),{status:413});
      chunks.push(Buffer.from(chunk));
    }
    try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw Object.assign(new Error('JSON inválido.'),{status:400});}
  })();
}

function validateOrigin(req) {
  const host=String(req.headers.host||'').toLowerCase();
  const origin=String(req.headers.origin||'');
  if(!host||!origin)throw Object.assign(new Error('Origem não permitida.'),{status:403});
  let parsed;
  try{parsed=new URL(origin);}catch{throw Object.assign(new Error('Origem não permitida.'),{status:403});}
  if(parsed.host.toLowerCase()!==host||!['http:','https:'].includes(parsed.protocol))throw Object.assign(new Error('Origem não permitida.'),{status:403});
}

async function fiscalValidationRuntime(req,res) {
  const json=(status,value)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(JSON.stringify(value));};
  try {
    if(req.method!=='POST')throw Object.assign(new Error('Método não permitido.'),{status:405});
    if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))throw Object.assign(new Error('Tipo de conteúdo não permitido.'),{status:415});
    validateOrigin(req);
    if(active>=MAX_ACTIVE)throw Object.assign(new Error('Validador ocupado. Tente novamente.'),{status:429});
    const body=await readBody(req);
    if(!body||typeof body!=='object'||Array.isArray(body)||typeof body.xml!=='string')throw Object.assign(new Error('Pedido inválido.'),{status:400});
    active++;
    const operation=validateFiscalXml(body.xml);
    operation.finally(()=>{active--;}).catch(()=>{});
    let timer;
    const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(new Error('A validação XSD excedeu 15 segundos.'),{status:504})),TIMEOUT_MS);});
    let result;
    try{result=await Promise.race([operation,timeout]);}finally{clearTimeout(timer);}
    return json(200,result);
  } catch(error) {
    const status=Number.isInteger(error.status)?error.status:503;
    if(status===429)res.setHeader('Retry-After','5');
    return json(status,{error:error.status?error.message:'A validação XSD está indisponível.',codigo:error.code||'xsd-indisponivel'});
  }
}

module.exports={fiscalValidationRuntime,readBody,validateOrigin};
