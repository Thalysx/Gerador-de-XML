const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

async function captureAuditedScreenshot({ evaluate, capture, file, expected }) {
  for (const key of ['panel', 'theme', 'environment']) {
    if (!expected?.[key]) throw new Error(`Expectativa de captura ausente: ${key}.`);
  }
  const actual = await evaluate(`(() => {
    const visible = el => {
      const style = getComputedStyle(el), rect = el.getBoundingClientRect();
      return !el.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const panelId = el => el.id.replace(/^tab-/, '');
    return {
      visiblePanels: [...document.querySelectorAll('.tab-panel')].filter(visible).map(panelId),
      activePanels: [...document.querySelectorAll('.tab-panel.active')].map(panelId),
      selectedPanels: [...document.querySelectorAll('.tab-btn[aria-selected="true"]')].map(el => el.getAttribute('aria-controls')?.replace(/^tab-/, '')),
      theme: document.body.classList.contains('dark') ? 'dark' : 'light',
      environment: document.body.dataset.environment,
      width: innerWidth, height: innerHeight, scale: devicePixelRatio,
      collapsed: document.body.classList.contains('sidebar-collapsed'),
      title: document.getElementById('app-title')?.textContent?.trim(),
      scrollX, scrollY
    };
  })()`);
  const mismatches = [];
  for (const key of ['visiblePanels', 'activePanels', 'selectedPanels']) {
    if (actual[key]?.length !== 1 || actual[key][0] !== expected.panel) mismatches.push(key);
  }
  for (const key of ['theme', 'environment', 'width', 'height', 'collapsed']) {
    if (Object.hasOwn(expected, key) && actual[key] !== expected[key]) mismatches.push(key);
  }
  if (mismatches.length) throw new Error(`Estado incorreto para ${path.basename(file)} (${mismatches.join(', ')}): esperado=${JSON.stringify(expected)} observado=${JSON.stringify(actual)}`);
  const screenshot = await capture();
  const bytes = Buffer.from(screenshot.data, 'base64');
  fs.writeFileSync(file, bytes);
  return { file: path.basename(file), expected, actual, sha256: createHash('sha256').update(bytes).digest('hex') };
}

module.exports = { captureAuditedScreenshot };
