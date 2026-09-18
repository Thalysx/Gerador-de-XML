let xmlsGerados = {};
let cenariosXml = [];

function guardarXmlsGerados(xml) {
  xmlsGerados = { nfe: xml.nfeList[0].cloneNode(true), cte: xml.cte.cloneNode(true) };
  atualizarPreviaXml();
}

function serializarXml(doc) { return new XMLSerializer().serializeToString(doc); }

function formatarXmlPreview(doc) {
  let nivel = 0;
  return serializarXml(doc).replace(/>\s*</g, '>\n<').split('\n').map(linha => {
    if (/^<\//.test(linha)) nivel = Math.max(0, nivel - 1);
    const resultado = '  '.repeat(nivel) + linha;
    if (/^<[^!?/][^>]*>$/.test(linha) && !/\/>$/.test(linha) && !/<\//.test(linha)) nivel++;
    return resultado;
  }).join('\n');
}

function verificarConsistenciaXml(doc) {
  const problemas = [];
  const nfe = doc.querySelector('NFe > infNFe');
  const inf = nfe || doc.querySelector('infCte');
  if (!inf) return ['Estrutura NF-e/CT-e não reconhecida.'];
  const chave = (inf.getAttribute('Id') || '').replace(/^(NFe|CTe)/, '');
  if (!/^\d{44}$/.test(chave) || Number(chave[43]) !== calcularDV(getChaveParts(chave))) problemas.push('Chave de acesso com formato ou dígito inconsistente.');
  else {
    const partes = getChaveParts(chave);
    const campos = [['cUF','uf',2], ['mod','modelo',2], ['serie','serie',3], [nfe ? 'nNF' : 'nCT','numero',9], [nfe ? 'cNF' : 'cCT','codigo',8]];
    for (const [tag, parte, tamanho] of campos) {
      const valor = inf.querySelector(`ide > ${tag}`)?.textContent || '';
      if (valor.padStart(tamanho,'0') !== partes[parte]) problemas.push(`${tag} não corresponde à chave.`);
    }
    if (inf.querySelector('emit > CNPJ')?.textContent !== partes.cnpj) problemas.push('CNPJ do emitente não corresponde à chave.');
    if (inf.querySelector('ide > cDV')?.textContent !== chave[43]) problemas.push('cDV não corresponde ao dígito da chave.');
  }
  inf.querySelectorAll('CNPJ').forEach(el => { if (!validarCNPJ(el.textContent.trim())) problemas.push(`CNPJ inconsistente em ${el.parentElement.localName}.`); });
  if (nfe) {
    const itens = [...nfe.querySelectorAll('det')];
    if (!itens.length) problemas.push('NF-e sem produtos.');
    let soma = 0;
    itens.forEach((det, i) => {
      const valor = Number(det.querySelector('prod > vProd')?.textContent);
      const quantidade = Number(det.querySelector('prod > qCom')?.textContent);
      if (!Number.isFinite(valor) || valor < 0 || !(quantidade > 0)) problemas.push(`Item ${i+1}: confira valor e quantidade.`);
      if (!det.querySelector('prod > xProd')?.textContent.trim()) problemas.push(`Item ${i+1}: descrição vazia.`);
      const unitario = Number(det.querySelector('prod > vUnCom')?.textContent);
      if (!Number.isFinite(unitario) || Math.abs(quantidade * unitario - valor) > .011) problemas.push(`Item ${i+1}: quantidade × preço unitário diverge do valor total.`);
      if (det.querySelector('prod > indTot')?.textContent !== '0') soma += valor;
    });
    const total = Number(nfe.querySelector('ICMSTot > vProd')?.textContent);
    if (!Number.isFinite(total) || Math.abs(total - soma) > .011) problemas.push('Total de produtos diverge da soma dos itens.');
  }
  return [...new Set(problemas)];
}

function atualizarPreviaXml() {
  const seletor = document.getElementById('xml-preview-tipo');
  if (!seletor || !xmlsGerados[seletor.value]) return;
  const doc = xmlsGerados[seletor.value];
  document.getElementById('xml-preview-code').textContent = formatarXmlPreview(doc);
  const problemas = verificarConsistenciaXml(doc);
  document.getElementById('xml-preview-status').textContent = problemas.length
    ? `${problemas.length} pontos para conferir` : 'Verificações básicas sem divergências';
  document.getElementById('xml-checks').innerHTML = problemas.map(p => `<li>${escapeHtml(p)}</li>`).join('');
}

function copiarXmlGerado() {
  gerarXMLComCampos();
  const doc = xmlsGerados[document.getElementById('xml-preview-tipo').value];
  if (doc) copiarTexto(serializarXml(doc), 'XML copiado.');
}

function abrirXmlGeradoNoEditor() {
  // Atualiza antes de copiar, mesmo se o debounce do formulário ainda não rodou.
  gerarXMLComCampos();
  const tipo = document.getElementById('xml-preview-tipo').value;
  const doc = xmlsGerados[tipo]?.cloneNode(true);
  if (!doc) return;
  editorGarantirGrupoPadrao();
  const id = editorProxId++;
  const nome = `${tipo.toUpperCase()}-gerado-${id}.xml`;
  editorArquivos.push({ id, nome, doc, original: serializarXml(doc), modificado:false, grupoId:editorGrupoAtivo, _estrutura:null });
  editorSubTabAtual = tipo === 'nfe' ? 'produtos' : 'estrutura';
  editorPosCarga(id);
  switchTab('editor');
  mostrarStatus('Cópia do XML aberta no editor.');
}

function capturarCamposXml() {
  return Object.fromEntries([...document.querySelectorAll('#tab-xml .field-input[id], #tab-xml .produto-select[id], #produtos-container input[type="hidden"][id]')].map(el => [el.id, el.value]));
}

function aplicarCamposXml(campos) {
  for (const [id, valor] of Object.entries(campos)) {
    const el = document.getElementById(id);
    if (el && el.closest('#tab-xml') && typeof valor === 'string') el.value = valor;
  }
  document.querySelectorAll('.produto-item').forEach((_, idx) => {
    const unidade = document.getElementById(`nfes_prod_${idx}_uCom`).value;
    setUnidade(idx, unidade);
  });
}

function salvarCenarioXml() {
  const nome = document.getElementById('cenario-nome').value.trim();
  if (!nome) { mostrarStatus('Dê um nome ao cenário.', 'error'); return; }
  if (cenariosXml.length >= 20) { mostrarStatus('Limite de 20 cenários. Exclua um para adicionar outro.', 'error'); return; }
  cenariosXml.push({ nome: nome.slice(0,80), campos:capturarCamposXml(), quantidade:document.querySelectorAll('.produto-item').length, dinamicos:dadosAleatoriosNFeAtual });
  const salvo = storageSet('gerador:cenarios_xml', cenariosXml);
  renderCenariosXml();
  document.getElementById('cenario-lista').value = String(cenariosXml.length - 1);
  mostrarStatus(salvo ? 'Cenário salvo neste navegador.' : 'Cenário disponível nesta sessão; o navegador não permitiu gravá-lo.', salvo ? 'success' : 'error');
}

function renderCenariosXml() {
  document.getElementById('cenario-lista').innerHTML = '<option value="">Selecione um cenário</option>' + cenariosXml.map((c,i) => `<option value="${i}">${escapeHtml(c.nome)}</option>`).join('');
}

function carregarCenarioXml() {
  const escolha = document.getElementById('cenario-lista').value;
  const cenario = escolha !== '' ? cenariosXml[Number(escolha)] : null;
  if (!cenario) { mostrarStatus('Selecione um cenário.', 'error'); return; }
  quantidadeItensXml = Math.min(50, Math.max(1, Number(cenario.quantidade) || 1));
  const xml = xmlStringModelToObject();
  preencherCamposFormulario(xml, { nfe:getHierarquiaNFe(), cte:getHierarquiaCTe() });
  aplicarCamposXml(cenario.campos);
  dadosAleatoriosNFeAtual = cenario.dinamicos || null;
  gerarXMLComCampos(); salvarEstadoXml();
  mostrarStatus(`Cenário “${cenario.nome}” carregado.`);
}

function excluirCenarioXml() {
  const escolha = document.getElementById('cenario-lista').value;
  if (escolha === '') return;
  cenariosXml.splice(Number(escolha), 1);
  storageSet('gerador:cenarios_xml', cenariosXml); renderCenariosXml();
  mostrarStatus('Cenário excluído.');
}

function usarCadastroNoXml() {
  const nome = document.getElementById('cad_empresa').value.trim();
  const cnpj = document.getElementById('cad_cnpj').value.replace(/[.\s/\-]/g,'');
  if (!nome || !/^\d{14}$/.test(cnpj) || !validarCNPJ(cnpj)) {
    mostrarStatus('Preencha a empresa e um CNPJ numérico consistente. O modelo XML atual usa chave numérica.', 'error'); return;
  }
  const papel = document.getElementById('cad-xml-papel').value;
  const ids = { emitente:['Emitente_Nota','nfe_nomeEmit'], destinatario:['nfe_cnpjDest','nfe_nomeDest'], transportadora:['nfe_cnpjTransp','nfe_nomeTransp'] }[papel];
  document.getElementById(ids[0]).value = cnpj;
  document.getElementById(ids[1]).value = nome;
  gerarXMLComCampos(); salvarEstadoXml(); switchTab('xml');
  mostrarStatus('Empresa do cadastro aplicada à NF-e.');
}

function mapearXml(doc) {
  const resultado = new Map();
  function andar(el, caminho) {
    resultado.set(caminho, el.children.length ? '[elemento]' : el.textContent);
    for (const atributo of el.attributes) resultado.set(`${caminho}/@${atributo.name}`, atributo.value);
    const contagem = {};
    for (const filho of el.children) {
      const chave = filho.localName;
      contagem[chave] = (contagem[chave] || 0) + 1;
      andar(filho, `${caminho}/${chave}[${contagem[chave]}]`);
    }
  }
  andar(doc.documentElement, doc.documentElement.localName);
  return resultado;
}

function compararXml(original, atual) {
  const antes = mapearXml(original), depois = mapearXml(atual);
  return [...new Set([...antes.keys(), ...depois.keys()])].filter(c => antes.get(c) !== depois.get(c)).map(campo => ({ campo, antes:antes.get(campo), depois:depois.get(campo) }));
}

function editorHtmlAlteracoes(arq) {
  if (!arq.original) return '<p>O original deste arquivo não está disponível.</p>';
  const antes = new DOMParser().parseFromString(arq.original, 'text/xml');
  const mudancas = compararXml(antes, arq.doc);
  const problemas = verificarConsistenciaXml(arq.doc);
  return `<h3>Revisão antes de exportar</h3><p class="texto-apoio">${mudancas.length} ${mudancas.length === 1 ? 'diferença' : 'diferenças'} em relação ao arquivo aberto. Elementos repetidos são comparados pela posição.</p>
    <p class="texto-apoio">Verificações básicas; não valida schema, regras fiscais ou assinatura digital.</p>
    ${problemas.length ? `<ul class="xml-checks">${problemas.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : '<p class="texto-apoio">Sem divergências nas verificações básicas.</p>'}
    <div class="tabela-scroll"><table class="tabela-alteracoes"><thead><tr><th>Campo</th><th>Original</th><th>Atual</th></tr></thead><tbody>
    ${mudancas.map(m => `<tr><td>${escapeHtml(m.campo)}</td><td>${escapeHtml(m.antes ?? '(ausente)')}</td><td>${escapeHtml(m.depois ?? '(removido)')}</td></tr>`).join('')}
    </tbody></table></div>${mudancas.length ? '' : '<p>Nenhuma alteração.</p>'}`;
}

function alterarItensXml(remover = -1) {
  const quantidade = document.querySelectorAll('.produto-item').length;
  if (remover >= 0 && quantidade <= 1) { mostrarStatus('Mantenha pelo menos um produto.', 'error'); return; }
  if (remover < 0 && quantidade >= 50) { mostrarStatus('Limite de 50 produtos.', 'error'); return; }
  const campos = capturarCamposXml();
  const ajustados = {};
  for (const [id, valor] of Object.entries(campos)) {
    const match = /^nfes_prod_(\d+)_(.+)$/.exec(id);
    if (!match || remover < 0) { ajustados[id] = valor; continue; }
    const idx = Number(match[1]);
    if (idx !== remover) ajustados[`nfes_prod_${idx > remover ? idx-1 : idx}_${match[2]}`] = valor;
  }
  quantidadeItensXml = quantidade + (remover < 0 ? 1 : -1);
  preencherCamposFormulario(xmlStringModelToObject(), { nfe:getHierarquiaNFe(), cte:getHierarquiaCTe() });
  aplicarCamposXml(ajustados);
  gerarXMLComCampos(); salvarEstadoXml();
}

function inicializarWorkflowXml() {
  const salvos = storageGet('gerador:cenarios_xml', []);
  cenariosXml = Array.isArray(salvos) ? salvos.filter(c => c && typeof c.nome === 'string' && c.campos && typeof c.campos === 'object').slice(0,20) : [];
  renderCenariosXml();
  atualizarPreviaXml();
}
