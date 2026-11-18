// ============================================
// ROOH Perfume — Shared Constants
// Centralized constants to avoid magic numbers
// ============================================

// ──────────────────────────────────────────────
// Supabase Configuration
// ──────────────────────────────────────────────
const SUPABASE_URL  = 'https://oyslbombgdvcoyqotyao.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';
const WHATSAPP_PHONE    = '201000603308';
const WHATSAPP_BASE_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;

// ──────────────────────────────────────────────
// Storage Keys
// ──────────────────────────────────────────────
const STORAGE_KEYS = {
  CART: 'rooh-cart',
  THEME: 'rooh-theme',
  LANG: 'rooh-lang',
  CACHED_PRODUCTS: 'rooh-cached-products',
  CACHED_BRANDS: 'rooh-cached-brands',
  CACHED_ORDERS: 'rooh-cached-orders',
  DELETED_ORDERS: 'rooh-deleted-orders',
  ORDER_STATUSES: 'rooh-order-statuses',
  CAMPAIGN_SETTINGS: 'rooh-campaign-settings',
  ANNOUNCEMENTS: 'rooh-announcements',
  PROMO: 'rooh-promo',
  LAST_ORDER: 'rooh-last-order',
};

// ──────────────────────────────────────────────
// Gift Box Tiers
// ──────────────────────────────────────────────
const GIFT_TIERS = {
  2: {
    id: 2,
    key: 'gift_tier_2',
    title_ar: 'بوكس الثنائيات الملكي (عطرين ٥٠ مل)',
    title_en: 'Royal Duo Box (2 Perfumes 50ml)',
    price: 2800,
    max: 2,
    sub_ar: 'اختر عطرين فاخرين مع كارت إهداء وتغليف ملكي',
    sub_en: 'Choose 2 luxury fragrances + card & velvet box'
  },
  3: {
    id: 3,
    key: 'gift_tier_3',
    title_ar: 'بوكس الترويكا الملكي (٣ عطور ٥٠ مل)',
    title_en: 'Elite Trio Box (3 Perfumes 50ml)',
    price: 3900,
    max: 3,
    sub_ar: 'اختر ٣ عطور مفضلة مع كارت إهداء وتغليف ملكي',
    sub_en: 'Choose 3 favorite fragrances + card & velvet box'
  },
  4: {
    id: 4,
    key: 'gift_tier_4',
    title_ar: 'بوكس النخبة الملكي (٤ عطور ٥٠ مل)',
    title_en: 'Masterpiece Box (4 Perfumes 50ml)',
    price: 4900,
    max: 4,
    sub_ar: 'المجموعة الكاملة ٤ عطور مع كارت إهداء وتغليف ملكي',
    sub_en: 'Complete 4-perfume collection + card & velvet box'
  }
};

// ──────────────────────────────────────────────
// Thresholds & Limits
// ──────────────────────────────────────────────
const THRESHOLDS = {
  FREE_SHIPPING: 1500,
  MAX_GALLERY_IMAGES: 5,
  MAX_RELATED_PRODUCTS: 4,
  MAX_SEARCH_SUGGESTIONS: 5,
  MAX_ACCORDS_DISPLAY: 4,
  MAX_FOREIGN_ACCORDS: 6,
  COSMIC_INSPECT_DURATION: 8000,
  COSMIC_TICK: 50,
  TOAST_DURATION: 2300,
  LOADER_TIMEOUT: 400,
  SUPABASE_TIMEOUT: 10000,
  ADMIN_SUPABASE_TIMEOUT: 4000,
  REALTIME_RETRY_ATTEMPTS: 12,
  REALTIME_RETRY_INTERVAL: 500,
};

