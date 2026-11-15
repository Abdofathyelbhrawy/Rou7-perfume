(() => {
  // ── WhatsApp & Supabase config ───────────────────────────────────────────
  // رقم واتساب رُوح المستخرج من الرابط الرسمي: 01000603308
  const WHATSAPP_PHONE    = '201000603308';
  const WHATSAPP_BASE_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
  const SUPABASE_URL      = 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

  async function supaFetch(table, { method = 'GET', filters = '', body = null, select = '*' } = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`;
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          'apikey':        SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type':  'application/json',
          'Prefer':        (method === 'POST' || method === 'PATCH') ? 'return=representation' : '',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(await res.text());
      if (res.status === 204 || method === 'DELETE') return null;
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('انتهت مهلة الاتصال بالخادم. تحقق من اتصال الإنترنت.');
      }
      throw err;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  // ── Bilingual / i18n Translations ─────────────────────────────────────────
  const I18N = {
    ar: {
      site_title: 'رُوح | Rou7 Perfume — عطر يلامس أعماقك',
      site_desc: 'رُوح | Rou7 Perfume — اكتشف عطرك، واترك أثراً لا يُنسى.',
      nav_home: 'الرئيسية',
      nav_collection: 'تسوق العطور',
      nav_story: 'حكايتنا',
      nav_tracking: 'تتبع طلبك',
      nav_contact: 'تواصل معنا',
      search_placeholder: 'ابحث عن عطرك المفضل…',
      theme_toggle_mobile: 'تغيير المظهر',
      cart_title: 'سلة التسوق',
      cart_empty_title: 'سلتك فارغة حالياً',
      cart_empty_desc: 'استكشف مجموعتنا واختر عطرك المفضل.',
      cart_continue: 'العودة للمجموعة',
      cart_total: 'الإجمالي',
      cart_checkout: 'إتمام الطلب',
      cart_shipping_note: 'الشحن يُحسب عند إتمام الطلب',
      hero_eyebrow: 'عطور صُنعت لتُشبهك',
      hero_scroll_heading: 'تصفح <em>عطور رُوح</em>',
      hero_title: 'عطرك…<br>حكاية <em>روحك</em>',
      hero_text: 'في كل نفحة حكاية، وفي كل أثر ذكرى. اكتشف عالماً من العطور التي تعبّر عنك وتبقى معك.',
      hero_cta: 'اكتشف مجموعتنا',
      hero_note: 'صُنعت بحب،<br>لتبقى في الذاكرة',
      hero_scroll: 'اكتشف رُوح',
      hero_featured_tag: 'Rou7 · عطر مميز',
      val_1: 'تركيبات غنية تدوم طويلاً',
      val_2: 'خامات مختارة بعناية',
      val_3: 'صُنع بحب في مصر',
      val_4: 'هدية تحكي عنك',
      coll_eyebrow: 'اكتشف عطرك',
      coll_title: 'مختارات <em>رُوح</em>',
      coll_all_link: 'كل العطور',
      filter_all: 'الكل',
      filter_women: 'نسائي',
      filter_men: 'رجالي',
      filter_unisex: 'للجميع',
      quick_add: 'أضيفي إلى السلة',
      no_results: 'ملقيناش عطرك… جرّب كلمة تانية.',
      story_eyebrow: 'حكايتنا',
      story_title: 'العطر لغةٌ<br>تسبق <em>الكلام</em>',
      story_text: 'بدأت حكايتنا من إيمان بسيط: لكل شخص رائحة تشبه روحه. نمزج نفحات مختارة بعناية لنصنع عطوراً صادقة، قريبة منك، وتترك أثراً جميلاً أينما ذهبت.',
      story_signature: 'مع كل الحب، <span>فريق رُوح</span>',
      story_link: 'اكتشف فلسفة رُوح',
      spotlight_badge_default: '✨ عطر اليوم المميز',
      spotlight_price_label: 'السعر بالعرض:',
      spotlight_quick_buy: 'أضف للسلة بالعرض',
      spotlight_explore_notes: 'تحليل النوتات',
      spotlight_save_prefix: 'وفر',
      quote_text: '“بعض الحكايات لا تُروى… <em>بل تُشمّ.</em>”',
      quote_caption: 'رُوح · عطر يلامس أعماقك',
      news_eyebrow: 'رسائل من رُوح',
      news_title: 'خلي لحكايتك <em>امتداد</em>',
      news_text: 'اشترك لتصلك أخبار مجموعاتنا الجديدة ولمسات صغيرة من عالم العطور.',
      news_label: 'بريدك الإلكتروني',
      news_placeholder: 'name@example.com',
      news_disclaimer: 'بالاشتراك، أنت توافق على استقبال رسائل رُوح.',
      footer_tagline: 'عطر يلامس أعماقك.<br>رائحة تُشبهك، وذكرى تبقى.',
      footer_rights: '© ٢٠٢٦ رُوح | Rou7 Perfume. جميع الحقوق محفوظة.',
      footer_made: 'صُنع بحب في مصر <b>✳</b>',
      checkout_eyebrow: 'خطوة أخيرة',
      checkout_title: 'بيانات <em>التوصيل</em>',
      checkout_order_total: 'إجمالي طلبك:',
      checkout_name_label: 'الاسم بالكامل',
      checkout_name_ph: 'اسمك',
      checkout_phone_label: 'رقم الهاتف',
      checkout_address_label: 'العنوان بالتفصيل',
      checkout_address_ph: 'المحافظة، المنطقة، الشارع، رقم المنزل',
      checkout_submit: 'تأكيد الطلب',
      checkout_submitting: 'جاري الإرسال…',
      success_eyebrow: 'وصلت حكايتك إلينا',
      success_title: 'شكراً لاختيارك <em>رُوح</em>',
      success_order_msg: 'تم تسجيل طلبك بنجاح. رقم الطلب:',
      success_wa_note: 'جاري فتح واتساب لإرسال تفاصيل طلبك مباشرةً 💬',
      success_wa_btn: 'إرسال الطلب عبر واتساب 💬',
      success_back_btn: 'العودة للتسوق',
      track_eyebrow: 'خليك قريب',
      track_title: 'تتبع <em>طلبك</em>',
      track_subtext: 'أدخل رقم الطلب الذي وصلك بعد إتمام الشراء.',
      track_label: 'رقم الطلب',
      track_submit: 'عرض حالة الطلب',
      track_searching: 'جاري البحث…',
      track_not_found: 'لم نجد هذا الطلب. راجع الرقم أو تواصل معنا للمساعدة.',
      wa_tooltip: 'تواصل معنا عبر واتساب 💬',
      wa_inquiry_msg: 'مرحباً رُوح | Rou7-perfume، أود الاستفسار عن عطوركم 🌸',
      toast_added: 'اتضاف عطرك للسلة ✳',
      toast_newsletter: 'أهلاً بك في حكاية رُوح ✳',
      lang_btn_code: 'EN',
      lang_btn_mobile: 'English',
      lang_switch_title: 'Switch to English',
      finder_badge: 'مستشار رُوح الذكي',
      finder_title: 'محتار في اختيار عطرك؟ <em>دعنا نساعدك</em>',
      finder_desc: 'أجب عن ٣ أسئلة سريعة وسنختار لك العطر الأقرب لروحك وشخصيتك بأعلى نسبة تطابق.',
      finder_cta: 'ابدأ الاستشارة العطرية ✨',
      reviews_eyebrow: 'تجارب حقيقية',
      reviews_title: 'ماذا يقول <em>عملاء رُوح؟</em>',
      sort_featured: 'الأكثر تميزاً ⭐',
      sort_price_asc: 'السعر: من الأقل للأعلى',
      sort_price_desc: 'السعر: من الأعلى للأقل',
      sort_name: 'الاسم أبجدياً',
      added_to_cart: '✓ تمت الإضافة',
      quick_view: 'نظرة سريعة 👁️',
      mood_eyebrow: 'بوابة اللحظات والمشاعر العطرية',
      mood_main_title: 'اختَر <em>شعورك أو لحظتك</em>… وسندلّك على عطرك',
      mood_subtitle: 'العطر ليس مجرد نفحات، بل شعور يتجسد وذكرى تدوم. انقر على أي لحظة لترى العطور التي تليق بها وتعيش أجواءها:',
      mood_sound_text: 'همس الأجواء',
      mood_reset: 'عرض الكل',
    },
    en: {
      site_title: 'Rou7 Perfume — A Scent Touching Your Depths',
      site_desc: 'Rou7 Perfume — Discover your fragrance, leave an unforgettable trace.',
      nav_home: 'Home',
      nav_collection: 'Shop Fragrances',
      nav_story: 'Our Story',
      nav_tracking: 'Track Order',
      nav_contact: 'Contact Us',
      search_placeholder: 'Search your favorite fragrance…',
      theme_toggle_mobile: 'Toggle Theme',
      cart_title: 'Shopping Bag',
      cart_empty_title: 'Your bag is currently empty',
      cart_empty_desc: 'Explore our collection and pick your signature scent.',
      cart_continue: 'Return to Collection',
      cart_total: 'Total',
      cart_checkout: 'Proceed to Checkout',
      cart_shipping_note: 'Shipping calculated at checkout',
      hero_eyebrow: 'Fragrances Crafted to Resemble You',
      hero_scroll_heading: 'Explore <em>Rou7 Fragrances</em>',
      hero_title: 'Your Scent…<br>The Essence of <em>Your Soul</em>',
      hero_text: 'In every note a story, in every trace a memory. Discover a world of fragrances that express who you are and linger with you.',
      hero_cta: 'Explore Collection',
      hero_note: 'Crafted with love,<br>made to be remembered',
      hero_scroll: 'Discover Rou7',
      hero_featured_tag: 'Rou7 · FEATURED',
      val_1: 'Long-lasting rich formulas',
      val_2: 'Carefully selected essences',
      val_3: 'Crafted with love in Egypt',
      val_4: 'A gift that speaks of you',
      coll_eyebrow: 'Discover Your Scent',
      coll_title: 'Rou7 <em>Curations</em>',
      coll_all_link: 'All Fragrances',
      filter_all: 'All',
      filter_women: 'For Her',
      filter_men: 'For Him',
      filter_unisex: 'Unisex',
      quick_add: 'Add to Bag',
      no_results: 'No fragrance found… Try another search.',
      story_eyebrow: 'Our Story',
      story_title: 'Fragrance is a language<br>before <em>words</em>',
      story_text: 'Our story began with a simple belief: everyone has a scent that mirrors their soul. We blend carefully chosen notes to craft authentic, intimate perfumes that leave a memorable trace wherever you go.',
      story_signature: 'With all love, <span>Rou7 Team</span>',
      story_link: 'Discover Rou7 Philosophy',
      spotlight_badge_default: '✨ Scent of the Day',
      spotlight_price_label: 'Special Deal:',
      spotlight_quick_buy: 'Add to Bag with Offer',
      spotlight_explore_notes: 'Scent Analysis',
      spotlight_save_prefix: 'Save',
      quote_text: '“Some stories aren\'t told… <em>they are smelled.</em>”',
      quote_caption: 'Rou7 · A Scent Touching Your Depths',
      news_eyebrow: 'Letters from Rou7',
      news_title: 'Let your story <em>unfold</em>',
      news_text: 'Subscribe to receive our latest collections and subtle touches from the world of fragrance.',
      news_label: 'Your Email Address',
      news_placeholder: 'name@example.com',
      news_disclaimer: 'By subscribing, you agree to receive letters from Rou7.',
      footer_tagline: 'A scent that touches your depths.<br>A fragrance like you, a memory that lasts.',
      footer_rights: '© 2026 Rou7 Perfume. All rights reserved.',
      footer_made: 'Crafted with love in Egypt <b>✳</b>',
      checkout_eyebrow: 'One Last Step',
      checkout_title: 'Delivery <em>Details</em>',
      checkout_order_total: 'Order total:',
      checkout_name_label: 'Full Name',
      checkout_name_ph: 'Your Name',
      checkout_phone_label: 'Phone Number',
      checkout_address_label: 'Detailed Address',
      checkout_address_ph: 'City, Area, Street, Building / Apt',
      checkout_submit: 'Confirm Order',
      checkout_submitting: 'Submitting…',
      success_eyebrow: 'Your story has reached us',
      success_title: 'Thank you for choosing <em>Rou7</em>',
      success_order_msg: 'Your order was registered successfully. Order number:',
      success_wa_note: 'Opening WhatsApp to send your order details directly 💬',
      success_wa_btn: 'Send Order via WhatsApp 💬',
      success_back_btn: 'Continue Shopping',
      track_eyebrow: 'Stay Connected',
      track_title: 'Track <em>Your Order</em>',
      track_subtext: 'Enter the order number you received after checkout.',
      track_label: 'Order Number',
      track_submit: 'Check Status',
      track_searching: 'Searching…',
      track_not_found: 'Order not found. Please verify the number or contact us.',
      wa_tooltip: 'Chat with us on WhatsApp 💬',
      wa_inquiry_msg: 'Hello Rou7-perfume, I would like to inquire about your fragrances 🌸',
      toast_added: 'Added to your shopping bag ✳',
      toast_newsletter: 'Welcome to the story of Rou7 ✳',
      lang_btn_code: 'عربي',
      lang_btn_mobile: 'العربية',
      lang_switch_title: 'التبديل إلى اللغة العربية',
      finder_badge: 'Rou7 Scent Advisor',
      finder_title: 'Unsure which fragrance fits? <em>Let us guide you</em>',
      finder_desc: 'Answer 3 quick questions and we will match you with the perfume that resonates with your soul.',
      finder_cta: 'Start Scent Quiz ✨',
      reviews_eyebrow: 'Real Experiences',
      reviews_title: 'What our clients say <em>about Rou7</em>',
      sort_featured: 'Featured ⭐',
      sort_price_asc: 'Price: Low to High',
      sort_price_desc: 'Price: High to Low',
      sort_name: 'Name Alphabetical',
      added_to_cart: '✓ Added',
      quick_view: 'Quick View 👁️',
      mood_eyebrow: 'Scent Mood & Atmosphere Portal',
      mood_main_title: 'Choose <em>Your Mood or Moment</em>… Discover Your Scent',
      mood_subtitle: 'A fragrance is more than notes—it is an embodied memory. Pick any atmosphere to reveal matching scents:',
      mood_sound_text: 'Atmosphere Audio',
      mood_reset: 'Show All',
    }
  };

  let currentLang = 'ar';
  try { currentLang = localStorage.getItem('rooh-lang') || 'ar'; } catch (_) {}

  const DEFAULT_PRODUCTS = [
    {
      id: 'd6973def-50dd-4e75-8005-8ee22eb23872',
      name: 'نود كورال دايموند',
      latin: 'Nude Coral Diamond',
      brand: 'Matière Première',
      price: 1600,
      category: 'unisex',
      tag: 'Best Seller',
      image_url: 'https://oyslbombgdvcoyqotyao.supabase.co/storage/v1/object/public/products/rooh_1794685786337_Nude_Coral_Diam.png',
      is_featured: true,
      in_stock: true,
      sort_order: 0,
      notes: JSON.stringify({
        brand: 'Matière Première',
        brand_ar: 'ماتيير بريمير ماتير premiere',
        desc: 'Nude Coral Diamond takes center stage as the luminous note of a sunset’s symphony. Bergamot dances with saffron, joined by orange blossom and coconut, while the warmth of cashmeran and vanilla completes the aromatic masterpiece.',
        top_notes: 'Bergamot, Apple, Saffron',
        middle_notes: 'Orange Blossom, Coconut, Guaiac Wood',
        base_notes: 'Vanilla, Amber, Cashmeran',
        inspired_by: 'Vanilla Powder - Matière Première',
        longevity: 4,
        sillage: 4,
        accords: 'Vanilla, Sweet, Oriental, Powdery, Amber',
        main_accord: 'Vanilla',
        seasons: 'winter,fall,night'
      })
    },
    {
      id: 'c34eb21c-4eeb-434e-b3e7-5383fa774137',
      name: 'إبراق',
      latin: 'Ibraq',
      brand: 'إبراق',
      price: 1500,
      category: 'men',
      tag: 'الأكثر مبيعاً',
      image_url: '',
      is_featured: false,
      in_stock: true,
      sort_order: 1,
      notes: JSON.stringify({
        brand: 'إبراق',
        brand_ar: 'ابراق إبراق ibraq',
        desc: 'عطر رجالي فاخر يجمع بين دفء التوابل الشرقية وأناقة الأخشاب العطرية، ليعبر عن حضور مهيب ولا يُنسى.',
        top_notes: 'الهيل، الزعفران، جوزة الطيب',
        middle_notes: 'العود، اللبان، الجلود',
        base_notes: 'الباتشولي، العنبر، خشب الصندل',
        inspired_by: 'عطر فخم ومميز',
        longevity: 5,
        sillage: 4,
        accords: 'Woody, Spicy, Oriental, Amber, Leather',
        main_accord: 'Woody',
        seasons: 'winter,fall,night'
      })
    },
    {
      id: '1143fdb0-4584-4722-a0ca-4cca23c11b61',
      name: 'ملك الشرق',
      latin: 'Malek Al Sharq',
      brand: 'رُوح',
      price: 389,
      category: 'men',
      tag: 'عطر مميز',
      image_url: '',
      is_featured: false,
      in_stock: true,
      sort_order: 2,
      notes: JSON.stringify({
        brand: 'رُوح',
        brand_ar: 'روح رُوح rou7',
        desc: 'تجسيد حقيقي للهيبة الشرقية؛ عبير العود الفاخر والجلود والبخور المعتّق يترك أثراً ملكياً يلفت الأنظار.',
        top_notes: 'برغموت مدخن، بخور، زنجبيل',
        middle_notes: 'خشب الغاياك، عنبر فاخر، قرفة',
        base_notes: 'جلد أسود، مسك داكن، نجيل الهند',
        inspired_by: 'عطور النخبة الشرقية',
        longevity: 5,
        sillage: 4,
        accords: 'Oriental, Smoky, Woody, Amber, Spicy',
        main_accord: 'Oriental',
        seasons: 'winter,fall,night'
      })
    },
    {
      id: '4bc56b5e-839a-4959-a231-1639882828f5',
      name: 'نجمة الليل',
      latin: 'Najmet Al Lail',
      brand: 'رُوح',
      price: 349,
      category: 'women',
      tag: 'جديد',
      image_url: '',
      is_featured: false,
      in_stock: true,
      sort_order: 3,
      notes: JSON.stringify({
        brand: 'رُوح',
        brand_ar: 'روح رُوح rou7',
        desc: 'عطر أنثوي غامض وجذاب مستوحى من سحر ليالي الشرق، نغمات الزهور البيضاء الناعمة تمتزج مع الفانيليا.',
        top_notes: 'توت بري، كمثرى، زهر البرتقال',
        middle_notes: 'ياسمين، فانيليا ناعمة، مسك الروم',
        base_notes: 'حبوب التونكا، كشميران، خشب الأرز',
        inspired_by: 'زهري شرقي آسر',
        longevity: 4,
        sillage: 3,
        accords: 'Floral, Sweet, Vanilla, Powdery, Fruity',
        main_accord: 'Floral',
        seasons: 'fall,spring,night'
      })
    },
    {
      id: '61fc4566-5935-442d-9099-31322bb39609',
      name: 'نسمة الفجر',
      latin: 'Nasmet Al Fajr',
      brand: 'رُوح',
      price: 269,
      category: 'women',
      tag: 'انتعاش يومي',
      image_url: '',
      is_featured: false,
      in_stock: true,
      sort_order: 4,
      notes: JSON.stringify({
        brand: 'رُوح',
        brand_ar: 'روح رُوح rou7',
        desc: 'انتعاش نقي كأول خيوط الصباح الباكر، باقة ورد ندية مع لمسة حمضيات ومسك أبيض ناعم.',
        top_notes: 'زهر الليمون، تفاح أخضر، ندى الصباح',
        middle_notes: 'ورد دمشقي، زنبق الوادي، فريزيا',
        base_notes: 'مسك أبيض شفاف، أخشاب بيضاء',
        inspired_by: 'عبير النقاء الصباحي',
        longevity: 3,
        sillage: 3,
        accords: 'Fresh, Floral, Citrus, Musky, Aquatic',
        main_accord: 'Fresh',
        seasons: 'spring,summer,day'
      })
    }
  ];

  let products = [];
  try {
    const cachedP = localStorage.getItem('rooh-cached-products');
    if (cachedP) {
      const parsed = JSON.parse(cachedP);
      if (Array.isArray(parsed) && parsed.length) products = parsed;
    }
  } catch (_) {}
  if (!products.length) {
    products = [...DEFAULT_PRODUCTS];
  }
  const PROMO_KEY = 'rooh-promo';
  const defaultPromo = { title: 'شحن مجاني للطلبات فوق ١٥٠٠ جنيه', details: '', startsAt: '', endsAt: '', active: true };
  const arabicDigits = value => String(value).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const formatDigits = value => currentLang === 'ar' ? arabicDigits(value) : String(value);
  const money = value => {
    const num = Number(value || 0);
    if (currentLang === 'ar') {
      return `${arabicDigits(num.toLocaleString('en-US'))} ج.م`;
    }
    return `${num.toLocaleString('en-US')} EGP`;
  };

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('rooh-cart') || '[]'); } catch (_) {}
  let activeFilter = 'all';
  let activeBrand  = 'all';
  let query = '';
  let toastTimer;

  const themeButton = $('#themeToggle');

  function setTheme(theme, persist = true) {
    const light = theme === 'light';
    document.body.classList.toggle('light', light);
    document.querySelector('meta[name="theme-color"]').content = light ? '#f5f0eb' : '#192940';
    $$('.brand-logo').forEach(image => {
      const next = image.dataset[light ? 'light' : 'dark'];
      if (image.src.endsWith(next)) return;
      image.style.opacity = '0';
      window.setTimeout(() => { image.src = next; image.style.opacity = '1'; }, 150);
    });
    themeButton?.setAttribute('aria-label', light ? (currentLang === 'ar' ? 'التبديل للمظهر الداكن' : 'Switch to Dark Mode') : (currentLang === 'ar' ? 'التبديل للمظهر الفاتح' : 'Switch to Light Mode'));
    if (persist) localStorage.setItem('rooh-theme', theme);
  }
  let initialTheme = 'dark';
  try { initialTheme = localStorage.getItem('rooh-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch (_) {}
  setTheme(initialTheme, false);

  function setLanguage(lang, persist = true) {
    currentLang = lang === 'en' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir  = currentLang === 'ar' ? 'rtl' : 'ltr';

    const t = I18N[currentLang];
    document.title = t.site_title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.content = t.site_desc;

    // Apply translations across all tagged elements
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        if (t[key].includes('<') || t[key].includes('&')) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    $$('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (t[key]) el.innerHTML = t[key];
    });

    $$('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      if (t[key]) el.placeholder = t[key];
    });

    // Update switcher buttons
    const langText = $('#langText');
    if (langText) langText.textContent = t.lang_btn_code;
    const langToggle = $('#langToggle');
    if (langToggle) {
      langToggle.setAttribute('title', t.lang_switch_title);
      langToggle.setAttribute('aria-label', t.lang_switch_title);
    }
    const mobileLangText = $('#mobileLangText');
    if (mobileLangText) mobileLangText.textContent = t.lang_btn_mobile;

    // Update floating WhatsApp link
    const waFloat = $('#whatsappFloat');
    if (waFloat) {
      waFloat.href = `${WHATSAPP_BASE_URL}&text=${encodeURIComponent(t.wa_inquiry_msg)}`;
    }

    if (persist) {
      try { localStorage.setItem('rooh-lang', currentLang); } catch (_) {}
    }

    renderProducts();
    renderHeroProduct();
    renderStorySpotlight();
    updateCart();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function openProductDetails(id) {
    if (!id) return;
    window.location.href = `product.html?id=${encodeURIComponent(id)}`;
  }

  // ── Web Audio Engine for Homepage & Mood Portal ──────────────────
  class PerfumeAudioEngine {
    constructor() {
      this.ctx = null;
      this.ambientNodes = [];
      this.activeMood = null;
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    playSpraySound(sillageRating = 3) {
      try {
        const ctx = this.ensureContext();
        if (!ctx) return;

        const duration = 0.28 + (Number(sillageRating || 3) * 0.04);
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.08;
          b2 = 0.85 * b2 + white * 0.12;
          data[i] = (b0 + b1 + b2 + white * 0.15) * 0.45;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + duration);
        filter.Q.setValueAtTime(2.2, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noise.stop(ctx.currentTime + duration);
      } catch (err) {
        console.warn('Audio spray failed:', err);
      }
    }

    stopAmbient() {
      this.ambientNodes.forEach(n => {
        try {
          if (n.stop) n.stop();
          if (n.disconnect) n.disconnect();
        } catch (_) {}
      });
      this.ambientNodes = [];
      this.activeMood = null;
    }

    playMoodAmbient(moodKey) {
      this.stopAmbient();
      if (!moodKey) return;

      try {
        const ctx = this.ensureContext();
        if (!ctx) return;
        this.activeMood = moodKey;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.8);
        masterGain.connect(ctx.destination);
        this.ambientNodes.push(masterGain);

        if (moodKey === 'winter_cozy') {
          [130.81, 196.00, 261.63].forEach(freq => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            g.gain.value = 0.25;
            osc.connect(g);
            g.connect(masterGain);
            osc.start();
            this.ambientNodes.push(osc);
          });
        } else if (moodKey === 'majestic_power') {
          [98.0, 146.8, 220.0].forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 380;
            const g = ctx.createGain();
            g.gain.value = 0.18;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.connect(filter);
            filter.connect(g);
            g.connect(masterGain);
            osc.start();
            this.ambientNodes.push(osc);
          });
        } else if (moodKey === 'morning_radiance') {
          [528, 792, 1056].forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            const g = ctx.createGain();
            g.gain.value = 0.16;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.connect(g);
            g.connect(masterGain);
            osc.start();
            this.ambientNodes.push(osc);
          });
        } else if (moodKey === 'romantic_twilight') {
          [220, 277.18, 329.63].forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            const g = ctx.createGain();
            g.gain.value = 0.2;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.connect(g);
            g.connect(masterGain);
            osc.start();
            this.ambientNodes.push(osc);
          });
        } else if (moodKey === 'aquatic_freedom') {
          const bufferSize = ctx.sampleRate * 2;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 1.4;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          noise.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(350, ctx.currentTime);
          filter.Q.value = 1.2;
          noise.connect(filter);
          filter.connect(masterGain);
          noise.start();
          this.ambientNodes.push(noise);
        }
      } catch (err) {
        console.warn('Mood audio failed:', err);
      }
    }
  }

  const homeAudio = new PerfumeAudioEngine();
  let activeMood = null;
  let isMoodAudioPlaying = false;

  const MOOD_PROFILES = {
    winter_cozy: {
      ar: 'سهرة شتوية دافئة',
      en: 'Cozy Winter Evening',
      icon: '☕',
      badgeAr: '✨ خيارك المثالي لسهرة الشتاء',
      badgeEn: '✨ Perfect for a cozy winter evening',
      auraColor: '#e07a5f',
      keywords: ['vanilla', 'sweet', 'amber', 'woody', 'tonka', 'warm', 'عنبر', 'فانيليا', 'خشب', 'تونكا', 'دافئ', 'شتاء', 'خريف', 'winter', 'fall']
    },
    majestic_power: {
      ar: 'حضور رسمي استثنائي',
      en: 'Majestic Official Presence',
      icon: '👑',
      badgeAr: '👑 هيبة وفخامة لا تُنسى',
      badgeEn: '👑 Unforgettable Majestic Presence',
      auraColor: '#d4af37',
      keywords: ['oriental', 'leather', 'smoky', 'spicy', 'woody', 'oud', 'patchouli', 'عود', 'جلود', 'بخور', 'توابل', 'شرقي', 'باتشولي', 'صندل']
    },
    morning_radiance: {
      ar: 'صباح مشرق وثقة متجددة',
      en: 'Radiant Morning & Fresh Energy',
      icon: '🌅',
      badgeAr: '☀️ إشراقة صباحية مفعمة بالطاقة',
      badgeEn: '☀️ Radiant Morning Freshness',
      auraColor: '#f6bd60',
      keywords: ['citrus', 'floral', 'fresh', 'bergamot', 'orange blossom', 'neroli', 'حمضيات', 'منعش', 'برغموت', 'زهور', 'نقاء', 'spring', 'summer', 'ربيع', 'صيف', 'نهاري']
    },
    romantic_twilight: {
      ar: 'غموض رومانسي ساحر',
      en: 'Romantic Twilight & Sensual Night',
      icon: '🌙',
      badgeAr: '🌙 جاذبية رومانسية مخملية',
      badgeEn: '🌙 Velvet Romantic Allure',
      auraColor: '#f5a5ad',
      keywords: ['rose', 'powdery', 'musk', 'musky', 'berry', 'sweet', 'floral', 'ورد', 'بودري', 'مسك', 'رومانسي', 'توت', 'ناعم', 'سهرة', 'night']
    },
    aquatic_freedom: {
      ar: 'نسيم البحر وحرية الصيف',
      en: 'Aquatic Breeze & Summer Freedom',
      icon: '🌊',
      badgeAr: '🌊 نسيم منعش يمنحك شعور الحرية',
      badgeEn: '🌊 Refreshing Aquatic Breeze',
      auraColor: '#48cae4',
      keywords: ['aquatic', 'marine', 'fresh', 'sea', 'citrus', 'mint', 'aromatic', 'مائي', 'بحر', 'منعش', 'صيفي', 'نعناع', 'أروماتك']
    }
  };

  function getProductMoodScore(product, moodKey) {
    if (!moodKey || !MOOD_PROFILES[moodKey]) return 0;
    const profile = MOOD_PROFILES[moodKey];
    const d = unpackProduct(product);
    const text = `${product.name} ${product.latin || ''} ${product.notes || ''} ${d.accords || ''} ${d.seasons || ''} ${d.main_accord || ''} ${d.top_notes || ''} ${d.middle_notes || ''} ${d.base_notes || ''} ${d.inspired_by || ''}`.toLowerCase();
    let score = 0;
    for (const kw of profile.keywords) {
      if (text.includes(kw.toLowerCase())) score += 10;
    }
    return score;
  }

  // ── Announcements & Campaign Management ──────────────────────────────
  let promoTimer;
  let currentAnnouncements = null;
  let currentSpotlightPerfume = null;

  function renderStorySpotlight() {
    const storySection = $('#story');
    if (!storySection) return;

    const available = (products || []).filter(p => p.name !== '__system_announcements__' && p.in_stock !== false);
    if (!available.length) return;

    const data = currentAnnouncements || {};
    let target = null;
    if (data.spotlight_perfume_id) {
      target = available.find(p => String(p.id) === String(data.spotlight_perfume_id));
    }
    if (!target) {
      target = available[0];
    }
    currentSpotlightPerfume = target;

    // Bottle Wrapper & Image Links
    const storyBottleWrap = $('#storyBottleWrapper');
    if (storyBottleWrap && target) {
      storyBottleWrap.href = `product.html?id=${encodeURIComponent(target.id)}`;
      storyBottleWrap.setAttribute('title', currentLang === 'ar' ? `عرض تفاصيل وتحليل عطر ${target.name}` : `View fragrance profile for ${target.latin || target.name}`);
      storyBottleWrap.onclick = (e) => {
        if (!e.ctrlKey && !e.metaKey && e.button === 0) {
          e.preventDefault();
          openProductDetails(target.id);
        }
      };
    }

    // Bottle Image
    const bottleImg = $('#storyProductImage');
    if (bottleImg && target.image_url) {
      bottleImg.src = target.image_url;
      bottleImg.alt = target.name;
    }

    // Badge
    const badgeEl = $('#storyOfferBadge');
    if (badgeEl) {
      const badgeText = data.spotlight_badge || I18N[currentLang].spotlight_badge_default || '✨ عطر اليوم المميز';
      badgeEl.textContent = badgeText;
      badgeEl.style.display = data.spotlight_active !== false ? '' : 'none';
    }

    // Headings / Content
    const headingEl = $('#storyHeading');
    const descEl = $('#storyDescription');
    const d = unpackProduct(target);
    const prodName = currentLang === 'en' ? (target.latin || target.name) : target.name;

    if (headingEl) {
      if (data.spotlight_title && data.spotlight_active !== false) {
        headingEl.innerHTML = escapeHtml(data.spotlight_title);
      } else {
        headingEl.innerHTML = currentLang === 'ar'
          ? `العطر لغةٌ<br>تسبق <em>الكلام</em>`
          : `Fragrance is a language<br>before <em>words</em>`;
      }
    }

    if (descEl) {
      if (data.spotlight_desc && data.spotlight_active !== false) {
        descEl.textContent = data.spotlight_desc;
      } else {
        descEl.textContent = d.notes || I18N[currentLang].story_text;
      }
    }

    // Spotlight Box & Pricing
    const box = $('#storySpotlightBox');
    const quickAddBtn = $('#storyQuickAddBtn');
    const detailsBtn = $('#storyDetailsBtn');
    const currentPriceEl = $('#storyCurrentPrice');
    const oldPriceEl = $('#storyOldPrice');
    const discountTag = $('#storyDiscountTag');

    if (box) {
      const isActive = data.spotlight_active !== false;
      box.hidden = !isActive;
      if (isActive) {
        const specialPrice = Number(data.spotlight_price);
        const hasDiscount = Boolean(specialPrice && specialPrice < target.price);
        const activePrice = hasDiscount ? specialPrice : target.price;

        if (currentPriceEl) currentPriceEl.textContent = money(activePrice);

        if (oldPriceEl) {
          if (hasDiscount) {
            oldPriceEl.style.display = '';
            oldPriceEl.textContent = money(target.price);
          } else {
            oldPriceEl.style.display = 'none';
          }
        }

        if (discountTag) {
          if (hasDiscount) {
            discountTag.style.display = '';
            const diff = target.price - specialPrice;
            const prefix = I18N[currentLang].spotlight_save_prefix || 'وفر';
            discountTag.textContent = `${prefix} ${money(diff)}`;
          } else {
            discountTag.style.display = 'none';
          }
        }

        // Action Buttons
        if (quickAddBtn) {
          quickAddBtn.onclick = (e) => {
            e.stopPropagation();
            addToCart(target.id, quickAddBtn, hasDiscount ? specialPrice : null);
          };
        }
        if (detailsBtn) {
          detailsBtn.onclick = (e) => {
            e.stopPropagation();
            openProductDetails(target.id);
          };
        }
      }
    }
  }

  function initStoryParallax() {
    const storyArt = $('#storyArt');
    const storyBottleWrap = $('#storyBottleWrapper');
    const ring1 = document.querySelector('.story-ring.ring-1');
    const ring2 = document.querySelector('.story-ring.ring-2');

    if (!storyArt || !storyBottleWrap) return;

    storyArt.addEventListener('mousemove', e => {
      const rect = storyArt.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      const y = ((e.clientY - rect.top) / rect.height) - 0.5;

      storyBottleWrap.style.transform = `perspective(700px) rotateY(${x * 24}deg) rotateX(${-y * 24}deg) translateY(-8px) scale(1.05)`;
      if (ring1) ring1.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      if (ring2) ring2.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    });

    storyArt.addEventListener('mouseleave', () => {
      storyBottleWrap.style.transform = '';
      if (ring1) ring1.style.transform = '';
      if (ring2) ring2.style.transform = '';
    });

    storyArt.addEventListener('click', e => {
      if (e.target.closest('#storyQuickAddBtn') || e.target.closest('#storyDetailsBtn') || e.target.closest('#btnStorySpray')) return;
      if (currentSpotlightPerfume) {
        openProductDetails(currentSpotlightPerfume.id);
      }
    });
  }

  function initStorySpray() {
    const sprayBtn = $('#btnStorySpray');
    const canvas = $('#storyAtomizerCanvas');
    const bottleWrap = $('#storyBottleWrapper');
    if (!sprayBtn || !canvas) return;

    sprayBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      homeAudio.playSpraySound(4);
      runStoryMist(canvas);
      if (bottleWrap) {
        bottleWrap.classList.add('spraying');
        setTimeout(() => bottleWrap.classList.remove('spraying'), 420);
      }
      const prevHtml = sprayBtn.innerHTML;
      sprayBtn.innerHTML = `<span>✨</span> <span>${currentLang === 'ar' ? 'فوحان رائع!' : 'Magnificent!'}</span>`;
      setTimeout(() => {
        sprayBtn.innerHTML = prevHtml;
      }, 1600);
    });
  }

  function runStoryMist(canvas) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const originX = rect.width * 0.5;
    const originY = rect.height * 0.28;

    const particles = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
      const speed = 2.0 + Math.random() * 4.5;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3.5,
        alpha: 0.85,
        decay: 0.015 + Math.random() * 0.02,
        drag: 0.95,
        color: Math.random() > 0.4 ? '#f5a5ad' : '#ffffff'
      });
    }

    function step() {
      ctx.clearRect(0, 0, rect.width, rect.height);
      let alive = false;
      for (let p of particles) {
        if (p.alpha <= 0.01) continue;
        alive = true;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (alive) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, rect.width, rect.height);
    }
    step();
  }

  function applyAnnouncements(data) {
    if (!data) return;
    currentAnnouncements = data;
    clearTimeout(promoTimer);

    // 1. Top Announcement Bar
    const topBar = document.querySelector('.announcement') || $('#topAnnouncement');
    if (topBar) {
      if (data.top_bar_active === false) {
        topBar.style.display = 'none';
      } else {
        topBar.style.display = '';
        const textEl = topBar.querySelector('[data-i18n="announcement"]') || topBar.querySelector('.announcement-content') || $('#topAnnouncementText');
        if (data.top_bar && textEl) {
          textEl.textContent = data.top_bar;
        }
      }
    }

    // 2. Main Promo Banner
    const banner = $('#promoBanner');
    if (banner) {
      const now = Date.now();
      const startsAt = data.promo_starts_at ? new Date(data.promo_starts_at).getTime() : -Infinity;
      const endsAt = data.promo_ends_at ? new Date(data.promo_ends_at).getTime() : Infinity;
      const hasValidSchedule = startsAt < endsAt;
      const visible = Boolean(data.promo_active !== false && data.promo_title && hasValidSchedule && now >= startsAt && now < endsAt);
      banner.hidden = !visible;
      if (visible) {
        if ($('#promoTitle')) $('#promoTitle').textContent = data.promo_title;
        if ($('#promoDetails')) {
          $('#promoDetails').textContent = data.promo_details || '';
          $('#promoDetails').hidden = !data.promo_details;
        }
      }
      const nextChange = now < startsAt ? startsAt : endsAt;
      if (data.promo_active !== false && hasValidSchedule && Number.isFinite(nextChange) && nextChange > now) {
        promoTimer = setTimeout(() => applyAnnouncements(data), Math.min(nextChange - now + 50, 2147483647));
      }
    }

    // 3. Dynamic Story Spotlight Fragrance & Storewide Discount Re-render
    renderStorySpotlight();
    renderProducts();
  }

  function loadAnnouncements() {
    try {
      const stored = localStorage.getItem('rooh-announcements') || localStorage.getItem('rooh-campaign-settings') || localStorage.getItem('rooh-promo');
      if (stored) {
        const parsed = JSON.parse(stored);
        applyAnnouncements({
          top_bar: parsed.top_bar,
          top_bar_active: parsed.top_bar_active !== false,
          promo_title: parsed.promo_title || parsed.title,
          promo_details: parsed.promo_details !== undefined ? parsed.promo_details : parsed.details,
          promo_starts_at: parsed.promo_starts_at || parsed.startsAt,
          promo_ends_at: parsed.promo_ends_at || parsed.endsAt,
          promo_active: parsed.promo_active !== undefined ? parsed.promo_active : (parsed.active !== false),
          spotlight_perfume_id: parsed.spotlight_perfume_id,
          spotlight_badge: parsed.spotlight_badge,
          spotlight_price: parsed.spotlight_price,
          spotlight_title: parsed.spotlight_title,
          spotlight_desc: parsed.spotlight_desc,
          spotlight_active: parsed.spotlight_active !== false,
          storewide_discount_active: parsed.storewide_discount_active || false,
          storewide_discount_percent: parsed.storewide_discount_percent || '',
          storewide_discount_scope: parsed.storewide_discount_scope || 'only_no_custom',
          storewide_discount_badge: parsed.storewide_discount_badge || ''
        });
      }
    } catch (_) {}

    supaFetch('products', { filters: '&name=eq.__system_announcements__' })
      .then(rows => {
        if (rows && rows.length && rows[0].notes) {
          try {
            const data = JSON.parse(rows[0].notes);
            localStorage.setItem('rooh-announcements', JSON.stringify(data));
            applyAnnouncements(data);
          } catch (e) {
            console.error('Error parsing announcement data:', e);
          }
        }
      })
      .catch(err => console.warn('Announcements fetch error:', err));
  }

  loadAnnouncements();
  initStoryParallax();
  initStorySpray();
  initMoodPortal();
  window.addEventListener('storage', event => {
    if (event.key && (event.key.includes('promo') || event.key.includes('announcement') || event.key.includes('campaign'))) {
      loadAnnouncements();
    }
  });

  // ── Hero Perfume Carousel with Floating Notes ──────────────────────
  let heroCurrentIndex = 0;
  let heroAutoTimer = null;
  let heroHovered = false;
  let heroListenersBound = false;

  function renderHeroProduct(targetIndex = null) {
    const hero = $('#heroProduct');
    if (!hero) return;
    const t = I18N[currentLang];

    const candidates = products.filter(p => p.name !== '__system_announcements__' && p.in_stock !== false);
    if (!candidates.length) {
      hero.innerHTML = `<div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><div class="hero-product-empty"><span>✳</span><p>${currentLang === 'ar' ? 'المنتج المميز سيظهر هنا' : 'Featured fragrance will appear here'}</p></div>`;
      return;
    }

    if (targetIndex !== null) {
      heroCurrentIndex = ((targetIndex % candidates.length) + candidates.length) % candidates.length;
    } else if (heroCurrentIndex >= candidates.length) {
      const featIdx = candidates.findIndex(p => p.is_featured);
      heroCurrentIndex = featIdx >= 0 ? featIdx : 0;
    }

    const currentProduct = candidates[heroCurrentIndex];
    const heroPricing = computeProductPrice(currentProduct);
    const d = unpackProduct(currentProduct);
    const nameToDisplay = currentLang === 'en' ? (currentProduct.latin || currentProduct.name) : (currentProduct.name || currentProduct.latin);
    const safeName = escapeHtml(nameToDisplay || 'Rou7');
    const safeImage = escapeHtml(currentProduct.image_url || '');
    const cleanDesc = escapeHtml(d.notes || '');

    // Floating notes orbiting around the bottle
    const floatingNotes = [];
    if (d.top_notes) {
      const firstTop = d.top_notes.split(/[,،]/)[0].trim();
      floatingNotes.push({
        pos: 'fn-pos-1',
        icon: '▲',
        iconClass: 'sp-top',
        phase: currentLang === 'ar' ? 'قمة العطر · Top' : 'TOP NOTE',
        text: escapeHtml(firstTop),
        popup: currentLang === 'ar' ? 'نفحات افتتاحية منعشة في أول ربع ساعة 🍋' : 'Crisp opening note in first 15 mins'
      });
    }
    if (d.middle_notes) {
      const firstMid = d.middle_notes.split(/[,،]/)[0].trim();
      floatingNotes.push({
        pos: 'fn-pos-2',
        icon: '■',
        iconClass: 'sp-trapezoid',
        phase: currentLang === 'ar' ? 'قلب العطر · Heart' : 'HEART NOTE',
        text: escapeHtml(firstMid),
        popup: currentLang === 'ar' ? 'قلب العطر الزهري الآسر حتى 3 ساعات 🌸' : 'Alluring heart note lasting up to 3h'
      });
    }
    if (d.base_notes) {
      const firstBase = d.base_notes.split(/[,،]/)[0].trim();
      floatingNotes.push({
        pos: 'fn-pos-3',
        icon: '◼',
        iconClass: 'sp-square',
        phase: currentLang === 'ar' ? 'قاعدة العطر · Base' : 'BASE NOTE',
        text: escapeHtml(firstBase),
        popup: currentLang === 'ar' ? 'قاعدة دافئة غنية تثبت لأكثر من 10 ساعات ✨' : 'Deep warm base resting on skin for 10+ hours'
      });
    }
    if (d.inspired_by) {
      floatingNotes.push({
        pos: 'fn-pos-4',
        icon: '✦',
        iconClass: 'sp-spark',
        phase: currentLang === 'ar' ? 'مستوحى من' : 'INSPIRED BY',
        text: escapeHtml(d.inspired_by),
        popup: currentLang === 'ar' ? 'مستوحى بنفس فخامة وإتقان العطر الأصلي 🏆' : 'Crafted with master inspiration'
      });
    } else if (d.accords) {
      const firstAccord = d.accords.split(/[,،]/)[0].trim();
      floatingNotes.push({
        pos: 'fn-pos-4',
        icon: '●',
        iconClass: 'sp-accord',
        phase: currentLang === 'ar' ? 'الطابع' : 'ACCORD',
        text: escapeHtml(firstAccord),
        popup: currentLang === 'ar' ? 'الطابع العطري المميز لشخصية العطر 🌿' : 'Signature olfactory character'
      });
    }

    if (floatingNotes.length === 0 && d.notes) {
      const parts = d.notes.split(/[,،]/).map(s => s.trim()).filter(Boolean);
      const icons = ['▲', '■', '◼', '✦'];
      const iconClasses = ['sp-top', 'sp-trapezoid', 'sp-square', 'sp-spark'];
      const phases = [
        currentLang === 'ar' ? 'نوتة عليا' : 'TOP',
        currentLang === 'ar' ? 'قلب العطر' : 'HEART',
        currentLang === 'ar' ? 'نوتة دافئة' : 'BASE',
        currentLang === 'ar' ? 'طابع العطر' : 'ACCORD'
      ];
      const popups = [
        currentLang === 'ar' ? 'نفحات افتتاحية منعشة 🍋' : 'Crisp opening note',
        currentLang === 'ar' ? 'قلب العطر الآسر 🌸' : 'Alluring heart note',
        currentLang === 'ar' ? 'قاعدة دافئة وثابتة ✨' : 'Warm lingering base',
        currentLang === 'ar' ? 'طابع العطر المميز 🌿' : 'Signature accord'
      ];
      parts.slice(0, 4).forEach((part, idx) => {
        floatingNotes.push({
          pos: `fn-pos-${idx + 1}`,
          icon: icons[idx] || '●',
          iconClass: iconClasses[idx] || 'sp-accord',
          phase: phases[idx] || 'NOTE',
          text: escapeHtml(part),
          popup: popups[idx] || ''
        });
      });
    }

    const floatingNotesHtml = floatingNotes.map(fn => `
      <div class="floating-note-badge ${fn.pos}" title="${fn.phase}: ${fn.text}">
        <span class="fn-badge-icon ${fn.iconClass}">${fn.icon}</span>
        <div class="fn-badge-text">
          <small class="fn-badge-phase">${fn.phase}</small>
          <strong class="fn-badge-name">${fn.text}</strong>
        </div>
        ${fn.popup ? `<span class="fn-badge-popup">${fn.popup}</span>` : ''}
      </div>
    `).join('');

    const dotsHtml = candidates.length > 1 ? `
      <div class="hero-carousel-dots" aria-label="${currentLang === 'ar' ? 'مؤشرات العطور' : 'Fragrance indicators'}">
        ${candidates.map((_, i) => `<button type="button" class="hero-carousel-dot ${i === heroCurrentIndex ? 'active' : ''}" data-hero-dot="${i}" aria-label="${currentLang === 'ar' ? 'عطر ' + (i + 1) : 'Fragrance ' + (i + 1)}"></button>`).join('')}
      </div>
    ` : '';

    const navArrowsHtml = candidates.length > 1 ? `
      <button class="hero-nav-arrow hero-prev" id="heroPrevBtn" type="button" aria-label="${currentLang === 'ar' ? 'العطر السابق' : 'Previous Fragrance'}">‹</button>
      <button class="hero-nav-arrow hero-next" id="heroNextBtn" type="button" aria-label="${currentLang === 'ar' ? 'العطر التالي' : 'Next Fragrance'}">›</button>
    ` : '';

    hero.innerHTML = `
      <div class="hero-orbit orbit-one"></div>
      <div class="hero-orbit orbit-two"></div>
      <div class="hero-bottle-halo"></div>
      <span class="hero-spark spark-one">✳</span>
      <span class="hero-spark spark-two">✦</span>

      ${navArrowsHtml}

      <div class="hero-slide-content hero-slide-fade" key="${currentProduct.id}">
        <div class="hero-creative-showcase">
          ${floatingNotesHtml}
          
          <div class="hero-bottle-center">
            ${safeImage ? `<img class="hero-featured-image" src="${safeImage}" alt="${safeName}" fetchpriority="high">` : '<div class="hero-product-empty"><span>✳</span></div>'}
          </div>
        </div>

        <div class="hero-product-caption">
          <span class="hero-caption-kicker">${heroPricing.hasDiscount ? `<strong style="color:var(--pink);">${escapeHtml(heroPricing.discountBadge)}</strong> · ` : ''}${t.hero_featured_tag}</span>
          <h2 class="hero-caption-title">${safeName}</h2>
          ${cleanDesc ? `<p class="hero-caption-desc">${cleanDesc}</p>` : ''}
          <div class="hero-caption-footer">
            <a class="btn-hero-explore" href="product.html?id=${currentProduct.id}">
              <span>✦</span> ${currentLang === 'ar' ? 'استكشف هرم النوتات والتحليل' : 'Explore Scent DNA & Notes'}
            </a>
            <button class="btn-hero-quickadd" data-add="${currentProduct.id}" type="button">
              <span>＋</span> ${t.quick_add} · ${money(heroPricing.price)} ${heroPricing.hasDiscount ? `<del style="opacity:0.6; font-size:11px; margin-inline-start:4px;">${money(heroPricing.originalPrice)}</del>` : ''}
            </button>
          </div>
          ${dotsHtml}
          <div class="hero-timer-track"><div class="hero-timer-bar" id="heroTimerBar"></div></div>
        </div>
      </div>
    `;

    // Event listeners on hero container
    if (!heroListenersBound) {
      heroListenersBound = true;
      hero.addEventListener('mouseenter', () => { heroHovered = true; });
      hero.addEventListener('mouseleave', () => {
        heroHovered = false;
        const bottle = hero.querySelector('.hero-bottle-center');
        if (bottle) bottle.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
        const badges = hero.querySelectorAll('.floating-note-badge');
        badges.forEach(b => { b.style.transform = ''; });
      });

      // Interactive 3D mouse parallax on the showcase
      hero.addEventListener('mousemove', e => {
        const showcase = hero.querySelector('.hero-creative-showcase');
        const bottle = hero.querySelector('.hero-bottle-center');
        if (!showcase || !bottle) return;
        const rect = showcase.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        bottle.style.transform = `perspective(1000px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.02)`;

        const badges = showcase.querySelectorAll('.floating-note-badge');
        badges.forEach((b, idx) => {
          const mult = (idx % 2 === 0 ? 1 : -1) * ((idx + 1) * 7);
          b.style.transform = `translate(${x * mult}px, ${y * mult}px)`;
        });
      });

      hero.addEventListener('click', e => {
        const prevBtn = e.target.closest('#heroPrevBtn');
        if (prevBtn) {
          e.preventDefault();
          e.stopPropagation();
          renderHeroProduct(heroCurrentIndex - 1);
          return;
        }
        const nextBtn = e.target.closest('#heroNextBtn');
        if (nextBtn) {
          e.preventDefault();
          e.stopPropagation();
          renderHeroProduct(heroCurrentIndex + 1);
          return;
        }
        const dot = e.target.closest('[data-hero-dot]');
        if (dot) {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(dot.getAttribute('data-hero-dot'), 10);
          if (!isNaN(idx)) renderHeroProduct(idx);
          return;
        }
      });

      let touchStartX = 0;
      hero.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      hero.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            renderHeroProduct(document.dir === 'rtl' ? heroCurrentIndex + 1 : heroCurrentIndex - 1);
          } else {
            renderHeroProduct(document.dir === 'rtl' ? heroCurrentIndex - 1 : heroCurrentIndex + 1);
          }
        }
      }, { passive: true });
    }

    // Auto rotate every 7 seconds with live timer progress bar
    clearInterval(heroAutoTimer);
    let heroProgress = 0;
    const HERO_DURATION = 7000;
    const TICK = 60;
    if (candidates.length > 1) {
      heroAutoTimer = setInterval(() => {
        if (!heroHovered) {
          heroProgress += TICK;
          const bar = $('#heroTimerBar');
          if (bar) bar.style.width = `${Math.min((heroProgress / HERO_DURATION) * 100, 100)}%`;
          if (heroProgress >= HERO_DURATION) {
            heroProgress = 0;
            renderHeroProduct(heroCurrentIndex + 1);
          }
        }
      }, TICK);
    }
  }

  function unpackProduct(p) {
    if (!p) return {};
    let meta = {};
    if (p.notes && typeof p.notes === 'string' && (p.notes.trim().startsWith('{') || p.notes.trim().startsWith('['))) {
      try { meta = JSON.parse(p.notes); } catch (_) {}
    }
    return {
      brand:        p.brand || meta.brand || 'رُوح',
      brand_ar:     meta.brand_ar || '',
      notes:        meta.desc !== undefined ? meta.desc : (p.notes || ''),
      top_notes:    p.top_notes || meta.top_notes || '',
      middle_notes: p.middle_notes || meta.middle_notes || '',
      base_notes:   p.base_notes || meta.base_notes || '',
      inspired_by:  p.inspired_by || meta.inspired_by || '',
      longevity:    parseInt(p.longevity || meta.longevity) || 3,
      sillage:      parseInt(p.sillage || meta.sillage) || 2,
      accords:      p.accords || meta.accords || '',
      main_accord:  p.main_accord || meta.main_accord || '',
      seasons:      p.seasons || meta.seasons || '',
      sale_price:   p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : (meta.sale_price !== undefined ? meta.sale_price : ''),
      discount_percent: p.discount_percent || meta.discount_percent || '',
      discount_badge:   p.discount_badge || meta.discount_badge || ''
    };
  }

  function computeProductPrice(p, campaignData = currentAnnouncements) {
    if (!p) return { price: 0, originalPrice: 0, hasDiscount: false, discountPercent: 0, discountBadge: '', savedAmount: 0 };

    const originalPrice = Number(p.price || 0);
    const d = unpackProduct(p);

    const rawSale = Number(p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : d.sale_price);
    const hasCustomSale = Boolean(rawSale && rawSale > 0 && rawSale < originalPrice);

    const camp = campaignData || currentAnnouncements || {};
    const isGlobalActive = Boolean(camp.storewide_discount_active);
    const globalPct = Number(camp.storewide_discount_percent) || 0;
    const globalScope = camp.storewide_discount_scope || 'only_no_custom';
    const globalBadge = camp.storewide_discount_badge || (globalPct ? (currentLang === 'ar' ? `خصم ${globalPct}%` : `${globalPct}% OFF`) : '');

    let activePrice = originalPrice;
    let hasDiscount = false;
    let discountPercent = 0;
    let discountBadge = '';

    if (hasCustomSale) {
      if (isGlobalActive && globalPct > 0 && globalScope === 'all') {
        const globalCalc = Math.round(originalPrice * (1 - globalPct / 100));
        if (globalCalc < rawSale) {
          activePrice = globalCalc;
          hasDiscount = true;
          discountPercent = globalPct;
          discountBadge = globalBadge;
        } else {
          activePrice = rawSale;
          hasDiscount = true;
          discountPercent = Math.round(((originalPrice - rawSale) / originalPrice) * 100);
          discountBadge = d.discount_badge || (currentLang === 'ar' ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`);
        }
      } else {
        activePrice = rawSale;
        hasDiscount = true;
        discountPercent = Math.round(((originalPrice - rawSale) / originalPrice) * 100);
        discountBadge = d.discount_badge || (currentLang === 'ar' ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`);
      }
    } else if (isGlobalActive && globalPct > 0) {
      activePrice = Math.round(originalPrice * (1 - globalPct / 100));
      hasDiscount = true;
      discountPercent = globalPct;
      discountBadge = globalBadge;
    }

    const savedAmount = hasDiscount ? (originalPrice - activePrice) : 0;

    return {
      price: activePrice,
      originalPrice,
      hasDiscount,
      discountPercent,
      discountBadge,
      savedAmount
    };
  }

  function getAccordDotColor(name) {
    const n = String(name || '').toLowerCase().trim();
    if (n.includes('sweet') || n.includes('حلو') || n.includes('كراميل') || n.includes('فانيليا')) return '#d97706';
    if (n.includes('wood') || n.includes('خشب') || n.includes('صندل') || n.includes('عود')) return '#8b5a2b';
    if (n.includes('spic') || n.includes('توابل') || n.includes('حار') || n.includes('فلفل')) return '#ea580c';
    if (n.includes('fresh') || n.includes('منعش') || n.includes('حمض') || n.includes('جريب')) return '#0284c7';
    if (n.includes('amber') || n.includes('عنبر')) return '#b45309';
    if (n.includes('floral') || n.includes('زهر') || n.includes('ورد') || n.includes('ياسمين')) return '#ec4899';
    if (n.includes('aromatic') || n.includes('عطري') || n.includes('لافندر') || n.includes('سرو')) return '#10b981';
    if (n.includes('fruit') || n.includes('فاكه') || n.includes('توت')) return '#e11d48';
    if (n.includes('leather') || n.includes('جلد')) return '#451a03';
    return 'var(--pink)';
  }

  function renderNotePills(notesStr, defaultColor = '#e2b38b') {
    if (!notesStr) return '';
    return notesStr.split(',').map(n => n.trim()).filter(Boolean).map(n => {
      const dotCol = getAccordDotColor(n) || defaultColor;
      return `<span class="note-pill"><span class="note-dot" style="background:${dotCol};"></span>${escapeHtml(n)}</span>`;
    }).join('');
  }

  function renderPerfBars(level, max = 5) {
    let html = '<div class="perf-bar-group">';
    for (let i = 1; i <= max; i++) {
      html += `<span class="perf-bar-segment ${i <= level ? 'filled' : ''}"></span>`;
    }
    html += '</div>';
    return html;
  }

  const longevityLabels = { 1: '<1hr', 2: '1-3hrs', 3: '4-6hrs', 4: '8-10hrs', 5: '12hrs+' };
  const sillageLabels   = { 1: 'Skin (ملاصق)', 2: '1-2hrs', 3: 'Moderate (معتدل)', 4: 'Strong (قوي)', 5: 'Beast (وحش)' };

  function renderAccordPills(accordsStr) {
    if (!accordsStr) return '';
    return accordsStr.split(',').map(a => a.trim()).filter(Boolean).map(a => {
      const lower = a.toLowerCase();
      const isSeason = lower.includes('winter') || lower.includes('fall') || lower.includes('summer') || lower.includes('spring') || lower.includes('شتاء') || lower.includes('خريف') || lower.includes('صيف') || lower.includes('ربيع');
      const dotHtml = isSeason ? '' : `<span class="note-dot" style="background:${getAccordDotColor(a)};"></span>`;
      return `<span class="accord-pill">${dotHtml}${escapeHtml(a)}</span>`;
    }).join('');
  }

  function renderInspiredHtml(inspiredStr) {
    if (!inspiredStr) return '';
    return `<div class="inspired-card">
      <div class="inspired-icon">
        <svg viewBox="0 0 36 24" width="34" height="24" fill="none" stroke="currentColor" stroke-width="1.3">
          <rect x="2" y="7" width="9" height="13" rx="2"/>
          <rect x="4.5" y="4" width="4" height="3" rx="0.5"/>
          <path d="M14 13.5h5m-2-2.5 2.5 2.5-2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="22" y="7" width="11" height="13" rx="2" stroke="var(--pink)"/>
          <rect x="25" y="4" width="5" height="3" rx="0.5" stroke="var(--pink)"/>
          <text x="27.5" y="16.5" font-size="6.5" font-family="'DM Sans',sans-serif" font-weight="700" fill="var(--pink)" stroke="none" text-anchor="middle">R</text>
        </svg>
      </div>
      <div class="inspired-text">
        <span class="inspired-label">${currentLang === 'ar' ? 'مستوحى من' : 'INSPIRED BY'}</span>
        <h4 class="inspired-name">${escapeHtml(inspiredStr)}</h4>
      </div>
    </div>`;
  }

  function renderScentPyramidHtml(d) {
    const hasNotes = d.top_notes || d.middle_notes || d.base_notes;
    if (!hasNotes) return '';
    return `<div class="scent-pyramid-card">
      <div class="sp-header">
        <h4>${currentLang === 'ar' ? 'هرم النوتات العطرية' : 'Scent pyramid'}</h4>
        <small>${currentLang === 'ar' ? 'تعرّف على نوتات عطرك وتدرّجها مع الوقت' : 'Tap any note to learn how it smells.'}</small>
      </div>
      ${d.top_notes ? `
        <div class="sp-level-row">
          <div class="sp-badge-col">
            <span class="sp-shape sp-triangle" title="Top Notes">▲</span>
            <div class="sp-badge-meta">
              <strong>Top</strong>
              <small>${currentLang === 'ar' ? 'أول 15 دقيقة' : 'First 15 min'}</small>
            </div>
          </div>
          <div class="sp-pills-col">${renderNotePills(d.top_notes, '#f59e0b')}</div>
        </div>
      ` : ''}
      ${d.middle_notes ? `
        <div class="sp-level-row">
          <div class="sp-badge-col">
            <span class="sp-shape sp-trapezoid" title="Heart Notes">■</span>
            <div class="sp-badge-meta">
              <strong>Heart</strong>
              <small>${currentLang === 'ar' ? '15 دقيقة إلى 3 ساعات' : '15 min to 3 h'}</small>
            </div>
          </div>
          <div class="sp-pills-col">${renderNotePills(d.middle_notes, '#ec4899')}</div>
        </div>
      ` : ''}
      ${d.base_notes ? `
        <div class="sp-level-row">
          <div class="sp-badge-col">
            <span class="sp-shape sp-square" title="Base Notes">◼</span>
            <div class="sp-badge-meta">
              <strong>Base</strong>
              <small>${currentLang === 'ar' ? '3 ساعات وأكثر' : '3 h and more'}</small>
            </div>
          </div>
          <div class="sp-pills-col">${renderNotePills(d.base_notes, '#b45309')}</div>
        </div>
      ` : ''}
    </div>`;
  }

  function renderPerformanceCardsHtml(d) {
    const longVal = d.longevity || 3;
    const silVal  = d.sillage || 2;
    return `<div class="perf-cards-row">
      <div class="perf-metric-box">
        <span class="perf-metric-tag">${currentLang === 'ar' ? 'الثبات · LONGEVITY' : 'LONGEVITY'}</span>
        <strong class="perf-metric-val">${longevityLabels[longVal] || '4-6hrs'}</strong>
        ${renderPerfBars(longVal)}
      </div>
      <div class="perf-metric-box">
        <span class="perf-metric-tag">${currentLang === 'ar' ? 'الانتشار · SILLAGE' : 'SILLAGE'}</span>
        <strong class="perf-metric-val">${sillageLabels[silVal] || 'Moderate'}</strong>
        ${renderPerfBars(silVal)}
      </div>
    </div>`;
  }

  // ── Advanced Arabic & Multilingual Search Normalizer ───────────────────────
  function normalizeSearchText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove latin diacritics/accents: è -> e
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '') // remove arabic tashkeel / harakat
      .replace(/[^a-z0-9\u0621-\u064A\s]/gi, ' ')
      .trim();
  }

  const SEARCH_STOPWORDS = new Set(['عطر', 'عطور', 'براند', 'ماركه', 'ماركة', 'عطرين', 'perfume', 'scent', 'brand', 'fragrance']);

  const BRAND_SEARCH_ALIASES = {
    'matiere premiere': 'ماتيير بريمير ماتير premiere matiere',
    'matière première': 'ماتيير بريمير ماتير premiere matiere',
    'ibraq': 'ابراق إبراق ibraq',
    'إبراق': 'ابراق إبراق ibraq',
    'rou7': 'روح رُوح rou7 perfume',
    'رُوح': 'روح رُوح rou7 perfume'
  };

  const CATEGORY_SEARCH_ALIASES = {
    women: 'women نسائي حريمي بناتي بنات ستات for her',
    men: 'men رجالي شبابي رجال شباب for him',
    unisex: 'unisex للجميع مشترك للجنسين الكل unisex'
  };

  function productMatchesQuery(product, queryText) {
    if (!queryText) return true;
    const qNorm = normalizeSearchText(queryText);
    if (!qNorm) return true;

    const d = unpackProduct(product);
    const pCat = (product.category || 'unisex').toLowerCase();
    const normCat = (pCat === 'women' || pCat.includes('نسائ') || pCat.includes('her')) ? 'women'
      : (pCat === 'men' || pCat.includes('رجال') || pCat.includes('him')) ? 'men' : 'unisex';

    // Fast-path gender check
    if (qNorm === 'نسائي' || qNorm === 'حريمي' || qNorm === 'بناتي' || qNorm === 'women' || qNorm === 'for her') {
      return normCat === 'women';
    }
    if (qNorm === 'رجالي' || qNorm === 'شبابي' || qNorm === 'men' || qNorm === 'for him') {
      return normCat === 'men';
    }
    if (qNorm === 'للجميع' || qNorm === 'مشترك' || qNorm === 'للجنسين' || qNorm === 'unisex') {
      return normCat === 'unisex';
    }

    const prodBrand = (d.brand || product.brand || 'رُوح');
    const brandAlias = BRAND_SEARCH_ALIASES[prodBrand.toLowerCase()] || BRAND_SEARCH_ALIASES[prodBrand] || '';
    const catAlias = CATEGORY_SEARCH_ALIASES[normCat] || '';

    const haystack = normalizeSearchText(
      `${product.name} ${product.latin || ''} ${prodBrand} ${brandAlias} ${d.brand_ar || ''} ${catAlias} ${d.notes} ${d.top_notes} ${d.middle_notes} ${d.base_notes} ${d.inspired_by} ${d.accords}`
    );

    if (haystack.includes(qNorm)) return true;

    const rawTokens = qNorm.split(/\s+/).filter(Boolean);
    const tokens = rawTokens.filter(t => !SEARCH_STOPWORDS.has(t));
    const toCheck = tokens.length > 0 ? tokens : rawTokens;

    return toCheck.every(tok => haystack.includes(tok));
  }

  // ── Live Instant Search Dropdown Renderer ─────────────────────────────────
  function renderSearchDropdown(queryText) {
    const dropdown = $('#searchLiveDropdown');
    const header = $('#searchLiveHeader');
    const list = $('#searchLiveList');
    const footer = $('#searchLiveFooter');
    const clearBtn = $('#searchClearBtn');
    if (!dropdown) return;

    const trimmed = (queryText || '').trim();
    if (!trimmed) {
      dropdown.hidden = true;
      if (clearBtn) clearBtn.hidden = true;
      return;
    }

    if (clearBtn) clearBtn.hidden = false;

    const matches = products.filter(p => {
      if (p.name === '__system_announcements__' || p.in_stock === false) return false;
      return productMatchesQuery(p, trimmed);
    });

    dropdown.hidden = false;

    const isAr = currentLang === 'ar';

    if (matches.length > 0) {
      if (header) {
        header.innerHTML = `
          <span>${isAr ? 'عطور مطابقة لبحثك' : 'Matching Fragrances'}</span>
          <span class="badge">${isAr ? `${matches.length} عطور` : `${matches.length} results`}</span>
        `;
      }

      if (list) {
        list.innerHTML = matches.map(p => {
          const d = unpackProduct(p);
          const pName = isAr ? p.name : (p.latin || p.name);
          const pSub  = isAr ? (p.latin || '') : (p.latin ? p.name : '');
          const pBrand = d.brand || 'رُوح';
          const pImg = p.image_url || 'assets/branding/logo-dark.png';
          const pricing = computeProductPrice(p);

          const priceHtml = pricing.hasDiscount
            ? `
              <div class="live-price-group">
                <span class="search-item-price price-sale">${money(pricing.price)}</span>
                <del class="live-old-price">${money(pricing.originalPrice)}</del>
                <span class="live-discount-tag">${escapeHtml(pricing.discountBadge || `-${pricing.discountPercent}%`)}</span>
              </div>
            `
            : `<span class="search-item-price">${money(pricing.price)}</span>`;

          return `
            <div class="search-live-item" data-id="${p.id}" tabindex="0">
              <div class="search-item-thumb">
                <img src="${escapeHtml(pImg)}" alt="${escapeHtml(pName)}" loading="lazy">
              </div>
              <div class="search-item-info">
                <span class="search-item-brand">${escapeHtml(pBrand)}</span>
                <h4 class="search-item-name">${escapeHtml(pName)}</h4>
                ${pSub ? `<span class="search-item-latin">${escapeHtml(pSub)}</span>` : ''}
              </div>
              <div class="search-item-price-col">
                ${priceHtml}
                <button type="button" class="search-item-btn live-add-btn" data-add-id="${p.id}">
                  ${isAr ? '＋ أضف للسلة' : '＋ Add'}
                </button>
              </div>
            </div>
          `;
        }).join('');

        list.querySelectorAll('.search-live-item').forEach(item => {
          item.addEventListener('click', e => {
            if (e.target.closest('.live-add-btn')) return;
            const id = item.dataset.id;
            window.location.href = `product.html?id=${encodeURIComponent(id)}`;
          });
        });

        list.querySelectorAll('.live-add-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = btn.dataset.addId;
            addToCart(id, btn);
          });
        });
      }

      if (footer) {
        footer.innerHTML = `
          <button type="button" class="search-footer-btn" id="searchShowInCollectionBtn">
            <span>${isAr ? `تصفح كل النتائج في المتجر (${matches.length})` : `View all results in store (${matches.length})`}</span>
            <span>←</span>
          </button>
        `;
        $('#searchShowInCollectionBtn')?.addEventListener('click', () => {
          dropdown.hidden = true;
          $('#searchBar')?.classList.remove('open');
          query = trimmed;
          renderProducts();
          document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } else {
      if (header) {
        header.innerHTML = `<span>${isAr ? 'نتائج البحث' : 'Search Results'}</span><span class="badge">0</span>`;
      }
      if (list) {
        const topSugg = products.filter(p => p.name !== '__system_announcements__' && p.in_stock !== false).slice(0, 5);
        list.innerHTML = `
          <div class="search-empty-state">
            <span class="search-empty-icon">🔍</span>
            <h4 class="search-empty-title">${isAr ? `لم نجد عطراً يطابق "${escapeHtml(trimmed)}"` : `No perfumes match "${escapeHtml(trimmed)}"`}</h4>
            <p class="search-empty-desc">${isAr ? 'تأكد من كتابة الاسم بشكل صحيح، أو جرّب البحث باسم البراند أو مكونات العطر.' : 'Check the spelling, or try searching by brand or notes.'}</p>
            <div class="search-suggestions-title">${isAr ? 'عطور مميزة قد تناسبك:' : 'Suggested perfumes:'}</div>
            <div class="search-suggestions-chips">
              ${topSugg.map(sp => `
                <button type="button" class="search-sugg-chip" data-search-term="${escapeHtml(sp.name)}">
                  ${escapeHtml(sp.name)}
                </button>
              `).join('')}
            </div>
          </div>
        `;

        list.querySelectorAll('.search-sugg-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const term = chip.dataset.searchTerm;
            const input = $('#searchInput');
            if (input) {
              input.value = term;
              input.dispatchEvent(new Event('input'));
              input.focus();
            }
          });
        });
      }

      if (footer) {
        footer.innerHTML = `
          <button type="button" class="search-footer-btn" id="searchResetViewBtn">
            <span>${isAr ? 'عرض كل العطور' : 'Browse All Fragrances'}</span>
            <span>←</span>
          </button>
        `;
        $('#searchResetViewBtn')?.addEventListener('click', () => {
          dropdown.hidden = true;
          $('#searchBar')?.classList.remove('open');
          const input = $('#searchInput');
          if (input) input.value = '';
          query = '';
          renderProducts();
          document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }

  function initMoodPortal() {
    const track = $('#moodCardsTrack');
    const soundToggle = $('#moodSoundToggle');
    const soundText = $('#moodSoundText');
    const resetBtn = $('#moodResetBtn');
    const activeBanner = $('#moodActiveBanner');
    const mabTitle = $('#mabTitle');
    const mabDesc = $('#mabDesc');
    const mabIcon = $('#mabIcon');
    const mabClose = $('#mabCloseBtn');
    const portalSection = $('#moodPortalSection');

    if (!track) return;

    function applyMood(moodKey) {
      activeMood = moodKey;
      const isAr = currentLang === 'ar';

      track.querySelectorAll('.mood-card').forEach(card => {
        const isMatch = card.dataset.mood === moodKey;
        card.classList.toggle('active', isMatch);
        card.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (moodKey && MOOD_PROFILES[moodKey]) {
        const prof = MOOD_PROFILES[moodKey];
        if (activeBanner) activeBanner.style.display = 'flex';
        if (resetBtn) resetBtn.style.display = 'inline-flex';
        if (mabIcon) mabIcon.textContent = prof.icon;
        if (mabTitle) mabTitle.textContent = isAr ? `أجواء اللحظة: ${prof.ar}` : `Atmosphere: ${prof.en}`;
        if (mabDesc) mabDesc.textContent = isAr ? `نعرض لك العطور المختارة بعناية لترافق ${prof.ar}` : `Showcasing fragrances harmonized with ${prof.en}`;
        if (portalSection) portalSection.style.borderColor = prof.auraColor;

        if (isMoodAudioPlaying) {
          homeAudio.playMoodAmbient(moodKey);
        }
      } else {
        if (activeBanner) activeBanner.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'none';
        if (portalSection) portalSection.style.borderColor = '';
        if (isMoodAudioPlaying) {
          homeAudio.stopAmbient();
          isMoodAudioPlaying = false;
          if (soundToggle) soundToggle.classList.remove('playing');
        }
      }

      renderProducts();
    }

    track.addEventListener('click', e => {
      const card = e.target.closest('.mood-card');
      if (!card) return;
      const targetMood = card.dataset.mood;
      if (activeMood === targetMood) {
        applyMood(null);
      } else {
        applyMood(targetMood);
      }
    });

    track.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.mood-card');
        if (card) {
          e.preventDefault();
          const targetMood = card.dataset.mood;
          applyMood(activeMood === targetMood ? null : targetMood);
        }
      }
    });

    resetBtn?.addEventListener('click', () => applyMood(null));
    mabClose?.addEventListener('click', () => applyMood(null));

    soundToggle?.addEventListener('click', () => {
      isMoodAudioPlaying = !isMoodAudioPlaying;
      const isAr = currentLang === 'ar';
      if (isMoodAudioPlaying) {
        soundToggle.classList.add('playing');
        homeAudio.playMoodAmbient(activeMood || 'winter_cozy');
        if (soundText) soundText.textContent = isAr ? 'همس الأجواء: شغال' : 'Audio: Playing';
      } else {
        soundToggle.classList.remove('playing');
        homeAudio.stopAmbient();
        if (soundText) soundText.textContent = isAr ? 'همس الأجواء' : 'Atmosphere Audio';
      }
    });
  }

  function renderProducts() {
    const t = I18N[currentLang];

    // Update Brand Filter Dropdown & Chips
    const brandSel = $('#collectionBrandFilter');
    const brandChipsBar = $('#brandChipsBar');
    const allBrands = Array.from(new Set(products.map(p => {
      if (p.name === '__system_announcements__' || p.in_stock === false) return null;
      const d = unpackProduct(p);
      return (d.brand || 'رُوح').trim();
    }).filter(Boolean))).sort();

    if (brandSel) {
      const prevBrandVal = brandSel.value || activeBrand || 'all';
      brandSel.innerHTML = `<option value="all">${currentLang === 'ar' ? 'كل البراندات (All Brands)' : 'All Brands'}</option>` +
        allBrands.map(b => `<option value="${escapeHtml(b)}" ${b.toLowerCase() === prevBrandVal.toLowerCase() ? 'selected' : ''}>${escapeHtml(b)}</option>`).join('');
    }

    if (brandChipsBar) {
      const isAllActive = activeBrand === 'all' ? 'active' : '';
      let chipsHtml = `<button type="button" class="brand-chip ${isAllActive}" data-brand-chip="all">${currentLang === 'ar' ? '✨ كل البراندات' : '✨ All Brands'}</button>`;
      allBrands.forEach(b => {
        const isAct = activeBrand.toLowerCase() === b.toLowerCase() ? 'active' : '';
        chipsHtml += `<button type="button" class="brand-chip ${isAct}" data-brand-chip="${escapeHtml(b)}">${escapeHtml(b)}</button>`;
      });
      brandChipsBar.innerHTML = chipsHtml;
    }

    const visible = products.filter(product => {
      if (product.name === '__system_announcements__' || product.in_stock === false) return false;
      const d = unpackProduct(product);
      const prodBrand = (d.brand || 'رُوح').toLowerCase();
      const pCat = (product.category || 'unisex').toLowerCase();
      const normCat = (pCat === 'women' || pCat.includes('نسائ') || pCat.includes('her')) ? 'women'
        : (pCat === 'men' || pCat.includes('رجال') || pCat.includes('him')) ? 'men' : 'unisex';

      // 1. Gender Filter: 'all', 'women', 'men', 'unisex'
      if (activeFilter !== 'all') {
        if (normCat !== activeFilter) return false;
      }

      // 2. Brand Filter: 'all' or specific brand
      if (activeBrand !== 'all') {
        if (prodBrand !== activeBrand.toLowerCase()) return false;
      }

      // 3. Search Query (Normalized multilingual name, latin, brand, notes, accords, etc.)
      if (query) {
        if (!productMatchesQuery(product, query)) return false;
      }

      return true;
    });

    // Sorting & Mood Matching
    if (activeMood) {
      visible.sort((a, b) => {
        const scoreB = getProductMoodScore(b, activeMood);
        const scoreA = getProductMoodScore(a, activeMood);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
    } else {
      const sortMode = $('#collectionSort')?.value || 'featured';
      if (sortMode === 'price-asc') {
        visible.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      } else if (sortMode === 'price-desc') {
        visible.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      } else if (sortMode === 'name') {
        visible.sort((a, b) => (a.name || '').localeCompare(b.name || '', currentLang === 'ar' ? 'ar' : 'en'));
      } else {
        visible.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      }
    }

    $('#productGrid').innerHTML = products.length
      ? visible.map(product => {
          const d = unpackProduct(product);
          const pricing = computeProductPrice(product);
          const prodName = currentLang === 'en' ? (product.latin || product.name) : product.name;
          const prodSub  = currentLang === 'en' ? (product.latin ? product.name : '') : (product.latin || '');
          const prodBrand = d.brand || 'رُوح';

          const tagHtml = pricing.hasDiscount
            ? `<span class="product-tag tag-discount">${escapeHtml(pricing.discountBadge)}</span>`
            : (product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : '');

          const priceHtml = pricing.hasDiscount
            ? `<div class="product-price-wrap">
                <span class="product-price-val price-sale">${money(pricing.price)}</span>
                <del class="product-old-price">${money(pricing.originalPrice)}</del>
               </div>`
            : `<span class="product-price-val">${money(pricing.price)}</span>`;

          // Key notes preview
          let notesPreview = '';
          if (d.top_notes || d.middle_notes || d.base_notes) {
            const rawParts = [d.top_notes, d.middle_notes, d.base_notes].filter(Boolean).join(',').split(/[,،]/).map(s => s.trim()).filter(Boolean).slice(0, 3);
            if (rawParts.length) {
              notesPreview = `<div class="card-keynotes-pills">${rawParts.map(n => `<span class="ck-pill">${escapeHtml(n)}</span>`).join('')}</div>`;
            }
          }

          // Mood match indicator
          const moodScore = activeMood ? getProductMoodScore(product, activeMood) : 0;
          const moodProfile = activeMood ? MOOD_PROFILES[activeMood] : null;
          const moodMatchPillHtml = (moodProfile && moodScore > 0)
            ? `<div class="card-mood-match-pill"><span class="cmm-icon">${moodProfile.icon}</span> ${currentLang === 'ar' ? moodProfile.badgeAr : moodProfile.badgeEn}</div>`
            : '';

          return `<article class="product-card" data-product-id="${product.id}">
            <div class="product-image">
              <a href="product.html?id=${product.id}" class="product-thumb-link" aria-label="${escapeHtml(prodName)}">
                ${product.image_url ? `<img src="${product.image_url}" alt="${escapeHtml(prodName)}" loading="lazy">` : ''}
              </a>
              ${tagHtml}
              <button class="quick-add" data-add="${product.id}" type="button">${t.quick_add} <span>＋</span></button>
            </div>
            <div class="product-info">
              <span class="card-brand-badge" data-brand-filter="${escapeHtml(prodBrand)}">${escapeHtml(prodBrand)}</span>
              <div class="product-meta">
                <h3><a href="product.html?id=${product.id}" class="prod-title-link">${escapeHtml(prodName)}</a> ${prodSub ? `<small style="font-size:10px;opacity:.7;display:block;">${escapeHtml(prodSub)}</small>` : ''}</h3>
                ${priceHtml}
              </div>
              ${d.inspired_by ? `<div class="card-inspired-tag"><span class="ci-label">${currentLang === 'ar' ? 'مستوحى من' : 'Inspired by'}</span> <strong>${escapeHtml(d.inspired_by)}</strong></div>` : ''}
              ${notesPreview}
              ${moodMatchPillHtml}
              <p class="product-desc">${escapeHtml(d.notes || '')}</p>
              ${d.accords ? `<div class="card-accords-row">${renderAccordPills(d.accords)}</div>` : ''}
              <div class="card-action-links">
                <a href="product.html?id=${product.id}" class="btn-explore-notes"><span>✦</span> ${currentLang === 'ar' ? 'تفاصيل وتحليل العطر' : 'Fragrance Profile & Notes'}</a>
                <button type="button" class="btn-card-quickview" data-quickview="${product.id}" title="${currentLang === 'ar' ? 'نظرة سريعة على النوتات' : 'Quick View'}">
                  <span>👁️</span>
                </button>
              </div>
            </div>
          </article>`;
        }).join('') || `<div class="search-no-results-box" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
          <span style="font-size: 38px; display: block; margin-bottom: 12px; opacity: .8;">🔍</span>
          <h3 style="font-size: 18px; margin: 0 0 8px; color: var(--ink); font-weight: 500;">${currentLang === 'ar' ? 'لم نجد أي عطر يطابق بحثك' : 'No Fragrances Found'}</h3>
          <p style="font-size: 13px; color: var(--muted); margin: 0 0 20px;">${currentLang === 'ar' ? 'جرّب البحث بكلمة أخرى، أو باسم البراند، أو تصفح كل العطور.' : 'Try a different keyword or browse all fragrances.'}</p>
          <button type="button" class="button button-primary" id="btnResetSearchGrid" style="border-radius: 999px;">${currentLang === 'ar' ? 'عرض كل العطور' : 'View All Fragrances'}</button>
        </div>`
      : `<div class="catalog-empty"><span>✳</span><h3>${currentLang === 'ar' ? 'قريباً، عطور رُوح هنا' : 'Rou7 Fragrances Coming Soon'}</h3></div>`;

    const countText = currentLang === 'ar'
      ? `${arabicDigits(visible.length)} ${visible.length === 1 ? 'عطر' : 'عطور'}`
      : `${visible.length} ${visible.length === 1 ? 'fragrance' : 'fragrances'}`;
    $('#resultCount').textContent = countText;
  }

  // Collection sort listener
  $('#collectionSort')?.addEventListener('change', () => {
    renderProducts();
  });

  // Collection Brand Filter listeners
  $('#collectionBrandFilter')?.addEventListener('change', e => {
    activeBrand = e.target.value;
    renderProducts();
  });

  $('#brandChipsBar')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-brand-chip]');
    if (chip) {
      activeBrand = chip.dataset.brandChip;
      if ($('#collectionBrandFilter')) $('#collectionBrandFilter').value = activeBrand;
      renderProducts();
    }
  });

  // Card Brand Badge click listener (filter by clicked brand)
  $('#productGrid')?.addEventListener('click', e => {
    const brandBadge = e.target.closest('[data-brand-filter]');
    if (brandBadge) {
      activeBrand = brandBadge.dataset.brandFilter;
      if ($('#collectionBrandFilter')) $('#collectionBrandFilter').value = activeBrand;
      renderProducts();
      document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ── Product Details Modal Handler ─────────────────────────────────────────
  const detailModal = $('#productDetailsModal');
  const detailBody  = $('#productDetailBody');

  function openProductDetailModal(productId) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product || !detailModal || !detailBody) return;

    const d = unpackProduct(product);
    const prodName = currentLang === 'en' ? (product.latin || product.name) : product.name;
    const prodSub  = currentLang === 'en' ? (product.latin ? product.name : '') : (product.latin || '');
    const t = I18N[currentLang];

    detailBody.innerHTML = `
      <div class="detail-header-section">
        <div class="detail-media">
          ${product.image_url ? `<img src="${product.image_url}" alt="${escapeHtml(prodName)}">` : '<span class="detail-placeholder">🧴</span>'}
        </div>
        <div class="detail-title-col">
          <p class="eyebrow"><span></span> ${currentLang === 'ar' ? 'تفاصيل العطر' : 'Fragrance Profile'}</p>
          <h2 id="detailProdName">${escapeHtml(prodName)}</h2>
          ${prodSub ? `<p class="detail-sub">${escapeHtml(prodSub)}</p>` : ''}
          <div class="detail-price-row">
            <span class="detail-price">${money(product.price)}</span>
            <button class="button button-primary detail-add-btn" data-add="${product.id}">${t.quick_add} <span>＋</span></button>
          </div>
        </div>
      </div>

      ${d.notes ? `<div class="detail-desc-box"><p>${escapeHtml(d.notes)}</p></div>` : ''}

      <div class="detail-sections-grid">
        ${renderScentPyramidHtml(d)}
        <div class="detail-side-perf">
          ${renderPerformanceCardsHtml(d)}
          ${d.accords ? `<div class="detail-accords-box"><div class="accords-list">${renderAccordPills(d.accords)}</div></div>` : ''}
          ${renderInspiredHtml(d.inspired_by)}
        </div>
      </div>
    `;

    detailModal.classList.add('open');
  }

  function closeProductDetailModal() {
    if (detailModal) detailModal.classList.remove('open');
  }

  $('#detailModalClose')?.addEventListener('click', closeProductDetailModal);
  detailModal?.addEventListener('click', e => {
    if (e.target === detailModal) {
      closeProductDetailModal();
      return;
    }
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      addToCart(addBtn.dataset.add, addBtn);
    }
  });

  window.roohStore = {
    setProducts(rows) {
      products = Array.isArray(rows) ? rows : [];
      try { localStorage.setItem('rooh-cached-products', JSON.stringify(products)); } catch (_) {}
      renderProducts();
      renderHeroProduct();
      renderStorySpotlight();
      updateCart();
    }
  };

  // Render cached products immediately on initial execution
  if (products.length) {
    renderProducts();
    renderHeroProduct();
    renderStorySpotlight();
  }

  // ── Load products from Supabase (Once on load + Realtime) ───────────────────
  function loadProductsFromSupa() {
    supaFetch('products', { filters: '&in_stock=eq.true&order=sort_order.asc,created_at.desc' })
      .then(rows => {
        if (Array.isArray(rows)) {
          window.roohStore.setProducts(rows);
        }
      })
      .catch(err => console.error('ROOH: خطأ في تحميل المنتجات:', err));
  }

  loadProductsFromSupa();

  // Non-blocking Realtime subscription
  function initStoreRealtime() {
    if (!window.supabase) return;
    try {
      const storeRealtime = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      storeRealtime.channel('store-products-feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          console.log('ROOH: Realtime product change');
          loadProductsFromSupa();
          loadAnnouncements();
        })
        .subscribe();
    } catch (e) {
      console.warn('Store realtime error:', e);
    }
  }

  if (window.supabase) {
    initStoreRealtime();
  } else {
    window.addEventListener('load', () => {
      let tries = 0;
      const t = setInterval(() => {
        if (window.supabase) {
          clearInterval(t);
          initStoreRealtime();
        } else if (++tries > 12) {
          clearInterval(t);
        }
      }, 500);
    });
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function saveCart() {
    try { localStorage.setItem('rooh-cart', JSON.stringify(cart)); } catch (_) {}
  }

  function triggerFlyToCart(originEl) {
    if (!originEl) return;
    const cartBtn = $('#cartToggle');
    if (!cartBtn) return;
    const originRect = originEl.getBoundingClientRect();
    const targetRect = cartBtn.getBoundingClientRect();

    const dot = document.createElement('div');
    dot.className = 'flying-cart-dot';
    dot.style.left = `${originRect.left + originRect.width / 2 - 7}px`;
    dot.style.top = `${originRect.top + originRect.height / 2 - 7}px`;
    document.body.appendChild(dot);

    void dot.offsetWidth; // Force reflow

    dot.style.transform = `translate(${targetRect.left - originRect.left}px, ${targetRect.top - originRect.top}px) scale(0.3)`;
    dot.style.opacity = '0';

    setTimeout(() => {
      dot.remove();
      cartBtn.classList.remove('cart-bounce');
      void cartBtn.offsetWidth;
      cartBtn.classList.add('cart-bounce');
    }, 650);
  }

  function updateCart() {
    cart = cart.filter(row => row.qty > 0 && products.some(product => product.id === row.id));
    const count = cart.reduce((sum, row) => sum + row.qty, 0);
    $('#cartCount').textContent = formatDigits(count);
    $('#drawerCount').textContent = `(${formatDigits(count)})`;
    $('#cartEmpty').classList.toggle('show', count === 0);
    $('#cartSummary').classList.toggle('empty', count === 0);

    $('#cartItems').innerHTML = cart.map(row => {
      const product = products.find(item => item.id === row.id);
      if (!product) return '';
      const prodName = currentLang === 'en' ? (product.latin || product.name) : product.name;
      const unitPrice = row.customPrice || product.price;
      const priceDisplay = row.customPrice && row.customPrice < product.price
        ? `<span>${money(unitPrice)}</span> <del style="font-size:11px; opacity:0.6; margin-inline-start:4px;">${money(product.price)}</del>`
        : money(unitPrice);
      return `<div class="cart-row">
        <div class="cart-thumb">${product.image_url ? `<img src="${product.image_url}" alt="" loading="lazy">` : ''}</div>
        <div>
          <h3>${escapeHtml(prodName)}</h3>
          <p>${priceDisplay}</p>
          <div class="qty">
            <button data-qty="${product.id}" data-step="-1" aria-label="تقليل">−</button>
            <span>${formatDigits(row.qty)}</span>
            <button data-qty="${product.id}" data-step="1" aria-label="زيادة">＋</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${product.id}" aria-label="حذف ${escapeHtml(prodName)}">×</button>
      </div>`;
    }).join('');

    const total = cart.reduce((sum, row) => sum + (row.customPrice || products.find(p => p.id === row.id)?.price || 0) * row.qty, 0);
    $('#cartTotal').textContent = money(total);
    $('#checkoutTotal').textContent = money(total);

    // Free shipping tracker
    const freeShipThreshold = 1500;
    const freeShipBar = $('#freeShippingBar');
    const freeShipFill = $('#freeShippingFill');
    const freeShipLabel = $('#freeShippingLabel');
    if (freeShipBar && freeShipFill && freeShipLabel) {
      const remaining = freeShipThreshold - total;
      if (count === 0) {
        freeShipBar.classList.remove('fs-unlocked');
        freeShipFill.style.width = '0%';
        freeShipLabel.innerHTML = currentLang === 'ar'
          ? `متبقي <strong>${money(freeShipThreshold)}</strong> للحصول على شحن مجاني 🚚`
          : `Add <strong>${money(freeShipThreshold)}</strong> more for FREE shipping 🚚`;
      } else if (remaining <= 0) {
        freeShipBar.classList.add('fs-unlocked');
        freeShipFill.style.width = '100%';
        freeShipLabel.innerHTML = currentLang === 'ar'
          ? '🎉 <strong>مبروك!</strong> طلبك مؤهل للشحن المجاني بالكامل!'
          : '🎉 <strong>Congrats!</strong> You unlocked FREE shipping!';
      } else {
        freeShipBar.classList.remove('fs-unlocked');
        const pct = Math.min(Math.max((total / freeShipThreshold) * 100, 0), 100);
        freeShipFill.style.width = `${pct}%`;
        freeShipLabel.innerHTML = currentLang === 'ar'
          ? `متبقي <strong>${money(remaining)}</strong> للحصول على شحن مجاني 🚚`
          : `Add <strong>${money(remaining)}</strong> more for FREE shipping 🚚`;
      }
    }

    saveCart();
  }

  function addToCart(id, originBtn = null, customPrice = null) {
    const product = products.find(p => String(p.id) === String(id));
    const pricing = product ? computeProductPrice(product) : null;
    const finalPrice = customPrice !== null ? customPrice : (pricing && pricing.hasDiscount ? pricing.price : null);

    const row = cart.find(item => String(item.id) === String(id));
    if (row) {
      row.qty++;
      if (finalPrice) row.customPrice = finalPrice;
    } else {
      cart.push({ id: String(id), qty: 1, ...(finalPrice ? { customPrice: finalPrice } : {}) });
    }
    updateCart();

    // Visual button feedback & fly-to-cart animation
    if (originBtn) {
      originBtn.classList.add('btn-added');
      const prevHtml = originBtn.innerHTML;
      originBtn.innerHTML = `<span>✓</span> <span>${I18N[currentLang].added_to_cart || 'تمت الإضافة'}</span>`;
      setTimeout(() => {
        originBtn.classList.remove('btn-added');
        originBtn.innerHTML = prevHtml;
      }, 1400);
      triggerFlyToCart(originBtn);
    }

    showToast(I18N[currentLang].toast_added);
  }

  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderProducts();
  }));

  $('#productGrid').addEventListener('click', event => {
    const qvBtn = event.target.closest('[data-quickview], [data-explore]');
    if (qvBtn) {
      event.preventDefault();
      event.stopPropagation();
      openProductDetailModal(qvBtn.dataset.quickview || qvBtn.dataset.explore);
      return;
    }
    const button = event.target.closest('[data-add]');
    if (button) {
      addToCart(button.dataset.add, button);
    }
  });

  // Hero section add-to-bag with button animation
  $('#heroProduct').addEventListener('click', event => {
    const button = event.target.closest('.btn-hero-quickadd');
    if (button && button.dataset.add) {
      event.preventDefault();
      event.stopPropagation();
      addToCart(button.dataset.add, button);
    }
  });

  // ── Scent Finder Interactive Quiz ──────────────────────────────────────────
  const quizModal = $('#scentQuizModal');
  const quizContainer = $('#quizContainer');
  let quizStep = 0;
  let quizAnswers = { category: '', mood: '', occasion: '' };

  const quizQuestions = [
    {
      title_ar: '١. لمن تختار هذا العطر؟',
      title_en: '1. Who is this fragrance for?',
      desc_ar: 'اختر لمن سيترك هذا العطر أثره الخاص',
      desc_en: 'Select who will leave this signature scent',
      key: 'category',
      options: [
        { val: 'men', icon: '👔', t_ar: 'لي أنا (عطر رجالي)', t_en: 'For Me (Men)', s_ar: 'نفحات رجالية أنيقة وقوية', s_en: 'Bold & elegant masculine notes' },
        { val: 'women', icon: '👗', t_ar: 'لي أنا (عطر نسائي)', t_en: 'For Me (Women)', s_ar: 'أنوثة ناعمة وجاذبية ساحرة', s_en: 'Soft & alluring feminine aura' },
        { val: 'unisex', icon: '✨', t_ar: 'عطر للجميع (Unisex)', t_en: 'Unisex Fragrance', s_ar: 'توازن فاخر يناسب كل الأذواق', s_en: 'Balanced luxury for everyone' },
        { val: 'gift', icon: '🎁', t_ar: 'هدية راقية لشخص مميز', t_en: 'A Luxury Gift', s_ar: 'عطر يترك ذكرى لا تُنسى', s_en: 'A gift made to be remembered' }
      ]
    },
    {
      title_ar: '٢. ما هو الإحساس أو الطابع الأقرب لقلبك؟',
      title_en: '2. What is your preferred scent mood?',
      desc_ar: 'الرائحة التي تشعر أنها تلامس روحك وتعبّر عنك',
      desc_en: 'The scent that feels closest to your personality',
      key: 'mood',
      options: [
        { val: 'sweet', icon: '🍦', t_ar: 'فانيليا وسكريات دافئة (Sweet & Vanilla)', t_en: 'Sweet & Vanilla', s_ar: 'فانيليا ناعمة، لمسة سكرية وكراميل', s_en: 'Velvety vanilla & cozy gourmand' },
        { val: 'woody', icon: '🪵', t_ar: 'أخشاب وعنبر فاخر (Woody & Amber)', t_en: 'Woody & Amber', s_ar: 'صندل، خشب كشمير وعنبر أصيل', s_en: 'Rich amber, sandalwood & cashmeran' },
        { val: 'fresh', icon: '🍋', t_ar: 'منعش ونقي (Fresh & Citrus)', t_en: 'Fresh & Clean', s_ar: 'برغموت منعش ونفحات زهور بيضاء', s_en: 'Crisp bergamot & uplifting florals' },
        { val: 'spicy', icon: '🌙', t_ar: 'شرقي غامض وجريء (Spicy & Bold)', t_en: 'Spicy & Oriental', s_ar: 'زعفران، توابل راقية وأثر لا يُقاوم', s_en: 'Exotic saffron & hypnotic spices' }
      ]
    },
    {
      title_ar: '٣. ما هي المناسبة الأكثر ملاءمة لاستخدامك؟',
      title_en: '3. What is your primary occasion?',
      desc_ar: 'متى تحب أن يفوح عطرك؟',
      desc_en: 'When do you want your perfume to radiate?',
      key: 'occasion',
      options: [
        { val: 'daily', icon: '💼', t_ar: 'يومي وللعمل والجامعة', t_en: 'Daily & Casual / Office', s_ar: 'فوحان متوازن ومريح طوال اليوم', s_en: 'Subtle projection & all-day comfort' },
        { val: 'evening', icon: '🕯️', t_ar: 'سهرات ومناسبات خاصة وفخمة', t_en: 'Evenings & Special Events', s_ar: 'ثبات خيالي وحضور طاغٍ يلفت الأنظار', s_en: 'Heavy sillage & captivating presence' },
        { val: 'winter', icon: '🍂', t_ar: 'أجواء الشتاء والخريف الباردة', t_en: 'Fall & Winter Coziness', s_ar: 'دفء مغناطيسي يحيط بك بنعومة', s_en: 'Deep enveloping warmth' },
        { val: 'signature', icon: '🔄', t_ar: 'عطر توقيع دائم لكل الأوقات', t_en: 'Signature Scent for All Times', s_ar: 'عطرك الثابت الذي يتذكرك به الجميع', s_en: 'Your undeniable trademark everywhere' }
      ]
    }
  ];

  function openScentQuiz() {
    quizStep = 0;
    quizAnswers = { category: '', mood: '', occasion: '' };
    renderQuizStep();
    quizModal?.classList.add('open');
  }

  function closeScentQuiz() {
    quizModal?.classList.remove('open');
  }

  function renderQuizStep() {
    if (!quizContainer) return;
    const isAr = currentLang === 'ar';

    if (quizStep < quizQuestions.length) {
      const q = quizQuestions[quizStep];
      const dotsHtml = quizQuestions.map((_, i) => `<span class="quiz-dot ${i <= quizStep ? 'active' : ''}"></span>`).join('');

      quizContainer.innerHTML = `
        <div class="quiz-header">
          <div class="quiz-step-dots">${dotsHtml}</div>
          <h3 class="quiz-question-title">${isAr ? q.title_ar : q.title_en}</h3>
          <p class="quiz-question-desc">${isAr ? q.desc_ar : q.desc_en}</p>
        </div>
        <div class="quiz-options-grid">
          ${q.options.map(opt => `
            <button type="button" class="quiz-opt-btn" data-quiz-val="${opt.val}" data-quiz-key="${q.key}">
              <span class="quiz-opt-icon">${opt.icon}</span>
              <div class="quiz-opt-text">
                <strong>${isAr ? opt.t_ar : opt.t_en}</strong>
                <small>${isAr ? opt.s_ar : opt.s_en}</small>
              </div>
            </button>
          `).join('')}
        </div>
      `;
    } else {
      const available = products.filter(p => p.name !== '__system_announcements__' && p.in_stock !== false);
      let bestMatch = available[0];
      let bestScore = -1;

      available.forEach(p => {
        let score = 0;
        const d = unpackProduct(p);
        const combined = `${p.category} ${p.name} ${d.notes} ${d.top_notes} ${d.middle_notes} ${d.base_notes} ${d.accords}`.toLowerCase();

        if (quizAnswers.category && quizAnswers.category !== 'gift') {
          if (p.category === quizAnswers.category || p.category === 'unisex') score += 3;
        }
        if (quizAnswers.mood) {
          if (quizAnswers.mood === 'sweet' && (combined.includes('sweet') || combined.includes('vanilla') || combined.includes('حلو') || combined.includes('فانيليا'))) score += 5;
          if (quizAnswers.mood === 'woody' && (combined.includes('wood') || combined.includes('amber') || combined.includes('خشب') || combined.includes('عنبر'))) score += 5;
          if (quizAnswers.mood === 'fresh' && (combined.includes('fresh') || combined.includes('citrus') || combined.includes('منعش') || combined.includes('برغموت'))) score += 5;
          if (quizAnswers.mood === 'spicy' && (combined.includes('spic') || combined.includes('oriental') || combined.includes('زعفران') || combined.includes('شرقي'))) score += 5;
        }
        if (p.is_featured) score += 2;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = p;
        }
      });

      if (!bestMatch && available.length) bestMatch = available[0];
      const d = unpackProduct(bestMatch);
      const prodName = isAr ? bestMatch.name : (bestMatch.latin || bestMatch.name);
      const matchPct = 96 + Math.floor(Math.random() * 4);

      quizContainer.innerHTML = `
        <div class="quiz-result-card">
          <div class="quiz-match-pill">✨ ${isAr ? `نسبة التطابق العطري: ${arabicDigits(matchPct)}%` : `Fragrance Match: ${matchPct}%`}</div>
          ${bestMatch.image_url ? `<img src="${bestMatch.image_url}" alt="${escapeHtml(prodName)}" class="quiz-result-bottle">` : ''}
          <h3 class="quiz-result-title">${escapeHtml(prodName)}</h3>
          <p class="quiz-result-desc">${escapeHtml(d.notes || (isAr ? 'عطر فاخر يمزج بين النقاء والجاذبية والثبات العالي، مصمم ليعبر عن روحك في كل مناسبة.' : 'A masterfully balanced fragrance tailored to your personality and presence.'))}</p>
          <div class="quiz-result-actions">
            <a href="product.html?id=${bestMatch.id}" class="button button-primary">
              <span>${isAr ? 'استكشف هرم النوتات والتحليل' : 'Explore Scent DNA'}</span>
              <span class="arrow-icon">←</span>
            </a>
            <button type="button" class="button" style="background:rgba(255,255,255,0.08);border:1px solid var(--line);" data-add="${bestMatch.id}">
              <span>${isAr ? 'أضف للسلة' : 'Add to Bag'}</span> <span>＋</span>
            </button>
            <button type="button" class="btn-quiz-retry" id="quizRetryBtn">
              <span>${isAr ? 'إعادة الاستشارة ↺' : 'Retake Quiz ↺'}</span>
            </button>
          </div>
        </div>
      `;
    }
  }

  quizContainer?.addEventListener('click', e => {
    const optBtn = e.target.closest('.quiz-opt-btn');
    if (optBtn) {
      const key = optBtn.dataset.quizKey;
      const val = optBtn.dataset.quizVal;
      quizAnswers[key] = val;
      quizStep++;
      renderQuizStep();
      return;
    }
    const retryBtn = e.target.closest('#quizRetryBtn');
    if (retryBtn) {
      openScentQuiz();
      return;
    }
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      addToCart(addBtn.dataset.add, addBtn);
    }
  });

  $('#openQuizBtn')?.addEventListener('click', openScentQuiz);
  $('#quizModalClose')?.addEventListener('click', closeScentQuiz);

  $('#cartItems').addEventListener('click', event => {
    const qty = event.target.closest('[data-qty]');
    const remove = event.target.closest('[data-remove]');
    if (qty) {
      const row = cart.find(item => item.id === qty.dataset.qty);
      row.qty += Number(qty.dataset.step);
      if (row.qty <= 0) cart = cart.filter(item => item !== row);
      updateCart();
    }
    if (remove) {
      cart = cart.filter(item => item.id !== remove.dataset.remove);
      updateCart();
    }
  });

  function drawer(open) {
    $('#cartDrawer').classList.toggle('open', open);
    $('#overlay').classList.toggle('open', open);
    document.body.classList.toggle('drawer-open', open);
  }

  $('#cartToggle').addEventListener('click', () => drawer(true));
  $('#cartClose').addEventListener('click', () => drawer(false));
  $('#overlay').addEventListener('click', () => drawer(false));
  $('#continueShopping').addEventListener('click', () => drawer(false));

  themeButton.addEventListener('click', () => setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
  $('#mobileThemeToggle').addEventListener('click', () => {
    setTheme(document.body.classList.contains('light') ? 'dark' : 'light');
    $('#mobileMenu').classList.remove('open');
  });

  // Language switcher listeners
  function toggleLanguage() {
    setLanguage(currentLang === 'ar' ? 'en' : 'ar');
  }
  $('#langToggle')?.addEventListener('click', toggleLanguage);
  $('#mobileLangToggle')?.addEventListener('click', () => {
    toggleLanguage();
    $('#mobileMenu')?.classList.remove('open');
  });

  $('#menuToggle').addEventListener('click', () => $('#mobileMenu').classList.toggle('open'));
  $$('#mobileMenu a').forEach(link => link.addEventListener('click', () => $('#mobileMenu').classList.remove('open')));

  // ── Search Bar & Live Dropdown Event Handlers ─────────────────────────────
  $('#searchToggle')?.addEventListener('click', () => {
    const sb = $('#searchBar');
    sb?.classList.toggle('open');
    if (sb?.classList.contains('open')) {
      const input = $('#searchInput');
      input?.focus();
      if (input && input.value.trim()) {
        renderSearchDropdown(input.value.trim());
      }
    } else {
      const dropdown = $('#searchLiveDropdown');
      if (dropdown) dropdown.hidden = true;
    }
  });

  $('#searchClose')?.addEventListener('click', () => {
    $('#searchBar')?.classList.remove('open');
    const dropdown = $('#searchLiveDropdown');
    if (dropdown) dropdown.hidden = true;
    const input = $('#searchInput');
    if (input) input.value = '';
    const clearBtn = $('#searchClearBtn');
    if (clearBtn) clearBtn.hidden = true;
    query = '';
    renderProducts();
  });

  $('#searchClearBtn')?.addEventListener('click', () => {
    const input = $('#searchInput');
    if (input) input.value = '';
    query = '';
    renderSearchDropdown('');
    renderProducts();
    input?.focus();
  });

  $('#searchInput')?.addEventListener('input', event => {
    const val = event.target.value.trim();
    query = val;
    activeFilter = 'all';
    activeBrand = 'all';
    $$('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
    const brandSel = $('#collectionBrandFilter');
    if (brandSel) brandSel.value = 'all';
    const chipsBar = $('#brandChipsBar');
    if (chipsBar) {
      chipsBar.querySelectorAll('.brand-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.brandChip === 'all');
      });
    }

    renderSearchDropdown(val);
    renderProducts();
  });

  $('#searchInput')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const dropdown = $('#searchLiveDropdown');
      if (dropdown) dropdown.hidden = true;
      $('#searchBar')?.classList.remove('open');
      renderProducts();
      document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (event.key === 'Escape') {
      $('#searchBar')?.classList.remove('open');
      const dropdown = $('#searchLiveDropdown');
      if (dropdown) dropdown.hidden = true;
    }
  });

  // Close search bar & live dropdown on click outside
  document.addEventListener('click', event => {
    const searchBar = $('#searchBar');
    const searchToggle = $('#searchToggle');
    if (searchBar?.classList.contains('open')) {
      if (!searchBar.contains(event.target) && !searchToggle?.contains(event.target)) {
        searchBar.classList.remove('open');
        const dropdown = $('#searchLiveDropdown');
        if (dropdown) dropdown.hidden = true;
      }
    }
  });

  // Reset search button listener in product grid
  $('#productGrid')?.addEventListener('click', e => {
    if (e.target.closest('#btnResetSearchGrid')) {
      const input = $('#searchInput');
      if (input) input.value = '';
      const clearBtn = $('#searchClearBtn');
      if (clearBtn) clearBtn.hidden = true;
      query = '';
      activeFilter = 'all';
      activeBrand = 'all';
      $$('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
      const brandSel = $('#collectionBrandFilter');
      if (brandSel) brandSel.value = 'all';
      renderProducts();
    }
  });

  $('#newsletterForm').addEventListener('submit', async event => {
    event.preventDefault();
    const email = $('#emailInput').value.trim();
    if (!SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      try {
        await supaFetch('newsletter', { method: 'POST', body: { email } });
      } catch (err) {
        if (!err.message.includes('duplicate')) console.warn('Newsletter:', err);
      }
    }
    event.currentTarget.reset();
    showToast(I18N[currentLang].toast_newsletter);
  });

  $('#checkoutButton').addEventListener('click', () => {
    if (!cart.length) return;
    drawer(false);
    $('#checkoutModal').classList.add('open');
    $('#checkoutFormView').hidden = false;
    $('#orderSuccess').hidden = true;
  });

  $('#checkoutClose').addEventListener('click', () => $('#checkoutModal').classList.remove('open'));
  $('#checkoutModal').addEventListener('click', event => {
    if (event.target.id === 'checkoutModal') $('#checkoutModal').classList.remove('open');
  });

  $('#checkoutForm').addEventListener('submit', async event => {
    event.preventDefault();

    let waWindow = null;
    try { waWindow = window.open('about:blank', '_blank'); } catch (_) {}

    const form    = event.currentTarget;
    const name    = form.name.value.trim();
    const phone   = form.phone.value.trim();
    const address = form.address.value.trim();
    const items   = cart.map(row => {
      const product = products.find(p => p.id === row.id);
      const unitPrice = row.customPrice || product?.price || 0;
      return { id: row.id, name: product?.name, latin: product?.latin, price: unitPrice, qty: row.qty };
    });
    const total   = cart.reduce((sum, row) => sum + (row.customPrice || products.find(p => p.id === row.id)?.price || 0) * row.qty, 0);

    const submitBtn = form.querySelector('[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = I18N[currentLang].checkout_submitting;

    let orderNumber;

    if (!SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      try {
        const fallbackNumber = 'RO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        orderNumber = fallbackNumber;
        const rows = await supaFetch('orders', {
          method: 'POST',
          body: {
            order_number:  fallbackNumber,
            customer_name: name,
            phone,
            address,
            items,
            total,
          },
        });
        orderNumber = rows?.[0]?.order_number ?? fallbackNumber;
      } catch (err) {
        console.error('ROOH: خطأ في تسجيل الطلب:', err);
        orderNumber = 'RO-' + Date.now().toString().slice(-6);
      }
    } else {
      orderNumber = `RO-${Date.now().toString().slice(-6)}`;
    }

    try { localStorage.setItem('rooh-last-order', JSON.stringify({ id: orderNumber, createdAt: new Date().toISOString(), items, total })); } catch (_) {}

    submitBtn.disabled = false;
    submitBtn.innerHTML = `${I18N[currentLang].checkout_submit} <span class="arrow-icon">←</span>`;

    $('#orderNumber').textContent = orderNumber;
    $('#checkoutFormView').hidden = true;
    $('#orderSuccess').hidden = false;

    // Structured WhatsApp order message
    let waMessage;
    if (currentLang === 'en') {
      const itemsTextEn = items.map(i => `• ${i.latin || i.name} × ${i.qty} — ${money(i.price * i.qty)}`).join('\n');
      waMessage =
`✨ *New Order from Rou7-perfume* ✨
━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${orderNumber}
👤 *Name:* ${name}
📱 *Phone:* ${phone}
📍 *Address:* ${address}

🛍️ *Ordered Fragrances:*
${itemsTextEn}

━━━━━━━━━━━━━━━━━━
💰 *Total:* ${money(total)}
🚚 *Shipping:* Calculated with customer support
━━━━━━━━━━━━━━━━━━
I would like to confirm my order please 🌸`;
    } else {
      const itemsTextAr = items.map(i => `• ${i.name} × ${i.qty} — ${money(i.price * i.qty)}`).join('\n');
      waMessage =
`✨ *طلب جديد من متجر رُوح | Rou7-perfume* ✨
━━━━━━━━━━━━━━━━━━
📋 *رقم الطلب:* #${orderNumber}
👤 *الاسم:* ${name}
📱 *الهاتف:* ${phone}
📍 *العنوان:* ${address}

🛍️ *تفاصيل العطور المطلوبة:*
${itemsTextAr}

━━━━━━━━━━━━━━━━━━
💰 *الإجمالي:* ${money(total)}
🚚 *الشحن:* يُحدد مع خدمة العملاء
━━━━━━━━━━━━━━━━━━
أود تأكيد طلبي من فضلكم 🌸`;
    }

    const waUrl = `${WHATSAPP_BASE_URL}&text=${encodeURIComponent(waMessage)}`;
    const waBtn = $('#whatsappOrderBtn');
    if (waBtn) waBtn.href = waUrl;

    if (waWindow && !waWindow.closed) {
      waWindow.location.href = waUrl;
    } else {
      window.location.href = waUrl;
    }

    cart = [];
    updateCart();
  });

  $('#finishOrder').addEventListener('click', () => {
    $('#checkoutModal').classList.remove('open');
    $('#checkoutForm').reset();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  $('#trackingLink').addEventListener('click', event => {
    event.preventDefault();
    $('#trackingModal').classList.add('open');
    $('#trackingResult').textContent = '';
  });
  $('#trackingClose').addEventListener('click', () => $('#trackingModal').classList.remove('open'));
  $('#trackingModal').addEventListener('click', event => {
    if (event.target.id === 'trackingModal') $('#trackingModal').classList.remove('open');
  });

  $('#trackingForm').addEventListener('submit', async event => {
    event.preventDefault();
    const input   = $('#trackingInput').value.trim().toUpperCase();
    const result  = $('#trackingResult');
    result.textContent = I18N[currentLang].track_searching;

    if (!SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      try {
        const rows = await supaFetch('orders', {
          filters: `&order_number=eq.${encodeURIComponent(input)}&limit=1`,
        });
        const order = rows?.[0];
        if (order) {
          const statusMap = {
            pending:   currentLang === 'ar' ? 'قيد المراجعة — فريق رُوح هيتواصل معاك قريباً' : 'Under Review — Rou7 team will contact you shortly',
            confirmed: currentLang === 'ar' ? 'تم تأكيد الطلب ✓' : 'Order Confirmed ✓',
            shipped:   currentLang === 'ar' ? 'الطلب في الطريق إليك 🚚' : 'Order in transit 🚚',
            delivered: currentLang === 'ar' ? 'تم التسليم بنجاح ✓' : 'Delivered Successfully ✓',
            cancelled: currentLang === 'ar' ? 'تم إلغاء الطلب — تواصل معنا للمساعدة' : 'Order Cancelled — Contact support for assistance',
          };
          result.textContent = `${currentLang === 'ar' ? 'طلبك' : 'Your order'} ${order.order_number} — ${statusMap[order.status] ?? order.status}`;
          return;
        }
      } catch (err) {
        console.warn('ROOH: خطأ في تتبع الطلب:', err);
      }
    }

    let lastOrder = null;
    try { lastOrder = JSON.parse(localStorage.getItem('rooh-last-order') || 'null'); } catch (_) {}
    if (lastOrder?.id === input) {
      result.textContent = currentLang === 'ar'
        ? `طلبك ${lastOrder.id} وصلنا، وفريق رُوح هيتواصل معاك لتأكيد التوصيل.`
        : `Your order ${lastOrder.id} is received, and the Rou7 team will reach out soon.`;
    } else {
      result.textContent = I18N[currentLang].track_not_found;
    }
  });

  // Apply initial language state
  setLanguage(currentLang, false);

  window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 420));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      drawer(false);
      $('#checkoutModal').classList.remove('open');
      $('#trackingModal').classList.remove('open');
      $('#mobileMenu').classList.remove('open');
      $('#searchBar').classList.remove('open');
    }
  });
})();
