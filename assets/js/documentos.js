// ══════════════════════════════════════════════════════════
//  CPF / CNPJ / PLACA / CONTÊINER / NOMES
// ══════════════════════════════════════════════════════════
let currentValue = '', currentType = '', nomeAtualDoc = '';
let placaTipoAtual = 'mercosul';


const primeirosMasc = [
  // Simples
  'André','Bruno','Carlos','Daniel','Eduardo','Felipe','Gabriel','Henrique','Igor','João',
  'Lucas','Marcos','Nicolas','Pedro','Rafael','Roberto','Samuel','Thiago','Victor','William',
  'Alexandre','Antônio','Caio','Diego','Fábio','Gustavo','Hugo','Ivan','Jorge','Leonardo',
  'Adriano','Alan','Cláudio','Cristiano','Davi','Emanuel','Erick','Fernando','Francisco','Gilberto',
  'Guilherme','Leandro','Luiz','Mateus','Maurício','Miguel','Murilo','Paulo','Ricardo','Rodrigo',
  'Rogério','Sérgio','Vitor','Wagner','Wesley','Renan','Renato','Evandro','Celso','Tiago',
  // Compostos
  'João Paulo','Luiz Carlos','João Pedro','Carlos Eduardo','Pedro Henrique','Luiz Felipe',
  'João Victor','Marco Antônio','Paulo Roberto','André Luís','Caio Felipe','Luis Gustavo',
  'João Marcos','José Carlos',
];
const primeirosFem = [
  // Simples
  'Ana','Beatriz','Camila','Daniela','Elisa','Fernanda','Gabriela','Helena','Isabela','Juliana',
  'Karla','Larissa','Mariana','Natália','Olívia','Patrícia','Rafaela','Sabrina','Tatiana','Valentina',
  'Amanda','Bianca','Clara','Débora','Eduarda','Flávia','Giovanna','Heloísa','Ingrid','Joana',
  'Adriana','Aline','Bruna','Caroline','Cristina','Denise','Elaine','Evelyn','Gisele','Jéssica',
  'Kelly','Letícia','Luciana','Marta','Michele','Mônica','Paula','Priscila','Renata','Sandra',
  'Simone','Vanessa','Viviane','Yasmin','Raquel','Rebeca','Tânia','Vera','Lídia','Célia',
  // Compostos
  'Ana Paula','Maria Clara','Ana Luíza','Ana Carolina','Maria Eduarda','Maria Fernanda',
  'Ana Beatriz','Ana Júlia','Maria Alice','Ana Lívia','Maria Luíza','Sara Helena',
  'Lara Sofia','Ana Flávia',
];
const sobrenomesSimples = [
  'Silva','Santos','Oliveira','Souza','Rodrigues','Ferreira','Alves','Pereira','Lima','Gomes',
  'Costa','Ribeiro','Martins','Carvalho','Almeida','Lopes','Soares','Fernandes','Vieira','Barbosa',
  'Rocha','Dias','Nascimento','Andrade','Moreira','Nunes','Marques','Machado','Mendes','Freitas',
  'Borges','Cardoso','Cavalcanti','Correia','Cruz','Cunha','Faria','Figueiredo','Gonçalves','Guerra',
  'Guimarães','Leal','Leite','Melo','Miranda','Monteiro','Moraes','Nogueira','Pinheiro','Pinto',
  'Queiroz','Ramos','Reis','Sales','Sampaio','Santana','Tavares','Teixeira','Torres','Xavier',
  'Azevedo','Braga','Campos','Castro','Coutinho','Fonseca','Lacerda','Maia','Paiva','Rezende',
  'Vasconcelos','Viana','Aragão','Bezerra','Duarte','Esteves','Falcão','Galvão','Meireles','Siqueira',
];
const sobrenomesPrep = [
  'de Souza','dos Santos','da Silva','de Oliveira','de Lima','da Costa','do Nascimento',
  'de Almeida','dos Reis','de Jesus','da Rocha','de Castro','de Andrade','de Moraes',
  'de Freitas','de Carvalho','de Melo','das Neves','de Farias','do Carmo',
];
// Mantido para retrocompatibilidade com gerarNumeroConteiner e outros usos internos
const sobrenomes = sobrenomesSimples;


