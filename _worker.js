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
        const payload = (raw || []).map(row => ({
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
          displayOrder: row.display_order ?? 9999,
          createdAt: row.created_at
        }));
        return json(payload);
      }

      if (path === '/api/projects' && method === 'POST') {
        const incoming = await request.json();
        if (!incoming.title || !incoming.title.trim()) return json({ error: 'Title is required' }, 400);

        const parts = (incoming.category || 'work|main|Product Design').split('|');
        const contentType = parts[0] || 'work';
        const section = parts[1] || 'main';
        const category = parts[2] || 'Product Design';

        const row = {
          title: incoming.title.trim(),
          content_type: contentType,
          section: section,
          category: category,
          description: incoming.description || '',
          content_body: incoming.contentBody || '',
          destination_url: incoming.url || '',
          product_url: incoming.productUrl || '',
          image_url: incoming.image || '',
          featured: Boolean(incoming.featured),
          tags: incoming.tags || '',
          tools: incoming.tools || '',
          read_time: incoming.readTime || '5 min read',
          platform: incoming.platform || '',
          journal_type: incoming.journalType || 'link',
          display_order: incoming.displayOrder ?? 9999,
          created_at: new Date().toISOString()
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
          updatePayload.section = parts[1] || 'main';
          updatePayload.category = parts[2] || 'Product Design';
        }
        if (incoming.description !== undefined) updatePayload.description = incoming.description;
        if (incoming.contentBody !== undefined) updatePayload.content_body = incoming.contentBody;
        if (incoming.url !== undefined) updatePayload.destination_url = incoming.url;
        if (incoming.productUrl !== undefined) updatePayload.product_url = incoming.productUrl;
        if (incoming.image !== undefined) updatePayload.image_url = incoming.image;
        if (incoming.featured !== undefined) updatePayload.featured = Boolean(incoming.featured);
        if (incoming.tags !== undefined) updatePayload.tags = incoming.tags;
        if (incoming.tools !== undefined) updatePayload.tools = incoming.tools;
        if (incoming.readTime !== undefined) updatePayload.read_time = incoming.readTime;
        if (incoming.platform !== undefined) updatePayload.platform = incoming.platform;
        if (incoming.journalType !== undefined) updatePayload.journal_type = incoming.journalType;
        if (incoming.displayOrder !== undefined) updatePayload.display_order = incoming.displayOrder;

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

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};
