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

function renderArtefatoIa(a,i,j) {
  const titulo = `ia-arquivo-${i}-${j}`;
  const registros = a.kind === 'records';
  const acoes = registros
    ? ['json','csv','txt'].map(f => `<button type="button" onclick="baixarArtefatoIa(${i},${j},'${f}')">Baixar ${f.toUpperCase()}</button>`).join('')
    : `<button type="button" onclick="baixarArtefatoIa(${i},${j})">Baixar XML</button><button type="button" onclick="validarArtefatoIa(${i},${j})">Validar XML</button><button type="button" onclick="editarArtefatoIa(${i},${j})">Abrir cópia no editor</button>`;
  return `<section class="ia-artefato" aria-labelledby="${titulo}"><h3 id="${titulo}">${escapeHtml(a.name)}</h3><p class="texto-apoio">${registros ? `${a.records.length} registros disponíveis. Escolha um formato para baixar.` : 'XML de teste. Valide o conteúdo ou abra uma cópia para fazer alterações.'}</p>${registros ? `<details><summary>Ver registros</summary>${renderRegistros(a.records)}</details>` : ''}<div class="acoes-inline" role="group" aria-labelledby="${titulo}">${acoes}</div></section>`;
}

function renderChatIa() {
  const nomesFerramentas={gerar_dados:'Gerar dados',gerar_xml:'Gerar XML',consultar_xml:'Consultar e validar XML'};
  document.getElementById('chat-ia-mensagens').innerHTML = mensagensIa.map((m,i) => `<article class="chat-troca"><div class="chat-pedido"><span>Você</span><p>${escapeHtml(m.pedido)}</p>${m.anexo ? '<small>XML anexado</small>' : ''}</div><div class="chat-resposta"><strong>Assistente IA</strong><div class="ia-texto">${formatarRespostaIa(m.text || m.erro || (m.fase==='analisando'?'Analisando o pedido e escolhendo as ferramentas necessárias…':'Conectando ao assistente…'))}</div>${m.activities?.length ? `<div class="ia-ferramentas"><strong>Ferramentas executadas</strong><ul>${m.activities.map(nome=>`<li>${escapeHtml(nomesFerramentas[nome] || nome)}</li>`).join('')}</ul></div>` : ''}${(m.artifacts || []).map((a,j) => renderArtefatoIa(a,i,j)).join('')}</div></article>`).join('');
  document.getElementById('chat-vazio').hidden = mensagensIa.length > 0;
  document.querySelectorAll('#chat-ia-mensagens .chat-resposta').forEach((resposta,i)=>{
    const m=mensagensIa[i];
    const estado=document.createElement('p');
    estado.className='texto-apoio ia-estado';
    estado.textContent=m.erro ? (m.limite?'Limite atingido':'Não foi possível concluir') : m.text ? (m.activities?.length?'Ferramentas executadas e resposta concluída':'Resposta concluída') : m.fase==='analisando' ? 'Analisando pedido e escolhendo ferramentas' : m.fase==='conectando' ? 'Conectando ao provedor' : 'Aguardando resposta';
    const titulo=resposta.querySelector(':scope > strong');
    if(titulo)titulo.after(estado);else resposta.prepend(estado);
    if(m.erro) {
      const recuperar=document.createElement('button');
      recuperar.type='button';recuperar.textContent='Recuperar mensagem';
      recuperar.addEventListener('click',()=>recuperarPedidoIa(i));
      resposta.append(recuperar);
    }
  });
}

