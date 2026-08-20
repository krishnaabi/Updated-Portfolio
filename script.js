// Force Page to Always Open at Top (0,0) on Refresh / Reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Ultra-Smooth Section Navigation Rail Engine
function initSmoothSectionRail() {
  const railContainers = document.querySelectorAll('.side-index, .about-index');
  if (!railContainers.length) return;

  railContainers.forEach((rail) => {
    const navItems = [...rail.querySelectorAll('a')];
    if (!navItems.length) return;

    // 1. Inject or reuse track & floating indicator dot
    let track = rail.querySelector('.rail-track');
    let fill = rail.querySelector('.rail-track-fill');
    let dot = rail.querySelector('.rail-indicator-dot');

    if (!track) {
      track = document.createElement('div');
      track.className = 'rail-track';
      fill = document.createElement('div');
      fill.className = 'rail-track-fill';
      track.appendChild(fill);
      rail.prepend(track);
    }
    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'rail-indicator-dot';
      rail.appendChild(dot);
    }

    // 2. Map links to existing sections
    const sectionMap = navItems.map((item) => {
      const href = item.getAttribute('href');
      const target = href && href.startsWith('#') ? document.querySelector(href) : null;
      return { item, target, id: href ? href.slice(1) : '' };
    }).filter((entry) => entry.target);

    if (!sectionMap.length) return;

    let activeIndex = -1;
    let isClickScrolling = false;
    let clickScrollTimer = null;

    // Layout calibration: position track line exactly between first and last numbers
    const updateRailTrackGeometry = () => {
      if (!sectionMap.length || !track) return;
      const firstLink = sectionMap[0].item;
      const lastLink = sectionMap[sectionMap.length - 1].item;
      const firstNum = firstLink.querySelector('strong, b') || firstLink;
      const lastNum = lastLink.querySelector('strong, b') || lastLink;

      const yFirst = firstLink.offsetTop + firstNum.offsetTop + (firstNum.offsetHeight / 2);
      const yLast = lastLink.offsetTop + lastNum.offsetTop + (lastNum.offsetHeight / 2);

      track.style.top = `${Math.round(yFirst)}px`;
      track.style.height = `${Math.max(0, Math.round(yLast - yFirst))}px`;
    };

    const setRailDot = (index) => {
      if (index < 0 || index >= sectionMap.length) return;
      activeIndex = index;

      navItems.forEach((link, idx) => {
        link.classList.toggle('active', idx === index);
      });

      const activeLink = sectionMap[index].item;
      const numEl = activeLink.querySelector('strong, b') || activeLink;
      const dotH = dot.offsetHeight || 13;

      // Pure layout offsetTop (immune to html zoom / viewport scaling)
      const targetCenterY = activeLink.offsetTop + numEl.offsetTop + (numEl.offsetHeight / 2);
      const targetDotY = targetCenterY - (dotH / 2);

      dot.style.setProperty('--dot-y', `${Math.round(targetDotY)}px`);

      // Track progress fill
      if (fill && sectionMap.length > 1) {
        const firstLink = sectionMap[0].item;
        const lastLink = sectionMap[sectionMap.length - 1].item;
        const firstNum = firstLink.querySelector('strong, b') || firstLink;
        const lastNum = lastLink.querySelector('strong, b') || lastLink;
        const yFirst = firstLink.offsetTop + firstNum.offsetTop + (firstNum.offsetHeight / 2);
        const yLast = lastLink.offsetTop + lastNum.offsetTop + (lastNum.offsetHeight / 2);
        const totalDist = yLast - yFirst;

        if (totalDist > 0) {
          const currentDist = targetCenterY - yFirst;
          const pct = Math.min(Math.max((currentDist / totalDist) * 100, 0), 100);
          fill.style.height = `${pct.toFixed(1)}%`;
        }
      }
    };

    function getSectionContentTop(target) {
      if (!target) return 0;
      const contentEl = target.querySelector(
        '.about-intro, .bento-showcase, .bento-top-row, .bento-title-block, .story-container, .story-header-group, .runway-meta-badge, .runway-title, .belief-header, .belief-title-group, .skills-col, .column-heading, .beyond-left-col, .beyond-main-heading, :scope > .section-heading, :scope > h2, .section-title, .work-hero'
      ) || target;
      return window.scrollY + contentEl.getBoundingClientRect().top;
    }

    // Smooth section spy on scroll
    const updateSpy = () => {
      if (isClickScrolling) return;

      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const isAtBottom = (winHeight + scrollY) >= (docHeight - 60);

      if (isAtBottom) {
        if (activeIndex !== sectionMap.length - 1) {
          setRailDot(sectionMap.length - 1);
        }
        return;
      }

      const triggerY = scrollY + 140;
      let matchedIndex = 0;

      for (let i = 0; i < sectionMap.length; i++) {
        const sectionTop = getSectionContentTop(sectionMap[i].target);
        if (sectionTop <= triggerY) {
          matchedIndex = i;
        }
      }

      if (matchedIndex !== activeIndex) {
        setRailDot(matchedIndex);
      }
    };

    // Nav click interaction - brings target content headline properly to the top
    sectionMap.forEach((entry, idx) => {
      entry.item.addEventListener('click', (e) => {
        const href = entry.item.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = entry.target;
        if (!target) return;

        e.preventDefault();
        isClickScrolling = true;
        setRailDot(idx);

        clearTimeout(clickScrollTimer);
        clickScrollTimer = setTimeout(() => {
          isClickScrolling = false;
        }, 750);

        if (idx === 0) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }

        const contentTop = getSectionContentTop(target);
        const topClearance = 85; // Clean top margin below fixed header
        const targetScrollY = Math.max(0, Math.round(contentTop - topClearance));

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      });
    });

    // Throttled scroll with rAF
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          updateSpy();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    const handleResize = () => {
      updateRailTrackGeometry();
      if (activeIndex >= 0) setRailDot(activeIndex);
    };

    window.addEventListener('resize', handleResize);

    // Initial setup with font-load resilience
    requestAnimationFrame(() => {
      updateRailTrackGeometry();
      updateSpy();
      if (activeIndex < 0) setRailDot(0);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleResize);
    }
  });
}

