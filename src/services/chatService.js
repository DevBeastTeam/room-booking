// ── Chat Service ─────────────────────────────────────────────────────────────
// Stores all chat sessions in localStorage with real-time browser events.
// Supports both logged-in users (via email ID) and guest users (via unique guest ID).
// Fully safe for SSR (Node.js/Astro) and client-side execution.

const STORAGE_KEY = 'mp_chat_sessions';

function isClient() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function loadSessions() {
  if (!isClient()) return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSessions(sessions) {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    window.dispatchEvent(new CustomEvent('chat-sessions-updated', { detail: sessions }));
  } catch (err) {
    console.error('Error saving chat sessions:', err);
  }
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
  } catch {}

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
  const oldInfo = getUserInfo();
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();

  if (trimmedName) localStorage.setItem('mp_chat_name', trimmedName);
  if (trimmedEmail) localStorage.setItem('mp_chat_email', trimmedEmail);

  let newUserId = oldInfo.userId;
  if (trimmedEmail) {
    const emailSanitized = trimmedEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    newUserId = `user_${emailSanitized}`;
    localStorage.setItem('mp_chat_uid', newUserId);
  }

  // Migrate or merge existing session if ID changed
  const sessions = loadSessions();
  if (oldInfo.userId !== newUserId && sessions[oldInfo.userId]) {
    const oldSession = sessions[oldInfo.userId];
    sessions[newUserId] = {
      userId: newUserId,
      displayName: trimmedName || oldSession.displayName || trimmedEmail.split('@')[0],
      email: trimmedEmail || oldSession.email,
      messages: oldSession.messages || [],
      lastTs: oldSession.lastTs || Date.now(),
      unread: oldSession.unread || 0,
    };
    delete sessions[oldInfo.userId];
    saveSessions(sessions);
  } else if (sessions[newUserId]) {
    if (trimmedName) sessions[newUserId].displayName = trimmedName;
    if (trimmedEmail) sessions[newUserId].email = trimmedEmail;
    saveSessions(sessions);
  }
}

// ── Session helpers ───────────────────────────────────────────────────────────
export function getAllSessions() {
  return loadSessions();
}

export function getSession(userId) {
  if (!userId) return null;
  const sessions = loadSessions();
  return sessions[userId] || null;
}

export function ensureSession(userId, displayName = 'Guest', email = '') {
  if (!userId) return null;
  const sessions = loadSessions();
  if (!sessions[userId]) {
    const greetingName = displayName && !displayName.startsWith('Guest') ? displayName : 'there';
    sessions[userId] = {
      userId,
      displayName: displayName || (email ? email.split('@')[0] : 'Guest'),
      email: email || '',
      messages: [
        {
          sender: 'admin',
          text: `Hi ${greetingName}! 👋 Welcome to Monarch Pass. How can our leasing team assist you today? Feel free to ask about floor plans, pricing, tour schedules, or specials!`,
          ts: Date.now(),
        }
      ],
      lastTs: Date.now(),
      unread: 0,
    };
    saveSessions(sessions);
  } else {
    let changed = false;
    if (displayName && sessions[userId].displayName !== displayName) {
      sessions[userId].displayName = displayName;
      changed = true;
    }
    if (email && sessions[userId].email !== email) {
      sessions[userId].email = email;
      changed = true;
    }
    if (changed) saveSessions(sessions);
  }
  return sessions[userId];
}

// ── Send a message (customer side) ───────────────────────────────────────────
export function sendUserMessage(userId, text, displayName = 'Guest', email = '') {
  if (!isClient() || !text || !text.trim() || !userId) return;
  ensureSession(userId, displayName, email);
  const sessions = loadSessions();

  if (!sessions[userId]) return;
  if (!sessions[userId].messages) sessions[userId].messages = [];
  sessions[userId].displayName = displayName || sessions[userId].displayName || 'Guest';
  sessions[userId].email = email || sessions[userId].email || '';
  sessions[userId].messages.push({
    sender: 'user',
    text: text.trim(),
    ts: Date.now(),
  });
  sessions[userId].lastTs = Date.now();
  sessions[userId].unread = (sessions[userId].unread || 0) + 1;
  saveSessions(sessions);
}

// ── Send a reply (admin side) ─────────────────────────────────────────────────
export function sendAdminReply(userId, text) {
  if (!isClient() || !text || !text.trim() || !userId) return;
  ensureSession(userId);
  const sessions = loadSessions();
  if (!sessions[userId]) return;
  if (!sessions[userId].messages) sessions[userId].messages = [];
  sessions[userId].messages.push({
    sender: 'admin',
    text: text.trim(),
    ts: Date.now(),
  });
  sessions[userId].lastTs = Date.now();
  sessions[userId].unread = 0; // Admin has replied and read
  saveSessions(sessions);
}

// ── Mark session as read (admin opened it) ───────────────────────────────────
export function markSessionRead(userId) {
  if (!isClient() || !userId) return;
  const sessions = loadSessions();
  if (!sessions[userId]) return;
  if (sessions[userId].unread > 0) {
    sessions[userId].unread = 0;
    saveSessions(sessions);
  }
}

// ── Delete a session ──────────────────────────────────────────────────────────
export function deleteSession(userId) {
  if (!isClient() || !userId) return;
  const sessions = loadSessions();
  if (sessions[userId]) {
    delete sessions[userId];
    saveSessions(sessions);
  }
}

// ── Total unread count (for admin badge) ─────────────────────────────────────
export function getTotalUnread() {
  if (!isClient()) return 0;
  const sessions = loadSessions();
  return Object.values(sessions).reduce((sum, s) => sum + (s.unread || 0), 0);
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
