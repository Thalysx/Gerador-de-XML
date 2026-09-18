// ══════════════════════════════════════════════════════════
//  XML GENERATOR
// ══════════════════════════════════════════════════════════
const acao = { inicio: "inicio", regenerar: "regenerar", campos: "campos" };

function getHierarquiaNFe() {
  let proc = "nfeProc", doc = `${proc} > NFe`, inf = `${doc} > infNFe`, ide = `${inf} > ide`;
  return {
    inf_Id: inf, uf: `${ide} > cUF`, codigo: `${ide} > cNF`, natureza: `${ide} > natOp`,

    recinto: `${inf} > infAdic > infCpl`,

    modelo: `${ide} > mod`, serie: `${ide} > serie`, numero: `${ide} > nNF`,
    tipoEmissao: `${ide} > tpEmis`, dv: `${ide} > cDV`,
    reference_URI: `${doc} > Signature > SignedInfo > Reference`,
    chave: `${proc} > protNFe > infProt > chNFe`,
    emit: `${inf} > emit > CNPJ`, emitNome: `${inf} > emit > xNome`,
    dest: `${inf} > dest > CNPJ`, destNome: `${inf} > dest > xNome`,
    transp: `${inf} > transp > transporta > CNPJ`, transpNome: `${inf} > transp > transporta > xNome`,
    itens: `${inf} > det`,
    item: { codigo: `prod > cProd`, nome: `prod > xProd`, qtd: `prod > indTot`, ncm: `prod > NCM`, cfop: `prod > CFOP`, valor: `prod > vProd` }
  };
}

function getHierarquiaCTe() {
  let proc = "cteProc", doc = `${proc} > CTe`, inf = `${doc} > infCte`, ide = `${inf} > ide`;
  return {
    inf_Id: inf, uf: `${ide} > cUF`, codigo: `${ide} > cCT`, natureza: `${ide} > natOp`,
    modelo: `${ide} > mod`, serie: `${ide} > serie`, numero: `${ide} > nCT`,
    tipoEmissao: `${ide} > tpEmis`, dv: `${ide} > cDV`,
    reference_URI: `${doc} > Signature > SignedInfo > Reference`,
    qrCode: `${doc} > infCteSupl > qrCodCTe`, chave: `${proc} > protCTe > infProt > chCTe`,
    chaveNFe: `${inf} > infCteNorm > infDoc > infNFe > chave`,
    emit: `${inf} > emit > CNPJ`, emitNome: `${inf} > emit > xNome`,
    rem: `${inf} > rem > CNPJ`, remNome: `${inf} > rem > xNome`,
    receb: `${inf} > receb > CNPJ`, recebNome: `${inf} > receb > xNome`,
    dest: `${inf} > dest > CNPJ`, destNome: `${inf} > dest > xNome`
  };
}

let quantidadeItensXml = null;
let lockAtivo = false;
const LOCKABLE_FIELDS = [
  'cte_cnpjEmit','cte_nomeEmit','cte_cnpjRem','cte_nomeRem','cte_cnpjReceb','cte_nomeReceb','cte_cnpjDest','cte_nomeDest',
  'Emitente_Nota','nfe_nomeEmit','nfe_cnpjDest','nfe_nomeDest','nfe_cnpjTransp','nfe_nomeTransp'
];

function toggleLock() {
  lockAtivo = !lockAtivo;
  const btn = document.getElementById('lock-btn');
  const lockIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  const unlockIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
  btn.innerHTML = lockAtivo ? lockIcon + ' Desbloquear alterações' : unlockIcon + ' Bloquear alterações';
  btn.setAttribute('aria-pressed', String(lockAtivo));
  btn.setAttribute('aria-label', lockAtivo ? 'Desbloquear alterações dos campos XML' : 'Bloquear alterações dos campos XML');
  lockAtivo ? btn.classList.add('active') : btn.classList.remove('active');
  LOCKABLE_FIELDS.forEach(id => { const el = document.getElementById(id); if (!el) return; lockAtivo ? el.classList.add('locked') : el.classList.remove('locked'); });
  document.querySelectorAll('.produto-item').forEach((item, idx) => {
    ['nome','ncm','codigo','qCom','qTrib','valor'].forEach(campo => {
      const el = document.getElementById(`nfes_prod_${idx}_${campo}`);
      if (!el) return;
      lockAtivo ? el.classList.add('locked') : el.classList.remove('locked');
    });
  });
  salvarEstadoXml();
}

function salvarCamposTravados() {
  if (!lockAtivo) return null;
  const snap = {};
  LOCKABLE_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) snap[id] = el.value; });
  document.querySelectorAll('.produto-item').forEach((item, idx) => {
    ['select','nome','ncm','codigo','qCom','qTrib','valor','uCom'].forEach(campo => {
      const el = document.getElementById(`nfes_prod_${idx}_${campo}`);
      if (el) snap[`nfes_prod_${idx}_${campo}`] = el.value;
    });
  });
  return snap;
}

