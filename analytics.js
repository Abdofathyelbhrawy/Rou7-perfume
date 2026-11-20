/**
 * ROU7 PERFUME — Analytics & Traffic Tracking
 * Tracks page views, product clicks, checkout visits with IP/location
 */
(() => {
  'use strict';

  const ANALYTICS_KEY = 'rooh-analytics-session';
  const SUPABASE_URL = 'https://oyslbombgdvcoyqotyao.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95c2xib21iZ2R2Y295cW90eWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNTksImV4cCI6MjExMDE0NzA1OX0.VxKOxH3MTxC2Pdnf6GSCSHoBd6bWIiEvqTV9dQTh3SU';

  // Event types
  const EVENT_TYPES = {
    PAGE_VIEW: 'page_view',
    PRODUCT_VIEW: 'product_view',
    CHECKOUT_VISIT: 'checkout_visit',
    ADD_TO_CART: 'add_to_cart',
    ORDER_PLACED: 'order_placed'
  };

  // Generate or get session ID
  function getSessionId() {
    let sessionId = sessionStorage.getItem(ANALYTICS_KEY);
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(ANALYTICS_KEY, sessionId);
    }
    return sessionId;
  }

  // Get visitor IP and location via free API
  async function getVisitorInfo() {
    try {
      const res = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return {
          ip: data.ip || 'unknown',
          country: data.country_name || 'unknown',
          city: data.city || 'unknown',
          region: data.region || 'unknown',
          isp: data.org || 'unknown'
        };
      }
    } catch (e) {
      console.warn('Analytics: Could not fetch IP info', e);
    }
    return {
      ip: 'unknown',
      country: 'unknown',
      city: 'unknown',
      region: 'unknown',
      isp: 'unknown'
    };
  }

  // Get current page info
  function getPageInfo() {
    return {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
      title: document.title,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: screen.width,
      screenHeight: screen.height
    };
  }

  // Send event to Supabase
  async function sendEvent(eventType, payload = {}) {
    const sessionId = getSessionId();
    const visitorInfo = await getVisitorInfo();
    const pageInfo = getPageInfo();

    const event = {
      event_type: eventType,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      ...visitorInfo,
      ...pageInfo,
      ...payload
    };

    // Store locally first (backup)
    storeEventLocally(event);

    // Send to Supabase
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/traffic_events`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(event)
      });
    } catch (e) {
      console.warn('Analytics: Failed to send to Supabase', e);
    }
  }

  // Local storage backup
  function storeEventLocally(event) {
    try {
      const key = 'rooh-traffic-events';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      stored.push(event);
      // Keep only last 500 events locally
      if (stored.length > 500) stored.shift();
      localStorage.setItem(key, JSON.stringify(stored));
    } catch (e) {
      console.warn('Analytics: Local storage failed', e);
    }
  }

  // Get locally stored events (for admin dashboard)
  function getLocalEvents() {
    try {
      return JSON.parse(localStorage.getItem('rooh-traffic-events') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Track page view
  function trackPageView() {
    sendEvent(EVENT_TYPES.PAGE_VIEW);
  }

  // Track product view
  function trackProductView(productId, productName, productPrice) {
    sendEvent(EVENT_TYPES.PRODUCT_VIEW, {
      product_id: productId,
      product_name: productName,
      product_price: productPrice
    });
  }

  // Track checkout visit
  function trackCheckoutVisit(cartValue, itemCount) {
    sendEvent(EVENT_TYPES.CHECKOUT_VISIT, {
      cart_value: cartValue,
      item_count: itemCount
    });
  }

  // Track add to cart
  function trackAddToCart(productId, productName, price, quantity) {
    sendEvent(EVENT_TYPES.ADD_TO_CART, {
      product_id: productId,
      product_name: productName,
      price: price,
      quantity: quantity
    });
  }

  // Track order placed
  function trackOrderPlaced(orderId, orderValue, items) {
    sendEvent(EVENT_TYPES.ORDER_PLACED, {
      order_id: orderId,
      order_value: orderValue,
      items: items
    });
  }

  // Auto-track page view on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }

  // Expose globally
  window.RoohAnalytics = {
    trackPageView,
    trackProductView,
    trackCheckoutVisit,
    trackAddToCart,
    trackOrderPlaced,
    getLocalEvents,
    EVENT_TYPES
  };
})();