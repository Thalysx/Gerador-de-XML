let conversasChat = [];
let ultimoComandoChat = '';
let ultimoLote = [];
const SUGESTOES_CHAT_AMBIENTE = Object.freeze({
  general: Object.freeze(['3 CPFs e 2 CNPJs','10 crachás sem código de barras','5 UUIDs','gerar NF-e com 3 produtos']),
  port: Object.freeze(['2 cargas conteinerizadas','1 conjunto veicular','gerar CT-e','resumir XML anexado'])
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
  document.getElementById('chat-pedido').placeholder='Digite um comando, como “gerar NF-e com 3 produtos”';
  renderCatalogoChat(); renderFavoritosChat(); atualizarSugestoesComando();
}

function ajustarAlturaComposerChat() {
  const input=document.getElementById('chat-pedido');
  input.style.height='auto';
  input.style.height=`${Math.min(Math.max(input.scrollHeight,44),140)}px`;
}

function inicializarComposerChat() {
  const input=document.getElementById('chat-pedido');
  input.addEventListener('input',ajustarAlturaComposerChat);
  input.addEventListener('input',atualizarSugestoesComando);
  input.addEventListener('keydown',event=>{
    if(event.key==='Escape'){document.getElementById('chat-completar').hidden=true;return;}
    if(event.key==='ArrowDown'&&!event.shiftKey) {
      const sugestao=document.querySelector('#chat-completar:not([hidden]) button');
      if(sugestao){event.preventDefault();sugestao.focus();return;}
    }
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
      <article class="chat-troca" aria-labelledby="chat-resposta-${idx}">
        <div class="chat-pedido"><span>Você</span><p>${escapeHtml(conversa.pedido)}</p></div>
        <div class="chat-resposta"><strong id="chat-resposta-${idx}">${escapeHtml(conversa.erro ? 'Vamos ajustar o comando' : conversa.titulo)}</strong>
          ${conversa.erro ? `<p>${escapeHtml(conversa.erro)}</p><button type="button" onclick="abrirCatalogoChat()">Ver comandos disponíveis</button>` : renderResultadoComando(conversa,idx)}
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
    let efetivo=pedido,comando=interpretarComando(efetivo,document.getElementById('chat-mascara').checked);
    if(comando.acao==='repetir') {
      if(!ultimoComandoChat)throw new Error('Execute um comando primeiro para poder repeti-lo.');
      efetivo=ultimoComandoChat;comando=interpretarComando(efetivo,document.getElementById('chat-mascara').checked);
    }
    let resultado;
    if(comando.acao==='ajuda') {
      abrirCatalogoChat();resultado={titulo:'Comandos locais',texto:'Use o catálogo para escolher um comando. Aceitamos de 1 a 500 registros, máscara, UF, telefone fixo, placa antiga e crachá com ou sem código de barras. XML: gerar NF-e/CT-e, resumir, mostrar produtos/destinatário, validar e criar cópias de teste. Indique XML anexado, NF-e atual, CT-e atual ou XML resultado. Enter envia; Shift+Enter insere uma linha. Sugestões e favoritos aguardam sua revisão.'};
    } else if(comando.acao==='registros') {
      const indisponivel=comando.pedidos.find(item=>!generatorSupportsEnvironment(generatorById(item.tipo)));
      if(indisponivel)throw new Error(`${generatorById(indisponivel.tipo)?.label || indisponivel.tipo} não está disponível em ${APP_ENVIRONMENTS[activeEnvironmentId()].label}. Troque o ambiente ou escolha um comando do catálogo.`);
      const registros=gerarLoteDados(comando.pedidos,comando.opcoes);
      resultado={titulo:`${registros.length} registros gerados`,registros};
    } else resultado=executarXmlComando(comando);
    conversasChat.push({pedido,...resultado,comando:comando.acao==='ajuda'?undefined:efetivo,ambiente:activeEnvironmentId()});
    if(comando.acao!=='ajuda')ultimoComandoChat=efetivo;
    input.value='';
    document.getElementById('chat-status').textContent='Comando concluído localmente. Resultados disponíveis na conversa.';
  } catch (erro) {
    const mensagem=erro instanceof Error?erro.message:'Não foi possível concluir o comando. Revise o pedido e o anexo.';
    conversasChat.push({ pedido, erro: mensagem });
    document.getElementById('chat-status').textContent = mensagem;
  }
  // Limita a memória da conversa sem persistir lotes grandes no localStorage.
  if (conversasChat.length > 10) conversasChat.shift();
  atualizarSugestoesComando();
  ajustarAlturaComposerChat(); renderChat(); input.focus();
  return false;
}

function sugerirChat(pedido) {
  const input=document.getElementById('chat-pedido');
  input.value=pedido;ajustarAlturaComposerChat();input.focus();
  atualizarSugestoesComando();
  document.getElementById('chat-status').textContent='Sugestão preenchida. Revise o pedido e pressione Enviar.';
}
function enviarChat(event) { return enviarChatLocal(event); }
function limparChatLocal() { conversasChat = []; ultimoComandoChat=''; limparAnexoChat(false); renderChat(); document.getElementById('chat-status').textContent = 'Conversa limpa.'; document.getElementById('chat-pedido').focus(); }
function limparChat() { limparChatLocal(); }
function copiarChat(idx) { const c=conversasChat[idx]; if(c)copiarTexto(c.xml?.texto || (c.registros?c.registros.map(r => `${r.rotulo}: ${textoRegistro(r)}`).join('\n\n'):c.texto||'')); }
function exportarChat(idx, formato) { exportarRegistros(conversasChat[idx].registros, formato); }

function renderResultadoComando(c,idx) {
  const texto=c.texto?`<p class="command-texto">${escapeHtml(c.texto)}</p>`:'';
  const registros=c.registros?`<details class="command-registros"><summary>${c.registros.length} registros · ver conteúdo</summary>${renderRegistros(c.registros)}</details>`:'';
  const xml=c.xml?`<div class="command-artefato"><h3>${escapeHtml(c.xml.nome)}</h3><details><summary>Ver XML</summary><pre>${escapeHtml(formatarXmlPreview(c.xml.texto.slice(0,16000)))}</pre>${c.xml.texto.length>16000?'<p class="texto-apoio">Prévia limitada. Copiar e baixar incluem o arquivo completo.</p>':''}</details><div class="acoes-inline"><button type="button" onclick="baixarXmlChat(${idx})">Baixar XML</button><button type="button" onclick="validarXmlChat(${idx})">Validar localmente</button><button type="button" onclick="editarXmlChat(${idx})">Abrir no Editor</button></div></div>`:'';
  const formatos=c.registros?`<button type="button" onclick="exportarChat(${idx},'json')">JSON</button><button type="button" onclick="exportarChat(${idx},'csv')">CSV</button><button type="button" onclick="exportarChat(${idx},'txt')">TXT</button>`:'';
  return `${texto}${registros}${xml}<div class="acoes-inline"><button type="button" onclick="copiarChat(${idx})">Copiar tudo</button>${formatos}${c.comando?`<button type="button" onclick="favoritarComandoChat(${idx})">Favoritar comando</button>`:''}</div>`;
}
function baixarXmlChat(idx) { const xml=conversasChat[idx]?.xml;if(xml)baixarTexto(xml.nome,xml.texto,'application/xml'); }
function validarXmlChat(idx) {
  const xml=conversasChat[idx]?.xml;if(!xml)return;
  conversasChat.push({pedido:`Validar ${xml.nome}`, ...executarXmlComando({acao:'validar'},xml)});
  if(conversasChat.length>10)conversasChat.shift();renderChat();
  document.getElementById('chat-status').textContent='Validação local concluída.';
}
function editarXmlChat(idx) {
  const xml=conversasChat[idx]?.xml;if(!xml)return;
  const r=analisarXml(xml.texto,xml.nome);
  if(!r.editavel){document.getElementById('chat-status').textContent='Este XML não pode ser aberto no Editor. Confira a validação local.';return;}
  const doc=new DOMParser().parseFromString(xml.texto,'application/xml');
  editorGarantirGrupoPadrao();const id=editorProxId++;
  editorArquivos.push({id,nome:xml.nome,doc,original:serializarXml(doc),modificado:false,grupoId:editorGrupoAtivo,_estrutura:null});
  editorSubTabAtual=xml.tipo==='nfe'?'produtos':'estrutura';editorPosCarga(id);switchTab('editor');
  document.getElementById('tab-editor').focus({preventScroll:true});
}

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
