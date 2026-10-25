/* القيم الافتراضية للصفحة الرئيسية — بتستخدمها index.html ولوحة التحكم (تبويب «الصفحة الرئيسية»).
   أي قيمة بتتغيّر من اللوحة بتتحفظ في قاعدة البيانات وبتغلب على القيمة هنا. */
(function () {
  var D = {
    // —— الأقسام (تشغيل/إيقاف + الترتيب)
    show_nav: true, show_strip: true, show_courses: true, show_mock: true, show_cards: true, show_grades: true, show_cta: true, show_social: true, show_support: true,
    order: ['courses', 'mock', 'cards', 'grades', 'cta'],
    // —— الألوان والشكل
    hero_a: '#060e26', hero_b: '#0f1d49', hero_c: '#7a1558', hero_angle: 160, hero_curve: 110, hero_pattern: true, hero_ink: '#ffffff',
    brand_a: '#ef4444', brand_b: '#ec2f7d', btn_ink: '#a0104f',
    bg: '#f4f6fc', ink: '#0d1634', card: '#ffffff', mut: '#5d6785', line: '#e8ecf6', radius: 24,
    blob_a: '#ef4444', blob_b: '#ec2f7d', final_a: '#060e26', final_b: '#c0166b',
    // —— القايمة العلوية
    brand_sub: 'IN ENGLISH',
    nav: [{ label: 'الكورسات', href: '#courses' }, { label: 'المميزات', href: '#cards' }, { label: 'الصفوف', href: '#grades' }, { label: 'الدعم الفني', href: '#support' }],
    nav_login: true, nav_signup: true, nav_login_text: 'دخول', nav_signup_text: 'إنشاء حساب',
    // —— الهيرو
    pill: '🎓 منصة اللغة الإنجليزية', h1_a: 'اتعلّم صح، وكمّل', h1_b: 'Lead the way',
    lead: 'كل حاجة في مكان واحد: فيديوهات محمية، امتحانات بنتيجة فورية، ومتابعة دقيقة لمستواك.',
    btn1_text: 'ابدأ دلوقتي ←', btn1_url: '/signup.html', btn2_text: 'عندي حساب', btn2_url: '/signin.html', btn_in_text: 'ادخل المنصة ←',
    hero_align: 'photo_left',
    // —— صورة المدرس
    show_photo: true, photo_shape: 'blob', photo_mode: 'cutout', photo_zoom: 100, photo_x: 0, photo_y: 0, show_name_card: true, name_title: 'مدرس اللغة الإنجليزية',
    // —— شريط المميزات
    strip: [
      { icon: '🎬', title: 'فيديو محمي', sub: 'كمّل من حيث وقفت' },
      { icon: '📝', title: 'امتحانات فورية', sub: 'تفاصيل كل إجابة' },
      { icon: '📈', title: 'مستواي', sub: 'اعرف أضعف دروسك' },
      { icon: '💬', title: 'دعم مباشر', sub: 'فني وعلمي' }],
    // —— الكورسات
    courses_title: 'كورساتنا', courses_sub: 'اختار الكورس المناسب لصفك وابدأ على طول.', courses_mode: 'all', courses_ids: [], courses_limit: 12,
    tabs_on: true, show_search: true, show_price: true, show_lessons: true, show_teacher_row: true, card_style: 'cover', courses_btn: 'تفاصيل الكورس', courses_empty: 'مفيش كورسات متاحة دلوقتي. تابعنا قريب.', courses_all: 'الكل',
    // —— شكل المنصة من جوه
    mock_title: '', mock_sub: '', mock_video_title: 'Present Simple vs Continuous', mock_q: 'She ____ to school every day.',
    // —— كروت المميزات
    cards_title: '', cards_sub: '',
    cards: [
      { icon: '🎟️', title: 'تفعيل بالباركود', text: 'امسح الكارت بكاميرا موبايلك وكورسك يتفتح فوراً.', tint: '#ffe4ef' },
      { icon: '🛡️', title: 'حساب محمي', text: 'جلسة واحدة نشطة، والفيديوهات ما تتنزّلش.', tint: '#e3ecff' },
      { icon: '🏅', title: 'أوسمة وتحفيز', text: 'كل إنجاز بيتسجّل ليك وبتشوف تقدمك.', tint: '#e0f7f1' }],
    // —— الصفوف
    grades_title: 'كل الصفوف في مكان واحد', grades_sub: 'اختار صفك وابدأ على طول.',
    grades: [
      { name: 'أولى إعدادي', en: 'Prep 1', desc: '', on: true }, { name: 'ثانية إعدادي', en: 'Prep 2', desc: '', on: true }, { name: 'ثالثة إعدادي', en: 'Prep 3', desc: '', on: true },
      { name: 'أولى ثانوي', en: 'Sec 1', desc: '', on: true }, { name: 'ثانية ثانوي', en: 'Sec 2', desc: '', on: true }, { name: 'ثالثة ثانوي', en: 'Sec 3', desc: '', on: true }],
    // —— الدعوة للتسجيل
    cta_title: 'جاهز تبقى Leader؟', cta_sub: 'سجّل حسابك وفعّل كورسك وابدأ أول درس النهارده.', cta_btn: 'إنشاء حساب ←', cta_url: '/signup.html',
    // —— الفوتر والتواصل
    footer_text: '', copyright: '© 2026 The Leader In English', dev_sign: 'Developer / Mohamed Sherif Khafagy', whatsapp: '', facebook: '', instagram: '', youtube: '', tiktok: '', telegram: '',
    // —— محركات البحث
    seo_title: 'The Leader In English — منصة تعلّم اللغة الإنجليزية مع Mr. Sherif Khafagy', seo_desc: 'منصة متكاملة لتعلّم اللغة الإنجليزية: فيديوهات، امتحانات بنتيجة فورية، ومتابعة لمستواك مع Mr. Sherif Khafagy.'
  };
  var ARR = ['order', 'nav', 'strip', 'cards', 'grades', 'courses_ids'];
  // دمج: أي قيمة محفوظة بتغلب على الافتراضي. القوايم بتتاخد زي ما اتحفظت (حتى لو فاضية).
  function merge(cfg) {
    var o = {}, k; cfg = cfg && typeof cfg === 'object' ? cfg : {};
    for (k in D) o[k] = Array.isArray(D[k]) ? D[k].slice() : D[k];
    for (k in cfg) { if (!(k in D)) continue; if (ARR.indexOf(k) >= 0) { if (Array.isArray(cfg[k])) o[k] = cfg[k]; } else o[k] = cfg[k]; }
    // الأقسام اللي مش مذكورة في الترتيب تتضاف في آخره عشان ما تختفيش بالغلط
    D.order.forEach(function (s) { if (o.order.indexOf(s) < 0) o.order.push(s); });
    // الصفوف: لو القايمة ناقصة نكمّلها بالافتراضي
    D.grades.forEach(function (g) { if (!o.grades.some(function (x) { return x.name === g.name; })) o.grades.push(JSON.parse(JSON.stringify(g))); });
    return o;
  }
  window.LP_DEFAULTS = D; window.LP_merge = merge;
})();
