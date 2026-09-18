// ══════════════════════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════════════════════
function switchTab(tab, btn) {
  const panelId = 'tab-' + tab;
  const selectedBtn = btn || document.querySelector(`.tab-btn[aria-controls="${panelId}"]`);

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
}

function initializeTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn[role="tab"]'));
  tabs.forEach((tabBtn, index) => {
    tabBtn.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;

      event.preventDefault();
      let nextIndex = index;
      if (key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (key === 'Home') nextIndex = 0;
      if (key === 'End') nextIndex = tabs.length - 1;

      const nextTab = tabs[nextIndex];
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
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> Tema claro`;
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Alternar para tema claro');
  } else {
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> Tema escuro`;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Alternar para tema escuro');
  }
  storageSet('gerador:tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}
