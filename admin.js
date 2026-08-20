if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const $ = selector => document.querySelector(selector);
const contentForm = $('#content-form');
const assetsForm = $('#assets-form');
const list = $('#items');


const defaultPlaygroundTopics = ['UI & Motion', 'Concepts', '3D & Visuals', 'Quick Sketches', 'Just for Fun'];
const defaultJournalTopics = ['UX / UI Design', 'Product Design', 'Process', 'Career', 'Tools', 'Opinion', 'Design Thinking'];

const categories = {
  work: ['Product Design', 'Case Study', 'Web Design', 'Mobile App', 'Brand Strategy', 'UI/UX Design', 'Other'],
  playground: [...defaultPlaygroundTopics],
  journal: [...defaultJournalTopics]
};

// Form References
const typeInput = $('#content-type');
const typeSegments = document.querySelectorAll('.type-segment');
const section = $('#content-section');
const category = $('#content-category');
const tagsLabel = $('#tags-field-label');
const workFieldsGroup = $('#work-fields-group');
const featuredLabel = $('#featured-field-label');

const journalTypeWrapper = $('#journal-type-wrapper');
const playgroundTypeWrapper = $('#playground-type-wrapper');
const playgroundSectionWrapper = $('#playground-section-wrapper');
const journalFieldsGroup = $('#journal-fields-group');
const journalBlogBodyGroup = $('#journal-blog-body-group');

const contentUrl = $('#content-url');
const urlFieldLabel = $('#url-field-label');
const autoFetchBtn = $('#auto-fetch-btn');
const fetchStatusMsg = $('#fetch-status-msg');

const formTitleHeading = $('#form-title-heading');
const formSubtitle = $('#form-subtitle');
const editingIdInput = $('#editing-id');
const submitBtn = $('#submit-btn');
const cancelEditBtn = $('#cancel-edit-btn');

// Live Preview References
const prevCat = $('#prev-cat');
const prevTime = $('#prev-time');
const prevTitle = $('#prev-title');
const prevDesc = $('#prev-desc');
const prevMedia = $('#prev-media');

let allProjectsData = [];

const escapeHtml = str => String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
const cleanImgUrl = url => String(url || '').trim();
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const extractDateFromUrlOrText = (targetUrl = '', html = '', microDate = '') => {
  // 1. LinkedIn Snowflake timestamp extraction (handles posts, activity IDs, updates, media URLs)
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
        const d = new Date(timeMs);
        if (!isNaN(d.getTime()) && d.getFullYear() >= 2008 && d.getFullYear() <= new Date().getFullYear() + 1) {
          return d.toISOString().split('T')[0];
        }
      } catch {}
    }

    const epochMatch = targetUrl.match(/\/(\d{13})(?:\?|\/|$)/);
    if (epochMatch) {
      try {
        const d = new Date(Number(epochMatch[1]));
        if (!isNaN(d.getTime()) && d.getFullYear() >= 2008 && d.getFullYear() <= new Date().getFullYear() + 1) {
          return d.toISOString().split('T')[0];
        }
      } catch {}
    }
  }

  // 2. Microlink date
  if (microDate) {
    try {
      const d = new Date(microDate);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 2000 && d.getFullYear() <= new Date().getFullYear() + 1) {
        return d.toISOString().split('T')[0];
      }
    } catch {}
  }

  // 3. HTML Meta tag extraction
  if (html) {
    const metaDatePatterns = [
      /<meta[^>]+(?:name|property)=["'](?:article:published_time|og:article:published_time|og:published_time|publication_date|publish_date|parsely-pub-date|sailthru\.date|date|dc\.date|dc\.date\.issued)[\"'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:article:published_time|og:article:published_time|og:published_time|publication_date|publish_date|parsely-pub-date|sailthru\.date|date|dc\.date|dc\.date\.issued)[\"']/i,
      /<time[^>]+datetime=["']([^"']+)["']/i
    ];
    for (const re of metaDatePatterns) {
      const m = html.match(re);
      if (m && m[1]) {
        try {
          const d = new Date(m[1].trim());
          if (!isNaN(d.getTime()) && d.getFullYear() >= 2000 && d.getFullYear() <= new Date().getFullYear() + 1) {
            return d.toISOString().split('T')[0];
          }
        } catch {}
      }
    }

    const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const block of jsonLdMatches) {
        try {
          const clean = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
          const parsed = JSON.parse(clean);
          const objs = Array.isArray(parsed) ? parsed : (parsed['@graph'] ? parsed['@graph'] : [parsed]);
          for (const obj of objs) {
            const rawDate = obj.datePublished || obj.dateCreated || obj.uploadDate || obj.dateModified;
            if (rawDate) {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime()) && d.getFullYear() >= 2000 && d.getFullYear() <= new Date().getFullYear() + 1) {
                return d.toISOString().split('T')[0];
              }
            }
          }
        } catch {}
      }
    }
  }

  // 4. URL path date slug (e.g. /2023/11/04/ or /2024-05-12-)
  const urlDateMatch = targetUrl.match(/(20[12]\d)[/-](0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])/);
  if (urlDateMatch) {
    return `${urlDateMatch[1]}-${urlDateMatch[2]}-${urlDateMatch[3]}`;
  }

  return '';
};

const API_BASE_URLS = ['', 'http://127.0.0.1:4173', 'http://localhost:4173'];

async function apiFetch(path, options = {}) {
  let lastError = null;
  for (const base of API_BASE_URLS) {
    try {
      const url = base ? `${base}${path}` : path;
      const res = await fetch(url, options);
      if (res.ok) return res;
    } catch (err) {
      lastError = err;
    }
  }

  // Fallback using Supabase directly if local/worker API route fails
  if (window.ABIKRISHNA_SUPABASE && window.ABIKRISHNA_SUPABASE.url) {
    try {
      const { url: sbUrl, anonKey } = window.ABIKRISHNA_SUPABASE;

      if (!options.method || options.method === 'GET') {
        let table = '';
        if (path === '/api/projects') table = 'portfolio_content?select=*&order=display_order.asc,created_at.desc';
        else if (path === '/api/messages') table = 'contact_messages?select=*&order=created_at.desc';
        else if (path === '/api/testimonials') table = 'portfolio_testimonials?select=*&order=created_at.desc';
        else if (path === '/api/brands') table = 'portfolio_brands?select=*&order=created_at.desc';
        else if (path === '/api/milestones') table = 'portfolio_milestones?select=*&order=display_order.asc,created_at.desc';
        else if (path === '/api/tools') table = 'portfolio_tools?select=*&order=display_order.asc,created_at.asc';
        else if (path === '/api/settings') table = 'portfolio_settings?id=eq.global&select=*';

        if (table) {
          const sbRes = await fetch(`${sbUrl}/rest/v1/${table}`, {
            headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
          });
          if (sbRes.ok) {
            const raw = await sbRes.json();
            let data = raw;
            if (path === '/api/projects') {
              data = (raw || []).map(row => ({
                id: row.id,
                title: row.title,
                category: `${row.content_type}|${row.category || 'Product Design'}`,
                description: row.description || '',
                contentBody: row.content_body || '',
                url: row.destination_url || '',
                productUrl: row.destination_url || '',
                image: row.image_url || '',
                featured: Boolean(row.featured),
                tags: row.tags || '',
                readTime: row.read_time || '5 min read',
                platform: row.platform || '',
                journalType: row.journal_type || 'link',
                createdAt: row.created_at,
                date: row.created_at
              }));
            } else if (path === '/api/tools') {
              data = (raw || []).map(row => ({
                id: row.id,
                name: row.name,
                category: row.category || '',
                icon_type: row.icon_type || 'figma',
                custom_icon_url: row.custom_icon_url || '',
                display_order: row.display_order || 0
              }));
            } else if (path === '/api/settings') {
              data = (Array.isArray(raw) && raw[0] && raw[0].settings) ? raw[0].settings : { email: 'abikrishna15@gmail.com' };
            }
            return {
              ok: true,
              status: 200,
              json: async () => data,
              text: async () => JSON.stringify(data)
            };
          }
        }
      } else if (path === '/api/projects' && options.method === 'POST') {
        const bodyObj = JSON.parse(options.body || '{}');
        const parts = (bodyObj.category || 'work|main|Product Design').split('|');
        const payload = {
          title: bodyObj.title,
          content_type: parts[0] || 'work',
          category: `${parts[1] || 'main'}|${parts.slice(2).join('|') || parts[1] || 'Product Design'}`,
          description: bodyObj.description || '',
          content_body: bodyObj.contentBody || '',
          destination_url: bodyObj.url || '',
          image_url: bodyObj.image || '',
          featured: Boolean(bodyObj.featured),
          tags: bodyObj.tags || bodyObj.tools || '',
          read_time: bodyObj.readTime || '5 min read',
          platform: bodyObj.platform || '',
          journal_type: bodyObj.journalType || 'link',
          created_at: bodyObj.date ? new Date(bodyObj.date).toISOString() : new Date().toISOString()
        };
        const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content`, {
          method: 'POST',
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify(payload)
        });
        if (sbRes.ok) return sbRes;
      } else if (path.startsWith('/api/projects/') && options.method === 'PATCH') {
        const id = path.split('/').pop();
        const bodyObj = JSON.parse(options.body || '{}');
        const payload = {};
        if (bodyObj.title !== undefined) payload.title = bodyObj.title;
        if (bodyObj.description !== undefined) payload.description = bodyObj.description;
        if (bodyObj.contentBody !== undefined) payload.content_body = bodyObj.contentBody;
        if (bodyObj.url !== undefined) payload.destination_url = bodyObj.url;
        if (bodyObj.image !== undefined) payload.image_url = bodyObj.image;
        if (bodyObj.featured !== undefined) payload.featured = Boolean(bodyObj.featured);
        if (bodyObj.tags !== undefined) payload.tags = bodyObj.tags;
        if (bodyObj.readTime !== undefined) payload.read_time = bodyObj.readTime;
        if (bodyObj.journalType !== undefined) payload.journal_type = bodyObj.journalType;
        if (bodyObj.date !== undefined && bodyObj.date) {
          try { payload.created_at = new Date(bodyObj.date).toISOString(); } catch {}
        }
        if (bodyObj.category) {
          const parts = bodyObj.category.split('|');
          payload.content_type = parts[0] || 'work';
          payload.category = `${parts[1] || 'main'}|${parts.slice(2).join('|') || parts[1] || 'Product Design'}`;
        }
        const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify(payload)
        });
        if (sbRes.ok) return sbRes;
      } else if (path.startsWith('/api/projects/') && options.method === 'DELETE') {
        const id = path.split('/').pop();
        const sbRes = await fetch(`${sbUrl}/rest/v1/portfolio_content?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
        });
        if (sbRes.ok) return sbRes;
      }
    } catch (e) {}
  }

  // Fallback to static data.json if GET request
  if (!options.method || options.method === 'GET') {
    try {
      const dataRes = await fetch('data.json');
      if (dataRes.ok) {
        const staticData = await dataRes.json();
        let payload = [];
        if (path === '/api/projects') payload = [...(staticData.projects || []), ...(staticData.playground || []), ...(staticData.journal || [])];
        else if (path === '/api/settings') payload = staticData.settings || {};
        else if (path === '/api/milestones') payload = staticData.milestones || [];
        else if (path === '/api/testimonials') payload = staticData.testimonials || [];
        else if (path === '/api/brands') payload = staticData.brands || [];
        else if (path === '/api/tools') payload = staticData.tools || [];
        else if (path === '/api/messages') payload = staticData.messages || [];

        return {
          ok: true,
          status: 200,
          json: async () => payload,
          text: async () => JSON.stringify(payload)
        };
      }
    } catch (e) {}
  }

  throw lastError || new Error(`API fetch failed for ${path}`);
}

const fileToUrl = async file => {
  if (!file) return '';
  const dataUrl = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
  if (!dataUrl) return '';

  try {
    const response = await apiFetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, data: dataUrl })
    });
    if (response.ok) {
      const result = await response.json();
      if (result && result.url) return result.url;
    }
  } catch (err) {
    console.warn('Upload API notice, using Base64 Data URL fallback:', err);
  }

  return dataUrl;
};



function refreshFields() {
  const selectedType = typeInput.value || 'work';
  const isPlayground = selectedType === 'playground';
  const isJournal = selectedType === 'journal';
  const isWork = selectedType === 'work';

  const journalModeEl = document.querySelector('input[name="journalType"]:checked');
  const journalMode = journalModeEl ? journalModeEl.value : 'link';
  const isInternalBlog = isJournal && journalMode === 'blog';

  const pgModeEl = document.querySelector('input[name="playgroundType"]:checked');
  const pgMode = pgModeEl ? pgModeEl.value : 'external';
  const isInternalPlayground = isPlayground && pgMode === 'internal';

  // Section Headers
  if (formTitleHeading && formSubtitle) {
    const isEditing = Boolean(editingIdInput.value);
    if (isEditing) {
      formTitleHeading.textContent = 'Edit Item';
      formSubtitle.textContent = 'Modify your project details and save changes live.';
    } else if (isWork) {
      formTitleHeading.textContent = 'Publish Work / Case Study';
      formSubtitle.textContent = 'Add a new project experience to your portfolio showcase.';
    } else if (isPlayground) {
      formTitleHeading.textContent = 'Publish Playground Study';
      formSubtitle.textContent = 'Add a visual experiment, concept, or motion exploration.';
    } else {
      formTitleHeading.textContent = 'Publish Journal Article';
      formSubtitle.textContent = 'Add an external platform link or write an internal blog post.';
    }
  }

  // Section visibility toggles
  if (playgroundTypeWrapper) playgroundTypeWrapper.style.display = isPlayground ? 'block' : 'none';
  if (playgroundSectionWrapper) playgroundSectionWrapper.style.display = isPlayground ? 'block' : 'none';
  if (journalTypeWrapper) journalTypeWrapper.style.display = isJournal ? 'block' : 'none';
  if (journalFieldsGroup) {
    journalFieldsGroup.style.display = isJournal ? 'grid' : 'none';
    if (isJournal && $('#journal-date') && !$('#journal-date').value) {
      $('#journal-date').value = getTodayDateString();
    }
  }
  if (journalBlogBodyGroup) journalBlogBodyGroup.style.display = isInternalBlog ? 'block' : 'none';

  if (workFieldsGroup) workFieldsGroup.style.display = (isWork || isPlayground) ? 'block' : 'none';
  if (featuredLabel) featuredLabel.style.display = isPlayground ? 'none' : 'flex';

  // URL Field: hide entirely for internal blog, show for all others
  const urlFieldWrapper = contentUrl ? contentUrl.closest('.form-group') : null;
  if (urlFieldWrapper) {
    if (isInternalBlog) {
      urlFieldWrapper.style.display = 'none';
      contentUrl.removeAttribute('required');
    } else {
      urlFieldWrapper.style.display = 'block';
      if (isJournal) {
        if (urlFieldLabel) urlFieldLabel.textContent = 'External Article URL';
        contentUrl.placeholder = 'https://medium.com/@username/article-title';
        contentUrl.setAttribute('required', 'required');
      } else if (isPlayground) {
        if (urlFieldLabel) urlFieldLabel.textContent = isInternalPlayground ? 'Interactive Prototype / Demo Link (Optional)' : 'External Prototype Link (Figma, Dribbble, CodePen, Live Demo)';
        contentUrl.placeholder = isInternalPlayground ? 'https://... (optional) or leave blank for internal modal' : 'https://dribbble.com/shots/... or https://figma.com/proto/... or https://codepen.io/...';
        if (isInternalPlayground) contentUrl.removeAttribute('required');
        else contentUrl.setAttribute('required', 'required');
      } else {
        if (urlFieldLabel) urlFieldLabel.textContent = 'Case Study Link (URL)';
        contentUrl.placeholder = 'https://... or #casestudy';
        contentUrl.setAttribute('required', 'required');
      }
    }
  }

  const canAutoFetch = (isJournal && journalMode === 'link') || (isPlayground && pgMode === 'external');
  if (autoFetchBtn) autoFetchBtn.style.display = canAutoFetch ? 'inline-flex' : 'none';

  // Category visibility toggle: Hide for Quick Sketches & Just for Fun (Experiments ONLY gets Category)
  const categoryWrapper = $('#category-group-wrapper');
  const pgToggleBtn = $('#toggle-pg-topic-manager-btn');
  const pgInlineBox = $('#playground-inline-topics-box');
  const journalToggleBtn = $('#toggle-journal-topic-manager-btn');
  const journalInlineBox = $('#journal-inline-topics-box');
  const pSection = section ? section.value : 'experiments';
  if (isPlayground && (pSection === 'sketches' || pSection === 'fun')) {
    if (categoryWrapper) categoryWrapper.style.display = 'none';
    if (pgToggleBtn) pgToggleBtn.style.display = 'none';
    if (pgInlineBox) pgInlineBox.style.display = 'none';
    if (journalToggleBtn) journalToggleBtn.style.display = 'none';
    if (journalInlineBox) journalInlineBox.style.display = 'none';
  } else {
    if (categoryWrapper) categoryWrapper.style.display = 'block';
    if (pgToggleBtn) pgToggleBtn.style.display = isPlayground ? 'inline-block' : 'none';
    if (journalToggleBtn) journalToggleBtn.style.display = isJournal ? 'inline-block' : 'none';
    if (!isPlayground && pgInlineBox) pgInlineBox.style.display = 'none';
    if (!isJournal && journalInlineBox) journalInlineBox.style.display = 'none';
  }

  // Populate categories
  const currentCatVal = category.value;
  const list = categories[selectedType] || categories.work;
  category.innerHTML = list.map(val => `<option value="${escapeHtml(val)}">${escapeHtml(val)}</option>`).join('');
  if (currentCatVal && list.includes(currentCatVal)) {
    category.value = currentCatVal;
  }

  updateLivePreview();
}

