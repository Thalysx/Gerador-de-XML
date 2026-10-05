// ══════════════════════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════════════════════
function switchTab(tab, btn) {
  const panelId = 'tab-' + tab;
  const selectedBtn = btn || document.querySelector(`.tab-btn[aria-controls="${panelId}"]`);
  const panelWasActive = document.getElementById(panelId)?.classList.contains('active');

  document.querySelectorAll('.tab-btn').forEach(b => {
    const selected = b === selectedBtn;
    b.classList.toggle('active', selected);
    b.setAttribute('aria-selected', String(selected));
    b.tabIndex = selected ? 0 : -1;
  });

  document.querySelectorAll('.tab-panel').forEach(p => {
    const selected = p.id === panelId;
    p.classList.toggle('active', selected);
    p.hidden = !selected;
  });
  if (!panelWasActive) {
    const scrollRoot = document.scrollingElement || document.documentElement;
    scrollRoot.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  atualizarCabecalhoLayout();
  if (window.matchMedia?.('(max-width: 700px)').matches) {
    definirSidebar(true, false);
    document.getElementById(panelId).focus({preventScroll:true});
  }
}

function initializeTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn[role="tab"]'));
  tabs.forEach((tabBtn) => {
    tabBtn.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;

      event.preventDefault();
      const availableTabs=tabs.filter(tab=>!tab.hidden);
      const index=availableTabs.indexOf(tabBtn);
      let nextIndex = index;
      if (key === 'ArrowRight' || key === 'ArrowDown') nextIndex = (index + 1) % availableTabs.length;
      if (key === 'ArrowLeft' || key === 'ArrowUp') nextIndex = (index - 1 + availableTabs.length) % availableTabs.length;
      if (key === 'Home') nextIndex = 0;
      if (key === 'End') nextIndex = availableTabs.length - 1;

      const nextTab = availableTabs[nextIndex];
      const targetPanel = nextTab.getAttribute('aria-controls') || '';
      switchTab(targetPanel.replace('tab-', ''), nextTab);
      nextTab.focus();
    });
  });
}

function initializeBootstrapUi() {
  if (!window.bootstrap?.Tooltip) return;
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    new bootstrap.Tooltip(el, { trigger: 'hover focus' });
  });
}

