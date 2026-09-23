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
    assert.deepEqual(tabs.map(t=>t.id),['xml','docs','cadastro','editor','validacao','chat'].map(t=>'tab-btn-'+t));
    assert.equal(w.document.getElementById('tab-btn-xml').getAttribute('aria-label'),'XML fiscal');
    assert.equal(w.document.getElementById('tab-btn-chat').getAttribute('aria-label'),'Assistente de geração');
    const editor=w.document.getElementById('tab-btn-editor');
    editor.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
    assert.equal(w.document.activeElement.id,'tab-btn-validacao');
    w.document.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));
    assert.equal(w.document.activeElement.id,'tab-btn-chat');
    assert.equal(w.document.getElementById('tab-chat').hidden,false);
    w.document.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
    assert.equal(w.document.activeElement.id,'tab-btn-xml');
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

test('alternar formulário XML preserva edições e acompanha a prévia', async () => {
  const {dom,w}=await abrir();
  try {
    const select=w.document.getElementById('xml-form-tipo');
    const nome=w.document.getElementById('nfe_nomeEmit');
    nome.value='Empresa editada';
    select.value='cte';select.dispatchEvent(new w.Event('change'));
    assert.equal(w.document.getElementById('xml-form-nfe').hidden,true);
    assert.equal(w.document.getElementById('xml-form-cte').hidden,false);
    assert.equal(w.document.getElementById('xml-preview-tipo').value,'cte');
    select.value='ambos';select.dispatchEvent(new w.Event('change'));
    assert.equal(w.document.getElementById('xml-form-nfe').hidden,false);
    assert.equal(nome.value,'Empresa editada');
  } finally {dom.window.close();}
});

test('campos XML avançados ficam recolhidos sem sair da geração', async () => {
  const {dom,w,run}=await abrir();
  try {
    const recinto=w.document.getElementById('nfe_recinto');
    const transportador=w.document.getElementById('nfe_nomeTransp');
    const details=[...w.document.querySelectorAll('#tab-xml details.xml-avancado')];
    assert.ok(details.length>=4);
    assert.ok(details.every(item=>item.open===false));
    recinto.value='0121300';transportador.value='Transportadora Teste';
    w.gerarXMLComCampos();
    assert.equal(run("xmlsGerados.nfe.querySelector('infAdic > infCpl').textContent"),'Código RA 0121300');
    assert.equal(run("xmlsGerados.nfe.querySelector('transp > transporta > xNome').textContent"),'Transportadora Teste');
    assert.equal(recinto.value,'0121300');
  } finally {dom.window.close();}
});

test('atalhos salvam favoritos e recentes sem duplicar e navegam com foco', async () => {
  const {dom,w}=await abrir();
  try {
    const tick=()=>new Promise(resolve=>setImmediate(resolve));
    w.switchTab('docs');await tick();
    const favorite=w.document.getElementById('favorite-tool');favorite.click();
    assert.equal(favorite.getAttribute('aria-pressed'),'true');
    assert.deepEqual(JSON.parse(w.localStorage.getItem('gerador:favoritos')),['docs']);
    for(const tab of ['editor','chat','docs']) {w.switchTab(tab);await tick();}
    assert.deepEqual(JSON.parse(w.localStorage.getItem('gerador:recentes')),['docs','chat','editor']);
    w.switchTab('xml');await tick();
    w.document.querySelector('#favorite-tools button').click();await tick();
    assert.equal(w.document.getElementById('tab-docs').hidden,false);
    assert.equal(w.document.activeElement.id,'tab-docs');
    favorite.click();
    assert.deepEqual(JSON.parse(w.localStorage.getItem('gerador:favoritos')),[]);
    assert.match(w.document.getElementById('favorite-tools').textContent,/Favorite uma ferramenta/);
  } finally {dom.window.close();}
});

