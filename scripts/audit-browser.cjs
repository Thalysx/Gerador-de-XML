const { spawn, spawnSync } = require('node:child_process');
const { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } = require('node:fs');
const http = require('node:http');
const { tmpdir } = require('node:os');
const path = require('node:path');
const WebSocket = require('ws');

const RAIZ = path.resolve(__dirname, '..');
const SAIDA = path.join(RAIZ, 'artifacts', 'visual-review');
const navegadores = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);

const dormir = ms => new Promise(resolve => setTimeout(resolve, ms));

async function criarServidorAuditoria() {
  const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json; charset=utf-8' };
  const html = readFileSync(path.join(RAIZ, 'index.html'), 'utf8')
    .replace(/\s*<link[^>]+href="https:\/\/[^>]+>/g, '')
    .replace(/\s*<script[^>]+src="https:\/\/[^>]+><\/script>/g, '');
  if (process.env.AUDIT_DEBUG) console.error(`[auditoria] HTML: ${(html.match(/https:\/\//g) || []).length} URLs externas; ${(html.match(/<script[^>]*>/g) || []).length} scripts`);
  const servidor = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (process.env.AUDIT_DEBUG) console.error(`[auditoria] HTTP ${pathname}`);
    if (pathname === '/' || pathname === '/index.html') {
      const corpo = Buffer.from(html);
      res.writeHead(200, { 'Content-Type': tipos['.html'], 'Content-Length': corpo.length, 'Cache-Control': 'no-store', Connection: 'close' });
      res.end(corpo);
      return;
    }
    if (pathname === '/site.webmanifest') {
      const corpo = readFileSync(path.join(RAIZ, 'site.webmanifest'));
      res.writeHead(200, { 'Content-Type': tipos['.webmanifest'], 'Content-Length': corpo.length, 'Cache-Control': 'no-store', Connection: 'close' });
      res.end(corpo);
      return;
    }
    if (!/^\/assets\/[a-zA-Z0-9_./-]+\.(css|js|svg|png)$/.test(pathname)) { res.writeHead(404).end(); return; }
    const arquivo = path.resolve(RAIZ, `.${pathname}`);
    if (!arquivo.startsWith(path.join(RAIZ, 'assets') + path.sep) || !existsSync(arquivo)) { res.writeHead(404).end(); return; }
    const corpo = readFileSync(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)], 'Content-Length': corpo.length, 'Cache-Control': 'no-store', Connection: 'close' });
    res.end(corpo);
  });
  await new Promise((resolve, reject) => {
    servidor.once('error', reject);
    servidor.listen(0, '127.0.0.1', resolve);
  });
  const endereco = servidor.address();
  return { servidor, url: `http://127.0.0.1:${endereco.port}/` };
}

async function esperarArquivo(arquivo, tentativas = 80) {
  for (let i = 0; i < tentativas; i += 1) {
    if (existsSync(arquivo)) return;
    await dormir(100);
  }
  throw new Error(`Chrome não publicou ${arquivo}.`);
}

function criarClienteCdp(url) {
  const socket = new WebSocket(url);
  let id = 0;
  const pendentes = new Map();
  socket.on('message', async entrada => {
    try {
      let bruto = entrada;
      if (typeof bruto !== 'string' && bruto && typeof bruto.text === 'function') bruto = await bruto.text();
      else if (bruto instanceof ArrayBuffer) bruto = Buffer.from(bruto).toString('utf8');
      else if (ArrayBuffer.isView(bruto)) bruto = Buffer.from(bruto.buffer, bruto.byteOffset, bruto.byteLength).toString('utf8');
      const mensagem = JSON.parse(bruto);
      if (!mensagem.id || !pendentes.has(mensagem.id)) return;
      const { resolve, reject } = pendentes.get(mensagem.id);
      pendentes.delete(mensagem.id);
      if (mensagem.error) reject(new Error(`${mensagem.error.message}${mensagem.error.data ? `: ${mensagem.error.data}` : ''}`));
      else resolve(mensagem.result);
    } catch (error) {
      for (const { reject } of pendentes.values()) reject(error);
      pendentes.clear();
    }
  });
  socket.on('close', () => {
    for (const { reject } of pendentes.values()) reject(new Error('A conexão CDP foi encerrada antes da resposta.'));
    pendentes.clear();
  });
  const pronto = new Promise((resolve, reject) => {
    socket.once('open', resolve);
    socket.once('error', reject);
  });
  return {
    async enviar(method, params = {}) {
      await pronto;
      const atual = ++id;
      const resposta = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pendentes.delete(atual);
          reject(new Error(`Tempo esgotado ao executar ${method}.`));
        }, 15000);
        pendentes.set(atual, {
          resolve(value) { clearTimeout(timer); resolve(value); },
          reject(error) { clearTimeout(timer); reject(error); }
        });
      });
      socket.send(JSON.stringify({ id: atual, method, params }));
      return resposta;
    },
    fechar() { socket.close(); }
  };
}

