(() => {
  // ── Fault-Tolerant Architectural Primitives (fallback if utils.js not loaded) ──────────────────────────────
  const $ = window.RoohUtils?.$ || (selector => { try { return document.querySelector(selector); } catch (_) { return null; } });
  const $$ = window.RoohUtils?.$$ || (selector => { try { return [...document.querySelectorAll(selector)]; } catch (_) { return []; } });
  const safeOn = window.RoohUtils?.safeOn || function(selectorOrEl, event, handler, options) {
    if (!selectorOrEl) return;
    try {
      const elements = typeof selectorOrEl === 'string'
        ? $$(selectorOrEl)
        : (selectorOrEl instanceof NodeList || Array.isArray(selectorOrEl) ? selectorOrEl : [selectorOrEl]);
      elements.forEach(el => {
        if (el && typeof el.addEventListener === 'function') {
          el.addEventListener(event, function(e) {
            try {
              return handler.call(this, e);
            } catch (err) {
              console.warn(`[Event notice on ${event} (${selectorOrEl})]:`, err);
            }
          }, options);
        }
      });
    } catch (err) {
      console.warn(`[safeOn notice for ${selectorOrEl}]:`, err);
    }
  };

  const safeModule = window.RoohUtils?.safeModule || function(name, initFn) {
    try {
      initFn();
    } catch (err) {
      console.warn(`[Module skipped safely: ${name}]:`, err);
    }
  };

  // Early loader dismissal failsafe
  setTimeout(() => {
    const ldr = document.getElementById('loader');
    if (ldr && !ldr.classList.contains('done')) ldr.classList.add('done');
  }, 400);

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
      val_custom: 'لو في عطر مش موجود ومحتاجه نقدر نوفرهولك',
      cp_eyebrow: 'خدمة رُوح الخاصة للأصالة والفخامة ✦',
      cp_title: 'لو في عطر مش موجود ومحتاجه… <em>نقدر نوفرهولك</em>',
      cp_desc: 'بتدور على عطر معين (ماركة عالمية، نيش، أو نادر) ومش لاقيه في متجرنا؟ ابعتلنا اسمه أو صورته على واتساب وهنوفرهولك فوراً بأفضل سعر وأعلى جودة وأصلية مضمونة 100%.',
      cp_feat_1: 'نوفر لك أي عطر أصلي غير متوفر بالمتجر',
      cp_feat_2: 'ضمان أعلى ثبات وجودة وأفضل سعر فوري',
      cp_feat_3: 'شحن سريع وتغليف فاخر حتى باب بيتك',
      cp_cta: 'اطلب توفير عطرك عبر واتساب 💬',
      cp_consult_note: 'رد وتأكيد فوري على مدار الساعة',
      nav_custom: 'طلب توفير عطر',
      mood_nature_playing: 'همس الطبيعة: شغال 🍃',
      mood_nature_paused: 'همس الطبيعة',
      coll_eyebrow: 'اكتشف عطرك',
      coll_title: 'مختارات <em>رُوح</em>',
      coll_all_link: 'كل العطور',
      filter_all: 'الكل',
      filter_women: 'نسائي',
      filter_men: 'رجالي',
      filter_unisex: 'للجميع',
      filter_gifts: 'هدايا 🎁',
      gift_builder_badge: 'خدمة بوكسات رُوح الفاخرة',
      gift_builder_title: 'صمّم بوكس هدايا ملكي على ذوقك',
      gift_builder_desc: 'اختر عطورك المفضلة وضعها داخل بوكس رُوح المخملي الفاخر مع كارت إهداء خاص وتغليف إهداء راقٍ.',
      gift_builder_btn: 'تجميع بوكس جديد الآن ✨',
      gift_modal_title: 'صمّم بوكس هدايا رُوح الملكي 🎁',
      gift_tier_2: 'بوكس الثنائيات (عطرين ٥٠ مل)',
      gift_tier_3: 'بوكس الترويكا (٣ عطور ٥٠ مل)',
      gift_tier_4: 'بوكس النخبة (٤ عطور ٥٠ مل)',
      gift_select_fragrances: 'اختر العطور لتضمينها بالبوكس:',
      gift_card_msg_label: 'رسالة الإهداء الخاصة على الكارت (اختياري):',
      gift_card_msg_ph: 'اكتب الكلمات التي تريد طباعتها على كارت الإهداء الملكي...',
      gift_add_to_cart: 'أضف بوكس الهدايا للسلة 🛍️',
      gift_order_wa: 'اطلب عبر واتساب 💬',
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
      hero_badge: 'عطر الواجهة الرئيسي ✦ تحفة رُوح',
      hero_explore: 'استكشف العطر ✦',
      hero_add: '＋ أضف للسلة',
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
      mood_tag_winter: 'دفء واسترخاء',
      mood_title_winter: 'سهرة شتوية دافئة',
      mood_desc_winter: 'فانيليا مخملية، أخشاب دافئة، وعنبر بلسمي',
      mood_tag_majestic: 'فخامة وهيبة',
      mood_title_majestic: 'حضور رسمي استثنائي',
      mood_desc_majestic: 'عود ملكي، جلود فاخرة، وتوابل شرقية دافئة',
      mood_tag_morning: 'انتعاش وطاقة',
      mood_title_morning: 'صباح مشرق وثقة',
      mood_desc_morning: 'حمضيات متألقة، زهور بيضاء، ونقاء أثيري',
      mood_tag_romantic: 'جاذبية وسحر',
      mood_title_romantic: 'غموض رومانسي ساحر',
      mood_desc_romantic: 'مسك حريري، بودرة الورد، وتوت العليق الأسود',
      mood_tag_aquatic: 'حرية وانطلاق',
      mood_title_aquatic: 'نسيم البحر وحرية الصيف',
      mood_desc_aquatic: 'رذاذ مائي أروماتك، نسيم البحر، ونقاء أزرق',
      mab_close: '✕ رجوع لكافة العطور',
      mab_title_active: 'أجواء اللحظة مفعلة',
      mab_desc_active: 'نعرض لك العطور المختارة بعناية لترافق هذا الشعور',
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
      val_custom: 'Looking for a scent not listed? We can provide it for you',
      cp_eyebrow: 'Rou7 Exclusive Luxury Sourcing ✦',
      cp_title: 'Can’t find your favorite perfume? <em>We can provide it for you</em>',
      cp_desc: 'Searching for a specific fragrance (designer, niche, or rare) not listed in our store? Message us on WhatsApp with its name or photo and we will source it for you at the best price with 100% authenticity guaranteed.',
      cp_feat_1: 'We source any authentic perfume not listed',
      cp_feat_2: 'Guaranteed highest longevity & best instant price',
      cp_feat_3: 'Express shipping & luxury royal packaging',
      cp_cta: 'Request Your Perfume on WhatsApp 💬',
      cp_consult_note: 'Instant 24/7 response & inquiry confirmation',
      nav_custom: 'Request a Scent',
      mood_nature_playing: 'Nature Sounds: On 🍃',
      mood_nature_paused: 'Nature Sounds',
      coll_eyebrow: 'Discover Your Scent',
      coll_title: 'Rou7 <em>Curations</em>',
      coll_all_link: 'All Fragrances',
      filter_all: 'All',
      filter_women: 'For Her',
      filter_men: 'For Him',
      filter_unisex: 'Unisex',
      filter_gifts: 'Gifts 🎁',
      gift_builder_badge: 'Rou7 Luxury Gift Boxes',
      gift_builder_title: 'Curate Your Bespoke Gift Box',
      gift_builder_desc: 'Handpick your favorite fragrances packaged in Rou7 velvet royal box with personalized dedication card.',
      gift_builder_btn: 'Build Gift Box Now ✨',
      gift_modal_title: 'Curate Rou7 Royal Gift Box 🎁',
      gift_tier_2: 'Royal Duo Box (2 Perfumes 50ml)',
      gift_tier_3: 'Elite Trio Box (3 Perfumes 50ml)',
      gift_tier_4: 'Masterpiece Box (4 Perfumes 50ml)',
      gift_select_fragrances: 'Select fragrances for your box:',
      gift_card_msg_label: 'Personal Dedication Message on Card (Optional):',
      gift_card_msg_ph: 'Write your heartfelt message to be printed on the royal gold card...',
      gift_add_to_cart: 'Add Gift Box to Bag 🛍️',
      gift_order_wa: 'Order via WhatsApp 💬',
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
      hero_badge: 'Signature Masterpiece ✦ Featured Fragrance',
      hero_explore: 'Explore Scent ✦',
      hero_add: '＋ Add to Bag',
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
      mood_tag_winter: 'Warmth & Cozy',
      mood_title_winter: 'Cozy Winter Evening',
      mood_desc_winter: 'Velvet vanilla, warm woods & balsamic amber',
      mood_tag_majestic: 'Prestige & Presence',
      mood_title_majestic: 'Distinguished Black-Tie',
      mood_desc_majestic: 'Royal oud, luxury leather & warm spices',
      mood_tag_morning: 'Fresh Energy & Radiance',
      mood_title_morning: 'Radiant Morning Drive',
      mood_desc_morning: 'Sparkling citrus, white florals & ethereal purity',
      mood_tag_romantic: 'Allure & Romance',
      mood_title_romantic: 'Romantic Twilight Mystery',
      mood_desc_romantic: 'Silky musk, rose powder & dark blackberries',
      mood_tag_aquatic: 'Sea Breeze & Freedom',
      mood_title_aquatic: 'Mediterranean Sea Breeze',
      mood_desc_aquatic: 'Aromatic sea mist, ocean spray & azure freshness',
      mab_close: '✕ Back to All Fragrances',
      mab_title_active: 'Atmosphere Active',
      mab_desc_active: 'Displaying curated fragrances tailored to this feeling',
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
    },
    {
      id: 'gift-box-royal-duo',
      name: 'بوكس رُوح الملكي (عطرين فاخرين + بوكس إهداء)',
      latin: 'Rou7 Royal Duo Gift Box',
      brand: 'رُوح',
      price: 2800,
      cost_price: 1800,
      category: 'gifts',
      tag: '🎁 هدايا فاخرة',
      image_url: 'assets/branding/2.svg',
      is_featured: true,
      in_stock: true,
      sort_order: 10,
      notes: JSON.stringify({
        brand: 'رُوح',
        brand_ar: 'روح رُوح rou7',
        desc: 'بوكس إهداء فاخر مخملي من دار رُوح يحتوي على عطرين من اختيارك (٥٠ مل) بتغليف ملكي مع كارت إهداء خاص وريبون ذهبي راقٍ.',
        box_items: '٢ عطر فاخر ٥٠ مل من اختيارك + كارت إهداء وتغليف ملكي',
        is_custom_box: true,
        extra_item_price: 1200,
        max_box_items: 4,
        top_notes: 'نوتات عطرية فاخرة',
        middle_notes: 'عطور رُوح الخاصة',
        base_notes: 'تغليف ملكي أسود وذهبي',
        inspired_by: 'مجموعة رُوح الحصرية للإهداء',
        longevity: 5,
        sillage: 5,
        accords: 'Gift, Luxury, Oriental, Royal',
        main_accord: 'Gift',
        seasons: 'all,night,day'
      })
    },
    {
      id: 'gift-box-elite-trio',
      name: 'بوكس نخبة رُوح الثلاثي (٣ عطور + تغليف إهداء)',
      latin: 'Rou7 Elite Trio Luxury Box',
      brand: 'رُوح',
      price: 3900,
      cost_price: 2500,
      category: 'gifts',
      tag: '✨ الأكثر طلباً',
      image_url: 'assets/branding/2.svg',
      is_featured: true,
      in_stock: true,
      sort_order: 11,
      notes: JSON.stringify({
        brand: 'رُوح',
        brand_ar: 'روح رُوح rou7',
        desc: 'المجموعة الكاملة لأرقى إبداعات رُوح العطرية؛ ٣ عطور بحجم ٥٠ مل داخل بوكس جلدي فاخر مع بطاقة إهداء مختومة بالذهب.',
        box_items: '٣ عطور بحجم ٥٠ مل + عينات مجانية + بوكس ملكي كبير وكارت إهداء',
        is_custom_box: true,
        extra_item_price: 1200,
        max_box_items: 5,
        top_notes: 'مجموعة متكاملة من أرقى النوتات',
        middle_notes: 'نوتات شرقية وفرنسية ساحرة',
        base_notes: 'ثبات وفوحان استثنائي',
        inspired_by: 'مجموعة النخبة للإهداء',
        longevity: 5,
        sillage: 5,
        accords: 'Gift, Luxury, Trio, Exclusive',
        main_accord: 'Gift',
        seasons: 'all,night,day'
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

  // ── Brands Registry Setup ──────────────────────────────────────────────────
  let brands = [];
  try {
    const cachedB = localStorage.getItem('rooh-cached-brands');
    if (cachedB) {
      const parsed = JSON.parse(cachedB);
      if (Array.isArray(parsed) && parsed.length) brands = parsed;
    }
  } catch (_) {}

  function findBrand(val) {
    if (!val) return null;
    const s = String(val).toLowerCase().trim();
    return brands.find(b =>
      (b.id && b.id.toLowerCase() === s) ||
      (b.name_en && b.name_en.toLowerCase().trim() === s) ||
      (b.name_ar && b.name_ar.toLowerCase().trim() === s) ||
      (b.name_ar && s.includes(b.name_ar.toLowerCase().trim())) ||
      (b.name_en && s.includes(b.name_en.toLowerCase().trim()))
    );
  }

  const themeButton = $('#themeToggle');

  function setTheme(theme, persist = true) {
    document.body.classList.add('light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = '#f5f0eb';
    $$('.brand-logo').forEach(image => {
      image.src = 'assets/branding/1.svg';
    });
    if (persist) {
      try { localStorage.setItem('rooh-theme', 'light'); } catch (_) {}
    }
  }
  setTheme('light', true);

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
      if (key === 'announcement' && currentAnnouncements && currentAnnouncements.top_bar && currentAnnouncements.top_bar_active !== false) {
        el.textContent = currentAnnouncements.top_bar;
        return;
      }
      if (key && key.startsWith('val_') && currentAnnouncements && Array.isArray(currentAnnouncements.values_strip) && currentLang === 'ar') {
        const valIdx = parseInt(key.replace('val_', ''), 10) - 1;
        if (currentAnnouncements.values_strip[valIdx] && currentAnnouncements.values_strip[valIdx].trim()) {
          el.textContent = currentAnnouncements.values_strip[valIdx].trim();
          return;
        }
      }
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

    updateMoodPortalLang();
    renderProducts();
    renderHeroProduct();
    renderStorySpotlight();
    updateCart();
    if (typeof quizModal !== 'undefined' && quizModal && quizModal.classList.contains('open')) {
      renderQuizStep();
    }
    if (typeof applyHomeLayout === 'function') applyHomeLayout();
  }

  function updateMoodPortalLang() {
    if (activeMood && MOOD_PROFILES[activeMood]) {
      const prof = MOOD_PROFILES[activeMood];
      const isAr = currentLang === 'ar';
      const mabTitle = $('#mabTitle');
      const mabDesc = $('#mabDesc');
      if (mabTitle) mabTitle.textContent = isAr ? `أجواء اللحظة: ${prof.ar}` : `Atmosphere: ${prof.en}`;
      if (mabDesc) mabDesc.textContent = isAr ? `نعرض لك العطور المختارة بعناية لترافق ${prof.ar}` : `Showcasing fragrances harmonized with ${prof.en}`;
    }
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
      if (this.ambientTimers) {
        this.ambientTimers.forEach(t => clearInterval(t));
        this.ambientTimers = [];
      }
      this.ambientNodes.forEach(n => {
        try {
          if (n.stop) n.stop();
          if (n.disconnect) n.disconnect();
        } catch (_) {}
      });
      this.ambientNodes = [];
      this.activeMood = null;
    }

    createPinkNoiseBuffer(ctx, duration = 3.5) {
      const total = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, total, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < total; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.085;
        b6 = white * 0.115926;
      }
      return buffer;
    }

    createBrownNoiseBuffer(ctx, duration = 3.5) {
      const total = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, total, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < total; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8;
      }
      return buffer;
    }

    createFireplaceCrackleBuffer(ctx, duration = 3.0) {
      const total = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, total, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < total; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.003;
      }
      const numPops = 70;
      for (let p = 0; p < numPops; p++) {
        const startIdx = Math.floor(Math.random() * (total - 500));
        const popLen = Math.floor(ctx.sampleRate * (0.002 + Math.random() * 0.004));
        const amp = 0.25 + Math.random() * 0.7;
        const sign = Math.random() > 0.5 ? 1 : -1;
        for (let j = 0; j < popLen; j++) {
          const t = j / ctx.sampleRate;
          const decay = Math.exp(-t * 1200);
          data[startIdx + j] += (Math.random() * 2 - 1) * decay * amp * sign;
        }
      }
      return buffer;
    }

    createCricketsBuffer(ctx, duration = 3.0) {
      const total = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, total, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      const chirpStarts = [0.25, 1.6];
      chirpStarts.forEach(startSec => {
        const startIdx = Math.floor(startSec * ctx.sampleRate);
        const packetLen = Math.floor(0.32 * ctx.sampleRate);
        for (let i = 0; i < packetLen; i++) {
          const t = i / ctx.sampleRate;
          const carrier = Math.sin(2 * Math.PI * 4500 * t);
          const mod = Math.max(0, Math.sin(2 * Math.PI * 30 * t));
          const env = Math.sin(Math.PI * (i / packetLen));
          data[startIdx + i] += carrier * mod * env * 0.07;
        }
      });
      return buffer;
    }

    playMoodAmbient(moodKey) {
      this.stopAmbient();
      if (!moodKey) return;

      try {
        const ctx = this.ensureContext();
        if (!ctx) return;
        this.activeMood = moodKey;
        this.ambientTimers = [];

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.9);
        masterGain.connect(ctx.destination);
        this.ambientNodes.push(masterGain);

        // 1. Winter Cozy: Warm crackling wood fire + soft cozy rain
        if (moodKey === 'winter_cozy') {
          const brownBuf = this.createBrownNoiseBuffer(ctx, 3.5);
          const rumble = ctx.createBufferSource();
          rumble.buffer = brownBuf;
          rumble.loop = true;
          const rumbleFilter = ctx.createBiquadFilter();
          rumbleFilter.type = 'lowpass';
          rumbleFilter.frequency.setValueAtTime(160, ctx.currentTime);
          const rumbleGain = ctx.createGain();
          rumbleGain.gain.value = 0.35;
          rumble.connect(rumbleFilter);
          rumbleFilter.connect(rumbleGain);
          rumbleGain.connect(masterGain);
          rumble.start();
          this.ambientNodes.push(rumble);

          const crackleBuf = this.createFireplaceCrackleBuffer(ctx, 3.0);
          const crackleSrc = ctx.createBufferSource();
          crackleSrc.buffer = crackleBuf;
          crackleSrc.loop = true;
          const crackleFilter = ctx.createBiquadFilter();
          crackleFilter.type = 'highpass';
          crackleFilter.frequency.setValueAtTime(900, ctx.currentTime);
          const crackleGain = ctx.createGain();
          crackleGain.gain.value = 0.55;
          crackleSrc.connect(crackleFilter);
          crackleFilter.connect(crackleGain);
          crackleGain.connect(masterGain);
          crackleSrc.start();
          this.ambientNodes.push(crackleSrc);

          const rainBuf = this.createPinkNoiseBuffer(ctx, 3.0);
          const rainSrc = ctx.createBufferSource();
          rainSrc.buffer = rainBuf;
          rainSrc.loop = true;
          const rainFilter = ctx.createBiquadFilter();
          rainFilter.type = 'bandpass';
          rainFilter.frequency.setValueAtTime(750, ctx.currentTime);
          rainFilter.Q.value = 0.9;
          const rainGain = ctx.createGain();
          rainGain.gain.value = 0.22;
          rainSrc.connect(rainFilter);
          rainFilter.connect(rainGain);
          rainGain.connect(masterGain);
          rainSrc.start();
          this.ambientNodes.push(rainSrc);

        // 2. Majestic Power: Desert night breeze & serene wind over dunes
        } else if (moodKey === 'majestic_power') {
          const windBuf = this.createBrownNoiseBuffer(ctx, 4.0);
          const windSrc = ctx.createBufferSource();
          windSrc.buffer = windBuf;
          windSrc.loop = true;
          const windFilter = ctx.createBiquadFilter();
          windFilter.type = 'bandpass';
          windFilter.frequency.setValueAtTime(220, ctx.currentTime);
          windFilter.Q.value = 2.0;

          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.07, ctx.currentTime);
          const lfoFilterGain = ctx.createGain();
          lfoFilterGain.gain.value = 90;
          lfo.connect(lfoFilterGain);
          lfoFilterGain.connect(windFilter.frequency);

          const windGain = ctx.createGain();
          windGain.gain.value = 0.45;
          windSrc.connect(windFilter);
          windFilter.connect(windGain);
          windGain.connect(masterGain);
          windSrc.start();
          lfo.start();
          this.ambientNodes.push(windSrc, lfo);

        // 3. Morning Radiance: Fresh garden breeze + natural birdsong chirps
        } else if (moodKey === 'morning_radiance') {
          const breezeBuf = this.createPinkNoiseBuffer(ctx, 3.0);
          const breezeSrc = ctx.createBufferSource();
          breezeSrc.buffer = breezeBuf;
          breezeSrc.loop = true;
          const breezeFilter = ctx.createBiquadFilter();
          breezeFilter.type = 'bandpass';
          breezeFilter.frequency.setValueAtTime(1400, ctx.currentTime);
          breezeFilter.Q.value = 0.7;
          const breezeGain = ctx.createGain();
          breezeGain.gain.value = 0.32;
          breezeSrc.connect(breezeFilter);
          breezeFilter.connect(breezeGain);
          breezeGain.connect(masterGain);
          breezeSrc.start();
          this.ambientNodes.push(breezeSrc);

          const triggerBirdChirp = () => {
            if (!this.activeMood || this.activeMood !== 'morning_radiance') return;
            try {
              const now = ctx.currentTime;
              const osc = ctx.createOscillator();
              const g = ctx.createGain();
              const dur = 0.075;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(4300, now);
              osc.frequency.exponentialRampToValueAtTime(2500, now + dur);
              g.gain.setValueAtTime(0.001, now);
              g.gain.linearRampToValueAtTime(0.045, now + 0.012);
              g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
              osc.connect(g);
              g.connect(masterGain);
              osc.start(now);
              osc.stop(now + dur + 0.02);

              if (Math.random() > 0.35) {
                const t2 = now + 0.11;
                const dur2 = 0.06;
                const osc2 = ctx.createOscillator();
                const g2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(3600, t2);
                osc2.frequency.exponentialRampToValueAtTime(2900, t2 + dur2);
                g2.gain.setValueAtTime(0.001, t2);
                g2.gain.linearRampToValueAtTime(0.035, t2 + 0.01);
                g2.gain.exponentialRampToValueAtTime(0.0001, t2 + dur2);
                osc2.connect(g2);
                g2.connect(masterGain);
                osc2.start(t2);
                osc2.stop(t2 + dur2 + 0.02);
              }
            } catch (_) {}
          };

          setTimeout(triggerBirdChirp, 400);
          const birdTimer = setInterval(triggerBirdChirp, 3200);
          this.ambientTimers.push(birdTimer);

        // 4. Romantic Twilight: Gentle rain patter on leaves & night garden crickets
        } else if (moodKey === 'romantic_twilight') {
          const rainBuf = this.createPinkNoiseBuffer(ctx, 3.5);
          const rainSrc = ctx.createBufferSource();
          rainSrc.buffer = rainBuf;
          rainSrc.loop = true;
          const rainFilter = ctx.createBiquadFilter();
          rainFilter.type = 'lowpass';
          rainFilter.frequency.setValueAtTime(1100, ctx.currentTime);
          const rainGain = ctx.createGain();
          rainGain.gain.value = 0.38;
          rainSrc.connect(rainFilter);
          rainFilter.connect(rainGain);
          rainGain.connect(masterGain);
          rainSrc.start();
          this.ambientNodes.push(rainSrc);

          const cricketBuf = this.createCricketsBuffer(ctx, 3.0);
          const cricketSrc = ctx.createBufferSource();
          cricketSrc.buffer = cricketBuf;
          cricketSrc.loop = true;
          const cricketFilter = ctx.createBiquadFilter();
          cricketFilter.type = 'bandpass';
          cricketFilter.frequency.setValueAtTime(4500, ctx.currentTime);
          cricketFilter.Q.value = 3.0;
          const cricketGain = ctx.createGain();
          cricketGain.gain.value = 0.35;
          cricketSrc.connect(cricketFilter);
          crackleFilter = null;
          cricketFilter.connect(cricketGain);
          cricketGain.connect(masterGain);
          cricketSrc.start();
          this.ambientNodes.push(cricketSrc);

        // 5. Aquatic Freedom: Rolling ocean waves crashing softly and receding with sea foam
        } else if (moodKey === 'aquatic_freedom') {
          const oceanBuf = this.createBrownNoiseBuffer(ctx, 4.0);
          const oceanSrc = ctx.createBufferSource();
          oceanSrc.buffer = oceanBuf;
          oceanSrc.loop = true;

          const oceanFilter = ctx.createBiquadFilter();
          oceanFilter.type = 'bandpass';
          oceanFilter.frequency.setValueAtTime(320, ctx.currentTime);
          oceanFilter.Q.value = 1.9;

          const swellLfo = ctx.createOscillator();
          swellLfo.frequency.setValueAtTime(0.12, ctx.currentTime);
          const swellFreqMod = ctx.createGain();
          swellFreqMod.gain.value = 240;
          swellLfo.connect(swellFreqMod);
          swellFreqMod.connect(oceanFilter.frequency);

          const oceanGain = ctx.createGain();
          oceanGain.gain.value = 0.38;

          oceanSrc.connect(oceanFilter);
          oceanFilter.connect(oceanGain);
          oceanGain.connect(masterGain);
          oceanSrc.start();
          swellLfo.start();
          this.ambientNodes.push(oceanSrc, swellLfo);

          const foamBuf = this.createPinkNoiseBuffer(ctx, 3.0);
          const foamSrc = ctx.createBufferSource();
          foamSrc.buffer = foamBuf;
          foamSrc.loop = true;
          const foamFilter = ctx.createBiquadFilter();
          foamFilter.type = 'highpass';
          foamFilter.frequency.setValueAtTime(2600, ctx.currentTime);
          const foamGain = ctx.createGain();
          foamGain.gain.value = 0.08;
          foamSrc.connect(foamFilter);
          foamFilter.connect(foamGain);
          foamGain.connect(masterGain);
          foamSrc.start();
          this.ambientNodes.push(foamSrc);
        }
      } catch (err) {
        console.warn('Mood nature audio failed:', err);
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

    const available = (products || []).filter(p => p.name !== '__system_announcements__' && p.name !== '__system_brands__' && p.name !== '__system_orders_meta__' && p.in_stock !== false);
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
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
          e.preventDefault();
          openProductDetails(target.id);
        }
      };
      // Instant touch navigation on mobile devices without tap delay or swipe conflicts
      let touchMoved = false;
      storyBottleWrap.ontouchstart = () => { touchMoved = false; };
      storyBottleWrap.ontouchmove = () => { touchMoved = true; };
      storyBottleWrap.ontouchend = (e) => {
        if (!touchMoved) {
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
      bottleImg.style.cursor = 'pointer';
      bottleImg.onclick = (e) => {
        e.stopPropagation();
        openProductDetails(target.id);
      };
    }

    // Badge
    const badgeEl = $('#storyOfferBadge');
    if (badgeEl) {
      const badgeText = data.spotlight_badge || I18N[currentLang].spotlight_badge_default || '✨ عطر اليوم المميز';
      badgeEl.textContent = badgeText;
      badgeEl.style.display = data.spotlight_active !== false ? '' : 'none';
      badgeEl.style.cursor = 'pointer';
      badgeEl.onclick = (e) => {
        e.stopPropagation();
        openProductDetails(target.id);
      };
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
        const ovT = getHomeText('story', 'title');
        headingEl.innerHTML = ovT
          ? formatHomeText(ovT)
          : (currentLang === 'ar'
            ? `العطر لغةٌ<br>تسبق <em>الكلام</em>`
            : `Fragrance is a language<br>before <em>words</em>`);
      }
    }

    if (descEl) {
      if (data.spotlight_desc && data.spotlight_active !== false) {
        descEl.textContent = currentLang === 'ar'
          ? (window.PerfumeI18n ? window.PerfumeI18n.translateDesc(data.spotlight_desc, 'ar', target.id, target.name) : data.spotlight_desc)
          : (window.PerfumeI18n ? window.PerfumeI18n.translateDesc(data.spotlight_desc, 'en', target.id, target.latin || target.name) : data.spotlight_desc);
      } else {
        const ovD = getHomeText('story', 'text');
        if (ovD) {
          descEl.textContent = ovD;
        } else {
          const localized = window.PerfumeI18n ? window.PerfumeI18n.getLocalizedProduct(target, currentLang) : null;
          descEl.textContent = (localized && localized.desc) ? localized.desc : (currentLang === 'ar' ? 'عطر فاخر صُنع بعناية ليعكس حضورك المتميز ويترك أثراً لا يُنسى في كل لحظة.' : 'An exquisite fragrance meticulously blended to reflect your unique presence and leave an indelible impression.');
        }
      }
    }

    // Spotlight Box & Pricing
    const box = $('#storySpotlightBox');
    const quickAddBtn = $('#storyQuickAddBtn');
    const detailsBtn = $('#storyDetailsBtn');
    const currentPriceEl = $('#storyCurrentPrice');
    const oldPriceEl = $('#storyOldPrice');
    const discountTag = $('#storyDiscountTag');
    const priceLabel = $('#storyPriceLabel');
    const quickAddText = $('#storyQuickAddText');

    if (box) {
      const isActive = data.spotlight_active !== false;
      box.hidden = !isActive;
      if (isActive) {
        // Use pricing engine to account for product sale_price, storewide discount, and custom spotlight_price
        const pricing = computeProductPrice(target, data);
        const customSpotlightPrice = Number(data.spotlight_price);

        let activePrice = pricing.price;
        let originalPrice = pricing.originalPrice || target.price;
        let hasDiscount = pricing.hasDiscount;
        let discountBadge = pricing.discountBadge;
        let savedAmount = pricing.savedAmount;

        // Custom spotlight price takes precedence if lower than original price
        if (customSpotlightPrice && customSpotlightPrice > 0 && customSpotlightPrice < originalPrice) {
          activePrice = customSpotlightPrice;
          hasDiscount = true;
          savedAmount = originalPrice - customSpotlightPrice;
          const pct = Math.round((savedAmount / originalPrice) * 100);
          discountBadge = currentLang === 'ar' ? `خصم ${arabicDigits(pct)}%` : `${pct}% OFF`;
        }

        if (priceLabel) {
          priceLabel.textContent = hasDiscount
            ? (I18N[currentLang].spotlight_price_label || (currentLang === 'ar' ? 'السعر بالعرض:' : 'Offer Price:'))
            : (currentLang === 'ar' ? 'السعر:' : 'Price:');
        }

        if (currentPriceEl) currentPriceEl.textContent = money(activePrice);

        // Dynamic accent color shift based on product's main accord
        const accordColors = {
          sweet: '#EC407A', woody: '#8B5A2B', vanilla: '#D4A373',
          oriental: '#8E24AA', amber: '#C58F28', spicy: '#E65100',
          fresh: '#00ACC1', floral: '#E91E63', citrus: '#FBC02D',
          oud: '#4A2C11', tobacco: '#795548', musky: '#90A4AE',
          fruity: '#FB8C00', aquatic: '#0288D1', leather: '#5D4037',
          powdery: '#78909C', aromatic: '#43A047'
        };
        const d = unpackProduct(target);
        const mainAccord = (d.main_accord || '').toLowerCase();
        const accordColor = accordColors[mainAccord] || '#f5a5ad';
        document.documentElement.style.setProperty('--story-accent', accordColor);
        const storyArt = $('#storyArt');
        if (storyArt) {
          storyArt.style.setProperty('--story-accent', accordColor);
        }

        if (oldPriceEl) {
          if (hasDiscount && originalPrice > activePrice) {
            oldPriceEl.style.display = 'inline-block';
            oldPriceEl.textContent = money(originalPrice);
          } else {
            oldPriceEl.style.display = 'none';
          }
        }

        if (discountTag) {
          if (hasDiscount && savedAmount > 0) {
            discountTag.style.display = 'inline-flex';
            const saveText = currentLang === 'ar' ? `وفر ${money(savedAmount)}` : `Save ${money(savedAmount)}`;
            discountTag.textContent = discountBadge ? `${discountBadge} · ${saveText}` : saveText;
          } else {
            discountTag.style.display = 'none';
          }
        }

        if (quickAddText) {
          quickAddText.textContent = hasDiscount
            ? (I18N[currentLang].spotlight_quick_buy || (currentLang === 'ar' ? 'أضف للسلة بالعرض' : 'Add to Bag with Offer'))
            : (I18N[currentLang].add_to_bag || (currentLang === 'ar' ? 'أضف للسلة' : 'Add to Bag'));
        }

        // Action Buttons
        if (quickAddBtn) {
          quickAddBtn.onclick = (e) => {
            e.stopPropagation();
            addToCart(target.id, quickAddBtn, hasDiscount ? activePrice : null);
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

    // Only run hover parallax on fine pointers (desktop mouse) to prevent canceling mobile touch taps
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
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
    }

    storyArt.addEventListener('click', e => {
      if (e.target.closest('#storyQuickAddBtn') || e.target.closest('#storyDetailsBtn') || e.target.closest('#btnStorySpray')) return;
      const targetId = (currentSpotlightPerfume && currentSpotlightPerfume.id) || (products && products[0] && products[0].id);
      if (targetId) {
        openProductDetails(targetId);
      }
    });

    // Generate floating particles
    const particlesContainer = $('#storyParticles');
    if (particlesContainer) {
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'story-particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        p.style.animationDuration = `${6 + Math.random() * 4}s`;
        particlesContainer.appendChild(p);
      }
    }
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

  const HOME_DEFAULT_ORDER = ['customPerfumeSection', 'collection', 'story', 'quoteBand', 'newsletterSection'];

  function formatHomeText(str) {
    return escapeHtml(str).replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  }

  function getHomeText(sectionId, field) {
    const val = currentAnnouncements?.home_layout?.sections?.[sectionId]?.[`${field}_${currentLang}`];
    return typeof val === 'string' ? val.trim() : '';
  }

  function applyHomeLayout() {
    const layout = currentAnnouncements && currentAnnouncements.home_layout;
    if (!layout) return;

    const main = document.querySelector('main');
    const hero = document.getElementById('home');
    if (main) {
      const rawOrder = Array.isArray(layout.order) ? layout.order : [];
      const order = [];
      rawOrder.forEach(id => {
        if (HOME_DEFAULT_ORDER.includes(id) && !order.includes(id)) order.push(id);
      });
      HOME_DEFAULT_ORDER.forEach(id => {
        if (!order.includes(id)) order.push(id);
      });
      order.forEach(id => {
        const el = document.getElementById(id);
        if (el) main.appendChild(el);
      });
      if (hero && main.firstElementChild !== hero) {
        main.insertBefore(hero, main.firstElementChild);
      }
    }

    const sections = layout.sections || {};
    HOME_DEFAULT_ORDER.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const sec = sections[id] || {};
      el.style.display = sec.visible === false ? 'none' : '';
    });

    const collSec = sections.collection || {};
    const finderEl = document.getElementById('scentFinderBanner');
    if (finderEl) finderEl.style.display = collSec.show_finder === false ? 'none' : '';
    const moodEl = document.getElementById('moodPortalSection');
    if (moodEl) moodEl.style.display = collSec.show_mood === false ? 'none' : '';

    const setField = (root, selector, value, isHtml = false) => {
      if (!root || !value) return;
      const target = root.querySelector(selector);
      if (!target) return;
      if (isHtml) target.innerHTML = formatHomeText(value);
      else target.textContent = value;
    };

    const cpEl = document.getElementById('customPerfumeSection');
    setField(cpEl, '[data-i18n="cp_eyebrow"]', getHomeText('customPerfumeSection', 'eyebrow'));
    setField(cpEl, '[data-i18n-html="cp_title"]', getHomeText('customPerfumeSection', 'title'), true);
    setField(cpEl, '[data-i18n="cp_desc"]', getHomeText('customPerfumeSection', 'text'));
    setField(cpEl, '[data-i18n="cp_cta"]', getHomeText('customPerfumeSection', 'cta'));

    const collEl = document.getElementById('collection');
    setField(collEl, '[data-i18n="coll_eyebrow"]', getHomeText('collection', 'eyebrow'));
    setField(collEl, '[data-i18n-html="coll_title"]', getHomeText('collection', 'title'), true);

    const storyEl = document.getElementById('story');
    setField(storyEl, '#storyEyebrow', getHomeText('story', 'eyebrow'));

    const quoteEl = document.getElementById('quoteBand');
    setField(quoteEl, '[data-i18n-html="quote_text"]', getHomeText('quoteBand', 'text'), true);
    setField(quoteEl, '[data-i18n="quote_caption"]', getHomeText('quoteBand', 'caption'));

    const newsEl = document.getElementById('newsletterSection');
    setField(newsEl, '[data-i18n="news_eyebrow"]', getHomeText('newsletterSection', 'eyebrow'));
    setField(newsEl, '[data-i18n-html="news_title"]', getHomeText('newsletterSection', 'title'), true);
    setField(newsEl, '[data-i18n="news_text"]', getHomeText('newsletterSection', 'text'));
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

    // 4. Values & Marquee Strip Customization
    if (currentLang === 'ar') {
      const stripEls = document.querySelectorAll('.values-strip > div > span[data-i18n], .values > div > span[data-i18n]');
      const items = Array.isArray(data.values_strip) && data.values_strip.length
        ? data.values_strip
        : [data.ticker_item_3, data.ticker_item_2, data.ticker_item_1, data.ticker_item_4, data.ticker_item_5].filter(Boolean);
      if (items.length) {
        stripEls.forEach((el, idx) => {
          if (items[idx] && String(items[idx]).trim()) {
            el.textContent = String(items[idx]).trim();
          }
        });
      }
    }

    // 5. Dynamic Homepage Sections Layout & Overrides
    applyHomeLayout();
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
          storewide_discount_badge: parsed.storewide_discount_badge || '',
          values_strip: parsed.values_strip || null,
          home_layout: parsed.home_layout || null
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

  function loadBrands() {
    supaFetch('products', { filters: '&name=eq.__system_brands__' })
      .then(rows => {
        if (rows && rows.length && rows[0].notes) {
          try {
            const data = JSON.parse(rows[0].notes);
            if (Array.isArray(data) && data.length) {
              brands = data;
              try { localStorage.setItem('rooh-cached-brands', JSON.stringify(data)); } catch (_) {}
              renderProducts();
            }
          } catch (_) {}
        }
      })
      .catch(() => {});
  }

  loadAnnouncements();
  loadBrands();
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

  function getNoteContextualPopup(noteText, phase, lang) {
    const raw = String(noteText || '').toLowerCase();
    const isAr = lang === 'ar';

    // 1. Spices (توابل / بهارات)
    if (/spice|pepper|cinnamon|cardamom|saffron|ginger|clove|nutmeg|توابل|بهار|فلفل|قرفة|هيل|زعفران|زنجبيل|قرنفل|جوزة الطيب/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'افتتاحية تابلية متقدة بالحيوية والجاذبية 🌿' : 'Invigorating spicy opening bursting with allure';
      } else if (phase === 'middle') {
        return isAr ? 'قلب تابل دافئ ينبض بالحيوية والأناقة حتى 3 ساعات 🌿' : 'Warm captivating spicy heart lasting up to 3h';
      } else {
        return isAr ? 'قاعدة متبلة عميقة تمنح العطر ثباتاً وفخامة تدوم 🌿' : 'Rich spicy base lingering with elegance';
      }
    }

    // 2. Citrus & Fresh Fruits (حمضيات وفواكه منعشة)
    if (/citrus|bergamot|lemon|lime|mandarin|grapefruit|orange|apple|peach|pear|berry|berries|حمضيات|برغموت|ليمون|يوسفي|جريب فروت|برتقال|تفاح|خوخ|كمثرى|توت/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'نفحات افتتاحية حمضية فوارة توقظ الحواس في أول ربع ساعة 🍋' : 'Crisp citrus opening bursting with energy in first 15 mins';
      } else if (phase === 'middle') {
        return isAr ? 'قلب فاكهي حمضي منعش يمنح العطر إشراقة تدوم 🍋' : 'Radiant fresh heart that brightens the day';
      } else {
        return isAr ? 'قاعدة حمضية خشبية متوازنة ونقية 🍋' : 'Clean lingering citrus undertone';
      }
    }

    // 3. Floral (زهور وورود)
    if (/rose|jasmine|peony|flower|floral|blossom|neroli|lily|iris|violet|tuberose|gardenia|sakura|ورد|ياسمين|زهور|فاوانيا|نيرولي|زنبق|سوسن|بنفسج|مسك الروم|غاردينيا|ساكورا/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'افتتاحية زهرية ناعمة تأسر اللحظة الأولى بنقاء 🌸' : 'Delicate floral opening that captivates';
      } else if (phase === 'middle') {
        return isAr ? 'قلب العطر الزهري الآسر يفيض رقة وجاذبية حتى 3 ساعات 🌸' : 'Alluring floral heart lasting up to 3h';
      } else {
        return isAr ? 'قاعدة زهرية مخملية تترك أثراً ناعماً لا يُنسى 🌸' : 'Velvety floral base with unforgettable sillage';
      }
    }

    // 4. Woody (أخشاب)
    if (/wood|woody|cedar|sandalwood|vetiver|patchouli|guaiac|birch|cashmeran|cypress|خشب|أخشاب|أرز|صندل|باتشولي|فيتيفر|كشميران|سرو/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'انطلاقة خشبية راقية تفرض هيبة العطر من اللحظة الأولى 🪵' : 'Noble woody opening commanding presence';
      } else if (phase === 'middle') {
        return isAr ? 'قلب خشبي عميق متزن يعكس الثقة والأصالة 🪵' : 'Deep sophisticated woody heart';
      } else {
        return isAr ? 'قاعدة خشبية فاخرة تمنح العطر عمقاً وهيبة تدوم لأكثر من 10 ساعات 🪵' : 'Luxurious woody base lasting 10+ hours';
      }
    }

    // 5. Leather & Oud & Tobacco (جلود وعود وفخامة ملكية)
    if (/oud|leather|suede|tobacco|smoke|عود|جلود|جلد|سويد|تبغ|دخان/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'انطلاقة شرقية ملكية مهيبة بالعود والجلود 👑' : 'Majestic oriental opening with rich oud & leather';
      } else if (phase === 'middle') {
        return isAr ? 'قلب شرقي ملكي من العود والجلود المعتقة الفاخرة 👑' : 'Sumptuous royal heart of aged leather & oud';
      } else {
        return isAr ? 'قاعدة ملكية فاخرة تثبت بحضور لا يقاوم لأكثر من 10 ساعات 👑' : 'Royal base with unmatched longevity & presence';
      }
    }

    // 6. Amber, Vanilla & Gourmand (عنبر وفانيليا وسويت)
    if (/vanilla|amber|caramel|tonka|cocoa|chocolate|coffee|honey|praline|عنبر|فانيليا|كراميل|تونكا|كاكاو|شوكولاتة|قهوة|عسل/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'افتتاحية شهية ودافئة تجذب الحواس برقة ✨' : 'Warm sweet opening inviting the senses';
      } else if (phase === 'middle') {
        return isAr ? 'قلب عنبري دافئ مغرٍ بلمسات العنبر والفانيليا 3 ساعات ✨' : 'Seductive warm heart with amber & vanilla';
      } else {
        return isAr ? 'قاعدة عنبرية دافئة غنية تثبت لأكثر من 10 ساعات ✨' : 'Deep warm ambery base resting on skin for 10+ hours';
      }
    }

    // 7. Marine & Aquatic (بحري ومائي)
    if (/aqua|marine|sea|water|ocean|بحر|مائي|بحري|أمواج|نسيم/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'نفحات بحرية مائية منعشة كنسيم الشواطئ 🌊' : 'Crisp oceanic breeze like a refreshing coastline';
      } else if (phase === 'middle') {
        return isAr ? 'قلب مائي منعش يمنحك شعوراً بالحرية والانطلاق 🌊' : 'Invigorating aquatic heart full of freedom';
      } else {
        return isAr ? 'قاعدة بحرية نقية تدوم بانتعاش يدوم طويلاً 🌊' : 'Clean marine base lingering with purity';
      }
    }

    // 8. Musk & Powdery (مسك وبودري)
    if (/musk|powder|powdery|مسك|بودر|بودرة/.test(raw)) {
      if (phase === 'top') {
        return isAr ? 'افتتاحية مخملية هادئة من النقاء والمسك ☁️' : 'Soft pure musk opening';
      } else if (phase === 'middle') {
        return isAr ? 'قلب مسكي نقي يلامس الحواس بنعومة فائقة ☁️' : 'Pure velvety musk heart';
      } else {
        return isAr ? 'قاعدة مسكية نقية تثبت بنعومة فائقة لأكثر من 10 ساعات ☁️' : 'Clean musk base lasting softly for 10+ hours';
      }
    }

    // Fallbacks
    if (phase === 'top') {
      return isAr ? 'نفحات افتتاحية تأسر الحواس في أول ربع ساعة ✦' : 'Crisp opening note in first 15 mins';
    } else if (phase === 'middle') {
      return isAr ? 'قلب العطر الآسر ينبض بروعة حتى 3 ساعات ✦' : 'Alluring heart note lasting up to 3h';
    } else if (phase === 'base') {
      return isAr ? 'قاعدة دافئة غنية تثبت لأكثر من 10 ساعات ✦' : 'Deep warm base resting on skin for 10+ hours';
    }
    return isAr ? 'نوتة عطرية مميزة لشخصية العطر ✦' : 'Signature aromatic note';
  }

  // ── 3D Featured Perfume Showcase (عطر الواجهة الرئيسي ثلاثي الأبعاد) ─────────
  let heroTiltRaf = null;

  function renderHeroProduct() {
    const hero = $('#heroProduct');
    if (!hero) return;
    const isAr = currentLang === 'ar';

    if (heroTiltRaf) {
      cancelAnimationFrame(heroTiltRaf);
      heroTiltRaf = null;
    }

    const candidates = products.filter(p =>
      p.name !== '__system_announcements__' &&
      p.name !== '__system_brands__' &&
      p.name !== '__system_orders_meta__' &&
      p.in_stock !== false
    );

    if (!candidates.length) {
      hero.innerHTML = `<div class="hero-product-empty"><span>✳</span><p>${isAr ? 'المنتج المميز سيظهر هنا' : 'Featured fragrance will appear here'}</p></div>`;
      return;
    }

    // Admin controls the single featured perfume (is_featured === true)
    const featured = candidates.find(p => p.is_featured) || candidates[0];
    const d = unpackProduct(featured);
    const pricing = computeProductPrice(featured);

    const localized = window.PerfumeI18n ? window.PerfumeI18n.getLocalizedProduct(featured, currentLang) : null;
    const prodName = localized ? localized.name : (isAr ? featured.name : (featured.latin || featured.name));

    // Clean, prestigious watermark text behind the bottle (perfume latin name or brand)
    let rawWatermark = (featured.latin || featured.name || 'ROUH').trim();
    // Remove parentheses/brackets and take 1-2 primary words
    rawWatermark = rawWatermark.replace(/[\(\)\[\]\{\}]/g, '').replace(/[-_]/g, ' ').split(/\s+/).slice(0, 2).join(' ').trim().toUpperCase();
    if (!rawWatermark || rawWatermark.length < 2) rawWatermark = 'ROUH';

    const wmWords = rawWatermark.split(/\s+/).filter(Boolean);
    const isMultiWord = wmWords.length > 1;
    const watermarkHtml = wmWords.map(w => `<span class="wm-line">${escapeHtml(w)}</span>`).join('');

    const safeImg = escapeHtml(featured.image_url || 'assets/branding/2.svg');
    const safeName = escapeHtml(prodName || 'Rou7');
    const shortName = escapeHtml(prodName ? prodName.split(/[-–—|]/)[0].trim() : 'Rou7');
    const inspiredText = d.inspired_by ? `${isAr ? 'مستوحى من' : 'Inspired by'}: <strong>${escapeHtml(d.inspired_by)}</strong>` : '';

    // Extract fragrance key notes
    const topRaw = d.top_notes || '';
    const midRaw = d.middle_notes || '';
    const baseRaw = d.base_notes || '';
    const transNote = raw => window.PerfumeI18n ? window.PerfumeI18n.translateNotes(raw, currentLang) : raw;

    const topList = topRaw ? topRaw.split(/[,،]/).map(s => s.trim()).filter(Boolean).slice(0, 2) : [];
    const midList = midRaw ? midRaw.split(/[,،]/).map(s => s.trim()).filter(Boolean).slice(0, 2) : [];
    const baseList = baseRaw ? baseRaw.split(/[,،]/).map(s => s.trim()).filter(Boolean).slice(0, 2) : [];

    // Gender Category text
    let genderText = isAr ? 'للجميع (Unisex)' : 'Unisex';
    if (featured.gender === 'men' || featured.category === 'men') genderText = isAr ? 'عطر رجالي 🎩' : 'For Men 🎩';
    else if (featured.gender === 'women' || featured.category === 'women') genderText = isAr ? 'عطر نسائي 🌸' : 'For Her 🌸';

    hero.innerHTML = `
      <div class="hero-3d-showcase" id="hero3dShowcase">
        <!-- Giant High-Fashion Background Watermark Typography -->
        <div class="hero-bg-watermark ${isMultiWord ? 'multi-word' : 'single-word'}" id="heroWatermark" aria-hidden="true">${watermarkHtml}</div>

        <!-- Center Stage: 3D Floating Perfume Bottle -->
        <div class="hero-bottle-center-stage" id="heroBottleStage">
          <div class="hero-aura-glow" aria-hidden="true"></div>
          <div class="hero-bottle-float-wrap" id="heroBottleWrap">
            <div class="hero-bottle-contact-shadow" aria-hidden="true"></div>
            <a href="product.html?id=${encodeURIComponent(featured.id)}" class="hero-bottle-3d-link" id="heroBottleLink" title="${safeName}">
              <img class="hero-bottle-3d-img" src="${safeImg}" alt="${safeName}" loading="eager">
            </a>
          </div>

          <!-- Interactive Trigger Button -->
          <button type="button" class="hero-bottle-trigger-btn" id="heroBottleTriggerBtn" aria-label="${isAr ? `عرض تفاصيل عطر ${shortName}` : `Show Fragrance Details for ${shortName}`}">
            <span>${isAr ? `اضغط لاكتشاف عطر ${shortName}` : `Discover ${shortName}`}</span>
          </button>
        </div>

        <!-- Modal Overlay: Floating Product Info HUD Card (Opens on Click) -->
        <div class="hero-hud-modal-overlay" id="heroHudModalOverlay" aria-hidden="true">
          <div class="hero-info-hud" id="heroInfoHud" role="dialog" aria-modal="true" aria-labelledby="heroProductTitle">
            <button type="button" class="hero-hud-close-btn" id="heroHudCloseBtn" aria-label="${isAr ? 'إغلاق' : 'Close'}">✕</button>

            <div class="hero-hud-badge-row">
              <span class="hero-badge-pill">
                <span class="hero-badge-spark">✦</span>
                <span>${isAr ? 'عطر الواجهة الاستثنائي' : 'Featured Signature Fragrance'}</span>
                <span class="hero-badge-spark">✦</span>
              </span>
              <span class="hero-gender-badge">${genderText}</span>
            </div>

            <h2 class="hero-product-title" id="heroProductTitle">
              <a href="product.html?id=${encodeURIComponent(featured.id)}">${safeName}</a>
            </h2>

            ${inspiredText ? `<p class="hero-inspired-by"><span>✦</span> ${inspiredText}</p>` : ''}

            ${(topList.length || midList.length || baseList.length) ? `
              <div class="hero-notes-chips-row">
                ${topList.map(n => `<span class="hero-note-chip">🌸 ${escapeHtml(transNote(n))}</span>`).join('')}
                ${midList.map(n => `<span class="hero-note-chip">💖 ${escapeHtml(transNote(n))}</span>`).join('')}
                ${baseList.map(n => `<span class="hero-note-chip">🌲 ${escapeHtml(transNote(n))}</span>`).join('')}
              </div>
            ` : ''}

            <div class="hero-pricing-cta-row">
              <div class="hero-price-block">
                <span class="hero-price-current">${money(pricing.price)}</span>
                ${pricing.hasDiscount ? `<del class="hero-price-original">${money(pricing.originalPrice)}</del><span class="hero-sale-badge">${escapeHtml(pricing.discountBadge)}</span>` : ''}
              </div>
              <div class="hero-buttons-group">
                <a href="product.html?id=${encodeURIComponent(featured.id)}" class="button button-primary btn-hero-explore">
                  <span>${isAr ? 'استكشف العطر' : 'Explore Fragrance'}</span>
                  <span class="arrow-icon">←</span>
                </a>
                <button type="button" class="button btn-hero-quickadd" data-add="${featured.id}">
                  <span>＋</span>
                  <span>${isAr ? 'أضف للسلة' : 'Add to Bag'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // ── Interactive 3D Parallax & Tilt Physics ──────────────────────────────
    const showcase = $('#hero3dShowcase');
    const bottleWrap = $('#heroBottleWrap');
    const watermark = $('#heroWatermark');

    if (showcase && bottleWrap) {
      let isInteracting = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;

      function updateTilt() {
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        if (bottleWrap) {
          bottleWrap.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
        }
        if (watermark) {
          const wmShiftX = -currentRotY * 1.6;
          const wmShiftY = -currentRotX * 1.6;
          watermark.style.transform = `translate(calc(-50% + ${wmShiftX.toFixed(1)}px), calc(-50% + ${wmShiftY.toFixed(1)}px))`;
        }

        if (isInteracting || Math.abs(targetRotX - currentRotX) > 0.05 || Math.abs(targetRotY - currentRotY) > 0.05) {
          heroTiltRaf = requestAnimationFrame(updateTilt);
        } else {
          heroTiltRaf = null;
        }
      }

      function onPointerMove(clientX, clientY) {
        const rect = showcase.getBoundingClientRect();
        const nx = (clientX - rect.left) / rect.width - 0.5;
        const ny = (clientY - rect.top) / rect.height - 0.5;
        targetRotX = -ny * 16;
        targetRotY = nx * 22;
        isInteracting = true;
        if (!heroTiltRaf) heroTiltRaf = requestAnimationFrame(updateTilt);
      }

      showcase.addEventListener('mousemove', e => {
        onPointerMove(e.clientX, e.clientY);
      });

      showcase.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
        isInteracting = false;
        if (!heroTiltRaf) heroTiltRaf = requestAnimationFrame(updateTilt);
      });

      showcase.addEventListener('touchmove', e => {
        if (e.touches && e.touches[0]) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      showcase.addEventListener('touchend', () => {
        targetRotX = 0;
        targetRotY = 0;
        isInteracting = false;
        if (!heroTiltRaf) heroTiltRaf = requestAnimationFrame(updateTilt);
      });
    }

    // Modal Open & Close logic
    const overlay = hero.querySelector('#heroHudModalOverlay');
    const closeBtn = hero.querySelector('#heroHudCloseBtn');
    const bottleLink = hero.querySelector('#heroBottleLink');
    const triggerBtn = hero.querySelector('#heroBottleTriggerBtn');
    const bottleWrapEl = hero.querySelector('#heroBottleWrap');

    function openHudModal() {
      if (!overlay) return;
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('hero-modal-open');
    }

    function closeHudModal() {
      if (!overlay) return;
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('hero-modal-open');
    }

    bottleLink?.addEventListener('click', e => {
      e.preventDefault();
      openHudModal();
    });

    triggerBtn?.addEventListener('click', e => {
      e.preventDefault();
      openHudModal();
    });

    bottleWrapEl?.addEventListener('click', e => {
      if (e.target.closest('#heroBottleTriggerBtn')) return;
      e.preventDefault();
      openHudModal();
    });

    closeBtn?.addEventListener('click', e => {
      e.preventDefault();
      closeHudModal();
    });

    overlay?.addEventListener('click', e => {
      if (e.target === overlay) {
        closeHudModal();
      }
    });

    // Close on Escape key
    if (window._heroEscHandler) {
      window.removeEventListener('keydown', window._heroEscHandler);
    }
    window._heroEscHandler = e => {
      if (e.key === 'Escape' && overlay?.classList.contains('active')) {
        closeHudModal();
      }
    };
    window.addEventListener('keydown', window._heroEscHandler);

    // Quick add to cart
    hero.querySelector('.btn-hero-quickadd')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(featured.id, e.currentTarget);
    });
  }

  function unpackProduct(p) {
    if (!p) return {};
    let meta = {};
    if (p.notes && typeof p.notes === 'string' && (p.notes.trim().startsWith('{') || p.notes.trim().startsWith('['))) {
      try { meta = JSON.parse(p.notes); } catch (_) {}
    }

    const isAr = currentLang === 'ar';
    let localizedDesc = '';
    let localizedTop = '';
    let localizedMid = '';
    let localizedBase = '';
    if (window.PerfumeI18n) {
      const loc = window.PerfumeI18n.getLocalizedProduct(p, currentLang);
      if (loc) {
        if (loc.desc) localizedDesc = loc.desc;
        if (loc.top_notes) localizedTop = loc.top_notes;
        if (loc.middle_notes) localizedMid = loc.middle_notes;
        if (loc.base_notes) localizedBase = loc.base_notes;
      }
    }
    if (!localizedDesc) {
      if (isAr) {
        localizedDesc = (meta.desc_ar && /[\u0600-\u06FF]/.test(meta.desc_ar)) ? meta.desc_ar : (window.PerfumeI18n ? window.PerfumeI18n.translateDesc(meta.desc || p.notes || '', 'ar', p.id, p.name) : (meta.desc || p.notes || ''));
      } else {
        localizedDesc = (meta.desc_en && /[a-zA-Z]/.test(meta.desc_en)) ? meta.desc_en : (window.PerfumeI18n ? window.PerfumeI18n.translateDesc(meta.desc || p.notes || '', 'en', p.id, p.latin || p.name) : (meta.desc || p.notes || ''));
      }
    }

    return {
      brand:        p.brand || meta.brand || 'رُوح',
      brand_ar:     meta.brand_ar || '',
      notes:        localizedDesc || (meta.desc !== undefined ? meta.desc : (p.notes || '')),
      desc:         localizedDesc || (meta.desc !== undefined ? meta.desc : (p.notes || '')),
      top_notes:    localizedTop || p.top_notes || meta.top_notes || '',
      middle_notes: localizedMid || p.middle_notes || meta.middle_notes || '',
      base_notes:   localizedBase || p.base_notes || meta.base_notes || '',
      inspired_by:  p.inspired_by || meta.inspired_by || '',
      longevity:    parseInt(p.longevity || meta.longevity) || 3,
      sillage:      parseInt(p.sillage || meta.sillage) || 2,
      accords:      p.accords || meta.accords || '',
      main_accord:  p.main_accord || meta.main_accord || '',
      seasons:      p.seasons || meta.seasons || '',
      sale_price:   p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : (meta.sale_price !== undefined ? meta.sale_price : ''),
      discount_percent: p.discount_percent || meta.discount_percent || '',
      discount_badge:   p.discount_badge || meta.discount_badge || '',
      stock_quantity:   p.stock_quantity !== undefined && p.stock_quantity !== null ? p.stock_quantity : (meta.stock_quantity !== undefined && meta.stock_quantity !== null ? meta.stock_quantity : ''),
      in_solar_system:  Boolean(p.in_solar_system !== undefined ? p.in_solar_system : meta.in_solar_system)
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
    const localizedStr = window.PerfumeI18n ? window.PerfumeI18n.translateNotes(notesStr, currentLang) : notesStr;
    return localizedStr.split(/[,،]/).map(n => n.trim()).filter(Boolean).map(n => {
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

  function getLongevityLabel(lvl) {
    const isAr = currentLang === 'ar';
    const map = isAr
      ? { 1: 'أقل من ساعة', 2: '١-٣ ساعات', 3: '٤-٦ ساعات', 4: '٨-١٠ ساعات', 5: 'أكثر من ١٢ ساعة' }
      : { 1: '< 1 hr', 2: '1-3 hrs', 3: '4-6 hrs', 4: '8-10 hrs', 5: '12+ hrs' };
    return map[lvl] || (isAr ? '٤-٦ ساعات' : '4-6 hrs');
  }

  function getSillageLabel(lvl) {
    const isAr = currentLang === 'ar';
    const map = isAr
      ? { 1: 'ملاصق للبشرة', 2: 'هادئ وقريب', 3: 'معتدل وواضح', 4: 'قوي ومميز', 5: 'فوحان طاغٍ (وحش)' }
      : { 1: 'Intimate Skin Scent', 2: 'Soft & Close', 3: 'Moderate & Noticeable', 4: 'Strong & Distinct', 5: 'Beast Mode' };
    return map[lvl] || (isAr ? 'معتدل وواضح' : 'Moderate');
  }

  function renderAccordPills(accordsStr) {
    if (!accordsStr) return '';
    const localizedAccords = window.PerfumeI18n ? window.PerfumeI18n.translateNotes(accordsStr, currentLang) : accordsStr;
    return localizedAccords.split(/[,،]/).map(a => a.trim()).filter(Boolean).map(a => {
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
        <strong class="perf-metric-val">${getLongevityLabel(longVal)}</strong>
        ${renderPerfBars(longVal)}
      </div>
      <div class="perf-metric-box">
        <span class="perf-metric-tag">${currentLang === 'ar' ? 'الانتشار · SILLAGE' : 'SILLAGE'}</span>
        <strong class="perf-metric-val">${getSillageLabel(silVal)}</strong>
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

    // Fast-path gender check: Unisex fragrances are included in women and men, but show alone when searching for unisex
    if (qNorm === 'نسائي' || qNorm === 'حريمي' || qNorm === 'بناتي' || qNorm === 'women' || qNorm === 'for her') {
      return normCat === 'women' || normCat === 'unisex';
    }
    if (qNorm === 'رجالي' || qNorm === 'شبابي' || qNorm === 'men' || qNorm === 'for him') {
      return normCat === 'men' || normCat === 'unisex';
    }
    if (qNorm === 'للجميع' || qNorm === 'مشترك' || qNorm === 'للجنسين' || qNorm === 'unisex') {
      return normCat === 'unisex';
    }

    const prodBrand = (d.brand || product.brand || 'رُوح');
    const bObj = findBrand(prodBrand);
    const bAr = bObj ? bObj.name_ar : '';
    const bEn = bObj ? bObj.name_en : '';
    const brandAlias = BRAND_SEARCH_ALIASES[prodBrand.toLowerCase()] || BRAND_SEARCH_ALIASES[prodBrand] || '';
    const catAlias = CATEGORY_SEARCH_ALIASES[normCat] || '';

    const haystack = normalizeSearchText(
      `${product.name} ${product.latin || ''} ${prodBrand} ${bAr} ${bEn} ${brandAlias} ${d.brand_ar || ''} ${catAlias} ${d.notes} ${d.top_notes} ${d.middle_notes} ${d.base_notes} ${d.inspired_by} ${d.accords}`
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
          const pImg = p.image_url || 'assets/branding/2.svg';
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
        if (soundText) soundText.textContent = isAr ? 'همس الطبيعة: شغال 🍃' : 'Nature: Playing 🍃';
      } else {
        soundToggle.classList.remove('playing');
        homeAudio.stopAmbient();
        if (soundText) soundText.textContent = isAr ? 'همس الطبيعة' : 'Nature Sounds';
      }
    });
  }

  function renderProducts() {
    const t = I18N[currentLang];

    // Update Brand Filter Dropdown & Chips
    const brandSel = $('#collectionBrandFilter');
    const brandChipsBar = $('#brandChipsBar');

    const brandMap = new Map();
    products.forEach(p => {
      if (p.name.startsWith('__system_') || p.in_stock === false) return;
      const d = unpackProduct(p);
      const rawBrand = (d.brand || 'رُوح').trim();
      const bObj = findBrand(rawBrand);
      const key = bObj ? (bObj.name_en || bObj.name_ar) : rawBrand;
      if (!brandMap.has(key.toLowerCase())) {
        brandMap.set(key.toLowerCase(), {
          key: key,
          name_ar: bObj ? bObj.name_ar : rawBrand,
          name_en: bObj ? bObj.name_en : rawBrand,
          logo_url: bObj ? bObj.logo_url : '',
          raw: rawBrand
        });
      }
    });

    const activeBrandsList = Array.from(brandMap.values());

    if (brandSel) {
      const prevBrandVal = brandSel.value || activeBrand || 'all';
      let optHtml = `<option value="all">${currentLang === 'ar' ? 'كل البراندات (All Brands)' : 'All Brands'}</option>`;
      activeBrandsList.forEach(b => {
        const display = currentLang === 'en' ? (b.name_en || b.name_ar) : (b.name_ar || b.name_en);
        const isSel = b.key.toLowerCase() === prevBrandVal.toLowerCase() || b.raw.toLowerCase() === prevBrandVal.toLowerCase();
        optHtml += `<option value="${escapeHtml(b.key)}" ${isSel ? 'selected' : ''}>${escapeHtml(display)}</option>`;
      });
      brandSel.innerHTML = optHtml;
    }

    if (brandChipsBar) {
      const isAllActive = activeBrand === 'all' ? 'active' : '';
      let chipsHtml = `<button type="button" class="brand-chip ${isAllActive}" data-brand-chip="all">${currentLang === 'ar' ? '✨ كل البراندات' : '✨ All Brands'}</button>`;
      activeBrandsList.forEach(b => {
        const display = currentLang === 'en' ? (b.name_en || b.name_ar) : (b.name_ar || b.name_en);
        const isAct = activeBrand.toLowerCase() === b.key.toLowerCase() || activeBrand.toLowerCase() === b.raw.toLowerCase() || (b.name_ar && activeBrand.toLowerCase() === b.name_ar.toLowerCase()) ? 'active' : '';
        const logoHtml = b.logo_url ? `<img src="${escapeHtml(b.logo_url)}" class="chip-brand-logo" alt="">` : '';
        chipsHtml += `<button type="button" class="brand-chip ${isAct}" data-brand-chip="${escapeHtml(b.key)}">${logoHtml}<span>${escapeHtml(display)}</span></button>`;
      });
      brandChipsBar.innerHTML = chipsHtml;
    }

    // Toggle Gifts & Custom Box Builder Banner
    const giftsBanner = $('#giftsBuilderBanner');
    if (giftsBanner) {
      if (activeFilter === 'gifts') {
        giftsBanner.style.display = 'block';
        giftsBanner.innerHTML = `
          <div class="gifts-builder-banner">
            <div class="gbb-glow" aria-hidden="true"></div>
            <div class="gbb-content">
              <span class="gbb-badge"><span>🎁</span> ${t.gift_builder_badge}</span>
              <h3 class="gbb-title">${t.gift_builder_title}</h3>
              <p class="gbb-desc">${t.gift_builder_desc}</p>
            </div>
            <button type="button" class="btn-open-gift-builder" id="btnOpenGiftBuilder">
              <span>✨</span> ${t.gift_builder_btn}
            </button>
          </div>
        `;
        $('#btnOpenGiftBuilder')?.addEventListener('click', openGiftBuilderModal);
      } else {
        giftsBanner.style.display = 'none';
        giftsBanner.innerHTML = '';
      }
    }

    const visible = products.filter(product => {
      if (product.name.startsWith('__system_') || product.in_stock === false) return false;
      const d = unpackProduct(product);
      const bObj = findBrand(d.brand || product.brand);
      const prodBrandKey = bObj ? (bObj.name_en || bObj.name_ar) : (d.brand || 'رُوح');
      const pCat = (product.category || 'unisex').toLowerCase();
      const normCat = (pCat === 'gifts' || pCat.includes('هد') || pCat.includes('gift') || pCat.includes('box') || pCat.includes('بوكس')) ? 'gifts'
        : (pCat === 'women' || pCat.includes('نسائ') || pCat.includes('her')) ? 'women'
        : (pCat === 'men' || pCat.includes('رجال') || pCat.includes('him')) ? 'men' : 'unisex';

      // 1. Gender / Category Filter: 'all', 'women', 'men', 'unisex', 'gifts'
      // Unisex fragrances appear in Women and Men, and appear alone when Unisex is selected
      // Gifts appear when 'gifts' is active or in 'all'
      if (activeFilter === 'gifts') {
        if (normCat !== 'gifts') return false;
      } else if (activeFilter === 'women') {
        if (normCat !== 'women' && normCat !== 'unisex') return false;
      } else if (activeFilter === 'men') {
        if (normCat !== 'men' && normCat !== 'unisex') return false;
      } else if (activeFilter === 'unisex') {
        if (normCat !== 'unisex') return false;
      }

      // 2. Brand Filter: 'all' or specific brand
      if (activeBrand !== 'all') {
        const abLow = activeBrand.toLowerCase();
        const matchesBrand = prodBrandKey.toLowerCase() === abLow ||
          (d.brand && d.brand.toLowerCase() === abLow) ||
          (bObj && (bObj.name_en.toLowerCase() === abLow || bObj.name_ar.toLowerCase() === abLow || bObj.id.toLowerCase() === abLow));
        if (!matchesBrand) return false;
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
          const localized = window.PerfumeI18n ? window.PerfumeI18n.getLocalizedProduct(product, currentLang) : null;
          const d = unpackProduct(product);
          const pricing = computeProductPrice(product);
          const prodName = localized ? localized.name : (currentLang === 'en' ? (product.latin || product.name) : product.name);
          const prodSub  = localized ? localized.sub : (currentLang === 'en' ? (product.latin ? product.name : '') : (product.latin || ''));
          const prodDesc = (localized && localized.desc) ? localized.desc : (d.notes || '');
          const bObj = findBrand(d.brand || product.brand);
          const prodBrandKey = bObj ? (bObj.name_en || bObj.name_ar) : (d.brand || 'رُوح');
          const prodBrandDisplay = bObj ? (currentLang === 'en' ? (bObj.name_en || bObj.name_ar) : (bObj.name_ar || bObj.name_en)) : prodBrandKey;
          const brandLogoBadge = bObj && bObj.logo_url
            ? `<img src="${escapeHtml(bObj.logo_url)}" class="brand-badge-logo" alt="">`
            : '';

          const isOutOfStock = product.in_stock === false || (d.stock_quantity !== '' && d.stock_quantity !== undefined && parseInt(d.stock_quantity) <= 0);

          const tagHtml = isOutOfStock
            ? `<span class="product-tag out-of-stock" style="background:#ff4757; color:#fff;">${currentLang === 'ar' ? 'نفد من المخزون' : 'Out of Stock'}</span>`
            : (pricing.hasDiscount
                ? `<span class="product-tag tag-discount">${escapeHtml(pricing.discountBadge)}</span>`
                : (product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : ''));

          const priceHtml = pricing.hasDiscount
            ? `<div class="product-price-wrap">
                <span class="product-price-val price-sale">${money(pricing.price)}</span>
                <del class="product-old-price">${money(pricing.originalPrice)}</del>
               </div>`
            : `<span class="product-price-val">${money(pricing.price)}</span>`;

          const quickAddBtnHtml = isOutOfStock
            ? `<button class="quick-add disabled" type="button" disabled style="opacity: 0.65; cursor: not-allowed; background: rgba(0,0,0,0.6);">${currentLang === 'ar' ? 'نفد من المخزون' : 'Out of Stock'} <span>✕</span></button>`
            : `<button class="quick-add" data-add="${product.id}" type="button">${t.quick_add} <span>＋</span></button>`;

          // Key notes preview
          let notesPreview = '';
          const topN = localized ? localized.top_notes : d.top_notes;
          const midN = localized ? localized.middle_notes : d.middle_notes;
          const baseN = localized ? localized.base_notes : d.base_notes;
          if (topN || midN || baseN) {
            const rawParts = [topN, midN, baseN].filter(Boolean).join(',').split(/[,،]/).map(s => s.trim()).filter(Boolean).slice(0, 3);
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

          return `<article class="product-card" data-product-id="${product.id}" style="--card-accent: ${getAccordDotColor(d.main_accord || d.accords || 'default')}">
            <div class="product-image">
              <a href="product.html?id=${product.id}" class="product-thumb-link" aria-label="${escapeHtml(prodName)}">
                ${product.image_url ? `<img src="${product.image_url}" alt="${escapeHtml(prodName)}" loading="lazy" decoding="async">` : ''}
              </a>
              ${tagHtml}
              ${quickAddBtnHtml}
            </div>
            <div class="product-info">
              <span class="card-brand-badge" data-brand-filter="${escapeHtml(prodBrandKey)}">${brandLogoBadge}<span>${escapeHtml(prodBrandDisplay)}</span></span>
              <div class="product-meta">
                <h3><a href="product.html?id=${product.id}" class="prod-title-link">${escapeHtml(prodName)}</a> ${prodSub ? `<small style="font-size:12.5px;opacity:.7;display:block;">${escapeHtml(prodSub)}</small>` : ''}</h3>
                ${priceHtml}
              </div>
              ${d.inspired_by ? `<div class="card-inspired-tag"><span class="ci-label">${currentLang === 'ar' ? 'مستوحى من' : 'Inspired by'}</span> <strong>${escapeHtml(d.inspired_by)}</strong></div>` : ''}
              ${notesPreview}
              ${moodMatchPillHtml}
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
          ${product.image_url ? `<img id="detailHeroImg" src="${product.image_url}" alt="${escapeHtml(prodName)}">` : '<span class="detail-placeholder">🧴</span>'}
          ${(() => {
            let metaImgs = [];
            if (product.notes && typeof product.notes === 'string' && (product.notes.trim().startsWith('{') || product.notes.trim().startsWith('['))) {
              try { metaImgs = JSON.parse(product.notes).images || []; } catch (_) {}
            }
            const allImgs = Array.isArray(product.images) && product.images.length
              ? product.images
              : (Array.isArray(metaImgs) && metaImgs.length ? metaImgs : (product.image_url ? [product.image_url] : []));
            if (allImgs.length <= 1) return '';
            return `
              <div class="detail-gallery-thumbs">
                ${allImgs.map((img, i) => `
                  <button type="button" class="detail-thumb-btn ${i === 0 ? 'active' : ''}" onclick="
                    const hero = document.getElementById('detailHeroImg');
                    if (hero) hero.src = '${escapeHtml(img)}';
                    this.parentElement.querySelectorAll('.detail-thumb-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                  ">
                    <img src="${escapeHtml(img)}" alt="" loading="lazy">
                  </button>
                `).join('')}
              </div>
            `;
          })()}
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

      ${(() => {
        const localized = window.PerfumeI18n ? window.PerfumeI18n.getLocalizedProduct(product, currentLang) : null;
        const descText = (localized && localized.desc) ? localized.desc : d.notes;
        return descText ? `<div class="detail-desc-box"><p>${escapeHtml(descText)}</p></div>` : '';
      })()}

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
      products = Array.isArray(rows) ? rows.filter(p => !p.name.startsWith('__system_')) : [];
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
    cart = cart.filter(row => row.qty > 0 && (row.is_custom_box || products.some(product => product.id === row.id)));
    const count = cart.reduce((sum, row) => sum + row.qty, 0);
    $('#cartCount').textContent = formatDigits(count);
    $('#drawerCount').textContent = `(${formatDigits(count)})`;
    $('#cartEmpty').classList.toggle('show', count === 0);
    $('#cartSummary').classList.toggle('empty', count === 0);

    $('#cartItems').innerHTML = cart.map((row, idx) => {
      if (row.is_custom_box) {
        const prodName = row.name || (currentLang === 'ar' ? 'بوكس هدايا رُوح الملكي 🎁' : 'Rou7 Royal Gift Box 🎁');
        const boxItemsDesc = Array.isArray(row.box_items) ? row.box_items.join(' + ') : (row.box_items || '');
        const cardMsgDesc = row.card_message ? (currentLang === 'ar' ? `كارت إهداء: "${row.card_message}"` : `Card: "${row.card_message}"`) : '';
        return `<div class="cart-row cart-custom-box-card">
          <div class="cart-thumb"><span style="font-size:24px;">🎁</span></div>
          <div>
            <h3>${escapeHtml(prodName)}</h3>
            <p>${money(row.customPrice || row.price || 0)}</p>
            ${boxItemsDesc ? `<div class="cart-custom-box-notes"><strong>${currentLang === 'ar' ? 'العطور:' : 'Perfumes:'}</strong> ${escapeHtml(boxItemsDesc)}</div>` : ''}
            ${cardMsgDesc ? `<div class="cart-custom-box-card"><strong>💌</strong> ${escapeHtml(cardMsgDesc)}</div>` : ''}
            <div class="qty">
              <button data-cart-idx="${idx}" data-qty="${row.id}" data-step="-1" aria-label="تقليل">−</button>
              <span>${formatDigits(row.qty)}</span>
              <button data-cart-idx="${idx}" data-qty="${row.id}" data-step="1" aria-label="زيادة">＋</button>
            </div>
          </div>
          <button class="remove-item" data-cart-rm="${idx}" data-remove="${row.id}" aria-label="حذف">×</button>
        </div>`;
      }

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
          ${row.selectedSize ? `<div style="margin:2px 0;"><span style="display:inline-block; font-size:11px; background:rgba(140, 115, 85, 0.12); color:#8c7355; border:1px solid rgba(140, 115, 85, 0.25); padding:1px 8px; border-radius:12px; font-weight:600;">🧴 ${escapeHtml(row.selectedSize)}</span></div>` : ''}
          <p>${priceDisplay}</p>
          <div class="qty">
            <button data-cart-idx="${idx}" data-qty="${product.id}" data-step="-1" aria-label="تقليل">−</button>
            <span>${formatDigits(row.qty)}</span>
            <button data-cart-idx="${idx}" data-qty="${product.id}" data-step="1" aria-label="زيادة">＋</button>
          </div>
        </div>
        <button class="remove-item" data-cart-rm="${idx}" data-remove="${product.id}" aria-label="حذف ${escapeHtml(prodName)}">×</button>
      </div>`;
    }).join('');

    const total = cart.reduce((sum, row) => sum + (row.customPrice || (products.find(p => p.id === row.id)?.price || 0)) * row.qty, 0);
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
    if (!product) return;

    const d = unpackProduct(product);
    const isOutOfStock = product.in_stock === false || (d.stock_quantity !== '' && d.stock_quantity !== undefined && parseInt(d.stock_quantity) <= 0);
    if (isOutOfStock) {
      showToast(currentLang === 'ar' ? 'عفواً، هذا العطر غير متوفر في المخزون حالياً' : 'Sorry, this fragrance is currently out of stock');
      return;
    }

    const row = cart.find(item => String(item.id) === String(id));
    const currentQtyInCart = row ? row.qty : 0;
    if (d.stock_quantity !== '' && d.stock_quantity !== undefined) {
      const maxStock = parseInt(d.stock_quantity) || 0;
      if (currentQtyInCart + 1 > maxStock) {
        showToast(currentLang === 'ar' ? `عفواً، أقصى كمية متاحة في المخزون هي ${formatDigits(maxStock)} قطعة فقط` : `Sorry, only ${maxStock} items available in stock`);
        return;
      }
    }

    const pricing = computeProductPrice(product);
    const finalPrice = customPrice !== null ? customPrice : (pricing && pricing.hasDiscount ? pricing.price : null);

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

  // ── Custom Gift Box Interactive Builder ──────────────────────────────────
  const giftModal = $('#giftBoxBuilderModal');
  const giftContainer = $('#giftBuilderContainer');
  let giftSelectedTier = 2; // Default 2 perfumes
  let giftSelectedPerfumeIds = [];
  let giftCardMessage = '';

  const GIFT_TIERS = {
    2: { id: 2, key: 'gift_tier_2', title_ar: 'بوكس الثنائيات الملكي (عطرين ٥٠ مل)', title_en: 'Royal Duo Box (2 Perfumes 50ml)', price: 2800, max: 2, sub_ar: 'اختر عطرين فاخرين مع كارت إهداء وتغليف ملكي', sub_en: 'Choose 2 luxury fragrances + card & velvet box' },
    3: { id: 3, key: 'gift_tier_3', title_ar: 'بوكس الترويكا الملكي (٣ عطور ٥٠ مل)', title_en: 'Elite Trio Box (3 Perfumes 50ml)', price: 3900, max: 3, sub_ar: 'اختر ٣ عطور مفضلة مع كارت إهداء وتغليف ملكي', sub_en: 'Choose 3 favorite fragrances + card & velvet box' },
    4: { id: 4, key: 'gift_tier_4', title_ar: 'بوكس النخبة الملكي (٤ عطور ٥٠ مل)', title_en: 'Masterpiece Box (4 Perfumes 50ml)', price: 4900, max: 4, sub_ar: 'المجموعة الكاملة ٤ عطور مع كارت إهداء وتغليف ملكي', sub_en: 'Complete 4-perfume collection + card & velvet box' }
  };

  function openGiftBuilderModal() {
    giftSelectedTier = 2;
    giftSelectedPerfumeIds = [];
    giftCardMessage = '';
    renderGiftBuilder();
    if (giftModal) {
      giftModal.classList.add('open');
      document.body.classList.add('modal-open');
    }
  }

  function closeGiftBuilderModal() {
    if (giftModal) {
      giftModal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  }

  function renderGiftBuilder() {
    if (!giftContainer) return;
    const isAr = currentLang === 'ar';
    const t = I18N[currentLang];
    const currentTier = GIFT_TIERS[giftSelectedTier] || GIFT_TIERS[2];

    // Selectable perfumes: In-stock non-gift fragrances
    const candidatePerfumes = products.filter(p => {
      if (p.name.startsWith('__system_') || p.in_stock === false) return false;
      const pCat = (p.category || '').toLowerCase();
      if (pCat === 'gifts' || pCat.includes('هد') || pCat.includes('gift') || pCat.includes('box')) return false;
      return true;
    });

    const isComplete = giftSelectedPerfumeIds.length === currentTier.max;

    giftContainer.innerHTML = `
      <div class="gb-header">
        <span class="gb-badge"><span>🎁</span> ${t.gift_builder_badge}</span>
        <h2 class="gb-title" id="giftBuilderTitle">${t.gift_modal_title}</h2>
        <p class="gb-desc">${t.gift_builder_desc}</p>
      </div>

      <!-- Tiers Selection -->
      <div class="gb-tiers-row">
        ${[2, 3, 4].map(tierId => {
          const tier = GIFT_TIERS[tierId];
          const isAct = giftSelectedTier === tierId ? 'active' : '';
          return `
            <div class="gb-tier-card ${isAct}" data-tier-id="${tierId}" role="button" tabindex="0">
              <div class="gb-tier-name">${isAr ? tier.title_ar : tier.title_en}</div>
              <div class="gb-tier-sub">${isAr ? tier.sub_ar : tier.sub_en}</div>
              <div class="gb-tier-price">${money(tier.price)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Perfumes Selection -->
      <div class="gb-picker-status">
        <span>${t.gift_select_fragrances}</span>
        <span class="gb-picker-counter">${isAr ? `تم اختيار: ${arabicDigits(giftSelectedPerfumeIds.length)} من ${arabicDigits(currentTier.max)} عطور` : `Selected: ${giftSelectedPerfumeIds.length} of ${currentTier.max}`}</span>
      </div>

      <div class="gb-perfumes-grid">
        ${candidatePerfumes.map(p => {
          const isSel = giftSelectedPerfumeIds.includes(String(p.id));
          const pName = isAr ? p.name : (p.latin || p.name);
          const pBrand = p.brand || 'رُوح';
          return `
            <div class="gb-perfume-chip ${isSel ? 'selected' : ''}" data-perfume-id="${p.id}" role="button" tabindex="0">
              <span class="gb-chip-check">${isSel ? '✓' : '＋'}</span>
              ${p.image_url ? `<img src="${p.image_url}" class="gb-chip-thumb" alt="${escapeHtml(pName)}" loading="lazy">` : '<span style="font-size:24px;">🧴</span>'}
              <span class="gb-chip-name">${escapeHtml(pName)}</span>
              <small class="gb-chip-brand">${escapeHtml(pBrand)}</small>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Dedication Card Message -->
      <div class="gb-card-field">
        <label for="gbCardInput" style="display:block; font-size:12px; margin-bottom:6px; font-weight:600; color:var(--ink);">
          💌 ${t.gift_card_msg_label}
        </label>
        <textarea id="gbCardInput" class="gb-card-input" placeholder="${escapeHtml(t.gift_card_msg_ph)}">${escapeHtml(giftCardMessage)}</textarea>
      </div>

      <!-- Footer & Actions -->
      <div class="gb-footer">
        <div class="gb-price-block">
          <span class="gb-price-label">${isAr ? 'السعر الإجمالي للبوكس الملكي:' : 'Total Box Price:'}</span>
          <span class="gb-price-val">${money(currentTier.price)}</span>
        </div>
        <div class="gb-actions-row">
          <button type="button" class="btn-gb-cart" id="btnGbAddToCart" ${!isComplete ? 'disabled' : ''}>
            ${t.gift_add_to_cart}
          </button>
          <button type="button" class="btn-gb-wa" id="btnGbOrderWa" ${!isComplete ? 'disabled' : ''}>
            <span>💬</span> ${t.gift_order_wa}
          </button>
        </div>
      </div>
    `;
  }

  // Handle Gift Builder Interactions
  giftContainer?.addEventListener('click', e => {
    // 1. Tier Card Selection
    const tierCard = e.target.closest('.gb-tier-card');
    if (tierCard) {
      const newTierId = parseInt(tierCard.dataset.tierId, 10);
      if (newTierId && GIFT_TIERS[newTierId]) {
        giftSelectedTier = newTierId;
        const max = GIFT_TIERS[newTierId].max;
        if (giftSelectedPerfumeIds.length > max) {
          giftSelectedPerfumeIds = giftSelectedPerfumeIds.slice(0, max);
        }
        renderGiftBuilder();
      }
      return;
    }

    // 2. Perfume Chip Toggle
    const chip = e.target.closest('.gb-perfume-chip');
    if (chip) {
      const pId = String(chip.dataset.perfumeId);
      const currentTier = GIFT_TIERS[giftSelectedTier] || GIFT_TIERS[2];
      const idx = giftSelectedPerfumeIds.indexOf(pId);
      if (idx !== -1) {
        giftSelectedPerfumeIds.splice(idx, 1);
      } else {
        if (giftSelectedPerfumeIds.length < currentTier.max) {
          giftSelectedPerfumeIds.push(pId);
        } else {
          showToast(currentLang === 'ar' ? `لقد اكتمل عدد عطور البوكس (${arabicDigits(currentTier.max)} عطور)` : `Box capacity reached (${currentTier.max} perfumes)`);
          return;
        }
      }
      renderGiftBuilder();
      return;
    }

    // 3. Add to Cart Button
    const addCartBtn = e.target.closest('#btnGbAddToCart');
    if (addCartBtn && !addCartBtn.disabled) {
      const currentTier = GIFT_TIERS[giftSelectedTier] || GIFT_TIERS[2];
      const isAr = currentLang === 'ar';
      const selectedNames = giftSelectedPerfumeIds.map(id => {
        const p = products.find(prod => String(prod.id) === String(id));
        return p ? (isAr ? p.name : (p.latin || p.name)) : '';
      }).filter(Boolean);

      const customBoxRow = {
        id: `custom_box_${Date.now()}`,
        name: isAr ? currentTier.title_ar : currentTier.title_en,
        latin: currentTier.title_en,
        is_custom_box: true,
        price: currentTier.price,
        customPrice: currentTier.price,
        qty: 1,
        box_items: selectedNames,
        card_message: giftCardMessage.trim()
      };

      cart.push(customBoxRow);
      updateCart();
      closeGiftBuilderModal();
      drawer(true);
      showToast(isAr ? 'تمت إضافة بوكس الهدايا الملكي إلى سلتك 🎁' : 'Royal Gift Box added to your bag 🎁');
      return;
    }

    // 4. WhatsApp Direct Order Button
    const waBtn = e.target.closest('#btnGbOrderWa');
    if (waBtn && !waBtn.disabled) {
      const currentTier = GIFT_TIERS[giftSelectedTier] || GIFT_TIERS[2];
      const isAr = currentLang === 'ar';
      const selectedNames = giftSelectedPerfumeIds.map(id => {
        const p = products.find(prod => String(prod.id) === String(id));
        return p ? (isAr ? p.name : (p.latin || p.name)) : '';
      }).filter(Boolean);

      let msg = '';
      if (isAr) {
        msg = `مرحباً رُوح، أود طلب بوكس هدايا ملكي مخصص:\n` +
          `🎁 *البوكس:* ${currentTier.title_ar}\n` +
          `🌸 *العطور المختارة:*\n${selectedNames.map((n, i) => `  ${i + 1}. ${n}`).join('\n')}\n` +
          (giftCardMessage.trim() ? `💌 *رسالة كارت الإهداء:* "${giftCardMessage.trim()}"\n` : '') +
          `💰 *السعر الإجمالي:* ${money(currentTier.price)}\n` +
          `أرجو تأكيد الطلب والتوصيل 🌸`;
      } else {
        msg = `Hello Rou7, I would like to order a curated Royal Gift Box:\n` +
          `🎁 *Box:* ${currentTier.title_en}\n` +
          `🌸 *Selected Fragrances:*\n${selectedNames.map((n, i) => `  ${i + 1}. ${n}`).join('\n')}\n` +
          (giftCardMessage.trim() ? `💌 *Card Message:* "${giftCardMessage.trim()}"\n` : '') +
          `💰 *Total Price:* ${money(currentTier.price)}\n` +
          `Please confirm my order 🌸`;
      }
      window.open(`${WHATSAPP_BASE_URL}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      closeGiftBuilderModal();
      return;
    }
  });

  // Keep card message updated on typing
  giftContainer?.addEventListener('input', e => {
    if (e.target.id === 'gbCardInput') {
      giftCardMessage = e.target.value;
    }
  });

  $('#giftBuilderClose')?.addEventListener('click', closeGiftBuilderModal);
  giftModal?.addEventListener('click', e => {
    if (e.target === giftModal) closeGiftBuilderModal();
  });

  $('#productGrid')?.addEventListener('click', event => {
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
  $('#heroProduct')?.addEventListener('click', event => {
    const button = event.target.closest('.btn-hero-quickadd');
    if (button && button.dataset.add) {
      event.preventDefault();
      event.stopPropagation();
      addToCart(button.dataset.add, button);
    }
  });

  // ── Scent Finder Interactive Quiz (Smart AI-powered Recommendation Engine) ──
  const quizModal = $('#scentQuizModal');
  const quizContainer = $('#quizContainer');
  let quizStep = 0;
  let quizAnswers = { category: '', mood: '', occasion: '', intensity: '', season: '' };

  // ── Mood-to-Accords & Notes Mapping (Intelligent keyword matching) ──
  const MOOD_KEYWORDS = {
    sweet:   { accords: ['sweet','gourmand','vanilla','caramel','chocolate','candy','sugar','honey','praline','toffee','tonka'], notes: ['vanilla','vanille','فانيليا','حلو','سكر','كراميل','عسل','شوكولاتة','توفي','تونكا','بنزوين','praline','caramel','sugar','honey','chocolate','toffee','candy','tonka','benzoin','dulce'] },
    woody:   { accords: ['woody','amber','oud','leather','earthy','smoky','tobacco','balsamic'], notes: ['oud','عود','wood','خشب','sandal','صندل','cedar','ارز','cashmere','كشمير','amber','عنبر','leather','جلد','vetiver','فتيفر','patchouli','باتشولي','agarwood','tobacco','تبغ','oakmoss','birch','guaiac'] },
    fresh:   { accords: ['fresh','citrus','aquatic','marine','green','aromatic','ozonic','fougere'], notes: ['bergamot','برغموت','lemon','ليمون','grapefruit','جريب','lime','aqua','بحر','marine','مائي','cucumber','نعناع','mint','lavender','خزامي','tea','شاي','clean','منعش','green','أخضر','basil','thyme'] },
    spicy:   { accords: ['spicy','oriental','arabian','oud','incense','bakhoor','musky','resinous','animalic'], notes: ['saffron','زعفران','cinnamon','قرفة','pepper','فلفل','clove','قرنفل','cardamom','هيل','ginger','زنجبيل','nutmeg','جوزة','incense','بخور','oud','عود','musk','مسك','frankincense','لبان','myrrh','مر','rose','ورد'] },
    floral:  { accords: ['floral','rose','jasmine','powdery','romantic','white floral','muguet'], notes: ['rose','ورد','jasmine','ياسمين','tuberose','فل','lily','زنبق','iris','سوسن','peony','gardenia','violet','بنفسج','magnolia','neroli','نيرولي','orange blossom','زهر البرتقال','ylang','freesia','orchid'] },
    musky:   { accords: ['musk','clean','skin','intimate','white musk','powdery'], notes: ['musk','مسك','white musk','مسك أبيض','powder','بودر','cashmere','كشمير','clean','نظيف','cotton','ambroxan','ambrette','cetalox'] }
  };

  // ── Occasion-to-Product Attribute Mapping ──
  const OCCASION_PROFILE = {
    daily:     { sillageMax: 3, longevityMin: 2, longevityMax: 4, seasonBoost: ['spring','summer','all'], moodBoost: ['fresh','floral','musky'] },
    evening:   { sillageMin: 3, longevityMin: 4, seasonBoost: ['fall','winter','all'], moodBoost: ['spicy','woody','sweet'] },
    winter:    { sillageMin: 3, longevityMin: 4, seasonBoost: ['fall','winter'], moodBoost: ['spicy','woody','sweet'] },
    summer:    { sillageMax: 3, longevityMin: 2, seasonBoost: ['spring','summer'], moodBoost: ['fresh','floral','musky'] },
    signature: { sillageMin: 2, longevityMin: 3, seasonBoost: ['all','spring','fall'], moodBoost: [] }
  };

  const quizQuestions = [
    {
      title_ar: '١. لمن تختار هذا العطر؟',
      title_en: '1. Who is this fragrance for?',
      desc_ar: 'حدد الفئة عشان نرشحلك الأنسب',
      desc_en: 'Select the category for the best match',
      key: 'category',
      options: [
        { val: 'men', icon: '👔', t_ar: 'عطر رجالي', t_en: 'For Men', s_ar: 'نفحات رجالية أنيقة وقوية', s_en: 'Bold & elegant masculine notes' },
        { val: 'women', icon: '👗', t_ar: 'عطر نسائي', t_en: 'For Women', s_ar: 'أنوثة ناعمة وجاذبية ساحرة', s_en: 'Soft & alluring feminine aura' },
        { val: 'unisex', icon: '✨', t_ar: 'للجنسين (Unisex)', t_en: 'Unisex Fragrance', s_ar: 'توازن فاخر يناسب كل الأذواق', s_en: 'Balanced luxury for everyone' },
        { val: 'gift', icon: '🎁', t_ar: 'هدية لشخص مميز', t_en: 'A Luxury Gift', s_ar: 'عطر يترك ذكرى لا تُنسى', s_en: 'A memorable fragrance gift' }
      ]
    },
    {
      title_ar: '٢. إيه الطابع العطري اللي بتحبه؟',
      title_en: '2. What scent family do you love?',
      desc_ar: 'اختار الإحساس الأقرب لروحك',
      desc_en: 'Pick the mood that resonates with you',
      key: 'mood',
      options: [
        { val: 'sweet', icon: '🍦', t_ar: 'حلو ودافي (فانيليا وكراميل)', t_en: 'Sweet & Gourmand', s_ar: 'فانيليا، توفي، تونكا، شوكولاتة', s_en: 'Vanilla, toffee, tonka, chocolate' },
        { val: 'woody', icon: '🪵', t_ar: 'خشبي وعنبري (فخم)', t_en: 'Woody & Amber', s_ar: 'عود، صندل، باتشولي، عنبر', s_en: 'Oud, sandalwood, patchouli, amber' },
        { val: 'fresh', icon: '🍋', t_ar: 'منعش وحمضي (سبور)', t_en: 'Fresh & Citrus', s_ar: 'برغموت، ليمون، نعناع، شاي أخضر', s_en: 'Bergamot, lemon, mint, green tea' },
        { val: 'spicy', icon: '🌙', t_ar: 'شرقي وتوابل (غامض)', t_en: 'Spicy & Oriental', s_ar: 'زعفران، قرفة، بخور، مسك', s_en: 'Saffron, cinnamon, incense, musk' },
        { val: 'floral', icon: '🌹', t_ar: 'وردي وزهري (رومانسي)', t_en: 'Floral & Rose', s_ar: 'ورد، ياسمين، زنبق، نيرولي', s_en: 'Rose, jasmine, lily, neroli' },
        { val: 'musky', icon: '🤍', t_ar: 'مسكي ونظيف (ناعم)', t_en: 'Musky & Clean', s_ar: 'مسك أبيض، بودرة، كشمير', s_en: 'White musk, powder, cashmere' }
      ]
    },
    {
      title_ar: '٣. إيه المناسبة اللي هتستخدمه فيها؟',
      title_en: '3. When will you wear it most?',
      desc_ar: 'ده بيأثر على الثبات والفوحان المثالي',
      desc_en: 'This affects ideal longevity & projection',
      key: 'occasion',
      options: [
        { val: 'daily', icon: '💼', t_ar: 'يومي (شغل / جامعة / خروج خفيف)', t_en: 'Daily & Casual', s_ar: 'فوحان هادي ومريح طول اليوم', s_en: 'Subtle projection & all-day comfort' },
        { val: 'evening', icon: '🕯️', t_ar: 'سهرات ومناسبات خاصة', t_en: 'Evenings & Events', s_ar: 'حضور طاغي وثبات خيالي', s_en: 'Heavy sillage & captivating presence' },
        { val: 'winter', icon: '🍂', t_ar: 'شتا وأجواء باردة', t_en: 'Fall & Winter', s_ar: 'دفء مغناطيسي يلفك بنعومة', s_en: 'Deep enveloping warmth' },
        { val: 'summer', icon: '☀️', t_ar: 'صيف وأجواء حارة', t_en: 'Summer & Heat', s_ar: 'انتعاش وخفة تقاوم الحرارة', s_en: 'Fresh lightness that beats the heat' },
        { val: 'signature', icon: '🔄', t_ar: 'عطر توقيع لكل الأوقات', t_en: 'Signature for All Times', s_ar: 'عطرك اللي الكل بيتذكرك بيه', s_en: 'Your trademark everywhere you go' }
      ]
    },
    {
      title_ar: '٤. بتحب الفوحان يبقى إزاي؟',
      title_en: '4. How strong should the sillage be?',
      desc_ar: 'قوة انتشار العطر حواليك',
      desc_en: 'How far should your scent project?',
      key: 'intensity',
      options: [
        { val: 'intimate', icon: '🤫', t_ar: 'قريب وهادي (Skin Scent)', t_en: 'Intimate & Close', s_ar: 'بيحسه اللي جنبك بس', s_en: 'Only those very close notice it' },
        { val: 'moderate', icon: '🌊', t_ar: 'متوسط ومتوازن', t_en: 'Moderate & Balanced', s_ar: 'فوحان محترم مش مبالغ فيه', s_en: 'Pleasant projection without overwhelming' },
        { val: 'strong', icon: '💥', t_ar: 'قوي ووحش (Beast Mode)', t_en: 'Strong & Powerful', s_ar: 'الكل هيحس بيك أول ما تدخل', s_en: 'Everyone notices when you enter' }
      ]
    },
    {
      title_ar: '٥. إيه الموسم اللي بتحب تلبسه فيه أكتر؟',
      title_en: '5. Your favorite wearing season?',
      desc_ar: 'عشان نختار التركيبة المناسبة للجو',
      desc_en: 'So we pick the right composition for the weather',
      key: 'season',
      options: [
        { val: 'summer', icon: '☀️', t_ar: 'الصيف (انتعاش وخفة)', t_en: 'Summer (Fresh & Light)', s_ar: 'تركيبات خفيفة تقاوم الحر', s_en: 'Light compositions that beat the heat' },
        { val: 'winter', icon: '❄️', t_ar: 'الشتا (دفء وثبات)', t_en: 'Winter (Warm & Lasting)', s_ar: 'تركيبات دافية بتثبت أكتر في البرد', s_en: 'Warm compositions that last longer in cold' },
        { val: 'spring', icon: '🌸', t_ar: 'الربيع والخريف (معتدل)', t_en: 'Spring & Fall (Moderate)', s_ar: 'تركيبات متوازنة لأجواء لطيفة', s_en: 'Balanced compositions for mild weather' },
        { val: 'all', icon: '🌍', t_ar: 'كل المواسم (All Season)', t_en: 'All Seasons', s_ar: 'عطر يمشي معاك في أي وقت', s_en: 'A fragrance for any time of year' }
      ]
    }
  ];

  // ── Intelligent Scoring Engine ──
  function computeQuizScore(product, answers) {
    const d = unpackProduct(product);
    let score = 0;
    let maxPossible = 0;
    const allText = `${product.category || ''} ${product.name || ''} ${product.latin || ''} ${d.notes || ''} ${d.top_notes || ''} ${d.middle_notes || ''} ${d.base_notes || ''} ${d.accords || ''} ${d.main_accord || ''} ${d.seasons || ''} ${d.inspired_by || ''}`.toLowerCase();

    // ── 1. Category Match (Weight: 15) ──
    maxPossible += 15;
    if (answers.category && answers.category !== 'gift') {
      if (product.category === answers.category) score += 15;
      else if (product.category === 'unisex') score += 10;
    } else if (answers.category === 'gift') {
      score += 12; // Gifts match all, slight penalty
    }

    // ── 2. Mood / Scent Family Match (Weight: 30) ──
    maxPossible += 30;
    if (answers.mood && MOOD_KEYWORDS[answers.mood]) {
      const moodData = MOOD_KEYWORDS[answers.mood];
      let moodScore = 0;

      // Check accords
      const accordsLower = (d.accords || '').toLowerCase() + ' ' + (d.main_accord || '').toLowerCase();
      moodData.accords.forEach(keyword => {
        if (accordsLower.includes(keyword)) moodScore += 4;
      });

      // Check notes (top, middle, base)
      moodData.notes.forEach(keyword => {
        if (allText.includes(keyword)) moodScore += 2;
      });

      // Check main_accord direct match
      if (d.main_accord && moodData.accords.some(a => d.main_accord.toLowerCase().includes(a))) {
        moodScore += 6;
      }

      score += Math.min(30, moodScore);
    }

    // ── 3. Occasion Match (Weight: 20) ──
    maxPossible += 20;
    if (answers.occasion && OCCASION_PROFILE[answers.occasion]) {
      const occ = OCCASION_PROFILE[answers.occasion];
      let occScore = 0;

      // Sillage match
      const sillage = d.sillage || 3;
      if (occ.sillageMin && sillage >= occ.sillageMin) occScore += 5;
      else if (occ.sillageMax && sillage <= occ.sillageMax) occScore += 5;
      else if (!occ.sillageMin && !occ.sillageMax) occScore += 3;

      // Longevity match
      const longevity = d.longevity || 3;
      if (occ.longevityMin && longevity >= occ.longevityMin) occScore += 5;
      if (occ.longevityMax && longevity <= occ.longevityMax) occScore += 3;
      else if (!occ.longevityMax) occScore += 2;

      // Mood synergy with occasion
      if (answers.mood && occ.moodBoost.includes(answers.mood)) occScore += 5;

      // Season synergy with occasion
      const prodSeasons = (d.seasons || '').toLowerCase();
      if (occ.seasonBoost.some(s => prodSeasons.includes(s) || s === 'all')) occScore += 5;

      score += Math.min(20, occScore);
    }

    // ── 4. Intensity / Sillage Preference (Weight: 15) ──
    maxPossible += 15;
    if (answers.intensity) {
      const sillage = d.sillage || 3;
      if (answers.intensity === 'intimate' && sillage <= 2) score += 15;
      else if (answers.intensity === 'intimate' && sillage === 3) score += 8;
      else if (answers.intensity === 'moderate' && sillage >= 2 && sillage <= 4) score += 15;
      else if (answers.intensity === 'moderate' && (sillage === 1 || sillage === 5)) score += 6;
      else if (answers.intensity === 'strong' && sillage >= 4) score += 15;
      else if (answers.intensity === 'strong' && sillage === 3) score += 8;
      else score += 3;
    }

    // ── 5. Season Match (Weight: 15) ──
    maxPossible += 15;
    if (answers.season) {
      const prodSeasons = (d.seasons || '').toLowerCase();
      if (answers.season === 'all') {
        if (prodSeasons.includes('all') || prodSeasons.includes('كل')) score += 15;
        else score += 8;
      } else {
        const seasonMap = { summer: ['summer','صيف','spring'], winter: ['winter','شتاء','شتا','fall','خريف'], spring: ['spring','ربيع','fall','خريف','all'] };
        const keywords = seasonMap[answers.season] || [answers.season];
        if (keywords.some(k => prodSeasons.includes(k))) score += 15;
        else if (prodSeasons.includes('all') || prodSeasons.includes('كل')) score += 10;
        else score += 2;
      }
    }

    // ── 6. Bonus: Featured / Best Seller (Weight: 5) ──
    maxPossible += 5;
    if (product.is_featured) score += 3;
    if (product.is_best_seller) score += 2;

    // Calculate real match percentage
    const matchPercent = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 50;
    return { score, maxPossible, matchPercent: Math.max(15, Math.min(99, matchPercent)) };
  }

  function openScentQuiz() {
    quizStep = 0;
    quizAnswers = { category: '', mood: '', occasion: '', intensity: '', season: '' };
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
      const totalSteps = quizQuestions.length;
      const dotsHtml = quizQuestions.map((_, i) => `<span class="quiz-dot ${i <= quizStep ? 'active' : ''}"></span>`).join('');
      const progressPct = Math.round(((quizStep + 1) / totalSteps) * 100);

      quizContainer.innerHTML = `
        <div class="quiz-header">
          <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progressPct}%"></div></div>
          <div class="quiz-step-info">${isAr ? `سؤال ${arabicDigits(quizStep + 1)} من ${arabicDigits(totalSteps)}` : `Question ${quizStep + 1} of ${totalSteps}`}</div>
          <div class="quiz-step-dots">${dotsHtml}</div>
          <h3 class="quiz-question-title">${isAr ? q.title_ar : q.title_en}</h3>
          <p class="quiz-question-desc">${isAr ? q.desc_ar : q.desc_en}</p>
        </div>
        <div class="quiz-options-grid${q.options.length > 4 ? ' quiz-grid-compact' : ''}">
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
        ${quizStep > 0 ? `<button type="button" class="btn-quiz-back" id="quizBackBtn">${isAr ? '← رجوع' : '← Back'}</button>` : ''}
      `;
    } else {
      // ── Intelligent Results Engine ──
      const available = products.filter(p =>
        p.name !== '__system_announcements__' &&
        p.name !== '__system_brands__' &&
        p.name !== '__system_orders_meta__' &&
        p.in_stock !== false
      );

      // Score every product
      const scored = available.map(p => ({ product: p, ...computeQuizScore(p, quizAnswers) }));
      scored.sort((a, b) => b.score - a.score || b.matchPercent - a.matchPercent);

      // Get top 3 unique results
      const topResults = scored.slice(0, 3);

      if (!topResults.length) {
        quizContainer.innerHTML = `<div class="quiz-result-card"><p>${isAr ? 'لم نجد عطور مطابقة. جرب إعادة الاستشارة.' : 'No matching fragrances found. Try retaking the quiz.'}</p><button type="button" class="btn-quiz-retry" id="quizRetryBtn"><span>${isAr ? 'إعادة الاستشارة ↺' : 'Retake Quiz ↺'}</span></button></div>`;
        return;
      }

      // Build results HTML
      const resultsHtml = topResults.map((item, rank) => {
        const p = item.product;
        const d = unpackProduct(p);
        const localized = window.PerfumeI18n ? window.PerfumeI18n.getLocalizedProduct(p, currentLang) : null;
        const prodName = localized ? localized.name : (isAr ? p.name : (p.latin || p.name));
        const pricing = computeProductPrice(p);
        const matchPct = item.matchPercent;

        // Build reasons
        const reasons = [];
        if (quizAnswers.mood) {
          const moodLabels = { sweet: isAr ? 'حلو ودافي' : 'Sweet', woody: isAr ? 'خشبي' : 'Woody', fresh: isAr ? 'منعش' : 'Fresh', spicy: isAr ? 'شرقي' : 'Oriental', floral: isAr ? 'زهري' : 'Floral', musky: isAr ? 'مسكي' : 'Musky' };
          if (moodLabels[quizAnswers.mood]) reasons.push(moodLabels[quizAnswers.mood]);
        }
        if (d.main_accord) reasons.push(d.main_accord);
        if (d.longevity >= 4) reasons.push(isAr ? 'ثبات عالي' : 'Long lasting');
        if (d.sillage >= 4) reasons.push(isAr ? 'فوحان قوي' : 'Strong sillage');

        const rankBadge = rank === 0 ? (isAr ? '🥇 الأفضل لك' : '🥇 Best Match') : rank === 1 ? (isAr ? '🥈 بديل ممتاز' : '🥈 Great Alternative') : (isAr ? '🥉 اختيار رائع' : '🥉 Excellent Choice');

        return `
          <div class="quiz-result-item${rank === 0 ? ' quiz-result-hero' : ''}">
            <div class="quiz-result-rank-badge">${rankBadge}</div>
            <div class="quiz-result-match-ring">
              <svg viewBox="0 0 36 36" class="quiz-match-svg">
                <path class="quiz-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="quiz-ring-fill" stroke-dasharray="${matchPct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span class="quiz-match-num">${matchPct}%</span>
            </div>
            <div class="quiz-result-body">
              ${p.image_url ? `<a href="product.html?id=${encodeURIComponent(p.id)}" class="quiz-result-img-wrap"><img src="${p.image_url}" alt="${escapeHtml(prodName)}" class="quiz-result-bottle"></a>` : ''}
              <h4 class="quiz-result-name"><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(prodName)}</a></h4>
              ${d.inspired_by ? `<span class="quiz-result-inspired">✦ ${isAr ? 'مستوحى من' : 'Inspired by'}: ${escapeHtml(d.inspired_by)}</span>` : ''}
              ${reasons.length ? `<div class="quiz-result-reasons">${reasons.slice(0, 3).map(r => `<span class="quiz-reason-chip">${escapeHtml(r)}</span>`).join('')}</div>` : ''}
              <div class="quiz-result-price">
                <span class="quiz-price-current">${money(pricing.price)}</span>
                ${pricing.hasDiscount ? `<del class="quiz-price-orig">${money(pricing.originalPrice)}</del><span class="quiz-price-save">${escapeHtml(pricing.discountBadge)}</span>` : ''}
              </div>
            </div>
            <div class="quiz-result-cta">
              <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn-quiz-explore">${isAr ? 'استكشف العطر' : 'Explore'} ✦</a>
              <button type="button" class="btn-quiz-add" data-add="${p.id}">＋ ${isAr ? 'أضف للسلة' : 'Add to Bag'}</button>
            </div>
          </div>
        `;
      }).join('');

      quizContainer.innerHTML = `
        <div class="quiz-results-wrap">
          <div class="quiz-results-header">
            <h3 class="quiz-results-title">${isAr ? '✨ ترشيحات رُوح الذكية' : '✨ Smart Rou7 Recommendations'}</h3>
            <p class="quiz-results-subtitle">${isAr ? 'بناءً على إجاباتك، اخترنالك أفضل ٣ عطور مطابقة لذوقك وشخصيتك' : 'Based on your answers, here are the top 3 fragrances matched to your taste'}</p>
          </div>
          <div class="quiz-results-list">
            ${resultsHtml}
          </div>
          <div class="quiz-results-footer">
            <button type="button" class="btn-quiz-retry" id="quizRetryBtn">
              <span>${isAr ? '↺ إعادة الاستشارة' : '↺ Retake Quiz'}</span>
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
      // Animate selection
      optBtn.classList.add('quiz-opt-selected');
      setTimeout(() => { quizStep++; renderQuizStep(); }, 250);
      return;
    }
    const backBtn = e.target.closest('#quizBackBtn');
    if (backBtn) {
      if (quizStep > 0) { quizStep--; renderQuizStep(); }
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

  $('#cartItems')?.addEventListener('click', event => {
    const idxBtn = event.target.closest('[data-cart-idx]');
    const rmIdxBtn = event.target.closest('[data-cart-rm]');
    const qty = event.target.closest('[data-qty]');
    const remove = event.target.closest('[data-remove]');

    if (idxBtn) {
      const idx = parseInt(idxBtn.dataset.cartIdx);
      const step = Number(idxBtn.dataset.step);
      const row = cart[idx];
      if (!row) return;
      if (step > 0) {
        const prod = products.find(p => String(p.id) === String(row.id));
        if (prod) {
          const d = unpackProduct(prod);
          if (d.stock_quantity !== '' && d.stock_quantity !== undefined && d.stock_quantity !== null) {
            const maxStock = parseInt(d.stock_quantity) || 0;
            if (row.qty + step > maxStock) {
              showToast(currentLang === 'ar' ? `عفواً، أقصى كمية متاحة في المخزون هي ${formatDigits(maxStock)} قطعة` : `Sorry, only ${maxStock} items available in stock`);
              return;
            }
          }
        }
      }
      row.qty += step;
      if (row.qty <= 0) cart.splice(idx, 1);
      updateCart();
      return;
    }

    if (rmIdxBtn) {
      const idx = parseInt(rmIdxBtn.dataset.cartRm);
      if (!isNaN(idx) && cart[idx]) {
        cart.splice(idx, 1);
        updateCart();
      }
      return;
    }

    if (qty) {
      const row = cart.find(item => item.id === qty.dataset.qty);
      if (!row) return;
      const step = Number(qty.dataset.step);
      if (step > 0) {
        const prod = products.find(p => String(p.id) === String(row.id));
        if (prod) {
          const d = unpackProduct(prod);
          if (d.stock_quantity !== '' && d.stock_quantity !== undefined && d.stock_quantity !== null) {
            const maxStock = parseInt(d.stock_quantity) || 0;
            if (row.qty + step > maxStock) {
              showToast(currentLang === 'ar' ? `عفواً، أقصى كمية متاحة في المخزون هي ${formatDigits(maxStock)} قطعة` : `Sorry, only ${maxStock} items available in stock`);
              return;
            }
          }
        }
      }
      row.qty += step;
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

  $('#cartToggle')?.addEventListener('click', () => drawer(true));
  $('#cartClose')?.addEventListener('click', () => drawer(false));
  $('#overlay')?.addEventListener('click', () => drawer(false));
  $('#continueShopping')?.addEventListener('click', () => drawer(false));

  themeButton?.addEventListener('click', () => setTheme('light'));
  $('#mobileThemeToggle')?.addEventListener('click', () => {
    setTheme('light');
    $('#mobileMenu')?.classList.remove('open');
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

  $('#menuToggle')?.addEventListener('click', () => $('#mobileMenu')?.classList.toggle('open'));
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

  $('#newsletterForm')?.addEventListener('submit', async event => {
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

  $('#checkoutButton')?.addEventListener('click', () => {
    if (!cart.length) return;
    drawer(false);
    const modal = $('#checkoutModal');
    if (modal) modal.classList.add('open');
    const formView = $('#checkoutFormView');
    if (formView) formView.hidden = false;
    const successView = $('#orderSuccess');
    if (successView) successView.hidden = true;

    // Track checkout visit
    if (window.RoohAnalytics) {
      const cartValue = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      window.RoohAnalytics.trackCheckoutVisit(cartValue, cart.length);
    }
  });

  $('#checkoutClose')?.addEventListener('click', () => $('#checkoutModal')?.classList.remove('open'));
  $('#checkoutModal')?.addEventListener('click', event => {
    if (event.target.id === 'checkoutModal') $('#checkoutModal')?.classList.remove('open');
  });

  $('#checkoutForm')?.addEventListener('submit', async event => {
    event.preventDefault();

    let waWindow = null;
    try { waWindow = window.open('about:blank', '_blank'); } catch (_) {}

    const form    = event.currentTarget;
    const name    = form.name.value.trim();
    const phone   = form.phone.value.trim();
    const address = form.address.value.trim();
    const items   = cart.map(row => {
      if (row.is_custom_box) {
        return {
          id: row.id,
          name: row.name,
          latin: row.latin,
          price: row.customPrice || row.price || 0,
          qty: row.qty,
          is_custom_box: true,
          box_items: row.box_items || [],
          card_message: row.card_message || ''
        };
      }
      const product = products.find(p => p.id === row.id);
      const unitPrice = row.customPrice || product?.price || 0;
      return {
        id: row.id,
        name: product?.name || row.name,
        latin: product?.latin || row.latin,
        price: unitPrice,
        qty: row.qty,
        selectedSize: row.selectedSize || null
      };
    });
    const total   = cart.reduce((sum, row) => sum + (row.customPrice || products.find(p => p.id === row.id)?.price || row.price || 0) * row.qty, 0);

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

    // Deduct stock for ordered items and mark as out-of-stock if depleted
    for (const item of items) {
      const prod = products.find(p => String(p.id) === String(item.id));
      if (!prod) continue;
      const d = unpackProduct(prod);
      if (d.stock_quantity !== '' && d.stock_quantity !== undefined && d.stock_quantity !== null) {
        const currentStock = parseInt(d.stock_quantity) || 0;
        const newStock = Math.max(0, currentStock - (parseInt(item.qty) || 1));
        const newInStock = newStock > 0;

        prod.in_stock = newInStock;
        if (prod.stock_quantity !== undefined) prod.stock_quantity = newStock;

        let meta = {};
        if (prod.notes && typeof prod.notes === 'string' && (prod.notes.trim().startsWith('{') || prod.notes.trim().startsWith('['))) {
          try { meta = JSON.parse(prod.notes); } catch (_) {}
        }
        meta.stock_quantity = newStock;
        prod.notes = JSON.stringify(meta);

        if (!SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
          try {
            await supaFetch('products', {
              method: 'PATCH',
              filters: `&id=eq.${encodeURIComponent(prod.id)}`,
              body: {
                in_stock: newInStock,
                notes: prod.notes
              }
            });
          } catch (stkErr) {
            console.warn('Stock deduction error in Supabase:', stkErr);
          }
        }
      }
    }
    try { localStorage.setItem('rooh-cached-products', JSON.stringify(products)); } catch (_) {}
    renderProducts();

    try { localStorage.setItem('rooh-last-order', JSON.stringify({ id: orderNumber, createdAt: new Date().toISOString(), items, total })); } catch (_) {}

    // Track order placed
    if (window.RoohAnalytics) {
      window.RoohAnalytics.trackOrderPlaced(orderNumber, total, items);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `${I18N[currentLang].checkout_submit} <span class="arrow-icon">←</span>`;

    $('#orderNumber').textContent = orderNumber;
    $('#checkoutFormView').hidden = true;
    $('#orderSuccess').hidden = false;

    // Structured WhatsApp order message
    let waMessage;
    if (currentLang === 'en') {
      const itemsTextEn = items.map(i => {
        if (i.is_custom_box) {
          const boxed = Array.isArray(i.box_items) ? i.box_items.join(', ') : (i.box_items || '');
          const card = i.card_message ? ` [Card: "${i.card_message}"]` : '';
          return `• 🎁 ${i.latin || i.name} (Perfumes: ${boxed})${card} × ${i.qty} — ${money(i.price * i.qty)}`;
        }
        return `• ${i.latin || i.name}${i.selectedSize ? ` (Size: ${i.selectedSize})` : ''} × ${i.qty} — ${money(i.price * i.qty)}`;
      }).join('\n');
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
      const itemsTextAr = items.map(i => {
        if (i.is_custom_box) {
          const boxed = Array.isArray(i.box_items) ? i.box_items.join(' + ') : (i.box_items || '');
          const card = i.card_message ? ` [كارت إهداء: "${i.card_message}"]` : '';
          return `• 🎁 ${i.name} (العطور: ${boxed})${card} × ${i.qty} — ${money(i.price * i.qty)}`;
        }
        return `• ${i.name}${i.selectedSize ? ` (حجم: ${i.selectedSize})` : ''} × ${i.qty} — ${money(i.price * i.qty)}`;
      }).join('\n');
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

  $('#finishOrder')?.addEventListener('click', () => {
    $('#checkoutModal')?.classList.remove('open');
    $('#checkoutForm')?.reset();
    window.scrollTo({top:0, behavior:'smooth'});
  });

  $('#trackingLink')?.addEventListener('click', event => {
    event.preventDefault();
    $('#trackingModal')?.classList.add('open');
    const tr = $('#trackingResult');
    if (tr) tr.textContent = '';
  });
  $('#trackingClose')?.addEventListener('click', () => $('#trackingModal')?.classList.remove('open'));
  $('#trackingModal')?.addEventListener('click', event => {
    if (event.target.id === 'trackingModal') $('#trackingModal')?.classList.remove('open');
  });

  $('#trackingForm')?.addEventListener('submit', async event => {
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

  // ── Robust Loader Dismissal & Keyboard Controls ─────────────────────────
  function dismissLoader() {
    const ldr = document.getElementById('loader') || $('#loader');
    if (ldr && !ldr.classList.contains('done')) {
      ldr.classList.add('done');
      // Ensure it's fully removed from layout after transition
      setTimeout(() => { if (ldr) ldr.style.display = 'none'; }, 700);
    }
  }
  // Fire immediately if DOM already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    dismissLoader();
  } else {
    document.addEventListener('DOMContentLoaded', dismissLoader);
  }
  window.addEventListener('load', dismissLoader);
  setTimeout(dismissLoader, 350); // Fast failsafe
  setTimeout(dismissLoader, 1200); // Ultimate failsafe — never get stuck

  // ── Header Line-Art Cinema (Person -> Spray -> Logo Rewrite) ────────────
  function initHeaderBrandCinema() {
    const stage = document.getElementById('brandHeaderStage');
    if (!stage) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let endTimer = null;
    const play = () => {
      clearTimeout(endTimer);
      stage.classList.remove('is-playing');
      void stage.offsetWidth; // restart CSS keyframe timeline cleanly
      stage.classList.add('is-playing');
      endTimer = setTimeout(() => {
        stage.classList.remove('is-playing');
      }, 4600);
    };

    // Auto-play once right after the page loader settles
    setTimeout(play, 450);

    // Allow replaying anytime when the user clicks the logo
    stage.addEventListener('click', () => {
      play();
    });
  }
  initHeaderBrandCinema();

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      drawer(false);
      $('#checkoutModal')?.classList.remove('open');
      $('#trackingModal')?.classList.remove('open');
      $('#mobileMenu')?.classList.remove('open');
      $('#searchBar')?.classList.remove('open');
      $('#giftBoxBuilderModal')?.classList.remove('open');
      if (typeof closeProductDetailModal === 'function') closeProductDetailModal();
      if (typeof closeScentQuiz === 'function') closeScentQuiz();
    }
  });
})();
