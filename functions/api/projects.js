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