if (section) section.onchange = refreshFields;

// Format Radio Buttons Switcher (Journal)
document.querySelectorAll('input[name="journalType"]').forEach(radio => {
  radio.onchange = () => {
    document.querySelectorAll('#journal-type-wrapper .format-radio').forEach(lbl => lbl.classList.remove('active'));
    radio.closest('.format-radio').classList.add('active');
    refreshFields();
  };
});

// Format Radio Buttons Switcher (Playground)
document.querySelectorAll('input[name="playgroundType"]').forEach(radio => {
  radio.onchange = () => {
    document.querySelectorAll('#playground-type-wrapper .format-radio').forEach(lbl => lbl.classList.remove('active'));
    radio.closest('.format-radio').classList.add('active');
    refreshFields();
  };
});

// Real-Time Live Preview Updater
function updateLivePreview() {
  if (!prevTitle) return;
  const titleVal = $('#content-title')?.value.trim() || 'Project or Article Title';
  const descVal = $('#content-description')?.value.trim() || 'Your description summary will appear here dynamically as you type.';
  const catVal = category?.value || 'PRODUCT DESIGN';
  const timeVal = $('#journal-readtime')?.value.trim() || '◷ 5 min read';
  const imgUrl = $('#content-image-url')?.value.trim();

  prevTitle.textContent = titleVal;
  prevDesc.textContent = descVal;
  prevCat.textContent = catVal.toUpperCase();
  prevTime.textContent = timeVal;

  if (imgUrl) {
    prevMedia.innerHTML = `<img src="${escapeHtml(imgUrl)}" alt="Preview">`;
  } else {
    prevMedia.innerHTML = `<div class="preview-placeholder">AK.</div>`;
  }
}

['#content-title', '#content-description', '#content-category', '#journal-readtime', '#content-image-url'].forEach(sel => {
  const el = $(sel);
  if (el) {
    el.oninput = updateLivePreview;
    el.onchange = updateLivePreview;
  }
});

// Auto-Fetch Metadata Handler
if (autoFetchBtn) {
  autoFetchBtn.onclick = async () => {
    let targetUrl = contentUrl.value.trim();
    if (!targetUrl) {
      alert('Please enter an article URL first (e.g. Medium, Substack, LinkedIn, or blog post link).');
      return;
    }
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
      contentUrl.value = targetUrl;
    }

    if (fetchStatusMsg) fetchStatusMsg.textContent = 'Extracting article details & cover image... ⏳';
    autoFetchBtn.disabled = true;

    let fetchedData = null;

    // 1. Try backend API endpoint (/api/fetch-metadata)
    try {
      const response = await apiFetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      if (response.ok) {
        fetchedData = await response.json();
      }
    } catch (e) {}

    // 2. Secondary browser-direct fallback via Microlink API if server failed or returned missing data
    if (!fetchedData || !fetchedData.title || !fetchedData.image) {
      try {
        const microRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(targetUrl)}&screenshot=false&meta=true`);
        if (microRes.ok) {
          const microJson = await microRes.json();
          if (microJson.status === 'success' && microJson.data) {
            const md = microJson.data;
            fetchedData = {
              title: fetchedData?.title || md.title || '',
              description: fetchedData?.description || md.description || '',
              image: fetchedData?.image || ((md.image && md.image.url) ? md.image.url : ''),
              platform: fetchedData?.platform || md.publisher || '',
              readTime: fetchedData?.readTime || '5 min read',
              date: md.date ? md.date.split('T')[0] : (fetchedData?.date || getTodayDateString())
            };
          }
        }
      } catch (e) {}
    }

    // 3. Fallback generator from URL structure if still incomplete
    if (!fetchedData || !fetchedData.title) {
      let platformName = 'Web Article';
      let titleName = '';
      let descName = '';
      let imgUrl = '';

      try {
        const parsed = new URL(targetUrl);
        const host = parsed.hostname.replace(/^www\./, '');
        platformName = host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1);
        if (targetUrl.includes('linkedin')) {
          platformName = 'LinkedIn';
          const match = targetUrl.match(/posts\/([^\/\?]+)/) || targetUrl.match(/update\/([^\/\?]+)/) || targetUrl.match(/pulse\/([^\/\?]+)/);
          if (match) {
            const parts = match[1].split('_');
            let author = parts[0] ? parts[0].replace(/-\d+[a-z0-9]*$/i, '').replace(/-/g, ' ') : 'Abi Krishna';
            let topic = parts[1] ? parts[1].replace(/-\d+/g, '').replace(/-[a-z0-9]{3,10}$/i, '').replace(/share/gi, '').replace(/-/g, ' ') : 'Product Design';
            author = author.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            topic = topic.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            titleName = `${author}: ${topic}`;
            descName = `Insights and product design thinking shared by ${author} on LinkedIn.`;
          }
        }
        if (!titleName) {
          const pathSegs = parsed.pathname.split('/').filter(Boolean);
          const slug = (pathSegs.pop() || '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
          if (slug.length > 3) titleName = slug.charAt(0).toUpperCase() + slug.slice(1);
        }
      } catch {}

      fetchedData = {
        title: titleName || 'Design & Product Article',
        description: descName || `An insightful article published on ${platformName} exploring design systems and product strategy.`,
        image: imgUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=95',
        platform: platformName,
        readTime: '5 min read',
        date: getTodayDateString()
      };
    }

    // Robust date extraction from URL, Snowflake ID, or returned metadata
    let finalExtractedDate = '';
    if (fetchedData && fetchedData.date && fetchedData.date !== getTodayDateString()) {
      finalExtractedDate = fetchedData.date;
    } else {
      finalExtractedDate = extractDateFromUrlOrText(targetUrl, '', fetchedData?.date || '');
    }
    if (!finalExtractedDate) {
      finalExtractedDate = getTodayDateString();
    }

    // Populate Fields
    if (fetchedData.title && $('#content-title')) $('#content-title').value = fetchedData.title;
    if (fetchedData.description && $('#content-description')) $('#content-description').value = fetchedData.description;
    if (fetchedData.image && $('#content-image-url')) $('#content-image-url').value = fetchedData.image;
    if (fetchedData.readTime && $('#journal-readtime')) $('#journal-readtime').value = fetchedData.readTime;
    if ($('#journal-date')) {
      $('#journal-date').value = finalExtractedDate;
    }

    if (fetchStatusMsg) fetchStatusMsg.textContent = '✦ Details, image & publish date auto-fetched!';
    updateLivePreview();

    setTimeout(() => {
      if (fetchStatusMsg) fetchStatusMsg.textContent = '';
      autoFetchBtn.disabled = false;
    }, 3000);
  };
}

// Start Editing Item
function startEditing(id) {
  const item = allProjectsData.find(p => String(p.id) === String(id));
  if (!item) return;

  const categoryRaw = item.category || 'work|main|Product Design';
  const catParts = categoryRaw.split('|');
  const targetType = catParts[0] || 'work';
  const itemSection = catParts.length > 2 ? catParts[1] : 'main';
  const itemCategoryName = catParts.length > 2 ? catParts.slice(2).join('|') : catParts.slice(1).join('|');

  // Select tab segment
  typeSegments.forEach(b => b.classList.toggle('active', b.dataset.type === targetType));
  typeInput.value = targetType;

  // Set Journal Type Radio
  const jType = item.journalType || 'link';
  const rBtn = document.querySelector(`input[name="journalType"][value="${jType}"]`);
  if (rBtn) {
    rBtn.checked = true;
    document.querySelectorAll('#journal-type-wrapper .format-radio').forEach(lbl => lbl.classList.remove('active'));
    rBtn.closest('.format-radio').classList.add('active');
  }

  // Set Playground Type Radio
  const pgType = item.playgroundType || (item.journalType === 'internal' ? 'internal' : (item.url && item.url.startsWith('http') ? 'external' : 'internal'));
  const pgRadioBtn = document.querySelector(`input[name="playgroundType"][value="${pgType}"]`);
  if (pgRadioBtn) {
    pgRadioBtn.checked = true;
    document.querySelectorAll('#playground-type-wrapper .format-radio').forEach(lbl => lbl.classList.remove('active'));
    pgRadioBtn.closest('.format-radio').classList.add('active');
  }

  if (itemSection && section) section.value = itemSection;

  refreshFields();

  if (itemCategoryName && category) {
    const list = categories[targetType] || categories.work;
    if (!list.includes(itemCategoryName)) {
      const opt = document.createElement('option');
      opt.value = itemCategoryName;
      opt.textContent = itemCategoryName;
      category.appendChild(opt);
    }
    category.value = itemCategoryName;
  }

  if ($('#content-title')) $('#content-title').value = item.title || '';
  if ($('#content-description')) $('#content-description').value = item.description || '';
  if ($('#journal-content-body')) $('#journal-content-body').value = item.contentBody || '';
  if ($('#content-url')) $('#content-url').value = item.url || '';
  if ($('#content-product-url')) $('#content-product-url').value = item.productUrl || '';
  if ($('#content-tags')) $('#content-tags').value = item.tags || '';
  if ($('#content-tools')) $('#content-tools').value = item.tools || '';
  if ($('#content-image-url')) $('#content-image-url').value = item.image || '';
  if ($('#journal-readtime')) $('#journal-readtime').value = item.readTime || '';
  if ($('#content-featured')) $('#content-featured').checked = Boolean(item.featured);
  if ($('#journal-date')) {
    const rawDate = item.createdAt || item.date;
    if (rawDate) {
      try {
        $('#journal-date').value = new Date(rawDate).toISOString().split('T')[0];
      } catch {
        $('#journal-date').value = getTodayDateString();
      }
    } else {
      $('#journal-date').value = getTodayDateString();
    }
  }

  editingIdInput.value = id;
  submitBtn.innerHTML = '💾 Save Changes <b>↗</b>';
  if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';

  updateLivePreview();
  contentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cancel Editing
if (cancelEditBtn) {
  cancelEditBtn.onclick = () => {
    editingIdInput.value = '';
    submitBtn.innerHTML = 'Publish Item <b>↗</b>';
    cancelEditBtn.style.display = 'none';
    contentForm.reset();
    if ($('#journal-date')) $('#journal-date').value = getTodayDateString();
    refreshFields();
  };
}

const getSavedProjectsOrder = () => {
  try { return JSON.parse(localStorage.getItem('custom_projects_order')) || null; } catch { return null; }
};
const setSavedProjectsOrder = data => {
  try { localStorage.setItem('custom_projects_order', JSON.stringify(data)); } catch { }
};

const getSavedMilestonesOrder = () => {
  try { return JSON.parse(localStorage.getItem('custom_milestones_order')) || null; } catch { return null; }
};
const setSavedMilestonesOrder = data => {
  try { localStorage.setItem('custom_milestones_order', JSON.stringify(data)); } catch { }
};

function renderProjectsList() {
  const active = $('#content-filter')?.value || 'all';
  
  const filtered = active === 'all' ? allProjectsData : allProjectsData.filter(item => {
    const cat = (item.category || '').toLowerCase();
    const typeStr = cat.split('|')[0];
    return typeStr === active.toLowerCase() || cat.startsWith(`${active}|`);
  });
  
  list.innerHTML = filtered.length ? filtered.map((item, idx) => {
    const catParts = (item.category || 'work|main|Product Design').split('|');
    const itemType = catParts[0] || 'work';
    const displayCategory = catParts.length > 2 ? catParts.slice(2).join('|') : catParts.slice(1).join('|') || 'Product Design';
    const isFeatured = Boolean(item.featured);
    const typeLabel = itemType.toUpperCase();
    const canFeature = itemType !== 'playground';
    const canReorder = itemType === 'work';
    const isFirst = idx === 0;
    const isLast = idx === filtered.length - 1;
    
    return `<article class="content-row" data-type="${escapeHtml(itemType)}">
      <div class="content-row-main">
        <div class="content-row-header">
          <span class="type-badge badge-${escapeHtml(itemType)}">${escapeHtml(typeLabel)}</span>
          <span class="cat-pill">${escapeHtml(displayCategory)}</span>
          ${(isFeatured && canFeature) ? '<span class="feature-badge">✦ FEATURED ON HOME</span>' : ''}
        </div>
        <h3 class="content-row-title">${escapeHtml(item.title)}</h3>
        <div class="content-row-meta">
          ${(item.createdAt || item.date) ? `<span class="meta-item" style="color:var(--accent,#ff4e1b);font-weight:700;">📅 ${new Date(item.createdAt || item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>` : ''}
          ${item.readTime ? `<span class="meta-item">⏱ ${escapeHtml(item.readTime)}</span>` : ''}
          ${item.platform ? `<span class="meta-item">🌐 ${escapeHtml(item.platform)}</span>` : ''}
          ${item.tags ? `<span class="meta-item meta-tags">🏷 ${escapeHtml(item.tags)}</span>` : ''}
        </div>
        ${item.url ? `<p class="content-row-url"><a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">🔗 ${escapeHtml(item.url)}</a></p>` : ''}
      </div>
      <div class="actions">
        ${canReorder ? `
        <button type="button" class="btn-move-up" data-move-proj-up="${item.id}" ${isFirst ? 'disabled' : ''} style="padding:6px 10px;border:1px solid #ddd;border-radius:8px;background:${isFirst ? '#f5f5f5' : '#fff'};color:${isFirst ? '#aaa' : '#333'};cursor:${isFirst ? 'default' : 'pointer'};font-weight:700;">↑ Up</button>
        <button type="button" class="btn-move-down" data-move-proj-down="${item.id}" ${isLast ? 'disabled' : ''} style="padding:6px 10px;border:1px solid #ddd;border-radius:8px;background:${isLast ? '#f5f5f5' : '#fff'};color:${isLast ? '#aaa' : '#333'};cursor:${isLast ? 'default' : 'pointer'};font-weight:700;">↓ Down</button>` : ''}
        <button class="btn-edit" data-edit-id="${item.id}">✏️ Edit</button>
        ${canFeature ? `
        <button class="${isFeatured ? 'btn-unfeature' : 'btn-feature'}" data-toggle-featured="${item.id}" data-state="${isFeatured}">
          ${isFeatured ? '★ Featured' : '✦ Feature on Home'}
        </button>` : ''}
        <button class="btn-remove-content" data-remove-content="${item.id}">Remove</button>
      </div>
    </article>`;
  }).join('') : '<p class="help">No items published in this category yet.</p>';

  const moveProject = async (id, direction) => {
    const filteredIdx = filtered.findIndex(p => String(p.id) === String(id));
    if (filteredIdx === -1) return;

    const targetFilteredIdx = direction === 'up' ? filteredIdx - 1 : filteredIdx + 1;
    if (targetFilteredIdx < 0 || targetFilteredIdx >= filtered.length) return;

    const itemA = filtered[filteredIdx];
    const itemB = filtered[targetFilteredIdx];

    const masterIdxA = allProjectsData.findIndex(p => String(p.id) === String(itemA.id));
    const masterIdxB = allProjectsData.findIndex(p => String(p.id) === String(itemB.id));

    if (masterIdxA !== -1 && masterIdxB !== -1) {
      allProjectsData[masterIdxA] = itemB;
      allProjectsData[masterIdxB] = itemA;

      setSavedProjectsOrder(allProjectsData);
      renderProjectsList();

      try {
        const res = await fetch('/api/projects/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allProjectsData)
        });
        if (res.ok) {
          const updated = await res.json();
          if (Array.isArray(updated) && updated.length) {
            allProjectsData = updated;
            setSavedProjectsOrder(allProjectsData);
            renderProjectsList();
          }
        }
      } catch (e) {
        console.error('Failed to reorder projects:', e);
      }
    }
  };

  document.querySelectorAll('[data-move-proj-up]').forEach(button => {
    button.onclick = e => {
      e.preventDefault();
      moveProject(button.dataset.moveProjUp, 'up');
    };
  });

  document.querySelectorAll('[data-move-proj-down]').forEach(button => {
    button.onclick = e => {
      e.preventDefault();
      moveProject(button.dataset.moveProjDown, 'down');
    };
  });

  // Attach Edit Handlers
  document.querySelectorAll('[data-edit-id]').forEach(button => {
    button.onclick = e => {
      e.preventDefault();
      startEditing(button.dataset.editId);
    };
  });

  // Attach Delete Handlers (Content Items)
  document.querySelectorAll('[data-remove-content]').forEach(button => {
    button.onclick = async e => {
      e.preventDefault();
      e.stopPropagation();
      const itemId = button.dataset.removeContent;
      if (!itemId) return;

      if (confirm('Are you sure you want to remove this published item?')) {
        button.textContent = 'Removing…';
        button.disabled = true;
        try {
          const res = await apiFetch(`/api/projects/${itemId}`, { method: 'DELETE' });
          if (res.ok) {
            await load();
          } else {
            alert('Could not remove item.');
            button.textContent = 'Remove';
            button.disabled = false;
          }
        } catch (err) {
          alert('Network error deleting item.');
          button.textContent = 'Remove';
          button.disabled = false;
        }
      }
    };
  });

  // Attach Feature / Unfeature Handlers
  document.querySelectorAll('[data-toggle-featured]').forEach(button => {
    button.onclick = async e => {
      e.preventDefault();
      const id = button.dataset.toggleFeatured;
      const currentState = button.dataset.state === 'true';
      button.textContent = 'Updating…';
      button.disabled = true;
      try {
        const res = await apiFetch(`/api/projects/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featured: !currentState })
        });
        if (res.ok) {
          await load();
        } else {
          alert('Could not update feature status.');
          button.textContent = currentState ? '★ Featured' : '✦ Feature on Home';
          button.disabled = false;
        }
      } catch (err) {
        alert('Network error updating feature status.');
        button.textContent = currentState ? '★ Featured' : '✦ Feature on Home';
        button.disabled = false;
      }
    };
  });
}