function gerarNomePessoa() {
  return semRepeticaoRecente('nome', () => {
    const primeiro = pick([...primeirosMasc, ...primeirosFem, ...NOMES_ADICIONAIS]);
    const disponiveis = [...new Set([...sobrenomesSimples, ...SOBRENOMES_ADICIONAIS])];
    const partes = [];
    const quantidade = 1 + rand(3);
    for (let i = 0; i < quantidade; i++) {
      const sobrenome = disponiveis.splice(rand(disponiveis.length), 1)[0];
      partes.push(i === 0 && rand(5) === 0 ? 'de ' + sobrenome : sobrenome);
    }
    return [primeiro, ...partes].join(' ');
  });
}

function gerarNomeEmpresa() {
  return semRepeticaoRecente('empresa', () => {
    const sobrenomes = [...new Set([...sobrenomesSimples, ...SOBRENOMES_ADICIONAIS])];
    const primeiro = pick(sobrenomes);
    const segundo = pick(sobrenomes.filter(s => s !== primeiro));
    const marca = pick(MARCAS_EMPRESA);
    const setor = pick(SETORES_EMPRESA);
    const regiao = pick(REGIOES_EMPRESA);
    const sigla = Array.from({length: 3 + rand(2)}, () => letraAleatoria()).join('');
    const bases = [marca + ' ' + setor, primeiro + ' & ' + segundo + ' ' + setor,
      marca + ' ' + setor + ' ' + regiao, sigla + ' ' + setor,
      primeiro + ' ' + setor + ' ' + regiao, marca + ' ' + primeiro + ' ' + setor];
    return pick(bases) + ' ' + pick(['Ltda.', 'S.A.', 'ME', 'EPP', '& Cia. Ltda.']);
  });
}

function mostrarNome(nome, tipo) {
  nomeAtualDoc = nome;
  const box   = document.getElementById('nome-box');
  const label = document.getElementById('nome-label');
  const val   = document.getElementById('nome-val');
  label.textContent = tipo === 'cpf' ? 'Nome' : 'Razão social';
  val.textContent   = nome;
  box.classList.add('visible');
}

function gerarNovoNome() {
  if (!currentType) return;
  mostrarNome(currentType === 'cpf' ? gerarNomePessoa() : gerarNomeEmpresa(), currentType);
}

function onToggleNome() {
  const ativo = document.getElementById('toggle-nome').checked;
  const box = document.getElementById('nome-box');
  if (!ativo) box.classList.remove('visible');
  else if (nomeAtualDoc && currentType) box.classList.add('visible');
}

function copyNome() {
  copiarTexto(nomeAtualDoc, 'Nome copiado.').then((ok) => {
    if (!ok) return;
    const msg = document.getElementById('nome-copied-msg');
    msg.style.opacity = '1';
    setTimeout(() => msg.style.opacity = '0', 1500);
  });
}

