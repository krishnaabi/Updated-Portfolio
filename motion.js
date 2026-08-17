(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion-ready');
  const targets = document.querySelectorAll('.play-card,.post,.fun-grid article,.article-card,.project-card');
  targets.forEach(card => {
    card.dataset.motion = 'card';
    card.addEventListener('pointermove', event => {
      if (window.innerWidth < 821) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      card.style.transform = `translateY(-7px) perspective(800px) rotateX(${y * -2.6}deg) rotateY(${x * 2.6}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
  const visuals = document.querySelectorAll('.hero-visual,.hero-object,.blog-book,.about-portrait');
  window.addEventListener('pointermove', event => {
    if (window.innerWidth < 821) return;
    const x = (event.clientX / window.innerWidth - .5) * 8;
    const y = (event.clientY / window.innerHeight - .5) * 8;
    visuals.forEach(visual => visual.style.setProperty('--pointer-shift', `${x}px ${y}px`));
  }, { passive: true });
})();