async function load() {
  const response = await apiFetch('/api/projects');
  let items = await response.json();
  const savedOrder = getSavedProjectsOrder();
  if (savedOrder && Array.isArray(savedOrder) && savedOrder.length) {
    const orderMap = new Map(savedOrder.map((item, idx) => [String(item.id), idx]));
    items.sort((a, b) => {
      const idxA = orderMap.has(String(a.id)) ? orderMap.get(String(a.id)) : 999;
      const idxB = orderMap.has(String(b.id)) ? orderMap.get(String(b.id)) : 999;
      return idxA - idxB;
    });
  }
  allProjectsData = items;
  renderProjectsList();
}

if ($('#content-filter')) $('#content-filter').onchange = renderProjectsList;

contentForm.onsubmit = async event => {
  event.preventDefault();
  const status = $('#content-status');
  const editId = editingIdInput.value;
  const isEditing = Boolean(editId);

  // --- Inline Validation ---
  const titleVal = ($('#content-title')?.value || '').trim();
  const descVal = ($('#content-description')?.value || '').trim();
  const urlVal = ($('#content-url')?.value || '').trim();
  const contentBodyVal = ($('#journal-content-body')?.value || '').trim();
  const targetType = typeInput.value || 'work';
  const journalModeNow = (document.querySelector('input[name="journalType"]:checked')?.value) || 'link';
  const isInternalBlogNow = targetType === 'journal' && journalModeNow === 'blog';
  const isExternalJournal = targetType === 'journal' && journalModeNow === 'link';

  const showError = (msg) => {
    status.textContent = '⚠ ' + msg;
    status.style.color = '#e33';
    setTimeout(() => { status.textContent = ''; status.style.color = ''; }, 4000);
  };

  if (!titleVal) return showError('Title is required.');
  if (!descVal) return showError('Description / Excerpt is required.');
  if (isExternalJournal) {
    if (!urlVal) return showError('External Article URL is required for external articles.');
    if (!/^https?:\/\//i.test(urlVal)) return showError('URL must start with https:// — e.g. https://medium.com/...');
  }
  if (!isInternalBlogNow && !isExternalJournal && targetType !== 'journal' && !urlVal) {
    return showError('Link / Destination URL is required.');
  }
  if (isInternalBlogNow && !contentBodyVal) return showError('Full Article Content is required for internal blog posts.');

  // Date validation
  const dateVal = ($('#journal-date')?.value || '').trim();
  if (dateVal) {
    const parsedDate = new Date(dateVal);
    const yr = parsedDate.getFullYear();
    const currentYear = new Date().getFullYear();
    if (isNaN(parsedDate.getTime()) || yr < 2000 || yr > currentYear + 1) {
      return showError(`Publish date year must be between 2000 and ${currentYear + 1}. You entered year ${yr || 'unknown'}.`);
    }
  }

  status.textContent = isEditing ? 'Saving changes…' : 'Publishing…';
  status.style.color = '';

  try {
    const data = Object.fromEntries(new FormData(contentForm));
    let image = data.imageUrl || '';
    const fileElem = $('#content-image-file');
    if (fileElem && fileElem.files && fileElem.files[0]) {
      image = await fileToUrl(fileElem.files[0]);
    }

    const sectionName = targetType === 'playground' ? (section ? section.value : 'main') : 'main';
    const isFeatured = targetType === 'playground' ? false : Boolean($('#content-featured')?.checked);

    let finalCategory = data.category || 'Product Design';
    if (targetType === 'playground') {
      if (sectionName === 'sketches') finalCategory = 'Quick sketches';
      else if (sectionName === 'fun') finalCategory = 'Just for fun';
    }

    const pgModeElNow = document.querySelector('input[name="playgroundType"]:checked');
    const pgModeNow = pgModeElNow ? pgModeElNow.value : 'external';

    // Auto-detect platform for external links
    let detectedPlatform = '';
    if (urlVal && urlVal.startsWith('http')) {
      const u = urlVal.toLowerCase();
      if (u.includes('figma.com')) detectedPlatform = 'Figma Prototype';
      else if (u.includes('dribbble.com')) detectedPlatform = 'Dribbble';
      else if (u.includes('behance.net')) detectedPlatform = 'Behance';
      else if (u.includes('codepen.io')) detectedPlatform = 'CodePen';
      else if (u.includes('framer.com') || u.includes('framer.website')) detectedPlatform = 'Framer';
      else if (u.includes('github.com') || u.includes('github.io')) detectedPlatform = 'GitHub';
      else if (u.includes('spline.design')) detectedPlatform = 'Spline 3D';
      else if (u.includes('linkedin.com')) detectedPlatform = 'LinkedIn';
      else if (u.includes('medium.com')) detectedPlatform = 'Medium';
      else if (u.includes('substack.com')) detectedPlatform = 'Substack';
      else detectedPlatform = 'Live Demo';
    }

    const payload = {
      title: titleVal,
      description: descVal,
      contentBody: isInternalBlogNow ? contentBodyVal : '',
      url: isInternalBlogNow ? '' : (urlVal || ''),
      productUrl: data.productUrl || '',
      image,
      category: `${targetType}|${sectionName}|${finalCategory}`,
      featured: isFeatured,
      tags: data.tags || '',
      tools: data.tools || '',
      readTime: data.readTime || '5 min read',
      platform: detectedPlatform,
      journalType: targetType === 'journal' ? journalModeNow : (targetType === 'playground' ? pgModeNow : 'link'),
      playgroundType: targetType === 'playground' ? pgModeNow : '',
      date: targetType === 'journal' ? (dateVal || data.date || getTodayDateString()) : (data.date || '')
    };

    let response;
    if (isEditing) {
      response = await apiFetch(`/api/projects/${editId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      response = await apiFetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Save failed');
    }

    editingIdInput.value = '';
    submitBtn.innerHTML = 'Publish Item <b>↗</b>';
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';

    contentForm.reset();
    refreshFields();
    status.textContent = isEditing ? '✦ Changes saved live!' : '✦ Published successfully! Content is live on your website.';
    status.style.color = '';
    await load();
  } catch (err) {
    status.textContent = `⚠ Could not save: ${err.message || 'Server error'}`;
    status.style.color = '#e33';
  }
};

const updateHeroPreview = name => {
  const fileInput = $(`#hero-${name}-file`);
  const urlInput = $(`#hero-${name}-url`);
  const posSelect = $(`#hero-${name}-pos`);
  const colorSelect = $(`#hero-${name}-color`);
  const imgPrev = $(`#hero-${name}-prev`);
  const phSpan = $(`#hero-${name}-prev-ph`);

  if (!imgPrev || !phSpan) return;

  const file = fileInput?.files?.[0];
  const pos = posSelect ? posSelect.value : 'center center';
  const colorMode = colorSelect ? colorSelect.value : 'original';

  imgPrev.style.setProperty('object-position', pos, 'important');

  let filterVal = 'none';
  if (colorMode === 'gray' || colorMode === 'monochrome' || colorMode === 'classic-gray') {
    filterVal = 'grayscale(100%) contrast(1.1)';
  } else if (colorMode === 'warm-gray' || colorMode === 'warm-vintage' || colorMode === 'vintage') {
    filterVal = 'grayscale(90%) sepia(20%) contrast(1.1)';
  }
  imgPrev.style.setProperty('filter', filterVal, 'important');

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      imgPrev.src = e.target.result;
      imgPrev.style.display = 'block';
      phSpan.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else if (urlInput && urlInput.value.trim()) {
    imgPrev.src = urlInput.value.trim();
    imgPrev.style.display = 'block';
    phSpan.style.display = 'none';
  } else {
    imgPrev.style.display = 'none';
    phSpan.style.display = 'block';
  }
};


['home', 'center', 'about', 'work', 'playground', 'journal'].forEach(name => {
  $(`#hero-${name}-url`)?.addEventListener('input', () => updateHeroPreview(name));
  $(`#hero-${name}-file`)?.addEventListener('change', async () => {
    const fileInput = $(`#hero-${name}-file`);
    const file = fileInput?.files?.[0];
    if (file) {
      const uploadedUrl = await fileToUrl(file);
      const urlInput = $(`#hero-${name}-url`);
      if (urlInput && uploadedUrl) {
        urlInput.value = uploadedUrl;
      }
    }
    updateHeroPreview(name);
  });
  $(`#hero-${name}-pos`)?.addEventListener('change', () => updateHeroPreview(name));
  $(`#hero-${name}-color`)?.addEventListener('change', () => updateHeroPreview(name));
});

window.deleteHeroImage = heroType => {
  const urlInput = $(`#hero-${heroType}-url`);
  const fileInput = $(`#hero-${heroType}-file`);
  const prevImg = $(`#hero-${heroType}-prev`);
  const prevPh = $(`#hero-${heroType}-prev-ph`);

  if (urlInput) urlInput.value = '';
  if (fileInput) fileInput.value = '';
  if (prevImg) {
    prevImg.src = '';
    prevImg.style.display = 'none';
  }
  if (prevPh) prevPh.style.display = 'block';

  try {
    const saved = JSON.parse(localStorage.getItem('ak_portfolio_settings') || '{}');
    const keyMap = { home: 'homeHeroImage', center: 'homeCenterImage', about: 'aboutHeroImage', work: 'workHeroImage', playground: 'playgroundHeroImage', journal: 'journalHeroImage' };
    if (keyMap[heroType]) {
      saved[keyMap[heroType]] = '';
      localStorage.setItem('ak_portfolio_settings', JSON.stringify(saved));
    }
  } catch (e) {}
};

window.reuploadHeroImage = heroType => {
  const fileInput = $(`#hero-${heroType}-file`);
  if (fileInput) fileInput.click();
};

const applySettingsToForm = (settings) => {
  if (!settings || !assetsForm) return;
  if (assetsForm.elements.email && settings.email) assetsForm.elements.email.value = settings.email;
  if (assetsForm.elements.resumeUrl && settings.resumeUrl) assetsForm.elements.resumeUrl.value = settings.resumeUrl.replace(/^[-_\s]+(\/uploads\/)/i, '$1');

  if (assetsForm.elements.heroHomeUrl && settings.homeHeroImage) assetsForm.elements.heroHomeUrl.value = settings.homeHeroImage.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
  if (assetsForm.elements.homeHeroPosition && settings.homeHeroPosition) assetsForm.elements.homeHeroPosition.value = settings.homeHeroPosition;
  if (assetsForm.elements.homeHeroColorMode && settings.homeHeroColorMode) assetsForm.elements.homeHeroColorMode.value = settings.homeHeroColorMode;

  if (assetsForm.elements.heroCenterUrl && settings.homeCenterImage) assetsForm.elements.heroCenterUrl.value = settings.homeCenterImage.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
  if (assetsForm.elements.homeCenterPosition && settings.homeCenterPosition) assetsForm.elements.homeCenterPosition.value = settings.homeCenterPosition;
  if (assetsForm.elements.homeCenterColorMode && settings.homeCenterColorMode) assetsForm.elements.homeCenterColorMode.value = settings.homeCenterColorMode;

  if (assetsForm.elements.heroAboutUrl && settings.aboutHeroImage) assetsForm.elements.heroAboutUrl.value = settings.aboutHeroImage.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
  if (assetsForm.elements.aboutHeroPosition && settings.aboutHeroPosition) assetsForm.elements.aboutHeroPosition.value = settings.aboutHeroPosition;
  if (assetsForm.elements.aboutHeroColorMode && settings.aboutHeroColorMode) assetsForm.elements.aboutHeroColorMode.value = settings.aboutHeroColorMode;

  if (assetsForm.elements.heroWorkUrl && settings.workHeroImage) assetsForm.elements.heroWorkUrl.value = settings.workHeroImage.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
  if (assetsForm.elements.workHeroPosition && settings.workHeroPosition) assetsForm.elements.workHeroPosition.value = settings.workHeroPosition;
  if (assetsForm.elements.workHeroColorMode && settings.workHeroColorMode) assetsForm.elements.workHeroColorMode.value = settings.workHeroColorMode;

  if (assetsForm.elements.heroPlaygroundUrl && settings.playgroundHeroImage) assetsForm.elements.heroPlaygroundUrl.value = settings.playgroundHeroImage.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
  if (assetsForm.elements.playgroundHeroPosition && settings.playgroundHeroPosition) assetsForm.elements.playgroundHeroPosition.value = settings.playgroundHeroPosition;
  if (assetsForm.elements.playgroundHeroColorMode && settings.playgroundHeroColorMode) assetsForm.elements.playgroundHeroColorMode.value = settings.playgroundHeroColorMode;

  if (assetsForm.elements.heroJournalUrl && settings.journalHeroImage) assetsForm.elements.heroJournalUrl.value = settings.journalHeroImage.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
  if (assetsForm.elements.journalHeroPosition && settings.journalHeroPosition) assetsForm.elements.journalHeroPosition.value = settings.journalHeroPosition;
  if (assetsForm.elements.journalHeroColorMode && settings.journalHeroColorMode) assetsForm.elements.journalHeroColorMode.value = settings.journalHeroColorMode;

  if (assetsForm.elements.socialLinkedIn && settings.socialLinkedIn) assetsForm.elements.socialLinkedIn.value = settings.socialLinkedIn;
  if (assetsForm.elements.socialBehance && settings.socialBehance) assetsForm.elements.socialBehance.value = settings.socialBehance;
  if (assetsForm.elements.socialInstagram && settings.socialInstagram) assetsForm.elements.socialInstagram.value = settings.socialInstagram;
  if (assetsForm.elements.socialDribbble && settings.socialDribbble) assetsForm.elements.socialDribbble.value = settings.socialDribbble;
  if (assetsForm.elements.socialTwitter && settings.socialTwitter) assetsForm.elements.socialTwitter.value = settings.socialTwitter;
  if (assetsForm.elements.socialYoutube && settings.socialYoutube) assetsForm.elements.socialYoutube.value = settings.socialYoutube;

  if (assetsForm.elements.spotlightBadge && settings.spotlightBadge) assetsForm.elements.spotlightBadge.value = settings.spotlightBadge;
  if (assetsForm.elements.spotlightTitle && settings.spotlightTitle) assetsForm.elements.spotlightTitle.value = settings.spotlightTitle;
  if (assetsForm.elements.spotlightTagline && settings.spotlightTagline) assetsForm.elements.spotlightTagline.value = settings.spotlightTagline;
  if (assetsForm.elements.spotlightDesc && settings.spotlightDesc) assetsForm.elements.spotlightDesc.value = settings.spotlightDesc;
  if (assetsForm.elements.spotlightImageUrl && settings.spotlightImageUrl) assetsForm.elements.spotlightImageUrl.value = settings.spotlightImageUrl;
  if (assetsForm.elements.spotlightFlow && settings.spotlightFlow) assetsForm.elements.spotlightFlow.value = settings.spotlightFlow;
  if (assetsForm.elements.spotlightPrimaryText && settings.spotlightPrimaryText) assetsForm.elements.spotlightPrimaryText.value = settings.spotlightPrimaryText;
  if (assetsForm.elements.spotlightPrimaryUrl && settings.spotlightPrimaryUrl) assetsForm.elements.spotlightPrimaryUrl.value = settings.spotlightPrimaryUrl;
  if (assetsForm.elements.spotlightSecondaryText && settings.spotlightSecondaryText) assetsForm.elements.spotlightSecondaryText.value = settings.spotlightSecondaryText;
  if (assetsForm.elements.spotlightSecondaryUrl && settings.spotlightSecondaryUrl) assetsForm.elements.spotlightSecondaryUrl.value = settings.spotlightSecondaryUrl;

  ['homeStat1Val', 'homeStat1Lbl', 'homeStat2Val', 'homeStat2Lbl', 'homeStat3Val', 'homeStat3Lbl', 'homeStat4Val', 'homeStat4Lbl', 'homeStat5Val', 'homeStat5Lbl'].forEach(key => {
    if (assetsForm.elements[key] && settings[key]) assetsForm.elements[key].value = settings[key];
  });

  if (assetsForm.elements.statYears && settings.statYears) assetsForm.elements.statYears.value = settings.statYears;
  if (assetsForm.elements.statDisciplines && settings.statDisciplines) assetsForm.elements.statDisciplines.value = settings.statDisciplines;
  if (assetsForm.elements.statProducts && settings.statProducts) assetsForm.elements.statProducts.value = settings.statProducts;
  if (assetsForm.elements.statIterations && settings.statIterations) assetsForm.elements.statIterations.value = settings.statIterations;

  if (Array.isArray(settings.playgroundTopics) && settings.playgroundTopics.length > 0) {
    categories.playground = [...settings.playgroundTopics];
  } else if (!categories.playground || !categories.playground.length) {
    categories.playground = [...defaultPlaygroundTopics];
  }
  renderPlaygroundTopicsUI();

  if (Array.isArray(settings.journalTopics) && settings.journalTopics.length > 0) {
    categories.journal = [...settings.journalTopics];
  } else if (!categories.journal || !categories.journal.length) {
    categories.journal = [...defaultJournalTopics];
  }
  renderJournalTopicsUI();

  ['home', 'center', 'about', 'work', 'playground', 'journal'].forEach(updateHeroPreview);
};

const loadSettingsSync = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('ak_portfolio_settings') || '{}');
    if (Object.keys(saved).length > 0) {
      applySettingsToForm(saved);
    }
  } catch (e) {}
};

const loadSettings = async () => {
  loadSettingsSync();
  try {
    const res = await apiFetch('/api/settings');
    if (!res.ok) return;
    const settings = await res.json();
    applySettingsToForm(settings);
    try {
      localStorage.setItem('ak_portfolio_settings', JSON.stringify(settings));
    } catch (e) {}
  } catch {}
};


const setAssetStatus = (msg, isError = false) => {
  document.querySelectorAll('#asset-status, .asset-status-msg').forEach(el => {
    if (el) {
      el.textContent = msg;
      el.style.color = isError ? '#d32f2f' : '#2e7d32';
    }
  });
};

assetsForm.onsubmit = async event => {
  event.preventDefault();
  setAssetStatus('Saving…');
  try {
    const data = Object.fromEntries(new FormData(assetsForm));

    const getUrlOrUpload = async (urlVal, fileInput, textInput) => {
      const file = fileInput?.files?.[0];
      if (file) {
        const uploaded = await fileToUrl(file);
        if (fileInput) fileInput.value = '';
        if (textInput && uploaded) textInput.value = uploaded;
        return uploaded;
      }
      let cleanUrl = (urlVal || '').trim();
      return cleanUrl.replace(/^[-_\s]+(\/uploads\/)/i, '$1');
    };

    const settings = {
      homeHeroImage: await getUrlOrUpload(data.heroHomeUrl, assetsForm.elements.heroHomeFile, assetsForm.elements.heroHomeUrl),
      homeHeroPosition: data.homeHeroPosition || 'center center',
      homeHeroColorMode: data.homeHeroColorMode || 'original',

      homeCenterImage: await getUrlOrUpload(data.heroCenterUrl, assetsForm.elements.heroCenterFile, assetsForm.elements.heroCenterUrl),
      homeCenterPosition: data.homeCenterPosition || 'center center',
      homeCenterColorMode: data.homeCenterColorMode || 'gray',

      aboutHeroImage: await getUrlOrUpload(data.heroAboutUrl, assetsForm.elements.heroAboutFile, assetsForm.elements.heroAboutUrl),
      aboutHeroPosition: data.aboutHeroPosition || 'center center',
      aboutHeroColorMode: data.aboutHeroColorMode || 'original',

      workHeroImage: await getUrlOrUpload(data.heroWorkUrl, assetsForm.elements.heroWorkFile, assetsForm.elements.heroWorkUrl),
      workHeroPosition: data.workHeroPosition || 'center center',
      workHeroColorMode: data.workHeroColorMode || 'original',

      playgroundHeroImage: await getUrlOrUpload(data.heroPlaygroundUrl, assetsForm.elements.heroPlaygroundFile, assetsForm.elements.heroPlaygroundUrl),
      playgroundHeroPosition: data.playgroundHeroPosition || 'center center',
      playgroundHeroColorMode: data.playgroundHeroColorMode || 'original',

      journalHeroImage: await getUrlOrUpload(data.heroJournalUrl, assetsForm.elements.heroJournalFile, assetsForm.elements.heroJournalUrl),
      journalHeroPosition: data.journalHeroPosition || 'center center',
      journalHeroColorMode: data.journalHeroColorMode || 'original',

      resumeUrl: await getUrlOrUpload(data.resumeUrl, assetsForm.elements.resumeFile, assetsForm.elements.resumeUrl),
      email: data.email,
      notificationEmail: currentNotificationEmail || data.email,
      socialLinkedIn: data.socialLinkedIn || '',
      socialBehance: data.socialBehance || '',
      socialInstagram: data.socialInstagram || '',
      socialDribbble: data.socialDribbble || '',
      socialTwitter: data.socialTwitter || '',
      socialYoutube: data.socialYoutube || '',

      spotlightBadge: data.spotlightBadge || '',
      spotlightTitle: data.spotlightTitle || '',
      spotlightTagline: data.spotlightTagline || '',
      spotlightDesc: data.spotlightDesc || '',
      spotlightImageUrl: await getUrlOrUpload(data.spotlightImageUrl, assetsForm.elements.spotlightImageFile, assetsForm.elements.spotlightImageUrl),
      spotlightFlow: data.spotlightFlow || '',
      spotlightPrimaryText: data.spotlightPrimaryText || '',
      spotlightPrimaryUrl: data.spotlightPrimaryUrl || '',
      spotlightSecondaryText: data.spotlightSecondaryText || '',
      spotlightSecondaryUrl: data.spotlightSecondaryUrl || '',

      homeStat1Val: data.homeStat1Val || '',
      homeStat1Lbl: data.homeStat1Lbl || '',
      homeStat2Val: data.homeStat2Val || '',
      homeStat2Lbl: data.homeStat2Lbl || '',
      homeStat3Val: data.homeStat3Val || '',
      homeStat3Lbl: data.homeStat3Lbl || '',
      homeStat4Val: data.homeStat4Val || '',
      homeStat4Lbl: data.homeStat4Lbl || '',
      homeStat5Val: data.homeStat5Val || '',
      homeStat5Lbl: data.homeStat5Lbl || '',

      statYears: data.statYears || '',
      statDisciplines: data.statDisciplines || '',
      statProducts: data.statProducts || '',
      statIterations: data.statIterations || '',

      playgroundTopics: categories.playground || defaultPlaygroundTopics,
      journalTopics: categories.journal || defaultJournalTopics
    };

    try {
      localStorage.setItem('ak_portfolio_settings', JSON.stringify(settings));
    } catch (e) {}

    const response = await apiFetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    if (!response.ok) throw new Error();
    if (settings.resumeUrl && assetsForm.elements.resumeUrl) assetsForm.elements.resumeUrl.value = settings.resumeUrl;
    if (settings.spotlightImageUrl && assetsForm.elements.spotlightImageUrl) assetsForm.elements.spotlightImageUrl.value = settings.spotlightImageUrl;
    setAssetStatus('✦ Assets, Showcase & Settings saved live!');
    ['home', 'center', 'about', 'work', 'playground', 'journal'].forEach(updateHeroPreview);
  } catch (err) {
    setAssetStatus('Could not save settings.', true);
  }
};
// -------------------------------------------------------------
// Form Inquiries & Notification Email Manager
// -------------------------------------------------------------
let allMessagesData = [];
let currentNotificationEmail = 'abikrishna15@gmail.com';

const updateMessagesCountBadge = () => {
  const badge = $('#messages-count-badge');
  if (badge) {
    if (allMessagesData.length > 0) {
      badge.textContent = allMessagesData.length;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
};

const renderMessagesList = () => {
  const listContainer = $('#messages-list');
  if (!listContainer) return;

  if (!allMessagesData || !allMessagesData.length) {
    listContainer.innerHTML = `
      <div style="background:#fff; border:1px solid #e9e4df; border-radius:16px; padding:40px; text-align:center;">
        <p style="font-size:32px; margin:0 0 8px;">📬</p>
        <h3 style="margin:0 0 6px; font-weight:800; font-size:16px; color:#333;">No Form Inquiries Yet</h3>
        <p style="margin:0; color:#888; font-size:13px;">When visitors submit project proposals or greetings via your website, they will appear here live.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = allMessagesData.map(msg => {
    const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Recent';

    const safeName = escapeHtml(msg.name || 'Anonymous');
    const safeEmail = escapeHtml(msg.email || '');
    const safeType = escapeHtml(msg.projectType || 'General Inquiry');
    const safeMessage = escapeHtml(msg.message || 'No message content provided.');
    const safeTargetEmail = escapeHtml(currentNotificationEmail);

    const replySubject = encodeURIComponent(`Re: ${msg.projectType || 'Portfolio Inquiry'} — Abikrishna T.`);
    const replyBody = encodeURIComponent(`Hi ${msg.name || 'there'},\n\nThank you for reaching out via my portfolio!\n\nRegarding your inquiry:\n"${msg.message || ''}"\n\nBest regards,\nAbikrishna T.`);
    const replyMailto = `mailto:${encodeURIComponent(msg.email || '')}?subject=${replySubject}&body=${replyBody}`;
    const replyGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email || '')}&su=${replySubject}&body=${replyBody}`;

    const forwardSubject = encodeURIComponent(`Fwd Form Inquiry: ${msg.name || 'Client'} (${msg.projectType || 'Inquiry'})`);
    const forwardBody = encodeURIComponent(`[Website Form Submission]\n\nName: ${msg.name || 'N/A'}\nEmail: ${msg.email || 'N/A'}\nProject/Inquiry Type: ${msg.projectType || 'General'}\nSubmitted: ${dateStr}\n\nMessage:\n${msg.message || ''}\n\n-------------------------------\nSent from Abikrishna Portfolio CMS Studio`);
    const forwardMailto = `mailto:${encodeURIComponent(currentNotificationEmail)}?subject=${forwardSubject}&body=${forwardBody}`;
    const forwardGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(currentNotificationEmail)}&su=${forwardSubject}&body=${forwardBody}`;

    return `
      <div class="message-card" style="background:#fff; border:1px solid #e9e4df; border-radius:16px; padding:20px; transition:all 0.2s ease;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #f2eee9;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <strong style="font-size:16px; font-weight:800; color:#111;">${safeName}</strong>
              <span style="background:#f0ebe5; color:#555; font-size:11px; font-weight:700; padding:3px 10px; border-radius:99px;">${safeType}</span>
            </div>
            <a href="mailto:${safeEmail}" style="color:var(--accent, #ff4e1b); text-decoration:none; font-weight:600; font-size:13px;">✉ ${safeEmail}</a>
          </div>
          <span style="color:#888; font-size:12px; font-weight:600;">📅 ${dateStr}</span>
        </div>

        <div style="background:#faf8f5; border-radius:12px; padding:14px 16px; margin-bottom:16px; font-size:14px; line-height:1.6; color:#333; white-space:pre-wrap;">${safeMessage}</div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <a href="${replyGmail}" target="_blank" rel="noreferrer" style="display:inline-flex; align-items:center; gap:6px; padding:10px 18px; background:#111; color:#fff; border-radius:10px; text-decoration:none; font-size:13px; font-weight:700;">
              ✉ Reply to Sender ↗
            </a>
            <a href="${forwardGmail}" target="_blank" rel="noreferrer" style="display:inline-flex; align-items:center; gap:6px; padding:10px 18px; background:#eef5ff; color:#1a56db; border:1px solid #c7d9f8; border-radius:10px; text-decoration:none; font-size:13px; font-weight:700;">
              ↗ Forward Inquiry (${safeTargetEmail})
            </a>
          </div>
          <button type="button" onclick="deleteMessage('${msg.id}')" style="padding:10px 16px; background:#fff1f1; color:#d32f2f; border:1px solid #ffcdd2; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer;">
            🗑 Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
};

const fetchMessages = async () => {
  let serverMessages = [];
  let localMessages = [];

  // 1. Fetch from server API / Supabase
  try {
    const res = await apiFetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) serverMessages = data;
    }
  } catch (err) {}

  // 2. Read local client submissions from browser localStorage
  try {
    const localSaved = localStorage.getItem('ak_submitted_messages');
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed)) localMessages = parsed;
    }
  } catch (e) {}

  // 3. Smart Deduplication: Server records take absolute priority
  // Match duplicate entries by ID OR normalized content fingerprint (name + email + message text)
  const seenIds = new Set();
  const seenFingerprints = new Set();
  const unified = [];

  // Add all server messages first
  for (const m of serverMessages) {
    if (!m) continue;
    const id = String(m.id || '');
    const fingerprint = `${(m.name || '').trim().toLowerCase()}|${(m.email || '').trim().toLowerCase()}|${(m.message || '').trim().toLowerCase()}`;
    if (id) seenIds.add(id);
    if (fingerprint.length > 2) seenFingerprints.add(fingerprint);
    unified.push(m);
  }

  // Filter local messages: only add if NOT already synced to server
  const remainingLocal = [];
  for (const m of localMessages) {
    if (!m) continue;
    const id = String(m.id || '');
    const fingerprint = `${(m.name || '').trim().toLowerCase()}|${(m.email || '').trim().toLowerCase()}|${(m.message || '').trim().toLowerCase()}`;
    if (seenIds.has(id) || seenFingerprints.has(fingerprint)) {
      // Already synced to server, skip
      continue;
    }
    seenIds.add(id);
    seenFingerprints.add(fingerprint);
    unified.push(m);
    remainingLocal.push(m);
  }

  // Update local storage to only keep un-synced entries, preventing stale duplicates
  try {
    localStorage.setItem('ak_submitted_messages', JSON.stringify(remainingLocal));
  } catch (e) {}

  // Sort latest first
  unified.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  allMessagesData = unified;
  renderMessagesList();
  updateMessagesCountBadge();
};

