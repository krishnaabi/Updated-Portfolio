(() => {
  if (window.__ABIKRISHNA_CONTENT_RENDER_INIT__) return;
  window.__ABIKRISHNA_CONTENT_RENDER_INIT__ = true;

  const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  const parts = item => (item.category || 'work|main|Product Design').split('|');
  const typeOf = item => parts(item)[0] || 'work';
  const sectionOf = item => parts(item)[1] || 'main';
  const categoryOf = item => parts(item).slice(2).join('|') || parts(item)[1] || 'Product Design';

  const isWorkType = item => {
    const cat = (item.category || '').toLowerCase();
    const type = cat.split('|')[0];
    return type === 'work' || (!['playground', 'journal'].includes(type) && !cat.includes('playground') && !cat.includes('journal'));
  };

  const cleanImgUrl = url => {
    if (!url) return '';
    const str = String(url).trim();
    if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://')) return str;
    if (str.startsWith('/uploads/') || str.startsWith('uploads/')) {
      const cleanPath = str.startsWith('/') ? str : `/${str}`;
      if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '4173')) {
        return `http://127.0.0.1:4173${cleanPath}`;
      }
      return cleanPath;
    }
    return str;
  };

  const card = item => {
    const cat = categoryOf(item);
    const className = { 'Concepts': 'concept', 'UI Explorations': 'ui', 'UI & Motion': 'ui', '3D & Visuals': '3d', 'Animations': 'animation', 'Other': 'other' }[cat] || 'other';
    const article = document.createElement('article');
    article.className = `play-card ${className} reveal visible cms-injected-item`;
    article.dataset.category = cat.toLowerCase();
    article.dataset.id = item.id || '';
    article.innerHTML = `<a href="${escape(item.url || '#')}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} class="cms-link"><div class="card-art cms-art">${item.image ? `<img src="${escape(cleanImgUrl(item.image))}" alt="${escape(item.title)}">` : '<strong>✦</strong>'}</div><div class="card-text"><small>${escape(cat)}</small><h3>${escape(item.title)}</h3><p>${escape(item.description || 'Dashboard concept exploring dark mode data visualization and micro charts.')}</p><div class="card-link-row">View Exploration <b>↗</b></div></div></a>`;
    return article;
  };


  // Default Curated Fallback Datasets (Ensures 100% beautiful rendering on static hosts like Cloudflare Pages)
  const defaultWorkItems = [
    {
      id: 'w1',
      title: 'Flubn.',
      subtitle: 'An influencer Platform',
      category: 'work|main|PRODUCT DESIGN',
      description: 'Flubn connects brands and creators in one seamless platform — discover, collaborate and grow impact together.',
      url: 'https://flubn.com',
      productUrl: 'https://flubn.com',
      image: '',
      featured: true,
      tags: 'Product | 2025 - 2026 | APP',
      tools: 'Figma | Next.js | Tailwind | Microcharts'
    },
    {
      id: 'w2',
      title: 'Hanioo.',
      subtitle: 'Real-Time Interpreter Marketplace',
      category: 'work|main|PRODUCT DESIGN',
      description: 'An on-demand interpreter booking ecosystem connecting global clients with certified multi-lingual specialists in under 30 seconds.',
      url: 'https://www.behance.net/gallery/248442393/Hanioo-Interpretation-Application',
      productUrl: 'https://hanioo.com',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=95',
      featured: true,
      tags: 'Product | 2024 - 2025 | Mobile & Web',
      tools: 'Figma | React Native | WebSockets'
    },
    {
      id: 'w3',
      title: 'FinScale.',
      subtitle: 'Enterprise Liquidity Analytics',
      category: 'work|main|FINTECH PRODUCT',
      description: 'High-density financial analytics platform engineered for portfolio managers, tracking real-time asset flows and predictive yields.',
      url: 'https://behance.net',
      productUrl: '',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=95',
      featured: true,
      tags: 'Product | 2024 | Web Dashboard',
      tools: 'Figma | D3.js | Design Tokens'
    },
    {
      id: 'w4',
      title: 'Portagam.',
      subtitle: 'Digital Asset Exchange',
      category: 'work|main|DESIGN SYSTEMS',
      description: 'A curated marketplace and collaborative workspace for 3D artists, UI creators, and digital brand designers.',
      url: 'https://dribbble.com',
      productUrl: '',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=95',
      featured: false,
      tags: 'Design System | 2023 - 2024 | Web App',
      tools: 'Figma | Three.js | Token Engine'
    }
  ];

  const defaultPlaygroundItems = [
    {
      id: 'pg-1',
      title: 'Spatial Canvas Nodes — Dynamic Node-Graph Interface',
      category: 'playground|experiments|UI & Motion',
      description: 'An infinite zoomable node canvas exploring fluid connection physics, magnetic bezier curves, and gesture panning.',
      url: 'https://dribbble.com',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pg-2',
      title: 'Dark Mode Data Flow — Kinetic Financial Charts',
      category: 'playground|experiments|Concepts',
      description: 'Interactive telemetry telemetry charts with custom shader glow and real-time candlestick rendering.',
      url: 'https://dribbble.com',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pg-3',
      title: 'Orbital 3D Particle Constellation Engine',
      category: 'playground|experiments|3D & Visuals',
      description: 'WebGL atmospheric depth simulator with mouse parallax, inertia drift, and champagne particle physics.',
      url: 'https://dribbble.com',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pg-4',
      title: 'Tactile Haptic Sliders & Fluid Spring Physics',
      category: 'playground|experiments|UI & Motion',
      description: 'Micro-interaction study experimenting with spring damping, velocity inertia, and audio-haptic feedback cues.',
      url: 'https://dribbble.com',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pg-5',
      title: 'Proactive AI Workspace Canvas',
      category: 'playground|experiments|Concepts',
      description: 'Exploration of human-in-the-loop AI interaction cards that anticipate intent based on viewport context.',
      url: 'https://dribbble.com',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pg-6',
      title: 'Glassmorphic HUD Control Suite',
      category: 'playground|experiments|3D & Visuals',
      description: 'Multi-layered frosted glass panels with dynamic background diffraction and chromatic aberration.',
      url: 'https://dribbble.com',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80'
    },
    { id: 'sk-1', title: 'Spatial Grid Layout', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-2', title: 'Gestural Radial Menu', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-3', title: 'Dynamic Island HUD', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-4', title: 'Card Stack Depth', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-5', title: 'Variable Type Shifter', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-6', title: 'Tactile Rotary Dial', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-7', title: 'Generative Palette Mix', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80' },
    { id: 'sk-8', title: 'Neo-brutalist Toggles', category: 'playground|sketches|Sketches', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80' },
    { id: 'fn-1', title: 'Cyberpunk Synth Dashboard', category: 'playground|fun|Just for Fun', description: '80s retro-futurism synth wave visualizer.', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
    { id: 'fn-2', title: 'Isometric Clay Scene 3D', category: 'playground|fun|Just for Fun', description: 'A cozy minimalist isometric workspace study.', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
    { id: 'fn-3', title: 'Fluid Liquid Blob Physics', category: 'playground|fun|Just for Fun', description: 'Interactive metaball fluid dynamics with cursor repulsion.', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80' },
    { id: 'fn-4', title: 'Mechanical Switch Exploded View', category: 'playground|fun|Just for Fun', description: '3D mechanical engineering disassembly visualization.', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80' },
    { id: 'fn-5', title: 'Vintage Braun Radio Simulator', category: 'playground|fun|Just for Fun', description: 'Dieter Rams-inspired physical radio tuner interaction.', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80' },
    { id: 'fn-6', title: 'Holographic HUD with Gyro Tilt', category: 'playground|fun|Just for Fun', description: '3D gyroscope-driven holographic depth card.', url: 'https://dribbble.com', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' }
  ];

  const defaultMilestones = [
    {
      id: 'm1',
      title: 'Hanioo Launch Event & Stage Pitch',
      category: '🎤 STAGE KEYNOTE PRESENTATION',
      year: '2025',
      eventLocation: 'CHENNAI TECH SUMMIT',
      summary: 'Presented the product UX strategy, real-time interpreter booking architecture, and component design system live to an audience of tech founders and industry leaders.',
      spec1Label: '🎤 AUDIENCE',
      spec1Value: '500+ Attendees',
      spec2Label: '🚀 STAGE DEMO',
      spec2Value: 'Live Dispatch UX',
      spec3Label: '📱 PLATFORM',
      spec3Value: 'iOS, Web & Android',
      url: 'https://www.behance.net/gallery/248442393/Hanioo-Interpretation-Application',
      buttonText: 'Watch Keynote Deck',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=95'
    },
    {
      id: 'm2',
      title: 'Hanioo Platform Marketplace Shipped',
      category: '🚀 GLOBAL PRODUCT LAUNCH',
      year: '2025',
      eventLocation: 'SHIPPED TO APP STORE',
      summary: 'Architected and launched the full-scale interpreter booking ecosystem across iOS & Web, empowering on-demand multi-language interpretation assistance globally.',
      spec1Label: '🚀 RELEASES',
      spec1Value: 'iOS & Web Apps',
      spec2Label: '⚡ MATCH TIME',
      spec2Value: 'Under 30 Seconds',
      spec3Label: '🌐 COVERAGE',
      spec3Value: 'Global Dispatch',
      url: 'https://hanioo.com',
      buttonText: 'Explore Live Application',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=95'
    },
    {
      id: 'm4',
      title: 'Design System Token Engine',
      category: '🌐 SYSTEM ARCHITECTURE SHIFT',
      year: '2024',
      eventLocation: 'ENTERPRISE DESIGN TOKENS',
      summary: 'Engineered a unified enterprise design system token engine with automated Figma libraries, responsive guidelines, and dark mode theme switching.',
      spec1Label: '🌐 TOKENS',
      spec1Value: '200+ Components',
      spec2Label: '⚡ VELOCITY',
      spec2Value: '4x Faster Builds',
      spec3Label: '🎨 THEMES',
      spec3Value: 'Light & Dark Modes',
      url: 'work.html',
      buttonText: 'Explore Design System',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=95'
    }
  ];

  const defaultTestimonials = [
    {
      id: 't1',
      name: 'Abi Krishna',
      role: 'Founder, Flubn',
      quote: 'Abi combines curiosity, empathy and sharp product thinking. He makes complex experiences feel effortless.',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 't2',
      name: 'Rohan Varma',
      role: 'VP Product, FinScale',
      quote: 'Working with Abi transformed our product clarity. User activation jumped 45% within two months of launch.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 't3',
      name: 'Elena Rostova',
      role: 'Design Director, Studio Nova',
      quote: 'A rare talent who bridges design, business strategy and engineering seamlessly. Exceptional craft and velocity.',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    }
  ];

  const defaultBrands = [
    { id: 'b1', name: 'HANIOO', logo: '' },
    { id: 'b2', name: 'FLUBN', logo: '' },
    { id: 'b3', name: 'FINSCALE', logo: '' },
    { id: 'b4', name: 'PORTAGAM', logo: '' },
    { id: 'b5', name: 'G-FORCE', logo: '' },
    { id: 'b6', name: 'STUDIO NOVA', logo: '' }
  ];

  const defaultSettings = {
    email: 'hello@abikrishna.design',
    homeStat1Val: '4.5+',
    homeStat1Lbl: 'Years Experience',
    homeStat2Val: '1200+',
    homeStat2Lbl: 'UI Screens Designed',
    homeStat3Val: '20+',
    homeStat3Lbl: 'Digital Products & Brands',
    homeStat4Val: '5+',
    homeStat4Lbl: 'Products Concept to Launch',
    homeStat5Val: '15+',
    homeStat5Lbl: 'Clients & Solutions'
  };

  const getCachedData = path => {
    try {
      const raw = localStorage.getItem('ak_cache_' + path);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  };

  const setCachedData = (path, data) => {
    try {
      if (data) localStorage.setItem('ak_cache_' + path, JSON.stringify(data));
    } catch (e) {}
  };

  const API_BASE_URLS = ['', 'http://127.0.0.1:4173', 'http://localhost:4173'];

  async function apiFetch(path, options = {}) {
    // 1. Try local/Cloudflare backend API endpoint
    for (const base of API_BASE_URLS) {
      try {
        const url = base ? `${base}${path}` : path;
        const res = await fetch(url, options);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json') || res.status === 200) {
            const data = await res.json();
            if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
              setCachedData(path, data);
              return { ok: true, status: 200, json: async () => data, text: async () => JSON.stringify(data) };
            }
          }
        }
      } catch (e) {}
    }

    // 2. Direct Supabase fallback if configured in supabase-config.js
    if ((!options.method || options.method === 'GET') && window.ABIKRISHNA_SUPABASE && window.ABIKRISHNA_SUPABASE.url) {
      try {
        const { url: sbUrl, anonKey } = window.ABIKRISHNA_SUPABASE;
        let table = '';
        if (path === '/api/projects') table = 'portfolio_content?select=*&order=display_order.asc,created_at.desc';
        else if (path === '/api/messages') table = 'contact_messages?select=*&order=created_at.desc';
        else if (path === '/api/testimonials') table = 'portfolio_testimonials?select=*&order=created_at.desc';
        else if (path === '/api/brands') table = 'portfolio_brands?select=*&order=created_at.desc';
        else if (path === '/api/milestones') table = 'portfolio_milestones?select=*&order=display_order.asc,created_at.desc';
        else if (path === '/api/tools') table = 'portfolio_tools?select=*&order=display_order.asc,created_at.asc';
        else if (path === '/api/settings') table = 'portfolio_settings?id=eq.global&select=*';

        if (table) {
          const sbRes = await fetch(`${sbUrl}/rest/v1/${table}`, {
            headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
          });
          if (sbRes.ok) {
            const raw = await sbRes.json();
            let payload = raw;
            if (path === '/api/projects') {
              payload = (raw || []).map(row => ({
                id: row.id,
                title: row.title,
                category: `${row.content_type || 'work'}|${row.section || 'main'}|${row.category || 'Product Design'}`,
                description: row.description || '',
                contentBody: row.content_body || '',
                url: row.destination_url || '',
                productUrl: row.product_url || '',
                image: row.image_url || '',
                featured: Boolean(row.featured),
                tags: row.tags || '',
                tools: row.tools || '',
                readTime: row.read_time || '5 min read',
                platform: row.platform || '',
                journalType: row.journal_type || 'link',
                createdAt: row.created_at
              }));
            } else if (path === '/api/tools') {
              payload = (raw || []).map(row => ({
                id: row.id,
                name: row.name,
                category: row.category || '',
                icon_type: row.icon_type || 'figma',
                custom_icon_url: row.custom_icon_url || '',
                display_order: row.display_order || 0
              }));
            } else if (path === '/api/settings') {
              payload = (Array.isArray(raw) && raw[0] && raw[0].settings) ? raw[0].settings : {};
            }
            if (payload && (Array.isArray(payload) ? payload.length > 0 : Object.keys(payload).length > 0)) {
              setCachedData(path, payload);
              return { ok: true, status: 200, json: async () => payload, text: async () => JSON.stringify(payload) };
            }
          }
        }
      } catch (e) {}
    }

    // 3. Direct Static data.json fallback
    if (!options.method || options.method === 'GET') {
      try {
        const dataRes = await fetch('data.json');
        if (dataRes.ok) {
          const staticData = await dataRes.json();
          if (path === '/api/projects') {
            const allItems = [...(staticData.projects || []), ...(staticData.playground || []), ...(staticData.journal || [])];
            if (allItems.length) return { ok: true, status: 200, json: async () => allItems, text: async () => JSON.stringify(allItems) };
          } else if (path === '/api/settings' && staticData.settings && Object.keys(staticData.settings).length) {
            return { ok: true, status: 200, json: async () => staticData.settings, text: async () => JSON.stringify(staticData.settings) };
          } else if (path === '/api/milestones' && staticData.milestones && staticData.milestones.length) {
            return { ok: true, status: 200, json: async () => staticData.milestones, text: async () => JSON.stringify(staticData.milestones) };
          } else if (path === '/api/testimonials' && staticData.testimonials && staticData.testimonials.length) {
            return { ok: true, status: 200, json: async () => staticData.testimonials, text: async () => JSON.stringify(staticData.testimonials) };
          } else if (path === '/api/brands' && staticData.brands && staticData.brands.length) {
            return { ok: true, status: 200, json: async () => staticData.brands, text: async () => JSON.stringify(staticData.brands) };
          } else if (path === '/api/tools' && staticData.tools && staticData.tools.length) {
            return { ok: true, status: 200, json: async () => staticData.tools, text: async () => JSON.stringify(staticData.tools) };
          }
        }
      } catch (e) {}
    }

    // 4. Default Curated Static Data Fallback (Guaranteed to render completely on static hosting)
    if (path === '/api/projects') {
      const allDefaults = [...defaultWorkItems, ...defaultPlaygroundItems, ...defaultJournalArticles];
      return { ok: true, status: 200, json: async () => allDefaults, text: async () => JSON.stringify(allDefaults) };
    }
    if (path === '/api/milestones') {
      return { ok: true, status: 200, json: async () => defaultMilestones, text: async () => JSON.stringify(defaultMilestones) };
    }
    if (path === '/api/testimonials') {
      return { ok: true, status: 200, json: async () => defaultTestimonials, text: async () => JSON.stringify(defaultTestimonials) };
    }
    if (path === '/api/brands') {
      return { ok: true, status: 200, json: async () => defaultBrands, text: async () => JSON.stringify(defaultBrands) };
    }
    if (path === '/api/settings') {
      return { ok: true, status: 200, json: async () => defaultSettings, text: async () => JSON.stringify(defaultSettings) };
    }

    return { ok: false, json: async () => (path === '/api/settings' ? defaultSettings : []) };
  }

  // Default fallback articles (empty by default so only user published articles appear)
  const defaultJournalArticles = [];

  function formatStatLabel(rawText) {
    if (!rawText) return '';
    const text = String(rawText).trim();
    if (text.includes('\n')) return escape(text).replace(/\n/g, '<br>');
    if (text.includes('<br')) return text;
    const words = text.split(/\s+/);
    if (words.length === 2) return `${escape(words[0])}<br>${escape(words[1])}`;
    if (words.length === 3) return `${escape(words[0])}<br>${escape(words[1])} ${escape(words[2])}`;
    if (words.length > 3) {
      const mid = Math.ceil(words.length / 2);
      return `${escape(words.slice(0, mid).join(' '))}<br>${escape(words.slice(mid).join(' '))}`;
    }
    return escape(text);
  }

  const applySettingsToPage = data => {
    if (!data) return;
    const map = {
      homeHeroImage: '.portrait-wrap img, .hero-visual img',
      homeCenterImage: '.about-image img',
      aboutHeroImage: '.about-portrait img',
      workHeroImage: '#work-hero-img, .work-hero-visual img, .work-hero img',
      playgroundHeroImage: '#pg-hero-img, .pg-hero-visual img, .pg-hero img, .playground-hero img',
      journalHeroImage: '#journal-hero-img, .journal-hero-visual img, .journal-hero img'
    };
    Object.entries(map).forEach(([key, selector]) => {
      if (data[key]) {
        document.querySelectorAll(selector).forEach(img => {
          img.src = cleanImgUrl(data[key]);
          if (img.style.display === 'none') img.style.display = 'block';
        });
      }
    });

    const posMap = {
      homeHeroPosition: '.portrait-wrap img, .hero-visual img',
      homeCenterPosition: '.about-image img',
      aboutHeroPosition: '.about-portrait img',
      workHeroPosition: '#work-hero-img, .work-hero-visual img, .work-hero img',
      playgroundHeroPosition: '#pg-hero-img, .pg-hero-visual img, .pg-hero img, .playground-hero img',
      journalHeroPosition: '#journal-hero-img, .journal-hero-visual img, .journal-hero img'
    };
    Object.entries(posMap).forEach(([key, selector]) => {
      if (data[key]) {
        document.querySelectorAll(selector).forEach(img => {
          img.style.objectPosition = data[key];
          img.style.objectFit = 'cover';
        });
      }
    });

    const colorMap = {
      homeHeroColorMode: '.portrait-wrap img, .hero-visual img',
      homeCenterColorMode: '.about-image img',
      aboutHeroColorMode: '.about-portrait img',
      workHeroColorMode: '#work-hero-img, .work-hero-visual img, .work-hero img',
      playgroundHeroColorMode: '#pg-hero-img, .pg-hero-visual img, .pg-hero img, .playground-hero img',
      journalHeroColorMode: '#journal-hero-img, .journal-hero-visual img, .journal-hero img'
    };
    Object.entries(colorMap).forEach(([key, selector]) => {
      document.querySelectorAll(selector).forEach(el => {
        const defaultMode = key === 'homeCenterColorMode' ? 'gray' : 'original';
        const mode = data[key] || defaultMode;
        if (mode === 'original') {
          el.style.filter = 'none';
        } else if (mode === 'gray') {
          el.style.filter = 'grayscale(100%) contrast(1.1)';
        } else if (mode === 'warm-gray') {
          el.style.filter = 'grayscale(90%) sepia(20%) contrast(1.1)';
        }
      });
    });

    document.querySelectorAll('a[href^="mailto:"], .contact-links a').forEach(link => {
      if (data.email && (link.href.startsWith('mailto:') || /email/i.test(link.textContent))) {
        link.href = `mailto:${data.email}`;
        if (/email/i.test(link.textContent)) link.innerHTML = `<span>✉</span>${data.email}`;
      }
    });
    document.querySelectorAll('.resume, a[href*="resume"], a[href*="cv"], a[href*="download"]').forEach(link => {
      if (data.resumeUrl) {
        link.href = data.resumeUrl;
        link.target = '_blank';
      }
    });

    if (data.spotlightTitle && document.getElementById('spotlight-title')) document.getElementById('spotlight-title').textContent = data.spotlightTitle;
    if (data.spotlightBadge && document.getElementById('spotlight-badge-text')) document.getElementById('spotlight-badge-text').textContent = data.spotlightBadge;
    if (data.spotlightTagline && document.getElementById('spotlight-tagline')) document.getElementById('spotlight-tagline').textContent = data.spotlightTagline;
    if (data.spotlightDesc && document.getElementById('spotlight-desc')) document.getElementById('spotlight-desc').textContent = data.spotlightDesc;
    if (data.spotlightPrimaryUrl && document.getElementById('spotlight-primary-btn')) document.getElementById('spotlight-primary-btn').href = data.spotlightPrimaryUrl;
    if (data.spotlightSecondaryUrl && document.getElementById('spotlight-secondary-btn')) document.getElementById('spotlight-secondary-btn').href = data.spotlightSecondaryUrl;

    if (data.homeStat1Val && document.getElementById('home-stat1-val')) document.getElementById('home-stat1-val').textContent = data.homeStat1Val;
    if (data.homeStat1Lbl && document.getElementById('home-stat1-lbl')) document.getElementById('home-stat1-lbl').innerHTML = formatStatLabel(data.homeStat1Lbl);

    if (data.homeStat2Val && document.getElementById('home-stat2-val')) document.getElementById('home-stat2-val').textContent = data.homeStat2Val;
    if (data.homeStat2Lbl && document.getElementById('home-stat2-lbl')) document.getElementById('home-stat2-lbl').innerHTML = formatStatLabel(data.homeStat2Lbl);

    if (data.homeStat3Val && document.getElementById('home-stat3-val')) document.getElementById('home-stat3-val').textContent = data.homeStat3Val;
    if (data.homeStat3Lbl && document.getElementById('home-stat3-lbl')) document.getElementById('home-stat3-lbl').innerHTML = formatStatLabel(data.homeStat3Lbl);

    if (data.homeStat4Val && document.getElementById('home-stat4-val')) document.getElementById('home-stat4-val').textContent = data.homeStat4Val;
    if (data.homeStat4Lbl && document.getElementById('home-stat4-lbl')) document.getElementById('home-stat4-lbl').innerHTML = formatStatLabel(data.homeStat4Lbl);

    if (data.homeStat5Val && document.getElementById('home-stat5-val')) document.getElementById('home-stat5-val').textContent = data.homeStat5Val;
    if (data.homeStat5Lbl && document.getElementById('home-stat5-lbl')) document.getElementById('home-stat5-lbl').innerHTML = formatStatLabel(data.homeStat5Lbl);
    if (data.statYears && document.getElementById('stat-years')) document.getElementById('stat-years').textContent = data.statYears;
    if (data.statDisciplines && document.getElementById('stat-disciplines')) document.getElementById('stat-disciplines').textContent = data.statDisciplines;
    if (data.statProducts && document.getElementById('stat-products')) document.getElementById('stat-products').textContent = data.statProducts;
    if (data.statIterations && document.getElementById('stat-iterations')) document.getElementById('stat-iterations').textContent = data.statIterations;

    if (data.playgroundTopics && document.getElementById('playground-filters')) {
      renderPlaygroundFilters(data.playgroundTopics);
    }

    if (data.journalTopics && document.getElementById('blog-filters')) {
      renderJournalFilters(data.journalTopics);
    }

    // Render Footer Social Links dynamically from admin settings
    const svgIcons = {
      linkedin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
      behance: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7.7 11.2c1.2 0 2-.6 2-1.7 0-1-.8-1.5-1.8-1.5H3.5v3.2h4.2zm.3 3.3c1.4 0 2.3-.7 2.3-1.8 0-1.2-1-1.8-2.3-1.8H3.5v3.6H8zm9.5-1.8c0-1.8-1.3-3.2-3.1-3.2-1.9 0-3.3 1.5-3.3 3.3 0 1.9 1.4 3.4 3.4 3.4 1.5 0 2.6-.8 3-2.1h-1.6c-.3.6-.8.9-1.4.9-1 0-1.7-.6-1.8-1.6h4.8v-.6zm-4.7-.8c.1-.8.7-1.3 1.6-1.3.8 0 1.4.5 1.5 1.3h-3.1zM13 7.8h3.6v.9H13v-.9zM0 5.4h8.3c2.4 0 4.1 1.2 4.1 3.2 0 1.2-.6 2.2-1.6 2.7 1.4.5 2.1 1.6 2.1 3.1 0 2.3-1.9 3.8-4.6 3.8H0V5.4z"/></svg>',
      instagram: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
      dribbble: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/></svg>',
      twitter: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      youtube: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>'
    };

    const links = [];
    if (data.socialLinkedIn && data.socialLinkedIn.trim()) links.push({ name: 'LinkedIn', url: data.socialLinkedIn.trim(), icon: svgIcons.linkedin });
    if (data.socialBehance && data.socialBehance.trim()) links.push({ name: 'Behance', url: data.socialBehance.trim(), icon: svgIcons.behance });
    if (data.socialInstagram && data.socialInstagram.trim()) links.push({ name: 'Instagram', url: data.socialInstagram.trim(), icon: svgIcons.instagram });
    if (data.socialDribbble && data.socialDribbble.trim()) links.push({ name: 'Dribbble', url: data.socialDribbble.trim(), icon: svgIcons.dribbble });
    if (data.socialTwitter && data.socialTwitter.trim()) links.push({ name: 'Twitter / X', url: data.socialTwitter.trim(), icon: svgIcons.twitter });
    if (data.socialYoutube && data.socialYoutube.trim()) links.push({ name: 'YouTube', url: data.socialYoutube.trim(), icon: svgIcons.youtube });

    if (!links.length) {
      links.push(
        { name: 'LinkedIn', url: 'https://linkedin.com', icon: svgIcons.linkedin },
        { name: 'Behance', url: 'https://behance.net', icon: svgIcons.behance },
        { name: 'Instagram', url: 'https://instagram.com', icon: svgIcons.instagram }
      );
    }

    document.querySelectorAll('#footer-social-links, .footer-social').forEach(el => {
      el.innerHTML = links.map(item => `
        <a class="social-link-pill" href="${item.url}" target="_blank" rel="noopener noreferrer">
          ${item.icon}
          <span>${item.name}</span>
        </a>
      `).join('');
    });
  };

  // Instant synchronous cache hydration (0ms delay, zero flash of dummy content)
  try {
    const initCachedSettings = getCachedData('/api/settings');
    if (initCachedSettings) applySettingsToPage(initCachedSettings);
  } catch (e) {}

  const defaultPlaygroundTopics = ['UI & Motion', 'Concepts', '3D & Visuals', 'Quick Sketches', 'Just for Fun'];
  const defaultJournalTopics = ['UX / UI Design', 'Product Design', 'Process', 'Career', 'Tools', 'Opinion', 'Design Thinking'];

  function wirePlaygroundFilters() {
    const filterContainer = document.getElementById('playground-filters');
    if (!filterContainer) return;
    const filterButtons = filterContainer.querySelectorAll('button');
    const expWrapper = document.getElementById('load-more-experiments-wrapper');
    const getExpCards = () => document.querySelectorAll('.experiment-grid > *');

    filterButtons.forEach(button => {
      button.onclick = e => {
        e.preventDefault();
        filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        const filterVal = (button.dataset.filter || '').trim().toLowerCase();
        const topicName = (button.dataset.topic || button.textContent || '').trim().toLowerCase();

        if (filterVal === 'sketches') {
          document.getElementById('sketches')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        if (filterVal === 'fun') {
          document.getElementById('fun')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        if (filterVal === 'all') {
          if (typeof window.updatePlaygroundLoadMore === 'function') {
            window.updatePlaygroundLoadMore();
          } else {
            getExpCards().forEach(card => { card.style.display = ''; });
          }
          if (expWrapper) expWrapper.style.display = '';
        } else {
          const cleanFilter = filterVal.replace(/[^a-z0-9]/g, '');
          const cleanTopic = topicName.replace(/[^a-z0-9]/g, '');

          getExpCards().forEach(card => {
            const smallText = (card.querySelector('small')?.textContent || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const cardCat = (card.dataset.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const cardClass = (card.className || '').toLowerCase().replace(/[^a-z0-9]/g, '');

            const matches =
              (cleanFilter && (cardCat.includes(cleanFilter) || cardClass.includes(cleanFilter) || smallText.includes(cleanFilter))) ||
              (cleanTopic && smallText.includes(cleanTopic)) ||
              (cleanFilter === 'ui' && (cardCat.includes('ui') || smallText.includes('ui') || cardClass.includes('ui'))) ||
              (cleanFilter === '3d' && (cardCat.includes('3d') || smallText.includes('3d') || cardClass.includes('3d'))) ||
              (cleanFilter === 'concept' && (cardCat.includes('concept') || smallText.includes('concept') || cardClass.includes('concept')));

            card.style.display = matches ? '' : 'none';
          });
          if (expWrapper) expWrapper.style.display = 'none';
        }
      };
    });
  }

  function renderPlaygroundFilters(topicsList) {
    const filterContainer = document.getElementById('playground-filters');
    if (!filterContainer) return;

    const topics = Array.isArray(topicsList) && topicsList.length > 0 ? topicsList : defaultPlaygroundTopics;
    const currentActiveBtn = filterContainer.querySelector('button.active');
    const currentActiveVal = currentActiveBtn ? (currentActiveBtn.dataset.filter || 'all') : 'all';

    let html = `<button class="${currentActiveVal === 'all' ? 'active' : ''}" data-filter="all">All Explorations</button>`;

    topics.forEach(topic => {
      const lower = topic.trim().toLowerCase();
      let filterAttr = '';
      if (lower === 'quick sketches' || lower === 'sketches') {
        filterAttr = 'sketches';
      } else if (lower === 'just for fun' || lower === 'fun') {
        filterAttr = 'fun';
      } else if (lower === 'ui & motion' || lower === 'ui explorations' || lower === 'ui') {
        filterAttr = 'ui';
      } else if (lower === 'concepts' || lower === 'concept') {
        filterAttr = 'concept';
      } else if (lower === '3d & visuals' || lower === '3d' || lower === '3d & motion') {
        filterAttr = '3d';
      } else {
        filterAttr = lower.replace(/[^a-z0-9]/g, '');
      }

      const isActive = currentActiveVal === filterAttr || currentActiveVal === lower;
      html += `<button class="${isActive ? 'active' : ''}" data-filter="${escape(filterAttr)}" data-topic="${escape(topic)}">${escape(topic)}</button>`;
    });

    filterContainer.innerHTML = html;
    wirePlaygroundFilters();
  }

  function wireJournalFilters() {
    const filterContainer = document.getElementById('blog-filters');
    if (!filterContainer) return;
    const filterButtons = filterContainer.querySelectorAll('button');

    filterButtons.forEach(btn => {
      btn.onclick = e => {
        e.preventDefault();
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (typeof window.__setJournalCategory === 'function') {
          window.__setJournalCategory(btn.dataset.category || 'all');
        }
      };
    });
  }

  function renderJournalFilters(topicsList) {
    const filterContainer = document.getElementById('blog-filters');
    if (!filterContainer) return;

    const topics = Array.isArray(topicsList) && topicsList.length > 0 ? topicsList : defaultJournalTopics;
    const currentActiveBtn = filterContainer.querySelector('button.active');
    const currentActiveVal = currentActiveBtn ? (currentActiveBtn.dataset.category || 'all') : 'all';

    let html = `<button class="filter-pill ${currentActiveVal === 'all' ? 'active' : ''}" data-category="all">All Articles</button>`;

    topics.forEach(topic => {
      const isActive = currentActiveVal.toLowerCase() === topic.toLowerCase();
      html += `<button class="filter-pill ${isActive ? 'active' : ''}" data-category="${escape(topic)}">${escape(topic)}</button>`;
    });

    filterContainer.innerHTML = html;
    wireJournalFilters();
  }

  // 1. Instant synchronous apply from localStorage so homepage renders instantly on load
  try {
    const savedSettings = JSON.parse(localStorage.getItem('ak_portfolio_settings') || '{}');
    if (Object.keys(savedSettings).length > 0) {
      applySettingsToPage(savedSettings);
    }
  } catch (e) {}

  // 2. Fetch from API to sync
  apiFetch('/api/settings').then(response => response.ok ? response.json() : null).then(data => {
    if (data) {
      applySettingsToPage(data);
      try {
        localStorage.setItem('ak_portfolio_settings', JSON.stringify(data));
      } catch (e) {}
    }
  });
  document.querySelectorAll('.contact-links a').forEach(link => { if (/book a call/i.test(link.textContent)) link.remove(); });

  // -------------------------------------------------------------
  // Dynamic Editorial Accordion Runway Engine (Admin Connected)
  // -------------------------------------------------------------
  apiFetch('/api/milestones').then(res => res.ok ? res.json() : []).then(rawMilestones => {
    const milestones = (rawMilestones && rawMilestones.length) ? rawMilestones : defaultMilestones;
    try {
      const savedMs = JSON.parse(localStorage.getItem('custom_milestones_order'));
      if (savedMs && Array.isArray(savedMs) && savedMs.length) {
        const orderMap = new Map(savedMs.map((item, idx) => [String(item.id), idx]));
        milestones.sort((a, b) => {
          const idxA = orderMap.has(String(a.id)) ? orderMap.get(String(a.id)) : 999;
          const idxB = orderMap.has(String(b.id)) ? orderMap.get(String(b.id)) : 999;
          return idxA - idxB;
        });
      }
    } catch(e) {}

    const accordionTrack = document.getElementById('stage-accordion-runway');
    const runwayListTrack = document.getElementById('editorial-runway-list');

    if (!milestones || !milestones.length) return;

    // 1. Render Top Accordion Runway (Render all milestones so every list item matches 1-to-1)
    const featuredMilestones = milestones;
    if (accordionTrack) {
      accordionTrack.innerHTML = featuredMilestones.map((m, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        const isActive = idx === 0 ? 'active' : '';
        const btnText = m.buttonText || 'Explore Milestone';
        const btnUrl = m.url || '#';
        const locStr = m.eventLocation && m.eventLocation.trim() && m.eventLocation.trim() !== 'TECH EVENT' ? ` · ${escape(m.eventLocation.trim())}` : '';

        return `
          <div class="runway-panel ${isActive}" data-index="${idx}">
            <div class="panel-collapsed-strip">
              <span class="strip-num">${num}</span>
              <div class="strip-label">
                <strong>${escape(m.title.toUpperCase())}</strong>
                <small>${escape(m.year)}</small>
              </div>
              <span class="strip-expand-icon">+</span>
            </div>

            <div class="panel-expanded-canvas">
              <div class="panel-bg-frame">
                <img src="${escape(m.image)}" alt="${escape(m.title)}" />
                <div class="panel-scrim"></div>
              </div>

              <div class="panel-content-wrap">
                <div class="panel-top-row">
                  <span class="panel-chip">${escape(m.category)}</span>
                  <span class="panel-year-pill">${escape(m.year)}${locStr}</span>
                </div>

                <h3 class="panel-headline">${escape(m.title)}</h3>
                <p class="panel-summary">${escape(m.summary)}</p>

                <div class="panel-specs-bar">
                  ${m.spec1Value ? `<div class="spec-item"><span>${escape(m.spec1Label || 'SPEC 1')}</span><strong>${escape(m.spec1Value)}</strong></div>` : ''}
                  ${m.spec2Value ? `<div class="spec-item"><span>${escape(m.spec2Label || 'SPEC 2')}</span><strong>${escape(m.spec2Value)}</strong></div>` : ''}
                  ${m.spec3Value ? `<div class="spec-item"><span>${escape(m.spec3Label || 'SPEC 3')}</span><strong>${escape(m.spec3Value)}</strong></div>` : ''}
                </div>

                <div class="panel-actions">
                  <a href="${escape(btnUrl)}" target="_blank" rel="noreferrer" class="runway-btn primary">
                    <span>${escape(btnText)}</span> <b>↗</b>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. Render Full Editorial Milestone List Below
    if (runwayListTrack) {
      runwayListTrack.innerHTML = milestones.map((m, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        const isActive = idx === 0 ? 'active' : '';
        const btnUrl = (m.url || '').trim();
        const isValidUrl = btnUrl && btnUrl !== '#';
        const locStr = m.eventLocation && m.eventLocation.trim() && m.eventLocation.trim() !== 'TECH EVENT' ? ` · ${escape(m.eventLocation.trim())}` : '';

        return `
          <a href="${escape(isValidUrl ? btnUrl : '#')}" ${isValidUrl ? 'target="_blank" rel="noreferrer"' : ''} class="runway-list-item ${isActive}" data-index="${idx}">
            <span class="list-num">${num}</span>
            <div class="list-title-wrap">
              <strong>${escape(m.title)}</strong>
              <small>${escape(m.category)}${locStr}</small>
            </div>
            <span class="list-year">${escape(m.year)}</span>
            <span class="list-arrow">↗</span>
          </a>
        `;
      }).join('');
    }

    // 3. Attach Interactive Hover & Click Handlers (1-to-1 Sync)
    const runwayPanels = document.querySelectorAll('#stage-accordion-runway .runway-panel');
    const runwayItems = document.querySelectorAll('#editorial-runway-list .runway-list-item');

    function setRunwayActive(index) {
      if (index < 0 || index >= runwayPanels.length) return;

      runwayPanels.forEach((panel, idx) => {
        panel.classList.toggle('active', idx === index);
      });

      runwayItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === index);
      });
    }

    runwayPanels.forEach((panel, idx) => {
      panel.addEventListener('mouseenter', () => setRunwayActive(idx));
      panel.addEventListener('click', () => setRunwayActive(idx));
    });

    runwayItems.forEach((item, idx) => {
      item.addEventListener('mouseenter', () => setRunwayActive(idx));
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
        }
        setRunwayActive(idx);
      });
    });
  }).catch(() => {});

  // ─── TOOLKIT & TOOLS CMS RENDERING (about.html) ───
  const aboutToolsGrid = document.querySelector('#about-tools-grid');
  if (aboutToolsGrid) {
    const defaultToolsList = [
      { id: 't1', name: 'Figma', category: 'UI/UX · Prototyping | Design Systems', icon_type: 'figma' },
      { id: 't2', name: 'FigJam', category: 'Workshops · User Flows | Mapping', icon_type: 'figjam' },
      { id: 't3', name: 'Adobe Photoshop', category: 'Visual Design · | Image Editing', icon_type: 'photoshop' },
      { id: 't4', name: 'Adobe Illustrator', category: 'Branding · Illustration | Graphics', icon_type: 'illustrator' },
      { id: 't5', name: 'Adobe After Effects', category: 'Motion · Visual | Content', icon_type: 'aftereffects' },
      { id: 't6', name: 'Framer', category: 'Web Design · | Prototyping', icon_type: 'framer' },
      { id: 't7', name: 'Notion', category: 'Documentation · | Planning', icon_type: 'notion' },
      { id: 't8', name: 'AI Tools', category: 'Ideation · Content | Visual Exploration', icon_type: 'aitools' }
    ];

    const getToolBadgeMarkup = (iconType, customUrl, name) => {
      const type = (iconType || 'figma').toLowerCase();
      if (type === 'custom-image' || (customUrl && customUrl.trim())) {
        return `<div class="tool-app-badge" style="background:#ffffff;border:1.5px solid #ece5dd;overflow:hidden;"><img src="${escape(cleanImgUrl(customUrl))}" alt="${escape(name)}" style="width:28px;height:28px;object-fit:contain;" /></div>`;
      }
      if (type === 'figma') {
        return `<div class="tool-app-badge badge-figma">
          <svg width="22" height="32" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
          </svg>
        </div>`;
      }
      if (type === 'figjam') {
        return `<div class="tool-app-badge badge-figjam">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19 7-7 3 3-7 7-3-3z"/>
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18"/>
            <path d="m2 2 7.586 7.586"/>
          </svg>
        </div>`;
      }
      if (type === 'photoshop') {
        return `<div class="tool-app-badge badge-photoshop"><span class="adobe-text-ps">Ps</span></div>`;
      }
      if (type === 'illustrator') {
        return `<div class="tool-app-badge badge-illustrator"><span class="adobe-text-ai">Ai</span></div>`;
      }
      if (type === 'aftereffects') {
        return `<div class="tool-app-badge badge-aftereffects"><span class="adobe-text-ae">Ae</span></div>`;
      }
      if (type === 'framer') {
        return `<div class="tool-app-badge badge-framer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
          </svg>
        </div>`;
      }
      if (type === 'notion') {
        return `<div class="tool-app-badge badge-notion">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.459-.699c1.073-.093 1.353-.466 1.026-1.166L17.75 1.55C17.377.944 16.724.711 15.65.757L2.454 1.737C1.474 1.83 1.147 2.296 1.474 3.042l2.985 1.166zm1.306 3.172v13.62c0 .933.56 1.306 1.586 1.213l13.71-.84c1.026-.093 1.353-.653 1.353-1.586V6.167c0-.933-.466-1.306-1.4-1.213l-13.85.84c-.933.093-1.399.653-1.399 1.586zm11.365.886c.093.513 0 1.026-.513 1.073l-.933.093v8.583c-.606.373-1.166.56-1.633.56-.746 0-1.026-.233-1.54-.886l-4.29-6.389v6.11c.56.093 1.026.233 1.026.746 0 .513-.42.56-.98.606l-2.844.187c-.093-.513.047-1.026.56-1.073l.886-.093V9.293c-.466-.093-.933-.14-1.306-.14-.513 0-.606-.233-.606-.606 0-.466.327-.56.886-.606l3.03-.187 4.572 6.808v-5.69c-.466-.093-.933-.14-1.306-.14-.513 0-.606-.233-.606-.606 0-.466.327-.56.886-.606l2.844-.187c.093.513 0 .98-.187 1.026z"/>
          </svg>
        </div>`;
      }
      if (type === 'aitools') {
        return `<div class="tool-app-badge badge-aitools">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.39 8.26L21 9.27L16.2 13.97L17.34 20.73L12 17.27L6.66 20.73L7.8 13.97L3 9.27L9.61 8.26L12 2Z" fill="url(#ai-star-grad-render)"/>
            <defs>
              <linearGradient id="ai-star-grad-render" x1="3" y1="2" x2="21" y2="20.73" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FF7A00"/>
                <stop offset="1" stop-color="#FF381E"/>
              </linearGradient>
            </defs>
          </svg>
        </div>`;
      }
      if (type === 'spline') {
        return `<div class="tool-app-badge" style="background:#0e1117;border:1px solid #232733;color:#00f5d4;font-family:'DM Mono',monospace;font-weight:900;font-size:16px;">Sp</div>`;
      }
      if (type === 'rive') {
        return `<div class="tool-app-badge" style="background:linear-gradient(135deg,#ff5a5f,#ff2a54);box-shadow:0 4px 12px rgba(255,42,84,0.3);color:#fff;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;">R</div>`;
      }
      if (type === 'blender') {
        return `<div class="tool-app-badge" style="background:#ea7600;box-shadow:0 4px 12px rgba(234,118,0,0.3);color:#fff;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;">Bl</div>`;
      }
      if (type === 'webflow') {
        return `<div class="tool-app-badge" style="background:#146ef5;box-shadow:0 4px 12px rgba(20,110,245,0.3);color:#fff;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;">W</div>`;
      }
      if (type === 'vscode') {
        return `<div class="tool-app-badge" style="background:#0065a9;color:#fff;font-family:'DM Mono',monospace;font-weight:900;font-size:15px;">VS</div>`;
      }
      if (type === 'github') {
        return `<div class="tool-app-badge" style="background:#181717;color:#fff;font-family:'Manrope',sans-serif;font-weight:900;font-size:17px;">Gh</div>`;
      }
      if (type === 'linear') {
        return `<div class="tool-app-badge" style="background:#5e6ad2;box-shadow:0 4px 12px rgba(94,106,210,0.3);color:#fff;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;">L</div>`;
      }
      if (type === 'miro') {
        return `<div class="tool-app-badge" style="background:#ffd02f;color:#050038;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;">M</div>`;
      }
      if (type === 'sketch') {
        return `<div class="tool-app-badge" style="background:#fdb300;color:#fff;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;">◆</div>`;
      }
      return `<div class="tool-app-badge" style="background:#fff5f0;border:1px solid #ffe6da;color:var(--accent,#ff4e1b);font-weight:800;font-size:16px;">${escape((name || 'T').slice(0,2).toUpperCase())}</div>`;
    };

    const renderToolsGrid = (tools) => {
      if (!Array.isArray(tools) || !tools.length) return;
      aboutToolsGrid.innerHTML = tools.map(tool => {
        const rawCat = tool.category || '';
        const lines = rawCat.split(/[\n|]/).map(l => l.trim()).filter(Boolean);
        const subtextHtml = lines.length >= 2
          ? `<span>${escape(lines[0])}</span><span>${escape(lines.slice(1).join(' '))}</span>`
          : `<span>${escape(rawCat)}</span>`;
        const badgeMarkup = getToolBadgeMarkup(tool.icon_type || tool.iconType, tool.custom_icon_url || tool.customIconUrl, tool.name);

        return `
          <article class="tool-card-box reveal visible" data-tool-id="${escape(tool.id || '')}">
            ${badgeMarkup}
            <div class="tool-text-info">
              <h3>${escape(tool.name)}</h3>
              ${subtextHtml}
            </div>
          </article>
        `;
      }).join('');
    };

    // 1. Instantly render from user's customized localStorage
    let initialTools = defaultToolsList;
    let hasCustomTools = false;
    try {
      const isInit = localStorage.getItem('ak_portfolio_tools_initialized') === 'true';
      const stored = localStorage.getItem('ak_portfolio_tools');
      if (isInit && stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          initialTools = parsed;
          hasCustomTools = true;
        }
      }
    } catch (e) {}
    renderToolsGrid(initialTools);

    // 2. Only sync from backend if not purely static or if Supabase/API returns live table
    if (!hasCustomTools) {
      apiFetch('/api/tools')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (Array.isArray(data) && data.length) {
            renderToolsGrid(data);
            try {
              localStorage.setItem('ak_portfolio_tools', JSON.stringify(data));
              localStorage.setItem('ak_portfolio_tools_initialized', 'true');
            } catch (e) {}
          }
        })
        .catch(() => {});
    }
  }

  apiFetch('/api/projects').then(response => response.ok ? response.json() : []).then(items => {
    try {
      const savedProj = JSON.parse(localStorage.getItem('custom_projects_order'));
      if (savedProj && Array.isArray(savedProj) && savedProj.length) {
        const orderMap = new Map(savedProj.map((item, idx) => [String(item.id), idx]));
        items.sort((a, b) => {
          const idxA = orderMap.has(String(a.id)) ? orderMap.get(String(a.id)) : 999;
          const idxB = orderMap.has(String(b.id)) ? orderMap.get(String(b.id)) : 999;
          return idxA - idxB;
        });
      }
    } catch(e) {}

    // 1. Homepage Featured Work Carousel
    const featuredTrack = document.querySelector('.featured-carousel-track');
    const featuredWrapper = document.querySelector('.featured-carousel-wrapper');
    if (featuredTrack) {
      let featuredItems = items.filter(item => Boolean(item.featured) && isWorkType(item));
      if (!featuredItems.length) {
        featuredItems = defaultWorkItems.filter(item => Boolean(item.featured));
      }
      if (featuredItems.length) {
        if (featuredWrapper) featuredWrapper.style.display = 'block';
        featuredTrack.innerHTML = featuredItems.map((item, index) => {
          const num = String(index + 1).padStart(2, '0');
          const categoryLabel = categoryOf(item) || 'Product Design';
          const tagsList = (item.tags || categoryLabel).split('|').map(t => t.trim()).filter(Boolean);
          const toolsList = (item.tools || '').split('|').map(t => t.trim()).filter(Boolean);
          const tagsHtml = tagsList.length ? `<div class="fc-tags">${tagsList.map(t => `<span class="fc-tag">${escape(t)}</span>`).join('')}</div>` : '';
          const toolsHtml = toolsList.length ? `<div class="fc-tools">${toolsList.map(t => `<span class="fc-tool"><i>⚡</i> ${escape(t)}</span>`).join('')}</div>` : '';

          const caseStudyBtn = `<a href="${escape(item.url || '#')}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} class="fc-btn fc-btn-primary">View case study <b>↗</b></a>`;
          const productBtn = item.productUrl ? `<a href="${escape(item.productUrl)}" target="_blank" rel="noreferrer" class="fc-btn fc-btn-secondary">Live Product <b>↗</b></a>` : '';

          const mediaHtml = item.image
            ? `<div class="fc-media"><img src="${escape(item.image)}" alt="${escape(item.title)}"><div class="fc-media-overlay"></div></div>`
            : `<div class="fc-media"><div class="fc-media-placeholder">✦</div></div>`;

          // Alternate light/dark theme per slide
          const theme = index % 2 === 0 ? 'light-theme' : 'dark-theme';

          return `<article class="fc-slide ${theme}">
            <div class="fc-info">
              <p class="fc-number"><span class="fc-dot"></span>${num} &nbsp;·&nbsp; <span class="fc-featured-badge">✦ ${escape(categoryLabel.toUpperCase())}</span></p>
              <h3 class="fc-title">${escape(item.title)}</h3>
              ${item.description ? `<p class="fc-desc">${escape(item.description)}</p>` : ''}
              ${tagsHtml}
              ${toolsHtml}
              <div class="fc-actions">${caseStudyBtn}${productBtn}</div>
            </div>
            ${mediaHtml}
          </article>`;
        }).join('');

        if (window.initFeaturedCarousel) {
          window.initFeaturedCarousel();
        }
      } else {
        featuredTrack.innerHTML = '';
        if (featuredWrapper) featuredWrapper.style.display = 'none';
      }
    }

    // 2. Homepage Journal Section (#journal .article-grid)
    const journalGridHome = document.querySelector('#journal .article-grid');
    if (journalGridHome) {
      const cmsJournal = items.filter(item => typeOf(item) === 'journal');
      const allJournalHome = cmsJournal;
      const displayJournal = allJournalHome.filter(item => item.featured).length ? allJournalHome.filter(item => item.featured) : allJournalHome;
      // Build a lookup map of all articles for the modal
      const homeArticleMap = {};
      allJournalHome.forEach(a => { homeArticleMap[String(a.id)] = a; });

      if (!displayJournal.length) {
        journalGridHome.innerHTML = '<p class="empty-msg" style="color:var(--muted);font-size:14px;grid-column:1/-1;padding:20px 0;">No articles published yet.</p>';
      } else {
        journalGridHome.innerHTML = displayJournal.slice(0, 3).map((item, index) => {
          const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
          const catTag = categoryOf(item) || 'Journal';
          const imageHtml = item.image ?
            `<img src="${escape(item.image)}" alt="${escape(item.title)}">` :
            `<div class="post-placeholder" style="height:100%;min-height:140px;display:grid;place-items:center;background:linear-gradient(135deg,#1b1b1b,#913d22);color:#fff;font-weight:800;font-size:22px;">AK.</div>`;
          const isExternal = item.url && item.url.startsWith('http');

          return `<article class="article-card reveal visible delay-${index % 3}" data-id="${escape(item.id)}" data-external="${isExternal ? '1' : ''}" data-url="${isExternal ? escape(item.url) : ''}">
            ${imageHtml}
            <div>
              <small>${escape(dateStr)} · ${escape(catTag)}</small>
              <h3>${escape(item.title)}</h3>
              <span class="read-article-btn" role="button" tabindex="0">Read article <b>↗</b></span>
            </div>
          </article>`;
        }).join('');

        // Wire up click handlers — open modal inline on homepage
        journalGridHome.querySelectorAll('.article-card').forEach(cardEl => {
          cardEl.dataset.wired = '1';
          const handler = () => {
            const id = cardEl.dataset.id;
            if (cardEl.dataset.external === '1') {
              window.open(cardEl.dataset.url, '_blank', 'noopener');
            } else {
              const article = homeArticleMap[id];
              if (article) openSharedModal(article);
            }
          };
          cardEl.addEventListener('click', handler);
          cardEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
        });
      }
    }

    // 3. Playground Page (playground.html)
    if (document.body.classList.contains('play-page')) {
      const experimentGrid = document.querySelector('.experiment-grid');
      const sketchGrid = document.querySelector('.sketch-grid');
      const funGrid = document.querySelector('.fun-grid');

      // Clear all grids so no dummy / static items remain
      if (experimentGrid) experimentGrid.innerHTML = '';
      if (sketchGrid) sketchGrid.innerHTML = '';
      if (funGrid) funGrid.innerHTML = '';

      // Deduplicate items by ID
      const seenIds = new Set();
      const rawPlayground = items.filter(item => typeOf(item) === 'playground');
      const playgroundSource = rawPlayground.length ? rawPlayground : defaultPlaygroundItems;
      const playgroundItems = playgroundSource.filter(item => {
        const idKey = String(item.id || item.title || '');
        if (!idKey || seenIds.has(idKey)) return false;
        seenIds.add(idKey);
        return true;
      });

      let expCount = 0;
      let sketchCount = 0;
      let funCount = 0;

      playgroundItems.forEach(item => {
        if (sectionOf(item) === 'sketches' && sketchGrid) {
          const sketch = document.createElement('a');
          sketch.href = item.url || '#';
          if (item.url && item.url.startsWith('http')) sketch.target = '_blank';
          sketch.className = 'cms-sketch cms-injected-item';
          sketch.dataset.category = 'sketches';
          sketch.dataset.id = item.id || '';
          sketch.innerHTML = item.image ? `<img src="${escape(cleanImgUrl(item.image))}" alt="${escape(item.title)}"><span>${escape(item.title)}</span>` : `<i>✦<br>${escape(item.title)}</i>`;
          sketchGrid.appendChild(sketch);
          sketchCount++;
        } else if (sectionOf(item) === 'fun' && funGrid) {
          const fun = document.createElement('article');
          fun.className = 'fun-card cms-injected-item';
          fun.dataset.category = 'fun';
          fun.dataset.id = item.id || '';
          fun.innerHTML = `<a href="${escape(item.url || '#')}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} class="cms-link"><div class="fun-art cms-fun">${item.image ? `<img src="${escape(cleanImgUrl(item.image))}" alt="${escape(item.title)}">` : '✦'}</div><div class="fun-text"><h3>${escape(item.title)}</h3><p>${escape(item.description || 'A playful creative study.')}</p><small>${escape(categoryOf(item))}</small></div></a>`;
          funGrid.appendChild(fun);
          funCount++;
        } else if (experimentGrid) {
          experimentGrid.appendChild(card(item));
          expCount++;
        }
      });

      if (experimentGrid && expCount === 0) {
        experimentGrid.innerHTML = '<p class="empty-msg" style="color:var(--muted);font-size:14px;grid-column:1/-1;padding:40px 0;text-align:center;">No interactive experiments published yet.</p>';
      }
      if (sketchGrid && sketchCount === 0) {
        sketchGrid.innerHTML = '<p class="empty-msg" style="color:var(--muted);font-size:14px;grid-column:1/-1;padding:30px 0;text-align:center;">No sketches published yet.</p>';
      }
      if (funGrid && funCount === 0) {
        funGrid.innerHTML = '<p class="empty-msg" style="color:var(--muted);font-size:14px;grid-column:1/-1;padding:30px 0;text-align:center;">No fun zone studies published yet.</p>';
      }

      // Generic Load More & Show Less Setup Helper for Playground sections
      function setupSectionLoadMore({ gridSelector, wrapperId, btnId, itemSelector, initialVisible, batchSize, label }) {
        const gridEl = document.querySelector(gridSelector);
        if (!gridEl) return () => {};

        const loadMoreBtn = document.getElementById(btnId);
        const loadMoreWrapper = document.getElementById(wrapperId);

        let visibleCount = initialVisible;

        function updateVisibility() {
          const allItems = Array.from(gridEl.querySelectorAll(itemSelector));

          allItems.forEach((el, idx) => {
            if (idx < visibleCount) {
              el.style.display = '';
            } else {
              el.style.display = 'none';
            }
          });

          if (loadMoreWrapper && loadMoreBtn) {
            if (allItems.length <= initialVisible) {
              loadMoreWrapper.style.display = 'none';
            } else {
              loadMoreWrapper.style.display = 'block';

              if (visibleCount >= allItems.length) {
                // Fully Expanded State -> Show "Show Less / Collapse" button
                loadMoreBtn.innerHTML = '<span>Show Less / Collapse</span> <b>↑</b>';
                loadMoreBtn.dataset.state = 'expanded';
              } else {
                // Collapsed / Batch State -> Show remaining count badge
                const remaining = allItems.length - visibleCount;
                loadMoreBtn.innerHTML = `<span>Load More ${escape(label)}</span> <b>(${remaining} remaining) ✦</b>`;
                loadMoreBtn.dataset.state = 'collapsed';
              }
            }
          }
        }

        updateVisibility();

        if (loadMoreBtn && !loadMoreBtn.dataset.wired) {
          loadMoreBtn.dataset.wired = 'true';
          loadMoreBtn.onclick = () => {
            if (loadMoreBtn.dataset.state === 'expanded') {
              // Collapse back to initial limit
              visibleCount = initialVisible;
              updateVisibility();
              gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              // Expand next batch
              visibleCount += batchSize;
              updateVisibility();
            }
          };
        }

        return updateVisibility;
      }

      // Initialize Load More for all 3 Playground Sections (2 rows initial view each)
      const updateExp = setupSectionLoadMore({
        gridSelector: '.experiment-grid',
        wrapperId: 'load-more-experiments-wrapper',
        btnId: 'load-more-experiments-btn',
        itemSelector: ':scope > *',
        initialVisible: 6, // 2 rows (3 per row)
        batchSize: 6,
        label: 'Explorations'
      });

      const updateSketches = setupSectionLoadMore({
        gridSelector: '.sketch-grid',
        wrapperId: 'load-more-sketches-wrapper',
        btnId: 'load-more-sketches-btn',
        itemSelector: ':scope > *',
        initialVisible: 8, // 2 rows (4 per row)
        batchSize: 8,
        label: 'Explorations'
      });

      const updateFun = setupSectionLoadMore({
        gridSelector: '.fun-grid',
        wrapperId: 'load-more-fun-wrapper',
        btnId: 'load-more-fun-btn',
        itemSelector: ':scope > *',
        initialVisible: 6, // 2 rows (3 per row)
        batchSize: 6,
        label: 'Explorations'
      });

      window.updatePlaygroundLoadMore = () => {
        updateExp();
        updateSketches();
        updateFun();
      };
    }



    // 4. Work Page (work.html)
    if (document.body.classList.contains('work-page')) {
      const defaultWorkItems = [
        {
          title: 'Flubn — An influencer Platform',
          subtitle: 'An influencer Platform',
          category: 'PRODUCT DESIGN',
          tags: 'Product | 2025 - 2026 | APP',
          description: 'Flubn connects brands and creators in one seamless platform — discover, collaborate and grow impact together.',
          url: '#',
          productUrl: ''
        }
      ];

      const projects = document.querySelector('.projects');
      const rawWork = items.filter(item => isWorkType(item));
      const workItems = rawWork.length ? rawWork : defaultWorkItems;
      if (projects) {
        projects.innerHTML = '';
        if (workItems.length) {
          workItems.forEach((item, index) => {
            const num = String(index + 1).padStart(2, '0');
            const categoryLabel = categoryOf(item) || 'PRODUCT DESIGN';
            const isFlubn = (item.title || '').toLowerCase().includes('flubn');
            const cleanTitle = (item.title || 'Flubn').split('—')[0].trim().replace(/\.+$/, '');
            const subtitle = item.subtitle || (item.title.includes('—') ? item.title.split('—')[1].trim() : (isFlubn ? 'An influencer Platform' : 'Product Design & Strategy'));

            const tagsList = (item.tags || 'Product | 2025 - 2026 | APP').split('|').map(t => t.trim()).filter(Boolean);
            const metaPillsHtml = tagsList.map(tag => {
              let iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4e1b" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
              if (tag.toLowerCase().includes('product') || tag.toLowerCase().includes('design')) {
                iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4e1b" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
              } else if (tag.toLowerCase().includes('app') || tag.toLowerCase().includes('mobile')) {
                iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4e1b" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>`;
              }
              return `<span class="work-pill">${iconSvg} ${escape(tag)}</span>`;
            }).join('');

            let rightStageHtml = '';
            const cleanImage = item.image ? String(item.image).trim() : '';

            if (cleanImage.length > 0) {
              // Custom uploaded artwork/mockup rendered cleanly with true aspect ratio
              rightStageHtml = `
                <div class="work-card-right custom-card-right">
                  <div class="work-art-img-wrap">
                    <img src="${escape(cleanImgUrl(cleanImage))}" alt="${escape(item.title)}" class="work-showcase-img" />
                  </div>
                </div>
              `;
            } else if (isFlubn) {
              // Rich 3D Studio Mockup (Exact match for Flubn)
              rightStageHtml = `
                <div class="work-card-right">
                  <div class="studio-ambient-bg"></div>

                  <!-- Decorative subtle connector paths -->
                  <svg class="studio-connectors" viewBox="0 0 600 500" fill="none" aria-hidden="true">
                    <path d="M 80 60 Q 200 60 250 120" stroke="#dcd3f5" stroke-width="1.5" stroke-dasharray="4 4"/>
                    <path d="M 440 60 Q 370 100 330 160" stroke="#dcd3f5" stroke-width="1.5" stroke-dasharray="4 4"/>
                    <path d="M 450 230 Q 380 240 340 260" stroke="#dcd3f5" stroke-width="1.5" stroke-dasharray="4 4"/>
                    <path d="M 440 350 Q 370 340 330 320" stroke="#dcd3f5" stroke-width="1.5" stroke-dasharray="4 4"/>
                    <path d="M 200 390 Q 250 380 280 340" stroke="#dcd3f5" stroke-width="1.5" stroke-dasharray="4 4"/>
                  </svg>

                  <div class="floating-squircle squircle-purple-top" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>

                  <div class="studio-feature-list">
                    <h3 class="feature-headline">
                      All-in-one<br/>
                      <span class="headline-gradient">influencer marketing</span><br/>
                      platform
                    </h3>
                    <div class="feature-items">
                      <div class="feature-item">
                        <span class="feature-icon-box">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4e1b" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <span>Discover creators</span>
                      </div>
                      <div class="feature-item">
                        <span class="feature-icon-box">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4e1b" stroke-width="2.2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                        </span>
                        <span>Manage campaigns</span>
                      </div>
                      <div class="feature-item">
                        <span class="feature-icon-box">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4e1b" stroke-width="2.2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                        </span>
                        <span>Measure impact</span>
                      </div>
                    </div>
                  </div>

                  <div class="studio-phone-mockup">
                    <div class="phone-titanium-shell">
                      <div class="phone-screen-glass">
                        <div class="phone-status-bar">
                          <span class="status-time">9:41</span>
                          <div class="dynamic-island"></div>
                          <div class="status-icons">
                            <svg width="12" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
                            <svg width="14" height="10" viewBox="0 0 24 24" fill="currentColor"><rect width="18" height="12" x="2" y="6" rx="2"/><path d="M22 11v2"/></svg>
                          </div>
                        </div>
                        <div class="app-screen-content">
                          <div class="app-brand-lockup">
                            <h4 class="app-logo-text">flubn<span class="dot-accent">.</span></h4>
                            <p class="app-tagline">Connect. Collaborate.<br/>Create impact.</p>
                          </div>
                          <div class="app-actions-wrap">
                            <button class="app-get-started-btn" type="button">Get Started</button>
                            <button class="app-explore-btn" type="button">Explore</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="studio-badge badge-top-reach">
                    <div class="badge-header">
                      <span class="badge-label">Campaign Reach</span>
                      <span class="badge-percent">+24%</span>
                    </div>
                    <b class="badge-metric">72.5K</b>
                    <div class="badge-sparkline">
                      <svg viewBox="0 0 120 30" fill="none">
                        <path d="M2 24 C 20 22, 35 15, 50 18 C 65 21, 80 8, 95 12 C 105 14, 112 5, 118 4" stroke="#ff4e1b" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="118" cy="4" r="3.5" fill="#ff4e1b"/>
                      </svg>
                    </div>
                  </div>

                  <div class="studio-badge badge-bot-creators">
                    <span class="badge-label">Active Creators</span>
                    <b class="badge-metric">4.8K</b>
                    <div class="creators-avatar-stack">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Creator 1"/>
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Creator 2"/>
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Creator 3"/>
                      <span class="avatar-plus-pill">+</span>
                    </div>
                  </div>

                  <div class="floating-squircle squircle-orange-mid" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </div>
                  <div class="floating-squircle squircle-purple-bot" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                  </div>
                  <div class="floating-squircle squircle-dark-bot" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                  </div>

                  <span class="studio-sparkle sparkle-top-right">✦</span>
                  <span class="studio-sparkle sparkle-bot-mid">✧</span>
                </div>
              `;
            } else {
              // Generic Fallback Device Stage
              rightStageHtml = `
                <div class="work-card-right custom-card-right">
                  <div class="studio-ambient-bg"></div>
                  <div class="studio-phone-mockup"><div class="phone-titanium-shell"><div class="phone-screen-glass"><div class="app-screen-content"><h4 class="app-logo-text">${escape(cleanTitle)}<span class="dot-accent">.</span></h4><p class="app-tagline">${escape(item.description)}</p></div></div></div></div>
                </div>
              `;
            }

            const article = document.createElement('article');
            article.className = 'work-showcase-card reveal visible';
            article.style.setProperty('--card-index', index);
            article.style.setProperty('--card-total', workItems.length);
            article.dataset.cardIndex = index;
            article.innerHTML = `
              <!-- Exact Smooth Curved Divider separating left and right sections -->
              <div class="work-curve-divider-wrap" aria-hidden="true">
                <svg class="work-curve-svg" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="stageGrad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                      ${index % 2 === 1 ? `
                        <stop offset="0%" stop-color="#1f1d1a"/>
                        <stop offset="45%" stop-color="#191522"/>
                        <stop offset="100%" stop-color="#111827"/>
                      ` : `
                        <stop offset="0%" stop-color="#fff5ed"/>
                        <stop offset="45%" stop-color="#f6effe"/>
                        <stop offset="100%" stop-color="#edf1ff"/>
                      `}
                    </linearGradient>
                    <clipPath id="stageClip-${index}" clipPathUnits="userSpaceOnUse">
                      <path d="M 440 0 C 430 80, 415 160, 404 220 C 392 245, 428 260, 428 300 C 428 340, 392 355, 404 380 C 415 440, 430 520, 440 600 L 1000 600 L 1000 0 Z" />
                    </clipPath>
                  </defs>

                  <!-- Clipped Right Stage: Gradient Backdrop -->
                  <g clip-path="url(#stageClip-${index})">
                    <rect x="0" y="0" width="1000" height="600" fill="url(#stageGrad-${index})" />
                  </g>

                  <!-- Trailing decorative dot pattern behind the curve -->
                  <g class="curve-dot-matrix" fill="#ff4e1b" opacity="0.2">
                    <circle cx="410" cy="370" r="1.5"/><circle cx="430" cy="370" r="1.5"/><circle cx="450" cy="370" r="1.5"/>
                    <circle cx="400" cy="395" r="1.5"/><circle cx="420" cy="395" r="1.5"/><circle cx="440" cy="395" r="1.5"/><circle cx="460" cy="395" r="1.5"/>
                    <circle cx="410" cy="420" r="1.5"/><circle cx="430" cy="420" r="1.5"/><circle cx="450" cy="420" r="1.5"/><circle cx="470" cy="420" r="1.5"/>
                    <circle cx="420" cy="445" r="1.5"/><circle cx="440" cy="445" r="1.5"/><circle cx="460" cy="445" r="1.5"/><circle cx="480" cy="445" r="1.5"/>
                    <circle cx="430" cy="470" r="1.5"/><circle cx="450" cy="470" r="1.5"/><circle cx="470" cy="470" r="1.5"/><circle cx="490" cy="470" r="1.5"/>
                    <circle cx="440" cy="495" r="1.5"/><circle cx="460" cy="495" r="1.5"/><circle cx="480" cy="495" r="1.5"/><circle cx="500" cy="495" r="1.5"/>
                    <circle cx="450" cy="520" r="1.5"/><circle cx="470" cy="520" r="1.5"/><circle cx="490" cy="520" r="1.5"/><circle cx="510" cy="520" r="1.5"/>
                  </g>

                  <!-- Dividing Crisp Contour Line with peach stroke -->
                  <path class="curve-stroke-line" d="M 440 0 C 430 80, 415 160, 404 220 C 392 245, 428 260, 428 300 C 428 340, 392 355, 404 380 C 415 440, 430 520, 440 600" fill="none" stroke="#fcd5c5" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </div>

              <div class="work-card-left">
                <div>
                  <div class="work-eyebrow-row">
                    <span class="work-eyebrow-star">✦</span>
                    <span class="work-eyebrow-num">${num}</span>
                    <span class="work-eyebrow-dots">· ·</span>
                    <span class="work-eyebrow-category">${escape(categoryLabel.toUpperCase())}</span>
                  </div>

                  <h2 class="work-title">${escape(cleanTitle)}<span class="dot-accent">.</span></h2>
                  <p class="work-subtitle">${escape(subtitle)}</p>

                  <div class="work-meta-pills">
                    ${metaPillsHtml}
                  </div>

                  <p class="work-description">
                    ${escape(item.description || 'Flubn connects brands and creators in one seamless platform — discover, collaborate and grow impact together.')}
                  </p>
                </div>

                <div>
                  <div class="work-cta-wrap">
                    <a href="${escape(item.url || '#')}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} class="work-primary-btn">
                      <span>View case study</span>
                      <span class="btn-arrow-circle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span>
                    </a>
                    ${item.productUrl ? `<a href="${escape(item.productUrl)}" target="_blank" rel="noreferrer" class="work-secondary-btn">Live Product <b>↗</b></a>` : ''}
                  </div>

                  <div class="work-dot-matrix" aria-hidden="true">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>

              <!-- Center Notch Circular Arrow Button Nestled Inside Curve -->
              <div class="work-card-notch">
                <a href="${escape(item.url || '#')}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} class="notch-arrow-badge" aria-label="View ${escape(cleanTitle)}">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m13 6 6 6-6 6"/>
                  </svg>
                </a>
              </div>

              ${rightStageHtml}
            `;

            projects.appendChild(article);
          });

          if (typeof window.initWorkStackingCards === 'function') {
            window.initWorkStackingCards();
          }

        }
      }
    }

    // --- Shared Article Modal (works on homepage AND blog.html) ---
    const sharedModal = document.querySelector('#article-modal');
    const sharedModalBackdrop = document.querySelector('#article-modal-backdrop');
    const sharedModalClose = document.querySelector('#article-modal-close');
    const sharedModalBody = document.querySelector('#article-modal-body');

    const renderBodyShared = (article, raw) => {
      if (!raw) return `<p><strong>Summary:</strong> ${escape(article.description || 'Exploring design principles and product thinking.')}</p><p>In modern product design, clarity and focus dictate how seamlessly users transition from intent to action. By examining early interaction flows and structural layouts, we can eliminate unnecessary friction and elevate user delight.</p>`;
      return raw
        .replace(/\r\n/g, '\n')
        .split(/\n{2,}/)
        .map(block => {
          block = block.trim();
          if (!block) return '';
          if (/^##\s+/.test(block)) return `<h3 class="modal-h3">${escape(block.replace(/^##\s+/, ''))}</h3>`;
          if (/^#\s+/.test(block)) return `<h2 class="modal-h2">${escape(block.replace(/^#\s+/, ''))}</h2>`;
          if (/^>\s+/.test(block)) return `<blockquote class="modal-quote">${escape(block.replace(/^>\s+/, ''))}</blockquote>`;
          if (/^[-*]\s+/.test(block)) {
            const its = block.split('\n').filter(l => /^[-*]\s+/.test(l.trim())).map(l => `<li>${escape(l.replace(/^[-*]\s+/, '').trim())}</li>`);
            return `<ul class="modal-list">${its.join('')}</ul>`;
          }
          let p = escape(block).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
          return `<p>${p}</p>`;
        })
        .filter(Boolean)
        .join('\n');
    };

    const openSharedModal = (article) => {
      if (!sharedModal || !sharedModalBody) return;
      const dateStr = article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 2026';
      const catTag = categoryOf(article) || 'Journal';
      const readTime = article.readTime || '5 min read';
      const imgMarkup = article.image ? `<img src="${escape(article.image)}" alt="${escape(article.title)}" class="modal-image">` : '';
      const externalLink = article.url && article.url.startsWith('http')
        ? `<div class="modal-external-cta"><a href="${escape(article.url)}" target="_blank" rel="noreferrer">Read Full Article on ${escape(article.platform || 'External Site')} <b>↗</b></a></div>`
        : '';
      sharedModalBody.innerHTML = `
        <div class="modal-header-meta">
          <span class="modal-cat-tag">${escape(catTag)}</span>
          <span class="modal-readtime-tag">◷ ${escape(readTime)}</span>
        </div>
        <h1 class="modal-title">${escape(article.title)}</h1>
        <div class="modal-byline">
          <div class="modal-avatar">AK</div>
          <div>
            <span class="modal-author-name">Abikrishna T.</span>
            <span class="modal-byline-date">${escape(dateStr)}</span>
          </div>
        </div>
        ${imgMarkup}
        <div class="modal-body-text">
          ${renderBodyShared(article, article.contentBody)}
          ${externalLink}
        </div>
      `;
      sharedModal.classList.add('active');
      sharedModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeSharedModal = () => {
      if (!sharedModal) return;
      sharedModal.classList.remove('active');
      sharedModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (sharedModalClose) sharedModalClose.onclick = closeSharedModal;
    if (sharedModalBackdrop) sharedModalBackdrop.onclick = closeSharedModal;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSharedModal(); });

    // Wire up static homepage article cards (fallback HTML with data-id, not yet replaced by JS)
    const staticArticleMap = {};
    defaultJournalArticles.forEach(a => { staticArticleMap[String(a.id)] = a; });
    document.querySelectorAll('#journal .article-card[data-id]').forEach(cardEl => {
      if (cardEl.dataset.wired) return; // skip if already wired by dynamic render
      cardEl.dataset.wired = '1';
      cardEl.addEventListener('click', () => {
        const article = staticArticleMap[cardEl.dataset.id];
        if (article) openSharedModal(article);
      });
    });

    // 5. Editorial Journal Page Full Functional Setup (blog.html)
    if (document.body.classList.contains('blog-page')) {
      const spotlightContainer = document.querySelector('#featured-spotlight');
      const blogGrid = document.querySelector('#blog-grid-container');
      const searchInput = document.querySelector('#journal-search');
      const sortSelect = document.querySelector('#journal-sort');
      const filterButtons = document.querySelectorAll('.filter-pill');
      const noResultsBox = document.querySelector('#no-results');
      const resetSearchBtn = document.querySelector('#reset-search-btn');

      const modal = sharedModal;
      const modalBody = sharedModalBody;

      // Use CMS items if present, otherwise fallback to default articles
      const cmsJournal = items.filter(item => typeOf(item) === 'journal');
      let allArticles = cmsJournal.length ? cmsJournal : defaultJournalArticles;

      let currentSearch = '';
      let currentCategory = 'all';
      let currentSort = 'latest';
      let currentPage = 1;
      const itemsPerPage = 6;
      const paginationContainer = document.querySelector('#journal-pagination');

      const getArticlesData = () => {
        const q = (currentSearch || '').trim().toLowerCase();
        const filterCat = (currentCategory || 'all').trim().toLowerCase();

        let filtered = allArticles.filter(item => {
          // Category matching
          const itemCat = (categoryOf(item) || '').trim().toLowerCase();
          const matchesCategory = filterCat === 'all' || itemCat.includes(filterCat) || filterCat.includes(itemCat);
          if (!matchesCategory) return false;

          // Keyword Search matching
          if (!q) return true;
          const title = (item.title || '').toLowerCase();
          const desc = (item.description || '').toLowerCase();
          const tags = (item.tags || '').toLowerCase();
          const body = (item.contentBody || '').toLowerCase();
          const platform = (item.platform || '').toLowerCase();

          return title.includes(q) || desc.includes(q) || itemCat.includes(q) || tags.includes(q) || body.includes(q) || platform.includes(q);
        });

        // Sorting
        if (currentSort === 'latest') {
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        } else if (currentSort === 'oldest') {
          filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        } else if (currentSort === 'title') {
          filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        return filtered;
      };

      const openArticleModal = openSharedModal;
      const closeArticleModal = closeSharedModal;

      const renderArticleCard = (item) => {
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 2026';
        const catTag = categoryOf(item) || 'UX / UI Design';
        const readTime = item.readTime || '5 min read';
        const platformBadge = item.platform ? `<span style="font-size:10px;background:#f0ebe5;padding:2px 8px;border-radius:4px;color:#555;font-weight:700;">${escape(item.platform)}</span>` : '';
        const imageHtml = item.image ?
          `<img src="${escape(cleanImgUrl(item.image))}" alt="${escape(item.title)}">` :
          `<div style="height:210px;display:grid;place-items:center;background:linear-gradient(135deg,#1b1b1b,#913d22);color:#fff;font-weight:800;font-size:24px;">AK.</div>`;

        return `
          <article class="journal-card reveal visible" data-id="${escape(item.id)}">
            <div class="journal-card-media">${imageHtml}</div>
            <div class="journal-card-body">
              <div class="journal-card-meta">
                <span class="journal-category-tag">${escape(catTag)}</span>
                <span class="journal-read-time">◷ ${escape(readTime)}</span>
              </div>
              <h3 class="journal-card-title">${escape(item.title)}</h3>
              <p class="journal-card-excerpt">${escape(item.description || 'Exploring product decisions and design thinking.')}</p>
              <div class="journal-card-footer">
                <div>
                  <span class="journal-card-date">${escape(dateStr)}</span>
                  ${platformBadge ? ` · ${platformBadge}` : ''}
                </div>
                <i class="journal-card-arrow">↗</i>
              </div>
            </div>
          </article>
        `;
      };

      const wireArticleCards = () => {
        if (!blogGrid) return;
        blogGrid.querySelectorAll('.journal-card').forEach(cardEl => {
          cardEl.onclick = () => {
            const articleId = cardEl.dataset.id;
            const target = allArticles.find(a => String(a.id) === String(articleId));
            if (target) {
              if (target.journalType === 'blog' || !target.url || !target.url.startsWith('http')) {
                openArticleModal(target);
              } else {
                window.open(target.url, '_blank', 'noopener');
              }
            }
          };
        });
      };

      const renderPagination = (totalPages) => {
        if (!paginationContainer) return;
        if (totalPages <= 1) {
          paginationContainer.style.display = 'none';
          paginationContainer.innerHTML = '';
          return;
        }
        paginationContainer.style.display = 'flex';
        let navBtns = `<button class="page-prev" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
        for (let i = 1; i <= totalPages; i++) {
          navBtns += `<button class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        navBtns += `<button class="page-next" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
        paginationContainer.innerHTML = navBtns;

        const prevBtn = paginationContainer.querySelector('.page-prev');
        if (prevBtn) prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderJournalPage(); } };

        const nextBtn = paginationContainer.querySelector('.page-next');
        if (nextBtn) nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderJournalPage(); } };

        paginationContainer.querySelectorAll('.page-num').forEach(btn => {
          btn.onclick = () => {
            currentPage = parseInt(btn.dataset.page, 10);
            renderJournalPage();
          };
        });
      };

      const renderJournalPage = () => {
        const list = getArticlesData();
        const isSearching = Boolean(currentSearch && currentSearch.trim());
        const hasCategoryFilter = currentCategory !== 'all';

        if (!list.length) {
          if (spotlightContainer) spotlightContainer.style.display = 'none';
          if (paginationContainer) paginationContainer.style.display = 'none';
          if (isSearching || hasCategoryFilter) {
            if (blogGrid) blogGrid.style.display = 'none';
            if (noResultsBox) noResultsBox.style.display = 'block';
          } else {
            if (noResultsBox) noResultsBox.style.display = 'none';
            if (blogGrid) {
              blogGrid.style.display = 'grid';
              blogGrid.innerHTML = '<p class="empty-msg" style="color:var(--muted);font-size:15px;grid-column:1/-1;padding:60px 0;text-align:center;">No articles published yet. Check back soon for new articles & design insights!</p>';
            }
          }
          return;
        }

        if (noResultsBox) noResultsBox.style.display = 'none';

        // When searching, or when filtered to a specific category, or on page > 1:
        // Render all matching results directly in the grid for clarity
        if (isSearching || currentCategory !== 'all' || currentPage > 1) {
          if (spotlightContainer) spotlightContainer.style.display = 'none';

          const totalPages = Math.ceil(list.length / itemsPerPage);
          if (currentPage > totalPages) currentPage = 1;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedItems = list.slice(startIndex, startIndex + itemsPerPage);

          if (blogGrid) {
            blogGrid.style.display = 'grid';
            blogGrid.innerHTML = paginatedItems.map(item => renderArticleCard(item)).join('');
            wireArticleCards();
          }
          renderPagination(totalPages);
          return;
        }

        // Default Mode: Lead Spotlight Article + Paginated Remaining Grid
        const spotlightArticle = list.find(a => a.featured) || list[0];
        const gridArticles = list.filter(a => String(a.id) !== String(spotlightArticle.id));

        if (spotlightContainer) {
          spotlightContainer.style.display = 'block';
          const dateStr = spotlightArticle.createdAt ? new Date(spotlightArticle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 12, 2026';
          const catTag = categoryOf(spotlightArticle) || 'Product Design';
          const readTime = spotlightArticle.readTime || '8 min read';
          const imgHtml = spotlightArticle.image ?
            `<img src="${escape(cleanImgUrl(spotlightArticle.image))}" alt="${escape(spotlightArticle.title)}">` :
            `<div style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(135deg,#1b1b1b,#913d22);color:#fff;font-weight:800;font-size:36px;">AK.</div>`;

          spotlightContainer.innerHTML = `
            <div class="spotlight-card" data-id="${escape(spotlightArticle.id)}">
              <div class="spotlight-media">${imgHtml}</div>
              <div class="spotlight-info">
                <div class="spotlight-badge-row">
                  <span class="spotlight-tag">${escape(catTag)}</span>
                  <span class="spotlight-readtime">◷ ${escape(readTime)}</span>
                </div>
                <h2 class="spotlight-title">${escape(spotlightArticle.title)}</h2>
                <p class="spotlight-desc">${escape(spotlightArticle.description || 'Exploring design thinking, decision frameworks, and digital product strategy.')}</p>
                <div class="spotlight-footer">
                  <div>
                    <span class="spotlight-author">Abikrishna T.</span>
                    <span class="spotlight-date"> · ${escape(dateStr)}</span>
                  </div>
                  <span class="spotlight-cta">Read Article <b>↗</b></span>
                </div>
              </div>
            </div>
          `;

          const spotlightEl = spotlightContainer.querySelector('.spotlight-card');
          if (spotlightEl) {
            spotlightEl.onclick = () => {
              if (spotlightArticle.journalType === 'blog' || !spotlightArticle.url || !spotlightArticle.url.startsWith('http')) {
                openArticleModal(spotlightArticle);
              } else {
                window.open(spotlightArticle.url, '_blank', 'noopener');
              }
            };
          }
        }

        const displayGridList = gridArticles.length ? gridArticles : list;
        const totalPages = Math.ceil(displayGridList.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = displayGridList.slice(startIndex, startIndex + itemsPerPage);

        if (blogGrid) {
          blogGrid.style.display = 'grid';
          blogGrid.innerHTML = paginatedItems.map(item => renderArticleCard(item)).join('');
          wireArticleCards();
        }
        renderPagination(totalPages);
      };

      // Category switcher function for Journal
      window.__setJournalCategory = (cat) => {
        currentCategory = cat || 'all';
        currentPage = 1;
        renderJournalPage();
      };

      // Initialize journal filters with saved settings or defaults
      try {
        const saved = JSON.parse(localStorage.getItem('ak_portfolio_settings') || '{}');
        if (saved.journalTopics) {
          renderJournalFilters(saved.journalTopics);
        } else {
          renderJournalFilters(defaultJournalTopics);
        }
      } catch (e) {
        renderJournalFilters(defaultJournalTopics);
      }

      // Realtime Search Input Handler
      const searchClearBtn = document.querySelector('#journal-search-clear');

      const handleSearch = () => {
        currentSearch = (searchInput ? searchInput.value : '').trim();
        if (searchClearBtn) {
          searchClearBtn.style.display = currentSearch ? 'inline-block' : 'none';
        }
        currentPage = 1;
        renderJournalPage();
      };

      if (searchClearBtn) {
        searchClearBtn.onclick = () => {
          if (searchInput) searchInput.value = '';
          searchClearBtn.style.display = 'none';
          currentSearch = '';
          currentPage = 1;
          renderJournalPage();
          if (searchInput) searchInput.focus();
        };
      }

      if (searchInput) {
        ['input', 'keyup', 'change', 'search'].forEach(evt => {
          searchInput.addEventListener(evt, handleSearch);
        });
        searchInput.addEventListener('paste', () => setTimeout(handleSearch, 10));
        searchInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
          }
        });
      }

      // Sort Select Handler
      if (sortSelect) {
        sortSelect.onchange = (e) => {
          currentSort = e.target.value;
          renderJournalPage();
        };
      }

      // Reset Button Handler
      if (resetSearchBtn) {
        resetSearchBtn.onclick = () => {
          currentSearch = '';
          currentCategory = 'all';
          currentPage = 1;
          if (searchInput) searchInput.value = '';
          const bFilters = document.querySelectorAll('#blog-filters button');
          bFilters.forEach(b => b.classList.toggle('active', (b.dataset.category || 'all') === 'all'));
          renderJournalPage();
        };
      }

      // -------------------------------------------------------------
      // Multi-Philosophy Kinetic Tab Controller
      // -------------------------------------------------------------
      const manifestoData = [
        {
          quote: `“Design is not just what it <span class="kinetic-word" data-label="Visual Aesthetics & Form">looks like</span> and <span class="kinetic-word" data-label="Sensory Touch & Feeling">feels like</span>. Design is <span class="kinetic-word active-highlight" data-label="System Architecture & Function">how it works</span>.”`,
          avatar: 'SJ',
          author: 'STEVE JOBS',
          role: 'Co-Founder, Apple Inc.'
        },
        {
          quote: `“Good design is <span class="kinetic-word active-highlight" data-label="Minimalism & Purity">as little design as possible</span>. Less, but <span class="kinetic-word" data-label="Higher Craft & Performance">better</span>.”`,
          avatar: 'DR',
          author: 'DIETER RAMS',
          role: 'Chief of Design, Braun'
        },
        {
          quote: `“It’s easy to be <span class="kinetic-word" data-label="Superficial Novelty">different</span>, but very difficult to be <span class="kinetic-word active-highlight" data-label="Meaningful Excellence">better</span>.”`,
          avatar: 'JI',
          author: 'JONY IVE',
          role: 'Former Chief Design Officer, Apple'
        },
        {
          quote: `“Styles come and go. Good design is a <span class="kinetic-word active-highlight" data-label="Universal Communication">language</span>, not a <span class="kinetic-word" data-label="Transient Trend">style</span>.”`,
          avatar: 'MV',
          author: 'MASSIMO VIGNELLI',
          role: 'Legendary Systems & Typography Master'
        }
      ];

      const pTabs = document.querySelectorAll('.philosophy-tab');
      const pStage = document.querySelector('#philosophy-stage');
      const pQuote = document.querySelector('#philosophy-quote');
      const pAvatar = document.querySelector('#philosophy-avatar');
      const pAuthor = document.querySelector('#philosophy-author');
      const pRole = document.querySelector('#philosophy-role');
      const pCounter = document.querySelector('#carousel-counter');
      const cPrevBtn = document.querySelector('#carousel-prev-btn');
      const cNextBtn = document.querySelector('#carousel-next-btn');

      let activePhilosophyIdx = 0;

      const setPhilosophy = (idx) => {
        if (!manifestoData[idx]) return;
        activePhilosophyIdx = idx;

        pTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
        if (pCounter) {
          pCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(manifestoData.length).padStart(2, '0')}`;
        }

        if (pStage) pStage.classList.add('switching');
        setTimeout(() => {
          const data = manifestoData[idx];
          if (pQuote) pQuote.innerHTML = data.quote;
          if (pAvatar) pAvatar.textContent = data.avatar;
          if (pAuthor) pAuthor.textContent = data.author;
          if (pRole) pRole.textContent = data.role;
          if (pStage) pStage.classList.remove('switching');
        }, 180);
      };

      pTabs.forEach(tab => {
        tab.onclick = () => {
          const idx = parseInt(tab.dataset.index, 10);
          if (!isNaN(idx)) setPhilosophy(idx);
        };
      });

      if (cPrevBtn) {
        cPrevBtn.onclick = () => {
          const nextIdx = (activePhilosophyIdx - 1 + manifestoData.length) % manifestoData.length;
          setPhilosophy(nextIdx);
        };
      }

      if (cNextBtn) {
        cNextBtn.onclick = () => {
          const nextIdx = (activePhilosophyIdx + 1) % manifestoData.length;
          setPhilosophy(nextIdx);
        };
      }

      renderJournalPage();
    }
  });
})();
