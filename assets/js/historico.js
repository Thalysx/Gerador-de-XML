// ══════════════════════════════════════════════════════════
//  HISTÓRICO
// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
//  HISTÓRICO DE DADOS CADASTRAIS
// ══════════════════════════════════════════════════════════
let historicoDocsList = [];

function getNomeDocsAtual() {
  const box = document.getElementById('nome-box');
  return box?.classList.contains('visible') ? nomeAtualDoc : '';
}

function registrarHistoricoDocs(tipo, valor, extras = {}) {
  if (!valor) return;
  adicionarHistoricoDocs({
    tipo,
    valor,
    currentType,
    currentValue,
    nome: '',
    ...extras
  });
}

function adicionarHistoricoDocs(dados) {
  historicoDocsList.unshift({ dados, ts: Date.now() });
  if (historicoDocsList.length > 20) historicoDocsList.pop();
  storageSet('gerador:historico_docs', historicoDocsList);
  renderHistoricoDocs();
}

function categoriaHistoricoDocs(dados) {
  const tipo = (dados.currentType || dados.tipo || '').toLowerCase();
  if (['empresa','cnpj','cnpj-alfa'].includes(tipo) || tipo.includes('cnpj') || tipo.includes('empresa')) return 'empresas';
  if (['telefone','email'].includes(tipo) || tipo.includes('telefone') || tipo.includes('e-mail')) return 'contato';
  if (['placa','conteiner','conteiner-lacre','lacre','imo','booking','due'].includes(tipo) || /placa|contêiner|lacre|imo|booking|du-e/.test(tipo)) return 'transporte';
  return 'pessoas';
}

function renderHistoricoDocs() {
  const countEl = document.getElementById('docs-historico-count');
  const statusEl = document.getElementById('docs-historico-status');
  const emptyEl = document.getElementById('docs-historico-empty');
  const clearBtn = document.getElementById('docs-historico-limpar-btn');
  const container = document.getElementById('docs-historico-items');
  if (!countEl || !statusEl || !emptyEl || !clearBtn || !container) return;

  const count = historicoDocsList.length;
  countEl.textContent = `${count} ${count === 1 ? 'registro' : 'registros'}`;
  statusEl.textContent = count === 0
    ? 'Histórico de dados cadastrais vazio.'
    : `Histórico de dados cadastrais com ${count} ${count === 1 ? 'registro' : 'registros'}.`;
  emptyEl.style.display = count === 0 ? '' : 'none';
  clearBtn.style.display = count === 0 ? 'none' : '';

  container.innerHTML = historicoDocsList.map((entry, idx) => {
    const d = entry.dados;
    const chips = [
      { label: 'Valor', value: d.valor },
      { label: 'Nome', value: d.nome },
      { label: 'Contêiner', value: d.conteiner },
      { label: 'Lacre', value: d.lacre },
    ].filter(c => c.value);

    return `
    <div class="historico-item" data-category="${categoriaHistoricoDocs(d)}">
      <div class="historico-item-header">
        <div>
          <div class="historico-item-nome">${escapeHtml(d.tipo)}</div>
          <div class="historico-item-empresa">${escapeHtml(d.valor)}</div>
        </div>
        <div class="historico-item-time">${formatarHora(entry.ts)}</div>
      </div>
      <div class="historico-item-chips">
        ${chips.map(c => `
          <button type="button" class="historico-chip" onclick="copiarChip(this, '${escapeInlineValue(c.value)}')" aria-label="Copiar ${escapeAttr(c.label)} do histórico de dados cadastrais">
            <span class="historico-chip-label">${escapeHtml(c.label)}</span>
            <span>${escapeHtml(c.value)}</span>
          </button>`).join('')}
      </div>
      <div class="historico-item-actions">
        <button type="button" class="btn-xs" onclick="restaurarHistoricoDocs(${idx})" aria-label="Restaurar ${escapeAttr(d.tipo)} do histórico">Restaurar</button>
        <button type="button" class="btn-xs" onclick="copiarHistoricoDocsValor(${idx})" aria-label="Copiar valor de ${escapeAttr(d.tipo)} do histórico">Copiar valor</button>
        <button type="button" class="btn-xs" onclick="copiarHistoricoDocsJSON(${idx})" aria-label="Copiar ${escapeAttr(d.tipo)} em JSON">Copiar JSON</button>
      </div>
    </div>`;
  }).join('');
}