window.deleteMessage = async (id) => {
  if (!confirm('Are you sure you want to delete this form submission?')) return;

  // Remove from local storage array as well
  try {
    const localSaved = JSON.parse(localStorage.getItem('ak_submitted_messages') || '[]');
    const updated = localSaved.filter(m => String(m.id) !== String(id));
    localStorage.setItem('ak_submitted_messages', JSON.stringify(updated));
  } catch (e) {}

  try {
    await apiFetch(`/api/messages/${id}`, { method: 'DELETE' });
  } catch (err) {}

  allMessagesData = allMessagesData.filter(m => String(m.id) !== String(id));
  renderMessagesList();
  updateMessagesCountBadge();
};

const initNotificationEmail = async () => {
  let activeMail = 'abikrishna15@gmail.com';

  try {
    const saved = localStorage.getItem('ak_notification_email');
    if (saved && saved.trim()) activeMail = saved.trim();
  } catch (e) {}

  try {
    const res = await apiFetch('/api/settings');
    if (res.ok) {
      const settings = await res.json();
      if (settings.notificationEmail && settings.notificationEmail.trim()) {
        activeMail = settings.notificationEmail.trim();
        try { localStorage.setItem('ak_notification_email', activeMail); } catch (e) {}
      }
    }
  } catch (err) {}

  currentNotificationEmail = activeMail;
  const targetInput = $('#target-notification-email');
  if (targetInput) targetInput.value = activeMail;
};

