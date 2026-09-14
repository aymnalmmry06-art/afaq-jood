const baseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

function localOrigin(origin = '') {
  try {
    const u = new URL(origin);
    return (u.protocol === 'http:' || u.protocol === 'https:') && (u.hostname === 'localhost' || u.hostname === '127.0.0.1');
  } catch { return false; }
}

const responseHeaders = (origin = '') => ({
  ...baseHeaders,
  ...(localOrigin(origin) ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : {})
});

const json = (statusCode, body, origin = '') => ({ statusCode, headers: responseHeaders(origin), body: JSON.stringify(body) });
const env = () => ({
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH || 'main',
  token: process.env.GITHUB_TOKEN
});

async function gh(path, options = {}) {
  const { owner, repo, branch, token } = env();
  if (!owner || !repo || !token) throw new Error('GitHub server configuration is incomplete.');
  const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    let message = `GitHub request failed (${res.status})`;
    try { const data = await res.json(); message = data.message || message; } catch {}
    const err = new Error(message); err.status = res.status; throw err;
  }
  return res.status === 204 ? null : res.json();
}

function decodeContent(content) {
  return Buffer.from(String(content || '').replace(/\n/g, ''), 'base64').toString('utf8');
}
function encodeContent(content) { return Buffer.from(String(content || ''), 'utf8').toString('base64'); }
function isNewsAsset(path) { return /^\/?assets\/news\//.test(String(path || '')); }

async function readNews() {
  try {
    const file = await gh('news.json');
    let items = [];
    try { items = JSON.parse(decodeContent(file.content)); } catch { items = []; }
    return { file, items: Array.isArray(items) ? items : [] };
  } catch (e) {
    if (e.status === 404) return { file: null, items: [] };
    throw e;
  }
}

async function putText(path, content, sha, message) {
  const { branch } = env();
  return gh(path, {
    method: 'PUT',
    body: JSON.stringify({ message, content: encodeContent(content), branch, ...(sha ? { sha } : {}) })
  });
}

async function putBinary(path, base64, sha, message) {
  const { branch } = env();
  return gh(path, {
    method: 'PUT',
    body: JSON.stringify({ message, content: base64, branch, ...(sha ? { sha } : {}) })
  });
}

async function deletePath(path, message) {
  const file = await gh(path);
  const { branch } = env();
  return gh(path, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha: file.sha, branch })
  });
}

export default async (input) => {
  const isRequest = typeof input?.method === 'string' && input?.headers && typeof input.headers.get === 'function';
  const method = isRequest ? input.method.toUpperCase() : String(input?.httpMethod || 'GET').toUpperCase();
  const origin = isRequest ? (input.headers.get('origin') || '') : (input?.headers?.origin || input?.headers?.Origin || '');
  const send = (status, body) => isRequest
    ? new Response(JSON.stringify(body), { status, headers: responseHeaders(origin) })
    : json(status, body, origin);

  if (method === 'OPTIONS') {
    if (!localOrigin(origin)) return send(403, { error: 'Local admin only.' });
    return isRequest ? new Response(null, { status: 204, headers: responseHeaders(origin) }) : { statusCode: 204, headers: responseHeaders(origin), body: '' };
  }
  if (!localOrigin(origin)) return send(403, { error: 'Local admin only. Run admin.html through VS Code Live Server on localhost.' });

  try {
    if (method === 'GET') {
      const { items } = await readNews();
      return send(200, { articles: items });
    }
    if (method !== 'POST') return send(405, { error: 'Method not allowed.' });

    let payload = {};
    if (isRequest) {
      try { payload = await input.json(); } catch { payload = {}; }
    } else {
      try { payload = JSON.parse(input?.body || '{}'); } catch { payload = {}; }
    }

    if (payload.action === 'test') {
      const { items } = await readNews();
      return send(200, { ok: true, articles: items.length, newsFile: true });
    }

    if (payload.action === 'publish') {
      const article = payload.article;
      if (!article?.id || !article?.slug) return send(400, { error: 'Article id and slug are required.' });
      const { file, items } = await readNews();
      const now = new Date().toISOString();
      const idx = items.findIndex(x => x.id === article.id);
      const previous = idx >= 0 ? items[idx] : null;
      article.status = 'published';
      article.publishedAt = previous?.publishedAt || article.publishedAt || now;
      article.updatedAt = now;
      article.revisions = Array.isArray(previous?.revisions) ? previous.revisions.slice(-9) : [];
      article.revisions.push({ at: now, action: previous ? 'updated' : 'published', summary: article.revisionNote || 'Article updated' });
      delete article.revisionNote;
      if (payload.image?.base64 && payload.image?.path) {
        const path = String(payload.image.path).replace(/^\//, '');
        if (!isNewsAsset(path)) return send(400, { error: 'Invalid news image path.' });
        let existingSha;
        try { existingSha = (await gh(path)).sha; } catch (e) { if (e.status !== 404) throw e; }
        await putBinary(path, payload.image.base64, existingSha, `News image: ${article.slug}`);
        article.image = '/' + path;
      }
      if (idx >= 0) items[idx] = article; else items.unshift(article);
      const content = JSON.stringify(items, null, 2) + '\n';
      await putText('news.json', content, file?.sha, `News article: ${article.slug}`);
      return send(200, { ok: true, article, articles: items });
    }

    if (payload.action === 'delete') {
      if (!payload.id) return send(400, { error: 'Article id is required.' });
      const { file, items } = await readNews();
      const article = items.find(x => x.id === payload.id);
      const next = items.filter(x => x.id !== payload.id);
      if (article?.image) {
        const imagePath = String(article.image).replace(/^\//, '');
        if (isNewsAsset(imagePath)) { try { await deletePath(imagePath, `Delete news image: ${article.slug}`); } catch (e) { if (e.status !== 404) throw e; } }
      }
      await putText('news.json', JSON.stringify(next, null, 2) + '\n', file?.sha, `Delete news article: ${article?.slug || payload.id}`);
      return send(200, { ok: true, articles: next });
    }

    return send(400, { error: 'Unknown action.' });
  } catch (e) {
    console.error(e);
    return send(Number(e.status) >= 400 ? Number(e.status) : 500, { error: e?.message || 'Server error.' });
  }
};
