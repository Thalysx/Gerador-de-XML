const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tipos = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
const { createAssistant } = require('./ai.cjs');
function createServer(assistant = createAssistant()) {
const rate = new Map();
return http.createServer(async (req, res) => {
  const json = (status, value) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
  try {
    const port = req.socket.localPort;
    if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) return json(403,{error:'Host não permitido.'});
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/status' && req.method === 'GET') return json(200,{configured:assistant.configured});
    if (pathname === '/api/chat' && req.method === 'POST') {
      if (req.headers.origin !== `http://${req.headers.host}` || !req.headers['content-type']?.startsWith('application/json')) return json(403,{error:'Origem ou tipo de conteúdo não permitido.'});
      const now=Date.now(), ip=req.socket.remoteAddress;
      const times=(rate.get(ip)||[]).filter(t=>now-t<60000);
      if (times.length >= 12) return json(429,{error:'Aguarde um minuto antes de enviar novos pedidos.'});
      times.push(now); rate.set(ip,times);
      let size=0; const chunks=[];
      for await (const chunk of req) { size+=chunk.length; if (size>120000) return json(413,{error:'Pedido muito grande.'}); chunks.push(chunk); }
      let body;
      try { body=JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return json(400,{error:'JSON inválido.'}); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400,{error:'Pedido inválido.'});
      try { return json(200,await assistant.chat(body)); } catch(e) { return json(e.status || 502,{error:e.message}); }
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(405,{error:'Método não permitido.'});
    if (pathname !== '/' && pathname !== '/index.html' && !/^\/assets\/[a-zA-Z0-9_./-]+\.(css|js)$/.test(pathname)) { res.writeHead(404).end(); return; }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || (pathname.startsWith('/assets/') && !file.startsWith(path.join(root,'assets') + path.sep)) || !tipos[path.extname(file)] || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', tipos[path.extname(file)]);
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(400).end(); }
});
}
if (require.main === module) {
  const envFile = path.join(root,'.env');
  if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
  createServer().listen(4173, '127.0.0.1', () => console.log('Projeto: http://127.0.0.1:4173'));
}
module.exports = { createServer };