// -------------------------------------------------------------
// Persistent Tab & Subpanel State Manager (Restores on Page Refresh)
// -------------------------------------------------------------
const STORAGE_KEY_MAIN_TAB = 'ak_admin_active_tab';
const STORAGE_KEY_CONTENT_TYPE = 'ak_admin_content_type';
const STORAGE_KEY_CONFIG_SUBTAB = 'ak_admin_config_subtab';

function setActiveMainTab(tabId) {
  if (!tabId) return;
  const targetButton = document.querySelector(`.tab[data-tab="${tabId}"]`);
  const targetPanel = document.getElementById(tabId);
  if (targetButton && targetPanel) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    targetButton.classList.add('active');
    targetPanel.classList.add('active');
    if (tabId === 'messages' && typeof fetchMessages === 'function') {
      fetchMessages();
      initNotificationEmail();
    }
    try {
      localStorage.setItem(STORAGE_KEY_MAIN_TAB, tabId);
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${tabId}`);
      }
    } catch (e) {}
  }
}

function setActiveContentType(typeId) {
  if (!typeId) return;
  const targetBtn = document.querySelector(`.type-segment[data-type="${typeId}"]`);
  if (targetBtn && typeInput) {
    typeSegments.forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
    typeInput.value = typeId;
    refreshFields();
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT_TYPE, typeId);
    } catch (e) {}
  }
}

const configTabs = document.querySelectorAll('.config-tab');
const configSubpanels = document.querySelectorAll('.config-subpanel');

function setActiveConfigSubtab(subtabId) {
  if (!subtabId) return;
  const targetTab = document.querySelector(`.config-tab[data-subtab="${subtabId}"]`);
  const targetSubpanel = document.getElementById(`subpanel-${subtabId}`);
  if (targetTab && targetSubpanel) {
    configTabs.forEach(t => t.classList.remove('active'));
    configSubpanels.forEach(p => p.classList.remove('active'));
    targetTab.classList.add('active');
    targetSubpanel.classList.add('active');
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG_SUBTAB, subtabId);
    } catch (e) {}
  }
}

// Attach Tab Click Event Listeners
typeSegments.forEach(btn => {
  btn.onclick = () => setActiveContentType(btn.dataset.type);
});

configTabs.forEach(tab => {
  tab.onclick = () => setActiveConfigSubtab(tab.dataset.subtab);
});

document.querySelectorAll('.tab').forEach(button => {
  button.onclick = () => setActiveMainTab(button.dataset.tab);
});

// Restore Active Tabs from URL Hash or localStorage on Refresh
function restoreTabState() {
  // 1. Check Hash URL or localStorage for Main Tab
  let savedMainTab = window.location.hash ? window.location.hash.replace('#', '') : null;
  if (!savedMainTab || !['content', 'messages', 'testimonials', 'assets'].includes(savedMainTab)) {
    try {
      savedMainTab = localStorage.getItem(STORAGE_KEY_MAIN_TAB);
    } catch (e) {}
  }
  if (savedMainTab && ['content', 'messages', 'testimonials', 'assets'].includes(savedMainTab)) {
    setActiveMainTab(savedMainTab);
  }

  // 2. Restore Content Type Segment (Work / Playground / Journal)
  try {
    const savedType = localStorage.getItem(STORAGE_KEY_CONTENT_TYPE);
    if (savedType && ['work', 'playground', 'journal'].includes(savedType)) {
      setActiveContentType(savedType);
    }
  } catch (e) {}

  // 3. Restore Config Subtab
  try {
    const savedSubtab = localStorage.getItem(STORAGE_KEY_CONFIG_SUBTAB);
    if (savedSubtab && ['heroes', 'tools', 'topics', 'journal-topics', 'brands', 'achievements', 'resume', 'social', 'stats'].includes(savedSubtab)) {
      setActiveConfigSubtab(savedSubtab);
    }
  } catch (e) {}
}

// Immediately restore state on load
restoreTabState();

// =====================================================
// Form Inquiries & Notification Email Manager (Continued)
// =====================================================

const notifEmailForm = $('#notification-email-form');
if (notifEmailForm) {
  notifEmailForm.onsubmit = async (e) => {
    e.preventDefault();
    const newEmail = $('#target-notification-email').value.trim();
    if (!newEmail) return;

    currentNotificationEmail = newEmail;
    try {
      localStorage.setItem('ak_notification_email', newEmail);
    } catch (e) {}

    // Sync with assets contact email input field if present
    const contactEmailInput = $('#contact-email');
    if (contactEmailInput) contactEmailInput.value = newEmail;

    try {
      await apiFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationEmail: newEmail, email: newEmail })
      });
    } catch (err) {}

    const statusEl = $('#notification-email-status');
    if (statusEl) {
      statusEl.textContent = '✓ Notification email saved & persistent!';
      statusEl.style.display = 'block';
      setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
    }
    renderMessagesList();
  };
}

const refreshMsgsBtn = $('#refresh-messages-btn');
if (refreshMsgsBtn) {
  refreshMsgsBtn.onclick = () => {
    fetchMessages();
  };
}

initNotificationEmail();
fetchMessages();

// =====================================================
// Testimonials Studio Manager
// =====================================================
let allTestimonialsData = [];

const fetchTestimonials = async () => {
  try {
    const res = await apiFetch('/api/testimonials');
    if (res.ok) {
      allTestimonialsData = await res.json();
      renderTestimonialsList();
    }
  } catch (err) {
    console.error('Failed to fetch testimonials', err);
  }
};

const renderTestimonialsList = () => {
  const listEl = $('#testimonials-list');
  if (!listEl) return;
  if (!allTestimonialsData || !allTestimonialsData.length) {
    listEl.innerHTML = '<p class="help">No testimonials published yet.</p>';
    return;
  }
  listEl.innerHTML = allTestimonialsData.map(item => {
    const avatar = item.img ? `<img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:1px solid #ddd;flex-shrink:0;">` : `<div style="width:48px;height:48px;border-radius:50%;background:var(--accent,#ff4e1b);color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px;flex-shrink:0;">${escapeHtml((item.name || 'AK').slice(0, 2).toUpperCase())}</div>`;
    return `<article class="content-row">
      <div style="display:flex;gap:14px;align-items:center;overflow:hidden;">
        ${avatar}
        <div style="min-width:0;">
          <h3>${escapeHtml(item.name)}</h3>
          <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            <strong>${escapeHtml(item.role)}</strong><br>
            <span style="opacity:0.85;">"${escapeHtml(item.quote)}"</span>
          </p>
        </div>
      </div>
      <div class="actions" style="flex-shrink:0;">
        <button class="btn-edit" data-edit-testimonial="${item.id}">✏️ Edit</button>
        <button class="btn-remove" data-remove-testimonial="${item.id}">Remove</button>
      </div>
    </article>`;
  }).join('');

  // Attach event handlers
  listEl.querySelectorAll('[data-edit-testimonial]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      startEditingTestimonial(btn.dataset.editTestimonial);
    };
  });

  listEl.querySelectorAll('[data-remove-testimonial]').forEach(btn => {
    btn.onclick = async (e) => {
      e.preventDefault();
      if (!confirm('Are you sure you want to remove this testimonial?')) return;
      try {
        const res = await fetch(`/api/testimonials/${btn.dataset.removeTestimonial}`, { method: 'DELETE' });
        if (res.ok) {
          fetchTestimonials();
        }
      } catch (err) {
        alert('Could not remove testimonial.');
      }
    };
  });
};

const startEditingTestimonial = (id) => {
  const item = allTestimonialsData.find(t => String(t.id) === String(id));
  if (!item) return;
  $('#testimonial-editing-id').value = item.id;
  $('#testimonial-name').value = item.name || '';
  $('#testimonial-role').value = item.role || '';
  $('#testimonial-quote').value = item.quote || '';
  $('#testimonial-img-url').value = item.img || '';

  $('#testimonial-form-title').textContent = 'Edit Testimonial';
  $('#testimonial-form-subtitle').textContent = 'Modify client feedback and save changes live.';
  $('#testimonial-submit-btn').innerHTML = '💾 Save Changes <b>↗</b>';
  if ($('#testimonial-cancel-btn')) $('#testimonial-cancel-btn').style.display = 'inline-block';
  $('#testimonial-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const resetTestimonialForm = () => {
  $('#testimonial-editing-id').value = '';
  $('#testimonial-form-title').textContent = 'Add Client Testimonial';
  $('#testimonial-form-subtitle').textContent = 'Add client reviews & recommendations to showcase on your homepage.';
  $('#testimonial-submit-btn').innerHTML = 'Publish Testimonial <b>↗</b>';
  if ($('#testimonial-cancel-btn')) $('#testimonial-cancel-btn').style.display = 'none';
  $('#testimonial-form').reset();
};

if ($('#testimonial-cancel-btn')) {
  $('#testimonial-cancel-btn').onclick = resetTestimonialForm;
}

const testimonialForm = $('#testimonial-form');
if (testimonialForm) {
  testimonialForm.onsubmit = async (e) => {
    e.preventDefault();
    const status = $('#testimonial-status');
    status.textContent = 'Saving testimonial...';

    const editId = $('#testimonial-editing-id').value;
    let imgUrl = $('#testimonial-img-url').value || '';
    const fileElem = $('#testimonial-img-file');
    if (fileElem && fileElem.files && fileElem.files[0]) {
      try {
        imgUrl = await fileToUrl(fileElem.files[0]);
      } catch (err) {
        status.textContent = 'Failed to upload photo.';
        return;
      }
    }

    const payload = {
      id: editId || undefined,
      name: $('#testimonial-name').value.trim(),
      role: $('#testimonial-role').value.trim(),
      quote: $('#testimonial-quote').value.trim(),
      img: imgUrl
    };

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      status.textContent = '✦ Testimonial saved successfully!';
      resetTestimonialForm();
      fetchTestimonials();
      setTimeout(() => status.textContent = '', 3500);
    } catch (err) {
      status.textContent = 'Failed to save testimonial.';
    }
  };
}

