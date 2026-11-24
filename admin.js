(() => {
  // ── Traffic Analytics State (must be declared early to avoid TDZ) ──────────────────────────────────────────
  let trafficTimeRange = 'all';

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

  // ── Supabase config ────────────────────────────────
  const SUPABASE_URL  = window.RoohConstants?.SUPABASE_URL || 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON = window.RoohConstants?.SUPABASE_ANON || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

  async function supaFetch(table, { method = 'GET', filters = '', body = null, select = '*' } = {}) {
    return window.RoohUtils?.supaFetch?.(table, { method, filters, body, select }) ?? (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
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
    })();
  }
  // ─────────────────────────────────────────────────────────────────────────

  let theme = 'light';
  function setTheme() {
    theme = 'light';
    document.body.classList.add('light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = window.RoohConstants?.DEFAULTS?.THEME_COLOR_LIGHT || '#f5f0eb';
    $$('.brand-logo').forEach(image => {
      image.src = window.RoohConstants?.DEFAULTS?.BRAND_LOGO_LIGHT || 'assets/branding/1.svg';
    });
    try { localStorage.setItem(window.RoohConstants?.STORAGE_KEYS?.THEME || 'rooh-theme', 'light'); } catch (_) {}
  }
  setTheme();

  // ── Language & State Setup ────────────────────────────────────────────────
  let adminLang = 'ar';
  try { adminLang = localStorage.getItem(window.RoohConstants?.STORAGE_KEYS?.LANG || 'rooh-lang') || 'ar'; } catch (_) {}

  const arabicNum = n => adminLang === 'ar' ? String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const money = value => {
    const n = Number(value || 0);
    return adminLang === 'ar' ? `${n.toLocaleString('ar-EG')} ج.م` : `${n.toLocaleString('en-US')} EGP`;
  };

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

  const DEFAULT_ORDERS = [
    {
      id: '3886968f-57db-48a5-8cc8-cc5b871a2b06',
      order_number: 'RO-SB5Y68',
      customer_name: 'عبدالرحمن فتحي عواد البحراوي',
      phone: '01025272333',
      address: 'الجعفريه',
      items: [{ id: 'c34eb21c-4eeb-434e-b3e7-5383fa774137', name: 'ابراق', qty: 1, price: 1500 }],
      total: 1500.0,
      status: 'pending',
      created_at: '2026-11-14T18:35:33.583427+00:00'
    },
    {
      id: 'b2a9d1c4-3ff3-47ca-b4b9-9a3acab995ac',
      order_number: 'RO-C98Q5K',
      customer_name: 'عبدالرحمن',
      phone: '01025272333',
      address: 'الجعفريه',
      items: [{ id: 'c34eb21c-4eeb-434e-b3e7-5383fa774137', name: 'ابراق', qty: 1, price: 1500 }],
      total: 1500.0,
      status: 'pending',
      created_at: '2026-11-13T17:56:25.067562+00:00'
    },
    {
      id: 'e313e9af-7997-4471-9128-ef16dc5c6038',
      order_number: 'RO-R4UQW2',
      customer_name: 'عبدالرحمن',
      phone: '01025272333',
      address: 'الجعفريه',
      items: [{ id: 'c34eb21c-4eeb-434e-b3e7-5383fa774137', name: 'ابراق', qty: 1, price: 1500 }],
      total: 1500.0,
      status: 'pending',
      created_at: '2026-11-13T17:51:45.633324+00:00'
    }
  ];

  let currentProducts = [];
  try {
    const cachedP = localStorage.getItem('rooh-cached-products');
    if (cachedP) {
      const parsed = JSON.parse(cachedP);
      if (Array.isArray(parsed) && parsed.length) currentProducts = parsed;
    }
  } catch (_) {}
  if (!currentProducts.length) {
    currentProducts = [...DEFAULT_PRODUCTS];
  }

  let currentOrders = [];
  let deletedOrderIds = new Set();
  let orderStatusMap = {};
  let salesTimeRange = 'all';

  try {
    const savedDel = JSON.parse(localStorage.getItem('rooh-deleted-orders') || '[]');
    if (Array.isArray(savedDel)) deletedOrderIds = new Set(savedDel.map(String));
    const savedStatuses = JSON.parse(localStorage.getItem('rooh-order-statuses') || '{}');
    if (savedStatuses && typeof savedStatuses === 'object') orderStatusMap = savedStatuses;

    const cachedO = localStorage.getItem('rooh-cached-orders');
    if (cachedO) {
      const parsed = JSON.parse(cachedO);
      if (Array.isArray(parsed) && parsed.length) {
        currentOrders = parsed
          .filter(o => !deletedOrderIds.has(String(o.id)))
          .map(o => {
            if (orderStatusMap[o.id]) o.status = orderStatusMap[o.id];
            return o;
          });
      }
    }
  } catch (_) {}
  if (!currentOrders.length) {
    currentOrders = DEFAULT_ORDERS.filter(o => !deletedOrderIds.has(String(o.id)));
  }

  // ── Brands Registry Setup ────────────────────────────────────────────────
  const DEFAULT_BRANDS = [
    {
      id: 'ibraq',
      name_ar: 'إبراق',
      name_en: 'Ibraq',
      logo_url: 'assets/branding/2.svg',
      description: 'دار عطور فاخرة تمزج بين الأصالة الشرقية والحداثة.'
    },
    {
      id: 'rooh',
      name_ar: 'رُوح',
      name_en: 'Rou7 Perfume',
      logo_url: 'assets/branding/2.svg',
      description: 'العلامة الرسمية لمتجر رُوح - عطر يلامس أعماقك.'
    },
    {
      id: 'matiere-premiere',
      name_ar: 'ماتيير بريمير',
      name_en: 'Matière Première',
      logo_url: '',
      description: 'دار العطور الفرنسية الفاخرة المعتمدة على المكونات الطبيعية النقية.'
    }
  ];

  let currentBrands = [];
  try {
    const cachedB = localStorage.getItem('rooh-cached-brands');
    if (cachedB) {
      const parsed = JSON.parse(cachedB);
      if (Array.isArray(parsed) && parsed.length) currentBrands = parsed;
    }
  } catch (_) {}
  if (!currentBrands.length) {
    currentBrands = [...DEFAULT_BRANDS];
  }

  let isHeroQuickActive = false;
  let inventoryFilter = 'all';
  let inventorySearch = '';
  let selectedInvProductIds = new Set();

  const campaignKey = 'rooh-campaign-settings';
  const defaultCampaign = {
    top_bar: 'شحن لجميع المحافظات · دفع عند الاستلام · ضمان الثبات والفوحان',
    top_bar_active: true,
    promo_title: 'شحن مجاني للطلبات فوق ١٥٠٠ جنيه',
    promo_details: '',
    promo_starts_at: '',
    promo_ends_at: '',
    promo_active: true,
    spotlight_perfume_id: '',
    spotlight_badge: '✨ عطر اليوم المميز',
    spotlight_price: '',
    spotlight_title: '',
    spotlight_desc: '',
    spotlight_active: true,
    storewide_discount_active: false,
    storewide_discount_percent: '',
    storewide_discount_scope: 'only_no_custom',
    storewide_discount_badge: ''
  };

  function readCampaignLocal() {
    try {
      const stored = localStorage.getItem(campaignKey) || localStorage.getItem('rooh-announcements') || localStorage.getItem('rooh-promo');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultCampaign,
          top_bar: parsed.top_bar !== undefined ? parsed.top_bar : defaultCampaign.top_bar,
          top_bar_active: parsed.top_bar_active !== undefined ? parsed.top_bar_active : true,
          promo_title: parsed.promo_title || parsed.title || defaultCampaign.promo_title,
          promo_details: parsed.promo_details !== undefined ? parsed.promo_details : (parsed.details || ''),
          promo_starts_at: parsed.promo_starts_at || parsed.startsAt || '',
          promo_ends_at: parsed.promo_ends_at || parsed.endsAt || '',
          promo_active: parsed.promo_active !== undefined ? parsed.promo_active : (parsed.active !== false),
          spotlight_perfume_id: parsed.spotlight_perfume_id || '',
          spotlight_badge: parsed.spotlight_badge !== undefined ? parsed.spotlight_badge : defaultCampaign.spotlight_badge,
          spotlight_price: parsed.spotlight_price !== undefined ? parsed.spotlight_price : '',
          spotlight_title: parsed.spotlight_title || '',
          spotlight_desc: parsed.spotlight_desc || '',
          spotlight_active: parsed.spotlight_active !== undefined ? parsed.spotlight_active : true,
          storewide_discount_active: Boolean(parsed.storewide_discount_active),
          storewide_discount_percent: parsed.storewide_discount_percent !== undefined ? parsed.storewide_discount_percent : '',
          storewide_discount_scope: parsed.storewide_discount_scope || 'only_no_custom',
          storewide_discount_badge: parsed.storewide_discount_badge || ''
        };
      }
    } catch (_) {}
    return defaultCampaign;
  }

  function updateAdminDate() {
    const locale = adminLang === 'ar' ? 'ar-EG' : 'en-US';
    $('#adminDate').textContent = new Intl.DateTimeFormat(locale, {day:'numeric',month:'long',year:'numeric'}).format(new Date());
  }

  function setAdminLanguage(lang, persist = true) {
    adminLang = lang === 'en' ? 'en' : 'ar';
    document.documentElement.lang = adminLang;
    document.documentElement.dir  = adminLang === 'ar' ? 'rtl' : 'ltr';

    const langText = $('#adminLangText');
    if (langText) langText.textContent = adminLang === 'ar' ? 'EN' : 'عربي';

    const viewStore = $('#adminViewStore');
    if (viewStore) viewStore.innerHTML = adminLang === 'ar' ? 'عرض المتجر <span>↗</span>' : 'View Store <span>↗</span>';

    const dateLabel = $('#adminDateLabel');
    if (dateLabel) dateLabel.textContent = adminLang === 'ar' ? 'اليوم' : 'Today';

    updateAdminDate();

    if (persist) {
      try { localStorage.setItem('rooh-lang', adminLang); } catch (_) {}
    }

    if (typeof renderProductsTable === 'function' && currentProducts && currentProducts.length) {
      renderProductsTable(currentProducts);
    }
    if (typeof renderOrders === 'function' && currentOrders && currentOrders.length) {
      renderOrders(currentOrders);
    }
    if (typeof renderBrandsTable === 'function') {
      renderBrandsTable();
      populateBrandSelects();
    }
  }

  $('#adminLangToggle')?.addEventListener('click', () => {
    setAdminLanguage(adminLang === 'ar' ? 'en' : 'ar');
  });

  setAdminLanguage(adminLang, false);

  const campaignForm = $('#campaignForm');
  let campaignRaw = {};
  try {
    campaignRaw = JSON.parse(localStorage.getItem(campaignKey) || localStorage.getItem('rooh-announcements') || '{}') || {};
  } catch (_) {}

  const HOME_SECTION_DEFS = [
    {
      id: 'customPerfumeSection',
      icon: '🔍',
      name: 'طلب توفير عطر',
      fields: [
        { key: 'eyebrow', label: 'العنوان الفرعي (Eyebrow)', type: 'text' },
        { key: 'title', label: 'العنوان الرئيسي', type: 'text' },
        { key: 'text', label: 'الوصف', type: 'textarea' },
        { key: 'cta', label: 'نص الزر', type: 'text' }
      ]
    },
    {
      id: 'collection',
      icon: '🛍️',
      name: 'تسوق العطور (المختارات)',
      fields: [
        { key: 'eyebrow', label: 'العنوان الفرعي (Eyebrow)', type: 'text' },
        { key: 'title', label: 'العنوان الرئيسي', type: 'text' }
      ],
      extras: [
        { key: 'show_finder', label: 'إظهار مستشار رُوح الذكي' },
        { key: 'show_mood', label: 'إظهار بوابة اللحظات والمشاعر' }
      ]
    },
    {
      id: 'story',
      icon: '📖',
      name: 'حكايتنا وعطر اليوم',
      note: 'ملاحظة: لو حددت عنوان أو وصف مخصص في قسم "عطر اليوم"، ستكون له الأولوية على نصوص هذا القسم.',
      fields: [
        { key: 'eyebrow', label: 'العنوان الفرعي (Eyebrow)', type: 'text' },
        { key: 'title', label: 'العنوان الرئيسي', type: 'text' },
        { key: 'text', label: 'النص الوصفي', type: 'textarea' }
      ]
    },
    {
      id: 'quoteBand',
      icon: '✳',
      name: 'شريط الاقتباس',
      fields: [
        { key: 'text', label: 'نص الاقتباس', type: 'text' },
        { key: 'caption', label: 'النص التعريفي أسفل الاقتباس', type: 'text' }
      ]
    },
    {
      id: 'newsletterSection',
      icon: '✉️',
      name: 'الاشتراك في الرسائل',
      fields: [
        { key: 'eyebrow', label: 'العنوان الفرعي (Eyebrow)', type: 'text' },
        { key: 'title', label: 'العنوان الرئيسي', type: 'text' },
        { key: 'text', label: 'النص التوضيحي', type: 'textarea' }
      ]
    }
  ];

  function getDefaultHomeLayout() {
    const sections = {};
    HOME_SECTION_DEFS.forEach(def => {
      const sec = { visible: true };
      def.fields.forEach(f => {
        sec[`${f.key}_ar`] = '';
        sec[`${f.key}_en`] = '';
      });
      if (def.extras) {
        def.extras.forEach(ex => { sec[ex.key] = true; });
      }
      sections[def.id] = sec;
    });
    return {
      order: HOME_SECTION_DEFS.map(d => d.id),
      sections
    };
  }

  function normalizeHomeLayout(raw) {
    const def = getDefaultHomeLayout();
    if (!raw || typeof raw !== 'object') return def;

    const knownIds = def.order;
    const rawOrder = Array.isArray(raw.order) ? raw.order : [];
    const order = [];
    rawOrder.forEach(id => {
      if (knownIds.includes(id) && !order.includes(id)) order.push(id);
    });
    knownIds.forEach(id => {
      if (!order.includes(id)) order.push(id);
    });

    const rawSections = (raw.sections && typeof raw.sections === 'object') ? raw.sections : {};
    const sections = {};
    HOME_SECTION_DEFS.forEach(d => {
      const src = (rawSections[d.id] && typeof rawSections[d.id] === 'object') ? rawSections[d.id] : {};
      const merged = { ...def.sections[d.id], ...src };
      merged.visible = src.visible !== false;
      if (d.extras) {
        d.extras.forEach(ex => {
          merged[ex.key] = src[ex.key] !== false;
        });
      }
      sections[d.id] = merged;
    });

    return { order, sections };
  }

  let homeLayoutDraft = normalizeHomeLayout(campaignRaw.home_layout);
  let homeLayoutDirty = false;
  let expandedHomeSections = new Set();
  let draggedHomeSectionId = null;

  function showCampaignPreview() {
    const topBarInput = $('#topBarTextInput');
    const topBarActiveInput = $('#topBarActiveInput');
    const topBarPreview = $('#topBarPreview');
    if (topBarPreview && topBarInput) {
      topBarPreview.textContent = topBarInput.value.trim() || 'شحن لجميع المحافظات · دفع عند الاستلام · ضمان الثبات والفوحان';
      topBarPreview.style.opacity = topBarActiveInput && topBarActiveInput.checked ? '1' : '0.4';
      topBarPreview.style.textDecoration = topBarActiveInput && topBarActiveInput.checked ? 'none' : 'line-through';
    }

    const promoTitleInput = $('#promoTitleInput');
    const promoDetailsInput = $('#promoDetailsInput');
    const promoActiveInput = $('#promoActiveInput');
    const promoPreviewTitle = $('#promoPreviewTitle');
    const promoPreviewDetails = $('#promoPreviewDetails');
    const previewCard = document.querySelector('.campaign-preview-card');
    if (promoPreviewTitle && promoTitleInput) {
      promoPreviewTitle.textContent = promoTitleInput.value.trim() || 'اكتب نص الإعلان هنا';
    }
    if (promoPreviewDetails && promoDetailsInput) {
      const det = promoDetailsInput.value.trim();
      promoPreviewDetails.textContent = det;
      promoPreviewDetails.style.display = det ? 'block' : 'none';
    }
    if (previewCard && promoActiveInput) {
      previewCard.style.opacity = promoActiveInput.checked ? '1' : '0.4';
    }

    // Spotlight Preview
    const spotlightSel = $('#spotlightPerfumeSelect');
    const spotlightBadgeInput = $('#spotlightBadgeInput');
    const spotlightPriceInput = $('#spotlightPriceInput');
    const spotlightActiveInput = $('#spotlightActiveInput');
    const spotlightCard = $('#spotlightPreviewCard');
    const spotlightNameEl = $('#spotlightPreviewName');
    const spotlightBadgeEl = $('#spotlightPreviewBadge');
    const spotlightPriceEl = $('#spotlightPreviewPrice');
    const spotlightImgEl = $('#spotlightPreviewImg');

    if (spotlightCard && typeof currentProducts !== 'undefined' && currentProducts && currentProducts.length) {
      const chosenId = spotlightSel?.value;
      const targetProd = (chosenId ? currentProducts.find(p => String(p.id) === String(chosenId)) : null) || currentProducts[0];
      if (targetProd) {
        if (spotlightNameEl) spotlightNameEl.textContent = targetProd.name;
        if (spotlightBadgeEl) spotlightBadgeEl.textContent = spotlightBadgeInput?.value.trim() || '✨ عطر اليوم';
        if (spotlightImgEl && targetProd.image_url) spotlightImgEl.src = targetProd.image_url;
        if (spotlightPriceEl) {
          const offerPrice = Number(spotlightPriceInput?.value);
          if (offerPrice && offerPrice < targetProd.price) {
            spotlightPriceEl.innerHTML = `<span style="color:var(--admin-accent); font-size:13px; font-weight:700;">${arabicNum(offerPrice)} ج.م</span> <del style="opacity:0.6; font-size:10px; margin-inline-start:4px;">${arabicNum(targetProd.price)} ج.م</del> (وفر ${arabicNum(targetProd.price - offerPrice)} ج.م)`;
          } else {
            spotlightPriceEl.textContent = `${arabicNum(targetProd.price)} ج.م`;
          }
        }
      }
      if (spotlightActiveInput) {
        spotlightCard.style.opacity = spotlightActiveInput.checked ? '1' : '0.4';
      }
    }

    // Values & Ticker Live Preview
    const t1 = $('#tickerItem1')?.value.trim() || $('#valItem1')?.value.trim() || 'صُنع بحب في مصر';
    const t2 = $('#tickerItem2')?.value.trim() || $('#valItem2')?.value.trim() || 'خامات مختارة بعناية';
    const t3 = $('#tickerItem3')?.value.trim() || $('#valItem3')?.value.trim() || 'تركيبات غنية تدوم طويلاً';
    const t4 = $('#tickerItem4')?.value.trim() || $('#valItem4')?.value.trim() || 'هدية تحكي عنك';
    const t5 = $('#tickerItem5')?.value.trim() || 'لو في عطر مش موجود ومحتاجه نقدر نوفرهولك';
    const tickerPrev = $('#tickerPreviewText');
    if (tickerPrev) {
      tickerPrev.textContent = `✳ ${t1} · ✳ ${t2} · ✳ ${t3} · ✳ ${t4} · ✦ ${t5}`;
    }
    if ($('#vPreview1')) $('#vPreview1').textContent = t1;
    if ($('#vPreview2')) $('#vPreview2').textContent = t2;
    if ($('#vPreview3')) $('#vPreview3').textContent = t3;
    if ($('#vPreview4')) $('#vPreview4').textContent = t4;
  }

  function populateSpotlightSelect(prods) {
    const select = $('#spotlightPerfumeSelect');
    if (!select) return;
    const currentVal = select.value;
    const storedVal = readCampaignLocal().spotlight_perfume_id;
    const selectedId = currentVal || storedVal || '';

    const opts = ['<option value="">-- تلقائي (أول عطر متاح بالمتجر) --</option>'];
    (prods || []).forEach(p => {
      const isSel = String(p.id) === String(selectedId) ? 'selected' : '';
      opts.push(`<option value="${p.id}" ${isSel}>${escapeHtml(p.name)} (${p.price} ج.م)</option>`);
    });
    select.innerHTML = opts.join('');
    showCampaignPreview();
  }

  function populateCampaignInputs(data) {
    if ($('#topBarTextInput')) $('#topBarTextInput').value = data.top_bar || '';
    if ($('#topBarActiveInput')) $('#topBarActiveInput').checked = data.top_bar_active !== false;
    if ($('#promoTitleInput')) $('#promoTitleInput').value = data.promo_title || '';
    if ($('#promoDetailsInput')) $('#promoDetailsInput').value = data.promo_details || '';
    if ($('#promoStartInput')) $('#promoStartInput').value = data.promo_starts_at || '';
    if ($('#promoEndInput')) $('#promoEndInput').value = data.promo_ends_at || '';
    if ($('#promoActiveInput')) $('#promoActiveInput').checked = data.promo_active !== false;
    if ($('#spotlightPerfumeSelect') && data.spotlight_perfume_id) $('#spotlightPerfumeSelect').value = data.spotlight_perfume_id;
    if ($('#spotlightBadgeInput')) $('#spotlightBadgeInput').value = data.spotlight_badge || '';
    if ($('#spotlightPriceInput')) $('#spotlightPriceInput').value = data.spotlight_price !== undefined ? data.spotlight_price : '';
    if ($('#spotlightTitleInput')) $('#spotlightTitleInput').value = data.spotlight_title || '';
    if ($('#spotlightDescInput')) $('#spotlightDescInput').value = data.spotlight_desc || '';
    if ($('#spotlightActiveInput')) $('#spotlightActiveInput').checked = data.spotlight_active !== false;
    if ($('#storewideDiscountActive')) $('#storewideDiscountActive').checked = Boolean(data.storewide_discount_active);
    if ($('#storewideDiscountPercent')) $('#storewideDiscountPercent').value = data.storewide_discount_percent !== undefined ? data.storewide_discount_percent : '';
    if ($('#storewideDiscountScope')) $('#storewideDiscountScope').value = data.storewide_discount_scope || 'only_no_custom';
    if ($('#storewideDiscountBadge')) $('#storewideDiscountBadge').value = data.storewide_discount_badge || '';

    // Values & Ticker fields
    const vs = Array.isArray(data.values_strip) ? data.values_strip : [];
    const t1 = data.ticker_item_1 || vs[0] || 'صُنع بحب في مصر';
    const t2 = data.ticker_item_2 || vs[1] || 'خامات مختارة بعناية';
    const t3 = data.ticker_item_3 || vs[2] || 'تركيبات غنية تدوم طويلاً';
    const t4 = data.ticker_item_4 || vs[3] || 'هدية تحكي عنك';
    const t5 = data.ticker_item_5 || vs[4] || 'لو في عطر مش موجود ومحتاجه نقدر نوفرهولك';

    if ($('#tickerItem1')) $('#tickerItem1').value = t1;
    if ($('#tickerItem2')) $('#tickerItem2').value = t2;
    if ($('#tickerItem3')) $('#tickerItem3').value = t3;
    if ($('#tickerItem4')) $('#tickerItem4').value = t4;
    if ($('#tickerItem5')) $('#tickerItem5').value = t5;

    if ($('#valItem1')) $('#valItem1').value = t3;
    if ($('#valItem2')) $('#valItem2').value = t2;
    if ($('#valItem3')) $('#valItem3').value = t1;
    if ($('#valItem4')) $('#valItem4').value = t4;

    showCampaignPreview();
  }

  // Populate from local storage initially
  populateCampaignInputs(readCampaignLocal());

  // Then fetch latest from Supabase
  function loadCampaignFromSupa() {
    supaFetch('products', { filters: '&name=eq.__system_announcements__' })
      .then(rows => {
        if (rows && rows.length && rows[0].notes) {
          try {
            const data = JSON.parse(rows[0].notes);
            campaignRaw = data;
            populateCampaignInputs({
              ...defaultCampaign,
              ...data
            });
            try {
              localStorage.setItem(campaignKey, JSON.stringify(data));
              localStorage.setItem('rooh-announcements', JSON.stringify(data));
            } catch (_) {}
            if (typeof renderHomeLayoutEditor === 'function') renderHomeLayoutEditor();
          } catch (e) {
            console.error('Error parsing campaign notes:', e);
          }
        }
      })
      .catch(err => console.warn('Campaign fetch error:', err));
  }
  loadCampaignFromSupa();

  async function persistCampaignPayload(obj) {
    try {
      localStorage.setItem(campaignKey, JSON.stringify(obj));
      localStorage.setItem('rooh-announcements', JSON.stringify(obj));
    } catch (_) {}

    try {
      const updatedRows = await supaFetch('products', {
        method: 'PATCH',
        filters: '&name=eq.__system_announcements__',
        body: {
          notes: JSON.stringify(obj),
          category: 'unisex',
          in_stock: false
        }
      });
      if (!updatedRows || !updatedRows.length) {
        await supaFetch('products', {
          method: 'POST',
          body: {
            name: '__system_announcements__',
            category: 'unisex',
            price: 0,
            in_stock: false,
            notes: JSON.stringify(obj)
          }
        });
      }
      return true;
    } catch (err) {
      console.error('Failed to save to Supabase:', err);
      try {
        await supaFetch('products', {
          method: 'POST',
          body: {
            name: '__system_announcements__',
            category: 'unisex',
            price: 0,
            in_stock: false,
            notes: JSON.stringify(obj)
          }
        });
        return true;
      } catch (e2) {
        return false;
      }
    }
  }

  if (campaignForm) {
    campaignForm.addEventListener('input', showCampaignPreview);
    campaignForm.addEventListener('change', showCampaignPreview);
    campaignForm.addEventListener('submit', async event => {
      event.preventDefault();
      const startsAt = $('#promoStartInput')?.value || '';
      const endsAt = $('#promoEndInput')?.value || '';
      const status = $('#campaignStatus');
      if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
        if (status) {
          status.className = 'error';
          status.textContent = 'موعد الانتهاء لازم يكون بعد موعد البداية.';
        }
        return;
      }
      if (status) {
        status.className = '';
        status.textContent = 'جاري حفظ ونشر الإعلانات فوراً...';
      }

      const updatedCampaign = {
        ...campaignRaw,
        top_bar: $('#topBarTextInput')?.value.trim() || '',
        top_bar_active: $('#topBarActiveInput')?.checked !== false,
        promo_title: $('#promoTitleInput')?.value.trim() || '',
        promo_details: $('#promoDetailsInput')?.value.trim() || '',
        promo_starts_at: startsAt,
        promo_ends_at: endsAt,
        promo_active: $('#promoActiveInput')?.checked !== false,
        spotlight_perfume_id: $('#spotlightPerfumeSelect')?.value || '',
        spotlight_badge: $('#spotlightBadgeInput')?.value.trim() || '✨ عطر اليوم المميز',
        spotlight_price: $('#spotlightPriceInput')?.value ? Number($('#spotlightPriceInput').value) : '',
        spotlight_title: $('#spotlightTitleInput')?.value.trim() || '',
        spotlight_desc: $('#spotlightDescInput')?.value.trim() || '',
        spotlight_active: $('#spotlightActiveInput')?.checked !== false,
        storewide_discount_active: $('#storewideDiscountActive')?.checked || false,
        storewide_discount_percent: $('#storewideDiscountPercent')?.value ? Number($('#storewideDiscountPercent').value) : '',
        storewide_discount_scope: $('#storewideDiscountScope')?.value || 'only_no_custom',
        storewide_discount_badge: $('#storewideDiscountBadge')?.value.trim() || '',
        ticker_item_1: $('#tickerItem1')?.value.trim() || $('#valItem3')?.value.trim() || 'صُنع بحب في مصر',
        ticker_item_2: $('#tickerItem2')?.value.trim() || $('#valItem2')?.value.trim() || 'خامات مختارة بعناية',
        ticker_item_3: $('#tickerItem3')?.value.trim() || $('#valItem1')?.value.trim() || 'تركيبات غنية تدوم طويلاً',
        ticker_item_4: $('#tickerItem4')?.value.trim() || $('#valItem4')?.value.trim() || 'هدية تحكي عنك',
        ticker_item_5: $('#tickerItem5')?.value.trim() || 'لو في عطر مش موجود ومحتاجه نقدر نوفرهولك',
        values_strip: [
          $('#tickerItem1')?.value.trim() || $('#valItem3')?.value.trim() || 'صُنع بحب في مصر',
          $('#tickerItem2')?.value.trim() || $('#valItem2')?.value.trim() || 'خامات مختارة بعناية',
          $('#tickerItem3')?.value.trim() || $('#valItem1')?.value.trim() || 'تركيبات غنية تدوم طويلاً',
          $('#tickerItem4')?.value.trim() || $('#valItem4')?.value.trim() || 'هدية تحكي عنك',
          $('#tickerItem5')?.value.trim() || 'لو في عطر مش موجود ومحتاجه نقدر نوفرهولك'
        ]
      };

      try {
        localStorage.setItem('rooh-promo', JSON.stringify({
          title: updatedCampaign.promo_title,
          details: updatedCampaign.promo_details,
          startsAt: updatedCampaign.promo_starts_at,
          endsAt: updatedCampaign.promo_ends_at,
          active: updatedCampaign.promo_active
        }));
      } catch (_) {}

      campaignRaw = updatedCampaign;
      const savedRemote = await persistCampaignPayload(updatedCampaign);
      if (status) {
        if (savedRemote) {
          status.className = 'saved';
          status.textContent = 'تم حفظ ونشر الإعلانات وعطر اليوم بنجاح في المتجر! ✓';
        } else {
          status.className = 'error';
          status.textContent = 'تم الحفظ محلياً فقط. تحقق من اتصال الإنترنت أو إعدادات Supabase.';
        }
      }
    });
  }

  // ── 🧩 Homepage Sections Layout Editor (تنسيق الصفحة الرئيسية) ────────────
  function renderHomeLayoutEditor(forceFromDraft = false) {
    const listEl = $('#homeSectionsList');
    if (!listEl) return;

    if (!forceFromDraft && !homeLayoutDirty) {
      homeLayoutDraft = normalizeHomeLayout(campaignRaw.home_layout);
    }

    const total = homeLayoutDraft.order.length;
    listEl.innerHTML = homeLayoutDraft.order.map((id, idx) => {
      const def = HOME_SECTION_DEFS.find(d => d.id === id);
      if (!def) return '';
      const sec = homeLayoutDraft.sections[id] || { visible: true };
      const isVisible = sec.visible !== false;
      const isExpanded = expandedHomeSections.has(id);

      const fieldsHtml = def.fields.map(f => {
        const valAr = escapeHtml(sec[`${f.key}_ar`] || '');
        const valEn = escapeHtml(sec[`${f.key}_en`] || '');
        const ctrlAr = f.type === 'textarea'
          ? `<textarea rows="2" data-field="${f.key}_ar" placeholder="اتركه فارغاً للنص الافتراضي">${valAr}</textarea>`
          : `<input type="text" data-field="${f.key}_ar" value="${valAr}" placeholder="اتركه فارغاً للنص الافتراضي">`;
        const ctrlEn = f.type === 'textarea'
          ? `<textarea rows="2" dir="ltr" data-field="${f.key}_en" placeholder="Leave empty for default text">${valEn}</textarea>`
          : `<input type="text" dir="ltr" data-field="${f.key}_en" value="${valEn}" placeholder="Leave empty for default text">`;
        return `
          <div class="home-field-group">
            <span class="home-field-label">${escapeHtml(f.label)}</span>
            <div class="home-field-pair">
              <label><small>عربي</small>${ctrlAr}</label>
              <label><small>English</small>${ctrlEn}</label>
            </div>
          </div>
        `;
      }).join('');

      const extrasHtml = def.extras ? `
        <div class="home-extras-row">
          ${def.extras.map(ex => `
            <label class="home-extra-check">
              <input type="checkbox" data-flag="${ex.key}" ${sec[ex.key] !== false ? 'checked' : ''}>
              <span>${escapeHtml(ex.label)}</span>
            </label>
          `).join('')}
        </div>
      ` : '';

      const noteHtml = def.note ? `<p class="home-section-note">${escapeHtml(def.note)}</p>` : '';

      return `
        <li class="home-section-row ${isVisible ? '' : 'is-hidden'}" draggable="true" data-id="${id}">
          <div class="home-row-head">
            <div class="home-row-info">
              <span class="home-row-num">${arabicNum(idx + 1)}</span>
              <span class="home-drag-handle" title="اسحب لإعادة الترتيب">⋮⋮</span>
              <span class="home-row-icon">${def.icon}</span>
              <strong class="home-row-name">${escapeHtml(def.name)}</strong>
            </div>
            <div class="home-row-controls">
              <button type="button" class="home-move-btn" data-move="-1" title="تحريك لأعلى" ${idx === 0 ? 'disabled' : ''}>↑</button>
              <button type="button" class="home-move-btn" data-move="1" title="تحريك لأسفل" ${idx === total - 1 ? 'disabled' : ''}>↓</button>
              <label class="home-vis-switch" title="إظهار أو إخفاء القسم">
                <input type="checkbox" data-visible ${isVisible ? 'checked' : ''}>
                <span class="home-vis-label">${isVisible ? 'ظاهر' : 'مخفي'}</span>
              </label>
              <button type="button" class="home-edit-toggle ${isExpanded ? 'active' : ''}" data-toggle-edit>✏️ تعديل النصوص</button>
            </div>
          </div>
          <div class="home-section-fields ${isExpanded ? 'open' : ''}">
            ${noteHtml}
            ${extrasHtml}
            ${fieldsHtml}
          </div>
        </li>
      `;
    }).join('');
  }

  const homeSectionsListEl = $('#homeSectionsList');
  if (homeSectionsListEl) {
    homeSectionsListEl.addEventListener('click', e => {
      const row = e.target.closest('.home-section-row');
      if (!row) return;
      const id = row.dataset.id;

      const moveBtn = e.target.closest('[data-move]');
      if (moveBtn) {
        const dir = parseInt(moveBtn.dataset.move, 10);
        const idx = homeLayoutDraft.order.indexOf(id);
        const newIdx = idx + dir;
        if (idx >= 0 && newIdx >= 0 && newIdx < homeLayoutDraft.order.length) {
          const arr = homeLayoutDraft.order;
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
          homeLayoutDirty = true;
          renderHomeLayoutEditor(true);
        }
        return;
      }

      const editBtn = e.target.closest('[data-toggle-edit]');
      if (editBtn) {
        if (expandedHomeSections.has(id)) {
          expandedHomeSections.delete(id);
        } else {
          expandedHomeSections.add(id);
        }
        const fieldsBox = row.querySelector('.home-section-fields');
        if (fieldsBox) fieldsBox.classList.toggle('open', expandedHomeSections.has(id));
        editBtn.classList.toggle('active', expandedHomeSections.has(id));
      }
    });

    const handleFieldChange = e => {
      const row = e.target.closest('.home-section-row');
      if (!row) return;
      const id = row.dataset.id;
      const sec = homeLayoutDraft.sections[id];
      if (!sec) return;

      if (e.target.hasAttribute('data-visible')) {
        sec.visible = e.target.checked;
        homeLayoutDirty = true;
        row.classList.toggle('is-hidden', !sec.visible);
        const lbl = row.querySelector('.home-vis-label');
        if (lbl) lbl.textContent = sec.visible ? 'ظاهر' : 'مخفي';
        return;
      }

      if (e.target.hasAttribute('data-flag')) {
        const flagKey = e.target.getAttribute('data-flag');
        sec[flagKey] = e.target.checked;
        homeLayoutDirty = true;
        return;
      }

      if (e.target.hasAttribute('data-field')) {
        const fieldKey = e.target.getAttribute('data-field');
        sec[fieldKey] = e.target.value;
        homeLayoutDirty = true;
      }
    };

    homeSectionsListEl.addEventListener('input', handleFieldChange);
    homeSectionsListEl.addEventListener('change', handleFieldChange);

    homeSectionsListEl.addEventListener('dragstart', e => {
      const row = e.target.closest('.home-section-row');
      if (!row) return;
      draggedHomeSectionId = row.dataset.id;
      row.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedHomeSectionId);
      }
    });

    homeSectionsListEl.addEventListener('dragend', () => {
      draggedHomeSectionId = null;
      homeSectionsListEl.querySelectorAll('.home-section-row').forEach(r => {
        r.classList.remove('dragging', 'drag-over');
      });
    });

    homeSectionsListEl.addEventListener('dragover', e => {
      e.preventDefault();
      const targetRow = e.target.closest('.home-section-row');
      homeSectionsListEl.querySelectorAll('.home-section-row').forEach(r => {
        if (r !== targetRow) r.classList.remove('drag-over');
      });
      if (targetRow && targetRow.dataset.id !== draggedHomeSectionId) {
        targetRow.classList.add('drag-over');
      }
    });

    homeSectionsListEl.addEventListener('dragleave', e => {
      const row = e.target.closest('.home-section-row');
      if (row && !row.contains(e.relatedTarget)) {
        row.classList.remove('drag-over');
      }
    });

    homeSectionsListEl.addEventListener('drop', e => {
      e.preventDefault();
      const targetRow = e.target.closest('.home-section-row');
      if (!targetRow || !draggedHomeSectionId) return;
      const targetId = targetRow.dataset.id;
      if (targetId === draggedHomeSectionId) return;

      const rect = targetRow.getBoundingClientRect();
      const after = (e.clientY - rect.top) > (rect.height / 2);

      const order = homeLayoutDraft.order.filter(item => item !== draggedHomeSectionId);
      let insertIdx = order.indexOf(targetId);
      if (insertIdx === -1) return;
      if (after) insertIdx += 1;
      order.splice(insertIdx, 0, draggedHomeSectionId);

      homeLayoutDraft.order = order;
      homeLayoutDirty = true;
      draggedHomeSectionId = null;
      renderHomeLayoutEditor(true);
    });
  }

  $('#homeLayoutResetBtn')?.addEventListener('click', () => {
    if (!confirm('هل تريد استرجاع الترتيب والنصوص الافتراضية لجميع أقسام الصفحة الرئيسية؟')) return;
    homeLayoutDraft = getDefaultHomeLayout();
    homeLayoutDirty = true;
    renderHomeLayoutEditor(true);
    const st = $('#homeLayoutStatus');
    if (st) {
      st.className = '';
      st.textContent = 'تم استرجاع الترتيب الافتراضي — اضغط "حفظ ونشر" لتطبيقه على المتجر.';
    }
  });

  $('#saveHomeLayoutBtn')?.addEventListener('click', async () => {
    const st = $('#homeLayoutStatus');
    if (st) {
      st.className = '';
      st.textContent = 'جاري حفظ ونشر ترتيب الصفحة الرئيسية...';
    }
    const updated = { ...campaignRaw, home_layout: homeLayoutDraft };
    const savedRemote = await persistCampaignPayload(updated);
    campaignRaw = updated;
    homeLayoutDirty = false;
    if (st) {
      if (savedRemote) {
        st.className = 'saved';
        st.textContent = 'تم حفظ ونشر ترتيب الصفحة الرئيسية بنجاح ✓';
      } else {
        st.className = 'error';
        st.textContent = 'تم الحفظ محلياً فقط. تحقق من اتصال الإنترنت أو إعدادات Supabase.';
      }
    }
  });

  renderHomeLayoutEditor();

  // ── Load orders & products from Supabase ──────────────────────────────────
  function cleanPhoneForWhatsApp(phone) {
    if (!phone) return '';
    let digits = String(phone).replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 11) {
      digits = '2' + digits;
    }
    return digits;
  }

  function formatArabicDateTime(dateStr) {
    if (!dateStr) return '—';
    try {
      return new Intl.DateTimeFormat(adminLang === 'ar' ? 'ar-EG' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateStr));
    } catch (_) {
      return dateStr;
    }
  }

  function parseOrderItems(items) {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      try { return JSON.parse(items); } catch (_) { return []; }
    }
    return [];
  }

  function renderOrders(orders) {
    currentOrders = orders || [];
    try { localStorage.setItem('rooh-cached-orders', JSON.stringify(currentOrders)); } catch (_) {}
    const count = currentOrders.length;
    $('#statOrders').textContent = arabicNum(count);
    $('#orderBadge').textContent = arabicNum(count);
    const countBadge = $('#ordersCountBadge');
    if (countBadge) countBadge.textContent = `${arabicNum(count)} ${adminLang === 'ar' ? 'طلبات' : 'orders'}`;

    const total = currentOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    $('#statTotal').textContent = money(total);

    if (!count) {
      $('#ordersTable').innerHTML = `<tr><td colspan="7" class="empty-table">${adminLang === 'ar' ? 'لا توجد طلبات مسجلة بعد. ستظهر الطلبات الجديدة هنا فور تسجيلها.' : 'No orders recorded yet. New orders will appear here automatically.'}</td></tr>`;
      return;
    }

    const statusOptions = adminLang === 'ar' ? [
      { val: 'pending',   label: '⏳ قيد الانتظار' },
      { val: 'confirmed', label: '✓ مؤكد' },
      { val: 'shipped',   label: '🚚 تم الشحن' },
      { val: 'delivered', label: '★ تم التسليم' },
      { val: 'cancelled', label: '✕ ملغي' },
    ] : [
      { val: 'pending',   label: '⏳ Pending' },
      { val: 'confirmed', label: '✓ Confirmed' },
      { val: 'shipped',   label: '🚚 Shipped' },
      { val: 'delivered', label: '★ Delivered' },
      { val: 'cancelled', label: '✕ Cancelled' },
    ];

    $('#ordersTable').innerHTML = currentOrders.map(o => {
      const dateText = formatArabicDateTime(o.created_at);
      const cleanPhone = cleanPhoneForWhatsApp(o.phone);
      const waMsg = encodeURIComponent(adminLang === 'ar'
        ? `مرحباً أستاذ ${o.customer_name || ''}، معك فريق رُوح بخصوص طلبك رقم ${o.order_number}`
        : `Hello ${o.customer_name || ''}, this is Rou7 Perfume team regarding your order #${o.order_number}`);
      const waLink = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waMsg}` : '';

      const itemsList = parseOrderItems(o.items);
      const itemsSummary = itemsList.length
        ? itemsList.map(it => `${escapeHtml(it.name || 'عطر')} × ${arabicNum(it.qty || 1)}`).join('<br>')
        : '—';

      const currentStatus = o.status || 'pending';
      const optionsHtml = statusOptions.map(opt =>
        `<option value="${opt.val}" ${opt.val === currentStatus ? 'selected' : ''}>${opt.label}</option>`
      ).join('');

      return `<tr>
        <td><span class="order-num-pill">${escapeHtml(o.order_number || '—')}</span></td>
        <td class="client-cell">
          <strong>${escapeHtml(o.customer_name || (adminLang === 'ar' ? 'عميل رُوح' : 'Rou7 Customer'))}</strong>
          <small dir="ltr">${escapeHtml(o.phone || '—')}</small>
          ${waLink ? `<a href="${waLink}" target="_blank" class="btn-wa-client" title="WhatsApp">💬 WhatsApp</a>` : ''}
        </td>
        <td><div class="order-items-summary">${itemsSummary}</div></td>
        <td><strong>${money(o.total || 0)}</strong></td>
        <td>
          <select class="status-select ${currentStatus}" data-status-id="${o.id}">
            ${optionsHtml}
          </select>
        </td>
        <td><span style="font-size:10px;color:var(--muted);">${dateText}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-action" data-view-order="${o.id}" title="${adminLang === 'ar' ? 'عرض وطباعة الفاتورة' : 'View and Print Invoice'}">${adminLang === 'ar' ? '📄 الفاتورة' : '📄 Invoice'}</button>
            <button class="btn-action btn-delete" data-del-order="${o.id}" title="${adminLang === 'ar' ? 'حذف الطلب' : 'Delete Order'}">🗑</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    calculateSalesAnalytics();
  }

  function calculateSalesAnalytics(range) {
    if (!range) range = salesTimeRange || 'all';
    salesTimeRange = range;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    let filteredOrders = (currentOrders || []).filter(o => !deletedOrderIds.has(String(o.id)));

    if (range === 'today') {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      filteredOrders = filteredOrders.filter(o => {
        const t = new Date(o.created_at || now).getTime();
        return t >= todayStart;
      });
    } else if (range === 'week') {
      const weekStart = now - (7 * dayMs);
      filteredOrders = filteredOrders.filter(o => {
        const t = new Date(o.created_at || now).getTime();
        return t >= weekStart;
      });
    } else if (range === 'month') {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      filteredOrders = filteredOrders.filter(o => {
        const t = new Date(o.created_at || now).getTime();
        return t >= monthStart;
      });
    }

    // Build product maps for price and cost lookup
    const productCostMap = new Map();
    const productPriceMap = new Map();
    const productObjMap = new Map();
    (currentProducts || []).forEach(p => {
      const d = unpackProductDetails(p);
      const c = parseFloat(d.cost_price || p.cost_price) || 0;
      const s = parseFloat(d.sale_price || p.sale_price) || parseFloat(p.price) || 0;
      productCostMap.set(String(p.id), c);
      productPriceMap.set(String(p.id), s);
      productObjMap.set(String(p.id), p);
      if (p.name) {
        const normName = p.name.trim().toLowerCase();
        productCostMap.set(normName, c);
        productPriceMap.set(normName, s);
        productObjMap.set(normName, p);
      }
    });

    let totalRevenue = 0;
    let totalEstimatedCost = 0;
    let totalBottlesSold = 0;
    const perfumeLeaderboard = new Map();
    const statusCounts = {
      delivered: 0,
      shipped: 0,
      confirmed: 0,
      processing: 0,
      pending: 0,
      cancelled: 0
    };

    filteredOrders.forEach(order => {
      const orderTotal = parseFloat(order.total) || 0;
      totalRevenue += orderTotal;

      const st = (order.status || 'pending').toLowerCase();
      if (statusCounts[st] !== undefined) statusCounts[st]++;
      else statusCounts.pending++;

      const items = parseOrderItems(order.items);
      items.forEach(item => {
        const q = parseInt(item.qty || item.quantity) || 1;
        const pPrice = parseFloat(item.price) || 0;
        totalBottlesSold += q;

        let itemCost = 0;
        let pObj = null;
        if (item.id && productCostMap.has(String(item.id))) {
          itemCost = productCostMap.get(String(item.id));
          pObj = productObjMap.get(String(item.id));
        } else if (item.name && productCostMap.has(item.name.trim().toLowerCase())) {
          itemCost = productCostMap.get(item.name.trim().toLowerCase());
          pObj = productObjMap.get(item.name.trim().toLowerCase());
        }

        const itemRev = pPrice > 0 ? (pPrice * q) : (orderTotal);
        const itemTotCost = itemCost * q;
        totalEstimatedCost += itemTotCost;

        const perfumeKey = item.name || (pObj ? pObj.name : 'عطر رُوح');
        if (!perfumeLeaderboard.has(perfumeKey)) {
          perfumeLeaderboard.set(perfumeKey, {
            name: perfumeKey,
            image: pObj ? pObj.image_url : null,
            sellingPrice: pPrice || (pObj ? pObj.price : 0),
            costPrice: itemCost,
            unitsSold: 0,
            revenue: 0,
            profit: 0
          });
        }
        const record = perfumeLeaderboard.get(perfumeKey);
        record.unitsSold += q;
        record.revenue += itemRev;
        record.profit += (itemRev - itemTotCost);
      });
    });

    const netProfit = totalRevenue - totalEstimatedCost;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
    const avgOrderValue = filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length) : 0;

    // Render KPIs
    if ($('#kpiTotalRevenue')) $('#kpiTotalRevenue').textContent = money(totalRevenue);
    if ($('#kpiRevenueSub')) $('#kpiRevenueSub').textContent = `${arabicNum(filteredOrders.length)} ${adminLang === 'ar' ? 'طلبات مسجلة' : 'recorded orders'}`;
    if ($('#kpiNetProfit')) $('#kpiNetProfit').textContent = money(netProfit);
    if ($('#kpiMarginSub')) $('#kpiMarginSub').textContent = `${adminLang === 'ar' ? 'هامش الربح الإجمالي:' : 'Total Margin:'} ${arabicNum(profitMargin)}%`;
    if ($('#kpiTotalBottles')) $('#kpiTotalBottles').textContent = arabicNum(totalBottlesSold);
    if ($('#kpiOrdersCountSub')) $('#kpiOrdersCountSub').textContent = `${adminLang === 'ar' ? 'من خلال' : 'across'} ${arabicNum(filteredOrders.length)} ${adminLang === 'ar' ? 'طلبات' : 'orders'}`;
    if ($('#kpiAvgOrder')) $('#kpiAvgOrder').textContent = money(avgOrderValue);

    // Overview stat card
    if ($('#statProfit')) $('#statProfit').textContent = money(netProfit);

    // Leaderboard table
    const sortedPerfumes = Array.from(perfumeLeaderboard.values()).sort((a, b) => b.unitsSold - a.unitsSold || b.profit - a.profit);
    const tbody = $('#salesLeaderboardBody');
    if (tbody) {
      if (!sortedPerfumes.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">${adminLang === 'ar' ? 'لا توجد بيانات مبيعات في هذه الفترة المحددة.' : 'No sales data for this period.'}</td></tr>`;
      } else {
        tbody.innerHTML = sortedPerfumes.map((p, idx) => {
          const imgH = p.image ? `<img src="${escapeHtml(p.image)}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;margin-inline-end:8px;vertical-align:middle;background:rgba(255,255,255,0.05);">` : '🧴 ';
          const margin = p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(0) : 0;
          const rankBadge = idx === 0 ? '🥇 ' : (idx === 1 ? '🥈 ' : (idx === 2 ? '🥉 ' : ''));
          return `
            <tr>
              <td><strong>${rankBadge}${imgH}${escapeHtml(p.name)}</strong></td>
              <td>${money(p.sellingPrice)}</td>
              <td><span style="color:var(--admin-muted);">${p.costPrice > 0 ? money(p.costPrice) : '—'}</span></td>
              <td><strong style="color:var(--pink);">${arabicNum(p.unitsSold)}</strong> ${adminLang === 'ar' ? 'زجاجة' : 'bottles'}</td>
              <td><strong>${money(p.revenue)}</strong></td>
              <td><strong style="color:${p.profit >= 0 ? '#2ecc71' : '#e74c3c'};">${money(p.profit)}</strong></td>
              <td><span class="stock-tag in" style="font-size:11px;">${arabicNum(margin)}%</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Financial statement summary
    if ($('#finGrossSales')) $('#finGrossSales').textContent = money(totalRevenue);
    if ($('#finTotalCost')) $('#finTotalCost').textContent = money(totalEstimatedCost);
    if ($('#finNetProfit')) $('#finNetProfit').textContent = money(netProfit);

    renderStatusBreakdownBars(statusCounts, filteredOrders.length);
  }

  function renderStatusBreakdownBars(counts, total) {
    const wrap = $('#orderStatusBreakdown');
    if (!wrap) return;
    const t = total || 1;
    const labels = {
      delivered:  { text: adminLang === 'ar' ? 'تم التوصيل' : 'Delivered', color: '#2ecc71', icon: '★' },
      shipped:    { text: adminLang === 'ar' ? 'تم الشحن' : 'Shipped', color: '#3498db', icon: '🚚' },
      confirmed:  { text: adminLang === 'ar' ? 'مؤكد' : 'Confirmed', color: '#9b59b6', icon: '✓' },
      processing: { text: adminLang === 'ar' ? 'قيد التجهيز' : 'Processing', color: '#e67e22', icon: '⏳' },
      pending:    { text: adminLang === 'ar' ? 'قيد الانتظار' : 'Pending', color: '#f39c12', icon: '⏱' },
      cancelled:  { text: adminLang === 'ar' ? 'ملغي' : 'Cancelled', color: '#e74c3c', icon: '✕' }
    };

    wrap.innerHTML = Object.entries(labels).map(([k, meta]) => {
      const c = counts[k] || 0;
      const pct = total > 0 ? Math.round((c / t) * 100) : 0;
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:5px;">
            <span>${meta.icon} ${meta.text}</span>
            <strong>${arabicNum(c)} (${arabicNum(pct)}%)</strong>
          </div>
          <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
            <div style="width:${pct}%; height:100%; background:${meta.color}; border-radius:3px; transition:width .4s ease;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  async function persistOrdersMeta() {
    try {
      localStorage.setItem('rooh-deleted-orders', JSON.stringify([...deletedOrderIds]));
      localStorage.setItem('rooh-order-statuses', JSON.stringify(orderStatusMap));

      const metaPayload = {
        deleted: [...deletedOrderIds],
        statuses: orderStatusMap
      };

      if (!SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
        const updated = await supaFetch('products', {
          method: 'PATCH',
          filters: '&name=eq.__system_orders_meta__',
          body: { notes: JSON.stringify(metaPayload), in_stock: false, price: 0, category: 'unisex' }
        });
        if (!updated || !updated.length) {
          await supaFetch('products', {
            method: 'POST',
            body: { name: '__system_orders_meta__', notes: JSON.stringify(metaPayload), in_stock: false, price: 0, category: 'unisex' }
          });
        }
      }
    } catch (err) {
      console.warn('Orders meta persist notice:', err);
    }
  }

  async function loadOrders(isManual = false) {
    const refreshBtn = $('#refreshOrdersBtn');
    if (refreshBtn && isManual) refreshBtn.classList.add('spinning');

    try {
      // 1. Fetch remote orders metadata (deleted IDs & status overrides)
      try {
        const metaRows = await supaFetch('products', { filters: '&name=eq.__system_orders_meta__' });
        if (metaRows && metaRows.length && metaRows[0].notes) {
          const meta = JSON.parse(metaRows[0].notes);
          if (meta.deleted && Array.isArray(meta.deleted)) {
            meta.deleted.forEach(delId => deletedOrderIds.add(String(delId)));
            localStorage.setItem('rooh-deleted-orders', JSON.stringify([...deletedOrderIds]));
          }
          if (meta.statuses && typeof meta.statuses === 'object') {
            orderStatusMap = { ...orderStatusMap, ...meta.statuses };
            localStorage.setItem('rooh-order-statuses', JSON.stringify(orderStatusMap));
          }
        }
      } catch (_) {}

      // 2. Fetch live orders from Supabase
      const rawOrders = await supaFetch('orders', { filters: '&order=created_at.desc&limit=100' });
      if (Array.isArray(rawOrders)) {
        let filteredOrders = rawOrders
          .filter(o => !deletedOrderIds.has(String(o.id)))
          .map(o => {
            if (orderStatusMap[o.id]) o.status = orderStatusMap[o.id];
            return o;
          });

        // Self-healing: if the deletion register swallowed every live order, the
        // register is stale/corrupted — restore the orders instead of showing none.
        if (!filteredOrders.length && rawOrders.length) {
          console.warn('Orders: deleted register covers all live orders — resetting it.');
          deletedOrderIds = new Set();
          try { localStorage.removeItem('rooh-deleted-orders'); } catch (_) {}
          await persistOrdersMeta();
          filteredOrders = rawOrders.map(o => {
            if (orderStatusMap[o.id]) o.status = orderStatusMap[o.id];
            return o;
          });
        }

        renderOrders(filteredOrders);
      }
    } catch (err) {
      console.error('Admin orders fetch error:', err);
      if (!currentOrders.length) {
        $('#ordersTable').innerHTML = `<tr><td colspan="7" class="empty-table error">${adminLang === 'ar' ? 'تعذر تحميل الطلبات. تحقق من الاتصال.' : 'Failed to load orders. Check connection.'}</td></tr>`;
      }
    } finally {
      if (refreshBtn) refreshBtn.classList.remove('spinning');
    }
  }

  function renderProductsTable(products) {
    if (products) {
      currentProducts = (products || []).filter(p => p.name !== '__system_announcements__' && p.name !== '__system_brands__' && p.name !== '__system_orders_meta__');
      try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
    }
    $('#statProducts').textContent = arabicNum(currentProducts.length);
    $('#prodBadge').textContent     = arabicNum(currentProducts.length);
    populateSpotlightSelect(currentProducts);
    if (typeof calculateSalesAnalytics === 'function') calculateSalesAnalytics();
    if (typeof renderInventoryPanel === 'function') renderInventoryPanel();

    // Update Brand Filter dropdown options
    populateBrandSelects();

    // Featured Hero count badge
    const featuredCount = currentProducts.filter(p => Boolean(p.is_featured)).length;
    const featuredBadge = $('#featuredCountBadge') || $('#solarCountBadge');
    if (featuredBadge) featuredBadge.textContent = arabicNum(featuredCount);

    const searchQuery = ($('#adminProdSearch')?.value || '').trim().toLowerCase();
    const catFilterVal = $('#adminCatFilter')?.value || 'all';
    const brandFilterVal = $('#adminBrandFilter')?.value || 'all';

    const filtered = currentProducts.filter(p => {
      const d = unpackProductDetails(p);
      const bObj = findBrandObject(p.brand || d.brand);
      const brandName = (p.brand || d.brand || 'رُوح').toLowerCase();
      const pCat = (p.category || 'unisex').toLowerCase();

      // Category & Hero matching
      if (catFilterVal === '__featured__' || isHeroQuickActive) {
        if (!p.is_featured) return false;
      } else if (catFilterVal !== 'all') {
        const normCat = (pCat === 'gifts' || pCat.includes('هد') || pCat.includes('gift') || pCat.includes('box')) ? 'gifts'
          : (pCat === 'women' || pCat.includes('نسائ')) ? 'women'
          : (pCat === 'men' || pCat.includes('رجال')) ? 'men' : 'unisex';
        if (normCat !== catFilterVal) return false;
      }

      // Brand matching
      if (brandFilterVal !== 'all') {
        const bfLow = brandFilterVal.toLowerCase();
        const matchesBrand = brandName === bfLow ||
          (bObj && (bObj.name_en.toLowerCase() === bfLow || bObj.name_ar.toLowerCase() === bfLow || bObj.id.toLowerCase() === bfLow));
        if (!matchesBrand) return false;
      }

      // Search query matching (name, latin, brand, category, notes, accords, inspired_by)
      if (searchQuery) {
        const qNorm = normalizeSearchText(searchQuery);
        const bExtra = bObj ? `${bObj.name_ar} ${bObj.name_en}` : '';
        const hay = normalizeSearchText(`${p.name} ${p.latin || ''} ${brandName} ${bExtra} ${pCat} ${d.notes} ${d.inspired_by} ${d.accords}`);
        if (!hay.includes(qNorm)) {
          const tokens = qNorm.split(/\s+/).filter(Boolean);
          if (!tokens.every(t => hay.includes(t))) return false;
        }
      }
      return true;
    });

    if (!filtered.length) {
      $('#productsTable').innerHTML = `<tr><td colspan="8" class="empty-table">${adminLang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك أو لا توجد عطور حالياً.' : 'No fragrances match your search.'}</td></tr>`;
      return;
    }

    const catLabels = {
      women:  { text: adminLang === 'ar' ? 'نسائي' : 'For Her', class: 'women' },
      men:    { text: adminLang === 'ar' ? 'رجالي' : 'For Him', class: 'men' },
      unisex: { text: adminLang === 'ar' ? 'للجميع' : 'Unisex', class: 'unisex' },
      gifts:  { text: adminLang === 'ar' ? '🎁 بوكسات وهدايا' : '🎁 Gifts & Boxes', class: 'gifts' },
    };

    $('#productsTable').innerHTML = filtered.map(p => {
      const pCat = (p.category || 'unisex').toLowerCase();
      const normCatKey = (pCat === 'gifts' || pCat.includes('هد') || pCat.includes('gift') || pCat.includes('box')) ? 'gifts'
        : (pCat === 'women' || pCat.includes('نسائ')) ? 'women'
        : (pCat === 'men' || pCat.includes('رجال')) ? 'men' : 'unisex';
      const cat = catLabels[normCatKey] || { text: p.category || (adminLang === 'ar' ? 'للجميع' : 'Unisex'), class: 'unisex' };
      const d = unpackProductDetails(p);
      const prodBrand = p.brand || d.brand || 'رُوح';
      const bObj = findBrandObject(prodBrand);
      const brandLogoHtml = bObj && bObj.logo_url
        ? `<img src="${escapeHtml(bObj.logo_url)}" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:middle;margin-inline-end:5px;border-radius:3px;background:rgba(255,255,255,0.06);padding:2px;">`
        : '';
      const brandDisplay = bObj ? (adminLang === 'en' ? (bObj.name_en || bObj.name_ar) : (bObj.name_ar || bObj.name_en)) : prodBrand;

      const imgHtml = p.image_url
        ? `<div class="prod-thumb"><img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}"></div>`
        : `<div class="prod-thumb"><span class="thumb-empty">🧴</span></div>`;

      const titlePrimary = adminLang === 'en' ? (p.latin || p.name) : p.name;
      const titleSub = adminLang === 'en' ? (p.latin ? p.name : '') : (p.latin || '');

      let displayNotes = d.notes || p.notes || '—';
      if (d.inspired_by) {
        displayNotes = `${adminLang === 'ar' ? 'مستوحى من' : 'Inspired by'}: ${d.inspired_by} · ${displayNotes}`;
      }

      const saleVal = Number(p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : d.sale_price);
      const costVal = Number(p.cost_price !== undefined && p.cost_price !== null ? p.cost_price : d.cost_price);
      let priceCellHtml = `<strong>${money(p.price)}</strong>`;
      if (saleVal && saleVal > 0 && saleVal < p.price) {
        const pct = Math.round(((p.price - saleVal) / p.price) * 100);
        priceCellHtml = `
          <div class="admin-price-box">
            <strong class="admin-sale-price">${money(saleVal)}</strong>
            <del class="admin-old-price">${money(p.price)}</del>
            <span class="admin-discount-badge">${d.discount_badge || `-${pct}%`}</span>
          </div>
        `;
      }
      if (costVal > 0) {
        const activePrice = (saleVal && saleVal > 0 && saleVal < p.price) ? saleVal : p.price;
        const netProfit = activePrice - costVal;
        const marginPct = activePrice > 0 ? ((netProfit / activePrice) * 100).toFixed(0) : 0;
        priceCellHtml += `
          <div style="font-size:10px; color:${netProfit >= 0 ? '#2ecc71' : '#e74c3c'}; margin-top:3px; white-space:nowrap;" title="سعر الشراء: ${money(costVal)} · صافي الربح: ${money(netProfit)}">
            <span style="opacity:0.75;">تكلفة:</span> ${money(costVal)} · <span style="font-weight:600;">ربح: +${money(netProfit)} (${arabicNum(marginPct)}%)</span>
          </div>
        `;
      }
      if (d.sizes && d.sizes.length) {
        priceCellHtml += `
          <div style="margin-top:3px;">
            <span style="display:inline-block; font-size:10px; background:rgba(59,130,246,0.12); color:#1d4ed8; border:1px solid rgba(59,130,246,0.25); padding:1px 6px; border-radius:4px; font-weight:600;" title="${d.sizes.map(s => `${s.size}: ${money(s.price)}`).join(' · ')}">
              ${arabicNum(d.sizes.length)} ${adminLang === 'ar' ? 'أحجام' : 'sizes'} 🧴
            </span>
          </div>
        `;
      }

      return `<tr>
        <td>${imgHtml}</td>
        <td class="prod-title-cell">
          <strong>${escapeHtml(titlePrimary)}</strong>
          ${titleSub ? `<small>${escapeHtml(titleSub)}</small>` : ''}
        </td>
        <td><span class="brand-pill" style="display:inline-flex;align-items:center;">${brandLogoHtml}${escapeHtml(brandDisplay)}</span></td>
        <td><span class="cat-pill ${cat.class}">${cat.text}</span></td>
        <td>${priceCellHtml}</td>
        <td><span style="font-size:10px;color:var(--muted);">${escapeHtml(displayNotes)}</span></td>
        <td>
          <span class="stock-tag ${p.in_stock !== false && (d.stock_quantity === '' || d.stock_quantity === undefined || parseInt(d.stock_quantity) > 0) ? 'in' : 'out'}">
            ${p.in_stock !== false && (d.stock_quantity === '' || d.stock_quantity === undefined || parseInt(d.stock_quantity) > 0)
              ? (d.stock_quantity !== '' && d.stock_quantity !== undefined
                  ? `${adminLang === 'ar' ? 'متوفر' : 'In Stock'} (${arabicNum(d.stock_quantity)} ${adminLang === 'ar' ? 'قطعة' : 'pcs'})`
                  : (adminLang === 'ar' ? 'متوفر ✓' : 'In Stock ✓'))
              : (adminLang === 'ar' ? 'نفد من المخزون (0)' : 'Out of Stock (0)')}
          </span>
          ${p.is_featured ? `<span class="featured-mark" title="${adminLang === 'ar' ? 'عطر الواجهة الرئيسي 3D ⭐' : '3D Featured Hero Fragrance ⭐'}">⭐ ${adminLang === 'ar' ? 'الواجهة' : 'Hero'}</span>` : ''}
          ${p.tag ? `<span class="tag-badge">${escapeHtml(p.tag)}</span>` : ''}
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-action btn-hero-toggle ${p.is_featured ? 'in-hero' : ''}" data-toggle-hero="${p.id}" title="${p.is_featured ? (adminLang === 'ar' ? 'معروض في واجهة المتجر 3D' : 'Featured in 3D Hero') : (adminLang === 'ar' ? 'تعيين كعطر الواجهة الرئيسي 3D' : 'Set as Featured 3D Hero')}">
              ${p.is_featured ? (adminLang === 'ar' ? '⭐ بالواجهة' : '⭐ Hero') : (adminLang === 'ar' ? '＋ للواجهة' : '＋ To Hero')}
            </button>
            <button class="btn-action btn-duplicate" data-duplicate="${p.id}" title="${adminLang === 'ar' ? 'نسخ هذا العطر كمنتج جديد' : 'Duplicate Product'}">${adminLang === 'ar' ? 'نسخ ⧉' : 'Duplicate ⧉'}</button>
            <button class="btn-action btn-edit" data-edit="${p.id}" title="${adminLang === 'ar' ? 'تعديل' : 'Edit'}">${adminLang === 'ar' ? 'تعديل ✎' : 'Edit ✎'}</button>
            <button class="btn-action btn-delete" data-del="${p.id}" title="${adminLang === 'ar' ? 'حذف' : 'Delete'}">${adminLang === 'ar' ? 'حذف 🗑' : 'Delete 🗑'}</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function loadProducts(isManual = false) {
    const refreshBtn = $('#refreshProdsBtn');
    if (refreshBtn && isManual) refreshBtn.classList.add('spinning');
    supaFetch('products', { filters: '&order=sort_order.asc,created_at.desc' })
      .then(rows => {
        if (Array.isArray(rows) && rows.length) {
          const fetchedIds = new Set(rows.map(r => String(r.id)));
          const remainingLocal = currentProducts.filter(p => !fetchedIds.has(String(p.id)));
          renderProductsTable([...rows, ...remainingLocal]);
        }
      })
      .catch(err => {
        console.warn('Admin products fetch notice:', err);
        // Table remains populated with instant local data
      })
      .finally(() => {
        if (refreshBtn) refreshBtn.classList.remove('spinning');
      });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  // ── Product Modal Controls ────────────────────────────────────────────────
  const prodModal   = $('#productModal');
  const prodForm    = $('#productForm');
  const modalTitle  = $('#modalProductTitle');
  const formStatus  = $('#prodFormStatus');
  const fileInput   = $('#prodFileInput');
  const dropzone    = $('#imageDropzone');
  const dropPrompt  = $('#dropzonePrompt');
  const manualImg   = $('#prodImageManual');
  const btnAddImageUrl = $('#btnAddImageUrl');
  const galleryGrid = $('#prodImagesGallery');
  const galleryCountBadge = $('#galleryCountBadge');

  let currentProductImages = [];
  let selectedImageFile = null;

  function showImagePreview(urlOrData) {
    if (!urlOrData) return;
    addImageToGallery(urlOrData);
  }

  function clearImagePreview() {
    currentProductImages = [];
    renderAdminGallery();
    if (fileInput) fileInput.value = '';
    if (manualImg) manualImg.value = '';
  }

  function renderAdminGallery() {
    if (!galleryGrid) return;
    if (galleryCountBadge) {
      galleryCountBadge.textContent = `${currentProductImages.length} ${adminLang === 'ar' ? 'صور' : 'images'}`;
    }

    if (currentProductImages.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; font-size: 11.5px; color: var(--admin-muted); padding: 16px 8px; border: 1.5px dashed var(--admin-line); border-radius: 8px;">
          📷 لا توجد صور مضافة بعد. اختر صوراً من جهازك أو الصق رابط صورة أعلاه أو اسحبها برابط العطر السحري.
        </div>
      `;
      if ($('#prodImage')) $('#prodImage').value = '';
      return;
    }

    if ($('#prodImage')) $('#prodImage').value = currentProductImages[0] || '';

    galleryGrid.innerHTML = currentProductImages.map((imgSrc, idx) => {
      const isPrimary = idx === 0;
      return `
        <div class="admin-gallery-card ${isPrimary ? 'is-primary' : ''}">
          ${isPrimary ? '<span class="admin-gallery-badge">⭐ الغلاف</span>' : ''}
          <img src="${escapeHtml(imgSrc)}" alt="صورة ${idx + 1}" loading="lazy">
          <div class="admin-gallery-actions">
            ${!isPrimary ? `<button type="button" class="btn-set-cover" data-idx="${idx}" title="تعيين كغلاف رئيسي">غلاف</button>` : '<span style="flex:1; text-align:center; font-size:9.5px; color:#d4af37; font-weight:700;">الرئيسية</span>'}
            <button type="button" class="btn-del-img" data-idx="${idx}" title="حذف الصورة">×</button>
          </div>
        </div>
      `;
    }).join('');

    // Wire Set Cover & Delete Buttons
    galleryGrid.querySelectorAll('.btn-set-cover').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (!isNaN(idx) && idx > 0 && idx < currentProductImages.length) {
          const item = currentProductImages.splice(idx, 1)[0];
          currentProductImages.unshift(item);
          renderAdminGallery();
        }
      });
    });

    galleryGrid.querySelectorAll('.btn-del-img').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (!isNaN(idx) && idx >= 0 && idx < currentProductImages.length) {
          currentProductImages.splice(idx, 1);
          renderAdminGallery();
        }
      });
    });
  }

  function addImageToGallery(url) {
    if (!url) return;
    const cleanUrl = String(url).trim();
    if (cleanUrl && !currentProductImages.includes(cleanUrl)) {
      currentProductImages.push(cleanUrl);
      selectedImageFile = null; // Clear file reference when adding via URL
      renderAdminGallery();
    }
  }

  // Handle Add Image URL button & Enter key
  btnAddImageUrl?.addEventListener('click', () => {
    const url = (manualImg?.value || '').trim();
    if (url) {
      addImageToGallery(url);
      if (manualImg) manualImg.value = '';
    }
  });

  manualImg?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = (manualImg.value || '').trim();
      if (url) {
        addImageToGallery(url);
        manualImg.value = '';
      }
    }
  });

  // Handle Dropzone Click & Drag
  dropzone?.addEventListener('click', () => {
    fileInput?.click();
  });

  async function processSelectedImageFiles(files) {
    if (!files || !files.length) return;
    const status = $('#prodFormStatus');
    if (status) {
      status.className = '';
      status.textContent = 'جاري معالجة ورفع الصور…';
    }

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        let uploadedUrl = '';
        try {
          const fileExt = file.name.split('.').pop().toLowerCase() || 'jpg';
          const cleanName = file.name.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_');
          const filePath = `rooh_${Date.now()}_${cleanName}.${fileExt}`;

          const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${filePath}`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON,
              'Authorization': `Bearer ${SUPABASE_ANON}`,
              'Content-Type': file.type || 'image/jpeg',
              'x-upsert': 'true',
            },
            body: file,
          });

          if (uploadRes.ok) {
            uploadedUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${filePath}`;
          } else {
            uploadedUrl = await compressImage(file);
          }
        } catch (_) {
          uploadedUrl = await compressImage(file);
        }

        if (uploadedUrl) {
          addImageToGallery(uploadedUrl);
        }
      } catch (err) {
        console.warn('Error processing image file:', err);
      }
    }

    if (status) {
      status.textContent = '';
    }
  }

  fileInput?.addEventListener('change', async () => {
    if (fileInput.files?.length) {
      selectedImageFile = fileInput.files[0];
      await processSelectedImageFiles(fileInput.files);
      fileInput.value = '';
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone?.addEventListener(eventName, e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone?.addEventListener(eventName, e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone?.addEventListener('drop', async e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer?.files;
    if (files && files.length) {
      await processSelectedImageFiles(files);
    }
  });

  function normalizeSearchText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '')
      .replace(/[^a-z0-9\u0621-\u064A\s]/gi, ' ')
      .trim();
  }

  const ADMIN_ACCORD_COLORS = {
    sweet:        { color: '#EC407A', en: 'Sweet', ar: 'حلو وسكري' },
    woody:        { color: '#8B5A2B', en: 'Woody', ar: 'خشبي دافئ' },
    vanilla:      { color: '#D4A373', en: 'Vanilla', ar: 'فانيليا ناعمة' },
    oriental:     { color: '#8E24AA', en: 'Oriental', ar: 'شرقي فاخر' },
    amber:        { color: '#C58F28', en: 'Amber', ar: 'عنبري دافئ' },
    spicy:        { color: '#E65100', en: 'Spicy', ar: 'توابل دافئة' },
    'warm spicy': { color: '#E65100', en: 'Warm Spicy', ar: 'توابل دافئة' },
    'fresh spicy':{ color: '#FF7043', en: 'Fresh Spicy', ar: 'توابل منعشة' },
    fresh:        { color: '#00ACC1', en: 'Fresh', ar: 'منعش ونقي' },
    floral:       { color: '#E91E63', en: 'Floral', ar: 'زهري راقي' },
    'white floral':{ color: '#F06292', en: 'White Floral', ar: 'زهور بيضاء' },
    powdery:      { color: '#78909C', en: 'Powdery', ar: 'بودري مخملي' },
    aromatic:     { color: '#43A047', en: 'Aromatic', ar: 'أروماتك' },
    citrus:       { color: '#FBC02D', en: 'Citrus', ar: 'حمضيات منعشة' },
    leather:      { color: '#5D4037', en: 'Leather', ar: 'جلود فاخرة' },
    musky:        { color: '#90A4AE', en: 'Musky', ar: 'مسكي ناعم' },
    fruity:       { color: '#FB8C00', en: 'Fruity', ar: 'فاكهي جذاب' },
    smoky:        { color: '#546E7A', en: 'Smoky', ar: 'دخاني وبخور' },
    aquatic:      { color: '#0288D1', en: 'Aquatic', ar: 'مائي صيفي' },
    oud:          { color: '#4A2C11', en: 'Oud', ar: 'عودي فاخر' },
    tobacco:      { color: '#795548', en: 'Tobacco', ar: 'تبغ دافئ' },
    earthy:       { color: '#6D4C41', en: 'Earthy', ar: 'ترابي وباتشولي' },
    balsamic:     { color: '#8D6E63', en: 'Balsamic', ar: 'بلسمي وراتنج' },
    caramel:      { color: '#FFA726', en: 'Caramel', ar: 'كراميل وعسل' },
  };

  function getAccordMeta(nameOrKey) {
    if (!nameOrKey) return { color: '#D4A373', en: '', ar: '' };
    const raw = String(nameOrKey).toLowerCase().trim();
    for (const k of Object.keys(ADMIN_ACCORD_COLORS)) {
      if (raw.includes(k) || ADMIN_ACCORD_COLORS[k].ar.includes(raw) || ADMIN_ACCORD_COLORS[k].en.toLowerCase().includes(raw)) {
        return ADMIN_ACCORD_COLORS[k];
      }
    }
    return { color: '#D4A373', en: nameOrKey, ar: nameOrKey };
  }

  let selectedAccords = [];
  function renderAdminAccordsChips(accords) {
    selectedAccords = Array.isArray(accords) ? [...accords] : [];
    const container = $('#adminAccordsChips');
    const hidden = $('#prodAccords');
    if (!container) return;

    if (!selectedAccords.length) {
      container.innerHTML = '<small style="color:var(--muted); font-size:12px;">لم يتم تحديد نغمات عطرية بعد. اختر من القائمة أعلاه لإضافتها للبصمة العطرية.</small>';
      if (hidden) hidden.value = '';
      return;
    }

    const currentMain = ($('#prodMainAccord')?.value || selectedAccords[0] || '').toLowerCase();

    container.innerHTML = selectedAccords.map((acc, idx) => {
      const meta = getAccordMeta(acc);
      const label = adminLang === 'ar' ? (meta.ar || acc) : (meta.en || acc);
      const isMain = acc.toLowerCase() === currentMain;
      return `
        <span class="admin-accord-chip ${isMain ? 'is-main' : ''}" style="${isMain ? 'border-color:var(--pink); background:rgba(245,165,173,0.22);' : ''}">
          <span class="accord-color-dot" style="background:${meta.color}"></span>
          <span>${escapeHtml(label)}</span>
          ${isMain ? '<small style="font-size:10px; opacity:0.85; margin:0 3px; color:var(--pink);">★ رئيسية</small>' : ''}
          <button type="button" class="chip-remove-btn" data-remove-accord="${idx}" title="حذف النغمة">×</button>
        </span>
      `;
    }).join('');

    if (hidden) hidden.value = selectedAccords.join(', ');
  }

  function renderAdminSeasonsChips(seasonsStr) {
    const raw = String(seasonsStr || '').toLowerCase();
    const container = $('#adminSeasonsChips');
    const hidden = $('#prodSeasons');
    if (!container) return;

    const activeList = [];
    container.querySelectorAll('.admin-chip-btn').forEach(btn => {
      const sKey = btn.dataset.season;
      const isAct = raw.includes(sKey);
      btn.classList.toggle('active', isAct);
      if (isAct) activeList.push(sKey);
    });

    if (hidden) hidden.value = activeList.join(',');
  }

  function unpackProductDetails(p) {
    if (!p) return {};
    let meta = {};
    if (p.notes && typeof p.notes === 'string' && (p.notes.trim().startsWith('{') || p.notes.trim().startsWith('['))) {
      try { meta = JSON.parse(p.notes); } catch (_) {}
    }
    return {
      brand:        p.brand || meta.brand || '',
      notes:        meta.desc !== undefined ? meta.desc : (p.notes || ''),
      top_notes:    p.top_notes || meta.top_notes || '',
      middle_notes: p.middle_notes || meta.middle_notes || '',
      base_notes:   p.base_notes || meta.base_notes || '',
      inspired_by:  p.inspired_by || meta.inspired_by || '',
      longevity:    p.longevity || meta.longevity || '3',
      sillage:      p.sillage || meta.sillage || '2',
      accords:      p.accords || meta.accords || '',
      main_accord:  p.main_accord || meta.main_accord || '',
      seasons:      p.seasons || meta.seasons || '',
      sale_price:   p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : (meta.sale_price !== undefined ? meta.sale_price : ''),
      discount_percent: p.discount_percent || meta.discount_percent || '',
      discount_badge:   p.discount_badge || meta.discount_badge || '',
      stock_quantity:   p.stock_quantity !== undefined && p.stock_quantity !== null ? p.stock_quantity : (meta.stock_quantity !== undefined && meta.stock_quantity !== null ? meta.stock_quantity : ''),
      cost_price:       p.cost_price !== undefined && p.cost_price !== null ? p.cost_price : (meta.cost_price !== undefined && meta.cost_price !== null ? meta.cost_price : ''),
      supplier_source:  p.supplier_source || meta.supplier_source || meta.supplier || 'المصدر 1',
      in_solar_system:  Boolean(p.in_solar_system !== undefined ? p.in_solar_system : meta.in_solar_system),
      images:           Array.isArray(p.images) && p.images.length ? p.images : (Array.isArray(meta.images) && meta.images.length ? meta.images : (p.image_url ? [p.image_url] : [])),
      sizes:            Array.isArray(p.sizes) && p.sizes.length ? p.sizes : (Array.isArray(meta.sizes) && meta.sizes.length ? meta.sizes : [])
    };
  }

  function renderAdminSizes(sizes = []) {
    const container = $('#adminSizesContainer');
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(sizes) || !sizes.length) return;
    sizes.forEach(s => {
      addAdminSizeRow(s.size || '', s.price || '', s.sale_price || '');
    });
  }

  function addAdminSizeRow(size = '', price = '', sale_price = '') {
    const container = $('#adminSizesContainer');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'admin-size-row';
    row.innerHTML = `
      <div class="size-col-name">
        <label>الحجم / السعة</label>
        <input type="text" class="size-name-input" placeholder="مثال: 100 مل" value="${escapeHtml(size)}">
      </div>
      <div class="size-col-price">
        <label>سعر البيع (ج.م) *</label>
        <input type="number" step="0.01" min="0" class="size-price-input" placeholder="مثال: 1600" value="${price !== '' && price !== null && price !== undefined ? price : ''}">
      </div>
      <div class="size-col-sale">
        <label>سعر الخصم <small style="opacity:.6">(اختياري)</small></label>
        <input type="number" step="0.01" min="0" class="size-sale-input" placeholder="مثال: 1350" value="${sale_price !== '' && sale_price !== null && sale_price !== undefined ? sale_price : ''}">
      </div>
      <button type="button" class="btn-remove-size" title="حذف هذا الحجم" aria-label="حذف">✕</button>
    `;
    row.querySelector('.btn-remove-size').addEventListener('click', () => {
      row.remove();
    });
    container.appendChild(row);
  }

  function syncDiscountFeedback() {
    const priceVal = parseFloat($('#prodPrice')?.value) || 0;
    const saleVal = parseFloat($('#prodSalePrice')?.value);
    const pctInp = $('#prodDiscountPercent');
    const feedback = $('#prodDiscountFeedback');

    if (priceVal > 0 && !isNaN(saleVal) && saleVal > 0 && saleVal < priceVal) {
      const saved = priceVal - saleVal;
      const pct = Math.round((saved / priceVal) * 100);
      if (pctInp && document.activeElement !== pctInp) pctInp.value = pct;
      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = `✓ السعر للعميل: <strong>${money(saleVal)}</strong> بدلاً من <del style="opacity:0.7;">${money(priceVal)}</del> (توفير <strong>${money(saved)}</strong> — خصم <strong>${pct}%</strong>)`;
      }
    } else {
      if (pctInp && document.activeElement !== pctInp) pctInp.value = '';
      if (feedback) {
        feedback.style.display = 'none';
        feedback.textContent = '';
      }
    }
  }

  function syncProfitFeedback() {
    const priceVal = parseFloat($('#prodPrice')?.value) || 0;
    const saleVal = parseFloat($('#prodSalePrice')?.value);
    const costVal = parseFloat($('#prodCostPrice')?.value) || 0;
    const activePrice = (!isNaN(saleVal) && saleVal > 0 && saleVal < priceVal) ? saleVal : priceVal;

    const summaryEl = $('#profitSummaryText');
    const hintEl = $('#profitFormulaHint');
    if (!summaryEl) return;

    if (costVal > 0 && activePrice > 0) {
      const profit = activePrice - costVal;
      const margin = ((profit / activePrice) * 100).toFixed(1);
      const isPositive = profit >= 0;
      summaryEl.style.color = isPositive ? '#2ecc71' : '#e74c3c';
      summaryEl.innerHTML = `صافي الربح المتوقع: <strong>${money(profit)}</strong> لكل زجاجة · هامش الربح: <strong>${arabicNum(margin)}%</strong> ${isPositive ? '📈' : '⚠️'}`;
      if (hintEl) hintEl.innerHTML = `(سعر البيع الفعلي ${money(activePrice)} − سعر الشراء ${money(costVal)})`;
    } else if (costVal > 0 && activePrice <= 0) {
      summaryEl.style.color = 'var(--admin-muted)';
      summaryEl.textContent = 'أدخل سعر البيع لحساب الربح المتوقع.';
    } else {
      summaryEl.style.color = 'var(--admin-muted)';
      summaryEl.textContent = 'أدخل سعر الشراء / التكلفة لحساب نسبة وصافي الربح تلقائياً.';
      if (hintEl) hintEl.textContent = '(سعر البيع الفعلي − سعر الشراء)';
    }
  }

  function openProductModal(product = null, isDuplicate = false) {
    prodForm.reset();
    formStatus.textContent = '';
    formStatus.className   = '';
    clearImagePreview();

    // Reset URL Importer inputs
    if ($('#perfumeUrlInput')) $('#perfumeUrlInput').value = '';
    if ($('#btnClearUrl')) $('#btnClearUrl').style.display = 'none';
    const sFeedback = $('#scrapeFeedback');
    if (sFeedback) {
      sFeedback.style.display = 'none';
      sFeedback.textContent = '';
      sFeedback.className = 'scrape-feedback';
    }

    const saleInp = $('#prodSalePrice');
    const badgeInp = $('#prodDiscountBadge');
    const pctInp = $('#prodDiscountPercent');
    const feedback = $('#prodDiscountFeedback');

    if (product) {
      const details = unpackProductDetails(product);
      if (isDuplicate) {
        modalTitle.innerHTML = `نسخ عطر: <em>${escapeHtml(product.name)}</em>`;
        $('#productId').value       = '';
        $('#saveProdBtn').innerHTML = 'حفظ كعطر جديد <span>←</span>';
      } else {
        modalTitle.innerHTML = `تعديل عطر: <em>${escapeHtml(product.name)}</em>`;
        $('#productId').value       = product.id;
        $('#saveProdBtn').innerHTML = 'حفظ التعديلات <span>←</span>';
      }
      $('#prodName').value        = product.name || '';
      $('#prodLatin').value       = product.latin || '';
      populateBrandSelects(details.brand || product.brand || '');
      $('#prodPrice').value       = product.price || '';
      $('#prodCategory').value    = product.category || 'unisex';
      $('#prodNotes').value       = details.notes;
      $('#prodImage').value       = product.image_url || '';
      if (manualImg) manualImg.value = '';
      currentProductImages = Array.isArray(details.images) && details.images.length
        ? [...details.images]
        : (product.image_url ? [product.image_url] : []);
      renderAdminGallery();
      $('#prodTag').value         = product.tag || '';
      $('#prodTopNotes').value    = details.top_notes;
      $('#prodMiddleNotes').value = details.middle_notes;
      $('#prodBaseNotes').value   = details.base_notes;
      $('#prodInspiredBy').value  = details.inspired_by;
      $('#prodLongevity').value   = details.longevity;
      $('#prodSillage').value     = details.sillage;
      $('#prodFeatured').checked  = Boolean(product.is_featured);
      $('#prodInStock').checked   = product.in_stock !== false;
      if ($('#prodStockQuantity')) {
        $('#prodStockQuantity').value = details.stock_quantity !== '' && details.stock_quantity !== undefined ? details.stock_quantity : '';
      }

      // Discount inputs
      if (saleInp) saleInp.value = details.sale_price || '';
      if (badgeInp) badgeInp.value = details.discount_badge || '';
      if ($('#prodCostPrice')) $('#prodCostPrice').value = details.cost_price !== '' && details.cost_price !== undefined ? details.cost_price : '';
      if ($('#prodSupplierSource')) $('#prodSupplierSource').value = details.supplier_source || 'المصدر 1';
      if ($('#prodBoxItems')) $('#prodBoxItems').value = details.box_items || product.box_items || '';
      if ($('#prodCustomBox')) $('#prodCustomBox').checked = Boolean(details.is_custom_box || product.is_custom_box);
      if ($('#prodExtraPrice')) $('#prodExtraPrice').value = (details.extra_item_price !== '' && details.extra_item_price !== undefined) ? details.extra_item_price : '';
      if ($('#prodMaxItems')) $('#prodMaxItems').value = details.max_box_items || product.max_box_items || '4';
      syncDiscountFeedback();
      syncProfitFeedback();

      // Multi-Sizes
      renderAdminSizes(details.sizes || []);

      // Scent DNA Accords & Main Accord
      let currentAccordsList = (details.accords || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
      const chosenMain = details.main_accord || currentAccordsList[0] || '';
      if ($('#prodMainAccord')) $('#prodMainAccord').value = chosenMain;
      renderAdminAccordsChips(currentAccordsList);

      // Seasons & Occasions
      const currentSeasons = (details.seasons || '').toLowerCase();
      renderAdminSeasonsChips(currentSeasons);
    } else {
      modalTitle.innerHTML = 'إضافة <em>عطر جديد</em>';
      $('#productId').value     = '';
      populateBrandSelects('');
      $('#prodCategory').value  = 'unisex';
      $('#prodLongevity').value = '3';
      $('#prodSillage').value   = '2';
      $('#prodInStock').checked  = true;
      if ($('#prodFeatured')) $('#prodFeatured').checked = false;
      if ($('#prodStockQuantity')) $('#prodStockQuantity').value = '';

      if (saleInp) saleInp.value = '';
      if (pctInp) pctInp.value = '';
      if (badgeInp) badgeInp.value = '';
      if ($('#prodCostPrice')) $('#prodCostPrice').value = '';
      if ($('#prodSupplierSource')) $('#prodSupplierSource').value = 'المصدر 1';
      if ($('#prodBoxItems')) $('#prodBoxItems').value = '';
      if ($('#prodCustomBox')) $('#prodCustomBox').checked = false;
      if ($('#prodExtraPrice')) $('#prodExtraPrice').value = '';
      if ($('#prodMaxItems')) $('#prodMaxItems').value = '4';
      if (feedback) feedback.style.display = 'none';
      syncProfitFeedback();

      // Multi-Sizes
      renderAdminSizes([]);

      if ($('#prodMainAccord')) $('#prodMainAccord').value = '';
      renderAdminAccordsChips([]);
      renderAdminSeasonsChips('');

      currentProductImages = [];
      renderAdminGallery();
      if (manualImg) manualImg.value = '';
      $('#saveProdBtn').innerHTML = 'إضافة العطر <span>←</span>';
    }

    prodModal.classList.add('open');
  }

  function closeProductModal() {
    prodModal.classList.remove('open');
    currentProductImages = [];
    renderAdminGallery();
  }

  // Scent DNA & Seasons Interactive Pickers in Admin Modal
  $('#prodMainAccord')?.addEventListener('change', e => {
    const mainVal = e.target.value;
    if (!mainVal) {
      renderAdminAccordsChips(selectedAccords);
      return;
    }
    const exists = selectedAccords.some(a => a.toLowerCase() === mainVal.toLowerCase());
    if (!exists) {
      selectedAccords.unshift(mainVal);
    } else {
      selectedAccords = [mainVal, ...selectedAccords.filter(a => a.toLowerCase() !== mainVal.toLowerCase())];
    }
    renderAdminAccordsChips(selectedAccords);
  });

  $('#prodAccordPicker')?.addEventListener('change', e => {
    const val = e.target.value;
    if (!val) return;
    const exists = selectedAccords.some(a => a.toLowerCase() === val.toLowerCase());
    if (!exists) {
      selectedAccords.push(val);
      if (!selectedAccords.length || !$('#prodMainAccord')?.value) {
        if ($('#prodMainAccord')) $('#prodMainAccord').value = val;
      }
      renderAdminAccordsChips(selectedAccords);
    }
    e.target.value = '';
  });

  $('#adminAccordsChips')?.addEventListener('click', e => {
    const removeBtn = e.target.closest('[data-remove-accord]');
    if (removeBtn) {
      const idx = parseInt(removeBtn.dataset.removeAccord);
      if (!isNaN(idx)) {
        const removed = selectedAccords[idx];
        selectedAccords.splice(idx, 1);
        if ($('#prodMainAccord')?.value && $('#prodMainAccord').value.toLowerCase() === removed.toLowerCase()) {
          if ($('#prodMainAccord')) $('#prodMainAccord').value = selectedAccords[0] || '';
        }
        renderAdminAccordsChips(selectedAccords);
      }
    }
  });

  $('#adminSeasonsChips')?.addEventListener('click', e => {
    const btn = e.target.closest('.admin-chip-btn');
    if (btn) {
      btn.classList.toggle('active');
      const activeList = [];
      $('#adminSeasonsChips').querySelectorAll('.admin-chip-btn.active').forEach(b => {
        activeList.push(b.dataset.season);
      });
      if ($('#prodSeasons')) $('#prodSeasons').value = activeList.join(',');
    }
  });

  $('#prodStockQuantity')?.addEventListener('input', e => {
    const val = e.target.value.trim();
    if (val !== '') {
      const num = parseInt(val);
      if (num <= 0) {
        if ($('#prodInStock')) $('#prodInStock').checked = false;
      } else {
        if ($('#prodInStock')) $('#prodInStock').checked = true;
      }
    }
  });

  $('#openAddProduct')?.addEventListener('click', () => openProductModal());
  $('#productModalClose')?.addEventListener('click', closeProductModal);
  $('#cancelProdBtn')?.addEventListener('click', closeProductModal);
  prodModal?.addEventListener('click', e => { if (e.target === prodModal) closeProductModal(); });

  // Multi-Sizes Admin Listeners
  $('#btnAddSizeRow')?.addEventListener('click', () => {
    addAdminSizeRow('', $('#prodPrice')?.value || '', $('#prodSalePrice')?.value || '');
  });
  document.querySelectorAll('.quick-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.presetSize;
      if (preset) addAdminSizeRow(preset, $('#prodPrice')?.value || '', $('#prodSalePrice')?.value || '');
    });
  });

  // ── 🪄 Magic URL Scent Extractor (سحب بيانات العطر عبر الرابط) ────────────
  const FAMOUS_PERFUME_NAMES_AR = {
    'sauvage': 'سوفاج',
    'baccarat rouge': 'باكارات روج 540',
    'baccarat rouge 540': 'باكارات روج 540',
    'angels share': 'أنجلز شير',
    'angels\' share': 'أنجلز شير',
    'bleu de chanel': 'بلو دي شانيل',
    'aventus': 'أفينتوس',
    'black phantom': 'بلاك فانتوم',
    'lost cherry': 'لوست شيري',
    'tobacco vanille': 'توباكو فانيلا',
    'ombre nomade': 'أومبري نوماد',
    'grand soir': 'جراند سوار',
    'layton': 'لايتون',
    'herod': 'هيرود',
    'naxos': 'ناكسوس',
    'erba pura': 'إربا بورا',
    'khamrah': 'خمرة',
    'club de nuit': 'كلوب دي نوي',
    'interlude': 'إنترلود',
    'reflection': 'رفلكشن',
    'delina': 'ديلينا',
    'libre': 'ليبر',
    'black opium': 'بلاك أوبيوم',
    'si': 'سي',
    'jadore': 'جادور',
    'j\'adore': 'جادور',
    'coco mademoiselle': 'كوكو مادموزيل',
    'alien': 'إيلين',
    'angel': 'أنجل',
    'good girl': 'جود جيرل',
    'oud wood': 'عود وود',
    'silver mountain water': 'سيلفر ماونتن ووتر',
    'green irish tweed': 'جرين أيريش تويد',
    'fabulous': 'فابيولوس',
    'fucking fabulous': 'فابيولوس',
    'soleil blanc': 'سولاي بلانك',
    'grey vetiver': 'جري فيتيفر',
    'bitter peach': 'بيتر بيتش',
    'invictus': 'إنفكتوس',
    'one million': 'ون مليون',
    '1 million': 'ون مليون',
    'le male': 'لو مال',
    'ultra male': 'ألترا مال',
    'stronger with you': 'سترونجر وذ يو',
    'acqua di gio': 'أكوا دي جيو',
    'eros': 'إيروس',
    'dylan blue': 'ديلان بلو',
    'allure homme sport': 'ألور هوم سبورت',
    'la nuit de lhomme': 'لا نوي دي لوم',
    'y edp': 'واي أو دو بارفان'
  };

  const FAMOUS_BRANDS_MAP = {
    'dior': { ar: 'ديور', en: 'Dior' },
    'chanel': { ar: 'شانيل', en: 'Chanel' },
    'tom ford': { ar: 'توم فورد', en: 'Tom Ford' },
    'creed': { ar: 'كريد', en: 'Creed' },
    'kilian': { ar: 'كيليان', en: 'Kilian' },
    'by kilian': { ar: 'كيليان', en: 'By Kilian' },
    'maison francis kurkdjian': { ar: 'ميزون فرانسيس كوركدجيان', en: 'Maison Francis Kurkdjian' },
    'parfums de marly': { ar: 'مارلي', en: 'Parfums de Marly' },
    'xerjoff': { ar: 'زيرجوف', en: 'Xerjoff' },
    'roja': { ar: 'روجا', en: 'Roja Parfums' },
    'roja dove': { ar: 'روجا', en: 'Roja Dove' },
    'amouage': { ar: 'أمواج', en: 'Amouage' },
    'initio': { ar: 'إنيشيو', en: 'Initio Parfums Prives' },
    'initio parfums prives': { ar: 'إنيشيو', en: 'Initio Parfums Prives' },
    'mancera': { ar: 'مانسيرا', en: 'Mancera' },
    'montale': { ar: 'مونتال', en: 'Montale' },
    'yves saint laurent': { ar: 'إيف سان لوران', en: 'Yves Saint Laurent' },
    'ysl': { ar: 'إيف سان لوران', en: 'Yves Saint Laurent' },
    'giorgio armani': { ar: 'جورجيو أرماني', en: 'Giorgio Armani' },
    'armani': { ar: 'جورجيو أرماني', en: 'Giorgio Armani' },
    'versace': { ar: 'فرزاتشي', en: 'Versace' },
    'prada': { ar: 'برادا', en: 'Prada' },
    'gucci': { ar: 'غوتشي', en: 'Gucci' },
    'lattafa': { ar: 'لطافة', en: 'Lattafa Perfumes' },
    'afnan': { ar: 'أفنان', en: 'Afnan' },
    'al haramain': { ar: 'الحرمين', en: 'Al Haramain' },
    'rasasi': { ar: 'الرصاصي', en: 'Rasasi' },
    'carolina herrera': { ar: 'كارولينا هيريرا', en: 'Carolina Herrera' },
    'jean paul gaultier': { ar: 'جان بول غوتييه', en: 'Jean Paul Gaultier' },
    'paco rabanne': { ar: 'باكو رابان', en: 'Paco Rabanne' },
    'le labo': { ar: 'لو لابو', en: 'Le Labo' },
    'byredo': { ar: 'بايريدو', en: 'Byredo' },
    'diptyque': { ar: 'ديبتيك', en: 'Diptyque' },
    'jo malone': { ar: 'جو مالون', en: 'Jo Malone London' }
  };

  async function handleScrapePerfumeUrl() {
    const input = $('#perfumeUrlInput');
    const feedback = $('#scrapeFeedback');
    const fetchBtn = $('#btnScrapeUrl');
    const rawUrl = (input?.value || '').trim();

    if (!rawUrl) {
      if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = 'scrape-feedback error';
        feedback.innerHTML = '<span>⚠️</span> رجاءً ضع رابط العطر أولاً (مثال: رابط من Fragrantica أو Parfumo أو غيرها).';
      }
      input?.focus();
      return;
    }

    if (fetchBtn) fetchBtn.classList.add('loading');

    // 0. Instant Luxury Fragrance Encyclopedia Fast Lookup (0ms, 100% accurate, bypasses all Cloudflare blocks!)
    const encMatch = window.PerfumeI18n?.lookupEncyclopedia(rawUrl);
    if (encMatch) {
      $('#prodName').value = encMatch.name_ar;
      $('#prodLatin').value = encMatch.name_en;
      $('#prodCategory').value = encMatch.category || 'unisex';
      populateBrandSelects(encMatch.brand_en || encMatch.brand_ar);
      $('#prodInspiredBy').value = `${encMatch.name_en} - ${encMatch.brand_en}`;
      $('#prodTopNotes').value = encMatch.top_notes;
      $('#prodMiddleNotes').value = encMatch.middle_notes;
      $('#prodBaseNotes').value = encMatch.base_notes;
      $('#prodNotes').value = encMatch.desc;
      $('#prodLongevity').value = encMatch.longevity || '4';
      $('#prodSillage').value = encMatch.sillage || '3';

      if (encMatch.accords && encMatch.accords.length) {
        renderAdminAccordsChips(encMatch.accords);
        if (encMatch.main_accord && $('#prodMainAccord')) {
          $('#prodMainAccord').value = encMatch.main_accord;
        }
      }

      // Try fetching high-res cover image via Microlink in background if URL is provided
      if (/^https?:\/\//i.test(rawUrl)) {
        try {
          const mlRes = await fetch('https://api.microlink.io?url=' + encodeURIComponent(rawUrl));
          if (mlRes.ok) {
            const mlJson = await mlRes.json();
            if (mlJson?.data?.image?.url) {
              $('#prodImage').value = mlJson.data.image.url;
              currentProductImages = [mlJson.data.image.url];
              renderAdminGallery();
            }
          }
        } catch (_) {}
      }

      if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = 'scrape-feedback success';
        feedback.innerHTML = `<span>✓</span> <strong>تم استيراد العطر بنجاح من موسوعة العطور الفاخرة!</strong> تم ملء الاسم، الهرم العطري، النوتات، والأكوردات بالكامل.`;
      }
      if (fetchBtn) fetchBtn.classList.remove('loading');
      $('#prodPrice')?.focus();
      return;
    }

    let isDirectText = false;
    let urlObj = null;
    if (!/^https?:\/\//i.test(rawUrl)) {
      isDirectText = true;
    } else {
      try {
        urlObj = new URL(rawUrl);
      } catch (_) {
        isDirectText = true;
      }
    }

    if (fetchBtn) fetchBtn.classList.add('loading');
    if (feedback) {
      feedback.style.display = 'flex';
      feedback.className = 'scrape-feedback info';
      feedback.innerHTML = isDirectText
        ? '<span>⏳</span> جاري تحليل النص واستخراج الهرم العطري والنوتات...'
        : '<span>⏳</span> جاري الاتصال وسحب بيانات العطر من الرابط وتحليل النوتات...';
    }

    // Check for internal ID parameter (?id=...) from Rou7 store
    if (urlObj) {
      let internalId = urlObj.searchParams.get('id');
      if (internalId) {
        let localProd = (currentProducts || []).find(p => String(p.id) === String(internalId));
        if (!localProd) {
          try {
            const fetchedRows = await supaFetch('products', { filters: `&id=eq.${encodeURIComponent(internalId)}` });
            if (fetchedRows && fetchedRows.length) localProd = fetchedRows[0];
          } catch (_) {}
        }
        if (localProd) {
          const details = unpackProductDetails(localProd);
          $('#prodName').value = localProd.name || '';
          $('#prodLatin').value = localProd.latin || '';
          $('#prodCategory').value = localProd.category || 'unisex';
          populateBrandSelects(details.brand || localProd.brand || '');
          $('#prodInspiredBy').value = details.inspired_by || '';
          $('#prodTopNotes').value = details.top_notes || '';
          $('#prodMiddleNotes').value = details.middle_notes || '';
          $('#prodBaseNotes').value = details.base_notes || '';
          $('#prodNotes').value = details.notes || '';
          $('#prodPrice').value = localProd.price || '';
          if (details.sale_price && $('#prodSalePrice')) $('#prodSalePrice').value = details.sale_price;
          if (details.cost_price && $('#prodCostPrice')) $('#prodCostPrice').value = details.cost_price;
          $('#prodLongevity').value = details.longevity || '4';
          $('#prodSillage').value = details.sillage || '3';

          let accordsList = (details.accords || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
          if (accordsList.length) {
            renderAdminAccordsChips(accordsList);
            if (details.main_accord && $('#prodMainAccord')) $('#prodMainAccord').value = details.main_accord;
          }

          currentProductImages = Array.isArray(details.images) && details.images.length
            ? [...details.images]
            : (localProd.image_url ? [localProd.image_url] : []);
          renderAdminGallery();

          if (feedback) {
            feedback.style.display = 'flex';
            feedback.className = 'scrape-feedback success';
            feedback.innerHTML = `<span>✓</span> <strong>تم سحب بيانات العطر بنجاح!</strong> تم استيراد النوتات، والصور، وكافة التفاصيل.`;
          }
          if (fetchBtn) fetchBtn.classList.remove('loading');
          $('#prodPrice')?.focus();
          return;
        }
      }
    }

    try {
      let pageText = isDirectText ? rawUrl : '';
      let microlinkData = null;

      if (!isDirectText && urlObj) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 14000);

        try {
          const jinaUrl = 'https://r.jina.ai/' + encodeURIComponent(rawUrl);
          const res = await fetch(jinaUrl, {
            signal: controller.signal,
            headers: { 'Accept': 'text/plain' }
          });
          if (res.ok) {
            pageText = await res.text();
          }
        } catch (jinaErr) {
          console.warn('Jina reader notice:', jinaErr);
        } finally {
          clearTimeout(timeoutId);
        }

        // Parallel query to Microlink API for high-res OG images and clean title fallback
        try {
          const mlRes = await fetch('https://api.microlink.io?url=' + encodeURIComponent(rawUrl));
          if (mlRes.ok) {
            const mlJson = await mlRes.json();
            if (mlJson && mlJson.data) {
              microlinkData = mlJson.data;
            }
          }
        } catch (mlErr) {
          console.warn('Microlink notice:', mlErr);
        }
      }

      if (!pageText && !microlinkData) {
        throw new Error('لم نتمكن من الوصول لصفحة الرابط (حماية من الموقع مثل Cloudflare). يمكنك نسخ نص صفحة العطر أو النوتات ولصقها هنا مباشرة وسيقوم النظام باستخراجها فوراً!');
      }

      // 1. Extract Title and Clean Name
      let extractedTitle = '';
      if (isDirectText) {
        // For direct text input, use the raw text as the title
        extractedTitle = rawUrl.trim();
      } else if (pageText) {
        const titleMatch = pageText.match(/Title:\s*(.+)/i);
        if (titleMatch) extractedTitle = titleMatch[1].trim();
      }
      if (!extractedTitle && microlinkData && microlinkData.title) {
        extractedTitle = microlinkData.title.trim();
      }

      let cleanName = extractedTitle
        .replace(/^Title:\s*/i, '')
        .replace(/\s*-\s*a fragrance for.*$/i, '')
        .replace(/\s*-\s*Fragrantica.*$/i, '')
        .replace(/\s*-\s*Parfumo.*$/i, '')
        .replace(/\s*\(Eau de Parfum\).*$/i, '')
        .replace(/\s*\(Eau de Toilette\).*$/i, '')
        .replace(/\s*\(Extrait de Parfum\).*$/i, '')
        .replace(/\s*cologne.*$/i, '')
        .replace(/\s*perfume.*$/i, '')
        .trim();

      // Detect Brand
      let detectedBrand = '';
      const textToSearchBrand = `${rawUrl} ${extractedTitle} ${cleanName}`.toLowerCase();
      for (const [brandKey, brandObj] of Object.entries(FAMOUS_BRANDS_MAP)) {
        if (textToSearchBrand.includes(brandKey)) {
          detectedBrand = brandObj.en;
          break;
        }
      }

      // If cleanName contains the brand, remove it for clean fragrance name
      if (detectedBrand) {
        const brandRegex = new RegExp(`\\b${detectedBrand}\\b`, 'i');
        const strippedName = cleanName.replace(brandRegex, '').replace(/\bby\b/i, '').replace(/\s+/g, ' ').trim();
        if (strippedName.length >= 2) {
          cleanName = strippedName;
        }
      }

      // Arabic Name Lookup
      let arabicName = '';
      const normCheck = cleanName.toLowerCase().replace(/['"’]/g, '').trim();
      for (const [k, arVal] of Object.entries(FAMOUS_PERFUME_NAMES_AR)) {
        if (normCheck === k || normCheck.includes(k)) {
          arabicName = arVal;
          break;
        }
      }
      if (!arabicName) {
        arabicName = cleanName;
      }

      // 2. Gender / Category
      let category = 'unisex';
      // For direct text input, use the raw text as the page text for note extraction
      const textToScan = isDirectText ? rawUrl : pageText;
      const catCheckText = (textToScan + ' ' + (microlinkData?.description || '')).toLowerCase();
      if (/for women and men|unisex/i.test(catCheckText)) {
        category = 'unisex';
      } else if (/for men|men 20\d\d|cologne for men/i.test(catCheckText)) {
        category = 'men';
      } else if (/for women|women 20\d\d|perfume for women/i.test(catCheckText)) {
        category = 'women';
      }

      // 3. Robust Multi-Pattern Notes Extraction
      let topNotesEn = '';
      let midNotesEn = '';
      let baseNotesEn = '';

      if (textToScan) {
        // 1. Sentence/paragraph match:
        // 'Top notes are Calabrian bergamot and Pepper; middle notes are ...; base notes are ...'
        // 'Top note is Citruses; middle note is Sea Notes; base notes are Cedar and Amber.'
        const paraMatch = textToScan.match(/(?:top|head)\s+notes?\s+(?:is|are|:)\s+([\s\S]*?)(?:\.\s|\.\n|\n\n|$)/i);
        if (paraMatch) {
          const rawAll = paraMatch[1];
          const parts = rawAll.split(/;\s*|\n+/);
          parts.forEach(part => {
            const p = part.trim();
            if (/(?:middle|heart)\s+notes?\s+(?:is|are|:)?/i.test(p)) {
              midNotesEn = p.replace(/^(?:and\s+)?(?:middle|heart)\s+notes?\s+(?:is|are|:)\s*/i, '').trim();
            } else if (/(?:base|bottom)\s+notes?\s+(?:is|are|:)?/i.test(p)) {
              baseNotesEn = p.replace(/^(?:and\s+)?(?:base|bottom)\s+notes?\s+(?:is|are|:)\s*/i, '').trim();
            } else if (!topNotesEn) {
              topNotesEn = p.replace(/^(?:and\s+)?(?:top|head)\s+notes?\s+(?:is|are|:)\s*/i, '').trim();
            }
          });
        }

        // Helper: extract notes from markdown sections
        function extractFromSection(headingRegex) {
          const m = textToScan.match(headingRegex);
          if (!m) return '';
          const section = m[1];
          const notes = [];
          const linkMatches = section.matchAll(/\[(?:!\[[^\]]*\]\([^)]*\)\s*)?([^\]\n]+)\]\(https?:\/\/[^\/]*fragrantica\.com\/notes\/[^)]+\)/gi);
          for (const lm of linkMatches) {
            const n = lm[1].replace(/^Image\s*\d+:?/i, '').replace(/[\[\]]/g, '').trim();
            if (n && !notes.includes(n) && !n.startsWith('http')) notes.push(n);
          }
          if (!notes.length) {
            const altMatches = section.matchAll(/!\[Image\s*\d*:\s*([^\]]+)\]/gi);
            for (const am of altMatches) {
              const n = am[1].trim();
              if (n && !notes.includes(n)) notes.push(n);
            }
          }
          return notes.join(', ');
        }

        // 2. Headings: '#### Top Notes', '#### Middle Notes', '#### Base Notes'
        if (!topNotesEn) topNotesEn = extractFromSection(/####\s*Top Notes\s*([\s\S]*?)(?=####|###|\n\s*\n\s*\n|Vote|$)/i);
        if (!midNotesEn) midNotesEn = extractFromSection(/####\s*(?:Middle|Heart) Notes\s*([\s\S]*?)(?=####|###|\n\s*\n\s*\n|Vote|$)/i);
        if (!baseNotesEn) baseNotesEn = extractFromSection(/####\s*Base Notes\s*([\s\S]*?)(?=####|###|\n\s*\n\s*\n|Vote|$)/i);

        // 3. Alternate line lists: 'Top notes: a, b', 'Middle notes: c, d', 'Base notes: e, f'
        if (!topNotesEn) {
          const m = textToScan.match(/(?:top|head)\s+notes?:\s*([^\n\.]+)/i);
          if (m) topNotesEn = m[1].trim();
        }
        if (!midNotesEn) {
          const m = textToScan.match(/(?:middle|heart)\s+notes?:\s*([^\n\.]+)/i);
          if (m) midNotesEn = m[1].trim();
        }
        if (!baseNotesEn) {
          const m = textToScan.match(/(?:base|bottom)\s+notes?:\s*([^\n\.]+)/i);
          if (m) baseNotesEn = m[1].trim();
        }

        // 4. Parfumo / general 'Fragrance Notes' list
        if (!topNotesEn && !midNotesEn && !baseNotesEn) {
          const fnMatch = textToScan.match(/(?:##\s*Fragrance Notes|##\s*Pyramid)[\s\S]*?([\s\S]*?)(?=##|###|\n\s*\n\s*\n|$)/i);
          if (fnMatch) {
            const notes = [];
            const pMatches = fnMatch[1].matchAll(/!\[Image\s*\d*:\s*([^\]]+)\]\([^)]+\)\s*([A-Za-z0-9\s'-]+)/gi);
            for (const pm of pMatches) {
              const n = pm[2].trim() || pm[1].trim();
              if (n && !notes.includes(n)) notes.push(n);
            }
            if (notes.length) {
              topNotesEn = notes.slice(0, Math.ceil(notes.length / 3)).join(', ');
              midNotesEn = notes.slice(Math.ceil(notes.length / 3), Math.ceil(notes.length * 2 / 3)).join(', ');
              baseNotesEn = notes.slice(Math.ceil(notes.length * 2 / 3)).join(', ');
            }
          }
        }

        // 5. 'Scent pyramid' format (Top / Heart / Base with time indicators)
        if (!topNotesEn || !midNotesEn || !baseNotesEn) {
          const pyrBlock = textToScan.match(/(?:scent\s+pyramid|olfactory\s+pyramid|الهرم العطري)[\s\S]*?(?=(?:scent\s+dna|performance|###|##|$))/i);
          const pArea = pyrBlock ? pyrBlock[0] : textToScan;

          if (!topNotesEn) {
            const tm = pArea.match(/(?:^|\n)\s*(?:▲\s*)?(?:Top|قمة العطر)(?:\s*\(Top\))?(?:\s*First\s*\d+\s*min)?\s*\n([\s\S]*?)(?=(?:\n\s*(?:■\s*)?(?:Heart|Middle|قلب العطر))|$)/i);
            if (tm) {
              topNotesEn = tm[1].replace(/First\s*\d+\s*min/gi, '').trim().split(/\n+/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean).join(', ');
            }
          }
          if (!midNotesEn) {
            const hm = pArea.match(/(?:^|\n)\s*(?:■\s*)?(?:Heart|Middle|قلب العطر)(?:\s*\(Heart\))?(?:\s*\d+\s*min[^\n]*)?\s*\n([\s\S]*?)(?=(?:\n\s*(?:◼\s*)?(?:Base|Bottom|قاعدة العطر))|$)/i);
            if (hm) {
              midNotesEn = hm[1].replace(/\d+\s*min\s*to\s*\d+\s*h/gi, '').trim().split(/\n+/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean).join(', ');
            }
          }
          if (!baseNotesEn) {
            const bm = pArea.match(/(?:^|\n)\s*(?:◼\s*)?(?:Base|Bottom|قاعدة العطر)(?:\s*\(Base\))?(?:\s*\d+\s*h[^\n]*)?\s*\n([\s\S]*?)(?=(?:\n\s*(?:###|##|Scent DNA|Performance))|$)/i);
            if (bm) {
              baseNotesEn = bm[1].replace(/\d+\s*h\s*and\s*more/gi, '').trim().split(/\n+/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean).join(', ');
            }
          }
        }
      }

      const cleanNotesStr = s => (s || '')
        .replace(/first\s*\d+\s*min/gi, '')
        .replace(/\d+\s*min\s*to\s*\d+\s*h/gi, '')
        .replace(/\d+\s*h\s*and\s*more/gi, '')
        .replace(/tap any note to learn how it smells/gi, '')
        .replace(/scent pyramid|olfactory pyramid|الهرم العطري/gi, '')
        .replace(/\s+and\s+/gi, ', ')
        .replace(/[\r\n]+/g, ', ')
        .replace(/[.;]+$/, '')
        .split(/[,،;|\n]+/)
        .map(x => x.trim().replace(/^[-*•]\s*/, ''))
        .filter(x => x && !/^(top|heart|base|middle|bottom|قمة|قلب|قاعدة)$/i.test(x))
        .join(', ')
        .trim();

      topNotesEn = cleanNotesStr(topNotesEn);
      midNotesEn = cleanNotesStr(midNotesEn);
      baseNotesEn = cleanNotesStr(baseNotesEn);

      let topNotesAr = window.PerfumeI18n ? window.PerfumeI18n.translateNotes(topNotesEn, 'ar') : topNotesEn;
      let midNotesAr = window.PerfumeI18n ? window.PerfumeI18n.translateNotes(midNotesEn, 'ar') : midNotesEn;
      let baseNotesAr = window.PerfumeI18n ? window.PerfumeI18n.translateNotes(baseNotesEn, 'ar') : baseNotesEn;

      // Guaranteed Scent Pyramid: If any note level is still empty, auto-extract via intelligent NLP or accord harmonics
      if (!topNotesAr || !midNotesAr || !baseNotesAr) {
        const smartPyr = window.PerfumeI18n?.extractSmartPyramid(textToScan || microlinkData?.description || cleanName, category);
        if (smartPyr) {
          if (!topNotesAr) topNotesAr = smartPyr.top;
          if (!midNotesAr) midNotesAr = smartPyr.heart;
          if (!baseNotesAr) baseNotesAr = smartPyr.base;
        }
      }

      // 4. Main Accords & Performance
      let accordsList = [];
      let scrapedLongevity = '4';
      let scrapedSillage = '3';
      if (textToScan) {
        const accordsMatch = textToScan.match(/(?:main accords|scent dna|الأكوردات)\s*\n+([\s\S]*?)(?=\n\s*\n|###|---|\*\*|Performance|$)/i);
        if (accordsMatch) {
          accordsList = accordsMatch[1].split(/\n+/).map(s => s.trim().replace(/^(?:[-*•]|built from[^\n]*)\s*/i, '')).filter(s => s && !s.toLowerCase().includes('built from') && !s.toLowerCase().includes('main accord')).slice(0, 5);
        }
        if (/beast mode|12\+|10\+|very long lasting/i.test(textToScan)) scrapedLongevity = '5';
        else if (/moderate/i.test(textToScan)) scrapedLongevity = '3';
        if (/beast mode|enormous|strong/i.test(textToScan)) scrapedSillage = '4';
      }

      // 5. Bottle Images Extraction (Cover + Secondary Photos)
      const scrapedImages = [];
      if (textToScan) {
        const thumbMatches = [...textToScan.matchAll(/!\[(?:[^\]]*)\]\((https:\/\/fimgs\.net\/mdimg\/perfume-thumbs\/(?:dark-)?375x500\.[^)]+)\)/gi)];
        for (const tm of thumbMatches) {
          if (!scrapedImages.includes(tm[1])) scrapedImages.push(tm[1]);
        }
        if (!scrapedImages.length) {
          const generalMatches = [...textToScan.matchAll(/!\[(?:[^\]]*)\]\((https:\/\/fimgs\.net\/mdimg\/(?:perfume-thumbs|perfume)\/[^)]+\.(?:jpg|jpeg|webp|png))\)/gi)];
          for (const gm of generalMatches) {
            if (!scrapedImages.includes(gm[1]) && !gm[1].includes('avatari') && !gm[1].includes('sastojci')) {
              scrapedImages.push(gm[1]);
            }
          }
        }
      }
      if (microlinkData && microlinkData.image && microlinkData.image.url) {
        if (!scrapedImages.includes(microlinkData.image.url)) {
          scrapedImages.unshift(microlinkData.image.url);
        }
      }

      const primaryCoverImg = scrapedImages[0] || '';
      if (scrapedImages.length) {
        currentProductImages = [...scrapedImages.slice(0, 5)];
        renderAdminGallery();
      }

      // 6. Description
      let descText = '';
      if (topNotesAr || midNotesAr || baseNotesAr) {
        descText = `عطر فاخر ومميز، يفتتح بنفحات منعشة من ${topNotesAr || 'الحمضيات والأزهار النضرة'}، يتوسطه قلب عطري ينبض بـ ${midNotesAr || 'التوابل الدافئة والأخشاب'}، ويرتكز على قاعدة أصيلة تدوم طويلاً من ${baseNotesAr || 'المسك الفاخر والعنبر'}.`;
      } else if (microlinkData && microlinkData.description) {
        descText = microlinkData.description.slice(0, 250);
      } else {
        descText = `عطر استثنائي يجمع بين الفخامة والجاذبية والثبات العالي، مصمم ليعبر عن حضورك الآسر في كل مناسبة.`;
      }

      // 7. Populate Form Fields
      $('#prodName').value = arabicName || cleanName;
      $('#prodLatin').value = cleanName;
      $('#prodCategory').value = category;

      // Brand matching or creation
      if (detectedBrand) {
        let bExists = currentBrands.find(b =>
          (b.name_en && b.name_en.toLowerCase() === detectedBrand.toLowerCase()) ||
          (b.name_ar && b.name_ar === detectedBrand) ||
          (b.id && b.id.toLowerCase() === detectedBrand.toLowerCase())
        );
        if (!bExists) {
          const brandObj = Object.values(FAMOUS_BRANDS_MAP).find(bo => bo.en.toLowerCase() === detectedBrand.toLowerCase()) || { ar: detectedBrand, en: detectedBrand };
          const newBrand = {
            id: detectedBrand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name_ar: brandObj.ar,
            name_en: brandObj.en,
            logo_url: ''
          };
          currentBrands.push(newBrand);
          try { localStorage.setItem('rooh-cached-brands', JSON.stringify(currentBrands)); } catch (_) {}
          renderBrandsTable();
        }
        populateBrandSelects(detectedBrand);
      }

      // Inspired By
      const inspiredText = detectedBrand ? `${cleanName} - ${detectedBrand}` : cleanName;
      $('#prodInspiredBy').value = inspiredText;

      // Pyramid Notes
      $('#prodTopNotes').value = topNotesAr;
      $('#prodMiddleNotes').value = midNotesAr;
      $('#prodBaseNotes').value = baseNotesAr;

      // Accords
      if (accordsList.length) {
        renderAdminAccordsChips(accordsList);
        const mainAccSelect = $('#prodMainAccord');
        if (mainAccSelect) {
          const firstAcc = accordsList[0].toLowerCase();
          for (let opt of mainAccSelect.options) {
            if (opt.value && firstAcc.includes(opt.value.toLowerCase())) {
              mainAccSelect.value = opt.value;
              break;
            }
          }
        }
      }

      // Image
      if (primaryCoverImg) {
        $('#prodImage').value = primaryCoverImg;
        if (manualImg) manualImg.value = '';
      }

      // Description
      $('#prodNotes').value = descText;

      // Longevity & Sillage
      $('#prodLongevity').value = scrapedLongevity;
      $('#prodSillage').value = scrapedSillage;

      // Feedback
      if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = 'scrape-feedback success';
        feedback.innerHTML = isDirectText
          ? `<span>✓</span> <strong>تم استخراج البيانات من النص بنجاح!</strong> تم ملء الاسم، الهرم العطري، النوتات، والأكوردات. ضع سعر البيع والتكلفة ثم اضغط حفظ.`
          : `<span>✓</span> <strong>تم سحب البيانات بنجاح!</strong> تم ملء الاسم، النوتات، الصورة، والوصف. ضع سعر البيع والتكلفة ثم اضغط حفظ.`;
      }

      $('#prodPrice')?.focus();

    } catch (err) {
      console.error('URL Scraper Error:', err);
      if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = 'scrape-feedback error';
        feedback.innerHTML = `<span>⚠️</span> تعذر سحب البيانات تلقائياً: ${escapeHtml(err.message || 'تأكد من صحة الرابط')}`;
      }
    } finally {
      if (fetchBtn) fetchBtn.classList.remove('loading');
    }
  }

  // URL Importer Event Handlers
  $('#btnScrapeUrl')?.addEventListener('click', handleScrapePerfumeUrl);
  $('#perfumeUrlInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScrapePerfumeUrl();
    }
  });
  $('#perfumeUrlInput')?.addEventListener('input', e => {
    const clearBtn = $('#btnClearUrl');
    if (clearBtn) clearBtn.style.display = e.target.value ? 'block' : 'none';
  });
  $('#btnClearUrl')?.addEventListener('click', () => {
    const input = $('#perfumeUrlInput');
    if (input) {
      input.value = '';
      input.focus();
    }
    const clearBtn = $('#btnClearUrl');
    if (clearBtn) clearBtn.style.display = 'none';
    const feedback = $('#scrapeFeedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.textContent = '';
      feedback.className = 'scrape-feedback';
    }
  });

  // Live sync between Price, Sale Price, Cost Price, and Discount Percent in product modal
  $('#prodCostPrice')?.addEventListener('input', () => syncProfitFeedback());
  $('#prodSalePrice')?.addEventListener('input', () => {
    syncDiscountFeedback();
    syncProfitFeedback();
  });
  $('#prodPrice')?.addEventListener('input', () => {
    if ($('#prodSalePrice')?.value) syncDiscountFeedback();
    syncProfitFeedback();
  });
  $('#prodDiscountPercent')?.addEventListener('input', () => {
    const pPrice = parseFloat($('#prodPrice')?.value) || 0;
    const pct = parseFloat($('#prodDiscountPercent')?.value);
    const saleInp = $('#prodSalePrice');
    if (pPrice > 0 && !isNaN(pct) && pct > 0 && pct < 100) {
      const sPrice = Math.round(pPrice * (1 - pct / 100));
      if (saleInp) saleInp.value = sPrice;
      syncDiscountFeedback();
      syncProfitFeedback();
    } else if (!pct) {
      if (saleInp) saleInp.value = '';
      syncDiscountFeedback();
      syncProfitFeedback();
    }
  });

  // Bulk Discount Handlers (Storewide)
  $('#btnApplyBulkDiscount')?.addEventListener('click', async () => {
    const rawPct = $('#storewideDiscountPercent')?.value;
    const pct = parseInt(rawPct) || 20;
    const targetProds = currentProducts.filter(p => !p.name.startsWith('__system_'));
    if (!targetProds.length) {
      alert('لا توجد عطور حالياً لتطبيق الخصم عليها.');
      return;
    }

    if (!confirm(`هل أنت متأكد من تطبيق خصم ${pct}% على أسعار جميع العطور الـ (${targetProds.length}) في المتجر فورياً؟`)) {
      return;
    }

    const btn = $('#btnApplyBulkDiscount');
    const prevText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'جاري تطبيق الخصم...';

    try {
      for (const p of targetProds) {
        const d = unpackProductDetails(p);
        const original = Number(p.price || 0);
        if (!original) continue;
        const salePrice = Math.round(original * (1 - pct / 100));
        const badge = `خصم ${pct}%`;

        p.sale_price = salePrice;
        p.discount_percent = pct;
        p.discount_badge = badge;

        const notesObj = {
          ...d,
          sale_price: salePrice,
          discount_percent: pct,
          discount_badge: badge
        };

        try {
          await supaFetch('products', {
            method: 'PATCH',
            filters: `&id=eq.${encodeURIComponent(p.id)}`,
            body: {
              sale_price: salePrice,
              discount_percent: pct,
              discount_badge: badge,
              notes: JSON.stringify(notesObj)
            }
          });
        } catch (_) {
          await supaFetch('products', {
            method: 'PATCH',
            filters: `&id=eq.${encodeURIComponent(p.id)}`,
            body: { notes: JSON.stringify(notesObj) }
          }).catch(() => {});
        }
      }

      localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts));
      renderProductsTable(currentProducts);
      alert(`تم تطبيق خصم ${pct}% بنجاح على جميع عطور المتجر!`);
    } catch (err) {
      alert('حدث خطأ أثناء تطبيق الخصم: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = prevText;
    }
  });

  $('#btnRemoveBulkDiscounts')?.addEventListener('click', async () => {
    const targetProds = currentProducts.filter(p => !p.name.startsWith('__system_'));
    if (!confirm('هل أنت متأكد من إزالة جميع الخصومات من كافة العطور واستعادة أسعارها الأصلية؟')) {
      return;
    }

    const btn = $('#btnRemoveBulkDiscounts');
    const prevText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'جاري إزالة الخصومات...';

    try {
      for (const p of targetProds) {
        const d = unpackProductDetails(p);
        p.sale_price = null;
        p.discount_percent = null;
        p.discount_badge = null;

        const notesObj = { ...d };
        delete notesObj.sale_price;
        delete notesObj.discount_percent;
        delete notesObj.discount_badge;

        try {
          await supaFetch('products', {
            method: 'PATCH',
            filters: `&id=eq.${encodeURIComponent(p.id)}`,
            body: {
              sale_price: null,
              discount_percent: null,
              discount_badge: null,
              notes: JSON.stringify(notesObj)
            }
          });
        } catch (_) {
          await supaFetch('products', {
            method: 'PATCH',
            filters: `&id=eq.${encodeURIComponent(p.id)}`,
            body: { notes: JSON.stringify(notesObj) }
          }).catch(() => {});
        }
      }

      localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts));
      renderProductsTable(currentProducts);
      alert('تمت إزالة جميع الخصومات بنجاح واستعادة الأسعار الأصلية لكافة العطور!');
    } catch (err) {
      alert('حدث خطأ أثناء إزالة الخصومات: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = prevText;
    }
  });

  // Handle Edit, Delete & Solar Orbit button clicks inside table
  $('#productsTable')?.addEventListener('click', async event => {
    const heroToggleBtn = event.target.closest('[data-toggle-hero]');
    if (heroToggleBtn) {
      const id = heroToggleBtn.dataset.toggleHero;
      const targetProduct = currentProducts.find(p => String(p.id) === String(id));
      if (!targetProduct) return;
      const willBeFeatured = !targetProduct.is_featured;

      // Exactly ONE product featured in the 3D Hero: feature this one and unfeature others
      currentProducts.forEach(p => {
        if (String(p.id) === String(id)) {
          p.is_featured = willBeFeatured;
        } else if (willBeFeatured) {
          p.is_featured = false;
        }
      });

      try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
      renderProductsTable();

      try {
        if (willBeFeatured) {
          await supaFetch('products', {
            method: 'PATCH',
            filters: `&id=neq.${encodeURIComponent(id)}`,
            body: { is_featured: false }
          }).catch(() => {});
        }
        await supaFetch('products', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: { is_featured: willBeFeatured }
        });
      } catch (err) {
        console.warn('Could not sync hero status to remote database:', err);
      }
      return;
    }

    const duplicateBtn = event.target.closest('[data-duplicate]');
    const editBtn = event.target.closest('[data-edit]');
    const delBtn  = event.target.closest('[data-del]');

    if (duplicateBtn) {
      const id = duplicateBtn.dataset.duplicate;
      const product = currentProducts.find(p => String(p.id) === String(id));
      if (product) {
        const cloned = JSON.parse(JSON.stringify(product));
        cloned.id = '';
        cloned.name = cloned.name ? `${cloned.name} (نسخة)` : '';
        if (cloned.latin) cloned.latin = `${cloned.latin} (Copy)`;
        openProductModal(cloned, true /* isDuplicate */);
      }
      return;
    }

    if (editBtn) {
      const id = editBtn.dataset.edit;
      const product = currentProducts.find(p => String(p.id) === String(id));
      if (product) openProductModal(product);
    }

    if (delBtn) {
      const id = delBtn.dataset.del;
      const product = currentProducts.find(p => String(p.id) === String(id));
      const prodName = product ? product.name : 'هذا العطر';

      if (!confirm(`هل أنت متأكد من حذف عطر "${prodName}" نهائياً من المتجر؟`)) {
        return;
      }

      delBtn.disabled = true;
      delBtn.textContent = 'جاري الحذف…';

      try {
        await supaFetch('products', {
          method: 'DELETE',
          filters: `&id=eq.${encodeURIComponent(id)}`,
        });
        // Optimistic local update
        currentProducts = currentProducts.filter(p => String(p.id) !== String(id));
        renderProductsTable(currentProducts);
      } catch (err) {
        alert('تعذر حذف العطر: ' + err.message);
        loadProducts();
      }
    }
  });

  // تصغير وضغط الصورة محلياً لتوفير مساحة التخزين والسرعة
  function compressImage(file, maxWidth = 800, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(ev.target.result);
        img.src = ev.target.result;
      };
      reader.onerror = () => reject(new Error('تعذر قراءة ملف الصورة'));
      reader.readAsDataURL(file);
    });
  }

  // Handle Form Submission (Add or Edit) with Image Upload
  prodForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const saveBtn = $('#saveProdBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'جاري الحفظ…';
    formStatus.textContent = '';
    formStatus.className = '';

    const id = $('#productId').value.trim();
    let imageUrl = currentProductImages[0] || $('#prodImage').value.trim() || manualImg?.value.trim() || null;

    // رفع الصورة إلى Supabase Storage إذا اختار المستخدم ملف من جهازه
    if (selectedImageFile) {
      saveBtn.textContent = 'جاري معالجة الصورة…';
      formStatus.className = '';
      formStatus.textContent = 'جاري رفع صورة العطر…';

      try {
        const fileExt = selectedImageFile.name.split('.').pop().toLowerCase() || 'jpg';
        const cleanName = selectedImageFile.name.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_');
        const filePath = `rooh_${Date.now()}_${cleanName}.${fileExt}`;

        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${filePath}`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'Content-Type': selectedImageFile.type || 'image/jpeg',
            'x-upsert': 'true',
          },
          body: selectedImageFile,
        });

        if (uploadRes.ok) {
          imageUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${filePath}`;
        } else {
          // إذا لم يكن الـ bucket مفعل، نضغط الصورة ونحفظها مباشرة في قاعدة البيانات
          console.warn('Storage bucket not ready, using compressed image fallback');
          imageUrl = await compressImage(selectedImageFile);
        }
      } catch (uploadErr) {
        console.warn('Storage upload fallback:', uploadErr);
        // Fallback: حفظ الصورة المضغوطة مباشرة
        imageUrl = await compressImage(selectedImageFile);
      }
    }

    const rawPrice = parseFloat($('#prodPrice').value) || 0;
    const rawSale = parseFloat($('#prodSalePrice')?.value);
    const validSalePrice = (!isNaN(rawSale) && rawSale > 0 && rawSale < rawPrice) ? rawSale : null;
    const rawCost = parseFloat($('#prodCostPrice')?.value);
    const costPrice = (!isNaN(rawCost) && rawCost >= 0) ? rawCost : null;
    const validBadge = $('#prodDiscountBadge')?.value.trim() || null;
    const validPercent = validSalePrice ? Math.round(((rawPrice - validSalePrice) / rawPrice) * 100) : null;
    const rawStock = $('#prodStockQuantity')?.value.trim();
    const stockQty = rawStock !== '' ? Math.max(0, parseInt(rawStock) || 0) : null;
    const inStockVal = stockQty !== null ? (stockQty > 0 && $('#prodInStock').checked) : $('#prodInStock').checked;

    const i18n = window.PerfumeI18n;
    const rawNotesVal = $('#prodNotes').value.trim() || '';
    const rawTopVal = $('#prodTopNotes').value.trim() || '';
    const rawMidVal = $('#prodMiddleNotes').value.trim() || '';
    const rawBaseVal = $('#prodBaseNotes').value.trim() || '';

    const autoDescAr = i18n ? i18n.translateDesc(rawNotesVal, 'ar', id, $('#prodName').value) : rawNotesVal;
    const autoDescEn = i18n ? i18n.translateDesc(rawNotesVal, 'en', id, $('#prodLatin').value || $('#prodName').value) : rawNotesVal;

    const autoTopAr = i18n ? i18n.translateNotes(rawTopVal, 'ar') : rawTopVal;
    const autoTopEn = i18n ? i18n.translateNotes(rawTopVal, 'en') : rawTopVal;
    const autoMidAr = i18n ? i18n.translateNotes(rawMidVal, 'ar') : rawMidVal;
    const autoMidEn = i18n ? i18n.translateNotes(rawMidVal, 'en') : rawMidVal;
    const autoBaseAr = i18n ? i18n.translateNotes(rawBaseVal, 'ar') : rawBaseVal;
    const autoBaseEn = i18n ? i18n.translateNotes(rawBaseVal, 'en') : rawBaseVal;

    // ── Category coercion ─────────────────────────────────────────────────────
    // The products table enforces a CHECK constraint (products_category_check)
    // that only allows: 'women', 'men', 'unisex'. The Gifts & Boxes category
    // is a storefront filter concept, not a DB category — gift boxes are
    // stored as regular products (with is_custom_box / box_items metadata).
    // Any unexpected or unsupported category value is normalized to 'unisex'
    // so the INSERT/PATCH never violates the check constraint.
    const VALID_CATEGORIES = ['women', 'men', 'unisex'];
    const rawCategory = $('#prodCategory').value;
    const category = VALID_CATEGORIES.includes(rawCategory) ? rawCategory : 'unisex';

    // Multi-Sizes collection
    const sizeRows = Array.from(document.querySelectorAll('#adminSizesContainer .admin-size-row'));
    const collectedSizes = sizeRows.map(row => {
      const sName = row.querySelector('.size-name-input')?.value.trim() || '';
      const sPrice = parseFloat(row.querySelector('.size-price-input')?.value) || 0;
      const sSale = parseFloat(row.querySelector('.size-sale-input')?.value);
      const validSale = (!isNaN(sSale) && sSale > 0 && sSale < sPrice) ? sSale : null;
      return { size: sName, price: sPrice, sale_price: validSale };
    }).filter(item => Boolean(item.size && item.price > 0));

    const payload = {
      name:        $('#prodName').value.trim(),
      latin:       $('#prodLatin').value.trim() || null,
      brand:       $('#prodBrand')?.value.trim() || null,
      price:       rawPrice,
      sale_price:  validSalePrice,
      cost_price:  costPrice,
      supplier_source: ($('#prodSupplierSource')?.value || 'المصدر 1'),
      discount_percent: validPercent,
      discount_badge:   validBadge,
      category:    category,
      notes:       rawNotesVal || null,
      image_url:   imageUrl,
      images:      currentProductImages,
      sizes:       collectedSizes,
      tag:         $('#prodTag').value.trim() || null,
      top_notes:   rawTopVal || null,
      middle_notes:rawMidVal || null,
      base_notes:  rawBaseVal || null,
      inspired_by: $('#prodInspiredBy').value.trim() || null,
      longevity:   parseInt($('#prodLongevity').value) || 3,
      sillage:     parseInt($('#prodSillage').value) || 2,
      accords:     $('#prodAccords')?.value.trim() || null,
      main_accord: $('#prodMainAccord')?.value || null,
      seasons:     $('#prodSeasons')?.value || null,
      is_featured: $('#prodFeatured').checked,
      in_stock:    inStockVal,
      stock_quantity: stockQty,
      box_items:   $('#prodBoxItems')?.value.trim() || null,
      is_custom_box: Boolean($('#prodCustomBox')?.checked),
      extra_item_price: parseFloat($('#prodExtraPrice')?.value) || 0,
      max_box_items: parseInt($('#prodMaxItems')?.value) || 4,
    };

    try {
      try {
        if (id) {
          // تحديث عطر موجود
          await supaFetch('products', {
            method: 'PATCH',
            filters: `&id=eq.${encodeURIComponent(id)}`,
            body: payload,
          });
        } else {
          // إضافة عطر جديد
          await supaFetch('products', {
            method: 'POST',
            body: payload,
          });
        }
      } catch (colErr) {
        // إذا لم تكن الأعمدة الجديدة مضافة في Supabase بعد، نحفظها كـ JSON داخل notes تلقائياً
        const errMsg = String(colErr?.message || '');
        if (errMsg.includes('column') || errMsg.includes('42703') || errMsg.includes('sizes') || errMsg.includes('cost_price') || errMsg.includes('top_notes') || errMsg.includes('brand') || errMsg.includes('main_accord') || errMsg.includes('seasons') || errMsg.includes('sale_price') || errMsg.includes('discount') || errMsg.includes('stock_quantity') || errMsg.includes('in_solar')) {
          console.warn('Columns not yet in Supabase schema, falling back to JSON notes:', colErr);
          const fallbackPayload = {
            name:        payload.name,
            latin:       payload.latin,
            price:       payload.price,
            category:    payload.category,
            image_url:   payload.image_url,
            tag:         payload.tag,
            is_featured: payload.is_featured,
            in_stock:    payload.in_stock,
            notes:       JSON.stringify({
              brand:        payload.brand,
              desc:         payload.notes || '',
              desc_ar:      autoDescAr,
              desc_en:      autoDescEn,
              top_notes:    payload.top_notes,
              top_notes_ar: autoTopAr,
              top_notes_en: autoTopEn,
              middle_notes: payload.middle_notes,
              middle_notes_ar: autoMidAr,
              middle_notes_en: autoMidEn,
              base_notes:   payload.base_notes,
              base_notes_ar: autoBaseAr,
              base_notes_en: autoBaseEn,
              inspired_by:  payload.inspired_by,
              longevity:    payload.longevity,
              sillage:      payload.sillage,
              accords:      payload.accords,
              main_accord:  payload.main_accord,
              seasons:      payload.seasons,
              sale_price:   payload.sale_price,
              cost_price:   costPrice,
              supplier_source: payload.supplier_source,
              discount_percent: payload.discount_percent,
              discount_badge: payload.discount_badge,
              stock_quantity: stockQty,
              in_solar_system: payload.in_solar_system,
              box_items:      payload.box_items,
              is_custom_box:  payload.is_custom_box,
              extra_item_price: payload.extra_item_price,
              max_box_items:  payload.max_box_items,
              sizes:          collectedSizes,
              images:         currentProductImages
            }),
          };
          if (id) {
            await supaFetch('products', {
              method: 'PATCH',
              filters: `&id=eq.${encodeURIComponent(id)}`,
              body: fallbackPayload,
            });
          } else {
            await supaFetch('products', {
              method: 'POST',
              body: fallbackPayload,
            });
          }
        } else {
          throw colErr;
        }
      }

      if (payload.is_featured) {
        if (id) {
          supaFetch('products', {
            method: 'PATCH',
            filters: `&id=neq.${encodeURIComponent(id)}`,
            body: { is_featured: false }
          }).catch(() => {});
        }
        currentProducts.forEach(p => {
          if (!id || String(p.id) !== String(id)) p.is_featured = false;
        });
      }

      formStatus.className = 'saved';
      formStatus.textContent = id ? 'تم حفظ التعديلات بنجاح ✓' : 'تم إضافة العطر بنجاح ✓';

      loadProducts();
      setTimeout(closeProductModal, 800);
    } catch (err) {
      console.error('Save product error:', err);
      formStatus.className = 'error';
      formStatus.textContent = 'خطأ أثناء الحفظ: ' + err.message;
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = id ? 'حفظ التعديلات <span>←</span>' : 'إضافة العطر <span>←</span>';
    }
  });

  // ── Order Details & Invoice Modal ─────────────────────────────────────────
  const orderDetailsModal = $('#orderDetailsModal');

  function openOrderInvoice(order) {
    if (!order) return;
    $('#modalOrderNumber').textContent = `#${order.order_number || ''}`;
    $('#modalOrderDate').textContent = `تاريخ الطلب: ${formatArabicDateTime(order.created_at)}`;
    $('#modalOrderName').textContent = order.customer_name || 'غير مسجل';
    $('#modalOrderPhone').textContent = order.phone || 'غير مسجل';
    $('#modalOrderAddress').textContent = order.address || 'لم يتم إدخال عنوان محدد';
    $('#modalOrderTotal').textContent = money(order.total || 0);

    const cleanPhone = cleanPhoneForWhatsApp(order.phone);
    const waBtn = $('#modalOrderWaBtn');
    if (waBtn) {
      if (cleanPhone) {
        const waMsg = encodeURIComponent(`مرحباً أستاذ ${order.customer_name || ''}، معك فريق رُوح بخصوص طلبك رقم ${order.order_number}`);
        waBtn.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waMsg}`;
        waBtn.style.display = 'inline-flex';
      } else {
        waBtn.style.display = 'none';
      }
    }

    const itemsList = parseOrderItems(order.items);
    $('#modalOrderItemsTable').innerHTML = itemsList.length ? itemsList.map(it => {
      const price = Number(it.price || 0);
      const qty = Number(it.qty || 1);
      const rowTotal = price * qty;
      return `<tr>
        <td><strong>${escapeHtml(it.name || 'عطر رُوح')}</strong></td>
        <td>${arabicNum(qty)}</td>
        <td>${money(price)}</td>
        <td><strong>${money(rowTotal)}</strong></td>
      </tr>`;
    }).join('') : '<tr><td colspan="4" class="empty-table">لا توجد تفاصيل للعطور</td></tr>';

    orderDetailsModal?.classList.add('open');
  }

  function closeOrderModal() {
    orderDetailsModal?.classList.remove('open');
  }

  $('#orderModalClose')?.addEventListener('click', closeOrderModal);
  $('#closeInvoiceBtn')?.addEventListener('click', closeOrderModal);
  $('#printInvoiceBtn')?.addEventListener('click', () => window.print());
  orderDetailsModal?.addEventListener('click', e => {
    if (e.target === orderDetailsModal) closeOrderModal();
  });

  // Handle Order Status Changes
  $('#ordersTable')?.addEventListener('change', async event => {
    const select = event.target.closest('.status-select');
    if (!select) return;
    const id = select.dataset.statusId;
    const newStatus = select.value;
    const previousClass = select.className;

    select.className = `status-select ${newStatus}`;
    select.disabled = true;

    try {
      orderStatusMap[id] = newStatus;
      const order = currentOrders.find(o => String(o.id) === String(id));
      if (order) order.status = newStatus;
      try { localStorage.setItem('rooh-cached-orders', JSON.stringify(currentOrders)); } catch (_) {}

      await persistOrdersMeta();

      try {
        await supaFetch('orders', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: { status: newStatus },
        });
      } catch (_) {}
    } catch (err) {
      console.warn('Status change notice:', err);
    } finally {
      select.disabled = false;
    }
  });

  // Handle Order View Details & Delete
  $('#ordersTable')?.addEventListener('click', async event => {
    const viewBtn = event.target.closest('[data-view-order]');
    const delBtn  = event.target.closest('[data-del-order]');

    if (viewBtn) {
      const id = viewBtn.dataset.viewOrder;
      const order = currentOrders.find(o => String(o.id) === String(id));
      if (order) openOrderInvoice(order);
    }

    if (delBtn) {
      const id = delBtn.dataset.delOrder;
      const order = currentOrders.find(o => String(o.id) === String(id));
      const orderNum = order ? order.order_number : '';

      if (!confirm(`هل أنت متأكد من حذف الطلب رقم "${orderNum}" نهائياً؟`)) {
        return;
      }

      delBtn.disabled = true;
      delBtn.textContent = 'جاري الحذف…';

      try {
        deletedOrderIds.add(String(id));
        currentOrders = currentOrders.filter(o => String(o.id) !== String(id));
        renderOrders(currentOrders);

        await persistOrdersMeta();

        try {
          await supaFetch('orders', {
            method: 'DELETE',
            filters: `&id=eq.${encodeURIComponent(id)}`,
          });
        } catch (_) {}
      } catch (err) {
        console.warn('Delete order notice:', err);
      }
    }
  });

  // ── Brand Management Module ──────────────────────────────────────────────
  const brandModal = $('#brandModal');
  const brandForm = $('#brandForm');
  const modalBrandTitle = $('#modalBrandTitle');
  const brandFormStatus = $('#brandFormStatus');
  let selectedBrandLogoFile = null;

  function findBrandObject(val) {
    if (!val) return null;
    const s = String(val).toLowerCase().trim();
    return currentBrands.find(b =>
      (b.id && b.id.toLowerCase() === s) ||
      (b.name_en && b.name_en.toLowerCase().trim() === s) ||
      (b.name_ar && b.name_ar.toLowerCase().trim() === s) ||
      (b.name_ar && s.includes(b.name_ar.toLowerCase().trim())) ||
      (b.name_en && s.includes(b.name_en.toLowerCase().trim()))
    );
  }

  function populateBrandSelects(selectedBrandVal = '') {
    const prodBrandSel = $('#prodBrand');
    if (prodBrandSel) {
      const currentSelected = selectedBrandVal || prodBrandSel.value || '';
      let opts = `<option value="">${adminLang === 'ar' ? '-- اختر البراند --' : '-- Select Brand --'}</option>`;
      let hasMatch = false;

      currentBrands.forEach(b => {
        const val = b.name_en || b.name_ar;
        const isSel = (currentSelected && (
          currentSelected.toLowerCase() === val.toLowerCase() ||
          currentSelected.toLowerCase() === b.name_ar.toLowerCase() ||
          currentSelected.toLowerCase() === (b.id || '').toLowerCase()
        ));
        if (isSel) hasMatch = true;
        opts += `<option value="${escapeHtml(val)}" ${isSel ? 'selected' : ''}>${escapeHtml(b.name_ar)} · ${escapeHtml(b.name_en)}</option>`;
      });

      if (currentSelected && !hasMatch) {
        opts += `<option value="${escapeHtml(currentSelected)}" selected>${escapeHtml(currentSelected)}</option>`;
      }
      prodBrandSel.innerHTML = opts;
    }

    const adminBrandFilter = $('#adminBrandFilter');
    if (adminBrandFilter) {
      const prevFilter = adminBrandFilter.value || 'all';
      let fOpts = `<option value="all">${adminLang === 'ar' ? 'كل البراندات' : 'All Brands'}</option>`;
      currentBrands.forEach(b => {
        const val = b.name_en || b.name_ar;
        const isSel = prevFilter.toLowerCase() === val.toLowerCase() || prevFilter.toLowerCase() === b.name_ar.toLowerCase();
        fOpts += `<option value="${escapeHtml(val)}" ${isSel ? 'selected' : ''}>${escapeHtml(b.name_ar)} · ${escapeHtml(b.name_en)}</option>`;
      });
      adminBrandFilter.innerHTML = fOpts;
    }
  }

  function renderBrandsTable() {
    const tableBody = $('#brandsTable');
    const badge = $('#brandBadge');
    if (badge) badge.textContent = arabicNum(currentBrands.length);

    if (!tableBody) return;

    if (!currentBrands.length) {
      tableBody.innerHTML = `<tr><td colspan="6" class="empty-table">${adminLang === 'ar' ? 'لا توجد ماركات مسجلة حالياً.' : 'No brands registered yet.'}</td></tr>`;
      return;
    }

    tableBody.innerHTML = currentBrands.map(b => {
      const count = currentProducts.filter(p => {
        const d = unpackProductDetails(p);
        const bObj = findBrandObject(p.brand || d.brand);
        return (bObj && bObj.id === b.id) ||
               (p.brand && (p.brand.toLowerCase() === b.name_en.toLowerCase() || p.brand.toLowerCase() === b.name_ar.toLowerCase())) ||
               (d.brand && (d.brand.toLowerCase() === b.name_en.toLowerCase() || d.brand.toLowerCase() === b.name_ar.toLowerCase()));
      }).length;

      const logoHtml = b.logo_url
        ? `<img src="${escapeHtml(b.logo_url)}" alt="${escapeHtml(b.name_en)}" class="brand-table-logo" style="width:40px;height:40px;object-fit:contain;background:rgba(255,255,255,0.04);border-radius:6px;border:1px solid var(--line);padding:3px;">`
        : `<span style="font-size:22px;display:grid;place-items:center;width:40px;height:40px;background:rgba(255,255,255,0.04);border-radius:6px;border:1px solid var(--line);">🏷️</span>`;

      return `
        <tr>
          <td>${logoHtml}</td>
          <td><strong>${escapeHtml(b.name_ar)}</strong></td>
          <td><span style="color:var(--muted);font-size:12px;">${escapeHtml(b.name_en)}</span></td>
          <td><span class="badge" style="background:rgba(245,165,173,0.15);color:var(--pink);font-weight:600;">${arabicNum(count)} ${adminLang === 'ar' ? 'عطر' : 'perfumes'}</span></td>
          <td><code style="font-size:11px;color:var(--muted);">${escapeHtml(b.id)}</code></td>
          <td>
            <div style="display:flex;gap:6px;align-items:center;">
              <button class="btn-icon" data-edit-brand="${escapeHtml(b.id)}" title="${adminLang === 'ar' ? 'تعديل البراند' : 'Edit Brand'}">✏️</button>
              <button class="btn-icon" data-del-brand="${escapeHtml(b.id)}" title="${adminLang === 'ar' ? 'حذف البراند' : 'Delete Brand'}" style="color:#ff6b6b;">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function saveBrandsToSupa(brandsList) {
    currentBrands = brandsList;
    try { localStorage.setItem('rooh-cached-brands', JSON.stringify(brandsList)); } catch (_) {}
    renderBrandsTable();
    populateBrandSelects();
    if (currentProducts && currentProducts.length) renderProductsTable(currentProducts);

    if (!SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      try {
        const updated = await supaFetch('products', {
          method: 'PATCH',
          filters: '&name=eq.__system_brands__',
          body: {
            notes: JSON.stringify(brandsList),
            in_stock: false,
            price: 0,
            category: 'unisex'
          }
        });
        if (!updated || !updated.length) {
          await supaFetch('products', {
            method: 'POST',
            body: {
              name: '__system_brands__',
              category: 'unisex',
              price: 0,
              in_stock: false,
              notes: JSON.stringify(brandsList)
            }
          });
        }
      } catch (err) {
        console.warn('Error saving brands to Supabase:', err);
      }
    }
  }

  function loadBrandsFromSupa(isManual = false) {
    const refreshBtn = $('#refreshBrandsBtn');
    if (refreshBtn && isManual) refreshBtn.classList.add('spinning');

    supaFetch('products', { filters: '&name=eq.__system_brands__' })
      .then(rows => {
        if (rows && rows.length && rows[0].notes) {
          try {
            const data = JSON.parse(rows[0].notes);
            if (Array.isArray(data) && data.length) {
              currentBrands = data;
              try { localStorage.setItem('rooh-cached-brands', JSON.stringify(data)); } catch (_) {}
              renderBrandsTable();
              populateBrandSelects();
              if (currentProducts && currentProducts.length) renderProductsTable(currentProducts);
            }
          } catch (e) {
            console.warn('Error parsing __system_brands__:', e);
          }
        } else if (!rows || !rows.length) {
          saveBrandsToSupa(DEFAULT_BRANDS);
        }
      })
      .catch(err => console.warn('Supabase brands fetch error:', err))
      .finally(() => {
        if (refreshBtn) refreshBtn.classList.remove('spinning');
      });
  }

  function openBrandModal(brandObj = null) {
    if (!brandForm) return;
    brandForm.reset();
    selectedBrandLogoFile = null;
    const previewWrap = $('#brandLogoPreviewWrap');
    const previewImg = $('#brandLogoPreview');
    if (brandFormStatus) { brandFormStatus.textContent = ''; brandFormStatus.className = ''; }

    if (brandObj) {
      if (modalBrandTitle) modalBrandTitle.innerHTML = adminLang === 'ar' ? 'تعديل <em>البراند</em>' : 'Edit <em>Brand</em>';
      $('#brandId').value = brandObj.id;
      $('#brandNameAr').value = brandObj.name_ar || '';
      $('#brandNameEn').value = brandObj.name_en || '';
      $('#brandLogoUrl').value = brandObj.logo_url || '';
      $('#brandDesc').value = brandObj.description || '';

      if (brandObj.logo_url && previewWrap && previewImg) {
        previewImg.src = brandObj.logo_url;
        previewWrap.style.display = 'flex';
      } else if (previewWrap) {
        previewWrap.style.display = 'none';
      }
    } else {
      if (modalBrandTitle) modalBrandTitle.innerHTML = adminLang === 'ar' ? 'إضافة <em>براند جديد</em>' : 'Add <em>New Brand</em>';
      $('#brandId').value = '';
      if (previewWrap) previewWrap.style.display = 'none';
    }
    brandModal?.classList.add('open');
  }

  function closeBrandModal() {
    brandModal?.classList.remove('open');
    selectedBrandLogoFile = null;
    if (brandFormStatus) { brandFormStatus.textContent = ''; brandFormStatus.className = ''; }
  }

  $('#brandLogoFile')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      selectedBrandLogoFile = file;
      const previewWrap = $('#brandLogoPreviewWrap');
      const previewImg = $('#brandLogoPreview');
      if (previewWrap && previewImg) {
        previewImg.src = URL.createObjectURL(file);
        previewWrap.style.display = 'flex';
      }
    }
  });

  $('#brandLogoUrl')?.addEventListener('input', e => {
    const val = e.target.value.trim();
    const previewWrap = $('#brandLogoPreviewWrap');
    const previewImg = $('#brandLogoPreview');
    if (val && previewWrap && previewImg) {
      previewImg.src = val;
      previewWrap.style.display = 'flex';
    } else if (!selectedBrandLogoFile && previewWrap) {
      previewWrap.style.display = 'none';
    }
  });

  brandForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const saveBtn = $('#saveBrandBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = adminLang === 'ar' ? 'جاري الحفظ…' : 'Saving...';

    try {
      const id = $('#brandId').value.trim();
      const nameAr = $('#brandNameAr').value.trim();
      const nameEn = $('#brandNameEn').value.trim();
      let logoUrl = $('#brandLogoUrl').value.trim() || '';
      const description = $('#brandDesc').value.trim();

      if (selectedBrandLogoFile) {
        saveBtn.textContent = adminLang === 'ar' ? 'جاري رفع الشعار…' : 'Uploading logo...';
        try {
          const fileExt = selectedBrandLogoFile.name.split('.').pop() || 'png';
          const cleanName = nameEn.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'brand';
          const filePath = `brand_${Date.now()}_${cleanName}.${fileExt}`;
          const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${filePath}`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON,
              'Authorization': `Bearer ${SUPABASE_ANON}`,
              'Content-Type': selectedBrandLogoFile.type || 'image/png'
            },
            body: selectedBrandLogoFile
          });
          if (uploadRes.ok) {
            logoUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${filePath}`;
          } else {
            logoUrl = await compressImage(selectedBrandLogoFile, 400, 0.85);
          }
        } catch (_) {
          logoUrl = await compressImage(selectedBrandLogoFile, 400, 0.85);
        }
      }

      const generatedId = id || (nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-') || `brand-${Date.now()}`);

      if (id) {
        const idx = currentBrands.findIndex(b => b.id === id);
        if (idx !== -1) {
          currentBrands[idx] = {
            ...currentBrands[idx],
            name_ar: nameAr,
            name_en: nameEn,
            logo_url: logoUrl,
            description
          };
        }
      } else {
        currentBrands.push({
          id: generatedId,
          name_ar: nameAr,
          name_en: nameEn,
          logo_url: logoUrl,
          description,
          created_at: new Date().toISOString()
        });
      }

      await saveBrandsToSupa(currentBrands);

      if (brandFormStatus) {
        brandFormStatus.className = 'saved';
        brandFormStatus.textContent = adminLang === 'ar' ? 'تم حفظ البراند بنجاح! ✓' : 'Brand saved successfully! ✓';
      }

      setTimeout(() => {
        closeBrandModal();
        saveBtn.disabled = false;
        saveBtn.innerHTML = (adminLang === 'ar' ? 'حفظ البراند' : 'Save Brand') + ' <span>←</span>';
        populateBrandSelects(nameEn || nameAr);
      }, 500);

    } catch (err) {
      if (brandFormStatus) {
        brandFormStatus.className = 'error';
        brandFormStatus.textContent = err.message;
      }
      saveBtn.disabled = false;
      saveBtn.innerHTML = (adminLang === 'ar' ? 'حفظ البراند' : 'Save Brand') + ' <span>←</span>';
    }
  });

  $('#openAddBrand')?.addEventListener('click', () => openBrandModal());
  $('#brandModalClose')?.addEventListener('click', closeBrandModal);
  $('#cancelBrandBtn')?.addEventListener('click', closeBrandModal);
  $('#quickAddBrandBtn')?.addEventListener('click', () => openBrandModal());
  $('#refreshBrandsBtn')?.addEventListener('click', () => loadBrandsFromSupa(true));

  // Quick Brand Edit from Product Form
  $('#quickEditBrandBtn')?.addEventListener('click', () => {
    const selVal = $('#prodBrand')?.value || '';
    if (!selVal) {
      alert(adminLang === 'ar' ? 'يرجى اختيار براند من القائمة أولاً لتعديله.' : 'Please select a brand from the list first to edit.');
      return;
    }
    const bObj = findBrandObject(selVal);
    if (bObj) {
      openBrandModal(bObj);
    } else {
      alert(adminLang === 'ar' ? `تعذر العثور على بيانات البراند "${selVal}".` : `Brand "${selVal}" not found.`);
    }
  });

  // Quick Brand Delete from Product Form
  $('#quickDeleteBrandBtn')?.addEventListener('click', async () => {
    const selVal = $('#prodBrand')?.value || '';
    if (!selVal) {
      alert(adminLang === 'ar' ? 'يرجى اختيار براند من القائمة أولاً لحذفه.' : 'Please select a brand from the list first to delete.');
      return;
    }
    const bObj = findBrandObject(selVal);
    const bName = bObj ? (adminLang === 'en' ? (bObj.name_en || bObj.name_ar) : (bObj.name_ar || bObj.name_en)) : selVal;
    if (confirm(adminLang === 'ar' ? `هل أنت متأكد من حذف براند "${bName}" نهائياً من المتجر؟` : `Are you sure you want to permanently delete brand "${bName}"?`)) {
      if (bObj) {
        currentBrands = currentBrands.filter(b => b.id !== bObj.id && b.name_en !== bObj.name_en && b.name_ar !== bObj.name_ar);
      } else {
        currentBrands = currentBrands.filter(b => b.name_en.toLowerCase() !== selVal.toLowerCase() && b.name_ar.toLowerCase() !== selVal.toLowerCase());
      }
      await saveBrandsToSupa(currentBrands);
      populateBrandSelects('');
      renderBrandsTable();
      const pBrand = $('#prodBrand');
      if (pBrand) pBrand.value = '';
      alert(adminLang === 'ar' ? `تم حذف براند "${bName}" بنجاح!` : `Brand "${bName}" deleted successfully!`);
    }
  });

  // Auto-translate Description to Arabic
  $('#btnTranslateDescAr')?.addEventListener('click', () => {
    const notesEl = $('#prodNotes');
    if (!notesEl || !notesEl.value.trim()) {
      alert(adminLang === 'ar' ? 'يرجى كتابة وصف للعطر أولاً لترجمته.' : 'Please enter a description first to translate.');
      return;
    }
    const i18n = window.PerfumeI18n;
    if (i18n) {
      const prodName = $('#prodName')?.value || '';
      const prodId = $('#productId')?.value || '';
      const translated = i18n.translateDesc(notesEl.value, 'ar', prodId, prodName);
      if (translated) {
        notesEl.value = translated;
        const btn = $('#btnTranslateDescAr');
        const prev = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> تم التعريب';
        setTimeout(() => { btn.innerHTML = prev; }, 1800);
      }
    }
  });

  // Auto-translate Description to English
  $('#btnTranslateDescEn')?.addEventListener('click', () => {
    const notesEl = $('#prodNotes');
    if (!notesEl || !notesEl.value.trim()) {
      alert(adminLang === 'ar' ? 'يرجى كتابة وصف للعطر أولاً لترجمته.' : 'Please enter a description first to translate.');
      return;
    }
    const i18n = window.PerfumeI18n;
    if (i18n) {
      const prodName = $('#prodName')?.value || $('#prodLatin')?.value || '';
      const prodId = $('#productId')?.value || '';
      const translated = i18n.translateDesc(notesEl.value, 'en', prodId, prodName);
      if (translated) {
        notesEl.value = translated;
        const btn = $('#btnTranslateDescEn');
        const prev = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> Translated';
        setTimeout(() => { btn.innerHTML = prev; }, 1800);
      }
    }
  });

  // Auto-translate All Notes (Top, Heart, Base)
  $('#btnTranslateNotesAll')?.addEventListener('click', () => {
    const topInp = $('#prodTopNotes');
    const midInp = $('#prodMiddleNotes');
    const baseInp = $('#prodBaseNotes');
    const i18n = window.PerfumeI18n;
    if (!i18n) return;

    const sample = (topInp?.value || '') + (midInp?.value || '') + (baseInp?.value || '');
    if (!sample.trim()) {
      alert(adminLang === 'ar' ? 'يرجى إدخال نوتات القمة أو القلب أو القاعدة لترجمتها.' : 'Please enter notes to translate.');
      return;
    }

    const hasEnglish = /[a-zA-Z]/.test(sample);
    const targetLang = hasEnglish ? 'ar' : 'en';

    if (topInp && topInp.value) topInp.value = i18n.translateNotes(topInp.value, targetLang);
    if (midInp && midInp.value) midInp.value = i18n.translateNotes(midInp.value, targetLang);
    if (baseInp && baseInp.value) baseInp.value = i18n.translateNotes(baseInp.value, targetLang);

    const btn = $('#btnTranslateNotesAll');
    const prev = btn.innerHTML;
    btn.innerHTML = targetLang === 'ar' ? '<span>✓</span> تم تعريب النوتات' : '<span>✓</span> Notes Translated';
    setTimeout(() => { btn.innerHTML = prev; }, 1800);
  });

  // Auto-Suggest Harmonious Scent Pyramid
  $('#btnAutoSuggestPyramid')?.addEventListener('click', () => {
    const mainAcc = $('#prodMainAccord')?.value || '';
    const cat = $('#prodCategory')?.value || '';
    const i18n = window.PerfumeI18n;
    if (!i18n) return;

    const suggested = i18n.suggestPyramidByAccord(mainAcc || cat);
    const topInp = $('#prodTopNotes');
    const midInp = $('#prodMiddleNotes');
    const baseInp = $('#prodBaseNotes');

    if (topInp) topInp.value = suggested.top;
    if (midInp) midInp.value = suggested.heart;
    if (baseInp) baseInp.value = suggested.base;

    const btn = $('#btnAutoSuggestPyramid');
    if (btn) {
      const prev = btn.innerHTML;
      btn.innerHTML = '<span>✓</span> تم توليد الهرم العطري';
      setTimeout(() => { btn.innerHTML = prev; }, 1800);
    }
  });

  // Quick Note Chips Click Delegation
  document.addEventListener('click', e => {
    const chip = e.target.closest('.quick-note-chip');
    if (!chip) return;
    const container = chip.closest('.quick-note-chips');
    const targetId = container?.dataset?.target;
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;

    const noteText = chip.textContent.replace(/^\+\s*/, '').trim();
    const curVal = input.value.trim();
    if (!curVal) {
      input.value = noteText;
    } else {
      const items = curVal.split(/[,،]+/).map(s => s.trim()).filter(Boolean);
      if (!items.includes(noteText)) {
        input.value = curVal + '، ' + noteText;
      }
    }
    input.focus();
  });

  $('#brandsTable')?.addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-brand]');
    const delBtn = e.target.closest('[data-del-brand]');
    if (editBtn) {
      const bId = editBtn.dataset.editBrand;
      const bObj = currentBrands.find(b => b.id === bId);
      if (bObj) openBrandModal(bObj);
    }
    if (delBtn) {
      const bId = delBtn.dataset.delBrand;
      const bObj = currentBrands.find(b => b.id === bId);
      const bName = bObj ? (adminLang === 'en' ? bObj.name_en : bObj.name_ar) : bId;
      if (confirm(adminLang === 'ar' ? `هل أنت متأكد من حذف براند "${bName}"؟` : `Are you sure you want to delete brand "${bName}"?`)) {
        currentBrands = currentBrands.filter(b => b.id !== bId);
        saveBrandsToSupa(currentBrands);
      }
    }
  });

  // ── Manual Refresh & Search / Filter Listeners ───────────────────────────
  $('#refreshProdsBtn')?.addEventListener('click', () => loadProducts(true));
  $('#refreshOrdersBtn')?.addEventListener('click', () => loadOrders(true));
  $('#refreshSalesBtn')?.addEventListener('click', () => {
    loadOrders(true);
    calculateSalesAnalytics();
  });
  $('#adminProdSearch')?.addEventListener('input', () => renderProductsTable());
  $('#adminCatFilter')?.addEventListener('change', () => {
    isHeroQuickActive = $('#adminCatFilter')?.value === '__featured__';
    const btn = $('#btnFeaturedQuickFilter') || $('#btnSolarQuickFilter');
    btn?.classList.toggle('active', isHeroQuickActive);
    renderProductsTable();
  });
  $('#adminBrandFilter')?.addEventListener('change', () => renderProductsTable());
  ($('#btnFeaturedQuickFilter') || $('#btnSolarQuickFilter'))?.addEventListener('click', () => {
    isHeroQuickActive = !isHeroQuickActive;
    const btn = $('#btnFeaturedQuickFilter') || $('#btnSolarQuickFilter');
    btn?.classList.toggle('active', isHeroQuickActive);
    const catSel = $('#adminCatFilter');
    if (catSel) catSel.value = isHeroQuickActive ? '__featured__' : 'all';
    renderProductsTable();
  });

  // ── Sales Time Filter Buttons Listener ────────────────────────────────────
  $('#salesTimeFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('.btn-time-filter');
    if (!btn) return;
    $('#salesTimeFilters').querySelectorAll('.btn-time-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calculateSalesAnalytics(btn.dataset.range);
  });

  // ── Admin Views & Tab Routing Engine (صفحات الداشبورد المستقلة) ────────────
  const ADMIN_PANEL_IDS = ['products-panel', 'brands-panel', 'campaign', 'homepage-panel', 'orders', 'inventory-panel', 'sales-panel', 'traffic-panel'];

  function switchAdminView(targetHash) {
    const rawHash = (targetHash !== undefined ? targetHash : (window.location.hash || '#overview')).trim();
    const cleanHash = (rawHash.startsWith('#') ? rawHash.slice(1) : rawHash).toLowerCase() || 'overview';

    // Update active class on sidebar links
    document.querySelectorAll('.admin-sidebar .side-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const linkHash = href.slice(1).toLowerCase();
        link.classList.toggle('selected', linkHash === cleanHash || (cleanHash === 'overview' && linkHash === 'overview'));
      }
    });

    const welcomeEl = document.querySelector('.welcome');
    const statsGrid = document.querySelector('.stats-grid');
    const topTitle = document.getElementById('adminTopTitle');

    const TITLES_MAP = {
      'overview': adminLang === 'ar' ? 'نظرة عامة' : 'Overview',
      'products-panel': adminLang === 'ar' ? 'إدارة العطور' : 'Fragrances',
      'brands-panel': adminLang === 'ar' ? 'إدارة البراندات' : 'Brands',
      'campaign': adminLang === 'ar' ? 'عطر اليوم والخصومات' : 'Daily Spotlight & Discounts',
      'homepage-panel': adminLang === 'ar' ? 'تنسيق الصفحة الرئيسية' : 'Homepage Layout',
      'orders': adminLang === 'ar' ? 'إدارة الطلبات' : 'Orders',
      'inventory-panel': adminLang === 'ar' ? 'إدارة المخزون' : 'Inventory',
      'sales-panel': adminLang === 'ar' ? 'تقارير المبيعات والأرباح' : 'Sales Analytics',
      'traffic-panel': adminLang === 'ar' ? 'تحليلات الزيارات' : 'Traffic Analytics'
    };
    if (topTitle) topTitle.textContent = TITLES_MAP[cleanHash] || (adminLang === 'ar' ? 'لوحة الإدارة' : 'Dashboard');

    if (cleanHash === 'overview') {
      if (welcomeEl) welcomeEl.style.display = '';
      if (statsGrid) statsGrid.style.display = '';
      ADMIN_PANEL_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
      });
    } else {
      // In dedicated view (e.g. Sales Page, Orders, Products, Brands, Campaign, Inventory)
      if (welcomeEl) welcomeEl.style.display = 'none';
      if (statsGrid) statsGrid.style.display = 'none';
      ADMIN_PANEL_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.display = (id.toLowerCase() === cleanHash) ? 'block' : 'none';
        }
      });
      if (cleanHash === 'sales-panel') {
        calculateSalesAnalytics();
      } else if (cleanHash === 'traffic-panel') {
        calculateTrafficAnalytics();
      } else if (cleanHash === 'inventory-panel') {
        renderInventoryPanel();
      }
    }
  }

  window.addEventListener('hashchange', () => switchAdminView());
  switchAdminView();

  // ── Immediate Cache Render (0ms Instant Load) ─────────────────────────────
  if (currentProducts.length) {
    renderProductsTable(currentProducts);
    renderInventoryPanel();
  }
  if (currentOrders.length) renderOrders(currentOrders);
  calculateSalesAnalytics('all');
  calculateTrafficAnalytics('all');
  renderBrandsTable();
  populateBrandSelects();

  // ── Background Revalidation from Supabase ─────────────────────────────────
  loadOrders();
  loadProducts();
  loadBrandsFromSupa();

  // ── Realtime Setup via Supabase Client (Non-blocking) ─────────────────────
  function initAdminRealtime() {
    if (!window.supabase) return;
    try {
      const supaClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      supaClient.channel('admin-realtime-feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
          console.log('Realtime product change:', payload);
          loadProducts();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          console.log('Realtime order change:', payload);
          loadOrders();
        })
        .subscribe((status) => {
          console.log('Realtime status:', status);
        });
    } catch (err) {
      console.warn('Realtime initialization error:', err);
    }
  }

  if (window.supabase) {
    initAdminRealtime();
  } else {
    window.addEventListener('load', () => {
      let tries = 0;
      const t = setInterval(() => {
        if (window.supabase) {
          clearInterval(t);
          initAdminRealtime();
        } else if (++tries > 12) {
          clearInterval(t);
        }
      }, 500);
    });
  }
  // ── Traffic Analytics ────────────────────────────────────────────────

  function getLocalTrafficEvents() {
    try {
      return JSON.parse(localStorage.getItem('rooh-traffic-events') || '[]');
    } catch (e) {
      return [];
    }
  }

  function filterEventsByRange(events, range) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (range === 'today') {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      return events.filter(e => new Date(e.timestamp).getTime() >= todayStart);
    } else if (range === 'week') {
      const weekStart = now - (7 * dayMs);
      return events.filter(e => new Date(e.timestamp).getTime() >= weekStart);
    } else if (range === 'month') {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      return events.filter(e => new Date(e.timestamp).getTime() >= monthStart);
    }
    return events;
  }

  function calculateTrafficAnalytics(range) {
    if (!range) range = trafficTimeRange;
    trafficTimeRange = range;

    const events = getLocalTrafficEvents();
    const filtered = filterEventsByRange(events, range);

    // Unique visitors by session_id
    const uniqueSessions = new Set(filtered.map(e => e.session_id)).size;

    // Event counts
    const pageViews = filtered.filter(e => e.event_type === 'page_view').length;
    const productViews = filtered.filter(e => e.event_type === 'product_view').length;
    const checkoutViews = filtered.filter(e => e.event_type === 'checkout_visit').length;
    const addToCarts = filtered.filter(e => e.event_type === 'add_to_cart').length;
    const ordersPlaced = filtered.filter(e => e.event_type === 'order_placed').length;

    // Conversion rate
    const conversionRate = uniqueSessions > 0 ? ((ordersPlaced / uniqueSessions) * 100).toFixed(2) : 0;

    // Render KPIs
    const kpiTotalViews = $('#kpiTotalViews');
    const kpiViewsSub = $('#kpiViewsSub');
    const kpiUniqueVisitors = $('#kpiUniqueVisitors');
    const kpiVisitorsSub = $('#kpiVisitorsSub');
    const kpiProductViews = $('#kpiProductViews');
    const kpiProductViewsSub = $('#kpiProductViewsSub');
    const kpiCheckoutViews = $('#kpiCheckoutViews');
    const kpiCheckoutSub = $('#kpiCheckoutSub');
    const kpiCompletedOrders = $('#kpiCompletedOrders');
    const kpiOrdersSub = $('#kpiOrdersSub');
    const kpiConversionRate = $('#kpiConversionRate');
    const kpiCrSub = $('#kpiCrSub');

    if (kpiTotalViews) kpiTotalViews.textContent = arabicNum(pageViews);
    if (kpiViewsSub) kpiViewsSub.textContent = 'مشاهدات الصفحات';
    if (kpiUniqueVisitors) kpiUniqueVisitors.textContent = arabicNum(uniqueSessions);
    if (kpiVisitorsSub) kpiVisitorsSub.textContent = 'جلسات فريدة';
    if (kpiProductViews) kpiProductViews.textContent = arabicNum(productViews);
    if (kpiProductViewsSub) kpiProductViewsSub.textContent = 'دخول لصفحات العطور';
    if (kpiCheckoutViews) kpiCheckoutViews.textContent = arabicNum(checkoutViews);
    if (kpiCheckoutSub) kpiCheckoutSub.textContent = 'وصلوا لل Checkout';
    if (kpiCompletedOrders) kpiCompletedOrders.textContent = arabicNum(ordersPlaced);
    if (kpiOrdersSub) kpiOrdersSub.textContent = 'تمت بنجاح';
    if (kpiConversionRate) kpiConversionRate.textContent = arabicNum(conversionRate) + '%';
    if (kpiCrSub) kpiCrSub.textContent = 'من زيارة لطلب';

    // Top Pages
    const pageMap = new Map();
    filtered.filter(e => e.event_type === 'page_view').forEach(e => {
      const path = e.path || '/';
      if (!pageMap.has(path)) {
        pageMap.set(path, { views: 0, sessions: new Set(), totalTime: 0, bounces: 0 });
      }
      const p = pageMap.get(path);
      p.views++;
      p.sessions.add(e.session_id);
    });

    // Calculate bounce rate (simplified: sessions with only 1 page view)
    const sessionPageCounts = new Map();
    filtered.filter(e => e.event_type === 'page_view').forEach(e => {
      const key = e.session_id;
      sessionPageCounts.set(key, (sessionPageCounts.get(key) || 0) + 1);
    });
    const bouncedSessions = Array.from(sessionPageCounts.values()).filter(c => c === 1).length;
    const totalSessionsForBounce = sessionPageCounts.size;
    const bounceRate = totalSessionsForBounce > 0 ? ((bouncedSessions / totalSessionsForBounce) * 100).toFixed(1) : 0;

    const sortedPages = Array.from(pageMap.entries())
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 10);

    const topPagesBody = $('#topPagesBody');
    if (topPagesBody) {
      if (!sortedPages.length) {
        topPagesBody.innerHTML = `<tr><td colspan="5" class="empty-table">${adminLang === 'ar' ? 'لا توجد بيانات صفحات في هذه الفترة.' : 'No page data for this period.'}</td></tr>`;
      } else {
        topPagesBody.innerHTML = sortedPages.map(([path, data]) => {
          const pageBounce = totalSessionsForBounce > 0 ? ((data.sessions.size > 0 ? 0 : 0)) : 0;
          return `
            <tr>
              <td><code style="font-size:11px;">${escapeHtml(path)}</code></td>
              <td><strong>${arabicNum(data.views)}</strong></td>
              <td>${arabicNum(data.sessions.size)}</td>
              <td><span style="color:var(--admin-muted);">—</span></td>
              <td><span class="stock-tag ${bounceRate > 50 ? 'out' : 'in'}" style="font-size:11px;">${arabicNum(bounceRate)}%</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Top Products Traffic
    const productMap = new Map();
    filtered.filter(e => e.event_type === 'product_view').forEach(e => {
      const pid = e.product_id || 'unknown';
      const name = e.product_name || 'عطر غير معروف';
      const price = e.product_price || 0;
      if (!productMap.has(pid)) {
        productMap.set(pid, { name, views: 0, addToCarts: 0, orders: 0 });
      }
      productMap.get(pid).views++;
    });
    filtered.filter(e => e.event_type === 'add_to_cart').forEach(e => {
      const pid = e.product_id || 'unknown';
      if (productMap.has(pid)) {
        productMap.get(pid).addToCarts++;
      }
    });
    filtered.filter(e => e.event_type === 'order_placed').forEach(e => {
      if (e.items && Array.isArray(e.items)) {
        e.items.forEach(item => {
          const pid = item.id || 'unknown';
          if (productMap.has(pid)) {
            productMap.get(pid).orders++;
          }
        });
      }
    });

    const sortedProducts = Array.from(productMap.entries())
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 10);

    const topProductsBody = $('#topProductsTrafficBody');
    if (topProductsBody) {
      if (!sortedProducts.length) {
        topProductsBody.innerHTML = `<tr><td colspan="4" class="empty-table">${adminLang === 'ar' ? 'لا توجد بيانات منتجات في هذه الفترة.' : 'No product data for this period.'}</td></tr>`;
      } else {
        topProductsBody.innerHTML = sortedProducts.map(([pid, data]) => {
          const cr = data.views > 0 ? ((data.orders / data.views) * 100).toFixed(1) : 0;
          return `
            <tr>
              <td><strong>${escapeHtml(data.name)}</strong></td>
              <td>${arabicNum(data.views)}</td>
              <td>${arabicNum(data.addToCarts)}</td>
              <td><span class="stock-tag in" style="font-size:11px;">${arabicNum(cr)}%</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Geographic Breakdown
    const countryMap = new Map();
    filtered.forEach(e => {
      const country = e.country || 'unknown';
      if (!countryMap.has(country)) {
        countryMap.set(country, { visits: 0, sessions: new Set() });
      }
      countryMap.get(country).visits++;
      countryMap.get(country).sessions.add(e.session_id);
    });

    const sortedCountries = Array.from(countryMap.entries())
      .sort((a, b) => b[1].visits - a[1].visits)
      .slice(0, 8);

    const geoWrap = $('#geoBreakdown');
    if (geoWrap) {
      if (!sortedCountries.length) {
        geoWrap.innerHTML = '<small style="color:var(--admin-muted);">لا توجد بيانات جغرافية</small>';
      } else {
        const totalVisits = filtered.length || 1;
        geoWrap.innerHTML = sortedCountries.map(([country, data]) => {
          const pct = Math.round((data.visits / totalVisits) * 100);
          return `
            <div style="margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px;">
                <span>${escapeHtml(country)}</span>
                <strong>${arabicNum(data.visits)} (${arabicNum(pct)}%)</strong>
              </div>
              <div style="height:5px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
                <div style="width:${pct}%; height:100%; background:var(--pink); border-radius:3px;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Recent Visitors (last 50 sessions with details)
    const sessionDetails = new Map();
    filtered.forEach(e => {
      const sid = e.session_id;
      if (!sessionDetails.has(sid)) {
        sessionDetails.set(sid, {
          firstSeen: e.timestamp,
          lastSeen: e.timestamp,
          ip: e.ip || 'unknown',
          country: e.country || 'unknown',
          city: e.city || 'unknown',
          pages: new Set(),
          products: new Set(),
          checkoutVisit: false,
          orderPlaced: false,
          referrer: e.referrer || 'direct'
        });
      }
      const s = sessionDetails.get(sid);
      if (new Date(e.timestamp) < new Date(s.firstSeen)) s.firstSeen = e.timestamp;
      if (new Date(e.timestamp) > new Date(s.lastSeen)) s.lastSeen = e.timestamp;
      if (e.path) s.pages.add(e.path);
      if (e.product_name) s.products.add(e.product_name);
      if (e.event_type === 'checkout_visit') s.checkoutVisit = true;
      if (e.event_type === 'order_placed') s.orderPlaced = true;
    });

    const sortedVisitors = Array.from(sessionDetails.entries())
      .sort((a, b) => new Date(b[1].lastSeen) - new Date(a[1].lastSeen))
      .slice(0, 50);

    const recentBody = $('#recentVisitorsBody');
    if (recentBody) {
      if (!sortedVisitors.length) {
        recentBody.innerHTML = `<tr><td colspan="7" class="empty-table">${adminLang === 'ar' ? 'لا توجد بيانات زوار في هذه الفترة.' : 'No visitor data for this period.'}</td></tr>`;
      } else {
        recentBody.innerHTML = sortedVisitors.map(([sid, data]) => {
          const time = new Date(data.lastSeen);
          const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')} ${String(time.getDate()).padStart(2,'0')}/${String(time.getMonth()+1).padStart(2,'0')}`;
          const pagesList = Array.from(data.pages).slice(0, 3).join(', ') || '—';
          const productsList = Array.from(data.products).slice(0, 3).join(', ') || '—';
          return `
            <tr>
              <td><span style="font-size:10px;">${timeStr}</span></td>
              <td><code style="font-size:10px;">${escapeHtml(data.ip)} / ${escapeHtml(data.city)}, ${escapeHtml(data.country)}</code></td>
              <td><span style="font-size:10px;">${escapeHtml(pagesList)}</span></td>
              <td><span style="font-size:10px;">${escapeHtml(productsList)}</span></td>
              <td style="text-align:center;">${data.checkoutVisit ? '<span style="color:#2ecc71;">✓</span>' : '<span style="color:var(--admin-muted);">—</span>'}</td>
              <td style="text-align:center;">${data.orderPlaced ? '<span style="color:#2ecc71;font-weight:bold;">✓ طلب</span>' : '<span style="color:var(--admin-muted);">—</span>'}</td>
              <td><span style="font-size:10px;">${escapeHtml(data.referrer)}</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Update traffic badge in sidebar
    const trafficBadge = $('#trafficBadge');
    if (trafficBadge) {
      trafficBadge.textContent = arabicNum(uniqueSessions);
    }
  }

  // Traffic Time Filter Buttons
  $('#trafficTimeFilters')?.querySelectorAll('.btn-time-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $('#trafficTimeFilters')?.querySelectorAll('.btn-time-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculateTrafficAnalytics(btn.dataset.range);
    });
  });

  // Refresh Traffic Button
  $('#refreshTrafficBtn')?.addEventListener('click', () => {
    const btn = $('#refreshTrafficBtn');
    btn.classList.add('spinning');
    // Force re-read from localStorage
    calculateTrafficAnalytics(trafficTimeRange);
    setTimeout(() => btn.classList.remove('spinning'), 500);
  });

  // Export Traffic CSV
  $('#exportTrafficBtn')?.addEventListener('click', () => {
    const events = getLocalTrafficEvents();
    const filtered = filterEventsByRange(events, trafficTimeRange);
    if (!filtered.length) {
      window.RoohUtils?.showToast(adminLang === 'ar' ? 'لا توجد بيانات للتصدير' : 'No data to export');
      return;
    }
    const headers = ['Timestamp', 'Event Type', 'Session ID', 'IP', 'Country', 'City', 'Path', 'Referrer', 'Product ID', 'Product Name', 'Product Price'];
    const rows = filtered.map(e => [
      e.timestamp,
      e.event_type,
      e.session_id,
      e.ip,
      e.country,
      e.city,
      e.path,
      e.referrer,
      e.product_id || '',
      e.product_name || '',
      e.product_price || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rooh-traffic-${trafficTimeRange}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.RoohUtils?.showToast(adminLang === 'ar' ? 'تم تصدير ملف CSV' : 'CSV exported');
  });

  // ── 📦 نظام إدارة المخزون والمستودع التفاعلي وتتبع مصادر البضاعة ───────────

  function updateInventorySelectionBar() {
    const bar = $('#invSelectionBar');
    if (!bar) return;

    if (!selectedInvProductIds.size) {
      bar.style.display = 'none';
      return;
    }

    let selUnits = 0;
    let selSaleVal = 0;
    let selCostVal = 0;

    selectedInvProductIds.forEach(id => {
      const p = currentProducts.find(item => String(item.id) === String(id));
      if (!p) return;
      const d = unpackProductDetails(p);
      const isAvail = p.in_stock !== false;
      const qty = d.stock_quantity !== '' && d.stock_quantity !== undefined ? parseInt(d.stock_quantity) : (isAvail ? 10 : 0);
      const sellPrice = parseFloat(d.sale_price) || parseFloat(p.price) || 0;
      const costPrice = parseFloat(d.cost_price) || 0;

      selUnits += qty;
      selSaleVal += (qty * sellPrice);
      selCostVal += (qty * costPrice);
    });

    const selProfit = Math.max(0, selSaleVal - selCostVal);

    if ($('#selPerfumeCount')) $('#selPerfumeCount').textContent = arabicNum(selectedInvProductIds.size);
    if ($('#selUnitCount')) $('#selUnitCount').textContent = arabicNum(selUnits);
    if ($('#selTotalSale')) $('#selTotalSale').textContent = money(selSaleVal);
    if ($('#selTotalCost')) $('#selTotalCost').textContent = money(selCostVal);
    if ($('#selTotalProfit')) $('#selTotalProfit').textContent = '+' + money(selProfit);

    bar.style.display = 'block';
  }

  function renderInventoryPanel() {
    const tableBody = $('#inventoryTable');
    if (!tableBody) return;

    const rawList = currentProducts.filter(p =>
      p.name !== '__system_announcements__' &&
      p.name !== '__system_brands__' &&
      p.name !== '__system_orders_meta__'
    );

    // Calculate Inventory Stats
    let totalUnits = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let goodStockCount = 0;
    let totalValuation = 0;
    let totalCostValuation = 0;

    // 2-Sources breakdown counters
    let src1Units = 0, src1Count = 0, src1SaleVal = 0, src1CostVal = 0;
    let src2Units = 0, src2Count = 0, src2SaleVal = 0, src2CostVal = 0;

    rawList.forEach(p => {
      const d = unpackProductDetails(p);
      const isAvailable = p.in_stock !== false;
      const qtyRaw = d.stock_quantity !== '' && d.stock_quantity !== undefined ? parseInt(d.stock_quantity) : (isAvailable ? 10 : 0);
      const priceVal = parseFloat(d.sale_price) || parseFloat(p.price) || 0;
      const costVal = parseFloat(d.cost_price) || 0;
      const src = d.supplier_source || 'المصدر 1';

      if (isAvailable && qtyRaw > 0) {
        inStockCount++;
        totalUnits += qtyRaw;
        totalValuation += (qtyRaw * priceVal);
        totalCostValuation += (qtyRaw * costVal);

        if (qtyRaw <= 5) {
          lowStockCount++;
        } else {
          goodStockCount++;
        }
      } else {
        outOfStockCount++;
      }

      // Group by supplier source
      if (src === 'المصدر 2') {
        src2Count++;
        if (isAvailable && qtyRaw > 0) {
          src2Units += qtyRaw;
          src2SaleVal += (qtyRaw * priceVal);
          src2CostVal += (qtyRaw * costVal);
        }
      } else {
        src1Count++;
        if (isAvailable && qtyRaw > 0) {
          src1Units += qtyRaw;
          src1SaleVal += (qtyRaw * priceVal);
          src1CostVal += (qtyRaw * costVal);
        }
      }
    });

    const totalProfit = Math.max(0, totalValuation - totalCostValuation);
    const src1Profit = Math.max(0, src1SaleVal - src1CostVal);
    const src2Profit = Math.max(0, src2SaleVal - src2CostVal);

    // Update KPI cards
    if ($('#invTotalUnits')) $('#invTotalUnits').textContent = arabicNum(totalUnits);
    if ($('#invInStockCount')) $('#invInStockCount').textContent = arabicNum(inStockCount);
    if ($('#invLowStockCount')) $('#invLowStockCount').textContent = arabicNum(lowStockCount);
    if ($('#invOutOfStockCount')) $('#invOutOfStockCount').textContent = arabicNum(outOfStockCount);
    if ($('#invTotalValuation')) $('#invTotalValuation').textContent = money(totalValuation);
    if ($('#invTotalCostValuation')) $('#invTotalCostValuation').textContent = money(totalCostValuation);
    if ($('#invTotalExpectedProfit')) $('#invTotalExpectedProfit').textContent = '+' + money(totalProfit);

    // Update Two Sources Comparison Cards
    if ($('#src1SaleVal')) $('#src1SaleVal').textContent = money(src1SaleVal);
    if ($('#src1CostVal')) $('#src1CostVal').textContent = money(src1CostVal);
    if ($('#src1ProfitVal')) $('#src1ProfitVal').textContent = '+' + money(src1Profit);
    if ($('#src1Units')) $('#src1Units').textContent = arabicNum(src1Units) + ' ' + (adminLang === 'ar' ? 'قطعة' : 'pcs');
    if ($('#src1PerfumeCount')) $('#src1PerfumeCount').textContent = arabicNum(src1Count) + ' ' + (adminLang === 'ar' ? 'عطر' : 'perfumes');

    if ($('#src2SaleVal')) $('#src2SaleVal').textContent = money(src2SaleVal);
    if ($('#src2CostVal')) $('#src2CostVal').textContent = money(src2CostVal);
    if ($('#src2ProfitVal')) $('#src2ProfitVal').textContent = '+' + money(src2Profit);
    if ($('#src2Units')) $('#src2Units').textContent = arabicNum(src2Units) + ' ' + (adminLang === 'ar' ? 'قطعة' : 'pcs');
    if ($('#src2PerfumeCount')) $('#src2PerfumeCount').textContent = arabicNum(src2Count) + ' ' + (adminLang === 'ar' ? 'عطر' : 'perfumes');

    // Update badge in sidebar
    const invBadge = $('#inventoryBadge');
    if (invBadge) {
      const alertCount = lowStockCount + outOfStockCount;
      invBadge.textContent = arabicNum(alertCount || rawList.length);
      if (alertCount > 0) {
        invBadge.style.background = '#f59e0b';
        invBadge.style.color = '#fff';
      } else {
        invBadge.style.background = '';
        invBadge.style.color = '';
      }
    }

    // Filter counts
    if ($('#invFilterAllCount')) $('#invFilterAllCount').textContent = arabicNum(rawList.length);
    if ($('#invFilterSrc1Count')) $('#invFilterSrc1Count').textContent = arabicNum(src1Count);
    if ($('#invFilterSrc2Count')) $('#invFilterSrc2Count').textContent = arabicNum(src2Count);
    if ($('#invFilterLowCount')) $('#invFilterLowCount').textContent = arabicNum(lowStockCount);
    if ($('#invFilterOutCount')) $('#invFilterOutCount').textContent = arabicNum(outOfStockCount);
    if ($('#invFilterGoodCount')) $('#invFilterGoodCount').textContent = arabicNum(goodStockCount);

    // Low stock alert banner
    const alertBox = $('#inventoryAlertBox');
    if (alertBox) {
      if (lowStockCount > 0 || outOfStockCount > 0) {
        alertBox.style.display = 'flex';
        const alertMsg = adminLang === 'ar'
          ? `يوجد ${arabicNum(lowStockCount)} عطر أوشك على النفاد (أقل من 5 قطع) و ${arabicNum(outOfStockCount)} عطر نفد تماماً من المخزن.`
          : `There are ${lowStockCount} items low on stock (≤5 pcs) and ${outOfStockCount} out of stock.`;
        if ($('#inventoryAlertText')) $('#inventoryAlertText').textContent = alertMsg;
      } else {
        alertBox.style.display = 'none';
      }
    }

    // Filter items for table display
    const q = (inventorySearch || '').trim().toLowerCase();
    let filtered = rawList.filter(p => {
      const d = unpackProductDetails(p);
      const isAvail = p.in_stock !== false;
      const qty = d.stock_quantity !== '' && d.stock_quantity !== undefined ? parseInt(d.stock_quantity) : (isAvail ? 10 : 0);
      const src = d.supplier_source || 'المصدر 1';

      // Status & Source filters
      if (inventoryFilter === 'low' && !(isAvail && qty > 0 && qty <= 5)) return false;
      if (inventoryFilter === 'out' && !(!isAvail || qty === 0)) return false;
      if (inventoryFilter === 'instock' && !(isAvail && qty > 5)) return false;
      if (inventoryFilter === 'source1' && src !== 'المصدر 1') return false;
      if (inventoryFilter === 'source2' && src !== 'المصدر 2') return false;

      // Search filter
      if (q) {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const latinMatch = (p.latin || '').toLowerCase().includes(q);
        const brandMatch = (d.brand || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const srcMatch = src.toLowerCase().includes(q);
        if (!nameMatch && !latinMatch && !brandMatch && !catMatch && !srcMatch) return false;
      }
      return true;
    });

    if (!filtered.length) {
      tableBody.innerHTML = `<tr><td colspan="9" class="empty-table">${adminLang === 'ar' ? 'لا توجد عطور تطابق معايير الفلترة المحددة' : 'No items match the selected filter'}</td></tr>`;
      updateInventorySelectionBar();
      return;
    }

    // Header checkbox sync
    const selectAllBox = $('#invSelectAll');
    if (selectAllBox) {
      const allFilteredSelected = filtered.every(p => selectedInvProductIds.has(String(p.id)));
      selectAllBox.checked = filtered.length > 0 && allFilteredSelected;
    }

    tableBody.innerHTML = filtered.map(p => {
      const d = unpackProductDetails(p);
      const isAvail = p.in_stock !== false;
      const qty = d.stock_quantity !== '' && d.stock_quantity !== undefined ? parseInt(d.stock_quantity) : (isAvail ? 10 : 0);
      const sellPrice = parseFloat(d.sale_price) || parseFloat(p.price) || 0;
      const costPrice = parseFloat(d.cost_price) || 0;
      const profitPerPiece = Math.max(0, sellPrice - costPrice);
      const src = d.supplier_source || 'المصدر 1';
      const img = p.image_url || 'assets/branding/2.svg';
      const bObj = findBrandObject(p.brand || d.brand);
      const brand = bObj ? (adminLang === 'ar' ? bObj.ar : bObj.en) : (p.brand || d.brand || 'رُوح');
      const isChecked = selectedInvProductIds.has(String(p.id));

      // Stock status calculations
      let statusClass = 'good';
      let statusLabel = adminLang === 'ar' ? 'وفرة كافية' : 'In Stock';
      let barPct = Math.min(100, Math.max(8, (qty / 20) * 100));

      if (!isAvail || qty === 0) {
        statusClass = 'out';
        statusLabel = adminLang === 'ar' ? 'نفد من المخزن' : 'Out of Stock';
        barPct = 0;
      } else if (qty <= 5) {
        statusClass = 'low';
        statusLabel = adminLang === 'ar' ? 'أوشك على النفاد ⚠️' : 'Low Stock ⚠️';
        barPct = Math.max(12, (qty / 10) * 100);
      }

      return `
        <tr data-inv-id="${p.id}" class="${isChecked ? 'inv-selected-row' : ''}">
          <td style="text-align:center;">
            <input type="checkbox" class="inv-row-check" data-check-id="${p.id}" ${isChecked ? 'checked' : ''} aria-label="تحديد هذا العطر">
          </td>
          <td>
            <img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" class="table-thumb" style="width:48px;height:48px;object-fit:contain;background:var(--surface);border-radius:8px;padding:3px;border:1px solid var(--line);">
          </td>
          <td>
            <strong style="display:block;font-size:13.5px;color:var(--ink);">${escapeHtml(p.name)}</strong>
            ${p.latin ? `<span style="font-size:11px;color:var(--muted);display:block;">${escapeHtml(p.latin)}</span>` : ''}
            <span class="brand-pill" style="font-size:10.5px;padding:2px 8px;border-radius:12px;background:rgba(75,90,60,0.08);color:var(--color-secondary);">${escapeHtml(brand)}</span>
          </td>
          <td>
            <select class="inv-source-select" data-source-id="${p.id}" title="تغيير مصدر هذا العطر">
              <option value="المصدر 1" ${src === 'المصدر 1' ? 'selected' : ''}>🏢 المصدر 1</option>
              <option value="المصدر 2" ${src === 'المصدر 2' ? 'selected' : ''}>🏢 المصدر 2</option>
            </select>
          </td>
          <td>
            <div style="font-weight:700;color:var(--ink);">${money(sellPrice)}</div>
            ${costPrice ? `<div style="font-size:11px;color:var(--color-accent-dark);font-weight:600;">${adminLang === 'ar' ? 'تكلفة:' : 'Cost:'} ${money(costPrice)}</div>` : `<div style="font-size:11px;color:var(--muted);">${adminLang === 'ar' ? 'بدون تكلفة' : 'No cost'}</div>`}
            ${costPrice && profitPerPiece > 0 ? `<div style="font-size:10px;color:#059669;">${adminLang === 'ar' ? 'ربح:' : 'Profit:'} +${money(profitPerPiece)}</div>` : ''}
          </td>
          <td>
            <div class="stock-level-bar-wrap">
              <div class="stock-level-text ${statusClass}">
                <span>${statusLabel}</span>
                <span>${arabicNum(qty)} ${adminLang === 'ar' ? 'قطعة' : 'pcs'}</span>
              </div>
              <div class="stock-level-bar">
                <div class="stock-level-fill ${statusClass}" style="width:${barPct}%;"></div>
              </div>
            </div>
          </td>
          <td>
            <button type="button" class="btn-stock-toggle ${isAvail ? 'in-stock' : 'out-of-stock'}" data-stock-toggle="${p.id}" title="${isAvail ? 'انقر لجعله غير متوفر' : 'انقر لجعله متوفر بالمخزن'}">
              <span>${isAvail ? '● متوفر' : '○ نفد'}</span>
            </button>
          </td>
          <td>
            <div class="stock-qty-stepper">
              <button type="button" class="stock-step-btn" data-step="-1" data-target="${p.id}">−</button>
              <input type="number" class="stock-qty-input" data-qty-id="${p.id}" value="${qty}" min="0">
              <button type="button" class="stock-step-btn" data-step="1" data-target="${p.id}">+</button>
            </div>
          </td>
          <td>
            <div style="display:flex;gap:6px;align-items:center;">
              <button type="button" class="btn-stock-save" data-save-stock="${p.id}" title="${adminLang === 'ar' ? 'حفظ الكمية فوراً' : 'Save Quantity'}">💾 ${adminLang === 'ar' ? 'حفظ' : 'Save'}</button>
              <button type="button" class="btn-action" data-edit="${p.id}" title="${adminLang === 'ar' ? 'تعديل كافة تفاصيل العطر' : 'Edit Perfume'}">✏️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    updateInventorySelectionBar();
  }

  // Inventory Event Handlers
  $('#inventorySearchInput')?.addEventListener('input', e => {
    inventorySearch = e.target.value;
    renderInventoryPanel();
  });

  $('#inventory-panel')?.querySelectorAll('.inv-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $('#inventory-panel').querySelectorAll('.inv-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      inventoryFilter = chip.dataset.invFilter || 'all';
      renderInventoryPanel();
    });
  });

  // Source card quick filter buttons
  document.querySelectorAll('[data-source-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.sourceFilter;
      inventoryFilter = src;
      $('#inventory-panel')?.querySelectorAll('.inv-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.invFilter === src);
      });
      renderInventoryPanel();
    });
  });

  $('#btnFilterLowStock')?.addEventListener('click', () => {
    $('#inventory-panel')?.querySelectorAll('.inv-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.invFilter === 'low');
    });
    inventoryFilter = 'low';
    renderInventoryPanel();
  });

  $('#refreshInventoryBtn')?.addEventListener('click', () => {
    loadProducts();
    window.RoohUtils?.showToast(adminLang === 'ar' ? 'جاري تحديث المخزون...' : 'Refreshing inventory...');
  });

  // Select all checkbox
  $('#invSelectAll')?.addEventListener('change', e => {
    const isChecked = e.target.checked;
    const rawList = currentProducts.filter(p =>
      p.name !== '__system_announcements__' &&
      p.name !== '__system_brands__' &&
      p.name !== '__system_orders_meta__'
    );
    const q = (inventorySearch || '').trim().toLowerCase();
    const visibleList = rawList.filter(p => {
      const d = unpackProductDetails(p);
      const isAvail = p.in_stock !== false;
      const qty = d.stock_quantity !== '' && d.stock_quantity !== undefined ? parseInt(d.stock_quantity) : (isAvail ? 10 : 0);
      const src = d.supplier_source || 'المصدر 1';
      if (inventoryFilter === 'low' && !(isAvail && qty > 0 && qty <= 5)) return false;
      if (inventoryFilter === 'out' && !(!isAvail || qty === 0)) return false;
      if (inventoryFilter === 'instock' && !(isAvail && qty > 5)) return false;
      if (inventoryFilter === 'source1' && src !== 'المصدر 1') return false;
      if (inventoryFilter === 'source2' && src !== 'المصدر 2') return false;
      if (q) {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const latinMatch = (p.latin || '').toLowerCase().includes(q);
        const brandMatch = (d.brand || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const srcMatch = src.toLowerCase().includes(q);
        if (!nameMatch && !latinMatch && !brandMatch && !catMatch && !srcMatch) return false;
      }
      return true;
    });

    if (isChecked) {
      visibleList.forEach(p => selectedInvProductIds.add(String(p.id)));
    } else {
      visibleList.forEach(p => selectedInvProductIds.delete(String(p.id)));
    }
    renderInventoryPanel();
  });

  // Table change events: row checkbox & source dropdown
  $('#inventoryTable')?.addEventListener('change', async e => {
    // Row Checkbox
    const check = e.target.closest('.inv-row-check');
    if (check) {
      const id = String(check.dataset.checkId);
      if (check.checked) {
        selectedInvProductIds.add(id);
      } else {
        selectedInvProductIds.delete(id);
      }
      const tr = check.closest('tr');
      if (tr) tr.classList.toggle('inv-selected-row', check.checked);
      updateInventorySelectionBar();

      // Check header checkbox state
      const selectAllBox = $('#invSelectAll');
      if (selectAllBox) {
        const allChecks = document.querySelectorAll('.inv-row-check');
        selectAllBox.checked = allChecks.length > 0 && Array.from(allChecks).every(c => c.checked);
      }
      return;
    }

    // Source Selector
    const srcSelect = e.target.closest('.inv-source-select');
    if (srcSelect) {
      const id = srcSelect.dataset.sourceId;
      const targetProduct = currentProducts.find(p => String(p.id) === String(id));
      if (!targetProduct) return;
      const newSource = srcSelect.value;
      targetProduct.supplier_source = newSource;

      // Update packed notes JSON
      let meta = {};
      if (targetProduct.notes && typeof targetProduct.notes === 'string') {
        try { meta = JSON.parse(targetProduct.notes); } catch (_) {}
      }
      meta.supplier_source = newSource;
      targetProduct.notes = JSON.stringify(meta);

      try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
      window.RoohUtils?.showToast(adminLang === 'ar' ? `تم تحويل العطر إلى ${newSource} ✓` : `Assigned to ${newSource} ✓`);

      try {
        await supaFetch('products', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: {
            supplier_source: newSource,
            notes: targetProduct.notes
          }
        });
      } catch (err) {
        console.warn('Could not sync supplier source to remote:', err);
      }

      renderInventoryPanel();
      return;
    }
  });

  // Bulk set source 1
  $('#bulkSetSource1')?.addEventListener('click', async () => {
    if (!selectedInvProductIds.size) return;
    const count = selectedInvProductIds.size;
    selectedInvProductIds.forEach(id => {
      const p = currentProducts.find(item => String(item.id) === String(id));
      if (p) {
        p.supplier_source = 'المصدر 1';
        let meta = {};
        if (p.notes && typeof p.notes === 'string') {
          try { meta = JSON.parse(p.notes); } catch (_) {}
        }
        meta.supplier_source = 'المصدر 1';
        p.notes = JSON.stringify(meta);
      }
    });

    try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
    window.RoohUtils?.showToast(adminLang === 'ar' ? `تم تعيين ${arabicNum(count)} عطور إلى المصدر 1 ✓` : `${count} items set to Source 1 ✓`);

    // Async batch sync
    selectedInvProductIds.forEach(async id => {
      const p = currentProducts.find(item => String(item.id) === String(id));
      if (!p) return;
      try {
        await supaFetch('products', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: { supplier_source: 'المصدر 1', notes: p.notes }
        });
      } catch (_) {}
    });

    renderInventoryPanel();
  });

  // Bulk set source 2
  $('#bulkSetSource2')?.addEventListener('click', async () => {
    if (!selectedInvProductIds.size) return;
    const count = selectedInvProductIds.size;
    selectedInvProductIds.forEach(id => {
      const p = currentProducts.find(item => String(item.id) === String(id));
      if (p) {
        p.supplier_source = 'المصدر 2';
        let meta = {};
        if (p.notes && typeof p.notes === 'string') {
          try { meta = JSON.parse(p.notes); } catch (_) {}
        }
        meta.supplier_source = 'المصدر 2';
        p.notes = JSON.stringify(meta);
      }
    });

    try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
    window.RoohUtils?.showToast(adminLang === 'ar' ? `تم تعيين ${arabicNum(count)} عطور إلى المصدر 2 ✓` : `${count} items set to Source 2 ✓`);

    // Async batch sync
    selectedInvProductIds.forEach(async id => {
      const p = currentProducts.find(item => String(item.id) === String(id));
      if (!p) return;
      try {
        await supaFetch('products', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: { supplier_source: 'المصدر 2', notes: p.notes }
        });
      } catch (_) {}
    });

    renderInventoryPanel();
  });

  // Bulk clear selection
  $('#bulkClearSelection')?.addEventListener('click', () => {
    selectedInvProductIds.clear();
    const selectAllBox = $('#invSelectAll');
    if (selectAllBox) selectAllBox.checked = false;
    document.querySelectorAll('.inv-row-check').forEach(c => c.checked = false);
    document.querySelectorAll('.inv-selected-row').forEach(r => r.classList.remove('inv-selected-row'));
    updateInventorySelectionBar();
  });

  // Export Inventory CSV
  $('#exportInventoryBtn')?.addEventListener('click', () => {
    const rawList = currentProducts.filter(p =>
      p.name !== '__system_announcements__' &&
      p.name !== '__system_brands__' &&
      p.name !== '__system_orders_meta__'
    );
    if (!rawList.length) {
      window.RoohUtils?.showToast(adminLang === 'ar' ? 'لا توجد بيانات بالمخزون للتصدير' : 'No inventory data to export');
      return;
    }
    const headers = ['ID', 'Name', 'Latin Name', 'Brand', 'Category', 'Source', 'Price', 'Sale Price', 'Cost Price', 'In Stock', 'Stock Quantity', 'Stock Valuation'];
    const rows = rawList.map(p => {
      const d = unpackProductDetails(p);
      const isAvail = p.in_stock !== false;
      const qty = d.stock_quantity !== '' && d.stock_quantity !== undefined ? parseInt(d.stock_quantity) : (isAvail ? 10 : 0);
      const sellPrice = parseFloat(d.sale_price) || parseFloat(p.price) || 0;
      const costPrice = parseFloat(d.cost_price) || 0;
      return [
        p.id,
        p.name || '',
        p.latin || '',
        d.brand || '',
        p.category || '',
        d.supplier_source || 'المصدر 1',
        p.price || 0,
        d.sale_price || '',
        costPrice || '',
        isAvail ? 'Yes' : 'No',
        qty,
        (qty * sellPrice)
      ];
    });
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rooh-inventory-stock-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.RoohUtils?.showToast(adminLang === 'ar' ? 'تم تصدير كشف جرد المخزون بنجاح' : 'Inventory CSV exported successfully');
  });

  // Table actions: stepper, toggle, save
  $('#inventoryTable')?.addEventListener('click', async e => {
    // Stepper + or -
    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      const step = parseInt(stepBtn.dataset.step) || 0;
      const targetId = stepBtn.dataset.target;
      const inp = document.querySelector(`input[data-qty-id="${targetId}"]`);
      if (inp) {
        let cur = parseInt(inp.value) || 0;
        cur = Math.max(0, cur + step);
        inp.value = cur;
      }
      return;
    }

    // In Stock toggle button
    const toggleBtn = e.target.closest('[data-stock-toggle]');
    if (toggleBtn) {
      const id = toggleBtn.dataset.stockToggle;
      const targetProduct = currentProducts.find(p => String(p.id) === String(id));
      if (!targetProduct) return;
      const newInStock = !(targetProduct.in_stock !== false);
      targetProduct.in_stock = newInStock;
      try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
      renderInventoryPanel();
      renderProductsTable();

      try {
        await supaFetch('products', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: { in_stock: newInStock }
        });
        window.RoohUtils?.showToast(newInStock
          ? (adminLang === 'ar' ? 'تم تعيين العطر كمتوفر بالمخزن ✓' : 'Marked as In Stock ✓')
          : (adminLang === 'ar' ? 'تم تعيين العطر كغير متوفر ✕' : 'Marked as Out of Stock ✕')
        );
      } catch (err) {
        console.warn('Could not sync stock status to remote:', err);
      }
      return;
    }

    // Save Stock Quantity
    const saveBtn = e.target.closest('[data-save-stock]');
    if (saveBtn) {
      const id = saveBtn.dataset.saveStock;
      const targetProduct = currentProducts.find(p => String(p.id) === String(id));
      if (!targetProduct) return;
      const inp = document.querySelector(`input[data-qty-id="${id}"]`);
      const newQty = inp ? Math.max(0, parseInt(inp.value) || 0) : 0;
      const isNowInStock = newQty > 0;

      targetProduct.stock_quantity = newQty;
      targetProduct.in_stock = isNowInStock;

      // Also update packed notes
      let meta = {};
      if (targetProduct.notes && typeof targetProduct.notes === 'string') {
        try { meta = JSON.parse(targetProduct.notes); } catch (_) {}
      }
      meta.stock_quantity = newQty;
      targetProduct.notes = JSON.stringify(meta);

      try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}

      saveBtn.classList.add('saved');
      saveBtn.textContent = '✓ ' + (adminLang === 'ar' ? 'تم' : 'Saved');

      try {
        await supaFetch('products', {
          method: 'PATCH',
          filters: `&id=eq.${encodeURIComponent(id)}`,
          body: {
            stock_quantity: newQty,
            in_stock: isNowInStock,
            notes: targetProduct.notes
          }
        });
      } catch (err) {
        console.warn('Could not sync stock quantity to remote:', err);
      }

      setTimeout(() => {
        renderInventoryPanel();
        renderProductsTable();
      }, 700);
      return;
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
})();
