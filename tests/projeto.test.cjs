const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);

async function abrir(estado = {}) {
  const dom = new JSDOM(html, { url:'http://localhost', runScripts:'outside-only', pretendToBeVisual:true });
  const w = dom.window;
  w.URL.createObjectURL = () => 'blob:teste';
  w.URL.revokeObjectURL = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  for (const [chave, valor] of Object.entries(estado)) w.localStorage.setItem(chave, JSON.stringify(valor));
  for (const file of scripts) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), dom.getInternalVMContext(), { filename:file });
  const inicializar = w.onload;
  w.onload = null;
  // Aguarda o load do JSDOM antes de invocar explicitamente a inicialização.
  await new Promise(resolve => w.document.readyState === 'complete' ? resolve() : w.addEventListener('load', resolve, {once:true}));
  inicializar();
  return { dom, w, run: code => vm.runInContext(code, dom.getInternalVMContext()) };
}

test('menu agrupado mantém ordem visual e navegação por teclado', async () => {
  const {dom,w}=await abrir();
  try {
    const tabs=[...w.document.querySelectorAll('.tab-nav [role="tab"]')];
    assert.deepEqual(tabs.map(t=>t.id),['home','xml','docs','cadastro','scenarios','editor','validacao','chat'].map(t=>'tab-btn-'+t));
    assert.equal(w.document.getElementById('tab-btn-xml').getAttribute('aria-label'),'XML fiscal');
    assert.equal(w.document.getElementById('tab-btn-chat').getAttribute('aria-label'),'Assistente de geração');
    const editor=w.document.getElementById('tab-btn-editor');
    editor.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
    assert.equal(w.document.activeElement.id,'tab-btn-validacao');
    w.document.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));
    assert.equal(w.document.activeElement.id,'tab-btn-chat');
    assert.equal(w.document.getElementById('tab-chat').hidden,false);
    w.document.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
    assert.equal(w.document.activeElement.id,'tab-btn-home');
  } finally {dom.window.close();}
});

test('migração FUTURE G mantém uma única rota para cada módulo e gerador existente', async () => {
  const {dom,w,run}=await abrir();
  try {
    const navigationIds=JSON.parse(run('JSON.stringify(APP_NAVIGATION.map(item=>item.id))'));
    const tabIds=[...w.document.querySelectorAll('.tab-nav [role="tab"]')].map(tab=>tab.id.replace('tab-btn-',''));
    const panelIds=[...w.document.querySelectorAll('.tab-panel')].map(panel=>panel.id.replace('tab-',''));
    assert.deepEqual(tabIds,navigationIds);
    assert.deepEqual([...panelIds].sort(),[...navigationIds].sort());
    assert.equal(new Set(tabIds).size,tabIds.length);
    assert.equal(run('GENERATORS.every(generator=>navigationById(generator.route))'),true);
    assert.equal(new Set(scripts).size,scripts.length);
    for(const required of ['assets/js/lucide.min.js','assets/js/icons.js','assets/js/generator-registry.js','assets/js/generator-workspace.js','assets/js/gerador-xml.js','assets/js/xml-workflow.js','assets/js/validacao-xml.js','assets/js/chat.js','assets/js/chat-ia.js'])assert.equal(scripts.filter(file=>file===required).length,1,required);
    assert.doesNotMatch(html,/bootstrap-icons|\bbi bi-/);
    const lucideIcons=[...w.document.querySelectorAll('svg.lucide')];
    assert.ok(lucideIcons.length>20);
    assert.ok(lucideIcons.every(icon=>icon.getAttribute('aria-hidden')==='true'));
    assert.equal(run('typeof HOME_GENERATORS'),'undefined');
    assert.equal(w.document.getElementById('home-result'),null);
  } finally {dom.window.close();}
});

test('busca no histórico preserva índices e acompanha novos registros', async () => {
  const {dom,w,run}=await abrir();
  try {
    run("adicionarHistoricoDocs({tipo:'Nome',valor:'João',currentType:'nome'}); adicionarHistoricoDocs({tipo:'Empresa',valor:'Acme',currentType:'empresa'})");
    const input=w.document.getElementById('docs-historico-busca');
    input.value='joao';input.dispatchEvent(new w.Event('input'));
    const items=()=>[...w.document.querySelectorAll('#docs-historico-items .historico-item')].filter(el=>!el.hidden);
    assert.equal(items().length,1);
    assert.match(items()[0].querySelector('.historico-item-actions button').getAttribute('onclick'),/\(1\)/);
    run("adicionarHistoricoDocs({tipo:'Nome',valor:'João Silva',currentType:'nome'})");
    await new Promise(resolve=>w.setTimeout(resolve,0));
    assert.equal(items().length,2);
    input.value='inexistente';input.dispatchEvent(new w.Event('input'));
    assert.equal(items().length,0);
    input.value='';input.dispatchEvent(new w.Event('input'));
    assert.equal(items().length,3);
    const categoria=w.document.getElementById('docs-historico-categoria');
    categoria.value='empresas';categoria.dispatchEvent(new w.Event('change'));
    assert.equal(items().length,1);
    assert.match(items()[0].textContent,/Acme/);
    categoria.value='todas';categoria.dispatchEvent(new w.Event('change'));
    assert.equal(items().length,3);
  } finally {dom.window.close();}
});

test('estados vazios orientam a próxima ação e movem foco aos geradores', async () => {
  const {dom,w}=await abrir();
  try {
    const docs=w.document.getElementById('docs-historico-empty');
    const cadastro=w.document.getElementById('historico-empty');
    const editor=w.document.getElementById('editor-campos-empty');
    assert.match(docs.textContent,/Gere um dado/);
    assert.match(cadastro.textContent,/Crie um perfil/);
    assert.match(editor.textContent,/Selecione um arquivo XML/);
    assert.ok(docs.querySelector('button'));
    assert.ok(cadastro.querySelector('button'));
    assert.ok(editor.querySelector('button'));
    docs.querySelector('button').click();
    assert.equal(w.document.activeElement.id,'docs-search');
  } finally {dom.window.close();}
});

test('resposta IA formata tabela, lista e XML sem executar HTML', async () => {
  const {dom,w}=await abrir();
  try {
    const box=w.document.createElement('div');
    box.innerHTML=w.formatarRespostaIa('**Resultado**\n- nome\n- empresa\n\n| Tipo | Valor |\n| --- | --- |\n| CPF | `123` |\n\n```xml\n<teste/>\n```\n<img src=x onerror=alert(1)>\n[javascript](javascript:alert(1))');
    assert.equal(box.querySelectorAll('li').length,2);
    assert.equal(box.querySelectorAll('th').length,2);
    assert.equal(box.querySelector('pre code').textContent,'<teste/>');
    assert.equal(box.querySelectorAll('img,script,a').length,0);
    assert.match(box.textContent,/<img/);
  } finally {dom.window.close();}
});

test('formulário XML acompanha o ambiente e preserva edições', async () => {
  const {dom,w}=await abrir();
  try {
    const select=w.document.getElementById('xml-form-tipo');
    const nome=w.document.getElementById('nfe_nomeEmit');
    nome.value='Empresa editada';
    assert.deepEqual([...select.options].map(option=>option.value),['nfe']);
    w.definirAmbiente('port');
    assert.equal(w.document.getElementById('xml-form-nfe').hidden,true);
    assert.equal(w.document.getElementById('xml-form-cte').hidden,false);
    assert.equal(w.document.getElementById('xml-preview-tipo').value,'cte');
    assert.deepEqual([...select.options].map(option=>option.value),['cte']);
    w.definirAmbiente('general');
    assert.equal(w.document.getElementById('xml-form-nfe').hidden,false);
    assert.equal(w.document.getElementById('xml-form-cte').hidden,true);
    assert.equal(nome.value,'Empresa editada');
  } finally {dom.window.close();}
});

test('campos completos da NF-e e cenários ficam visíveis sem gavetas', async () => {
  const {dom,w,run}=await abrir();
  try {
    const recinto=w.document.getElementById('nfe_recinto');
    const transportador=w.document.getElementById('nfe_nomeTransp');
    assert.equal(w.document.querySelector('#xml-form-nfe details.xml-avancado'),null);
    assert.equal(w.document.querySelector('.xml-scenarios').tagName,'SECTION');
    assert.ok(w.document.querySelector('#xml-form-nfe .produto-detalhes'));
    recinto.value='0121300';transportador.value='Transportadora Teste';
    w.gerarXMLComCampos();
    assert.equal(run("xmlsGerados.nfe.querySelector('infAdic > infCpl').textContent"),'Código RA 0121300');
    assert.equal(run("xmlsGerados.nfe.querySelector('transp > transporta > xNome').textContent"),'Transportadora Teste');
    assert.equal(recinto.value,'0121300');
  } finally {dom.window.close();}
});

test('editor e validação usam seletores de XML personalizados e diretos', async () => {
  const {dom,w}=await abrir();
  try {
    const editorInput=w.document.getElementById('editor-file-input');
    const validacaoInput=w.document.getElementById('validacao-arquivos');
    assert.equal(editorInput.style.display,'none');
    assert.equal(validacaoInput.hidden,true);
    assert.equal(w.document.querySelector('.editor-dropzone-inner').tagName,'BUTTON');
    assert.equal(w.document.querySelector('.validacao-dropzone-inner').tagName,'BUTTON');
    assert.equal(w.document.querySelector('.editor-dropzone-recursos'),null);
  } finally {dom.window.close();}
});

test('cabeçalho permanece direto sem gaveta de atalhos', async () => {
  const {dom,w}=await abrir();
  try {
    assert.equal(w.document.querySelector('.workspace-shortcuts'),null);
    assert.equal(w.document.querySelector('.header-actions')?.children.length,2);
    assert.equal(w.document.querySelector('.header-actions')?.firstElementChild?.id,'theme-btn');
    assert.ok(w.document.querySelector('.app-settings'));
    assert.match(w.document.querySelector('.sidebar-brand')?.textContent,/FUTURE G/);
  } finally {dom.window.close();}
});

test('shell FUTURE G alterna ambiente sem reload e persiste a escolha', async () => {
  const {dom,w}=await abrir({'futureg:environment':'port'});
  try {
    const documentBefore=w.document;
    const general=w.document.querySelector('.environment-option[data-environment="general"]');
    const port=w.document.querySelector('.environment-option[data-environment="port"]');
    assert.equal(w.document.body.dataset.environment,'port');
    assert.equal(port.getAttribute('aria-pressed'),'true');
    assert.equal(w.document.getElementById('active-environment-label').textContent,'QA Portuário');
    general.click();
    assert.equal(w.document,documentBefore);
    assert.equal(w.document.body.dataset.environment,'general');
    assert.equal(general.getAttribute('aria-pressed'),'true');
    assert.equal(port.getAttribute('aria-pressed'),'false');
    assert.equal(JSON.parse(w.localStorage.getItem('futureg:environment')),'general');
    assert.match(w.document.getElementById('app-status-live').textContent,/Geradores Gerais/);
  } finally {dom.window.close();}
});

test('registry projeta navegação, descoberta, favoritos e lote por ambiente', async () => {
  const state={
    'thegenerator:registry-version':1,
    'thegenerator:favorite-generators':['conteiner','cpf','rg'],
    'futureg:environment':'general'
  };
  const {dom,w,run}=await abrir(state);
  try {
    assert.equal(run("GENERATORS.every(g=>g.id&&g.label&&g.description&&g.category&&g.route&&g.keywords.length&&g.environments.length&&g.capabilities)"),true);
    assert.equal(run("new Set(GENERATORS.map(g=>g.id)).size"),run('GENERATORS.length'));
    assert.equal(run("generatorsForEnvironment('general').some(g=>g.id==='conteiner')"),false);
    assert.equal(run("generatorsForEnvironment('general').some(g=>g.id==='rg')"),true);
    assert.equal([...w.document.getElementById('lote-tipo').options].some(option=>option.value==='conteiner'),false);
    assert.doesNotMatch(w.document.getElementById('home-favorites').textContent,/Contêiner/);
    assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:favorite-generators')),['conteiner','cpf','rg']);

    w.definirAmbiente('port');
    assert.equal(w.document.getElementById('tab-btn-cadastro').hidden,true);
    assert.equal(run("generatorsForEnvironment('port').some(g=>g.id==='conteiner')"),true);
    assert.equal(run("generatorsForEnvironment('port').some(g=>g.id==='rg')"),false);
    assert.equal([...w.document.getElementById('lote-tipo').options].some(option=>option.value==='conteiner'),true);
    assert.match(w.document.getElementById('home-favorites').textContent,/Contêiner/);
    assert.doesNotMatch(w.document.getElementById('home-favorites').textContent,/RG/);

    w.openGenerator('conteiner');w.generateSelectedDocument();
    const result=w.document.getElementById('output-val').textContent;
    w.definirAmbiente('general');
    assert.equal(w.document.getElementById('tab-home').hidden,false);
    assert.equal(run('selectedGeneratorId'),null);
    assert.equal(w.document.getElementById('output-val').textContent,result);
    assert.equal(w.document.getElementById('tab-btn-cadastro').hidden,false);
  } finally {dom.window.close();}
});

test('ambientes não compartilham geradores, documentos, sugestões nem dados compostos', async () => {
  const {dom,w,run}=await abrir();
  try {
    assert.equal(run('GENERATORS.every(generator=>generator.environments.length===1)'),true);
    assert.equal(run("JSON.stringify(generatorsForEnvironment('general').filter(generator=>generator.environments.includes('port')).map(generator=>generator.id))"),'[]');
    assert.equal(run("JSON.stringify(generatorsForEnvironment('port').filter(generator=>generator.environments.includes('general')).map(generator=>generator.id))"),'[]');
    for(const id of ['xml-form-tipo','xml-preview-tipo','validacao-gerado-tipo','validacao-negativa-tipo','chat-anexo-tipo']) {
      assert.deepEqual([...w.document.getElementById(id).options].map(option=>option.value),['nfe'],id);
    }
    assert.doesNotMatch(w.document.getElementById('chat-sugestoes').textContent,/contêiner|booking|motorista/i);
    assert.match(w.document.getElementById('sidebar-brand-mark').src,/future-g-mark-general\.svg$/);
    assert.equal(w.document.getElementById('theme-color').content,'#2d1b45');
    const cadastro=run("gerarRegistro('cadastro').valor");
    assert.equal(Object.hasOwn(cadastro,'conteiner'),false);
    assert.equal(Object.hasOwn(cadastro,'lacre'),false);

    w.document.getElementById('chat-pedido').value='5 contêineres';
    w.enviarChatLocal();
    assert.match(w.document.getElementById('chat-status').textContent,/não está disponível em Geradores Gerais/);

    w.definirAmbiente('port');
    for(const id of ['xml-form-tipo','xml-preview-tipo','validacao-gerado-tipo','validacao-negativa-tipo','chat-anexo-tipo']) {
      assert.deepEqual([...w.document.getElementById(id).options].map(option=>option.value),['cte'],id);
    }
    assert.doesNotMatch(w.document.getElementById('chat-sugestoes').textContent,/CPF|CNPJ|cadastro|empresa/i);
    assert.match(w.document.getElementById('sidebar-brand-mark').src,/future-g-mark\.svg$/);
    assert.equal(w.document.getElementById('theme-color').content,'#071a33');
    assert.equal(w.document.querySelector('[data-generator-id="cpf"]'),null);
    assert.ok(w.document.querySelector('[data-generator-id="conteiner"]'));
  } finally {dom.window.close();}
});

