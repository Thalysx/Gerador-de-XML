// Presentation only: native disclosures retain the original inputs and domain handlers.
function abrirDivulgacaoVisual(id, focus = true) {
  const disclosure = document.getElementById(id);
  if (!disclosure) return;
  for (let parent = disclosure.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  disclosure.open = true;
  if (focus) {
    const target = disclosure.querySelector('input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled])') || disclosure.querySelector('summary');
    target?.focus();
  }
}

function fecharAcoesVisuais(disclosure, recoverFocus = false) {
  const focusInside = disclosure.contains(document.activeElement);
  disclosure.open = false;
  if (recoverFocus || focusInside) {
    const owner = disclosure.closest('.tab-panel');
    const target = owner?.hidden ? document.querySelector('.tab-panel.active') : disclosure.querySelector(':scope > summary');
    target?.focus({preventScroll:true});
  }
}

function posicionarAcoesVisuais(disclosure) {
  if (!disclosure.open) return;
  const panel = disclosure.querySelector('.action-disclosure-content');
  const trigger = disclosure.querySelector(':scope > summary');
  if (!panel || !trigger) return;
  const rect = trigger.getBoundingClientRect();
  const navRight = document.getElementById('workspace-navigation').getBoundingClientRect().right;
  const minimumLeft = Math.min(navRight + 8, innerWidth - 120);
  const width = Math.min(272, innerWidth - minimumLeft - 12);
  panel.style.position = 'fixed';
  panel.style.width = `${width}px`;
  panel.style.right = 'auto';
  panel.style.left = `${Math.max(minimumLeft, Math.min(rect.right - width, innerWidth - width - 12))}px`;
  const height = panel.getBoundingClientRect().height;
  panel.style.top = `${rect.bottom + height + 8 <= innerHeight ? rect.bottom + 8 : Math.max(8, rect.top - height - 8)}px`;
}

document.addEventListener('toggle', event => {
  if (event.target.matches('.action-disclosure')) posicionarAcoesVisuais(event.target);
}, true);
for (const eventName of ['resize', 'scroll']) {
  window.addEventListener(eventName, () => {
    if (!window.document) return;
    document.querySelectorAll('.action-disclosure[open]').forEach(posicionarAcoesVisuais);
  }, {passive:true,capture:true});
}

document.addEventListener('click', event => {
  const openButton = event.target.closest('[data-open-disclosure]');
  const editButton = event.target.closest('[data-edit-cadastro]');
  if (openButton) abrirDivulgacaoVisual(openButton.dataset.openDisclosure);
  if (editButton) abrirDivulgacaoVisual('cadastro-edit');
  if (event.target.closest('[data-open-privacy]')) {
    const settings = document.querySelector('.app-settings');
    settings.open = true;
    const privacy = settings.querySelector('.chat-privacy-settings');
    privacy.open = true;
    privacy.querySelector('summary').focus({preventScroll:true});
  }
  const action = event.target.closest('.action-disclosure-content button');
  for (const disclosure of document.querySelectorAll('.action-disclosure[open], .chat-attachment-menu[open]')) {
    if (!disclosure.contains(event.target) || action) {
      const navigated = action && disclosure.contains(action) && disclosure.closest('.tab-panel')?.hidden;
      fecharAcoesVisuais(disclosure, navigated);
    }
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const disclosures = [...document.querySelectorAll('.action-disclosure[open], .chat-attachment-menu[open]')];
  if (!disclosures.length) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  for (const disclosure of disclosures) fecharAcoesVisuais(disclosure, true);
}, true);

document.addEventListener('invalid', event => {
  for (let parent = event.target.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
}, true);

function atualizarPreferenciasVisuais() {
  if (!window.document) return;
  document.getElementById('docs-advanced').hidden = document.getElementById('docs-preferencias').hidden;
}
new MutationObserver(atualizarPreferenciasVisuais).observe(document.getElementById('docs-preferencias'), {attributes:true,attributeFilter:['hidden']});
atualizarPreferenciasVisuais();

function atualizarStatusGeracaoVisual() {
  if (!window.document) return;
  document.getElementById('docs-generation-status').hidden = document.getElementById('output-val').classList.contains('placeholder');
}
new MutationObserver(atualizarStatusGeracaoVisual).observe(document.getElementById('output-val'), {attributes:true,attributeFilter:['class'],childList:true});
atualizarStatusGeracaoVisual();
