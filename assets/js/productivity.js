// Busca global, painel por ambiente e histórico operacional sem resultados gerados.
const PRODUCTIVITY_ACTIVITY_KEY = 'futureg:activity-v1';
const PRODUCTIVITY_ACTIVITY_LIMIT = 50;
const PRODUCTIVITY_ACTIVITY_KINDS = Object.freeze(['single','xml','batch','export']);
let productivityActivity = [];
let commandPaletteItems = [];
let commandPaletteIndex = 0;
let commandPaletteReturnFocus = null;

function productivityTarget(target) {
  return generatorById(target) || navigationById(target) || null;
}

function normalizeProductivityActivityEntry(entry) {
  if (!entry || !productivityTarget(entry.target)) return null;
  const environment = APP_ENVIRONMENTS[entry.environment] ? entry.environment : null;
  const kind = PRODUCTIVITY_ACTIVITY_KINDS.includes(entry.kind) ? entry.kind : null;
  const timestamp = Number(entry.timestamp);
  const quantity = Math.min(500, Math.max(1, Number(entry.quantity) || 1));
  if (!environment || !kind || !Number.isFinite(timestamp)) return null;
  const target = productivityTarget(entry.target);
  if (!target.environments?.includes(environment)) return null;
  return { target: entry.target, environment, kind, quantity, timestamp };
}

function readProductivityActivity() {
  const saved = storageGet(PRODUCTIVITY_ACTIVITY_KEY, []);
  return Array.isArray(saved)
    ? saved.map(normalizeProductivityActivityEntry).filter(Boolean).slice(0, PRODUCTIVITY_ACTIVITY_LIMIT)
    : [];
}

function recordProductivityActivity(target, options = {}) {
  const item = productivityTarget(target);
  if (!item) return false;
  const environment = item.environments?.includes(activeEnvironmentId()) ? activeEnvironmentId() : item.environments?.[0];
  const inferredKind = generatorById(target)?.route === 'xml' ? 'xml' : 'single';
  const entry = normalizeProductivityActivityEntry({
    target,
    environment,
    kind: options.kind || inferredKind,
    quantity: options.quantity || 1,
    timestamp: Date.now()
  });
  if (!entry) return false;
  productivityActivity = [entry, ...productivityActivity].slice(0, PRODUCTIVITY_ACTIVITY_LIMIT);
  storageSet(PRODUCTIVITY_ACTIVITY_KEY, productivityActivity);
  document.dispatchEvent(new CustomEvent('productivity-activity', { detail: entry }));
  return true;
}

function productivityKindLabel(entry) {
  const labels = {single:'Geração individual',xml:'XML gerado',batch:'Lote gerado',export:'Lote exportado'};
  return `${labels[entry.kind]}${entry.quantity > 1 ? ` · ${entry.quantity} itens` : ''}`;
}

function productivityTime(timestamp) {
  return new Date(timestamp).toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
}

function renderProductivityDashboard() {
  const metrics = document.getElementById('productivity-dashboard-metrics');
  if (!metrics) return;
  const environment = activeEnvironmentId();
  const environmentConfig = APP_ENVIRONMENTS[environment];
  const available = generatorsForEnvironment(environment).filter(item => item.discoverable !== false);
  const favorites = generatorIdsForEnvironment(readGeneratorIds(FAVORITES_KEY), environment);
  const activity = productivityActivity.filter(item => item.environment === environment);
  const specialized = {label:'Lotes recentes',value:activity.filter(item => item.kind === 'batch').length};
  document.getElementById('productivity-dashboard-title').textContent = `Resumo de ${environmentConfig.label}`;
  document.getElementById('productivity-dashboard-description').textContent = environment === 'port'
    ? 'Ferramentas e operações recentes do contexto portuário.'
    : 'Ferramentas e gerações recentes do contexto de dados gerais.';
  metrics.innerHTML = [
    ['Ferramentas disponíveis',available.length],
    ['Favoritos',favorites.length],
    ['Atividades recentes',activity.length],
    [specialized.label,specialized.value]
  ].map(([label,value]) => `<article><strong>${value}</strong><span>${escapeHtml(label)}</span></article>`).join('');
  const recent = activity.slice(0,5);
  document.getElementById('productivity-activity').innerHTML = recent.length
    ? recent.map(entry => {
        const target = productivityTarget(entry.target);
        return `<button type="button" data-productivity-target="${escapeHtml(entry.target)}"><span><strong>${escapeHtml(target.label)}</strong><small>${escapeHtml(productivityKindLabel(entry))}</small></span><time datetime="${new Date(entry.timestamp).toISOString()}">${escapeHtml(productivityTime(entry.timestamp))}</time></button>`;
      }).join('')
    : '<p class="home-empty-inline">As gerações aparecerão aqui sem armazenar o conteúdo produzido.</p>';
  document.getElementById('productivity-activity-clear').disabled = activity.length === 0;
}