test('home filtra geradores portuários, fixa favoritos e salva somente identificadores', async () => {
  const {dom,w}=await abrir({'futureg:environment':'port'});
  try {
    const cards=()=>[...w.document.querySelectorAll('[data-home-card]')];
    assert.equal(cards().length,6);
    const search=w.document.getElementById('home-generator-search');
    search.value='conteiner';search.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.equal(cards().length,w.generatorsForEnvironment('port').filter(generator=>generator.discoverable!==false&&w.matchesGenerator(generator,'conteiner')).length);
    const cardConteiner=cards().find(card=>card.dataset.homeCard==='conteiner');
    assert.ok(cardConteiner);
    cardConteiner.querySelector('[data-home-favorite]').click();
    const saved=JSON.parse(w.localStorage.getItem('thegenerator:favorite-generators'));
    assert.deepEqual(saved,['conteiner']);
    assert.equal(saved.some(value=>/MSCU|\d{11}/.test(value)),false);
    assert.match(w.document.getElementById('home-favorites').textContent,/Contêiner/);
  } finally {dom.window.close();}
});

test('Home gera opções simples diretamente, registra histórico uma vez e oferece detalhes', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.document.querySelector('[data-home-select="cpf"]').click();
    assert.equal(w.document.getElementById('tab-docs').hidden,false);
    assert.ok(run('currentValue'));
    assert.equal(w.document.getElementById('home-result'),null);
    assert.equal(w.document.getElementById('docs-generate-btn').hidden,true);
    const value=w.document.getElementById('output-val').textContent;
    assert.equal(w.validarCPF(value.replace(/\D/g,'')),true);
    assert.equal(run('historicoDocsList.length'),1);
    assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:recent-generators')),['cpf']);
    w.document.getElementById('docs-expand-btn').click();
    assert.equal(w.document.getElementById('docs-result-details').hidden,false);
    assert.ok(w.document.getElementById('docs-result-details').textContent.includes(value));
    w.document.getElementById('docs-clear-btn').click();
    assert.equal(run('currentValue'),'');
    assert.equal(w.document.getElementById('copy-btn').disabled,true);
  } finally {dom.window.close();}
});

test('fase 5 separa geração direta de configuração e mantém conteúdo primário visível', async () => {
  const {dom,w,run}=await abrir();
  try {
    const search=w.document.querySelector('.docs-search');
    const heading=w.document.querySelector('.workspace-section-heading');
    assert.ok(search.compareDocumentPosition(heading)&w.Node.DOCUMENT_POSITION_FOLLOWING);
    const groups=[...w.document.querySelectorAll('#docs-generator-list .docs-generator-group')];
    assert.ok(groups.length>0);
    assert.equal(groups.every(group=>group.tagName==='SECTION'),true);
    assert.equal(w.document.querySelector('#docs-generator-list details'),null);

    w.document.querySelector('[data-generator-id="nome"]').click();
    assert.equal(run('currentType'),'nome');
    assert.ok(run('currentValue'));
    assert.equal(w.document.getElementById('docs-generate-btn').hidden,true);

    w.clearDocumentResult();
    w.document.querySelector('[data-generator-id="telefone"]').click();
    assert.equal(run('currentValue'),'');
    assert.equal(w.document.getElementById('docs-phone-options').hidden,false);
    assert.equal(w.document.getElementById('docs-generate-btn').hidden,false);
    w.document.getElementById('docs-generate-btn').click();
    assert.equal(run('currentType'),'telefone');
    assert.ok(run('currentValue'));
  } finally {dom.window.close();}
});

test('fase 5 usa o espaço do assistente e isola Cadastro Geral de campos portuários', async () => {
  const {dom,w}=await abrir();
  try {
    const chat=w.document.querySelector('.chat-painel');
    assert.ok(chat);
    assert.equal(chat.classList.contains('painel-novo'),false);
    const cadastro=w.document.getElementById('tab-cadastro');
    assert.doesNotMatch(cadastro.textContent,/Contêiner|Lacre de armador/);
    assert.doesNotMatch(cadastro.querySelector('#cad_nome').getAttribute('placeholder'),/motorista/i);
    assert.doesNotMatch(cadastro.querySelector('#cad_empresa').getAttribute('placeholder'),/transportadora/i);
    assert.equal(cadastro.querySelector('#cad_conteiner'),null);
    assert.equal(cadastro.querySelector('#cad_lacre'),null);
  } finally {dom.window.close();}
});

test('Cadastro Geral gera ficha somente com os grupos selecionados e restaura histórico legado', async () => {
  const {dom,w,run}=await abrir();
  try {
    const grupos=[...w.document.querySelectorAll('input[name="cadastro-grupo"]')];
    assert.deepEqual(grupos.map(input=>input.value),['identificacao','documentos','contato','endereco','profissionais']);
    assert.ok(grupos.every(input=>input.checked));

    w.selecionarGruposCadastro(false);
    assert.match(w.document.getElementById('cadastro-group-status').textContent,/0 de 5/);
    w.gerarCadastroCompleto();
    assert.equal(run('historicoList.length'),0);
    assert.equal(w.document.activeElement,grupos[0]);

    for(const id of ['identificacao','contato']) {
      w.document.querySelector(`input[name="cadastro-grupo"][value="${id}"]`).checked=true;
    }
    w.atualizarSelecaoGruposCadastro();
    w.gerarCadastroCompleto();

    assert.ok(w.document.getElementById('cad_nome').value);
    assert.ok(w.document.getElementById('cad_tel').value);
    for(const id of ['cad_cpf','cad_rg','cad_cnh','cad_endereco','cad_empresa','cad_cnpj','cad_placa']) {
      assert.equal(w.document.getElementById(id).value,'',id);
    }
    assert.deepEqual(
      [...w.document.querySelectorAll('#result-grid-items [data-result-group]')].map(section=>section.dataset.resultGroup),
      ['identificacao','contato']
    );
    assert.deepEqual(JSON.parse(run('JSON.stringify(historicoList[0].dados.grupos)')),['identificacao','contato']);
    assert.match(run('formatarCadastroTexto(getCadastroDados())'),/^\[Identificação\][\s\S]*\[Contato\]/);

    run('delete historicoList[0].dados.grupos; selecionarGruposCadastro(false); restaurarDoHistorico(0)');
    assert.deepEqual(grupos.filter(input=>input.checked).map(input=>input.value),['identificacao','contato']);

    w.selecionarGruposCadastro(true);
    w.gerarCadastroCompleto();
    assert.equal(w.document.querySelectorAll('#result-grid-items [data-result-group]').length,5);
    assert.match(w.document.getElementById('cadastro-result-status').textContent,/5 grupos gerados/);
  } finally {dom.window.close();}
});

test('atalhos da home e sidebar retrátil mantêm foco e preferência', async () => {
  const {dom,w}=await abrir();
  try {
    w.document.body.focus();
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'/',bubbles:true}));
    assert.equal(w.document.activeElement.id,'home-generator-search');
    const collapse=w.document.getElementById('sidebar-collapse-btn');
    collapse.click();
    assert.equal(w.document.body.classList.contains('sidebar-collapsed'),true);
    assert.equal(w.document.getElementById('setting-sidebar-collapsed'),null);
    assert.equal(collapse.getAttribute('aria-expanded'),'false');
    assert.equal(collapse.textContent.trim(),'');
    assert.equal(JSON.parse(w.localStorage.getItem('thegenerator:sidebar-collapsed')),true);
    w.document.querySelector('[data-home-select="nome"]').click();
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',ctrlKey:true,bubbles:true}));
    await new Promise(resolve=>w.setTimeout(resolve,230));
    assert.ok(w.document.getElementById('output-val').textContent.trim().split(/\s+/).length>=2);
  } finally {dom.window.close();}
});

test('quantidade de lote antecipa quantos registros serão gerados', async () => {
  const {dom,w}=await abrir();
  try {
    const quantity=w.document.getElementById('lote-quantidade');
    quantity.value='25';quantity.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.match(w.document.getElementById('lote-status').textContent,/25 registros serão gerados/);
  } finally {dom.window.close();}
});

test('busca de geradores ignora acentos e limpar restaura opções', async () => {
  const {dom,w,run}=await abrir();
  try {
    const input=w.document.getElementById('docs-search');
    const buttons=()=>[...w.document.querySelectorAll('#docs-generator-list button')].filter(b=>!b.hidden);
    const total=buttons().length;
    assert.equal(total,run("generatorsForEnvironment('general').filter(g=>g.route==='docs'&&g.discoverable!==false).length"));
    const groups=[...w.document.querySelectorAll('#docs-generator-list [role="group"]')];
    assert.equal(groups.length,Object.keys(JSON.parse(run("JSON.stringify(generatorCategoriesForEnvironment('general','docs'))"))).length);
    for(const group of groups) {
      assert.ok(group.getAttribute('aria-label'));
      assert.equal(new Set([...group.querySelectorAll('button')].map(b=>b.dataset.category)).size,1);
    }
    const category=w.document.getElementById('docs-category');
    category.value='empresa';category.dispatchEvent(new w.Event('change'));
    assert.equal(buttons().length,run("generatorsForEnvironment('general').filter(g=>g.route==='docs'&&g.category==='empresa'&&g.discoverable!==false).length"));
    input.value='cnpj';input.dispatchEvent(new w.Event('input'));
    assert.equal(buttons().length,2);
    w.document.getElementById('docs-search-clear').click();
    assert.equal(category.value,'todas');
    w.definirAmbiente('port');
    input.value='CONTEINER';input.dispatchEvent(new w.Event('input'));
    assert.equal(buttons().length,run("generatorsForEnvironment('port').filter(g=>g.route==='docs'&&g.discoverable!==false&&matchesGenerator(g,'CONTEINER')).length"));
    assert.ok(buttons().some(button=>/Contêiner/.test(button.textContent)));
    input.value='inexistente';input.dispatchEvent(new w.Event('input'));
    assert.equal(buttons().length,0);
    assert.match(w.document.getElementById('docs-search-status').textContent,/Nenhum/);
    w.document.getElementById('docs-search-clear').click();
    assert.equal(buttons().length,run("generatorsForEnvironment('port').filter(g=>g.route==='docs'&&g.discoverable!==false).length"));
    assert.equal(w.document.activeElement,input);
  } finally {dom.window.close();}
});

test('opções de documentos aparecem somente no contexto pertinente', async () => {
  const {dom,w}=await abrir();
  try {
    const nome=w.document.getElementById('docs-option-name');
    const mascara=w.document.getElementById('docs-option-mask');
    const telefone=w.document.getElementById('docs-phone-options');
    assert.equal(nome.hidden,true);
    assert.equal(telefone.hidden,true);
    w.gerarCPFComToggle();
    assert.equal(nome.hidden,false);
    assert.equal(mascara.hidden,false);
    assert.equal(telefone.hidden,true);
    w.gerarTelefone();
    assert.equal(nome.hidden,true);
    assert.equal(mascara.hidden,false);
    assert.equal(telefone.hidden,false);
    w.gerarDocumentoExtra('booking');
    w.document.getElementById('lote-tipo').value='telefone';
    w.document.getElementById('lote-tipo').dispatchEvent(new w.Event('change'));
    assert.equal(nome.hidden,true);
    assert.equal(telefone.hidden,false);
  } finally {dom.window.close();}
});

test('sidebar única: Escape retorna foco e navegação mobile fecha sem perder contexto', async () => {
  const {dom,w}=await abrir();
  try {
    const button=w.document.getElementById('sidebar-collapse-btn');
    w.definirSidebar(false);
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(w.document.activeElement,button);
    assert.equal(button.getAttribute('aria-expanded'),'false');
    assert.equal(w.document.getElementById('workspace-menu-toggle'),null);
    w.matchMedia=()=>({matches:true});w.definirSidebar(false);w.switchTab('docs');
    assert.equal(button.getAttribute('aria-expanded'),'false');
    assert.equal(w.document.activeElement.id,'tab-docs');
    assert.equal(w.document.getElementById('app-title').textContent,'Dados cadastrais');
  } finally {dom.window.close();}
});

test('HTML e todos os scripts inicializam; IDs únicos e arquivos locais existentes', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids = [...w.document.querySelectorAll('[id]')].map(el => el.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const file of scripts) assert.ok(fs.existsSync(path.join(root, file)));
    assert.equal(w.document.querySelectorAll('#downloadArea a').length, 1);
    assert.match(w.document.getElementById('xml-preview-code').textContent, /nfeProc/);
    assert.equal(run('JSON.stringify(Object.keys(xmlsGerados))'), '["nfe"]');
    w.definirAmbiente('port');
    assert.equal(w.document.querySelectorAll('#downloadArea a').length, 1);
    assert.match(w.document.getElementById('xml-preview-code').textContent, /cteProc/);
    assert.equal(run('JSON.stringify(Object.keys(xmlsGerados))'), '["cte"]');
  } finally { dom.window.close(); }
});

test('controles interativos possuem nome acessível verificável', async () => {
  const {dom,w}=await abrir();
  try {
    const texto=valor=>String(valor || '').replace(/\s+/g,' ').trim();
    const nomeAcessivel=elemento=>{
      const ids=texto(elemento.getAttribute('aria-labelledby')).split(' ').filter(Boolean);
      const referenciado=ids.map(id=>texto(w.document.getElementById(id)?.textContent)).filter(Boolean).join(' ');
      const label=elemento.id ? w.document.querySelector(`label[for="${elemento.id}"]`) : null;
      return texto(elemento.getAttribute('aria-label')) || referenciado || texto(label?.textContent) || texto(elemento.closest('label')?.textContent) || texto(elemento.textContent) || texto(elemento.getAttribute('title'));
    };
    const controles=[...w.document.querySelectorAll('button,input:not([type="hidden"]),select,textarea,a[href],summary')];
    const semNome=controles.filter(elemento=>!nomeAcessivel(elemento)).map(elemento=>elemento.id || elemento.outerHTML.slice(0,80));
    assert.deepEqual(semNome,[]);
  } finally {dom.window.close();}
});

