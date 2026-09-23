// Reorder before initializeTabs runs so keyboard order matches the visible menu.
const gruposNavegacao=[['Gerar',['xml','docs','cadastro']],['Trabalhar com XML',['editor','validacao']],['Assistente',['chat']]];
const listaNavegacao=document.querySelector('.tab-nav');
for(const [nome,ferramentas] of gruposNavegacao) {
  const label=document.createElement('div');
  label.className='nav-section-label';label.textContent=nome;
  label.setAttribute('aria-hidden','true');
  listaNavegacao.append(label);
  for(const ferramenta of ferramentas)listaNavegacao.append(document.getElementById('tab-btn-'+ferramenta));
}

// Contexto da ferramenta ativa, sem alterar o funcionamento dos geradores.
const descricoesLayout = {
  xml:['XML fiscal','Prepare NF-e e CT-e de teste e confira os documentos gerados.'],
  docs:['Dados cadastrais','Gere documentos e identificadores, individualmente ou em lote.'],
  cadastro:['Cadastro geral','Monte perfis completos e organize seus dados de teste.'],
  editor:['Editor XML','Importe documentos, ajuste campos e revise as alterações.'],
  chat:['Assistente de geração','Converse sobre dados, gere documentos e explore seus XMLs.'],
  validacao:['Validação XML','Confira a sintaxe e a consistência básica dos documentos.']
};
function atualizarCabecalhoLayout() {
  if (!window.document?.documentElement) return;
  const tab=document.querySelector('.tab-btn[aria-selected="true"]');
  const chave=tab?.getAttribute('aria-controls')?.replace('tab-','');
  const textos=descricoesLayout[chave];
  if (!textos) return;
  document.getElementById('app-title').textContent=textos[0];
  document.querySelector('.page-header-text p').textContent=textos[1];
}
document.querySelectorAll('.tab-btn').forEach(tab=>{
  const rotulo=tab.textContent.trim();
  tab.setAttribute('aria-label',rotulo); tab.title=rotulo;
  const icone=tab.querySelector('i');
  const texto=document.createElement('span'); texto.textContent=rotulo;
  tab.replaceChildren();
  if (icone) tab.append(icone);
  else { const novo=document.createElement('i'); novo.className='bi bi-shield-check'; novo.setAttribute('aria-hidden','true'); tab.append(novo); }
  tab.append(texto);
});
new MutationObserver(atualizarCabecalhoLayout).observe(document.querySelector('.tab-nav'),{subtree:true,attributes:true,attributeFilter:['aria-selected']});
atualizarCabecalhoLayout();

const lerAtalhos=chave=>{
  const valor=storageGet(chave,[]);
  return Array.isArray(valor)?[...new Set(valor.filter(id=>Object.hasOwn(descricoesLayout,id)))]:[];
};
let ferramentasFavoritas=lerAtalhos('gerador:favoritos');
let ferramentasRecentes=lerAtalhos('gerador:recentes');
let ultimaFerramentaVisitada=null;
const ferramentaAtiva=()=>window.document?.querySelector('.tab-btn[aria-selected="true"]')?.getAttribute('aria-controls')?.replace('tab-','');
function renderAtalhos() {
  for(const [id,lista,vazio] of [['favorite-tools',ferramentasFavoritas,'Favorite uma ferramenta para encontrá-la aqui.'],['recent-tools',ferramentasRecentes,'As ferramentas visitadas aparecem aqui.']]) {
    const container=document.getElementById(id);container.replaceChildren();
    if(!lista.length) { const p=document.createElement('p');p.className='texto-apoio';p.textContent=vazio;container.append(p); }
    for(const ferramenta of lista) {
      const button=document.createElement('button');button.type='button';button.textContent=descricoesLayout[ferramenta][0];
      button.addEventListener('click',()=>{switchTab(ferramenta);document.getElementById('tab-'+ferramenta).focus();});
      container.append(button);
    }
  }
  const favorita=ferramentasFavoritas.includes(ferramentaAtiva());
  const button=document.getElementById('favorite-tool');
  button.setAttribute('aria-pressed',String(favorita));
  button.textContent=favorita?'Remover ferramenta dos favoritos':'Favoritar ferramenta atual';
}
function registrarFerramentaVisitada() {
  const atual=ferramentaAtiva();
  if(!atual || atual===ultimaFerramentaVisitada)return;
  ultimaFerramentaVisitada=atual;
  ferramentasRecentes=[atual,...ferramentasRecentes.filter(id=>id!==atual)].slice(0,3);
  storageSet('gerador:recentes',ferramentasRecentes);renderAtalhos();
}
document.getElementById('favorite-tool').addEventListener('click',()=>{
  const atual=ferramentaAtiva();if(!atual)return;
  ferramentasFavoritas=ferramentasFavoritas.includes(atual)?ferramentasFavoritas.filter(id=>id!==atual):[...ferramentasFavoritas,atual];
  const salvo=storageSet('gerador:favoritos',ferramentasFavoritas);
  renderAtalhos();document.getElementById('shortcuts-status').textContent=salvo?'Favoritos atualizados neste navegador.':'Favoritos atualizados nesta sessão. O navegador não permitiu salvar.';
});
new MutationObserver(registrarFerramentaVisitada).observe(listaNavegacao,{subtree:true,attributes:true,attributeFilter:['aria-selected']});
registrarFerramentaVisitada();