function restaurarCamposTravados(snap) {
  if (!snap) return;
  Object.entries(snap).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
  document.querySelectorAll('.produto-item').forEach((item, idx) => {
    const uCom = snap[`nfes_prod_${idx}_uCom`];
    if (uCom) setUnidade(idx, uCom);
  });
}

let xmlAutoTimer = null;
function scheduleGerarXMLComCampos() {
  clearTimeout(xmlAutoTimer);
  xmlAutoTimer = setTimeout(() => {
    if (document.getElementById('tab-xml')?.classList.contains('active')) {
      gerarXMLComCampos();
      salvarEstadoXml();
    }
  }, 120);
}

function setupXmlAutoGenerate() {
  const tab = document.getElementById('tab-xml');
  if (!tab || tab.dataset.autoXmlReady) return;
  tab.dataset.autoXmlReady = '1';
  tab.addEventListener('input', (event) => {
    if (event.target.matches('.field-input:not([readonly]):not(:disabled)')) scheduleGerarXMLComCampos();
  });
  tab.addEventListener('change', (event) => {
    if (event.target.matches('.produto-select, .field-input:not([readonly]):not(:disabled)')) scheduleGerarXMLComCampos();
  });
}

function processarXML(action) {
  let xml = xmlStringModelToObject();
  const hierarquia = { nfe: getHierarquiaNFe(), cte: getHierarquiaCTe() };
  if (action === acao.inicio || action === acao.regenerar) {
    const snap = salvarCamposTravados();
    xml = geraNovosNumerosCodigosAleatorios(xml, hierarquia);
    preencherCamposFormulario(xml, hierarquia);
    restaurarCamposTravados(snap);
    if (lockAtivo) {
      document.querySelectorAll('.produto-item').forEach((item, idx) => {
        ['nome','ncm','codigo','qCom','qTrib','valor'].forEach(campo => {
          const el = document.getElementById(`nfes_prod_${idx}_${campo}`);
          if (el) el.classList.add('locked');
        });
      });
    }
  }
  finalizarEGerarXML(xml, hierarquia, action === acao.regenerar);
  if (action !== acao.inicio) salvarEstadoXml();
}

/* ══ Dados dinâmicos do gerador de NFe (evita repetição entre gerações) ══ */
const MUNICIPIOS_NFE = [
  { nome: 'Balsas',         uf: 'MA', cMun: '2101400' },
  { nome: 'São Paulo',      uf: 'SP', cMun: '3550308' },
  { nome: 'Santos',         uf: 'SP', cMun: '3548500' },
  { nome: 'Rio de Janeiro', uf: 'RJ', cMun: '3304557' },
  { nome: 'Belo Horizonte', uf: 'MG', cMun: '3106200' },
  { nome: 'Curitiba',       uf: 'PR', cMun: '4106902' },
  { nome: 'Paranaguá',      uf: 'PR', cMun: '4118204' },
  { nome: 'Goiânia',        uf: 'GO', cMun: '5208707' },
  { nome: 'Itajaí',         uf: 'SC', cMun: '4208203' },
  { nome: 'Rondonópolis',   uf: 'MT', cMun: '5107602' },
];
const NATUREZAS_OPERACAO_NFE = [
  'REMESSA FORM LOTE EXPORT MERC REC TER',
  'VENDA DE MERCADORIA PARA EXPORTACAO',
  'REMESSA PARA FORMACAO DE LOTE',
  'REMESSA DE MERCADORIA PARA DEPOSITO',
  'VENDA DE PRODUCAO DO ESTABELECIMENTO',
  'REMESSA PARA ARMAZEM GERAL',
  'TRANSFERENCIA DE MERCADORIA ENTRE ESTABELECIMENTOS',
];
const ESPECIES_VOLUME_NFE = ['GRANEL', 'SACARIA', 'CAIXAS', 'FARDOS', 'TAMBORES', 'BIG BAG', 'PALETES'];
const MOD_FRETE_NFE = ['0', '1', '9'];

function gerarCEPRawNFe() { return Array.from({ length: 8 }, () => rand(10)).join(''); }
function gerarFoneRawNFe(uf = '') {
  return gerarTelefoneBR({ uf }).raw;
}
function gerarIENFe() { return String(rand(900000000) + 100000000); }

function gerarEnderecoEstruturadoNFe() {
  const tipos = ['R', 'AV', 'ROD', 'TRAV'];
  const nomes = ['DAS ACACIAS', 'BRASIL', 'SANTOS DUMONT', 'GETULIO VARGAS', 'RIO BRANCO', 'DOS EXPEDICIONARIOS', 'DA INDUSTRIA', 'DO COMERCIO', 'CENTRAL', 'BR 230 KM'];
  const bairros = ['CENTRO', 'JARDIM AMERICA', 'VILA NOVA', 'DISTRITO INDUSTRIAL', 'BOA VISTA', 'ZONA RURAL', 'JARDIM EUROPA'];
  const cidade = pick(MUNICIPIOS_NFE);
  return {
    xLgr: `${pick(tipos)} ${pick(nomes)}`,
    nro: String(rand(8999) + 100),
    xBairro: pick(bairros),
    cMun: cidade.cMun, xMun: cidade.nome.toUpperCase(), UF: cidade.uf,
    CEP: gerarCEPRawNFe(), fone: gerarFoneRawNFe(cidade.uf)
  };
}

