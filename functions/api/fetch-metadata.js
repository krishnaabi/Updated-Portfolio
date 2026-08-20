export async function onRequest(context) {
  const { request } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const incoming = await request.json();
    let targetUrl = (incoming && incoming.url ? incoming.url : '').trim();

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400, headers });
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers });
    }

    const host = parsedUrl.hostname.replace(/^www\./i, '');
    let defaultPlatform = host.split('.')[0];
    defaultPlatform = defaultPlatform.charAt(0).toUpperCase() + defaultPlatform.slice(1);
    if (host.includes('medium.com')) defaultPlatform = 'Medium';
    else if (host.includes('substack.com')) defaultPlatform = 'Substack';
    else if (host.includes('linkedin.com')) defaultPlatform = 'LinkedIn';
    else if (host.includes('dev.to')) defaultPlatform = 'Dev.to';
    else if (host.includes('hashnode.dev') || host.includes('hashnode.com')) defaultPlatform = 'Hashnode';
    else if (host.includes('behance.net')) defaultPlatform = 'Behance';
    else if (host.includes('dribbble.com')) defaultPlatform = 'Dribbble';

    let title = '';
    let description = '';
    let image = '';
    let platform = defaultPlatform;
    let readTime = '5 min read';
    let date = new Date().toISOString().split('T')[0];

    // Strategy 1: Direct HTML Fetch & Meta Tag Extraction
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        const decodeHtml = str => {
          if (!str) return '';
          return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .trim();
        };

        const getMetaContent = (nameOrProp) => {
          const re = new RegExp(`<meta[^>]+(?:name|property)=["']${nameOrProp}["'][^>]+content=["']([^"']+)["']`, 'i');
          const match = html.match(re);
          if (match) return decodeHtml(match[1]);
          const reReverse = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${nameOrProp}["']`, 'i');
          const matchRev = html.match(reReverse);
          return matchRev ? decodeHtml(matchRev[1]) : '';
        };

        title = getMetaContent('og:title') || getMetaContent('twitter:title') || getMetaContent('title');
        if (!title) {
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) title = decodeHtml(titleMatch[1]);
        }

        description = getMetaContent('og:description') || getMetaContent('twitter:description') || getMetaContent('description');

        image = getMetaContent('og:image:secure_url') || getMetaContent('og:image') || getMetaContent('twitter:image') || getMetaContent('twitter:image:src');

        const siteName = getMetaContent('og:site_name') || getMetaContent('twitter:site');
        if (siteName) platform = siteName.replace(/^@/, '');

        const publishedTime = getMetaContent('article:published_time') || getMetaContent('og:published_time') || getMetaContent('date') || getMetaContent('pubdate');
        if (publishedTime) {
          try {
            const d = new Date(publishedTime);
            if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0];
          } catch {}
        }

        const rt = getMetaContent('twitter:data1') || getMetaContent('reading_time');
        if (rt) {
          readTime = /min/i.test(rt) ? rt : `${rt} min read`;
        } else {
          // Estimate reading time based on approximate body word count
          const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          if (bodyMatch) {
            const textOnly = bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                         .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                         .replace(/<[^>]+>/g, ' ')
                                         .replace(/\s+/g, ' ')
                                         .trim();
            const words = textOnly.split(/\s+/).length;
            if (words > 200) {
              const estMins = Math.max(1, Math.round(words / 220));
              readTime = `${estMins} min read`;
            }
          }
        }

        // Parse Schema.org JSON-LD if available for richer metadata
        const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
        if (jsonLdMatches) {
          for (const block of jsonLdMatches) {
            try {
              const rawJson = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
              const parsed = JSON.parse(rawJson);
              const targetObj = Array.isArray(parsed) ? parsed[0] : (parsed['@graph'] ? parsed['@graph'].find(g => g.headline || g.image) || parsed['@graph'][0] : parsed);
              if (targetObj) {
                if (!title && targetObj.headline) title = decodeHtml(targetObj.headline);
                if (!title && targetObj.name) title = decodeHtml(targetObj.name);
                if (!description && targetObj.description) description = decodeHtml(targetObj.description);
                if (!image && targetObj.image) {
                  if (typeof targetObj.image === 'string') image = targetObj.image;
                  else if (Array.isArray(targetObj.image) && targetObj.image[0]) image = typeof targetObj.image[0] === 'string' ? targetObj.image[0] : targetObj.image[0].url;
                  else if (targetObj.image.url) image = targetObj.image.url;
                }
                if (targetObj.datePublished) {
                  const d = new Date(targetObj.datePublished);
                  if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0];
                }
              }
            } catch {}
          }
        }
      }
    } catch {}

    // Strategy 2: Microlink API Fallback (for sites with heavy JS rendering, bot walls or missing images)
    if (!title || !image || !description) {
      try {
        const microRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(targetUrl)}&screenshot=false&meta=true`);
        if (microRes.ok) {
          const microData = await microRes.json();
          if (microData.status === 'success' && microData.data) {
            const d = microData.data;
            if (!title && d.title) title = d.title;
            if (!description && d.description) description = d.description;
            if (!image && d.image && d.image.url) image = d.image.url;
            if (d.publisher && platform === defaultPlatform) platform = d.publisher;
            if (d.date) {
              try {
                const pd = new Date(d.date);
                if (!isNaN(pd.getTime())) date = pd.toISOString().split('T')[0];
              } catch {}
            }
          }
    // LinkedIn Snowflake timestamp extraction (e.g. posts, activity IDs, updates)
    if (/linkedin\.com|licdn\.com/i.test(targetUrl)) {
      const actMatch = targetUrl.match(/(?:activity|ugcPost)[-:](\d{15,21})/i) ||
                       targetUrl.match(/update\/urn:li:(?:activity|ugcPost):(\d{15,21})/i) ||
                       targetUrl.match(/posts\/[^_]+_([^\/]+)-activity-(\d{15,21})/i) ||
                       targetUrl.match(/(\d{18,20})/);
      if (actMatch) {
        const idStr = actMatch[2] || actMatch[1];
        try {
          const actId = BigInt(idStr);
          const timeMs = Number(actId >> 22n);
          const pd = new Date(timeMs);
          if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2008 && pd.getFullYear() <= new Date().getFullYear() + 1) {
            date = pd.toISOString().split('T')[0];
          }
        } catch {}
      }
      const epochMatch = targetUrl.match(/\/(\d{13})(?:\?|\/|$)/);
      if (epochMatch) {
        try {
          const pd = new Date(Number(epochMatch[1]));
          if (!isNaN(pd.getTime()) && pd.getFullYear() >= 2008 && pd.getFullYear() <= new Date().getFullYear() + 1) {
            date = pd.toISOString().split('T')[0];
          }
        } catch {}
      }
    }

    // URL slug date fallback (e.g. /2024/03/15/)
    const urlDateMatch = targetUrl.match(/(20[12]\d)[/-](0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])/);
    if (urlDateMatch && (!date || date === new Date().toISOString().split('T')[0])) {
      date = `${urlDateMatch[1]}-${urlDateMatch[2]}-${urlDateMatch[3]}`;
    }

    // Clean title suffixes (e.g. "Article Title | Medium", "Article Title — Substack")
    if (title) {
      title = title
        .split(/\s+[|\-—–]\s+(?:Medium|Substack|LinkedIn|Dev\.to|Hashnode|UX Collective|Behance|Dribbble|TechCrunch)$/i)[0]
        .replace(/\s+[|\-—–]\s+by\s+[^|\-—–]+$/i, '')
        .trim();
    }

    // Resolve relative image URLs to absolute
    if (image) {
      try {
        if (image.startsWith('//')) {
          image = 'https:' + image;
        } else if (image.startsWith('/')) {
          image = new URL(image, targetUrl).href;
        }
      } catch {}
    }

    // Final Fallbacks if site returned minimal data
    if (!title) {
      const pathSegs = parsedUrl.pathname.split('/').filter(Boolean);
      const lastSeg = pathSegs.pop() || '';
      const cleanSlug = lastSeg.replace(/-[a-f0-9]{8,12}$/i, '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
      title = cleanSlug.length > 3 ? cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1) : `Article on ${platform}`;
    }

    if (!description) {
      description = `An article published on ${platform} exploring product design, strategy and creative engineering.`;
    }

    return new Response(JSON.stringify({
      ok: true,
      title: title.trim(),
      description: description.trim(),
      image: (image || '').trim(),
      platform: platform.trim(),
      readTime: readTime.trim(),
      date
    }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
