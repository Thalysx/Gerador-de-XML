const { spawn, spawnSync } = require('node:child_process');
const { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const WebSocket = require('ws');

const raiz = path.resolve(__dirname, '..');
const pastaMarca = path.join(raiz, 'assets', 'brand');
const navegadores = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);
const exportacoes = [
  ['thegenerator-logo-light.svg', 'thegenerator-logo-light.png', 792, 176, '#FFFFFF'],
  ['thegenerator-logo-dark.svg', 'thegenerator-logo-dark.png', 792, 176, '#09080C'],
  ['thegenerator-logo-mono-black.svg', 'thegenerator-logo-mono-black.png', 792, 144, '#FFFFFF'],
  ['thegenerator-logo-mono-white.svg', 'thegenerator-logo-mono-white.png', 792, 144, '#09080C'],
  ['thegenerator-mark.svg', 'thegenerator-mark.png', 512, 512, 'transparent'],
  ['favicon.svg', 'favicon-192.png', 192, 192, 'transparent'],
  ['favicon.svg', 'favicon-512.png', 512, 512, 'transparent']
];

const dormir = ms => new Promise(resolve => setTimeout(resolve, ms));

async function esperarArquivo(arquivo) {
  for (let i = 0; i < 100; i += 1) {
    if (existsSync(arquivo)) return;
    await dormir(100);
  }
  throw new Error('O navegador não publicou a porta de depuração.');
}

function conectar(url) {
  const socket = new WebSocket(url);
  let id = 0;
  const pendentes = new Map();
  const pronto = new Promise((resolve, reject) => {
    socket.once('open', resolve);
    socket.once('error', reject);
  });
  socket.on('message', entrada => {
    const mensagem = JSON.parse(Buffer.from(entrada).toString('utf8'));
    if (!mensagem.id || !pendentes.has(mensagem.id)) return;
    const item = pendentes.get(mensagem.id);
    pendentes.delete(mensagem.id);
    mensagem.error ? item.reject(new Error(mensagem.error.message)) : item.resolve(mensagem.result);
  });
  return {
    async enviar(method, params = {}) {
      await pronto;
      const atual = ++id;
      const resposta = new Promise((resolve, reject) => pendentes.set(atual, { resolve, reject }));
      socket.send(JSON.stringify({ id: atual, method, params }));
      return resposta;
    },
    fechar() { socket.close(); }
  };
}

async function main() {
  const executavel = navegadores.find(existsSync);
  if (!executavel) throw new Error('Chrome ou Edge não foi encontrado.');
  const perfil = mkdtempSync(path.join(tmpdir(), 'thegenerator-brand-'));
  const portaArquivo = path.join(perfil, 'DevToolsActivePort');
  const navegador = spawn(executavel, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
    '--remote-debugging-port=0', '--remote-allow-origins=*',
    `--user-data-dir=${perfil}`, 'about:blank'
  ], { stdio: 'ignore', windowsHide: true });
  let cdp;
  try {
    await esperarArquivo(portaArquivo);
    const [porta] = readFileSync(portaArquivo, 'utf8').trim().split(/\r?\n/);
    const alvos = await fetch(`http://127.0.0.1:${porta}/json/list`).then(resposta => resposta.json());
    cdp = conectar(alvos.find(alvo => alvo.type === 'page').webSocketDebuggerUrl);
    await cdp.enviar('Page.enable');
    for (const [origem, destino, largura, altura, fundo] of exportacoes) {
      const svg = readFileSync(path.join(pastaMarca, origem), 'utf8');
      const html = `<!doctype html><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:${fundo}}svg{display:block;width:100%;height:100%}</style>${svg}`;
      await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: false });
      await cdp.enviar('Emulation.setDefaultBackgroundColorOverride', { color: fundo === 'transparent' ? { r: 0, g: 0, b: 0, a: 0 } : undefined });
      await cdp.enviar('Page.navigate', { url: `data:text/html;base64,${Buffer.from(html).toString('base64')}` });
      await dormir(120);
      const captura = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
      writeFileSync(path.join(pastaMarca, destino), Buffer.from(captura.data, 'base64'));
      console.log(`${destino}: ${largura}x${altura}`);
    }
  } finally {
    if (cdp) cdp.fechar();
    if (process.platform === 'win32' && navegador.pid) spawnSync('taskkill', ['/PID', String(navegador.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    else navegador.kill();
    try { rmSync(perfil, { recursive: true, force: true, maxRetries: 4, retryDelay: 150 }); } catch {}
  }
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
