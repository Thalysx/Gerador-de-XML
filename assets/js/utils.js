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

function rolarParaElemento(el) {
  if (!el) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  el.focus?.({ preventScroll: true });
}
