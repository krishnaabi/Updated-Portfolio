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
