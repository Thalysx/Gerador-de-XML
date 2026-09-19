const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tipos = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
const { createAssistant } = require('./ai.cjs');
const { createHttpApi } = require('./http-api.cjs');
const { randomBytes } = require('node:crypto');
function createServer(assistant = createAssistant()) {
let api;
const cookieSecret=process.env.AI_COOKIE_SECRET || randomBytes(32).toString('hex');
return http.createServer(async (req, res) => {
  const json = (status, value) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
  try {
    const port = req.socket.localPort;
    if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) return json(403,{error:'Host não permitido.'});
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/status' || pathname === '/api/chat') {
      api ||= createHttpApi({assistant,secret:cookieSecret,origins:[`http://127.0.0.1:${port}`,`http://localhost:${port}`]});
      return api(req,res,pathname.endsWith('status')?'status':'chat');
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
