export async function onRequest(context) {
  const { request, env } = context;

  const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
  const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

  const defaultTools = [
    { id: 't1', name: 'Figma', category: 'UI/UX · Prototyping | Design Systems', icon_type: 'figma', display_order: 1 },
    { id: 't2', name: 'FigJam', category: 'Workshops · User Flows | Mapping', icon_type: 'figjam', display_order: 2 },
    { id: 't3', name: 'Adobe Photoshop', category: 'Visual Design · | Image Editing', icon_type: 'photoshop', display_order: 3 },
    { id: 't4', name: 'Adobe Illustrator', category: 'Branding · Illustration | Graphics', icon_type: 'illustrator', display_order: 4 },
    { id: 't5', name: 'Adobe After Effects', category: 'Motion · Visual | Content', icon_type: 'aftereffects', display_order: 5 },
    { id: 't6', name: 'Framer', category: 'Web Design · | Prototyping', icon_type: 'framer', display_order: 6 },
    { id: 't7', name: 'Notion', category: 'Documentation · | Planning', icon_type: 'notion', display_order: 7 },
    { id: 't8', name: 'AI Tools', category: 'Ideation · Content | Visual Exploration', icon_type: 'aitools', display_order: 8 }
  ];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // GET: List all tools
  if (request.method === 'GET') {
    try {
      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_tools?select=*&order=display_order.asc,created_at.asc`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
      });
      if (sbRes.ok) {
        const raw = await sbRes.json();
        if (Array.isArray(raw) && raw.length > 0) {
          return new Response(JSON.stringify(raw), { headers });
        }
      }
    } catch (e) {}

    return new Response(JSON.stringify(defaultTools), { headers });
  }

  // POST: Add or update tool
  if (request.method === 'POST') {
    try {
      const incoming = await request.json();
      if (!incoming.name || !incoming.name.trim()) {
        return new Response(JSON.stringify({ error: 'Tool Name is required.' }), { status: 400, headers });
      }

      const payload = {
        name: incoming.name.trim(),
        category: incoming.category || '',
        icon_type: incoming.icon_type || incoming.iconType || 'figma',
        custom_icon_url: incoming.custom_icon_url || incoming.customIconUrl || '',
        display_order: incoming.display_order || incoming.displayOrder || 0
      };

      if (incoming.id && !String(incoming.id).startsWith('tool-')) {
        payload.id = incoming.id;
      }

      const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_tools`, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation,resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      if (sbRes.ok) {
        const resData = await sbRes.json();
        const row = Array.isArray(resData) ? resData[0] : resData;
        return new Response(JSON.stringify(row || { id: incoming.id || Date.now().toString(), ...payload }), { status: 201, headers });
      }

      return new Response(JSON.stringify({ id: incoming.id || Date.now().toString(), ...payload }), { status: 201, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
