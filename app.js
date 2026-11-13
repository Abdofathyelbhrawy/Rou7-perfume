(() => {
  // ── WhatsApp & Supabase config ───────────────────────────────────────────
  // رقم واتساب رُوح المستخرج من الرابط الرسمي: 01000603308
  const WHATSAPP_PHONE    = '201000603308';
  const WHATSAPP_BASE_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
  const SUPABASE_URL      = 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

  async function supaFetch(table, { method = 'GET', filters = '', body = null, select = '*' } = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`;
    const res = await fetch(url, {
      method,
      headers: {
        'apikey':        SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type':  'application/json',
        'Prefer':        (method === 'POST' || method === 'PATCH') ? 'return=representation' : '',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    if (res.status === 204 || method === 'DELETE') return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
  // ─────────────────────────────────────────────────────────────────────────

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  // ── Bilingual / i18n Translations ─────────────────────────────────────────
  const I18N = {
    ar: {
      site_title: 'رُوح | ROOH Perfume — عطر يلامس أعماقك',
      site_desc: 'رُوح | ROOH Perfume — اكتشف عطرك، واترك أثراً لا يُنسى.',
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
      hero_title: 'عطرك…<br>حكاية <em>روحك</em>',
      hero_text: 'في كل نفحة حكاية، وفي كل أثر ذكرى. اكتشف عالماً من العطور التي تعبّر عنك وتبقى معك.',
      hero_cta: 'اكتشف مجموعتنا',
      hero_note: 'صُنعت بحب،<br>لتبقى في الذاكرة',
      hero_scroll: 'اكتشف رُوح',
      hero_featured_tag: 'ROOH · عطر مميز',
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
      quote_text: '“بعض الحكايات لا تُروى… <em>بل تُشمّ.</em>”',
      quote_caption: 'رُوح · عطر يلامس أعماقك',
      news_eyebrow: 'رسائل من رُوح',
      news_title: 'خلي لحكايتك <em>امتداد</em>',
      news_text: 'اشترك لتصلك أخبار مجموعاتنا الجديدة ولمسات صغيرة من عالم العطور.',
      news_label: 'بريدك الإلكتروني',
      news_placeholder: 'name@example.com',
      news_disclaimer: 'بالاشتراك، أنت توافق على استقبال رسائل رُوح.',
      footer_tagline: 'عطر يلامس أعماقك.<br>رائحة تُشبهك، وذكرى تبقى.',
      footer_rights: '© ٢٠٢٦ رُوح | ROOH Perfume. جميع الحقوق محفوظة.',
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
      wa_inquiry_msg: 'مرحباً رُوح | ROOH Perfume، أود الاستفسار عن عطوركم 🌸',
      toast_added: 'اتضاف عطرك للسلة ✳',
      toast_newsletter: 'أهلاً بك في حكاية رُوح ✳',
      lang_btn_code: 'EN',
      lang_btn_mobile: 'English',
      lang_switch_title: 'Switch to English',
    },
    en: {
      site_title: 'ROOH Perfume — A Scent Touching Your Depths',
      site_desc: 'ROOH Perfume — Discover your fragrance, leave an unforgettable trace.',
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
      hero_title: 'Your Scent…<br>The Essence of <em>Your Soul</em>',
      hero_text: 'In every note a story, in every trace a memory. Discover a world of fragrances that express who you are and linger with you.',
      hero_cta: 'Explore Collection',
      hero_note: 'Crafted with love,<br>made to be remembered',
      hero_scroll: 'Discover ROOH',
      hero_featured_tag: 'ROOH · FEATURED',
      val_1: 'Long-lasting rich formulas',
      val_2: 'Carefully selected essences',
      val_3: 'Crafted with love in Egypt',
      val_4: 'A gift that speaks of you',
      coll_eyebrow: 'Discover Your Scent',
      coll_title: 'ROOH <em>Curations</em>',
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
      story_signature: 'With all love, <span>ROOH Team</span>',
      story_link: 'Discover ROOH Philosophy',
      quote_text: '“Some stories aren\'t told… <em>they are smelled.</em>”',
      quote_caption: 'ROOH · A Scent Touching Your Depths',
      news_eyebrow: 'Letters from ROOH',
      news_title: 'Let your story <em>unfold</em>',
      news_text: 'Subscribe to receive our latest collections and subtle touches from the world of fragrance.',
      news_label: 'Your Email Address',
      news_placeholder: 'name@example.com',
      news_disclaimer: 'By subscribing, you agree to receive letters from ROOH.',
      footer_tagline: 'A scent that touches your depths.<br>A fragrance like you, a memory that lasts.',
      footer_rights: '© 2026 ROOH Perfume. All rights reserved.',
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
      success_title: 'Thank you for choosing <em>ROOH</em>',
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
      wa_inquiry_msg: 'Hello ROOH Perfume, I would like to inquire about your fragrances 🌸',
      toast_added: 'Added to your shopping bag ✳',
      toast_newsletter: 'Welcome to the story of ROOH ✳',
      lang_btn_code: 'عربي',
      lang_btn_mobile: 'العربية',
      lang_switch_title: 'التبديل إلى اللغة العربية',
    }
  };

  let currentLang = 'ar';
  try { currentLang = localStorage.getItem('rooh-lang') || 'ar'; } catch (_) {}

  let products = [];
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
      if (t[key]) el.textContent = t[key];
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
    updateCart();
  }

  function readPromo() {
    try { return { ...defaultPromo, ...JSON.parse(localStorage.getItem(PROMO_KEY) || '{}') }; }
    catch (_) { return defaultPromo; }
  }

  let promoTimer;
  function renderPromo() {
    clearTimeout(promoTimer);
    const promo = readPromo();
    const banner = $('#promoBanner');
    const now = Date.now();
    const startsAt = promo.startsAt ? new Date(promo.startsAt).getTime() : -Infinity;
    const endsAt = promo.endsAt ? new Date(promo.endsAt).getTime() : Infinity;
    const hasValidSchedule = startsAt < endsAt;
    const visible = Boolean(promo.active && promo.title && hasValidSchedule && now >= startsAt && now < endsAt);
    banner.hidden = !visible;
    if (visible) {
      $('#promoTitle').textContent = promo.title;
      $('#promoDetails').textContent = promo.details || '';
      $('#promoDetails').hidden = !promo.details;
    }
    const nextChange = now < startsAt ? startsAt : endsAt;
    if (promo.active && hasValidSchedule && Number.isFinite(nextChange) && nextChange > now) {
      promoTimer = setTimeout(renderPromo, Math.min(nextChange - now + 50, 2147483647));
    }
  }

  function renderHeroProduct() {
    const featured = products.find(product => product.is_featured) || products[0];
    const hero = $('#heroProduct');
    const t = I18N[currentLang];
    if (!featured) {
      hero.innerHTML = `<div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><div class="hero-product-empty"><span>✳</span><p>${currentLang === 'ar' ? 'المنتج المميز سيظهر هنا' : 'Featured fragrance will appear here'}</p></div>`;
      return;
    }
    const nameToDisplay = currentLang === 'en' ? (featured.latin || featured.name) : (featured.name || featured.latin);
    const safeName = escapeHtml(nameToDisplay || 'ROOH');
    const safeImage = escapeHtml(featured.image_url || '');
    const safeNotes = escapeHtml(featured.notes || '');
    hero.innerHTML = `<div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><span class="hero-spark spark-one">✳</span><span class="hero-spark spark-two">✦</span>${safeImage ? `<img class="hero-featured-image" src="${safeImage}" alt="${safeName}" fetchpriority="high">` : '<div class="hero-product-empty"><span>✳</span></div>'}<div class="hero-product-caption"><span>${t.hero_featured_tag}</span><h2>${safeName}</h2>${safeNotes ? `<p>${safeNotes}</p>` : ''}</div>`;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  renderPromo();
  window.addEventListener('storage', event => {
    if (event.key === PROMO_KEY) renderPromo();
  });

  function renderProducts() {
    const t = I18N[currentLang];
    const visible = products.filter(product => (activeFilter === 'all' || product.category === activeFilter) && (!query || `${product.name} ${product.latin} ${product.notes}`.toLowerCase().includes(query.toLowerCase())));

    $('#productGrid').innerHTML = products.length
      ? visible.map(product => {
          const prodName = currentLang === 'en' ? (product.latin || product.name) : product.name;
          const prodSub  = currentLang === 'en' ? (product.latin ? product.name : '') : (product.latin || '');
          return `<article class="product-card">
            <div class="product-image">
              ${product.image_url ? `<img src="${product.image_url}" alt="${escapeHtml(prodName)}" loading="lazy">` : ''}
              ${product.tag ? `<span class="product-tag">${escapeHtml(product.tag)}</span>` : ''}
              <button class="quick-add" data-add="${product.id}">${t.quick_add} <span>＋</span></button>
            </div>
            <div class="product-info">
              <div class="product-meta">
                <h3>${escapeHtml(prodName)} ${prodSub ? `<small style="font-size:10px;opacity:.7;display:block;">${escapeHtml(prodSub)}</small>` : ''}</h3>
                <span>${money(product.price)}</span>
              </div>
              <p>${escapeHtml(product.notes || '')}</p>
            </div>
          </article>`;
        }).join('') || `<p class="no-results">${t.no_results}</p>`
      : `<div class="catalog-empty"><span>✳</span><h3>${currentLang === 'ar' ? 'قريباً، عطور رُوح هنا' : 'ROOH Fragrances Coming Soon'}</h3></div>`;

    const countText = currentLang === 'ar'
      ? `${arabicDigits(visible.length)} ${visible.length === 1 ? 'عطر' : 'عطور'}`
      : `${visible.length} ${visible.length === 1 ? 'fragrance' : 'fragrances'}`;
    $('#resultCount').textContent = countText;
  }

  window.roohStore = {
    setProducts(rows) {
      products = Array.isArray(rows) ? rows : [];
      renderProducts();
      renderHeroProduct();
      updateCart();
    }
  };

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

  // Realtime subscription
  if (window.supabase) {
    try {
      const storeRealtime = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      storeRealtime.channel('store-products-feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          console.log('ROOH: Realtime product change');
          loadProductsFromSupa();
        })
        .subscribe();
    } catch (e) {
      console.warn('Store realtime error:', e);
    }
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
      return `<div class="cart-row">
        <div class="cart-thumb">${product.image_url ? `<img src="${product.image_url}" alt="" loading="lazy">` : ''}</div>
        <div>
          <h3>${escapeHtml(prodName)}</h3>
          <p>${money(product.price)}</p>
          <div class="qty">
            <button data-qty="${product.id}" data-step="-1" aria-label="تقليل">−</button>
            <span>${formatDigits(row.qty)}</span>
            <button data-qty="${product.id}" data-step="1" aria-label="زيادة">＋</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${product.id}" aria-label="حذف ${escapeHtml(prodName)}">×</button>
      </div>`;
    }).join('');

    const total = cart.reduce((sum, row) => sum + (products.find(p => p.id === row.id)?.price || 0) * row.qty, 0);
    $('#cartTotal').textContent = money(total);
    $('#checkoutTotal').textContent = money(total);
    saveCart();
  }

  function addToCart(id) {
    const row = cart.find(item => item.id === id);
    if (row) row.qty++; else cart.push({id, qty:1});
    updateCart();
    showToast(I18N[currentLang].toast_added);
  }

  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderProducts();
  }));

  $('#productGrid').addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (button) addToCart(button.dataset.add);
  });

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

  $('#searchToggle').addEventListener('click', () => {
    $('#searchBar').classList.add('open');
    $('#searchInput').focus();
  });
  $('#searchClose').addEventListener('click', () => {
    $('#searchBar').classList.remove('open');
    $('#searchInput').value = '';
    query = '';
    renderProducts();
  });
  $('#searchInput').addEventListener('input', event => {
    query = event.target.value.trim();
    activeFilter = 'all';
    $$('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
    renderProducts();
    document.querySelector('#collection').scrollIntoView({behavior:'smooth', block:'start'});
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
      return { id: row.id, name: product?.name, latin: product?.latin, price: product?.price, qty: row.qty };
    });
    const total   = cart.reduce((sum, row) => sum + (products.find(p => p.id === row.id)?.price || 0) * row.qty, 0);

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
`✨ *New Order from ROOH Perfume* ✨
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
`✨ *طلب جديد من متجر رُوح | ROOH Perfume* ✨
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
            pending:   currentLang === 'ar' ? 'قيد المراجعة — فريق رُوح هيتواصل معاك قريباً' : 'Under Review — ROOH team will contact you shortly',
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
        : `Your order ${lastOrder.id} is received, and the ROOH team will reach out soon.`;
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
