let sessaoIa = null;
let mensagensIa = [];
let requisicaoIa = null;
let versaoIa = 0;
let limpandoIa = false;
let provedorIa = 'provedor configurado no servidor';
async function consultarStatusIa(signal) {
  const response=await fetch('/api/status',{credentials:'same-origin',signal});
  const status=await response.json();
  if(!response.ok||!status.configured)throw new Error(status.error || 'A IA ainda não está configurada. Use os comandos locais.');
  provedorIa=status.provider==='groq'?'Groq':status.provider==='openai'?'OpenAI':'provedor configurado no servidor';
  const aviso=document.getElementById('chat-privacidade');
  if(aviso)aviso.textContent=`Mensagens e anexos são enviados à ${provedorIa}. A conversa fica no servidor por até 30 minutos de inatividade.`;
}

function atualizarModoChat() {
  const ia = document.getElementById('chat-modo').value === 'ia';
  document.getElementById('chat-mensagens').hidden = ia;
  document.getElementById('chat-ia-mensagens').hidden = !ia;
  document.getElementById('chat-anexo-area').hidden = !ia;
  document.getElementById('chat-vazio').hidden = ia ? mensagensIa.length > 0 : conversasChat.length > 0;
  document.getElementById('chat-status').textContent = ia ? `IA: mensagens e anexos enviados serão processados pelo ${provedorIa}.` : 'Modo local: comandos de geração, sem IA e sem envio externo.';
}

function renderChatIa() {
  document.getElementById('chat-ia-mensagens').innerHTML = mensagensIa.map((m,i) => `<article class="chat-troca"><div class="chat-pedido"><span>Você</span><p>${escapeHtml(m.pedido)}</p>${m.anexo ? '<small>XML anexado</small>' : ''}</div><div class="chat-resposta"><strong>Assistente IA</strong><p class="ia-texto">${escapeHtml(m.text || m.erro || 'Consultando a IA…')}</p>${m.activities?.length ? `<p class="texto-apoio">Operações: ${escapeHtml(m.activities.join(', '))}</p>` : ''}${(m.artifacts || []).map((a,j) => `<section class="ia-artefato"><strong>${escapeHtml(a.name)}</strong>${a.kind === 'records' ? renderRegistros(a.records) : `<p class="texto-apoio">XML disponível para baixar, analisar ou editar.</p>`}<div class="acoes-inline">${a.kind === 'records' ? ['json','csv','txt'].map(f => `<button type="button" onclick="baixarArtefatoIa(${i},${j},'${f}')">${f.toUpperCase()}</button>`).join('') : `<button type="button" onclick="baixarArtefatoIa(${i},${j})">Baixar XML</button><button type="button" onclick="validarArtefatoIa(${i},${j})">Validar XML</button><button type="button" onclick="editarArtefatoIa(${i},${j})">Abrir no editor</button>`}</div></section>`).join('')}</div></article>`).join('');
  document.getElementById('chat-vazio').hidden = mensagensIa.length > 0;
}

function enviarChat(event) {
  event?.preventDefault();
  if (document.getElementById('chat-modo').value === 'local') return enviarChatLocal(event);
  enviarChatIa();
  return false;
}

async function enviarChatIa() {
  if (requisicaoIa || limpandoIa) return;
  const input = document.getElementById('chat-pedido');
  const pedido = input.value.trim();
  if (!pedido) return;
  const xml = document.getElementById('chat-anexo').value.trim();
  if (new Blob([xml]).size > 100000) { document.getElementById('chat-status').textContent = 'O XML anexado deve ter até 100 KB.'; return; }
  const versao = versaoIa;
  const controller = new AbortController();
  requisicaoIa = controller;
  const mensagem = {pedido,anexo:!!xml}; mensagensIa.push(mensagem);
  input.value = '';
  document.getElementById('chat-enviar').disabled = true;
  document.getElementById('chat-modo').disabled = true;
  renderChatIa();
  document.getElementById('chat-status').textContent = 'A IA está preparando a resposta…';
  const timeout = setTimeout(() => controller.abort(),100000);
  try {
    if (location.protocol === 'file:') throw new Error('Abra o projeto com npm run dev para usar a IA.');
    await consultarStatusIa(controller.signal);
    if(versao!==versaoIa)return;
    const response = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:pedido,sessionId:sessaoIa,mascara:document.getElementById('chat-mascara').checked,xml:xml || undefined}),signal:controller.signal});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Não foi possível conversar com a IA.');
    if (versao !== versaoIa) return;
    sessaoIa = result.sessionId;
    Object.assign(mensagem,result);
    document.getElementById('chat-anexo').value = '';
    document.getElementById('chat-status').textContent = 'Resposta concluída.';
  } catch(e) {
    if (versao !== versaoIa) return;
    mensagem.erro = e.name === 'AbortError' ? 'Pedido interrompido ou tempo limite atingido.' : e.message;
    document.getElementById('chat-status').textContent = mensagem.erro;
  } finally {
    clearTimeout(timeout);
    if (versao === versaoIa) {
      requisicaoIa = null;
      document.getElementById('chat-enviar').disabled = false;
      document.getElementById('chat-modo').disabled = false;
      renderChatIa(); input.focus();
    }
  }
}

async function limparChat() {
  if(limpandoIa)return;
  if(requisicaoIa) { document.getElementById('chat-status').textContent='Aguarde a resposta antes de limpar a conversa.';return; }
  if(sessaoIa) {
    limpandoIa=true;
    try {
      const response=await fetch('/api/chat',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:sessaoIa}),signal:AbortSignal.timeout(10000)});
      if(!response.ok){const result=await response.json();throw new Error(result.error||'Não foi possível apagar a conversa.');}
    } catch(e) { document.getElementById('chat-status').textContent=e.message;return; }
    finally { limpandoIa=false; }
  }
  versaoIa++; requisicaoIa?.abort(); requisicaoIa=null; sessaoIa=null; mensagensIa=[];
  document.getElementById('chat-enviar').disabled = false;
  document.getElementById('chat-modo').disabled = false;
  document.getElementById('chat-anexo').value = '';
  limparChatLocal(); renderChatIa(); atualizarModoChat();
}
function baixarArtefatoIa(i,j,formato) {
  const a=mensagensIa[i]?.artifacts[j]; if (!a) return;
  if (a.kind === 'records') exportarRegistros(a.records,formato);
  else baixarTexto(a.name,a.text,'application/xml');
}
function validarArtefatoIa(i,j) {
  const a=mensagensIa[i]?.artifacts[j]; if (!a || a.kind !== 'xml') return;
  document.getElementById('validacao-texto').value=a.text;
  validarXmlColado(); switchTab('validacao');
}
function editarArtefatoIa(i,j) {
  validarArtefatoIa(i,j); abrirValidacaoNoEditor(0);
}
function anexarXmlAtualIa() {
  gerarXMLComCampos();
  const tipo=document.getElementById('chat-anexo-tipo').value;
  document.getElementById('chat-anexo').value=serializarXml(xmlsGerados[tipo]);
}
