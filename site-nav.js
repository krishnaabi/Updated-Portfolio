(() => {
  const routes = { Work: 'work.html', About: 'about.html', Playground: 'playground.html', Journal: 'blog.html' };
  document.querySelectorAll('.site-header nav').forEach(nav => {
    nav.innerHTML = Object.entries(routes).map(([name, url]) => `<a href="${url}">${name}</a>`).join('');
    const active = [...nav.links].find(link => location.pathname.endsWith(link.getAttribute('href')));
    if (active) active.classList.add('selected');
    nav.classList.add('is-ready');
  });
  document.querySelectorAll('.logo').forEach(link => { if (link.getAttribute('href')) link.href = 'index.html'; });
  document.body.classList.add('page-ready');
  document.querySelectorAll('.site-header nav a').forEach(link => link.addEventListener('click', () => document.body.classList.add('page-leaving')));
  if (document.body.classList.contains('work-page')) {
    const projects = document.querySelector('.projects');
    if (projects) {
      const explorations = document.createElement('section');
      explorations.id = 'explorations'; explorations.className = 'work-explorations';
      explorations.innerHTML = `<div><p>✦ PLAYGROUND</p><h2>Experiments, ideas<br>and <em>play.</em></h2><span>A curated selection of UI explorations and creative studies.</span></div><div class="explore-cards"><a href="playground.html"><b>UI</b><span>Interface explorations</span></a><a href="playground.html"><b>3D</b><span>Small visual studies</span></a><a href="playground.html"><b>✦</b><span>Motion experiments</span></a></div>`;
      projects.after(explorations);
      const style = document.createElement('style'); style.textContent = `.work-explorations{display:grid;grid-template-columns:34% 66%;gap:25px;padding:80px max(7.5vw,74px);background:#f4f2ef}.work-explorations p{color:#ff4e1b;font:700 9px 'DM Mono';letter-spacing:1px}.work-explorations h2{margin:12px 0;font-size:30px;line-height:1.1;letter-spacing:-2px}.work-explorations em{color:#ff4e1b;font-style:normal}.work-explorations>div>span{color:#666;font-size:10px}.explore-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}.explore-cards a{display:flex;min-height:145px;padding:16px;color:#fff;flex-direction:column;justify-content:space-between;text-decoration:none;border-radius:12px;transition:.35s}.explore-cards a:hover{transform:translateY(-8px) rotate(-1deg)}.explore-cards a:nth-child(1){background:linear-gradient(145deg,#12162c,#6951ad)}.explore-cards a:nth-child(2){background:linear-gradient(145deg,#d6b390,#6d4437)}.explore-cards a:nth-child(3){background:linear-gradient(145deg,#111,#5c2771)}.explore-cards b{font-size:28px}.explore-cards span{font-size:9px}@media(max-width:700px){.work-explorations{grid-template-columns:1fr;padding:55px 24px}.explore-cards{grid-template-columns:1fr 1fr}}`; document.head.append(style);
      fetch('/api/projects').then(r=>r.json()).then(items => {
        try {
          const saved = JSON.parse(localStorage.getItem('custom_projects_order'));
          if (saved && Array.isArray(saved) && saved.length) {
            const orderMap = new Map(saved.map((item, idx) => [String(item.id), idx]));
            items.sort((a, b) => {
              const idxA = orderMap.has(String(a.id)) ? orderMap.get(String(a.id)) : 999;
              const idxB = orderMap.has(String(b.id)) ? orderMap.get(String(b.id)) : 999;
              return idxA - idxB;
            });
          }
        } catch(e) {}
        projects.innerHTML = '';
        items.filter(p => !p.category || p.category.startsWith('work|')).forEach(p => {
          const category = (p.category || 'Product Design').split('|').pop();
          const article = document.createElement('article');
          article.className = 'work-item adconvo custom-project';
          article.innerHTML = `<div class="work-copy"><p>NEW</p><h2>${p.title}</h2><span>${p.description || 'A new project from Abikrishna’s studio.'}</span><div class="tags"><b>${category}</b><b>Featured</b></div><a href="${p.url}" target="_blank" rel="noreferrer">View Case Study <i>↗</i></a></div><div class="work-art dashboard light-dashboard"><div class="dash-nav"><b>${category}</b><small>New project</small></div><h3>${p.title}</h3><div class="graph"></div></div><i class="item-arrow">↗</i>`;
          projects.append(article);
        });
      });
    }
  }
})();
