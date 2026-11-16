/**
 * perfume-i18n.js
 * Comprehensive bilingual (Arabic <-> English) perfume translation engine for Rou7 Perfume.
 * Translates descriptions, olfactory pyramids (top/heart/base notes), accords, and metadata.
 */
(() => {
  // ── 1. Official Catalog High-Fidelity Translations ─────────────────────────
  const KNOWN_PERFUMES = {
    // 1. Blue Diamond Aqua
    'da81db46-af51-49ae-8de8-7560beb12b5d': {
      name_ar: 'بلو دايموند اكوا',
      name_en: 'Blue Diamond Aqua',
      desc_ar: 'رحلة خيالية ساحرة تأخذك إلى شواطئ جزيرة غنّاء تنبض بذكريات منعشة، تتدفق على حواسك كأمواج هادئة تفيض بعبير البرغموت الغامض. يهب نسيم عليل يمزج انتعاش الحمضيات بنفحات البحر النقية، بينما يتصاعد المسك الدافئ في قلب العطر، محاطاً بنغمات الباتشولي الحسي ولمسات الزعفران المترفة مع عمق البخور الفاخر، ليمنحك حضوراً آسراً يفيض بالمشاعر والأناقة.',
      desc_en: 'A wonderful fantasy journey to the shores of an island lush with refreshing memories, flowing on your senses like wild waves of the mysterious scent of bergamot. A refreshing breeze blows, mixing the freshness of citruses with the scent of the sea. The strong and warm musk rises in this fragrance, wrapped in the sensual notes of deep patchouli, the soft tones of the warmth of saffron, and the intense intensity of incense, which propels the fragrance to an emotive height.',
      top_notes_ar: 'برغموت، نوتات بحرية، زعفران',
      top_notes_en: 'Bergamot, Sea Notes, Saffron',
      middle_notes_ar: 'إكليل الجبل (روزماري)، يلانج يلانج، حمضيات',
      middle_notes_en: 'Rosemary, Ylang-Ylang, Citrus',
      base_notes_ar: 'بخور فاخر، مسك دافئ، باتشولي',
      base_notes_en: 'Incense, Musk, Patchouli'
    },
    // 2. Pink Diamond Sakura
    '87f7e3c3-7263-4212-8cde-c13ac928e4b1': {
      name_ar: 'بينك دايموند ساكورا',
      name_en: 'Pink Diamond Sakura',
      desc_ar: 'تجسيدٌ نقيّ لكل معاني الجمال... كجوهرة ثمينة تخطف الأنظار وتأسر القلوب برقة وفيض من المشاعر. تتناغم بتلات الورد المخملية مع قوة خشب الصندل الدافئ، وتتعانق زهور البرتقال المنعشة مع زنابق الوادي لتنساب في تناغم هادئ وفاتن. يدعوك بينك دايموند ساكورا إلى رحلة ساحرة عبر أمواج عطرية فاخرة تفيض بالأنوثة والرقي.',
      desc_en: 'It is a description of all beauty... like a precious jewel that catches the eye and steals the heart with love and kindness. Delicate rose petals encapsulate the power of sandalwood, and between the bark and the flowers, there is a group of notes supported by a fresh introduction of orange blossom embracing lilies that swings on a sedate. Pink Diamond perfume invites you to join him on a journey through luxurious aromatic waves.',
      top_notes_ar: 'فاوانيا، زهر البرتقال، يوسفي',
      top_notes_en: 'Peony, Orange Blossom, Mandarin',
      middle_notes_ar: 'ورد مخملي، زنبق، زهر الكرز (ساكورا)',
      middle_notes_en: 'Rose, Lily, Cherry Blossom',
      base_notes_ar: 'خشب الصندل، مسك أبيض، عنبر دافئ',
      base_notes_en: 'Sandalwood, White Musk, Amber'
    },
    // 3. Nude Coral Diamond
    'd6973def-50dd-4e75-8005-8ee22eb23872': {
      name_ar: 'نود كورال دايموند',
      name_en: 'Nude Coral Diamond',
      desc_ar: 'يتألق نود كورال دايموند كنغمة مضيئة في سيمفونية الغروب الساحرة. يرقص البرغموت المنعش مع نفحات الزعفران الثمين، وتتعانق زهور البرتقال مع لمسة حالمة من جوز الهند، بينما يكتمل هذا الإبداع العطري الفاخر بدفء الكشميران والفانيليا ليصنع بصمة عطرية تدوم طويلاً.',
      desc_en: 'Nude Coral Diamond takes center stage as the luminous note of a sunset’s symphony. Bergamot dances with saffron, joined by orange blossom and coconut, while the warmth of cashmeran and vanilla completes the aromatic masterpiece.',
      top_notes_ar: 'برغموت منعش، تفاح، زعفران',
      top_notes_en: 'Bergamot, Apple, Saffron',
      middle_notes_ar: 'زهر البرتقال، جوز الهند، خشب الغاياك',
      middle_notes_en: 'Orange Blossom, Coconut, Guaiac Wood',
      base_notes_ar: 'فانيليا ناعمة، عنبر، كشميران دافئ',
      base_notes_en: 'Vanilla, Amber, Cashmeran'
    },
    // 4. Greek Tobacco
    '7dbf55ce-89bc-4a7b-a0e4-2057974a2c78': {
      name_ar: 'جريك توباكو',
      name_en: 'Greek Tobacco',
      desc_ar: 'في عالم العطور الراقية، يتألق جريك توباكو كتحفة فنية تجمع بين أريج الزهور الساحرة وغموض التبغ اليوناني الفاخر. يتدفق عبير الفاوانيا الرقيق كنسيم حلو دافئ تمتزج معه نغمات المسك العميق، ليجسد عطراً ينبض بالجاذبية والفخامة في آنٍ واحد، ويأسر القلوب بسحره الاستثنائي.',
      desc_en: 'In the world of perfumes, Greek Tobacco perfume shines as a masterpiece that combines the fragrance of flowers with the mystery of luxurious Greek Tobacco. The delicate scent of peony flows like a sweet breeze, with deep musk tones, a fragrance that embodies beauty and luxury at the same time, sparkling brilliantly and captivating hearts with its unique charm.',
      top_notes_ar: 'نرجس، ليتشي، ورد',
      top_notes_en: 'Narcissus, Lychee, Rose',
      middle_notes_ar: 'مشمش، زهر البرتقال، سوسن',
      middle_notes_en: 'Apricot, Orange Flower, Iris',
      base_notes_ar: 'تبغ يوناني فاخر، مسك عميق، فاوانيا',
      base_notes_en: 'Greek Tobacco, Musk, Peony'
    },
    // 5. Spanish Tobacco
    'a44cc91d-55ca-4a3c-aa1c-e1f8b791155f': {
      name_ar: 'سبانش توباكو',
      name_en: 'Spanish Tobacco',
      desc_ar: 'من اللحظة الأولى التي ينطلق فيها عطر سبانش توباكو، يفوح شذاه المميز بنفحات الزعفران الفاخر وحبوب التونكا، ممتزجاً بنعومة مع العنبر الدافئ وأوراق التبغ الإسباني، لتتوج هذا الأثر العطري الرائع رقة أزهار الياسمين والأخشاب العطرية النبيلة.',
      desc_en: 'From the moment the Spanish Tobacco perfume soars high, its distinctive fragrance spreads with the enveloped notes of saffron and tonka, blending delicately with amber and tobacco, and finally embraced by the delicateness of jasmine flowers and woods to create a wonderful aromatic effect.',
      top_notes_ar: 'نوتات مائية منعشة، زعفران، حبوب التونكا',
      top_notes_en: 'Aquatic Notes, Saffron, Tonka bean',
      middle_notes_ar: 'كاكاو غني، عنبر دافئ، تبغ إسباني فاخر',
      middle_notes_en: 'Cocoa, Amber, Spanish tobacco',
      base_notes_ar: 'سوسن مخملي، أخشاب عطرية نبيلة',
      base_notes_en: 'Iris, Woody notes'
    },
    // 6. Black Diamond Incense
    '8b27644c-e280-422d-9574-bd5d3c99b72d': {
      name_ar: 'بلاك دايموند انسنس',
      name_en: 'Black Diamond Incense',
      desc_ar: 'تجربة عطرية لا مثيل لها مع عطر بلاك دايموند إنسنس، حيث يبرز العود الملكي بكامل قوته وجاذبيته في عبير ثمين من الجلود والأخشاب النبيلة التي تستحضر كل فخامة الشرق وأسراره. عطر يتحدى حواسك بتناغم بارع بين رقي الجلود الفاخرة والنغمات المائية المنعشة، تلتقي مع شذى البخور الغامض في مزيج يجمع بين أصالة الشرق وحداثة الغرب، ليعبر عن ذوقك الرفيع وحضورك الاستثنائي.',
      desc_en: 'We are all unique, but differences define us, just like aromatic notes, we play our roles and when we unite - together we create a beautiful scent that represents us all. An unparalleled aromatic experience with Black Diamond perfume, Oud shows all its strength and attractiveness in a precious scent of leather and woods that evokes all the luxury and mystery of the East. A fragrance that challenges your senses, as it masterfully weaves between soft and strong leather and refreshing aquatic notes. These unique ingredients converge with mysterious scents of incense, in a wonderful combination that combines East and West. We invite you to an enriching experience of the most beautiful luxurious scents of oud to touch your luxurious taste.',
      top_notes_ar: 'نوتات مائية، خشب البتولا، كشمش أسود',
      top_notes_en: 'Aquatic Notes, Birch, Black Currant',
      middle_notes_ar: 'بخور شرقي فاخر، خشب الصندل، فانيليا ناعمة',
      middle_notes_en: 'Incense, Sandalwood, Vanilla',
      base_notes_ar: 'عنبر دافئ، جلود فاخرة، دخان معتق، عود ملكي',
      base_notes_en: 'Amber, Leather, Smoke, Oud'
    }
  };

  // ── 2. Comprehensive Bilingual Olfactory Notes Dictionary ──────────────────
  const NOTES_EN_TO_AR = {
    // Citrus & Fruits
    'bergamot': 'برغموت',
    'citrus': 'حمضيات',
    'citruses': 'حمضيات منعشة',
    'mandarin': 'يوسفي',
    'lemon': 'ليمون',
    'lime': 'لايم',
    'grapefruit': 'جريب فروت',
    'apple': 'تفاح',
    'peach': 'خوخ',
    'apricot': 'مشمش',
    'lychee': 'ليتشي',
    'pear': 'كمثرى',
    'black currant': 'كشمش أسود',
    'coconut': 'جوز الهند',
    'red fruits': 'فواكه حمراء',
    'berries': 'توت مشكل',
    'fig': 'تين',
    'plum': 'برقوق',
    'pineapple': 'أناناس',
    'passion fruit': 'باشن فروت',
    'mango': 'مانجو',

    // Floral
    'rose': 'ورد',
    'peony': 'فاوانيا',
    'jasmine': 'ياسمين',
    'orange blossom': 'زهر البرتقال',
    'orange flower': 'زهر البرتقال',
    'neroli': 'نيرولي',
    'lily': 'زنبق',
    'lily of the valley': 'زنبق الوادي',
    'cherry blossom': 'زهر الكرز (ساكورا)',
    'sakura': 'زهر الكرز (ساكورا)',
    'iris': 'سوسن',
    'narcissus': 'نرجس',
    'ylang-ylang': 'يلانج يلانج',
    'tuberose': 'مسك الروم',
    'gardenia': 'غاردينيا',
    'magnolia': 'ماغنوليا',
    'violet': 'بنفسج',
    'lavender': 'لافندر (خزامى)',
    'heliotrope': 'هليوتروب',
    'osmanthus': 'أوسمانثوس',
    'white flowers': 'زهور بيضاء',
    'white floral': 'زهور بيضاء',

    // Spices
    'saffron': 'زعفران',
    'cardamom': 'هيل',
    'pink pepper': 'فلفل وردي',
    'black pepper': 'فلفل أسود',
    'cinnamon': 'قرفة',
    'ginger': 'زنجبيل',
    'nutmeg': 'جوزة الطيب',
    'clove': 'قرنفل',
    'cloves': 'قرنفل',
    'anise': 'يانسون',
    'star anise': 'يانسون نجمي',
    'coriander': 'كزبرة',

    // Woods & Resins
    'sandalwood': 'خشب الصندل',
    'cedarwood': 'خشب الأرز',
    'cedar': 'خشب الأرز',
    'oud': 'عود ملكي',
    'agarwood': 'خشب العود',
    'guaiac wood': 'خشب الغاياك',
    'birch': 'خشب البتولا',
    'cashmeran': 'كشميران',
    'patchouli': 'باتشولي',
    'vetiver': 'نجيل الهند (فيتيفر)',
    'cypress': 'سرو',
    'woody notes': 'أخشاب عطرية',
    'woods': 'أخشاب',

    // Balsamic & Resins
    'amber': 'عنبر دافئ',
    'ambergris': 'عنبر الحوت',
    'incense': 'بخور فاخر',
    'frankincense': 'لبان الذكر',
    'myrrh': 'مر',
    'benzoin': 'جاوي (بنزوين)',
    'labdanum': 'لادن',
    'elemi': 'إليمي',

    // Gourmand & Sweet
    'vanilla': 'فانيليا ناعمة',
    'tonka bean': 'حبوب التونكا',
    'tonka': 'تونكا',
    'cocoa': 'كاكاو',
    'chocolate': 'شوكولاتة',
    'caramel': 'كراميل',
    'honey': 'عسل نقي',
    'coffee': 'قهوة',
    'praline': 'برالين',
    'almond': 'لوز',

    // Tobacco & Leather & Musk
    'tobacco': 'تبغ فاخر',
    'greek tobacco': 'تبغ يوناني',
    'spanish tobacco': 'تبغ إسباني',
    'leather': 'جلود فاخرة',
    'suede': 'جلد سويدي مخملي',
    'smoke': 'دخان معتق',
    'musk': 'مسك',
    'white musk': 'مسك أبيض',

    // Herbs & Green & Marine
    'rosemary': 'إكليل الجبل (روزماري)',
    'mint': 'نعناع',
    'basil': 'ريحان',
    'sage': 'ميرمية',
    'clary sage': 'ميرمية كلاري',
    'aquatic notes': 'نوتات مائية',
    'sea notes': 'نوتات بحرية',
    'marine notes': 'نوتات بحرية',
    'green notes': 'نوتات خضراء',
    'ozonic notes': 'نوتات أوزونية',
    'cognac': 'كونياك',
    'rum': 'روم فاخر',
    'tea': 'شاي',
    'black tea': 'شاي أسود',
    'green tea': 'شاي أخضر'
  };

  // Reverse mapping (Arabic to English)
  const NOTES_AR_TO_EN = {};
  for (const [en, ar] of Object.entries(NOTES_EN_TO_AR)) {
    const cleanAr = ar.replace(/[\(\)]/g, '').trim();
    NOTES_AR_TO_EN[ar.toLowerCase()] = en.charAt(0).toUpperCase() + en.slice(1);
    NOTES_AR_TO_EN[cleanAr.toLowerCase()] = en.charAt(0).toUpperCase() + en.slice(1);
  }

  // ── 3. Helper: Normalize lookup strings ──────────────────────────────────────
  function normKey(str) {
    if (!str) return '';
    return String(str).toLowerCase().trim().replace(/[\u064B-\u065F]/g, '');
  }

  // ── 4. Main Translation Functions ──────────────────────────────────────────

  /**
   * Translates a comma/semicolon separated list of perfume notes
   */
  function translateNotes(notesStr, targetLang = 'ar') {
    if (!notesStr || typeof notesStr !== 'string') return '';
    const parts = notesStr.split(/[,،؛;]/).map(s => s.trim()).filter(Boolean);
    if (!parts.length) return '';

    if (targetLang === 'ar') {
      const translated = parts.map(part => {
        const lower = part.toLowerCase();
        if (NOTES_EN_TO_AR[lower]) return NOTES_EN_TO_AR[lower];
        // Partial matching for combined terms e.g. "Spanish tobacco"
        for (const [en, ar] of Object.entries(NOTES_EN_TO_AR)) {
          if (lower === en || lower.includes(en)) return ar;
        }
        return part;
      });
      return translated.join('، ');
    } else {
      const translated = parts.map(part => {
        const lower = part.toLowerCase();
        if (NOTES_AR_TO_EN[lower]) return NOTES_AR_TO_EN[lower];
        for (const [ar, en] of Object.entries(NOTES_AR_TO_EN)) {
          if (lower === ar || lower.includes(ar)) return en;
        }
        return part;
      });
      return translated.join(', ');
    }
  }

  /**
   * Translates a perfume description text between AR and EN
   */
  function translateDesc(descText, targetLang = 'ar', productId = '', productName = '') {
    if (!descText && !productId && !productName) return '';
    const raw = String(descText || '').trim();

    // 1. Direct Match against KNOWN_PERFUMES catalog by ID
    if (productId && KNOWN_PERFUMES[productId]) {
      const item = KNOWN_PERFUMES[productId];
      return targetLang === 'ar' ? item.desc_ar : item.desc_en;
    }

    // 2. Direct Match by name
    if (productName) {
      const pNorm = normKey(productName);
      for (const item of Object.values(KNOWN_PERFUMES)) {
        if (normKey(item.name_ar) === pNorm || normKey(item.name_en) === pNorm || pNorm.includes(normKey(item.name_en))) {
          return targetLang === 'ar' ? item.desc_ar : item.desc_en;
        }
      }
    }

    // 3. Match by description substring in KNOWN_PERFUMES
    if (raw) {
      for (const item of Object.values(KNOWN_PERFUMES)) {
        if (item.desc_en && (raw.includes(item.desc_en.slice(0, 35)) || item.desc_en.includes(raw.slice(0, 35)))) {
          return targetLang === 'ar' ? item.desc_ar : item.desc_en;
        }
        if (item.desc_ar && (raw.includes(item.desc_ar.slice(0, 25)) || item.desc_ar.includes(raw.slice(0, 25)))) {
          return targetLang === 'ar' ? item.desc_ar : item.desc_en;
        }
      }
    }

    // 4. Fallback phrase dictionary for dynamic translations
    const PHRASE_PAIRS = [
      ['A wonderful fantasy journey to the shores of an island', 'رحلة خيالية ساحرة تأخذك إلى شواطئ جزيرة غنّاء'],
      ['lush with refreshing memories', 'تنبض بذكريات منعشة'],
      ['flowing on your senses like wild waves', 'تتدفق على حواسك كأمواج هادئة'],
      ['mysterious scent of bergamot', 'عبير البرغموت الغامض'],
      ['A refreshing breeze blows, mixing the freshness of citruses with the scent of the sea', 'يهب نسيم عليل يمزج انتعاش الحمضيات بنفحات البحر النقية'],
      ['The strong and warm musk rises in this fragrance', 'يتصاعد المسك الدافئ في قلب هذا العطر'],
      ['wrapped in the sensual notes of deep patchouli', 'محاطاً بنغمات الباتشولي الحسي ولمسات الزعفران'],
      ['the soft tones of the warmth of saffron', 'لمسات الزعفران المترفة'],
      ['the intense intensity of incense', 'عمق البخور الفاخر'],
      ['propels the fragrance to an emotive height', 'يمنحك حضوراً آسراً يفيض بالمشاعر والأناقة'],
      ['It is a description of all beauty', 'تجسيدٌ نقيّ لكل معاني الجمال'],
      ['like a precious jewel that catches the eye and steals the heart', 'كجوهرة ثمينة تخطف الأنظار وتأسر القلوب'],
      ['with love and kindness', 'برقة وفيض من المشاعر'],
      ['Delicate rose petals encapsulate the power of sandalwood', 'تتناغم بتلات الورد المخملية مع قوة خشب الصندل الدافئ'],
      ['between the bark and the flowers', 'بين عبير الأزهار والأخشاب العطرية'],
      ['fresh introduction of orange blossom embracing lilies', 'زهور البرتقال المنعشة تتعانق مع زنابق الوادي'],
      ['invites you to join him on a journey through luxurious aromatic waves', 'يدعوك إلى رحلة ساحرة عبر أمواج عطرية فاخرة'],
      ['takes center stage as the luminous note of a sunset’s symphony', 'يتألق كنغمة مضيئة في سيمفونية الغروب الساحرة'],
      ['Bergamot dances with saffron, joined by orange blossom and coconut', 'يرقص البرغموت المنعش مع نفحات الزعفران الثمين وزهور البرتقال وجوز الهند'],
      ['warmth of cashmeran and vanilla completes the aromatic masterpiece', 'دفء الكشميران والفانيليا يكمل هذا الإبداع العطري'],
      ['In the world of perfumes', 'في عالم العطور الراقية'],
      ['shines as a masterpiece that combines', 'يتألق كتحفة فنية تجمع بين'],
      ['fragrance of flowers with the mystery of luxurious', 'أريج الزهور الساحرة وغموض'],
      ['delicate scent of peony flows like a sweet breeze', 'عبير الفاوانيا الرقيق يتدفق كنسيم حلو دافئ'],
      ['deep musk tones', 'نغمات المسك العميق'],
      ['embodies beauty and luxury at the same time', 'يجسد الجاذبية والفخامة في آنٍ واحد'],
      ['sparkling brilliantly and captivating hearts with its unique charm', 'يأسر القلوب بسحره الاستثنائي'],
      ['From the moment the Spanish Tobacco perfume soars high', 'من اللحظة الأولى التي ينطلق فيها عطر سبانش توباكو'],
      ['its distinctive fragrance spreads with the enveloped notes of saffron and tonka', 'يفوح شذاه المميز بنفحات الزعفران الفاخر وحبوب التونكا'],
      ['blending delicately with amber and tobacco', 'ممتزجاً بنعومة مع العنبر الدافئ وأوراق التبغ'],
      ['delicateness of jasmine flowers and woods to create a wonderful aromatic effect', 'أزهار الياسمين والأخشاب العطرية النبيلة تصنع أثراً ساحراً'],
      ['An unparalleled aromatic experience', 'تجربة عطرية لا مثيل لها'],
      ['Oud shows all its strength and attractiveness', 'يبرز العود الملكي بكامل قوته وجاذبيته'],
      ['precious scent of leather and woods that evokes all the luxury and mystery of the East', 'عبير ثمين من الجلود والأخشاب النبيلة يستحضر فخامة الشرق وأسراره'],
      ['A fragrance that challenges your senses', 'عطر يتحدى حواسك بتناغم بارع'],
      ['soft and strong leather and refreshing aquatic notes', 'رقي الجلود الفاخرة والنغمات المائية المنعشة'],
      ['mysterious scents of incense', 'شذى البخور الغامض'],
      ['combines East and West', 'يجمع بين أصالة الشرق وحداثة الغرب'],
      ['An exquisite fragrance meticulously blended to reflect your unique presence and leave an indelible impression', 'عطر فاخر صُنع بعناية ليعكس حضورك المتميز ويترك أثراً لا يُنسى في كل لحظة'],
      ['عطر فاخر صُنع بعناية ليعكس حضورك المتميز ويترك أثراً لا يُنسى في كل لحظة', 'An exquisite fragrance meticulously blended to reflect your unique presence and leave an indelible impression']
    ];

    let result = raw;
    if (targetLang === 'ar') {
      // If it's already mostly Arabic, return it
      if (/[\u0600-\u06FF]/.test(raw) && !/[a-zA-Z]{15,}/.test(raw)) return raw;
      PHRASE_PAIRS.forEach(([en, ar]) => {
        result = result.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ar);
      });
    } else {
      // Target English: If already mostly English, return it
      if (!/[\u0600-\u06FF]/.test(raw)) return raw;
      PHRASE_PAIRS.forEach(([en, ar]) => {
        result = result.replace(new RegExp(ar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), en);
      });
    }

    return result || raw;
  }

  /**
   * Returns a complete localized view of a product object based on targetLang ('ar' or 'en')
   */
  function getLocalizedProduct(product, targetLang = 'ar') {
    if (!product) return {};

    let meta = {};
    if (product.notes && typeof product.notes === 'string' && (product.notes.trim().startsWith('{') || product.notes.trim().startsWith('['))) {
      try { meta = JSON.parse(product.notes); } catch (_) {}
    }

    const isAr = targetLang === 'ar';
    const prodId = String(product.id || '');
    const known = KNOWN_PERFUMES[prodId] || null;

    // 1. Name & Latin
    const name = isAr
      ? (product.name || (known ? known.name_ar : 'عطر رُوح'))
      : (product.latin || (known ? known.name_en : product.name));
    const sub = isAr
      ? (product.latin || (known ? known.name_en : ''))
      : (product.name || (known ? known.name_ar : ''));

    // 2. Description
    let desc = '';
    if (isAr) {
      desc = meta.desc_ar || (known ? known.desc_ar : null);
      if (!desc) {
        desc = translateDesc(meta.desc || product.notes || '', 'ar', prodId, product.name);
      }
    } else {
      desc = meta.desc_en || (known ? known.desc_en : null);
      if (!desc) {
        desc = translateDesc(meta.desc || product.notes || '', 'en', prodId, product.latin || product.name);
      }
    }

    // 3. Olfactory Notes (Pyramid)
    const rawTop = product.top_notes || meta.top_notes || (known ? (isAr ? known.top_notes_ar : known.top_notes_en) : '');
    const rawMid = product.middle_notes || meta.middle_notes || (known ? (isAr ? known.middle_notes_ar : known.middle_notes_en) : '');
    const rawBase = product.base_notes || meta.base_notes || (known ? (isAr ? known.base_notes_ar : known.base_notes_en) : '');

    const topNotes = isAr
      ? (meta.top_notes_ar || (known ? known.top_notes_ar : translateNotes(rawTop, 'ar')))
      : (meta.top_notes_en || (known ? known.top_notes_en : translateNotes(rawTop, 'en')));

    const middleNotes = isAr
      ? (meta.middle_notes_ar || (known ? known.middle_notes_ar : translateNotes(rawMid, 'ar')))
      : (meta.middle_notes_en || (known ? known.middle_notes_en : translateNotes(rawMid, 'en')));

    const baseNotes = isAr
      ? (meta.base_notes_ar || (known ? known.base_notes_ar : translateNotes(rawBase, 'ar')))
      : (meta.base_notes_en || (known ? known.base_notes_en : translateNotes(rawBase, 'en')));

    // 4. Accords
    const rawAccords = product.accords || meta.accords || '';
    const accords = isAr ? translateNotes(rawAccords, 'ar') : translateNotes(rawAccords, 'en');

    return {
      name,
      sub,
      desc: desc || (isAr ? 'عطر فاخر صُنع بعناية ليعكس حضورك المتميز ويترك أثراً لا يُنسى في كل لحظة.' : 'An exquisite fragrance meticulously blended to reflect your unique presence and leave an indelible impression.'),
      top_notes: topNotes,
      middle_notes: middleNotes,
      base_notes: baseNotes,
      accords,
      raw_meta: meta
    };
  }

  // Export to global window namespace
  window.PerfumeI18n = {
    KNOWN_PERFUMES,
    NOTES_EN_TO_AR,
    NOTES_AR_TO_EN,
    translateNotes,
    translateDesc,
    getLocalizedProduct
  };
})();
