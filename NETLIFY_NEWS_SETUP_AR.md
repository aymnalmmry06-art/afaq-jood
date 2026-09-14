# إعداد نشر أخبار AFAQ JOOD على Netlify

بعد رفع المستودع إلى GitHub وربطه بـ Netlify، افتح:

Site configuration → Environment variables

وأضف:

`AFAQ_ADMIN_KEY`
- مفتاح سري قوي تستخدمه فقط في صفحة `admin.html`.

`GITHUB_TOKEN`
- Fine-grained Personal Access Token.
- Repository access: المستودع الخاص بالموقع فقط.
- Repository permissions: Contents = Read and write.

`GITHUB_OWNER`
- اسم حساب GitHub أو المنظمة.

`GITHUB_REPO`
- اسم مستودع الموقع.

`GITHUB_BRANCH`
- عادة `main`.

بعد حفظ المتغيرات، أعد Deploy للموقع.

## الاستخدام
1. افتح `/admin.html`.
2. أدخل `AFAQ_ADMIN_KEY`.
3. اضغط Sign in.
4. Create Article.
5. أكمل English / العربية / 中文.
6. أضف المصدر الرسمي.
7. راجع Translation readiness.
8. Preview.
9. Publish.

اللوحة تتصل بـ `/api/news-admin`، والـNetlify Function تتعامل مع GitHub في الخادم. لا يتم إرسال GitHub Token إلى المتصفح.
