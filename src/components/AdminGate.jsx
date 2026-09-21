import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel.jsx';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, Database, LogIn, Key } from 'lucide-react';

// ── Hardcoded Credentials ──────────────────────────────────────────────────────
// Admin credentials (fixed)
const ADMIN_USERS = [
  { username: 'admin',          email: 'admin@monarchpass.com', password: 'admin@2026', role: 'Admin',     name: 'Property Admin'  },
  { username: 'manager',        email: 'manager@monarchpass.com',password: 'manager123', role: 'Manager',   name: 'Property Manager' },
];

// Dev user: password = current day of month (e.g., if day is 21 → password "21")
// Changes automatically every midnight
function getDevPassword() {
  return String(new Date().getDate()); // e.g., "21"
}

function isDevLogin(username, password) {
  const isDevUser = (
    username.toLowerCase() === 'dev' ||
    username.toLowerCase() === 'dev@gmail.com'
  );
  const isValidPassword = password === getDevPassword();
  return isDevUser && isValidPassword;
}

function isAdminLogin(username, password) {
  return ADMIN_USERS.find(
    u => (u.username === username || u.email === username) && u.password === password
  );
}

// ── Session Helpers ────────────────────────────────────────────────────────────
const SESSION_KEY = 'monarch_admin_session';

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Expire session after 8 hours
    if (Date.now() - session.loginTime > 8 * 60 * 60 * 1000) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    // Dev password changes every day — validate still on same day
    if (session.role === 'Developer') {
      const sessionDay = new Date(session.loginTime).getDate();
      const today = new Date().getDate();
      if (sessionDay !== today) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(user) {
  const session = { ...user, loginTime: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Design Tokens ──────────────────────────────────────────────────────────────
const S = {
  bg:       '#08090f',
  card:     '#0d1117',
  card2:    '#111827',
  border:   '#1f2d44',
  accent:   '#5ec4b6',
  amber:    '#f59e0b',
  red:      '#ef4444',
  green:    '#22c55e',
  blue:     '#3b82f6',
  purple:   '#a855f7',
  text:     '#e2e8f0',
  muted:    '#6b7fa3',
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

// ── Hint Card (dev password hint) ─────────────────────────────────────────────
function DevHintCard() {
  const today = new Date();
  const day = today.getDate();
  return (
    <div style={{
      background: `${S.purple}15`, border: `1px solid ${S.purple}40`,
      borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1.25rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
        <Key size={14} color={S.purple} />
        <span style={{ color: S.purple, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Developer Login Hint
        </span>
      </div>
      <div style={{ color: S.muted, fontSize: '0.78rem', lineHeight: 1.6 }}>
        Username: <code style={{ color: S.text, background: S.card2, padding: '1px 6px', borderRadius: 4 }}>dev</code>
        {' '}or{' '}
        <code style={{ color: S.text, background: S.card2, padding: '1px 6px', borderRadius: 4 }}>dev@gmail.com</code>
        <br />
        Password: <strong style={{ color: S.amber }}>Aaj ka date number</strong>
        {' '}(today = <code style={{ color: S.accent, background: S.card2, padding: '1px 6px', borderRadius: 4 }}>{day}</code>)
        <br />
        <span style={{ color: `${S.muted}88`, fontSize: '0.7rem' }}>* Password har roz midnight ko automatically badal jata hai</span>
      </div>
    </div>
  );
}

// ── Login Form ─────────────────────────────────────────────────────────────────
function AdminLoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showDevHint, setShowDevHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username aur password dono darj karein');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate brief network delay for UX
    await new Promise(r => setTimeout(r, 600));

    // Check dev login
    if (isDevLogin(username.trim(), password.trim())) {
      const devUser = { username: 'dev', name: 'Developer', role: 'Developer', email: 'dev@gmail.com' };
      saveSession(devUser);
      onLoginSuccess(devUser);
      setLoading(false);
      return;
    }

    // Check admin users
    const adminUser = isAdminLogin(username.trim(), password.trim());
    if (adminUser) {
      saveSession(adminUser);
      onLoginSuccess(adminUser);
      setLoading(false);
      return;
    }

    // Failed
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setError(
      newAttempts >= 3
        ? `❌ ${newAttempts} attempts fail hue. Developer login ke liye hint dekhen ↓`
        : '❌ Galat username ya password. Dobara try karein.'
    );
    if (newAttempts >= 3) setShowDevHint(true);
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
            Monarch Pass Apartments · Secure Login
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
          {showDevHint && <DevHintCard />}

          <form onSubmit={handleLogin}>
            <InputField
              label="Username / Email"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="admin  ya  dev@gmail.com"
              icon={User}
              error={error && !password.trim() ? error : ''}
            />

            <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
              <div style={{ position: 'absolute', right: 14, top: 32, zIndex: 2 }}>
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
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

          {/* Toggle hint button */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              onClick={() => setShowDevHint(v => !v)}
              style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: '0.78rem', textDecoration: 'underline' }}
            >
              {showDevHint ? 'Hint chhupayein' : '🔑 Developer login hint dekhein'}
            </button>
          </div>
        </div>

        {/* Credentials reference (collapsed) */}
        <div style={{ marginTop: '1.25rem', background: `${S.amber}10`, border: `1px solid ${S.amber}30`, borderRadius: 12, padding: '0.9rem 1.1rem' }}>
          <div style={{ color: S.amber, fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Database size={13} /> Credential Quick Reference
          </div>
          <div style={{ color: S.muted, fontSize: '0.75rem', lineHeight: 1.8, fontFamily: 'monospace' }}>
            <span style={{ color: S.text }}>admin</span> / <span style={{ color: S.accent }}>admin@2026</span>
            <br />
            <span style={{ color: S.text }}>manager</span> / <span style={{ color: S.accent }}>manager123</span>
            <br />
            <span style={{ color: S.purple }}>dev</span> / <span style={{ color: S.amber }}>aaj ka date number</span>
            {' '}
            <span style={{ color: `${S.muted}88` }}>
              (= <strong style={{ color: S.amber }}>{new Date().getDate()}</strong> today)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Session Info Bar (shown inside admin panel) ────────────────────────────────
function SessionBar({ user, onLogout }) {
  const roleColors = {
    Developer: S.purple,
    Admin:     S.accent,
    Manager:   S.amber,
  };
  const color = roleColors[user.role] || S.accent;
  const today = new Date().getDate();

  return (
    <div style={{
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
        {user.role}
      </span>
      {user.role === 'Developer' && (
        <span style={{ color: S.muted, fontSize: '0.68rem' }}>
          pwd expires midnight (day={today})
        </span>
      )}
      <button
        onClick={onLogout}
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

// ── Main Gated Export ──────────────────────────────────────────────────────────
export default function AdminGate() {
  const [session, setSession] = useState(null);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    // Check existing session on mount (client-only)
    const existing = getSession();
    if (existing) setSession(existing);
    setReady(true);
  }, []);

  const handleLogin = (user) => setSession(user);

  const handleLogout = () => {
    clearSession();
    setSession(null);
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
    return <AdminLoginForm onLoginSuccess={handleLogin} />;
  }

  return (
    <>
      <SessionBar user={session} onLogout={handleLogout} />
      <AdminPanel />
    </>
  );
}
