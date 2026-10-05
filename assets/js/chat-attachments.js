let anexoChatNome='';
let versaoAnexoChat=0;
function atualizarStatusAnexoChat(mensagem,nome) {
  const texto=document.getElementById('chat-anexo').value,bytes=new Blob([texto]).size;
  if(nome)anexoChatNome=nome;if(!texto)anexoChatNome='';
  document.getElementById('chat-anexo-status').textContent=mensagem||(bytes>100000?'O anexo ultrapassa 100 KB. Reduza o conteúdo.':bytes?`XML disponível para comandos locais: ${bytes.toLocaleString('pt-BR')} bytes de 100 KB.`:'Nenhum anexo pendente.');
  document.getElementById('chat-anexo-pendente').hidden=!texto;
  document.getElementById('chat-anexo-limpar').hidden=!texto;
  if(texto)document.getElementById('chat-anexo-nome').textContent=`${anexoChatNome||'XML colado'} · ${bytes.toLocaleString('pt-BR')} bytes`;
}
function limparAnexoChat(focar=true) {
  ++versaoAnexoChat;anexoChatNome='';document.getElementById('chat-anexo').value='';document.getElementById('chat-anexo-arquivo').value='';
  atualizarStatusAnexoChat('Anexo removido.');if(focar)document.querySelector('#chat-anexo-area > summary').focus();
}
function anexarXmlAtualChat() {
  ++versaoAnexoChat;gerarXMLComCampos();
  const tipo=document.getElementById('chat-anexo-tipo').value;
  document.getElementById('chat-anexo').value=serializarXml(xmlsGerados[tipo]);
  atualizarStatusAnexoChat('',`${tipo.toUpperCase()} atual`);document.getElementById('chat-anexo-area').open=false;
}
function inicializarAnexoChat() {
  const texto=document.getElementById('chat-anexo'),arquivo=document.getElementById('chat-anexo-arquivo');
  texto.addEventListener('input',()=>{++versaoAnexoChat;anexoChatNome=texto.value?'XML colado':'';atualizarStatusAnexoChat();});
  arquivo.addEventListener('change',()=>{
    const file=arquivo.files?.[0],versao=++versaoAnexoChat;if(!file)return;
    if(!/\.xml$/i.test(file.name)||file.size>100000){arquivo.value='';atualizarStatusAnexoChat(file.size>100000?'O arquivo ultrapassa 100 KB.':'Selecione um arquivo com extensão .xml.');return;}
    const leitor=new FileReader();
    leitor.onload=()=>{
      if(versao!==versaoAnexoChat)return;
      const conteudo=String(leitor.result);
      if(new Blob([conteudo]).size>100000){atualizarStatusAnexoChat('O arquivo ultrapassa 100 KB após leitura.');return;}
      texto.value=conteudo;atualizarStatusAnexoChat('',file.name);document.getElementById('chat-anexo-area').open=false;
    };
    leitor.onerror=()=>{if(versao===versaoAnexoChat)atualizarStatusAnexoChat('Não foi possível ler o arquivo. Selecione-o novamente.');};
    leitor.readAsText(file,'UTF-8');
  });
  atualizarStatusAnexoChat();
}
