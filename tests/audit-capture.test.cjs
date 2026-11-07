const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { captureAuditedScreenshot } = require('../scripts/audit-capture.cjs');

const expected = { panel: 'home', theme: 'dark', environment: 'unified', width: 1440, height: 900, collapsed: true };
const correct = { visiblePanels: ['home'], activePanels: ['home'], selectedPanels: ['home'], theme: 'dark', environment: 'unified', width: 1440, height: 900, collapsed: true, scale: 1, title: 'Início', scrollX: 0, scrollY: 0 };

test('guarda da captura recusa painel anterior, ambiguidade, aba, tema, catálogo e geometria sem capturar ou gravar', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'future-g-capture-reject-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'home-dark.png');
  let captures = 0;
  for (const wrong of [
    { visiblePanels: ['docs'], activePanels: ['docs'], selectedPanels: ['docs'] },
    { visiblePanels: ['home', 'docs'] }, { visiblePanels: [] },
    { activePanels: ['docs'] }, { selectedPanels: ['docs'] }, { selectedPanels: ['home', 'docs'] },
    { theme: 'light' }, { environment: 'port' }, { width: 390 }, { height: 800 }, { collapsed: false }
  ]) {
    await assert.rejects(captureAuditedScreenshot({
      evaluate: async () => ({ ...correct, ...wrong }),
      capture: async () => { captures++; return { data: '' }; }, file, expected
    }), /Estado incorreto para home-dark.png/);
    assert.equal(captures, 0);
    assert.equal(fs.existsSync(file), false);
  }
  fs.writeFileSync(file, 'evidência anterior');
  await assert.rejects(captureAuditedScreenshot({ evaluate: async () => ({ ...correct, theme: 'light' }), capture: async () => { captures++; }, file, expected }));
  assert.equal(fs.readFileSync(file, 'utf8'), 'evidência anterior');
  assert.equal(captures, 0);
});

test('captura válida registra o estado conferido e hash dos bytes gravados', async t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'future-g-capture-ok-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'home-dark.png');
  const bytes = Buffer.from('imagem sintética do adaptador');
  const order = [];
  const result = await captureAuditedScreenshot({
    evaluate: async () => { order.push('state'); return correct; },
    capture: async () => { order.push('image'); return { data: bytes.toString('base64') }; }, file, expected
  });
  assert.deepEqual(order, ['state', 'image']);
  assert.deepEqual(fs.readFileSync(file), bytes);
  assert.deepEqual(result.actual, correct);
  assert.deepEqual(result.expected, expected);
  assert.equal(result.file, 'home-dark.png');
  assert.equal(result.sha256, createHash('sha256').update(bytes).digest('hex'));
});

test('captura exige expectativa declarada de painel, tema e catálogo', async () => {
  for (const key of ['panel', 'theme', 'environment']) {
    const incomplete = { ...expected }; delete incomplete[key];
    await assert.rejects(captureAuditedScreenshot({ expected: incomplete, evaluate: () => assert.fail('Não deve ler estado sem expectativa') }), /Expectativa de captura ausente/);
  }
});
