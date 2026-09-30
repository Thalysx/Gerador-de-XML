// Interpretador local de pedidos, sem chamadas a modelos ou APIs externas.
const ALIASES_PEDIDOS = [
  ['carga-conteinerizada', 'cargas? conteinerizadas?'], ['granel-solido', 'graneis? solidos?'], ['granel-liquido', 'graneis? liquidos?'], ['carga-solta', 'cargas? soltas?'],
  ['conjunto-veicular', 'conjuntos? veiculares?'], ['cavalo-mecanico', 'cavalos? mecanicos?'], ['carreta', 'carretas?'],
  ['transportadora', 'transportadoras?'], ['importador', 'importadores?'], ['exportador', 'exportadores?'], ['depositante', 'depositantes?'],
  ['operador-portuario', 'operadores? portuarios?'], ['visitante-portuario', 'visitantes? portuarios?'],
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
const SUGESTOES_CHAT_AMBIENTE = Object.freeze({
  general: Object.freeze(['3 CPFs e 2 CNPJs','2 cadastros','3 nomes e 2 empresas','5 telefones fixos UF SP']),
  port: Object.freeze(['2 cargas conteinerizadas','1 conjunto veicular','3 transportadoras','dados para um motorista'])
});

function atualizarChatPorAmbiente() {
  const ambiente=activeEnvironmentId();
  const sugestoes=document.getElementById('chat-sugestoes');
  sugestoes.replaceChildren(...SUGESTOES_CHAT_AMBIENTE[ambiente].map(pedido=>{
    const button=document.createElement('button');
    button.type='button';button.textContent=pedido;
    button.addEventListener('click',()=>sugerirChat(pedido));
    return button;
  }));
  document.getElementById('chat-pedido').placeholder='Pergunte ou peça para gerar algo...';
}

function ajustarAlturaComposerChat() {
  const input=document.getElementById('chat-pedido');
  input.style.height='auto';
  input.style.height=`${Math.min(Math.max(input.scrollHeight,44),140)}px`;
}

function inicializarComposerChat() {
  const input=document.getElementById('chat-pedido');
  input.addEventListener('input',ajustarAlturaComposerChat);
  input.addEventListener('keydown',event=>{
    if(event.key!=='Enter' || event.shiftKey || event.isComposing)return;
    event.preventDefault();
    if(!input.value.trim()){input.focus();return;}
    enviarChat(event);
  });
  ajustarAlturaComposerChat();
}

function renderizarChatPreservandoScroll(area, render) {
  const scrollAnterior = area.scrollTop;
  const distanciaDoFim = area.scrollHeight - area.clientHeight - area.scrollTop;
  const acompanhar = area.scrollHeight <= area.clientHeight || distanciaDoFim <= 80;
  render();
  area.scrollTop = acompanhar ? area.scrollHeight : scrollAnterior;
  return acompanhar;
}

function renderRegistros(registros) {
  const visiveis = registros.slice(0, 50);
  return visiveis.map(r => `<div class="registro-lote"><span class="registro-tipo">${escapeHtml(r.rotulo)}</span><pre>${escapeHtml(textoRegistro(r))}</pre></div>`).join('') +
    (registros.length > 50 ? `<p class="texto-apoio">Mostrando 50 de ${registros.length}. Copiar e exportar incluem todos os registros.</p>` : '');
}

function renderChat() {
  const area = document.getElementById('chat-mensagens');
  document.getElementById('chat-vazio').hidden = conversasChat.length > 0;
  renderizarChatPreservandoScroll(area, () => {
    area.innerHTML = conversasChat.map((conversa, idx) => `
      <article class="chat-troca">
        <div class="chat-pedido"><span>Você</span><p>${escapeHtml(conversa.pedido)}</p></div>
        <div class="chat-resposta"><strong>${conversa.erro ? 'Vamos ajustar o pedido' : `${conversa.registros.length} registros gerados`}</strong>
          ${conversa.erro ? `<p>${escapeHtml(conversa.erro)}</p>` : renderRegistros(conversa.registros)}
          ${conversa.erro ? '' : `<div class="acoes-inline"><button type="button" onclick="copiarChat(${idx})">Copiar tudo</button><button type="button" onclick="exportarChat(${idx}, 'json')">JSON</button><button type="button" onclick="exportarChat(${idx}, 'csv')">CSV</button><button type="button" onclick="exportarChat(${idx}, 'txt')">TXT</button></div>`}
        </div>
      </article>`).join('');
  });
}

function enviarChatLocal(event) {
  event?.preventDefault();
  const input = document.getElementById('chat-pedido');
  const pedido = input.value.trim();
  if (!pedido) { input.focus(); return false; }
  try {
    const { pedidos, opcoes } = interpretarPedido(pedido, document.getElementById('chat-mascara').checked);
    const indisponivel=pedidos.find(item=>!generatorSupportsEnvironment(generatorById(item.tipo)));
    if(indisponivel)throw new Error(`${generatorById(indisponivel.tipo)?.label || indisponivel.tipo} não está disponível em ${APP_ENVIRONMENTS[activeEnvironmentId()].label}.`);
    conversasChat.push({ pedido, registros: gerarLoteDados(pedidos, opcoes) });
    document.getElementById('chat-status').textContent = 'Pedido concluído. Resultados disponíveis na conversa.';
  } catch (erro) {
    conversasChat.push({ pedido, erro: erro.message });
    document.getElementById('chat-status').textContent = erro.message;
  }
  // Limita a memória da conversa sem persistir lotes grandes no localStorage.
  if (conversasChat.length > 10) conversasChat.shift();
  input.value = '';
  ajustarAlturaComposerChat(); renderChat(); input.focus();
  return false;
}

function sugerirChat(pedido) {
  const input=document.getElementById('chat-pedido');
  input.value=pedido;ajustarAlturaComposerChat();input.focus();
  document.getElementById('chat-status').textContent='Sugestão preenchida. Revise o pedido e pressione Enviar.';
}
function limparChatLocal() { conversasChat = []; renderChat(); document.getElementById('chat-status').textContent = 'Conversa limpa.'; }
function copiarChat(idx) { copiarTexto(conversasChat[idx].registros.map(r => `${r.rotulo}: ${textoRegistro(r)}`).join('\n\n')); }
function exportarChat(idx, formato) { exportarRegistros(conversasChat[idx].registros, formato); }

function gerarLoteInterface(event) {
  event?.preventDefault();
  try {
    ultimoLote = gerarLoteDados([{ tipo: document.getElementById('lote-tipo').value, quantidade: Number(document.getElementById('lote-quantidade').value) }], {
      mascara: document.getElementById('toggle-mascara').checked,
      uf: document.getElementById('gerador-uf').value,
      telefoneTipo: document.getElementById('gerador-telefone-tipo').value,
      crachaModelo: document.getElementById('gerador-cracha-modelo').value,
      codigoBarras: document.getElementById('gerador-cracha-codigo-barras').checked
    });
    document.getElementById('lote-resultados').innerHTML = renderRegistros(ultimoLote);
    document.getElementById('lote-status').textContent = `${ultimoLote.length} registros gerados, sem repetições neste lote.${ultimoLote.length > 50 ? ' A prévia mostra os primeiros 50; copiar e baixar incluem todos.' : ''}`;
    document.getElementById('lote-exportacao').hidden = false;
    registerGeneratorUse(document.getElementById('lote-tipo').value,{kind:'batch',quantity:ultimoLote.length});
    document.getElementById('lote-resultados').focus({preventScroll:true});
  } catch (erro) { mostrarStatus(erro.message, 'error'); }
  return false;
}

function exportarLoteInterface(formato) {
  const type=document.getElementById('lote-tipo').value;
  const generator=generatorById(type);
  if(!generator?.capabilities.export){mostrarStatus('Este tipo não oferece exportação em lote.','error');return false;}
  const exported=exportarRegistros(ultimoLote,formato,`lote-${activeEnvironmentId()}-${type}`);
  if(exported) {
    recordProductivityActivity(type,{kind:'export',quantity:ultimoLote.length});
    mostrarStatus(`Lote de ${generator.label} exportado em ${formato.toUpperCase()}.`);
  }
  return exported;
}

function limparLoteInterface() {
  ultimoLote = [];
  document.getElementById('lote-resultados').replaceChildren();
  document.getElementById('lote-exportacao').hidden = true;
  document.getElementById('lote-status').textContent = 'Lote limpo. Escolha o tipo e a quantidade para gerar novamente.';
  document.getElementById('lote-tipo').focus();
}

function inicializarGeracao() {
  document.getElementById('gerador-uf').innerHTML = '<option value="">Todas as UFs</option>' + Object.keys(DDD_POR_UF).sort().map(uf => `<option>${uf}</option>`).join('');
  atualizarTiposLotePorAmbiente();
  atualizarChatPorAmbiente();
  inicializarComposerChat();
  document.getElementById('lote-tipo').addEventListener('change',()=>atualizarOpcoesDocumento(selectedGeneratorId || currentType,document.getElementById('lote-tipo').value));
  atualizarOpcoesDocumento(currentType,document.getElementById('lote-tipo').value);
  renderChat();
}

function atualizarTiposLotePorAmbiente() {
  const select=document.getElementById('lote-tipo');
  const previous=select.value;
  const types=batchTypesForEnvironment();
  select.innerHTML=Object.entries(types).map(([tipo,rotulo])=>`<option value="${tipo}">${rotulo}</option>`).join('');
  if(types[previous])select.value=previous;
  if(typeof atualizarOpcoesDocumento==='function')atualizarOpcoesDocumento(typeof selectedGeneratorId==='undefined'?'':selectedGeneratorId || currentType,select.value);
  if(typeof updateBatchIndicator==='function')updateBatchIndicator();
}
window.addEventListener('futureg:environmentchange',atualizarTiposLotePorAmbiente);
window.addEventListener('futureg:environmentchange',atualizarChatPorAmbiente);
