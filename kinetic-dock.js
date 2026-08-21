/**
 * ═══════════════════════════════════════════════════════════════
 * KINETIC GALAXY — ZERO-GRAVITY ORB PORTALS & LAUNCHPAD ENGINE
 * "Make You Proud" Masterpiece Edition · Dual View Mode Switcher
 * ═══════════════════════════════════════════════════════════════
 */

(function initKineticGalaxy() {
  function start() {
    const stage = document.querySelector('#kinetic-galaxy-stage');
    const physicsView = document.querySelector('#galaxy-physics-view');
    const listView = document.querySelector('#galaxy-list-view');
    if (!stage || !physicsView || !listView) return;

    const defaultItems = [
      {
        id: 'lw1',
        title: 'Honey Universal',
        category: 'Websites & Apps',
        tag: 'Live Production Site',
        url: 'https://honeyuniversal.com',
        description: 'Premium global digital commerce platform with interactive 3D product visualizer.',
        icon_text: 'HU',
        accent_color: '#ff4e1b',
        badge_status: '● Live Site',
        size_tier: 'lg',
        radius: 54
      },
      {
        id: 'lw2',
        title: 'Hanioo Marketplace',
        category: 'Websites & Apps',
        tag: 'SaaS Platform',
        url: 'https://hanioo.com',
        description: 'On-demand multilingual interpretation booking ecosystem across Web, iOS & Android.',
        icon_text: 'HN',
        accent_color: '#7928ca',
        badge_status: '● Live Site',
        size_tier: 'lg',
        radius: 50
      },
      {
        id: 'lw3',
        title: 'Flubn Studio',
        category: 'Graphic Design & Branding',
        tag: 'Brand Identity & Web',
        url: 'https://flubn.com',
        description: 'Experimental creative studio brand system, typography guidelines, and digital portfolio.',
        icon_text: 'FL',
        accent_color: '#0070f3',
        badge_status: '🎨 Graphic Showcase',
        size_tier: 'md',
        radius: 44
      },
      {
        id: 'lw4',
        title: 'G-Force Tech',
        category: 'Graphic Design & Branding',
        tag: 'Visual Identity',
        url: 'https://www.behance.net/krishnaabi',
        description: 'Dynamic automotive tech visual identity, iconography suite, and graphic campaign assets.',
        icon_text: 'GF',
        accent_color: '#10b981',
        badge_status: '🎨 Graphic Showcase',
        size_tier: 'md',
        radius: 44
      },
      {
        id: 'lw5',
        title: 'Stuak Lab',
        category: 'Websites & Apps',
        tag: 'Interactive Web',
        url: 'https://github.com/krishnaabi',
        description: 'Curated digital lab showcasing interactive generative prototypes and UI micro-animations.',
        icon_text: 'ST',
        accent_color: '#f59e0b',
        badge_status: '⚡ Web App',
        size_tier: 'md',
        radius: 42
      },
      {
        id: 'lw6',
        title: 'Noma Health',
        category: 'Websites & Apps',
        tag: 'Healthcare Web App',
        url: 'https://nomahealth.com',
        description: 'Telehealth consultation platform featuring intuitive doctor-patient scheduling workflows.',
        icon_text: 'NM',
        accent_color: '#06b6d4',
        badge_status: '● Live Site',
        size_tier: 'sm',
        radius: 38
      },
      {
        id: 'lw7',
        title: 'Veloce Brand',
        category: 'Graphic Design & Branding',
        tag: 'Print & Packaging',
        url: 'https://dribbble.com',
        description: 'Luxury minimalist packaging design, bespoke typography treatment, and art direction.',
        icon_text: 'VL',
        accent_color: '#ec4899',
        badge_status: '🎨 Graphic Showcase',
        size_tier: 'sm',
        radius: 38
      },
      {
        id: 'lw8',
        title: 'Apex System',
        category: 'Websites & Apps',
        tag: 'Design Tokens & Docs',
        url: 'work.html',
        description: 'Comprehensive multi-brand enterprise UI design token library and interactive component docs.',
        icon_text: 'AP',
        accent_color: '#8b5cf6',
        badge_status: '⚡ System Docs',
        size_tier: 'sm',
        radius: 36
      }
    ];

    const getItems = () => {
      try {
        const local = JSON.parse(localStorage.getItem('ak_portfolio_live_works') || 'null');
        if (Array.isArray(local) && local.length > 0) {
          return local.map(item => {
            const rad = item.size_tier === 'lg' ? 52 : (item.size_tier === 'sm' ? 38 : 44);
            return { ...item, radius: rad };
          });
        }
      } catch (e) {}
      return defaultItems;
    };

    const items = getItems();
    const countBadge = document.querySelector('#galaxy-count-badge');
    if (countBadge) {
      countBadge.textContent = `${String(items.length).padStart(2, '0')} Live Portals`;
    }

    // ══════════════════════════════════════════════════════════
    // 1. RENDER PHYSICS GALAXY VIEW
    // ══════════════════════════════════════════════════════════
    physicsView.innerHTML = '';
    const stageRect = physicsView.getBoundingClientRect();
    let width = stageRect.width || 1200;
    let height = stageRect.height || 410;

    const orbs = [];
    const numOrbs = items.length;

    items.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'galaxy-orb-node';
      el.style.setProperty('--node-accent', item.accent_color || '#ff4e1b');
      el.style.width = `${item.radius * 2}px`;
      el.style.height = `${item.radius * 2}px`;

      let domain = '';
      try {
        if (item.url && item.url.startsWith('http')) {
          domain = new URL(item.url).hostname.replace(/^www\./, '');
        } else {
          domain = item.url || 'Live Demo';
        }
      } catch {
        domain = item.url || 'Live Demo';
      }

      const customImg = item.image || item.custom_icon_url || item.iconUrl || '';
      const orbContent = customImg
        ? `<img src="${customImg}" alt="${item.title}" class="galaxy-logo-img" />`
        : `<span class="galaxy-monogram">${item.icon_text || (item.title ? item.title.slice(0,2).toUpperCase() : '⚡')}</span>`;

      el.innerHTML = `
        <div class="galaxy-tooltip">
          <span class="galaxy-tooltip-dot"></span>
          <div class="galaxy-tooltip-info">
            <span class="galaxy-tooltip-title">${item.title}</span>
            <span class="galaxy-tooltip-sub">${domain} · ${item.category || 'Live Site'}</span>
          </div>
          <span class="galaxy-tooltip-arrow">↗</span>
        </div>
        <div class="galaxy-orb-shell">
          <span class="galaxy-live-beacon"></span>
          ${orbContent}
        </div>
      `;

      physicsView.appendChild(el);

      const cols = Math.ceil(Math.sqrt(numOrbs * (width / height)));
      const rows = Math.ceil(numOrbs / cols);
      const col = index % cols;
      const row = Math.floor(index / cols);

      const cellW = (width - 160) / cols;
      const cellH = (height - 100) / rows;

      const initX = 80 + col * cellW + cellW / 2 + (Math.random() - 0.5) * 30;
      const initY = 50 + row * cellH + cellH / 2 + (Math.random() - 0.5) * 25;

      orbs.push({
        el,
        item,
        x: Math.max(item.radius + 20, Math.min(width - item.radius - 20, initX)),
        y: Math.max(item.radius + 20, Math.min(height - item.radius - 20, initY)),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: item.radius,
        mass: item.radius * 0.1,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        movedDistance: 0,
        phase: Math.random() * Math.PI * 2
      });
    });

    // ══════════════════════════════════════════════════════════
    // 2. RENDER CLEAN LAUNCHPAD LIST VIEW
    // ══════════════════════════════════════════════════════════
    listView.innerHTML = items.map(item => {
      const accent = item.accent_color || '#ff4e1b';
      const iconText = item.icon_text || (item.title ? item.title.slice(0, 2).toUpperCase() : '⚡');
      const customImg = item.image || item.custom_icon_url || item.iconUrl || '';

      let domain = '';
      try {
        if (item.url && item.url.startsWith('http')) {
          domain = new URL(item.url).hostname.replace(/^www\./, '');
        } else {
          domain = item.url || 'Live Demo';
        }
      } catch {
        domain = item.url || 'Live Demo';
      }

      const orbContent = customImg
        ? `<img src="${customImg}" alt="${item.title}" style="width:100%;height:100%;object-fit:contain;border-radius:50%;" />`
        : iconText;

      return `
        <a href="${item.url || '#'}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="launchpad-list-row" style="--row-accent:${accent};" aria-label="Visit ${item.title}">
          <div class="launchpad-row-left">
            <div class="launchpad-row-orb">
              ${orbContent}
            </div>
            <div class="launchpad-row-meta">
              <h4 class="launchpad-row-title">${item.title}</h4>
              <span class="launchpad-row-cat">${item.category || 'Website'} · ${item.tag || 'Live Work'}</span>
            </div>
          </div>
          <div class="launchpad-row-right">
            <span class="launchpad-row-status">${item.badge_status || '● Live Site'}</span>
            <span class="launchpad-row-link">${domain} <span class="launchpad-row-arrow">↗</span></span>
          </div>
        </a>
      `;
    }).join('');

    // ══════════════════════════════════════════════════════════
    // 3. DUAL VIEW TOGGLE SWITCHER ENGINE
    // ══════════════════════════════════════════════════════════
    const btnGalaxy = document.querySelector('#btn-view-galaxy');
    const btnList = document.querySelector('#btn-view-list');
    const hintText = document.querySelector('#galaxy-hint-text');

    let currentMode = localStorage.getItem('ak_portal_view_mode') || 'galaxy';

    function setViewMode(mode) {
      currentMode = mode;
      localStorage.setItem('ak_portal_view_mode', mode);

      if (mode === 'galaxy') {
        btnGalaxy?.classList.add('active');
        btnGalaxy?.setAttribute('aria-selected', 'true');
        btnList?.classList.remove('active');
        btnList?.setAttribute('aria-selected', 'false');

        physicsView.classList.remove('hidden');
        listView.classList.add('hidden');
        if (hintText) hintText.textContent = '✦ Drag or fling orbs · Click to launch';
      } else {
        btnList?.classList.add('active');
        btnList?.setAttribute('aria-selected', 'true');
        btnGalaxy?.classList.remove('active');
        btnGalaxy?.setAttribute('aria-selected', 'false');

        listView.classList.remove('hidden');
        physicsView.classList.add('hidden');
        if (hintText) hintText.textContent = '✦ Click any card to launch live site';
      }
    }

    if (btnGalaxy) btnGalaxy.onclick = () => setViewMode('galaxy');
    if (btnList) btnList.onclick = () => setViewMode('list');

    // Apply saved mode on start
    setViewMode(currentMode);

    // ══════════════════════════════════════════════════════════
    // 4. GALAXY PHYSICS & DRAG/FLING ENGINE
    // ══════════════════════════════════════════════════════════
    let draggedOrb = null;
    let pointerX = 0;
    let pointerY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let pointerVx = 0;
    let pointerVy = 0;

    const onPointerDown = (orb, clientX, clientY) => {
      const rect = physicsView.getBoundingClientRect();
      draggedOrb = orb;
      orb.isDragging = true;
      orb.vx = 0;
      orb.vy = 0;
      orb.dragStartX = clientX;
      orb.dragStartY = clientY;
      orb.movedDistance = 0;

      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;
      lastPointerX = pointerX;
      lastPointerY = pointerY;
      pointerVx = 0;
      pointerVy = 0;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!draggedOrb) return;
      const rect = physicsView.getBoundingClientRect();
      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;

      pointerVx = (pointerX - lastPointerX) * 0.5;
      pointerVy = (pointerY - lastPointerY) * 0.5;

      lastPointerX = pointerX;
      lastPointerY = pointerY;

      draggedOrb.x = pointerX;
      draggedOrb.y = pointerY;

      const dx = clientX - draggedOrb.dragStartX;
      const dy = clientY - draggedOrb.dragStartY;
      draggedOrb.movedDistance = Math.hypot(dx, dy);
    };

    const onPointerUp = () => {
      if (!draggedOrb) return;

      if (draggedOrb.movedDistance < 8) {
        // Trigger Click Action (Shockwave & Open URL)
        const shell = draggedOrb.el.querySelector('.galaxy-orb-shell');
        if (shell) {
          const ripple = document.createElement('span');
          ripple.className = 'galaxy-ripple';
          shell.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        }

        const targetUrl = draggedOrb.item.url;
        if (targetUrl) {
          if (targetUrl.startsWith('http')) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = targetUrl;
          }
        }
      } else {
        // Release with fling inertia momentum
        draggedOrb.vx = Math.max(-12, Math.min(12, pointerVx * 1.3));
        draggedOrb.vy = Math.max(-12, Math.min(12, pointerVy * 1.3));
      }

      draggedOrb.isDragging = false;
      draggedOrb = null;
    };

    orbs.forEach(orb => {
      orb.el.addEventListener('mousedown', e => {
        e.preventDefault();
        onPointerDown(orb, e.clientX, e.clientY);
      });

      orb.el.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
          onPointerDown(orb, e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
    });

    window.addEventListener('mousemove', e => {
      if (draggedOrb) onPointerMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', e => {
      if (draggedOrb && e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Physics Animation Loop
    let time = 0;

    const updatePhysics = () => {
      if (currentMode === 'galaxy') {
        time += 0.015;
        const rect = physicsView.getBoundingClientRect();
        width = rect.width;
        height = rect.height;

        // 1. Organic buoyancy drift
        orbs.forEach(orb => {
          if (orb.isDragging) return;

          const floatFx = Math.cos(time + orb.phase) * 0.08;
          const floatFy = Math.sin(time + orb.phase) * 0.08;

          orb.vx += floatFx;
          orb.vy += floatFy;

          orb.vx *= 0.975;
          orb.vy *= 0.975;

          orb.x += orb.vx;
          orb.y += orb.vy;

          const pad = orb.radius + 6;
          if (orb.x < pad) {
            orb.x = pad;
            orb.vx = Math.abs(orb.vx) * 0.75;
          } else if (orb.x > width - pad) {
            orb.x = width - pad;
            orb.vx = -Math.abs(orb.vx) * 0.75;
          }

          if (orb.y < pad + 10) {
            orb.y = pad + 10;
            orb.vy = Math.abs(orb.vy) * 0.75;
          } else if (orb.y > height - pad) {
            orb.y = height - pad;
            orb.vy = -Math.abs(orb.vy) * 0.75;
          }
        });

        // 2. Soft-body collision repulsion
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const a = orbs[i];
            const b = orbs[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.radius + b.radius + 14;

            if (dist < minDist && dist > 0.001) {
              const overlap = (minDist - dist) * 0.5;
              const nx = dx / dist;
              const ny = dy / dist;

              if (!a.isDragging) {
                a.x -= nx * overlap * 0.5;
                a.y -= ny * overlap * 0.5;
                a.vx -= nx * 0.15;
                a.vy -= ny * 0.15;
              }

              if (!b.isDragging) {
                b.x += nx * overlap * 0.5;
                b.y += ny * overlap * 0.5;
                b.vx += nx * 0.15;
                b.vy += ny * 0.15;
              }
            }
          }
        }

        // 3. Render transforms to DOM
        orbs.forEach(orb => {
          const left = orb.x - orb.radius;
          const top = orb.y - orb.radius;
          orb.el.style.transform = `translate3d(${left.toFixed(2)}px, ${top.toFixed(2)}px, 0)`;
        });
      }

      requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    window.addEventListener('resize', () => {
      const r = physicsView.getBoundingClientRect();
      width = r.width;
      height = r.height;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