function clearProductivityActivityForEnvironment() {
  const environment = activeEnvironmentId();
  productivityActivity = productivityActivity.filter(item => item.environment !== environment);
  storageSet(PRODUCTIVITY_ACTIVITY_KEY, productivityActivity);
  renderProductivityDashboard();
  mostrarStatus(`Atividade de ${APP_ENVIRONMENTS[environment].label} limpa.`);
}

function openProductivityTarget(target) {
  const generator = generatorById(target);
  if (generator) return activateGenerator(target);
  const navigation = navigationById(target);
  if (!navigation || !navigationSupportsEnvironment(navigation)) return false;
  switchTab(target, document.getElementById(`tab-btn-${target}`));
  return true;
}

function commandPaletteCandidates(term = '') {
  const query = normalizeGeneratorText(term);
  const generators = generatorsForEnvironment().filter(item => item.discoverable !== false);
  const navigation = navigationForEnvironment();
  if (query) {
    return [
      ...generators.filter(item => matchesGenerator(item, query)).map(item => ({kind:'generator',id:item.id,label:item.label,description:item.description,icon:generatorIcon(item)})),
      ...navigation.filter(item => normalizeGeneratorText(`${item.label} ${item.description} ${item.group}`).includes(query)).map(item => ({kind:'navigation',id:item.id,label:item.label,description:item.description,icon:`<i data-lucide="${item.icon}" aria-hidden="true"></i>`}))
    ].slice(0,12);
  }
  const preferredIds = [...new Set([
    ...generatorIdsForEnvironment(readGeneratorIds(FAVORITES_KEY)),
    ...generatorIdsForEnvironment(readGeneratorIds(RECENTS_KEY)),
    ...generators.filter(item => item.priority).map(item => item.id)
  ])];
  return [
    ...preferredIds.map(id => {
      const item = generatorById(id);
      return {kind:'generator',id,label:item.label,description:item.description,icon:generatorIcon(item)};
    }),
    ...navigation.filter(item => item.id !== 'home').map(item => ({kind:'navigation',id:item.id,label:item.label,description:item.description,icon:`<i data-lucide="${item.icon}" aria-hidden="true"></i>`}))
  ].slice(0,12);
}

function renderCommandPalette() {
  const input = document.getElementById('command-palette-input');
  const results = document.getElementById('command-palette-results');
  commandPaletteItems = commandPaletteCandidates(input.value);
  commandPaletteIndex = Math.min(commandPaletteIndex, Math.max(0, commandPaletteItems.length - 1));
  results.innerHTML = commandPaletteItems.length
    ? commandPaletteItems.map((item,index) => `<button type="button" role="option" id="command-option-${index}" data-command-index="${index}" aria-selected="${index===commandPaletteIndex}">${item.icon}<span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.description)}</small></span><em>${item.kind==='generator'?'Gerador':'Área'}</em></button>`).join('')
    : '<p class="command-palette-empty">Nenhuma ferramenta encontrada neste ambiente.</p>';
  document.getElementById('command-palette-status').textContent = `${commandPaletteItems.length} ${commandPaletteItems.length === 1 ? 'resultado' : 'resultados'} em ${APP_ENVIRONMENTS[activeEnvironmentId()].label}.`;
  input.setAttribute('aria-activedescendant', commandPaletteItems.length ? `command-option-${commandPaletteIndex}` : '');
  renderLucideIcons(results);
}