// ── CPF ─────────────────────────────────────────────────────
function calcDigitoCPF(digits, weights) {
  const sum = digits.reduce((s, d, i) => s + d * weights[i], 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

function gerarCPF(mask) {
  const raw = gerarCPFRaw();
  currentType = 'cpf'; currentValue = raw;
  const val = mask ? `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}` : raw;
  setOutput(val); esconderPlaca(); esconderConteiner(); esconderTelefone();
  if (document.getElementById('toggle-nome').checked) mostrarNome(gerarNomePessoa(), 'cpf');
  registrarHistoricoDocs('CPF', val, { nome: getNomeDocsAtual() });
  return { raw, formatted: val };
}

// ── CNPJ ─────────────────────────────────────────────────────
function charParaValorDV(ch) { return ch.toUpperCase().charCodeAt(0) - 48; }
function calcDVCNPJ(arr, weights) {
  const sum = arr.reduce((s, ch, i) => s + charParaValorDV(ch) * weights[i], 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

function gerarCNPJRawNumerico() {
  return semRepeticaoRecente('cnpj', () => {
    const d = randomDigits(12).map(String);
    if (d.every(ch => ch === d[0])) d[0] = String((Number(d[0]) + 1) % 10);
    d.push(String(calcDVCNPJ(d, [5,4,3,2,9,8,7,6,5,4,3,2])));
    d.push(String(calcDVCNPJ(d, [6,5,4,3,2,9,8,7,6,5,4,3,2])));
    return d.join('');
  });
}

function gerarCNPJRawAlfanumerico() {
  return semRepeticaoRecente('cnpj-alfa', () => {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const base = Array.from({length: 12}, () => pick(pool));
    if (!base.some(ch => /[A-Z]/.test(ch))) base[rand(12)] = letraAleatoria();
    base.push(String(calcDVCNPJ(base, [5,4,3,2,9,8,7,6,5,4,3,2])));
    base.push(String(calcDVCNPJ(base, [6,5,4,3,2,9,8,7,6,5,4,3,2])));
    return base.join('');
  });
}

function gerarCNPJ(mask) {
  const raw = gerarCNPJRawNumerico();
  currentType = 'cnpj'; currentValue = raw;
  const formatted = mask ? formatCNPJ(raw) : raw;
  setOutput(formatted); esconderPlaca(); esconderConteiner(); esconderTelefone();
  if (document.getElementById('toggle-nome').checked) mostrarNome(gerarNomeEmpresa(), 'cnpj');
  registrarHistoricoDocs('CNPJ', formatted, { nome: getNomeDocsAtual() });
  return { raw, formatted };
}

function gerarCNPJAlfanumerico(mask) {
  const raw = gerarCNPJRawAlfanumerico();
  currentType = 'cnpj-alfa'; currentValue = raw;
  const formatted = mask ? formatCNPJ(raw) : raw;
  setOutput(formatted); esconderPlaca(); esconderConteiner(); esconderTelefone();
  if (document.getElementById('toggle-nome').checked) mostrarNome(gerarNomeEmpresa(), 'cnpj');
  registrarHistoricoDocs('CNPJ alfanumérico', formatted, { nome: getNomeDocsAtual() });
  return { raw, formatted };
}

function formatCNPJ(s) { return `${s.slice(0,2)}.${s.slice(2,5)}.${s.slice(5,8)}/${s.slice(8,12)}-${s.slice(12)}`; }

// ── IMO ───────────────────────────────────────────────────────
function calcDVIMO(seisDigitos) {
  let soma = 0;
  for (let i = 0; i < 6; i++) {
    soma += parseInt(seisDigitos[i]) * (7 - i);
  }
  return soma % 10;
}

function gerarIMO() {
  const base = Array.from({length: 6}, () => rand(10)).join('');
  const dv   = calcDVIMO(base);
  const num  = `IMO ${base}${dv}`;
  currentType = 'imo'; currentValue = num;
  setOutput(num); esconderPlaca(); esconderConteiner();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  registrarHistoricoDocs('IMO', num, { imo: num });
}

// ── Placas ────────────────────────────────────────────────────
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function letraAleatoria() { return LETRAS[rand(LETRAS.length)]; }

function gerarPlacaMercosulRaw() {
  return semRepeticaoRecente('placa', () => letraAleatoria() + letraAleatoria() + letraAleatoria() + rand(10) + letraAleatoria() + rand(10) + rand(10));
}

function gerarPlaca(tipo) {
  let placa, subtipo;
  subtipo = tipo === 'aleatoria' ? (rand(2) === 0 ? 'mercosul' : 'antiga') : tipo;
  placaTipoAtual = subtipo;
  if (subtipo === 'antiga') {
    placa = letraAleatoria() + letraAleatoria() + letraAleatoria() + '-' + String(rand(10)) + String(rand(10)) + String(rand(10)) + String(rand(10));
  } else {
    placa = gerarPlacaMercosulRaw();
  }
  currentType = 'placa'; currentValue = placa;
  setOutput(placa); mostrarPlacaVisual(placa, subtipo); esconderConteiner(); esconderTelefone();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  registrarHistoricoDocs('Placa', placa, { subtipo });
  return placa;
}

function mostrarPlacaVisual(placa, subtipo) {
  const preview = document.getElementById('placa-preview');
  const wrapper = document.getElementById('placa-wrapper');
  const placaSegura = escapeHtml(placa);
  const tipoLabel = subtipo === 'mercosul' ? 'Mercosul' : 'padrão antigo';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', `Placa ${tipoLabel}: ${placa}`);
  if (subtipo === 'mercosul') {
    wrapper.innerHTML = `<div style="position:relative;" aria-hidden="true"><div class="placa-mercosul-stripe"><span>BRASIL</span></div><div class="placa-body" style="padding-left:33px;"><div class="placa-pais" style="color:#1351a8;font-size:8px;letter-spacing:2px;">BRASIL</div><div class="placa-numero">${placaSegura}</div><div class="placa-tag">Mercosul</div></div></div>`;
  } else {
    wrapper.innerHTML = `<div class="placa-body" aria-hidden="true"><div class="placa-pais">BRASIL</div><div class="placa-numero">${placaSegura}</div><div class="placa-tag">Padrão antigo</div></div>`;
  }
  preview.classList.add('visible');
}

function esconderPlaca() { document.getElementById('placa-preview').classList.remove('visible'); }

// ── Contêiner / Lacre ─────────────────────────────────────────
const PREFIXOS_ARMADORES = ['MSCU','CMAU','HLCU','EVRU','YMLU','CSCL','OOLU','APMU','COSU','MAEU','TCKU','TRLU','CAIU','GESU','SEAU','TEXU','TGBU','FSCU','FBIU','CSNU'];

function calcDVConteiner(prefixo, numero) {
  const charVal = {'A':10,'B':12,'C':13,'D':14,'E':15,'F':16,'G':17,'H':18,'I':19,'J':20,'K':21,'L':23,'M':24,'N':25,'O':26,'P':27,'Q':28,'R':29,'S':30,'T':31,'U':32,'V':34,'W':35,'X':36,'Y':37,'Z':38,'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9};
  const base = prefixo + numero;
  let soma = 0;
  for (let i = 0; i < base.length; i++) soma += (charVal[base[i]] || 0) * Math.pow(2, i);
  const dv = soma % 11;
  return dv === 10 ? 0 : dv;
}

function gerarNumeroConteiner() {
  const prefixo = pick(PREFIXOS_ARMADORES);
  const owner = prefixo.slice(0, 3);
  const serial = Array.from({length: 6}, () => rand(10)).join('');
  const full = owner + 'U' + serial;
  const dv = calcDVConteiner(full.slice(0, 4), serial);
  return `${owner}U${serial}${dv}`;
}

function gerarLacreArmador() {
  const p1 = LETRAS[rand(LETRAS.length)], p2 = LETRAS[rand(LETRAS.length)];
  const nums = Array.from({length: 7}, () => rand(10)).join('');
  return `${p1}${p2}${nums}`;
}

function gerarConteiner() {
  const num = gerarNumeroConteiner();
  currentType = 'conteiner'; currentValue = num;
  setOutput(num); esconderPlaca();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  document.getElementById('container-num-val').textContent = num;
  document.getElementById('lacre-card').style.display = 'none';
  document.getElementById('container-num-card').style.display = '';
  document.getElementById('container-preview').classList.add('visible');
  registrarHistoricoDocs('Contêiner', num, { conteiner: num });
  return num;
}

function gerarConteinerComLacre() {
  const num   = gerarNumeroConteiner();
  const lacre = gerarLacreArmador();
  currentType = 'conteiner-lacre'; currentValue = `${num} / ${lacre}`;
  esconderPlaca();
  const box = document.getElementById('docs-output-box');
  if (box) box.style.display = 'none';
  document.getElementById('new-doc-btn').style.display = 'none';
  document.getElementById('copy-btn').style.display = 'none';
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  document.getElementById('container-num-val').textContent  = num;
  document.getElementById('lacre-val').textContent          = lacre;
  document.getElementById('lacre-card').style.display       = 'block';
  document.getElementById('container-num-card').style.display = '';
  document.getElementById('container-preview').classList.add('visible');
  registrarHistoricoDocs('Contêiner e lacre', `${num} / ${lacre}`, { conteiner: num, lacre });
}

function gerarLacreSomente() {
  const lacre = gerarLacreArmador();
  currentType = 'lacre'; currentValue = lacre;
  setOutput(lacre); esconderPlaca();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  document.getElementById('lacre-val').textContent            = lacre;
  document.getElementById('lacre-card').style.display         = 'block';
  document.getElementById('container-num-card').style.display = 'none';
  document.getElementById('container-preview').classList.add('visible');
  registrarHistoricoDocs('Lacre', lacre, { lacre });
}

function esconderConteiner() {
  document.getElementById('container-preview').classList.remove('visible');
  document.getElementById('container-num-card').style.display = '';
}

function esconderTelefone() { /* telefone usa output-box principal */ }

function copiarContainerNum() {
  const val = document.getElementById('container-num-val').textContent;
  copiarTexto(val, 'Número do contêiner copiado.').then((ok) => {
    if (!ok) return;
    const msg = document.getElementById('container-num-copied');
    msg.style.opacity = '1';
    setTimeout(() => msg.style.opacity = '0', 1500);
  });
}

function copiarLacre() {
  const val = document.getElementById('lacre-val').textContent;
  copiarTexto(val, 'Lacre copiado.').then((ok) => {
    if (!ok) return;
    const msg = document.getElementById('lacre-copied');
    msg.style.opacity = '1';
    setTimeout(() => msg.style.opacity = '0', 1500);
  });
}

// ── CNH ──────────────────────────────────────────────────────
function calcDSP(digs) {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digs[i] * (9 - i);
  let dsp = sum % 11;
  return dsp >= 10 ? 0 : dsp;
}

function gerarCNHRaw() {
  const digs = Array.from({length: 9}, () => rand(10));
  const d1 = calcDSP(digs);
  let sumD2 = 0;
  for (let i = 0; i < 9; i++) sumD2 += digs[i] * (1 + i);
  const rawD2 = sumD2 % 11;
  const d2 = rawD2 >= 10 ? 0 : rawD2;
  return digs.join('') + String(d1) + String(d2);
}

function gerarCNH() {
  const cnh = gerarCNHRaw();
  currentType = 'cnh'; currentValue = cnh;
  setOutput(cnh); esconderPlaca(); esconderConteiner(); esconderTelefone();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  registrarHistoricoDocs('CNH', cnh);
  return cnh;
}

// ── Telefone ──────────────────────────────────────────────────
const ddds = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,64,63,65,66,67,68,69,71,73,74,75,77,79,81,87,82,83,84,85,88,86,89,91,93,94,92,97,95,96,98,99];

function gerarTelefoneBR(opcoes = {}) {
  const uf = opcoes.uf || '';
  if (uf && !DDD_POR_UF[uf]) throw new Error('UF de telefone inválida.');
  const candidatos = uf ? DDD_POR_UF[uf] : ddds;
  const raw = semRepeticaoRecente('telefone', () => {
    const ddd = pick(candidatos);
    const fixo = opcoes.tipo === 'fixo';
    return String(ddd) + (fixo ? String(2 + rand(4)) : '9') + randomDigits(fixo ? 7 : 8).join('');
  });
  const numero = raw.slice(2);
  return { raw, formatted: '(' + raw.slice(0, 2) + ') ' + numero.slice(0, -4) + '-' + numero.slice(-4) };
}

function gerarTelefone() {
  const { raw, formatted } = gerarTelefoneBR({ uf: document.getElementById('gerador-uf')?.value, tipo: document.getElementById('gerador-telefone-tipo')?.value });
  currentType = 'telefone'; currentValue = raw;
  const mask = document.getElementById('toggle-mascara').checked;
  setOutput(mask ? formatted : raw);
  esconderPlaca(); esconderConteiner();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  registrarHistoricoDocs('Telefone', mask ? formatted : raw);
}

function gerarEmail() {
  const email = gerarEmailPessoa(nomeAtualDoc || '');
  currentType = 'email'; currentValue = email;
  setOutput(email); esconderPlaca(); esconderConteiner(); esconderTelefone();
  document.getElementById('nome-box').classList.remove('visible'); nomeAtualDoc = '';
  registrarHistoricoDocs('E-mail', email);
  return email;
}

function gerarEmailDocs() {
  return gerarEmail();
}

function gerarNovoDocumentoAtual() {
  const mask = document.getElementById('toggle-mascara').checked;
  switch (currentType) {
    case 'rg': case 'booking': case 'due': case 'nome': case 'empresa': gerarDocumentoExtra(currentType); break;
    case 'cpf': gerarCPF(mask); break;
    case 'cnpj': gerarCNPJ(mask); break;
    case 'cnpj-alfa': gerarCNPJAlfanumerico(mask); break;
    case 'cnh': gerarCNH(); break;
    case 'telefone': gerarTelefone(); break;
    case 'email': gerarEmail(); break;
    case 'placa': gerarPlaca(placaTipoAtual); break;
    case 'conteiner': gerarConteiner(); break;
    case 'conteiner-lacre': gerarConteinerComLacre(); break;
    case 'lacre': gerarLacreSomente(); break;
    case 'imo': gerarIMO(); break;
    default: mostrarStatus('Gere um documento primeiro.', 'error');
  }
}

// ── Máscara ───────────────────────────────────────────────────
function removerMascara() {
  if (!currentValue || ['placa','conteiner','conteiner-lacre','lacre','email','nome','empresa','booking'].includes(currentType)) return;
  currentValue = currentValue.replace(/[^0-9A-Za-z]/g, '');
  setOutput(currentValue);
}

function aplicarMascara() {
  if (!currentValue || ['placa','conteiner','conteiner-lacre','lacre','email','nome','empresa','booking'].includes(currentType)) return;
  const raw = currentValue.replace(/[^0-9A-Za-z]/g, '');
  if (currentType === 'rg') { setOutput(formatRG(raw)); return; }
  if (currentType === 'due') { setOutput(raw.slice(0,-1) + '-' + raw.slice(-1)); return; }
  if (currentType === 'cpf' && raw.length === 11) setOutput(`${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}`);
  else if ((currentType === 'cnpj' || currentType === 'cnpj-alfa') && raw.length === 14) setOutput(formatCNPJ(raw));
  else if (currentType === 'telefone') {
    if (raw.length === 10 || raw.length === 11) { const ddd = raw.slice(0,2), num = raw.slice(2); setOutput(`(${ddd}) ${num.slice(0,-4)}-${num.slice(-4)}`); }
    else setOutput(raw);
  }
}

function onToggleMascara() {
  const mask = document.getElementById('toggle-mascara').checked;
  mask ? aplicarMascara() : removerMascara();
}

function gerarCPFComToggle()              { gerarCPF(document.getElementById('toggle-mascara').checked); }
function gerarCNPJComToggle()             { gerarCNPJ(document.getElementById('toggle-mascara').checked); }
function gerarCNPJAlfanumericoComToggle() { gerarCNPJAlfanumerico(document.getElementById('toggle-mascara').checked); }

function setOutput(val) {
  const box = document.getElementById('docs-output-box');
  if (box) box.style.display = '';
  const el = document.getElementById('output-val');
  el.textContent = val;
  el.classList.remove('placeholder');
  document.getElementById('new-doc-btn').style.display = 'inline-block';
  document.getElementById('copy-btn').style.display = 'inline-block';
  document.getElementById('download-doc-btn').style.display = 'inline-block';
  atualizarOpcoesDocumento(currentType);
}

function atualizarOpcoesDocumento(tipoAtual = currentType, tipoLote = document.getElementById('lote-tipo')?.value || '') {
  const comNome=['cpf','cnpj','cnpj-alfa'].includes(tipoAtual);
  const comMascara=['cpf','cnpj','cnpj-alfa','rg','telefone','due'].includes(tipoAtual) || ['cpf','cnpj','cnpj-alfa','rg','telefone','due'].includes(tipoLote);
  const comTelefone=tipoAtual==='telefone' || tipoLote==='telefone';
  document.getElementById('docs-option-name').hidden=!comNome;
  document.getElementById('docs-option-mask').hidden=!comMascara;
  document.getElementById('docs-preferencias').hidden=!comNome&&!comMascara;
  document.getElementById('docs-phone-options').hidden=!comTelefone;
}

function copyResult() {
  const val = document.getElementById('output-val').textContent;
  copiarTexto(val, 'Resultado copiado.').then((ok) => {
    if (!ok) return;
    const msg = document.getElementById('copied-msg');
    msg.style.opacity = '1';
    setTimeout(() => msg.style.opacity = '0', 1500);
  });
}

function baixarResultadoDocumento() {
  const valorExibido = document.getElementById('output-val').textContent;
  if (!currentType || !valorExibido) { mostrarStatus('Gere um documento antes de baixar.', 'error'); return; }
  const rotulos = {cpf:'CPF',cnpj:'CNPJ','cnpj-alfa':'CNPJ alfanumérico',cnh:'CNH',rg:'RG',telefone:'Telefone',email:'E-mail',placa:'Placa',conteiner:'Contêiner','conteiner-lacre':'Contêiner e lacre',lacre:'Lacre',imo:'IMO',booking:'Booking',due:'DU-E',nome:'Nome',empresa:'Empresa'};
  const linhas = [];
  if (nomeAtualDoc && document.getElementById('nome-box').classList.contains('visible')) linhas.push(`${currentType === 'cpf' ? 'Nome' : 'Razão social'}: ${nomeAtualDoc}`);
  linhas.push(`${rotulos[currentType] || 'Resultado'}: ${valorExibido}`);
  baixarTexto(`dado-teste-${currentType.replace(/[^a-z0-9-]/gi,'-')}.txt`, linhas.join('\n'));
  mostrarStatus('Arquivo TXT preparado para download.');
}

// ── Validação ─────────────────────────────────────────────────
function onValidateInput() {
  const input = document.getElementById('validate-input');
  const statusEl = document.getElementById('validate-status');
  const raw = input.value.replace(/[^0-9A-Za-z]/g, '');
  input.setAttribute('aria-invalid', 'false');
  statusEl.className = 'status idle';
  statusEl.textContent = raw ? 'Informe 11 dígitos para CPF ou 14 caracteres para CNPJ.' : 'Aguardando entrada';
}

function validarDocumento() {
  const input = document.getElementById('validate-input');
  const raw = input.value.replace(/[^0-9A-Za-z]/g, '');
  const statusEl = document.getElementById('validate-status');
  if (raw.length === 11) {
    const cpfNumerico = /^[0-9]{11}$/.test(raw);
    if (!cpfNumerico) {
      input.setAttribute('aria-invalid', 'true');
      statusEl.className = 'status invalid';
      statusEl.textContent = 'CPF deve conter 11 dígitos numéricos.';
      return false;
    }
    const ok = validarCPF(raw);
    input.setAttribute('aria-invalid', String(!ok));
    statusEl.className   = ok ? 'status valid' : 'status invalid';
    statusEl.textContent = ok ? 'CPF válido' : 'CPF inválido';
  } else if (raw.length === 14) {
    const ok = validarCNPJ(raw);
    const alfanumerico = /[A-Z]/i.test(raw);
    input.setAttribute('aria-invalid', String(!ok));
    statusEl.className   = ok ? 'status valid' : 'status invalid';
    statusEl.textContent = ok
      ? (alfanumerico ? 'CNPJ alfanumérico válido' : 'CNPJ válido')
      : (alfanumerico ? 'CNPJ alfanumérico inválido' : 'CNPJ inválido');
  } else {
    input.setAttribute('aria-invalid', 'true');
    statusEl.className   = 'status invalid';
    statusEl.textContent = 'Formato não reconhecido (CPF = 11 dígitos, CNPJ = 14 caracteres)';
  }
  return false;
}

function validarCPF(s) {
  if (!/^[0-9]{11}$/.test(s)) return false;
  if (/^(.)\1+$/.test(s)) return false;
  const d = s.split('').map(Number);
  const d10 = calcDigitoCPF(d.slice(0,9),  [10,9,8,7,6,5,4,3,2]);
  const d11 = calcDigitoCPF(d.slice(0,10), [11,10,9,8,7,6,5,4,3,2]);
  return d[9] === d10 && d[10] === d11;
}

function validarCNPJ(s) {
  if (!/^[A-Z0-9]{12}[0-9]{2}$/i.test(s)) return false;
  const arr = s.toUpperCase().split('');
  if (arr.every(c => c === arr[0])) return false;
  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2], w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  const dv1 = calcDVCNPJ(arr.slice(0,12), w1);
  const dv2 = calcDVCNPJ(arr.slice(0,13), w2);
  return parseInt(arr[12]) === dv1 && parseInt(arr[13]) === dv2;
}
