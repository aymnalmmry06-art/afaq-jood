# V35 — إعداد News CMS النهائي

## Netlify Environment Variables
ضع هذه المتغيرات في Netlify فقط:
- GITHUB_TOKEN
- GITHUB_OWNER
- GITHUB_REPO
- GITHUB_BRANCH (عادة main)

لا تضف AFAQ_ADMIN_KEY؛ النسخة الحالية لا تستخدم كلمة مرور.

## Function
تم تحديث `netlify/functions/news-admin.mjs` ليتعامل مع Web Request API الحديث في Netlify، مع الحفاظ على التوافق مع صيغة Lambda القديمة. كما تم تفعيل `/api/news-admin` عبر `netlify.toml` و`_redirects`.

Netlify يوثق حالياً أن Web Functions تستقبل `Request` وتعيد `Response`، وأن إعادة الكتابة إلى Function يمكن تعريفها عبر `netlify.toml`. 
