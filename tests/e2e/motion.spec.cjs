const { test, expect, openApp, openWorkspace, openDetails } = require('./fixtures.cjs');

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