test('500 CPFs e CNPJs de cada formato: válidos, distintos e letras também na filial', async () => {
  const { dom, run } = await abrir();
  try {
    for (const tipo of ['cpf','cnpj','cnpj-alfa']) {
      const resultados = run(`gerarLoteDados([{tipo:'${tipo}',quantidade:500}], {mascara:false})`);
      assert.equal(new Set(resultados.map(r => r.valor)).size, 500);
      for (const r of resultados) assert.equal(run(`${tipo === 'cpf' ? 'validarCPF' : 'validarCNPJ'}('${r.valor}')`), true);
      if (tipo === 'cnpj-alfa') assert.ok(resultados.some(r => /[A-Z]/.test(r.valor.slice(8,12))));
    }
    assert.equal(run("validarCPF('00000000000')"), false);
    assert.equal(run("validarCPF('52998224725')"), true);
    assert.equal(run("validarCNPJ('12ABC34501DE35')"), true);
    assert.equal(run("validarCNPJ('12ABC34501DE36')"), false);
    assert.equal(run("validarCNPJ('12ABC34501DE35xx')"), false);
  } finally { dom.window.close(); }
});

test('fase 6 inicia Pessoas com RG paulista e CNH válidos, distintos e disponíveis em lote', async () => {
  const { dom, w, run } = await abrir();
  try {
    const grupos=[...w.document.querySelectorAll('#docs-generator-list .docs-generator-group')];
    assert.equal(grupos[0].querySelector('.section-label').textContent,'Pessoa física');
    assert.deepEqual([...grupos[0].querySelectorAll('button')].map(button=>button.textContent),['CPF','Nome completo','RG','CNH','Crachá']);
    assert.equal(run("generatorById('rg').description"),'Registro de identidade no padrão de São Paulo');
    assert.equal(run("generatorById('rg').capabilities.validate"),true);
    assert.equal(run("generatorById('cnh').capabilities.validate"),true);
    for (const tipo of ['rg','cnh']) {
      const registros=run(`gerarLoteDados([{tipo:'${tipo}',quantidade:500}],{mascara:true})`);
      assert.equal(new Set(registros.map(registro=>registro.valor)).size,500);
      for(const registro of registros) {
        if(tipo==='rg') {
          assert.match(registro.valor,/^\d{2}\.\d{3}\.\d{3}-[0-9X]$/);
          assert.equal(run(`validarRGSP(${JSON.stringify(registro.valor)})`),true);
        } else {
          assert.match(registro.valor,/^\d{11}$/);
          assert.equal(run(`validarCNH(${JSON.stringify(registro.valor)})`),true);
        }
      }
    }
    assert.equal(run("validarRGSP('00.000.000-0')"),false);
    assert.equal(run("validarCNH('00000000000')"),false);
    const rg=run("gerarRegistro('rg',{mascara:true}).valor");
    const cnh=run("gerarRegistro('cnh').valor");
    assert.match(run(`conferirDocumento(${JSON.stringify(rg)}).mensagem`),/RG \(SP\): dígito consistente/);
    assert.match(run(`conferirDocumento(${JSON.stringify(cnh)}).mensagem`),/CNH.*dígitos consistentes/);
  } finally { dom.window.close(); }
});

test('fase 6 amplia empresas, endereços e veículos no registry e no lote', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids=['nome-fantasia','endereco','cep','renavam'];
    assert.deepEqual(JSON.parse(run(`JSON.stringify(${JSON.stringify(ids)}.map(id=>generatorById(id).category))`)),['empresa','endereco','endereco','veiculo']);
    for(const id of ids) {
      assert.equal(run(`generatorById('${id}').environments.includes('general')`),true);
      assert.equal(run(`generatorById('${id}').environments.includes('port')`),false);
      assert.equal(run(`generatorById('${id}').capabilities.batch`),true);
      assert.ok(w.document.querySelector(`[data-generator-id="${id}"]`));
      assert.ok([...w.document.getElementById('lote-tipo').options].some(option=>option.value===id));
    }

    const nomes=run("gerarLoteDados([{tipo:'nome-fantasia',quantidade:100}])");
    assert.equal(new Set(nomes.map(registro=>registro.valor)).size,100);
    const enderecos=run("gerarLoteDados([{tipo:'endereco',quantidade:100}])");
    enderecos.forEach(registro=>assert.match(registro.valor,/, \d+ - .+, .+\/[A-Z]{2} - CEP \d{5}-\d{3}$/));
    const ceps=run("gerarLoteDados([{tipo:'cep',quantidade:100}],{mascara:true})");
    ceps.forEach(registro=>assert.match(registro.valor,/^\d{5}-\d{3}$/));
    const cepsSemMascara=run("gerarLoteDados([{tipo:'cep',quantidade:100}],{mascara:false})");
    cepsSemMascara.forEach(registro=>assert.match(registro.valor,/^\d{8}$/));

    assert.equal(run("calcularDigitoRenavam('2250006241')"),3);
    const renavams=run("gerarLoteDados([{tipo:'renavam',quantidade:500}])");
    assert.equal(new Set(renavams.map(registro=>registro.valor)).size,500);
    renavams.forEach(registro=>{
      assert.match(registro.valor,/^\d{11}$/);
      assert.equal(run(`validarRenavam('${registro.valor}')`),true);
    });
    assert.equal(run("validarRenavam('00000000000')"),false);
    assert.match(run("conferirDocumento('22500062413').mensagem"),/RENAVAM: dígitos consistentes/);
  } finally { dom.window.close(); }
});

test('fase 6 adiciona utilitários de desenvolvimento seguros para documentação', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids=['uuid-v4','ipv4-documentacao','ipv6-documentacao','mac-local'];
    for(const id of ids) {
      assert.equal(run(`generatorById('${id}').category`),'desenvolvimento');
      assert.equal(run(`generatorById('${id}').environments.includes('general')`),true);
      assert.equal(run(`generatorById('${id}').environments.includes('port')`),false);
      assert.equal(run(`generatorById('${id}').capabilities.batch`),true);
      assert.ok(w.document.querySelector(`[data-generator-id="${id}"]`));
      assert.ok([...w.document.getElementById('lote-tipo').options].some(option=>option.value===id));
    }

    const uuids=run("gerarLoteDados([{tipo:'uuid-v4',quantidade:500}])");
    assert.equal(new Set(uuids.map(registro=>registro.valor)).size,500);
    uuids.forEach(registro=>assert.match(registro.valor,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));

    const ipv4=run("gerarLoteDados([{tipo:'ipv4-documentacao',quantidade:500}])");
    assert.equal(new Set(ipv4.map(registro=>registro.valor)).size,500);
    ipv4.forEach(registro=>{
      assert.match(registro.valor,/^(192\.0\.2|198\.51\.100|203\.0\.113)\.(?:[1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-4])$/);
    });

    const ipv6=run("gerarLoteDados([{tipo:'ipv6-documentacao',quantidade:500}])");
    assert.equal(new Set(ipv6.map(registro=>registro.valor)).size,500);
    ipv6.forEach(registro=>assert.match(registro.valor,/^2001:db8(?::[1-9a-f][0-9a-f]{0,3}){6}$/));

    const macs=run("gerarLoteDados([{tipo:'mac-local',quantidade:500}])");
    assert.equal(new Set(macs.map(registro=>registro.valor)).size,500);
    macs.forEach(registro=>{
      assert.match(registro.valor,/^(?:[0-9A-F]{2}:){5}[0-9A-F]{2}$/);
      assert.equal(Number.parseInt(registro.valor.slice(0,2),16)&3,2);
    });
  } finally { dom.window.close(); }
});

test('fase 6 adiciona fixtures financeiras sem instrumentos reais', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids=['valor-brl','pix-evp','transacao-teste'];
    for(const id of ids) {
      assert.equal(run(`generatorById('${id}').category`),'financeiro');
      assert.equal(run(`generatorById('${id}').environments.includes('general')`),true);
      assert.equal(run(`generatorById('${id}').environments.includes('port')`),false);
      assert.equal(run(`generatorById('${id}').capabilities.batch`),true);
      assert.ok(w.document.querySelector(`[data-generator-id="${id}"]`));
      assert.ok([...w.document.getElementById('lote-tipo').options].some(option=>option.value===id));
    }

    const valores=run("gerarLoteDados([{tipo:'valor-brl',quantidade:500}])");
    assert.equal(new Set(valores.map(registro=>registro.valor)).size,500);
    valores.forEach(registro=>assert.match(registro.valor,/^R\$ (?:\d{1,3})(?:\.\d{3})*,\d{2}$/));

    const chaves=run("gerarLoteDados([{tipo:'pix-evp',quantidade:500}])");
    assert.equal(new Set(chaves.map(registro=>registro.valor)).size,500);
    chaves.forEach(registro=>assert.match(registro.valor,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
    assert.match(run("generatorById('pix-evp').description"),/não registrado no DICT/);

    const transacoes=run("gerarLoteDados([{tipo:'transacao-teste',quantidade:500}])");
    assert.equal(new Set(transacoes.map(registro=>registro.valor)).size,500);
    transacoes.forEach(registro=>assert.match(registro.valor,/^TX-TESTE-\d{8}-[0-9A-F]{16}$/));
    assert.equal(run("GENERATORS.some(generator=>/cartão|conta bancária|boleto/i.test(generator.label))"),false);
  } finally { dom.window.close(); }
});

test('fase 6 adiciona crachá sintético visual, restaurável e exportável', async () => {
  const { dom, w, run } = await abrir();
  try {
    assert.deepEqual(JSON.parse(run('JSON.stringify(Object.keys(CRACHA_MODELOS))')),['funcionario']);
    assert.equal(run("generatorById('cracha').category"),'pessoa');
    assert.equal(run("generatorById('cracha').environments.join(',')"),'general');
    assert.equal(run("generatorById('cracha').capabilities.batch"),true);
    assert.equal(run("generatorById('cracha').capabilities.export"),true);
    assert.ok(w.document.querySelector('[data-generator-id="cracha"]'));
    assert.ok([...w.document.getElementById('lote-tipo').options].some(option=>option.value==='cracha'));

    w.openGenerator('cracha');
    assert.equal(w.document.getElementById('docs-badge-options').hidden,false);
    assert.equal(w.document.getElementById('docs-generate-btn').hidden,false);
    w.generateSelectedDocument();
    const primeiro=JSON.parse(run('JSON.stringify(crachaAtual)'));
    assert.match(primeiro.codigo,/^CR-\d{6}$/);
    assert.match(primeiro.matricula,/^MAT-\d{4}-\d{6}$/);
    assert.match(primeiro.validade,/^\d{2}\/\d{2}\/\d{4}$/);
    assert.match(primeiro.avatar,/^[A-ZÁÉÍÓÚÃÕÇ]{2}$/i);
    assert.equal(primeiro.modelo,'Funcionário');
    assert.equal(primeiro.status,'ATIVO');
    assert.match(primeiro.codigo_barras,/^TESTE-CR\d{6}$/);
    assert.equal(w.document.getElementById('badge-preview').hidden,false);
    assert.equal(w.document.getElementById('badge-nome').textContent,primeiro.nome);
    assert.equal(w.document.getElementById('output-val').textContent,primeiro.codigo);
    assert.equal(run('historicoDocsList.length'),1);

    let copiado='';
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async valor=>{copiado=valor;}},configurable:true});
    w.copiarCodigoCracha();
    await new Promise(resolve=>w.setTimeout(resolve,0));
    assert.equal(copiado,primeiro.codigo);

    w.document.getElementById('gerador-cracha-codigo-barras').checked=false;
    w.gerarNovoDocumentoAtual();
    assert.notEqual(run('crachaAtual.codigo'),primeiro.codigo);
    assert.equal(run('crachaAtual.codigo_barras'),'');
    assert.equal(w.document.getElementById('badge-barcode').hidden,true);
    run("gerarDocumentoExtra('uuid-v4'); restaurarHistoricoDocs(1)");
    assert.equal(w.document.getElementById('badge-preview').hidden,false);
    assert.equal(w.document.getElementById('nome-box').classList.contains('visible'),false);

    const lote=run("var loteCracha=gerarLoteDados([{tipo:'cracha',quantidade:500}],{codigoBarras:true}); loteCracha");
    assert.equal(new Set(lote.map(registro=>registro.valor.codigo)).size,500);
    lote.forEach(registro=>{
      assert.deepEqual(Object.keys(registro.valor),['modelo','modelo_id','avatar','nome','codigo','empresa','funcao','matricula','validade','status','codigo_barras']);
      assert.match(registro.valor.codigo,/^CR-\d{6}$/);
    });
    run('var downloadsCracha=[]; baixarTexto=(nome,texto,mime)=>downloadsCracha.push({nome,texto,mime}); exportarRegistros(loteCracha,"csv")');
    assert.match(run('downloadsCracha[0].texto.split("\\r\\n")[0]'),/modelo.*codigo.*validade.*codigo_barras/);
    assert.equal(run('downloadsCracha[0].texto.split("\\r\\n").length'),501);
  } finally { dom.window.close(); }
});

