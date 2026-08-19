export async function onRequest(context) {
  const { request, env } = context;

  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET: List brands
  if (request.method === 'GET') {
    try {
      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_brands?select=*&order=created_at.desc`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
      });
      if (sbRes.ok) {
        const raw = await sbRes.json();
        return new Response(JSON.stringify(raw || []), { headers });
      }
    } catch (e) {}

    return new Response(JSON.stringify([]), { headers });
  }

  // POST: Add or update brand
  if (request.method === 'POST') {
    try {
      const incoming = await request.json();
      if (!incoming.name || !incoming.name.trim()) {
        return new Response(JSON.stringify({ error: 'Company/Brand Name is required.' }), { status: 400, headers });
      }

      const payload = {
        name: incoming.name.trim(),
        logo_url: incoming.logoUrl || incoming.logo_url || '',
        url: incoming.url || '#',
        created_at: new Date().toISOString()
      };

      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_brands`, {
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
        return new Response(JSON.stringify(row || { id: Date.now().toString(), ...incoming }), { status: 201, headers });
      }

      const errText = await sbRes.text();
      return new Response(JSON.stringify({ error: errText }), { status: 500, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
