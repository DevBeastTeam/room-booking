import React, { useState, useEffect } from 'react';
import DatabaseManager from './DatabaseManager.jsx';
import AdminGate from './AdminGate.jsx';

// Shared session check — reuse AdminGate's session
const SESSION_KEY = 'monarch_admin_session';

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() - session.loginTime > 8 * 60 * 60 * 1000) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
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

// If already logged in → show DatabaseManager directly
// If not → show the same AdminGate login first, then redirect to DatabaseManager
export default function DatabaseGate() {
  const [session, setSession] = useState(null);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const existing = getSession();
    if (existing) setSession(existing);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: '#08090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #1f2d44', borderTopColor: '#5ec4b6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If not logged in, use AdminGate (which shows login form, then on success we'll reload this component)
  if (!session) {
    return <AdminGate />;
  }

  return <DatabaseManager onBack={() => { window.location.href = '/admin'; }} />;
}
