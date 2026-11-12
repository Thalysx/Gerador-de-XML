const { test, expect, openApp, openWorkspace, openDetails, readDownload, isolateNetwork } = require('./fixtures.cjs');

test('E2E-07: importação adiada fica no grupo de origem sem trocar a seleção', async ({ page }) => {
  await openApp(page);
  const source=await page.evaluate(()=>serializarXml(xmlsGerados.nfe));
  await openWorkspace(page,'xml');
  await page.locator('#xml-form-tipo').selectOption('nfe');
  await page.locator('#xml-preview-tipo').selectOption('nfe');
  await page.getByRole('button',{name:'Abrir no editor',exact:true}).click();
  const originalGroup=await page.evaluate(()=>editorGrupoAtivo);
  await page.evaluate(()=>{
    const NativeReader=FileReader;
    window.FileReader=class extends NativeReader {
      readAsText(...args) {
        window.finishEditorRead=null;
        const onload=this.onload;
        this.onload=event=>{window.finishEditorRead=()=>onload(event);};
        super.readAsText(...args);
      }
    };
  });
  await page.locator('#editor-file-input-add').setInputFiles({name:'atrasado.xml',mimeType:'application/xml',buffer:Buffer.from(source)});
  await page.waitForFunction(()=>typeof window.finishEditorRead==='function');
  await page.locator('#editor-grupos-bar .nfe-group-add').click();
  const selectedGroup=await page.evaluate(()=>editorGrupoAtivo);
  expect(selectedGroup).not.toBe(originalGroup);
  await page.evaluate(()=>window.finishEditorRead());
  expect(await page.evaluate(()=>editorArquivos.find(file=>file.nome==='atrasado.xml').grupoId)).toBe(originalGroup);
  expect(await page.evaluate(()=>editorGrupoAtivo)).toBe(selectedGroup);
  await expect(page.locator('#editor-abas-arquivos .editor-file-select')).toHaveCount(0);
  await page.locator('#editor-grupos-bar').getByRole('button',{name:'Grupo '+originalGroup,exact:true}).click();
  await expect(page.locator('#editor-nome-arquivo')).toHaveValue('atrasado.xml');
  expect(await page.evaluate(()=>serializarXml(xmlsGerados.nfe))).toBe(source);
});

test('E2E-06: validar texto durante upload libera o seletor e permite outro arquivo', async ({ page }) => {
  await openApp(page);
  await openWorkspace(page,'validacao');
  await page.evaluate(() => {
    const read=lerArquivoValidacao, upload=validarArquivosXml;
    lerArquivoValidacao=async file=>{
      window.finishUploadRead=null;
      const contents=await read(file);
      await new Promise(resolve=>{window.finishUploadRead=resolve;});
      return contents;
    };
    validarArquivosXml=(...args)=>{window.pendingUpload=upload(...args);return window.pendingUpload;};
  });
  await page.locator('#validacao-arquivos').setInputFiles({name:'antigo.xml',mimeType:'application/xml',buffer:Buffer.from('<antigo/>')});
  await expect(page.locator('#validacao-arquivos')).toBeDisabled();
  await page.waitForFunction(()=>typeof window.finishUploadRead==='function');
  await page.locator('#validacao-texto').fill('<novo/>');
  await page.getByRole('button',{name:'Validar conteúdo',exact:true}).click();
  await expect(page.locator('#validacao-arquivos')).toBeEnabled();
  await expect(page.locator('.validacao-dropzone-inner')).toBeEnabled();
  await expect(page.locator('.validacao-entrada')).toHaveAttribute('aria-busy','false');
  await page.evaluate(async()=>{window.finishUploadRead();await window.pendingUpload;});
  expect(await page.evaluate(()=>relatoriosXml[0].texto)).toBe('<novo/>');
  const chooserEvent=page.waitForEvent('filechooser');
  await page.locator('.validacao-dropzone-inner').click();
  await (await chooserEvent).setFiles({name:'substituto.xml',mimeType:'application/xml',buffer:Buffer.from('<substituto/>')});
  await expect(page.locator('#validacao-arquivos')).toBeDisabled();
  await page.waitForFunction(()=>typeof window.finishUploadRead==='function');
  await page.evaluate(async()=>{window.finishUploadRead();await window.pendingUpload;});
  await expect(page.locator('#validacao-arquivos')).toBeEnabled();
  expect(await page.evaluate(()=>relatoriosXml[0].texto)).toBe('<substituto/>');
});