async function avaliar(cdp, expression) {
  const resposta = await cdp.enviar('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true
  });
  if (resposta.exceptionDetails) throw new Error(resposta.exceptionDetails.text || 'Falha ao avaliar a página.');
  return resposta.result.value;
}

async function esperarPagina(cdp) {
  let ultimoEstado;
  for (let i = 0; i < 80; i += 1) {
    const estado = await avaliar(cdp, `({
      readyState: document.readyState,
      pronta: typeof switchTab === 'function' && document.querySelectorAll('.tab-panel').length === 6
    })`);
    ultimoEstado = estado;
    if (estado?.pronta) {
      await dormir(600);
      return;
    }
    await dormir(100);
  }
  const diagnostico = await avaliar(cdp, `({
    estado: document.readyState,
    url: location.href,
    titulo: document.title,
    paineis: document.querySelectorAll('.tab-panel').length,
    scripts: document.scripts.length,
    primeiroScript: document.scripts[0]?.src,
    estilos: document.styleSheets.length,
    recursosPendentes: performance.getEntriesByType('resource').filter(r => !r.responseEnd).map(r => r.name),
    switchTab: typeof switchTab
  })`);
  throw new Error(`A página não concluiu o carregamento (${JSON.stringify(diagnostico || ultimoEstado)}).`);
}

