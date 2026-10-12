import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, KeyRound } from 'lucide-react';
import DevPanel from './DevPanel.jsx';

// ── Super Admin (Developer) Gate — sirf 'super_admin' role andar aa sakta hai ──
const API = '/backend/api/auth.php';
const SESSION_KEY = 'monarch_admin_session';

async function apiPost(body) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, data: json };
}

async function apiGet(action) {
  const res = await fetch(`${API}?action=${action}`, { credentials: 'same-origin' });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, data: json };
}

function persistSession(user) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, loginTime: Date.now() }));
  } catch { /* ignore */ }
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

const S = {
  bg: '#08090f',
  card: '#0d1117',
  card2: '#111827',
  border: '#1f2d44',
  accent: '#a78bfa',
  amber: '#f59e0b',
  red: '#ef4444',
  green: '#22c55e',
  text: '#e2e8f0',
  muted: '#6b7fa3',
};

// ── Developer Login Form ────────────────────────────────────────────────────────
function DevLoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username aur password dono darj karein');
      return;
    }
    setLoading(true);
    setError('');

    const { ok, data } = await apiPost({ action: 'login', username: username.trim(), password });

    if (ok && data.success && data.user) {
      if (data.user.role !== 'super_admin') {
        setError('Yeh super admin (developer) area hai. Client admins ke liye /admin use karein.');
        setLoading(false);
        return;
      }
      persistSession(data.user);
      onLoginSuccess(data.user);
    } else {
      setError(data.error || 'Login failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: S.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: '1rem',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #3d4f6b; }
      `}</style>

      {/* Background subtle glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 60% at 50% 0%, ${S.accent}12 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 100%, ${S.accent}0a 0%, transparent 60%)
        `,
      }} />

      <div style={{
        width: '100%', maxWidth: 430, animation: 'fadeIn 0.5s ease',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo & branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20, margin: '0 auto 1rem',
            background: `linear-gradient(135deg, ${S.accent}22, ${S.accent}44)`,
            border: `1px solid ${S.accent}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 40px ${S.accent}22`,
          }}>
            <KeyRound size={28} color={S.accent} />
          </div>
          <h1 style={{ color: S.text, fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
            Super Admin / Developer
          </h1>
          <p style={{ color: S.muted, fontSize: '0.83rem', margin: '0 0 0.75rem' }}>
            Monarch Pass Apartments · Full Control Panel
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            background: `${S.green}15`, border: `1px solid ${S.green}40`,
            borderRadius: 20, padding: '0.2rem 0.7rem',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.green }} />
            <span style={{ color: S.green, fontSize: '0.7rem', fontWeight: 700 }}>Secure Restricted Access</span>
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background: S.card, border: `1px solid ${S.border}`,
          borderRadius: 20, padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleLogin}>
            <label style={{
              display: 'block', color: S.muted, fontSize: '0.7rem', fontWeight: 700,
              marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Developer Username
            </label>
            <div style={{ position: 'relative', marginBottom: '1.1rem' }}>
              <div style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: error ? S.red : S.muted,
              }}>
                <User size={16} />
              </div>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="dev"
                style={{
                  width: '100%', padding: '0.75rem 0.9rem 0.75rem 2.6rem',
                  background: S.card2, border: `1px solid ${error ? S.red : S.border}`,
                  borderRadius: 10, color: S.text, fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'inherit', transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = error ? S.red : S.accent; }}
                onBlur={e => { e.target.style.borderColor = error ? S.red : S.border; }}
              />
            </div>

            <label style={{
              display: 'block', color: S.muted, fontSize: '0.7rem', fontWeight: 700,
              marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: error ? S.red : S.muted,
              }}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '0.75rem 2.6rem', background: S.card2,
                  border: `1px solid ${error ? S.red : S.border}`,
                  borderRadius: 10, color: S.text, fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'inherit', transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = error ? S.red : S.accent; }}
                onBlur={e => { e.target.style.borderColor = error ? S.red : S.border; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: S.muted, cursor: 'pointer', padding: 6,
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
                <AlertCircle size={13} color={S.red} />
                <span style={{ color: S.red, fontSize: '0.78rem' }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: 12, marginTop: '1.25rem',
                background: loading ? `${S.accent}55` : `linear-gradient(135deg, ${S.accent}, #7c3aed)`,
                border: 'none', color: '#0b0f18',
                fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: loading ? 'none' : `0 6px 20px ${S.accent}44`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? <><div style={{ width: 18, height: 18, border: '2px solid #0b0f1866', borderTopColor: '#0b0f18', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Verifying...</>
                : <><Shield size={17} /> Developer Login</>}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '1.25rem', paddingTop: '1.1rem',
            borderTop: `1px solid ${S.border}`,
          }}>
            <a href="/admin" style={{ color: S.muted, fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}>
              ← Client Admin Panel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gate Export ────────────────────────────────────────────────────────────────
export default function DevGate() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = getSession();
      if (cached && cached.role === 'super_admin') {
        setSession(cached);
        setReady(true);
      }
      // Always verify against the server session
      const { ok, data } = await apiGet('session');
      if (cancelled) return;
      if (ok && data.authenticated && data.user && data.user.role === 'super_admin') {
        persistSession(data.user);
        setSession(data.user);
      } else {
        clearSession();
        setSession(null);
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    await apiPost({ action: 'logout' });
    clearSession();
    setSession(null);
  };

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 30, height: 30, border: `3px solid ${S.border}`, borderTopColor: S.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <DevLoginForm onLoginSuccess={setSession} />;
  }

  return <DevPanel user={session} onLogout={handleLogout} />;
}
