const xmlEscape = (value = '') => String(value).replace(/[<>&'\"]/g, char => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
}[char]));

const siteUrl = 'https://afaqjood.com';
const publicationName = 'AFAQ JOOD';
const publicationLanguage = 'en';
const freshWindowMs = 48 * 60 * 60 * 1000;

function sitemap(items) {
  const cutoff = Date.now() - freshWindowMs;
  const urls = items
    .filter(article => article?.status === 'published' && article?.slug)
    .map(article => ({ article, publishedAt: Date.parse(article.publishedAt || article.date || '') }))
    .filter(({ publishedAt }) => Number.isFinite(publishedAt) && publishedAt >= cutoff)
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .map(({ article }) => {
      const title = article?.title?.en || article?.title || article.slug;
      const publishedAt = new Date(article.publishedAt || article.date).toISOString();
      const url = `${siteUrl}/news/${encodeURIComponent(article.slug)}/`;
      return `  <url>\n    <loc>${xmlEscape(url)}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>${xmlEscape(publicationName)}</news:name>\n        <news:language>${publicationLanguage}</news:language>\n      </news:publication>\n      <news:publication_date>${publishedAt}</news:publication_date>\n      <news:title>${xmlEscape(title)}</news:title>\n    </news:news>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${urls}\n</urlset>\n`;
}

export default async () => {
  try {
    const response = await fetch(`${siteUrl}/news.json`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) throw new Error(`News source request failed (${response.status})`);
    const items = await response.json();
    return new Response(sitemap(Array.isArray(items) ? items : []), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' }
    });
  } catch (error) {
    console.error('Unable to create Google News sitemap:', error);
    return new Response(sitemap([]), { status: 503, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