test('fase 6 registra todos os novos geradores para busca, favoritos e recentes', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids=['rg','cnh','nome-fantasia','endereco','cep','renavam','uuid-v4','ipv4-documentacao','ipv6-documentacao','mac-local','valor-brl','pix-evp','transacao-teste','cracha'];
    const homeSearch=w.document.getElementById('home-generator-search');
    const docsSearch=w.document.getElementById('docs-search');
    for(const id of ids) {
      const generator=w.generatorById(id);
      assert.ok(generator,id);
      assert.equal(generator.environments.join(','),'general',id);
      assert.equal(generator.capabilities.batch,true,id);
      assert.equal(generator.capabilities.export,true,id);
      assert.ok(generator.keywords.length>=3,id);

      homeSearch.value=generator.label;
      homeSearch.dispatchEvent(new w.Event('input',{bubbles:true}));
      const card=w.document.querySelector(`[data-home-card="${id}"]`);
      assert.ok(card,`home:${id}`);
      card.querySelector('[data-home-favorite]').click();
      assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:favorite-generators')),[id]);
      assert.match(w.document.getElementById('home-favorites').textContent,new RegExp(generator.label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
      w.document.querySelector(`[data-home-favorite="${id}"]`).click();
      assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:favorite-generators')),[]);

      docsSearch.value=generator.label;
      docsSearch.dispatchEvent(new w.Event('input',{bubbles:true}));
      assert.equal(w.document.querySelector(`[data-generator-id="${id}"]`).hidden,false,`docs:${id}`);
      assert.match(w.document.getElementById('docs-search-status').textContent,/opções disponíveis/);

      w.registerGeneratorUse(id);
      assert.equal(JSON.parse(w.localStorage.getItem('thegenerator:recent-generators'))[0],id);
      assert.match(w.document.getElementById('home-recents').textContent,new RegExp(generator.label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    }
    w.definirAmbiente('port');
    for(const id of ids) {
      assert.equal(w.document.querySelector(`[data-home-card="${id}"]`),null,`port-home:${id}`);
      assert.equal(w.document.querySelector(`[data-generator-id="${id}"]`),null,`port-docs:${id}`);
      assert.equal([...w.document.getElementById('lote-tipo').options].some(option=>option.value===id),false,`port-batch:${id}`);
    }
    assert.equal(run(`JSON.stringify(readGeneratorIds(RECENTS_KEY).slice(0,5))`),JSON.stringify(ids.slice(-5).reverse()));
  } finally { dom.window.close(); }
});

test('fase 6 exporta lote heterogêneo completo e respeita opções do crachá', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids=['rg','cnh','nome-fantasia','endereco','cep','renavam','uuid-v4','ipv4-documentacao','ipv6-documentacao','mac-local','valor-brl','pix-evp','transacao-teste','cracha'];
    const pedidos=ids.map(tipo=>({tipo,quantidade:3}));
    run(`var loteFase6=gerarLoteDados(${JSON.stringify(pedidos)},{mascara:true,codigoBarras:true}); var downloadsFase6=[]; baixarTexto=(nome,texto,mime)=>downloadsFase6.push({nome,texto,mime}); exportarRegistros(loteFase6,'json'); exportarRegistros(loteFase6,'csv'); exportarRegistros(loteFase6,'txt')`);
    const lote=run('loteFase6');
    assert.equal(lote.length,ids.length*3);
    for(const id of ids) assert.equal(lote.filter(registro=>registro.tipo===id).length,3,id);
    const downloads=run('downloadsFase6');
    assert.equal(JSON.parse(downloads[0].texto).length,lote.length);
    assert.equal(downloads[1].texto.split('\r\n').length,lote.length+1);
    assert.equal(downloads[2].texto.split('\n\n').length,lote.length);
    assert.match(downloads[1].texto.split('\r\n')[0],/valor.*modelo.*codigo.*validade.*codigo_barras/);
    for(const registro of lote) {
      const texto=typeof registro.valor==='object' ? registro.valor.codigo : String(registro.valor);
      assert.ok(downloads[0].texto.includes(texto),`json:${registro.tipo}`);
      assert.ok(downloads[2].texto.includes(texto),`txt:${registro.tipo}`);
    }

    w.document.getElementById('lote-tipo').value='cracha';
    w.document.getElementById('lote-quantidade').value='3';
    w.document.getElementById('gerador-cracha-codigo-barras').checked=false;
    w.gerarLoteInterface();
    assert.equal(run("ultimoLote.every(registro=>registro.tipo==='cracha'&&!registro.valor.codigo_barras)"),true);
    assert.equal(w.document.querySelectorAll('#lote-resultados .registro-lote').length,3);
  } finally { dom.window.close(); }
});

test('fase 8 cria perfis portuários completos para motorista, operador, visitante e pessoa', async () => {
  const {dom,run}=await abrir();
  try {
    const tipos={motorista:'Motorista','operador-portuario':'Operador portuário','visitante-portuario':'Visitante portuário','pessoa-portuaria':'Pessoa portuária'};
    for(const [tipo,rotulo] of Object.entries(tipos)) {
      const lote=run(`gerarLoteDados([{tipo:'${tipo}',quantidade:40}],{mascara:true})`);
      assert.equal(lote.length,40,tipo);
      for(const registro of lote) {
        const perfil=registro.valor;
        assert.equal(perfil.perfil,rotulo);
        assert.equal(run(`validarCPF(${JSON.stringify(perfil.cpf.replace(/\D/g,''))})`),true);
        assert.equal(run(`validarRGSP(${JSON.stringify(perfil.rg)})`),true);
        assert.match(perfil.telefone,/^\(\d{2}\) /);
        assert.match(perfil.email,/@example\.(?:com|org|net)$/);
        assert.match(perfil.cracha,/^CR-\d{6}$/);
        assert.ok(perfil.endereco);
      }
    }
    const motorista=run("gerarRegistro('motorista').valor");
    assert.equal(run(`validarCNH(${JSON.stringify(motorista.cnh)})`),true);
    assert.match(motorista.placa,/^[A-Z]{3}\d[A-Z]\d{2}$/);
    assert.ok(motorista.empresa);
    const operador=run("gerarRegistro('operador-portuario').valor");
    assert.match(operador.matricula,/^OP-\d{8}$/);
    assert.ok(operador.treinamento_nr29);
    const visitante=run("gerarRegistro('visitante-portuario').valor");
    assert.ok(visitante.empresa_origem);
    assert.ok(visitante.validade_acesso);
  } finally {dom.window.close();}
});

test('fase 8 cria cinco entidades empresariais portuárias com cadastros válidos', async () => {
  const {dom,run}=await abrir();
  try {
    const tipos=['transportadora','cliente-portuario','depositante','importador','exportador'];
    for(const tipo of tipos) {
      const lote=run(`gerarLoteDados([{tipo:'${tipo}',quantidade:40}])`);
      assert.equal(new Set(lote.map(registro=>registro.valor.cnpj)).size,40,tipo);
      for(const registro of lote) {
        const empresa=registro.valor;
        assert.equal(run(`validarCNPJ(${JSON.stringify(empresa.cnpj.replace(/\W/g,''))})`),true);
        assert.ok(empresa.razao_social);
        assert.ok(empresa.nome_fantasia);
        assert.match(empresa.ie,/^\d{12}$/);
        assert.match(empresa.email,/@example\.(?:com|org|net)$/);
        assert.match(empresa.recinto_teste,/^REC-\d{7}$/);
      }
    }
  } finally {dom.window.close();}
});

test('fase 8 gera veículos e contêineres detalhados com identificadores consistentes', async () => {
  const {dom,run}=await abrir();
  try {
    for(const tipo of ['cavalo-mecanico','carreta']) {
      const lote=run(`gerarLoteDados([{tipo:'${tipo}',quantidade:100}])`);
      for(const registro of lote) {
        assert.match(registro.valor.placa,/^[A-Z]{3}\d[A-Z]\d{2}$/);
        assert.equal(run(`validarRenavam(${JSON.stringify(registro.valor.renavam)})`),true);
        assert.ok(registro.valor.eixos>=2);
      }
    }
    const conjunto=run("gerarRegistro('conjunto-veicular').valor");
    assert.match(conjunto.placa_cavalo,/^[A-Z]{3}\d[A-Z]\d{2}$/);
    assert.match(conjunto.placa_carreta,/^[A-Z]{3}\d[A-Z]\d{2}$/);
    assert.equal(run(`validarRenavam(${JSON.stringify(conjunto.renavam_cavalo)})`),true);
    assert.equal(run(`validarRenavam(${JSON.stringify(conjunto.renavam_carreta)})`),true);

    const modelos=JSON.parse(run('JSON.stringify(PORT_CONTAINER_TYPES)'));
    assert.deepEqual(new Set(modelos.map(modelo=>modelo.categoria)),new Set(['Dry','Dry High Cube','Reefer','Open Top','Flat Rack']));
    const conteineres=run("gerarLoteDados([{tipo:'conteiner-detalhado',quantidade:200}])");
    for(const registro of conteineres) {
      const item=registro.valor;
      assert.equal(run(`conferirDocumento(${JSON.stringify(item.conteiner)}).ok`),true);
      assert.match(item.codigo_iso,/^\d{2}[A-Z]\d$/);
      assert.ok(item.peso_bruto_kg>item.tara_kg);
      assert.ok(item.peso_bruto_kg<=item.peso_bruto_maximo_kg);
      assert.equal(item.peso_liquido_kg,item.peso_bruto_kg-item.tara_kg);
    }
  } finally {dom.window.close();}
});

test('fase 8 usa NCMs manuais em cargas e relaciona contêiner quando aplicável', async () => {
  const {dom,w,run}=await abrir();
  try {
    run("ncmsManuais=['11112222','33334444'];storageSet('gerador:ncms_manuais',ncmsManuais)");
    for(const tipo of ['carga-solta','granel-solido','granel-liquido','carga-conteinerizada']) {
      const lote=run(`gerarLoteDados([{tipo:'${tipo}',quantidade:60}])`);
      lote.forEach(registro=>{
        assert.ok(['11112222','33334444'].includes(registro.valor.ncm));
        assert.ok(registro.valor.peso_bruto_kg>registro.valor.peso_liquido_kg);
        assert.ok(registro.valor.quantidade>0);
      });
    }
    const conteinerizada=run("gerarRegistro('carga-conteinerizada').valor");
    assert.equal(run(`conferirDocumento(${JSON.stringify(conteinerizada.conteiner)}).ok`),true);
    assert.match(conteinerizada.lacre,/^[A-Z]{2}\d{7}$/);
    w.definirAmbiente('port');
    assert.equal(w.document.getElementById('ncm-manual-aplicar').hidden,true);
    assert.match(w.document.getElementById('ncm-manual-help').textContent,/geradores de carga/);
    w.definirAmbiente('general');
    assert.equal(w.document.getElementById('ncm-manual-aplicar').hidden,false);
  } finally {dom.window.close();}
});

test('fase 8 centraliza documentos portuários e mantém a chave CT-e consistente', async () => {
  const {dom,run}=await abrir();
  try {
    const chaves=run("gerarLoteDados([{tipo:'chave-cte',quantidade:200}])");
    assert.equal(new Set(chaves.map(registro=>registro.valor)).size,200);
    chaves.forEach(registro=>{
      assert.match(registro.valor,/^\d{44}$/);
      assert.equal(Number(registro.valor.at(-1)),run(`calcularDvChavePortuaria(${JSON.stringify(registro.valor.slice(0,43))})`));
      assert.equal(registro.valor.slice(20,22),'57');
    });
    assert.match(run("gerarRegistro('di').valor"),/^DI-\d{2}\/\d{7}-\d$/);
    assert.match(run("gerarRegistro('duimp').valor"),/^DUIMP-BR-\d{4}-\d{10}$/);
    const documentos=run("gerarRegistro('documento-carga').valor");
    assert.match(documentos.manifesto,/^MDFE-TESTE-/);
    assert.match(documentos.ordem_carga,/^OC-/);
    assert.match(documentos.ticket_balanca,/^TB-/);
    assert.match(documentos.booking,/^BK/);
  } finally {dom.window.close();}
});

test('fase 8 integra todos os novos geradores portuários ao registry, lote e exportação', async () => {
  const {dom,w,run}=await abrir();
  try {
    const ids=['conteiner-detalhado','motorista','operador-portuario','visitante-portuario','pessoa-portuaria','transportadora','cliente-portuario','depositante','importador','exportador','cavalo-mecanico','carreta','conjunto-veicular','carga-solta','granel-solido','granel-liquido','carga-conteinerizada','chave-cte','di','duimp','documento-carga'];
    w.definirAmbiente('port');
    const opcoes=new Set([...w.document.getElementById('lote-tipo').options].map(option=>option.value));
    for(const id of ids) {
      const generator=w.generatorById(id);
      assert.ok(generator,id);
      assert.equal(generator.environments.join(','),'port',id);
      assert.equal(generator.capabilities.batch,true,id);
      assert.ok(w.document.querySelector(`[data-generator-id="${id}"]`),id);
      assert.ok(opcoes.has(id),id);
      assert.equal(run(`generatorsForEnvironment('general').some(generator=>generator.id==='${id}')`),false,id);
    }
    w.openGenerator('transportadora');w.generateSelectedDocument();
    assert.equal(run('currentType'),'transportadora');
    const output=w.document.getElementById('output-val');
    assert.equal(output.classList.contains('is-structured'),true);
    assert.equal(output.querySelector('.structured-result-field dt').textContent,'Entidade');
    assert.equal(output.querySelector('.structured-result-field dd').textContent,'Transportadora');
    assert.doesNotMatch(output.textContent,/entidade:/i);
    const pedidos=ids.map(tipo=>({tipo,quantidade:2}));
    run(`var lotePortuario=gerarLoteDados(${JSON.stringify(pedidos)});var downloadsPortuarios=[];baixarTexto=(nome,texto,mime)=>downloadsPortuarios.push({nome,texto,mime});exportarRegistros(lotePortuario,'json');exportarRegistros(lotePortuario,'csv')`);
    assert.equal(run('lotePortuario.length'),ids.length*2);
    assert.equal(JSON.parse(run('downloadsPortuarios[0].texto')).length,ids.length*2);
    assert.equal(run("downloadsPortuarios[1].texto.split('\\r\\n').length"),ids.length*2+1);
  } finally {dom.window.close();}
});

test('painel Resultado apresenta estrutura amigável e preserva texto para ações e histórico', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.definirAmbiente('port');
    w.openGenerator('motorista');
    w.generateSelectedDocument();
    const output=w.document.getElementById('output-val');
    const labels=[...output.querySelectorAll('.structured-result-field dt')].map(item=>item.textContent);
    assert.equal(output.classList.contains('is-structured'),true);
    assert.ok(labels.includes('Perfil'));
    assert.ok(labels.includes('Categoria CNH'));
    assert.ok(labels.includes('Validade da CNH'));
    assert.ok(labels.includes('Função'));
    assert.ok(labels.includes('Endereço'));
    assert.equal(output.querySelectorAll('pre,code,textarea').length,0);
    assert.equal([...output.querySelectorAll('.structured-result-field')].find(item=>item.querySelector('dt').textContent==='Acesso').classList.contains('is-wide'),true);
    assert.doesNotMatch(output.textContent,/categoria_cnh|validade_cnh|funcao:|endereco:/i);

    const textoOriginal=run('currentResultText');
    assert.match(textoOriginal,/^perfil: Motorista/m);
    assert.match(textoOriginal,/^categoria_cnh: [CDE]$/m);
    let copiado='';
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async valor=>{copiado=valor;}},configurable:true});
    w.copyResult();
    await new Promise(resolve=>w.setTimeout(resolve,0));
    assert.equal(copiado,textoOriginal);

    run('var downloadResultadoEstruturado; baixarTexto=(nome,texto,mime)=>downloadResultadoEstruturado={nome,texto,mime};');
    w.baixarResultadoDocumento();
    assert.match(run('downloadResultadoEstruturado.texto'),/^Motorista: perfil: Motorista/m);

    assert.ok(run('historicoDocsList[0].dados.estrutura.categoria_cnh'));
    w.clearDocumentResult();
    w.restaurarHistoricoDocs(0);
    assert.equal(output.classList.contains('is-structured'),true);
    assert.ok([...output.querySelectorAll('dt')].some(item=>item.textContent==='Categoria CNH'));

    run("currentType='nome';currentValue='Texto livre';setOutput('Texto livre sem pares seguros')");
    assert.equal(output.classList.contains('is-structured'),false);
    assert.equal(output.textContent,'Texto livre sem pares seguros');
  } finally {dom.window.close();}
});