function recuperarPedidoIa(i) {
  const mensagem=mensagensIa[i];
  if(!mensagem?.erro || requisicaoIa) return;
  const input=document.getElementById('chat-pedido');
  if(input.value.trim() && input.value.trim()!==mensagem.pedido) {
    document.getElementById('chat-status').textContent='Há uma mensagem em edição. Envie ou apague esse texto antes de recuperar a anterior.';
    input.focus();return;
  }
  input.value=mensagem.pedido;input.focus();
  document.getElementById('chat-status').textContent='Mensagem recuperada. Confira o texto e o anexo antes de enviar novamente.';
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
  const mensagem = {pedido,anexo:!!xml,fase:'conectando'}; mensagensIa.push(mensagem);
  input.value = '';
  document.getElementById('chat-enviar').disabled = true;
  document.getElementById('chat-enviar').textContent = 'Conectando…';
  document.getElementById('chat-ia-mensagens').setAttribute('aria-busy','true');
  document.getElementById('chat-modo').disabled = true;
  renderChatIa();
  document.getElementById('chat-status').textContent = 'Conectando ao provedor de IA…';
  const timeout = setTimeout(() => controller.abort(),100000);
  try {
    if (location.protocol === 'file:') throw new Error('Abra o projeto com npm run dev para usar a IA.');
    await consultarStatusIa(controller.signal);
    if(versao!==versaoIa)return;
    mensagem.fase='analisando';
    document.getElementById('chat-enviar').textContent = 'Processando…';
    document.getElementById('chat-status').textContent = 'Conexão confirmada. A IA está analisando o pedido e escolhendo as ferramentas necessárias…';
    renderChatIa();
    const response = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:pedido,sessionId:sessaoIa,mascara:document.getElementById('chat-mascara').checked,xml:xml || undefined}),signal:controller.signal});
    const result = await response.json();
    if (!response.ok) {
      mensagem.limite=response.status===429;
      if(response.status===410)sessaoIa=null;
      throw new Error(result.error || 'Não foi possível conversar com a IA.');
    }
    if (versao !== versaoIa) return;
    sessaoIa = result.sessionId;
    Object.assign(mensagem,result);
    mensagem.fase='concluido';
    document.getElementById('chat-anexo').value = '';
    atualizarStatusAnexoIa();
    document.getElementById('chat-status').textContent = 'Resposta concluída.';
  } catch(e) {
    if (versao !== versaoIa) return;
    mensagem.fase='erro';
    mensagem.erro = e.name === 'AbortError' ? 'Pedido interrompido ou tempo limite atingido.' : e.message;
    document.getElementById('chat-status').textContent = mensagem.erro;
  } finally {
    clearTimeout(timeout);
    if (versao === versaoIa) {
      requisicaoIa = null;
      document.getElementById('chat-enviar').disabled = false;
      document.getElementById('chat-enviar').textContent = 'Enviar';
      document.getElementById('chat-ia-mensagens').setAttribute('aria-busy','false');
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
  atualizarStatusAnexoIa();
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
  atualizarStatusAnexoIa(`${tipo.toUpperCase()} atual carregado.`);
}

function atualizarStatusAnexoIa(mensagem) {
  const texto=document.getElementById('chat-anexo').value;
  const bytes=new Blob([texto]).size;
  document.getElementById('chat-anexo-status').textContent=mensagem || (bytes ? `XML anexado: ${bytes.toLocaleString('pt-BR')} bytes de 100 KB.` : 'Nenhum XML anexado.');
  document.getElementById('chat-anexo-limpar').hidden=!texto;
}

function limparAnexoIa() {
  document.getElementById('chat-anexo').value='';
  document.getElementById('chat-anexo-arquivo').value='';
  atualizarStatusAnexoIa('Anexo removido.');
  document.getElementById('chat-anexo').focus();
}

function inicializarAnexoChatIa() {
  const textarea=document.getElementById('chat-anexo');
  const arquivo=document.getElementById('chat-anexo-arquivo');
  textarea.addEventListener('input',()=>atualizarStatusAnexoIa());
  arquivo.addEventListener('change',()=>{
    const file=arquivo.files?.[0];if(!file)return;
    if(!/\.xml$/i.test(file.name)||file.size>100000){arquivo.value='';atualizarStatusAnexoIa(file.size>100000?'O arquivo ultrapassa 100 KB.':'Selecione um arquivo com extensão .xml.');return;}
    const leitor=new FileReader();
    leitor.onload=()=>{textarea.value=String(leitor.result);atualizarStatusAnexoIa(`Arquivo ${file.name} anexado.`);};
    leitor.onerror=()=>atualizarStatusAnexoIa('Não foi possível ler o arquivo.');
    leitor.readAsText(file,'UTF-8');
  });
  atualizarStatusAnexoIa();
}
