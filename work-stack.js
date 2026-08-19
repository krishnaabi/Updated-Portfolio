/**
 * ═══════════════════════════════════════════════════════════════
 * WORK PAGE — STICKY STACKING CARDS SMOOTH ANIMATION ENGINE
 * ═══════════════════════════════════════════════════════════════
 * High-performance 60/120fps scroll-driven physical depth engine.
 * Computes progressive scale, ambient depth shadows, and scrims
 * as subsequent showcase cards stack smoothly over preceding cards.
 */

(() => {
  if (typeof window === 'undefined') return;

  let isListening = false;
  let isTicking = false;

  function getCards() {
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) return [];
    return Array.from(projectsContainer.querySelectorAll('.work-showcase-card'));
  }

  function updateStackPhysics() {
    const cards = getCards();
    if (!cards.length) {
      isTicking = false;
      return;
    }

    const totalCards = cards.length;
    const isMobile = window.innerWidth <= 820;

    // Base sticky top offset for the 1st card
    const baseStickyTop = isMobile ? 60 : 85;
    const staggerGap = isMobile ? 12 : 20;

    for (let i = 0; i < totalCards; i++) {
      const currentCard = cards[i];
      let stackDepth = 0; // Total cumulative overlap progress from all cards above it

      // Check how much subsequent cards (i + 1, i + 2, ...) have stacked over currentCard
      for (let j = i + 1; j < totalCards; j++) {
        const nextCard = cards[j];
        const nextCardRect = nextCard.getBoundingClientRect();
        const targetStickyY = baseStickyTop + (j * staggerGap);

        // Distance from next card's top to its target sticky position
        const dist = nextCardRect.top - targetStickyY;
        const transitionRange = Math.min(window.innerHeight * 0.7, currentCard.offsetHeight || 550);

        if (dist <= 0) {
          stackDepth += 1.0;
        } else if (dist < transitionRange) {
          const rawProgress = (transitionRange - dist) / transitionRange;
          // Smooth cubic easing
          const smoothP = rawProgress < 0.5
            ? 4 * rawProgress * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
          stackDepth += smoothP;
        }
      }

      // Scale factor: scale down ~4.5% per stacked layer (down to 0.88 min)
      const maxScaleReduction = isMobile ? 0.035 : 0.045;
      const currentScale = Math.max(1 - (stackDepth * maxScaleReduction), 0.88);
      
      // Slight vertical parallax lift as cards stack
      const translateY = Math.max(-stackDepth * (isMobile ? 2 : 4), -16);

      // Ambient lighting & brightness
      const brightness = Math.max(1 - (stackDepth * 0.04), 0.91);
      const scrimOpacity = Math.min(stackDepth * 0.15, 0.4);
      const shadowBlur = 35 + Math.min(stackDepth * 18, 45);
      const shadowSpread = 12 + Math.min(stackDepth * 6, 16);

      // Apply via custom CSS properties for butter-smooth rendering
      currentCard.style.setProperty('--stack-scale', currentScale.toFixed(4));
      currentCard.style.setProperty('--stack-translate-y', `${translateY.toFixed(1)}px`);
      currentCard.style.setProperty('--stack-brightness', brightness.toFixed(3));
      currentCard.style.setProperty('--stack-scrim-opacity', scrimOpacity.toFixed(3));
      currentCard.style.setProperty('--stack-shadow-blur', `${shadowBlur}px`);
      currentCard.style.setProperty('--stack-shadow-spread', `${shadowSpread}px`);
    }

    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(updateStackPhysics);
      isTicking = true;
    }
  }

  function onResize() {
    updateStackPhysics();
  }

  function initWorkStackingCards() {
    const cards = getCards();
    if (!cards.length) return;

    // 1. Assign CSS Variables & Data Attributes to all cards
    cards.forEach((card, idx) => {
      card.style.setProperty('--card-index', idx);
      card.style.setProperty('--card-total', cards.length);
      card.dataset.cardIndex = idx;
    });

    // 2. Attach global event listeners once
    if (!isListening) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      isListening = true;
    }

    // 3. Trigger immediate physics update
    updateStackPhysics();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateStackPhysics);
    }
  }

  // Expose global initializer
  window.initWorkStackingCards = initWorkStackingCards;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkStackingCards);
  } else {
    initWorkStackingCards();
  }

  // Backup trigger after initial rendering cycle
  setTimeout(initWorkStackingCards, 150);
  setTimeout(initWorkStackingCards, 500);
})();
