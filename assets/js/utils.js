function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function escapeInlineValue(value) {
  const jsSafe = String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
  return escapeAttr(jsSafe);
}

// Keep the latest result visible immediately; motion never delays a domain action.
const animacoesResultado = new Map();
const preferenciaMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)');
preferenciaMovimento?.addEventListener?.('change', event => {
  if (!event.matches) return;
  for (const animacao of animacoesResultado.values()) animacao.cancel();
  animacoesResultado.clear();
});

function animarResultado(elemento) {
  animacoesResultado.get(elemento)?.cancel();
  animacoesResultado.delete(elemento);
  if (!elemento?.animate || preferenciaMovimento?.matches) return;
  const animacao = elemento.animate([
    { opacity: .65, transform: 'translateY(4px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' });
  animacoesResultado.set(elemento, animacao);
  const limpar = () => {
    if (animacoesResultado.get(elemento) === animacao) animacoesResultado.delete(elemento);
  };
  animacao.finished.then(limpar, limpar);
}

const estadosCopia = new WeakMap();
function confirmarCopiaVisual(botao, rotulo) {
  const anterior = estadosCopia.get(botao);
  if (anterior) clearTimeout(anterior.timer);
  const estado = anterior || { conteudo: botao.innerHTML, nome: botao.getAttribute('aria-label') };
  botao.innerHTML = '<i data-lucide="check" aria-hidden="true"></i><span>Copiado</span>';
  botao.setAttribute('aria-label', `${rotulo} copiado`);
  botao.classList.add('copied', 'is-copied');
  renderLucideIcons(botao);
  estado.timer = setTimeout(() => {
    botao.innerHTML = estado.conteudo;
    if (estado.nome === null) botao.removeAttribute('aria-label');
    else botao.setAttribute('aria-label', estado.nome);
    botao.classList.remove('copied', 'is-copied');
    estadosCopia.delete(botao);
    if (botao.isConnected) renderLucideIcons(botao);
  }, 1500);
  estadosCopia.set(botao, estado);
}

let statusTimer = null;

function mostrarStatus(mensagem, tipo = 'success') {
  const status = document.getElementById('app-status');
  const live = document.getElementById('app-status-live');
  if (live) live.textContent = mensagem;
  if (!status) return;
  clearTimeout(statusTimer);
  status.textContent = mensagem;
  status.classList.toggle('error', tipo === 'error');
  status.classList.add('visible');
  statusTimer = setTimeout(() => status.classList.remove('visible'), 3000);
}

async function copiarTexto(texto, mensagemSucesso = 'Copiado para a área de transferência.') {
  const valor = String(texto ?? '');
  if (!valor) {
    mostrarStatus('Não há conteúdo para copiar.', 'error');
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(valor);
    } else {
      const area = document.createElement('textarea');
      area.value = valor;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      area.style.top = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      if (!ok) throw new Error('copy command failed');
    }
    mostrarStatus(mensagemSucesso);
    return true;
  } catch (error) {
    mostrarStatus('Não foi possível copiar automaticamente. Selecione o valor e copie manualmente.', 'error');
    return false;
  }
}

async function copiarCampoResultado(botao, valor, rotulo = 'Valor') {
  const ok = await copiarTexto(valor, `${rotulo} copiado.`);
  if (!ok || !botao) return ok;
  confirmarCopiaVisual(botao, rotulo);
  return true;
}

function rolarParaElemento(el) {
  if (!el) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  el.focus?.({ preventScroll: true });
}