// ══════════════════════════════════════════════════════════
//  TEMA
// ══════════════════════════════════════════════════════════
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('theme-btn');
  body.classList.toggle('dark');
  body.setAttribute('data-bs-theme', body.classList.contains('dark') ? 'dark' : 'light');
  if (body.classList.contains('dark')) {
    btn.innerHTML = `<i data-lucide="sun" aria-hidden="true"></i> Tema claro`;
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Alternar para tema claro');
  } else {
    btn.innerHTML = `<i data-lucide="moon" aria-hidden="true"></i> Tema escuro`;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Alternar para tema escuro');
  }
  renderLucideIcons(btn);
  const themeColor=document.getElementById('theme-color');
  if(themeColor)themeColor.content=getComputedStyle(body).getPropertyValue('--sidebar').trim() || '#0d131d';
  storageSet('gerador:tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Registry metadata owns order, labels, groups, descriptions and environment availability.
const listaNavegacao=document.querySelector('.tab-nav');
for(const nome of [...new Set(APP_NAVIGATION.map(item=>item.group))]) {
  const label=document.createElement('div');
  label.className='nav-section-label';label.textContent=nome;
  label.dataset.navigationGroup=nome;
  label.setAttribute('aria-hidden','true');
  listaNavegacao.append(label);
  for(const item of APP_NAVIGATION.filter(item=>item.group===nome))listaNavegacao.append(document.getElementById('tab-btn-'+item.id));
}

function renderEnvironmentNavigation(environmentId=activeEnvironmentId()) {
  for(const item of APP_NAVIGATION) {
    const tab=document.getElementById('tab-btn-'+item.id);
    tab.hidden=!navigationSupportsEnvironment(item,environmentId);
  }
  for(const label of listaNavegacao.querySelectorAll('[data-navigation-group]')) {
    label.hidden=!APP_NAVIGATION.some(item=>item.group===label.dataset.navigationGroup&&navigationSupportsEnvironment(item,environmentId));
  }
  const active=document.querySelector('.tab-btn[aria-selected="true"]');
  if(active?.hidden)switchTab('home',document.getElementById('tab-btn-home'));
}

function definirAmbiente(id, persist = true, announce = true) {
  const environmentId = APP_ENVIRONMENTS[id] ? id : 'general';
  const environment = APP_ENVIRONMENTS[environmentId];
  document.body.dataset.environment = environmentId;
  const brandMark=document.getElementById('sidebar-brand-mark');
  if(brandMark)brandMark.src=environment.brandMark;
  const themeColor=document.getElementById('theme-color');
  if(themeColor)themeColor.content=getComputedStyle(document.body).getPropertyValue('--sidebar').trim() || (document.body.classList.contains('dark') ? '#0d131d' : '#f0f2f5');
  renderEnvironmentNavigation(environmentId);
  document.querySelectorAll('.environment-option[data-environment]').forEach(button => {
    const selected = button.dataset.environment === environmentId;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.getElementById('active-environment-label').textContent = environment.label;
  document.getElementById('sidebar-environment-summary').lastChild.textContent = ` ${environment.summary}`;
  if (persist) storageSet('futureg:environment', environmentId);
  if (announce) {
    document.getElementById('app-status-live').textContent = `Ambiente alterado para ${environment.label}.`;
    window.dispatchEvent(new CustomEvent('futureg:environmentchange', { detail: { id: environmentId, ...environment } }));
  }
  return environmentId;
}

document.querySelectorAll('.environment-option[data-environment]').forEach(button => {
  button.addEventListener('click', () => definirAmbiente(button.dataset.environment));
});
definirAmbiente(storageGet('futureg:environment', 'general'), false, false);

function atualizarCabecalhoLayout() {
  if (!window.document?.documentElement) return;
  const tab=document.querySelector('.tab-btn[aria-selected="true"]');
  const chave=tab?.getAttribute('aria-controls')?.replace('tab-','');
  const item=navigationById(chave);
  if (!item) return;
  document.getElementById('app-title').textContent=item.label;
  document.querySelector('.page-header-text p').textContent=item.description;
}
document.querySelectorAll('.tab-btn').forEach(tab=>{
  const item=navigationById(tab.id.replace('tab-btn-',''));
  const rotulo=item.label;
  tab.setAttribute('aria-label',rotulo); tab.title=rotulo;
  tab.dataset.tooltip=rotulo;
  const texto=document.createElement('span'); texto.textContent=rotulo;
  tab.replaceChildren();
  tab.insertAdjacentHTML('beforeend',`<i data-lucide="${item.icon}" aria-hidden="true"></i>`);
  tab.append(texto);
});
atualizarCabecalhoLayout();


// Shell: one state, one reachable control in every viewport.
function definirSidebar(collapsed, persist = true) {
  document.body.classList.toggle('sidebar-collapsed', collapsed);
  const button = document.getElementById('sidebar-collapse-btn');
  const label = collapsed ? 'Expandir navegação' : 'Recolher navegação';
  button.setAttribute('aria-expanded', String(!collapsed));
  button.setAttribute('aria-label', label);
  button.dataset.tooltip = label;
  button.innerHTML = `<i data-lucide="${collapsed ? 'panel-left-open' : 'panel-left-close'}" aria-hidden="true"></i>`;
  renderLucideIcons(button);
  document.querySelectorAll('.workspace-nav [data-tooltip]').forEach(elemento => {
    if (collapsed) elemento.title = elemento.dataset.tooltip;
    else elemento.removeAttribute('title');
  });
  if (persist) storageSet('thegenerator:sidebar-collapsed', collapsed);
}
definirSidebar(storageGet('thegenerator:sidebar-collapsed', window.matchMedia?.('(max-width: 700px)').matches || false) === true, false);
document.getElementById('sidebar-collapse-btn').addEventListener('click', () => definirSidebar(!document.body.classList.contains('sidebar-collapsed')));
document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && !document.body.classList.contains('sidebar-collapsed')) {
    definirSidebar(true); document.getElementById('sidebar-collapse-btn').focus();
  }
});
