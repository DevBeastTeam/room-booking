import React, { useState, useEffect, useCallback } from 'react';
import UserDashboard from './UserDashboard';
import {
  Home, Lock, Mail, Hash, AlertCircle, CheckCircle2,
  LogOut, KeyRound, ShieldCheck, Eye, EyeOff
} from 'lucide-react';

// ── Colour tokens (dashboard theme) ───────────────────────────────────────────
const C = {
  bg: '#08090f',
  panel: '#0c101c',
  card: '#101422',
  cardHover: '#151b2e',
  border: 'rgba(201, 169, 110, 0.22)',
  accent: '#c9a96e',
  accentDark: '#a88448',
  accentGlow: 'rgba(201, 169, 110, 0.2)',
  text: '#f4efe6',
  muted: '#94a3b8',
  danger: '#ef4444',
  success: '#22c55e',
  info: '#3b82f6',
};

const API = '/backend/api/resident.php';

async function apiRequest(action, { method = 'GET', body = null, csrfToken = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  const res = await fetch(`${API}?action=${encodeURIComponent(action)}`, {
    method,
    headers,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : null,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = { success: false, error: 'Unexpected server response.' };
  }
  return { ok: res.ok && data && data.success !== false, status: res.status, data };
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete, error, hint }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ color: C.muted, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Icon size={15} color={C.accent} style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none' }} />
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            padding: '0.75rem 2.6rem 0.75rem 2.35rem',
            backgroundColor: C.bg,
            border: `1px solid ${error ? C.danger + '88' : C.border}`,
            borderRadius: 10,
            color: C.text,
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute', right: '0.6rem', background: 'none', border: 'none',
              color: C.muted, cursor: 'pointer', display: 'flex', padding: '4px',
            }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <span style={{ color: C.muted, fontSize: '0.72rem' }}>{hint}</span>}
    </div>
  );
}

function Banner({ type = 'error', text }) {
  if (!text) return null;
  const color = type === 'success' ? C.success : C.danger;
  const bg = type === 'success' ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)';
  return (
    <div
      role="alert"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
        padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1rem',
        fontSize: '0.84rem', color, backgroundColor: bg,
        border: `1px solid ${type === 'success' ? '#22c55e55' : '#ef444455'}`,
      }}
    >
      {type === 'success' ? <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
      <span>{text}</span>
    </div>
  );
}

function BrandMark({ size = 46 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.accent}, ${C.info})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36, fontWeight: 800, color: '#0f1117', flexShrink: 0,
      }}
    >
      MP
    </div>
  );
}

