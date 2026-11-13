(() => {
  const $ = selector => document.querySelector(selector);

  // ── Supabase config (نفس القيم في app.js) ────────────────────────────────
  const SUPABASE_URL  = 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

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

  let currentProducts = [];
  try {
    const cachedP = localStorage.getItem('rooh-cached-products');
    if (cachedP) currentProducts = JSON.parse(cachedP) || [];
  } catch (_) {}

  let currentOrders = [];
  try {
    const cachedO = localStorage.getItem('rooh-cached-orders');
    if (cachedO) currentOrders = JSON.parse(cachedO) || [];
  } catch (_) {}

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

  const promoKey = 'rooh-promo';
  const defaultPromo = { title: 'شحن مجاني للطلبات فوق ١٥٠٠ جنيه', details: '', startsAt: '', endsAt: '', active: true };
  const campaignForm = $('#campaignForm');
  function readPromo() {
    try { return { ...defaultPromo, ...JSON.parse(localStorage.getItem(promoKey) || '{}') }; }
    catch (_) { return defaultPromo; }
  }
  function showCampaignPreview() {
    $('#promoPreviewTitle').textContent = $('#promoTitleInput').value.trim() || 'اكتب نص الإعلان هنا';
    $('#promoPreviewDetails').textContent = $('#promoDetailsInput').value.trim();
  }
  const promo = readPromo();
  $('#promoTitleInput').value = promo.title;
  $('#promoDetailsInput').value = promo.details;
  $('#promoStartInput').value = promo.startsAt;
  $('#promoEndInput').value = promo.endsAt;
  $('#promoActiveInput').checked = promo.active !== false;
  showCampaignPreview();
  campaignForm.addEventListener('input', showCampaignPreview);
  campaignForm.addEventListener('submit', event => {
    event.preventDefault();
    const startsAt = $('#promoStartInput').value;
    const endsAt = $('#promoEndInput').value;
    const status = $('#campaignStatus');
    if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      status.className = 'error';
      status.textContent = 'موعد الانتهاء لازم يكون بعد موعد البداية.';
      return;
    }
    const updatedPromo = {
      title: $('#promoTitleInput').value.trim(),
      details: $('#promoDetailsInput').value.trim(),
      startsAt,
      endsAt,
      active: $('#promoActiveInput').checked
    };
    try {
      localStorage.setItem(promoKey, JSON.stringify(updatedPromo));
      status.className = 'saved';
      status.textContent = updatedPromo.active ? 'تم حفظ الإعلان وجدولته.' : 'تم حفظ الإعلان كمسودة غير مفعلة.';
    } catch (_) {
      status.className = 'error';
      status.textContent = 'تعذر الحفظ في هذا المتصفح.';
    }
  });

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
    currentProducts = products || [];
    try { localStorage.setItem('rooh-cached-products', JSON.stringify(currentProducts)); } catch (_) {}
    $('#statProducts').textContent = arabicNum(currentProducts.length);
    $('#prodBadge').textContent     = arabicNum(currentProducts.length);

    if (!currentProducts.length) {
      $('#productsTable').innerHTML = `<tr><td colspan="7" class="empty-table">${adminLang === 'ar' ? 'لا توجد عطور حالياً. اضغط "إضافة عطر جديد" لإضافة أول عطر لمجموعتك! ✳' : 'No fragrances yet. Click "Add New Fragrance" to get started! ✳'}</td></tr>`;
      return;
    }

    const catLabels = {
      women:  { text: adminLang === 'ar' ? 'نسائي' : 'For Her', class: 'women' },
      men:    { text: adminLang === 'ar' ? 'رجالي' : 'For Him', class: 'men' },
      unisex: { text: adminLang === 'ar' ? 'للجميع' : 'Unisex', class: 'unisex' },
    };

    $('#productsTable').innerHTML = currentProducts.map(p => {
      const cat = catLabels[p.category] || { text: p.category || (adminLang === 'ar' ? 'للجميع' : 'Unisex'), class: 'unisex' };
      const imgHtml = p.image_url
        ? `<div class="prod-thumb"><img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}"></div>`
        : `<div class="prod-thumb"><span class="thumb-empty">🧴</span></div>`;

      const titlePrimary = adminLang === 'en' ? (p.latin || p.name) : p.name;
      const titleSub = adminLang === 'en' ? (p.latin ? p.name : '') : (p.latin || '');

      return `<tr>
        <td>${imgHtml}</td>
        <td class="prod-title-cell">
          <strong>${escapeHtml(titlePrimary)}</strong>
          ${titleSub ? `<small>${escapeHtml(titleSub)}</small>` : ''}
        </td>
        <td><span class="cat-pill ${cat.class}">${cat.text}</span></td>
        <td><strong>${money(p.price)}</strong></td>
        <td><span style="font-size:10px;color:var(--muted);">${escapeHtml(p.notes || '—')}</span></td>
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
      .then(renderProductsTable)
      .catch(err => {
        console.error('Admin products:', err);
        if (!currentProducts.length) {
          $('#productsTable').innerHTML = `<tr><td colspan="7" class="empty-table error">${adminLang === 'ar' ? 'تعذر تحميل العطور. تحقق من الاتصال.' : 'Failed to load fragrances. Check connection.'}</td></tr>`;
        }
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

  function openProductModal(product = null) {
    prodForm.reset();
    formStatus.textContent = '';
    formStatus.className   = '';
    clearImagePreview();

    if (product) {
      modalTitle.innerHTML = `تعديل عطر: <em>${escapeHtml(product.name)}</em>`;
      $('#productId').value     = product.id;
      $('#prodName').value      = product.name || '';
      $('#prodLatin').value     = product.latin || '';
      $('#prodPrice').value     = product.price || '';
      $('#prodCategory').value  = product.category || 'unisex';
      $('#prodNotes').value     = product.notes || '';
      $('#prodImage').value     = product.image_url || '';
      if (manualImg) manualImg.value = product.image_url || '';
      if (product.image_url) {
        showImagePreview(product.image_url);
      }
      $('#prodTag').value       = product.tag || '';
      $('#prodFeatured').checked = Boolean(product.is_featured);
      $('#prodInStock').checked  = product.in_stock !== false;
      $('#saveProdBtn').innerHTML = 'حفظ التعديلات <span>←</span>';
    } else {
      modalTitle.innerHTML = 'إضافة <em>عطر جديد</em>';
      $('#productId').value     = '';
      $('#prodCategory').value  = 'unisex';
      $('#prodInStock').checked  = true;
      $('#saveProdBtn').innerHTML = 'إضافة العطر <span>←</span>';
    }

    prodModal.classList.add('open');
  }

  function closeProductModal() {
    prodModal.classList.remove('open');
    clearImagePreview();
  }

  $('#openAddProduct')?.addEventListener('click', () => openProductModal());
  $('#productModalClose')?.addEventListener('click', closeProductModal);
  $('#cancelProdBtn')?.addEventListener('click', closeProductModal);
  prodModal?.addEventListener('click', e => { if (e.target === prodModal) closeProductModal(); });

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

    const payload = {
      name:        $('#prodName').value.trim(),
      latin:       $('#prodLatin').value.trim() || null,
      price:       parseFloat($('#prodPrice').value) || 0,
      category:    $('#prodCategory').value,
      notes:       $('#prodNotes').value.trim() || null,
      image_url:   imageUrl,
      tag:         $('#prodTag').value.trim() || null,
      is_featured: $('#prodFeatured').checked,
      in_stock:    $('#prodInStock').checked,
    };

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

  // ── Manual Refresh Buttons ───────────────────────────────────────────────
  $('#refreshProdsBtn')?.addEventListener('click', () => loadProducts(true));
  $('#refreshOrdersBtn')?.addEventListener('click', () => loadOrders(true));

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
