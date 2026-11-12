import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, LogIn, KeyRound } from 'lucide-react';
import AdminPanel from './AdminPanel.jsx';
import { apiRequest, setCsrfToken, onForcePasswordChange } from '../services/apiClient';

// ── Auth API (server-side PHP session) ─────────────────────────────────────────
const API = '/backend/api/auth.php';
const SESSION_KEY = 'monarch_admin_session';

async function apiPost(body) {
  return apiRequest(API, { method: 'POST', body });
}

async function apiGet(action) {
  return apiRequest(`${API}?action=${action}`, { method: 'GET' });
}

function persistSession(user) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, loginTime: Date.now() }));
  } catch { /* ignore */ }
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

// ── Design Tokens ─────────────────────────────────────────────────────────────
const S = {
  bg: '#08090f',
  card: '#0d1117',
  card2: '#111827',
  border: '#1f2d44',
  accent: '#5ec4b6',
  amber: '#f59e0b',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  text: '#e2e8f0',
  muted: '#6b7fa3',
};

// ── Input Field ───────────────────────────────────────────────────────────────
function InputField({ label, type, value, onChange, placeholder, icon: Icon, error }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', color: S.muted, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? S.red : S.muted }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%', padding: Icon ? '0.75rem 0.9rem 0.75rem 2.6rem' : '0.75rem 0.9rem',
            background: S.card2, border: `1px solid ${error ? S.red : S.border}`,
            borderRadius: 10, color: S.text, fontSize: '0.9rem', outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
          onFocus={e => { e.target.style.borderColor = error ? S.red : S.accent; }}
          onBlur={e => { e.target.style.borderColor = error ? S.red : S.border; }}
        />
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
          <AlertCircle size={12} color={S.red} />
          <span style={{ color: S.red, fontSize: '0.75rem' }}>{error}</span>
        </div>
      )}
    </div>
  );
}

