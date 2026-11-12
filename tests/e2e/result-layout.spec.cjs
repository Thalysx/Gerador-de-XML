const { test, expect, openApp, openWorkspace, openDetails, readDownload } = require('./fixtures.cjs');

test('validação oferece editor amplo e teste negativo em cartão próprio', async ({ page }, testInfo) => {
  await openApp(page);
  await openWorkspace(page, 'validacao');
  const editor = page.locator('#validacao-texto');
  const form = page.locator('.validacao-texto-form');
  const button = form.getByRole('button', { name: 'Validar conteúdo', exact: true });
  const editorBox = await editor.boundingBox();
  const formBox = await form.boundingBox();
  const buttonBox = await button.boundingBox();
  expect(editorBox.width).toBeCloseTo(formBox.width, 0);
  expect(editorBox.height).toBeGreaterThanOrEqual(320);
  expect(buttonBox.y).toBeGreaterThanOrEqual(editorBox.y + editorBox.height);
  await expect(page.locator('#validacao-upload-status')).toContainText('5 MB');
  await expect(page.locator('#validacao-upload-help')).toContainText('4 MiB');
  expect(await page.locator('.validacao-dropzone-inner').evaluate(button => button.scrollWidth <= button.clientWidth)).toBe(true);
  await expect(page.locator('.validacao-entrada .validacao-negativa')).toHaveCount(0);
  await expect(page.locator('.validacao-inputs > .validacao-negativa')).toBeVisible();
  await editor.fill('<teste/>');
  await button.click();
  await expect(page.locator('#validacao-resultados')).toContainText('XML colado');
  await expect(editor).toHaveValue('<teste/>');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await editor.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('validacao-layout.png'), fullPage: true });
});

test('downloads alinham duas opções ao botão e reservam espaço acima dos cenários', async ({ page }, testInfo) => {
  await openApp(page);
  await openWorkspace(page, 'xml');
  await openDetails(page, '.xml-downloads');
  const trigger = await page.locator('.xml-downloads > summary').boundingBox();
  const menu = await page.locator('.xml-downloads .action-disclosure-content').boundingBox();
  const setup = await page.locator('.xml-setup-row').boundingBox();
  const links = page.locator('#downloadArea a');
  await expect(links).toHaveText(['Baixar NF-e', 'Baixar CT-e']);
  expect(menu.x).toBeCloseTo(trigger.x, 0);
  expect(menu.width).toBeCloseTo(trigger.width, 0);
  expect(menu.y).toBeGreaterThanOrEqual(trigger.y + trigger.height);
  expect(setup.y).toBeGreaterThanOrEqual(menu.y + menu.height);
  const first = await links.nth(0).boundingBox();
  const second = await links.nth(1).boundingBox();
  const downloadArea = await page.locator('#downloadArea').boundingBox();
  expect(first.width).toBeCloseTo(downloadArea.width, 0);
  expect(first.width).toBeCloseTo(second.width, 0);
  expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
  for (const [index, filename] of ['NFe.xml', 'CTe.xml'].entries()) {
    const downloading = page.waitForEvent('download');
    await links.nth(index).click();
    const download = await downloading;
    expect(download.suggestedFilename()).toBe(filename);
    expect(await readDownload(download)).toContain(index === 0 ? '<NFe' : '<CTe');
  }
  await page.locator('.xml-downloads > summary').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.xml-downloads')).not.toHaveAttribute('open');
  await expect(page.locator('.xml-downloads > summary')).toBeFocused();
  await openDetails(page, '.xml-downloads');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('downloads-layout.png'), fullPage: true });
});

test('resultado reúne razão social, personalização expansível e prévia de placa responsiva', async ({ page }, testInfo) => {
  await openApp(page);
  await page.locator('[data-home-select="cnpj"]').click();
  await expect(page.locator('#docs-output-box #nome-box')).toBeVisible();
  await expect(page.locator('#nome-label')).toHaveText('Razão social');
  const company = await page.locator('#nome-val').innerText();
  await page.locator('#nome-box button[onclick="copyNome()"]').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(company);
  await page.screenshot({ path: testInfo.outputPath('cnpj-layout.png'), fullPage: true });

  await page.evaluate(() => openGenerator('cpf'));
  await page.locator('#docs-generate-btn').click();
  const summary = page.locator('#docs-advanced > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#docs-advanced')).toHaveAttribute('open');
  expect((await summary.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Enter');
  await expect(page.locator('#docs-advanced')).not.toHaveAttribute('open');

  await page.evaluate(() => openGenerator('placa'));
  await page.locator('#docs-generate-btn').click();
  await expect(page.locator('#docs-output-box #placa-preview')).toBeVisible();
  for (const type of ['mercosul', 'antiga']) {
    await page.locator('#gerador-placa-tipo').selectOption(type);
    await page.locator('#docs-generate-btn').click();
    const value = await page.locator('#output-val').innerText();
    expect(value).toMatch(type === 'mercosul' ? /^[A-Z]{3}\d[A-Z]\d{2}$/ : /^[A-Z]{3}-\d{4}$/);
    await expect(page.locator('#placa-wrapper')).toHaveAttribute('aria-label', new RegExp(value));
    expect(await page.locator('.placa-numero').evaluate(number => {
      const lineHeight = parseFloat(getComputedStyle(number).lineHeight);
      return number.scrollWidth <= number.clientWidth && number.getBoundingClientRect().height < lineHeight * 1.5;
    })).toBe(true);
    const code = await page.locator('.docs-result-text').boundingBox();
    const plate = await page.locator('#placa-preview').boundingBox();
    if (page.viewportSize().width >= 1200) {
      expect(plate.x).toBeGreaterThanOrEqual(code.x + code.width);
    } else {
      expect(plate.y).toBeGreaterThanOrEqual(code.y + code.height);
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('placa-layout.png'), fullPage: true });
});