let dadosAleatoriosNFeAtual = null;
function gerarDadosAleatoriosNFe() {
  return {
    natOp: pick(NATUREZAS_OPERACAO_NFE),
    enderEmit: gerarEnderecoEstruturadoNFe(),
    enderDest: gerarEnderecoEstruturadoNFe(),
    enderRetirada: gerarEnderecoEstruturadoNFe(),
    retiradaEmpresa: gerarNomeEmpresa(),
    retiradaCNPJ: gerarCNPJRawNumerico(),
    ieEmit: gerarIENFe(), ieDest: gerarIENFe(), ieRetirada: gerarIENFe(), ieTransp: gerarIENFe(),
    emailDest: gerarEmailPessoa(), emailRetirada: gerarEmailPessoa(),
    transpEnder: gerarEnderecoEstruturadoNFe(),
    modFrete: pick(MOD_FRETE_NFE),
    especieVolume: pick(ESPECIES_VOLUME_NFE),
  };
}
function obterDadosAleatoriosNFe(forcarNovo) {
  if (forcarNovo || !dadosAleatoriosNFeAtual) dadosAleatoriosNFeAtual = gerarDadosAleatoriosNFe();
  return dadosAleatoriosNFeAtual;
}

function aplicarDadosDinamicosNFe(nfeDoc, dados) {
  const setText = (sel, val) => { const el = nfeDoc.querySelector(sel); if (el != null && val != null) el.textContent = val; };
  const preencherEndereco = (prefixo, end) => {
    setText(`${prefixo} > xLgr`, end.xLgr);
    setText(`${prefixo} > nro`, end.nro);
    setText(`${prefixo} > xBairro`, end.xBairro);
    setText(`${prefixo} > cMun`, end.cMun);
    setText(`${prefixo} > xMun`, end.xMun);
    setText(`${prefixo} > UF`, end.UF);
    setText(`${prefixo} > CEP`, end.CEP);
    setText(`${prefixo} > fone`, end.fone);
  };

  setText('ide > natOp', dados.natOp);
  setText('ide > cUF', dados.enderEmit.cMun.slice(0,2));
  setText('ide > cMunFG', dados.enderEmit.cMun);

  preencherEndereco('emit > enderEmit', dados.enderEmit);
  setText('emit > IE', dados.ieEmit);
  const nomeEmit = document.getElementById('nfe_nomeEmit')?.value || '';
  if (nomeEmit) setText('emit > xFant', `${nomeEmit.split(' ')[0]} ${dados.enderEmit.xMun}`);

  preencherEndereco('dest > enderDest', dados.enderDest);
  setText('dest > IE', dados.ieDest);
  setText('dest > email', dados.emailDest);

  setText('retirada > CNPJ', dados.retiradaCNPJ);
  setText('retirada > xNome', dados.retiradaEmpresa);
  setText('retirada > xLgr', dados.enderRetirada.xLgr);
  setText('retirada > nro', dados.enderRetirada.nro);
  setText('retirada > xBairro', dados.enderRetirada.xBairro);
  setText('retirada > cMun', dados.enderRetirada.cMun);
  setText('retirada > xMun', dados.enderRetirada.xMun);
  setText('retirada > UF', dados.enderRetirada.UF);
  setText('retirada > CEP', dados.enderRetirada.CEP);
  setText('retirada > fone', dados.enderRetirada.fone);
  setText('retirada > email', dados.emailRetirada);
  setText('retirada > IE', dados.ieRetirada);

  setText('transp > modFrete', dados.modFrete);
  setText('transp > transporta > xEnder', `${dados.transpEnder.xLgr}, ${dados.transpEnder.nro}`);
  setText('transp > transporta > xMun', dados.transpEnder.xMun);
  setText('transp > transporta > UF', dados.transpEnder.UF);
  setText('transp > transporta > IE', dados.ieTransp);
  setText('transp > vol > esp', dados.especieVolume);
}

function recalcularTotaisEPesoNFe(nfeDoc) {
  const dets = Array.from(nfeDoc.querySelectorAll('det'));
  let totalProd = 0, totalPeso = 0;
  dets.forEach(det => {
    totalProd += parseFloat(det.querySelector('prod > vProd')?.textContent) || 0;
    const quantidade = parseFloat(det.querySelector('prod > qCom')?.textContent) || 0;
    totalPeso += quantidade * (det.querySelector('prod > uCom')?.textContent === 'TON' ? 1000 : 1);
  });
  const setText = (sel, val) => { const el = nfeDoc.querySelector(sel); if (el) el.textContent = val; };
  setText('ICMSTot > vProd', totalProd.toFixed(2));
  setText('ICMSTot > vNF', totalProd.toFixed(2));
  setText('vol > qVol', String(Math.max(1, Math.round(totalPeso))));
  setText('vol > pesoL', totalPeso.toFixed(3));
  setText('vol > pesoB', totalPeso.toFixed(3));
}

