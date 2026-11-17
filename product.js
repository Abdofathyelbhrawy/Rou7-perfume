/**
 * ROU7 PERFUME — Dedicated Product Page Controller (product.js)
 * High luxury fragrance profiling, scent pyramid, scent DNA, performance & cart
 */
(() => {
  'use strict';

  // ── Config ───────────────────────────────────────────────────
  const WHATSAPP_PHONE    = '201000603308';
  const WHATSAPP_BASE_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
  const SUPABASE_URL      = 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

  const STORAGE_KEY = 'rooh-cart';
  const THEME_KEY   = 'rooh-theme';
  const LANG_KEY    = 'rooh-lang';
  const CACHE_KEY   = 'rooh-cached-products';

  // ── i18n Dictionary ──────────────────────────────────────────
  const I18N = {
    ar: {
      site_title: 'رُوح | Rou7 Perfume — تفاصيل العطر',
      announcement: 'شحن لجميع المحافظات · دفع عند الاستلام · ضمان الثبات والفوحان',
      nav_home: 'الرئيسية',
      nav_collection: 'تسوق العطور',
      nav_story: 'حكايتنا',
      nav_contact: 'تواصل معنا',
      cat_default: 'عطر فاخر · للجميع',
      stock_in: 'متوفر في المخزون ✓',
      stock_out: 'غير متوفر حالياً',
      inspired_by_label: 'INSPIRED BY',
      add_to_bag: 'أضف إلى السلة',
      wa_order_btn: 'طلب مباشر عبر WhatsApp',
      analysis_eyebrow: 'تحليل عميق ومفصل',
      analysis_heading: 'البصمة العطرية <em>والهرم العطري</em>',
      analysis_subtext: 'اكتشف تدرّج العطر على بشرتك مع الوقت ونسب مكوناته ودرجات أدائه وثباته.',
      pyramid_title: 'Scent pyramid',
      pyramid_subtitle: 'المكونات وتدرجها الزمني',
      top_title: 'قمة العطر (Top)',
      top_time: 'أول 15 دقيقة',
      heart_title: 'قلب العطر (Heart)',
      heart_time: '15 دقيقة إلى 3 ساعات',
      base_title: 'قاعدة العطر (Base)',
      base_time: 'بعد 3 ساعات وأكثر',
      dna_title: 'Scent DNA',
      dna_subtitle: 'مركب من أبرز العناصر والأكوردات',
      dna_main_label: 'العنصر الأساسي',
      perf_title: 'Performance',
      perf_subtitle: 'تقييم الثبات والفوحان',
      longevity_tag: 'LONGEVITY · الثبات',
      sillage_tag: 'SILLAGE · الفوحان',
      related_eyebrow: 'مجموعات مختارة',
      related_heading: 'عطور أخرى <em>قد تلامس روحك</em>',
      view_fragrance: 'تفاصيل العطر',
      bag_title: 'حقيبة التسوق',
      bag_empty_title: 'حقيبتك فارغة الآن',
      bag_empty_text: 'استكشف مجموعتنا واختر عطرك المفضل.',
      bag_empty_btn: 'تصفح المجموعة',
      total_label: 'الإجمالي',
      checkout_btn: 'إتمام الطلب الآن',
      checkout_note: 'الدفع عند الاستلام · تأكيد عبر واتساب',
      footer_tagline: 'عطر يلامس أعماقك.<br>رائحة تُشبهك، وذكرى تبقى.',
      footer_rights: '© ٢٠٢٦ رُوح | Rou7-perfume. جميع الحقوق محفوظة.',
      footer_made: 'صُنع بحب في مصر <b>✳</b>',
      toast_added: 'تمت إضافة العطر إلى الحقيبة ✳',
      toast_qty_err: 'يرجى اختيار كمية صحيحة',
      currency: 'ج.م',
      spray_btn_text: 'بخّة الرذاذ واختبار الفوحان',
      spray_hint: 'انقر على الزجاجة أو الزر لبخّ العطر واستكشاف النوتات',
      sillage_beast: 'فوحان استثنائي (Beast Mode)',
      sillage_beast_desc: 'انتشار محيطي واسع يملأ المكان حتى ٣+ أمتار',
      sillage_strong: 'فوحان قوي جداً وملحوظ',
      sillage_strong_desc: 'انتشار محيطي مميز حتى ٢-٣ أمتار ويترك بصمة واضحة',
      sillage_moderate: 'فوحان متوازن وملحوظ',
      sillage_moderate_desc: 'حضور ناعم وواضح لمسافة ١-٢ متر',
      sillage_intimate: 'فوحان هادئ وقريب',
      sillage_intimate_desc: 'يداعب البشرة بنعومة ومثالي للمسافات القريبة',
      wa_inquiry_msg: 'مرحباً رُوح، أود الاستفسار عن عطوركم 🌸',
      wa_order_template: (name, qty, price) => `مرحباً رُوح، أود طلب عطر "${name}" عدد (${qty}) عبوة.\nالقيمة الإجمالية: ${price} ج.م.\nبرجاء تأكيد الطلب ومعلومات الشحن.`
    },
    en: {
      site_title: 'Rou7 Perfume — Fragrance Profile',
      announcement: 'Nationwide Delivery · Cash on Delivery · Guaranteed Longevity & Sillage',
      nav_home: 'Home',
      nav_collection: 'Shop Fragrances',
      nav_story: 'Our Story',
      nav_contact: 'Contact',
      cat_default: 'Luxury Fragrance · Unisex',
      stock_in: 'In Stock ✓',
      stock_out: 'Out of Stock',
      inspired_by_label: 'INSPIRED BY',
      add_to_bag: 'Add to Bag',
      wa_order_btn: 'Direct Order via WhatsApp',
      spray_btn_text: 'Spray Mist & Test Sillage',
      spray_hint: 'Click the bottle or button to spray and discover floating notes',
      sillage_beast: 'Beast Mode Sillage',
      sillage_beast_desc: 'Massive projection filling the entire room (3+ meters)',
      sillage_strong: 'Very Strong Sillage',
      sillage_strong_desc: 'Radiant projection reaching 2-3 meters with strong trail',
      sillage_moderate: 'Balanced Sillage',
      sillage_moderate_desc: 'Pleasant aura projecting 1-2 meters around you',
      sillage_intimate: 'Intimate Sillage',
      sillage_intimate_desc: 'Soft and close to the skin, ideal for personal moments',
      analysis_eyebrow: 'Deep Fragrance Analysis',
      analysis_heading: 'Scent DNA <em>& Fragrance Pyramid</em>',
      analysis_subtext: 'Discover the evolution of the fragrance on your skin, key notes, and tested performance.',
      pyramid_title: 'Scent pyramid',
      pyramid_subtitle: 'Tap any note to learn how it smells.',
      top_title: 'Top',
      top_time: 'First 15 min',
      heart_title: 'Heart',
      heart_time: '15 min to 3 h',
      base_title: 'Base',
      base_time: '3 h and more',
      dna_title: 'Scent DNA',
      dna_subtitle: 'Built from its main accords.',
      dna_main_label: 'Main accord',
      perf_title: 'Performance',
      perf_subtitle: 'Tested and rated by our team.',
      longevity_tag: 'LONGEVITY',
      sillage_tag: 'SILLAGE',
      related_eyebrow: 'Curated Selections',
      related_heading: 'Other Fragrances <em>You Might Love</em>',
      view_fragrance: 'View Fragrance',
      bag_title: 'Shopping Bag',
      bag_empty_title: 'Your bag is empty',
      bag_empty_text: 'Explore our collection and pick your signature scent.',
      bag_empty_btn: 'Browse Fragrances',
      total_label: 'Total',
      checkout_btn: 'Proceed to Checkout',
      checkout_note: 'Cash on delivery · Order confirmation via WhatsApp',
      footer_tagline: 'In every note a story, in every trace a memory.<br>A scent crafted to resemble you.',
      footer_rights: '© 2026 Rou7-perfume. All rights reserved.',
      footer_made: 'Crafted with love in Egypt <b>✳</b>',
      toast_added: 'Added to your shopping bag ✳',
      toast_qty_err: 'Please select a valid quantity',
      currency: 'EGP',
      wa_inquiry_msg: 'Hello Rou7-perfume, I would like to inquire about your fragrances 🌸',
      wa_order_template: (name, qty, price) => `Hello Rou7-perfume, I would like to order "${name}" (Quantity: ${qty}).\nTotal Price: ${price} EGP.\nPlease confirm order and shipping details.`
    }
  };

  // ── Accord Color Palette ─────────────────────────────────────
  const ACCORD_PALETTE = {
    sweet:    { color: '#EC407A', en: 'Sweet',    ar: 'حلو وسكري' },
    woody:    { color: '#8B5A2B', en: 'Woody',    ar: 'خشبي دافئ' },
    vanilla:  { color: '#D4A373', en: 'Vanilla',  ar: 'فانيليا ناعمة' },
    oriental: { color: '#8E24AA', en: 'Oriental', ar: 'شرقي فاخر' },
    amber:    { color: '#C58F28', en: 'Amber',    ar: 'عنبري دافئ' },
    spicy:    { color: '#E65100', en: 'Spicy',    ar: 'توابل دافئة' },
    fresh:    { color: '#00ACC1', en: 'Fresh',    ar: 'منعش ونقي' },
    floral:   { color: '#E91E63', en: 'Floral',   ar: 'زهري راقي' },
    powdery:  { color: '#78909C', en: 'Powdery',  ar: 'بودري مخملي' },
    aromatic: { color: '#43A047', en: 'Aromatic', ar: 'أروماتك' },
    citrus:   { color: '#FBC02D', en: 'Citrus',   ar: 'حمضيات منعشة' },
    leather:  { color: '#5D4037', en: 'Leather',  ar: 'جلود فاخرة' },
    musky:    { color: '#90A4AE', en: 'Musky',    ar: 'مسكي ناعم' },
    fruity:   { color: '#FB8C00', en: 'Fruity',   ar: 'فاكهي جذاب' },
    smoky:    { color: '#546E7A', en: 'Smoky',    ar: 'دخاني وبخور' },
    aquatic:  { color: '#0288D1', en: 'Aquatic',  ar: 'مائي صيفي' }
  };

  const DEFAULT_COLORS = ['#8B5A2B', '#E65100', '#43A047', '#00ACC1', '#D4A373', '#EC407A', '#8E24AA'];

  function resolveAccordStyle(name) {
    const raw = String(name || '').toLowerCase().trim();
    for (const key of Object.keys(ACCORD_PALETTE)) {
      if (raw.includes(key) || (ACCORD_PALETTE[key].ar && raw.includes(ACCORD_PALETTE[key].ar))) {
        return ACCORD_PALETTE[key];
      }
    }
    // Fallback based on string hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) hash = (hash << 5) - hash + raw.charCodeAt(i);
    const color = DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
    return { color, en: name, ar: name };
  }

  // ── State ────────────────────────────────────────────────────
  let currentLang = localStorage.getItem(LANG_KEY) || 'ar';
  let allProducts = [];
  let currentProduct = null;
  let cart = [];
  let currentQty = 1;
  let campaignSettings = null;
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

  const DEFAULT_FALLBACK_PRODUCT = {
    id: 'd6973def-50dd-4e75-8005-8ee22eb23872',
    name: 'نود كورال دايموند',
    latin: 'Nude Coral Diamond',
    brand: 'Matière Première',
    price: 1600,
    tag: 'الأكثر طلباً · Best Seller',
    category: 'عطور شرقية',
    image_url: 'https://oyslbombgdvcoyqotyao.supabase.co/storage/v1/object/public/products/rooh_1794685786337_Nude_Coral_Diam.png',
    in_stock: true,
    notes: 'عطر يأخذ الصدارة كنغمة مضيئة في سيمفونية الغروب. يرقص البرغموت مع الزعفران، تلتقي بهما زهرة البرتقال وجوز الهند، بينما دفء الكشميران والفانيليا يكتمل بهما هذا الأثر العطري البديع.',
    top_notes: 'Bergamot, Apple, Saffron',
    middle_notes: 'Orange Blossom, Coconut, Guaiac Wood',
    base_notes: 'Vanilla, Amber, Cashmeran',
    inspired_by: 'Vanilla Powder - Matière Première',
    longevity: 4,
    sillage: 4,
    main_accord: 'Vanilla',
    accords: 'Vanilla, Sweet, Oriental, Powdery, Amber',
    seasons: 'winter,fall,night'
  };

  // ── Safe Fault-Tolerant DOM & Event Helpers ───────────────────
  const $ = sel => {
    try { return document.querySelector(sel); } catch (_) { return null; }
  };
  const $$ = sel => {
    try { return [...document.querySelectorAll(sel)]; } catch (_) { return []; }
  };

  function safeOn(target, event, handler, options) {
    if (!target) return;
    try {
      const elements = typeof target === 'string'
        ? $$(target)
        : (target instanceof NodeList || Array.isArray(target) ? target : [target]);
      elements.forEach(el => {
        if (el && typeof el.addEventListener === 'function') {
          el.addEventListener(event, function(e) {
            try {
              return handler.call(this, e);
            } catch (err) {
              console.warn(`[Product Page Event Notice (${event})]:`, err);
            }
          }, options);
        }
      });
    } catch (_) {}
  }

  // Early loader dismissal failsafe
  setTimeout(() => {
    const ldr = document.getElementById('loader');
    if (ldr && !ldr.classList.contains('done')) ldr.classList.add('done');
  }, 400);

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function arabicDigits(num) {
    return String(num).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }

  function money(num) {
    const val = Number(num || 0).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    return currentLang === 'ar' ? `${val} ج.م` : `${val} EGP`;
  }

  function showToast(text) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ── Unpack Product Meta (Supabase columns + JSON fallback) ───
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
      desc:         localizedDesc || (meta.desc !== undefined ? meta.desc : (p.notes || '')),
      notes:        localizedDesc || (meta.desc !== undefined ? meta.desc : (p.notes || '')),
      top_notes:    localizedTop || p.top_notes || meta.top_notes || '',
      middle_notes: localizedMid || p.middle_notes || meta.middle_notes || '',
      base_notes:   localizedBase || p.base_notes || meta.base_notes || '',
      inspired_by:  p.inspired_by || meta.inspired_by || '',
      longevity:    parseInt(p.longevity || meta.longevity) || 4,
      sillage:      parseInt(p.sillage || meta.sillage) || 3,
      accords:      p.accords || meta.accords || '',
      main_accord:  p.main_accord || meta.main_accord || '',
      seasons:      p.seasons || meta.seasons || '',
      sale_price:   p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : (meta.sale_price !== undefined ? meta.sale_price : ''),
      discount_percent: p.discount_percent || meta.discount_percent || '',
      discount_badge:   p.discount_badge || meta.discount_badge || '',
      brand:        p.brand || meta.brand || '',
      stock_quantity: p.stock_quantity !== undefined && p.stock_quantity !== null ? p.stock_quantity : (meta.stock_quantity !== undefined && meta.stock_quantity !== null ? meta.stock_quantity : ''),
      images:       Array.isArray(p.images) && p.images.length ? p.images : (Array.isArray(meta.images) && meta.images.length ? meta.images : (p.image_url ? [p.image_url] : []))
    };
  }

  // ── Pricing & Discount Engine ────────────────────────────────
  function computeProductPrice(p, campaignData = campaignSettings) {
    if (!p) return { price: 0, originalPrice: 0, hasDiscount: false, discountPercent: 0, discountBadge: '', savedAmount: 0 };

    const originalPrice = Number(p.price || 0);
    const d = unpackProduct(p);

    const rawSale = Number(p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : d.sale_price);
    const hasCustomSale = Boolean(rawSale && rawSale > 0 && rawSale < originalPrice);

    const camp = campaignData || campaignSettings || {};
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

  // ── Supabase Fetch Helper ────────────────────────────────────
  async function supaFetch(table, { filters = '' } = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${filters}`, {
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ── Master Accords & Seasons Catalog ────────────────────────
  const MASTER_ACCORDS = [
    { key: 'sweet',        nameEn: 'Sweet',        nameAr: 'حلو وسكري',     color: '#EC407A', keywords: ['sweet', 'حلو', 'سكر', 'كراميل', 'caramel', 'tonka', 'honey', 'عسل'], baseWeight: 90 },
    { key: 'woody',        nameEn: 'Woody',        nameAr: 'خشبي دافئ',     color: '#8B5A2B', keywords: ['wood', 'خشب', 'صندل', 'أرز', 'عود', 'cedar', 'sandalwood', 'guaiac', 'oud'], baseWeight: 84 },
    { key: 'vanilla',      nameEn: 'Vanilla',      nameAr: 'فانيليا ناعمة', color: '#D4A373', keywords: ['vanilla', 'فانيليا', 'بوربون'], baseWeight: 86 },
    { key: 'oriental',     nameEn: 'Oriental',     nameAr: 'شرقي فاخر',     color: '#8E24AA', keywords: ['oriental', 'شرق', 'بخور', 'incense'], baseWeight: 82 },
    { key: 'amber',        nameEn: 'Amber',        nameAr: 'عنبري دافئ',    color: '#C58F28', keywords: ['amber', 'عنبر'], baseWeight: 80 },
    { key: 'spicy',        nameEn: 'Spicy',        nameAr: 'توابل دافئة',   color: '#E65100', keywords: ['spic', 'توابل', 'حار', 'زعفران', 'فلفل', 'هيل', 'saffron', 'pepper', 'cardamom', 'cinnamon'], baseWeight: 78 },
    { key: 'warm-spicy',   nameEn: 'Warm Spicy',   nameAr: 'توابل دافئة',   color: '#E65100', keywords: ['warm spicy', 'قرفة', 'cinnamon', 'nutmeg', 'جوزة الطيب'], baseWeight: 80 },
    { key: 'fresh-spicy',  nameEn: 'Fresh Spicy',  nameAr: 'توابل منعشة',   color: '#FF7043', keywords: ['fresh spicy', 'زنجبيل', 'ginger', 'pink pepper'], baseWeight: 74 },
    { key: 'fresh',        nameEn: 'Fresh',        nameAr: 'منعش ونقي',     color: '#00ACC1', keywords: ['fresh', 'منعش', 'نقي', 'انتعاش'], baseWeight: 75 },
    { key: 'floral',       nameEn: 'Floral',       nameAr: 'زهري راقي',     color: '#E91E63', keywords: ['floral', 'زهر', 'ورد', 'ياسمين', 'rose', 'jasmine', 'blossom', 'neroli'], baseWeight: 76 },
    { key: 'white-floral', nameEn: 'White Floral', nameAr: 'زهور بيضاء',   color: '#F06292', keywords: ['white floral', 'فل', 'tuberose', 'gardenia', 'تيوب روز'], baseWeight: 77 },
    { key: 'powdery',      nameEn: 'Powdery',      nameAr: 'بودري مخملي',   color: '#78909C', keywords: ['powder', 'بودر', 'كشميران', 'cashmeran', 'مسك', 'musk', 'iris'], baseWeight: 70 },
    { key: 'aromatic',     nameEn: 'Aromatic',     nameAr: 'أروماتك',       color: '#43A047', keywords: ['aromatic', 'أروماتك', 'خزامى', 'لافندر', 'lavender', 'cypress'], baseWeight: 68 },
    { key: 'citrus',       nameEn: 'Citrus',       nameAr: 'حمضيات منعشة', color: '#FBC02D', keywords: ['citrus', 'حمض', 'برغموت', 'ليمون', 'bergamot', 'grapefruit'], baseWeight: 72 },
    { key: 'leather',      nameEn: 'Leather',      nameAr: 'جلود فاخرة',   color: '#5D4037', keywords: ['leather', 'جلود', 'جلد'], baseWeight: 66 },
    { key: 'musky',        nameEn: 'Musky',        nameAr: 'مسكي ناعم',     color: '#90A4AE', keywords: ['musk', 'مسك', 'مسكي'], baseWeight: 65 },
    { key: 'fruity',       nameEn: 'Fruity',       nameAr: 'فاكهي جذاب',    color: '#FB8C00', keywords: ['fruit', 'فاكه', 'توت', 'تفاح', 'apple', 'peach', 'berry'], baseWeight: 64 },
    { key: 'smoky',        nameEn: 'Smoky',        nameAr: 'دخاني وبخور',   color: '#546E7A', keywords: ['smok', 'دخان', 'بخور', 'قطران'], baseWeight: 62 },
    { key: 'aquatic',      nameEn: 'Aquatic',      nameAr: 'مائي صيفي',     color: '#0288D1', keywords: ['aquat', 'مائي', 'بحر', 'ocean', 'marine'], baseWeight: 60 },
    { key: 'oud',          nameEn: 'Oud',          nameAr: 'عودي فاخر',     color: '#4A2C11', keywords: ['oud', 'عود', 'أغار'], baseWeight: 85 },
    { key: 'tobacco',      nameEn: 'Tobacco',      nameAr: 'تبغ دافئ',     color: '#795548', keywords: ['tobacco', 'تبغ'], baseWeight: 78 },
    { key: 'earthy',       nameEn: 'Earthy',       nameAr: 'ترابي وباتشولي',color: '#6D4C41', keywords: ['earthy', 'تراب', 'باتشولي', 'patchouli'], baseWeight: 70 },
    { key: 'balsamic',     nameEn: 'Balsamic',     nameAr: 'بلسمي وراتنج',  color: '#8D6E63', keywords: ['balsamic', 'بلسم', 'راتنج', 'مر', 'benzoin'], baseWeight: 72 },
    { key: 'caramel',      nameEn: 'Caramel',      nameAr: 'كراميل وعسل',   color: '#FFA726', keywords: ['caramel', 'كراميل', 'عسل', 'honey', 'gourmand'], baseWeight: 80 }
  ];

  const MASTER_SEASONS = [
    { key: 'winter', icon: '❄️', ar: 'شتاء',  en: 'Winter' },
    { key: 'fall',   icon: '🍂', ar: 'خريف',  en: 'Fall' },
    { key: 'spring', icon: '🌸', ar: 'ربيع',  en: 'Spring' },
    { key: 'summer', icon: '☀️', ar: 'صيف',   en: 'Summer' },
    { key: 'night',  icon: '🌙', ar: 'ليلي',  en: 'Night' },
    { key: 'day',    icon: '☀️', ar: 'نهاري', en: 'Day' }
  ];

  function findMasterAccord(nameOrKey) {
    if (!nameOrKey) return null;
    const raw = String(nameOrKey).toLowerCase().trim();
    for (const acc of MASTER_ACCORDS) {
      if (acc.key === raw || acc.nameEn.toLowerCase() === raw || acc.nameAr === raw ||
          raw.includes(acc.key) || raw.includes(acc.nameEn.toLowerCase()) || raw.includes(acc.nameAr)) {
        return acc;
      }
    }
    return null;
  }

  function parseSeasons(seasonsStr, accordsStr = '') {
    const raw = String(seasonsStr || '').toLowerCase().trim();
    const found = [];

    if (raw) {
      for (const s of MASTER_SEASONS) {
        if (raw.includes(s.key) || raw.includes(s.ar) || raw.includes(s.en.toLowerCase())) {
          if (!found.some(item => item.key === s.key)) {
            found.push(s);
          }
        }
      }
    }

    if (found.length) return found;

    // Intelligent fallback only if accords explicitly hint at seasons
    const accLow = String(accordsStr || '').toLowerCase();
    if (accLow.includes('fresh') || accLow.includes('citrus') || accLow.includes('aquatic') || accLow.includes('منعش') || accLow.includes('صيفي')) {
      return [
        MASTER_SEASONS.find(s => s.key === 'summer'),
        MASTER_SEASONS.find(s => s.key === 'spring')
      ].filter(Boolean);
    }

    if (accLow.includes('oud') || accLow.includes('leather') || accLow.includes('tobacco') || accLow.includes('spicy') || accLow.includes('دافئ')) {
      return [
        MASTER_SEASONS.find(s => s.key === 'winter'),
        MASTER_SEASONS.find(s => s.key === 'night')
      ].filter(Boolean);
    }

    return [];
  }

  // ── Intelligent Fragrance Accords Extractor ──────────────────
  function extractAccords(d, p) {
    const list = [];
    const usedKeys = new Set();

    // 1. If admin set an explicit main_accord, place it first in the list
    if (d.main_accord) {
      const mainAcc = findMasterAccord(d.main_accord);
      if (mainAcc) {
        list.push({ ...mainAcc, score: 96 });
        usedKeys.add(mainAcc.key);
      } else {
        const customStyle = resolveAccordStyle(d.main_accord);
        list.push({
          key: d.main_accord.toLowerCase().replace(/\s+/g, '-'),
          nameEn: d.main_accord,
          nameAr: d.main_accord,
          color: customStyle.color,
          score: 96
        });
        usedKeys.add(d.main_accord.toLowerCase());
      }
    }

    // 2. If admin selected accords, append them in order
    if (d.accords) {
      const parts = String(d.accords).split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
      const scores = [86, 74, 60, 46, 34, 25];
      let scoreIdx = list.length;
      for (const part of parts) {
        const found = findMasterAccord(part);
        if (found) {
          if (!usedKeys.has(found.key)) {
            list.push({ ...found, score: scores[scoreIdx] || 40 });
            usedKeys.add(found.key);
            scoreIdx++;
          }
        } else {
          const lower = part.toLowerCase();
          if (!usedKeys.has(lower)) {
            const style = resolveAccordStyle(part);
            list.push({
              key: lower,
              nameEn: part,
              nameAr: part,
              color: style.color,
              score: scores[scoreIdx] || 40
            });
            usedKeys.add(lower);
            scoreIdx++;
          }
        }
      }
    }

    // CRITICAL: If the admin specified accords or main_accord, return ONLY what the admin specified!
    if (list.length > 0) {
      return list;
    }

    // 3. Fallback ONLY if the perfume has NO accords and NO main_accord at all:
    const textToScan = `${d.desc || ''} ${d.top_notes || ''} ${d.middle_notes || ''} ${d.base_notes || ''} ${d.inspired_by || ''}`.toLowerCase();
    const matched = [];
    for (const acc of MASTER_ACCORDS) {
      if (usedKeys.has(acc.key)) continue;
      let score = 0;
      for (const kw of acc.keywords) {
        if (textToScan.includes(kw)) score += 20;
      }
      if (score > 0) {
        matched.push({ ...acc, score: Math.min(85, acc.baseWeight + score) });
      }
    }
    matched.sort((a, b) => b.score - a.score);
    for (const m of matched) {
      list.push(m);
      usedKeys.add(m.key);
      if (list.length >= 4) break;
    }

    if (list.length > 0) return list;

    // Minimal fallback
    return [
      MASTER_ACCORDS.find(a => a.key === 'woody') || MASTER_ACCORDS[0],
      MASTER_ACCORDS.find(a => a.key === 'amber') || MASTER_ACCORDS[1]
    ];
  }

  // ── Render Product Page ──────────────────────────────────────
  function renderProductDetails(p) {
    if (!p) return;
    currentProduct = p;
    const d = unpackProduct(p);
    const t = I18N[currentLang];

    const prodName = currentLang === 'en' ? (p.latin || p.name) : p.name;
    const prodSub  = currentLang === 'en' ? (p.latin ? p.name : '') : (p.latin || '');

    // Title & Meta
    document.title = `${prodName} — ${t.site_title}`;
    $('#bcProductName').textContent = prodName;

    // Visual Stage
    const heroImg = $('#prodHeroImage');
    heroImg.src = p.image_url || 'assets/branding/2.svg';
    heroImg.alt = prodName;

    // Multi-Image Gallery Strip
    const galleryStrip = $('#prodGalleryStrip');
    const imagesList = Array.isArray(d.images) && d.images.length
      ? d.images
      : (Array.isArray(p.images) && p.images.length
        ? p.images
        : (p.image_url ? [p.image_url] : []));

    if (galleryStrip) {
      if (imagesList.length > 1) {
        galleryStrip.hidden = false;
        galleryStrip.innerHTML = imagesList.map((imgSrc, idx) => `
          <button type="button" class="pdp-gallery-thumb ${idx === 0 ? 'active' : ''}" data-src="${escapeHtml(imgSrc)}" aria-label="صورة ${idx + 1}">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(prodName)} - ${idx + 1}" loading="lazy">
          </button>
        `).join('');

        galleryStrip.querySelectorAll('.pdp-gallery-thumb').forEach(btn => {
          btn.addEventListener('click', () => {
            galleryStrip.querySelectorAll('.pdp-gallery-thumb').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetSrc = btn.getAttribute('data-src');
            if (targetSrc && heroImg.src !== targetSrc) {
              heroImg.style.opacity = '0';
              setTimeout(() => {
                heroImg.src = targetSrc;
                heroImg.style.opacity = '1';
              }, 120);
            }
          });
        });
      } else {
        galleryStrip.hidden = true;
        galleryStrip.innerHTML = '';
      }
    }

    const badgeTag = $('#prodBadgeTag');
    if (p.tag) {
      badgeTag.textContent = p.tag;
      badgeTag.hidden = false;
    } else {
      badgeTag.hidden = true;
    }

    // Floating notes around bottle
    renderFloatingNotes(d);

    // Info Column
    $('#prodCategoryPill').textContent = p.category ? `${p.category} · ${t.cat_default}` : t.cat_default;
    const brandPill = $('#prodBrandPill');
    if (brandPill) {
      const bObj = findBrand(d.brand || p.brand);
      const bDisplay = bObj ? (currentLang === 'en' ? (bObj.name_en || bObj.name_ar) : (bObj.name_ar || bObj.name_en)) : (d.brand || p.brand);
      if (bDisplay && bDisplay.trim()) {
        const logoHtml = bObj && bObj.logo_url
          ? `<img src="${escapeHtml(bObj.logo_url)}" alt="" class="brand-pill-logo" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-inline-end:5px;border-radius:2px;">`
          : '';
        brandPill.innerHTML = `${logoHtml}<span>${escapeHtml(bDisplay.trim())}</span>`;
        brandPill.hidden = false;
      } else {
        brandPill.hidden = true;
      }
    }
    const pricing = computeProductPrice(p, campaignSettings);
    $('#prodMainTitle').textContent = prodName;
    $('#prodLatinTitle').textContent = prodSub;

    const prodPriceTag = $('#prodPriceTag');
    const prodOldPrice = $('#prodOldPrice');
    const prodDiscountPill = $('#prodDiscountPill');

    if (prodPriceTag) prodPriceTag.textContent = money(pricing.price);

    if (pricing.hasDiscount) {
      if (prodOldPrice) {
        prodOldPrice.textContent = money(pricing.originalPrice);
        prodOldPrice.style.display = 'inline-block';
      }
      if (prodDiscountPill) {
        prodDiscountPill.textContent = currentLang === 'ar' ? `وفر ${money(pricing.savedAmount)} (${pricing.discountBadge})` : `Save ${money(pricing.savedAmount)} (${pricing.discountBadge})`;
        prodDiscountPill.style.display = 'inline-flex';
      }
    } else {
      if (prodOldPrice) prodOldPrice.style.display = 'none';
      if (prodDiscountPill) prodDiscountPill.style.display = 'none';
    }

    const isOutOfStock = (p.in_stock === false) || (d.stock_quantity !== '' && d.stock_quantity !== undefined && parseInt(d.stock_quantity) <= 0);
    const stockBadge = $('#prodStockBadge');
    if (stockBadge) {
      if (isOutOfStock) {
        stockBadge.textContent = t.stock_out;
        stockBadge.style.color = '#ff4757';
        stockBadge.style.background = 'rgba(255, 71, 87, 0.15)';
      } else {
        const stockNum = parseInt(d.stock_quantity);
        if (!isNaN(stockNum) && stockNum <= 5 && stockNum > 0) {
          stockBadge.textContent = currentLang === 'ar' ? `متبقي في المخزون ${arabicDigits(stockNum)} قطع فقط! ⏳` : `Only ${stockNum} left in stock! ⏳`;
          stockBadge.style.color = '#ffa502';
          stockBadge.style.background = 'rgba(255, 165, 2, 0.15)';
        } else {
          stockBadge.textContent = t.stock_in;
          stockBadge.style.color = '';
          stockBadge.style.background = '';
        }
      }
    }

    const pdpAddBagBtn = $('#pdpAddBagBtn');
    const smAddBtn = $('#smAddBtn');
    if (isOutOfStock) {
      if (pdpAddBagBtn) {
        pdpAddBagBtn.disabled = true;
        pdpAddBagBtn.style.opacity = '0.65';
        pdpAddBagBtn.style.cursor = 'not-allowed';
        pdpAddBagBtn.innerHTML = `<span>${currentLang === 'ar' ? 'نفد من المخزون' : 'Out of Stock'}</span> <span>✕</span>`;
      }
      if (smAddBtn) {
        smAddBtn.disabled = true;
        smAddBtn.style.opacity = '0.65';
        smAddBtn.style.cursor = 'not-allowed';
        smAddBtn.innerHTML = `<span>${currentLang === 'ar' ? 'نفد من المخزون' : 'Out of Stock'}</span> <span>✕</span>`;
      }
    } else {
      if (pdpAddBagBtn) {
        pdpAddBagBtn.disabled = false;
        pdpAddBagBtn.style.opacity = '';
        pdpAddBagBtn.style.cursor = '';
        pdpAddBagBtn.innerHTML = `<span data-i18n="add_to_bag">${t.add_to_bag}</span> <span>＋</span>`;
      }
      if (smAddBtn) {
        smAddBtn.disabled = false;
        smAddBtn.style.opacity = '';
        smAddBtn.style.cursor = '';
        smAddBtn.innerHTML = `<span data-i18n="add_to_bag">${t.add_to_bag}</span> <span>＋</span>`;
      }
    }

    // Inspired By Card
    const inspiredCard = $('#pdpInspiredCard');
    const inspiredName = $('#pdpInspiredName');
    if (d.inspired_by && d.inspired_by.trim()) {
      inspiredName.textContent = d.inspired_by.trim();
      inspiredCard.hidden = false;
    } else {
      inspiredCard.hidden = true;
    }

    // Poetic Description
    const localized = window.PerfumeI18n ? window.PerfumeI18n.getLocalizedProduct(p, currentLang) : null;
    const defaultDesc = currentLang === 'ar'
      ? 'عطر فاخر صُنع بعناية ليعكس حضورك المتميز ويترك أثراً لا يُنسى في كل لحظة.'
      : 'An exquisite fragrance meticulously blended to reflect your unique presence and leave an indelible impression.';
    $('#prodDescriptionText').textContent = (localized && localized.desc) ? localized.desc : (d.desc || defaultDesc);

    // Quick Accords in Hero
    renderHeroAccords(d, p);

    // Update sticky mobile bar metadata
    const smThumb = $('#smThumb');
    const smTitle = $('#smTitle');
    const smPrice = $('#smPrice');
    if (smThumb) smThumb.src = p.image_url || 'assets/branding/2.svg';
    if (smTitle) smTitle.textContent = prodName;
    if (smPrice) {
      smPrice.innerHTML = pricing.hasDiscount
        ? `<span class="sm-sale">${money(pricing.price)}</span> <del class="sm-old">${money(pricing.originalPrice)}</del>`
        : money(pricing.price);
    }

    // Scent Pyramid Card
    renderScentPyramid(d);

    // Scent DNA Card
    renderScentDNA(d, p);

    // Performance Card
    renderPerformance(d, p);

    // WhatsApp Direct Order button link
    updateWaOrderLink();

    // Related Fragrances
    renderRelatedFragrances();
  }

  // ── Floating Notes ───────────────────────────────────────────
  function renderFloatingNotes(d) {
    const container = $('#prodFloatingNotes');
    if (!container) return;

    const rawStr = `${d.top_notes}, ${d.middle_notes}`;
    const localizedStr = window.PerfumeI18n ? window.PerfumeI18n.translateNotes(rawStr, currentLang) : rawStr;
    const rawNotes = localizedStr.split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
    const notesToShow = rawNotes.slice(0, 4);

    if (!notesToShow.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = notesToShow.map((note, idx) => {
      const style = resolveAccordStyle(note);
      return `
        <div class="p-float-badge" style="animation-delay: ${(idx * 1.1).toFixed(1)}s">
          <span class="dot" style="background:${style.color}; box-shadow: 0 0 8px ${style.color}"></span>
          <span>${escapeHtml(note)}</span>
        </div>
      `;
    }).join('');
  }

  // ── Hero Quick Accords ───────────────────────────────────────
  function renderHeroAccords(d, p) {
    const container = $('#prodQuickAccords');
    if (!container) return;

    const rich = extractAccords(d, p).slice(0, 4);
    container.innerHTML = rich.map(acc => {
      const label = currentLang === 'ar' ? acc.nameAr : acc.nameEn;
      return `
        <span class="accord-pill">
          <span class="accord-pill-dot" style="background:${acc.color}"></span>
          <span>${escapeHtml(label)}</span>
        </span>
      `;
    }).join('');
  }

  // ── Scent Pyramid ────────────────────────────────────────────
  function renderScentPyramid(d) {
    const t = I18N[currentLang];

    // Update level meta names & times
    const topName = $('#topLevelName');
    const topTime = $('#topLevelTime');
    const heartName = $('#heartLevelName');
    const heartTime = $('#heartLevelTime');
    const baseName = $('#baseLevelName');
    const baseTime = $('#baseLevelTime');

    if (topName) topName.textContent = t.top_title;
    if (topTime) topTime.innerHTML = `<bdi>${t.top_time}</bdi>`;
    if (heartName) heartName.textContent = t.heart_title;
    if (heartTime) heartTime.innerHTML = `<bdi>${t.heart_time}</bdi>`;
    if (baseName) baseName.textContent = t.base_title;
    if (baseTime) baseTime.innerHTML = `<bdi>${t.base_time}</bdi>`;

    function populateLevel(containerId, rowId, notesString, defaultNotes) {
      const container = $(`#${containerId}`);
      const row = $(`#${rowId}`);
      if (!container) return;

      const items = (notesString || defaultNotes || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
      if (!items.length) {
        if (row) row.style.display = 'none';
        return;
      }
      if (row) row.style.display = 'flex';

      container.innerHTML = items.map(note => {
        const st = resolveAccordStyle(note);
        return `
          <button type="button" class="note-pill" data-note="${escapeHtml(note)}">
            <span class="note-pill-dot" style="background:${st.color}"></span>
            <span>${escapeHtml(note)}</span>
          </button>
        `;
      }).join('');
    }

    const localized = window.PerfumeI18n && currentProduct ? window.PerfumeI18n.getLocalizedProduct(currentProduct, currentLang) : null;
    const topNotesToRender = (localized && localized.top_notes) ? localized.top_notes : (window.PerfumeI18n ? window.PerfumeI18n.translateNotes(d.top_notes, currentLang) : d.top_notes);
    const midNotesToRender = (localized && localized.middle_notes) ? localized.middle_notes : (window.PerfumeI18n ? window.PerfumeI18n.translateNotes(d.middle_notes, currentLang) : d.middle_notes);
    const baseNotesToRender = (localized && localized.base_notes) ? localized.base_notes : (window.PerfumeI18n ? window.PerfumeI18n.translateNotes(d.base_notes, currentLang) : d.base_notes);

    populateLevel('topPillsContainer', 'topLevelRow', topNotesToRender, currentLang === 'ar' ? 'برغموت، هيل، زهور بيضاء' : 'Bergamot, Cardamom, White Flowers');
    populateLevel('heartPillsContainer', 'heartLevelRow', midNotesToRender, currentLang === 'ar' ? 'فلفل وردي، خشب الأرز، ياسمين' : 'Pink Pepper, Cedarwood, Jasmine');
    populateLevel('basePillsContainer', 'baseLevelRow', baseNotesToRender, currentLang === 'ar' ? 'فانيليا، عنبر، خشب الصندل' : 'Vanilla, Amber, Sandalwood');

    // Attach click feedback on note pills
    $$('.note-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.note-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const noteName = btn.dataset.note;
        const inspector = $('#pyramidInspector');
        if (inspector) {
          const st = resolveAccordStyle(noteName);
          const descriptions = {
            bergamot: { ar: 'انتعاش حمضي إيطالي منعش يوقظ الحواس بنقاء ووضوح في الدقائق الأولى.', en: 'Vibrant Italian citrus opening with crisp and sparkling clarity.' },
            apple: { ar: 'نفحة فاكهية مقرمشة ولطيفة تعطي لمسة شبابية بهيجة للعطر.', en: 'Crisp fruity nuance providing an energetic and modern touch.' },
            saffron: { ar: 'ذهب التوابل الأحمر، يمنح العطر غموضاً شرقياً فخماً وأثراً دافئاً.', en: 'The red gold of perfumery, adding opulent spicy mystery.' },
            vanilla: { ar: 'فانيليا بوربون ناعمة كريمية تمنح العطر دفئاً ساحراً يدوم لساعات طويلة.', en: 'Velvety bourbon vanilla imparting deep sensuous warmth.' },
            amber: { ar: 'عنبر دافئ ذهبي بلسمي يعزز ثبات العطر ويترك بصمة مغناطيسية على البشرة.', en: 'Warm golden amber anchoring the scent with a magnetic trail.' },
            cashmeran: { ar: 'خشب الكشمير الأرستقراطي، ملمس كالمخمل يجمع بين الدفء الحريري والمسك.', en: 'Velvety aristocratic wood combining silky musky depth.' },
            'orange blossom': { ar: 'زهر البرتقال المتوسطي، قلب زهري نقي مفعم بالرقة والأناقة.', en: 'Mediterranean orange blossom radiating delicate floral poise.' },
            coconut: { ar: 'لمسة استوائية كريمية ناعمة تضفي راحة وجاذبية ناعمة.', en: 'Creamy tropical sweetness providing a luscious comforting veil.' },
            'guaiac wood': { ar: 'خشب الغاياك الدخاني النادر، عمق خشبي مهيب لا يُنسى.', en: 'Smoky sacred guaiac wood imparting profound timbered depth.' }
          };

          const lower = (noteName || '').toLowerCase();
          let desc = currentLang === 'ar' ? 'نوتة عطرية أصيلة تمنح التركيبة توازناً استثنائياً وفوحاناً راقياً.' : 'A natural aromatic nuance enhancing the formula poise and projection.';
          for (const [k, v] of Object.entries(descriptions)) {
            if (lower.includes(k) || (st.ar && st.ar.toLowerCase().includes(k))) {
              desc = currentLang === 'ar' ? v.ar : v.en;
              break;
            }
          }

          inspector.hidden = false;
          inspector.innerHTML = `
            <div class="pni-icon" style="background:${st.color}22; color:${st.color};">✦</div>
            <div class="pni-copy">
              <strong>${escapeHtml(noteName)}</strong>
              <p>${desc}</p>
            </div>
          `;
        }
      });
    });
  }

  // ── Scent DNA Donut Chart & Progress Bars ─────────────────────
  function renderScentDNA(d, p) {
    const donutSvg = $('#dnaDonutSvg');
    const barsContainer = $('#dnaBarsContainer');
    const mainLabel = $('#dnaMainAccordLabel');
    const t = I18N[currentLang];

    const accords = extractAccords(d, p);

    // Main accord in center
    const primary = accords[0];
    if (mainLabel && primary) {
      mainLabel.textContent = currentLang === 'ar' ? primary.nameAr : primary.nameEn;
    }

    // Percentages distribution based on matched scores
    const totalScore = accords.reduce((sum, a) => sum + a.score, 0);

    // SVG Donut Render
    // Circumference = 2 * PI * 54 ≈ 339.29
    const r = 54;
    const c = 2 * Math.PI * r;
    let accumulatedOffset = 0;

    const circles = accords.map(acc => {
      const share = acc.score / totalScore;
      const strokeLength = share * c;
      const strokeGap = c - strokeLength;

      const circleSvg = `
        <circle cx="80" cy="80" r="${r}" fill="none"
          stroke="${acc.color}"
          stroke-width="17"
          stroke-dasharray="${strokeLength.toFixed(2)} ${strokeGap.toFixed(2)}"
          stroke-dashoffset="${(-accumulatedOffset).toFixed(2)}"
          stroke-linecap="butt"
          style="transition: stroke-dasharray 1s ease" />
      `;
      accumulatedOffset += strokeLength;
      return circleSvg;
    }).join('');

    if (donutSvg) {
      donutSvg.innerHTML = circles;
    }

    // Accords Progress Bars Render (Clean luxury descending bars based on admin selected accords)
    if (barsContainer) {
      const count = accords.length;
      barsContainer.innerHTML = accords.map((acc, i) => {
        const label = currentLang === 'ar' ? acc.nameAr : acc.nameEn;
        const width = count <= 1 ? 92 : Math.round(92 - (i / Math.max(1, count - 1)) * 52);
        return `
          <div class="dna-bar-row">
            <span class="dna-bar-name" title="${escapeHtml(label)}">${escapeHtml(label)}</span>
            <div class="dna-bar-track">
              <div class="dna-bar-fill" style="width: ${width}%; background: ${acc.color}"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ── Performance Metrics ──────────────────────────────────────
  function renderPerformance(d, p) {
    const longVal = $('#ppmLongVal');
    const longBars = $('#ppmLongBars');
    const silVal = $('#ppmSilVal');
    const silBars = $('#ppmSilBars');
    const footerAccords = $('#perfAccordsFooter');

    const longRating = Math.min(5, Math.max(1, parseInt(d.longevity) || 4));
    const silRating  = Math.min(5, Math.max(1, parseInt(d.sillage) || 3));

    // Longevity text
    if (longVal) {
      if (longRating >= 5) longVal.textContent = currentLang === 'ar' ? '10-12 ساعة+' : '10-12hrs+';
      else if (longRating === 4) longVal.textContent = currentLang === 'ar' ? '8-10 ساعات' : '8-10hrs';
      else if (longRating === 3) longVal.textContent = currentLang === 'ar' ? '6-8 ساعات' : '6-8hrs';
      else longVal.textContent = currentLang === 'ar' ? '4-6 ساعات' : '4-6hrs';
    }

    // Longevity 5-segment indicator
    if (longBars) {
      longBars.innerHTML = Array.from({ length: 5 }, (_, i) => `
        <span class="ppm-segment ${i < longRating ? 'filled' : ''}"></span>
      `).join('');
    }

    // Sillage text
    if (silVal) {
      if (silRating >= 4) silVal.textContent = currentLang === 'ar' ? '2-3 ساعات (قوي)' : '2-3hrs (Strong)';
      else if (silRating === 3) silVal.textContent = currentLang === 'ar' ? '1-2 ساعة (ملحوظ)' : '1-2hrs';
      else silVal.textContent = currentLang === 'ar' ? 'هادئ وقريب' : 'Intimate';
    }

    // Sillage 5-segment indicator
    if (silBars) {
      silBars.innerHTML = Array.from({ length: 5 }, (_, i) => `
        <span class="ppm-segment ${i < silRating ? 'filled' : ''}"></span>
      `).join('');
    }

    // Footer Chips: Accords + Seasons
    if (footerAccords) {
      const rich = extractAccords(d, p);
      const seasons = parseSeasons(d.seasons, d.accords);

      const accordChips = rich.slice(0, 4).map(a => {
        const label = currentLang === 'ar' ? a.nameAr : a.nameEn;
        return `
          <span class="accord-pill">
            <span class="accord-pill-dot" style="background:${a.color}"></span>
            <span>${escapeHtml(label)}</span>
          </span>
        `;
      });

      const seasonChips = seasons.map(s => {
        const label = currentLang === 'ar' ? s.ar : s.en;
        return `
          <span class="accord-pill season-pill" style="opacity: .92">
            <span class="season-pill-icon">${s.icon}</span>
            <span>${escapeHtml(label)}</span>
          </span>
        `;
      });

      footerAccords.innerHTML = [...accordChips, ...seasonChips].join('');
    }
  }

  // ── Luxury Bottle SVG / Photo Render Helper ──────────────────
  function renderBottleMedia(imgUrl, altName) {
    if (imgUrl) {
      return `<img src="${imgUrl}" class="related-img-photo" alt="${escapeHtml(altName)}" loading="lazy">`;
    }
    // High luxury bespoke bottle silhouette when no photo is uploaded
    return `
      <div class="rel-bottle-svg-wrap">
        <svg viewBox="0 0 160 220" class="rel-bottle-svg" aria-label="${escapeHtml(altName)}">
          <defs>
            <linearGradient id="relBottleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#2c3e55" stop-opacity="0.95"/>
              <stop offset="50%" stop-color="#192940" stop-opacity="0.98"/>
              <stop offset="100%" stop-color="#101a28" stop-opacity="1"/>
            </linearGradient>
            <linearGradient id="relGoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#c59b27"/>
              <stop offset="50%" stop-color="#faecc5"/>
              <stop offset="100%" stop-color="#a87a1c"/>
            </linearGradient>
          </defs>
          <circle cx="80" cy="18" r="9" fill="url(#relGoldGrad)"/>
          <rect x="63" y="18" width="34" height="25" rx="5" fill="url(#relGoldGrad)" stroke="#dfb954" stroke-width="0.8"/>
          <rect x="71" y="43" width="18" height="11" fill="url(#relGoldGrad)"/>
          <rect x="36" y="54" width="88" height="144" rx="18" fill="url(#relBottleGrad)" stroke="rgba(245, 165, 173, 0.4)" stroke-width="1.2"/>
          <rect x="42" y="60" width="76" height="132" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
          <path d="M46 66 L46 182" stroke="rgba(255,255,255,0.22)" stroke-width="2.5" stroke-linecap="round"/>
          <rect x="47" y="98" width="66" height="58" rx="6" fill="rgba(255, 255, 255, 0.04)" stroke="url(#relGoldGrad)" stroke-width="0.8"/>
          <text x="80" y="122" font-family="'DM Sans',sans-serif" font-size="9" font-weight="700" fill="#faecc5" text-anchor="middle" letter-spacing="2">ROU7</text>
          <text x="80" y="137" font-family="'IBM Plex Sans Arabic',sans-serif" font-size="8" fill="#f5a5ad" text-anchor="middle">رُوح</text>
          <circle cx="80" cy="146" r="1.5" fill="#c59b27"/>
        </svg>
      </div>
    `;
  }

  // ── Related Fragrances ───────────────────────────────────────
  function renderRelatedFragrances() {
    const grid = $('#relatedGrid');
    if (!grid) return;

    const currentId = currentProduct ? String(currentProduct.id) : '';
    const related = allProducts.filter(p => String(p.id) !== currentId).slice(0, 4);

    if (!related.length) {
      grid.innerHTML = `<p class="no-results" style="grid-column:1/-1; text-align:center;">${currentLang === 'ar' ? 'مجموعة رُوح الحصرية ستكتمل قريباً' : 'Rou7 collection coming soon'}</p>`;
      return;
    }

    grid.innerHTML = related.map(p => {
      const name = currentLang === 'en' ? (p.latin || p.name) : p.name;
      const sub  = currentLang === 'en' ? (p.latin ? p.name : '') : (p.latin || '');
      const relPricing = computeProductPrice(p, campaignSettings);
      const relPriceHtml = relPricing.hasDiscount
        ? `<div class="live-price-group"><span class="rel-price" style="color:var(--pink);">${money(relPricing.price)}</span> <del class="live-old-price">${money(relPricing.originalPrice)}</del></div>`
        : `<span class="rel-price">${money(relPricing.price)}</span>`;
      return `
        <article class="related-card">
          <div class="related-img-wrap">
            ${renderBottleMedia(p.image_url, name)}
          </div>
          <div class="related-body">
            <h4>${escapeHtml(name)}</h4>
            ${sub ? `<span class="rel-sub">${escapeHtml(sub)}</span>` : ''}
            ${relPriceHtml}
            <a href="product.html?id=${p.id}" class="btn-view-prod">
              <span>${I18N[currentLang].view_fragrance}</span>
              <span>←</span>
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  // ── WhatsApp Order Link ──────────────────────────────────────
  function updateWaOrderLink() {
    const waBtn = $('#pdpWaBtn');
    if (!waBtn || !currentProduct) return;
    const pricing = computeProductPrice(currentProduct, campaignSettings);
    const prodName = currentLang === 'en' ? (currentProduct.latin || currentProduct.name) : currentProduct.name;
    const totalPrice = (pricing.price * currentQty);
    const text = I18N[currentLang].wa_order_template(prodName, currentQty, totalPrice);
    waBtn.href = `${WHATSAPP_BASE_URL}&text=${encodeURIComponent(text)}`;
  }

  // ── Cart Drawer Management ───────────────────────────────────
  function readCart() {
    try {
      cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch (_) {
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(p, qty = 1) {
    if (!p) return;
    const d = unpackProduct(p);
    const isOutOfStock = (p.in_stock === false) || (d.stock_quantity !== '' && d.stock_quantity !== undefined && parseInt(d.stock_quantity) <= 0);
    if (isOutOfStock) {
      showToast(currentLang === 'ar' ? 'عفواً، هذا العطر غير متوفر في المخزون حالياً' : 'Sorry, this fragrance is currently out of stock');
      return;
    }

    readCart();
    const existing = cart.find(item => String(item.id) === String(p.id));
    const currentQtyInCart = existing ? existing.qty : 0;
    if (d.stock_quantity !== '' && d.stock_quantity !== undefined && d.stock_quantity !== null) {
      const maxStock = parseInt(d.stock_quantity) || 0;
      if (currentQtyInCart + qty > maxStock) {
        showToast(currentLang === 'ar' ? `عفواً، أقصى كمية متاحة في المخزون هي ${arabicDigits(maxStock)} قطعة فقط` : `Sorry, only ${maxStock} items available in stock`);
        return;
      }
    }

    const pricing = computeProductPrice(p, campaignSettings);
    if (existing) {
      existing.qty += qty;
      existing.price = pricing.price;
      existing.customPrice = pricing.hasDiscount ? pricing.price : null;
    } else {
      cart.push({
        id: String(p.id),
        name: p.name,
        latin: p.latin || '',
        price: pricing.price,
        customPrice: pricing.hasDiscount ? pricing.price : null,
        image_url: p.image_url || '',
        qty: qty
      });
    }
    saveCart();
    openCartDrawer(true);
    showToast(I18N[currentLang].toast_added);
  }

  function updateCartUI() {
    readCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

    const cartCount = $('#cartCount');
    const drawerCount = $('#cartDrawerCount');
    const cartItems = $('#cartItems');
    const cartEmpty = $('#cartEmpty');
    const cartSummary = $('#cartSummary');
    const cartTotal = $('#cartTotal');

    if (cartCount) cartCount.textContent = currentLang === 'ar' ? arabicDigits(totalCount) : totalCount;
    if (drawerCount) drawerCount.textContent = `(${currentLang === 'ar' ? arabicDigits(totalCount) : totalCount})`;

    if (!cart.length) {
      if (cartEmpty) cartEmpty.style.display = 'flex';
      if (cartSummary) cartSummary.style.display = 'none';
      if (cartItems) cartItems.innerHTML = '';
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'flex';
    if (cartTotal) cartTotal.textContent = money(totalPrice);

    if (cartItems) {
      cartItems.innerHTML = cart.map(item => {
        const title = currentLang === 'en' ? (item.latin || item.name) : item.name;
        return `
          <div class="cart-item">
            <div class="cart-thumb">
              ${item.image_url ? `<img src="${item.image_url}" alt="${escapeHtml(title)}">` : '🧴'}
            </div>
            <div class="cart-item-info">
              <h4>${escapeHtml(title)}</h4>
              <span class="cart-item-price">${money(item.price)}</span>
              <div class="cart-qty-row">
                <button type="button" class="cart-qty-btn" data-qty-change="${item.id}" data-step="-1">−</button>
                <span class="cart-qty-num">${currentLang === 'ar' ? arabicDigits(item.qty) : item.qty}</span>
                <button type="button" class="cart-qty-btn" data-qty-change="${item.id}" data-step="1">+</button>
                <button type="button" class="cart-remove-btn" data-remove="${item.id}" title="إزالة">×</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function openCartDrawer(isOpen) {
    const drawer = $('#cartDrawer');
    const overlay = $('#overlay');
    if (drawer) drawer.classList.toggle('open', isOpen);
    if (overlay) overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // ── Language & Theme Setup ───────────────────────────────────
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

    const langText = $('#langText');
    if (langText) langText.textContent = lang === 'ar' ? 'EN' : 'عربي';

    const t = I18N[lang];
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key === 'announcement' && campaignSettings && campaignSettings.top_bar && campaignSettings.top_bar_active !== false) {
        el.textContent = campaignSettings.top_bar;
        return;
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

    // Re-render product details with new language
    if (currentProduct) {
      renderProductDetails(currentProduct);
    }
    updateCartUI();
  }

  function setTheme() {
    document.body.classList.add('light');
    try { localStorage.setItem(THEME_KEY, 'light'); } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = '#f5f0eb';
    $$('.brand-logo').forEach(img => {
      img.src = 'assets/branding/1.svg';
    });
  }

  // ── Init & Event Listeners ───────────────────────────────────
  async function init() {
    // 1. Language & Theme
    setLanguage(currentLang);
    setTheme();

    // 1.1 Load top announcement bar settings
    function applyAnnouncements(data) {
      if (!data) return;
      campaignSettings = data;
      const topBar = document.querySelector('.announcement');
      if (topBar) {
        if (data.top_bar_active === false) {
          topBar.style.display = 'none';
        } else {
          topBar.style.display = '';
          const textEl = topBar.querySelector('[data-i18n="announcement"]');
          if (textEl && data.top_bar) {
            textEl.textContent = data.top_bar;
          }
        }
      }
      if (currentProduct) renderProductDetails(currentProduct);
    }
    try {
      const stored = localStorage.getItem('rooh-announcements') || localStorage.getItem('rooh-campaign-settings');
      if (stored) applyAnnouncements(JSON.parse(stored));
    } catch (_) {}
    supaFetch('products', { filters: '&name=eq.__system_announcements__' })
      .then(rows => {
        if (rows && rows.length && rows[0].notes) {
          try {
            const data = JSON.parse(rows[0].notes);
            localStorage.setItem('rooh-announcements', JSON.stringify(data));
            applyAnnouncements(data);
          } catch (_) {}
        }
      })
      .catch(() => {});

    supaFetch('products', { filters: '&name=eq.__system_brands__' })
      .then(rows => {
        if (rows && rows.length && rows[0].notes) {
          try {
            const data = JSON.parse(rows[0].notes);
            if (Array.isArray(data) && data.length) {
              brands = data;
              try { localStorage.setItem('rooh-cached-brands', JSON.stringify(data)); } catch (_) {}
              if (currentProduct) renderProductDetails(currentProduct);
            }
          } catch (_) {}
        }
      })
      .catch(() => {});

    // 2. Read Cached Products first
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
      if (Array.isArray(cached) && cached.length) {
        allProducts = cached.filter(p => !p.name.startsWith('__system_'));
      }
    } catch (_) {}

    // 3. Find target product by ID
    const urlParams = new URLSearchParams(window.location.search);
    const targetId  = urlParams.get('id');

    const initialMatch = allProducts.find(p => String(p.id) === String(targetId)) || allProducts[0] || DEFAULT_FALLBACK_PRODUCT;
    renderProductDetails(initialMatch);

    // 4. Fetch fresh products from Supabase
    try {
      const liveProducts = await supaFetch('products', { filters: '&in_stock=eq.true&order=sort_order.asc,created_at.desc' });
      if (Array.isArray(liveProducts) && liveProducts.length) {
        allProducts = liveProducts.filter(p => !p.name.startsWith('__system_'));
        localStorage.setItem(CACHE_KEY, JSON.stringify(liveProducts));
        const match = allProducts.find(p => String(p.id) === String(targetId)) || allProducts[0] || DEFAULT_FALLBACK_PRODUCT;
        renderProductDetails(match);
      }
    } catch (err) {
      console.warn('Rou7 PDP: Supabase fetch fallback to cache', err);
    }

    // 5. Quantity selector
    $('#qtyMinus')?.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        $('#qtyDisplay').textContent = currentLang === 'ar' ? arabicDigits(currentQty) : currentQty;
        updateWaOrderLink();
      }
    });

    $('#qtyPlus')?.addEventListener('click', () => {
      if (currentProduct) {
        const d = unpackProduct(currentProduct);
        if (d.stock_quantity !== '' && d.stock_quantity !== undefined && d.stock_quantity !== null) {
          const maxStock = parseInt(d.stock_quantity) || 0;
          if (currentQty >= maxStock) {
            showToast(currentLang === 'ar' ? `أقصى كمية متاحة في المخزون هي ${arabicDigits(maxStock)} قطعة` : `Maximum available quantity is ${maxStock}`);
            return;
          }
        }
      }
      currentQty++;
      $('#qtyDisplay').textContent = currentLang === 'ar' ? arabicDigits(currentQty) : currentQty;
      updateWaOrderLink();
    });

    // 6. Add to Bag button
    $('#pdpAddBagBtn')?.addEventListener('click', () => {
      if (currentProduct) {
        addToCart(currentProduct, currentQty);
      }
    });

    // 7. Cart Drawer Toggles
    $('#cartToggle')?.addEventListener('click', () => openCartDrawer(true));
    $('#cartClose')?.addEventListener('click', () => openCartDrawer(false));
    $('#overlay')?.addEventListener('click', () => openCartDrawer(false));

    // Cart Items Event Delegation (+, -, remove)
    $('#cartItems')?.addEventListener('click', e => {
      const stepBtn = e.target.closest('[data-qty-change]');
      const rmBtn   = e.target.closest('[data-remove]');

      if (stepBtn) {
        const id = stepBtn.dataset.qtyChange;
        const step = parseInt(stepBtn.dataset.step) || 0;
        const item = cart.find(i => String(i.id) === String(id));
        if (item) {
          if (step > 0) {
            const prod = allProducts.find(p => String(p.id) === String(id));
            if (prod) {
              const d = unpackProduct(prod);
              if (d.stock_quantity !== '' && d.stock_quantity !== undefined && d.stock_quantity !== null) {
                const maxStock = parseInt(d.stock_quantity) || 0;
                if (item.qty + step > maxStock) {
                  showToast(currentLang === 'ar' ? `عفواً، أقصى كمية متاحة في المخزون هي ${arabicDigits(maxStock)} قطعة` : `Sorry, only ${maxStock} items available in stock`);
                  return;
                }
              }
            }
          }
          item.qty += step;
          if (item.qty <= 0) cart = cart.filter(i => String(i.id) !== String(id));
          saveCart();
        }
      }

      if (rmBtn) {
        const id = rmBtn.dataset.remove;
        cart = cart.filter(i => String(i.id) !== String(id));
        saveCart();
      }
    });

    // Checkout button: redirect to index.html with cart open
    $('#checkoutBtn')?.addEventListener('click', () => {
      window.location.href = 'index.html#collection';
    });

    // 8. Theme & Lang toggles
    $('#langToggle')?.addEventListener('click', () => {
      setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });

    $('#themeToggle')?.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light');
      setTheme(!isLight);
    });

    // 9. Floating WhatsApp tooltip & link
    const waFloat = $('#whatsappFloat');
    if (waFloat) {
      waFloat.href = `${WHATSAPP_BASE_URL}&text=${encodeURIComponent(I18N[currentLang].wa_inquiry_msg)}`;
    }

    // 10. Hide Loader
    const loader = $('#loader');
    if (loader) {
      setTimeout(() => loader.classList.add('done'), 200);
    }

    // 11. Sticky Mobile Buy Bar
    initStickyMobileBar();

    // 12. Interactive 3D Bottle Parallax
    initBottleParallax();

    // 13. Interactive Atomizer & Sillage Spray Simulator
    initAtomizerSimulator();
  }

  // ── Web Audio Engine for Fragrance Experience ──────────────────
  class PerfumeAudioEngine {
    constructor() {
      this.ctx = null;
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

        setTimeout(() => {
          if (!this.ctx) return;
          const freqs = [1046.5, 1318.5, 1567.98];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.05));
            g.gain.setValueAtTime(0.001, ctx.currentTime + (idx * 0.05));
            g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + (idx * 0.05) + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (idx * 0.05) + 0.35);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(ctx.currentTime + (idx * 0.05));
            osc.stop(ctx.currentTime + (idx * 0.05) + 0.4);
          });
        }, 110);
      } catch (err) {
        console.warn('Audio spray failed:', err);
      }
    }

    playBubblePop() {
      try {
        const ctx = this.ensureContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (_) {}
    }
  }

  const pdpAudio = new PerfumeAudioEngine();
  let activeParticleAnim = null;
  let hudDismissTimeout = null;

  function initAtomizerSimulator() {
    const sprayBtn = $('#btnAtomizerSpray');
    const bottleFrame = $('#prodBottleFrame');

    function handleSpray(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!currentProduct) return;
      const d = unpackProduct(currentProduct);
      triggerAtomizerSpray(currentProduct, d);
    }

    sprayBtn?.addEventListener('click', handleSpray);
    bottleFrame?.addEventListener('click', handleSpray);
    bottleFrame?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSpray(e);
      }
    });
  }

  function triggerAtomizerSpray(p, d) {
    const t = I18N[currentLang];
    const sillageLevel = Math.min(5, Math.max(1, parseInt(d.sillage) || 3));
    const mainAcc = extractAccords(d, p)[0];
    const accordColor = mainAcc ? mainAcc.color : '#f5a5ad';

    // 1. Audio Effect
    pdpAudio.playSpraySound(sillageLevel);

    // 2. Bottle Animation
    const bottleFrame = $('#prodBottleFrame');
    if (bottleFrame) {
      bottleFrame.classList.add('spraying');
      setTimeout(() => bottleFrame.classList.remove('spraying'), 420);
    }

    // 3. Sillage Shockwave Rings
    const auraWrap = $('#sillageAuraWaves');
    if (auraWrap) {
      auraWrap.innerHTML = `
        <div class="sillage-ring" style="border-color: ${accordColor}; animation-delay: 0s;"></div>
        <div class="sillage-ring" style="border-color: ${accordColor}; animation-delay: 0.22s;"></div>
      `;
      setTimeout(() => { if (auraWrap) auraWrap.innerHTML = ''; }, 1800);
    }

    // 4. Canvas Particle Mist Cloud
    const canvas = $('#atomizerCanvas');
    if (canvas) {
      runMistCanvas(canvas, sillageLevel, accordColor);
    }

    // 5. Floating Aroma Capsules
    spawnAromaCapsules(d, accordColor);

    // 6. Sillage Readout HUD
    showSillageHud(sillageLevel, t);
  }

  function runMistCanvas(canvas, sillageLevel, accordColor) {
    if (activeParticleAnim) {
      cancelAnimationFrame(activeParticleAnim);
      activeParticleAnim = null;
    }

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const originX = rect.width * 0.5;
    const originY = rect.height * 0.22; // Atomizer nozzle position

    const count = 90 + (sillageLevel * 18);
    const spread = 0.8 + (sillageLevel * 0.14);
    const particles = [];

    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
      const speed = 2.4 + Math.random() * (4.2 + sillageLevel * 0.85);
      particles.push({
        x: originX + (Math.random() - 0.5) * 8,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.4 + Math.random() * 3.6,
        alpha: 0.85 + Math.random() * 0.15,
        decay: 0.012 + Math.random() * 0.018,
        drag: 0.945 + Math.random() * 0.025,
        gravity: -0.03 + Math.random() * 0.08,
        color: Math.random() > 0.4 ? accordColor : '#ffffff',
        sparkle: Math.random() > 0.6
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
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.sparkle) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (alive) {
        activeParticleAnim = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
        activeParticleAnim = null;
      }
    }

    step();
  }

  function spawnAromaCapsules(d, accordColor) {
    const wrap = $('#aromaCapsulesWrap');
    if (!wrap) return;

    // Collect notes
    const topNotes = (d.top_notes || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
    const midNotes = (d.middle_notes || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);
    const baseNotes = (d.base_notes || '').split(/[,،;|\n]+/).map(s => s.trim()).filter(Boolean);

    const candidates = [
      topNotes[0] ? { note: topNotes[0], type: currentLang === 'ar' ? 'قمة العطر' : 'Top Note', icon: '🍊' } : null,
      midNotes[0] ? { note: midNotes[0], type: currentLang === 'ar' ? 'قلب العطر' : 'Heart Note', icon: '🌸' } : null,
      baseNotes[0] ? { note: baseNotes[0], type: currentLang === 'ar' ? 'قاعدة العطر' : 'Base Note', icon: '🪵' } : null
    ].filter(Boolean);

    if (!candidates.length) return;

    const positions = [
      { top: '18%', left: '12%' },
      { top: '34%', right: '10%' },
      { top: '56%', left: '14%' }
    ];

    wrap.innerHTML = candidates.map((c, i) => {
      const pos = positions[i] || { top: `${20 + i * 20}%`, left: '15%' };
      const posStyle = Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(';');
      return `
        <div class="aroma-capsule" style="${posStyle}; animation-delay: ${(i * 0.4).toFixed(1)}s;" data-note-idx="${i}" title="${escapeHtml(c.type)}: ${escapeHtml(c.note)}">
          <span class="capsule-icon">${c.icon}</span>
          <span class="capsule-name">${escapeHtml(c.note)}</span>
          <span class="capsule-dot" style="background:${accordColor};"></span>
        </div>
      `;
    }).join('');

    wrap.querySelectorAll('.aroma-capsule').forEach(cap => {
      cap.addEventListener('click', e => {
        e.stopPropagation();
        pdpAudio.playBubblePop();
        cap.classList.add('popped');
        setTimeout(() => cap.remove(), 320);
      });
    });

    // Auto fade after 8 seconds
    setTimeout(() => {
      if (wrap) wrap.innerHTML = '';
    }, 8000);
  }

  function showSillageHud(level, t) {
    const hud = $('#sillageHud');
    const meter = $('#shMeter');
    const levelEl = $('#shLevel');
    const rangeEl = $('#shRange');
    if (!hud) return;

    if (hudDismissTimeout) {
      clearTimeout(hudDismissTimeout);
      hudDismissTimeout = null;
    }

    const dots = meter?.querySelectorAll('.sh-dot') || [];
    dots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < level);
    });

    let lvlTitle = t.sillage_moderate;
    let lvlDesc = t.sillage_moderate_desc;
    if (level >= 5) {
      lvlTitle = t.sillage_beast;
      lvlDesc = t.sillage_beast_desc;
    } else if (level === 4) {
      lvlTitle = t.sillage_strong;
      lvlDesc = t.sillage_strong_desc;
    } else if (level <= 2) {
      lvlTitle = t.sillage_intimate;
      lvlDesc = t.sillage_intimate_desc;
    }

    if (levelEl) levelEl.textContent = lvlTitle;
    if (rangeEl) rangeEl.textContent = lvlDesc;

    hud.hidden = false;

    hudDismissTimeout = setTimeout(() => {
      hud.hidden = true;
    }, 4500);
  }

  function initStickyMobileBar() {
    const stickyBar = $('#stickyMobileBar');
    const mainBuyBtn = $('#pdpAddBagBtn');
    if (!stickyBar || !mainBuyBtn) return;

    window.addEventListener('scroll', () => {
      const rect = mainBuyBtn.getBoundingClientRect();
      if (rect.bottom < 60) {
        stickyBar.classList.add('show');
      } else {
        stickyBar.classList.remove('show');
      }
    }, { passive: true });

    $('#smAddBtn')?.addEventListener('click', () => {
      if (currentProduct) {
        addToCart(currentProduct, currentQty || 1);
      }
    });
  }

  function initBottleParallax() {
    const stage = document.querySelector('.prod-visual-stage');
    const frame = $('#prodBottleFrame');
    if (!stage || !frame) return;

    stage.addEventListener('mousemove', e => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    });

    stage.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
