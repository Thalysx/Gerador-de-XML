// Configuration owns selection; domain functions retain the generated value and history.
let selectedGeneratorId = null;
function openGenerator(id) {
  const item=generatorById(id);
  if(!item){mostrarStatus('Esta ferramenta não está disponível. Escolha outra opção.','error');return false;}
  if(!generatorSupportsEnvironment(item)){mostrarStatus(`${item.label} não está disponível em ${APP_ENVIRONMENTS[activeEnvironmentId()].label}.`,'error');return false;}
  switchTab(item.tool);
  if(item.tool==='docs') {
    const selectedId=item.variantOf||id;
    const selectedItem=generatorById(selectedId);
    selectedGeneratorId=selectedId;
    if(selectedId==='placa')document.getElementById('gerador-placa-tipo').value=id==='placa-antiga'?'antiga':'mercosul';
    document.getElementById('docs-selected-title').textContent=selectedItem.label;
    document.getElementById('docs-selected-description').textContent=selectedItem.description;
    const generateButton=document.getElementById('docs-generate-btn');
    const needsConfiguration=generatorNeedsConfiguration(selectedItem);
    generateButton.hidden=!needsConfiguration||!!item.batchOnly;
    generateButton.disabled=!!item.batchOnly;
    generateButton.childNodes[0].textContent=`Gerar ${selectedItem.label} `;
    atualizarOpcoesDocumento(selectedItem.domainType,document.getElementById('lote-tipo').value);
    document.querySelectorAll('[data-generator-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.generatorId===selectedId)));
    if(item.batchOnly){document.querySelector('.docs-batch').open=true;document.getElementById('lote-tipo').value=id;}
    document.getElementById('docs-selected-title').focus();
  } else if(item.tool==='xml') {
    const type=document.getElementById('xml-form-tipo');type.value=id;type.dispatchEvent(new Event('change'));
    type.focus();
  } else document.getElementById('tab-'+item.tool).focus();
  return true;
}
function activateGenerator(id) {
  const item=generatorById(id);
  if(!openGenerator(id))return false;
  if(item.tool==='docs'&&item.run&&!generatorNeedsConfiguration(item))generateSelectedDocument();
  return true;
}
function generateSelectedDocument() {
  const item=generatorById(selectedGeneratorId);
  if(!item?.run)return;
  const button=document.getElementById('docs-generate-btn');
  button.disabled=true;
  const result=document.getElementById('docs-output-box');result.setAttribute('aria-busy','true');
  try {
    item.run();
    document.getElementById('output-val').focus({preventScroll:true});
    rolarParaElemento(document.getElementById('output-val'));
  } catch(error) {mostrarStatus('Não foi possível gerar. Confira as opções e tente novamente.','error');}
  finally {button.disabled=false;result.setAttribute('aria-busy','false');}
}
function clearDocumentResult() {
  currentType='';currentValue='';nomeAtualDoc='';
  if(typeof limparCrachaAtual==='function')limparCrachaAtual();
  document.getElementById('docs-result-label').textContent='Resultado';
  esconderPlaca();esconderConteiner();document.getElementById('nome-box').classList.remove('visible');
  const output=document.getElementById('output-val');output.textContent='Escolha um gerador. Opções simples geram o resultado imediatamente.';output.classList.add('placeholder');
  for(const id of ['new-doc-btn','copy-btn','download-doc-btn','docs-expand-btn','docs-clear-btn'])document.getElementById(id).disabled=true;
  document.getElementById('docs-result-details').hidden=true;
  document.getElementById('docs-result-details').textContent='';
  document.getElementById('docs-expand-btn').setAttribute('aria-expanded','false');
  const generateButton=document.getElementById('docs-generate-btn');
  const selectedButton=document.querySelector(`[data-generator-id="${selectedGeneratorId}"]`);
  (generateButton.hidden?selectedButton||document.getElementById('docs-search'):generateButton).focus();
}
function toggleDocumentDetails() {
  const details=document.getElementById('docs-result-details'),button=document.getElementById('docs-expand-btn');
  const open=details.hidden;
  details.textContent=currentType==='cracha'&&typeof formatarCrachaTexto==='function'
    ? formatarCrachaTexto(crachaAtual)
    : [getNomeDocsAtual(),document.getElementById('output-val').textContent].filter(Boolean).join('\n');
  details.hidden=!open;button.setAttribute('aria-expanded',String(open));button.textContent=open?'Ocultar detalhes':'Ver detalhes';
}
function renderDocumentGenerators() {
  const list=document.getElementById('docs-generator-list');
  const category=document.getElementById('docs-category');
  const previousCategory=category.value;
  const categories=generatorCategoriesForEnvironment(activeEnvironmentId(),'docs');
  category.innerHTML='<option value="todas">Todas as categorias</option>'+Object.entries(categories).map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
  category.value=categories[previousCategory]?previousCategory:'todas';
  const available=generatorsForEnvironment().filter(g=>g.route==='docs'&&g.discoverable!==false);
  list.innerHTML=Object.entries(categories).map(([category,label])=>{
    const items=available.filter(g=>g.category===category);
    return `<section class="docs-generator-group" aria-labelledby="docs-group-${category}"><div class="docs-generator-heading"><span class="section-label" id="docs-group-${category}">${label}</span><span class="group-count">${items.length}</span></div><div class="btn-grid" role="group" aria-label="${label}">${items.map(g=>`<button type="button" data-generator-id="${g.id}" data-category="${g.category}" data-direct-generation="${!generatorNeedsConfiguration(g)}" aria-pressed="false" aria-label="${generatorNeedsConfiguration(g)?'Configurar':'Gerar'} ${g.label}">${g.label}</button>`).join('')}</div></section>`;
  }).join('');
}
renderDocumentGenerators();
document.getElementById('docs-generator-list').addEventListener('click',event=>{const b=event.target.closest('[data-generator-id]');if(b)activateGenerator(b.dataset.generatorId);});
window.addEventListener('futureg:environmentchange',()=>{
  const selected=generatorById(selectedGeneratorId);
  renderDocumentGenerators();
  if(typeof filtrarGeradores==='function')filtrarGeradores();
  if(selected&&!generatorSupportsEnvironment(selected)) {
    selectedGeneratorId=null;
    document.getElementById('docs-selected-title').textContent='Escolha um gerador';
    document.getElementById('docs-selected-description').textContent='Selecione uma ferramenta abaixo para configurar.';
    document.getElementById('docs-generate-btn').disabled=true;
    document.getElementById('docs-generate-btn').hidden=true;
    atualizarOpcoesDocumento('',document.getElementById('lote-tipo').value);
    switchTab('home',document.getElementById('tab-btn-home'));
  }
});
document.getElementById('docs-generate-btn').addEventListener('click',generateSelectedDocument);
document.getElementById('docs-clear-btn').addEventListener('click',clearDocumentResult);
document.getElementById('docs-expand-btn').addEventListener('click',toggleDocumentDetails);
function updateBatchIndicator() {
  const quantity=Number(document.getElementById('lote-quantidade').value);
  const item=generatorById(document.getElementById('lote-tipo').value);
  if(quantity&&item)document.getElementById('lote-status').textContent=`${quantity} registros serão gerados · ${item.label}.`;
}
document.getElementById('lote-quantidade').addEventListener('input',updateBatchIndicator);
document.getElementById('lote-tipo').addEventListener('change',updateBatchIndicator);
document.addEventListener('keydown',event=>{if(event.ctrlKey&&event.key==='Enter'&&document.getElementById('tab-docs').classList.contains('active')){event.preventDefault();generateSelectedDocument();}});