function gerarXMLComCampos(forcarNovosDadosAleatorios = false) {
  let xml = xmlStringModelToObject();
  const hierarquia = { nfe: getHierarquiaNFe(), cte: getHierarquiaCTe() };
  finalizarEGerarXML(xml, hierarquia, forcarNovosDadosAleatorios);
}

function finalizarEGerarXML(xml, hierarquia, forcarNovosDadosAleatorios = false) {
  const dadosDinamicos = obterDadosAleatoriosNFe(forcarNovosDadosAleatorios);
  let chaves = {};
  chaves.cte  = { chave: xml.cte.querySelector(hierarquia.cte.chave).textContent.trim() };
  chaves.nfes = [{ chave: xml.nfeList[0].querySelector(hierarquia.nfe.chave).textContent.trim() }];
  chaves.cte.partes      = getChaveParts(chaves.cte.chave);
  chaves.nfes[0].partes  = getChaveParts(chaves.nfes[0].chave);
  chaves.cte.partes.numero     = document.getElementById("cte_numero").value.replace(/\D/g,'').padStart(9,'0').substring(0,9);
  chaves.cte.partes.codigo     = document.getElementById("cte_codigo").value.replace(/\D/g,'').padStart(8,'0').substring(0,8);
  chaves.nfes[0].partes.numero = document.getElementById("nfe_numero").value.replace(/\D/g,'').padStart(9,'0').substring(0,9);
  chaves.nfes[0].partes.codigo = document.getElementById("nfe_codigo").value.replace(/\D/g,'').padStart(8,'0').substring(0,8);
  chaves.nfes[0].partes.cnpj   = document.getElementById("Emitente_Nota").value.replace(/\D/g, '').padStart(14, '0').substring(0, 14);
  chaves.nfes[0].partes.uf = dadosDinamicos.enderEmit.cMun.slice(0,2);
  chaves.cte.partes.cnpj = document.getElementById('cte_cnpjEmit').value;
  chaves.cte     = formarNovaChave(chaves.cte);
  chaves.nfes[0] = formarNovaChave(chaves.nfes[0]);
  if (chaves.cte.partes.dv === false || chaves.nfes[0].partes.dv === false) {
    mostrarStatus('Chave inválida: erro no cálculo do dígito verificador.', 'error');
    return;
  }
  xml = alteraCamposEmFuncaoDasNovasChaves(xml, chaves);
  aplicarDadosDinamicosNFe(xml.nfeList[0], dadosDinamicos);
  recalcularTotaisEPesoNFe(xml.nfeList[0]);
  document.getElementById('cte_chave').value = chaves.cte.chave;
  document.getElementById('nfe_chave').value = chaves.nfes[0].chave;
  apagaDownloadLinks();
  const arquivos = [
    geraDownloadLinks(xml.cte, "CTe"),
    geraDownloadLinks(xml.nfeList[0], "NFe"),
  ];
  atualizarStatusDownloadsXml(arquivos);
  guardarXmlsGerados(xml);
}

function xmlStringModelToObject() {
  const parser = new DOMParser();
  const nfe = parser.parseFromString(nfeModel, 'text/xml');
  const inf = nfe.querySelector('infNFe');
  const modelo = inf.querySelector('det').cloneNode(true);
  const quantidade = quantidadeItensXml || inf.querySelectorAll('det').length;
  while (inf.querySelectorAll('det').length > quantidade) [...inf.querySelectorAll('det')].pop().remove();
  while (inf.querySelectorAll('det').length < quantidade) inf.insertBefore(modelo.cloneNode(true), inf.querySelector('total'));
  inf.querySelectorAll('det').forEach((det, idx) => det.setAttribute('nItem', String(idx+1)));
  return { cte:parser.parseFromString(cteModel, 'text/xml'), nfeList:[nfe] };
}

