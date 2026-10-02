// ══════════════════════════════════════════════════════════
//  CADASTRO GERAL
// ══════════════════════════════════════════════════════════
const CADASTRO_GRUPOS = [
  { id: 'identificacao', label: 'Identificação', fields: ['nome'], inputIds: ['cad_nome'] },
  { id: 'documentos', label: 'Documentos', fields: ['cpf', 'rg', 'cnh', 'documento_estrangeiro_pessoa'], inputIds: ['cad_cpf', 'cad_rg', 'cad_cnh', 'cad_doc_pessoa'] },
  { id: 'contato', label: 'Contato', fields: ['telefone', 'email'], inputIds: ['cad_tel', 'cad_email'] },
  { id: 'endereco', label: 'Endereço', fields: ['endereco'], inputIds: ['cad_endereco'] },
  { id: 'profissionais', label: 'Dados profissionais', fields: ['cracha', 'empresa', 'cnpj', 'documento_estrangeiro_empresa', 'placa'], inputIds: ['cad_cracha', 'cad_empresa', 'cad_cnpj', 'cad_doc_empresa', 'cad_placa'] },
];
let cadastroPortuarioAtual = null;

function cadastroPortuarioAtivo() { return activeEnvironmentId()==='port'; }

function rotuloCadastroPortuario(tipo) {
  return PORT_CADASTRO_TIPOS.find(item=>item.id===tipo)?.label || generatorById(tipo)?.label || 'Cadastro portuário';
}

function valorCadastroPortuario(valor) {
  return typeof valor==='object' ? JSON.stringify(valor) : String(valor ?? '');
}

function renderizarCadastroPortuario() {
  const atual=cadastroPortuarioAtual;
  const result=document.getElementById('cadastro-result');
  if(!atual?.dados) {
    result.classList.remove('visible');
    atualizarStatusResultadoCadastro('Resultado do cadastro portuário vazio.');
    return;
  }
  const dados=atual.dados;
  const titulo=dados.nome || dados.razao_social || dados.conteiner || dados.descricao || atual.rotulo;
  const identificador=dados.cpf || dados.cnpj || dados.placa || dados.placa_cavalo || dados.ncm || dados.manifesto || '';
  result.classList.add('visible');
  document.getElementById('cadastro-result-badge').textContent='QA Portuário';
  document.getElementById('res-nome-title').textContent=titulo;
  document.getElementById('res-nome').textContent=titulo;
  document.getElementById('res-empresa-sub').textContent=atual.rotulo;
  document.getElementById('res-empresa').textContent=identificador;
  document.getElementById('result-grid-items').innerHTML=`
    <section class="result-sheet-section" data-result-group="portuario" aria-labelledby="result-group-portuario">
      <h3 class="result-sheet-title" id="result-group-portuario">Dados completos</h3>
      <div class="result-grid">
        ${Object.entries(dados).map(([campo,valor])=>{
          const texto=valorCadastroPortuario(valor);
          const label=rotuloCampoResultado(campo);
          return `<div class="result-item"><div class="result-item-label">${escapeHtml(label)}</div><div class="result-item-value"><span>${escapeHtml(texto)}</span><button type="button" class="btn-sm field-copy-action" data-copy-value="${escapeAttr(texto)}" data-copy-label="${escapeAttr(label)}" aria-label="Copiar ${escapeAttr(label)}"><i data-lucide="copy" aria-hidden="true"></i> Copiar</button></div></div>`;
        }).join('')}
      </div>
    </section>`;
  atualizarStatusResultadoCadastro(`Ficha completa de ${atual.rotulo} atualizada.`);
}

function gerarCadastroPortuarioCompleto() {
  const tipo=document.getElementById('cad-port-tipo').value;
  const rotulo=rotuloCadastroPortuario(tipo);
  const dados=gerarCadastroPortuarioPorTipo(tipo);
  cadastroPortuarioAtual={tipo,rotulo,dados};
  renderizarCadastroPortuario();
  document.getElementById('cad-port-status').textContent=`Ficha completa de ${rotulo} gerada.`;
  adicionarAoHistorico({
    tipo_cadastro:'portuario',tipo_portuario:tipo,rotulo_portuario:rotulo,estrutura_portuaria:dados,
    nome:dados.nome || dados.razao_social || dados.conteiner || dados.descricao || rotulo,
    empresa:rotulo,cpf:dados.cpf || '',cnpj:dados.cnpj || '',placa:dados.placa || dados.placa_cavalo || ''
  });
  registerGeneratorUse('cadastro');
}

