// ══════════════════════════════════════════════════════════
//  EDITOR XML
// ══════════════════════════════════════════════════════════

let editorArquivos = [];   // [{ id, nome, doc, modificado, grupoId, _estrutura }]
let editorGrupos = [];     // [{ id, nome }]
let editorGrupoAtivo = null;
let editorArquivoAtivoId = null;
let editorSubTabAtual = 'produtos';
let editorProxId = 1;
let editorProxGrupoId = 1;

const PRODUTO_CAMPOS_PRINCIPAIS = ['prod>cProd','prod>NCM','prod>CFOP','prod>qCom','prod>vUnCom','prod>vProd'];
const VOLUME_CAMPOS_PRINCIPAIS = ['qVol','esp','marca','nVol','pesoL','pesoB'];
const TOTAIS_CAMPOS = [
  ['vBC','B. Cálc. ICMS (VBC)'], ['vICMS','Valor ICMS (VICMS)'], ['vICMSDeson','ICMS Deson (VICMSDESON)'], ['vFCP','Valor FCP (VFCP)'], ['vBCST','B. Cálc. ICMS ST (VBCST)'],
  ['vST','Valor ICMS ST (VST)'], ['vFCPST','Valor FCP ST (VFCPST)'], ['vFCPSTRet','FCP ST Ret (VFCPSTRET)'], ['vProd','Valor dos Produtos (VPROD)'], ['vFrete','Valor Frete (VFRETE)'],
  ['vSeg','Valor Seguro (VSEG)'], ['vDesc','Valor Desconto (VDESC)'], ['vII','Valor II (VII)'], ['vIPI','Valor IPI (VIPI)'], ['vIPIDevol','IPI Devolvido (VIPIDEVOL)'],
  ['vPIS','Valor PIS (VPIS)'], ['vCOFINS','Valor COFINS (VCOFINS)'], ['vOutro','Outras Despesas (VOUTRO)'], ['vNF','Valor Total da NFe (VNF)']
];
const IDE_CAMPOS = [
  ['cUF','Cód. UF (CUF)'], ['cNF','Cód. NF (CNF)'], ['natOp','Natureza (NATOP)'],
  ['mod','Modelo (MOD)'], ['serie','Série (SERIE)'], ['nNF','Número NF (NNF)'],
  ['dhEmi','Data Emissão (DHEMI)'], ['dhSaiEnt','Data Saída/Entrada (DHSAIENT)'], ['tpNF','Tipo NF (TPNF)'],
  ['idDest','Destino (IDDEST)'], ['cMunFG','Cód. Mun. FG (CMUNFG)'], ['tpImp','Formato Imp. (TPIMP)'],
  ['tpEmis','Tipo Emissão (TPEMIS)'], ['cDV','Dígito Verif. (CDV)'], ['tpAmb','Ambiente (TPAMB)'],
  ['finNFe','Finalidade (FINNFE)'], ['indFinal','Cons. Final (INDFINAL)'], ['indPres','Presença (INDPRES)']
];

function editorInicializar() {
  const dropzone = document.getElementById('editor-dropzone');
  const fileInput = document.getElementById('editor-file-input');
  const fileInputAdd = document.getElementById('editor-file-input-add');

  fileInput.addEventListener('change', e => { editorCarregarArquivos(e.target.files); e.target.value = ''; });
  fileInputAdd.addEventListener('change', e => { editorCarregarArquivos(e.target.files); e.target.value = ''; });

  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('editor-dropzone-over'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('editor-dropzone-over'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('editor-dropzone-over');
    editorCarregarArquivos(e.dataTransfer.files);
  });

  const workspace = document.getElementById('editor-workspace');
  workspace.addEventListener('dragover', e => e.preventDefault());
  workspace.addEventListener('drop', e => { e.preventDefault(); editorCarregarArquivos(e.dataTransfer.files); });
}

/* ── Carregamento de arquivos ── */
function editorCarregarArquivos(files) {
  const xmlFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.xml'));
  if (!xmlFiles.length) return;
  editorGarantirGrupoPadrao();
  const parser = new DOMParser();
  let loaded = 0;
  let ultimoId = null;

  xmlFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const doc = parser.parseFromString(e.target.result, 'text/xml');
      if (!doc.querySelector('parsererror')) {
        const id = editorProxId++;
        editorArquivos.push({ id, nome: file.name, doc, original: serializarXml(doc), modificado: false, grupoId: editorGrupoAtivo, _estrutura: null });
        ultimoId = id;
      } else {
        mostrarStatus(`Erro: ${file.name} não é um XML válido.`);
      }
      if (++loaded === xmlFiles.length) editorPosCarga(ultimoId);
    };
    reader.readAsText(file, 'UTF-8');
  });
}

