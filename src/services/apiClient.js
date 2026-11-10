// ── Shared API Client ─────────────────────────────────────────────────────────
// Central wrapper for every backend call so that:
//   1. Cookies are always sent (PHP session auth).
//   2. The CSRF token is attached to every state-changing request.
//   3. A forced password rotation is detected globally and surfaced to the UI.
//   4. Errors are normalised into { ok, data } instead of throwing.

const CSRF_STORAGE_KEY = 'monarch_csrf_token';

let csrfToken = null;
let onPasswordChangeRequired = null;

function readStoredToken() {
  try {
    return sessionStorage.getItem(CSRF_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function writeStoredToken(token) {
  try {
    if (token) sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    else sessionStorage.removeItem(CSRF_STORAGE_KEY);
  } catch {
    /* storage unavailable — token stays in memory only */
  }
}

/** Register the csrf token returned by login / session responses. */
export function setCsrfToken(token) {
  csrfToken = token || null;
  writeStoredToken(csrfToken);
}

export function getCsrfToken() {
  if (!csrfToken) csrfToken = readStoredToken();
  return csrfToken;
}

/**
 * Called when the backend reports that the account must change its password.
 * AdminGate subscribes to this so it can show the forced-rotation screen.
 */
export function onForcePasswordChange(handler) {
  onPasswordChangeRequired = handler;
}

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

/**
 * fetch wrapper.
 * @param {string} url
 * @param {object} options  { method, body, headers, ... }
 * @returns {Promise<{ok:boolean, status:number, data:any}>}
 */
export async function apiRequest(url, options = {}) {
  const method = String(options.method || 'GET').toUpperCase();
  const headers = { ...(options.headers || {}) };

  let body = options.body;
  if (body !== undefined && body !== null && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    if (!headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  // CSRF token on every mutating request.
  if (MUTATING_METHODS.has(method)) {
    const token = getCsrfToken();
    if (token) headers['X-CSRF-Token'] = token;
  }

  let res;
  try {
    res = await fetch(url, {
      ...options,
      method,
      body,
      headers,
      credentials: options.credentials || 'same-origin',
    });
  } catch (err) {
    return { ok: false, status: 0, data: { success: false, error: 'Network error. Please check your connection.' } };
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = { success: false, error: `Unexpected response (HTTP ${res.status}).` };
  }

  // Keep the CSRF token fresh when the server rotates it.
  if (data && data.csrf_token) setCsrfToken(data.csrf_token);

  // Forced password rotation → let the UI take over.
  if (res.status === 403 && data && data.code === 'password_change_required') {
    if (onPasswordChangeRequired) onPasswordChangeRequired(data);
  }

  return { ok: res.ok, status: res.status, data };
}

/** Convenience wrapper for GET requests with optional query params. */
export async function apiGet(url, params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  const full = qs.toString() ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;
  return apiRequest(full, { method: 'GET' });
}

/** Convenience wrapper for JSON POST requests. */
export async function apiPost(url, body = {}) {
  return apiRequest(url, { method: 'POST', body });
}

export default apiRequest;
