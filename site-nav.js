(() => {
  'use strict';
  const routes = { Work: 'work.html', About: 'about.html', Playground: 'playground.html', Journal: 'blog.html' };

  // Ensure header navigation is always uniform and correctly highlighted
  document.querySelectorAll('.site-header nav').forEach(nav => {
    nav.innerHTML = Object.entries(routes).map(([name, url]) => `<a href="${url}">${name}</a>`).join('');
    const rawPath = location.pathname.split('/').pop() || 'index.html';
    const currentPath = rawPath.replace('.html', '').toLowerCase();
    const active = [...nav.querySelectorAll('a')].find(link => {
      const cleanHref = (link.getAttribute('href') || '').replace('.html', '').toLowerCase();
      return cleanHref === currentPath || (cleanHref === 'blog' && currentPath === 'journal');
    });
    if (active) active.classList.add('selected');
    nav.classList.add('is-ready');
  });

  // Ensure logo always links to homepage
  document.querySelectorAll('.logo').forEach(link => {
    if (!link.getAttribute('href') || link.getAttribute('href').startsWith('#')) {
      link.href = 'index.html';
    }
  });

  document.body.classList.add('page-ready');

  // Page leave transition
  document.querySelectorAll('.site-header nav a, .logo').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        document.body.classList.add('page-leaving');
      }
    });
  });
})();
