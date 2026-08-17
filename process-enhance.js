(() => {
  const process = document.querySelector('.process');
  if (!process || !document.body.querySelector('.hero')) return;
  const row = process.querySelector('.process-row');
  const stages = [...row.querySelectorAll(':scope > div')];
  const copy = [
    'We listen first: interviews, audits and context reveal what really matters.',
    'We focus the problem into a clear opportunity and a measurable direction.',
    'We explore broadly, test assumptions and find the strongest product idea.',
    'We shape the experience into a focused, useful and beautifully clear interface.',
    'We make the concept tangible, learn quickly and improve with real feedback.',
    'We launch with care, measure the outcome and keep the product moving forward.'
  ];
  const detail = document.createElement('div');
  detail.className = 'process-detail';
  detail.innerHTML = '<strong>01</strong><span></span>';
  row.after(detail);

  let currentIndex = 0;
  let timer = null;
  const INTERVAL_MS = 1400;

  const setActive = (index) => {
    currentIndex = index;
    stages.forEach((stage, position) => stage.classList.toggle('is-active', position === index));
    row.style.setProperty('--progress', `${5 + (index / (stages.length - 1)) * 90}%`);
    detail.querySelector('strong').textContent = String(index + 1).padStart(2, '0');
    detail.querySelector('span').textContent = copy[index];
    detail.classList.remove('show');
    void detail.offsetWidth;
    detail.classList.add('show');
  };

  const startAutoRun = () => {
    stopAutoRun();
    timer = setInterval(() => {
      setActive((currentIndex + 1) % stages.length);
    }, INTERVAL_MS);
  };

  const stopAutoRun = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  stages.forEach((stage, index) => {
    stage.tabIndex = 0;
    stage.setAttribute('role', 'button');
    stage.setAttribute('aria-label', `Explore ${stage.querySelector('b').textContent}`);
    stage.addEventListener('click', () => {
      setActive(index);
      startAutoRun();
    });
    stage.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(index);
        startAutoRun();
      }
    });
  });

  process.addEventListener('mouseenter', stopAutoRun);
  process.addEventListener('mouseleave', startAutoRun);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRun();
    } else {
      startAutoRun();
    }
  });

  setActive(0);
  startAutoRun();
})();

