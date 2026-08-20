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
          createdAt: row.created_at
        }));
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

      const payload = {
        title: incoming.title.trim(),
        content_type: contentType,
        category: `${section}|${category}`,
        description: incoming.description || '',
        content_body: incoming.contentBody || '',
        destination_url: incoming.url || '',
        image_url: incoming.image || '',
        featured: Boolean(incoming.featured),
        tags: incoming.tags || incoming.tools || '',
        read_time: incoming.readTime || '5 min read',
        platform: incoming.platform || '',
        journal_type: incoming.journalType || 'link',
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