test('E2E-01: Home gera uma vez; abrir não gera; copiar e baixar preservam o resultado', async ({ page }) => {
  await openApp(page);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gerador:historico_docs') || '[]'))).toHaveLength(0);
  await page.locator('[data-home-select="cpf"]').click();
  await expect(page.locator('#tab-docs')).toBeVisible();
  const output = page.locator('#output-val');
  await expect(output).toHaveText(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  const cpf = await output.innerText();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gerador:historico_docs')))).toHaveLength(1);

  // This is the public navigation seam explicitly distinguished by the contract.
  await page.evaluate(() => openGenerator('cnpj'));
  await expect(page.locator('#docs-selected-title')).toHaveText('CNPJ');
  await expect(output).toHaveText(cpf);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gerador:historico_docs')))).toHaveLength(1);
  await page.locator('#docs-generate-btn').click();
  await expect(output).toHaveText(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  const cnpj = await output.innerText();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gerador:historico_docs')))).toHaveLength(2);

  await page.locator('#copy-btn').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(cnpj);
  const company = await page.locator('#nome-val').innerText();
  await openDetails(page,'#docs-output-box .action-disclosure');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#download-doc-btn').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('dado-teste-cnpj.txt');
  expect(await readDownload(download)).toBe(`Razão social: ${company}\nCNPJ: ${cnpj}`);
});

test('E2E-02: catálogo único reúne busca e favoritos; preferências persistem sem vazar de contexto', async ({ page, browser, baseURL }) => {
  await openApp(page);
  await expect(page.locator('.environment-switcher')).toHaveCount(0);
  await expect(page.locator('body')).toHaveAttribute('data-environment', 'unified');
  await page.locator('[data-home-favorite="cpf"]').click();
  await page.locator('[data-home-favorite="carga"]').click();
  await page.locator('#theme-btn').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  const sidebarToggle = page.locator('#sidebar-collapse-btn');
  if (await sidebarToggle.getAttribute('aria-expanded') === 'true') await sidebarToggle.click();
  for (const term of ['Carga', 'CPF']) {
    await page.keyboard.press('Control+k');
    await page.locator('#command-palette-input').fill(term);
    await expect(page.locator('#command-palette-results [role="option"]')).not.toHaveCount(0);
    await expect(page.locator('#command-palette-results strong').filter({ hasText: new RegExp('^' + term + '$', 'i') })).toHaveCount(1);
    await expect(page.locator('#command-palette-results')).toContainText(new RegExp(term, 'i'));
    await page.keyboard.press('Escape');
  }
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
  for (const id of ['cpf', 'carga']) await expect(page.locator('[data-home-favorite="' + id + '"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#home-generator-search').fill('conteiner');
  await expect(page.locator('[data-home-card="conteiner-lacre"]')).toBeVisible();
  const isolated = await browser.newContext({ baseURL, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' });
  const unexpected = [];
  try {
    await isolateNetwork(isolated, baseURL, unexpected);
    const fresh = await isolated.newPage();
    await openApp(fresh);
    await expect(fresh.locator('body')).toHaveAttribute('data-environment', 'unified');
    await expect(fresh.locator('body')).not.toHaveClass(/dark/);
    expect(await fresh.evaluate(() => JSON.parse(localStorage.getItem('thegenerator:favorite-generators') || '[]'))).toEqual([]);
    expect(await fresh.evaluate(() => JSON.parse(localStorage.getItem('gerador:historico_docs') || '[]'))).toEqual([]);
    expect(unexpected).toEqual([]);
  } finally { await isolated.close(); }
});

test('E2E-03: Cadastro gera grupos, edita e restaura o tipo correto sem trocar o catálogo', async ({ page }) => {
  await openApp(page);
  await openWorkspace(page,'cadastro');
  await expect(page.locator('#cadastro-edit')).toHaveAttribute('open', '');
  await expect(page.locator('#cad_nome')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar seleção', exact: true }).click();
  await page.locator('input[name="cadastro-grupo"][value="identificacao"]').check();
  await page.locator('input[name="cadastro-grupo"][value="documentos"]').check();
  await page.getByRole('button', { name: 'Gerar ficha com os grupos selecionados', exact: true }).click();
  await expect(page.locator('#result-grid-items [data-result-group]')).toHaveCount(2);
  await expect(page.locator('#result-group-identificacao')).toBeVisible();
  await expect(page.locator('#result-group-documentos')).toBeVisible();
  const originalName = await page.locator('#res-nome').innerText();
  const originalCpf = await page.locator('#cad_cpf').inputValue();
  await page.locator('#cadastro-result [data-edit-cadastro]').click();
  await expect(page.locator('#cadastro-edit')).toHaveAttribute('open', '');
  await page.locator('#cad_nome').fill('Pessoa Sintética Editada E2E');
  await expect(page.locator('#res-nome')).toHaveText('Pessoa Sintética Editada E2E');
  await openDetails(page, '.cadastro-history');
  await page.locator('#historico-items').getByRole('button', { name: /^Restaurar cadastro/ }).first().click();
  await expect(page.locator('#res-nome')).toHaveText(originalName);
  await expect(page.locator('#cad_cpf')).toHaveValue(originalCpf);
  await page.locator('#cadastro-result').getByRole('button', { name: 'Copiar cadastro em JSON', exact: true }).click();
  const copied = JSON.parse(await page.evaluate(() => navigator.clipboard.readText()));
  expect(copied.nome).toBe(originalName);
  expect(copied.cpf).toBe(originalCpf);
  expect(copied.grupos).toEqual(['identificacao', 'documentos']);

  await page.locator('#cad-port-tipo').selectOption('transportadora');
  await page.getByRole('button', { name: 'Gerar ficha completa', exact: true }).click();
  await expect(page.locator('#cadastro-result-badge')).toHaveText('Transportadora');
  const header = await page.locator('#cadastro-result .result-header').evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return [...element.querySelectorAll('.result-header-left, .result-new-button')].every(child => {
      const rect = child.getBoundingClientRect();
      return rect.left >= bounds.left && rect.right <= bounds.right && rect.right <= innerWidth;
    });
  });
  expect(header, 'Tipo da ficha e ação permanecem dentro do cabeçalho').toBe(true);
  const carrierName = await page.locator('#res-nome').innerText();
  await page.locator('#cad-port-tipo').selectOption('perfil');
  await openDetails(page, '.cadastro-history');
  await page.locator('#historico-items').getByRole('button', { name: /^Restaurar cadastro/ }).first().click();
  await expect(page.locator('body')).toHaveAttribute('data-environment', 'unified');
  await expect(page.locator('#res-nome')).toHaveText(carrierName);
  await expect(page.locator('#cad-port-tipo')).toHaveValue('transportadora');
});

test('E2E-04: XML abre cópia, edita, exporta e importa sem alterar o documento-fonte', async ({ page }) => {
  await openApp(page);
  await openWorkspace(page,'xml');
  await page.locator('#xml-form-tipo').selectOption('nfe');
  await page.locator('#xml-preview-tipo').selectOption('nfe');
  const original = await page.evaluate(() => serializarXml(xmlsGerados.nfe));
  await page.getByRole('button', { name: 'Abrir no editor', exact: true }).click();
  await expect(page.locator('#tab-editor')).toBeVisible();
  await expect(page.locator('#tab-editor')).toBeFocused();
  await page.locator('#editor-subnav').getByRole('button', { name: 'Produtos (NF-e)', exact: true }).click();
  await page.getByLabel('COD. (CPROD)', { exact: true }).first().fill('TESTE-E2E-001');
  await expect(page.locator('.editor-modificado-badge')).toHaveText('Alterado');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar XML', exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/^NFE-gerado-\d+\.xml$/);
  const edited = await readDownload(download);
  expect(await page.evaluate(text => {
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    return { errors: xml.querySelectorAll('parsererror').length, code: xml.querySelector('prod > cProd')?.textContent };
  }, edited)).toEqual({ errors: 0, code: 'TESTE-E2E-001' });
  expect(await page.evaluate(() => serializarXml(xmlsGerados.nfe))).toBe(original);

  await page.locator('#editor-file-input-add').setInputFiles({ name: 'copia-sintetica-e2e.xml', mimeType: 'application/xml', buffer: Buffer.from(edited) });
  await expect(page.locator('#editor-abas-arquivos .editor-file-select')).toHaveCount(2);
  await expect(page.locator('#editor-nome-arquivo')).toHaveValue('copia-sintetica-e2e.xml');
  await expect(page.getByLabel('COD. (CPROD)', { exact: true }).first()).toHaveValue('TESTE-E2E-001');
  expect(await page.evaluate(() => serializarXml(xmlsGerados.nfe))).toBe(original);
});

test('E2E-05: comandos revisáveis, lote completo e erro preservam rascunho e anexo sem chat remoto', async ({ page }) => {
  const remoteChat = [];
  page.on('request', request => { if (/\/api\/(?:chat|status)(?:\?|$)/.test(request.url())) remoteChat.push(request.url()); });
  await openApp(page);
  await openWorkspace(page,'chat');
  await page.locator('#chat-sugestoes').getByRole('button', { name: '3 CPFs e 2 CNPJs', exact: true }).click();
  await expect(page.locator('#chat-pedido')).toHaveValue('3 CPFs e 2 CNPJs');
  await expect(page.locator('#chat-mensagens .chat-troca')).toHaveCount(0);
  await page.locator('#chat-enviar').click();
  await expect(page.locator('#chat-mensagens .chat-troca')).toHaveCount(1);
  await page.locator('.command-registros > summary').click();
  await expect(page.locator('#chat-mensagens .registro-lote')).toHaveCount(5);
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#chat-mensagens').getByRole('button', { name: 'JSON', exact: true }).click();
  const records = JSON.parse(await readDownload(await downloadEvent));
  expect(records).toHaveLength(5);
  expect(records.filter(record => record.tipo === 'cpf')).toHaveLength(3);
  expect(records.filter(record => record.tipo === 'cnpj')).toHaveLength(2);

  const attachment = await page.evaluate(() => serializarXml(xmlsGerados.nfe));
  await page.locator('#chat-anexo-area > summary').click();
  await page.locator('#chat-anexo-arquivo').setInputFiles({ name: 'sintetico-e2e.xml', mimeType: 'application/xml', buffer: Buffer.from(attachment) });
  await expect(page.locator('#chat-anexo-pendente')).toBeVisible();
  await expect(page.locator('#chat-anexo-nome')).toContainText('sintetico-e2e.xml');
  await page.locator('#chat-pedido').fill('3 CPFs e 2 unicórnios');
  await page.locator('#chat-enviar').click();
  await expect(page.locator('#chat-mensagens .chat-troca').last()).toContainText('Vamos ajustar o comando');
  await expect(page.locator('#chat-pedido')).toHaveValue('3 CPFs e 2 unicórnios');
  await expect(page.locator('#chat-anexo')).toHaveValue(attachment);
  await expect(page.locator('#chat-anexo-pendente')).toBeVisible();
  await expect(page.locator('#chat-mensagens .registro-lote')).toHaveCount(5);
  await page.locator('#chat-pedido').fill('validar XML anexado');
  await page.locator('#chat-pedido').press('Enter');
  await expect(page.locator('#chat-mensagens .chat-troca').last()).toContainText('Validação local');
  await expect(page.locator('#chat-mensagens .chat-troca').last()).toContainText('XSD e autorização SEFAZ não foram executados');
  expect(remoteChat).toEqual([]);
});
