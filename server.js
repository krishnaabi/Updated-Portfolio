const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const envFile = path.join(root, '.env');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Load environment variables from .env if present
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach(line => {
    const separator = line.indexOf('=');
    if (separator > 0) process.env[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  });
}

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://xyzoejcxcwklkjqflmit.supabase.co').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

const defaultSettings = {
  email: 'abikrishna15@gmail.com',
  notificationEmail: 'abikrishna15@gmail.com',
  resumeUrl: '',
  homeHeroImage: '',
  aboutHeroImage: '',
  workHeroImage: '',
  playgroundHeroImage: '',
  journalHeroImage: '',
  homeCenterImage: '',
  playgroundTopics: ['UI & Motion', 'Concepts', '3D & Visuals', 'Quick Sketches', 'Just for Fun'],
  journalTopics: ['UX / UI Design', 'Product Design', 'Process', 'Career', 'Tools', 'Opinion', 'Design Thinking']
};

const defaultTestimonials = [
  {
    id: "t1",
    name: "Sanya Mehra",
    role: "Founder, Noma Health",
    quote: "Abi combines curiosity, empathy and sharp product thinking. He makes complex experiences feel effortless.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "t2",
    name: "Rohan Varma",
    role: "VP Product, FinScale",
    quote: "Working with Abi transformed our product clarity. User activation jumped 45% within two months of launch.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "t3",
    name: "Elena Rostova",
    role: "Design Director, Studio Nova",
    quote: "A rare talent who bridges design, business strategy and engineering seamlessly. Exceptional craft and velocity.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  }
];

const defaultBrands = [
  { id: "b1", name: "Honey Universal", logo: "" },
  { id: "b2", name: "Haniooo", logo: "" },
  { id: "b3", name: "G-FORCE", logo: "" },
  { id: "b4", name: "STUAK", logo: "" },
  { id: "b5", name: "FLUBN", logo: "" }
];

const defaultMilestones = [
  {
    id: "m1",
    title: "Hanioo Launch Event & Stage Pitch",
    category: "🎤 STAGE KEYNOTE PRESENTATION",
    year: "2025",
    eventLocation: "CHENNAI TECH SUMMIT",
    summary: "Presented the product UX strategy, real-time interpreter booking architecture, and component design system live to an audience of tech founders and industry leaders.",
    spec1Label: "🎤 AUDIENCE",
    spec1Value: "500+ Attendees",
    spec2Label: "🚀 STAGE DEMO",
    spec2Value: "Live Dispatch UX",
    spec3Label: "📱 PLATFORM",
    spec3Value: "iOS, Web & Android",
    url: "https://www.behance.net/gallery/248442393/Hanioo-Interpretation-Application",
    buttonText: "Watch Keynote Deck",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=95",
    displayOrder: 1
  },
  {
    id: "m2",
    title: "Hanioo Platform Marketplace Shipped",
    category: "🚀 GLOBAL PRODUCT LAUNCH",
    year: "2025",
    eventLocation: "SHIPPED TO APP STORE",
    summary: "Architected and launched the full-scale interpreter booking ecosystem across iOS & Web, empowering on-demand multi-language interpretation assistance globally.",
    spec1Label: "🚀 RELEASES",
    spec1Value: "iOS & Web Apps",
    spec2Label: "⚡ MATCH TIME",
    spec2Value: "Under 30 Seconds",
    spec3Label: "🌐 COVERAGE",
    spec3Value: "Global Dispatch",
    url: "https://hanioo.com",
    buttonText: "Explore Live Application",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=95",
    displayOrder: 2
  },
  {
    id: "m3",
    title: "Product Design Craft Leadership",
    category: "🏆 CRAFT EXCELLENCE RECOGNITION",
    year: "2024",
    eventLocation: "UI/UX LEADERSHIP AWARD",
    summary: "Recognized for building intuitive digital products, micro-interactive design systems, and user-centric software over 4.5+ years of design leadership.",
    spec1Label: "🏆 CRAFT",
    spec1Value: "Product UI/UX",
    spec2Label: "⭐ PRECISION",
    spec2Value: "Micro-Interactions",
    spec3Label: "🎯 FOCUS",
    spec3Value: "Scalable Systems",
    url: "https://linkedin.com/in/abikrishna",
    buttonText: "Read LinkedIn Highlight",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=95",
    displayOrder: 3
  },
  {
    id: "m4",
    title: "Design System Token Engine",
    category: "🌐 SYSTEM ARCHITECTURE SHIFT",
    year: "2024",
    eventLocation: "ENTERPRISE DESIGN TOKENS",
    summary: "Engineered a unified enterprise design system token engine with automated Figma libraries, responsive guidelines, and dark mode theme switching.",
    spec1Label: "🌐 TOKENS",
    spec1Value: "200+ Components",
    spec2Label: "⚡ VELOCITY",
    spec2Value: "4x Faster Builds",
    spec3Label: "🎨 THEMES",
    spec3Value: "Light & Dark Modes",
    url: "work.html",
    buttonText: "Explore Design System",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=95",
    displayOrder: 4
  }
];

const body = req => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    try { resolve(JSON.parse(data || '{}')); } catch (error) { reject(error); }
  });
});

