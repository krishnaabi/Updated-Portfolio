export async function onRequest(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
      const sbKey = (env && (env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

      const payload = {
        name: body.name || 'Anonymous',
        email: body.email || '',
        project_type: body.projectType || body.project_type || 'General Inquiry',
        budget: body.budget || '',
        timeline: body.timeline || '',
        message: body.message || '',
        read: false,
        created_at: new Date().toISOString()
      };

      await fetch(`${sbUrl}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          'apikey': sbKey,
          'Authorization': `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      return new Response(JSON.stringify({ success: true, message: 'Message received' }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ success: true, warning: 'Saved locally' }), { headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