function atualizarCadastroPorAmbiente() {
  const port=cadastroPortuarioAtivo();
  document.getElementById('cadastro-general-selector').hidden=port;
  document.getElementById('cadastro-general-form').hidden=port;
  document.getElementById('cadastro-portuario-form').hidden=!port;
  document.getElementById('cadastro-empty-title').textContent=port?'Sua ficha portuária aparece aqui':'Seu cadastro aparece aqui';
  document.getElementById('cadastro-empty-description').textContent=port
    ? 'Escolha uma entidade para gerar todos os dados cadastrais e operacionais em uma ficha completa.'
    : 'Gere um perfil completo ou preencha os campos para conferir o resultado. Você poderá copiar os dados e restaurá-los pelo histórico.';
  if(port)renderizarCadastroPortuario();
  else {
    document.getElementById('cadastro-result-badge').textContent='Perfil';
    cadAtualizarResultado();
  }
}

function getCadastroGruposSelecionados() {
  return [...document.querySelectorAll('input[name="cadastro-grupo"]:checked')].map(input => input.value);
}

function atualizarSelecaoGruposCadastro() {
  const selecionados = getCadastroGruposSelecionados();
  const status = document.getElementById('cadastro-group-status');
  if (status) status.textContent = `${selecionados.length} de ${CADASTRO_GRUPOS.length} grupos selecionados.`;
}

function selecionarGruposCadastro(selecionar) {
  document.querySelectorAll('input[name="cadastro-grupo"]').forEach(input => { input.checked = selecionar; });
  atualizarSelecaoGruposCadastro();
}

function aplicarGruposCadastro(grupos) {
  const validos = new Set((grupos || []).filter(id => CADASTRO_GRUPOS.some(grupo => grupo.id === id)));
  document.querySelectorAll('input[name="cadastro-grupo"]').forEach(input => { input.checked = validos.has(input.value); });
  atualizarSelecaoGruposCadastro();
}

function grupoCadastroPorInput(inputId) {
  return CADASTRO_GRUPOS.find(grupo => grupo.inputIds.includes(inputId));
}

function marcarGrupoCadastroPorInput(inputId) {
  const grupo = grupoCadastroPorInput(inputId);
  const input = grupo && document.querySelector(`input[name="cadastro-grupo"][value="${grupo.id}"]`);
  if (input && !input.checked) {
    input.checked = true;
    atualizarSelecaoGruposCadastro();
  }
}

