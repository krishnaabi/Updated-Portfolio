export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;

  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // PATCH: Update project
  if (request.method === 'PATCH') {
    try {
      const incoming = await request.json();
      const payload = {};

      if (incoming.title !== undefined) payload.title = incoming.title;
      if (incoming.description !== undefined) payload.description = incoming.description;
      if (incoming.contentBody !== undefined) payload.content_body = incoming.contentBody;
      if (incoming.url !== undefined) payload.destination_url = incoming.url;
      if (incoming.image !== undefined) payload.image_url = incoming.image;
      if (incoming.featured !== undefined) payload.featured = Boolean(incoming.featured);
      if (incoming.tags !== undefined) payload.tags = incoming.tags;
      if (incoming.readTime !== undefined) payload.read_time = incoming.readTime;
      if (incoming.platform !== undefined) payload.platform = incoming.platform;
      if (incoming.journalType !== undefined) payload.journal_type = incoming.journalType;
      if (incoming.displayOrder !== undefined) payload.display_order = incoming.displayOrder;
      if (incoming.date !== undefined && incoming.date) {
        try { payload.created_at = new Date(incoming.date).toISOString(); } catch {}
      }

      if (incoming.category) {
        const parts = incoming.category.split('|');
        if (parts[0]) payload.content_type = parts[0];
        const sec = parts[1] || 'main';
        const cat = parts.slice(2).join('|') || parts[1] || 'Product Design';
        payload.category = `${sec}|${cat}`;
      }

      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (sbRes.ok) {
        return new Response(JSON.stringify({ ok: true, id, ...incoming }), { headers });
      }

      const errText = await sbRes.text();
      return new Response(JSON.stringify({ error: errText }), { status: 500, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  // DELETE: Remove project
  if (request.method === 'DELETE') {
    try {
      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`
        }
      });

      return new Response(JSON.stringify({ ok: true }), { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