function restaurarHistoricoDocs(idx) {
  const entry = historicoDocsList[idx];
  if (!entry) return;
  const d = entry.dados;

  currentType = d.currentType || '';
  if (currentType === 'placa') placaTipoAtual = d.subtipo || 'mercosul';
  currentValue = d.currentValue || d.valor || '';
  esconderPlaca();
  esconderConteiner();
  esconderTelefone();
  document.getElementById('nome-box').classList.remove('visible');
  nomeAtualDoc = '';

  if (d.tipo === 'Contêiner e lacre') {
    const box = document.getElementById('docs-output-box');
    if (box) box.style.display = 'none';
    document.getElementById('new-doc-btn').style.display = 'none';
    document.getElementById('copy-btn').style.display = 'none';
    document.getElementById('container-num-val').textContent = d.conteiner || '';
    document.getElementById('lacre-val').textContent = d.lacre || '';
    document.getElementById('container-num-card').style.display = '';
    document.getElementById('lacre-card').style.display = 'block';
    document.getElementById('container-preview').classList.add('visible');
  } else {
    setOutput(d.valor);
    if (d.tipo === 'Placa') mostrarPlacaVisual(d.valor, d.subtipo || 'mercosul');
    if (d.tipo === 'Contêiner') {
      document.getElementById('container-num-val').textContent = d.conteiner || d.valor;
      document.getElementById('container-num-card').style.display = '';
      document.getElementById('lacre-card').style.display = 'none';
      document.getElementById('container-preview').classList.add('visible');
    }
    if (d.tipo === 'Lacre') {
      document.getElementById('lacre-val').textContent = d.lacre || d.valor;
      document.getElementById('container-num-card').style.display = 'none';
      document.getElementById('lacre-card').style.display = 'block';
      document.getElementById('container-preview').classList.add('visible');
    }
  }

  if (d.nome) mostrarNome(d.nome, d.currentType === 'cpf' ? 'cpf' : 'cnpj');
  rolarParaElemento(document.getElementById('output-val'));
  mostrarStatus(`${d.tipo || 'Registro'} restaurado.`);
}

function copiarHistoricoDocsValor(idx) {
  const entry = historicoDocsList[idx];
  if (!entry) return;
  copiarTexto(entry.dados.valor || '', 'Valor do histórico copiado.');
}

function copiarHistoricoDocsJSON(idx) {
  const entry = historicoDocsList[idx];
  if (!entry) return;
  copiarTexto(JSON.stringify(entry.dados, null, 2), 'Histórico copiado como JSON.');
}

function limparHistoricoDocs() {
  historicoDocsList = [];
  storageSet('gerador:historico_docs', []);
  renderHistoricoDocs();
  mostrarStatus('Histórico de dados cadastrais limpo.');
}

let historicoList = [];

