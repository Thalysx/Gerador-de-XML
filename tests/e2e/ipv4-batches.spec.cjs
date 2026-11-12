const { test, expect, openApp, openWorkspace, readDownload } = require('./fixtures.cjs');

test('E2E-10: IPv4 sai do catálogo e comandos legados exportam 500 valores únicos', async ({ page }) => {
  await openApp(page);
  await openWorkspace(page,'docs');
  await page.locator('#docs-search').fill('IPv4');
  await expect(page.locator('#docs-generator-list [data-generator-id="ipv4-documentacao"]')).toHaveCount(0);
  await expect(page.locator('#lote-tipo option[value="ipv4-documentacao"]')).toHaveCount(0);
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
  await openWorkspace(page,'chat');
  for (let batch = 0; batch < 2; batch++) {
    await page.locator('#chat-pedido').fill('500 IPv4s');
    await page.locator('#chat-enviar').click();
    const downloadEvent = page.waitForEvent('download');
    await page.locator('#chat-mensagens .chat-troca').last().getByRole('button', { name: 'JSON', exact: true }).click();
    check(JSON.parse(await readDownload(await downloadEvent)));
  }
});
