const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
const countries = context.window.AFAQ_COUNTRIES;

const arabicNames = {
  AE: 'الإمارات العربية المتحدة', SA: 'المملكة العربية السعودية', QA: 'قطر', KW: 'الكويت', OM: 'عُمان', BH: 'البحرين', JO: 'الأردن', IQ: 'العراق', LB: 'لبنان', SY: 'سوريا', IR: 'إيران', TR: 'تركيا', DZ: 'الجزائر', EG: 'مصر', LY: 'ليبيا', MA: 'المغرب', SD: 'السودان', TN: 'تونس', MR: 'موريتانيا', AO: 'أنغولا', BW: 'بوتسوانا', DJ: 'جيبوتي', KE: 'كينيا', MW: 'مالاوي', MU: 'موريشيوس', NA: 'ناميبيا', NG: 'نيجيريا', ZA: 'جنوب أفريقيا', TZ: 'تنزانيا', UG: 'أوغندا', ET: 'إثيوبيا', GH: 'غانا', CI: 'ساحل العاج', SN: 'السنغال'
};

const specialNames = {
  'Palestine – West Bank': 'الضفة الغربية، فلسطين',
  'Palestine – Gaza': 'قطاع غزة، فلسطين',
  'Yemen – Aden': 'اليمن — عدن',
  "Yemen – Sana'a": 'اليمن — صنعاء'
};

const slugify = (name) => name.toLowerCase()
  .replace(/[’']/g, '')
  .replace(/–/g, '-')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

const out = path.join(root, 'type-approval');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const country of countries) {
  const slug = slugify(country.name);
  const arabic = specialNames[country.name] || arabicNames[country.code] || country.name;
  const canonical = `https://afaqjood.com/type-approval/${slug}.html`;
  const products = (country.products || []).map(product => `<li>${esc(product)}</li>`).join('');
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>الموافقة النوعية في ${esc(arabic)} | آفاق جود</title>
  <meta name="description" content="متطلبات وخدمات الموافقة النوعية للأجهزة والاتصالات في ${esc(arabic)}. آفاق جود تساعد في تجهيز الملف الفني والتنسيق مع ${esc(country.authority)}.">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../assets/afaq-jood-logo.png">
  <meta property="og:type" content="website">
  <meta property="og:title" content="الموافقة النوعية في ${esc(arabic)} | آفاق جود">
  <meta property="og:description" content="متطلبات اعتماد الأجهزة والاتصالات في ${esc(arabic)}.">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://afaqjood.com/assets/afaq-jood-logo.png">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","name":"Type Approval in ${esc(arabic)}","provider":{"@type":"Organization","name":"AFAQ JOOD","url":"https://afaqjood.com/"},"areaServed":{"@type":"Country","name":"${esc(country.name)}"},"url":"${canonical}"}</script>
</head>
<body>
  <nav class="siteNav"><div class="navShell"><a class="brandMark" href="../index.html" aria-label="AFAQ JOOD home"><img class="brandFullLogo logoLight" src="../assets/afaq-jood-full-light.png" alt="AFAQ JOOD"><img class="brandFullLogo logoDark" src="../assets/afaq-jood-full-dark.png" alt="AFAQ JOOD"></a><div class="desktopNav"><a href="../index.html">الرئيسية</a><a href="../services.html">خدماتنا</a><a href="../index.html#markets">الدول</a><a href="../contact.html">تواصل معنا</a></div></div></nav>
  <main class="container" style="padding-top:9rem;padding-bottom:5rem">
    <p class="ey">TYPE APPROVAL · ${esc(country.code)}</p>
    <h1>الموافقة النوعية في ${esc(arabic)}</h1>
    <p class="lead">خدمة آفاق جود لتنسيق متطلبات اعتماد الأجهزة ومنتجات الاتصالات قبل دخول سوق ${esc(arabic)}.</p>
    <section class="panel"><h2>الجهة التنظيمية</h2><p><strong>${esc(country.authority)}</strong> — ${esc(country.scope)}</p>${country.authorityWebsite ? `<p><a href="${esc(country.authorityWebsite)}" target="_blank" rel="noopener">الموقع الرسمي للجهة التنظيمية</a></p>` : ''}</section>
    <section class="panel"><h2>المنتجات الشائعة</h2><ul class="docList">${products}</ul></section>
    <section class="panel"><h2>متطلبات الاعتماد الأساسية</h2><ul class="docList"><li><strong>الوثائق:</strong> ${esc(country.documents)}</li><li><strong>تقارير المطابقة:</strong> ${esc(country.ceReports)}</li><li><strong>الاختبارات المحلية:</strong> ${esc(country.localTesting)}</li><li><strong>العينات:</strong> ${esc(country.samples)}</li><li><strong>صلاحية الشهادة:</strong> ${esc(country.validity)}</li></ul></section>
    <section class="panel"><h2>كيف تساعدك آفاق جود</h2><p>${esc(country.why)}</p><p>نراجع مسار المنتج، نحدد الوثائق المطلوبة، وننسق الخطوات اللازمة لطلب الموافقة النوعية بحسب متطلبات السوق والجهة المختصة.</p><a class="navQuote" href="../contact.html">اطلب تقييمًا لمنتجك <span>↗</span></a></section>
    <section class="panel"><h2>أسئلة شائعة</h2><div class="faqGrid"><details open><summary>ما المنتجات التي قد تحتاج موافقة نوعية؟</summary><p>يعتمد ذلك على نوع المنتج وخصائص الاتصال أو الترددات المستخدمة. تشمل الفئات الشائعة أجهزة الاتصالات، Wi‑Fi وBluetooth وأجهزة IoT والموجهات.</p></details><details><summary>ما مدة الإجراء؟</summary><p>${esc(country.leadTime)}</p></details><details><summary>هل تتغير المتطلبات؟</summary><p>نعم، قد تتغير المتطلبات والرسوم والمسارات؛ لذلك يجب التحقق من الجهة التنظيمية قبل تقديم الطلب.</p></details></div></section>
    <p class="sourceMeta">آخر مراجعة للمعلومات: <b>${esc(country.lastVerified || '2026-09-14')}</b></p>
  </main>
  <footer class="footer"><div class="container footerBottom"><span>© 2026 AFAQ JOOD. All rights reserved.</span><a href="../contact.html">تواصل معنا</a></div></footer>
</body>
</html>`;
  fs.writeFileSync(path.join(out, `${slug}.html`), html);
}

const baseUrls = [
  'https://afaqjood.com/', 'https://afaqjood.com/news.html', 'https://afaqjood.com/services.html',
  'https://afaqjood.com/process.html', 'https://afaqjood.com/resources.html', 'https://afaqjood.com/about.html',
  'https://afaqjood.com/contact.html', 'https://afaqjood.com/news/uae-tdra-type-approval-policy-version-4-effective-2026/',
  'https://afaqjood.com/news/egypt-ntra-type-approval-schemes-2026/', 'https://afaqjood.com/news/algeria-arpce-executive-decree-26-97-approval/',
  'https://afaqjood.com/news/jordan-trc-etas-type-approval-updated-march-2026/'
];
const countryUrls = countries.map(country => `https://afaqjood.com/type-approval/${slugify(country.name)}.html`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...baseUrls, ...countryUrls].map(url => `  <url><loc>${url}</loc><lastmod>2026-09-14</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);

console.log(`Generated ${countries.length} country pages.`);