function formatarHora(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' · ' +
         d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function adicionarAoHistorico(dados) {
  historicoList.unshift({ dados, ts: Date.now() });
  if (historicoList.length > 20) historicoList.pop();
  storageSet('gerador:historico', historicoList);
  renderHistorico();
}

function renderHistorico() {
  const count = historicoList.length;
  document.getElementById('historico-count').textContent = `${count} ${count === 1 ? 'registro' : 'registros'}`;
  document.getElementById('historico-status').textContent = count === 0
    ? 'Histórico do cadastro geral vazio.'
    : `Histórico do cadastro geral com ${count} ${count === 1 ? 'registro' : 'registros'}.`;
  document.getElementById('historico-empty').style.display = count === 0 ? '' : 'none';
  document.getElementById('historico-limpar-btn').style.display = count === 0 ? 'none' : '';

  const container = document.getElementById('historico-items');
  container.innerHTML = historicoList.map((entry, idx) => {
    const d = entry.dados;
    const chips = [
      { label: 'CPF', value: d.cpf },
      { label: 'RG',  value: d.rg  },
      { label: 'CNH', value: d.cnh },
      { label: 'Telefone', value: d.telefone },
      { label: 'E-mail', value: d.email },
      { label: 'CNPJ', value: d.cnpj },
      { label: 'Placa', value: d.placa },
      { label: 'Contêiner', value: d.conteiner },
      { label: 'Lacre', value: d.lacre },
    ].filter(c => c.value);

    return `
    <div class="historico-item">
      <div class="historico-item-header">
        <div>
          <div class="historico-item-nome">${escapeHtml(d.nome || '—')}</div>
          <div class="historico-item-empresa">${escapeHtml(d.empresa || '')}</div>
        </div>
        <div class="historico-item-time">${formatarHora(entry.ts)}</div>
      </div>
      <div class="historico-item-chips">
        ${chips.map(c => `
          <button type="button" class="historico-chip" onclick="copiarChip(this, '${escapeInlineValue(c.value)}')" aria-label="Copiar ${escapeAttr(c.label)} do cadastro histórico">
            <span class="historico-chip-label">${escapeHtml(c.label)}</span>
            <span>${escapeHtml(c.value)}</span>
          </button>`).join('')}
      </div>
      <div class="historico-item-actions">
        <button type="button" class="btn-xs" onclick="restaurarDoHistorico(${idx})" aria-label="Restaurar cadastro de ${escapeAttr(d.nome || 'registro')}">Restaurar</button>
        <button type="button" class="btn-xs" onclick="copiarHistoricoJSON(${idx})" aria-label="Copiar cadastro de ${escapeAttr(d.nome || 'registro')} em JSON">Copiar JSON</button>
      </div>
    </div>`;
  }).join('');
}

function copiarChip(el, val) {
  copiarTexto(val, 'Valor copiado.').then((ok) => {
    if (!ok) return;
    el.style.background = 'var(--accent-green-bg)';
    el.style.borderColor = 'var(--accent-green-border)';
    el.style.color = 'var(--success)';
    setTimeout(() => { el.style.background = ''; el.style.borderColor = ''; el.style.color = ''; }, 1200);
  });
}

function restaurarDoHistorico(idx) {
  const entry = historicoList[idx];
  if (!entry) return;
  const d = entry.dados;
  document.getElementById('cad_doc_pessoa_tipo').value = valorDocumentoEstrangeiro(d.documento_estrangeiro_pessoa_tipo);
  document.getElementById('cad_cnpj_tipo').value = valorTipoCNPJ(d.cnpj_tipo);
  document.getElementById('cad_doc_empresa_tipo').value = valorDocumentoEstrangeiro(d.documento_estrangeiro_empresa_tipo);
  document.getElementById('cad_nome').value     = d.nome || '';
  document.getElementById('cad_tel').value      = d.telefone || '';
  document.getElementById('cad_email').value    = d.email || '';
  document.getElementById('cad_endereco').value = d.endereco || '';
  document.getElementById('cad_cpf').value      = d.cpf || '';
  document.getElementById('cad_rg').value       = d.rg || '';
  document.getElementById('cad_cnh').value      = d.cnh || '';
  document.getElementById('cad_cracha').value   = d.cracha || '';
  document.getElementById('cad_doc_pessoa').value = d.documento_estrangeiro_pessoa || '';
  document.getElementById('cad_empresa').value  = d.empresa || '';
  document.getElementById('cad_cnpj').value     = d.cnpj || '';
  document.getElementById('cad_doc_empresa').value = d.documento_estrangeiro_empresa || '';
  document.getElementById('cad_placa').value    = d.placa || '';
  document.getElementById('cad_conteiner').value = d.conteiner || '';
  document.getElementById('cad_lacre').value    = d.lacre || '';
  cadAtualizarResultado();
  atualizarStatusResultadoCadastro(`Cadastro de ${d.nome || 'registro'} restaurado no resultado.`);
  rolarParaElemento(document.getElementById('cadastro-result'));
  mostrarStatus(`Cadastro de ${d.nome || 'registro'} restaurado.`);
}

function copiarHistoricoJSON(idx) {
  if (!historicoList[idx]) return;
  copiarTexto(JSON.stringify(historicoList[idx].dados, null, 2), 'Histórico copiado como JSON.');
}

function limparHistorico() {
  historicoList = [];
  storageSet('gerador:historico', []);
  renderHistorico();
  mostrarStatus('Histórico do cadastro geral limpo.');
}