function preencherCamposFormulario(xml, hierarquia) {
  const fields = [
    { id: 'cte_codigo', tag: hierarquia.cte.codigo, doc: 'cte' },
    { id: 'cte_numero', tag: hierarquia.cte.numero, doc: 'cte' },
    { id: 'cte_chave',  tag: hierarquia.cte.chave,  doc: 'cte' },
    { id: 'cte_cnpjEmit',  tag: hierarquia.cte.emit,     doc: 'cte' },
    { id: 'cte_nomeEmit',  tag: hierarquia.cte.emitNome, doc: 'cte' },
    { id: 'cte_cnpjRem',   tag: hierarquia.cte.rem,      doc: 'cte' },
    { id: 'cte_nomeRem',   tag: hierarquia.cte.remNome,  doc: 'cte' },
    { id: 'cte_cnpjReceb', tag: hierarquia.cte.receb,    doc: 'cte' },
    { id: 'cte_nomeReceb', tag: hierarquia.cte.recebNome,doc: 'cte' },
    { id: 'cte_cnpjDest',  tag: hierarquia.cte.dest,     doc: 'cte' },
    { id: 'cte_nomeDest',  tag: hierarquia.cte.destNome, doc: 'cte' },
    { id: 'nfe_codigo',    tag: hierarquia.nfe.codigo,   doc: 'nfe' },
    { id: 'nfe_numero',    tag: hierarquia.nfe.numero,   doc: 'nfe' },
    { id: 'nfe_chave',     tag: hierarquia.nfe.chave,    doc: 'nfe' },
    { id: 'nfe_recinto',   tag: hierarquia.nfe.recinto,  doc: 'nfe' },
    { id: 'Emitente_Nota', tag: hierarquia.nfe.emit,     doc: 'nfe' },
    { id: 'nfe_nomeEmit',  tag: hierarquia.nfe.emitNome, doc: 'nfe' },
    { id: 'nfe_cnpjDest',  tag: hierarquia.nfe.dest,     doc: 'nfe' },
    { id: 'nfe_nomeDest',  tag: hierarquia.nfe.destNome, doc: 'nfe' },
    { id: 'nfe_cnpjTransp',  tag: hierarquia.nfe.transp,    doc: 'nfe' },
    { id: 'nfe_nomeTransp',  tag: hierarquia.nfe.transpNome,doc: 'nfe' },
  ];
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    const xmlDoc = f.doc === 'cte' ? xml.cte : xml.nfeList[0];
    const node = xmlDoc.querySelector(f.tag);

    if (node) {
      const valor = node.textContent.trim();
      el.value = f.id === 'nfe_recinto' ? valor.replace(/^C[oó]digo RA\s*[:\-]?\s*/i, '') : valor;
    }

  });
  const produtosTags = xml.nfeList[0].querySelectorAll(hierarquia.nfe.itens);
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';
  produtosTags.forEach((prod, idx) => {
    const codigoAtual = prod.querySelector(hierarquia.nfe.item.codigo)?.textContent || '';
    const nomeAtual   = prod.querySelector(hierarquia.nfe.item.nome)?.textContent || '';
    const ncmAtual    = prod.querySelector(hierarquia.nfe.item.ncm)?.textContent || '';
    const cfop        = prod.querySelector(hierarquia.nfe.item.cfop)?.textContent || '';
    const qtd         = prod.querySelector(hierarquia.nfe.item.qtd)?.textContent || '';
    const valor       = prod.querySelector(hierarquia.nfe.item.valor)?.textContent || '';
    const qCom = prod.querySelector('prod > qCom')?.textContent || '';
    const uCom = prod.querySelector('prod > uCom')?.textContent || 'KG';
    const qTrib = prod.querySelector('prod > qTrib')?.textContent || '';
    const produtoAtual = catalogoProdutos.find(p =>
      p.codigo === codigoAtual ||
      p.ncm === ncmAtual ||
      p.nome.toLocaleUpperCase('pt-BR') === nomeAtual.toLocaleUpperCase('pt-BR')
    );
    const nomeVisual = produtoAtual?.nome || nomeAtual;
    const options = catalogoProdutos.map(p => `<option value="${escapeAttr(p.nome)}" data-ncm="${escapeAttr(p.ncm)}" data-codigo="${escapeAttr(p.codigo)}" ${p.nome === nomeVisual ? 'selected' : ''}>${escapeHtml(p.nome)}</option>`).join('');
    container.innerHTML += `
      <div class="produto-item" role="group" aria-labelledby="nfes_prod_${idx}_title">
        <div class="produto-header" id="nfes_prod_${idx}_title">Item ${idx + 1} <button type="button" class="btn-xs" onclick="alterarItensXml(${idx})" aria-label="Remover produto ${idx + 1}">Remover</button></div>
        <div class="field-row">
          <label class="field-label" for="nfes_prod_${idx}_select">Produto do item</label>
          <select class="produto-select" id="nfes_prod_${idx}_select" onchange="onProdutoChange(${idx})">
            <option value="">Selecione um produto</option>${options}
          </select>
        </div>
        <div class="field-row-inline">
          <div><label class="field-label" for="nfes_prod_${idx}_codigo">Código do produto</label><input class="field-input" id="nfes_prod_${idx}_codigo" value="${escapeAttr(codigoAtual)}" inputmode="numeric" autocomplete="off" /></div>
          <div><label class="field-label" for="nfes_prod_${idx}_ncm">NCM</label><input class="field-input" id="nfes_prod_${idx}_ncm" value="${escapeAttr(ncmAtual)}" inputmode="numeric" autocomplete="off" /></div>
        </div>
        <div class="field-row"><label class="field-label" for="nfes_prod_${idx}_nome">Nome ou descrição</label><input class="field-input" id="nfes_prod_${idx}_nome" value="${escapeAttr(nomeVisual)}" /></div>
        <div class="field-row-inline">
          <div><label class="field-label" for="nfes_prod_${idx}_qCom">Quantidade comercial (qCom)</label><input class="field-input" id="nfes_prod_${idx}_qCom" value="${escapeAttr(qCom)}" inputmode="decimal" autocomplete="off" /></div>
          <div>
            <div class="field-label" id="nfes_prod_${idx}_unidade_label">Unidade comercial</div>
            <div class="unit-toggle-row" role="group" aria-labelledby="nfes_prod_${idx}_unidade_label">
              <button type="button" class="unit-btn ${uCom==='KG'?'active':''}" id="nfes_prod_${idx}_uCom_kg" onclick="setUnidade(${idx},'KG')" aria-pressed="${uCom==='KG'}" aria-label="Usar quilograma como unidade comercial">Quilograma</button>
              <button type="button" class="unit-btn ${uCom==='TON'?'active':''}" id="nfes_prod_${idx}_uCom_ton" onclick="setUnidade(${idx},'TON')" aria-pressed="${uCom==='TON'}" aria-label="Usar tonelada como unidade comercial">Tonelada</button>
              <input type="hidden" id="nfes_prod_${idx}_uCom" value="${escapeAttr(uCom)}" />
            </div>
          </div>
        </div>
        <div class="field-row-inline">
          <div><label class="field-label" for="nfes_prod_${idx}_qTrib">Quantidade tributária (qTrib)</label><input class="field-input" id="nfes_prod_${idx}_qTrib" value="${escapeAttr(qTrib)}" inputmode="decimal" autocomplete="off" /></div>
          <div><label class="field-label" for="nfes_prod_${idx}_valor">Valor total (vProd)</label><input class="field-input" id="nfes_prod_${idx}_valor" value="${escapeAttr(valor)}" inputmode="decimal" autocomplete="off" /></div>
        </div>
        <div class="field-row-inline">
          <div><label class="field-label" for="nfes_prod_${idx}_CFOP">CFOP (somente leitura)</label><input class="field-input" id="nfes_prod_${idx}_CFOP" value="${escapeAttr(cfop)}" inputmode="numeric" autocomplete="off" readonly /></div>
        </div>
      </div>`;
  });
}

