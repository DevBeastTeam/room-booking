// ── Analytics tracking service ───────────────────────────────────────────────
// Public pages se visitor + buy-click events backend pe bhejta hai
// (Dev panel → Analytics section mein sab kuch dikhta hai)

const API = '/backend/api/analytics.php';
const VISITOR_KEY = 'mp_visitor_id';

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = 'v-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon-' + Math.random().toString(36).slice(2, 10);
  }
}

function post(payload) {
  try {
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ visitor_id: getVisitorId(), ...payload }),
    }).catch(() => { /* analytics never breaks UX */ });
  } catch { /* ignore */ }
}

/** Har public page load pe call hota hai (Layout.astro se) */
export function trackPageView() {
  if (typeof window === 'undefined') return;
  post({
    type: 'pageview',
    path: window.location.pathname,
    referrer: document.referrer || '',
  });
}

/** Custom events: buy_click, tour_scheduled, inquiry, paddle_started */
export function trackEvent(type, meta = {}) {
  if (typeof window === 'undefined') return;
  post({
    type,
    path: window.location.pathname,
    meta,
  });
}

export default { trackPageView, trackEvent };
