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
      title: 'Hanioo — Real-Time Interpreter Marketplace',
      category: 'work|main|Product Design',
      description: 'An on-demand interpreter booking ecosystem connecting global clients with certified multi-lingual specialists in under 30 seconds.',
      url: 'https://www.behance.net/gallery/248442393/Hanioo-Interpretation-Application',
      productUrl: 'https://hanioo.com',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=95',
      featured: true,
      tags: 'Product Design | Mobile & Web | Real-Time Dispatch | Design System',
      tools: 'Figma | React Native | Next.js | WebSockets'
    },
    {
      id: 'w2',
      title: 'Flubn — AI Creator Studio & Video Monetization',
      category: 'work|main|UI/UX Strategy',
      description: 'Empowering digital creators with automated video editing, multi-track timelines, and audience monetization tools.',
      url: 'https://flubn.com',
      productUrl: 'https://flubn.com',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=95',
      featured: true,
      tags: 'UI/UX Strategy | Creator Tools | AI Workflows | Video Editor',
      tools: 'Figma | WebGL | Canvas API | Tailwind'
    },
    {
      id: 'w3',
      title: 'FinScale — Enterprise Liquidity & Wealth Analytics',
      category: 'work|main|Fintech Product',
      description: 'High-density financial analytics platform engineered for portfolio managers, tracking real-time asset flows and predictive yields.',
      url: 'https://behance.net',
      productUrl: '',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=95',
      featured: true,
      tags: 'Fintech | Data Visualization | Dark Mode UI | Enterprise Dashboard',
      tools: 'Figma | D3.js | Design Tokens | Microcharts'
    },
    {
      id: 'w4',
      title: 'Portagam — Global Digital Asset Exchange',
      category: 'work|main|Design Systems',
      description: 'A curated marketplace and collaborative workspace for 3D artists, UI creators, and digital brand designers.',
      url: 'https://dribbble.com',
      productUrl: '',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=95',
      featured: false,
      tags: 'Design Systems | Asset Marketplace | Web Application | 3D Assets',
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
            } else if (path === '/api/settings') {
              payload = (Array.isArray(raw) && raw[0] && raw[0].settings) ? raw[0].settings : {};
            }
            if (payload && (Array.isArray(payload) ? payload.length > 0 : Object.keys(payload).length > 0)) {
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

  // Default fallback articles (displayed when no CMS journal items are created yet)
  const defaultJournalArticles = [
    {
      id: 'art-1',
      title: 'Building Design Systems That Scale Across Multi-Platform Products',
      description: 'A deep dive into token architecture, component governance, and maintaining design consistency across web and mobile ecosystems.',
      category: 'journal|main|Product Design',
      createdAt: '2026-05-12T00:00:00.000Z',
      readTime: '8 min read',
      platform: 'Design Systems',
      featured: true,
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Design System | Tokens | Scalability | Architecture',
      contentBody: '<h2>The Architecture of Modern Design Systems</h2><p>Design systems are the operational backbone of high-velocity product teams. In this article, we explore how to structure design tokens, enforce semantic naming conventions, and establish component lifecycles that bridge the gap between Figma and production code.</p>'
    },
    {
      id: 'art-2',
      title: 'Micro-Interactions and the Psychology of Fluid UI Motion',
      description: 'How subtle animation curves, tactile haptics, and spatial physics transform static interfaces into intuitive experiences.',
      category: 'journal|main|UX / UI Design',
      createdAt: '2026-04-28T00:00:00.000Z',
      readTime: '6 min read',
      platform: 'Motion Design',
      featured: false,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Motion | Micro-interactions | UI | Physics',
      contentBody: '<h2>Crafting Intentional Motion</h2><p>Motion in digital interfaces should never be ornamental. Every easing curve and transition duration communicates physical affordance, hierarchy, and spatial continuity.</p>'
    },
    {
      id: 'art-3',
      title: 'From Discovery to Delivery: The 6-Stage Product Design Framework',
      description: 'A pragmatic walkthrough of how user research, problem definition, rapid prototyping, and developer handoff come together.',
      category: 'journal|main|Process',
      createdAt: '2026-04-15T00:00:00.000Z',
      readTime: '10 min read',
      platform: 'Process & Strategy',
      featured: false,
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Framework | Strategy | Discovery | UX Process',
      contentBody: '<h2>The Product Design Framework</h2><p>Great product design is a disciplined balance between user empathy and business execution. Here is the framework refined over 4.5+ years of shipping digital products.</p>'
    },
    {
      id: 'art-4',
      title: 'Designing for AI Interfaces: Beyond Chatbots and Prompts',
      description: 'Exploring canvas-based generative workflows, proactive agent suggestions, and human-in-the-loop UX patterns.',
      category: 'journal|main|Opinion',
      createdAt: '2026-03-30T00:00:00.000Z',
      readTime: '7 min read',
      platform: 'AI & Future UX',
      featured: false,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Generative AI | AI UX | Interface Design | Future Tech',
      contentBody: '<h2>The Next Era of AI Interfaces</h2><p>Conversational chat is only the first step. The future of AI tools lies in spatial canvases, proactive agent suggestions, and context-aware workspace tools.</p>'
    },
    {
      id: 'art-5',
      title: 'The Modern Product Designer Toolstack in 2026',
      description: 'An overview of the tools, plugins, AI assistants, and code prototyping setups that power daily design workflows.',
      category: 'journal|main|Tools',
      createdAt: '2026-03-14T00:00:00.000Z',
      readTime: '5 min read',
      platform: 'Tools & Workflow',
      featured: false,
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Figma | Tooling | AI Plugins | Prototyping',
      contentBody: '<h2>Our Daily Tooling Ecosystem</h2><p>A breakdown of the modern design stack: from Figma and Origami Studio to code prototyping and AI augmentation.</p>'
    },
    {
      id: 'art-6',
      title: 'Lessons from 4.5+ Years as a Product Designer: Growth, Craft & Strategy',
      description: 'Reflections on career milestones, communicating design value to stakeholders, and cultivating obsessive craft.',
      category: 'journal|main|Career',
      createdAt: '2026-02-20T00:00:00.000Z',
      readTime: '9 min read',
      platform: 'Career Reflections',
      featured: false,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Career | Senior Design | Leadership | Stakeholders',
      contentBody: '<h2>Career Reflections in Product Design</h2><p>Key lessons learned from starting as a junior UI designer to leading end-to-end product experiences across complex domains.</p>'
    },
    {
      id: 'art-7',
      title: 'Cognitive Biases in Digital Product Design: Ethics and Friction',
      description: 'Understanding how anchoring, loss aversion, and cognitive load shape user decision making—and designing ethically.',
      category: 'journal|main|Design Thinking',
      createdAt: '2026-01-18T00:00:00.000Z',
      readTime: '8 min read',
      platform: 'Design Psychology',
      featured: false,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      journalType: 'blog',
      tags: 'Psychology | Ethics | Behavioral Economics | Heuristics',
      contentBody: '<h2>Ethical Psychology in Product UX</h2><p>How behavioral economics and user psychology inform interface decisions while maintaining transparent, user-first integrity.</p>'
    }
  ];

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
      homeHeroImage: '.portrait-wrap img',
      homeCenterImage: '.about-image img',
      aboutHeroImage: '.about-portrait img',
      workHeroImage: '.work-hero img',
      playgroundHeroImage: '.playground-hero img',
      journalHeroImage: '.journal-hero img'
    };
    Object.entries(map).forEach(([key, selector]) => {
      if (data[key] && document.querySelector(selector)) {
        document.querySelector(selector).src = cleanImgUrl(data[key]);
      }
    });

    const posMap = {
      homeHeroPosition: '.portrait-wrap img',
      homeCenterPosition: '.about-image img',
      aboutHeroPosition: '.about-portrait img',
      workHeroPosition: '.work-hero img',
      playgroundHeroPosition: '.playground-hero img',
      journalHeroPosition: '.journal-hero img'
    };
    Object.entries(posMap).forEach(([key, selector]) => {
      if (data[key] && document.querySelector(selector)) {
        document.querySelector(selector).style.objectPosition = data[key];
        document.querySelector(selector).style.objectFit = 'cover';
      }
    });

    const colorMap = {
      homeHeroColorMode: '.portrait-wrap img',
      homeCenterColorMode: '.about-image img',
      aboutHeroColorMode: '.about-portrait img',
      workHeroColorMode: '.work-hero img',
      playgroundHeroColorMode: '.playground-hero img',
      journalHeroColorMode: '.journal-hero img'
    };
    Object.entries(colorMap).forEach(([key, selector]) => {
      const el = document.querySelector(selector);
      if (el) {
        const defaultMode = key === 'homeCenterColorMode' ? 'gray' : 'original';
        const mode = data[key] || defaultMode;
        if (mode === 'original') {
          el.style.filter = 'none';
        } else if (mode === 'gray') {
          el.style.filter = 'grayscale(100%) contrast(1.1)';
        } else if (mode === 'warm-gray') {
          el.style.filter = 'grayscale(90%) sepia(20%) contrast(1.1)';
        }
      }
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
  };

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
      const projects = document.querySelector('.projects');
      const rawWork = items.filter(item => isWorkType(item));
      const workItems = rawWork.length ? rawWork : defaultWorkItems;
      if (projects) {
        projects.innerHTML = '';
        if (workItems.length) {
          workItems.forEach((item, index) => {
            const num = String(index + 1).padStart(2, '0');
            const tagsList = (item.tags || categoryOf(item) || 'Product Design').split('|').map(t => t.trim()).filter(Boolean);
            const toolsList = (item.tools || '').split('|').map(t => t.trim()).filter(Boolean);
            const tagsHtml = tagsList.length ? `<div class="tags-group">${tagsList.map(t => `<span class="meta-tag-pill">${escape(t)}</span>`).join('')}</div>` : '';
            const toolsHtml = toolsList.length ? `<div class="tools-group">${toolsList.map(t => `<span class="tool-tag-pill"><i>⚡</i> ${escape(t)}</span>`).join('')}</div>` : '';

            const caseStudyBtn = `<a href="${escape(item.url || '#')}" ${item.url && item.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''} class="project-btn">View case study <b>↗</b></a>`;
            const productBtn = item.productUrl ? `<a href="${escape(item.productUrl)}" target="_blank" rel="noreferrer" class="project-btn secondary-btn">Live Product <b>↗</b></a>` : '';

            const mediaHtml = item.image ?
              `<div class="work-art cms-work-art"><img src="${escape(item.image)}" alt="${escape(item.title)}"></div>` :
              `<div class="work-art dashboard dark-dashboard"><div class="dash-nav">◉ &nbsp; ${escape(item.title)}</div><h3>${escape(item.title)}</h3></div>`;

            const categoryLabel = categoryOf(item) || 'Product Design';
            const article = document.createElement('article');
            article.className = 'work-item custom-project project-card reveal visible';
            article.innerHTML = `<div class="project-info work-copy">
              <p class="project-number">${num} · ✦ ${escape(categoryLabel.toUpperCase())}</p>
              <h3>${escape(item.title)}</h3>
              <p class="project-description">${escape(item.description || 'Product experience by Abikrishna.')}</p>
              ${tagsHtml}
              ${toolsHtml}
              <div class="project-actions-row">
                ${caseStudyBtn}
                ${productBtn}
              </div>
            </div>
            ${mediaHtml}`;

            projects.appendChild(article);
          });

        } else {
          projects.innerHTML = '<p style="padding:60px 0;color:var(--muted);font-size:16px;">No projects uploaded yet.</p>';
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

        if (!list.length) {
          if (spotlightContainer) spotlightContainer.style.display = 'none';
          if (blogGrid) blogGrid.style.display = 'none';
          if (paginationContainer) paginationContainer.style.display = 'none';
          if (noResultsBox) noResultsBox.style.display = 'block';
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
