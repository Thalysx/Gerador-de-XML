const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');

async function createEngine() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'outside-only' });
  const w = dom.window;
  w.URL.createObjectURL = () => 'blob:server';
  w.URL.revokeObjectURL = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  // Only trusted project scripts execute. XML and model arguments are always data.
  for (const [, file] of html.matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), dom.getInternalVMContext(), { filename: file });
  }
  const init = w.onload;
  w.onload = null;
  await new Promise(resolve => w.document.readyState === 'complete' ? resolve() : w.addEventListener('load', resolve, { once: true }));
  init();
  const run = code => vm.runInContext(code, dom.getInternalVMContext());
  return {
    generate(args) {
      if (!Array.isArray(args.pedidos) || args.pedidos.length > 30) throw new Error('Pedidos inválidos.');
      return JSON.parse(JSON.stringify(w.gerarLoteDados(args.pedidos, { mascara: args.mascara !== false, uf: args.uf || '' })));
    },
    xml(args) {
      if (!['nfe', 'cte'].includes(args.tipo)) throw new Error('Tipo de XML inválido.');
      if (!Number.isInteger(args.itens) || args.itens < 1 || args.itens > 50) throw new Error('Use de 1 a 50 itens.');
      w.__quantidadeIa = args.itens;
      run('quantidadeItensXml = window.__quantidadeIa; processarXML(acao.regenerar); gerarXMLComCampos();');
      return run(args.tipo === 'nfe' ? 'serializarXml(xmlsGerados.nfe)' : 'serializarXml(xmlsGerados.cte)');
    },
    validate(xml) {
      const { texto, editavel, ...report } = w.analisarXml(xml);
      return JSON.parse(JSON.stringify(report));
    },
    close() { dom.window.close(); }
  };
}
module.exports = { createEngine };
