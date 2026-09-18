// ══════════════════════════════════════════════════════════
//  CADASTRO GERAL
// ══════════════════════════════════════════════════════════
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

function gerarCEPFormatado() {
  const raw = Array.from({length: 8}, () => rand(10)).join('');
  return `${raw.slice(0,5)}-${raw.slice(5)}`;
}

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

function gerarRGBR() {
  // Formato brasileiro: XX.XXX.XXX-D (8 dígitos + 1 dígito verificador)
  const nums = Array.from({length: 8}, () => rand(10));
  let soma = 0;
  const pesos = [2,3,4,5,6,7,8,9];
  nums.forEach((n, i) => soma += n * pesos[i]);
  const resto = soma % 11;
  const dv = resto < 2 ? resto : 11 - resto;
  const dvStr = dv === 10 ? 'X' : String(dv);
  const n = nums.join('');
  return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}-${dvStr}`;
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
    case 'cracha':   document.getElementById('cad_cracha').value   = `CR-${String(rand(900000)+100000)}`; break;
    case 'doc_pessoa': document.getElementById('cad_doc_pessoa').value = gerarDocumentoEstrangeiro(document.getElementById('cad_doc_pessoa_tipo').value); break;
    case 'empresa':  document.getElementById('cad_empresa').value  = gerarNomeEmpresa(); break;
    case 'cnpj':     document.getElementById('cad_cnpj').value     = gerarCNPJCadastro(); break;
    case 'doc_empresa': document.getElementById('cad_doc_empresa').value = gerarDocumentoEstrangeiro(document.getElementById('cad_doc_empresa_tipo').value); break;
    case 'placa':    document.getElementById('cad_placa').value    = gerarPlacaMercosulRaw(); break;
    case 'conteiner':document.getElementById('cad_conteiner').value= gerarNumeroConteiner(); break;
    case 'lacre':    document.getElementById('cad_lacre').value    = gerarLacreArmador(); break;
  }
  cadAtualizarResultado();
}

function gerarCadastroCompleto() {
  const nome     = gerarNomePessoa();
  const tel      = gerarTelefoneBR().formatted;
  const email    = gerarEmailPessoa(nome);
  const endereco = gerarEnderecoBR();
  const cpf = formatCPF(gerarCPFRaw());
  const rg       = gerarRGBR();
  const cnh      = gerarCNHRaw();
  const cracha   = `CR-${String(rand(900000)+100000)}`;
  const docPessoaTipo = document.getElementById('cad_doc_pessoa_tipo').value;
  const docPessoa = gerarDocumentoEstrangeiro(docPessoaTipo);
  const empresa  = gerarNomeEmpresa();
  const cnpjTipoLabel = document.getElementById('cad_cnpj_tipo').value === 'alfanumerico' ? 'Alfanumérico' : 'Numérico';
  const cnpj     = gerarCNPJCadastro();
  const docEmpresaTipo = document.getElementById('cad_doc_empresa_tipo').value;
  const docEmpresa = gerarDocumentoEstrangeiro(docEmpresaTipo);
  const placa    = gerarPlacaMercosulRaw();
  const conteiner= gerarNumeroConteiner();
  const lacre    = gerarLacreArmador();

  document.getElementById('cad_nome').value     = nome;
  document.getElementById('cad_tel').value      = tel;
  document.getElementById('cad_email').value    = email;
  document.getElementById('cad_endereco').value = endereco;
  document.getElementById('cad_cpf').value      = cpf;
  document.getElementById('cad_rg').value       = rg;
  document.getElementById('cad_cnh').value      = cnh;
  document.getElementById('cad_cracha').value   = cracha;
  document.getElementById('cad_doc_pessoa').value = docPessoa;
  document.getElementById('cad_empresa').value  = empresa;
  document.getElementById('cad_cnpj').value     = cnpj;
  document.getElementById('cad_doc_empresa').value = docEmpresa;
  document.getElementById('cad_placa').value    = placa;
  document.getElementById('cad_conteiner').value= conteiner;
  document.getElementById('cad_lacre').value    = lacre;

  // Mostrar resultado visual
  const result = document.getElementById('cadastro-result');
  result.classList.add('visible');
  document.getElementById('res-nome-title').textContent = nome;
  document.getElementById('res-nome').textContent       = nome;
  document.getElementById('res-empresa-sub').textContent = empresa;
  document.getElementById('res-empresa').textContent    = empresa;

  const items = [
    { label: 'CPF',       value: cpf      },
    { label: 'RG',        value: rg       },
    { label: 'CNH',       value: cnh      },
    { label: 'Crachá',    value: cracha   },
    { label: labelDocumentoEstrangeiro(docPessoaTipo), value: docPessoa },
    { label: 'Telefone',  value: tel      },
    { label: 'E-mail',    value: email    },
    { label: 'Endereço',  value: endereco },
    { label: `CNPJ ${cnpjTipoLabel}`, value: cnpj },
    { label: labelDocumentoEstrangeiroEmpresa(docEmpresaTipo), value: docEmpresa },
    { label: 'Placa',     value: placa    },
    { label: 'Contêiner', value: conteiner},
    { label: 'Lacre',     value: lacre    },
  ];

  const grid = document.getElementById('result-grid-items');
  grid.innerHTML = items.map(it => `
    <div class="result-item">
      <div class="result-item-label">${escapeHtml(it.label)}</div>
      <div class="result-item-value">
        <span>${escapeHtml(it.value)}</span>
        <button type="button" class="copy-mini" onclick="copyMini(this, '${escapeInlineValue(it.value)}')" aria-label="Copiar ${escapeAttr(it.label)}">Copiar</button>
      </div>
    </div>`).join('');

  atualizarStatusResultadoCadastro(`Cadastro completo gerado para ${nome}.`);
  adicionarAoHistorico(getCadastroDados());
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
    conteiner: document.getElementById('cad_conteiner').value,
    lacre:     document.getElementById('cad_lacre').value,
  };
}

function atualizarStatusResultadoCadastro(mensagem) {
  const status = document.getElementById('cadastro-result-status');
  if (status) status.textContent = mensagem;
}

function cadAtualizarResultado() {
  const dados = getCadastroDados();
  if (!Object.values(dados).some(Boolean)) return;

  const result = document.getElementById('cadastro-result');
  result.classList.add('visible');
  document.getElementById('res-nome-title').textContent = dados.nome || 'Cadastro parcial';
  document.getElementById('res-nome').textContent       = dados.nome || '—';
  document.getElementById('res-empresa-sub').textContent = dados.empresa || '—';
  document.getElementById('res-empresa').textContent    = dados.empresa || '—';

  const items = [
    { label: 'CPF',       value: dados.cpf       },
    { label: 'RG',        value: dados.rg        },
    { label: 'CNH',       value: dados.cnh       },
    { label: 'Crachá',    value: dados.cracha    },
    { label: dados.documento_estrangeiro_pessoa_tipo, value: dados.documento_estrangeiro_pessoa },
    { label: 'Telefone',  value: dados.telefone  },
    { label: 'E-mail',    value: dados.email     },
    { label: 'Endereço',  value: dados.endereco  },
    { label: `CNPJ ${dados.cnpj_tipo}`, value: dados.cnpj },
    { label: labelDocumentoEstrangeiroEmpresa(dados.documento_estrangeiro_empresa_tipo), value: dados.documento_estrangeiro_empresa },
    { label: 'Placa',     value: dados.placa     },
    { label: 'Contêiner', value: dados.conteiner },
    { label: 'Lacre',     value: dados.lacre     },
  ].filter(it => it.value);

  const grid = document.getElementById('result-grid-items');
  grid.innerHTML = items.map(it => `
    <div class="result-item">
      <div class="result-item-label">${escapeHtml(it.label)}</div>
      <div class="result-item-value">
        <span>${escapeHtml(it.value)}</span>
        <button type="button" class="copy-mini" onclick="copyMini(this, '${escapeInlineValue(it.value)}')" aria-label="Copiar ${escapeAttr(it.label)}">Copiar</button>
      </div>
    </div>`).join('');

  atualizarStatusResultadoCadastro(dados.nome
    ? `Resultado do cadastro de ${dados.nome} atualizado.`
    : 'Resultado do cadastro parcial atualizado.');
}

function copyMini(btn, val) {
  copiarTexto(val, 'Valor copiado.').then((ok) => {
    if (!ok) return;
    const originalLabel = btn.getAttribute('aria-label') || 'Copiar valor';
    btn.textContent = 'Copiado';
    btn.setAttribute('aria-label', 'Valor copiado');
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.setAttribute('aria-label', originalLabel);
      btn.classList.remove('copied');
    }, 1500);
  });
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
    const icon = btn.querySelector('i');
    const originalIconClass = icon ? icon.className : '';
    const originalLabel = btn.getAttribute('aria-label');
    if (icon) icon.className = 'bi bi-check-lg';
    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Campo copiado');
    setTimeout(() => {
      if (icon) icon.className = originalIconClass;
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
  ['cad_nome','cad_tel','cad_email','cad_endereco','cad_cpf','cad_rg','cad_cnh','cad_cracha','cad_doc_pessoa','cad_empresa','cad_cnpj','cad_doc_empresa','cad_placa','cad_conteiner','cad_lacre'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('cad_cnpj_tipo').value = 'normal';
  document.getElementById('cad_doc_pessoa_tipo').value = 'passaporte';
  document.getElementById('cad_doc_empresa_tipo').value = 'passaporte';
  document.getElementById('cadastro-result').classList.remove('visible');
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
  const linhas = [
    ['Nome completo', dados.nome],
    ['CPF', dados.cpf],
    ['RG', dados.rg],
    ['CNH', dados.cnh],
    ['Crachá', dados.cracha],
    ['Telefone', dados.telefone],
    ['E-mail', dados.email],
    ['Endereço', dados.endereco],
    [dados.documento_estrangeiro_pessoa_tipo, dados.documento_estrangeiro_pessoa],
    ['Razão social', dados.empresa],
    [`CNPJ ${dados.cnpj_tipo}`, dados.cnpj],
    [labelDocumentoEstrangeiroEmpresa(dados.documento_estrangeiro_empresa_tipo), dados.documento_estrangeiro_empresa],
    ['Placa', dados.placa],
    ['Contêiner', dados.conteiner],
    ['Lacre de armador', dados.lacre],
  ];

  return linhas
    .filter(([, valor]) => String(valor || '').trim())
    .map(([label, valor]) => `${label}: ${valor}`)
    .join('\n');
}

function copiarCadastroTexto() {
  const texto = formatarCadastroTexto(getCadastroDados());
  copiarTexto(texto, 'Cadastro copiado.').then((ok) => {
    if (ok) mostrarFeedbackCadastroCopiado();
  });
}

function copiarCadastroJSON() {
  const dados = getCadastroDados();
  copiarTexto(JSON.stringify(dados, null, 2), 'Cadastro copiado como JSON.').then((ok) => {
    if (ok) mostrarFeedbackCadastroCopiado();
  });
}
