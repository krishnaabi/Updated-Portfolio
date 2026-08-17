export async function onRequest(context) {
  const { request, env } = context;
  
  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

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