// ──────────────────────────────────────────────
// Default Values
// ──────────────────────────────────────────────
const DEFAULTS = {
  LANG: 'ar',
  THEME: 'light',
  LOYALTY: 3,
  SILLAGE: 2,
  CURRENCY_AR: 'ج.م',
  CURRENCY_EN: 'EGP',
  FALLBACK_IMAGE: 'assets/branding/2.svg',
  BRAND_LOGO_LIGHT: 'assets/branding/1.svg',
  BRAND_LOGO_DARK: 'assets/branding/2.svg',
  THEME_COLOR_LIGHT: '#f5f0eb',
  THEME_COLOR_DARK: '#1a1a2e',
};

// ──────────────────────────────────────────────
// System Product Names
// ──────────────────────────────────────────────
const SYSTEM_PRODUCTS = [
  '__system_announcements__',
  '__system_brands__',
  '__system_orders_meta__'
];

// ──────────────────────────────────────────────
// Cosmic Planet Colors
// ──────────────────────────────────────────────
const COSMIC_PLANET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF',
  '#FF8B94', '#96CEB4', '#FFD93D', '#DDA0DD'
];

// ──────────────────────────────────────────────
// Search Configuration
// ──────────────────────────────────────────────
const SEARCH_STOPWORDS = new Set([
  'عطر', 'عطور', 'براند', 'ماركه', 'ماركة', 'عطرين',
  'perfume', 'scent', 'brand', 'fragrance'
]);

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

// ──────────────────────────────────────────────
// Mood Profiles
// ──────────────────────────────────────────────
const MOOD_PROFILES = {
  winter: {
    icon: '❄️',
    ar: 'شتاء دافئ',
    en: 'Winter Warmth',
    auraColor: '#D4A373',
    badgeAr: 'دفء واسترخاء',
    badgeEn: 'Cozy & Warm'
  },
  majestic: {
    icon: '👑',
    ar: 'فخامة وهيبة',
    en: 'Majestic Presence',
    auraColor: '#C58F28',
    badgeAr: 'فخامة وهيبة',
    badgeEn: 'Regal & Majestic'
  },
  morning: {
    icon: '🌅',
    ar: 'صباح مشرق',
    en: 'Fresh Morning',
    auraColor: '#FBC02D',
    badgeAr: 'انتعاش وطاقة',
    badgeEn: 'Energetic & Fresh'
  },
  romantic: {
    icon: '💕',
    ar: 'رومانسي وساحر',
    en: 'Romantic Allure',
    auraColor: '#EC407A',
    badgeAr: 'جاذبية وسحر',
    badgeEn: 'Romantic & Charming'
  },
  aquatic: {
    icon: '🌊',
    ar: 'نسيم البحر',
    en: 'Ocean Breeze',
    auraColor: '#0288D1',
    badgeAr: 'حرية وانطلاق',
    badgeEn: 'Free & Flowing'
  }
};

// ──────────────────────────────────────────────
// Master Accords Catalog
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Default Brands
// ──────────────────────────────────────────────
const DEFAULT_BRANDS = [
  { id: 'rou7', name_ar: 'رُوح', name_en: 'Rou7', logo_url: '', description: 'ماركة رُوح الرسمية للعطور الفاخرة' },
  { id: 'matiere-premiere', name_ar: 'ماتيير بريمير', name_en: 'Matière Première', logo_url: '', description: '' },
  { id: 'ibraq', name_ar: 'إبراق', name_en: 'Ibraq', logo_url: '', description: '' }
];