test('painel Resultado restaura somente seu scroll quando recebe um novo resultado', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.definirAmbiente('port');
    w.openGenerator('motorista');
    const output=w.document.getElementById('output-val');
    const scrollRaiz=w.document.scrollingElement || w.document.documentElement;
    scrollRaiz.scrollTop=320;
    output.scrollTop=240;
    w.generateSelectedDocument();
    assert.equal(output.scrollTop,240);
    await new Promise(resolve=>w.requestAnimationFrame(resolve));
    assert.equal(output.scrollTop,0);
    assert.equal(scrollRaiz.scrollTop,320);

    output.scrollTop=180;
    run("baixarTexto=()=>{}");
    w.copyResult();
    w.baixarResultadoDocumento();
    w.dispatchEvent(new w.Event('resize'));
    await new Promise(resolve=>w.requestAnimationFrame(resolve));
    assert.equal(output.scrollTop,180);

    output.scrollTop=150;
    run("setOutput(currentResultText,currentResultData,{resetScroll:false})");
    await new Promise(resolve=>w.requestAnimationFrame(resolve));
    assert.equal(output.scrollTop,150);

    w.generateSelectedDocument();
    await new Promise(resolve=>w.requestAnimationFrame(resolve));
    assert.equal(output.scrollTop,0);
    assert.equal(scrollRaiz.scrollTop,320);
  } finally {dom.window.close();}
});

test('fase 9 oferece a biblioteca inicial somente no QA Portuário', async () => {
  const {dom,w,run}=await abrir();
  try {
    const ids=JSON.parse(run('JSON.stringify(TEST_SCENARIO_LIBRARY.map(item=>item.id))'));
    assert.deepEqual(ids,['gate-in','gate-out','recebimento','expedicao','agendamento','processo-entrada','processo-saida','conteiner','carga-solta','fluxo-completo']);
    assert.equal(new Set(ids).size,ids.length);
    assert.equal(run('TEST_SCENARIO_SCHEMA'),'future-g.test-scenario.v1');
    assert.equal(w.document.getElementById('tab-btn-scenarios').hidden,true);
    w.definirAmbiente('port');
    assert.equal(w.document.getElementById('tab-btn-scenarios').hidden,false);
    assert.equal(w.document.getElementById('scenario-template').options.length,ids.length);
    w.definirAmbiente('general');
    assert.equal(w.document.getElementById('tab-btn-scenarios').hidden,true);
  } finally {dom.window.close();}
});

test('fase 9 mantém motorista, veículo, contêiner e carga referenciados no fluxo completo', async () => {
  const {dom,run}=await abrir();
  try {
    const cenario=run("gerarCenarioTeste('fluxo-completo','valido')");
    assert.equal(cenario.schema,'future-g.test-scenario.v1');
    assert.equal(cenario.etapas.length,10);
    assert.deepEqual(Array.from(cenario.etapas,item=>item.ordem),[1,2,3,4,5,6,7,8,9,10]);
    assert.equal(run(`verificarConsistenciaReferencialCenario(${JSON.stringify(cenario)}).valido`),true);
    for(const etapa of cenario.etapas)assert.deepEqual({...etapa.referencias},{...cenario.referencias});
    assert.equal(cenario.entidades.carga.conteiner,cenario.entidades.conteiner.conteiner);
    assert.equal(cenario.entidades.carga.lacre,cenario.entidades.conteiner.lacre);
    assert.equal(cenario.entidades.conteiner.peso_liquido_kg,cenario.entidades.carga.peso_bruto_kg);
    assert.equal(cenario.entidades.conteiner.peso_bruto_kg,cenario.entidades.conteiner.tara_kg+cenario.entidades.carga.peso_bruto_kg);
    assert.ok(cenario.entidades.conteiner.peso_bruto_kg<=cenario.entidades.conteiner.peso_bruto_maximo_kg);
  } finally {dom.window.close();}
});

test('fase 9 gera cada fluxo com etapas ordenadas e referências estáveis', async () => {
  const {dom,run}=await abrir();
  try {
    const modelos=JSON.parse(run('JSON.stringify(TEST_SCENARIO_LIBRARY)'));
    for(const modelo of modelos)for(let i=0;i<20;i++) {
      const cenario=run(`gerarCenarioTeste('${modelo.id}','valido')`);
      assert.equal(cenario.template_id,modelo.id);
      assert.equal(cenario.etapas.length,modelo.steps.length,modelo.id);
      assert.equal(run(`verificarConsistenciaReferencialCenario(${JSON.stringify(cenario)}).valido`),true,modelo.id);
      assert.deepEqual(Array.from(cenario.etapas,item=>item.ordem),modelo.steps,modelo.id);
      assert.equal(cenario.inconsistencias.length,0);
      if(modelo.loose) {
        assert.equal(cenario.referencias.conteiner_id,null);
        assert.equal(cenario.entidades.conteiner,null);
        assert.equal(cenario.entidades.carga.conteiner,undefined);
      }
    }
  } finally {dom.window.close();}
});

test('fase 9 identifica modos inválido e aleatório sem quebrar referências', async () => {
  const {dom,run}=await abrir();
  try {
    for(const modelo of JSON.parse(run('JSON.stringify(TEST_SCENARIO_LIBRARY)'))) {
      const cenario=run(`gerarCenarioTeste('${modelo.id}','invalido')`);
      assert.equal(cenario.modo_solicitado,'invalido');
      assert.equal(cenario.modo_aplicado,'invalido');
      assert.equal(cenario.inconsistencias.length,1,modelo.id);
      assert.equal(run(`verificarConsistenciaReferencialCenario(${JSON.stringify(cenario)}).valido`),true,modelo.id);
    }
    const aleatorios=run("Array.from({length:100},()=>gerarCenarioTeste('fluxo-completo','aleatorio'))");
    assert.ok(aleatorios.every(item=>item.modo_solicitado==='aleatorio'));
    assert.ok(aleatorios.every(item=>['valido','invalido'].includes(item.modo_aplicado)));
    assert.ok(aleatorios.some(item=>item.modo_aplicado==='valido'));
    assert.ok(aleatorios.some(item=>item.modo_aplicado==='invalido'));
  } finally {dom.window.close();}
});

test('fase 9 detecta quebra referencial sem confundir dado intencionalmente inválido', async () => {
  const {dom,run}=await abrir();
  try {
    const invalido=run("gerarCenarioTeste('conteiner','invalido')");
    assert.equal(invalido.entidades.conteiner.digito_iso_consistente,false);
    assert.equal(invalido.entidades.carga.conteiner,invalido.entidades.conteiner.conteiner);
    assert.equal(run(`verificarConsistenciaReferencialCenario(${JSON.stringify(invalido)}).valido`),true);
    invalido.etapas[0].referencias.motorista_id='MOT-DIFERENTE';
    const verificacao=run(`verificarConsistenciaReferencialCenario(${JSON.stringify(invalido)})`);
    assert.equal(verificacao.valido,false);
    assert.match(verificacao.erros.join(' '),/motorista_id/);
  } finally {dom.window.close();}
});

test('fase 9 apresenta, persiste, restaura e exporta massas de cenário', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.definirAmbiente('port');
    w.document.getElementById('scenario-template').value='fluxo-completo';
    w.document.getElementById('scenario-mode').value='invalido';
    run('gerarCenarioTesteInterface()');
    assert.equal(w.document.getElementById('scenario-result').hidden,false);
    assert.match(w.document.getElementById('scenario-result').textContent,/Dado intencionalmente inválido/);
    assert.match(w.document.getElementById('scenario-result').textContent,/Referências consistentes/);
    assert.equal(w.document.querySelectorAll('.scenario-steps li').length,10);
    assert.equal(JSON.parse(w.localStorage.getItem('gerador:cenarios_teste')).length,1);
    assert.equal(w.document.getElementById('scenario-history').options.length,2);
    run("var scenarioDownloads=[];baixarTexto=(nome,texto,mime)=>scenarioDownloads.push({nome,texto,mime});baixarCenarioTeste()")
    assert.match(run('scenarioDownloads[0].nome'),/^scn-.*\.json$/);
    assert.equal(JSON.parse(run('scenarioDownloads[0].texto')).schema,'future-g.test-scenario.v1');
    run('cenarioTesteAtual=null;document.getElementById(\'scenario-history\').value=\'0\';carregarCenarioTesteHistorico()');
    assert.equal(run('cenarioTesteAtual.template_id'),'fluxo-completo');
    run('limparHistoricoCenariosTeste()');
    assert.equal(JSON.parse(w.localStorage.getItem('gerador:cenarios_teste')).length,0);
    assert.equal(w.document.getElementById('scenario-result').hidden,true);
  } finally {dom.window.close();}
});

test('fase 10 abre busca global com Ctrl+K e limita resultados ao ambiente ativo', async () => {
  const {dom,w}=await abrir();
  try {
    const origem=w.document.getElementById('theme-btn');origem.focus();
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true}));
    const palette=w.document.getElementById('command-palette');
    const input=w.document.getElementById('command-palette-input');
    assert.equal(palette.hidden,false);
    assert.equal(w.document.activeElement,input);
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true}));
    assert.ok(w.document.activeElement.matches('[data-command-index]'));
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true}));
    assert.equal(w.document.activeElement,input);
    input.value='transportadora';input.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.equal(w.document.querySelectorAll('#command-palette-results [role="option"]').length,0);
    w.definirAmbiente('port');
    assert.match(w.document.getElementById('command-palette-results').textContent,/Transportadora/);
    input.value='motorista';input.dispatchEvent(new w.Event('input',{bubbles:true}));
    input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    assert.equal(palette.hidden,true);
    assert.equal(w.document.getElementById('tab-docs').hidden,false);
    assert.equal(w.document.getElementById('docs-selected-title').textContent,'Motorista');
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true}));
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(palette.hidden,true);
  } finally {dom.window.close();}
});

test('fase 10 registra atividade sem conteúdo gerado e projeta o dashboard por ambiente', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.activateGenerator('cpf');
    let activity=JSON.parse(w.localStorage.getItem('futureg:activity-v1'));
    assert.equal(activity[0].target,'cpf');
    assert.equal(activity[0].environment,'general');
    assert.deepEqual(Object.keys(activity[0]).sort(),['environment','kind','quantity','target','timestamp']);
    assert.equal(JSON.stringify(activity).includes('valor'),false);
    assert.match(w.document.getElementById('productivity-dashboard-title').textContent,/Geradores Gerais/);
    assert.match(w.document.getElementById('productivity-activity').textContent,/CPF/);
    run("recordProductivityActivity('scenarios',{kind:'scenario',quantity:1,result:'não persistir',apiKey:'segredo'})");
    activity=JSON.parse(w.localStorage.getItem('futureg:activity-v1'));
    assert.equal(JSON.stringify(activity).includes('segredo'),false);
    assert.equal(JSON.stringify(activity).includes('não persistir'),false);
    w.definirAmbiente('port');
    assert.match(w.document.getElementById('productivity-dashboard-title').textContent,/QA Portuário/);
    assert.match(w.document.getElementById('productivity-activity').textContent,/Cenários de teste/);
    assert.doesNotMatch(w.document.getElementById('productivity-activity').textContent,/CPF/);
  } finally {dom.window.close();}
});

test('fase 10 mantém favoritos por projeção e atualiza contadores do dashboard', async () => {
  const {dom,w,run}=await abrir();
  try {
    run("storageSet(FAVORITES_KEY,['cpf','motorista']);renderHomeGenerators();renderHomeContext();renderProductivityDashboard()");
    let metricas=[...w.document.querySelectorAll('#productivity-dashboard-metrics article')];
    assert.equal(metricas[1].querySelector('strong').textContent,'1');
    assert.match(w.document.getElementById('home-favorites').textContent,/CPF/);
    assert.doesNotMatch(w.document.getElementById('home-favorites').textContent,/Motorista/);
    w.definirAmbiente('port');
    metricas=[...w.document.querySelectorAll('#productivity-dashboard-metrics article')];
    assert.equal(metricas[1].querySelector('strong').textContent,'1');
    assert.match(w.document.getElementById('home-favorites').textContent,/Motorista/);
    assert.doesNotMatch(w.document.getElementById('home-favorites').textContent,/CPF/);
    assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:favorite-generators')),['cpf','motorista']);
  } finally {dom.window.close();}
});

test('fase 10 exporta lote completo com nome contextual e registra quantidade sem valores', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.document.getElementById('lote-tipo').value='cpf';
    w.document.getElementById('lote-quantidade').value='75';
    w.gerarLoteInterface();
    run('var productivityDownloads=[];baixarTexto=(nome,texto,mime)=>productivityDownloads.push({nome,texto,mime});');
    assert.equal(w.exportarLoteInterface('json'),true);
    const download=run('productivityDownloads[0]');
    assert.equal(download.nome,'lote-general-cpf.json');
    assert.equal(JSON.parse(download.texto).length,75);
    const activity=JSON.parse(w.localStorage.getItem('futureg:activity-v1'));
    assert.equal(activity[0].kind,'export');
    assert.equal(activity[0].quantity,75);
    assert.equal(activity[1].kind,'batch');
    assert.equal(activity[1].quantity,75);
    assert.equal(Object.hasOwn(activity[0],'result'),false);
  } finally {dom.window.close();}
});

test('diversidade de nomes/empresas, placas, telefones e DU-E', async () => {
  const { dom, run } = await abrir();
  try {
    for (const tipo of ['nome','empresa','placa','booking','due']) {
      const lote = run(`gerarLoteDados([{tipo:'${tipo}',quantidade:500}],{mascara:false})`);
      assert.equal(new Set(lote.map(r => r.valor)).size, 500);
      if (tipo === 'placa') lote.forEach(r => assert.match(r.valor, /^[A-Z]{3}\d[A-Z]\d{2}$/));
      if (tipo === 'due') lote.forEach(r => {
        assert.match(r.valor, /^\d{2}BR\d{10}$/);
        const base = r.valor.slice(0,2) + r.valor.slice(4,-1);
        const resto = [...base].reduce((n,ch,i) => n + Number(ch)*(12-i),0) % 11;
        assert.equal(Number(r.valor.at(-1)), resto < 2 ? 0 : 11-resto);
      });
    }
    for (const tipo of ['fixo','celular']) {
      const telefones = run(`gerarLoteDados([{tipo:'telefone',quantidade:100}],{uf:'AC',telefoneTipo:'${tipo}',mascara:false})`);
      telefones.forEach(r => assert.match(r.valor, tipo === 'fixo' ? /^68[2-5]\d{7}$/ : /^689\d{8}$/));
    }
  } finally { dom.window.close(); }
});