const json = (res, code, value) => {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(value));
};

// Generic REST API client for Supabase database tables
const supabase = async (resource, options = {}) => {
  const url = `${SUPABASE_URL}/rest/v1/${resource}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase REST error (${response.status}): ${text}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Supabase Storage upload handler (stores strictly in Supabase bucket portfolio-images)
const saveUpload = async incoming => {
  const rawData = typeof incoming === 'string' ? incoming : (incoming?.data || '');
  if (!rawData) throw new Error('No upload data provided');

  if (rawData.startsWith('http://') || rawData.startsWith('https://')) {
    return rawData;
  }

  let mime = 'image/png';
  let ext = 'png';
  let buffer;

  const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(rawData);
  if (match) {
    mime = match[1];
    const cleanData = match[2].replace(/\s/g, '');
    buffer = Buffer.from(cleanData, 'base64');
    ext = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'image/avif': 'avif',
      'application/pdf': 'pdf'
    }[mime] || mime.split('/')[1] || 'png';
  } else {
    const cleanBase64 = rawData.replace(/^data:[^;]+;base64,/, '').replace(/\s/g, '');
    buffer = Buffer.from(cleanBase64, 'base64');
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Direct upload to Supabase Storage endpoint
  const storageUrl = `${SUPABASE_URL}/storage/v1/object/portfolio-images/${filename}`;
  const uploadRes = await fetch(storageUrl, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': mime,
      'x-upsert': 'true'
    },
    body: buffer
  });

  if (uploadRes.ok) {
    return `${SUPABASE_URL}/storage/v1/object/public/portfolio-images/${filename}`;
  }

  const errText = await uploadRes.text();
  console.warn('Supabase storage upload notice:', uploadRes.status, errText);
  return `${SUPABASE_URL}/storage/v1/object/public/portfolio-images/${filename}`;
};

const fetchMetadata = async rawUrl => {
  let targetUrl = (rawUrl || '').trim();
  if (!targetUrl) return { ok: true, title: 'Design & Product Article', description: '', image: '', platform: 'Web', readTime: '5 min read', date: new Date().toISOString(), url: '' };
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }

  const host = parsedUrl.hostname.replace(/^www\./i, '');
  let defaultPlatform = host.split('.')[0];
  defaultPlatform = defaultPlatform.charAt(0).toUpperCase() + defaultPlatform.slice(1);
  if (host.includes('medium.com')) defaultPlatform = 'Medium';
  else if (host.includes('substack.com')) defaultPlatform = 'Substack';
  else if (host.includes('linkedin.com')) defaultPlatform = 'LinkedIn';
  else if (host.includes('dev.to')) defaultPlatform = 'Dev.to';
  else if (host.includes('hashnode.dev') || host.includes('hashnode.com')) defaultPlatform = 'Hashnode';
  else if (host.includes('behance.net')) defaultPlatform = 'Behance';
  else if (host.includes('dribbble.com')) defaultPlatform = 'Dribbble';

  let title = '';
  let description = '';
  let image = '';
  let platform = defaultPlatform;
  let readTime = '5 min read';
  let date = new Date().toISOString().split('T')[0];

  // Strategy 1: Direct HTML Fetch & Meta Tag Extraction
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();

      const decodeHtml = str => {
        if (!str) return '';
        return str
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .trim();
      };

      const getMetaContent = (nameOrProp) => {
        const re = new RegExp(`<meta[^>]+(?:name|property)=["']${nameOrProp}["'][^>]+content=["']([^"']+)["']`, 'i');
        const match = html.match(re);
        if (match) return decodeHtml(match[1]);
        const reReverse = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${nameOrProp}["']`, 'i');
        const matchRev = html.match(reReverse);
        return matchRev ? decodeHtml(matchRev[1]) : '';
      };

      title = getMetaContent('og:title') || getMetaContent('twitter:title') || getMetaContent('title');
      if (!title) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) title = decodeHtml(titleMatch[1]);
      }

      description = getMetaContent('og:description') || getMetaContent('twitter:description') || getMetaContent('description');
      image = getMetaContent('og:image:secure_url') || getMetaContent('og:image') || getMetaContent('twitter:image') || getMetaContent('twitter:image:src');

      const siteName = getMetaContent('og:site_name') || getMetaContent('twitter:site');
      if (siteName) platform = siteName.replace(/^@/, '');

      const publishedTime = getMetaContent('article:published_time') || getMetaContent('og:published_time') || getMetaContent('date') || getMetaContent('pubdate');
      if (publishedTime) {
        try {
          const d = new Date(publishedTime);
          if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0];
        } catch {}
      }

      const rt = getMetaContent('twitter:data1') || getMetaContent('reading_time');
      if (rt) {
        readTime = /min/i.test(rt) ? rt : `${rt} min read`;
      } else {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          const textOnly = bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                       .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                       .replace(/<[^>]+>/g, ' ')
                                       .replace(/\s+/g, ' ')
                                       .trim();
          const words = textOnly.split(/\s+/).length;
          if (words > 200) {
            const estMins = Math.max(1, Math.round(words / 220));
            readTime = `${estMins} min read`;
          }
        }
      }

      const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const block of jsonLdMatches) {
          try {
            const rawJson = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
            const parsed = JSON.parse(rawJson);
            const targetObj = Array.isArray(parsed) ? parsed[0] : (parsed['@graph'] ? parsed['@graph'].find(g => g.headline || g.image) || parsed['@graph'][0] : parsed);
            if (targetObj) {
              if (!title && targetObj.headline) title = decodeHtml(targetObj.headline);
              if (!title && targetObj.name) title = decodeHtml(targetObj.name);
              if (!description && targetObj.description) description = decodeHtml(targetObj.description);
              if (!image && targetObj.image) {
                if (typeof targetObj.image === 'string') image = targetObj.image;
                else if (Array.isArray(targetObj.image) && targetObj.image[0]) image = typeof targetObj.image[0] === 'string' ? targetObj.image[0] : targetObj.image[0].url;
                else if (targetObj.image.url) image = targetObj.image.url;
              }
              if (targetObj.datePublished) {
                const d = new Date(targetObj.datePublished);
                if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0];
              }
            }
          } catch {}
        }
      }
    }
  } catch {}

  // Strategy 2: Microlink API Fallback
  if (!title || !image || !description) {
    try {
      const microRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(targetUrl)}&screenshot=false&meta=true`);
      if (microRes.ok) {
        const microData = await microRes.json();
        if (microData.status === 'success' && microData.data) {
          const d = microData.data;
          if (!title && d.title) title = d.title;
          if (!description && d.description) description = d.description;
          if (!image && d.image && d.image.url) image = d.image.url;
          if (d.publisher && platform === defaultPlatform) platform = d.publisher;
          if (d.date) {
            try {
              const pd = new Date(d.date);
              if (!isNaN(pd.getTime())) date = pd.toISOString().split('T')[0];
            } catch {}
          }
        }
      }
    } catch {}
  }

  // LinkedIn Snowflake timestamp extraction (e.g. posts, activity IDs, updates)
  if (/linkedin\.com|licdn\.com/i.test(targetUrl)) {
    const actMatch = targetUrl.match(/(?:activity|ugcPost)[-:](\d{15,21})/i) ||
                     targetUrl.match(/update\/urn:li:(?:activity|ugcPost):(\d{15,21})/i) ||
                     targetUrl.match(/posts\/[^_]+_([^\/]+)-activity-(\d{15,21})/i) ||
                     targetUrl.match(/(\d{18,20})/);
    if (actMatch) {
      const idStr = actMatch[2] || actMatch[1];
      try {
        const actId = BigInt(idStr);
        const timeMs = Number(actId >> 22n);
        const pd = new Date(timeMs);
        if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2008 && pd.getFullYear() <= new Date().getFullYear() + 1) {
          date = pd.toISOString().split('T')[0];
        }
      } catch {}
    }
    const epochMatch = targetUrl.match(/\/(\d{13})(?:\?|\/|$)/);
    if (epochMatch) {
      try {
        const pd = new Date(Number(epochMatch[1]));
        if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2008 && pd.getFullYear() <= new Date().getFullYear() + 1) {
          date = pd.toISOString().split('T')[0];
        }
      } catch {}
    }
  }

  // URL slug date fallback (e.g. /2024/03/15/)
  const urlDateMatch = targetUrl.match(/(20[12]\d)[/-](0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])/);
  if (urlDateMatch && (!date || date === new Date().toISOString().split('T')[0])) {
    date = `${urlDateMatch[1]}-${urlDateMatch[2]}-${urlDateMatch[3]}`;
  }

  // Clean title
  if (title) {
    title = title
      .split(/\s+[|\-—–]\s+(?:Medium|Substack|LinkedIn|Dev\.to|Hashnode|UX Collective|Behance|Dribbble|TechCrunch)$/i)[0]
      .replace(/\s+[|\-—–]\s+by\s+[^|\-—–]+$/i, '')
      .trim();
  }

  // Resolve relative image URLs to absolute
  if (image) {
    try {
      if (image.startsWith('//')) {
        image = 'https:' + image;
      } else if (image.startsWith('/')) {
        image = new URL(image, targetUrl).href;
      }
    } catch {}
  }

  if (!title) {
    const pathSegs = parsedUrl.pathname.split('/').filter(Boolean);
    const lastSeg = pathSegs.pop() || '';
    const cleanSlug = lastSeg.replace(/-[a-f0-9]{8,12}$/i, '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
    title = cleanSlug.length > 3 ? cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1) : `Article on ${platform}`;
  }

  if (!description) {
    description = `An article published on ${platform} exploring product design, strategy and creative engineering.`;
  }

  return { ok: true, title: title.trim(), description: description.trim(), image: (image || '').trim(), platform: platform.trim(), readTime: readTime.trim(), date, url: targetUrl };
};

// Mapper: Supabase row -> Frontend Project
const toProject = row => ({
  id: row.id,
  title: row.title,
  category: `${row.content_type}|${row.category || 'Product Design'}`,
  description: row.description || '',
  contentBody: row.content_body || '',
  url: row.destination_url || '',
  image: row.image_url || '',
  featured: Boolean(row.featured),
  tags: row.tags || '',
  readTime: row.read_time || '5 min read',
  platform: row.platform || '',
  journalType: row.journal_type || 'link',
  createdAt: row.created_at,
  displayOrder: row.display_order || 0
});

// Projects API (Supabase ONLY)
const getProjects = async () => {
  try {
    const rows = await supabase('portfolio_content?select=*&order=display_order.asc,created_at.desc');
    return (rows || []).map(toProject);
  } catch (e) {
    console.error('Supabase getProjects error:', e.message);
    return [];
  }
};

const addProject = async incoming => {
  const [contentType, ...categoryParts] = (incoming.category || 'work|main|Product Design').split('|');
  const category = categoryParts.join('|');
  const featured = Boolean(incoming.featured);
  const tags = incoming.tags || '';
  const readTime = incoming.readTime || '5 min read';
  const platform = incoming.platform || '';
  const journalType = incoming.journalType || 'link';
  const contentBody = incoming.contentBody || '';
  const createdAt = incoming.date ? new Date(incoming.date).toISOString() : new Date().toISOString();

  const payload = {
    content_type: contentType || 'work',
    title: incoming.title,
    category: category || 'main|Product Design',
    description: incoming.description || '',
    content_body: contentBody,
    destination_url: incoming.url || null,
    image_url: incoming.image || null,
    featured,
    tags,
    read_time: readTime,
    platform,
    journal_type: journalType,
    created_at: createdAt
  };

  try {
    const res = await supabase('portfolio_content', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) && res[0] ? toProject(res[0]) : { id: Date.now().toString(), ...incoming };
  } catch (e) {
    console.error('Supabase addProject error:', e.message);
    return { id: Date.now().toString(), ...incoming };
  }
};

const updateProject = async (id, changes) => {
  const payload = {};
  if ('title' in changes) payload.title = changes.title;
  if ('description' in changes) payload.description = changes.description;
  if ('contentBody' in changes) payload.content_body = changes.contentBody;
  if ('url' in changes) payload.destination_url = changes.url;
  if ('image' in changes) payload.image_url = changes.image;
  if ('featured' in changes) payload.featured = Boolean(changes.featured);
  if ('tags' in changes) payload.tags = changes.tags;
  if ('readTime' in changes) payload.read_time = changes.readTime;
  if ('platform' in changes) payload.platform = changes.platform;
  if ('journalType' in changes) payload.journal_type = changes.journalType;
  if ('date' in changes && changes.date) payload.created_at = new Date(changes.date).toISOString();

  if ('category' in changes) {
    const [contentType, ...categoryParts] = (changes.category || 'work|main|Product Design').split('|');
    payload.content_type = contentType;
    payload.category = categoryParts.join('|');
  }

  try {
    const res = await supabase(`portfolio_content?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) && res[0] ? toProject(res[0]) : { id, ...changes };
  } catch (e) {
    console.error('Supabase updateProject error:', e.message);
    return { id, ...changes };
  }
};

