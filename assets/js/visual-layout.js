const seletorFormularioXml=document.getElementById('xml-form-tipo');
function selecionarFormularioXml() {
  const tipo=seletorFormularioXml.value;
  for(const documento of ['nfe','cte'])document.getElementById('xml-form-'+documento).hidden=tipo!=='ambos'&&tipo!==documento;
  if(tipo!=='ambos') {
    document.getElementById('xml-preview-tipo').value=tipo;
    document.getElementById('xml-preview-title').textContent=`${tipo==='nfe'?'NF-e':'CT-e'} gerada`;
    atualizarPreviaXml();
  } else document.getElementById('xml-preview-title').textContent='XMLs gerados';
}
seletorFormularioXml.addEventListener('change',selecionarFormularioXml);

function atualizarInterfacePorAmbiente() {
  document.getElementById('docs-search').placeholder='Ex.: CPF, CNPJ, contêiner ou transportadora';
  document.getElementById('validate-input').placeholder='CPF, CNPJ, placa, contêiner ou IMO...';
  document.getElementById('docs-environment-note').textContent='Os dados são sintéticos e não representam registros oficiais.';
  document.getElementById('ncm-manual-help').textContent='Adicione códigos de 8 dígitos separados por espaço, vírgula ou linha. Ao aplicar, eles seguem a ordem dos produtos atuais.';
  document.getElementById('ncm-manual-aplicar').hidden=false;
  selecionarFormularioXml();
}
window.addEventListener('futureg:environmentchange',atualizarInterfacePorAmbiente);
atualizarInterfacePorAmbiente();

const buscaGerador=document.getElementById('docs-search');
const categoriaGerador=document.getElementById('docs-category');
const listaGeradores=document.getElementById('docs-generator-list');
// A small starting palette; search and categories always cover the full registry.
const geradoresRapidos=new Set(['cpf','rg','cnpj','cnh','telefone','email','endereco','placa']);
const mostrarTodosGeradores=document.getElementById('docs-show-all');
function filtrarGeradores() {
  const normalizar=valor=>valor.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const termo=normalizar(buscaGerador.value);
  const filtrando=!!termo||categoriaGerador.value!=='todas';
  if(filtrando)document.getElementById('docs-picker').open=true;
  const compacto=!filtrando&&mostrarTodosGeradores.getAttribute('aria-expanded')!=='true';
  listaGeradores.classList.toggle('is-compact',compacto);
  document.getElementById('docs-catalog-title').textContent=compacto?'Acesso rápido':'Todos os geradores';
  mostrarTodosGeradores.hidden=filtrando;
  mostrarTodosGeradores.textContent=compacto?'Ver todos os geradores':'Mostrar acesso rápido';
  document.getElementById('docs-search-clear').hidden=!buscaGerador.value;
  let total=0;
  listaGeradores.querySelectorAll('.btn-grid').forEach(grupo=>{
    let visiveis=0;
    grupo.querySelectorAll('button').forEach(botao=>{
      botao.hidden=!matchesGenerator(generatorById(botao.dataset.generatorId),termo,categoriaGerador.value)||(compacto&&!geradoresRapidos.has(botao.dataset.generatorId));
      if(!botao.hidden)visiveis++;
    });
    const secao=grupo.closest('.docs-generator-group');
    grupo.hidden=visiveis===0;
    if(secao) secao.hidden=visiveis===0;
    total+=visiveis;
  });
  const totalCatalogo=listaGeradores.querySelectorAll('[data-generator-id]').length;
  document.getElementById('docs-search-status').textContent=total?(compacto?`${totalCatalogo} opções disponíveis · ${total} acessos rápidos`:`${total} opções disponíveis.`):'Nenhum gerador encontrado. Tente outro nome ou limpe a busca.';
}
mostrarTodosGeradores.addEventListener('click',()=>{
  mostrarTodosGeradores.setAttribute('aria-expanded',String(mostrarTodosGeradores.getAttribute('aria-expanded')!=='true'));
  filtrarGeradores();
});
buscaGerador.addEventListener('input',filtrarGeradores);
categoriaGerador.addEventListener('change',filtrarGeradores);
document.getElementById('docs-search-clear').addEventListener('click',()=>{buscaGerador.value='';categoriaGerador.value='todas';filtrarGeradores();document.getElementById('docs-picker').open=true;buscaGerador.focus();});
filtrarGeradores();
window.matchMedia?.('(min-width: 1001px)').addEventListener?.('change',event=>{
  if(event.matches)document.getElementById('docs-picker').open=true;
});
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