const seletorFormularioXml=document.getElementById('xml-form-tipo');
function selecionarFormularioXml() {
  const tipo=seletorFormularioXml.value;
  for(const documento of ['nfe','cte'])document.getElementById('xml-form-'+documento).hidden=tipo!=='ambos'&&tipo!==documento;
  if(tipo!=='ambos') {
    document.getElementById('xml-preview-tipo').value=tipo;
    atualizarPreviaXml();
  }
}
seletorFormularioXml.addEventListener('change',selecionarFormularioXml);
selecionarFormularioXml();

const buscaGerador=document.getElementById('docs-search');
const categoriaGerador=document.getElementById('docs-category');
const listaGeradores=document.getElementById('docs-generator-list');
function filtrarGeradores() {
  const normalizar=valor=>valor.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const termo=normalizar(buscaGerador.value);
  let total=0;
  listaGeradores.querySelectorAll('.btn-grid').forEach(grupo=>{
    let visiveis=0;
    grupo.querySelectorAll('button').forEach(botao=>{
      botao.hidden=!normalizar(botao.textContent).includes(termo)||(categoriaGerador.value!=='todas'&&botao.dataset.category!==categoriaGerador.value);
      if(!botao.hidden)visiveis++;
    });
    grupo.hidden=visiveis===0;
    grupo.previousElementSibling.hidden=visiveis===0;
    total+=visiveis;
  });
  document.getElementById('docs-search-status').textContent=total?`${total} opções disponíveis.`:'Nenhum gerador encontrado. Tente outro nome ou limpe a busca.';
}
buscaGerador.addEventListener('input',filtrarGeradores);
categoriaGerador.addEventListener('change',filtrarGeradores);
document.getElementById('docs-search-clear').addEventListener('click',()=>{buscaGerador.value='';categoriaGerador.value='todas';filtrarGeradores();buscaGerador.focus();});
filtrarGeradores();
document.getElementById('docs-empty-action').addEventListener('click',()=>{
  buscaGerador.focus();
  buscaGerador.scrollIntoView({block:'center',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
});

// Filter rendered entries so restore/copy retain their original history indices.
for(const prefix of ['docs-historico','historico']) {
  const input=document.getElementById(prefix+'-busca');
  const items=document.getElementById(prefix+'-items');
  const status=document.getElementById(prefix+'-busca-status');
  const category=document.getElementById(prefix+'-categoria');
  const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const filter=()=>{
    const term=normalize(input.value);
    const entries=[...items.querySelectorAll('.historico-item')];
    let count=0;
    entries.forEach(entry=>{entry.hidden=!normalize(entry.textContent).includes(term)||(category&&category.value!=='todas'&&entry.dataset.category!==category.value);if(!entry.hidden)count++;});
    status.textContent=term?(count?`${count} de ${entries.length} registros encontrados.`:'Nenhum registro encontrado. Apague a busca para ver todo o histórico.'):`Últimos ${entries.length} registros salvos neste navegador.`;
  };
  input.addEventListener('input',filter);
  category?.addEventListener('change',filter);
  new MutationObserver(filter).observe(items,{childList:true});
  filter();
}

const menuFerramentas=document.getElementById('workspace-navigation');
const botaoMenuFerramentas=document.getElementById('workspace-menu-toggle');
function definirMenuFerramentas(aberto) {
  menuFerramentas.classList.toggle('is-open',aberto);
  botaoMenuFerramentas.setAttribute('aria-expanded',String(aberto));
  botaoMenuFerramentas.querySelector('span').textContent=aberto?'Fechar menu':'Mostrar menu';
}
botaoMenuFerramentas.addEventListener('click',()=>definirMenuFerramentas(botaoMenuFerramentas.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && botaoMenuFerramentas.getAttribute('aria-expanded')==='true') {
    definirMenuFerramentas(false);botaoMenuFerramentas.focus();
  }
});
menuFerramentas.addEventListener('click',event=>{
  const tab=event.target.closest('[role="tab"]');
  if(tab && botaoMenuFerramentas.getAttribute('aria-expanded')==='true') {
    definirMenuFerramentas(false);
    document.getElementById(tab.getAttribute('aria-controls')).focus();
  }
});
