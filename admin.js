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
      if (image.getAttribute('src') === asset) return;
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
  try {
    const cachedO = localStorage.getItem('rooh-cached-orders');
    if (cachedO) {
      const parsed = JSON.parse(cachedO);
      if (Array.isArray(parsed) && parsed.length) currentOrders = parsed;
    }
  } catch (_) {}
  if (!currentOrders.length) {
    currentOrders = [...DEFAULT_ORDERS];
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
        storewide_discount_badge: $('#storewideDiscountBadge')?.value.trim() || ''
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
        await supaFetch('products?name=eq.__system_announcements__', {
          method: 'PATCH',
          body: {
            notes: JSON.stringify(updatedCampaign),
            category: 'unisex',
            in_stock: false
          }
        });
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
  }

  function loadOrders(isManual = false) {
    const refreshBtn = $('#refreshOrdersBtn');
    if (refreshBtn && isManual) refreshBtn.classList.add('spinning');
    supaFetch('orders', { filters: '&order=created_at.desc&limit=50' })
      .then(renderOrders)
      .catch(err => {
        console.error('Admin orders:', err);
        if (!currentOrders.length) {
          $('#ordersTable').innerHTML = `<tr><td colspan="7" class="empty-table error">${adminLang === 'ar' ? 'تعذر تحميل الطلبات. تحقق من الاتصال.' : 'Failed to load orders. Check connection.'}</td></tr>`;
        }
      })
      .finally(() => {
        if (refreshBtn) refreshBtn.classList.remove('spinning');
      });
  }

  function renderProductsTable(products) {
    if (products) {
      currentProducts = (products || []).filter(p => p.name !== '__system_announcements__');
      try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
    }
    $('#statProducts').textContent = arabicNum(currentProducts.length);
    $('#prodBadge').textContent     = arabicNum(currentProducts.length);
    populateSpotlightSelect(currentProducts);

    // Update Brand Filter dropdown options
    const brandFilterSel = $('#adminBrandFilter');
    if (brandFilterSel) {
      const prevBrandVal = brandFilterSel.value || 'all';
      const allBrands = Array.from(new Set(currentProducts.map(p => {
        const d = unpackProductDetails(p);
        return (p.brand || d.brand || 'رُوح').trim();
      }).filter(Boolean))).sort();
      brandFilterSel.innerHTML = `<option value="all">${adminLang === 'ar' ? 'كل البراندات' : 'All Brands'}</option>` +
        allBrands.map(b => `<option value="${escapeHtml(b)}" ${b === prevBrandVal ? 'selected' : ''}>${escapeHtml(b)}</option>`).join('');
    }

    const searchQuery = ($('#adminProdSearch')?.value || '').trim().toLowerCase();
    const catFilterVal = $('#adminCatFilter')?.value || 'all';
    const brandFilterVal = $('#adminBrandFilter')?.value || 'all';

    const filtered = currentProducts.filter(p => {
      const d = unpackProductDetails(p);
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
        if (brandName !== brandFilterVal.toLowerCase()) return false;
      }

      // Search query matching (name, latin, brand, category, notes, accords, inspired_by)
      if (searchQuery) {
        const qNorm = normalizeSearchText(searchQuery);
        const hay = normalizeSearchText(`${p.name} ${p.latin || ''} ${brandName} ${pCat} ${d.notes} ${d.inspired_by} ${d.accords}`);
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

      return `<tr>
        <td>${imgHtml}</td>
        <td class="prod-title-cell">
          <strong>${escapeHtml(titlePrimary)}</strong>
          ${titleSub ? `<small>${escapeHtml(titleSub)}</small>` : ''}
        </td>
        <td><span class="brand-pill">${escapeHtml(prodBrand)}</span></td>
        <td><span class="cat-pill ${cat.class}">${cat.text}</span></td>
        <td>${priceCellHtml}</td>
        <td><span style="font-size:10px;color:var(--muted);">${escapeHtml(displayNotes)}</span></td>
        <td>
          <span class="stock-tag ${p.in_stock !== false ? 'in' : 'out'}">${p.in_stock !== false ? (adminLang === 'ar' ? 'متوفر ✓' : 'In Stock ✓') : (adminLang === 'ar' ? 'غير متوفر' : 'Out of Stock')}</span>
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
      discount_badge:   p.discount_badge || meta.discount_badge || ''
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
      if ($('#prodBrand')) $('#prodBrand').value = details.brand || product.brand || '';
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

      // Discount inputs
      if (saleInp) saleInp.value = details.sale_price || '';
      if (badgeInp) badgeInp.value = details.discount_badge || '';
      syncDiscountFeedback();

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
      if ($('#prodBrand')) $('#prodBrand').value = '';
      $('#prodCategory').value  = 'unisex';
      $('#prodLongevity').value = '3';
      $('#prodSillage').value   = '2';
      $('#prodInStock').checked  = true;

      if (saleInp) saleInp.value = '';
      if (pctInp) pctInp.value = '';
      if (badgeInp) badgeInp.value = '';
      if (feedback) feedback.style.display = 'none';

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

  $('#openAddProduct')?.addEventListener('click', () => openProductModal());
  $('#productModalClose')?.addEventListener('click', closeProductModal);
  $('#cancelProdBtn')?.addEventListener('click', closeProductModal);
  prodModal?.addEventListener('click', e => { if (e.target === prodModal) closeProductModal(); });

  // Live sync between Price, Sale Price, and Discount Percent in product modal
  $('#prodSalePrice')?.addEventListener('input', () => syncDiscountFeedback());
  $('#prodPrice')?.addEventListener('input', () => {
    if ($('#prodSalePrice')?.value) syncDiscountFeedback();
  });
  $('#prodDiscountPercent')?.addEventListener('input', () => {
    const pPrice = parseFloat($('#prodPrice')?.value) || 0;
    const pct = parseFloat($('#prodDiscountPercent')?.value);
    const saleInp = $('#prodSalePrice');
    if (pPrice > 0 && !isNaN(pct) && pct > 0 && pct < 100) {
      const sPrice = Math.round(pPrice * (1 - pct / 100));
      if (saleInp) saleInp.value = sPrice;
      syncDiscountFeedback();
    } else if (!pct) {
      if (saleInp) saleInp.value = '';
      syncDiscountFeedback();
    }
  });

  // Bulk Discount Handlers (Storewide)
  $('#btnApplyBulkDiscount')?.addEventListener('click', async () => {
    const rawPct = $('#storewideDiscountPercent')?.value;
    const pct = parseInt(rawPct) || 20;
    const targetProds = currentProducts.filter(p => p.name !== '__system_announcements__');
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
    const targetProds = currentProducts.filter(p => p.name !== '__system_announcements__');
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
    const validBadge = $('#prodDiscountBadge')?.value.trim() || null;
    const validPercent = validSalePrice ? Math.round(((rawPrice - validSalePrice) / rawPrice) * 100) : null;

    const payload = {
      name:        $('#prodName').value.trim(),
      latin:       $('#prodLatin').value.trim() || null,
      brand:       $('#prodBrand')?.value.trim() || null,
      price:       rawPrice,
      sale_price:  validSalePrice,
      discount_percent: validPercent,
      discount_badge:   validBadge,
      category:    $('#prodCategory').value,
      notes:       $('#prodNotes').value.trim() || null,
      image_url:   imageUrl,
      tag:         $('#prodTag').value.trim() || null,
      top_notes:   $('#prodTopNotes').value.trim() || null,
      middle_notes:$('#prodMiddleNotes').value.trim() || null,
      base_notes:  $('#prodBaseNotes').value.trim() || null,
      inspired_by: $('#prodInspiredBy').value.trim() || null,
      longevity:   parseInt($('#prodLongevity').value) || 3,
      sillage:     parseInt($('#prodSillage').value) || 2,
      accords:     $('#prodAccords')?.value.trim() || null,
      main_accord: $('#prodMainAccord')?.value || null,
      seasons:     $('#prodSeasons')?.value || null,
      is_featured: $('#prodFeatured').checked,
      in_stock:    $('#prodInStock').checked,
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
        if (errMsg.includes('column') || errMsg.includes('42703') || errMsg.includes('top_notes') || errMsg.includes('brand') || errMsg.includes('main_accord') || errMsg.includes('seasons') || errMsg.includes('sale_price') || errMsg.includes('discount')) {
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
              top_notes:    payload.top_notes,
              middle_notes: payload.middle_notes,
              base_notes:   payload.base_notes,
              inspired_by:  payload.inspired_by,
              longevity:    payload.longevity,
              sillage:      payload.sillage,
              accords:      payload.accords,
              main_accord:  payload.main_accord,
              seasons:      payload.seasons,
              sale_price:   payload.sale_price,
              discount_percent: payload.discount_percent,
              discount_badge: payload.discount_badge
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
      await supaFetch('orders', {
        method: 'PATCH',
        filters: `&id=eq.${encodeURIComponent(id)}`,
        body: { status: newStatus },
      });
      const order = currentOrders.find(o => String(o.id) === String(id));
      if (order) order.status = newStatus;
    } catch (err) {
      alert('تعذر تحديث حالة الطلب: ' + err.message);
      select.className = previousClass;
      loadOrders();
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
        await supaFetch('orders', {
          method: 'DELETE',
          filters: `&id=eq.${encodeURIComponent(id)}`,
        });
        currentOrders = currentOrders.filter(o => String(o.id) !== String(id));
        renderOrders(currentOrders);
      } catch (err) {
        alert('تعذر حذف الطلب: ' + err.message);
        loadOrders();
      }
    }
  });

  // ── Manual Refresh & Search / Filter Listeners ───────────────────────────
  $('#refreshProdsBtn')?.addEventListener('click', () => loadProducts(true));
  $('#refreshOrdersBtn')?.addEventListener('click', () => loadOrders(true));
  $('#adminProdSearch')?.addEventListener('input', () => renderProductsTable());
  $('#adminCatFilter')?.addEventListener('change', () => renderProductsTable());
  $('#adminBrandFilter')?.addEventListener('change', () => renderProductsTable());

  // ── Immediate Cache Render (0ms Instant Load) ─────────────────────────────
  if (currentProducts.length) renderProductsTable(currentProducts);
  if (currentOrders.length) renderOrders(currentOrders);

  // ── Background Revalidation from Supabase ─────────────────────────────────
  loadOrders();
  loadProducts();

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
