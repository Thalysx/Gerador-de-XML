const { test, expect, openApp, openWorkspace, openDetails } = require('./fixtures.cjs');

test('telefone gera ao clicar e endereço oferece campos separados para copiar', async ({ page }, testInfo) => {
  await openApp(page);
  await page.locator('[data-home-select="telefone"]').click();
  await expect(page.locator('#output-val')).toHaveText(/^\(\d{2}\) 9\d{4}-\d{4}$/);
  await expect(page.locator('#copy-btn')).toBeEnabled();
  await openDetails(page,'#docs-advanced');
  await page.locator('#gerador-uf').selectOption('AC');
  await page.locator('#gerador-telefone-tipo').selectOption('fixo');
  await page.locator('#docs-generate-btn').click();
  await expect(page.locator('#output-val')).toHaveText(/^\(68\) [2-5]\d{3}-\d{4}$/);
  await openDetails(page,'#docs-picker');
  await page.locator('#docs-search').fill('endereço');
  await page.locator('[data-generator-id="endereco"]').click();
  await expect(page.locator('#output-val dt')).toHaveText(['CEP','Rua / Avenida','Número','Bairro','Cidade','Estado (UF)']);
  await expect(page.locator('#output-val dd').first()).toHaveText(/^\d{5}-\d{3}$/);
  const fields=page.locator('#output-val .structured-result-field');
  for(const index of [0,1,4,5]) {
    const field=fields.nth(index),value=await field.locator('dd').innerText();
    await field.getByRole('button').click();
    expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(value);
  }
  await expect(page.locator('[data-generator-id="conteiner"], [data-generator-id="lacre"]')).toHaveCount(0);
  await expect(page.locator('#lote-tipo option[value="conteiner"], #lote-tipo option[value="lacre"]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('endereco-separado.png'),fullPage:true});
});

test('dados individuais: acesso rápido, catálogo completo e opções no contexto correto', async ({ page }, testInfo) => {
  await openApp(page);
  await openWorkspace(page,'docs');
  await expect(page.locator('#docs-generator-list button:visible')).toHaveCount(8);
  await expect(page.locator('#docs-advanced')).toBeHidden();
  await page.locator('#docs-show-all').click();
  await expect(page.locator('#docs-generator-list button:visible')).toHaveCount(18);
  const removed=['cliente-portuario','conteiner','lacre','nome','motorista','operador-portuario','visitante-portuario','pessoa-portuaria','nome-fantasia','empresa','depositante','importador','exportador','transportadora','cep','cavalo-mecanico','carreta','conjunto-veicular','chave-cte','di','carga-solta','granel-solido','granel-liquido','carga-conteinerizada','uuid-v4','ipv4-documentacao','ipv6-documentacao','mac-local','valor-brl','pix-evp','transacao-teste'];
  for(const id of removed) {
    await expect(page.locator(`[data-generator-id="${id}"]`)).toHaveCount(0);
    await expect(page.locator(`#lote-tipo option[value="${id}"]`)).toHaveCount(0);
  }
  await expect(page.locator('#docs-group-desenvolvimento, #docs-group-financeiro')).toHaveCount(0);
  await expect(page.locator('#docs-category option[value="desenvolvimento"], #docs-category option[value="financeiro"]')).toHaveCount(0);
  await expect(page.locator('#docs-generator-list [data-category="carga"]')).toHaveCount(1);
  await page.locator('[data-generator-id="carga"]').click();
  await expect(page.locator('#docs-selected-title')).toHaveText('Carga');
  await expect(page.locator('#output-val')).toContainText(/CARGA-\d{10}/);
  await expect(page.locator('#output-val')).toContainText(/Carga solta|Granel sólido|Granel líquido|Carga conteinerizada/);
  if(testInfo.project.name.includes('mobile')) await page.locator('#docs-picker > summary').click();
  await page.locator('#docs-show-all').click();
  await expect(page.locator('#docs-generator-list button:visible')).toHaveCount(8);

  await page.locator('#docs-search').fill('E-mail');
  await page.locator('[data-generator-id="email"]').click();
  await expect(page.locator('#output-val')).toHaveText(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  await expect(page.locator('#docs-advanced')).toBeHidden();
  if(testInfo.project.name.includes('mobile')) {
    await expect(page.locator('#docs-picker')).not.toHaveAttribute('open');
    await expect(page.locator('#docs-selected-title')).toBeFocused();
    await page.locator('#docs-picker > summary').click();
  }
  await page.locator('#docs-search-clear').click();
  await page.locator('[data-generator-id="cpf"]').click();
  await openDetails(page,'#docs-advanced');
  await page.locator('#toggle-mascara').uncheck();
  await page.locator('#docs-generate-btn').click();
  await expect(page.locator('#output-val')).toHaveText(/^\d{11}$/);
  const individual=await page.locator('#output-val').innerText();

  await openDetails(page,'.docs-batch');
  await page.locator('#lote-tipo').selectOption('telefone');
  await expect(page.locator('#docs-phone-options')).toBeHidden();
  await openDetails(page,'#lote-settings');
  await expect(page.locator('#lote-mascara')).not.toBeChecked();
  await page.locator('#lote-uf').selectOption('SP');
  await page.locator('#lote-quantidade').fill('3');
  await page.locator('.lote-form button[type="submit"]').click();
  await expect(page.locator('#lote-status')).toContainText('3 registros gerados');
  await expect(page.locator('#output-val')).toHaveText(individual);
  expect(await page.evaluate(()=>ultimoLote.every(item=>DDD_POR_UF.SP.map(String).includes(item.valor.slice(0,2))))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