export default function ResidentGate() {
  const [booting, setBooting] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [resident, setResident] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const [email, setEmail] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  // ── Session bootstrap ───────────────────────────────────────────────────────
  const applySession = useCallback((data) => {
    if (data?.authenticated) {
      setAuthenticated(true);
      setResident(data.resident);
      setCsrfToken(data.csrf_token);
      setMustChangePassword(!!data.must_change_password);
    } else {
      setAuthenticated(false);
      setResident(null);
      setCsrfToken(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest('session')
      .then(({ ok, data }) => {
        if (!active) return;
        if (ok && data.authenticated) {
          applySession(data);
        } else {
          applySession(null);
        }
      })
      .catch(() => { if (active) applySession(null); })
      .finally(() => { if (active) setBooting(false); });
    return () => { active = false; };
  }, [applySession]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim() || !unitNumber.trim() || !password) {
      setError('Please enter your email, unit number and password.');
      return;
    }
    setBusy(true);
    const { ok, data } = await apiRequest('login', {
      method: 'POST',
      body: {
        email: email.trim(),
        unit_number: unitNumber.trim(),
        password,
      },
    });
    setBusy(false);
    if (!ok) {
      setError(data?.error || 'Login failed. Please try again.');
      return;
    }
    setResident(data.resident);
    setCsrfToken(data.csrf_token);
    setPassword('');
    if (data.must_change_password) {
      setMustChangePassword(true);
      setAuthenticated(true);
    } else {
      setMustChangePassword(false);
      setAuthenticated(true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword) {
      setError('Please fill in both the current and the new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    const { ok, data } = await apiRequest('change_password', {
      method: 'POST',
      csrfToken,
      body: { current: currentPassword, new: newPassword },
    });
    setBusy(false);
    if (!ok) {
      setError(data?.error || 'Password change failed. Please try again.');
      return;
    }
    setSuccess('Password updated. Taking you to your dashboard…');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMustChangePassword(false);
    setTimeout(() => { setSuccess(''); }, 1200);
  };

  const handleLogout = async () => {
    try {
      await apiRequest('logout', { method: 'POST', csrfToken });
    } catch {
      /* ignore — local state reset below */
    }
    setAuthenticated(false);
    setResident(null);
    setCsrfToken(null);
    setMustChangePassword(false);
    setEmail('');
    setUnitNumber('');
    setPassword('');
    setError('');
  };

  // ── Booting / loading ───────────────────────────────────────────────────────
  if (booting) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: C.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}>
        <div style={{ color: C.muted, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: `2px solid ${C.border}`, borderTopColor: C.accent,
            animation: 'mp-spin 0.9s linear infinite',
          }} />
          Loading your resident portal…
        </div>
        <style>{`@keyframes mp-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Authenticated ───────────────────────────────────────────────────────────
  if (authenticated && resident) {
    if (mustChangePassword) {
      return (
        <div style={{
          minHeight: '100vh', backgroundColor: C.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '1.25rem',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}>
          <div style={{
            width: '100%', maxWidth: 460, background: `linear-gradient(160deg, ${C.card} 0%, ${C.panel} 100%)`,
            border: `1px solid ${C.border}`, borderRadius: 18, padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.4rem' }}>
              <BrandMark size={44} />
              <div>
                <h1 style={{ color: C.text, fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Set a new password</h1>
                <p style={{ color: C.muted, fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                  Welcome, {resident.name} · Unit #{resident.unit_number}
                </p>
              </div>
            </div>

            <Banner type="error" text={error} />
            <Banner type="success" text={success} />

            <div style={{
              display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.75rem 0.9rem',
              borderRadius: 10, marginBottom: '1.25rem',
              backgroundColor: C.accentGlow, border: `1px solid ${C.border}`,
              color: C.text, fontSize: '0.8rem',
            }}>
              <ShieldCheck size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Your temporary password must be replaced before you can use the portal.</span>
            </div>

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field
                icon={Lock} label="Current temporary password" type="password"
                value={currentPassword} onChange={setCurrentPassword}
                placeholder="••••••••" autoComplete="current-password"
              />
              <Field
                icon={KeyRound} label="New password" type="password"
                value={newPassword} onChange={setNewPassword}
                placeholder="At least 8 characters" autoComplete="new-password"
                hint="Use 8+ characters with a mix of letters, numbers and symbols."
              />
              <Field
                icon={KeyRound} label="Confirm new password" type="password"
                value={confirmPassword} onChange={setConfirmPassword}
                placeholder="Repeat the new password" autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={busy}
                style={{
                  padding: '0.85rem 1.5rem', backgroundColor: C.accent, color: '#0f1117',
                  border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem',
                  cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1,
                }}
              >
                {busy ? 'Updating…' : 'Update password & continue'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.7rem', background: 'none', color: C.muted, borderRadius: 10,
                  fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer',
                }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <UserDashboard
        resident={resident}
        csrfToken={csrfToken}
        onLogout={handleLogout}
        onSessionExpired={handleLogout}
      />
    );
  }

  // ── Login screen ────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1.25rem',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      backgroundImage: `radial-gradient(ellipse at 20% 0%, ${C.accentGlow} 0%, transparent 45%)`,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.9rem' }}>
            <BrandMark size={58} />
          </div>
          <h1 style={{ color: C.text, fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
            Resident Portal
          </h1>
          <p style={{ color: C.muted, fontSize: '0.87rem', margin: '0.35rem 0 0' }}>
            Monar Pass Apartments · Sign in to manage your lease
          </p>
        </div>

        <div style={{
          background: `linear-gradient(160deg, ${C.card} 0%, ${C.panel} 100%)`,
          border: `1px solid ${C.border}`, borderRadius: 18, padding: '1.75rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
        }}>
          <Banner type="error" text={error} />
          <Banner type="success" text={success} />

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field
              icon={Mail} label="Email address" type="email"
              value={email} onChange={setEmail}
              placeholder="you@example.com" autoComplete="email"
            />
            <Field
              icon={Hash} label="Unit number" type="text"
              value={unitNumber} onChange={setUnitNumber}
              placeholder="e.g. 2104" autoComplete="off"
              hint="Your unit number is printed on your resident ID card."
            />
            <Field
              icon={Lock} label="Password" type="password"
              value={password} onChange={setPassword}
              placeholder="••••••••" autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={busy}
              style={{
                padding: '0.9rem 1.5rem', backgroundColor: C.accent, color: '#0f1117',
                border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.92rem',
                cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1,
                marginTop: '0.25rem',
              }}
            >
              {busy ? 'Signing in…' : 'Sign in to my portal'}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem',
            paddingTop: '1rem', borderTop: `1px solid ${C.border}`,
            color: C.muted, fontSize: '0.78rem',
          }}>
            <Home size={14} color={C.accent} style={{ flexShrink: 0 }} />
            <span>Need access? Contact the leasing office at (817) 857-8782.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