const removeProject = async id => {
  try {
    await supabase(`portfolio_content?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Supabase removeProject error:', e.message);
  }
  return { ok: true };
};

const reorderProjects = async (orderedItems) => {
  if (Array.isArray(orderedItems)) {
    for (let index = 0; index < orderedItems.length; index++) {
      const item = orderedItems[index];
      if (item && item.id) {
        try {
          await supabase(`portfolio_content?id=eq.${encodeURIComponent(item.id)}`, {
            method: 'PATCH',
            body: JSON.stringify({ display_order: index + 1 })
          });
        } catch (e) { }
      }
    }
  }
  return getProjects();
};

// Messages API (Supabase ONLY)
const getMessages = async () => {
  try {
    const rows = await supabase('contact_messages?select=*&order=created_at.desc');
    return (rows || []).map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      projectType: r.project_type || 'General Inquiry',
      message: r.message,
      createdAt: r.created_at
    }));
  } catch (e) {
    console.error('Supabase getMessages error:', e.message);
    return [];
  }
};

const saveMessage = async message => {
  const payload = {
    name: message.name || 'Anonymous',
    email: message.email || '',
    project_type: message.projectType || 'General Inquiry',
    message: message.message || ''
  };

  try {
    await supabase('contact_messages', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Supabase saveMessage error:', e.message);
  }

  // Optional FormSubmit email dispatch
  try {
    const targetEmail = message.email || 'abikrishna15@gmail.com';
    const formSubmitEndpoint = targetEmail.includes('abikrishna')
      ? 'https://formsubmit.co/ajax/45f0be24b864aae1adf768d96a06bd00'
      : `https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`;

    await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `New Portfolio Inquiry: ${payload.project_type} from ${payload.name}`,
        name: payload.name,
        email: payload.email,
        projectType: payload.project_type,
        submittedAt: new Date().toLocaleString(),
        message: payload.message
      })
    });
  } catch (e) { }

  return payload;
};

const removeMessage = async id => {
  try {
    await supabase(`contact_messages?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Supabase removeMessage error:', e.message);
  }
  return { ok: true };
};

// Settings API (Supabase ONLY)
const getSettings = async () => {
  try {
    const rows = await supabase('portfolio_settings?id=eq.global&select=*');
    if (Array.isArray(rows) && rows.length > 0 && rows[0].settings) {
      return { ...defaultSettings, ...rows[0].settings };
    }
    // Initialize global settings row in Supabase
    await supabase('portfolio_settings', {
      method: 'POST',
      body: JSON.stringify({ id: 'global', settings: defaultSettings })
    });
    return defaultSettings;
  } catch (e) {
    console.error('Supabase getSettings error:', e.message);
    return defaultSettings;
  }
};

const saveSettings = async incoming => {
  try {
    const current = await getSettings();
    const updated = { ...current, ...incoming };
    await supabase('portfolio_settings?id=eq.global', {
      method: 'PATCH',
      body: JSON.stringify({ settings: updated, updated_at: new Date().toISOString() })
    });
    return updated;
  } catch (e) {
    console.error('Supabase saveSettings error:', e.message);
    return { ...defaultSettings, ...incoming };
  }
};

// Testimonials API (Supabase ONLY)
const getTestimonials = async () => {
  try {
    const rows = await supabase('portfolio_testimonials?select=*&order=created_at.desc');
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map(r => ({ id: r.id, name: r.name, role: r.role, quote: r.quote, img: r.img }));
    }
    // Seed default testimonials into Supabase if table is empty
    for (const item of defaultTestimonials) {
      await supabase('portfolio_testimonials', {
        method: 'POST',
        body: JSON.stringify({ id: item.id, name: item.name, role: item.role, quote: item.quote, img: item.img })
      }).catch(() => { });
    }
    return defaultTestimonials;
  } catch (e) {
    console.error('Supabase getTestimonials error:', e.message);
    return defaultTestimonials;
  }
};

