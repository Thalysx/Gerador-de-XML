// Configuration owns selection; domain functions retain the generated value and history.
let selectedGeneratorId = null;
function openGenerator(id) {
  const item=generatorById(id);
  if(!item){mostrarStatus('Esta ferramenta não está disponível. Escolha outra opção.','error');return false;}
  switchTab(item.tool);
  if(item.tool==='docs') {
    selectedGeneratorId=id;
    document.getElementById('docs-selected-title').textContent=item.label;
    document.getElementById('docs-selected-description').textContent=item.description;
    document.getElementById('docs-generate-btn').disabled=!!item.batchOnly;
    atualizarOpcoesDocumento(item.domainType,document.getElementById('lote-tipo').value);
    document.querySelectorAll('[data-generator-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.generatorId===id)));
    if(item.batchOnly){document.querySelector('.docs-batch').open=true;document.getElementById('lote-tipo').value=id;}
    document.getElementById('docs-selected-title').focus();
  } else if(item.tool==='xml') {
    const type=document.getElementById('xml-form-tipo');type.value=id;type.dispatchEvent(new Event('change'));
    type.focus();
  } else document.getElementById('tab-'+item.tool).focus();
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
  document.getElementById('docs-result-label').textContent='Resultado';
  esconderPlaca();esconderConteiner();document.getElementById('nome-box').classList.remove('visible');
  const output=document.getElementById('output-val');output.textContent='Configure um gerador e escolha Gerar.';output.classList.add('placeholder');
  for(const id of ['new-doc-btn','copy-btn','download-doc-btn','docs-expand-btn','docs-clear-btn'])document.getElementById(id).disabled=true;
  document.getElementById('docs-result-details').hidden=true;
  document.getElementById('docs-result-details').textContent='';
  document.getElementById('docs-expand-btn').setAttribute('aria-expanded','false');
  document.getElementById('docs-generate-btn').focus();
}
function toggleDocumentDetails() {
  const details=document.getElementById('docs-result-details'),button=document.getElementById('docs-expand-btn');
  const open=details.hidden;
  details.textContent=[getNomeDocsAtual(),document.getElementById('output-val').textContent].filter(Boolean).join('\n');
  details.hidden=!open;button.setAttribute('aria-expanded',String(open));button.textContent=open?'Ocultar detalhes':'Ver detalhes';
}
function renderDocumentGenerators() {
  const list=document.getElementById('docs-generator-list');
  const category=document.getElementById('docs-category');
  category.innerHTML='<option value="todas">Todas as categorias</option>'+Object.entries(GENERATOR_CATEGORIES).filter(([id])=>id!=='xml').map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
  list.innerHTML=Object.entries(GENERATOR_CATEGORIES).filter(([id])=>id!=='xml').map(([category,label])=>{
    const items=GENERATORS.filter(g=>g.tool==='docs'&&g.category===category);
    return `<details class="docs-generator-group" open><summary><span class="section-label">${label}</span><span class="group-count">${items.length}</span></summary><div class="btn-grid" role="group" aria-label="${label}">${items.map(g=>`<button type="button" data-generator-id="${g.id}" data-category="${g.category}" aria-pressed="false">${g.label}</button>`).join('')}</div></details>`;
  }).join('');
  list.addEventListener('click',event=>{const b=event.target.closest('[data-generator-id]');if(b)openGenerator(b.dataset.generatorId);});
}
renderDocumentGenerators();
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
