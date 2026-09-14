# AFAQ JOOD News — Local preview

News cards intentionally open `/news-article.html?slug=...` so the Read Article action works with VS Code Live Server (127.0.0.1:5500) as well as Netlify.

Netlify still supports the canonical pretty URL `/news/<slug>/` through `_redirects`; the article page canonical URL is set dynamically by `news.js`.