test('chat interpreta exemplos, opções e rejeita pedidos parciais ou quantidades inválidas', async () => {
  const { dom, run, w } = await abrir();
  try {
    const exemplos = [['3 CPFs e 2 CNPJs',5],['5 contêineres',5],['um contêiner',1],['dados para um motorista',1],['2 cadastros',2],['4 bookings sem máscara',4],['três nomes e duas empresas',5],['5 telefones fixos UF SP',5],['2 CNPJs alfanuméricos',2],['5 contêineres com lacre',5]];
    for (const [texto, total] of exemplos) {
      const pedido = run(`interpretarPedido(${JSON.stringify(texto)})`);
      assert.equal(pedido.pedidos.reduce((n,p) => n+p.quantidade,0), total, texto);
    }
    for (const texto of ['0 CPFs','501 CPFs','2.5 CPFs','-3 CPFs','3 CPFs e 2 unicórnios','quinhentos CPFs','5 telefones UF XX']) assert.throws(() => run(`interpretarPedido(${JSON.stringify(texto)})`), texto);
    w.document.getElementById('chat-pedido').value = '3 CPFs e 2 CNPJs';
    w.document.getElementById('chat-modo').value = 'local';
    w.enviarChat();
    assert.equal(w.document.querySelectorAll('#chat-mensagens .registro-lote').length, 5);
    w.limparChat();
    assert.equal(w.document.getElementById('chat-vazio').hidden, false);
  } finally { dom.window.close(); }
});

test('cartões do chat identificam arquivos e recolhem registros sem perder ações', async () => {
  const {dom,w,run}=await abrir();
  try {
    run(`mensagensIa=[{pedido:'Dados',text:'Pronto',artifacts:[{kind:'records',name:'<img src=x onerror=alert(1)>',records:[{tipo:'nome',valor:'Ana'}]},{kind:'xml',name:'teste.xml',text:'<raiz/>'}]}];renderChatIa()`);
    const cards=[...w.document.querySelectorAll('.ia-artefato')];
    assert.equal(cards.length,2);
    assert.equal(cards[0].querySelector('img'),null);
    assert.equal(cards[0].querySelector('details').open,false);
    assert.match(cards[0].textContent,/Ana/);
    assert.deepEqual([...cards[0].querySelectorAll('button')].map(b=>b.textContent),['Baixar JSON','Baixar CSV','Baixar TXT']);
    assert.deepEqual([...cards[1].querySelectorAll('button')].map(b=>b.textContent),['Baixar XML','Validar XML','Abrir cópia no editor']);
    for(const card of cards)assert.ok(w.document.getElementById(card.getAttribute('aria-labelledby')));
  } finally {dom.window.close();}
});

test('movimento reduzido desativa animações, transições e rolagem suave', () => {
  const css=fs.readFileSync(path.join(root,'assets/css/base.css'),'utf8');
  const regra=[...css.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g)].map(match=>match[1]).join('\n');
  assert.match(regra,/animation:\s*none !important/);
  assert.match(regra,/transition:\s*none !important/);
  assert.match(regra,/scroll-behavior:\s*auto !important/);
});

test('registry abre todos os IDs sem usar busca e mantém variantes e configurações', async () => {
  const {dom,w,run}=await abrir();
  try {
    const ids=run('GENERATORS.map(g=>g.id)');
    assert.equal(new Set(ids).size,ids.length);
    const search=w.document.getElementById('docs-search');search.value='empresa';
    w.document.getElementById('docs-category').value='empresa';w.filtrarGeradores();
    for(const environment of ['general','port']) {
      w.definirAmbiente(environment);
      for(const id of run(`generatorsForEnvironment('${environment}').map(g=>g.id)`)) {
        assert.equal(w.openGenerator(id),true,`${environment}:${id}`);
        const item=w.generatorById(id);
        assert.equal(w.document.getElementById('tab-'+item.tool).hidden,false,id);
        if(item.tool==='docs')assert.equal(run('selectedGeneratorId'),item.variantOf||id);
        if(item.tool==='xml')assert.equal(w.document.getElementById('xml-form-tipo').value,id);
        assert.equal(search.value,'empresa','navigation must not write search');
      }
    }
    w.definirAmbiente('general');
    w.openGenerator('telefone');assert.equal(w.document.getElementById('docs-phone-options').hidden,false);
    w.document.getElementById('gerador-uf').value='AC';w.document.getElementById('gerador-telefone-tipo').value='fixo';w.generateSelectedDocument();
    assert.match(run('currentValue'),/^68[2-5]\d{7}$/);
    w.openGenerator('placa-antiga');w.generateSelectedDocument();assert.match(run('currentValue'),/^[A-Z]{3}-\d{4}$/);
    assert.equal(w.document.getElementById('gerador-placa-tipo').value,'antiga');
    w.openGenerator('placa');w.generateSelectedDocument();assert.match(run('currentValue'),/^[A-Z]{3}\d[A-Z]\d{2}$/);
    assert.equal(w.document.getElementById('gerador-placa-tipo').value,'mercosul');
    const before=run('currentValue');assert.equal(w.openGenerator('unknown'),false);assert.equal(run('currentValue'),before);
  } finally {dom.window.close();}
});

test('migração preserva significado de favoritos, limites, histórico e recarga', async () => {
  const state={'thegenerator:favorite-generators':['conteiner','cpf','inexistente'],'thegenerator:recent-generators':['conteiner'],'gerador:historico_docs':[]};
  const {dom,w}=await abrir(state);
  let saved;
  try {
    assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:favorite-generators')),['conteiner-lacre','cpf']);
    assert.deepEqual(JSON.parse(w.localStorage.getItem('thegenerator:recent-generators')),['conteiner-lacre']);
    for(const id of ['cpf','cnpj','telefone','placa','nome','cpf'])w.registerGeneratorUse(id);
    const recent=JSON.parse(w.localStorage.getItem('thegenerator:recent-generators'));
    assert.equal(recent.length,5);assert.equal(recent[0],'cpf');
    w.storageSet('thegenerator:favorite-generators',['conteiner']);
    saved=Object.fromEntries(Object.keys(w.localStorage).map(key=>[key,JSON.parse(w.localStorage.getItem(key))]));
  } finally {dom.window.close();}
  const next=await abrir(saved);
  try {assert.deepEqual(JSON.parse(next.w.localStorage.getItem('thegenerator:favorite-generators')),['conteiner']);}
  finally {next.dom.window.close();}
});

test('cada adaptador individual preserva ações, tipo e histórico único', async () => {
  const {dom,w,run}=await abrir();
  try {
    for(const id of run('GENERATORS.filter(g=>g.run).map(g=>g.id)')) {
      const count=run('historicoDocsList.length');
      const item=w.generatorById(id);
      if(!w.generatorSupportsEnvironment(item))w.definirAmbiente(item.environments[0]);
      w.openGenerator(id);w.generateSelectedDocument();
      assert.equal(run('currentType'),w.generatorById(id).domainType,id);
      assert.ok(run('currentValue'),id);
      assert.equal(run('historicoDocsList.length'),Math.min(count+1,20),id);
      for(const action of ['new-doc-btn','copy-btn','download-doc-btn','docs-expand-btn','docs-clear-btn'])assert.equal(w.document.getElementById(action).disabled,false,id+' '+action);
    }
    assert.equal(w.document.getElementById('docs-output-box').style.display,'');
    assert.equal(run('typeof homeGenerateSelected'),'undefined');
    assert.equal(run('typeof HOME_GENERATORS'),'undefined');
  } finally {dom.window.close();}
});

test('restaurar contêiner com lacre mantém resultado, seleção e ações sem novo histórico', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.gerarConteinerComLacre();const value=run('currentValue');
    w.gerarCPFComToggle();w.restaurarHistoricoDocs(1);
    assert.equal(w.document.body.dataset.environment,'port');
    assert.equal(run('selectedGeneratorId'),'conteiner-lacre');
    assert.equal(w.document.getElementById('output-val').textContent,value);
    assert.equal(w.document.getElementById('docs-output-box').style.display,'');
    assert.equal(w.document.getElementById('new-doc-btn').disabled,false);
    assert.equal(run('historicoDocsList.length'),2);
  } finally {dom.window.close();}
});

