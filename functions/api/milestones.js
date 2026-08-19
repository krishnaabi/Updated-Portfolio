export async function onRequest(context) {
  const { request, env } = context;

  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET: List milestones
  if (request.method === 'GET') {
    try {
      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_milestones?select=*&order=display_order.asc,created_at.desc`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
      });
      if (sbRes.ok) {
        const raw = await sbRes.json();
        return new Response(JSON.stringify(raw || []), { headers });
      }
    } catch (e) {}

    return new Response(JSON.stringify([]), { headers });
  }

  // POST: Add or update milestone
  if (request.method === 'POST') {
    try {
      const incoming = await request.json();
      if (!incoming.title || !incoming.title.trim()) {
        return new Response(JSON.stringify({ error: 'Milestone Title is required.' }), { status: 400, headers });
      }

      const payload = {
        title: incoming.title.trim(),
        category: incoming.category || '',
        year: incoming.year || new Date().getFullYear().toString(),
        event_location: incoming.eventLocation || incoming.event_location || '',
        summary: incoming.summary || '',
        spec1_label: incoming.spec1Label || incoming.spec1_label || '',
        spec1_value: incoming.spec1Value || incoming.spec1_value || '',
        spec2_label: incoming.spec2Label || incoming.spec2_label || '',
        spec2_value: incoming.spec2Value || incoming.spec2_value || '',
        spec3_label: incoming.spec3Label || incoming.spec3_label || '',
        spec3_value: incoming.spec3Value || incoming.spec3_value || '',
        url: incoming.url || '#',
        button_text: incoming.buttonText || incoming.button_text || 'View Highlight',
        image: incoming.image || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=95',
        display_order: incoming.displayOrder || incoming.display_order || 9999,
        created_at: new Date().toISOString()
      };

      if (incoming.id) {
        await fetch(`${sbUrl}/rest/v1/portfolio_milestones?id=eq.${encodeURIComponent(incoming.id)}`, {
          method: 'PATCH',
          headers: {
            apikey: sbKey,
            Authorization: `Bearer ${sbKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        return new Response(JSON.stringify({ id: incoming.id, ...incoming }), { headers });
      } else {
        const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_milestones`, {
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
      }

      return new Response(JSON.stringify({ id: Date.now().toString(), ...incoming }), { status: 201, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
