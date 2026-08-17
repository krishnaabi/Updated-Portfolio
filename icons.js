(() => {
  const applyIcons = () => {
    const set = (selector, icon) => document.querySelectorAll(selector).forEach(element => { element.innerHTML = `<i data-lucide="${icon}"></i>`; });
    set('.talk-link b', 'arrow-up-right');
    set('.text-cta b, .view-all b, .project-info a b, .article-card a b, .big-arrow', 'arrow-up-right');
    set('.resume i', 'download');
    set('.scroll-cta span', 'arrow-down');
    set('#footer-email-link span', 'mail');
    set('#footer-cv-link span', 'download');
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16, 'stroke-width': 1.7 } });

  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyIcons);
  else applyIcons();
})();
