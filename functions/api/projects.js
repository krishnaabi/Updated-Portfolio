export async function onRequest(context) {
  const { request, env } = context;

  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET: List all projects / explorations / articles
  if (request.method === 'GET') {
    try {
      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content?select=*&order=display_order.asc,created_at.desc`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
      });
      if (sbRes.ok) {
        const raw = await sbRes.json();
        const payload = (raw || []).map(row => {
          let productUrl = row.product_url || '';
          let tools = row.tools || '';
          let contentBody = row.content_body || '';

          if (row.content_body && (row.content_type === 'work' || !row.content_type || row.content_type === 'main')) {
            try {
              let parsed = JSON.parse(row.content_body);
              while (parsed && typeof parsed === 'object' && parsed.body && typeof parsed.body === 'string' && parsed.body.startsWith('{')) {
                try {
                  const nested = JSON.parse(parsed.body);
                  if (nested && typeof nested === 'object') {
                    if (!parsed.tools && nested.tools) parsed.tools = nested.tools;
                    if (!parsed.productUrl && nested.productUrl) parsed.productUrl = nested.productUrl;
                    parsed = { ...nested, ...parsed, body: nested.body || '' };
                  } else {
                    break;
                  }
                } catch (e) { break; }
              }
              if (parsed && typeof parsed === 'object') {
                if (parsed.productUrl !== undefined) productUrl = parsed.productUrl;
                if (parsed.tools !== undefined) tools = parsed.tools;
                if (parsed.body !== undefined) contentBody = parsed.body;
              }
            } catch (e) {}
          }

          let sec = 'main';
          let cat = row.category || 'Product Design';
          if (row.category && row.category.includes('|')) {
            const parts = row.category.split('|');
            sec = parts[0] || 'main';
            cat = parts.slice(1).join('|') || 'Product Design';
          }

          return {
            id: row.id,
            title: row.title,
            category: `${row.content_type || 'work'}|${sec}|${cat}`,
            description: row.description || '',
            contentBody,
            url: row.destination_url || '',
            productUrl: productUrl || row.product_url || '',
            image: row.image_url || '',
            featured: Boolean(row.featured),
            tags: row.tags || '',
            tools: tools || row.tools || '',
            readTime: row.read_time || '5 min read',
            platform: row.platform || '',
            journalType: row.journal_type || 'link',
            displayOrder: row.display_order ?? 9999,
            createdAt: row.created_at,
            date: row.created_at
          };
        });
        return new Response(JSON.stringify(payload), { headers });
      }
    } catch (e) {}

    return new Response(JSON.stringify([]), { headers });
  }

  // POST: Add new project / exploration / article
  if (request.method === 'POST') {
    try {
      const incoming = await request.json();
      if (!incoming.title || !incoming.title.trim()) {
        return new Response(JSON.stringify({ error: 'Title is required.' }), { status: 400, headers });
      }

      const parts = (incoming.category || 'work|main|Product Design').split('|');
      const contentType = parts[0] || 'work';
      const section = parts[1] || 'main';
      const category = parts.slice(2).join('|') || parts[1] || 'Product Design';

      let contentBody = incoming.contentBody || '';
      if (contentType === 'work') {
        let innerBody = incoming.contentBody || '';
        if (typeof innerBody === 'string' && innerBody.startsWith('{')) {
          try {
            const p = JSON.parse(innerBody);
            innerBody = p.body || '';
          } catch (e) {}
        }
        contentBody = JSON.stringify({
          productUrl: (incoming.productUrl || '').trim(),
          tools: (incoming.tools || '').trim(),
          body: innerBody
        });
      }

      const payload = {
        title: incoming.title.trim(),
        content_type: contentType,
        category: `${section}|${category}`,
        description: incoming.description || '',
        content_body: contentBody,
        destination_url: incoming.url || '',
        image_url: incoming.image || '',
        featured: Boolean(incoming.featured),
        tags: incoming.tags || '',
        read_time: incoming.readTime || '5 min read',
        platform: incoming.platform || '',
        journal_type: incoming.journalType || incoming.playgroundType || 'link',
        display_order: incoming.displayOrder || 9999,
        created_at: incoming.date ? new Date(incoming.date).toISOString() : new Date().toISOString()
      };

      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content`, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (sbRes.ok) {
        const resData = await sbRes.json();
        const row = Array.isArray(resData) ? resData[0] : resData;
        const result = {
          id: row ? row.id : Date.now().toString(),
          ...incoming
        };
        return new Response(JSON.stringify(result), { status: 201, headers });
      }

      const errText = await sbRes.text();
      return new Response(JSON.stringify({ error: errText }), { status: 500, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