test('busca de geradores ignora acentos e limpar restaura opções', async () => {
  const {dom,w}=await abrir();
  try {
    const input=w.document.getElementById('docs-search');
    const buttons=()=>[...w.document.querySelectorAll('#docs-generator-list button')].filter(b=>!b.hidden);
    const total=buttons().length;
    assert.equal(total,15);
    const groups=[...w.document.querySelectorAll('#docs-generator-list [role="group"]')];
    assert.equal(groups.length,4);
    for(const group of groups) {
      assert.ok(w.document.getElementById(group.getAttribute('aria-labelledby')));
      assert.equal(new Set([...group.querySelectorAll('button')].map(b=>b.dataset.category)).size,1);
    }
    const category=w.document.getElementById('docs-category');
    category.value='empresas';category.dispatchEvent(new w.Event('change'));
    assert.equal(buttons().length,3);
    input.value='cnpj';input.dispatchEvent(new w.Event('input'));
    assert.equal(buttons().length,2);
    w.document.getElementById('docs-search-clear').click();
    assert.equal(category.value,'todas');
    input.value='CONTEINER';input.dispatchEvent(new w.Event('input'));
    assert.equal(buttons().length,1);
    assert.match(buttons()[0].textContent,/Contêiner/);
    input.value='inexistente';input.dispatchEvent(new w.Event('input'));
    assert.equal(buttons().length,0);
    assert.match(w.document.getElementById('docs-search-status').textContent,/Nenhum/);
    w.document.getElementById('docs-search-clear').click();
    assert.equal(buttons().length,total);
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

test('menu expansível: seleção move o foco e Escape retorna ao botão', async () => {
  const {dom,w}=await abrir();
  try {
    const button=w.document.getElementById('workspace-menu-toggle');
    const navigation=w.document.getElementById('workspace-navigation');
    button.click();
    assert.equal(button.getAttribute('aria-expanded'),'true');
    // JSDOM outside-only does not execute HTML onclick attributes.
    w.switchTab('docs');
    w.document.getElementById('tab-btn-docs').click();
    assert.equal(button.getAttribute('aria-expanded'),'false');
    assert.equal(w.document.activeElement.id,'tab-docs');
    assert.equal(w.document.getElementById('tab-docs').hidden,false);
    button.click();
    w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(w.document.activeElement,button);
    assert.equal(navigation.classList.contains('is-open'),false);
  } finally {dom.window.close();}
});

test('HTML e todos os scripts inicializam; IDs únicos e arquivos locais existentes', async () => {
  const { dom, w, run } = await abrir();
  try {
    const ids = [...w.document.querySelectorAll('[id]')].map(el => el.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const file of scripts) assert.ok(fs.existsSync(path.join(root, file)));
    assert.equal(w.document.querySelectorAll('#downloadArea a').length, 2);
    assert.match(w.document.getElementById('xml-preview-code').textContent, /nfeProc/);
    assert.equal(run('Object.keys(xmlsGerados).length'), 2);
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
  const css=fs.readFileSync(path.join(root,'assets/css/usabilidade.css'),'utf8');
  const regra=css.match(/@media\(prefers-reduced-motion:reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] || '';
  assert.match(regra,/animation:none !important/);
  assert.match(regra,/transition:none !important/);
  assert.match(regra,/scroll-behavior:auto !important/);
});

test('paleta visual possui uma única fonte de tokens', () => {
  const arquivos=fs.readdirSync(path.join(root,'assets/css')).filter(nome=>nome.endsWith('.css'));
  const declarantes=arquivos.filter(nome=>/--bg\s*:/.test(fs.readFileSync(path.join(root,'assets/css',nome),'utf8')));
  assert.deepEqual(declarantes,['base.css']);
  const base=fs.readFileSync(path.join(root,'assets/css/base.css'),'utf8');
  assert.match(base,/--accent:\s*#7c3aed/);
  assert.match(base,/body\.dark[\s\S]*--bg:\s*#09080c/);
  assert.match(base,/body\.dark[\s\S]*--accent:\s*#a78bfa/);
});

test('pares principais de texto mantêm contraste mínimo de 4,5 para 1', () => {
  const luminancia=hex=>{
    const canais=hex.match(/[0-9a-f]{2}/gi).map(valor=>parseInt(valor,16)/255).map(valor=>valor<=.04045?valor/12.92:((valor+.055)/1.055)**2.4);
    return .2126*canais[0]+.7152*canais[1]+.0722*canais[2];
  };
  const contraste=(a,b)=>{const x=luminancia(a),y=luminancia(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  const pares=[['241b33','ffffff'],['655672','f5f1fb'],['ffffff','7c3aed'],['7c3aed','f0e8fc'],['1d7a4a','eaf5ef'],['b52f2f','ffffff'],['7030ce','ffffff'],['f5effc','131017'],['c1b3ce','1c1624'],['a78bfa','131017'],['3bd68c','0f2318'],['ef5b68','131017'],['c5adff','131017']];
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
      const xml=run(`serializarXml(xmlsGerados.${tipo})`);
      assert.equal(w.analisarXml(xml).status,'sem-erros');
      const prefixed=xml.replace(/(<\/?)([A-Za-z][\w]*)(?=[\s/>])/g,'$1f:$2').replace('xmlns=','xmlns:f=');
      assert.equal(w.analisarXml(prefixed).status,'sem-erros');
      assert.equal(w.analisarXml(xml.replace(/<CNPJ>\d+<\/CNPJ>/,'<CNPJ>00000000000000</CNPJ>')).status,'erro');
    }
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
    assert.equal(w.document.activeElement.id,'chat-anexo');
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
    assert.equal(run('verificarConsistenciaXml(xmlsGerados.cte).length'), 0);
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
    w.gerarLoteInterface();
    assert.equal(run('ultimoLote.length'),75);
    assert.equal(w.document.querySelectorAll('#lote-resultados .registro-lote').length,50);
    assert.match(w.document.getElementById('lote-status').textContent,/primeiros 50/);
    assert.equal(w.document.activeElement.id,'lote-resultados');
    w.limparLoteInterface();
    assert.equal(run('ultimoLote.length'),0);
    assert.equal(w.document.getElementById('lote-exportacao').hidden,true);
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
  const {dom,w}=await abrir();
  try {
    let copiado='';
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async valor=>{copiado=valor;}},configurable:true});
    assert.equal(await w.copiarTexto('valor teste','Valor copiado.'),true);
    assert.equal(copiado,'valor teste');
    assert.equal(w.document.getElementById('app-status').textContent,'Valor copiado.');
    assert.equal(w.document.getElementById('app-status-live').textContent,'Valor copiado.');
    assert.equal(await w.copiarTexto(''),false);
    assert.equal(w.document.getElementById('app-status-live').textContent,'Não há conteúdo para copiar.');
  } finally {dom.window.close();}
});

test('prévia XML permite baixar e validar o documento selecionado', async () => {
  const {dom,w,run}=await abrir();
  try {
    run('var downloadXmlAtual; baixarTexto=(nome,texto,mime)=>downloadXmlAtual={nome,texto,mime};');
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
