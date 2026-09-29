// Crachás sintéticos. Novos modelos devem entrar neste mapa e reutilizar o mesmo contrato de saída.
const CRACHA_MODELOS = Object.freeze({
  funcionario: Object.freeze({
    label: 'Funcionário',
    status: 'ATIVO',
    funcoes: Object.freeze([
      'Analista de qualidade', 'Assistente administrativo', 'Desenvolvedor de software',
      'Especialista de suporte', 'Coordenador de operações', 'Técnico de segurança'
    ])
  })
});

let crachaAtual = null;

function gerarCodigoCracha() {
  return semRepeticaoRecente('cracha', () => `CR-${String(rand(900000) + 100000)}`);
}

function gerarMatriculaCracha() {
  return `MAT-${new Date().getFullYear()}-${randomDigits(6).join('')}`;
}

function gerarValidadeCracha() {
  const data = new Date();
  data.setFullYear(data.getFullYear() + 1 + rand(3));
  data.setMonth(rand(12), 1 + rand(27));
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function iniciaisCracha(nome) {
  const partes = String(nome || '').trim().split(/\s+/).filter(parte => !/^(da|de|do|das|dos)$/i.test(parte));
  return ((partes[0]?.[0] || '') + (partes.at(-1)?.[0] || '')).toUpperCase() || 'FG';
}

function gerarDadosCracha(opcoes = {}) {
  const modeloId = CRACHA_MODELOS[opcoes.modelo] ? opcoes.modelo : 'funcionario';
  const modelo = CRACHA_MODELOS[modeloId];
  const nome = gerarNomePessoa();
  const codigo = gerarCodigoCracha();
  const comCodigoBarras = opcoes.codigoBarras !== false;
  return {
    modelo: modelo.label,
    modelo_id: modeloId,
    avatar: iniciaisCracha(nome),
    nome,
    codigo,
    empresa: gerarNomeEmpresa(),
    funcao: pick(modelo.funcoes),
    matricula: gerarMatriculaCracha(),
    validade: gerarValidadeCracha(),
    status: modelo.status,
    codigo_barras: comCodigoBarras ? `TESTE-${codigo.replace(/\W/g, '')}` : ''
  };
}

function formatarCrachaTexto(dados) {
  if (!dados) return '';
  return [
    ['Modelo', dados.modelo], ['Nome', dados.nome], ['Código', dados.codigo],
    ['Empresa', dados.empresa], ['Função', dados.funcao], ['Matrícula', dados.matricula],
    ['Validade', dados.validade], ['Status', dados.status], ['Avatar sintético', dados.avatar],
    ['Código de barras ilustrativo', dados.codigo_barras]
  ].filter(([, valor]) => valor).map(([label, valor]) => `${label}: ${valor}`).join('\n');
}

function renderizarBarrasCracha(referencia) {
  const bits = `101${[...referencia].map(caractere => caractere.charCodeAt(0).toString(2).padStart(8, '0')).join('')}101`;
  return [...bits].map((bit, indice) => `<i class="${bit === '1' ? 'is-bar' : 'is-space'}" style="width:${indice % 3 === 0 ? 2 : 1}px"></i>`).join('');
}

function corAvatarCracha(nome) {
  const cores = ['#2563eb', '#7c3aed', '#0f766e', '#b45309', '#be123c'];
  const indice = [...String(nome || '')].reduce((total, caractere) => total + caractere.charCodeAt(0), 0) % cores.length;
  return cores[indice];
}

function mostrarCracha(dados) {
  if (!dados) return;
  crachaAtual = dados;
  const preview = document.getElementById('badge-preview');
  preview.hidden = false;
  const avatar = document.getElementById('badge-avatar');
  avatar.textContent = dados.avatar;
  avatar.style.background = corAvatarCracha(dados.nome);
  avatar.setAttribute('aria-label', `Avatar sintético de ${dados.nome}`);
  document.getElementById('badge-nome').textContent = dados.nome;
  document.getElementById('badge-funcao').textContent = dados.funcao;
  document.getElementById('badge-empresa').textContent = dados.empresa;
  document.getElementById('badge-codigo').textContent = dados.codigo;
  document.getElementById('badge-matricula').textContent = dados.matricula;
  document.getElementById('badge-modelo').textContent = dados.modelo;
  document.getElementById('badge-validade').textContent = dados.validade;
  document.getElementById('badge-status').textContent = dados.status;
  const barcode = document.getElementById('badge-barcode');
  barcode.hidden = !dados.codigo_barras;
  document.getElementById('badge-barcode-bars').innerHTML = dados.codigo_barras ? renderizarBarrasCracha(dados.codigo_barras) : '';
  document.getElementById('badge-barcode-value').textContent = dados.codigo_barras || '';
}

function esconderCracha() {
  const preview = document.getElementById('badge-preview');
  if (preview) preview.hidden = true;
}

function limparCrachaAtual() {
  crachaAtual = null;
  esconderCracha();
}

function gerarCrachaIndividual() {
  const modelo = document.getElementById('gerador-cracha-modelo')?.value || 'funcionario';
  const codigoBarras = document.getElementById('gerador-cracha-codigo-barras')?.checked !== false;
  const dados = gerarDadosCracha({ modelo, codigoBarras });
  currentType = 'cracha';
  currentValue = dados.codigo;
  nomeAtualDoc = '';
  setOutput(dados.codigo);
  esconderPlaca();
  esconderConteiner();
  document.getElementById('nome-box').classList.remove('visible');
  mostrarCracha(dados);
  registrarHistoricoDocs('Crachá', dados.codigo, { nome: dados.nome, cracha: dados, modelo: dados.modelo_id });
  return dados;
}

function copiarCodigoCracha() {
  if (!crachaAtual?.codigo) {
    mostrarStatus('Gere um crachá antes de copiar.', 'error');
    return;
  }
  copiarTexto(crachaAtual.codigo, 'Código do crachá copiado.');
}
