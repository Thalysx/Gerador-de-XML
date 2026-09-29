(function initLucideIcons() {
  let renderQueued = false;

  function renderLucideIcons(root = document) {
    if (!window.lucide?.createIcons || !root?.querySelectorAll) return false;
    const hasPendingIcon = root.matches?.('i[data-lucide]') || root.querySelector('i[data-lucide]');
    if (!hasPendingIcon) return true;
    window.lucide.createIcons({
      attrs: { 'aria-hidden': 'true', 'stroke-width': 1.8 },
      root
    });
    root.querySelectorAll('svg[data-lucide]').forEach((icon) => icon.removeAttribute('data-lucide'));
    return true;
  }

  function scheduleLucideIcons() {
    if (renderQueued) return;
    renderQueued = true;
    queueMicrotask(() => {
      renderQueued = false;
      renderLucideIcons(document);
    });
  }

  window.renderLucideIcons = renderLucideIcons;
  window.scheduleLucideIcons = scheduleLucideIcons;

  const observer = new MutationObserver((mutations) => {
    const hasNewIcon = mutations.some(({ addedNodes }) => Array.from(addedNodes).some((node) =>
      node.nodeType === 1 && (node.matches?.('i[data-lucide]') || node.querySelector?.('i[data-lucide]'))
    ));
    if (hasNewIcon) scheduleLucideIcons();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleLucideIcons, { once: true });
  } else {
    scheduleLucideIcons();
  }
})();
