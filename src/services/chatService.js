// ── Chat Service ─────────────────────────────────────────────────────────────
// Server backed live chat. Conversations live in the backend (MySQL with a
// JSON file fallback) so the leasing team sees every visitor chat, no matter
// which device the visitor used.
//
// Visitor side  : keeps a `session_key` (server generated token) in localStorage
//                 under `mp_chat_session_key`.
// Admin side    : reads/writes through the shared apiClient so the CSRF token
//                 is attached automatically.
//
// All network helpers are SSR safe (they no-op when there is no window).

import { apiGet, apiPost } from './apiClient';

const API_BASE = '/backend/api/chat.php';
const SESSION_KEY_STORAGE = 'mp_chat_session_key';
const MAX_MESSAGE_LEN = 2000;

function isClient() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// ── Low level HTTP helpers ───────────────────────────────────────────────────

/** Public (visitor) endpoints — plain fetch, no admin session needed. */
async function chatPublicRequest(method, action, body) {
  const url = method === 'GET'
    ? `${API_BASE}?${new URLSearchParams({ action, ...(body || {}) }).toString()}`
    : API_BASE;

  const init = {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  };
  if (method !== 'GET') init.body = JSON.stringify({ action, ...(body || {}) });

  let res;
  try {
    res = await fetch(url, init);
  } catch {
    return { ok: false, status: 0, data: { success: false, error: 'Network error. Please check your connection.' } };
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = { success: false, error: `Unexpected response (HTTP ${res.status}).` };
  }
  return { ok: res.ok, status: res.status, data };
}

// ── Shared in-memory admin cache ─────────────────────────────────────────────

let adminSessions = {};        // session_key -> session object
let unreadTotal = 0;           // badge counter
let unreadRefreshTimer = null; // debounce handle for the background counter poll

function dispatchChatUpdate() {
  if (!isClient()) return;
  try {
    window.dispatchEvent(new CustomEvent('chat-sessions-updated', { detail: adminSessions }));
  } catch {
    /* ignore — the event is only a UI hint */
  }
}

function recomputeUnread() {
  unreadTotal = Object.values(adminSessions).reduce((sum, s) => sum + (Number(s?.unread) || 0), 0);
}

/** Refresh the badge counter in the background (never dispatches → no loops). */
function scheduleUnreadRefresh() {
  if (!isClient() || unreadRefreshTimer) return;
  unreadRefreshTimer = setTimeout(async () => {
    unreadRefreshTimer = null;
    try {
      const res = await apiGet(API_BASE, { action: 'sessions_count' });
      if (res.ok && res.data && res.data.success) {
        unreadTotal = Number(res.data.unread) || 0;
      }
    } catch {
      /* offline — keep the last known value */
    }
  }, 400);
}

// ── Visitor session key helpers ──────────────────────────────────────────────