initSmoothSectionRail();

const metricObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.metrics b, .life-stats-grid b').forEach((metric) => {
      const label = metric.textContent.trim();
      const target = parseFloat(label);
      if (isNaN(target)) return; // Guard against NaN for non-numeric symbols like ∞

      const suffix = label.replace(/[\d.]/g, '');
      const decimals = label.includes('.') ? 1 : 0;
      const started = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - started) / 900, 1);
        const current = target * (1 - Math.pow(1 - progress, 3));
        metric.textContent = (decimals ? current.toFixed(decimals) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
        else metric.textContent = label;
      };
      requestAnimationFrame(animate);
    });
    observer.unobserve(entry.target);
  });
}, { threshold: .5 });

document.querySelectorAll('.metrics').forEach((section) => metricObserver.observe(section));

document.querySelector('.menu-button').addEventListener('click', () => {
  const nav = document.querySelector('.site-header nav');
  const opening = !nav.classList.contains('menu-open');
  nav.classList.toggle('menu-open', opening);
  Object.assign(nav.style, opening ? {
    display: 'flex', position: 'absolute', top: '75px', left: '20px', right: '20px',
    margin: '0', padding: '20px', flexDirection: 'column', gap: '16px', background: '#fff',
    border: '1px solid #dfddda', borderRadius: '12px', boxShadow: '0 18px 30px #1111'
  } : { display: '', position: '', top: '', left: '', right: '', margin: '', padding: '', flexDirection: '', gap: '', background: '', border: '', borderRadius: '', boxShadow: '' });
});

const contactModalLoader = document.createElement('script');
contactModalLoader.src = 'contact-modal.js?v=5';
document.body.append(contactModalLoader);