const saveTestimonial = async incoming => {
  try {
    if (incoming.id) {
      await supabase(`portfolio_testimonials?id=eq.${encodeURIComponent(incoming.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: incoming.name, role: incoming.role, quote: incoming.quote, img: incoming.img })
      });
      return incoming;
    } else {
      const res = await supabase('portfolio_testimonials', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          name: incoming.name || 'Anonymous',
          role: incoming.role || 'Client',
          quote: incoming.quote || '',
          img: incoming.img || ''
        })
      });
      return Array.isArray(res) && res[0] ? res[0] : incoming;
    }
  } catch (e) {
    console.error('Supabase saveTestimonial error:', e.message);
    return incoming;
  }
};

const removeTestimonial = async id => {
  try {
    await supabase(`portfolio_testimonials?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Supabase removeTestimonial error:', e.message);
  }
  return { ok: true };
};

// Brands API (Supabase ONLY)
const getBrands = async () => {
  try {
    const rows = await supabase('portfolio_brands?select=*&order=created_at.desc');
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map(r => ({ id: r.id, name: r.name, logo: r.logo }));
    }
    for (const item of defaultBrands) {
      await supabase('portfolio_brands', {
        method: 'POST',
        body: JSON.stringify({ id: item.id, name: item.name, logo: item.logo })
      }).catch(() => { });
    }
    return defaultBrands;
  } catch (e) {
    console.error('Supabase getBrands error:', e.message);
    return defaultBrands;
  }
};

const saveBrand = async incoming => {
  try {
    if (incoming.id) {
      await supabase(`portfolio_brands?id=eq.${encodeURIComponent(incoming.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: incoming.name, logo: incoming.logo })
      });
      return incoming;
    } else {
      const res = await supabase('portfolio_brands', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ name: incoming.name || 'Brand', logo: incoming.logo || '' })
      });
      return Array.isArray(res) && res[0] ? res[0] : incoming;
    }
  } catch (e) {
    console.error('Supabase saveBrand error:', e.message);
    return incoming;
  }
};

const removeBrand = async id => {
  try {
    await supabase(`portfolio_brands?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Supabase removeBrand error:', e.message);
  }
  return { ok: true };
};

// Milestones API (Supabase ONLY)
const toMilestone = r => ({
  id: r.id,
  title: r.title,
  category: r.category,
  year: r.year,
  eventLocation: r.event_location,
  summary: r.summary,
  spec1Label: r.spec1_label,
  spec1Value: r.spec1_value,
  spec2Label: r.spec2_label,
  spec2Value: r.spec2_value,
  spec3Label: r.spec3_label,
  spec3Value: r.spec3_value,
  url: r.url,
  buttonText: r.button_text,
  image: r.image,
  displayOrder: r.display_order
});

const getMilestones = async () => {
  try {
    const rows = await supabase('portfolio_milestones?select=*&order=display_order.asc,created_at.desc');
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map(toMilestone);
    }
    for (const item of defaultMilestones) {
      await supabase('portfolio_milestones', {
        method: 'POST',
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          category: item.category,
          year: item.year,
          event_location: item.eventLocation,
          summary: item.summary,
          spec1_label: item.spec1Label,
          spec1_value: item.spec1Value,
          spec2_label: item.spec2Label,
          spec2_value: item.spec2Value,
          spec3_label: item.spec3Label,
          spec3_value: item.spec3Value,
          url: item.url,
          button_text: item.buttonText,
          image: item.image,
          display_order: item.displayOrder
        })
      }).catch(() => { });
    }
    return defaultMilestones;
  } catch (e) {
    console.error('Supabase getMilestones error:', e.message);
    return defaultMilestones;
  }
};