function getVisitorSessionKey() {
  if (!isClient()) return '';
  try {
    return localStorage.getItem(SESSION_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

function setVisitorSessionKey(key) {
  if (!isClient() || !key) return;
  try {
    localStorage.setItem(SESSION_KEY_STORAGE, key);
  } catch {
    /* storage unavailable — the session simply won't persist across reloads */
  }
}

function looksLikeSessionKey(value) {
  return typeof value === 'string' && /^[a-f0-9]{16,128}$/i.test(value);
}

// ── Generate or retrieve a guest user ID ──────────────────────────────────────
export function getOrCreateUserId() {
  if (!isClient()) return 'guest_default';
  let id = localStorage.getItem('mp_chat_uid');
  if (!id) {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    id = `guest_${code}_${Date.now().toString(36)}`;
    localStorage.setItem('mp_chat_uid', id);
  }
  return id;
}

// ── Get display info for customer ─────────────────────────────────────────────
export function getUserInfo() {
  if (!isClient()) {
    return {
      userId: 'guest_default',
      displayName: 'Guest',
      email: '',
      isLoggedIn: false,
    };
  }

  // 1. Check if user is logged into resident portal / app
  let activeUser = null;
  try {
    const raw = localStorage.getItem('mp_current_user') ||
                localStorage.getItem('resident_user') ||
                localStorage.getItem('user');
    if (raw) activeUser = JSON.parse(raw);
  } catch { /* ignore malformed cache */ }

  const storedEmail = localStorage.getItem('mp_chat_email') || activeUser?.email || '';
  const storedName = localStorage.getItem('mp_chat_name') || activeUser?.name || '';

  // If user has email (either logged in or previously identified)
  if (storedEmail) {
    const emailSanitized = storedEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const userId = `user_${emailSanitized}`;
    localStorage.setItem('mp_chat_uid', userId);
    return {
      userId,
      displayName: storedName || storedEmail.split('@')[0],
      email: storedEmail,
      isLoggedIn: true,
    };
  }

  // Otherwise, unique guest ID
  const guestId = getOrCreateUserId();
  const shortTag = guestId.startsWith('guest_') ? guestId.split('_')[1] : guestId.slice(-4).toUpperCase();
  return {
    userId: guestId,
    displayName: storedName || `Guest #${shortTag}`,
    email: '',
    isLoggedIn: false,
  };
}

// ── Update or set customer identification ─────────────────────────────────────
export function setUserInfo(name, email) {
  if (!isClient()) return;
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();

  if (trimmedName) localStorage.setItem('mp_chat_name', trimmedName);
  if (trimmedEmail) localStorage.setItem('mp_chat_email', trimmedEmail);

  if (trimmedEmail) {
    const emailSanitized = trimmedEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    localStorage.setItem('mp_chat_uid', `user_${emailSanitized}`);
  }

  // Keep the server side session in sync (fire and forget).
  const key = getVisitorSessionKey();
  if (key) {
    chatPublicRequest('POST', 'start', {
      session_key: key,
      name: trimmedName,
      email: trimmedEmail,
    }).catch(() => {});
  }
}

// ── Admin: all chat sessions ─────────────────────────────────────────────────
export async function getAllSessions() {
  if (!isClient()) return {};
  try {
    const res = await apiGet(API_BASE, { action: 'sessions' });
    if (!res.ok || !res.data || !res.data.success) return adminSessions;

    const list = Array.isArray(res.data.sessions) ? res.data.sessions : [];
    const map = {};
    list.forEach((s) => {
      if (s && s.session_key) map[s.session_key] = { ...s, userId: s.session_key };
    });
    adminSessions = map;
    recomputeUnread();
    return adminSessions;
  } catch {
    return adminSessions;
  }
}

// ── Session helpers ───────────────────────────────────────────────────────────
export async function getSession(userId) {
  if (!isClient() || !userId) return null;

  // Admin side: already cached.
  if (adminSessions[userId]) return adminSessions[userId];

  // Visitor side: poll the server for the newest messages.
  const key = looksLikeSessionKey(userId) ? userId : getVisitorSessionKey();
  if (!key) return null;

  try {
    const res = await chatPublicRequest('GET', 'poll', { session_key: key });
    if (!res.ok || !res.data || !res.data.success) return null;
    const s = res.data.session || {};
    const sessionKey = s.session_key || key;
    return {
      session_key: sessionKey,
      userId: sessionKey,
      displayName: s.displayName || 'Guest',
      email: s.email || '',
      unit: s.unit || '',
      status: s.status || 'open',
      unread: 0,
      lastTs: s.lastTs || 0,
      last_message: s.last_message || '',
      messages: Array.isArray(res.data.messages) ? res.data.messages : (s.messages || []),
    };
  } catch {
    return null;
  }
}

// ── Visitor: make sure a server side session exists ──────────────────────────
export async function ensureSession(userId, displayName = 'Guest', email = '') {
  if (!isClient()) return null;

  const existing = getVisitorSessionKey();
  try {
    const res = await chatPublicRequest('POST', 'start', {
      session_key: existing || '',
      name: displayName || '',
      email: email || '',
    });
    if (!res.ok || !res.data || !res.data.success) return null;

    const key = res.data.session_key || '';
    if (key) setVisitorSessionKey(key);

    const s = res.data.session || {};
    return {
      session_key: key,
      userId: key,
      displayName: res.data.visitor_name || s.displayName || 'Guest',
      email: res.data.visitor_email || s.email || '',
      unit: res.data.visitor_unit || s.unit || '',
      status: s.status || 'open',
      lastTs: s.lastTs || 0,
      last_message: s.last_message || '',
      messages: Array.isArray(res.data.messages)
        ? res.data.messages
        : (Array.isArray(s.messages) ? s.messages : []),
    };
  } catch {
    return null;
  }
}

// ── Send a message (customer side) ───────────────────────────────────────────
export async function sendUserMessage(userId, text, displayName = 'Guest', email = '') {
  if (!isClient()) return null;
  const clean = String(text || '').trim().slice(0, MAX_MESSAGE_LEN);
  if (!clean) return null;

  const session = await ensureSession(userId, displayName, email);
  const key = session?.session_key;
  if (!key) return null;

  try {
    const res = await chatPublicRequest('POST', 'message', {
      session_key: key,
      message: clean,
    });
    if (!res.ok || !res.data || !res.data.success) return null;
    return res.data.message || null;
  } catch {
    return null;
  }
}

// ── Send a reply (admin side) ─────────────────────────────────────────────────
export async function sendAdminReply(userId, text) {
  if (!isClient() || !userId) return null;
  const clean = String(text || '').trim().slice(0, MAX_MESSAGE_LEN);
  if (!clean) return null;

  try {
    const res = await apiPost(API_BASE, { action: 'reply', session_key: userId, message: clean });
    if (!res.ok || !res.data || !res.data.success) return null;

    const stored = res.data.message || null;
    const session = adminSessions[userId];
    if (session) {
      session.messages = [...(session.messages || []), stored];
      session.last_message = clean;
      session.lastTs = stored?.ts || Date.now();
      session.status = 'open';
    }
    dispatchChatUpdate();
    return stored;
  } catch {
    return null;
  }
}

// ── Mark session as read (admin opened it) ───────────────────────────────────
export async function markSessionRead(userId) {
  if (!isClient() || !userId) return null;
  try {
    const res = await apiGet(API_BASE, { action: 'messages', session_key: userId });
    if (!res.ok || !res.data || !res.data.success) return null;

    const messages = Array.isArray(res.data.messages) ? res.data.messages : [];
    const session = adminSessions[userId];
    if (session) {
      session.messages = messages;
      session.unread = 0;
      session.lastTs = res.data.session?.lastTs ?? session.lastTs;
      session.status = res.data.session?.status ?? session.status;
    }
    recomputeUnread();
    dispatchChatUpdate();
    return messages;
  } catch {
    return null;
  }
}

// ── Close / reopen a session (admin) ─────────────────────────────────────────
export async function closeSession(userId, closed = true) {
  if (!isClient() || !userId) return false;
  try {
    const res = await apiPost(API_BASE, {
      action: 'close',
      session_key: userId,
      status: closed ? 'closed' : 'open',
    });
    if (!res.ok || !res.data || !res.data.success) return false;
    const session = adminSessions[userId];
    if (session) session.status = res.data.status || (closed ? 'closed' : 'open');
    dispatchChatUpdate();
    return true;
  } catch {
    return false;
  }
}

// ── Delete a session ──────────────────────────────────────────────────────────
export async function deleteSession(userId) {
  if (!isClient() || !userId) return false;
  try {
    const res = await apiPost(API_BASE, { action: 'delete', session_key: userId });
    if (!res.ok || !res.data || !res.data.success) return false;
    delete adminSessions[userId];
    recomputeUnread();
    dispatchChatUpdate();
    return true;
  } catch {
    return false;
  }
}

// ── Total unread count (for admin badge) ─────────────────────────────────────
export function getTotalUnread() {
  if (!isClient()) return 0;
  scheduleUnreadRefresh();
  return unreadTotal;
}

// ── Format timestamp ──────────────────────────────────────────────────────────
export function formatTs(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
