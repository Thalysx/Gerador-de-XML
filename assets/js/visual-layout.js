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
      botao.hidden=!matchesGenerator(generatorById(botao.dataset.generatorId),termo,categoriaGerador.value);
      if(!botao.hidden)visiveis++;
    });
    const secao=grupo.closest('.docs-generator-group');
    grupo.hidden=visiveis===0;
    if(secao) {
      secao.hidden=visiveis===0;
      if(termo || categoriaGerador.value!=='todas') secao.open=visiveis>0;
    }
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
