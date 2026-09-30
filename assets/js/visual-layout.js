const seletorFormularioXml=document.getElementById('xml-form-tipo');
function selecionarFormularioXml() {
  const tipo=seletorFormularioXml.value;
  for(const documento of ['nfe','cte'])document.getElementById('xml-form-'+documento).hidden=tipo!==documento;
  document.getElementById('xml-preview-tipo').value=tipo;
  atualizarPreviaXml();
}
seletorFormularioXml.addEventListener('change',selecionarFormularioXml);

function definirOpcaoUnica(selectId,value,label) {
  const select=document.getElementById(selectId);
  if(!select)return;
  const option=document.createElement('option');
  option.value=value;option.textContent=label;
  select.replaceChildren(option);
  select.value=value;
}

function atualizarInterfacePorAmbiente() {
  const general=activeEnvironmentId()==='general';
  const tipo=general?'nfe':'cte';
  const nome=general?'NF-e':'CT-e';
  definirOpcaoUnica('xml-form-tipo',tipo,general?'NF-e — Nota fiscal':'CT-e — Conhecimento de transporte');
  definirOpcaoUnica('xml-preview-tipo',tipo,nome);
  definirOpcaoUnica('validacao-gerado-tipo',tipo,nome);
  definirOpcaoUnica('validacao-negativa-tipo',tipo,nome);
  definirOpcaoUnica('chat-anexo-tipo',tipo,`${nome} atual`);
  document.getElementById('xml-form-help').textContent=`Este ambiente trabalha somente com ${nome}.`;
  document.getElementById('xml-preview-title').textContent=`${nome} gerada`;
  document.getElementById('docs-search').placeholder=general?'Ex.: CPF, CNPJ, e-mail ou UUID':'Ex.: contêiner, lacre, booking ou IMO';
  document.getElementById('validate-input').placeholder=general?'CPF, RG, CNH, CNPJ, RENAVAM ou placa...':'Contêiner ou IMO...';
  document.getElementById('docs-environment-note').textContent=general
    ? 'Os dados são sintéticos e não representam registros oficiais.'
    : 'Booking e DU-E são referências fictícias. Os dados não representam registros oficiais.';
  document.getElementById('ncm-manual-help').textContent=general
    ? 'Adicione códigos de 8 dígitos separados por espaço, vírgula ou linha. Ao aplicar, eles seguem a ordem dos produtos atuais.'
    : 'Adicione códigos de 8 dígitos para usar nos geradores de carga do QA Portuário.';
  document.getElementById('ncm-manual-aplicar').hidden=!general;
  selecionarFormularioXml();
  if (typeof xmlsGerados !== 'undefined' && Object.keys(xmlsGerados).length) gerarXMLComCampos();
}
window.addEventListener('futureg:environmentchange',atualizarInterfacePorAmbiente);
atualizarInterfacePorAmbiente();

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
    if(secao) secao.hidden=visiveis===0;
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