function onProdutoChange(idx) {
  const sel = document.getElementById(`nfes_prod_${idx}_select`);
  const opt = sel.options[sel.selectedIndex];
  if (!opt.value) return;
  document.getElementById(`nfes_prod_${idx}_nome`).value   = opt.value;
  document.getElementById(`nfes_prod_${idx}_ncm`).value    = opt.dataset.ncm;
  document.getElementById(`nfes_prod_${idx}_codigo`).value = opt.dataset.codigo;
  scheduleGerarXMLComCampos();
}

function setUnidade(idx, unidade) {
  const hiddenInput = document.getElementById(`nfes_prod_${idx}_uCom`);
  const prevUnit = hiddenInput.value;
  hiddenInput.value = unidade;
  if (prevUnit && prevUnit !== unidade) {
    const qComEl  = document.getElementById(`nfes_prod_${idx}_qCom`);
    const qTribEl = document.getElementById(`nfes_prod_${idx}_qTrib`);
    if (qComEl) {
      const raw = parseFloat(qComEl.value.replace(',', '.')) || 0;
      const converted = unidade === 'TON' ? (raw / 1000).toFixed(4) : (raw * 1000).toFixed(4);
      qComEl.value = converted;
      if (qTribEl) qTribEl.value = converted;
    }
  }
  const kgBtn = document.getElementById(`nfes_prod_${idx}_uCom_kg`);
  const tonBtn = document.getElementById(`nfes_prod_${idx}_uCom_ton`);
  kgBtn.classList.toggle('active', unidade === 'KG');
  tonBtn.classList.toggle('active', unidade === 'TON');
  kgBtn.setAttribute('aria-pressed', String(unidade === 'KG'));
  tonBtn.setAttribute('aria-pressed', String(unidade === 'TON'));
  scheduleGerarXMLComCampos();
}

function geraNovosNumerosCodigosAleatorios(xml, hierarquia) {
  xml.cte.querySelector(hierarquia.cte.codigo).textContent        = gerarCodigoAleatorio();
  xml.cte.querySelector(hierarquia.cte.numero).textContent        = gerarNumeroAleatorio();
  xml.nfeList[0].querySelector(hierarquia.nfe.codigo).textContent = gerarCodigoAleatorio();
  xml.nfeList[0].querySelector(hierarquia.nfe.numero).textContent = gerarNumeroAleatorio();
  [[xml.cte, hierarquia.cte], [xml.nfeList[0], hierarquia.nfe]].forEach(([doc, h]) => {
    for (const papel of ['emit', 'rem', 'receb', 'dest', 'transp']) {
      if (!h[papel]) continue;
      const cnpj = doc.querySelector(h[papel]);
      const nome = doc.querySelector(h[papel + 'Nome']);
      if (cnpj) cnpj.textContent = gerarCNPJRawNumerico();
      if (nome) nome.textContent = gerarNomeEmpresa();
    }
  });
  return xml;
}

