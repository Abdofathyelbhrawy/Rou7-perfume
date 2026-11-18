// ============================================
// ROOH Perfume — Shared Utilities
// Common functions used across app.js, admin.js, product.js
// ============================================

// ──────────────────────────────────────────────
// Safe DOM Helpers
// ──────────────────────────────────────────────
const $ = selector => {
  try { return document.querySelector(selector); } catch (_) { return null; }
};

const $$ = selector => {
  try { return [...document.querySelectorAll(selector)]; } catch (_) { return []; }
};

function safeOn(selectorOrEl, event, handler, options) {
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
}

function safeModule(name, initFn) {
  try {
    initFn();
  } catch (err) {
    console.warn(`[Module skipped safely: ${name}]:`, err);
  }
}

// ──────────────────────────────────────────────
// HTML Escaping
// ──────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'");
}

// ──────────────────────────────────────────────
// Number Formatting
// ──────────────────────────────────────────────
function arabicDigits(num) {
  return String(num).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

function formatDigits(value, currentLang = 'ar') {
  return currentLang === 'ar' ? arabicDigits(value) : String(value);
}

function formatCurrency(num, currentLang = 'ar') {
  const val = Number(num || 0).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
  return currentLang === 'ar' ? `${val} ج.م` : `${val} EGP`;
}

// ──────────────────────────────────────────────
// Date Formatting
// ──────────────────────────────────────────────
function formatArabicDateTime(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (_) {
    return dateStr;
  }
}

// ──────────────────────────────────────────────
// Toast Notifications
// ──────────────────────────────────────────────
let toastTimer;

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

// ──────────────────────────────────────────────
// LocalStorage Helpers
// ──────────────────────────────────────────────
function safeLocalStorageGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : fallback;
  } catch (_) {
    return fallback;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (_) {
    return false;
  }
}

function safeLocalStorageParse(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (_) {
    return fallback;
  }
}

// ──────────────────────────────────────────────
// Supabase Fetch Helper
// ──────────────────────────────────────────────
async function supaFetch(table, { method = 'GET', filters = '', body = null, select = '*' } = {}) {
  const SUPABASE_URL = window.RoohConstants?.SUPABASE_URL || 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON = window.RoohConstants?.SUPABASE_ANON || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

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

// ──────────────────────────────────────────────
// Product Unpacking
// ──────────────────────────────────────────────
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
    desc:         meta.desc !== undefined ? meta.desc : (p.notes || ''),
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
    discount_badge:   p.discount_badge || meta.discount_badge || '',
    stock_quantity:   p.stock_quantity !== undefined && p.stock_quantity !== null ? p.stock_quantity : (meta.stock_quantity !== undefined && meta.stock_quantity !== null ? meta.stock_quantity : ''),
    in_solar_system:  Boolean(p.in_solar_system !== undefined ? p.in_solar_system : meta.in_solar_system),
    images:           Array.isArray(p.images) && p.images.length ? p.images : (Array.isArray(meta.images) && meta.images.length ? meta.images : (p.image_url ? [p.image_url] : []))
  };
}

// ──────────────────────────────────────────────
// Search Normalization
// ──────────────────────────────────────────────
function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ً-ٟ]/g, '')
    .replace(/[^a-z0-9ء-ي\s]/gi, ' ')
    .trim();
}

