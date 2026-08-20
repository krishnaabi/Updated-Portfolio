/**
 * Cloudflare Worker for Abi Krishna Portfolio
 * Handles /api routes backed by Supabase & serves static assets for all other routes.
 */

const DEFAULT_SUPABASE_URL = 'https://xyzoejcxcwklkjqflmit.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
}

function getSupabaseCreds(env) {
  const url = (env && env.SUPABASE_URL) || DEFAULT_SUPABASE_URL;
  const key = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY || env.SUPABASE_ANON_KEY)) || DEFAULT_ANON_KEY;
  return { url: url.replace(/\/$/, ''), key };
}

async function sbFetch(path, options = {}, env) {
  const { url, key } = getSupabaseCreds(env);
  const targetUrl = `${url}/rest/v1/${path}`;
  const res = await fetch(targetUrl, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only intercept /api routes; all other requests are served as static assets
    if (!path.startsWith('/api')) {
      return env.ASSETS.fetch(request);
    }

    try {
      // ═══════════════════════════════════════════
      // 1. PROJECTS / EXPLORATIONS / ARTICLES API
      // ═══════════════════════════════════════════
      if (path === '/api/projects' && method === 'GET') {
        const res = await sbFetch('portfolio_content?select=*&order=display_order.asc,created_at.desc', {}, env);
        if (!res.ok) return json([]);
        const raw = await res.json();
        const payload = (raw || []).map(row => {
          const rawCat = row.category || 'Product Design';
          let sec = 'main';
          let cat = rawCat;
          if (rawCat.includes('|')) {
            const parts = rawCat.split('|');
            sec = parts[0] || 'main';
            cat = parts.slice(1).join('|') || 'Product Design';
          }
          return {
            id: row.id,
            title: row.title,
            category: `${row.content_type || 'work'}|${sec}|${cat}`,
            description: row.description || '',
            contentBody: row.content_body || '',
            url: row.destination_url || '',
            productUrl: row.destination_url || '',
            image: row.image_url || '',
            featured: Boolean(row.featured),
            tags: row.tags || '',
            tools: row.tags || '',
            readTime: row.read_time || '5 min read',
            platform: row.platform || '',
            journalType: row.journal_type || 'link',
            displayOrder: row.display_order ?? 9999,
            createdAt: row.created_at
          };
        });
        return json(payload);
      }

      if (path === '/api/projects' && method === 'POST') {
        const incoming = await request.json();
        if (!incoming.title || !incoming.title.trim()) return json({ error: 'Title is required' }, 400);

        const parts = (incoming.category || 'work|main|Product Design').split('|');
        const contentType = parts[0] || 'work';
        const section = parts[1] || 'main';
        const category = parts.slice(2).join('|') || parts[1] || 'Product Design';
        const combinedCategory = `${section}|${category}`;

        const row = {
          title: incoming.title.trim(),
          content_type: contentType,
          category: combinedCategory,
          description: incoming.description || '',
          content_body: incoming.contentBody || '',
          destination_url: incoming.url || incoming.destinationUrl || '',
          image_url: incoming.image || incoming.imageUrl || '',
          featured: Boolean(incoming.featured),
          tags: incoming.tags || incoming.tools || '',
          read_time: incoming.readTime || '5 min read',
          platform: incoming.platform || '',
          journal_type: incoming.journalType || 'link',
          display_order: incoming.displayOrder ?? 9999,
          created_at: incoming.date ? new Date(incoming.date).toISOString() : new Date().toISOString()
        };

        const res = await sbFetch('portfolio_content', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        }, env);

        if (!res.ok) return json({ error: await res.text() }, 500);
        const data = await res.json();
        return json(Array.isArray(data) ? data[0] : data, 201);
      }

      if (path === '/api/projects/reorder' && method === 'POST') {
        const items = await request.json();
        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const id = typeof item === 'object' ? item.id : item;
            if (id) {
              await sbFetch(`portfolio_content?id=eq.${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ display_order: i + 1 })
              }, env).catch(() => {});
            }
          }
        }
        return json({ ok: true });
      }

      if (path.startsWith('/api/projects/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const incoming = await request.json();
        const updatePayload = {};

        if (incoming.title !== undefined) updatePayload.title = incoming.title;
        if (incoming.category !== undefined) {
          const parts = incoming.category.split('|');
          updatePayload.content_type = parts[0] || 'work';
          const sec = parts[1] || 'main';
          const cat = parts.slice(2).join('|') || parts[1] || 'Product Design';
          updatePayload.category = `${sec}|${cat}`;
        }
        if (incoming.description !== undefined) updatePayload.description = incoming.description;
        if (incoming.contentBody !== undefined) updatePayload.content_body = incoming.contentBody;
        if (incoming.url !== undefined) updatePayload.destination_url = incoming.url;
        if (incoming.image !== undefined) updatePayload.image_url = incoming.image;
        if (incoming.featured !== undefined) updatePayload.featured = Boolean(incoming.featured);
        if (incoming.tags !== undefined) updatePayload.tags = incoming.tags;
        if (incoming.readTime !== undefined) updatePayload.read_time = incoming.readTime;
        if (incoming.platform !== undefined) updatePayload.platform = incoming.platform;
        if (incoming.journalType !== undefined) updatePayload.journal_type = incoming.journalType;
        if (incoming.displayOrder !== undefined) updatePayload.display_order = incoming.displayOrder;
        if (incoming.date !== undefined && incoming.date) {
          try {
            updatePayload.created_at = new Date(incoming.date).toISOString();
          } catch {}
        }

        const res = await sbFetch(`portfolio_content?id=eq.${id}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(updatePayload)
        }, env);

        if (!res.ok) return json({ error: await res.text() }, 500);
        const data = await res.json();
        return json(Array.isArray(data) ? data[0] : (data || { ok: true }));
      }

      if (path.startsWith('/api/projects/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await sbFetch(`portfolio_content?id=eq.${id}`, { method: 'DELETE' }, env);
        return json({ ok: true });
      }

      // ═══════════════════════════════════════════
      // 2. SETTINGS API
      // ═══════════════════════════════════════════
      if (path === '/api/settings' && method === 'GET') {
        const res = await sbFetch('portfolio_settings?id=eq.global&select=*', {}, env);
        if (res.ok) {
          const raw = await res.json();
          if (Array.isArray(raw) && raw[0] && raw[0].settings) {
            return json(raw[0].settings);
          }
        }
        return json({});
      }

      if (path === '/api/settings' && (method === 'PUT' || method === 'POST')) {
        const incoming = await request.json();
        const checkRes = await sbFetch('portfolio_settings?id=eq.global&select=id', {}, env);
        const checkData = checkRes.ok ? await checkRes.json() : [];

        let saveRes;
        if (Array.isArray(checkData) && checkData.length > 0) {
          saveRes = await sbFetch('portfolio_settings?id=eq.global', {
            method: 'PATCH',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify({ settings: incoming, updated_at: new Date().toISOString() })
          }, env);
        } else {
          saveRes = await sbFetch('portfolio_settings', {
            method: 'POST',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify({ id: 'global', settings: incoming, updated_at: new Date().toISOString() })
          }, env);
        }

        if (!saveRes.ok) return json({ error: await saveRes.text() }, 500);
        return json(incoming);
      }

      // ═══════════════════════════════════════════
      // 3. BRANDS API
      // ═══════════════════════════════════════════
      if (path === '/api/brands' && method === 'GET') {
        const res = await sbFetch('portfolio_brands?select=*&order=created_at.asc', {}, env);
        if (!res.ok) return json([]);
        return json(await res.json());
      }

      if (path === '/api/brands' && method === 'POST') {
        const incoming = await request.json();
        if (!incoming.name || !incoming.name.trim()) return json({ error: 'Name is required' }, 400);

        const row = {
          name: incoming.name.trim(),
          logo: incoming.logo || incoming.logo_url || '',
          created_at: new Date().toISOString()
        };

        const res = await sbFetch('portfolio_brands', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        }, env);

        if (!res.ok) return json({ error: await res.text() }, 500);
        const data = await res.json();
        return json(Array.isArray(data) ? data[0] : data, 201);
      }

      if (path.startsWith('/api/brands/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await sbFetch(`portfolio_brands?id=eq.${id}`, { method: 'DELETE' }, env);
        return json({ ok: true });
      }

      // ═══════════════════════════════════════════
      // 4. MILESTONES API
      // ═══════════════════════════════════════════
      if (path === '/api/milestones' && method === 'GET') {
        const res = await sbFetch('portfolio_milestones?select=*&order=display_order.asc,created_at.desc', {}, env);
        if (!res.ok) return json([]);
        const raw = await res.json();
        const payload = (raw || []).map(r => ({
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
          displayOrder: r.display_order ?? 9999
        }));
        return json(payload);
      }

      if (path === '/api/milestones' && method === 'POST') {
        const incoming = await request.json();
        if (!incoming.title || !incoming.title.trim()) return json({ error: 'Title is required' }, 400);

        const row = {
          title: incoming.title.trim(),
          category: incoming.category || 'MILESTONE',
          year: incoming.year || new Date().getFullYear().toString(),
          event_location: incoming.eventLocation || '',
          summary: incoming.summary || '',
          spec1_label: incoming.spec1Label || '',
          spec1_value: incoming.spec1Value || '',
          spec2_label: incoming.spec2Label || '',
          spec2_value: incoming.spec2Value || '',
          spec3_label: incoming.spec3Label || '',
          spec3_value: incoming.spec3Value || '',
          url: incoming.url || '',
          button_text: incoming.buttonText || 'Learn More',
          image: incoming.image || '',
          display_order: incoming.displayOrder ?? 9999,
          created_at: new Date().toISOString()
        };

        const res = await sbFetch('portfolio_milestones', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        }, env);

        if (!res.ok) return json({ error: await res.text() }, 500);
        const data = await res.json();
        return json(Array.isArray(data) ? data[0] : data, 201);
      }

      if (path === '/api/milestones/reorder' && method === 'POST') {
        const items = await request.json();
        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const id = typeof item === 'object' ? item.id : item;
            if (id) {
              await sbFetch(`portfolio_milestones?id=eq.${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ display_order: i + 1 })
              }, env).catch(() => {});
            }
          }
        }
        return json({ ok: true });
      }

      if (path.startsWith('/api/milestones/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await sbFetch(`portfolio_milestones?id=eq.${id}`, { method: 'DELETE' }, env);
        return json({ ok: true });
      }

      // ═══════════════════════════════════════════
      // 5. TOOLS API
      // ═══════════════════════════════════════════
      if (path === '/api/tools' && method === 'GET') {
        const res = await sbFetch('portfolio_tools?select=*&order=display_order.asc,created_at.asc', {}, env);
        if (!res.ok) return json([]);
        const raw = await res.json();
        const payload = (raw || []).map(r => ({
          id: r.id,
          name: r.name,
          category: r.category || 'design',
          icon_type: r.icon_type || 'figma',
          custom_icon_url: r.custom_icon_url || '',
          display_order: r.display_order ?? 0
        }));
        return json(payload);
      }

      if (path === '/api/tools' && method === 'POST') {
        const incoming = await request.json();
        if (!incoming.name || !incoming.name.trim()) return json({ error: 'Tool name is required' }, 400);

        const row = {
          name: incoming.name.trim(),
          category: incoming.category || 'design',
          icon_type: incoming.icon_type || 'figma',
          custom_icon_url: incoming.custom_icon_url || '',
          display_order: incoming.display_order ?? 0,
          created_at: new Date().toISOString()
        };

        const res = await sbFetch('portfolio_tools', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        }, env);

        if (!res.ok) return json({ error: await res.text() }, 500);
        const data = await res.json();
        return json(Array.isArray(data) ? data[0] : data, 201);
      }

      if (path.startsWith('/api/tools/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await sbFetch(`portfolio_tools?id=eq.${id}`, { method: 'DELETE' }, env);
        return json({ ok: true });
      }

      // ═══════════════════════════════════════════
      // 6. TESTIMONIALS API
      // ═══════════════════════════════════════════
      if (path === '/api/testimonials' && method === 'GET') {
        const res = await sbFetch('portfolio_testimonials?select=*&order=created_at.desc', {}, env);
        if (!res.ok) return json([]);
        return json(await res.json());
      }

      if (path === '/api/testimonials' && method === 'POST') {
        const incoming = await request.json();
        if (!incoming.name || !incoming.name.trim()) return json({ error: 'Name is required' }, 400);

        const row = {
          name: incoming.name.trim(),
          role: incoming.role || '',
          quote: incoming.quote || '',
          img: incoming.img || '',
          created_at: new Date().toISOString()
        };

        const res = await sbFetch('portfolio_testimonials', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(row)
        }, env);

        if (!res.ok) return json({ error: await res.text() }, 500);
        const data = await res.json();
        return json(Array.isArray(data) ? data[0] : data, 201);
      }

      if (path.startsWith('/api/testimonials/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await sbFetch(`portfolio_testimonials?id=eq.${id}`, { method: 'DELETE' }, env);
        return json({ ok: true });
      }

      // ═══════════════════════════════════════════
      // 7. CONTACT MESSAGES API
      // ═══════════════════════════════════════════
      if (path === '/api/messages' && method === 'GET') {
        const res = await sbFetch('contact_messages?select=*&order=created_at.desc', {}, env);
        if (!res.ok) return json([]);
        return json(await res.json());
      }

      if (path.startsWith('/api/messages/') && method === 'DELETE') {
        const id = path.split('/').pop();
        await sbFetch(`contact_messages?id=eq.${id}`, { method: 'DELETE' }, env);
        return json({ ok: true });
      }

      if (path === '/api/contact' && method === 'POST') {
        const incoming = await request.json();
        const row = {
          name: incoming.name || '',
          email: incoming.email || '',
          subject: incoming.subject || '',
          message: incoming.message || '',
          created_at: new Date().toISOString()
        };
        await sbFetch('contact_messages', {
          method: 'POST',
          body: JSON.stringify(row)
        }, env).catch(() => {});
        return json({ ok: true }, 201);
      }

      // ═══════════════════════════════════════════
      // 8. STORAGE IMAGE UPLOAD API
      // ═══════════════════════════════════════════
      if (path === '/api/upload' && method === 'POST') {
        const incoming = await request.json();
        const rawData = typeof incoming === 'string' ? incoming : (incoming?.data || '');

        if (!rawData) return json({ error: 'No upload data provided' }, 400);
        if (rawData.startsWith('http://') || rawData.startsWith('https://')) {
          return json({ url: rawData });
        }

        const { url: sbUrl, key: sbKey } = getSupabaseCreds(env);

        let mime = 'image/png';
        let ext = 'png';
        let binaryStr = '';

        const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(rawData);
        if (match) {
          mime = match[1];
          const cleanData = match[2].replace(/\s/g, '');
          binaryStr = atob(cleanData);
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
          binaryStr = atob(cleanBase64);
        }

        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const storageUrl = `${sbUrl}/storage/v1/object/portfolio-images/${filename}`;

        await fetch(storageUrl, {
          method: 'POST',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': mime,
            'x-upsert': 'true'
          },
          body: bytes
        }).catch(() => {});

        const publicUrl = `${sbUrl}/storage/v1/object/public/portfolio-images/${filename}`;
        return json({ url: publicUrl }, 201);
      }

      // ═══════════════════════════════════════════
      // 9. METADATA AUTO-FETCH API
      // ═══════════════════════════════════════════
      if (path === '/api/fetch-metadata' && method === 'POST') {
        const incoming = await request.json();
        let targetUrl = (incoming && incoming.url ? incoming.url : '').trim();
        if (!targetUrl) return json({ error: 'URL is required' }, 400);
        if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

        let parsedUrl;
        try { parsedUrl = new URL(targetUrl); } catch { return json({ error: 'Invalid URL' }, 400); }

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

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(targetUrl, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const html = await res.text();
            const decodeHtml = str => str ? str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim() : '';
            const getMeta = nameOrProp => {
              const match = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${nameOrProp}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
                            html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${nameOrProp}["']`, 'i'));
              return match ? decodeHtml(match[1]) : '';
            };

            title = getMeta('og:title') || getMeta('twitter:title') || getMeta('title');
            if (!title) {
              const tMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
              if (tMatch) title = decodeHtml(tMatch[1]);
            }
            description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description');
            image = getMeta('og:image:secure_url') || getMeta('og:image') || getMeta('twitter:image') || getMeta('twitter:image:src');
            const siteName = getMeta('og:site_name') || getMeta('twitter:site');
            if (siteName) platform = siteName.replace(/^@/, '');
            const pubDate = getMeta('article:published_time') || getMeta('og:article:published_time') || getMeta('og:published_time') || getMeta('publication_date') || getMeta('publish_date') || getMeta('parsely-pub-date') || getMeta('date') || getMeta('pubdate');
            if (pubDate) {
              try { const pd = new Date(pubDate); if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2000) date = pd.toISOString().split('T')[0]; } catch {}
            }

            // JSON-LD date
            const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
            if (jsonLdMatches) {
              for (const block of jsonLdMatches) {
                try {
                  const clean = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
                  const parsed = JSON.parse(clean);
                  const objs = Array.isArray(parsed) ? parsed : (parsed['@graph'] ? parsed['@graph'] : [parsed]);
                  for (const obj of objs) {
                    const rawDate = obj.datePublished || obj.dateCreated || obj.uploadDate || obj.dateModified;
                    if (rawDate) {
                      const pd = new Date(rawDate);
                      if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2000) date = pd.toISOString().split('T')[0];
                    }
                  }
                } catch {}
              }
            }

            const rt = getMeta('twitter:data1') || getMeta('reading_time');
            if (rt) readTime = /min/i.test(rt) ? rt : `${rt} min read`;
          }
        } catch {}

        if (!title || !image || !description) {
          try {
            const microRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(targetUrl)}&screenshot=false&meta=true`);
            if (microRes.ok) {
              const microData = await microRes.json();
              if (microData.status === 'success' && microData.data) {
                const md = microData.data;
                if (!title && md.title) title = md.title;
                if (!description && md.description) description = md.description;
                if (!image && md.image?.url) image = md.image.url;
                if (md.publisher) platform = md.publisher;
                if (md.date) { try { const pd = new Date(md.date); if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2000) date = pd.toISOString().split('T')[0]; } catch {} }
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

        if (title) {
          title = title.split(/\s+[|\-—–]\s+(?:Medium|Substack|LinkedIn|Dev\.to|Hashnode|UX Collective|Behance|Dribbble|TechCrunch)$/i)[0].replace(/\s+[|\-—–]\s+by\s+[^|\-—–]+$/i, '').trim();
        }
        if (image) {
          try {
            if (image.startsWith('//')) image = 'https:' + image;
            else if (image.startsWith('/')) image = new URL(image, targetUrl).href;
          } catch {}
        }
        if (!title) {
          const pathSegs = parsedUrl.pathname.split('/').filter(Boolean);
          const lastSeg = pathSegs.pop() || '';
          const cleanSlug = lastSeg.replace(/-[a-f0-9]{8,12}$/i, '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
          title = cleanSlug.length > 3 ? cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1) : `Article on ${platform}`;
        }
        if (!description) description = `An article published on ${platform} exploring product design and UX strategy.`;

        return json({ ok: true, title: title.trim(), description: description.trim(), image: (image || '').trim(), platform: platform.trim(), readTime: readTime.trim(), date });
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};
