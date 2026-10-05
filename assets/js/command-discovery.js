function botoesComandosChat(comandos) {
  return comandos.map(c=>{
    const botao=document.createElement('button');botao.type='button';botao.textContent=c.texto;
    botao.addEventListener('click',()=>sugerirChat(c.texto));return botao;
  });
}
function renderCatalogoChat() {
  const busca=normalizarComando(document.getElementById('chat-catalogo-busca').value);
  const lista=catalogoComandos().filter(c=>normalizarComando(`${c.texto} ${c.rotulo} ${c.categoria}`).includes(busca));
  const area=document.getElementById('chat-catalogo-lista');area.replaceChildren();
  for(const categoria of [...new Set(lista.map(c=>c.categoria))]) {
    const grupo=document.createElement('section'),titulo=document.createElement('h3'),acoes=document.createElement('div');
    titulo.textContent=categoria;acoes.className='chat-catalogo-acoes';
    acoes.append(...botoesComandosChat(lista.filter(c=>c.categoria===categoria)));
    grupo.append(titulo,acoes);area.append(grupo);
  }
  if(!lista.length)area.textContent='Nenhum comando encontrado. Tente outro nome ou troque o ambiente.';
}
function abrirCatalogoChat() {
  document.querySelector('.chat-secondary').open=true;
  document.getElementById('chat-catalogo').open=true;
  document.getElementById('chat-catalogo-busca').focus();
}
function atualizarSugestoesComando() {
  const termo=normalizarComando(document.getElementById('chat-pedido').value),area=document.getElementById('chat-completar');
  const pesquisa=termo.replace(/^(gerar|gere|criar|crie)\s+/,'').replace(/^\d+\s+/,'');
  const comandos=termo&&pesquisa?catalogoComandos().filter(c=>normalizarComando(`${c.texto} ${c.rotulo}`).includes(pesquisa)).slice(0,4):[];
  area.replaceChildren(...botoesComandosChat(comandos));area.hidden=!comandos.length;
}
const favoritosChatTemporarios=new Map();
function chaveFavoritosChat(ambiente=activeEnvironmentId()) { return `futureg:comandos-favoritos:${ambiente}`; }
function favoritosComandosChat(ambiente=activeEnvironmentId()) {
  const chave=chaveFavoritosChat(ambiente),valores=favoritosChatTemporarios.get(chave)||storageGet(chave,[]);
  return Array.isArray(valores)?[...new Set(valores.filter(v=>{
    if(typeof v!=='string'||!v.trim()||v.length>500)return false;
    try { const c=interpretarComando(v);return c.acao!=='ajuda'&&c.acao!=='repetir'; } catch{return false;}
  }))].slice(0,10):[];
}
function salvarFavoritosChat(ambiente,textos) {
  const chave=chaveFavoritosChat(ambiente),persistiu=storageSet(chave,textos);
  if(persistiu)favoritosChatTemporarios.delete(chave);else favoritosChatTemporarios.set(chave,textos);
  return persistiu;
}
function favoritarComandoChat(idx) {
  const c=conversasChat[idx];if(!c?.comando)return;
  const favoritos=favoritosComandosChat(c.ambiente);
  if(!favoritos.includes(c.comando)) {
    if(favoritos.length>=10){document.getElementById('chat-status').textContent='Limite de 10 favoritos por ambiente. Remova um favorito antes de adicionar outro.';return;}
    const persistiu=salvarFavoritosChat(c.ambiente,[...favoritos,c.comando]);
    document.getElementById('chat-status').textContent=persistiu?'Comando salvo nos favoritos deste ambiente.':'Favorito disponível nesta aba. O armazenamento do navegador está indisponível.';
  } else {
    document.getElementById('chat-status').textContent='Este comando já está nos favoritos deste ambiente.';
  }
  renderFavoritosChat();
}
function removerFavoritoChat(texto) {
  salvarFavoritosChat(activeEnvironmentId(),favoritosComandosChat().filter(t=>t!==texto));renderFavoritosChat();
}
function renderFavoritosChat() {
  const area=document.getElementById('chat-favoritos-lista'),favoritos=favoritosComandosChat();
  area.replaceChildren();
  for(const texto of favoritos) {
    const linha=document.createElement('div');linha.className='chat-favorito';
    const usar=botoesComandosChat([{texto}])[0],remover=document.createElement('button');
    remover.type='button';remover.textContent='Remover';remover.setAttribute('aria-label',`Remover favorito: ${texto}`);
    remover.addEventListener('click',()=>removerFavoritoChat(texto));linha.append(usar,remover);area.append(linha);
  }
  if(!favoritos.length)area.textContent='Favoritos vazios. Após executar um comando, use Favoritar comando no resultado.';
}