function gerarCodigoAleatorio() { return rand(90000000) + 10000000; }
function gerarNumeroAleatorio() { return rand(900000000) + 100000000; }

function getChaveParts(chave) {
  return { uf: chave.substring(0,2), ano: chave.substring(2,4), mes: chave.substring(4,6), cnpj: chave.substring(6,20), modelo: chave.substring(20,22), serie: chave.substring(22,25), numero: chave.substring(25,34), emissao: chave.substring(34,35), codigo: chave.substring(35,43), dv: chave.substring(43,44) };
}

function calcularDV(chaveParts) {
  let key = Object.values(chaveParts).join('');
  key = key.substring(0, key.length - chaveParts.dv.length);
  // Sanitiza: remove não-dígitos e garante exatamente 43 caracteres
  const keyClean = key.replace(/\D/g, '');
  if (keyClean.length !== 43) return false;
  let indice = keyClean.length - 1, multiplicador = 2, soma = 0;
  for (; indice >= 0; indice--) {
    soma += parseInt(keyClean.charAt(indice)) * multiplicador;
    multiplicador++;
    if (multiplicador > 9) multiplicador = 2;
  }
  const resto = soma % 11;
  let digito = 11 - resto;
  if (digito >= 10) digito = 0;
  return digito;
}

function formarNovaChave(chavesObject) {
  chavesObject.partes.dv = calcularDV(chavesObject.partes);
  chavesObject.chave = Object.values(chavesObject.partes).join('');
  return chavesObject;
}

function alteraCamposEmFuncaoDasNovasChaves(xml, chaves) {
  const h = getHierarquiaNFe(), hc = getHierarquiaCTe();
  for (const papel of ['emit','rem','receb','dest']) {
    const ids = { emit:['cte_cnpjEmit','cte_nomeEmit'], rem:['cte_cnpjRem','cte_nomeRem'], receb:['cte_cnpjReceb','cte_nomeReceb'], dest:['cte_cnpjDest','cte_nomeDest'] }[papel];
    xml.cte.querySelector(hc[papel]).textContent = document.getElementById(ids[0]).value;
    xml.cte.querySelector(hc[papel+'Nome']).textContent = document.getElementById(ids[1]).value;
  }
  const qrCode = `https://cte.fazenda.mg.gov.br/portalcte/sistema/qrcode.xhtml?chCTe=${chaves.cte.chave}&tpAmb=1`;
  xml.cte.querySelector(hc.chave).textContent  = chaves.cte.chave;
  xml.cte.querySelector(hc.codigo).textContent = chaves.cte.partes.codigo;
  xml.cte.querySelector(hc.numero).textContent = chaves.cte.partes.numero;
  xml.cte.querySelector(hc.dv).textContent = chaves.cte.partes.dv;
  xml.cte.querySelector(hc.inf_Id).setAttribute("Id", "CTe" + chaves.cte.chave);
  xml.cte.querySelector(hc.reference_URI).setAttribute("URI", "#CTe" + chaves.cte.chave);
  xml.cte.querySelector(hc.qrCode).textContent  = qrCode;
  xml.cte.querySelector(hc.chaveNFe).textContent = chaves.nfes[0].chave;
  xml.nfeList[0].querySelector(h.chave).textContent  = chaves.nfes[0].chave;
  xml.nfeList[0].querySelector(h.codigo).textContent = chaves.nfes[0].partes.codigo;
  xml.nfeList[0].querySelector(h.numero).textContent = chaves.nfes[0].partes.numero;
  xml.nfeList[0].querySelector(h.dv).textContent = chaves.nfes[0].partes.dv;
  xml.nfeList[0].querySelector(h.emit).textContent   = document.getElementById("Emitente_Nota").value || chaves.nfes[0].partes.cnpj;
  xml.nfeList[0].querySelector(h.emitNome).textContent   = document.getElementById("nfe_nomeEmit").value;
  const setNFeText = (selector, inputId) => {
    const node = xml.nfeList[0].querySelector(selector);
    const input = document.getElementById(inputId);
    if (node && input) node.textContent = input.value;
  };
  setNFeText(h.dest, 'nfe_cnpjDest');
  setNFeText(h.destNome, 'nfe_nomeDest');

  const recinto = document.getElementById('nfe_recinto')?.value.trim();
  const infoComplementar = xml.nfeList[0].querySelector(h.recinto);
  if (infoComplementar) {
    if (recinto) infoComplementar.textContent = `Código RA ${recinto}`;
    else infoComplementar.remove();
  }

  xml.nfeList[0].querySelector(h.transp).textContent     = document.getElementById("nfe_cnpjTransp").value;
  xml.nfeList[0].querySelector(h.transpNome).textContent = document.getElementById("nfe_nomeTransp").value;
  xml.nfeList[0].querySelector(h.inf_Id).setAttribute("Id", "NFe" + chaves.nfes[0].chave);
  xml.nfeList[0].querySelector(h.reference_URI).setAttribute("URI", "#NFe" + chaves.nfes[0].chave);
  const prodItems = xml.nfeList[0].querySelectorAll(h.itens);
  prodItems.forEach((det, idx) => {
    const g = id => document.getElementById(`nfes_prod_${idx}_${id}`);
    if (g('nome'))   det.querySelector(h.item.nome).textContent   = g('nome').value;
    if (g('codigo')) det.querySelector(h.item.codigo).textContent = g('codigo').value;
    if (g('ncm'))    det.querySelector(h.item.ncm).textContent    = g('ncm').value;
    const n = (tag) => det.querySelector(tag);
    if (g('qCom'))  { const e = n('prod > qCom');  if (e) e.textContent = g('qCom').value; }
    if (g('uCom'))  {
      const uComVal = g('uCom').value;
      const eCom  = n('prod > uCom');  if (eCom)  eCom.textContent = uComVal;
      const eTrib = n('prod > uTrib'); if (eTrib) eTrib.textContent = uComVal;
    }
    if (g('qTrib')) { const e = n('prod > qTrib'); if (e) e.textContent = g('qTrib').value; }
    if (g('valor')) { const e = n('prod > vProd'); if (e) e.textContent = g('valor').value; }
    const total = Number(n('prod > vProd')?.textContent);
    for (const [qtdTag, valorTag] of [['qCom','vUnCom'], ['qTrib','vUnTrib']]) {
      const quantidade = Number(n('prod > ' + qtdTag)?.textContent);
      const unitario = n('prod > ' + valorTag);
      if (unitario && quantidade > 0 && Number.isFinite(total)) unitario.textContent = (total / quantidade).toFixed(10);
    }
  });
  return xml;
}