function setCommandPaletteIndex(index) {
  if (!commandPaletteItems.length) return;
  commandPaletteIndex = (index + commandPaletteItems.length) % commandPaletteItems.length;
  document.querySelectorAll('#command-palette-results [role="option"]').forEach((item,itemIndex) => item.setAttribute('aria-selected',String(itemIndex===commandPaletteIndex)));
  const active = document.getElementById(`command-option-${commandPaletteIndex}`);
  document.getElementById('command-palette-input').setAttribute('aria-activedescendant',active.id);
  active.scrollIntoView?.({block:'nearest'});
}

function openCommandPalette() {
  const palette = document.getElementById('command-palette');
  commandPaletteReturnFocus = document.activeElement;
  palette.hidden = false;
  commandPaletteIndex = 0;
  const input = document.getElementById('command-palette-input');
  input.value = '';
  renderCommandPalette();
  input.focus();
}

function closeCommandPalette() {
  const palette = document.getElementById('command-palette');
  if (palette.hidden) return;
  palette.hidden = true;
  document.getElementById('command-palette-input').setAttribute('aria-activedescendant','');
  if (commandPaletteReturnFocus?.isConnected) commandPaletteReturnFocus.focus();
}

function activateCommandPaletteItem(index = commandPaletteIndex) {
  const item = commandPaletteItems[index];
  if (!item) return;
  closeCommandPalette();
  openProductivityTarget(item.id);
}

function trapCommandPaletteFocus(event) {
  const focusable = [...document.querySelectorAll('#command-palette button:not([disabled]), #command-palette input:not([disabled])')].filter(item => !item.hidden);
  if (!focusable.length) return;
  const current = focusable.indexOf(document.activeElement);
  const next = event.shiftKey
    ? (current <= 0 ? focusable.length - 1 : current - 1)
    : (current < 0 || current === focusable.length - 1 ? 0 : current + 1);
  event.preventDefault();
  focusable[next].focus();
}

productivityActivity = readProductivityActivity();
document.getElementById('productivity-activity-clear').addEventListener('click',clearProductivityActivityForEnvironment);
document.getElementById('productivity-activity').addEventListener('click',event => {
  const button = event.target.closest('[data-productivity-target]');
  if (button) openProductivityTarget(button.dataset.productivityTarget);
});
document.getElementById('command-palette-close').addEventListener('click',closeCommandPalette);
document.getElementById('command-palette-input').addEventListener('input',() => {commandPaletteIndex=0;renderCommandPalette();});
document.getElementById('command-palette-results').addEventListener('click',event => {
  const option = event.target.closest('[data-command-index]');
  if (option) activateCommandPaletteItem(Number(option.dataset.commandIndex));
});
document.getElementById('command-palette').addEventListener('click',event => {if(event.target.id==='command-palette')closeCommandPalette();});
document.addEventListener('keydown',event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.getElementById('command-palette').hidden ? openCommandPalette() : closeCommandPalette();
    return;
  }
  if (document.getElementById('command-palette').hidden) return;
  if (event.key === 'Tab') trapCommandPaletteFocus(event);
  else if (event.key === 'Escape') {event.preventDefault();closeCommandPalette();}
  else if (event.key === 'ArrowDown') {event.preventDefault();setCommandPaletteIndex(commandPaletteIndex+1);}
  else if (event.key === 'ArrowUp') {event.preventDefault();setCommandPaletteIndex(commandPaletteIndex-1);}
  else if (event.key === 'Enter') {
    const focused = document.activeElement.closest?.('[data-command-index]');
    event.preventDefault();activateCommandPaletteItem(focused?Number(focused.dataset.commandIndex):commandPaletteIndex);
  }
});
document.addEventListener('productivity-activity',renderProductivityDashboard);
document.addEventListener('generator-used',renderProductivityDashboard);
window.addEventListener('futureg:environmentchange',() => {
  renderProductivityDashboard();
  if (!document.getElementById('command-palette').hidden) {commandPaletteIndex=0;renderCommandPalette();}
});
renderProductivityDashboard();