// ──────────────────────────────────────────────
// Admin Accord Colors
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Notes Translation Map (subset - full in perfume-i18n.js)
// ──────────────────────────────────────────────
const NOTES_EN_TO_AR = {
  'bergamot': 'برغموت', 'lemon': 'ليمون', 'lime': 'لايم', 'orange': 'برتقال',
  'mandarin': 'يوسفي', 'grapefruit': 'جريب فروت', 'citrus': 'حمضيات',
  'apple': 'تفاح', 'pear': 'كمثرى', 'peach': 'خوخ', 'apricot': 'مشمش',
  'plum': 'برقوق', 'cherry': 'كرز', 'blackberry': 'توت أسود', 'raspberry': 'توت أحمر',
  'strawberry': 'فراولة', 'blueberry': 'توت أزرق', 'currant': 'كشمش',
  'pineapple': 'أناناس', 'mango': 'مانجو', 'coconut': 'جوز الهند',
  'melon': 'شمام', 'watermelon': 'بطيخ', 'lychee': 'ليتشي',
  'rose': 'ورد', 'jasmine': 'ياسمين', 'orange blossom': 'زهر البرتقال',
  'neroli': 'نيرولي', 'ylang-ylang': 'يلانج يلانج', 'tuberose': 'تيوب روز',
  'gardenia': 'غاردينيا', 'lily': 'زنبق', 'lily of the valley': 'زنبق الوادي',
  'violet': 'بنفسج', 'iris': 'سوسن', 'lavender': 'لافندر',
  'saffron': 'زعفران', 'cardamom': 'هيل', 'cinnamon': 'قرفة',
  'nutmeg': 'جوزة الطيب', 'clove': 'قرنفل', 'ginger': 'زنجبيل',
  'pepper': 'فلفل', 'pink pepper': 'فلفل وردي', 'black pepper': 'فلفل أسود',
  'vanilla': 'فانيليا', 'tonka bean': 'فول التونكا', 'benzoin': 'بنزوين',
  'amber': 'عنبر', 'ambroxan': 'أمبروكسان', 'musk': 'مسك',
  'white musk': 'مسك أبيض', 'sandalwood': 'خشب الصندل', 'cedar': 'أرز',
  'cedarwood': 'خشب الأرز', 'patchouli': 'باتشولي', 'vetiver': 'نجيل الهند',
  'oud': 'عود', 'agarwood': 'عود', 'guaiac wood': 'خشب الغاياك',
  'cashmeran': 'كشميران', 'cashmere wood': 'خشب الكشمير',
  'incense': 'بخور', 'frankincense': 'لبان', 'myrrh': 'مر',
  'leather': 'جلد', 'suede': 'سويدي', 'tobacco': 'تبغ',
  'coffee': 'قهوة', 'chocolate': 'شوكولاتة', 'cacao': 'كاكاو',
  'caramel': 'كراميل', 'honey': 'عسل', 'praline': 'برالين',
  'sea notes': 'نوتات بحرية', 'aquatic notes': 'نوتات مائية',
  'marine': 'بحري', 'ozone': 'أوزون', 'aldehydes': 'ألدهيدات',
  'freesia': 'فريزيا', 'peony': 'فاوانيا', 'magnolia': 'ماغنوليا',
  'honeysuckle': 'زهر العسل', 'wisteria': 'عناب', 'osmanthus': 'عثمانثوس',
  'rhubarb': 'راوند', 'fig': 'تين', 'fig leaf': 'ورق التين',
  'green notes': 'نوتات خضراء', 'galbanum': 'جلبانوم',
  'basil': 'ريحان', 'mint': 'نعناع', 'sage': 'مريمية',
  'rosemary': 'روزماري', 'thyme': 'زعتر', 'geranium': 'جرانيوم',
  'artemisia': 'شيح', 'wormwood': 'أفسنتين', 'mate': 'ماتيه',
  'tea': 'شاي', 'black tea': 'شاي أسود', 'green tea': 'شاي أخضر',
  'rum': 'رم', 'whiskey': 'ويسكي', 'cognac': 'كونياك',
  'brandy': 'برندي', 'wine': 'نبيذ', 'champagne': 'شمبانيا',
  'almond': 'لوز', 'bitter almond': 'لوز مر', 'hazelnut': 'بندق',
  'walnut': 'جوز', 'pistachio': 'فستق', 'chestnut': 'كستناء',
  'poppy': 'خشخاش', 'opoponax': 'أوبوبوناك', 'styrax': 'ستيراكس',
  'labdanum': 'لبدانوم', 'elemi': 'إيلمي', 'copal': 'كوبال',
  'ambergris': 'عنبر الحوت', 'civet': 'زباد', 'castoreum': 'قسطوريوم',
  'hyraceum': 'هيبرسيوم', 'muskrat': 'مسك الفأر',
  'amber wood': 'خشب عنبر', 'dry wood': 'خشب جاف',
  'white wood': 'خشب أبيض', 'akigalawood': 'أكيجالاود',
  'cypriol': 'سيبريول', 'nagarmotha': 'ناغارموثا',
  'papyrus': 'بردي', 'bamboo': 'خيزران', 'hay': 'قش',
  'tobacco leaf': 'ورق التبغ', 'pipe tobacco': 'تبغ الغليون',
  'cigar': 'سيجار', 'cigarette': 'سيجارة',
  'hay absolute': 'مستخلص القش', 'oats': 'شوفان',
  'wheat': 'قمح', 'barley': 'شعير', 'malt': 'شعير',
  'beer': 'بيرة', 'hops': 'حشيشة الدينار',
  'coffee bean': 'حبة قهوة', 'espresso': 'إسبريسو',
  'mocha': 'موكا', 'cappuccino': 'كابتشينو',
  'cream': 'قشدة', 'milk': 'حليب', 'butter': 'زبدة',
  'marshmallow': 'مارشميلو', 'cotton candy': 'قطن حلوى',
  'sugar': 'سكر', 'brown sugar': 'سكر بني', 'maple syrup': 'شراب القيقب',
  'molasses': 'دبس', 'treacle': 'دبس السكر',
  'birch': 'بتولا', 'oak': 'بلوط', 'oakmoss': 'طحلب البلوط',
  'moss': 'طحلب', 'lichen': 'أشنة', 'seaweed': 'طحالب',
  'algae': 'طحالب دقيقة', 'kelp': 'كيلب', 'spirulina': 'سبيرولينا',
  'chypre': 'شبري', 'fougere': 'فوجير', 'oriental': 'شرقي',
  'gourmand': 'غورماند', 'chocolatey': 'شوكولاتي',
  'nutty': 'جوزي', 'powdery': 'بودري', 'soapy': 'صابوني',
  'aldehydic': 'ألدهيدي', 'metallic': 'معدني', 'mineral': 'معدني',
  'earthy': 'ترابي', 'dusty': 'غبار', 'concrete': 'خرسانة',
  'asphalt': 'أسفلت', 'ink': 'حبر', 'paper': 'ورق',
  'rubber': 'مطاط', 'plastic': 'بلاستيك', 'vinyl': 'فينيل',
  'gasoline': 'بنزين', 'tar': 'قطران', 'smoke': 'دخان',
  'fire': 'نار', 'gunpowder': 'بارود', 'incendiary': 'حارق',
  'blood': 'دم', 'meat': 'لحم', 'iron': 'حديد',
  'copper': 'نحاس', 'gold': 'ذهب', 'silver': 'فضة',
  'steel': 'فولاذ', 'bronze': 'برونز', 'brass': 'نحاس أصفر'
};

const NOTES_AR_TO_EN = Object.fromEntries(
  Object.entries(NOTES_EN_TO_AR).map(([k, v]) => [v, k])
);

// ──────────────────────────────────────────────
// Export to window namespace for global access
// ──────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.RoohConstants = {
    SUPABASE_URL,
    SUPABASE_ANON,
    WHATSAPP_PHONE,
    WHATSAPP_BASE_URL,
    STORAGE_KEYS,
    GIFT_TIERS,
    THRESHOLDS,
    DEFAULTS,
    SYSTEM_PRODUCTS,
    COSMIC_PLANET_COLORS,
    SEARCH_STOPWORDS,
    BRAND_SEARCH_ALIASES,
    CATEGORY_SEARCH_ALIASES,
    MOOD_PROFILES,
    MASTER_ACCORDS,
    MASTER_SEASONS,
    DEFAULT_BRANDS,
    ADMIN_ACCORD_COLORS,
    NOTES_EN_TO_AR,
    NOTES_AR_TO_EN
  };
}