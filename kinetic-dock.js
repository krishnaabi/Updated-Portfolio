/**
 * ═══════════════════════════════════════════════════════════════
 * KINETIC GALAXY — ZERO-GRAVITY INTERACTIVE ORB PORTALS ENGINE
 * "Make You Proud" Masterpiece Edition · High-Precision Physics
 * ═══════════════════════════════════════════════════════════════
 */

(function initKineticGalaxy() {
  function start() {
    const stage = document.querySelector('#kinetic-galaxy-stage');
    if (!stage) return;

    const defaultItems = [
      {
        id: 'lw1',
        title: 'Honey Universal',
        category: 'Websites & Apps',
        url: 'https://honeyuniversal.com',
        icon_text: 'HU',
        accent_color: '#ff4e1b',
        size_tier: 'lg',
        radius: 54
      },
      {
        id: 'lw2',
        title: 'Hanioo Marketplace',
        category: 'Websites & Apps',
        url: 'https://hanioo.com',
        icon_text: 'HN',
        accent_color: '#7928ca',
        size_tier: 'lg',
        radius: 50
      },
      {
        id: 'lw3',
        title: 'Flubn Studio',
        category: 'Graphic Design & Branding',
        url: 'https://flubn.com',
        icon_text: 'FL',
        accent_color: '#0070f3',
        size_tier: 'md',
        radius: 44
      },
      {
        id: 'lw4',
        title: 'G-Force Tech',
        category: 'Graphic Design & Branding',
        url: 'https://www.behance.net/krishnaabi',
        icon_text: 'GF',
        accent_color: '#10b981',
        size_tier: 'md',
        radius: 44
      },
      {
        id: 'lw5',
        title: 'Stuak Lab',
        category: 'Websites & Apps',
        url: 'https://github.com/krishnaabi',
        icon_text: 'ST',
        accent_color: '#f59e0b',
        size_tier: 'md',
        radius: 42
      },
      {
        id: 'lw6',
        title: 'Noma Health',
        category: 'Websites & Apps',
        url: 'https://nomahealth.com',
        icon_text: 'NM',
        accent_color: '#06b6d4',
        size_tier: 'sm',
        radius: 38
      },
      {
        id: 'lw7',
        title: 'Veloce Brand',
        category: 'Graphic Design & Branding',
        url: 'https://dribbble.com',
        icon_text: 'VL',
        accent_color: '#ec4899',
        size_tier: 'sm',
        radius: 38
      },
      {
        id: 'lw8',
        title: 'Apex System',
        category: 'Websites & Apps',
        url: 'work.html',
        icon_text: 'AP',
        accent_color: '#8b5cf6',
        size_tier: 'sm',
        radius: 36
      }
    ];

    const getItems = () => {
      try {
        const local = JSON.parse(localStorage.getItem('ak_portfolio_live_works') || 'null');
        if (Array.isArray(local) && local.length > 0) {
          return local.map((item, idx) => {
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
      countBadge.textContent = `${String(items.length).padStart(2, '0')} Interactive Live Portals`;
    }

    // Clean stage except header/canvas
    const existingNodes = stage.querySelectorAll('.galaxy-orb-node');
    existingNodes.forEach(n => n.remove());

    const stageRect = stage.getBoundingClientRect();
    let width = stageRect.width || 1200;
    let height = stageRect.height || 480;

    // Physics state objects
    const orbs = [];
    const numOrbs = items.length;

    // Distribute initial positions across the stage
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

      stage.appendChild(el);

      // Grid-seeded starting positions with organic jitter
      const cols = Math.ceil(Math.sqrt(numOrbs * (width / height)));
      const rows = Math.ceil(numOrbs / cols);
      const col = index % cols;
      const row = Math.floor(index / cols);

      const cellW = (width - 160) / cols;
      const cellH = (height - 120) / rows;

      const initX = 80 + col * cellW + cellW / 2 + (Math.random() - 0.5) * 30;
      const initY = 70 + row * cellH + cellH / 2 + (Math.random() - 0.5) * 25;

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
    // DRAG, FLING & CLICK EVENT HANDLING
    // ══════════════════════════════════════════════════════════
    let draggedOrb = null;
    let pointerX = 0;
    let pointerY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let pointerVx = 0;
    let pointerVy = 0;

    const onPointerDown = (orb, clientX, clientY) => {
      const rect = stage.getBoundingClientRect();
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
      const rect = stage.getBoundingClientRect();
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

    // Attach pointer events to orbs
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

    // ══════════════════════════════════════════════════════════
    // PHYSICS SIMULATION LOOP (Zero-Gravity + Soft Repulsion)
    // ══════════════════════════════════════════════════════════
    let time = 0;
    let animId = null;

    const updatePhysics = () => {
      time += 0.015;
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // 1. Organic zero-gravity buoyancy drift
      orbs.forEach(orb => {
        if (orb.isDragging) return;

        // Gentle ambient harmonic floating wave
        const floatFx = Math.cos(time + orb.phase) * 0.08;
        const floatFy = Math.sin(time + orb.phase) * 0.08;

        orb.vx += floatFx;
        orb.vy += floatFy;

        // Damping / air friction
        orb.vx *= 0.975;
        orb.vy *= 0.975;

        // Position update
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Stage boundary bounce
        const pad = orb.radius + 6;
        if (orb.x < pad) {
          orb.x = pad;
          orb.vx = Math.abs(orb.vx) * 0.75;
        } else if (orb.x > width - pad) {
          orb.x = width - pad;
          orb.vx = -Math.abs(orb.vx) * 0.75;
        }

        if (orb.y < pad + 30) {
          orb.y = pad + 30;
          orb.vy = Math.abs(orb.vy) * 0.75;
        } else if (orb.y > height - pad) {
          orb.y = height - pad;
          orb.vy = -Math.abs(orb.vy) * 0.75;
        }
      });

      // 2. Soft-body collision / Inter-orb repulsion
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

      animId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    window.addEventListener('resize', () => {
      const r = stage.getBoundingClientRect();
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