function geraDownloadLinks(xmlDoc, docNome) {
  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  const blob = new Blob([xmlString], { type: "text/xml" });
  const url  = URL.createObjectURL(blob);
  const area = document.getElementById('downloadArea');
  const arquivo = docNome + ".xml";
  const a = document.createElement('a');
  a.href = url;
  a.download = arquivo;
  a.className = 'download-badge';
  a.setAttribute('aria-label', `Baixar arquivo ${arquivo}`);
  a.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v8M5 7l3 3 3-3M2 12h12" /></svg>Baixar ${escapeHtml(arquivo)}`;
  area.appendChild(a);
  return arquivo;
}

function apagaDownloadLinks() {
  document.querySelectorAll('#downloadArea a').forEach(a => URL.revokeObjectURL(a.href));
  document.getElementById('downloadArea').innerHTML = '';
}

function atualizarStatusDownloadsXml(arquivos) {
  const status = document.getElementById('xml-download-status');
  if (!status) return;
  const nomes = (arquivos || []).filter(Boolean);
  status.textContent = nomes.length
    ? `${nomes.length} arquivos XML gerados: ${nomes.join(' e ')}.`
    : 'Nenhum arquivo XML gerado ainda.';
}

function salvarEstadoXml() {
  const snap = {};
  [
    'cte_codigo','cte_numero','cte_cnpjEmit','cte_nomeEmit','cte_cnpjRem',
    'cte_nomeRem','cte_cnpjReceb','cte_nomeReceb','cte_cnpjDest','cte_nomeDest',
    'nfe_codigo','nfe_numero','Emitente_Nota','nfe_nomeEmit','nfe_cnpjDest',
    'nfe_nomeDest','nfe_cnpjTransp','nfe_nomeTransp','nfe_recinto'
  ].forEach(id => { const el = document.getElementById(id); if (el) snap[id] = el.value; });
  document.querySelectorAll('.produto-item').forEach((_, idx) => {
    ['select','nome','ncm','codigo','qCom','qTrib','valor','uCom'].forEach(campo => {
      const el = document.getElementById(`nfes_prod_${idx}_${campo}`);
      if (el) snap[`nfes_prod_${idx}_${campo}`] = el.value;
    });
  });
  storageSet('gerador:xml_campos', snap);
  storageSet('gerador:xml_quantidade', document.querySelectorAll('.produto-item').length);
  storageSet('gerador:lock', lockAtivo);
}

function restaurarEstadoXml() {
  const snap = storageGet('gerador:xml_campos');
  const lockSalvo = storageGet('gerador:lock', false);
  if (snap) {
    quantidadeItensXml = Math.min(50, Math.max(1, Number(storageGet('gerador:xml_quantidade', 1)) || 1));
    preencherCamposFormulario(xmlStringModelToObject(), { nfe:getHierarquiaNFe(), cte:getHierarquiaCTe() });
    Object.entries(snap).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    document.querySelectorAll('.produto-item').forEach((_, idx) => {
      const uCom = snap[`nfes_prod_${idx}_uCom`];
      if (uCom) setUnidade(idx, uCom);
    });
    gerarXMLComCampos();
  }
  if (lockSalvo && !lockAtivo) toggleLock();
}
