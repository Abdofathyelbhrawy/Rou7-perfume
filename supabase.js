// ============================================
// ROOH Perfume — Supabase Client
// This file is kept for documentation purposes.
// Actual credentials are defined inline in app.js, admin.js, and product.js
// to avoid module loading order issues.
// ============================================

const SUPABASE_URL  = 'https://oyslbombgdvcoyqotyao.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

// ──────────────────────────────────────────────
// HTTP helper (no npm or bundler required)
// ──────────────────────────────────────────────
async function supaQuery(table, options = {}) {
  const {
    method  = 'GET',
    filters = '',
    body    = null,
    select  = '*',
  } = options;

  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`;
  const headers = {
    'apikey':        SUPABASE_ANON,
    'Authorization': `Bearer ${SUPABASE_ANON}`,
    'Content-Type':  'application/json',
    'Prefer':        method === 'POST' ? 'return=representation' : '',
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error (${res.status}): ${err}`);
  }

  if (res.status === 204 || method === 'DELETE') return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ──────────────────────────────────────────────
// API Functions
// ──────────────────────────────────────────────

/** جلب كل المنتجات مرتبة */
export async function fetchProducts() {
  return supaQuery('products', {
    filters: '&in_stock=eq.true&order=sort_order.asc,created_at.desc',
  });
}

/** إنشاء طلب جديد */
export async function createOrder({ name, phone, address, items, total }) {
  const orderNumber = 'RO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const rows = await supaQuery('orders', {
    method: 'POST',
    body: { order_number: orderNumber, customer_name: name, phone, address, items, total },
  });
  return rows?.[0] ?? { order_number: orderNumber };
}

/** تتبع طلب برقمه */
export async function trackOrder(orderNumber) {
  const rows = await supaQuery('orders', {
    filters: `&order_number=eq.${encodeURIComponent(orderNumber)}&limit=1`,
  });
  return rows?.[0] ?? null;
}

/** الاشتراك في النشرة البريدية */
export async function subscribeNewsletter(email) {
  return supaQuery('newsletter', {
    method: 'POST',
    body: { email },
  });
}