test('distribuição inclui somente CSS proprietário e nenhum catálogo da Home', () => {
  const files=[...html.matchAll(/href="assets\/css\/([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(files,['base.css','documentos.css','cadastro.css','editor-xml.css','evolucao.css','validacao-xml.css']);
  for(const name of ['visual-lab.css','portus.css','usabilidade.css','minimal.css','experience.css'])assert.equal(fs.existsSync(path.join(root,'assets/css',name)),false);
  assert.doesNotMatch(fs.readFileSync(path.join(root,'assets/js/home-dashboard.js'),'utf8'),/HOME_GENERATORS|homeGenerate|homeState\.result/);
});

test('Assistente trata falhas sem expor detalhes e preserva rascunho e anexo', async () => {
  const {dom,w}=await abrir();
  try {
    for(const status of [503,429,410]) {
      w.fetch=async url=>url==='/api/status'?{ok:true,json:async()=>({configured:true})}:{ok:false,status,json:async()=>({error:'npm run dev INTERNAL_SECRET'})};
      w.document.getElementById('chat-pedido').value='Gere CPF';
      w.document.getElementById('chat-anexo').value='<teste />';
      await w.enviarChatIa();
      assert.doesNotMatch(w.document.getElementById('chat-status').textContent,/npm|INTERNAL_SECRET/);
      assert.equal(w.document.getElementById('chat-anexo').value,'<teste />');
      assert.equal(w.document.getElementById('chat-modo').value,'ia');
      w.document.getElementById('chat-pedido').value='novo rascunho';w.recuperarPedidoIa(0);
      assert.equal(w.document.getElementById('chat-pedido').value,'novo rascunho');
    }
    assert.match(w.mensagemFalhaIa({name:'AbortError'}),/demorou/);
    w.fetch=async()=>{throw new TypeError('network stack');};
    await w.enviarChatIa();
    assert.match(w.document.getElementById('chat-status').textContent,/indisponível/);
  } finally {dom.window.close();}
});

test('paleta visual possui uma única fonte de tokens', () => {
  const arquivos=fs.readdirSync(path.join(root,'assets/css')).filter(nome=>nome.endsWith('.css'));
  const declarantes=arquivos.filter(nome=>/--bg\s*:/.test(fs.readFileSync(path.join(root,'assets/css',nome),'utf8')));
  assert.deepEqual(declarantes,['base.css']);
  const base=fs.readFileSync(path.join(root,'assets/css/base.css'),'utf8');
  assert.match(base,/:root\s*\{[^}]*--accent:\s*#7c3aed/);
  assert.match(base,/body\[data-environment="port"\]\s*\{[^}]*--accent:\s*#2563eb/);
  assert.match(base,/body\.dark\s*\{[^}]*--bg:\s*#131017[^}]*--accent:\s*#a78bfa/);
  assert.match(base,/body\.dark\[data-environment="port"\]\s*\{[^}]*--bg:\s*#07111f[^}]*--accent:\s*#60a5fa/);
});

test('pares principais de texto mantêm contraste mínimo de 4,5 para 1', () => {
  const luminancia=hex=>{
    const canais=hex.match(/[0-9a-f]{2}/gi).map(valor=>parseInt(valor,16)/255).map(valor=>valor<=.04045?valor/12.92:((valor+.055)/1.055)**2.4);
    return .2126*canais[0]+.7152*canais[1]+.0722*canais[2];
  };
  const contraste=(a,b)=>{const x=luminancia(a),y=luminancia(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  const pares=[['241b33','ffffff'],['665676','f5f1fb'],['ffffff','6d28d9'],['7030ce','f5f1fb'],['f5effc','131017'],['c1b3ce','1c1624'],['a78bfa','131017'],['c5adff','131017'],['132238','ffffff'],['52647b','f4f7fb'],['ffffff','1d4ed8'],['1d4ed8','e6f0ff'],['1d7a4a','eaf5ef'],['b52f2f','ffffff'],['1d4ed8','ffffff'],['eff6ff','07111f'],['a8b8cc','0b1728'],['60a5fa','07111f'],['3bd68c','0f2318'],['ef5b68','07111f'],['93c5fd','07111f']];
  for(const [texto,fundo] of pares)assert.ok(contraste(texto,fundo)>=4.5,`${texto} sobre ${fundo}`);
});

test('filtro de gravidade preserva relatório completo e mostra ausência de resultados', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.document.getElementById('validacao-texto').value='<raiz><item></raiz>';
    w.validarXmlColado();
    const original=run('JSON.stringify(relatoriosXml)');
    const filtro=w.document.getElementById('validacao-filtro');
    assert.equal(w.document.getElementById('validacao-filtro-area').hidden,false);
    assert.match(w.document.getElementById('validacao-resultados').textContent,/1 erros/);
    filtro.value='aviso';w.renderValidacaoXml();
    assert.equal(w.document.querySelectorAll('.validacao-lista li').length,0);
    assert.match(w.document.getElementById('validacao-resultados').textContent,/Nenhuma verificação/);
    filtro.value='erro';w.renderValidacaoXml();
    assert.equal(w.document.querySelectorAll('.validacao-erro').length,1);
    assert.equal(run('JSON.stringify(relatoriosXml)'),original);
    w.limparValidacaoXml();
    assert.equal(filtro.value,'todos');
    assert.equal(w.document.getElementById('validacao-filtro-area').hidden,true);
  } finally {dom.window.close();}
});

test('validação XML: sintaxe, namespaces, protocolo, arquivos e cópia no editor', async () => {
  const { dom, w, run } = await abrir();
  try {
    const sintaxe=w.analisarXml('<a>');
    assert.equal(sintaxe.status,'erro');
    assert.match(sintaxe.verificacoes[0].localizacao,/Linha \d+, coluna \d+|Posição não informada/);
    assert.equal(w.analisarXml('<outro/>').status,'nao-suportado');
    assert.equal(w.analisarXml('<!DOCTYPE a [<!ENTITY x "abc">]><a>&x;</a>').status,'erro');
    for (const tipo of ['nfe','cte']) {
      w.definirAmbiente(tipo === 'nfe' ? 'general' : 'port');
      const xml=run(`serializarXml(xmlsGerados.${tipo})`);
      assert.equal(w.analisarXml(xml).status,'sem-erros');
      const prefixed=xml.replace(/(<\/?)([A-Za-z][\w]*)(?=[\s/>])/g,'$1f:$2').replace('xmlns=','xmlns:f=');
      assert.equal(w.analisarXml(prefixed).status,'sem-erros');
      assert.equal(w.analisarXml(xml.replace(/<CNPJ>\d+<\/CNPJ>/,'<CNPJ>00000000000000</CNPJ>')).status,'erro');
    }
    w.definirAmbiente('general');
    const xml=run('serializarXml(xmlsGerados.nfe)');
    assert.equal(w.analisarXml(xml.replace(/<chNFe>\d+<\/chNFe>/,'<chNFe>1</chNFe>')).status,'erro');
    assert.equal(w.analisarXml(xml.replace(/<vUnCom>[^<]+<\/vUnCom>/,'<vUnCom/>')).status,'erro');
    const campo=w.analisarXml(xml.replace(/<vUnCom>[^<]+<\/vUnCom>/,'<vUnCom/>')).verificacoes.find(v=>v.localizacao?.includes('vUnCom'));
    assert.match(campo.localizacao,/det\[1\] > prod > vUnCom/);
    await w.validarArquivosXml([new w.File([xml],'nota.xml'),new w.File(['<a>'],'quebrado.xml'),new w.File(['abc'],'invalido.txt')]);
    assert.equal(run('relatoriosXml.length'),3);
    assert.equal(run("relatoriosXml.filter(r=>r.status==='erro').length"),2);
    w.abrirValidacaoNoEditor(0);
    assert.equal(run('editorArquivos.length'),1);
    assert.equal(run('relatoriosXml[0].texto'),xml);
    w.limparValidacaoXml();
    assert.equal(run('relatoriosXml.length'),0);
  } finally { dom.window.close(); }
});

test('resumo do CT-e identifica o destinatário sem confundi-lo com o remetente', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.definirAmbiente('port');
    const resumo=JSON.parse(run("JSON.stringify(analisarXml(serializarXml(xmlsGerados.cte)).resumo)"));
    const destinatario=run("xmlsGerados.cte.querySelector('infCte > dest > xNome').textContent.trim()");
    const documentoDestinatario=run("xmlsGerados.cte.querySelector('infCte > dest > CNPJ, infCte > dest > CPF').textContent.trim()");
    const remetente=run("xmlsGerados.cte.querySelector('infCte > rem > xNome').textContent.trim()");
    assert.equal(resumo.destinatario,destinatario);
    assert.equal(resumo.documentoDestinatario,documentoDestinatario);
    assert.notEqual(resumo.destinatario,remetente);
  } finally {dom.window.close();}
});

test('fase 7 estrutura achados e mantém Resumo, XML e Validação no mesmo relatório', async () => {
  const {dom,w,run}=await abrir();
  try {
    const xml=run('serializarXml(xmlsGerados.nfe)');
    const relatorio=w.analisarXml(xml,'nota-fase-7.xml');
    assert.equal(relatorio.status,'sem-erros');
    assert.equal(relatorio.resumo.tipo,'NF-e');
    assert.match(relatorio.resumo.chave,/^\d{44}$/);
    assert.ok(relatorio.resumo.emitente);
    assert.ok(relatorio.resumo.documentoEmitente);
    assert.ok(relatorio.resumo.itens>=1);
    assert.ok(relatorio.verificacoes.every(item=>['erro','aviso','informacao'].includes(item.severidade)));
    const invalido=w.analisarXml(xml.replace(/<xNome>[^<]+<\/xNome>/,'<xNome/>'));
    const achado=invalido.verificacoes.find(item=>item.codigo==='campo-obrigatorio'&&item.tag==='xNome');
    assert.ok(achado);
    assert.equal(achado.valor,'');
    assert.match(achado.caminho,/NFe > infNFe > emit > xNome/);
    w.document.getElementById('validacao-texto').value=xml;
    w.validarXmlColado();
    assert.equal(w.document.querySelectorAll('.validacao-abas [role="tab"]').length,3);
    assert.equal(w.document.getElementById('validacao-painel-0-resumo').hidden,false);
    assert.match(w.document.getElementById('validacao-painel-0-resumo').textContent,/Emitente/);
    w.alternarVisaoValidacao(0,'xml');
    assert.equal(w.document.getElementById('validacao-painel-0-xml').hidden,false);
    assert.match(w.document.querySelector('.validacao-xml-fonte').textContent,/nfeProc/);
    w.alternarVisaoValidacao(0,'validacao');
    assert.equal(w.document.getElementById('validacao-painel-0-validacao').hidden,false);
    assert.equal(w.document.getElementById('validacao-tab-0-validacao').getAttribute('aria-selected'),'true');
    w.navegarAbasValidacao({key:'ArrowRight',preventDefault(){}},0);
    assert.equal(w.document.getElementById('validacao-tab-0-resumo').getAttribute('aria-selected'),'true');
  } finally {dom.window.close();}
});

test('fase 7 gera variantes XML negativas sem alterar o documento-base', async () => {
  const {dom,w,run}=await abrir();
  try {
    const original=run('serializarXml(xmlsGerados.nfe)');
    const variantes=['cpf-invalido','cnpj-invalido','chave-invalida','campo-ausente','formato-invalido','tag-invalida','xml-malformado'];
    for(const variante of variantes){
      const negativo=JSON.parse(run(`JSON.stringify(criarVarianteNegativaXml('nfe','${variante}'))`));
      assert.ok(negativo.texto,variante);
      assert.match(negativo.nome,/NFE-teste-/);
      assert.equal(run(`analisarXml(criarVarianteNegativaXml('nfe','${variante}').texto).status`),'erro',variante);
      assert.equal(run('serializarXml(xmlsGerados.nfe)'),original,variante);
    }
    w.document.getElementById('validacao-negativa-tipo').value='nfe';
    w.document.getElementById('validacao-negativa-variante').value='cnpj-invalido';
    w.gerarXmlNegativo();
    assert.equal(run('relatoriosXml[0].intencional'),true);
    assert.equal(run('relatoriosXml[0].varianteNegativa.variante'),'cnpj-invalido');
    assert.match(w.document.querySelector('.validacao-intencional').textContent,/intencionalmente inválido/);
    assert.match(w.document.getElementById('validacao-texto').value,/00000000000000/);
    run('var downloadNegativo; baixarTexto=(nome,texto,mime)=>downloadNegativo={nome,texto,mime};');
    w.baixarXmlTesteNegativo(0);
    assert.equal(run('downloadNegativo.mime'),'application/xml');
    assert.match(run('downloadNegativo.nome'),/cnpj-invalido/);
    run('var relatorioNegativo; baixarTexto=(nome,texto,mime)=>relatorioNegativo={nome,texto,mime};');
    w.exportarRelatorioXml();
    assert.doesNotMatch(run('relatorioNegativo.texto'),/<nfeProc/);
    assert.equal(JSON.parse(run('relatorioNegativo.texto')).documentos[0].varianteNegativa.variante,'cnpj-invalido');
    assert.equal(run('serializarXml(xmlsGerados.nfe)'),original);
  } finally {dom.window.close();}
});

test('fase 7 exporta relatório estruturado sem incluir o XML-fonte', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.definirAmbiente('port');
    w.document.getElementById('validacao-texto').value=run('serializarXml(xmlsGerados.cte)');
    w.validarXmlColado();
    run('var downloadRelatorio; baixarTexto=(nome,texto,mime)=>downloadRelatorio={nome,texto,mime};');
    w.exportarRelatorioXml();
    const download=run('downloadRelatorio');
    const relatorio=JSON.parse(download.texto);
    assert.equal(download.mime,'application/json');
    assert.equal(Object.hasOwn(relatorio.documentos[0],'texto'),false);
    assert.equal(Object.hasOwn(relatorio.documentos[0],'visao'),false);
    assert.ok(relatorio.documentos[0].resumo.chave);
    assert.ok(relatorio.documentos[0].verificacoes.every(item=>item.problema&&item.severidade));
  } finally {dom.window.close();}
});

test('chat sinaliza espera e limite; recupera pedido sem sobrescrever rascunho', async () => {
  const {dom,w}=await abrir();
  try {
    let liberar;
    w.fetch=async url=>url==='/api/status'
      ? {ok:true,json:async()=>({configured:true,provider:'groq'})}
      : await new Promise(resolve=>{liberar=()=>resolve({ok:false,status:429,json:async()=>({error:'Aguarde antes de enviar novamente.'})});});
    const input=w.document.getElementById('chat-pedido');
    input.value='Gere um CPF';
    const envio=w.enviarChatIa();
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(w.document.getElementById('chat-enviar').disabled,true);
    assert.equal(w.document.getElementById('chat-enviar').textContent,'Processando…');
    assert.equal(w.document.getElementById('chat-ia-mensagens').getAttribute('aria-busy'),'true');
    assert.match(w.document.querySelector('.ia-estado').textContent,/Analisando pedido/);
    assert.match(w.document.getElementById('chat-status').textContent,/Conexão confirmada/);
    liberar();await envio;
    assert.match(w.document.querySelector('.ia-estado').textContent,/Limite atingido/);
    assert.equal(w.document.getElementById('chat-enviar').disabled,false);
    assert.equal(w.document.getElementById('chat-ia-mensagens').getAttribute('aria-busy'),'false');
    const recuperar=w.document.querySelector('.chat-resposta > button');
    input.value='Meu novo pedido';recuperar.click();
    assert.equal(input.value,'Meu novo pedido');
    input.value='';recuperar.click();
    assert.equal(input.value,'Gere um CPF');
    assert.equal(w.document.activeElement,input);
  } finally {dom.window.close();}
});

test('sugestão do chat aguarda confirmação e anexo pode ser revisado ou removido', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.sugerirChat('5 contêineres');
    assert.equal(w.document.getElementById('chat-pedido').value,'5 contêineres');
    assert.equal(run('mensagensIa.length'),0);
    assert.equal(run('conversasChat.length'),0);
    assert.equal(w.document.activeElement.id,'chat-pedido');
    w.document.getElementById('chat-anexo-tipo').value='nfe';
    w.anexarXmlAtualIa();
    assert.equal(w.document.getElementById('chat-anexo-limpar').hidden,false);
    assert.match(w.document.getElementById('chat-anexo-status').textContent,/NFE atual carregado/);
    assert.match(w.document.getElementById('chat-anexo').value,/nfeProc/);
    w.limparAnexoIa();
    assert.equal(w.document.getElementById('chat-anexo').value,'');
    assert.equal(w.document.getElementById('chat-anexo-limpar').hidden,true);
    assert.equal(w.document.activeElement,w.document.querySelector('#chat-anexo-area > summary'));
  } finally {dom.window.close();}
});

test('interface IA envia somente anexo explícito, renderiza texto seguro e permite modo local', async () => {
  const { dom,w,run }=await abrir();
  try {
    let sent;
    let statusSignal;
    w.fetch=async (url,options)=>{if(url==='/api/status'){statusSignal=options.signal;return {ok:true,json:async()=>({configured:true,provider:'groq'})};}if(options.method==='POST')assert.equal(options.signal,statusSignal);sent=JSON.parse(options.body);return {ok:true,json:async()=>({sessionId:'mock',text:'<img src=x onerror=alert(1)>',artifacts:[{kind:'records',name:'dados.json',records:[{tipo:'nome',rotulo:'Nome',valor:'Pessoa teste'}]}],activities:['gerar_dados']})};};
    w.document.getElementById('chat-pedido').value='Me ajude a gerar um nome';
    await w.enviarChatIa();
    assert.equal(sent.xml,undefined);
    assert.equal(sent.environment,'general');
    assert.ok(statusSignal);
    assert.equal(w.document.querySelectorAll('#chat-ia-mensagens img').length,0);
    assert.equal(w.document.querySelectorAll('#chat-ia-mensagens .registro-lote').length,1);
    assert.match(w.document.querySelector('.ia-estado').textContent,/Ferramentas executadas e resposta concluída/);
    assert.equal(w.document.querySelector('.ia-ferramentas li').textContent,'Gerar dados');
    w.document.getElementById('chat-anexo').value='<a/>';
    w.document.getElementById('chat-pedido').value='Analise este XML';
    await w.enviarChatIa();
    assert.equal(sent.sessionId,'mock'); assert.equal(sent.xml,'<a/>');
    w.AbortSignal.timeout=()=>undefined;
    await w.limparChat(); assert.equal(run('sessaoIa'),null);
  } finally { dom.window.close(); }
});

test('XML: produtos, cenários, bloqueio, cadastro e cópia isolada no editor', async () => {
  const { dom, run, w } = await abrir();
  try {
    const empresa = w.document.getElementById('nfe_nomeEmit');
    empresa.value = 'Empresa de Teste & Filhos';
    w.alterarItensXml();
    assert.equal(w.document.querySelectorAll('.produto-item').length, 2);
    assert.equal(empresa.value, 'Empresa de Teste & Filhos');
    w.document.getElementById('nfes_prod_1_nome').value = 'Produto dois';
    w.document.getElementById('cenario-nome').value = 'Dois produtos';
    w.salvarCenarioXml();
    w.alterarItensXml(0);
    assert.equal(w.document.getElementById('nfes_prod_0_nome').value, 'Produto dois');
    w.document.getElementById('cenario-lista').value = '0';
    w.carregarCenarioXml();
    assert.equal(w.document.querySelectorAll('.produto-item').length, 2);
    assert.equal(empresa.value, 'Empresa de Teste & Filhos');
    w.toggleLock(); run('processarXML(acao.regenerar)');
    assert.equal(empresa.value, 'Empresa de Teste & Filhos');
    w.document.getElementById('cad_empresa').value = 'Empresa do Cadastro';
    w.document.getElementById('cad_cnpj').value = run('gerarCNPJRawNumerico()');
    w.usarCadastroNoXml();
    assert.equal(empresa.value, 'Empresa do Cadastro');
    w.abrirXmlGeradoNoEditor();
    assert.equal(run('editorArquivos.length'), 1);
    run("editorArquivos[0].doc.querySelector('emit > xNome').textContent = 'Editado'");
    assert.equal(run("xmlsGerados.nfe.querySelector('emit > xNome').textContent"), 'Empresa do Cadastro');
    w.editorTrocarSubTab('alteracoes');
    assert.match(w.document.getElementById('editor-conteudo').textContent, /Editado/);
    assert.match(w.document.getElementById('editor-conteudo').textContent, /Empresa do Cadastro/);
    assert.match(w.document.querySelector('.editor-change-summary').textContent,/1 alterados/);
    assert.equal(w.document.querySelector('.tabela-alteracoes th').getAttribute('scope'),'col');
    assert.equal(w.document.querySelector('.tabela-alteracoes tbody td').textContent,'Alterado');
    w.definirAmbiente('port');
    w.document.getElementById('xml-preview-tipo').value = 'cte';
    w.abrirXmlGeradoNoEditor();
    assert.equal(run('editorSubTabAtual'), 'estrutura');
  } finally { dom.window.close(); }
});

test('restauração mantém quantidade de produtos e campos gravados', async () => {
  const primeiro = await abrir();
  primeiro.w.alterarItensXml();
  primeiro.w.document.getElementById('nfes_prod_1_nome').value = 'Persistido';
  primeiro.w.salvarEstadoXml();
  const estado = Object.fromEntries(Object.keys(primeiro.w.localStorage).map(k => [k,JSON.parse(primeiro.w.localStorage.getItem(k))]));
  primeiro.dom.window.close();
  const segundo = await abrir(estado);
  try { assert.equal(segundo.w.document.getElementById('nfes_prod_1_nome').value, 'Persistido'); }
  finally { segundo.dom.window.close(); }
});