const saveMilestone = async incoming => {
  const payload = {
    title: incoming.title || 'Untitled Milestone',
    category: incoming.category || '🎤 STAGE KEYNOTE PRESENTATION',
    year: incoming.year || '2025',
    event_location: incoming.eventLocation || '',
    summary: incoming.summary || '',
    spec1_label: incoming.spec1Label || 'SPEC 1',
    spec1_value: incoming.spec1Value || '',
    spec2_label: incoming.spec2Label || 'SPEC 2',
    spec2_value: incoming.spec2Value || '',
    spec3_label: incoming.spec3Label || 'SPEC 3',
    spec3_value: incoming.spec3Value || '',
    url: incoming.url || '#',
    button_text: incoming.buttonText || 'View Highlight',
    image: incoming.image || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=95'
  };

  try {
    if (incoming.id) {
      await supabase(`portfolio_milestones?id=eq.${encodeURIComponent(incoming.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      return { id: incoming.id, ...incoming };
    } else {
      const res = await supabase('portfolio_milestones', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payload)
      });
      return Array.isArray(res) && res[0] ? toMilestone(res[0]) : { id: Date.now().toString(), ...incoming };
    }
  } catch (e) {
    console.error('Supabase saveMilestone error:', e.message);
    return { id: Date.now().toString(), ...incoming };
  }
};

const removeMilestone = async id => {
  try {
    await supabase(`portfolio_milestones?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Supabase removeMilestone error:', e.message);
  }
  return { ok: true };
};

const defaultTools = [
  { id: 't1', name: 'Figma', category: 'UI/UX · Prototyping\nDesign Systems', icon_type: 'figma', custom_icon_url: '', display_order: 1 },
  { id: 't2', name: 'FigJam', category: 'Workshops · User Flows\nMapping', icon_type: 'figjam', custom_icon_url: '', display_order: 2 },
  { id: 't3', name: 'Adobe Photoshop', category: 'Visual Design ·\nImage Editing', icon_type: 'photoshop', custom_icon_url: '', display_order: 3 },
  { id: 't4', name: 'Adobe Illustrator', category: 'Branding · Illustration\nGraphics', icon_type: 'illustrator', custom_icon_url: '', display_order: 4 },
  { id: 't5', name: 'Adobe After Effects', category: 'Motion · Visual\nContent', icon_type: 'aftereffects', custom_icon_url: '', display_order: 5 },
  { id: 't6', name: 'Framer', category: 'Web Design ·\nPrototyping', icon_type: 'framer', custom_icon_url: '', display_order: 6 },
  { id: 't7', name: 'Notion', category: 'Documentation ·\nPlanning', icon_type: 'notion', custom_icon_url: '', display_order: 7 },
  { id: 't8', name: 'AI Tools', category: 'Ideation · Content\nVisual Exploration', icon_type: 'aitools', custom_icon_url: '', display_order: 8 }
];

const toTool = r => ({
  id: r.id,
  name: r.name,
  category: r.category || '',
  icon_type: r.icon_type || 'figma',
  custom_icon_url: r.custom_icon_url || '',
  display_order: r.display_order || 0
});

const getTools = async () => {
  try {
    const rows = await supabase('portfolio_tools?select=*&order=display_order.asc,created_at.asc');
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map(toTool);
    }
    for (const item of defaultTools) {
      await supabase('portfolio_tools', {
        method: 'POST',
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          category: item.category,
          icon_type: item.icon_type,
          custom_icon_url: item.custom_icon_url,
          display_order: item.display_order
        })
      }).catch(() => { });
    }
    return defaultTools;
  } catch (e) {
    console.error('Supabase getTools error:', e.message);
    return defaultTools;
  }
};

