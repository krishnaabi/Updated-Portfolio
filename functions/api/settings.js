export async function onRequest(context) {
  const { request, env } = context;

  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET: Retrieve settings
  if (request.method === 'GET') {
    try {
      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_settings?id=eq.global&select=*`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
      });
      if (sbRes.ok) {
        const raw = await sbRes.json();
        const payload = (Array.isArray(raw) && raw[0] && raw[0].settings) ? raw[0].settings : {};
        return new Response(JSON.stringify(payload), { headers });
      }
    } catch (e) {}

    return new Response(JSON.stringify({}), { headers });
  }

  // PUT / POST: Update settings (Hero images, resume, email, topics, etc.)
  if (request.method === 'PUT' || request.method === 'POST') {
    try {
      const incoming = await request.json();

      // Check if global settings row already exists in Supabase
      const checkRes = await fetch(`${sbUrl}/rest/v1/portfolio_settings?id=eq.global&select=id`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
      });
      const checkData = checkRes.ok ? await checkRes.json() : [];

      let saveRes;
      if (Array.isArray(checkData) && checkData.length > 0) {
        saveRes = await fetch(`${sbUrl}/rest/v1/portfolio_settings?id=eq.global`, {
          method: 'PATCH',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ settings: incoming, updated_at: new Date().toISOString() })
        });
      } else {
        saveRes = await fetch(`${sbUrl}/rest/v1/portfolio_settings`, {
          method: 'POST',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ id: 'global', settings: incoming, updated_at: new Date().toISOString() })
        });
      }

      return new Response(JSON.stringify(incoming), { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