test('consistência XML: chave, município, preço unitário e conversão KG/TON', async () => {
  const { dom, run, w } = await abrir();
  try {
    assert.equal(run('verificarConsistenciaXml(xmlsGerados.nfe).length'), 0);
    w.definirAmbiente('port');
    assert.equal(run('verificarConsistenciaXml(xmlsGerados.cte).length'), 0);
    w.definirAmbiente('general');
    const peso = run("xmlsGerados.nfe.querySelector('vol > pesoL').textContent");
    w.setUnidade(0, 'TON'); w.gerarXMLComCampos();
    assert.equal(run("xmlsGerados.nfe.querySelector('vol > pesoL').textContent"), peso);
    assert.equal(run('verificarConsistenciaXml(xmlsGerados.nfe).length'), 0);
    assert.equal(run("xmlsGerados.nfe.querySelector('ide > cUF').textContent"), run("xmlsGerados.nfe.querySelector('emit > enderEmit > cMun').textContent.slice(0,2)"));
    run("xmlsGerados.nfe.querySelector('ide > cDV').textContent = 'X'");
    assert.match(run('verificarConsistenciaXml(xmlsGerados.nfe).join()'), /cDV/);
  } finally { dom.window.close(); }
});

test('exportação inclui registros fora da prévia e preserva caracteres especiais', async () => {
  const { dom, run } = await abrir();
  try {
    run('var downloadsTeste = []; baixarTexto = (nome, texto, mime) => downloadsTeste.push({nome,texto,mime});');
    run("var registrosTeste = gerarLoteDados([{tipo:'cpf',quantidade:75}],{mascara:false}); exportarRegistros(registrosTeste, 'json'); exportarRegistros(registrosTeste, 'csv'); exportarRegistros(registrosTeste, 'txt');");
    const downloads = run('downloadsTeste');
    assert.equal(JSON.parse(downloads[0].texto).length, 75);
    assert.equal(downloads[1].texto.split('\r\n').length, 76);
    assert.equal(downloads[2].texto.split('\n\n').length, 75);
    assert.equal(run('renderRegistros(registrosTeste).match(/class="registro-lote"/g).length'), 50);
    run(`exportarRegistros([{tipo:'nome',rotulo:'Nome',valor:'=SUM(1;2)"'}], 'csv')`);
    assert.match(run('downloadsTeste[3].texto'), /'=SUM\(1;2\)""/);
    const render = run(`renderRegistros([{rotulo:'Teste',valor:'<img src=x onerror=alert(1)>'}])`);
    assert.ok(!render.includes('<img'));
    assert.ok(render.includes('&lt;img'));
  } finally { dom.window.close(); }
});

test('novos documentos individuais: máscaras e regeneração de placa antiga', async () => {
  const { dom, run, w } = await abrir();
  try {
    w.gerarDocumentoExtra('due');
    assert.match(w.document.getElementById('output-val').textContent, /^\d{2}BR\d{9}-\d$/);
    w.removerMascara();
    assert.match(w.document.getElementById('output-val').textContent, /^\d{2}BR\d{10}$/);
    w.aplicarMascara();
    assert.match(w.document.getElementById('output-val').textContent, /^\d{2}BR\d{9}-\d$/);
    w.gerarPlaca('antiga'); w.gerarNovoDocumentoAtual();
    assert.match(w.document.getElementById('output-val').textContent, /^[A-Z]{3}-\d{4}$/);
    assert.equal(w.document.getElementById('docs-result-label').textContent, 'Resultado · Placa antiga');
    const conteiner = run('gerarNumeroConteiner()');
    assert.equal(w.conferirDocumento(conteiner).ok, true);
    assert.equal(w.conferirDocumento(conteiner.slice(0,-1) + ((Number(conteiner.at(-1))+1)%10)).ok, false);
  } finally { dom.window.close(); }
});

test('lote informa prévia limitada e pode ser limpo com retorno de foco', async () => {
  const {dom,w,run}=await abrir();
  try {
    w.document.getElementById('lote-tipo').value='cpf';
    w.document.getElementById('lote-quantidade').value='75';
    run("selectedGeneratorId='cpf';currentType='cpf';currentValue='529.982.247-25';setOutput(currentValue)");
    const resultadoIndividual=w.document.getElementById('output-val').textContent;
    w.gerarLoteInterface();
    assert.equal(run('ultimoLote.length'),75);
    assert.equal(w.document.querySelectorAll('#lote-resultados .registro-lote').length,50);
    assert.match(w.document.getElementById('lote-status').textContent,/primeiros 50/);
    assert.equal(w.document.activeElement.id,'lote-resultados');
    w.limparLoteInterface();
    assert.equal(run('ultimoLote.length'),0);
    assert.equal(w.document.getElementById('lote-exportacao').hidden,true);
    assert.equal(w.document.getElementById('output-val').textContent,resultadoIndividual);
    assert.equal(run('selectedGeneratorId'),'cpf');
    assert.equal(w.document.activeElement.id,'lote-tipo');
  } finally {dom.window.close();}
});

test('resultado individual baixa exatamente o valor exibido e o nome associado', async () => {
  const {dom,w,run}=await abrir();
  try {
    run('var downloadIndividual; baixarTexto=(nome,texto,mime)=>downloadIndividual={nome,texto,mime};');
    w.document.getElementById('toggle-nome').checked=true;
    run("currentType='cpf';currentValue='52998224725';mostrarNome('Ana Teste','cpf');setOutput('529.982.247-25');baixarResultadoDocumento()");
    const download=run('downloadIndividual');
    assert.equal(download.nome,'dado-teste-cpf.txt');
    assert.equal(download.texto,'Nome: Ana Teste\nCPF: 529.982.247-25');
    assert.equal(w.document.getElementById('download-doc-btn').style.display,'inline-block');
  } finally {dom.window.close();}
});

test('feedback de cópia usa texto visível e anúncio acessível', async () => {
  const {dom,w,run}=await abrir();
  try {
    let copiado='';
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async valor=>{copiado=valor;}},configurable:true});
    assert.equal(await w.copiarTexto('valor teste','Valor copiado.'),true);
    assert.equal(copiado,'valor teste');
    assert.equal(w.document.getElementById('app-status').textContent,'Valor copiado.');
    assert.equal(w.document.getElementById('app-status-live').textContent,'Valor copiado.');
    assert.equal(await w.copiarTexto(''),false);
    assert.equal(w.document.getElementById('app-status-live').textContent,'Não há conteúdo para copiar.');
    run("currentType='cpf';currentValue='52998224725';setOutput('529.982.247-25')");
    w.copyResult();
    await new Promise(resolve=>w.setTimeout(resolve,0));
    assert.match(w.document.getElementById('copy-btn').textContent,/Copiado/);
    assert.equal(w.document.getElementById('copy-btn').getAttribute('aria-label'),'Resultado copiado');
  } finally {dom.window.close();}
});

test('prévia XML permite baixar e validar o documento selecionado', async () => {
  const {dom,w,run}=await abrir();
  try {
    run('var downloadXmlAtual; baixarTexto=(nome,texto,mime)=>downloadXmlAtual={nome,texto,mime};');
    w.definirAmbiente('port');
    w.document.getElementById('xml-preview-tipo').value='cte';
    w.baixarXmlGeradoAtual();
    const download=run('downloadXmlAtual');
    assert.equal(download.nome,'CTE-teste.xml');
    assert.equal(download.mime,'application/xml');
    assert.match(download.texto,/infCte/);
    w.validarXmlGeradoAtual();
    assert.equal(w.document.getElementById('validacao-gerado-tipo').value,'cte');
    assert.equal(w.document.getElementById('tab-validacao').hidden,false);
    assert.equal(w.document.activeElement.id,'validacao-resultados');
    assert.match(w.document.getElementById('validacao-resultados').textContent,/CTE do gerador/);
  } finally {dom.window.close();}
});

test('fase 4 posiciona lote após resultado e mantém nomes de ações independentes', async () => {
  const {dom,w}=await abrir();
  try {
    const result=w.document.getElementById('docs-output-box');
    const batch=w.document.querySelector('.docs-batch');
    assert.ok(result.compareDocumentPosition(batch)&w.Node.DOCUMENT_POSITION_FOLLOWING);
    const groups=[...w.document.querySelectorAll('#docs-generator-list .docs-generator-group')];
    assert.deepEqual(groups.slice(0,2).map(group=>group.querySelector('.section-label').textContent),['Pessoa física','Pessoa jurídica']);
    assert.ok([...w.document.querySelectorAll('#docs-generator-list button')].some(button=>button.textContent==='RG'));
    assert.ok([...w.document.querySelectorAll('#docs-generator-list button')].some(button=>button.textContent==='CNH'));
    assert.equal([...w.document.querySelectorAll('#docs-generator-list [data-generator-id^="placa"]')].length,1);
    w.openGenerator('placa-antiga');
    assert.equal(w.document.getElementById('docs-selected-title').textContent,'Placa');
    assert.equal(w.document.getElementById('docs-plate-options').hidden,false);
  } finally {dom.window.close();}
});

test('chat só acompanha atualizações perto do fim e exibe anexo pendente no compositor', async () => {
  const {dom,w,run}=await abrir();
  try {
    const area=w.document.getElementById('chat-ia-mensagens');
    Object.defineProperties(area,{scrollHeight:{value:1000,configurable:true},clientHeight:{value:100,configurable:true}});
    area.scrollTop=240;
    run("mensagensIa=[{pedido:'primeiro',text:'resposta'}]");
    w.renderChatIa();
    assert.equal(area.scrollTop,240);
    area.scrollTop=840;
    run("mensagensIa.push({pedido:'segundo',text:'outra resposta'})");
    w.renderChatIa();
    assert.equal(area.scrollTop,1000);
    assert.equal(w.document.querySelector('#chat-anexo-area > summary').getAttribute('aria-label'),'Adicionar anexo');
    w.document.getElementById('chat-anexo').value='<teste />';
    w.document.getElementById('chat-anexo').dispatchEvent(new w.Event('input'));
    assert.equal(w.document.getElementById('chat-anexo-pendente').hidden,false);
    assert.match(w.document.getElementById('chat-anexo-nome').textContent,/XML colado/);
  } finally {dom.window.close();}
});

test('NCMs manuais validam atomicamente, removem entradas e alimentam os produtos', async () => {
  const {dom,w,run}=await abrir();
  try {
    const input=w.document.getElementById('ncm-manual-input');
    input.value='17019900 incorreto';
    w.adicionarNcmsManuais();
    assert.equal(run('ncmsManuais.length'),0);
    assert.equal(input.getAttribute('aria-invalid'),'true');
    input.value='1701.99.00, 12019000 17019900';
    w.adicionarNcmsManuais();
    assert.equal(run('JSON.stringify(ncmsManuais)'),JSON.stringify(['17019900','12019000']));
    w.alterarItensXml();
    assert.equal(w.document.querySelectorAll('.produto-item').length,2);
    assert.equal(w.aplicarNcmsManuais(),true);
    assert.deepEqual([...w.document.querySelectorAll('.produto-item input[id$="_ncm"]')].map(input=>input.value),['17019900','12019000']);
    assert.equal(run("JSON.stringify([...xmlsGerados.nfe.querySelectorAll('NCM')].map(node=>node.textContent))"),JSON.stringify(['17019900','12019000']));
    w.removerNcmManual(0);
    assert.equal(run('JSON.stringify(ncmsManuais)'),JSON.stringify(['12019000']));
    assert.deepEqual(JSON.parse(w.localStorage.getItem('gerador:ncms_manuais')),['12019000']);
  } finally {dom.window.close();}
});

test('upload XML usa o mesmo alvo para seleção e substituição identificada', async () => {
  const {dom,w}=await abrir();
  try {
    const primeiro=new w.File(['<a>'],'quebrado.xml',{type:'application/xml'});
    await w.validarArquivosXml([primeiro]);
    assert.match(w.document.getElementById('validacao-upload-status').textContent,/quebrado\.xml.*substituir/);
    const segundo=new w.File(['texto'],'dados.txt',{type:'text/plain'});
    await w.validarArquivosXml([segundo]);
    assert.match(w.document.getElementById('validacao-upload-status').textContent,/dados\.txt.*substituir/);
    assert.match(w.document.getElementById('validacao-resultados').textContent,/extensão \.xml/);
    w.limparValidacaoXml();
    assert.match(w.document.getElementById('validacao-upload-status').textContent,/Até 10 arquivos/);
  } finally {dom.window.close();}
});

test('fase 11 anuncia e bloqueia a entrada enquanto o XML é processado', async () => {
  const {dom,w,run}=await abrir();
  try {
    run('var concluirLeitura; lerArquivoValidacao=()=>new Promise(resolve=>{concluirLeitura=resolve});');
    const processamento=w.validarArquivosXml([new w.File(['<teste/>'],'lento.xml',{type:'application/xml'})]);
    assert.equal(w.document.querySelector('.validacao-entrada').getAttribute('aria-busy'),'true');
    assert.equal(w.document.getElementById('validacao-arquivos').disabled,true);
    assert.equal(w.document.querySelector('.validacao-dropzone-inner').disabled,true);
    assert.match(w.document.getElementById('validacao-upload-status').textContent,/Analisando 1 arquivo/);
    run("concluirLeitura('<teste/>')");
    await processamento;
    assert.equal(w.document.querySelector('.validacao-entrada').getAttribute('aria-busy'),'false');
    assert.equal(w.document.getElementById('validacao-arquivos').disabled,false);
    assert.equal(w.document.querySelector('.validacao-dropzone-inner').disabled,false);
    assert.match(w.document.getElementById('validacao-upload-status').textContent,/lento\.xml.*substituir/);
  } finally {dom.window.close();}
});

test('fase 11 mantém ícones, estilos e auditoria dentro dos limites operacionais', () => {
  const lucide=fs.statSync(path.join(root,'assets/js/lucide.min.js')).size;
  const cssValidacao=fs.readFileSync(path.join(root,'assets/css/validacao-xml.css'),'utf8');
  const auditor=fs.readFileSync(path.join(root,'scripts/audit-browser.cjs'),'utf8');
  assert.ok(lucide<=20000,`runtime Lucide com ${lucide} bytes`);
  assert.match(cssValidacao,/\.validacao-negativa\s*>\s*button\s*\{[^}]*max-width:\s*100%[^}]*white-space:\s*normal/s);
  assert.match(auditor,/Runtime\.exceptionThrown/);
  assert.match(auditor,/localJavaScriptBytes:\s*assetBytes\('js'\)/);
  assert.match(auditor,/commandPalette\.portCount\s*>\s*0/);
});
