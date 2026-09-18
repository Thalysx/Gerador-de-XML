// API de geração sem dependência de elementos da interface.
function formatCPF(raw) { return `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}`; }
function formatRG(raw) { return `${raw.slice(0,2)}.${raw.slice(2,5)}.${raw.slice(5,8)}-${raw.slice(8)}`; }

function gerarCPFRaw() {
  return semRepeticaoRecente('cpf', () => {
    const d = randomDigits(9);
    if (d.every(n => n === d[0])) d[0] = (d[0] + 1) % 10;
    d.push(calcDigitoCPF(d, [10,9,8,7,6,5,4,3,2]));
    d.push(calcDigitoCPF(d, [11,10,9,8,7,6,5,4,3,2]));
    return d.join('');
  });
}

function gerarBooking() {
  const hoje = new Date();
  const data = `${hoje.getFullYear()}${String(hoje.getMonth()+1).padStart(2,'0')}${String(hoje.getDate()).padStart(2,'0')}`;
  return semRepeticaoRecente('booking', () => `BK${data}${randomDigits(8).join('')}`);
}

function calcularDVDue(baseNumerica) {
  const soma = [...baseNumerica].reduce((total, n, i) => total + Number(n) * (12 - i), 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function gerarDUEExemplo() {
  return semRepeticaoRecente('due', () => {
    const ano = String(new Date().getFullYear()).slice(-2);
    const sequencia = String(1 + rand(999999999)).padStart(9, '0');
    return `${ano}BR${sequencia}${calcularDVDue(ano + sequencia)}`;
  });
}

const TIPOS_DADOS = {
  cpf: 'CPF', cnpj: 'CNPJ', 'cnpj-alfa': 'CNPJ alfanumérico', nome: 'Nome', empresa: 'Razão social',
  cnh: 'CNH', rg: 'RG', telefone: 'Telefone', email: 'E-mail', placa: 'Placa',
  conteiner: 'Contêiner', 'conteiner-lacre': 'Contêiner e lacre', lacre: 'Lacre', imo: 'IMO',
  booking: 'Booking', due: 'DU-E (exemplo)', cadastro: 'Cadastro completo', motorista: 'Motorista'
};

function gerarRegistro(tipo, opcoes = {}) {
  if (!Object.hasOwn(TIPOS_DADOS, tipo)) throw new Error('Tipo de dado não reconhecido.');
  const mascara = opcoes.mascara !== false;
  let valor;
  switch (tipo) {
    case 'cpf': { const raw = gerarCPFRaw(); valor = mascara ? formatCPF(raw) : raw; break; }
    case 'cnpj': case 'cnpj-alfa': {
      const raw = tipo === 'cnpj' ? gerarCNPJRawNumerico() : gerarCNPJRawAlfanumerico();
      valor = mascara ? formatCNPJ(raw) : raw; break;
    }
    case 'nome': valor = gerarNomePessoa(); break;
    case 'empresa': valor = gerarNomeEmpresa(); break;
    case 'cnh': valor = gerarCNHRaw(); break;
    case 'rg': { const rg = gerarRGBR(); valor = mascara ? rg : rg.replace(/\W/g,''); break; }
    case 'telefone': { const tel = gerarTelefoneBR({ uf: opcoes.uf, tipo: opcoes.telefoneTipo }); valor = mascara ? tel.formatted : tel.raw; break; }
    case 'email': valor = gerarEmailPessoa(opcoes.nome); break;
    case 'placa': valor = opcoes.placaTipo === 'antiga'
      ? letraAleatoria() + letraAleatoria() + letraAleatoria() + (mascara ? '-' : '') + randomDigits(4).join('')
      : gerarPlacaMercosulRaw(); break;
    case 'conteiner': valor = gerarNumeroConteiner(); break;
    case 'lacre': valor = gerarLacreArmador(); break;
    case 'conteiner-lacre': valor = { conteiner: gerarNumeroConteiner(), lacre: gerarLacreArmador() }; break;
    case 'imo': { const base = randomDigits(6).join(''); valor = (mascara ? 'IMO ' : '') + base + calcDVIMO(base); break; }
    case 'booking': valor = gerarBooking(); break;
    case 'due': { const raw = gerarDUEExemplo(); valor = mascara ? raw.slice(0,-1) + '-' + raw.slice(-1) : raw; break; }
    case 'motorista': case 'cadastro': {
      const nome = gerarNomePessoa();
      valor = {
        nome, cpf: gerarRegistro('cpf', opcoes).valor, cnh: gerarCNHRaw(),
        telefone: gerarRegistro('telefone', opcoes).valor, email: gerarEmailPessoa(nome), placa: gerarRegistro('placa', opcoes).valor
      };
      if (tipo === 'cadastro') Object.assign(valor, {
        rg: gerarRegistro('rg', opcoes).valor, endereco: gerarEnderecoBR(),
        empresa: gerarNomeEmpresa(), cnpj: gerarRegistro(opcoes.cnpjAlfa ? 'cnpj-alfa' : 'cnpj', opcoes).valor,
        conteiner: gerarNumeroConteiner(), lacre: gerarLacreArmador()
      });
      break;
    }
  }
  return { tipo, rotulo: TIPOS_DADOS[tipo], valor };
}

function gerarLoteDados(pedidos, opcoes = {}) {
  const total = pedidos.reduce((n, p) => n + p.quantidade, 0);
  if (!pedidos.length || !Number.isSafeInteger(total) || total < 1 || total > 500 ||
      pedidos.some(p => !Number.isSafeInteger(p.quantidade) || p.quantidade < 1 || !Object.hasOwn(TIPOS_DADOS, p.tipo))) {
    throw new Error('Peça entre 1 e 500 registros no total, usando quantidades inteiras.');
  }
  const vistos = new Set();
  const resultado = [];
  for (const pedido of pedidos) {
    for (let i = 0; i < pedido.quantidade; i++) {
      let registro, chave;
      for (let tentativa = 0; tentativa < 100; tentativa++) {
        registro = gerarRegistro(pedido.tipo, opcoes);
        chave = pedido.tipo + ':' + JSON.stringify(registro.valor);
        if (!vistos.has(chave)) break;
      }
      if (vistos.has(chave)) throw new Error('Não foi possível completar o lote sem repetições.');
      vistos.add(chave);
      resultado.push(registro);
    }
  }
  return resultado;
}

function textoRegistro(registro) {
  return typeof registro.valor === 'object'
    ? Object.entries(registro.valor).map(([campo, valor]) => `${campo}: ${valor}`).join('\n')
    : String(registro.valor);
}

function baixarTexto(nome, texto, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([texto], { type: mime }));
  const link = document.createElement('a');
  link.href = url; link.download = nome;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportarRegistros(registros, formato) {
  if (!registros.length) { mostrarStatus('Gere um lote primeiro.', 'error'); return; }
  if (formato === 'json') baixarTexto('dados-teste.json', JSON.stringify(registros, null, 2), 'application/json');
  else if (formato === 'csv') {
    // Mantém cada campo em uma coluna; neutraliza fórmulas ao abrir em planilhas.
    const campos = [...new Set(registros.flatMap(r => typeof r.valor === 'object' ? Object.keys(r.valor) : ['valor']))];
    const celula = valor => '"' + String(valor ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""') + '"';
    const linhas = [['tipo', ...campos], ...registros.map(r => {
      const dados = typeof r.valor === 'object' ? r.valor : { valor: r.valor };
      return [r.rotulo, ...campos.map(c => dados[c] ?? '')];
    })];
    baixarTexto('dados-teste.csv', '\uFEFF' + linhas.map(l => l.map(celula).join(';')).join('\r\n'), 'text/csv;charset=utf-8');
  } else baixarTexto('dados-teste.txt', registros.map(r => `${r.rotulo}: ${textoRegistro(r)}`).join('\n\n'));
}

function gerarDocumentoExtra(tipo) {
  const registro = gerarRegistro(tipo, { mascara: document.getElementById('toggle-mascara').checked });
  currentType = tipo;
  currentValue = tipo === 'rg' ? registro.valor.replace(/\W/g,'') : registro.valor;
  nomeAtualDoc = '';
  document.getElementById('nome-box').classList.remove('visible');
  setOutput(registro.valor); esconderPlaca(); esconderConteiner();
  registrarHistoricoDocs(registro.rotulo, registro.valor);
}

function conferirDocumento(valor) {
  const entrada = valor.trim().toUpperCase();
  if (/[^A-Z0-9.\s/()\-]/.test(entrada)) return { ok: false, mensagem: 'Há caracteres não permitidos.' };
  const raw = entrada.replace(/[.\s/()\-]/g, '');
  if (/^[A-Z]{3}[UJZ]\d{7}$/.test(raw)) {
    const ok = calcDVConteiner(raw.slice(0,4), raw.slice(4,10)) === Number(raw[10]);
    return { ok, mensagem: `Contêiner: dígito ${ok ? 'consistente' : 'inconsistente'}.` };
  }
  if (/^[A-Z]{3}(\d[A-Z]\d{2}|\d{4})$/.test(raw)) return { ok: true, mensagem: 'Placa: formato reconhecido.' };
  if (/^(IMO)?\d{7}$/.test(raw)) {
    const num = raw.replace(/^IMO/, '');
    const ok = calcDVIMO(num.slice(0,6)) === Number(num[6]);
    return { ok, mensagem: `IMO: dígito ${ok ? 'consistente' : 'inconsistente'}.` };
  }
  if (/^\d{11}$/.test(raw)) {
    const ok = validarCPF(raw);
    return { ok, mensagem: ok ? 'CPF: dígitos consistentes.' : 'CPF: dígitos inconsistentes. CNH não é verificada aqui.' };
  }
  if (/^[A-Z0-9]{12}\d{2}$/.test(raw)) {
    const ok = validarCNPJ(raw);
    return { ok, mensagem: `CNPJ: dígitos ${ok ? 'consistentes' : 'inconsistentes'}.` };
  }
  return { ok: false, mensagem: 'Use CPF, CNPJ, placa, contêiner ou IMO.' };
}

function atualizarValidacaoDocumento() {
  const input = document.getElementById('validate-input');
  const status = document.getElementById('validate-status');
  const resultado = conferirDocumento(input.value);
  status.className = 'status ' + (input.value.trim() ? resultado.ok ? 'valid' : 'invalid' : 'idle');
  status.textContent = input.value.trim() ? resultado.mensagem : 'Aguardando entrada';
  input.setAttribute('aria-invalid', String(Boolean(input.value.trim()) && !resultado.ok));
  return false;
}