function normalizarParaEmail(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function gerarEmailPessoa(nomeBase = '') {
  const nome = normalizarParaEmail(nomeBase || gerarNomePessoa()).split(/\s+/).filter(Boolean);
  const primeiro = nome[0] || 'usuario';
  const ultimo = nome[nome.length - 1] || 'teste';
  return semRepeticaoRecente('email', () => {
    const bases = [primeiro + '.' + ultimo, primeiro + '_' + ultimo, primeiro[0] + ultimo, ultimo + '.' + primeiro];
    return pick(bases) + randomDigits(4).join('') + '@' + pick(['example.com', 'example.org', 'example.net']);
  });
}

function gerarCEPRaw() {
  return semRepeticaoRecente('cep', () => randomDigits(8).join(''));
}

function formatCEP(raw) { return `${raw.slice(0,5)}-${raw.slice(5)}`; }

function gerarCEPFormatado() { return formatCEP(gerarCEPRaw()); }

function gerarEnderecoBR() {
  const tipos = ['Rua', 'Avenida', 'Travessa', 'Alameda', 'Rodovia'];
  const nomes = ['das Acácias', 'Brasil', 'Santos Dumont', 'Getúlio Vargas', 'Rio Branco', 'dos Expedicionários', 'da Indústria', 'do Comércio', 'Central', 'da Estação'];
  const bairros = ['Centro', 'Jardim América', 'Vila Nova', 'Distrito Industrial', 'Boa Vista', 'Santa Maria', 'Jardim Europa', 'São José'];
  const cidades = [
    { nome: 'São Paulo', uf: 'SP' }, { nome: 'Rio de Janeiro', uf: 'RJ' },
    { nome: 'Belo Horizonte', uf: 'MG' }, { nome: 'Curitiba', uf: 'PR' },
    { nome: 'Goiânia', uf: 'GO' }, { nome: 'Balsas', uf: 'MA' },
    { nome: 'Itajaí', uf: 'SC' }, { nome: 'Rondonópolis', uf: 'MT' }
  ];
  const cidade = pick(cidades);
  return `${pick(tipos)} ${pick(nomes)}, ${rand(8999) + 100} - ${pick(bairros)}, ${cidade.nome}/${cidade.uf} - CEP ${gerarCEPFormatado()}`;
}

function gerarPassaporte() {
  return `${letraAleatoria()}${letraAleatoria()}${Array.from({length: 6}, () => rand(10)).join('')}`;
}

function gerarIdentidadeEstrangeira() {
  return `RNE-${letraAleatoria()}${Array.from({length: 7}, () => rand(10)).join('')}`;
}

function gerarDocumentoEstrangeiro(tipo) {
  return tipo === 'identidade' ? gerarIdentidadeEstrangeira() : gerarPassaporte();
}

function labelDocumentoEstrangeiro(tipo) {
  return tipo === 'identidade' ? 'Identidade estrangeira' : 'Passaporte';
}

function labelDocumentoEstrangeiroEmpresa(tipoOuLabel) {
  const label = tipoOuLabel === 'identidade' || tipoOuLabel === 'passaporte'
    ? labelDocumentoEstrangeiro(tipoOuLabel)
    : String(tipoOuLabel || 'Documento estrangeiro');
  return `${label} da empresa`;
}

function valorDocumentoEstrangeiro(label) {
  return String(label || '').toLowerCase().includes('identidade') ? 'identidade' : 'passaporte';
}

function valorTipoCNPJ(label) {
  return String(label || '').toLowerCase().includes('alfanum') ? 'alfanumerico' : 'normal';
}

function gerarCNPJCadastro() {
  const tipo = document.getElementById('cad_cnpj_tipo')?.value || 'normal';
  const raw = tipo === 'alfanumerico' ? gerarCNPJRawAlfanumerico() : gerarCNPJRawNumerico();
  return formatCNPJ(raw);
}

function cadGerar(campo) {
  switch(campo) {
    case 'nome':     document.getElementById('cad_nome').value     = gerarNomePessoa(); break;
    case 'rg':       document.getElementById('cad_rg').value       = gerarRGBR(); break;
    case 'tel':      document.getElementById('cad_tel').value      = gerarTelefoneBR().formatted; break;
    case 'email':    document.getElementById('cad_email').value    = gerarEmailPessoa(document.getElementById('cad_nome').value); break;
    case 'endereco': document.getElementById('cad_endereco').value = gerarEnderecoBR(); break;
    case 'cpf':      document.getElementById('cad_cpf').value = formatCPF(gerarCPFRaw()); break;
    case 'cnh':      document.getElementById('cad_cnh').value      = gerarCNHRaw(); break;
    case 'cracha':   document.getElementById('cad_cracha').value   = gerarCodigoCracha(); break;
    case 'doc_pessoa': document.getElementById('cad_doc_pessoa').value = gerarDocumentoEstrangeiro(document.getElementById('cad_doc_pessoa_tipo').value); break;
    case 'empresa':  document.getElementById('cad_empresa').value  = gerarNomeEmpresa(); break;
    case 'cnpj':     document.getElementById('cad_cnpj').value     = gerarCNPJCadastro(); break;
    case 'doc_empresa': document.getElementById('cad_doc_empresa').value = gerarDocumentoEstrangeiro(document.getElementById('cad_doc_empresa_tipo').value); break;
    case 'placa':    document.getElementById('cad_placa').value    = gerarPlacaMercosulRaw(); break;
  }
  const inputId = {
    nome: 'cad_nome', rg: 'cad_rg', tel: 'cad_tel', email: 'cad_email', endereco: 'cad_endereco',
    cpf: 'cad_cpf', cnh: 'cad_cnh', cracha: 'cad_cracha', doc_pessoa: 'cad_doc_pessoa',
    empresa: 'cad_empresa', cnpj: 'cad_cnpj', doc_empresa: 'cad_doc_empresa', placa: 'cad_placa'
  }[campo];
  if (inputId) marcarGrupoCadastroPorInput(inputId);
  cadAtualizarResultado();
}

function gerarCadastroCompleto() {
  if(cadastroPortuarioAtivo())return gerarCadastroPortuarioCompleto();
  const grupos = getCadastroGruposSelecionados();
  if (!grupos.length) {
    atualizarStatusResultadoCadastro('Selecione ao menos um grupo antes de gerar a ficha.');
    mostrarStatus('Selecione ao menos um grupo do cadastro.', 'error');
    document.querySelector('input[name="cadastro-grupo"]')?.focus();
    return;
  }

  const selecionados = new Set(grupos);
  CADASTRO_GRUPOS.filter(grupo => !selecionados.has(grupo.id)).forEach(grupo => {
    grupo.inputIds.forEach(id => { document.getElementById(id).value = ''; });
  });

  let nomeGerado = '';
  if (selecionados.has('identificacao')) {
    nomeGerado = gerarNomePessoa();
    document.getElementById('cad_nome').value = nomeGerado;
  }
  if (selecionados.has('documentos')) {
    document.getElementById('cad_cpf').value = formatCPF(gerarCPFRaw());
    document.getElementById('cad_rg').value = gerarRGBR();
    document.getElementById('cad_cnh').value = gerarCNHRaw();
    document.getElementById('cad_doc_pessoa').value = gerarDocumentoEstrangeiro(document.getElementById('cad_doc_pessoa_tipo').value);
  }
  if (selecionados.has('contato')) {
    document.getElementById('cad_tel').value = gerarTelefoneBR().formatted;
    document.getElementById('cad_email').value = gerarEmailPessoa(nomeGerado);
  }
  if (selecionados.has('endereco')) document.getElementById('cad_endereco').value = gerarEnderecoBR();
  if (selecionados.has('profissionais')) {
    document.getElementById('cad_cracha').value = gerarCodigoCracha();
    document.getElementById('cad_empresa').value = gerarNomeEmpresa();
    document.getElementById('cad_cnpj').value = gerarCNPJCadastro();
    document.getElementById('cad_doc_empresa').value = gerarDocumentoEstrangeiro(document.getElementById('cad_doc_empresa_tipo').value);
    document.getElementById('cad_placa').value = gerarPlacaMercosulRaw();
  }

  cadAtualizarResultado();
  const dados = getCadastroDados();
  atualizarStatusResultadoCadastro(`${grupos.length} ${grupos.length === 1 ? 'grupo gerado' : 'grupos gerados'} na ficha${dados.nome ? ` de ${dados.nome}` : ''}.`);
  adicionarAoHistorico(dados);
  registerGeneratorUse('cadastro');
}

function getCadastroDados() {
  return {
    nome:      document.getElementById('cad_nome').value,
    telefone:  document.getElementById('cad_tel').value,
    email:     document.getElementById('cad_email').value,
    endereco:  document.getElementById('cad_endereco').value,
    cpf:       document.getElementById('cad_cpf').value,
    rg:        document.getElementById('cad_rg').value,
    cnh:       document.getElementById('cad_cnh').value,
    cracha:    document.getElementById('cad_cracha').value,
    documento_estrangeiro_pessoa_tipo: labelDocumentoEstrangeiro(document.getElementById('cad_doc_pessoa_tipo').value),
    documento_estrangeiro_pessoa: document.getElementById('cad_doc_pessoa').value,
    empresa:   document.getElementById('cad_empresa').value,
    cnpj_tipo:  document.getElementById('cad_cnpj_tipo').value === 'alfanumerico' ? 'Alfanumérico' : 'Numérico',
    cnpj:      document.getElementById('cad_cnpj').value,
    documento_estrangeiro_empresa_tipo: labelDocumentoEstrangeiro(document.getElementById('cad_doc_empresa_tipo').value),
    documento_estrangeiro_empresa: document.getElementById('cad_doc_empresa').value,
    placa:     document.getElementById('cad_placa').value,
    grupos:    getCadastroGruposSelecionados(),
  };
}

function cadastroItensGrupo(grupoId, dados) {
  const itens = {
    identificacao: [
      { label: 'Nome completo', value: dados.nome },
    ],
    documentos: [
      { label: 'CPF', value: dados.cpf },
      { label: 'RG', value: dados.rg },
      { label: 'CNH', value: dados.cnh },
      { label: dados.documento_estrangeiro_pessoa_tipo, value: dados.documento_estrangeiro_pessoa },
    ],
    contato: [
      { label: 'Telefone', value: dados.telefone },
      { label: 'E-mail', value: dados.email },
    ],
    endereco: [
      { label: 'Endereço', value: dados.endereco },
    ],
    profissionais: [
      { label: 'Crachá', value: dados.cracha },
      { label: 'Razão social', value: dados.empresa },
      { label: `CNPJ ${dados.cnpj_tipo}`, value: dados.cnpj },
      { label: labelDocumentoEstrangeiroEmpresa(dados.documento_estrangeiro_empresa_tipo), value: dados.documento_estrangeiro_empresa },
      { label: 'Placa', value: dados.placa },
    ],
  };
  return (itens[grupoId] || []).filter(item => String(item.value || '').trim());
}

function getCadastroGruposComDados(dados) {
  return CADASTRO_GRUPOS.filter(grupo => cadastroItensGrupo(grupo.id, dados).length);
}

function cadastroTemDados(dados) {
  return getCadastroGruposComDados(dados).length > 0;
}

function atualizarStatusResultadoCadastro(mensagem) {
  const status = document.getElementById('cadastro-result-status');
  if (status) status.textContent = mensagem;
}

function cadAtualizarResultado() {
  document.getElementById('cadastro-result-badge').textContent = 'Perfil';
  const dados = getCadastroDados();
  if (!cadastroTemDados(dados)) {
    document.getElementById('cadastro-result').classList.remove('visible');
    atualizarStatusResultadoCadastro('Resultado do cadastro geral vazio.');
    return;
  }

  const result = document.getElementById('cadastro-result');
  result.classList.add('visible');
  document.getElementById('res-nome-title').textContent = dados.nome || 'Cadastro parcial';
  document.getElementById('res-nome').textContent       = dados.nome || '—';
  document.getElementById('res-empresa-sub').textContent = dados.empresa || '—';
  document.getElementById('res-empresa').textContent    = dados.empresa || '—';

  const grupos = getCadastroGruposComDados(dados);
  const sheet = document.getElementById('result-grid-items');
  sheet.innerHTML = grupos.map(grupo => {
    const itens = cadastroItensGrupo(grupo.id, dados);
    return `
      <section class="result-sheet-section" data-result-group="${escapeAttr(grupo.id)}" aria-labelledby="result-group-${escapeAttr(grupo.id)}">
        <h3 class="result-sheet-title" id="result-group-${escapeAttr(grupo.id)}">${escapeHtml(grupo.label)}</h3>
        <div class="result-grid">
          ${itens.map(item => `
            <div class="result-item">
              <div class="result-item-label">${escapeHtml(item.label)}</div>
              <div class="result-item-value">
                <span>${escapeHtml(item.value)}</span>
                <button type="button" class="btn-sm field-copy-action" data-copy-value="${escapeAttr(item.value)}" data-copy-label="${escapeAttr(item.label)}" aria-label="Copiar ${escapeAttr(item.label)}"><i data-lucide="copy" aria-hidden="true"></i> Copiar</button>
              </div>
            </div>`).join('')}
        </div>
      </section>`;
  }).join('');

  atualizarStatusResultadoCadastro(dados.nome
    ? `Resultado do cadastro de ${dados.nome} atualizado.`
    : 'Resultado do cadastro parcial atualizado.');
}

function copyMini(btn, val) {
  return copiarCampoResultado(btn, val, 'Valor');
}

async function cadCopiarCampo(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  const valor = input.value || '';
  if (!valor) {
    mostrarStatus('Não há conteúdo para copiar.', 'error');
    return;
  }

  let copiado = false;

  // 1) Clipboard API (exige contexto seguro e documento em foco)
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(valor);
      copiado = true;
    } catch (e) {
      copiado = false;
    }
  }

  // 2) Fallback: seleciona o próprio campo e usa execCommand('copy')
  if (!copiado) {
    try {
      input.focus({ preventScroll: true });
      input.select();
      input.setSelectionRange(0, valor.length);
      copiado = document.execCommand('copy');
    } catch (e) {
      copiado = false;
    }
  }

  if (copiado) {
    mostrarStatus('Campo copiado.');
    const originalIcon = btn.innerHTML;
    const originalLabel = btn.getAttribute('aria-label');
    btn.innerHTML = '<i data-lucide="check" aria-hidden="true"></i>';
    renderLucideIcons(btn);
    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Campo copiado');
    setTimeout(() => {
      btn.innerHTML = originalIcon;
      renderLucideIcons(btn);
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', originalLabel);
    }, 1500);
  } else {
    // Último recurso: deixa o valor selecionado no campo para copiar manualmente
    try { input.focus({ preventScroll: true }); input.select(); } catch (e) {}
    mostrarStatus('Não foi possível copiar automaticamente. O valor foi selecionado — use Ctrl+C (ou Cmd+C) para copiar.', 'error');
  }
}