// Featured Works Carousel Logic
window.initFeaturedCarousel = () => {
  // container holds: wrapper (clip+track+progressbar) + controls (sibling)
  const container = document.querySelector('.featured-carousel-container');
  const wrapper = document.querySelector('.featured-carousel-wrapper');
  if (!wrapper) return;
  const track = wrapper.querySelector('.featured-carousel-track');
  if (!track) return;

  // Only actual slides — not the progress bar or other helpers
  const slides = [...track.querySelectorAll('.fc-slide')];
  if (!slides.length) return;

  // Controls live in the container (sibling of wrapper), not inside wrapper
  const root = container || wrapper;
  const prevBtn = root.querySelector('.carousel-prev');
  const nextBtn = root.querySelector('.carousel-next');
  const dotsContainer = root.querySelector('.carousel-dots');
  const controls = root.querySelector('.carousel-controls');

  if (controls) controls.style.display = slides.length > 1 ? 'flex' : 'none';

  // Rebuild dots to match actual slide count
  if (dotsContainer) {
    dotsContainer.innerHTML = slides.map((_, i) =>
      `<span class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
    ).join('');
  }
  const dots = [...root.querySelectorAll('.carousel-dot')];

  // Progress bar is pre-rendered inside the wrapper
  const progressBar = wrapper.querySelector('.fc-progress-bar');

  let activeIndex = 0;
  let autoTimer = null;

  const resetProgress = () => {
    if (!progressBar) return;
    progressBar.style.animation = 'none';
    progressBar.offsetWidth; // force reflow
    progressBar.style.animation = '';
    progressBar.classList.remove('running');
    void progressBar.offsetWidth;
    progressBar.classList.add('running');
  };

  const goToSlide = (index) => {
    activeIndex = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
    if (slides.length > 1) resetProgress();
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    if (slides.length > 1) {
      autoTimer = setInterval(() => goToSlide(activeIndex + 1), 4500);
    }
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
    if (progressBar) progressBar.classList.remove('running');
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(activeIndex - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(activeIndex + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startAuto(); }));

  // Pause on hover over the slide area
  wrapper.addEventListener('mouseenter', stopAuto);
  wrapper.addEventListener('mouseleave', startAuto);

  // Swipe / touch
  let tx0 = 0;
  wrapper.addEventListener('touchstart', e => { tx0 = e.changedTouches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const dx = tx0 - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) { goToSlide(activeIndex + (dx > 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

  goToSlide(0);
  startAuto();
};

window.initFeaturedCarousel();

// Testimonial Card Auto Timer Logic
(() => {
  const card = document.querySelector('#testimonial-card');
  if (!card) return;
  let testimonials = [
    {
      quote: "Aarav combines curiosity, empathy and sharp product thinking. He makes complex experiences feel effortless.",
      name: "Sanya Mehra",
      role: "Founder, Noma Health",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "Working with Aarav transformed our product clarity. User activation jumped 45% within two months of launch.",
      name: "Rohan Varma",
      role: "VP Product, FinScale",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "A rare talent who bridges design, business strategy and engineering seamlessly. Exceptional craft and velocity.",
      name: "Elena Rostova",
      role: "Design Director, Studio Nova",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
    }
  ];
  let tIndex = 0;
  let timerId = null;

  const updateDisplay = (item) => {
    if (!item) return;
    const p = card.querySelector('p');
    const img = card.querySelector('.person img');
    const b = card.querySelector('.person b');
    const small = card.querySelector('.person small');
    if (p) p.textContent = item.quote;
    if (img) img.src = item.img || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80';
    if (b) b.textContent = item.name;
    if (small) small.textContent = item.role;
  };

  const startLoop = () => {
    if (timerId) clearInterval(timerId);
    if (testimonials.length <= 1) return;
    timerId = setInterval(() => {
      tIndex = (tIndex + 1) % testimonials.length;
      const current = testimonials[tIndex];
      card.classList.add('fade-out');
      setTimeout(() => {
        updateDisplay(current);
        card.classList.remove('fade-out');
      }, 380);
    }, 3500);
  };

  const loadTestimonials = async () => {
    try {
      let res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          testimonials = data;
          tIndex = 0;
          updateDisplay(testimonials[0]);
          return;
        }
      }
      // Static fallback
      res = await fetch('data.json');
      if (res.ok) {
        const staticData = await res.json();
        if (Array.isArray(staticData.testimonials) && staticData.testimonials.length) {
          testimonials = staticData.testimonials;
          tIndex = 0;
          updateDisplay(testimonials[0]);
        }
      }
    } catch (e) {}
  };

  loadTestimonials();
  startLoop();
})();

// Trusted Brands Marquee Renderer
(() => {
  const marqueeTrack = document.querySelector('.trusted-marquee-track');
  if (!marqueeTrack) return;

  const escapeHtml = str => String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);

  const defaultBrandsList = [
    { id: 'b1', name: 'HANIOO' },
    { id: 'b2', name: 'FLUBN' },
    { id: 'b3', name: 'FINSCALE' },
    { id: 'b4', name: 'PORTAGAM' },
    { id: 'b5', name: 'G-FORCE' },
    { id: 'b6', name: 'STUDIO NOVA' }
  ];

  const renderBrands = (brands) => {
    const list = Array.isArray(brands) && brands.length ? brands : defaultBrandsList;
    const renderCard = b => {
      const content = b.logo
        ? `<img src="${escapeHtml(b.logo)}" alt="${escapeHtml(b.name)}" class="brand-logo-img">`
        : `<div class="brand-text-badge"><span class="brand-icon">✦</span> <span>${escapeHtml(b.name)}</span></div>`;
      return `<div class="trusted-brand-card">${content}</div>`;
    };
    const repeated = [...list, ...list, ...list, ...list, ...list];
    marqueeTrack.innerHTML = repeated.map(renderCard).join('');
  };

  const loadBrands = async () => {
    try {
      let res = await fetch('/api/brands');
      if (res.ok) {
        const brands = await res.json();
        if (Array.isArray(brands) && brands.length) {
          renderBrands(brands);
          return;
        }
      }
      res = await fetch('data.json');
      if (res.ok) {
        const staticData = await res.json();
        if (Array.isArray(staticData.brands) && staticData.brands.length) {
          renderBrands(staticData.brands);
          return;
        }
      }
      renderBrands(defaultBrandsList);
    } catch (e) {
      renderBrands(defaultBrandsList);
    }
  };

  loadBrands();
})();

// Animated Scroll Number Counters for Stats Section
(() => {
  const statContainers = document.querySelectorAll('.metrics, .life-stats');
  if (!statContainers.length) return;

  const animateCount = (el) => {
    const originalText = el.getAttribute('data-original') || el.textContent.trim();
    if (!el.hasAttribute('data-original')) {
      el.setAttribute('data-original', originalText);
    }
    const match = originalText.match(/^([\d\.]+)(.*)$/);
    if (!match) return;

    const targetVal = parseFloat(match[1]);
    const suffix = match[2] || '';
    const isDecimal = originalText.includes('.');
    const duration = 1800; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic function for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetVal * easeProgress;

      el.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = originalText;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        entry.target.querySelectorAll('b').forEach(el => animateCount(el));
      }
    });
  }, { threshold: 0.25 });

  statContainers.forEach(container => observer.observe(container));
})();

// Footer Arrow Smooth Scroll to Top / Hero
document.querySelectorAll('.big-arrow').forEach((arrow) => {
  arrow.addEventListener('click', (e) => {
    const target = document.querySelector('#home') || document.querySelector('#top') || document.body;
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// Render Footer Social Links & Dynamic Email / Resume from Settings
(async () => {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const settings = await res.json();

    // Helper function to apply color filter safely
    const applyColorFilter = (elements, mode, defaultMode = 'original') => {
      const activeMode = mode || defaultMode;
      let filterVal = 'none';
      if (activeMode === 'gray' || activeMode === 'monochrome' || activeMode === 'classic-gray') {
        filterVal = 'grayscale(100%) contrast(1.1)';
      } else if (activeMode === 'warm-gray' || activeMode === 'warm-vintage' || activeMode === 'vintage') {
        filterVal = 'grayscale(90%) sepia(20%) contrast(1.1)';
      }
      elements.forEach(el => {
        el.style.setProperty('filter', filterVal, 'important');
      });
    };

    // Dynamic Hero Images & Focal Repositioning & Color Modes from Admin Settings
    if (settings.homeHeroImage) {
      document.querySelectorAll('.portrait-wrap img, .hero-visual img').forEach(img => {
        img.src = settings.homeHeroImage;
        if (settings.homeHeroPosition) img.style.setProperty('object-position', settings.homeHeroPosition, 'important');
      });
    }
    applyColorFilter(document.querySelectorAll('.portrait-wrap img, .hero-visual img'), settings.homeHeroColorMode, 'original');

    if (settings.homeCenterImage) {
      document.querySelectorAll('.about-image img').forEach(img => {
        img.src = settings.homeCenterImage;
        if (settings.homeCenterPosition) img.style.setProperty('object-position', settings.homeCenterPosition, 'important');
      });
    }
    applyColorFilter(document.querySelectorAll('.about-image img'), settings.homeCenterColorMode, 'gray');

    if (settings.aboutHeroImage) {
      document.querySelectorAll('.about-portrait img').forEach(img => {
        img.src = settings.aboutHeroImage;
        if (settings.aboutHeroPosition) img.style.setProperty('object-position', settings.aboutHeroPosition, 'important');
      });
    }
    applyColorFilter(document.querySelectorAll('.about-portrait img'), settings.aboutHeroColorMode, 'original');

    if (settings.workHeroImage) {
      document.querySelectorAll('#work-hero-img, .work-hero-visual img, .work-hero img').forEach(workImg => {
        workImg.src = settings.workHeroImage;
        workImg.style.display = 'block';
        if (settings.workHeroPosition) workImg.style.setProperty('object-position', settings.workHeroPosition, 'important');
      });
    }
    applyColorFilter(document.querySelectorAll('#work-hero-img, .work-hero-visual img, .work-hero img'), settings.workHeroColorMode, 'original');

    if (settings.playgroundHeroImage) {
      document.querySelectorAll('#pg-hero-img, .pg-hero-visual img, .pg-hero img, .playground-hero img').forEach(pgImg => {
        pgImg.src = settings.playgroundHeroImage;
        pgImg.style.display = 'block';
        if (settings.playgroundHeroPosition) pgImg.style.setProperty('object-position', settings.playgroundHeroPosition, 'important');
      });
    }
    applyColorFilter(document.querySelectorAll('#pg-hero-img, .pg-hero-visual img, .pg-hero img, .playground-hero img'), settings.playgroundHeroColorMode, 'original');

    if (settings.journalHeroImage) {
      document.querySelectorAll('#journal-hero-img, .journal-hero-visual img, .journal-hero img').forEach(journalImg => {
        journalImg.src = settings.journalHeroImage;
        journalImg.style.display = 'block';
        if (settings.journalHeroPosition) journalImg.style.setProperty('object-position', settings.journalHeroPosition, 'important');
      });
    }
    applyColorFilter(document.querySelectorAll('#journal-hero-img, .journal-hero-visual img, .journal-hero img'), settings.journalHeroColorMode, 'original');




    // Contact Email & CV Link
    document.querySelectorAll('#footer-email-link').forEach(emailLink => {
      if (settings.email) {
        emailLink.href = `mailto:${settings.email}`;
        emailLink.innerHTML = `<span>✉</span>${settings.email}`;
      }
    });

    document.querySelectorAll('#footer-cv-link, a.resume, .download-cv-btn').forEach(cvLink => {
      if (settings.resumeUrl) {
        cvLink.href = settings.resumeUrl;
        cvLink.target = '_blank';
        cvLink.setAttribute('download', '');
      }
    });



    // Social Links Container
    const socialContainer = document.querySelector('#footer-social-links');
    if (socialContainer) {
      const svgIcons = {
        linkedin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
        behance: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7.7 11.2c1.2 0 2-.6 2-1.7 0-1-.8-1.5-1.8-1.5H3.5v3.2h4.2zm.3 3.3c1.4 0 2.3-.7 2.3-1.8 0-1.2-1-1.8-2.3-1.8H3.5v3.6H8zm9.5-1.8c0-1.8-1.3-3.2-3.1-3.2-1.9 0-3.3 1.5-3.3 3.3 0 1.9 1.4 3.4 3.4 3.4 1.5 0 2.6-.8 3-2.1h-1.6c-.3.6-.8.9-1.4.9-1 0-1.7-.6-1.8-1.6h4.8v-.6zm-4.7-.8c.1-.8.7-1.3 1.6-1.3.8 0 1.4.5 1.5 1.3h-3.1zM13 7.8h3.6v.9H13v-.9zM0 5.4h8.3c2.4 0 4.1 1.2 4.1 3.2 0 1.2-.6 2.2-1.6 2.7 1.4.5 2.1 1.6 2.1 3.1 0 2.3-1.9 3.8-4.6 3.8H0V5.4z"/></svg>',
        instagram: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
        dribbble: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/></svg>',
        twitter: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        youtube: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>'
      };

      const links = [];
      if (settings.socialLinkedIn && settings.socialLinkedIn.trim()) links.push({ name: 'LinkedIn', url: settings.socialLinkedIn.trim(), icon: svgIcons.linkedin });
      if (settings.socialBehance && settings.socialBehance.trim()) links.push({ name: 'Behance', url: settings.socialBehance.trim(), icon: svgIcons.behance });
      if (settings.socialInstagram && settings.socialInstagram.trim()) links.push({ name: 'Instagram', url: settings.socialInstagram.trim(), icon: svgIcons.instagram });
      if (settings.socialDribbble && settings.socialDribbble.trim()) links.push({ name: 'Dribbble', url: settings.socialDribbble.trim(), icon: svgIcons.dribbble });
      if (settings.socialTwitter && settings.socialTwitter.trim()) links.push({ name: 'Twitter / X', url: settings.socialTwitter.trim(), icon: svgIcons.twitter });
      if (settings.socialYoutube && settings.socialYoutube.trim()) links.push({ name: 'YouTube', url: settings.socialYoutube.trim(), icon: svgIcons.youtube });

      // Fallback defaults if none configured yet
      if (!links.length) {
        links.push(
          { name: 'LinkedIn', url: 'https://linkedin.com', icon: svgIcons.linkedin },
          { name: 'Behance', url: 'https://behance.net', icon: svgIcons.behance },
          { name: 'Instagram', url: 'https://instagram.com', icon: svgIcons.instagram }
        );
      }

      socialContainer.innerHTML = links.map(item => `
        <a class="social-link-pill" href="${item.url}" target="_blank" rel="noopener noreferrer">
          ${item.icon}
          <span>${item.name}</span>
        </a>
      `).join('');
    }
  } catch {}
})();

/* =====================================================
   World-Class AK Brand Minimal Intro & Single-Session Preloader
   ===================================================== */
(() => {
  const SESSION_KEY = 'ak_intro_seen_v1';

  // Check if current page is non-homepage (Work, About, Blog, Playground, Admin)
  const pathname = (window.location.pathname || '').toLowerCase();
  const isInnerPage = pathname.includes('work.html') ||
                      pathname.includes('about.html') ||
                      pathname.includes('blog.html') ||
                      pathname.includes('playground.html') ||
                      pathname.includes('admin.html');
  const isHomePage = !isInnerPage;

  let hasSeenIntro = false;
  try {
    hasSeenIntro = sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    hasSeenIntro = false;
  }

  const bypassIntro = () => {
    document.documentElement.classList.remove('ak-intro-active');
    const curtain = document.getElementById('ak-intro-curtain');
    if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
    const targetHeaderLogo = document.querySelector('.site-header .brand-logo-img') || document.querySelector('.site-header .logo img') || document.querySelector('.site-header .logo');
    if (targetHeaderLogo) {
      targetHeaderLogo.style.opacity = '1';
    }
  };

  // If not homepage or already seen, immediately bypass intro and never show curtain
  if (!isHomePage || hasSeenIntro) {
    try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch {}
    bypassIntro();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bypassIntro);
    }
    return;
  }

  const initAKLogoIntro = () => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        bypassIntro();
        return;
      }
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {}

    const targetHeaderLogo = document.querySelector('.site-header .brand-logo-img') || document.querySelector('.site-header .logo img') || document.querySelector('.site-header .logo');
    if (!targetHeaderLogo) return;

    // Immediately hide target logo during preloader
    targetHeaderLogo.style.opacity = '0';

    let curtain = document.getElementById('ak-intro-curtain');
    let introImg = document.getElementById('ak-intro-img');

    if (!curtain) {
      curtain = document.createElement('div');
      curtain.id = 'ak-intro-curtain';
      curtain.innerHTML = `
        <div id="ak-intro-shimmer-wrap">
          <div class="ak-logo-halo"></div>
          <img src="assets/ak-logo-exact.png" alt="AK." id="ak-intro-img" />
          <div class="ak-shimmer-sheen"></div>
          <div class="ak-shimmer-secondary"></div>
        </div>
      `;
      document.body.prepend(curtain);
      introImg = curtain.querySelector('#ak-intro-img');
    }

    const getTargetLogoRect = () => {
      const img = document.querySelector('.site-header .brand-logo-img') || document.querySelector('.site-header .logo img');
      if (img) {
        const r = img.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && (r.left > 0 || r.top > 0)) {
          return r;
        }
      }
      const anchor = document.querySelector('.site-header .logo') || document.querySelector('.site-header a.logo');
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && (r.left > 0 || r.top > 0)) {
          return r;
        }
      }
      const header = document.querySelector('.site-header');
      if (header) {
        const hr = header.getBoundingClientRect();
        return {
          left: hr.left + 40,
          top: hr.top + (hr.height > 0 ? (hr.height - 50) / 2 : 27),
          width: 80,
          height: 50
        };
      }
      return { left: 40, top: 27, width: 80, height: 50 };
    };

    const startSequence = () => {
      // 1. Reveal in Dead-Center + Elegant Shimmer Pass (0ms -> 2400ms)
      requestAnimationFrame(() => {
        curtain.classList.add('active');
      });

      // 2. Smooth Morph Glide from Center to Header Logo (2400ms -> 3320ms)
      setTimeout(() => {
        curtain.classList.add('gliding');

        // Measure bounding rects after overflow:visible is active
        const iRect = introImg.getBoundingClientRect();
        const tRect = getTargetLogoRect();

        if (iRect.width > 0 && iRect.height > 0 && tRect && tRect.height > 0) {
          const iCX = iRect.left + iRect.width / 2;
          const iCY = iRect.top + iRect.height / 2;

          const tCX = tRect.left + tRect.width / 2;
          const tCY = tRect.top + tRect.height / 2;

          const rawDx = tCX - iCX;
          const rawDy = tCY - iCY;
          const scale = tRect.height / iRect.height;

          // Account for CSS zoom on html element so translate3d lands with 100% precision
          const htmlZoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
          const dx = rawDx / htmlZoom;
          const dy = rawDy / htmlZoom;

          introImg.style.transition = 'transform 0.92s cubic-bezier(0.76, 0, 0.24, 1)';
          introImg.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
          curtain.style.background = 'rgba(250, 248, 245, 0)';
        }

        // 3. Handshake into Header & Dissolve Overlay
        setTimeout(() => {
          targetHeaderLogo.style.transition = 'opacity 0.35s ease';
          targetHeaderLogo.style.opacity = '1';
          curtain.style.opacity = '0';

          setTimeout(() => {
            if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
            document.documentElement.classList.remove('ak-intro-active');
          }, 400);
        }, 920);
      }, 2400);
    };

    if (introImg.complete) {
      startSequence();
    } else {
      introImg.onload = startSequence;
      introImg.onerror = () => {
        targetHeaderLogo.style.opacity = '1';
        if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
        document.documentElement.classList.remove('ak-intro-active');
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAKLogoIntro);
  } else {
    initAKLogoIntro();
  }
})();

// Active Navigation Sync (Uniform orange dot on active page)
(() => {
  const initActiveNav = () => {
    const rawPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const currentPath = rawPath.replace('.html', '');
    const navLinks = document.querySelectorAll('.site-header nav a');
    if (!navLinks.length) return;

    navLinks.forEach(link => {
      const rawHref = (link.getAttribute('href') || '').split('/').pop() || '';
      const cleanHref = rawHref.replace('.html', '').toLowerCase();

      if (
        (cleanHref === 'work' && currentPath.includes('work')) ||
        (cleanHref === 'about' && currentPath.includes('about')) ||
        (cleanHref === 'playground' && currentPath.includes('playground')) ||
        ((cleanHref === 'blog' || cleanHref === 'journal') && (currentPath.includes('blog') || currentPath.includes('journal')))
      ) {
        link.classList.add('selected');
      } else if (currentPath && currentPath !== 'index') {
        link.classList.remove('selected');
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActiveNav);
  } else {
    initActiveNav();
  }
})();

// Bento & Story Cards Subtle Interactive Hover Depth
(() => {
  const initInteractiveDepthCards = () => {
    const cards = document.querySelectorAll('.bento-card, .story-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const art = card.querySelector('.art-svg, .story-art-svg');
        if (art) {
          art.style.transform = `scale(1.06) translate(${(x - centerX) * 0.025}px, ${(y - centerY) * 0.025}px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        const art = card.querySelector('.art-svg, .story-art-svg');
        if (art) {
          art.style.transform = '';
        }
      });
    });

    // Principle Cards 3D Interactive Polish
    const principleCards = document.querySelectorAll('.principle-card');
    principleCards.forEach(pCard => {
      pCard.addEventListener('mousemove', e => {
        const rect = pCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        pCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        
        const badge = pCard.querySelector('.card-floating-badge, .card-hero-num-badge');
        if (badge) {
          badge.style.transform = `scale(1.12) translate(${(x - centerX) * 0.06}px, ${(y - centerY) * 0.06}px)`;
        }
      });

      pCard.addEventListener('mouseleave', () => {
        pCard.style.transform = '';
        const badge = pCard.querySelector('.card-floating-badge, .card-hero-num-badge');
        if (badge) {
          badge.style.transform = '';
        }
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveDepthCards);
  } else {
    initInteractiveDepthCards();
  }
})();

