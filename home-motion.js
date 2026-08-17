/* ==========================================================================
   Home Page Cinematic & Motion Engine (Jesko Jets + Super.money Inspired)
   ========================================================================== */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. WebGL / Canvas 3D Particle Constellation Engine (Jesko Jets Style)
  // -------------------------------------------------------------
  function init3DParticleAtmosphere() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cinematic-webgl-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let scrollY = window.scrollY;

    const PARTICLE_COUNT = Math.min(Math.floor(width / 22), 65);
    const particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.z = Math.random() * 2 + 0.5; // Depth multiplier
        this.size = Math.random() * 2.5 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.4 + 0.2);
        this.alpha = Math.random() * 0.5 + 0.25;
        this.baseAlpha = this.alpha;
        // Warm Orange / Champagne palette
        const colors = ['rgba(255, 78, 27, ', 'rgba(255, 140, 50, ', 'rgba(255, 215, 175, ', 'rgba(255, 255, 255, '];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Parallax drift based on mouse & scroll
        const dx = (mouse.x - width / 2) * 0.0003 * this.z;
        const dy = (mouse.y - height / 2) * 0.0003 * this.z;

        this.x += this.vx + dx;
        this.y += this.vy - scrollY * 0.0002 * this.z;

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.z, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + this.alpha + ')';
        ctx.shadowColor = 'rgba(255, 78, 27, 0.4)';
        ctx.shadowBlur = this.size * 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw subtle connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 78, 27, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(render);
    }

    render();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', e => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });
  }

  // -------------------------------------------------------------
  // 2. Kinetic Typography Engine (Super.money Style)
  // -------------------------------------------------------------
  function initKineticTypography() {
    const heroTitle = document.querySelector('.hero-copy h1');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent.trim();

    // Key phrases to highlight in kinetic accent gradient
    const highlightPhrases = ['intuitive experiences', 'business problems.', 'real business problems.'];

    // Split text into words for kinetic scroll physics
    const words = originalText.split(' ');
    heroTitle.className = 'kinetic-hero-title';
    heroTitle.innerHTML = words.map(w => {
      const isHighlight = w.includes('business') || w.includes('problems') || w.includes('intuitive');
      const cls = isHighlight ? 'kinetic-hero-word highlight-word' : 'kinetic-hero-word';
      return `<span class="${cls}">${w}</span>`;
    }).join(' ');
  }

  // -------------------------------------------------------------
  // 3. 3D Tilt Card Interaction (Jesko Jets Depth)
  // -------------------------------------------------------------
  function init3DTiltCards() {
    const tiltElements = document.querySelectorAll('.portrait-wrap, .process-row > div, .quote-card, .trusted-brand-card');

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // -------------------------------------------------------------
  // 4. Kinetic Animated Stats Counter
  // -------------------------------------------------------------
  function initKineticCounters() {
    const stats = [
      { id: 'home-stat1-val', target: 4.5, suffix: '+', decimals: 1 },
      { id: 'home-stat2-val', target: 1200, suffix: '+', decimals: 0 },
      { id: 'home-stat3-val', target: 20, suffix: '+', decimals: 0 },
      { id: 'home-stat4-val', target: 5, suffix: '+', decimals: 0 },
      { id: 'home-stat5-val', target: 15, suffix: '+', decimals: 0 }
    ];

    let animated = false;
    const metricsSection = document.querySelector('#metrics');
    if (!metricsSection) return;

    function animateStats() {
      if (animated) return;
      const rect = metricsSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        animated = true;
        stats.forEach(item => {
          const el = document.getElementById(item.id);
          if (!el) return;

          let start = 0;
          const duration = 1800; // ms
          const startTime = performance.now();

          function step(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const currentVal = start + (item.target - start) * easeProgress;

            el.textContent = item.decimals > 0
              ? currentVal.toFixed(item.decimals) + item.suffix
              : Math.floor(currentVal) + item.suffix;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = (item.decimals > 0 ? item.target.toFixed(item.decimals) : item.target) + item.suffix;
            }
          }

          requestAnimationFrame(step);
        });
      }
    }

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init3DParticleAtmosphere();
      initKineticTypography();
      init3DTiltCards();
      initKineticCounters();
    });
  } else {
    init3DParticleAtmosphere();
    initKineticTypography();
    init3DTiltCards();
    initKineticCounters();
  }
})();
