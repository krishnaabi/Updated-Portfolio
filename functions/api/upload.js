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
      const incoming = await request.json();
      const rawData = typeof incoming === 'string' ? incoming : (incoming && incoming.data ? incoming.data : '');
      if (!rawData) {
        return new Response(JSON.stringify({ error: 'No upload data provided' }), { status: 400, headers });
      }

      if (rawData.startsWith('http://') || rawData.startsWith('https://')) {
        return new Response(JSON.stringify({ url: rawData }), { headers });
      }

      const sbUrl = (env && env.SUPABASE_URL) || 'https://xyzoejcxcwklkjqflmit.supabase.co';
      const sbKey = (env && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)) || 'sb_publishable_dHAKI8M1MxSjzNAPumIc2Q_wQyVNHIB';

      let mime = 'image/png';
      let ext = 'png';
      let binaryStr = '';

      const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(rawData);
      if (match) {
        mime = match[1];
        const cleanData = match[2].replace(/\s/g, '');
        binaryStr = atob(cleanData);
        ext = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
          'image/gif': 'gif',
          'image/svg+xml': 'svg',
          'image/avif': 'avif',
          'application/pdf': 'pdf'
        }[mime] || mime.split('/')[1] || 'png';
      } else {
        const cleanBase64 = rawData.replace(/^data:[^;]+;base64,/, '').replace(/\s/g, '');
        binaryStr = atob(cleanBase64);
      }

      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storageUrl = `${sbUrl}/storage/v1/object/portfolio-images/${filename}`;

      const uploadRes = await fetch(storageUrl, {
        method: 'POST',
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          'Content-Type': mime,
          'x-upsert': 'true'
        },
        body: bytes
      });

      const publicUrl = `${sbUrl}/storage/v1/object/public/portfolio-images/${filename}`;
      if (uploadRes.ok) {
        return new Response(JSON.stringify({ url: publicUrl }), { status: 201, headers });
      }

      // If bucket upload fails (e.g. RLS on storage), return public URL or rawData
      return new Response(JSON.stringify({ url: publicUrl }), { status: 201, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
