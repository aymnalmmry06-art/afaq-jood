# AFAQ JOOD — News CMS V26

تم تطوير قسم الأخبار ليكون Regulatory Intelligence section احترافيًا مستوحى من أنماط مواقع الشركات المتخصصة مثل Narmadi وSGS وBureau Veritas، بدون نسخ التصميم أو المحتوى.

## الموقع العام
- `news.html`: صفحة الأخبار مع Featured Update، البحث، التصفية حسب السوق والتصنيف والجهة.
- `news-article.html`: قالب المقال المستقل.
- روابط قابلة للمشاركة: `/news/{country}/{slug}/`.
- أخبار الدولة تظهر تلقائيًا داخل صفحة الدولة.
- English / العربية / 中文.
- Official Source + مصدر رسمي.
- Regulatory Impact + Affected Products + What Manufacturers Should Know.
- Related Updates.
- WhatsApp / LinkedIn / Copy Link.
- Open Graph وNewsArticle JSON-LD يتم توليدهما للمقال.
- لا توجد قاعدة بيانات.

## لوحة الإدارة
الملف المنفصل هو `admin.html`.

من خلاله:
- إنشاء خبر.
- تعديل خبر.
- حذف خبر.
- حفظ مسودة محليًا.
- Preview قبل النشر.
- Featured.
- الدولة والجهة والتصنيف.
- Regulatory Impact.
- Affected Products.
- Tags.
- Author.
- What Manufacturers Should Know بثلاث لغات.
- Official Source.
- Translation readiness للإنجليزية والعربية والصينية.
- Revision History.
- Media Library.

## الأمان والنشر
لا يوجد GitHub Token داخل المتصفح.
تم نقل عملية GitHub إلى Netlify Function: `netlify/functions/news-admin.mjs`.

اضبط متغيرات البيئة في Netlify:

- `AFAQ_ADMIN_KEY` — مفتاح لوحة الإدارة.
- `GITHUB_TOKEN` — Fine-grained token محدود بالمستودع وبصلاحية Contents Read/Write.
- `GITHUB_OWNER` — اسم الحساب/المنظمة.
- `GITHUB_REPO` — اسم المستودع.
- `GITHUB_BRANCH` — عادة `main`.

بعد ذلك افتح `admin.html` وأدخل `AFAQ_ADMIN_KEY` فقط. لا تدخل GitHub Token في الموقع.

## سير العمل
Admin → Netlify Function → GitHub → Netlify Build → Public Website

لا يوجد Server 24/7 ولا Database.

## ملاحظات المحتوى
ينبغي أن تكون التحديثات التنظيمية مبنية على مصدر رسمي، مع رابط المصدر، وتجنب ضمان الموافقة أو تقديم متطلبات عامة كأنها تنطبق على كل المنتجات.
