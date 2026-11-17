let anexoChatNome='';
let versaoAnexoChat=0;
function atualizarStatusAnexoChat(mensagem,nome) {
  const texto=document.getElementById('chat-anexo').value,bytes=new Blob([texto]).size;
  if(nome)anexoChatNome=nome;if(!texto)anexoChatNome='';
  document.getElementById('chat-anexo-status').textContent=mensagem||(bytes>100000?'O anexo ultrapassa 100 KB. Reduza o conteúdo.':bytes?`XML disponível para comandos locais: ${bytes.toLocaleString('pt-BR')} bytes de 100 KB.`:'');
  document.getElementById('chat-anexo-pendente').hidden=!texto;
  document.getElementById('chat-anexo-limpar').hidden=!texto;
  if(texto)document.getElementById('chat-anexo-nome').textContent=`${anexoChatNome||'XML colado'} · ${bytes.toLocaleString('pt-BR')} bytes`;
}
function limparAnexoChat(focar=true) {
  ++versaoAnexoChat;anexoChatNome='';document.getElementById('chat-anexo').value='';document.getElementById('chat-anexo-arquivo').value='';
  atualizarStatusAnexoChat('Anexo removido.');if(focar)document.querySelector('#chat-anexo-area > summary').focus();
}
function alternarColagemAnexoChat(abrir, focar=true) {
  document.getElementById('chat-anexo-opcoes').hidden=abrir;
  document.getElementById('chat-anexo-colagem').hidden=!abrir;
  if(focar)(abrir?document.getElementById('chat-anexo'):document.querySelector('[data-chat-anexo-colar]')).focus();
}
function fecharMenuAnexoChat() {
  document.getElementById('chat-anexo-area').open=false;
  document.getElementById('chat-pedido').focus({preventScroll:true});
}
function confirmarColagemAnexoChat() {
  const texto=document.getElementById('chat-anexo');
  if(!texto.value.trim()||new Blob([texto.value]).size>100000){
    atualizarStatusAnexoChat(texto.value.trim()?'O anexo ultrapassa 100 KB. Reduza o conteúdo.':'Cole o conteúdo XML antes de continuar.');
    texto.focus();return;
  }
  atualizarStatusAnexoChat();fecharMenuAnexoChat();
}
function anexarXmlAtualChat(tipoAtual) {
  ++versaoAnexoChat;gerarXMLComCampos();
  if(tipoAtual)document.getElementById('chat-anexo-tipo').value=tipoAtual;
  const tipo=document.getElementById('chat-anexo-tipo').value;
  document.getElementById('chat-anexo').value=serializarXml(xmlsGerados[tipo]);
  atualizarStatusAnexoChat('',`${tipo.toUpperCase()} atual`);fecharMenuAnexoChat();
}
function inicializarAnexoChat() {
  const texto=document.getElementById('chat-anexo'),arquivo=document.getElementById('chat-anexo-arquivo');
  const menu=document.getElementById('chat-anexo-area'),opcoes=document.getElementById('chat-anexo-opcoes');
  menu.addEventListener('toggle',()=>{if(window.document&&!menu.open)alternarColagemAnexoChat(false,false);});
  menu.addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key)||!opcoes.contains(event.target)&&event.target!==menu.querySelector('summary'))return;
    event.preventDefault();menu.open=true;
    const itens=[...opcoes.querySelectorAll('[role="menuitem"]')],atual=itens.indexOf(document.activeElement);
    const index=event.key==='Home'?0:event.key==='End'?itens.length-1:event.key==='ArrowUp'?(atual<=0?itens.length-1:atual-1):(atual+1)%itens.length;
    itens[index].focus();
  });
  texto.addEventListener('input',()=>{++versaoAnexoChat;anexoChatNome=texto.value?'XML colado':'';atualizarStatusAnexoChat();});
  arquivo.addEventListener('change',()=>{
    const file=arquivo.files?.[0],versao=++versaoAnexoChat;if(!file)return;
    if(!/\.xml$/i.test(file.name)||file.size>100000){arquivo.value='';atualizarStatusAnexoChat(file.size>100000?'O arquivo ultrapassa 100 KB.':'Selecione um arquivo com extensão .xml.');return;}
    const leitor=new FileReader();
    leitor.onload=()=>{
      if(versao!==versaoAnexoChat)return;
      const conteudo=String(leitor.result);
      if(new Blob([conteudo]).size>100000){atualizarStatusAnexoChat('O arquivo ultrapassa 100 KB após leitura.');return;}
      texto.value=conteudo;atualizarStatusAnexoChat('',file.name);fecharMenuAnexoChat();
    };
    leitor.onerror=()=>{if(versao===versaoAnexoChat)atualizarStatusAnexoChat('Não foi possível ler o arquivo. Selecione-o novamente.');};
    leitor.readAsText(file,'UTF-8');
  });
  atualizarStatusAnexoChat();
}