fetchTestimonials();

// =====================================================
// Trusted Brands Studio Manager
// =====================================================
let allBrandsData = [];

const fetchBrands = async () => {
  try {
    const res = await apiFetch('/api/brands');
    if (res.ok) {
      allBrandsData = await res.json();
      renderBrandsAdminList();
    }
  } catch (err) {
    console.error('Failed to fetch brands', err);
  }
};

const renderBrandsAdminList = () => {
  const listEl = $('#brands-admin-list');
  if (!listEl) return;
  if (!allBrandsData || !allBrandsData.length) {
    listEl.innerHTML = '<p class="help">No brand logos added yet.</p>';
    return;
  }
  listEl.innerHTML = allBrandsData.map(item => {
    const initial = (item.name || '✦').trim().charAt(0).toUpperCase();
    const logoBadge = item.logo
      ? `<img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.name)}" style="max-height:24px;max-width:28px;object-fit:contain;">`
      : `<span style="font-weight:800;font-size:13px;color:var(--accent,#ff4e1b);">${escapeHtml(initial)}</span>`;
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#fff;border:1px solid #eee;border-radius:10px;">
      <div style="display:flex;align-items:center;gap:12px;min-width:0;">
        <div style="width:36px;height:36px;border-radius:8px;background:#f5f2ef;display:grid;place-items:center;padding:4px;flex-shrink:0;overflow:hidden;">${logoBadge}</div>
        <strong style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#1b1b1b;">${escapeHtml(item.name)}</strong>
      </div>
      <div class="actions" style="display:flex;gap:6px;flex-shrink:0;">
        <button class="btn-edit" data-edit-brand="${item.id}" style="padding:5px 10px;font-size:11px;">✏️ Edit</button>
        <button class="btn-remove-brand" data-remove-brand="${item.id}" style="padding:5px 12px;font-size:11px;border:1px solid #ff3b30;color:#ff3b30;background:#ffffff;border-radius:6px;font-weight:700;cursor:pointer;">Remove</button>
      </div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('[data-edit-brand]').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      startEditingBrand(btn.dataset.editBrand);
    };
  });

  listEl.querySelectorAll('[data-remove-brand]').forEach(btn => {
    btn.onclick = async e => {
      e.preventDefault();
      e.stopPropagation();
      const brandId = btn.dataset.removeBrand;
      if (!brandId) return;

      if (!confirm('Remove this brand logo?')) return;
      btn.textContent = 'Removing…';
      btn.disabled = true;

      try {
        const res = await fetch(`/api/brands/${brandId}`, { method: 'DELETE' });
        if (res.ok) {
          fetchBrands();
        } else {
          alert('Could not remove brand.');
          btn.textContent = 'Remove';
          btn.disabled = false;
        }
      } catch (err) {
        alert('Could not remove brand.');
        btn.textContent = 'Remove';
        btn.disabled = false;
      }
    };
  });
};

const startEditingBrand = id => {
  const item = allBrandsData.find(b => String(b.id) === String(id));
  if (!item) return;
  $('#brand-editing-id').value = item.id;
  $('#brand-name').value = item.name || '';
  $('#brand-logo-url').value = item.logo || '';
  $('#brand-submit-btn').innerHTML = '💾 Save Brand <b>↗</b>';
  if ($('#brand-cancel-btn')) $('#brand-cancel-btn').style.display = 'inline-block';
};

const resetBrandForm = () => {
  $('#brand-editing-id').value = '';
  $('#brand-name').value = '';
  $('#brand-logo-url').value = '';
  if ($('#brand-logo-file')) $('#brand-logo-file').value = '';
  $('#brand-submit-btn').innerHTML = 'Save Brand Logo <b>↗</b>';
  if ($('#brand-cancel-btn')) $('#brand-cancel-btn').style.display = 'none';
};

if ($('#brand-cancel-btn')) $('#brand-cancel-btn').onclick = resetBrandForm;

const brandSubmitBtn = $('#brand-submit-btn');
if (brandSubmitBtn) {
  brandSubmitBtn.onclick = async e => {
    e.preventDefault();
    const status = $('#brand-status');
    const nameVal = $('#brand-name').value.trim();
    if (!nameVal) {
      status.textContent = 'Company / Brand Name is required.';
      return;
    }
    status.textContent = 'Saving brand logo...';

    const editId = $('#brand-editing-id').value;
    let logoUrl = $('#brand-logo-url').value || '';
    const fileElem = $('#brand-logo-file');
    if (fileElem && fileElem.files && fileElem.files[0]) {
      try {
        logoUrl = await fileToUrl(fileElem.files[0]);
      } catch (err) {
        status.textContent = 'Failed to upload logo file.';
        return;
      }
    }

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId || undefined, name: nameVal, logo: logoUrl })
      });
      if (!res.ok) throw new Error();
      status.textContent = '✦ Brand logo saved!';
      resetBrandForm();
      fetchBrands();
      setTimeout(() => status.textContent = '', 3500);
    } catch (err) {
      status.textContent = 'Failed to save brand.';
    }
  };
}

fetchBrands();
refreshFields();
load();
loadSettings();

// -------------------------------------------------------------
// Milestone Studio Manager (About Page Stage & Launches)
// -------------------------------------------------------------
let allMilestonesData = [];

const fetchMilestones = async () => {
  try {
    const res = await apiFetch('/api/milestones');
    if (res.ok) {
      let items = await res.json();
      const savedOrder = getSavedMilestonesOrder();
      if (savedOrder && Array.isArray(savedOrder) && savedOrder.length) {
        const orderMap = new Map(savedOrder.map((item, idx) => [String(item.id), idx]));
        items.sort((a, b) => {
          const idxA = orderMap.has(String(a.id)) ? orderMap.get(String(a.id)) : 999;
          const idxB = orderMap.has(String(b.id)) ? orderMap.get(String(b.id)) : 999;
          return idxA - idxB;
        });
      }
      allMilestonesData = items;
      renderMilestonesList();
    }
  } catch (err) {}
};

const renderMilestonesList = () => {
  const container = $('#milestones-admin-list');
  if (!container) return;

  if (!allMilestonesData.length) {
    container.innerHTML = '<p style="color:#74716e;font-size:13px;padding:16px;">No stage milestones published yet. Use the form above to add your first stage presentation or launch!</p>';
    return;
  }

  container.innerHTML = allMilestonesData.map((m, idx) => {
    const imgThumb = m.image ? `<img src="${escapeHtml(m.image)}" alt="Thumb" style="width:64px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid #e7e2dc;" />` : '';
    const isFirst = idx === 0;
    const isLast = idx === allMilestonesData.length - 1;

    return `
      <div style="padding:16px 20px;background:#ffffff;border:1px solid #e7e2dc;border-radius:16px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 2px 8px rgba(0,0,0,0.02);">
        <div style="display:flex;align-items:center;gap:14px;min-width:0;">
          <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:800;color:var(--accent,#ff4e1b);">${String(idx+1).padStart(2,'0')}</span>
          ${imgThumb}
          <div style="min-width:0;">
            <strong style="display:block;font-size:14.5px;color:#121211;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(m.title)}</strong>
            <small style="color:#74716e;font-size:11.5px;display:block;margin-top:2px;">${escapeHtml(m.category)} · ${escapeHtml(m.year)}</small>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
          <button type="button" data-move-ms-up="${idx}" ${isFirst ? 'disabled' : ''} style="padding:7px 12px;border:1px solid #dfddda;background:${isFirst ? '#f5f5f5' : '#ffffff'};color:${isFirst ? '#aaa' : '#121211'};border-radius:99px;font-size:11.5px;font-weight:700;cursor:${isFirst ? 'default' : 'pointer'};">↑ Up</button>
          <button type="button" data-move-ms-down="${idx}" ${isLast ? 'disabled' : ''} style="padding:7px 12px;border:1px solid #dfddda;background:${isLast ? '#f5f5f5' : '#ffffff'};color:${isLast ? '#aaa' : '#121211'};border-radius:99px;font-size:11.5px;font-weight:700;cursor:${isLast ? 'default' : 'pointer'};">↓ Down</button>
          ${m.url ? `<a href="${escapeHtml(m.url)}" target="_blank" style="padding:7px 14px;border:1px solid #e7e2dc;background:#fcfbf9;color:#121211;border-radius:99px;font-size:11.5px;font-weight:700;text-decoration:none;">View ↗</a>` : ''}
          <button type="button" data-edit-ms="${m.id}" style="padding:7px 16px;border:1px solid #dfddda;background:#ffffff;color:#121211;border-radius:99px;font-size:11.5px;font-weight:700;cursor:pointer;">✏️ Edit</button>
          <button type="button" data-remove-ms="${m.id}" style="padding:7px 16px;border:1px solid #ff3b30;color:#ff3b30;background:#ffffff;border-radius:99px;font-size:11.5px;font-weight:700;cursor:pointer;">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');

  const moveMilestone = async (fromIdx, toIdx) => {
    if (fromIdx < 0 || fromIdx >= allMilestonesData.length) return;
    if (toIdx < 0 || toIdx >= allMilestonesData.length) return;

    const temp = allMilestonesData[fromIdx];
    allMilestonesData[fromIdx] = allMilestonesData[toIdx];
    allMilestonesData[toIdx] = temp;

    setSavedMilestonesOrder(allMilestonesData);
    renderMilestonesList();

    try {
      const res = await fetch('/api/milestones/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allMilestonesData)
      });
      if (res.ok) {
        const updated = await res.json();
        if (Array.isArray(updated) && updated.length) {
          allMilestonesData = updated;
          setSavedMilestonesOrder(allMilestonesData);
          renderMilestonesList();
        }
      }
    } catch (err) {
      console.error('Failed to reorder milestones:', err);
    }
  };

  container.querySelectorAll('[data-move-ms-up]').forEach(btn => {
    btn.onclick = e => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const idx = parseInt(btn.dataset.moveMsUp, 10);
      if (!isNaN(idx) && idx > 0) moveMilestone(idx, idx - 1);
    };
  });

  container.querySelectorAll('[data-move-ms-down]').forEach(btn => {
    btn.onclick = e => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const idx = parseInt(btn.dataset.moveMsDown, 10);
      if (!isNaN(idx) && idx < allMilestonesData.length - 1) moveMilestone(idx, idx + 1);
    };
  });

  container.querySelectorAll('[data-edit-ms]').forEach(btn => {
    btn.onclick = () => {
      const item = allMilestonesData.find(m => String(m.id) === String(btn.dataset.editMs));
      if (!item) return;
      $('#ms-id-input').value = item.id;
      $('#ms-category-input').value = item.category || '';
      $('#ms-year-input').value = item.year || '';
      $('#ms-title-input').value = item.title || '';
      $('#ms-summary-input').value = item.summary || '';
      $('#ms-spec1-val').value = item.spec1Value || '';
      $('#ms-spec2-val').value = item.spec2Value || '';
      $('#ms-spec3-val').value = item.spec3Value || '';
      $('#ms-btn-text').value = item.buttonText || '';
      $('#ms-btn-url').value = item.url || '';
      $('#ms-img-url').value = item.image || '';
      $('#save-milestone-btn').textContent = '💾 Update Stage Milestone';
      $('#ms-title-input').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  });

  container.querySelectorAll('[data-remove-ms]').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Are you sure you want to delete this stage milestone?')) return;
      try {
        const res = await fetch(`/api/milestones/${btn.dataset.removeMs}`, { method: 'DELETE' });
        if (res.ok) fetchMilestones();
      } catch (err) {
        alert('Could not delete milestone.');
      }
    };
  });
};

const saveMilestoneBtn = $('#save-milestone-btn');
if (saveMilestoneBtn) {
  saveMilestoneBtn.onclick = async e => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const titleVal = $('#ms-title-input').value.trim();
    if (!titleVal) {
      alert('Milestone Title is required.');
      return;
    }

    let imageUrl = $('#ms-img-url').value.trim();
    const fileElem = $('#ms-img-file');
    if (fileElem && fileElem.files && fileElem.files[0]) {
      try {
        imageUrl = await fileToUrl(fileElem.files[0]);
      } catch (err) {
        alert('Failed to upload image file.');
        return;
      }
    }

    const payload = {
      id: $('#ms-id-input').value || undefined,
      title: titleVal,
      category: $('#ms-category-input').value.trim() || '🎤 STAGE KEYNOTE PRESENTATION',
      year: $('#ms-year-input').value.trim() || '2025',
      summary: $('#ms-summary-input').value.trim(),
      spec1Label: '🎤 AUDIENCE',
      spec1Value: $('#ms-spec1-val').value.trim(),
      spec2Label: '🚀 DEMO',
      spec2Value: $('#ms-spec2-val').value.trim(),
      spec3Label: '📱 PLATFORM',
      spec3Value: $('#ms-spec3-val').value.trim(),
      buttonText: $('#ms-btn-text').value.trim() || 'Watch Keynote Deck',
      url: $('#ms-btn-url').value.trim() || '#',
      image: imageUrl || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=95'
    };

    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('✦ Stage milestone saved!');
        $('#ms-id-input').value = '';
        $('#ms-category-input').value = '';
        $('#ms-year-input').value = '';
        $('#ms-title-input').value = '';
        $('#ms-summary-input').value = '';
        $('#ms-spec1-val').value = '';
        $('#ms-spec2-val').value = '';
        $('#ms-spec3-val').value = '';
        $('#ms-btn-text').value = '';
        $('#ms-btn-url').value = '';
        $('#ms-img-url').value = '';
        if ($('#ms-img-file')) $('#ms-img-file').value = '';
        $('#save-milestone-btn').textContent = '✨ Save Stage Milestone';
        fetchMilestones();
      }
    } catch (err) {
      alert('Failed to save stage milestone.');
    }
  };
}

fetchMilestones();

// =====================================================
// =====================================================
// Toolkit & Tools Studio Manager (About Page Section 7)
// =====================================================
const STORAGE_KEY_TOOLS = 'ak_portfolio_tools';
const STORAGE_KEY_TOOLS_INIT = 'ak_portfolio_tools_initialized';
let allToolsData = [];

const defaultAdminToolsList = [
  { id: 't1', name: 'Figma', category: 'UI/UX · Prototyping | Design Systems', icon_type: 'figma', display_order: 1 },
  { id: 't2', name: 'FigJam', category: 'Workshops · User Flows | Mapping', icon_type: 'figjam', display_order: 2 },
  { id: 't3', name: 'Adobe Photoshop', category: 'Visual Design · | Image Editing', icon_type: 'photoshop', display_order: 3 },
  { id: 't4', name: 'Adobe Illustrator', category: 'Branding · Illustration | Graphics', icon_type: 'illustrator', display_order: 4 },
  { id: 't5', name: 'Adobe After Effects', category: 'Motion · Visual | Content', icon_type: 'aftereffects', display_order: 5 },
  { id: 't6', name: 'Framer', category: 'Web Design · | Prototyping', icon_type: 'framer', display_order: 6 },
  { id: 't7', name: 'Notion', category: 'Documentation · | Planning', icon_type: 'notion', display_order: 7 },
  { id: 't8', name: 'AI Tools', category: 'Ideation · Content | Visual Exploration', icon_type: 'aitools', display_order: 8 }
];

const saveToolsToStorage = (tools) => {
  try {
    localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(tools));
    localStorage.setItem(STORAGE_KEY_TOOLS_INIT, 'true');
  } catch (e) {}
};

const loadToolsFromStorage = () => {
  try {
    const isInit = localStorage.getItem(STORAGE_KEY_TOOLS_INIT) === 'true';
    const raw = localStorage.getItem(STORAGE_KEY_TOOLS);
    if (isInit && raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return null;
};

async function syncToolToBackend(tool, isDelete = false) {
  // 1. Try local server API endpoints
  for (const base of API_BASE_URLS) {
    try {
      const url = base ? `${base}/api/tools${isDelete ? `/${encodeURIComponent(tool.id)}` : ''}` : `/api/tools${isDelete ? `/${encodeURIComponent(tool.id)}` : ''}`;
      const res = await fetch(url, {
        method: isDelete ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isDelete ? undefined : JSON.stringify(tool)
      });
      if (res.ok) return true;
    } catch (e) {}
  }

  // 2. Try Supabase REST API directly if configured
  if (window.ABIKRISHNA_SUPABASE && window.ABIKRISHNA_SUPABASE.url) {
    try {
      const { url: sbUrl, anonKey } = window.ABIKRISHNA_SUPABASE;
      if (isDelete) {
        await fetch(`${sbUrl}/rest/v1/portfolio_tools?id=eq.${encodeURIComponent(tool.id)}`, {
          method: 'DELETE',
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
        });
      } else {
        await fetch(`${sbUrl}/rest/v1/portfolio_tools`, {
          method: 'POST',
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: tool.id,
            name: tool.name,
            category: tool.category || '',
            icon_type: tool.icon_type || 'figma',
            custom_icon_url: tool.custom_icon_url || '',
            display_order: tool.display_order || 0
          })
        });
      }
    } catch (e) {}
  }
}

const showToolNotification = (msg, isError = false) => {
  const statusEl = $('#tool-save-status');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
    statusEl.style.background = isError ? '#ffebeb' : '#eefbf3';
    statusEl.style.color = isError ? '#d32f2f' : '#0d7f44';
    statusEl.style.borderColor = isError ? '#f5c6cb' : '#b7ebd0';
    setTimeout(() => {
      if (statusEl) statusEl.style.display = 'none';
    }, 3500);
  }
};

const getAdminToolBadgeHtml = (iconType, customUrl, name) => {
  try {
    const type = (iconType || 'figma').toLowerCase();
    const safeCustomUrl = typeof cleanImgUrl === 'function' ? cleanImgUrl(customUrl) : String(customUrl || '').trim();
    if (type === 'custom-image' || (safeCustomUrl && safeCustomUrl.length > 0)) {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#ffffff;border:1px solid #ece5dd;overflow:hidden;display:grid;place-items:center;flex-shrink:0;"><img src="${escapeHtml(safeCustomUrl)}" alt="${escapeHtml(name)}" style="width:24px;height:24px;object-fit:contain;" onerror="this.style.display='none'" /></div>`;
    }
    if (type === 'figma') {
      return `<div class="tool-app-badge badge-figma" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#1e1e1e;">
        <svg width="18" height="26" viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
      </div>`;
    }
    if (type === 'figjam') {
      return `<div class="tool-app-badge badge-figjam" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:linear-gradient(135deg,#8a3ffc 0%,#6929c4 100%);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19 7-7 3 3-7 7-3-3z"/>
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18"/>
          <path d="m2 2 7.586 7.586"/>
        </svg>
      </div>`;
    }
    if (type === 'photoshop') {
      return `<div class="tool-app-badge badge-photoshop" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#001e36;"><span style="color:#31a8ff;font-weight:900;font-size:16px;">Ps</span></div>`;
    }
    if (type === 'illustrator') {
      return `<div class="tool-app-badge badge-illustrator" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#330000;"><span style="color:#ff9a00;font-weight:900;font-size:16px;">Ai</span></div>`;
    }
    if (type === 'aftereffects') {
      return `<div class="tool-app-badge badge-aftereffects" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#00005b;"><span style="color:#9999ff;font-weight:900;font-size:16px;">Ae</span></div>`;
    }
    if (type === 'framer') {
      return `<div class="tool-app-badge badge-framer" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#000000;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
        </svg>
      </div>`;
    }
    if (type === 'notion') {
      return `<div class="tool-app-badge badge-notion" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#ffffff;border:1.5px solid #ece5dd;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.459-.699c1.073-.093 1.353-.466 1.026-1.166L17.75 1.55C17.377.944 16.724.711 15.65.757L2.454 1.737C1.474 1.83 1.147 2.296 1.474 3.042l2.985 1.166zm1.306 3.172v13.62c0 .933.56 1.306 1.586 1.213l13.71-.84c1.026-.093 1.353-.653 1.353-1.586V6.167c0-.933-.466-1.306-1.4-1.213l-13.85.84c-.933.093-1.399.653-1.399 1.586zm11.365.886c.093.513 0 1.026-.513 1.073l-.933.093v8.583c-.606.373-1.166.56-1.633.56-.746 0-1.026-.233-1.54-.886l-4.29-6.389v6.11c.56.093 1.026.233 1.026.746 0 .513-.42.56-.98.606l-2.844.187c-.093-.513.047-1.026.56-1.073l.886-.093V9.293c-.466-.093-.933-.14-1.306-.14-.513 0-.606-.233-.606-.606 0-.466.327-.56.886-.606l3.03-.187 4.572 6.808v-5.69c-.466-.093-.933-.14-1.306-.14-.513 0-.606-.233-.606-.606 0-.466.327-.56.886-.606l2.844-.187c.093.513 0 .98-.187 1.026z"/>
        </svg>
      </div>`;
    }
    if (type === 'aitools') {
      return `<div class="tool-app-badge badge-aitools" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;background:#ffffff;border:1.5px solid #ffe6da;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.39 8.26L21 9.27L16.2 13.97L17.34 20.73L12 17.27L6.66 20.73L7.8 13.97L3 9.27L9.61 8.26L12 2Z" fill="url(#ai-star-grad-adm)"/>
          <defs>
            <linearGradient id="ai-star-grad-adm" x1="3" y1="2" x2="21" y2="20.73" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF7A00"/>
              <stop offset="1" stop-color="#FF381E"/>
            </linearGradient>
          </defs>
        </svg>
      </div>`;
    }
    if (type === 'spline') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#0e1117;border:1px solid #232733;color:#00f5d4;font-family:'DM Mono',monospace;font-weight:900;font-size:14px;display:grid;place-items:center;flex-shrink:0;">Sp</div>`;
    }
    if (type === 'rive') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#ff5a5f,#ff2a54);color:#fff;font-weight:900;font-size:16px;display:grid;place-items:center;flex-shrink:0;">R</div>`;
    }
    if (type === 'blender') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#ea7600;color:#fff;font-weight:900;font-size:15px;display:grid;place-items:center;flex-shrink:0;">Bl</div>`;
    }
    if (type === 'webflow') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#146ef5;color:#fff;font-weight:900;font-size:16px;display:grid;place-items:center;flex-shrink:0;">W</div>`;
    }
    if (type === 'vscode') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#0065a9;color:#fff;font-family:'DM Mono',monospace;font-weight:900;font-size:13px;display:grid;place-items:center;flex-shrink:0;">VS</div>`;
    }
    if (type === 'github') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#181717;color:#fff;font-weight:900;font-size:14px;display:grid;place-items:center;flex-shrink:0;">Gh</div>`;
    }
    if (type === 'linear') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#5e6ad2;color:#fff;font-weight:900;font-size:15px;display:grid;place-items:center;flex-shrink:0;">L</div>`;
    }
    if (type === 'miro') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#ffd02f;color:#050038;font-weight:900;font-size:16px;display:grid;place-items:center;flex-shrink:0;">M</div>`;
    }
    if (type === 'sketch') {
      return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#fdb300;color:#fff;font-weight:900;font-size:16px;display:grid;place-items:center;flex-shrink:0;">◆</div>`;
    }
    return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#fff5f0;border:1px solid #ffe6da;color:var(--accent,#ff4e1b);font-weight:800;font-size:14px;display:grid;place-items:center;flex-shrink:0;">${escapeHtml((name || 'T').slice(0,2).toUpperCase())}</div>`;
  } catch (err) {
    return `<div class="tool-app-badge" style="width:40px;height:40px;border-radius:10px;background:#fff5f0;border:1px solid #ffe6da;color:var(--accent,#ff4e1b);font-weight:800;font-size:14px;display:grid;place-items:center;flex-shrink:0;">${escapeHtml((name || 'T').slice(0,2).toUpperCase())}</div>`;
  }
};