function limparCadastro() {
  if(cadastroPortuarioAtivo()) {
    cadastroPortuarioAtual=null;
    document.getElementById('cadastro-result').classList.remove('visible');
    document.getElementById('result-grid-items').innerHTML='';
    document.getElementById('cad-port-status').textContent='Escolha um tipo para gerar a ficha completa.';
    atualizarStatusResultadoCadastro('Resultado do cadastro portuário vazio.');
    mostrarStatus('Cadastro portuário limpo.');
    return;
  }
  ['cad_nome','cad_tel','cad_email','cad_endereco','cad_cpf','cad_rg','cad_cnh','cad_cracha','cad_doc_pessoa','cad_empresa','cad_cnpj','cad_doc_empresa','cad_placa'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('cad_cnpj_tipo').value = 'normal';
  document.getElementById('cad_doc_pessoa_tipo').value = 'passaporte';
  document.getElementById('cad_doc_empresa_tipo').value = 'passaporte';
  document.getElementById('cadastro-result').classList.remove('visible');
  document.getElementById('result-grid-items').innerHTML = '';
  atualizarStatusResultadoCadastro('Resultado do cadastro geral vazio.');
  mostrarStatus('Cadastro geral limpo.');
}

function mostrarFeedbackCadastroCopiado() {
  ['cad-copied-msg','cad-copied-msg-2'].forEach(id => {
    const msg = document.getElementById(id);
    if (msg) {
      msg.style.opacity = '1';
      setTimeout(() => msg.style.opacity = '0', 1500);
    }
  });
}

function formatarCadastroTexto(dados) {
  if(cadastroPortuarioAtivo() && cadastroPortuarioAtual) {
    return `[${cadastroPortuarioAtual.rotulo}]\n`+Object.entries(cadastroPortuarioAtual.dados).map(([campo,valor])=>`${rotuloCampoResultado(campo)}: ${valorCadastroPortuario(valor)}`).join('\n');
  }
  return getCadastroGruposComDados(dados)
    .map(grupo => {
      const linhas = cadastroItensGrupo(grupo.id, dados).map(item => `${item.label}: ${item.value}`);
      return `[${grupo.label}]\n${linhas.join('\n')}`;
    })
    .join('\n\n');
}

function copiarCadastroTexto() {
  if(cadastroPortuarioAtivo()&&!cadastroPortuarioAtual){mostrarStatus('Gere uma ficha portuária antes de copiar.','error');return;}
  const texto = formatarCadastroTexto(getCadastroDados());
  copiarTexto(texto, 'Cadastro copiado.').then((ok) => {
    if (ok) mostrarFeedbackCadastroCopiado();
  });
}

function copiarCadastroJSON() {
  if(cadastroPortuarioAtivo()&&!cadastroPortuarioAtual){mostrarStatus('Gere uma ficha portuária antes de copiar.','error');return;}
  const dados = cadastroPortuarioAtivo()
    ? {tipo:cadastroPortuarioAtual.tipo,rotulo:cadastroPortuarioAtual.rotulo,...cadastroPortuarioAtual.dados}
    : getCadastroDados();
  copiarTexto(JSON.stringify(dados, null, 2), 'Cadastro copiado como JSON.').then((ok) => {
    if (ok) mostrarFeedbackCadastroCopiado();
  });
}

window.addEventListener('futureg:environmentchange',atualizarCadastroPorAmbiente);
document.getElementById('result-grid-items').addEventListener('click',(event)=>{
  const botao=event.target.closest('.field-copy-action');
  if(!botao)return;
  copiarCampoResultado(botao,botao.dataset.copyValue,botao.dataset.copyLabel || 'Valor');
});
atualizarCadastroPorAmbiente();