// ── Login Form (server-side auth) ──────────────────────────────────────────────
function AdminLoginForm({ onLoginSuccess }) {
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

    const { ok, data } = await apiPost({ action: 'login', username: username.trim(), password: password.trim() });

    if (ok && data.success && data.user) {
      setCsrfToken(data.csrf_token);
      persistSession(data.user);
      onLoginSuccess(data.user);
    } else {
      setError(data.error || 'Login failed. Dubara try karein.');
    }
    setLoading(false);
  };

  const today = new Date();

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

      {/* Background subtle grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 60% at 20% 10%, ${S.accent}08 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 90%, ${S.purple}08 0%, transparent 60%)
        `,
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        animation: 'fadeIn 0.5s ease',
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
            <Shield size={30} color={S.accent} />
          </div>
          <h1 style={{ color: S.text, fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
            Admin Panel
          </h1>
          <p style={{ color: S.muted, fontSize: '0.83rem', margin: 0 }}>
            Monar Pass Apartments · Secure Login
          </p>
          <div style={{
            marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            background: `${S.green}15`, border: `1px solid ${S.green}40`,
            borderRadius: 20, padding: '0.2rem 0.7rem',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.green }} />
            <span style={{ color: S.green, fontSize: '0.7rem', fontWeight: 700 }}>
              {today.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background: S.card, border: `1px solid ${S.border}`,
          borderRadius: 20, padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <form onSubmit={handleLogin}>
            <InputField
              label="Username / Email"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="admin@gmail.com ya manager@gmail.com"
              icon={User}
              error={error && !password.trim() ? error : ''}
            />

            <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
              <div style={{ position: 'absolute', right: 14, top: 32, zIndex: 2 }}>
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="header-tap"
                  style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', padding: 4 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Password darj karein"
                icon={Lock}
                error={error}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: 12,
                background: loading
                  ? `${S.accent}55`
                  : `linear-gradient(135deg, ${S.accent}, #3da89a)`,
                border: 'none', color: '#0a0d14',
                fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s', marginTop: '0.5rem',
                boxShadow: loading ? 'none' : `0 6px 20px ${S.accent}44`,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? <><div style={{ width: 18, height: 18, border: `2px solid #0a0d1466`, borderTopColor: '#0a0d14', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Verifying...</>
                : <><LogIn size={17} /> Login karein</>}
            </button>
          </form>

          <div style={{
            marginTop: '1.25rem', padding: '0.65rem 0.85rem', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${S.border}`,
            fontSize: '0.72rem', color: S.muted, textAlign: 'center', lineHeight: 1.6,
          }}>
            <div style={{ color: S.text, fontWeight: 600, marginBottom: 2 }}>Authorized Staff:</div>
            <div>Admin: <code style={{ color: S.accent, background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>admin@gmail.com</code> &middot; Manager: <code style={{ color: S.accent, background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>manager@gmail.com</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Session Info Bar (shown inside admin panel) ────────────────────────────────
function SessionBar({ user, onLogout }) {
  const roleColors = {
    super_admin: S.purple,
    Developer: S.purple,
    admin: S.accent,
    Admin: S.accent,
    Manager: S.amber,
  };
  const color = roleColors[user.role] || S.accent;

  return (
    <div className="session-bar" style={{
      position: 'fixed', top: 0, right: 0, zIndex: 9999,
      background: S.card, border: `1px solid ${S.border}`,
      borderRadius: '0 0 0 12px', padding: '0.5rem 1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      fontSize: '0.78rem',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ color: S.text, fontWeight: 600 }}>{user.name || user.username}</span>
      <span style={{ background: `${color}22`, color, padding: '1px 8px', borderRadius: 10, fontWeight: 700, fontSize: '0.7rem' }}>
        {user.role_label || user.role}
      </span>
      <button
        onClick={onLogout}
        className="header-tap"
        style={{
          background: `${S.red}22`, border: `1px solid ${S.red}44`, color: S.red,
          cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700,
        }}
      >
        Logout
      </button>
    </div>
  );
}

// ── Forced Password Rotation ──────────────────────────────────────────────────
// Seeded accounts ship with a well-known default password, so the backend
// blocks every other action until the account owner picks a new one.
function PasswordChangeRequired({ user, onDone }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) { setError('New password kam az kam 8 characters ka ho.'); return; }
    if (next !== confirm) { setError('Dono naye passwords match nahi kar rahe.'); return; }
    if (next === current) { setError('Naya password purane se different hona chahiye.'); return; }

    setBusy(true);
    const { ok, data } = await apiPost({ action: 'change_password', current, new: next });
    setBusy(false);
    if (ok && data.success) {
      setCsrfToken(data.csrf_token);
      onDone(data.user);
    } else {
      setError(data.error || 'Password change nahi ho saka.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '1rem', fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
      <div style={{
        width: '100%', maxWidth: 440, animation: 'fadeIn 0.5s ease',
        background: S.card, border: `1px solid ${S.border}`, borderRadius: 20,
        padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: '0 auto 0.9rem',
            background: `${S.amber}22`, border: `1px solid ${S.amber}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <KeyRound size={26} color={S.amber} />
          </div>
          <h1 style={{ color: S.text, fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.3rem' }}>
            Set a new password
          </h1>
          <p style={{ color: S.muted, fontSize: '0.82rem', margin: 0, lineHeight: 1.55 }}>
            {user?.username ? <><strong style={{ color: S.text }}>{user.username}</strong> ka default password abhi use ho raha hai. </> : null}
            Panel istemal karne se pehle apna naya password set karein (kam az kam 8 characters).
          </p>
        </div>

        <form onSubmit={submit}>
          <InputField label="Current password" type={show ? 'text' : 'password'} value={current}
            onChange={e => { setCurrent(e.target.value); setError(''); }} icon={Lock} />
          <InputField label="New password" type={show ? 'text' : 'password'} value={next}
            onChange={e => { setNext(e.target.value); setError(''); }} icon={KeyRound} />
          <InputField label="Confirm new password" type={show ? 'text' : 'password'} value={confirm}
            onChange={e => { setConfirm(e.target.value); setError(''); }} icon={KeyRound} />

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: S.muted, fontSize: '0.76rem', margin: '0 0 1rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} />
            Password dikhayein
          </label>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.9rem', color: S.red, fontSize: '0.76rem' }}>
              <AlertCircle size={13} color={S.red} /> {error}
            </div>
          )}

          <button type="submit" disabled={busy} style={{
            width: '100%', padding: '0.9rem', borderRadius: 12, border: 'none',
            background: busy ? `${S.accent}55` : `linear-gradient(135deg, ${S.accent}, #3da89a)`,
            color: '#0a0d14', fontWeight: 800, fontSize: '0.92rem', cursor: busy ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <KeyRound size={16} /> {busy ? 'Saving...' : 'Set password & continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Gated Export ──────────────────────────────────────────────────────────
export default function AdminGate({ onSession }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [mustChange, setMustChange] = useState(false);

  const applySession = (user) => {
    setSession(user);
    setMustChange(!!user?.must_change_password);
    if (onSession) onSession(user);
  };

  // Global handler: any API call can push the user into the rotation screen.
  useEffect(() => {
    onForcePasswordChange(() => setMustChange(true));
    return () => onForcePasswordChange(null);
  }, []);

  useEffect(() => {
    // Verify with server session (source of truth)
    let cancelled = false;
    (async () => {
      const { ok, data } = await apiGet('session');
      if (cancelled) return;
      if (ok && data.authenticated && data.user) {
        setCsrfToken(data.csrf_token);
        persistSession(data.user);
        applySession(data.user);
      } else {
        clearSession();
        setSession(null);
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await apiPost({ action: 'logout' });
    setCsrfToken(null);
    clearSession();
    setSession(null);
    setMustChange(false);
    if (onSession) onSession(null);
  };

  if (!ready) {
    // Prevent SSR mismatch flash
    return (
      <div style={{ minHeight: '100vh', background: '#08090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #1f2d44', borderTopColor: '#5ec4b6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <AdminLoginForm onLoginSuccess={applySession} />;
  }

  if (mustChange) {
    return <PasswordChangeRequired user={session} onDone={applySession} />;
  }

  return (
    <>
      <SessionBar user={session} onLogout={handleLogout} />
      <AdminPanel user={session} />
    </>
  );
}
