const { test, expect, openApp, readDownload } = require('./fixtures.cjs');

test('E2E-10: lotes IPv4 consecutivos e comandos exportam 500 valores únicos', async ({ page }) => {
  await openApp(page);
  await page.locator('#tab-btn-docs').click();
  await page.locator('#docs-search').fill('IPv4');
  await page.locator('#docs-generator-list [data-generator-id="ipv4-documentacao"]').click();
  const individual = await page.locator('#output-val').innerText();
  await page.locator('#lote-title').click();
  await page.locator('#lote-tipo').selectOption('ipv4-documentacao');
  await page.locator('#lote-quantidade').fill('500');
  let previous;
  const check = records => {
    expect(records).toHaveLength(500);
    expect(new Set(records.map(record => record.valor)).size).toBe(500);
    for (const record of records) {
      expect(record.tipo).toBe('ipv4-documentacao');
      expect(record.valor).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.(?:[1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-4])$/);
    }
    if (previous) expect(new Set(previous.map(record => record.valor)).has(records[0].valor)).toBe(false);
    previous = records;
  };
  for (let batch = 0; batch < 2; batch++) {
    await page.locator('.lote-form button[type="submit"]').click();
    await expect(page.locator('#lote-status')).toContainText('500 registros gerados, sem repetições neste lote.');
    const downloadEvent = page.waitForEvent('download');
    await page.locator('#lote-exportacao').getByRole('button', { name: 'Baixar JSON', exact: true }).click();
    check(JSON.parse(await readDownload(await downloadEvent)));
    await expect(page.locator('#output-val')).toHaveText(individual);
  }
  await page.locator('#tab-btn-chat').click();
  await page.locator('#chat-pedido').fill('500 IPv4s');
  await page.locator('#chat-enviar').click();
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#chat-mensagens .chat-troca').last().getByRole('button', { name: 'JSON', exact: true }).click();
  check(JSON.parse(await readDownload(await downloadEvent)));
});