async function main() {
  const executavel = navegadores.find(existsSync);
  if (!executavel) throw new Error('Chrome ou Edge não foi encontrado.');
  const local = await criarServidorAuditoria();
  const urlAlvo = local.url;
  const perfil = mkdtempSync(path.join(tmpdir(), 'gerador-audit-'));
  const arquivoPorta = path.join(perfil, 'DevToolsActivePort');
  const navegador = spawn(executavel, [
    '--headless=new',
    // A instância abre somente o servidor efêmero criado acima. O ambiente Windows
    // de teste bloqueia o processo gráfico do Chrome quando a sandbox está ativa.
    '--no-sandbox',
    '--disable-gpu',
    '--disable-features=SkiaGraphite,WebGPU,Vulkan',
    '--use-angle=swiftshader',
    '--disable-gpu-shader-disk-cache',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--remote-debugging-port=0',
    '--remote-allow-origins=*',
    `--user-data-dir=${perfil}`,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  let errosNavegador = '';
  navegador.stderr.on('data', trecho => { errosNavegador += trecho.toString(); });

  let cdp;
  try {
    console.error('[auditoria] iniciando navegador');
    await esperarArquivo(arquivoPorta);
    const [porta] = readFileSync(arquivoPorta, 'utf8').trim().split(/\r?\n/);
    const alvos = await fetch(`http://127.0.0.1:${porta}/json/list`).then(r => r.json());
    const pagina = alvos.find(alvo => alvo.type === 'page');
    if (!pagina) throw new Error('O Chrome não publicou uma página para auditoria.');
    console.error(`[auditoria] alvo ${pagina.type} ${pagina.webSocketDebuggerUrl}`);
    cdp = criarClienteCdp(pagina.webSocketDebuggerUrl);
    console.error('[auditoria] conectando ao CDP');
    await cdp.enviar('Page.enable');
    await cdp.enviar('Runtime.enable');
    await cdp.enviar('Network.enable');
    await cdp.enviar('Accessibility.enable');
    await cdp.enviar('Network.setBlockedURLs', { urls: [
      'https://cdn.jsdelivr.net/*',
      'https://fonts.googleapis.com/*',
      'https://fonts.gstatic.com/*',
      '*://gc.kis.v2.scr.kaspersky-labs.com/*'
    ] });

    // Uma janela física de 1280 px com escala 2 representa 200%: 640 px CSS disponíveis.
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: 640,
      height: 450,
      deviceScaleFactor: 2,
      mobile: false,
      screenWidth: 1280,
      screenHeight: 900
    });
    await cdp.enviar('Page.navigate', { url: urlAlvo });
    await esperarPagina(cdp);
    console.error('[auditoria] página carregada');

    const paineis = await avaliar(cdp, `(async () => {
      const ids = ['xml','docs','cadastro','editor','validacao','chat'];
      const resultados = [];
      const nome = el => el.getAttribute('aria-label') || el.innerText?.trim().replace(/\\s+/g,' ').slice(0,100) || el.id || el.tagName;
      for (const id of ids) {
        const botao = document.getElementById('tab-btn-' + id);
        if (typeof switchTab === 'function') switchTab(id, botao);
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const visiveis = [...document.querySelectorAll('body *')].filter(el => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 1 && r.height > 1;
        });
        const excedentes = visiveis.filter(el => {
          const r = el.getBoundingClientRect();
          return r.left < -1 || r.right > innerWidth + 1;
        }).map(el => ({ elemento: nome(el), esquerda: Math.round(el.getBoundingClientRect().left), direita: Math.round(el.getBoundingClientRect().right) })).slice(0,10);
        resultados.push({
          painel: id,
          larguraViewport: innerWidth,
          larguraDocumento: document.documentElement.scrollWidth,
          rolagemHorizontal: document.documentElement.scrollWidth > innerWidth + 1,
          elementosExcedentes: excedentes
        });
      }
      switchTab('xml', document.getElementById('tab-btn-xml'));
      document.documentElement.scrollTop = 0;
      return resultados;
    })()`);
    console.error('[auditoria] seis painéis medidos');

    const acessibilidade = [];
    for (const painel of ['xml','docs','cadastro','editor','validacao','chat']) {
      await avaliar(cdp, `(() => {
        switchTab(${JSON.stringify(painel)}, document.getElementById('tab-btn-' + ${JSON.stringify(painel)}));
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      })()`);
      const arvore = await cdp.enviar('Accessibility.getFullAXTree');
      const ativos = (arvore.nodes || []).filter(item => !item.ignored);
      const valorPropriedade = (item, nome) => item.properties?.find(propriedade => propriedade.name === nome)?.value?.value;
      const focaveis = ativos.filter(item => valorPropriedade(item, 'focusable') === true);
      const semNome = focaveis.filter(item => !String(item.name?.value || '').trim()).map(item => ({
        funcao: item.role?.value || '',
        html: item.backendDOMNodeId || null
      }));
      const marcosSemNome = ativos.filter(item => ['navigation', 'tablist'].includes(item.role?.value) && !String(item.name?.value || '').trim()).map(item => item.role?.value);
      acessibilidade.push({
        painel,
        nosExpostos: ativos.length,
        controlesFocaveis: focaveis.length,
        controlesSemNome: semNome,
        marcosSemNome
      });
    }
    console.error('[auditoria] árvore de acessibilidade conferida nas seis telas');

    const percursos = [];
    for (const painel of ['xml','docs','cadastro','editor','validacao','chat']) {
      await avaliar(cdp, `(() => {
        switchTab(${JSON.stringify(painel)}, document.getElementById('tab-btn-' + ${JSON.stringify(painel)}));
        const ativo = document.activeElement;
        if (ativo && ativo !== document.body) ativo.blur();
        document.body.setAttribute('tabindex','-1');
        document.body.focus();
        document.documentElement.scrollTop = 0;
        return true;
      })()`);
      const itens = [];
      let primeiraAssinatura = '';
      for (let i = 0; i < 160; i += 1) {
        await cdp.enviar('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        await cdp.enviar('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        const foco = await avaliar(cdp, `(() => {
          const el = document.activeElement;
          const label = el.getAttribute('aria-label') || document.querySelector('label[for="' + CSS.escape(el.id || '') + '"]')?.innerText?.trim() || el.innerText?.trim().replace(/\\s+/g,' ').slice(0,100) || el.id || el.tagName;
          const s = getComputedStyle(el);
          return { tag: el.tagName, id: el.id, nome: label, visivel: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length), contorno: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 };
        })()`);
        if (foco.tag === 'BODY' && itens.length) break;
        const assinatura = `${foco.tag}|${foco.id}|${foco.nome}`;
        if (!primeiraAssinatura) primeiraAssinatura = assinatura;
        else if (assinatura === primeiraAssinatura) break;
        itens.push(foco);
      }
      percursos.push({ painel, itens });
    }
    console.error('[auditoria] percurso de teclado concluído nas seis telas');

    await cdp.enviar('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const movimento = await avaliar(cdp, `(() => {
      const amostras = [...document.querySelectorAll('button, .painel-novo, .tab-panel')].slice(0,30);
      return amostras.every(el => {
        const s = getComputedStyle(el);
        return s.animationDuration === '0s' || parseFloat(s.animationDuration) <= 0.001;
      });
    })()`);

    mkdirSync(SAIDA, { recursive: true });
    await avaliar(cdp, `(() => {
      switchTab('xml', document.getElementById('tab-btn-xml'));
      const alvo = document.getElementById('lock-btn');
      alvo.focus();
      alvo.scrollIntoView({ block: 'center' });
      return true;
    })()`);
    const captura = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    console.error('[auditoria] captura concluída');
    writeFileSync(path.join(SAIDA, '200-percent.png'), Buffer.from(captura.data, 'base64'));

    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: 1440,
      screenHeight: 900
    });
    const marca = await avaliar(cdp, `(() => {
      switchTab('xml', document.getElementById('tab-btn-xml'));
      document.documentElement.scrollTop = 0;
      if (!document.body.classList.contains('dark')) toggleTheme();
      const imagem = document.querySelector('.workspace-brand img');
      return {
        nome: document.querySelector('.workspace-brand strong')?.textContent?.trim(),
        assinatura: document.querySelector('.workspace-brand small')?.textContent?.trim(),
        imagemCarregada: Boolean(imagem?.complete && imagem.naturalWidth > 0),
        imagemVisivel: Boolean(imagem && getComputedStyle(imagem).display !== 'none' && imagem.getBoundingClientRect().width > 0),
        favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
        titulo: document.title
      };
    })()`);
    await dormir(100);
    const capturaMarcaEscura = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(path.join(SAIDA, 'thegenerator-desktop-dark.png'), Buffer.from(capturaMarcaEscura.data, 'base64'));
    await avaliar(cdp, `(() => {
      switchTab('docs', document.getElementById('tab-btn-docs'));
      document.documentElement.scrollTop = 0;
      return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    })()`);
    await dormir(150);
    await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await dormir(50);
    const capturaDocsMinimalista = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(path.join(SAIDA, 'thegenerator-docs-minimal-dark.png'), Buffer.from(capturaDocsMinimalista.data, 'base64'));
    await avaliar(cdp, `switchTab('xml', document.getElementById('tab-btn-xml'))`);
    await avaliar(cdp, `toggleTheme()`);
    await dormir(500);
    await avaliar(cdp, `new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))))`);
    // A primeira leitura força a atualização das camadas após a troca de tema no Chrome headless.
    await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await dormir(100);
    const capturaMarcaClara = await cdp.enviar('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(path.join(SAIDA, 'thegenerator-desktop-light.png'), Buffer.from(capturaMarcaClara.data, 'base64'));
    console.error('[auditoria] identidade capturada nos dois temas');

    const controlesPercorridos = percursos.flatMap(item => item.itens).filter(item => item.tag !== 'BODY');
    const nomesVazios = controlesPercorridos.filter(item => !item.nome).length;
    const focosInvisiveis = controlesPercorridos.filter(item => !item.visivel).length;
    const focosSemContorno = controlesPercorridos.filter(item => !item.contorno).length;
    const resultado = {
      url: urlAlvo,
      navegador: path.basename(executavel),
      simulacao: '1280 x 900 pixels físicos, escala 2, viewport CSS 640 x 450',
      paineis,
      teclado: {
        passos: controlesPercorridos.length,
        porPainel: percursos.map(({ painel, itens }) => ({ painel, passos: itens.length })),
        nomesVazios,
        focosInvisiveis,
        focosSemContorno,
        semContorno: controlesPercorridos.filter(item => !item.contorno),
        primeiros: percursos[0].itens.slice(0,12)
      },
      acessibilidade,
      marca,
      movimentoReduzidoAplicado: movimento,
      aprovado: paineis.every(item => !item.rolagemHorizontal && item.elementosExcedentes.length === 0) && acessibilidade.every(item => item.controlesSemNome.length === 0 && item.marcosSemNome.length === 0) && nomesVazios === 0 && focosInvisiveis === 0 && focosSemContorno === 0 && movimento && marca.nome === 'TheGenerator' && marca.assinatura === 'Dados de teste. Do seu jeito.' && marca.imagemCarregada && marca.imagemVisivel && marca.favicon === 'assets/brand/favicon.svg'
    };
    writeFileSync(path.join(SAIDA, 'auditoria-200.json'), JSON.stringify(resultado, null, 2));
    console.log(JSON.stringify(resultado, null, 2));
    if (!resultado.aprovado) process.exitCode = 1;
  } catch (error) {
    if (errosNavegador.trim()) error.message += `\nChrome: ${errosNavegador.trim().slice(-2000)}`;
    throw error;
  } finally {
    if (cdp) cdp.fechar();
    if (process.platform === 'win32' && navegador.pid) {
      spawnSync('taskkill', ['/PID', String(navegador.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    } else navegador.kill();
    navegador.stderr.destroy();
    navegador.unref();
    await new Promise(resolve => local.servidor.close(resolve));
    await dormir(300);
    try { rmSync(perfil, { recursive: true, force: true, maxRetries: 4, retryDelay: 150 }); } catch {}
  }
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

