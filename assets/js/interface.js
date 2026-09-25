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
  atualizarCabecalhoLayout();
  if (window.matchMedia?.('(max-width: 700px)').matches) {
    definirSidebar(true, false);
    document.getElementById(panelId).focus({preventScroll:true});
  }
}

function initializeTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn[role="tab"]'));
  tabs.forEach((tabBtn, index) => {
    tabBtn.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;

      event.preventDefault();
      let nextIndex = index;
      if (key === 'ArrowRight' || key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
      if (key === 'ArrowLeft' || key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
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

// Reorder before initializeTabs runs so keyboard order matches the visible menu.
const gruposNavegacao=[['Visão geral',['home']],['Gerar',['xml','docs','cadastro']],['Trabalhar com XML',['editor','validacao']],['Assistente',['chat']]];
const listaNavegacao=document.querySelector('.tab-nav');
for(const [nome,ferramentas] of gruposNavegacao) {
  const label=document.createElement('div');
  label.className='nav-section-label';label.textContent=nome;
  label.setAttribute('aria-hidden','true');
  listaNavegacao.append(label);
  for(const ferramenta of ferramentas)listaNavegacao.append(document.getElementById('tab-btn-'+ferramenta));
}

// Contexto da ferramenta ativa, sem alterar o funcionamento dos geradores.
const descricoesLayout = {
  home:['Início','Escolha uma ferramenta e gere dados de teste com rapidez.'],
  xml:['XML fiscal','Prepare NF-e e CT-e de teste e confira os documentos gerados.'],
  docs:['Dados cadastrais','Gere documentos e identificadores, individualmente ou em lote.'],
  cadastro:['Cadastro geral','Monte perfis completos e organize seus dados de teste.'],
  editor:['Editor XML','Importe documentos, ajuste campos e revise as alterações.'],
  chat:['Assistente de geração','Converse sobre dados, gere documentos e explore seus XMLs.'],
  validacao:['Validação XML','Confira a sintaxe e a consistência básica dos documentos.']
};

const AMBIENTES_APP = Object.freeze({
  general: Object.freeze({ label: 'Geradores Gerais', summary: 'Geradores Gerais' }),
  port: Object.freeze({ label: 'QA Portuário', summary: 'QA Portuário' })
});

function definirAmbiente(id, persist = true, announce = true) {
  const environmentId = AMBIENTES_APP[id] ? id : 'general';
  const environment = AMBIENTES_APP[environmentId];
  document.body.dataset.environment = environmentId;
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
  const textos=descricoesLayout[chave];
  if (!textos) return;
  document.getElementById('app-title').textContent=textos[0];
  document.querySelector('.page-header-text p').textContent=textos[1];
}
document.querySelectorAll('.tab-btn').forEach(tab=>{
  const rotulo=tab.textContent.trim();
  tab.setAttribute('aria-label',rotulo); tab.title=rotulo;
  const icone=tab.querySelector('i');
  const texto=document.createElement('span'); texto.textContent=rotulo;
  tab.replaceChildren();
  if (icone) tab.append(icone);
  else { const novo=document.createElement('i'); novo.className='bi bi-shield-check'; novo.setAttribute('aria-hidden','true'); tab.append(novo); }
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
  if (persist) storageSet('thegenerator:sidebar-collapsed', collapsed);
}
definirSidebar(storageGet('thegenerator:sidebar-collapsed', window.matchMedia?.('(max-width: 700px)').matches || false) === true, false);
document.getElementById('sidebar-collapse-btn').addEventListener('click', () => definirSidebar(!document.body.classList.contains('sidebar-collapsed')));
document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && !document.body.classList.contains('sidebar-collapsed')) {
    definirSidebar(true); document.getElementById('sidebar-collapse-btn').focus();
  }
});
document.querySelectorAll('.tab-btn').forEach(tab => {
  tab.dataset.tooltip=tab.getAttribute('aria-label');
  const icons={home:'M3 3h7v7H3V3m11 0h7v7h-7V3M3 14h7v7H3v-7m11 0h7v7h-7v-7',xml:'M5 3h10l4 4v14H5V3m4 8-2 3 2 3m6-6 2 3-2 3',docs:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-2a8 8 0 0 1 16 0v2',cadastro:'M3 4h18v16H3V4m3 4h5v5H6V8m8 0h4m-4 4h4M6 16h12',editor:'m4 16 12-12 4 4L8 20H4v-4m10-10 4 4',validacao:'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4m-5 9 3 3 6-6',chat:'M4 4h16v12H9l-5 4V4m4 5h8m-8 3h5'};
  tab.querySelector('i').outerHTML=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[tab.id.replace('tab-btn-','')]}"/></svg>`;
  tab.removeAttribute('title');
});
