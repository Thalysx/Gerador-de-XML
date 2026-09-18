// Interpretador local de pedidos, sem chamadas a modelos ou APIs externas.
const ALIASES_PEDIDOS = [
  ['cnpj-alfa', 'cnpjs? alfanumericos?'], ['conteiner-lacre', '(?:conteiner(?:es)?|containers?) (?:com|e) lacres?'],
  ['cadastro', 'cadastros?(?: completos?)?'], ['motorista', '(?:dados para (?:um |uma )?)?motoristas?'],
  ['empresa', '(?:nomes? de empresas?|razoes sociais|razao social|empresas?)'],
  ['nome', '(?:nomes?(?: de pessoas?)?|pessoas?)'], ['cpf', 'cpfs?'], ['cnpj', 'cnpjs?'],
  ['cnh', 'cnhs?'], ['rg', 'rgs?'], ['telefone', '(?:telefones?|celulares?|celular)'],
  ['email', 'e-?mails?'], ['placa', 'placas?(?: mercosul)?'], ['conteiner', '(?:conteiner(?:es)?|containers?)'],
  ['lacre', 'lacres?'], ['booking', 'bookings?'], ['due', 'du-?es?'], ['imo', 'imos?']
];

function interpretarPedido(texto, mascaraPadrao = true) {
  let restante = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  if (!restante || restante.length > 500) throw new Error('Escreva um pedido de até 500 caracteres.');
  const opcoes = { mascara: mascaraPadrao };
  restante = restante.replace(/\b(sem|com) mascara\b/g, (_, modo) => { opcoes.mascara = modo === 'com'; return ' '; });
  restante = restante.replace(/\b(?:uf|estado)\s+([a-z]{2})\b/g, (_, uf) => {
    opcoes.uf = uf.toUpperCase();
    if (!DDD_POR_UF[opcoes.uf]) throw new Error('Use a sigla de uma UF, como SP ou BA.');
    return ' ';
  });
  restante = restante.replace(/\bfixos?\b/g, () => { opcoes.telefoneTipo = 'fixo'; return ' '; });
  restante = restante.replace(/\bantigas?\b/g, () => { opcoes.placaTipo = 'antiga'; return ' '; });
  const quantidades = { um:1, uma:1, dois:2, duas:2, tres:3, quatro:4, cinco:5, seis:6, sete:7, oito:8, nove:9, dez:10 };
  restante = restante.replace(/\b(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\b/g, palavra => String(quantidades[palavra]));
  const pedidos = [];
  for (const [tipo, alias] of ALIASES_PEDIDOS) {
    const regex = new RegExp('(?:\\b(\\d+)\\s+(?:de\\s+)?)?\\b(?:' + alias + ')\\b', 'g');
    restante = restante.replace(regex, (_, quantidade) => {
      pedidos.push({ tipo, quantidade: quantidade === undefined ? 1 : Number(quantidade) });
      return ' ';
    });
  }
  const sobra = restante.replace(/\b(?:preciso|quero|gere|gerar|crie|criar|me|de|do|da|dos|das|e|para|por|favor|dados|com|sem|o|a|os|as)\b/g, ' ').replace(/[\s,;.!?]+/g, '');
  if (sobra || !pedidos.length) throw new Error('Não entendi o pedido completo. Exemplo: “3 CPFs e 2 CNPJs” ou “5 telefones fixos UF SP”.');
  const total = pedidos.reduce((n,p) => n + p.quantidade, 0);
  if (total > 500 || pedidos.some(p => !Number.isSafeInteger(p.quantidade) || p.quantidade < 1)) throw new Error('Use quantidades inteiras de 1 a 500 registros no total.');
  return { pedidos, opcoes };
}

let conversasChat = [];
let ultimoLote = [];

function renderRegistros(registros) {
  const visiveis = registros.slice(0, 50);
  return visiveis.map(r => `<div class="registro-lote"><span class="registro-tipo">${escapeHtml(r.rotulo)}</span><pre>${escapeHtml(textoRegistro(r))}</pre></div>`).join('') +
    (registros.length > 50 ? `<p class="texto-apoio">Mostrando 50 de ${registros.length}. Copiar e exportar incluem todos os registros.</p>` : '');
}

function renderChat() {
  const area = document.getElementById('chat-mensagens');
  document.getElementById('chat-vazio').hidden = conversasChat.length > 0;
  area.innerHTML = conversasChat.map((conversa, idx) => `
    <article class="chat-troca">
      <div class="chat-pedido"><span>Você</span><p>${escapeHtml(conversa.pedido)}</p></div>
      <div class="chat-resposta"><strong>${conversa.erro ? 'Vamos ajustar o pedido' : `${conversa.registros.length} registros gerados`}</strong>
        ${conversa.erro ? `<p>${escapeHtml(conversa.erro)}</p>` : renderRegistros(conversa.registros)}
        ${conversa.erro ? '' : `<div class="acoes-inline"><button type="button" onclick="copiarChat(${idx})">Copiar tudo</button><button type="button" onclick="exportarChat(${idx}, 'json')">JSON</button><button type="button" onclick="exportarChat(${idx}, 'csv')">CSV</button><button type="button" onclick="exportarChat(${idx}, 'txt')">TXT</button></div>`}
      </div>
    </article>`).join('');
  area.scrollTop = area.scrollHeight;
}

function enviarChatLocal(event) {
  event?.preventDefault();
  const input = document.getElementById('chat-pedido');
  const pedido = input.value.trim();
  if (!pedido) { input.focus(); return false; }
  try {
    const { pedidos, opcoes } = interpretarPedido(pedido, document.getElementById('chat-mascara').checked);
    conversasChat.push({ pedido, registros: gerarLoteDados(pedidos, opcoes) });
    document.getElementById('chat-status').textContent = 'Pedido concluído. Resultados disponíveis na conversa.';
  } catch (erro) {
    conversasChat.push({ pedido, erro: erro.message });
    document.getElementById('chat-status').textContent = erro.message;
  }
  // Limita a memória da conversa sem persistir lotes grandes no localStorage.
  if (conversasChat.length > 10) conversasChat.shift();
  input.value = '';
  renderChat(); input.focus();
  return false;
}

function sugerirChat(pedido) { document.getElementById('chat-pedido').value = pedido; enviarChat(); }
function limparChatLocal() { conversasChat = []; renderChat(); document.getElementById('chat-status').textContent = 'Conversa limpa.'; }
function copiarChat(idx) { copiarTexto(conversasChat[idx].registros.map(r => `${r.rotulo}: ${textoRegistro(r)}`).join('\n\n')); }
function exportarChat(idx, formato) { exportarRegistros(conversasChat[idx].registros, formato); }

function gerarLoteInterface(event) {
  event?.preventDefault();
  try {
    ultimoLote = gerarLoteDados([{ tipo: document.getElementById('lote-tipo').value, quantidade: Number(document.getElementById('lote-quantidade').value) }], {
      mascara: document.getElementById('toggle-mascara').checked,
      uf: document.getElementById('gerador-uf').value,
      telefoneTipo: document.getElementById('gerador-telefone-tipo').value
    });
    document.getElementById('lote-resultados').innerHTML = renderRegistros(ultimoLote);
    document.getElementById('lote-status').textContent = `${ultimoLote.length} registros gerados, sem repetições neste lote.`;
    document.getElementById('lote-exportacao').hidden = false;
  } catch (erro) { mostrarStatus(erro.message, 'error'); }
  return false;
}

function inicializarGeracao() {
  document.getElementById('gerador-uf').innerHTML = '<option value="">Todas as UFs</option>' + Object.keys(DDD_POR_UF).sort().map(uf => `<option>${uf}</option>`).join('');
  document.getElementById('lote-tipo').innerHTML = Object.entries(TIPOS_DADOS).map(([tipo, rotulo]) => `<option value="${tipo}">${rotulo}</option>`).join('');
  renderChat();
}
