const { test, expect, openApp, openWorkspace } = require('./fixtures.cjs');

test('menu de anexos oferece arquivo, XML atual e colagem com navegação por teclado', async ({ page }, testInfo) => {
  await openApp(page);
  await openWorkspace(page,'chat');
  const trigger=page.locator('#chat-anexo-area > summary');
  const popover=page.locator('#chat-anexo-popover');
  const opcoes=page.getByRole('menu',{name:'Adicionar contexto'});
  await trigger.click();
  await expect(opcoes.getByRole('menuitem')).toHaveCount(4);
  await expect(page.locator('#chat-anexo')).toBeHidden();
  for(const dark of [false,true]) {
    await page.evaluate(dark=>document.body.classList.toggle('dark',dark),dark);
    const bounds=await popover.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(8);
    expect(bounds.x+bounds.width).toBeLessThanOrEqual(page.viewportSize().width-8);
    expect(bounds.y).toBeGreaterThanOrEqual(8);
    const triggerBounds=await trigger.boundingBox();
    expect(bounds.y+bounds.height).toBeLessThanOrEqual(triggerBounds.y);
    await page.screenshot({path:testInfo.outputPath(`attachment-menu-${dark?'dark':'light'}.png`)});
  }
  await trigger.press('ArrowDown');
  await expect(opcoes.getByRole('menuitem',{name:/Arquivo XML/})).toBeFocused();
  await page.keyboard.press('End');
  await expect(opcoes.getByRole('menuitem',{name:/CT-e atual/})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(popover).toBeHidden();
  await expect(page.locator('#chat-anexo-tipo')).toHaveValue('cte');
  await expect(page.locator('#chat-anexo-nome')).toContainText('CTE atual');
  await expect(page.locator('#chat-pedido')).toBeFocused();
  await trigger.click();
  await opcoes.getByRole('menuitem',{name:/NF-e atual/}).click();
  await expect(page.locator('#chat-anexo-tipo')).toHaveValue('nfe');
  await expect(page.locator('#chat-anexo')).toHaveValue(/nfeProc/);
  await trigger.click();
  await opcoes.getByRole('menuitem',{name:/Colar XML/}).click();
  await expect(page.locator('#chat-anexo')).toBeFocused();
  await page.locator('#chat-anexo').fill('<consulta>teste local</consulta>');
  await page.getByRole('button',{name:'Usar XML',exact:true}).click();
  await expect(popover).toBeHidden();
  await expect(page.locator('#chat-anexo-nome')).toContainText('XML colado');
  await trigger.click();
  await expect(opcoes).toBeVisible();
  await opcoes.getByRole('menuitem',{name:/Colar XML/}).click();
  await page.getByRole('button',{name:'Voltar às opções de anexo'}).click();
  await expect(opcoes.getByRole('menuitem',{name:/Colar XML/})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  const chooser=page.waitForEvent('filechooser');
  await opcoes.getByRole('menuitem',{name:/Arquivo XML/}).click();
  await (await chooser).setFiles({name:'contexto.xml',mimeType:'application/xml',buffer:Buffer.from('<arquivo/>')});
  await expect(popover).toBeHidden();
  await expect(page.locator('#chat-anexo')).toHaveValue('<arquivo/>');
  await expect(page.locator('#chat-anexo-nome')).toContainText('contexto.xml');
});

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
  await openWorkspace(page,'chat');
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