function editorPosCarga(ultimoId) {
  document.getElementById('editor-dropzone').style.display = 'none';
  document.getElementById('editor-workspace').style.display = '';
  if (ultimoId != null) editorArquivoAtivoId = ultimoId;
  editorRenderizarGrupos();
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

function editorMostrarDropzone() {
  editorArquivos = [];
  editorGrupos = [];
  editorGrupoAtivo = null;
  editorArquivoAtivoId = null;
  document.getElementById('editor-dropzone').style.display = '';
  document.getElementById('editor-workspace').style.display = 'none';
  document.getElementById('editor-grupos-bar').innerHTML = '';
  document.getElementById('editor-abas-arquivos').innerHTML = '';
}

/* ── Grupos ── */
function editorGarantirGrupoPadrao() {
  if (!editorGrupos.length) {
    const gid = editorProxGrupoId++;
    editorGrupos.push({ id: gid, nome: `Grupo ${gid}` });
    editorGrupoAtivo = gid;
  } else if (editorGrupoAtivo == null) {
    editorGrupoAtivo = editorGrupos[0].id;
  }
}

function editorNovoGrupo() {
  const gid = editorProxGrupoId++;
  editorGrupos.push({ id: gid, nome: `Grupo ${gid}` });
  editorGrupoAtivo = gid;
  editorArquivoAtivoId = null;
  editorRenderizarGrupos();
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

function editorSelecionarGrupo(gid) {
  editorGrupoAtivo = gid;
  const arqs = editorArquivos.filter(a => a.grupoId === gid);
  editorArquivoAtivoId = arqs.length ? arqs[arqs.length - 1].id : null;
  editorRenderizarGrupos();
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

function editorRenderizarGrupos() {
  const bar = document.getElementById('editor-grupos-bar');
  bar.innerHTML = editorGrupos.map(g => `
    <button type="button" class="nfe-group-tab${g.id === editorGrupoAtivo ? ' active' : ''}" onclick="editorSelecionarGrupo(${g.id})">${escapeHtml(g.nome)}</button>
  `).join('') + `<button type="button" class="nfe-group-tab nfe-group-add" onclick="editorNovoGrupo()"><i class="bi bi-plus-lg" aria-hidden="true"></i> Novo Grupo</button>`;
}

/* ── Abas de arquivos ── */
function editorRenderizarAbasArquivos() {
  const arqs = editorArquivos.filter(a => a.grupoId === editorGrupoAtivo);
  const bar = document.getElementById('editor-abas-arquivos');
  bar.innerHTML = arqs.length ? arqs.map(a => `
    <div class="nfe-file-tab${a.id === editorArquivoAtivoId ? ' active' : ''}">
      <button type="button" class="editor-file-select" id="editor-file-${a.id}" aria-pressed="${a.id === editorArquivoAtivoId}" onclick="editorSelecionarArquivo(${a.id});document.getElementById('editor-file-${a.id}').focus()">
      <i class="bi bi-file-earmark-code" style="font-size:12px" aria-hidden="true"></i>
      <span title="${escapeAttr(a.nome)}">${escapeHtml(a.nome)}</span>
      ${a.modificado ? '<span class="editor-modificado-badge" title="Este arquivo contém alterações">Alterado</span>' : ''}
      </button>
      <button type="button" class="nfe-file-tab-close" onclick="editorRemoverArquivo(${a.id})" aria-label="Fechar ${escapeAttr(a.nome)}">✕</button>
    </div>`).join('') : '<span style="font-size:12px;color:var(--text-dim);font-style:italic;padding:6px 4px">Nenhum arquivo neste grupo.</span>';
}

function editorSelecionarArquivo(id) {
  editorArquivoAtivoId = id;
  const arq = editorArquivos.find(a => a.id === id);
  if (arq) editorGrupoAtivo = arq.grupoId;
  editorRenderizarGrupos();
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

function editorRemoverArquivo(id) {
  const idx = editorArquivos.findIndex(a => a.id === id);
  if (idx < 0) return;
  const grupoId = editorArquivos[idx].grupoId;
  editorArquivos.splice(idx, 1);
  if (editorArquivoAtivoId === id) {
    const restantes = editorArquivos.filter(a => a.grupoId === grupoId);
    editorArquivoAtivoId = restantes.length ? restantes[restantes.length - 1].id : null;
  }
  if (!editorArquivos.length) { editorMostrarDropzone(); return; }
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

function editorRenomearArquivoAtivo(valor) {
  const arq = editorArquivos.find(a => a.id === editorArquivoAtivoId);
  if (!arq || !valor) return;
  arq.nome = valor;
  editorRenderizarAbasArquivos();
}

function editorLimparGrupo() {
  if (editorGrupoAtivo == null) return;
  editorArquivos = editorArquivos.filter(a => a.grupoId !== editorGrupoAtivo);
  editorArquivoAtivoId = null;
  if (!editorArquivos.length) { editorMostrarDropzone(); return; }
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

function editorExportarFinal() {
  const arqs = editorArquivos.filter(a => a.grupoId === editorGrupoAtivo);
  if (!arqs.length) { mostrarStatus('Nenhum arquivo neste grupo para exportar.'); return; }
  arqs.forEach((arq, i) => setTimeout(() => editorBaixarArquivo(arq.id), i * 200));
}

function editorBaixarArquivo(id) {
  const arq = editorArquivos.find(a => a.id === id);
  if (!arq) return;
  const xmlStr = new XMLSerializer().serializeToString(arq.doc);
  const blob = new Blob([xmlStr], { type: 'text/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = arq.nome; a.click();
  URL.revokeObjectURL(url);
}

function editorMostrarAjuda() {
  mostrarStatus('Carregue XMLs de NFe, organize em Grupos, edite Produtos, Volumes, Totais e Chaves nas abas acima, confira em Visualizar e exporte o resultado em Exportar XML Final.', 'success');
}

/* ── Sub-abas ── */
function editorTrocarSubTab(tab) {
  editorSubTabAtual = tab;
  editorRenderizarConteudo();
}

function editorRenderizarConteudo() {
  document.querySelectorAll('.nfe-subnav-btn').forEach(b => b.classList.toggle('active', b.dataset.sub === editorSubTabAtual));
  const cont = document.getElementById('editor-conteudo');
  const arq = editorArquivos.find(a => a.id === editorArquivoAtivoId);
  const nomeInput = document.getElementById('editor-nome-arquivo');
  if (!arq) {
    cont.innerHTML = '<div class="editor-campos-empty">Selecione um arquivo para editar seus campos.</div>';
    if (nomeInput) nomeInput.value = '';
    return;
  }
  if (nomeInput) nomeInput.value = arq.nome;
  switch (editorSubTabAtual) {
    case 'produtos':   cont.innerHTML = editorHtmlProdutos(arq); break;
    case 'volumes':    cont.innerHTML = editorHtmlVolumes(arq); break;
    case 'totais':     cont.innerHTML = editorHtmlTotais(arq); break;
    case 'chaves':     cont.innerHTML = editorHtmlChaves(arq); break;
    case 'visualizar': cont.innerHTML = editorHtmlVisualizar(arq); break;
    case 'alteracoes': cont.innerHTML = editorHtmlAlteracoes(arq); break;
    case 'estrutura':  cont.innerHTML = editorHtmlEstrutura(arq); break;
    default:           cont.innerHTML = editorHtmlProdutos(arq);
  }
}

/* ── Helpers NFe ── */
function editorInfNFe(arq) { return arq.doc.querySelector('NFe > infNFe'); }
function nfeVal(root, sel) {
  if (!root) return '';
  const el = root.querySelector(sel);
  return el ? el.textContent : '';
}
function criarElementoXML(doc, xmlFragment) {
  const wrapper = new DOMParser().parseFromString(`<raiz>${xmlFragment}</raiz>`, 'application/xml');
  return doc.importNode(wrapper.documentElement.firstElementChild, true);
}
function editorGetListaTipo(arq, tipo) {
  const infNFe = editorInfNFe(arq);
  switch (tipo) {
    case 'det':    return infNFe ? Array.from(infNFe.querySelectorAll('det')) : [];
    case 'vol':    return infNFe ? Array.from(infNFe.querySelectorAll('vol')) : [];
    case 'totais': { const t = infNFe ? infNFe.querySelector('ICMSTot') : null; return t ? [t] : []; }
    case 'ide':    { const i = infNFe ? infNFe.querySelector('ide') : null; return i ? [i] : []; }
    case 'prot':   { const p = arq.doc.querySelector('infProt'); return p ? [p] : []; }
    default: return [];
  }
}
function campoHtml(arqId, tipo, idx, campoSel, label, valor, destaque) {
  const fid = `f_${arqId}_${tipo}_${idx}_${campoSel}`.replace(/[^\w]/g, '_');
  return `<div class="nfe-field">
    <label for="${fid}">${escapeHtml(label)}</label>
    <input id="${fid}" class="nfe-input${destaque ? ' nfe-input-destaque' : ''}" type="text" value="${escapeAttr(valor)}"
      oninput="editorAtualizarCampoNFe(${arqId},'${tipo}',${idx},'${escapeAttr(campoSel)}',this.value)">
  </div>`;
}
function editorAtualizarCampoNFe(arqId, tipo, idx, campoSel, valor) {
  const arq = editorArquivos.find(a => a.id === arqId);
  if (!arq) return;
  const lista = editorGetListaTipo(arq, tipo);
  const item = lista[idx];
  if (!item) return;
  const el = item.querySelector(campoSel);
  if (el) {
    el.textContent = valor;
    arq.modificado = true;
    editorRenderizarAbasArquivos();
  }
}
function editorFiltrarCards(valor, className) {
  const normalizar = texto => String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const termo = normalizar(valor);
  let encontrados=0;
  document.querySelectorAll('.' + className).forEach(card => {
    const visivel=normalizar(card.dataset.busca).includes(termo);
    card.style.display = visivel ? '' : 'none';
    if(visivel)encontrados++;
  });
  const status=document.getElementById(className+'-busca-status');
  if(status)status.textContent=encontrados?`${encontrados} resultados encontrados.`:'Nenhum resultado. Apague a busca ou tente outro termo.';
}

function editorColetarCamposFolha(root) {
  const campos = [];
  function contarEEscolher(filhos) {
    const contagem = {};
    filhos.forEach(f => { contagem[f.localName] = (contagem[f.localName] || 0) + 1; });
    const usados = {};
    return filhos.map(f => {
      usados[f.localName] = (usados[f.localName] || 0) + 1;
      return contagem[f.localName] > 1 ? `${f.localName}:nth-of-type(${usados[f.localName]})` : f.localName;
    });
  }
  function walk(node, caminho) {
    const filhosEl = Array.from(node.children);
    if (!filhosEl.length) {
      if (node.textContent.trim() !== '') campos.push({ path: caminho });
      return;
    }
    const seletores = contarEEscolher(filhosEl);
    filhosEl.forEach((f, i) => walk(f, caminho ? `${caminho}>${seletores[i]}` : seletores[i]));
  }
  const filhosRaiz = Array.from(root.children);
  const seletoresRaiz = contarEEscolher(filhosRaiz);
  filhosRaiz.forEach((f, i) => walk(f, seletoresRaiz[i]));
  return campos;
}

function editorToggleTodosCampos(btn, arqId, tipo, idx, excluir) {
  const body = btn.nextElementSibling;
  if (body.dataset.carregado !== '1') {
    const arq = editorArquivos.find(a => a.id === arqId);
    const lista = editorGetListaTipo(arq, tipo);
    const item = lista[idx];
    if (!item) {
      body.innerHTML = '<p class="nfe-empty-mini">Elemento não encontrado.</p>';
    } else {
      const campos = editorColetarCamposFolha(item).filter(c => !excluir.includes(c.path));
      body.innerHTML = campos.length ? campos.map(c => {
        const fid = `tc_${arqId}_${tipo}_${idx}_${c.path}`.replace(/[^\w]/g, '_');
        const val = item.querySelector(c.path);
        return `<div class="nfe-field">
          <label for="${fid}" title="${escapeAttr(c.path)}">${escapeHtml(c.path.replace(/>/g, ' › '))}</label>
          <input id="${fid}" class="nfe-input" type="text" value="${escapeAttr(val ? val.textContent : '')}"
            oninput="editorAtualizarCampoNFe(${arqId},'${tipo}',${idx},'${escapeAttr(c.path)}',this.value)">
        </div>`;
      }).join('') : '<p class="nfe-empty-mini">Nenhum campo adicional encontrado.</p>';
    }
    body.dataset.carregado = '1';
  }
  const mostrar = body.style.display === 'none' || body.style.display === '';
  body.style.display = mostrar ? 'grid' : 'none';
  btn.classList.toggle('aberto', mostrar);
}

/* ── Produtos ── */
function editorHtmlProdutos(arq) {
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return '<div class="editor-campos-empty">Estrutura infNFe não encontrada neste XML.</div>';
  const dets = editorGetListaTipo(arq, 'det');
  const cards = dets.map((det, idx) => editorProdutoCard(arq.id, det, idx)).join('');
  return `
    <div class="nfe-section-header">
      <span class="nfe-section-title">PRODUTOS <span class="nfe-count-badge">${dets.length}</span></span>
      <div class="nfe-section-actions">
        <div class="nfe-search"><label for="editor-busca-produto" class="sr-only">Buscar produto por descrição, código ou NCM</label><input id="editor-busca-produto" type="search" placeholder="Descrição, código ou NCM" oninput="editorFiltrarCards(this.value,'nfe-produto-card')" aria-describedby="nfe-produto-card-busca-status"></div>
        <button type="button" class="nfe-btn nfe-btn-primary" onclick="editorAdicionarItem(${arq.id})"><i class="bi bi-plus-lg" aria-hidden="true"></i> Adicionar Item</button>
      </div>
    </div>
    <p class="texto-apoio" id="nfe-produto-card-busca-status" role="status" aria-live="polite">${dets.length} produtos neste arquivo.</p>
    <div class="nfe-cards-grid">${cards || '<div class="editor-campos-empty">Nenhum produto encontrado. Use Adicionar Item para começar.</div>'}</div>
  `;
}

function editorProdutoCard(arqId, det, idx) {
  const nItem = det.getAttribute('nItem') || String(idx + 1);
  const xProd = nfeVal(det, 'prod>xProd');
  const cProd = nfeVal(det, 'prod>cProd');
  const ncm = nfeVal(det, 'prod>NCM');
  const cfop = nfeVal(det, 'prod>CFOP');
  const qCom = nfeVal(det, 'prod>qCom');
  const vUnCom = nfeVal(det, 'prod>vUnCom');
  const vProd = nfeVal(det, 'prod>vProd');
  const busca = escapeAttr((cProd + ' ' + ncm + ' ' + xProd).toLowerCase());
  return `
  <div class="nfe-card nfe-produto-card" data-busca="${busca}">
    <div class="nfe-card-header">
      <span class="nfe-card-badge"><i class="bi bi-box-seam" aria-hidden="true"></i> ITEM ${escapeHtml(nItem)}</span>
      <button class="nfe-card-delete" onclick="editorRemoverItem(${arqId},${idx},this)" aria-label="Remover item"><i class="bi bi-trash" aria-hidden="true"></i></button>
    </div>
    <div class="nfe-card-title">${escapeHtml(xProd) || '(sem descrição)'}</div>
    <div class="nfe-field-grid nfe-field-grid-3">
      ${campoHtml(arqId, 'det', idx, 'prod>cProd', 'COD. (CPROD)', cProd)}
      ${campoHtml(arqId, 'det', idx, 'prod>NCM', 'NCM', ncm)}
      ${campoHtml(arqId, 'det', idx, 'prod>CFOP', 'CFOP', cfop)}
      ${campoHtml(arqId, 'det', idx, 'prod>qCom', 'QTD (QCOM)', qCom)}
      ${campoHtml(arqId, 'det', idx, 'prod>vUnCom', 'V. UNITÁRIO', vUnCom)}
      ${campoHtml(arqId, 'det', idx, 'prod>vProd', 'V. TOTAL', vProd, true)}
    </div>
    <button type="button" class="nfe-ver-todos" onclick="editorToggleTodosCampos(this,${arqId},'det',${idx},PRODUTO_CAMPOS_PRINCIPAIS)"><i class="bi bi-file-earmark-text" aria-hidden="true"></i> Ver todos os campos (imposto, etc)</button>
    <div class="nfe-todos-campos-body" style="display:none"></div>
  </div>`;
}

function editorRemoverItem(arqId, idx, btn) {
  if (!btn.classList.contains('confirmar')) {
    btn.classList.add('confirmar');
    btn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i>';
    setTimeout(() => { btn.classList.remove('confirmar'); btn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>'; }, 2000);
    return;
  }
  const arq = editorArquivos.find(a => a.id === arqId);
  const lista = editorGetListaTipo(arq, 'det');
  const det = lista[idx];
  if (det && det.parentNode) {
    det.parentNode.removeChild(det);
    arq.modificado = true;
    editorRenderizarAbasArquivos();
    editorRenderizarConteudo();
  }
}

function editorAdicionarItem(arqId) {
  const arq = editorArquivos.find(a => a.id === arqId);
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return;
  const dets = Array.from(infNFe.querySelectorAll('det'));
  let novo;
  if (dets.length) {
    novo = dets[dets.length - 1].cloneNode(true);
  } else {
    novo = criarElementoXML(arq.doc, '<det><prod><cProd>0</cProd><cEAN>SEM GTIN</cEAN><xProd>Novo produto</xProd><NCM>00000000</NCM><CFOP>5102</CFOP><uCom>UN</uCom><qCom>1.0000</qCom><vUnCom>0.00</vUnCom><vProd>0.00</vProd><cEANTrib>SEM GTIN</cEANTrib><uTrib>UN</uTrib><qTrib>1.0000</qTrib><vUnTrib>0.00</vUnTrib><indTot>1</indTot></prod></det>');
  }
  novo.setAttribute('nItem', String(dets.length + 1));
  if (dets.length) {
    dets[dets.length - 1].after(novo);
  } else {
    const total = infNFe.querySelector('total');
    if (total) total.before(novo); else infNFe.appendChild(novo);
  }
  arq.modificado = true;
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
  mostrarStatus('Item adicionado.');
}

/* ── Volumes ── */
function editorHtmlVolumes(arq) {
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return '<div class="editor-campos-empty">Estrutura infNFe não encontrada neste XML.</div>';
  const vols = editorGetListaTipo(arq, 'vol');
  const cards = vols.map((vol, idx) => editorVolumeCard(arq.id, vol, idx)).join('');
  return `
    <div class="nfe-section-header">
      <span class="nfe-section-title">VOLUMES (VOL) <span class="nfe-count-badge">${vols.length}</span></span>
      <div class="nfe-section-actions">
        <div class="nfe-search"><label for="editor-busca-volume" class="sr-only">Buscar volume por espécie, marca ou número</label><input id="editor-busca-volume" type="search" placeholder="Espécie, marca ou número" oninput="editorFiltrarCards(this.value,'nfe-volume-card')" aria-describedby="nfe-volume-card-busca-status"></div>
        <button type="button" class="nfe-btn nfe-btn-primary" onclick="editorAdicionarVolume(${arq.id})"><i class="bi bi-plus-lg" aria-hidden="true"></i> Adicionar Volume</button>
      </div>
    </div>
    <p class="texto-apoio" id="nfe-volume-card-busca-status" role="status" aria-live="polite">${vols.length} volumes neste arquivo.</p>
    <div class="nfe-cards-grid">${cards || '<div class="editor-campos-empty">Nenhum volume encontrado. Use Adicionar Volume para começar.</div>'}</div>
  `;
}

function editorVolumeCard(arqId, vol, idx) {
  const qVol = nfeVal(vol, 'qVol');
  const esp = nfeVal(vol, 'esp');
  const nVol = nfeVal(vol, 'nVol');
  const marca = nfeVal(vol, 'marca');
  const pesoL = nfeVal(vol, 'pesoL');
  const pesoB = nfeVal(vol, 'pesoB');
  const busca = escapeAttr((esp + ' ' + marca + ' ' + nVol).toLowerCase());
  return `
  <div class="nfe-card nfe-volume-card" data-busca="${busca}">
    <div class="nfe-card-header">
      <span class="nfe-card-badge"><i class="bi bi-box" aria-hidden="true"></i> VOLUME ${idx + 1}</span>
      <button class="nfe-card-delete" onclick="editorRemoverVolume(${arqId},${idx},this)" aria-label="Remover volume"><i class="bi bi-trash" aria-hidden="true"></i></button>
    </div>
    <div class="nfe-field-grid nfe-field-grid-2">
      ${campoHtml(arqId, 'vol', idx, 'qVol', 'QTD (QVOL)', qVol)}
      ${campoHtml(arqId, 'vol', idx, 'esp', 'ESPÉCIE (ESP)', esp)}
      ${campoHtml(arqId, 'vol', idx, 'nVol', 'NUMERAÇÃO (NVOL)', nVol)}
      ${campoHtml(arqId, 'vol', idx, 'marca', 'MARCA (MARCA)', marca)}
      ${campoHtml(arqId, 'vol', idx, 'pesoL', 'PESO LÍQUIDO (PESOL)', pesoL)}
      ${campoHtml(arqId, 'vol', idx, 'pesoB', 'PESO BRUTO (PESOB)', pesoB)}
    </div>
    <button type="button" class="nfe-ver-todos" onclick="editorToggleTodosCampos(this,${arqId},'vol',${idx},VOLUME_CAMPOS_PRINCIPAIS)"><i class="bi bi-file-earmark-text" aria-hidden="true"></i> Ver todos os campos (lacre, etc)</button>
    <div class="nfe-todos-campos-body" style="display:none"></div>
  </div>`;
}

function editorRemoverVolume(arqId, idx, btn) {
  if (!btn.classList.contains('confirmar')) {
    btn.classList.add('confirmar');
    btn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i>';
    setTimeout(() => { btn.classList.remove('confirmar'); btn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>'; }, 2000);
    return;
  }
  const arq = editorArquivos.find(a => a.id === arqId);
  const lista = editorGetListaTipo(arq, 'vol');
  const vol = lista[idx];
  if (vol && vol.parentNode) {
    vol.parentNode.removeChild(vol);
    arq.modificado = true;
    editorRenderizarAbasArquivos();
    editorRenderizarConteudo();
  }
}

function editorAdicionarVolume(arqId) {
  const arq = editorArquivos.find(a => a.id === arqId);
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return;
  const transp = infNFe.querySelector('transp');
  if (!transp) { mostrarStatus('Elemento <transp> não encontrado neste XML.'); return; }
  const vols = Array.from(transp.querySelectorAll('vol'));
  const novo = vols.length
    ? vols[vols.length - 1].cloneNode(true)
    : criarElementoXML(arq.doc, '<vol><qVol>1</qVol><esp>VOLUME</esp><marca></marca><nVol></nVol><pesoL>0.000</pesoL><pesoB>0.000</pesoB></vol>');
  transp.appendChild(novo);
  arq.modificado = true;
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
  mostrarStatus('Volume adicionado.');
}

/* ── Totais ── */
function editorHtmlTotais(arq) {
  const infNFe = editorInfNFe(arq);
  const icmsTot = infNFe ? infNFe.querySelector('ICMSTot') : null;
  if (!icmsTot) return '<div class="editor-campos-empty">Elemento ICMSTot não encontrado neste XML.</div>';
  const campos = TOTAIS_CAMPOS.map(([tag, label]) => campoHtml(arq.id, 'totais', 0, tag, label, nfeVal(icmsTot, tag), tag === 'vProd' || tag === 'vNF')).join('');
  return `
    <div class="nfe-section-header"><span class="nfe-section-title">TOTAIS DA NFE (ICMSTOT)</span></div>
    <div class="nfe-card">
      <div class="nfe-card-badge"><i class="bi bi-calculator" aria-hidden="true"></i> TOTALIZADORES</div>
      <div class="nfe-field-grid nfe-field-grid-5">${campos}</div>
    </div>
  `;
}

/* ── Chaves ── */
function editorHtmlChaves(arq) {
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return '<div class="editor-campos-empty">Elemento infNFe não encontrado neste XML.</div>';
  const ide = infNFe.querySelector('ide');
  const infProt = arq.doc.querySelector('infProt');
  const ideCampos = ide
    ? IDE_CAMPOS.map(([tag, label]) => campoHtml(arq.id, 'ide', 0, tag, label, nfeVal(ide, tag))).join('')
    : '<p class="nfe-empty-mini">Elemento &lt;ide&gt; não encontrado.</p>';
  const idAttr = infNFe.getAttribute('Id') || '';
  const idField = `<div class="nfe-field">
    <label for="editor-id-attr">Atributo Id (INFNFE ID)</label>
    <input id="editor-id-attr" class="nfe-input" type="text" value="${escapeAttr(idAttr)}" oninput="editorAtualizarIdAttr(${arq.id},this.value)">
  </div>`;
  let protHtml = '<p class="nfe-empty-mini">Protocolo (infProt) não encontrado neste XML.</p>';
  if (infProt) {
    protHtml = `<div class="nfe-field-grid nfe-field-grid-2">
      ${campoHtml(arq.id, 'prot', 0, 'chNFe', 'Chave de Acesso (CHNFE)', nfeVal(infProt, 'chNFe'))}
      ${campoHtml(arq.id, 'prot', 0, 'nProt', 'Número Prot. (NPROT)', nfeVal(infProt, 'nProt'))}
      ${campoHtml(arq.id, 'prot', 0, 'digVal', 'Digest Value (DIGVAL)', nfeVal(infProt, 'digVal'))}
      ${campoHtml(arq.id, 'prot', 0, 'cStat', 'Status (CSTAT)', nfeVal(infProt, 'cStat'))}
      ${campoHtml(arq.id, 'prot', 0, 'xMotivo', 'Motivo (XMOTIVO)', nfeVal(infProt, 'xMotivo'))}
    </div>`;
  }
  return `
    <div class="nfe-section-header">
      <span class="nfe-section-title">CHAVES E IDENTIFICAÇÃO (IDE / PROTNFE)</span>
      <button type="button" class="nfe-btn nfe-btn-accent" onclick="editorSomarUm(${arq.id})"><i class="bi bi-plus-circle" aria-hidden="true"></i> Somar +1 (nNF / chNFe)</button>
    </div>
    <div class="nfe-chaves-layout">
      <div class="nfe-card">
        <div class="nfe-card-badge"><i class="bi bi-key" aria-hidden="true"></i> IDENTIFICAÇÃO (IDE)</div>
        <div class="nfe-field-grid nfe-field-grid-3">${ideCampos}</div>
      </div>
      <div class="nfe-chaves-col">
        <div class="nfe-card">
          <div class="nfe-card-badge nfe-badge-green"><i class="bi bi-fingerprint" aria-hidden="true"></i> ID PRINCIPAL DO XML</div>
          ${idField}
        </div>
        <div class="nfe-card">
          <div class="nfe-card-badge nfe-badge-blue"><i class="bi bi-patch-check" aria-hidden="true"></i> PROTOCOLO (INFPROT)</div>
          ${protHtml}
        </div>
      </div>
    </div>
  `;
}

function editorAtualizarIdAttr(arqId, valor) {
  const arq = editorArquivos.find(a => a.id === arqId);
  const infNFe = editorInfNFe(arq);
  if (infNFe) { infNFe.setAttribute('Id', valor); arq.modificado = true; editorRenderizarAbasArquivos(); }
}

function editorSomarUm(arqId) {
  const arq = editorArquivos.find(a => a.id === arqId);
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return;
  const ide = infNFe.querySelector('ide');
  const nNFEl = ide ? ide.querySelector('nNF') : null;
  if (!nNFEl) { mostrarStatus('Campo nNF não encontrado neste XML.'); return; }

  const novoNNF = (parseInt(nNFEl.textContent || '0', 10) || 0) + 1;
  const novoNNFStr = String(novoNNF);
  nNFEl.textContent = novoNNFStr;

  const idAttr = infNFe.getAttribute('Id') || '';
  const infProt = arq.doc.querySelector('infProt');
  const chaveAtual = idAttr.replace(/^NFe/, '') || nfeVal(infProt, 'chNFe');

  if (chaveAtual && chaveAtual.length === 44) {
    const partes = getChaveParts(chaveAtual);
    partes.numero = novoNNFStr.padStart(9, '0');
    const chavesObj = formarNovaChave({ partes });
    const novaChave = chavesObj.chave;
    infNFe.setAttribute('Id', 'NFe' + novaChave);
    const cDVEl = ide.querySelector('cDV');
    if (cDVEl) cDVEl.textContent = String(partes.dv);
    if (infProt) {
      const chNFeEl = infProt.querySelector('chNFe');
      if (chNFeEl) chNFeEl.textContent = novaChave;
    }
    const ref = arq.doc.querySelector('Reference');
    if (ref && ref.getAttribute('URI') === `#NFe${chaveAtual}`) ref.setAttribute('URI', `#NFe${novaChave}`);
    mostrarStatus('Número da NF e chave de acesso atualizados.');
  } else {
    mostrarStatus('Número da NF atualizado (chave de 44 dígitos não encontrada para recalcular).');
  }

  arq.modificado = true;
  editorRenderizarAbasArquivos();
  editorRenderizarConteudo();
}

/* ── Visualizar (prévia DANFE) ── */
function editorHtmlVisualizar(arq) {
  const infNFe = editorInfNFe(arq);
  if (!infNFe) return '<div class="editor-campos-empty">Não foi possível montar a prévia deste XML.</div>';
  const emit = infNFe.querySelector('emit');
  const dest = infNFe.querySelector('dest');
  const ide = infNFe.querySelector('ide');
  const icmsTot = infNFe.querySelector('ICMSTot');
  const transp = infNFe.querySelector('transp');
  const infProt = arq.doc.querySelector('infProt');
  const chave = (infNFe.getAttribute('Id') || '').replace(/^NFe/, '') || nfeVal(infProt, 'chNFe');
  const emitEnder = emit ? emit.querySelector('enderEmit') : null;
  const destEnder = dest ? dest.querySelector('enderDest') : null;

  const enderStr = el => el ? [nfeVal(el, 'xLgr'), nfeVal(el, 'nro')].filter(Boolean).join(', ') : '';
  const fmt = v => { const n = parseFloat(v); return isNaN(n) ? '0,00' : n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  return `
  <div class="nfe-danfe">
    <div class="nfe-danfe-topo">
      <div>
        <strong>${escapeHtml(nfeVal(emit, 'xNome'))}</strong>
        <div>${escapeHtml(enderStr(emitEnder))}${emitEnder ? ' - ' + escapeHtml(nfeVal(emitEnder, 'xBairro')) : ''}</div>
        <div>${escapeHtml(nfeVal(emitEnder, 'xMun'))} - ${escapeHtml(nfeVal(emitEnder, 'UF'))}</div>
        <div>CEP: ${escapeHtml(nfeVal(emitEnder, 'CEP'))} | Fone: ${escapeHtml(nfeVal(emitEnder, 'fone'))}</div>
      </div>
      <div class="nfe-danfe-titulo">
        <strong>DANFE</strong>
        <div>Documento Auxiliar da Nota Fiscal Eletrônica</div>
        <div>SÉRIE: ${escapeHtml(nfeVal(ide, 'serie'))}</div>
        <div>Nº ${escapeHtml(nfeVal(ide, 'nNF'))}</div>
      </div>
      <div class="nfe-danfe-chave">
        <strong>CHAVE DE ACESSO</strong>
        <div class="nfe-danfe-mono">${escapeHtml(chave)}</div>
        <div>Protocolo de Autorização de Uso</div>
        <div class="nfe-danfe-mono">${escapeHtml(nfeVal(infProt, 'nProt'))} - ${escapeHtml(nfeVal(infProt, 'dhRecbto'))}</div>
      </div>
    </div>
    <div class="nfe-danfe-linha">
      <div><strong>NATUREZA DA OPERAÇÃO:</strong> ${escapeHtml(nfeVal(ide, 'natOp'))}</div>
      <div><strong>INSCRIÇÃO ESTADUAL:</strong> ${escapeHtml(nfeVal(emit, 'IE'))}</div>
      <div><strong>CNPJ:</strong> ${escapeHtml(nfeVal(emit, 'CNPJ') || nfeVal(emit, 'CPF'))}</div>
    </div>
    <div class="nfe-danfe-secao-titulo">DESTINATÁRIO / REMETENTE</div>
    <div class="nfe-danfe-grid">
      <div><strong>NOME/RAZÃO SOCIAL</strong>${escapeHtml(nfeVal(dest, 'xNome'))}</div>
      <div><strong>CNPJ/CPF</strong>${escapeHtml(nfeVal(dest, 'CNPJ') || nfeVal(dest, 'CPF'))}</div>
      <div><strong>DATA DE EMISSÃO</strong>${escapeHtml(nfeVal(ide, 'dhEmi'))}</div>
      <div><strong>ENDEREÇO</strong>${escapeHtml(enderStr(destEnder))}</div>
      <div><strong>BAIRRO/DISTRITO</strong>${escapeHtml(nfeVal(destEnder, 'xBairro'))}</div>
      <div><strong>MUNICÍPIO/UF</strong>${escapeHtml(nfeVal(destEnder, 'xMun'))} / ${escapeHtml(nfeVal(destEnder, 'UF'))}</div>
      <div><strong>CEP</strong>${escapeHtml(nfeVal(destEnder, 'CEP'))}</div>
    </div>
    <div class="nfe-danfe-secao-titulo">CÁLCULO DO IMPOSTO</div>
    <div class="nfe-danfe-grid nfe-danfe-grid-6">
      <div><strong>BASE DE CÁLCULO ICMS</strong>${fmt(nfeVal(icmsTot, 'vBC'))}</div>
      <div><strong>VALOR DO ICMS</strong>${fmt(nfeVal(icmsTot, 'vICMS'))}</div>
      <div><strong>BASE ICMS S.T.</strong>${fmt(nfeVal(icmsTot, 'vBCST'))}</div>
      <div><strong>VALOR ICMS SUBST.</strong>${fmt(nfeVal(icmsTot, 'vST'))}</div>
      <div><strong>VALOR TOTAL PRODUTOS</strong>${fmt(nfeVal(icmsTot, 'vProd'))}</div>
      <div><strong>VALOR FRETE</strong>${fmt(nfeVal(icmsTot, 'vFrete'))}</div>
      <div><strong>VALOR SEGURO</strong>${fmt(nfeVal(icmsTot, 'vSeg'))}</div>
      <div><strong>DESCONTO</strong>${fmt(nfeVal(icmsTot, 'vDesc'))}</div>
      <div><strong>OUTRAS DESPESAS</strong>${fmt(nfeVal(icmsTot, 'vOutro'))}</div>
      <div><strong>VALOR DO IPI</strong>${fmt(nfeVal(icmsTot, 'vIPI'))}</div>
      <div><strong>VALOR TOTAL DA NOTA</strong>${fmt(nfeVal(icmsTot, 'vNF'))}</div>
    </div>
    <div class="nfe-danfe-secao-titulo">TRANSPORTADOR / VOLUMES TRANSPORTADOS</div>
    <div class="nfe-danfe-grid">
      <div><strong>RAZÃO SOCIAL</strong>${escapeHtml(nfeVal(transp, 'transporta>xNome'))}</div>
      <div><strong>FRETE POR CONTA</strong>${escapeHtml(nfeVal(transp, 'modFrete'))}</div>
      <div><strong>PLACA DO VEÍCULO</strong>${escapeHtml(nfeVal(transp, 'veicTransp>placa'))}</div>
      <div><strong>CNPJ/CPF</strong>${escapeHtml(nfeVal(transp, 'transporta>CNPJ') || nfeVal(transp, 'transporta>CPF'))}</div>
    </div>
  </div>`;
}

/* ── Estrutura XML completa (visão genérica em árvore) ── */
function editorHtmlEstrutura(arq) {
  const grupos = {};
  function percorrer(no, caminho) {
    no.childNodes.forEach(filho => {
      if (filho.nodeType !== 1) return;
      const tag = filho.localName;
      const path = caminho ? `${caminho} › ${tag}` : tag;
      const temFilhoEl = Array.from(filho.childNodes).some(n => n.nodeType === 1);
      if (!temFilhoEl && filho.textContent.trim() !== '') {
        const secao = path.split(' › ')[0];
        if (!grupos[secao]) grupos[secao] = [];
        grupos[secao].push({ path, no: filho });
      } else {
        percorrer(filho, path);
      }
    });
  }
  const raiz = arq.doc.documentElement;
  percorrer(raiz, raiz.localName);
  arq._estrutura = grupos;

  const secoes = Object.keys(grupos);
  if (!secoes.length) return '<p style="color:var(--text-dim);font-style:italic;padding:1rem 0">Nenhum campo editável encontrado.</p>';

  return secoes.map(secao => {
    const gid = `eg_${arq.id}_${secao}`.replace(/\W/g, '_');
    const itens = grupos[secao].map((item, i) => {
      const fid = `ef_${arq.id}_${secao}_${i}`.replace(/\W/g, '_');
      const labelCurto = item.path.split(' › ').slice(1).join(' › ') || item.path;
      return `<div class="editor-field-item">
        <label class="editor-field-label" for="${fid}" title="${escapeAttr(item.path)}">${escapeHtml(labelCurto)}</label>
        <input class="editor-field-input" id="${fid}" type="text" value="${escapeAttr(item.no.textContent)}"
          oninput="editorEstruturaAtualizarCampo(${arq.id},'${escapeAttr(secao)}',${i},this.value)"
          aria-label="${escapeAttr(item.path)}" />
        <button class="editor-field-remove" onclick="editorEstruturaIniciarRemocao(this,${arq.id},'${escapeAttr(secao)}',${i})">Remover</button>
      </div>`;
    }).join('');
    return `<div class="editor-field-group" id="${gid}">
      <div class="editor-field-group-header" onclick="editorEstruturaToggleGrupo('${gid}')">
        <span>${escapeHtml(secao)}</span>
        <span id="${gid}_count" style="font-weight:400;opacity:.6">${grupos[secao].length} campo${grupos[secao].length !== 1 ? 's' : ''}</span>
      </div>
      <div class="editor-field-group-body">${itens}</div>
    </div>`;
  }).join('');
}

function editorEstruturaToggleGrupo(gid) {
  const body = document.getElementById(gid).querySelector('.editor-field-group-body');
  body.style.display = body.style.display === 'none' ? '' : 'none';
}

function editorEstruturaAtualizarCampo(arqId, secao, i, valor) {
  const arq = editorArquivos.find(a => a.id === arqId);
  const g = arq && arq._estrutura;
  if (g && g[secao] && g[secao][i]) {
    g[secao][i].no.textContent = valor;
    arq.modificado = true;
    editorRenderizarAbasArquivos();
  }
}

function editorEstruturaIniciarRemocao(btn, arqId, secao, i) {
  const arq = editorArquivos.find(a => a.id === arqId);
  if (!arq) return;
  if (btn.classList.contains('confirmar')) {
    const g = arq._estrutura;
    if (g && g[secao] && g[secao][i]) {
      const no = g[secao][i].no;
      no.parentNode && no.parentNode.removeChild(no);
      g[secao].splice(i, 1);
      arq.modificado = true;
      btn.closest('.editor-field-item').remove();
      const countEl = document.getElementById(`eg_${arqId}_${secao}`.replace(/\W/g, '_') + '_count');
      if (countEl) {
        const n = g[secao].length;
        countEl.textContent = `${n} campo${n !== 1 ? 's' : ''}`;
      }
      editorRenderizarAbasArquivos();
    }
  } else {
    btn.classList.add('confirmar');
    btn.textContent = 'Confirmar';
    setTimeout(() => { btn.classList.remove('confirmar'); btn.textContent = 'Remover'; }, 2000);
  }
}