const fetchTools = async () => {
  // 1. If user has already saved or customized tools in localStorage, use that state permanently!
  const localSaved = loadToolsFromStorage();
  if (localSaved !== null) {
    allToolsData = localSaved;
    renderToolsList();
    return;
  }

  // 2. First-time initialization only: Try API / Supabase
  try {
    const res = await apiFetch('/api/tools');
    if (res.ok) {
      const remoteData = await res.json();
      if (Array.isArray(remoteData) && remoteData.length) {
        allToolsData = remoteData;
        saveToolsToStorage(allToolsData);
        renderToolsList();
        return;
      }
    }
  } catch (err) {}

  // 3. Fallback to default initial list on first launch
  allToolsData = [...defaultAdminToolsList];
  saveToolsToStorage(allToolsData);
  renderToolsList();
};

const renderToolsList = () => {
  const container = $('#tools-admin-list');
  const countNum = $('#tools-count-num');
  if (countNum) countNum.textContent = String(allToolsData.length);
  if (!container) return;

  if (!allToolsData.length) {
    container.innerHTML = '<p style="color:#74716e;font-size:13px;padding:16px;grid-column:1/-1;">No tools in your toolkit yet. Use the form above to add your first tool!</p>';
    return;
  }

  container.innerHTML = allToolsData.map((tool, idx) => {
    try {
      const rawCat = tool.category || '';
      const lines = rawCat.split(/[\n|]/).map(l => l.trim()).filter(Boolean);
      const subtext = lines.join(' · ') || 'Toolkit App';
      const badgeHtml = getAdminToolBadgeHtml(tool.icon_type || tool.iconType, tool.custom_icon_url || tool.customIconUrl, tool.name);

      return `
        <div style="background:#ffffff;border:1px solid #ebe5df;border-radius:16px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
          <div style="display:flex;align-items:center;gap:12px;">
            ${badgeHtml}
            <div style="min-width:0;flex:1;">
              <strong style="display:block;font-size:14.5px;color:#121211;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(tool.name)}</strong>
              <small style="color:#74716e;font-size:11.5px;display:block;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(subtext)}</small>
            </div>
          </div>

          <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:10px;border-top:1px solid #f2ede8;">
            <button type="button" data-edit-tool="${escapeHtml(tool.id)}" style="padding:6px 14px;border:1px solid #dfddda;background:#ffffff;color:#121211;border-radius:99px;font-size:11.5px;font-weight:700;cursor:pointer;">✏️ Edit</button>
            <button type="button" data-remove-tool="${escapeHtml(tool.id)}" style="padding:6px 14px;border:1px solid #ff3b30;color:#ff3b30;background:#ffffff;border-radius:99px;font-size:11.5px;font-weight:700;cursor:pointer;">🗑️ Delete</button>
          </div>
        </div>
      `;
    } catch (err) {
      return '';
    }
  }).join('');

  // Wire Edit Handlers
  container.querySelectorAll('[data-edit-tool]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const toolId = btn.dataset.editTool;
      const tool = allToolsData.find(t => String(t.id) === String(toolId));
      if (!tool) return;

      $('#tool-id-input').value = tool.id;
      $('#tool-name-input').value = tool.name || '';
      $('#tool-category-input').value = tool.category || '';
      const iconSelect = $('#tool-icon-select');
      if (iconSelect) {
        iconSelect.value = tool.icon_type || tool.iconType || 'figma';
        const customWrap = $('#tool-custom-img-wrap');
        if (customWrap) {
          customWrap.style.display = (iconSelect.value === 'custom-image') ? 'block' : 'none';
        }
      }
      $('#tool-custom-url').value = tool.custom_icon_url || tool.customIconUrl || '';
      $('#tool-form-title').textContent = `✏️ Edit Tool: ${tool.name}`;
      $('#save-tool-btn').textContent = '💾 Update Tool';
      const cancelBtn = $('#cancel-tool-edit-btn');
      if (cancelBtn) cancelBtn.style.display = 'inline-block';
      $('#tool-name-input').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  });

  // Wire Remove Handlers
  container.querySelectorAll('[data-remove-tool]').forEach(btn => {
    btn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const toolId = btn.dataset.removeTool;
      if (!confirm('Are you sure you want to remove this tool from your toolkit?')) return;

      // Immediately remove from local state & storage
      allToolsData = allToolsData.filter(t => String(t.id) !== String(toolId));
      saveToolsToStorage(allToolsData);
      renderToolsList();
      showToolNotification('🗑️ Tool removed from toolkit');

      // Background sync
      syncToolToBackend({ id: toolId }, true);
    };
  });
};

// Toggle Custom Image section when dropdown changes
const toolIconSelect = $('#tool-icon-select');
if (toolIconSelect) {
  toolIconSelect.onchange = () => {
    const customWrap = $('#tool-custom-img-wrap');
    if (customWrap) {
      customWrap.style.display = (toolIconSelect.value === 'custom-image') ? 'block' : 'none';
    }
  };
}

// Reset Tool Form Helper
const resetToolForm = () => {
  $('#tool-id-input').value = '';
  $('#tool-name-input').value = '';
  $('#tool-category-input').value = '';
  $('#tool-custom-url').value = '';
  if ($('#tool-custom-file')) $('#tool-custom-file').value = '';
  if ($('#tool-icon-select')) $('#tool-icon-select').value = 'figma';
  const customWrap = $('#tool-custom-img-wrap');
  if (customWrap) customWrap.style.display = 'none';
  $('#tool-form-title').textContent = 'Add / Edit Tool';
  $('#save-tool-btn').textContent = '✨ Save Tool to Toolkit';
  const cancelBtn = $('#cancel-tool-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';
};

const cancelToolEditBtn = $('#cancel-tool-edit-btn');
if (cancelToolEditBtn) {
  cancelToolEditBtn.onclick = resetToolForm;
}

const saveToolBtn = $('#save-tool-btn');
if (saveToolBtn) {
  saveToolBtn.onclick = async e => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const nameVal = $('#tool-name-input').value.trim();
    if (!nameVal) {
      showToolNotification('Tool Name is required.', true);
      return;
    }

    let customUrl = $('#tool-custom-url').value.trim();
    const fileElem = $('#tool-custom-file');
    if (fileElem && fileElem.files && fileElem.files[0]) {
      try {
        customUrl = await fileToUrl(fileElem.files[0]);
      } catch (err) {
        showToolNotification('Failed to process image file.', true);
        return;
      }
    }

    const editId = $('#tool-id-input').value;
    const isEdit = Boolean(editId);
    const toolId = editId || `tool-${Date.now()}`;

    const payload = {
      id: toolId,
      name: nameVal,
      category: $('#tool-category-input').value.trim() || '',
      icon_type: $('#tool-icon-select').value || 'figma',
      custom_icon_url: customUrl,
      display_order: isEdit ? (allToolsData.find(t => String(t.id) === String(toolId))?.display_order || 1) : (allToolsData.length + 1)
    };

    // 1. Instantly update memory & localStorage
    if (isEdit) {
      const idx = allToolsData.findIndex(t => String(t.id) === String(toolId));
      if (idx !== -1) allToolsData[idx] = { ...allToolsData[idx], ...payload };
      else allToolsData.push(payload);
    } else {
      allToolsData.push(payload);
    }

    saveToolsToStorage(allToolsData);
    renderToolsList();
    resetToolForm();

    // 2. Perform backend & Supabase sync in background
    syncToolToBackend(payload, false);

    // 3. User feedback inline notification
    const statusMsg = isEdit ? '✓ Tool updated successfully!' : '✓ New tool added to Toolkit!';
    showToolNotification(statusMsg);
  };
}