const saveTool = async incoming => {
  const payload = {
    name: incoming.name || 'Untitled Tool',
    category: incoming.category || '',
    icon_type: incoming.icon_type || incoming.iconType || 'figma',
    custom_icon_url: incoming.custom_icon_url || incoming.customIconUrl || '',
    display_order: incoming.display_order || incoming.displayOrder || 0
  };

  try {
    if (incoming.id) {
      await supabase(`portfolio_tools?id=eq.${encodeURIComponent(incoming.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      return { id: incoming.id, ...incoming };
    } else {
      const res = await supabase('portfolio_tools', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payload)
      });
      return Array.isArray(res) && res[0] ? toTool(res[0]) : { id: Date.now().toString(), ...incoming };
    }
  } catch (e) {
    console.error('Supabase saveTool error:', e.message);
    return { id: Date.now().toString(), ...incoming };
  }
};

const removeTool = async id => {
  try {
    await supabase(`portfolio_tools?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Supabase removeTool error:', e.message);
  }
  return { ok: true };
};

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/projects' && req.method === 'GET') return json(res, 200, await getProjects());
    if (url.pathname === '/api/projects/reorder' && req.method === 'POST') {
      const incoming = await body(req);
      return json(res, 200, await reorderProjects(incoming));
    }
    if (url.pathname === '/api/projects' && req.method === 'POST') {
      const incoming = await body(req);
      if (!incoming.title || !incoming.title.trim()) return json(res, 400, { error: 'Title is required.' });
      if (!incoming.description || !incoming.description.trim()) return json(res, 400, { error: 'Description is required.' });
      const jType = incoming.journalType || 'link';
      const isJournal = (incoming.category || '').startsWith('journal');
      if (isJournal && jType === 'link') {
        if (!incoming.url || !incoming.url.trim()) return json(res, 400, { error: 'External Article URL is required.' });
        if (!/^https?:\/\//i.test(incoming.url.trim())) return json(res, 400, { error: 'URL must start with https://.' });
      }
      if (isJournal && jType === 'blog') {
        if (!incoming.contentBody || !incoming.contentBody.trim()) return json(res, 400, { error: 'Full Article Content is required for internal blog posts.' });
      }
      if (!isJournal && !incoming.url) incoming.url = '';
      return json(res, 201, await addProject(incoming));
    }
    if (url.pathname === '/api/fetch-metadata' && req.method === 'POST') {
      try {
        const { url: targetUrl } = await body(req);
        const result = await fetchMetadata(targetUrl);
        return json(res, 200, result);
      } catch {
        return json(res, 200, { ok: true, title: 'Design Article', description: 'An insightful design post.', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7451?auto=format&fit=crop&w=700&q=80', platform: 'LinkedIn', readTime: '5 min read', date: new Date().toISOString(), url: '' });
      }
    }
    if (url.pathname.startsWith('/api/projects/') && req.method === 'PATCH') { const id = url.pathname.split('/').pop(); const updated = await updateProject(id, await body(req)); return json(res, 200, updated || { ok: true }); }
    if (url.pathname.startsWith('/api/projects/') && req.method === 'DELETE') { await removeProject(url.pathname.split('/').pop()); return json(res, 200, { ok: true }); }
    if (url.pathname === '/api/testimonials' && req.method === 'GET') return json(res, 200, await getTestimonials());
    if (url.pathname === '/api/testimonials' && req.method === 'POST') {
      const incoming = await body(req);
      if (!incoming.name || !incoming.name.trim()) return json(res, 400, { error: 'Client Name is required.' });
      if (!incoming.quote || !incoming.quote.trim()) return json(res, 400, { error: 'Quote text is required.' });
      return json(res, 201, await saveTestimonial(incoming));
    }
    if (url.pathname.startsWith('/api/testimonials/') && req.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await removeTestimonial(id);
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/brands' && req.method === 'GET') return json(res, 200, await getBrands());
    if (url.pathname === '/api/brands' && req.method === 'POST') {
      const incoming = await body(req);
      if (!incoming.name || !incoming.name.trim()) return json(res, 400, { error: 'Company/Brand Name is required.' });
      return json(res, 201, await saveBrand(incoming));
    }
    if (url.pathname.startsWith('/api/brands/') && req.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await removeBrand(id);
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/milestones' && req.method === 'GET') return json(res, 200, await getMilestones());
    if (url.pathname === '/api/milestones/reorder' && req.method === 'POST') {
      const incoming = await body(req);
      return json(res, 200, await reorderMilestones(incoming));
    }
    if (url.pathname === '/api/milestones' && req.method === 'POST') {
      const incoming = await body(req);
      if (!incoming.title || !incoming.title.trim()) return json(res, 400, { error: 'Milestone Title is required.' });
      return json(res, 201, await saveMilestone(incoming));
    }
    if (url.pathname.startsWith('/api/milestones/') && req.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await removeMilestone(id);
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/tools' && req.method === 'GET') return json(res, 200, await getTools());
    if (url.pathname === '/api/tools' && req.method === 'POST') {
      const incoming = await body(req);
      if (!incoming.name || !incoming.name.trim()) return json(res, 400, { error: 'Tool Name is required.' });
      return json(res, 201, await saveTool(incoming));
    }
    if (url.pathname.startsWith('/api/tools/') && req.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await removeTool(id);
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/messages' && req.method === 'GET') return json(res, 200, await getMessages());
    if (url.pathname.startsWith('/api/messages/') && req.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await removeMessage(id);
      return json(res, 200, { ok: true });
    }
    if (url.pathname === '/api/settings' && req.method === 'GET') return json(res, 200, await getSettings());
    if (url.pathname === '/api/settings' && req.method === 'PUT') return json(res, 200, await saveSettings(await body(req)));
    if (url.pathname === '/api/upload' && req.method === 'POST') return json(res, 201, { url: await saveUpload(await body(req)) });
    if (url.pathname === '/api/contact' && req.method === 'POST') { await saveMessage(await body(req)); return json(res, 201, { ok: true }); }
  } catch (error) { return json(res, 502, { error: 'Database connection error.', detail: error.message }); }

  const requestPath = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const target = path.resolve(root, requestPath);
  if (!target.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    const extension = path.extname(target);
    res.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream' }); res.end(data);
  });
}).listen(process.argv[2] || process.env.PORT || 4173, '127.0.0.1', () => console.log(`Abikrishna portfolio running on local port ${process.argv[2] || process.env.PORT || 4173}`));
