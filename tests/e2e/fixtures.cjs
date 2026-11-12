const { test: base, expect } = require('@playwright/test');

async function isolateNetwork(context, baseURL, unexpected) {
  const origin = new URL(baseURL).origin;
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin || !['http:', 'https:'].includes(url.protocol)) return route.continue();
    // The existing offline auditor also omits optional Bootstrap and web fonts.
    // Fulfil only these known assets with an empty resource, avoiding noisy aborts.
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' ||
        (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/bootstrap@5.3.3/'))) {
      return route.fulfill({ status: 200, contentType: url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css', body: '' });
    }
    unexpected.push(url.origin + url.pathname);
    return route.abort('blockedbyclient');
  });
}

const test = base.extend({
  runtimeChecks: [async ({ context, page, baseURL }, use, testInfo) => {
    const errors = [], unexpected = [];
    await isolateNetwork(context, baseURL, unexpected);
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await use();
    if (errors.length || unexpected.length) await testInfo.attach('runtime-diagnostics', {
      body: JSON.stringify({ errors, unexpected }, null, 2), contentType: 'application/json'
    });
    expect(errors, 'Console/JavaScript da aplicação').toEqual([]);
    expect(unexpected, 'Pedidos externos inesperados').toEqual([]);
  }, { auto: true }]
});

async function openApp(page) {
  await page.goto('/');
  // These values are populated by the actual onload initialization, not a stub.
  await expect(page.locator('#nfe_chave')).toHaveValue(/^\d{44}$/);
  await expect(page.locator('#app-title')).toHaveText('Início');
}

async function openDetails(page, selector) {
  const details = page.locator(selector);
  if (await details.getAttribute('open') === null) await details.locator(':scope > summary').click();
  await expect(details).toHaveAttribute('open', '');
}

async function openWorkspace(page, workspace) {
  const target=page.locator('#tab-btn-'+workspace);
  if(!await target.isVisible())await page.locator('#sidebar-collapse-btn').click();
  await target.click();
  await expect(page.locator('#tab-'+workspace)).toBeVisible();
}

async function readDownload(download) {
  expect(await download.failure()).toBeNull();
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

module.exports = { test, expect, openApp, openDetails, openWorkspace, readDownload, isolateNetwork };
