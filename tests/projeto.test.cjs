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

test('validação XML: sintaxe, namespaces, protocolo, arquivos e cópia no editor', async () => {
  const { dom, w, run } = await abrir();
  try {
    assert.equal(w.analisarXml('<a>').status,'erro');
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

test('interface IA envia somente anexo explícito, renderiza texto seguro e permite modo local', async () => {
  const { dom,w,run }=await abrir();
  try {
    let sent;
    w.fetch=async (url,options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({sessionId:'mock',text:'<img src=x onerror=alert(1)>',artifacts:[{kind:'records',name:'dados.json',records:[{tipo:'nome',rotulo:'Nome',valor:'Pessoa teste'}]}],activities:['gerar_dados']})};};
    w.document.getElementById('chat-pedido').value='Me ajude a gerar um nome';
    await w.enviarChatIa();
    assert.equal(sent.xml,undefined);
    assert.equal(w.document.querySelectorAll('#chat-ia-mensagens img').length,0);
    assert.equal(w.document.querySelectorAll('#chat-ia-mensagens .registro-lote').length,1);
    w.document.getElementById('chat-anexo').value='<a/>';
    w.document.getElementById('chat-pedido').value='Analise este XML';
    await w.enviarChatIa();
    assert.equal(sent.sessionId,'mock'); assert.equal(sent.xml,'<a/>');
    w.limparChat(); assert.equal(run('sessaoIa'),null);
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
