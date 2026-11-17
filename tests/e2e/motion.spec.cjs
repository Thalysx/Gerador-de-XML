const { test, expect, openApp, openWorkspace, openDetails } = require('./fixtures.cjs');

test('campos preservados ficam identificados após regenerar, adicionar produtos e recarregar', async ({ page }) => {
  await openApp(page);
  await openWorkspace(page,'xml');
  await page.locator('#xml-form-tipo').selectOption('ambos');
  await page.locator('#lock-btn').click();
  for (const id of ['cte_nomeEmit','nfe_nomeEmit','nfes_prod_0_nome','nfes_prod_0_select']) {
    await expect(page.locator(`label[for="${id}"] .field-lock-status`)).toHaveText('Preservado');
    await expect(page.locator(`label[for="${id}"] .field-lock-status svg`)).toBeVisible();
  }
  await expect(page.locator('#nfes_prod_0_unidade_label .field-lock-status')).toBeVisible();
  await expect(page.locator('label[for="nfe_codigo"] .field-lock-status')).toHaveCount(0);
  await expect(page.locator('#tab-xml .field-lock-status')).toHaveCount(22);
  const cores=await page.evaluate(()=>['nfe_nomeEmit','cte_nomeEmit','nfes_prod_0_select','nfe_codigo'].map(id=>getComputedStyle(document.getElementById(id)).backgroundColor));
  expect(cores[0]).toBe(cores[1]);
  expect(cores[0]).toBe(cores[2]);
  expect(cores[0]).not.toBe(cores[3]);
  await page.getByRole('button',{name:'Gerar novos dados',exact:true}).click();
  await expect(page.locator('#tab-xml .field-lock-status')).toHaveCount(22);
  await page.getByRole('button',{name:'Adicionar produto',exact:true}).click();
  await expect(page.locator('label[for="nfes_prod_1_nome"] .field-lock-status')).toBeVisible();
  await expect(page.locator('#tab-xml .field-lock-status')).toHaveCount(30);
  await page.reload();
  await openWorkspace(page,'xml');
  await expect(page.locator('#tab-xml .field-lock-status')).toHaveCount(30);
  await page.locator('#theme-btn').click();
  await expect(page.locator('label[for="nfe_nomeEmit"] .field-lock-status')).toBeVisible();
  await page.locator('#lock-btn').click();
  await expect(page.locator('#tab-xml .field-lock-status')).toHaveCount(0);
  await expect(page.locator('#tab-xml .locked')).toHaveCount(0);
});

test('preservar campos XML anima a cada clique e mantém os dados ao gerar novamente', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await openApp(page);
  await openWorkspace(page,'xml');
  const lock=page.locator('#lock-btn');
  const empresa=page.locator('#nfe_nomeEmit');
  await empresa.fill('Empresa preservada');
  await lock.click();
  await expect(lock).toHaveAttribute('aria-pressed','true');
  await expect(lock).toHaveText('Campos preservados');
  await expect(empresa).toHaveClass(/locked/);
  await page.getByRole('button',{name:'Gerar novos dados',exact:true}).click();
  await expect(empresa).toHaveValue('Empresa preservada');
  // New icons must restart feedback even when toggled rapidly in the same frame.
  const animations=await lock.evaluate(button=>Array.from({length:3},()=>{
    button.click();
    return button.querySelector('svg').getAnimations().map(animation=>animation.animationName);
  }));
  expect(animations).toEqual([['lockFeedback'],['lockFeedback'],['lockFeedback']]);
  await expect(lock).toHaveAttribute('aria-pressed','false');
  await expect(lock).toHaveText('Preservar campos');
  await expect(empresa).not.toHaveClass(/locked/);
  await page.locator('#theme-btn').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await lock.click();
  await expect(lock).toHaveAttribute('aria-pressed','true');
  await expect(lock).toHaveText('Campos preservados');
  expect(await lock.locator('svg').evaluate(icon=>icon.getAnimations().length)).toBe(0);
  await expect(empresa).toHaveValue('Empresa preservada');
});

test('movimento acompanha geração, cópia repetida, menus e navegação', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await openApp(page);
  await page.evaluate(()=>{
    window.motionEvents=[];
    document.addEventListener('animationstart',event=>motionEvents.push(event.animationName));
  });
  await page.locator('[data-home-select="telefone"]').click();
  await expect(page.locator('#output-val')).toHaveText(/^\(\d{2}\) 9\d{4}-\d{4}$/);
  const generated=await page.evaluate(()=>{
    for(let i=0;i<5;i++)generateSelectedDocument();
    const output=document.getElementById('output-val');
    return {text:output.textContent,history:historicoDocsList[0].dados.valor,
      animations:output.getAnimations().filter(a=>a.playState==='running').length,
      duration:output.getAnimations()[0]?.effect.getTiming().duration};
  });
  expect(generated.text).toBe(generated.history);
  expect(generated.animations).toBe(1);
  expect(generated.duration).toBeLessThanOrEqual(220);
  await page.locator('#copy-btn').click();
  await page.locator('#copy-btn').click();
  await expect(page.locator('#copy-btn')).toHaveAccessibleName('Resultado copiado');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(generated.text);
  await expect(page.locator('#copy-btn')).toHaveAccessibleName('Copiar resultado gerado');
  await expect(page.locator('#copy-btn')).toHaveText('Copiar');
  await openDetails(page,'#docs-advanced');
  await expect(page.locator('#toggle-mascara')).toBeVisible();
  await page.locator('#docs-advanced > summary').click();
  await expect(page.locator('#toggle-mascara')).toBeHidden();
  await page.locator('#tab-docs .action-disclosure > summary').click();
  await expect(page.locator('#tab-docs .action-disclosure-content')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#tab-docs .action-disclosure > summary')).toBeFocused();
  await expect.poll(()=>page.evaluate(()=>motionEvents.includes('workspaceEnter')&&motionEvents.includes('copyConfirm'))).toBe(true);
  await openWorkspace(page,'home');
  await openWorkspace(page,'docs');
  await expect(page.locator('#output-val')).toHaveText(generated.text);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('movimento reduzido cancela efeitos ativos e mantém ações e foco disponíveis', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await openApp(page);
  await page.locator('[data-home-select="telefone"]').click();
  await page.evaluate(()=>generateSelectedDocument());
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.evaluate(()=>document.getElementById('output-val').getAnimations().length)).toBe(0);
  await page.locator('#docs-generate-btn').click();
  await expect(page.locator('#output-val')).toHaveText(/^\(\d{2}\) 9\d{4}-\d{4}$/);
  await page.locator('#copy-btn').click();
  await expect(page.locator('#copy-btn')).toHaveAccessibleName('Resultado copiado');
  await openDetails(page,'#docs-advanced');
  await expect(page.locator('#gerador-uf')).toBeVisible();
  expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
  await openWorkspace(page,'home');
  await expect(page.locator('#tab-home')).toBeVisible();
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
});
