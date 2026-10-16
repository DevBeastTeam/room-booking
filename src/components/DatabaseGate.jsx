import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import DatabaseManager from './DatabaseManager.jsx';
import AdminGate from './AdminGate.jsx';

// Shared session check — same key as AdminGate sessionStorage mirror
const SESSION_KEY = 'monarch_admin_session';

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Database Manager sirf super admin (dev) ke liye hai — client admins ko
// yeh page bilkul accessible nahi.
function isSuperAdmin(session) {
  return Boolean(session && session.role === 'super_admin');
}

function AccessDenied() {
  return (
    <div style={{
      minHeight: '100vh', background: '#08090f', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1rem',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        maxWidth: 420, width: '100%', textAlign: 'center',
        background: '#0d1117', border: '1px solid #1f2d44',
        borderRadius: 20, padding: '2.5rem 2rem',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 1.25rem',
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldAlert size={28} color="#ef4444" />
        </div>
        <h1 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.6rem' }}>
          Access Denied
        </h1>
        <p style={{ color: '#6b7fa3', fontSize: '0.86rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
          Database Manager sirf <strong style={{ color: '#f59e0b' }}>Super Admin (Developer)</strong> ke liye hai.
          Client admins is page ko access nahi kar sakte.
        </p>
        <a
          href="/admin"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none', color: '#0a0d14', fontWeight: 800, fontSize: '0.9rem',
            padding: '0.75rem 1.5rem', borderRadius: 12, cursor: 'pointer', textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Admin Panel
        </a>
      </div>
    </div>
  );
}

// Super admin → DatabaseManager; client admin → Access Denied; guest → login
export default function DatabaseGate() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = getSession();
      if (existing) setSession(existing);
      try {
        const res = await fetch('/backend/api/auth.php?action=session', { credentials: 'same-origin' });
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && json.authenticated && json.user) {
          try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(json.user));
          } catch { /* ignore */ }
          setSession(json.user);
        } else {
          try {
            sessionStorage.removeItem(SESSION_KEY);
          } catch { /* ignore */ }
          setSession(null);
        }
      } catch {
        // network error, keep cached session if present
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Re-check on window focus
  useEffect(() => {
    const onFocus = () => setSession(getSession());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: '#08090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #1f2d44', borderTopColor: '#5ec4b6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Guest → login first (server will also verify super admin on API calls)
  if (!session) {
    return <AdminGate onSession={setSession} />;
  }

  // Client admin logged in → denied
  if (!isSuperAdmin(session)) {
    return <AccessDenied />;
  }

  return <DatabaseManager onBack={() => { window.location.href = '/dev'; }} />;
}
