const { test, expect, openApp } = require('./fixtures.cjs');

test('E2E-08: controles da busca respeitam fechamento e ativação por teclado', async ({ page }) => {
  await openApp(page);
  const origin=page.locator('#theme-btn');
  const palette=page.locator('#command-palette');
  const input=page.locator('#command-palette-input');
  const close=page.locator('#command-palette-close');
  for (const key of ['Enter','Space']) {
    await origin.focus();
    await origin.press('Control+k');
    await input.fill('CPF');
    await input.press('Shift+Tab');
    await expect(close).toBeFocused();
    await close.press(key);
    await expect(palette).toBeHidden();
    await expect(origin).toBeFocused();
    await expect(page.locator('#app-title')).toHaveText('Início');
    expect(await page.evaluate(()=>localStorage.getItem('gerador:historico_docs'))).toBeNull();
  }
  await origin.press('Control+k');
  await input.fill('CPF');
  await input.press('Enter');
  await expect(palette).toBeHidden();
  await expect(page.locator('#docs-selected-title')).toHaveText('CPF');
  const history=await page.evaluate(()=>JSON.parse(localStorage.getItem('gerador:historico_docs')||'[]').length);
  expect(history).toBe(1);

  await origin.focus();
  await origin.press('Control+k');
  const options=palette.locator('[data-command-index]');
  const second=options.nth(1);
  const target=await page.evaluate(()=>commandPaletteItems[1].id);
  await input.press('Tab');
  await options.first().press('Tab');
  await expect(second).toBeFocused();
  await second.press('Enter');
  await expect(palette).toBeHidden();
  // The focused option's own click handler must choose its destination.
  expect(await page.evaluate(()=>selectedGeneratorId)).toBe(target);
  await origin.focus();
  await origin.press('Control+k');
  await input.press('Escape');
  await expect(palette).toBeHidden();
  await expect(origin).toBeFocused();
});

test('E2E-09: anexo longo preserva espaço e envio por clique em todas as larguras', async ({ page }, testInfo) => {
  await openApp(page);
  await page.locator('#tab-btn-chat').click();
  const source=await page.evaluate(()=>serializarXml(xmlsGerados.nfe));
  await page.locator('#chat-anexo-area > summary').click();
  await page.locator('#chat-anexo-arquivo').setInputFiles({
    name:'documento-sintetico-'+ 'anexo-muito-longo-'.repeat(8)+'.xml',
    mimeType:'application/xml', buffer:Buffer.from(source)
  });
  const chip=page.locator('#chat-anexo-pendente');
  await expect(chip).toBeVisible();
  const input=page.locator('#chat-pedido');
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    for (const dark of [false,true]) {
      await page.evaluate(dark=>document.body.classList.toggle('dark',dark),dark);
      await input.fill('3 CPFs e 2 unicórnios');
      await input.scrollIntoViewIfNeeded();
      const boxes=await page.evaluate(()=>{
        const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
        return {form:document.querySelector('.chat-form').getBoundingClientRect().toJSON(),input:rect('chat-pedido'),send:rect('chat-enviar'),chip:rect('chat-anexo-pendente'),remove:rect('chat-anexo-limpar'),viewport:innerWidth};
      });
      await page.screenshot({path:testInfo.outputPath(`composer-${width}-${dark?'dark':'light'}.png`)});
      expect(boxes.input.width,'largura útil da mensagem').toBeGreaterThanOrEqual(80);
      expect(boxes.send.right).toBeLessThanOrEqual(boxes.form.right);
      expect(boxes.send.right).toBeLessThanOrEqual(boxes.viewport);
      expect(boxes.chip.right).toBeLessThanOrEqual(boxes.form.right);
      expect(boxes.chip.bottom).toBeLessThanOrEqual(boxes.input.top);
      expect(boxes.remove.width).toBeGreaterThanOrEqual(28);
      await page.locator('#chat-enviar').click();
      await expect(page.locator('#chat-mensagens .chat-troca').last()).toContainText('Vamos ajustar o comando');
      await expect(input).toHaveValue('3 CPFs e 2 unicórnios');
      await expect(page.locator('#chat-anexo')).toHaveValue(source);
    }
  }
  await input.fill('validar XML anexado');
  await page.locator('#chat-enviar').click();
  await expect(page.locator('#chat-mensagens .chat-troca').last()).toContainText('Validação local');
  await page.locator('#chat-anexo-limpar').click();
  await expect(chip).toBeHidden();
  await expect(page.locator('#chat-anexo')).toHaveValue('');
  await expect(page.locator('#chat-anexo-area > summary')).toBeFocused();
});