fetchTools();

// -------------------------------------------------------------
// Mobile Sidebar Drawer Controller
// -------------------------------------------------------------
const sidebarToggleBtn = $('#admin-sidebar-toggle');
const adminSidebar = $('#admin-sidebar') || $('aside');
const sidebarBackdrop = $('#sidebar-backdrop');

if (sidebarToggleBtn && adminSidebar) {
  const toggleSidebar = () => {
    adminSidebar.classList.toggle('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active');
    document.body.classList.toggle('sidebar-drawer-open');
  };

  sidebarToggleBtn.onclick = (e) => {
    e.preventDefault();
    toggleSidebar();
  };

  if (sidebarBackdrop) {
    sidebarBackdrop.onclick = () => {
      adminSidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('active');
      document.body.classList.remove('sidebar-drawer-open');
    };
  }

  // Close drawer when tab buttons are clicked on mobile
  document.querySelectorAll('aside nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        adminSidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        document.body.classList.remove('sidebar-drawer-open');
      }
    });
  });
}

// -------------------------------------------------------------
// Playground Filter Topics Studio Controller
// -------------------------------------------------------------
function renderPlaygroundTopicsUI() {
  const topics = categories.playground || defaultPlaygroundTopics;

  // 1. Content Manager Inline Chips
  const chipsContainer = $('#content-pg-topics-chips');
  if (chipsContainer) {
    chipsContainer.innerHTML = topics.map((t, idx) => `
      <span class="topic-chip">
        ${escapeHtml(t)}
        <button type="button" class="topic-chip-del" onclick="removePlaygroundTopic(${idx})" title="Remove topic ${escapeHtml(t)}">✕</button>
      </span>
    `).join('');
  }

  // 2. Assets Config Subpanel Grid & Count
  const countEl = $('#pg-topics-count');
  if (countEl) countEl.textContent = topics.length;

  const assetsList = $('#assets-pg-topics-list');
  if (assetsList) {
    assetsList.innerHTML = topics.map((t, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const isFirst = idx === 0;
      const isLast = idx === topics.length - 1;
      return `
        <div class="admin-topic-row">
          <div class="admin-topic-left">
            <span class="admin-topic-order">${num}</span>
            <strong class="admin-topic-name">${escapeHtml(t)}</strong>
            <span class="admin-topic-pill-preview">Filter Pill</span>
          </div>
          <div class="admin-topic-actions">
            <button type="button" class="topic-icon-btn" onclick="movePlaygroundTopic(${idx}, -1)" ${isFirst ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''} title="Move Up">↑</button>
            <button type="button" class="topic-icon-btn" onclick="movePlaygroundTopic(${idx}, 1)" ${isLast ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''} title="Move Down">↓</button>
            <button type="button" class="topic-icon-btn danger" onclick="removePlaygroundTopic(${idx})" title="Delete Topic">🗑</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Category Select Dropdown (if playground is currently selected)
  if (typeInput && typeInput.value === 'playground' && category) {
    const currentVal = category.value;
    category.innerHTML = topics.map(val => `<option value="${escapeHtml(val)}">${escapeHtml(val)}</option>`).join('');
    if (currentVal && topics.includes(currentVal)) {
      category.value = currentVal;
    }
  }
}

async function savePlaygroundTopics() {
  try {
    let currentSettings = {};
    try {
      const res = await apiFetch('/api/settings');
      if (res.ok) currentSettings = await res.json();
    } catch (e) {}

    const payload = {
      ...currentSettings,
      playgroundTopics: categories.playground
    };

    const res = await apiFetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      try {
        localStorage.setItem('ak_portfolio_settings', JSON.stringify(payload));
      } catch (e) {}
    }
  } catch (err) {
    console.error('Failed saving playground topics:', err);
  }
}

function showTopicStatus(msg, isError = false) {
  const el = $('#pg-topic-status-msg');
  if (el) {
    el.textContent = msg;
    el.style.color = isError ? '#d32f2f' : '#2e7d32';
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 3500);
  }
}

window.addPlaygroundTopic = async function(topicName) {
  const name = (topicName || '').trim();
  if (!name) return;
  if (categories.playground.some(t => t.toLowerCase() === name.toLowerCase())) {
    showTopicStatus(`Topic "${name}" already exists.`, true);
    return;
  }
  categories.playground.push(name);
  renderPlaygroundTopicsUI();
  await savePlaygroundTopics();
  showTopicStatus(`Topic "${name}" added successfully!`);
};

window.removePlaygroundTopic = async function(indexOrName) {
  let name = '';
  if (typeof indexOrName === 'number') {
    name = categories.playground[indexOrName];
    categories.playground.splice(indexOrName, 1);
  } else {
    name = indexOrName;
    categories.playground = categories.playground.filter(t => t !== indexOrName);
  }
  if (!categories.playground.length) {
    categories.playground = [...defaultPlaygroundTopics];
  }
  renderPlaygroundTopicsUI();
  await savePlaygroundTopics();
  showTopicStatus(`Topic "${name || ''}" removed.`);
};

window.movePlaygroundTopic = async function(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= categories.playground.length) return;
  const temp = categories.playground[index];
  categories.playground[index] = categories.playground[newIndex];
  categories.playground[newIndex] = temp;
  renderPlaygroundTopicsUI();
  await savePlaygroundTopics();
};

window.resetPlaygroundTopics = async function() {
  if (confirm('Reset Playground filter topics to default topics?')) {
    categories.playground = [...defaultPlaygroundTopics];
    renderPlaygroundTopicsUI();
    await savePlaygroundTopics();
    showTopicStatus('Topics reset to defaults.');
  }
};

// Wire inline topic manager toggle in Content Manager
const pgTopicToggleBtn = $('#toggle-pg-topic-manager-btn');
const pgInlineTopicsBox = $('#playground-inline-topics-box');
if (pgTopicToggleBtn && pgInlineTopicsBox) {
  pgTopicToggleBtn.onclick = () => {
    const isHidden = pgInlineTopicsBox.style.display === 'none' || !pgInlineTopicsBox.style.display;
    pgInlineTopicsBox.style.display = isHidden ? 'block' : 'none';
    pgTopicToggleBtn.textContent = isHidden ? '✕ Close Manager' : '⚙️ Manage Topics';
  };
}

// Wire Add Topic from Content Manager
const contentAddTopicBtn = $('#content-add-pg-topic-btn');
const contentTopicInput = $('#content-new-pg-topic');
if (contentAddTopicBtn && contentTopicInput) {
  const handleContentAdd = async () => {
    const val = contentTopicInput.value.trim();
    if (val) {
      await window.addPlaygroundTopic(val);
      contentTopicInput.value = '';
    }
  };
  contentAddTopicBtn.onclick = handleContentAdd;
  contentTopicInput.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); handleContentAdd(); } };
}

// Wire Add Topic from Assets Config Subpanel
const assetsAddTopicBtn = $('#assets-add-pg-topic-btn');
const assetsTopicInput = $('#assets-new-pg-topic');
if (assetsAddTopicBtn && assetsTopicInput) {
  const handleAssetsAdd = async () => {
    const val = assetsTopicInput.value.trim();
    if (val) {
      await window.addPlaygroundTopic(val);
      assetsTopicInput.value = '';
    }
  };
  assetsAddTopicBtn.onclick = handleAssetsAdd;
  assetsTopicInput.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); handleAssetsAdd(); } };
}

// Wire Reset button
const pgResetBtn = $('#pg-topics-reset-btn');
if (pgResetBtn) {
  pgResetBtn.onclick = () => window.resetPlaygroundTopics();
}

// Initial render of topics UI
renderPlaygroundTopicsUI();

// -------------------------------------------------------------
// Journal Filter Topics Studio Controller
// -------------------------------------------------------------
function renderJournalTopicsUI() {
  const topics = categories.journal || defaultJournalTopics;

  // 1. Content Manager Inline Chips
  const chipsContainer = $('#content-journal-topics-chips');
  if (chipsContainer) {
    chipsContainer.innerHTML = topics.map((t, idx) => `
      <span class="topic-chip">
        ${escapeHtml(t)}
        <button type="button" class="topic-chip-del" onclick="removeJournalTopic(${idx})" title="Remove topic ${escapeHtml(t)}">✕</button>
      </span>
    `).join('');
  }

  // 2. Assets Config Subpanel Grid & Count
  const countEl = $('#journal-topics-count');
  if (countEl) countEl.textContent = topics.length;

  const assetsList = $('#assets-journal-topics-list');
  if (assetsList) {
    assetsList.innerHTML = topics.map((t, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const isFirst = idx === 0;
      const isLast = idx === topics.length - 1;
      return `
        <div class="admin-topic-row">
          <div class="admin-topic-left">
            <span class="admin-topic-order">${num}</span>
            <strong class="admin-topic-name">${escapeHtml(t)}</strong>
            <span class="admin-topic-pill-preview">Filter Pill</span>
          </div>
          <div class="admin-topic-actions">
            <button type="button" class="topic-icon-btn" onclick="moveJournalTopic(${idx}, -1)" ${isFirst ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''} title="Move Up">↑</button>
            <button type="button" class="topic-icon-btn" onclick="moveJournalTopic(${idx}, 1)" ${isLast ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''} title="Move Down">↓</button>
            <button type="button" class="topic-icon-btn danger" onclick="removeJournalTopic(${idx})" title="Delete Topic">🗑</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Category Select Dropdown (if journal is currently selected)
  if (typeInput && typeInput.value === 'journal' && category) {
    const currentVal = category.value;
    category.innerHTML = topics.map(val => `<option value="${escapeHtml(val)}">${escapeHtml(val)}</option>`).join('');
    if (currentVal && topics.includes(currentVal)) {
      category.value = currentVal;
    }
  }
}

async function saveJournalTopics() {
  try {
    let currentSettings = {};
    try {
      const res = await apiFetch('/api/settings');
      if (res.ok) currentSettings = await res.json();
    } catch (e) {}

    const payload = {
      ...currentSettings,
      journalTopics: categories.journal
    };

    const res = await apiFetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      try {
        localStorage.setItem('ak_portfolio_settings', JSON.stringify(payload));
      } catch (e) {}
    }
  } catch (err) {
    console.error('Failed saving journal topics:', err);
  }
}

function showJournalTopicStatus(msg, isError = false) {
  const el = $('#journal-topic-status-msg');
  if (el) {
    el.textContent = msg;
    el.style.color = isError ? '#d32f2f' : '#2e7d32';
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 3500);
  }
}

window.addJournalTopic = async function(topicName) {
  const name = (topicName || '').trim();
  if (!name) return;
  if (categories.journal.some(t => t.toLowerCase() === name.toLowerCase())) {
    showJournalTopicStatus(`Topic "${name}" already exists.`, true);
    return;
  }
  categories.journal.push(name);
  renderJournalTopicsUI();
  await saveJournalTopics();
  showJournalTopicStatus(`Topic "${name}" added successfully!`);
};

window.removeJournalTopic = async function(indexOrName) {
  let name = '';
  if (typeof indexOrName === 'number') {
    name = categories.journal[indexOrName];
    categories.journal.splice(indexOrName, 1);
  } else {
    name = indexOrName;
    categories.journal = categories.journal.filter(t => t !== indexOrName);
  }
  if (!categories.journal.length) {
    categories.journal = [...defaultJournalTopics];
  }
  renderJournalTopicsUI();
  await saveJournalTopics();
  showJournalTopicStatus(`Topic "${name || ''}" removed.`);
};

window.moveJournalTopic = async function(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= categories.journal.length) return;
  const temp = categories.journal[index];
  categories.journal[index] = categories.journal[newIndex];
  categories.journal[newIndex] = temp;
  renderJournalTopicsUI();
  await saveJournalTopics();
};

window.resetJournalTopics = async function() {
  if (confirm('Reset Journal filter topics to default topics?')) {
    categories.journal = [...defaultJournalTopics];
    renderJournalTopicsUI();
    await saveJournalTopics();
    showJournalTopicStatus('Topics reset to defaults.');
  }
};

// Wire inline topic manager toggle in Content Manager for Journal
const journalTopicToggleBtn = $('#toggle-journal-topic-manager-btn');
const journalInlineTopicsBox = $('#journal-inline-topics-box');
if (journalTopicToggleBtn && journalInlineTopicsBox) {
  journalTopicToggleBtn.onclick = () => {
    const isHidden = journalInlineTopicsBox.style.display === 'none' || !journalInlineTopicsBox.style.display;
    journalInlineTopicsBox.style.display = isHidden ? 'block' : 'none';
    journalTopicToggleBtn.textContent = isHidden ? '✕ Close Manager' : '⚙️ Manage Journal Topics';
  };
}

// Wire Add Topic from Content Manager for Journal
const contentAddJournalTopicBtn = $('#content-add-journal-topic-btn');
const contentJournalTopicInput = $('#content-new-journal-topic');
if (contentAddJournalTopicBtn && contentJournalTopicInput) {
  const handleContentJournalAdd = async () => {
    const val = contentJournalTopicInput.value.trim();
    if (val) {
      await window.addJournalTopic(val);
      contentJournalTopicInput.value = '';
    }
  };
  contentAddJournalTopicBtn.onclick = handleContentJournalAdd;
  contentJournalTopicInput.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); handleContentJournalAdd(); } };
}

// Wire Add Topic from Assets Config Subpanel for Journal
const assetsAddJournalTopicBtn = $('#assets-add-journal-topic-btn');
const assetsJournalTopicInput = $('#assets-new-journal-topic');
if (assetsAddJournalTopicBtn && assetsJournalTopicInput) {
  const handleAssetsJournalAdd = async () => {
    const val = assetsJournalTopicInput.value.trim();
    if (val) {
      await window.addJournalTopic(val);
      assetsJournalTopicInput.value = '';
    }
  };
  assetsAddJournalTopicBtn.onclick = handleAssetsJournalAdd;
  assetsJournalTopicInput.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); handleAssetsJournalAdd(); } };
}

// Wire Reset button for Journal
const journalResetBtn = $('#journal-topics-reset-btn');
if (journalResetBtn) {
  journalResetBtn.onclick = () => window.resetJournalTopics();
}

// Initial render of journal topics UI
renderJournalTopicsUI();

// Default Journal Date to today's date if empty
if ($('#journal-date') && !$('#journal-date').value) {
  $('#journal-date').value = getTodayDateString();
}