// ──────────────────────────────────────────────
// Product Matching
// ──────────────────────────────────────────────
function productMatchesQuery(product, queryText) {
  if (!queryText) return true;
  const qNorm = normalizeSearchText(queryText);
  if (!qNorm) return true;

  const d = unpackProduct(product);
  const pCat = (product.category || 'unisex').toLowerCase();
  const normCat = (pCat === 'women' || pCat.includes('نسائ') || pCat.includes('her')) ? 'women'
    : (pCat === 'men' || pCat.includes('رجال') || pCat.includes('him')) ? 'men' : 'unisex';

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

// ──────────────────────────────────────────────
// Brand Finding
// ──────────────────────────────────────────────
function findBrand(val) {
  if (!val) return null;
  const s = String(val).toLowerCase().trim();
  const brands = window.RoohConstants?.DEFAULT_BRANDS || [];
  return brands.find(b =>
    (b.id && b.id.toLowerCase() === s) ||
    (b.name_en && b.name_en.toLowerCase().trim() === s) ||
    (b.name_ar && b.name_ar.toLowerCase().trim() === s) ||
    (b.name_ar && s.includes(b.name_ar.toLowerCase().trim())) ||
    (b.name_en && s.includes(b.name_en.toLowerCase().trim()))
  );
}

function findBrandObject(val, currentBrands = []) {
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

// ──────────────────────────────────────────────
// Accord Helpers
// ──────────────────────────────────────────────
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

function getAccordMeta(nameOrKey) {
  if (!nameOrKey) return { color: '#D4A373', en: '', ar: '' };
  const raw = String(nameOrKey).toLowerCase().trim();
  const ADMIN_ACCORD_COLORS = window.RoohConstants?.ADMIN_ACCORD_COLORS || {};
  for (const k of Object.keys(ADMIN_ACCORD_COLORS)) {
    if (raw.includes(k) || ADMIN_ACCORD_COLORS[k].ar.includes(raw) || ADMIN_ACCORD_COLORS[k].en.toLowerCase().includes(raw)) {
      return ADMIN_ACCORD_COLORS[k];
    }
  }
  return { color: '#D4A373', en: nameOrKey, ar: nameOrKey };
}

// ──────────────────────────────────────────────
// Season Parsing
// ──────────────────────────────────────────────
function parseSeasons(seasonsStr, accordsStr = '') {
  const raw = String(seasonsStr || '').toLowerCase().trim();
  const MASTER_SEASONS = window.RoohConstants?.MASTER_SEASONS || [];
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

// ──────────────────────────────────────────────
// Product Price Computation
// ──────────────────────────────────────────────
function computeProductPrice(p, campaignData = null) {
  if (!p) return { price: 0, originalPrice: 0, hasDiscount: false, discountPercent: 0, discountBadge: '', savedAmount: 0 };

  const originalPrice = Number(p.price || 0);
  const d = unpackProduct(p);

  const rawSale = Number(p.sale_price !== undefined && p.sale_price !== null ? p.sale_price : d.sale_price);
  const hasCustomSale = Boolean(rawSale && rawSale > 0 && rawSale < originalPrice);

  const camp = campaignData || window.currentAnnouncements || {};
  const isGlobalActive = Boolean(camp.storewide_discount_active);
  const globalPct = Number(camp.storewide_discount_percent) || 0;
  const globalScope = camp.storewide_discount_scope || 'only_no_custom';
  const globalBadge = camp.storewide_discount_badge || (globalPct ? (window.currentLang === 'ar' ? `خصم ${globalPct}%` : `${globalPct}% OFF`) : '');

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
        discountBadge = d.discount_badge || (window.currentLang === 'ar' ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`);
      }
    } else {
      activePrice = rawSale;
      hasDiscount = true;
      discountPercent = Math.round(((originalPrice - rawSale) / originalPrice) * 100);
      discountBadge = d.discount_badge || (window.currentLang === 'ar' ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`);
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

// ──────────────────────────────────────────────
// Image Compression
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Phone Cleaning for WhatsApp
// ──────────────────────────────────────────────
function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.startsWith('20')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('1')) digits = '20' + digits;
  else if (digits.length === 11 && digits.startsWith('01')) digits = '20' + digits.slice(1);
  else if (digits.length === 10) digits = '20' + digits;
  return digits;
}

// ──────────────────────────────────────────────
// Order Items Parsing
// ──────────────────────────────────────────────
function parseOrderItems(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      return JSON.parse(items);
    } catch (_) {
      return [];
    }
  }
  return [];
}

// ──────────────────────────────────────────────
// Export to window namespace
// ──────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.RoohUtils = {
    $,
    $$,
    safeOn,
    safeModule,
    escapeHtml,
    arabicDigits,
    formatDigits,
    formatCurrency,
    formatArabicDateTime,
    showToast,
    safeLocalStorageGet,
    safeLocalStorageSet,
    safeLocalStorageParse,
    supaFetch,
    unpackProduct,
    normalizeSearchText,
    productMatchesQuery,
    findBrand,
    findBrandObject,
    getAccordDotColor,
    getAccordMeta,
    parseSeasons,
    computeProductPrice,
    compressImage,
    cleanPhoneForWhatsApp,
    parseOrderItems
  };
}