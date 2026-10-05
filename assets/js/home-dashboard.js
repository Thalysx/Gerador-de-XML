
// Discovery only: execution and results belong to the destination workspace.
let homeCategory='todos';
function renderHomeGenerators() {
  const term=document.getElementById('home-generator-search').value;
  const filtered=generatorsForEnvironment().filter(g=>g.discoverable!==false&&matchesGenerator(g,term,homeCategory));
  const items=!term.trim()&&homeCategory==='todos'?filtered.filter(g=>g.priority):filtered;
  const favorites=readGeneratorIds(FAVORITES_KEY);
  document.getElementById('home-search-status').textContent=items.length?`${items.length} ferramentas · ${term.trim()||homeCategory!=='todos'?'filtro ativo':'acesso rápido'}`:'Nenhum gerador encontrado.';
  document.getElementById('home-generator-grid').innerHTML=items.length?items.map(g=>`<article class="home-generator-card" data-home-card="${g.id}"><button type="button" class="home-card-select" data-home-select="${g.id}" aria-label="${generatorNeedsConfiguration(g)?'Abrir':'Gerar'} ${g.label}">${generatorIcon(g)}<strong>${g.label}</strong><small>${g.description}</small><span>${generatorNeedsConfiguration(g)?'Abrir ferramenta':'Gerar agora'} →</span></button><button type="button" class="home-favorite-btn" data-home-favorite="${g.id}" aria-pressed="${favorites.includes(g.id)}" aria-label="${favorites.includes(g.id)?'Remover':'Adicionar'} ${g.label} ${favorites.includes(g.id)?'dos':'aos'} favoritos"><span aria-hidden="true">${favorites.includes(g.id)?'★':'☆'}</span></button></article>`).join(''):'<p class="home-no-results">Nenhum gerador corresponde à busca. Tente outro nome ou categoria.</p>';
}
function renderHomeContext() {
  for(const [key,target,empty] of [[FAVORITES_KEY,'home-favorites','Use a estrela para fixar suas ferramentas.'],[RECENTS_KEY,'home-recents','As ferramentas usadas aparecerão aqui.']]) {
    const ids=generatorIdsForEnvironment(readGeneratorIds(key));
    document.getElementById(target).innerHTML=ids.length?ids.map(id=>`<button type="button" class="home-context-chip" data-home-select="${id}">${generatorById(id).label}</button>`).join(''):`<p class="home-empty-inline">${empty}</p>`;
  }
}
function renderHomeCategories() {
  const categories=generatorCategoriesForEnvironment();
  if(homeCategory!=='todos'&&!categories[homeCategory])homeCategory='todos';
  document.getElementById('home-category-chips').innerHTML=[['todos','Todos'],...Object.entries(categories)].map(([id,label])=>`<button type="button" class="home-filter-chip" data-home-category="${id}" aria-pressed="${id===homeCategory}">${label}</button>`).join('');
}
document.getElementById('tab-home').addEventListener('click',event=>{
  const favorite=event.target.closest('[data-home-favorite]');
  const select=event.target.closest('[data-home-select]');
  const category=event.target.closest('[data-home-category]');
  if(favorite){
    const id=favorite.dataset.homeFavorite,ids=readGeneratorIds(FAVORITES_KEY),exists=ids.includes(id);
    storageSet(FAVORITES_KEY,exists?ids.filter(value=>value!==id):[id,...ids].slice(0,8));
    renderHomeGenerators();renderHomeContext();
    if(typeof renderProductivityDashboard==='function')renderProductivityDashboard();
    document.querySelector(`[data-home-favorite="${id}"]`)?.focus();
    mostrarStatus(`${generatorById(id).label} ${exists?'removido dos':'adicionado aos'} favoritos.`);
  } else if(select)activateGenerator(select.dataset.homeSelect);
  else if(category){homeCategory=category.dataset.homeCategory;renderHomeCategories();renderHomeGenerators();document.querySelector(`[data-home-category="${homeCategory}"]`).focus();}
});
document.getElementById('home-generator-search').addEventListener('input',renderHomeGenerators);
document.addEventListener('generator-used',renderHomeContext);
window.addEventListener('futureg:environmentchange',()=>{renderHomeCategories();renderHomeGenerators();renderHomeContext();});
document.getElementById('clear-home-personalization').addEventListener('click',()=>{
  storageSet(FAVORITES_KEY,[]);storageSet(RECENTS_KEY,[]);renderHomeGenerators();renderHomeContext();
  if(typeof renderProductivityDashboard==='function')renderProductivityDashboard();
  document.getElementById('settings-status').textContent='Favoritos e recentes foram limpos.';
  mostrarStatus('Personalização da página inicial limpa.');
});
document.addEventListener('click',event=>{const settings=document.querySelector('.app-settings');if(settings.open&&!settings.contains(event.target)&&!event.target.closest('[data-open-privacy]'))settings.open=false;});
document.addEventListener('keydown',event=>{
  if(event.key==='/'&&document.getElementById('tab-home').classList.contains('active')&&!event.target.matches?.('input,textarea,select,[contenteditable="true"]')){event.preventDefault();document.getElementById('home-generator-search').focus();}
  if(event.key==='Escape')document.querySelector('.app-settings').open=false;
});
renderHomeCategories();renderHomeGenerators();renderHomeContext();
