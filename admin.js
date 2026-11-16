(() => {
  const $ = selector => document.querySelector(selector);

  // ── Supabase config (نفس القيم في app.js) ────────────────────────────────
  const SUPABASE_URL  = 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

  async function supaFetch(table, { method = 'GET', filters = '', body = null, select = '*' } = {}) {
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
  }
  // ─────────────────────────────────────────────────────────────────────────

  let theme = 'dark';
  try { theme = localStorage.getItem('rooh-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch (_) {}
  function setTheme(next, persist = true) {
    theme = next; document.body.classList.toggle('light', next === 'light');
    document.querySelector('meta[name="theme-color"]').content = next === 'light' ? '#f5f0eb' : '#192940';
    document.querySelectorAll('.brand-logo').forEach(image => {
      const asset = image.dataset[next];
      if (!asset || image.getAttribute('src') === asset) return;
      image.style.opacity = '0'; setTimeout(() => { image.src = asset; image.style.opacity = '1'; }, 120);
    });
    if (persist) localStorage.setItem('rooh-theme', next);
  }
  setTheme(theme, false);
  $('#adminTheme').addEventListener('click', () => setTheme(theme === 'light' ? 'dark' : 'light'));

  // ── Language & State Setup ────────────────────────────────────────────────
  let adminLang = 'ar';
  try { adminLang = localStorage.getItem('rooh-lang') || 'ar'; } catch (_) {}

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

    // Values Strip Live Preview
    const v1 = $('#valItem1')?.value.trim() || 'تركيبات غنية تدوم طويلاً';
    const v2 = $('#valItem2')?.value.trim() || 'خامات مختارة بعناية';
    const v3 = $('#valItem3')?.value.trim() || 'صُنع بحب في مصر';
    const v4 = $('#valItem4')?.value.trim() || 'هدية تحكي عنك';
    if ($('#vPreview1')) $('#vPreview1').textContent = v1;
    if ($('#vPreview2')) $('#vPreview2').textContent = v2;
    if ($('#vPreview3')) $('#vPreview3').textContent = v3;
    if ($('#vPreview4')) $('#vPreview4').textContent = v4;
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

    // Values Strip fields
    const vs = Array.isArray(data.values_strip) && data.values_strip.length === 4
      ? data.values_strip
      : ['تركيبات غنية تدوم طويلاً', 'خامات مختارة بعناية', 'صُنع بحب في مصر', 'هدية تحكي عنك'];
    if ($('#valItem1')) $('#valItem1').value = vs[0] || 'تركيبات غنية تدوم طويلاً';
    if ($('#valItem2')) $('#valItem2').value = vs[1] || 'خامات مختارة بعناية';
    if ($('#valItem3')) $('#valItem3').value = vs[2] || 'صُنع بحب في مصر';
    if ($('#valItem4')) $('#valItem4').value = vs[3] || 'هدية تحكي عنك';

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
            populateCampaignInputs({
              ...defaultCampaign,
              ...data
            });
            try {
              localStorage.setItem(campaignKey, JSON.stringify(data));
              localStorage.setItem('rooh-announcements', JSON.stringify(data));
            } catch (_) {}
          } catch (e) {
            console.error('Error parsing campaign notes:', e);
          }
        }
      })
      .catch(err => console.warn('Campaign fetch error:', err));
  }
  loadCampaignFromSupa();

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
        values_strip: [
          $('#valItem1')?.value.trim() || 'تركيبات غنية تدوم طويلاً',
          $('#valItem2')?.value.trim() || 'خامات مختارة بعناية',
          $('#valItem3')?.value.trim() || 'صُنع بحب في مصر',
          $('#valItem4')?.value.trim() || 'هدية تحكي عنك'
        ]
      };

      try {
        localStorage.setItem(campaignKey, JSON.stringify(updatedCampaign));
        localStorage.setItem('rooh-announcements', JSON.stringify(updatedCampaign));
        localStorage.setItem('rooh-promo', JSON.stringify({
          title: updatedCampaign.promo_title,
          details: updatedCampaign.promo_details,
          startsAt: updatedCampaign.promo_starts_at,
          endsAt: updatedCampaign.promo_ends_at,
          active: updatedCampaign.promo_active
        }));
      } catch (_) {}

      try {
        const updatedRows = await supaFetch('products', {
          method: 'PATCH',
          filters: '&name=eq.__system_announcements__',
          body: {
            notes: JSON.stringify(updatedCampaign),
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
              notes: JSON.stringify(updatedCampaign)
            }
          });
        }
        if (status) {
          status.className = 'saved';
          status.textContent = 'تم حفظ ونشر الإعلانات وعطر اليوم بنجاح في المتجر! ✓';
        }
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
              notes: JSON.stringify(updatedCampaign)
            }
          });
          if (status) {
            status.className = 'saved';
            status.textContent = 'تم حفظ ونشر الإعلانات وعطر اليوم بنجاح في المتجر! ✓';
          }
        } catch (e2) {
          if (status) {
            status.className = 'error';
            status.textContent = 'تم الحفظ محلياً فقط. تحقق من اتصال الإنترنت أو إعدادات Supabase.';
          }
        }
      }
    });
  }

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
        const filteredOrders = rawOrders
          .filter(o => !deletedOrderIds.has(String(o.id)))
          .map(o => {
            if (orderStatusMap[o.id]) o.status = orderStatusMap[o.id];
            return o;
          });
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

    // Update Brand Filter dropdown options
    populateBrandSelects();

    const searchQuery = ($('#adminProdSearch')?.value || '').trim().toLowerCase();
    const catFilterVal = $('#adminCatFilter')?.value || 'all';
    const brandFilterVal = $('#adminBrandFilter')?.value || 'all';

    const filtered = currentProducts.filter(p => {
      const d = unpackProductDetails(p);
      const bObj = findBrandObject(p.brand || d.brand);
      const brandName = (p.brand || d.brand || 'رُوح').toLowerCase();
      const pCat = (p.category || 'unisex').toLowerCase();

      // Category matching
      if (catFilterVal !== 'all') {
        const normCat = (pCat === 'women' || pCat.includes('نسائ')) ? 'women'
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
    };

    $('#productsTable').innerHTML = filtered.map(p => {
      const pCat = (p.category || 'unisex').toLowerCase();
      const normCatKey = (pCat === 'women' || pCat.includes('نسائ')) ? 'women'
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
          ${p.is_featured ? `<span class="featured-mark" title="${adminLang === 'ar' ? 'عطر مميز في الواجهة' : 'Featured Hero Fragrance'}">⭐</span>` : ''}
          ${p.tag ? `<span class="tag-badge">${escapeHtml(p.tag)}</span>` : ''}
        </td>
        <td>
          <div class="action-btns">
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
  const dropPreview = $('#dropzonePreview');
  const previewImg  = $('#imagePreviewImg');
  const removeImgBtn= $('#btnRemoveImage');
  const manualImg   = $('#prodImageManual');

  let selectedImageFile = null;

  function showImagePreview(urlOrData) {
    if (!urlOrData) return;
    previewImg.src = urlOrData;
    dropPreview.hidden = false;
    dropPrompt.hidden = true;
  }

  function clearImagePreview() {
    selectedImageFile = null;
    previewImg.src = '';
    dropPreview.hidden = true;
    dropPrompt.hidden = false;
    if (fileInput) fileInput.value = '';
    $('#prodImage').value = '';
    if (manualImg) manualImg.value = '';
  }

  // Handle Dropzone Click & Drag
  dropzone?.addEventListener('click', event => {
    if (event.target === removeImgBtn || event.target.closest('#btnRemoveImage')) return;
    fileInput?.click();
  });

  removeImgBtn?.addEventListener('click', event => {
    event.stopPropagation();
    clearImagePreview();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = e => showImagePreview(e.target.result);
    reader.readAsDataURL(file);
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

  dropzone?.addEventListener('drop', e => {
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = ev => showImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  });

  manualImg?.addEventListener('input', () => {
    const url = manualImg.value.trim();
    if (url) {
      selectedImageFile = null;
      if (fileInput) fileInput.value = '';
      $('#prodImage').value = url;
      showImagePreview(url);
    } else {
      clearImagePreview();
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
      cost_price:       p.cost_price !== undefined && p.cost_price !== null ? p.cost_price : (meta.cost_price !== undefined && meta.cost_price !== null ? meta.cost_price : '')
    };
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

  function openProductModal(product = null) {
    prodForm.reset();
    formStatus.textContent = '';
    formStatus.className   = '';
    clearImagePreview();

    const saleInp = $('#prodSalePrice');
    const badgeInp = $('#prodDiscountBadge');
    const pctInp = $('#prodDiscountPercent');
    const feedback = $('#prodDiscountFeedback');

    if (product) {
      const details = unpackProductDetails(product);
      modalTitle.innerHTML = `تعديل عطر: <em>${escapeHtml(product.name)}</em>`;
      $('#productId').value       = product.id;
      $('#prodName').value        = product.name || '';
      $('#prodLatin').value       = product.latin || '';
      populateBrandSelects(details.brand || product.brand || '');
      $('#prodPrice').value       = product.price || '';
      $('#prodCategory').value    = product.category || 'unisex';
      $('#prodNotes').value       = details.notes;
      $('#prodImage').value       = product.image_url || '';
      if (manualImg) manualImg.value = product.image_url || '';
      if (product.image_url) {
        showImagePreview(product.image_url);
      }
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
      syncDiscountFeedback();
      syncProfitFeedback();

      // Scent DNA Accords & Main Accord
      let currentAccordsList = (details.accords || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
      const chosenMain = details.main_accord || currentAccordsList[0] || '';
      if ($('#prodMainAccord')) $('#prodMainAccord').value = chosenMain;
      renderAdminAccordsChips(currentAccordsList);

      // Seasons & Occasions
      const currentSeasons = (details.seasons || '').toLowerCase();
      renderAdminSeasonsChips(currentSeasons);

      $('#saveProdBtn').innerHTML = 'حفظ التعديلات <span>←</span>';
    } else {
      modalTitle.innerHTML = 'إضافة <em>عطر جديد</em>';
      $('#productId').value     = '';
      populateBrandSelects('');
      $('#prodCategory').value  = 'unisex';
      $('#prodLongevity').value = '3';
      $('#prodSillage').value   = '2';
      $('#prodInStock').checked  = true;
      if ($('#prodStockQuantity')) $('#prodStockQuantity').value = '';

      if (saleInp) saleInp.value = '';
      if (pctInp) pctInp.value = '';
      if (badgeInp) badgeInp.value = '';
      if ($('#prodCostPrice')) $('#prodCostPrice').value = '';
      if (feedback) feedback.style.display = 'none';
      syncProfitFeedback();

      if ($('#prodMainAccord')) $('#prodMainAccord').value = '';
      renderAdminAccordsChips([]);
      renderAdminSeasonsChips('');

      $('#saveProdBtn').innerHTML = 'إضافة العطر <span>←</span>';
    }

    prodModal.classList.add('open');
  }

  function closeProductModal() {
    prodModal.classList.remove('open');
    clearImagePreview();
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

  // Handle Edit & Delete button clicks inside table
  $('#productsTable')?.addEventListener('click', async event => {
    const editBtn = event.target.closest('[data-edit]');
    const delBtn  = event.target.closest('[data-del]');

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
    let imageUrl = $('#prodImage').value.trim() || manualImg?.value.trim() || null;

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

    const payload = {
      name:        $('#prodName').value.trim(),
      latin:       $('#prodLatin').value.trim() || null,
      brand:       $('#prodBrand')?.value.trim() || null,
      price:       rawPrice,
      sale_price:  validSalePrice,
      cost_price:  costPrice,
      discount_percent: validPercent,
      discount_badge:   validBadge,
      category:    $('#prodCategory').value,
      notes:       rawNotesVal || null,
      image_url:   imageUrl,
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
        if (errMsg.includes('column') || errMsg.includes('42703') || errMsg.includes('cost_price') || errMsg.includes('top_notes') || errMsg.includes('brand') || errMsg.includes('main_accord') || errMsg.includes('seasons') || errMsg.includes('sale_price') || errMsg.includes('discount') || errMsg.includes('stock_quantity')) {
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
              discount_percent: payload.discount_percent,
              discount_badge: payload.discount_badge,
              stock_quantity: stockQty
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
  $('#adminCatFilter')?.addEventListener('change', () => renderProductsTable());
  $('#adminBrandFilter')?.addEventListener('change', () => renderProductsTable());

  // ── Sales Time Filter Buttons Listener ────────────────────────────────────
  $('#salesTimeFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('.btn-time-filter');
    if (!btn) return;
    $('#salesTimeFilters').querySelectorAll('.btn-time-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calculateSalesAnalytics(btn.dataset.range);
  });

  // ── Sidebar Active Tab Sync on Hash Change ───────────────────────────────
  function updateActiveSideLink() {
    const hash = window.location.hash || '#overview';
    document.querySelectorAll('.admin-sidebar .side-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.classList.toggle('selected', href === hash);
      }
    });
  }
  window.addEventListener('hashchange', updateActiveSideLink);
  updateActiveSideLink();

  // ── Immediate Cache Render (0ms Instant Load) ─────────────────────────────
  if (currentProducts.length) renderProductsTable(currentProducts);
  if (currentOrders.length) renderOrders(currentOrders);
  calculateSalesAnalytics('all');
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
  // ─────────────────────────────────────────────────────────────────────────
})();
