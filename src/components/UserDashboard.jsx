import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Home, CreditCard, FileText, Bell, LogOut,
  CheckCircle, AlertCircle, Download, Plus, X, Star,
  Calendar, Package, Car, Archive, Layers,
  BarChart2, MessageSquare, Repeat, RefreshCw,
  CheckCircle2, Wallet, ShieldCheck, ChevronRight
} from 'lucide-react';

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: '#08090f',
  sidebar: '#0c101c',
  card: '#101422',
  cardHover: '#151b2e',
  border: 'rgba(201, 169, 110, 0.22)',
  accent: '#c9a96e',
  accentDark: '#a88448',
  accentGlow: 'rgba(201, 169, 110, 0.2)',
  text: '#f4efe6',
  muted: '#94a3b8',
  warning: '#f59e0b',
  success: '#22c55e',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#a855f7',
};

const RESIDENT_API = '/backend/api/resident.php';
const WF_API = '/backend/api/worldfirst.php';

// ── API helpers (called directly — no dependency on other agents' files) ───────
async function residentApi(action, { method = 'GET', body = null, csrfToken = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  try {
    const res = await fetch(`${RESIDENT_API}?action=${encodeURIComponent(action)}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data && data.success !== false, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'Network error. Please check your connection.' } };
  }
}

async function worldFirstApi(action, { method = 'GET', body = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const res = await fetch(`${WF_API}?action=${encodeURIComponent(action)}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data && data.success !== false, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'Payment gateway is unreachable right now.' } };
  }
}

/** Persist the per-transaction verify token so it survives the gateway redirect. */
function storeVerifyToken(txnId, token) {
  try {
    const map = JSON.parse(sessionStorage.getItem('mp_wf_tokens') || '{}');
    map[txnId] = token;
    sessionStorage.setItem('mp_wf_tokens', JSON.stringify(map));
  } catch { /* storage unavailable — verification falls back to gateway status */ }
}

function readVerifyToken(txnId) {
  try {
    const map = JSON.parse(sessionStorage.getItem('mp_wf_tokens') || '{}');
    return map[txnId] || null;
  } catch {
    return null;
  }
}

// ── Add-on icon mapping ───────────────────────────────────────────────────────
const ADDON_ICONS = { Car, Archive, Layers, Package };
function addonIcon(name) {
  if (!name) return Package;
  return ADDON_ICONS[name] || Package;
}

// ── Helper components ──────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = C.accent }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.card} 0%, ${C.cardHover} 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: '14px',
      padding: '1.4rem 1.6rem',
      display: 'flex', alignItems: 'flex-start', gap: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.4)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 46, height: 46, borderRadius: '12px', backgroundColor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '0.78rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: '0.3rem' }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: 4, height: 22, backgroundColor: C.accent, borderRadius: 4 }} />
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text, margin: 0 }}>{children}</h2>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    paid:        { bg: '#14532d', color: '#4ade80', label: 'Paid'        },
    late:        { bg: '#7f1d1d', color: '#f87171', label: 'Late'        },
    pending:     { bg: '#78350f', color: '#fbbf24', label: 'Pending'     },
    'in-progress':{ bg: '#1e3a5f', color: '#60a5fa', label: 'In Progress'},
    completed:   { bg: '#14532d', color: '#4ade80', label: 'Completed'   },
    active:      { bg: '#134e4a', color: '#2dd4bf', label: 'Active'      },
    inactive:    { bg: '#1e293b', color: '#64748b', label: 'Inactive'    },
    cancelled:   { bg: '#1e293b', color: '#64748b', label: 'Cancelled'   },
    failed:      { bg: '#7f1d1d', color: '#f87171', label: 'Failed'      },
    refunded:    { bg: '#1e293b', color: '#94a3b8', label: 'Refunded'    },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function Notice({ type = 'info', text }) {
  if (!text) return null;
  const palette = {
    success: { color: C.success, bg: 'rgba(34,197,94,0.10)', border: '#22c55e55', Icon: CheckCircle2 },
    error:   { color: C.danger,  bg: 'rgba(239,68,68,0.10)', border: '#ef444455', Icon: AlertCircle },
    info:    { color: C.info,    bg: 'rgba(59,130,246,0.10)', border: '#3b82f655', Icon: ShieldCheck },
  }[type] || { color: C.info, bg: 'rgba(59,130,246,0.10)', border: '#3b82f655', Icon: ShieldCheck };
  const { Icon } = palette;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
      padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1rem',
      fontSize: '0.84rem', color: palette.color, backgroundColor: palette.bg,
      border: `1px solid ${palette.border}`,
    }}>
      <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{text}</span>
    </div>
  );
}

function EmptyState({ icon: Icon = FileText, title, subtitle }) {
  return (
    <div style={{
      padding: '2rem 1.4rem', textAlign: 'center', color: C.muted, fontSize: '0.82rem',
      background: C.card, borderRadius: 12, border: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
    }}>
      <Icon size={22} color={C.border} />
      <div style={{ color: C.text, fontWeight: 600, fontSize: '0.88rem' }}>{title}</div>
      {subtitle && <div>{subtitle}</div>}
    </div>
  );
}

// ── Section: Overview ──────────────────────────────────────────────────────────
function OverviewSection({ resident, lease }) {
  const leaseEnd = lease?.end;
  const daysLeft = useMemo(() => {
    if (!leaseEnd) return null;
    const diff = Math.ceil((new Date(leaseEnd) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [leaseEnd]);

  const rent = resident?.rent ?? lease?.rent_breakdown?.total ?? 0;

  return (
    <div>
      <SectionTitle>Overview</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={Home}       label="Your Unit"      value={`#${resident?.unit_number ?? '—'}`} sub={resident?.floor_plan ?? '—'} color={C.accent}  />
        <StatCard icon={CreditCard} label="Monthly Rent"   value={`$${Number(rent).toFixed(0)}`} sub="Due on 1st of each month" color={C.info}    />
        <StatCard icon={Calendar}   label="Lease Expires"  value={daysLeft !== null ? `${daysLeft}d` : '—'} sub={leaseEnd || '—'} color={C.warning} />
        <StatCard icon={Star}       label="Account Status" value={(resident?.status || '—').split(' ')[0]} sub={resident?.status || ''} color={C.success} />
      </div>

      {/* Lease progress bar */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.4rem 1.6rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ color: C.text, fontWeight: 600, fontSize: '0.9rem' }}>Lease Progress</span>
          <span style={{ color: C.muted, fontSize: '0.8rem' }}>{lease?.start || '—'} → {lease?.end || '—'}</span>
        </div>
        {(() => {
          const start = new Date(lease?.start);
          const end = new Date(lease?.end);
          const valid = lease?.start && lease?.end && !isNaN(start) && !isNaN(end) && end > start;
          const pct = valid ? Math.min(100, Math.max(0, Math.round(((new Date() - start) / (end - start)) * 100))) : 0;
          return (
            <>
              <div style={{ height: 10, backgroundColor: C.border, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.info})`, borderRadius: 10, transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ color: C.muted, fontSize: '0.75rem' }}>Move-in</span>
                <span style={{ color: C.accent, fontSize: '0.75rem', fontWeight: 700 }}>{pct}% completed</span>
                <span style={{ color: C.muted, fontSize: '0.75rem' }}>Lease end</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Recent activity */}
      <ActivityPanel activity={resident?._activity} />
    </div>
  );
}

// ── Section: Recent activity ──────────────────────────────────────────────────
function ActivityPanel({ activity }) {
  if (!activity || activity.length === 0) return null;
  const kindIcon = { payment: Wallet, lease: FileText, maintenance: MessageSquare, addon: Package, document: Download, notice: Bell };
  return (
    <div>
      <SectionTitle>Recent Activity</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {activity.slice(0, 6).map((a, i) => {
          const Icon = kindIcon[a.kind] || Bell;
          return (
            <div key={a.id ?? i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0.85rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: C.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={C.accent} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: C.text, fontSize: '0.86rem', fontWeight: 600 }}>{a.title}</div>
                <div style={{ color: C.muted, fontSize: '0.75rem' }}>{a.detail || a.kind}</div>
              </div>
              <div style={{ color: C.muted, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                {a.occurred_at ? new Date(a.occurred_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section: My Lease ──────────────────────────────────────────────────────────
function LeaseSection({ resident, lease }) {
  const [renewalRequested, setRenewalRequested] = useState(false);
  const breakdown = lease?.rent_breakdown || { base: 0, fees: 0, total: resident?.rent || 0 };

  const rows = [
    ['Floor Plan',      resident?.floor_plan || '—'],
    ['Unit Number',     `#${resident?.unit_number ?? '—'}`],
    ['Bedrooms',        `${resident?.beds ?? '—'} Bed / ${resident?.baths ?? '—'} Bath`],
    ['Square Feet',     `${resident?.sqft ?? '—'} sq. ft.`],
    ['Base Rent',       `$${Number(breakdown.base || 0).toFixed(2)} / month`],
    ['Mandatory Fees',  `$${Number(breakdown.fees || 0).toFixed(2)} / month`],
    ['Total Monthly',   `$${Number(breakdown.total || resident?.rent || 0).toFixed(2)} / month`],
    ['Lease Term',      lease?.term ? `${lease.term} Months` : '—'],
    ['Move-in Date',    resident?.move_in_date || '—'],
    ['Lease Start',     lease?.start || '—'],
    ['Lease End',       lease?.end || '—'],
    ['Security Deposit', `$${Number(resident?.deposit || 0).toFixed(2)}`],
  ];

  const handleDownloadLease = () => {
    const summary = [
      'Monar Pass Apartments - Lease Summary',
      '========================================',
      `Resident: ${resident?.name || ''}`,
      `Unit: #${resident?.unit_number || ''} (${resident?.floor_plan || ''})`,
      `Lease Term: ${lease?.term || '—'} months`,
      `Lease Start: ${lease?.start || '—'}`,
      `Lease End: ${lease?.end || '—'}`,
      `Base Rent: $${Number(breakdown.base || 0).toFixed(2)} / month`,
      `Mandatory Fees: $${Number(breakdown.fees || 0).toFixed(2)} / month`,
      `Total Monthly: $${Number(breakdown.total || resident?.rent || 0).toFixed(2)} / month`,
      `Security Deposit: $${Number(resident?.deposit || 0).toFixed(2)}`,
      '',
      'This text summary was generated from the resident portal.',
    ].join('\n');
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lease-Agreement-Unit-${resident?.unit_number || ''}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionTitle>My Lease</SectionTitle>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.4rem', borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', gap: '1rem' }}>
            <span style={{ color: C.muted, fontSize: '0.85rem' }}>{k}</span>
            <span style={{ color: C.text, fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => setRenewalRequested(true)} style={{ padding: '0.65rem 1.4rem', backgroundColor: C.accent, color: '#0f1117', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = C.accentDark}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = C.accent}>
          Request Renewal
        </button>
        <button onClick={handleDownloadLease} style={{ padding: '0.65rem 1.4rem', backgroundColor: 'transparent', color: C.accent, borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', border: `1.5px solid ${C.accent}` }}>
          Download Lease PDF
        </button>
      </div>
      {renewalRequested && (
        <div style={{ marginTop: '0.75rem', color: C.success, fontSize: '0.82rem', fontWeight: 600 }}>
          Renewal request submitted. The leasing office will contact you.
        </div>
      )}
    </div>
  );
}

// ── Section: Payments ──────────────────────────────────────────────────────────
function PaymentsSection({ resident, payments, onRefresh, csrfToken, loading }) {
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState(null);

  const txns = Array.isArray(payments) ? payments : [];
  const activeSub = txns.find(
    (t) => t.payment_mode === 'subscription' && t.subscription_status === 'active'
  );

  /**
   * Real WorldFirst payment flow.
   * NOTE: the amount is resolved SERVER-SIDE (never sent from the browser) and
   * the API returns a per-transaction `verify_token` that MUST be sent back
   * to `verify_payment` — without it the gateway rejects the confirmation.
   */
  const startPayment = async (paymentMode) => {
    if (!resident) return;
    setMsg(null);
    setPaying(true);
    const { ok, data } = await worldFirstApi('create_payment', {
      method: 'POST',
      body: {
        item_type: 'rent_payment',
        item_name: 'Monthly Apartment Rent',
        unit_number: resident.unit_number,
        customer_name: resident.name,
        customer_email: resident.email,
        customer_phone: resident.phone || '',
        payment_mode: paymentMode,
        subscription_interval: paymentMode === 'subscription' ? 'monthly' : null,
      },
    });
    setPaying(false);

    if (!ok) {
      setMsg({ type: 'error', text: data?.error || 'Failed to start the payment. Please try again.' });
      return;
    }

    if (data.verify_token && data.txn_id) {
      storeVerifyToken(data.txn_id, data.verify_token);
    }

    // Live gateway → hand the resident over to WorldFirst checkout.
    if (data.live_api && data.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }

    // Sandbox → confirm straight away using the token we just received.
    if (data.txn_id) {
      const token = data.verify_token;
      const verified = await worldFirstApi('verify_payment', {
        method: 'POST',
        body: { txn_id: data.txn_id, verify_token: token },
      });
      if (verified.ok && verified.data?.verified) {
        setMsg({ type: 'success', text: `Payment ${data.txn_id} confirmed — $${Number(data.amount || 0).toFixed(2)} received. Thank you!` });
        onRefresh?.();
      } else {
        setMsg({ type: 'info', text: verified.data?.error || 'Payment initiated. It may take a moment to confirm.' });
        onRefresh?.();
      }
    }
  };

  const handleCancelAutoPay = async () => {
    if (!activeSub) return;
    if (!window.confirm('Are you sure you want to cancel automatic recurring rent payments? You will need to pay manually each month.')) {
      return;
    }
    setCancelling(true);
    const { ok, data } = await residentApi('cancel_autopay', {
      method: 'POST',
      csrfToken,
      body: {},
    });
    setCancelling(false);
    if (ok) {
      setMsg({ type: 'success', text: 'Auto-Pay subscription cancelled. You can make one-time payments anytime.' });
      onRefresh?.();
    } else {
      setMsg({ type: 'error', text: data?.error || 'Failed to cancel Auto-Pay.' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <SectionTitle>Billing & Payment History</SectionTitle>
          <p style={{ color: C.muted, fontSize: '0.82rem', margin: '-0.75rem 0 0' }}>
            Powered by WorldFirst Pay Solution. Track payments and manage auto-debit agreements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              backgroundColor: C.card, border: `1px solid ${C.border}`, color: C.text,
              borderRadius: 8, padding: '0.45rem 0.85rem', fontSize: '0.78rem',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => startPayment('subscription')}
            disabled={paying}
            style={{
              padding: '0.45rem 1rem', backgroundColor: C.accent, color: '#0f1117',
              borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', cursor: paying ? 'wait' : 'pointer',
              border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: paying ? 0.7 : 1,
            }}
          >
            <CreditCard size={14} /> {paying ? 'Starting…' : 'Pay Rent / Start Auto-Pay →'}
          </button>
        </div>
      </div>

      {msg && <Notice type={msg.type} text={msg.text} />}

      {/* Active Auto-Subscription Card */}
      {activeSub ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(201, 169, 110, 0.06))',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Repeat size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Auto-Pay Active
                <span style={{ fontSize: '0.68rem', backgroundColor: '#22c55e20', color: C.success, padding: '0.1rem 0.45rem', borderRadius: 4, fontWeight: 700 }}>
                  Active Mandate
                </span>
              </div>
              <div style={{ color: C.muted, fontSize: '0.78rem', marginTop: '0.2rem' }}>
                Cycle: <strong style={{ color: C.text }}>{activeSub.subscription_interval === '3_days' ? 'Every 3 Days (Test Cycle)' : 'Monthly (Every 30 Days)'}</strong>
                {activeSub.next_billing_date && (
                  <span> · Next Debit: <strong style={{ color: '#38bdf8' }}>{activeSub.next_billing_date}</strong></span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleCancelAutoPay}
            disabled={cancelling}
            style={{
              padding: '0.4rem 0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)', color: C.danger,
              borderRadius: 7, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {cancelling ? 'Cancelling…' : 'Cancel Auto-Pay'}
          </button>
        </div>
      ) : (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: '1rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div>
            <div style={{ color: C.text, fontWeight: 600, fontSize: '0.85rem' }}>No Active Auto-Pay Agreement</div>
            <div style={{ color: C.muted, fontSize: '0.75rem' }}>Enable automated monthly debits to avoid late rent fees.</div>
          </div>
          <button
            onClick={() => startPayment('subscription')}
            disabled={paying}
            style={{
              padding: '0.4rem 0.85rem', backgroundColor: `${C.accent}20`, border: `1px solid ${C.accent}50`,
              color: C.accent, borderRadius: 7, fontSize: '0.78rem', fontWeight: 700,
              cursor: paying ? 'wait' : 'pointer', opacity: paying ? 0.7 : 1,
            }}
          >
            Enable Auto-Pay
          </button>
        </div>
      )}

      {/* WorldFirst payments table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: 0, padding: '0.75rem 1.4rem', borderBottom: `1px solid ${C.border}`, backgroundColor: 'rgba(255,255,255,0.03)' }}>
          {['Transaction', 'Purpose / Item', 'Plan / Mode', 'Amount', 'Status'].map(h => (
            <span key={h} style={{ color: C.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {txns.length > 0 ? (
          txns.map((p, i) => (
            <div
              key={p.txn_id || p.id || i}
              style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto',
                gap: 0, padding: '0.9rem 1.4rem',
                borderBottom: i < txns.length - 1 ? `1px solid ${C.border}` : 'none',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ color: C.text, fontSize: '0.84rem', fontWeight: 700, fontFamily: 'monospace' }}>{p.txn_id}</div>
                <div style={{ color: C.muted, fontSize: '0.7rem' }}>{p.created_at || 'Recently'}</div>
              </div>
              <div>
                <div style={{ color: C.text, fontSize: '0.82rem', fontWeight: 600 }}>{p.item_name || p.item_type}</div>
                {p.unit_number && <div style={{ color: C.accent, fontSize: '0.7rem' }}>Unit #{p.unit_number}</div>}
              </div>
              <div>
                {p.payment_mode === 'subscription' ? (
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Repeat size={11} /> Auto-Pay ({p.subscription_interval === '3_days' ? '3 Days' : 'Monthly'})
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: C.muted }}>One-Time</span>
                )}
              </div>
              <div>
                <span style={{ color: C.accent, fontSize: '0.92rem', fontWeight: 800 }}>${(parseFloat(p.amount) || 0).toFixed(2)}</span>
                <span style={{ color: C.muted, fontSize: '0.68rem', marginLeft: '0.25rem' }}>{p.currency || 'USD'}</span>
              </div>
              <Badge status={p.status || 'pending'} />
            </div>
          ))
        ) : (
          <div style={{ padding: '2rem 1.4rem', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>
            {loading ? 'Payment history loading…' : 'No previous payments recorded.'}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section: Maintenance ───────────────────────────────────────────────────────
function MaintenanceSection({ maintenance, onRefresh, csrfToken }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Plumbing', priority: 'Medium', desc: '' });
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const priorityColor = { High: C.danger, Emergency: C.danger, Medium: C.warning, Low: C.success };
  const tickets = Array.isArray(maintenance) ? maintenance : [];

  const handleSubmitRequest = async () => {
    if (!form.title.trim() || !form.desc.trim()) {
      setSubmitMsg({ type: 'error', text: 'Please fill in both the title and description.' });
      return;
    }
    setSubmitMsg(null);
    setSubmitting(true);
    const { ok, data } = await residentApi('submit_maintenance', {
      method: 'POST',
      csrfToken,
      body: {
        title: form.title.trim(),
        category: form.category,
        priority: form.priority,
        notes: form.desc.trim(),
      },
    });
    setSubmitting(false);
    if (ok) {
      setSubmitMsg({ type: 'success', text: `Request ${data?.ticket?.id || ''} submitted successfully.` });
      setForm({ title: '', category: 'Plumbing', priority: 'Medium', desc: '' });
      setShowForm(false);
      onRefresh?.();
    } else {
      setSubmitMsg({ type: 'error', text: data?.error || 'Failed to submit request. Please try again.' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 4, height: 22, backgroundColor: C.accent, borderRadius: 4 }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text, margin: 0 }}>Maintenance Requests</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', backgroundColor: C.accent, color: '#0f1117', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', border: 'none' }}>
          <Plus size={15} /> New Request
        </button>
      </div>

      {showForm && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 14, padding: '1.4rem', marginBottom: '1.25rem' }}>
          <h3 style={{ color: C.text, fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Submit New Request</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[['Issue Title', 'title', 'text', 'e.g. Leaking faucet'], ['Category', 'category', 'select', ''], ['Priority', 'priority', 'select', '']].map(([label, key, type, ph]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: C.muted, fontSize: '0.78rem', fontWeight: 600 }}>{label}</label>
                {type === 'select' ? (
                  <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: '0.85rem' }}>
                    {key === 'category'
                      ? ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Exterior', 'General'].map(o => <option key={o}>{o}</option>)
                      : ['Low', 'Medium', 'High'].map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: '0.85rem' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: C.muted, fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Description</label>
            <textarea rows={3} placeholder="Describe the issue in detail..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={handleSubmitRequest} disabled={submitting} style={{ padding: '0.6rem 1.2rem', backgroundColor: C.accent, color: '#0f1117', borderRadius: 8, fontWeight: 700, fontSize: '0.83rem', cursor: submitting ? 'wait' : 'pointer', border: 'none', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', color: C.muted, borderRadius: 8, fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', border: `1px solid ${C.border}` }}>Cancel</button>
          </div>
        </div>
      )}

      {submitMsg && (
        <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1.1rem', background: C.card, border: `1px solid ${submitMsg.type === 'error' ? C.danger : C.success}66`, borderRadius: 12, color: submitMsg.type === 'error' ? C.danger : C.success, fontSize: '0.85rem', fontWeight: 600 }}>
          {submitMsg.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tickets.length > 0 ? tickets.map(req => (
          <div key={req.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.1rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: C.muted, fontSize: '0.75rem', fontWeight: 700 }}>{req.id}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: priorityColor[req.priority] || C.warning }} />
                  <span style={{ color: priorityColor[req.priority] || C.warning, fontSize: '0.72rem', fontWeight: 700 }}>{req.priority} Priority</span>
                </div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{req.title}</div>
                <div style={{ color: C.muted, fontSize: '0.8rem' }}>{req.category} · {req.date}</div>
                {req.notes && <div style={{ color: C.muted, fontSize: '0.78rem', marginTop: '0.3rem', fontStyle: 'italic' }}>{req.notes}</div>}
              </div>
              <Badge status={req.status} />
            </div>
          </div>
        )) : (
          <EmptyState icon={MessageSquare} title="No maintenance requests" subtitle="Use “New Request” to report an issue in your apartment." />
        )}
      </div>
    </div>
  );
}

// ── Section: Add-ons ───────────────────────────────────────────────────────────
function AddOnsSection({ addons, onRefresh, csrfToken }) {
  const [busyKey, setBusyKey] = useState(null);
  const [msg, setMsg] = useState(null);
  const list = Array.isArray(addons) ? addons : [];

  const handleToggle = async (addon) => {
    setBusyKey(addon.id);
    setMsg(null);
    const next = !addon.active;
    const { ok, data } = await residentApi('toggle_addon', {
      method: 'POST',
      csrfToken,
      body: { addon_key: addon.id, active: next },
    });
    setBusyKey(null);
    if (ok) {
      setMsg({ type: 'success', text: data?.message || `${addon.name} updated.` });
      onRefresh?.();
    } else {
      setMsg({ type: 'error', text: data?.error || 'Could not update the add-on.' });
    }
  };

  return (
    <div>
      <SectionTitle>My Add-ons & Amenities</SectionTitle>
      {msg && <Notice type={msg.type} text={msg.text} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {list.length === 0 ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <EmptyState icon={Package} title="No add-ons available" subtitle="Add-ons published by the leasing office will appear here." />
          </div>
        ) : list.map(a => {
          const Icon = addonIcon(a.icon);
          const busy = busyKey === a.id;
          return (
            <div key={a.id} style={{ background: C.card, border: `1px solid ${a.active ? C.accent + '55' : C.border}`, borderRadius: 14, padding: '1.2rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: a.active ? C.accentGlow : C.border + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={a.active ? C.accent : C.muted} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: C.text, fontWeight: 600, fontSize: '0.88rem' }}>{a.name}</div>
                  <div style={{ color: C.accent, fontSize: '0.8rem', fontWeight: 700 }}>${a.price}/mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                <Badge status={a.active ? 'active' : 'inactive'} />
                <button
                  onClick={() => handleToggle(a)}
                  disabled={busy}
                  style={{ padding: '0.3rem 0.7rem', backgroundColor: a.active ? '#7f1d1d' : C.accent, color: a.active ? '#f87171' : '#0f1117', borderRadius: 6, fontWeight: 700, fontSize: '0.72rem', cursor: busy ? 'wait' : 'pointer', border: 'none', opacity: busy ? 0.6 : 1 }}
                >
                  {busy ? '…' : a.active ? 'Remove' : 'Add'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section: Documents ─────────────────────────────────────────────────────────
function DocumentsSection({ resident, documents }) {
  const docs = Array.isArray(documents) ? documents : [];

  const handleDownload = (doc) => {
    if (doc.file_url && doc.file_url !== '#' && /^https?:\/\//i.test(doc.file_url)) {
      window.open(doc.file_url, '_blank', 'noopener,noreferrer');
      return;
    }
    const content = [
      'Monar Pass Apartments - Resident Portal',
      `Document: ${doc.name}`,
      `Unit: #${resident?.unit_number ?? ''}  Resident: ${resident?.name ?? ''}`,
      `Size: ${doc.size || '—'}  Date: ${doc.date || '—'}`,
      '',
      'This file was generated from the resident portal.',
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name || 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionTitle>My Documents</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {docs.length === 0 ? (
          <EmptyState icon={FileText} title="No documents yet" subtitle="Lease agreements and inspection reports will appear here." />
        ) : docs.map((doc, i) => (
          <div key={doc.id ?? i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0.9rem 1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: `${C.info}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={18} color={C.info} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.text, fontWeight: 600, fontSize: '0.87rem' }}>{doc.name}</div>
                <div style={{ color: C.muted, fontSize: '0.75rem' }}>{doc.size || '—'} · {doc.date || '—'}{doc.category ? ` · ${doc.category}` : ''}</div>
              </div>
            </div>
            <button onClick={() => handleDownload(doc)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', backgroundColor: `${C.info}22`, color: C.info, borderRadius: 7, fontWeight: 700, fontSize: '0.77rem', cursor: 'pointer', border: `1px solid ${C.info}44`, flexShrink: 0 }}>
              <Download size={13} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Notifications ─────────────────────────────────────────────────────
function NotificationsSection({ notifications }) {
  const [dismissed, setDismissed] = useState([]);
  const iconMap = { info: { Icon: Bell, color: C.info }, success: { Icon: CheckCircle, color: C.success }, warning: { Icon: AlertCircle, color: C.warning }, danger: { Icon: AlertCircle, color: C.danger } };

  const notes = (Array.isArray(notifications) ? notifications : []).filter(n => !dismissed.includes(n.id));

  return (
    <div>
      <SectionTitle>Notifications</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {notes.map(n => {
          const { Icon, color } = iconMap[n.type] || iconMap.info;
          return (
            <div key={n.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0.9rem 1.3rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <Icon size={18} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1, color: C.text, fontSize: '0.87rem' }}>{n.msg}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: C.muted, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{n.time}</span>
                <button
                  onClick={() => setDismissed(prev => [...prev, n.id])}
                  aria-label="Dismiss notification"
                  style={{ color: C.muted, cursor: 'pointer', background: 'none', border: 'none', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {notes.length === 0 && (
          <EmptyState icon={Bell} title="No notifications" subtitle="Community updates and billing reminders will show up here." />
        )}
      </div>
    </div>
  );
}

// ── Sidebar nav items ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',     Icon: BarChart2     },
  { id: 'lease',         label: 'My Lease',     Icon: FileText      },
  { id: 'payments',      label: 'Payments',     Icon: CreditCard    },
  { id: 'maintenance',   label: 'Maintenance',  Icon: MessageSquare },
  { id: 'addons',        label: 'Add-ons',      Icon: Package       },
  { id: 'documents',     label: 'Documents',    Icon: Download      },
  { id: 'notifications', label: 'Notifications',Icon: Bell          },
];

// ── Main export ────────────────────────────────────────────────────────────────
export default function UserDashboard({ resident, csrfToken, onLogout, onSessionExpired, onBack }) {
  const handleBack = onBack || (() => { window.location.href = '/'; });
  const [activeSection, setActiveSection] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signedOut, setSignedOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Responsive ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Load the real dashboard data ────────────────────────────────────────────
  const loadOverview = useCallback(async (isActive = () => true) => {
    setLoading(true);
    const { ok, status, data } = await residentApi('overview');
    if (!isActive()) return;
    setLoading(false);
    if (!ok) {
      if (status === 401) {
        setSignedOut(true);
      } else {
        setError(data?.error || 'Could not load your dashboard right now.');
      }
      return;
    }
    setError('');
    setSignedOut(false);
    setOverview(data);
  }, []);

  useEffect(() => {
    let active = true;
    loadOverview(() => active);
    return () => { active = false; };
  }, [loadOverview]);

  // ── Handle the payment gateway redirect (?payment=success&txn_id=…) ─────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get('payment');
    const txnId = params.get('txn_id');
    if (!paymentState || !txnId) return;

    const verify = async () => {
      const token = readVerifyToken(txnId);
      const { ok, data } = await worldFirstApi('verify_payment', {
        method: 'POST',
        body: { txn_id: txnId, verify_token: token || '' },
      });
      if (ok && data?.verified) {
        setError('');
        window.dispatchEvent(new CustomEvent('mp-payment-verified', { detail: data }));
        loadOverview();
      }
      // Clean the URL so a refresh does not re-verify.
      window.history.replaceState({}, '', window.location.pathname);
    };
    verify();
  }, [loadOverview]);

  // ── Friendly "not logged in" state ──────────────────────────────────────────
  if (signedOut) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 420, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ShieldCheck size={26} color={C.danger} />
          </div>
          <h2 style={{ color: C.text, fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>You are signed out</h2>
          <p style={{ color: C.muted, fontSize: '0.87rem', margin: '0 0 1.5rem' }}>
            Your resident session has expired. Please sign in again to view your lease, payments and maintenance requests.
          </p>
          <button
            onClick={() => (onSessionExpired ? onSessionExpired() : window.location.reload())}
            style={{ padding: '0.75rem 1.6rem', backgroundColor: C.accent, color: '#0f1117', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
          >
            Sign in again
          </button>
        </div>
      </div>
    );
  }

  const data = overview || {};
  const profile = data.resident || resident || {};
  const lease = data.lease || {};
  const activity = data.activity || [];

  const sectionMap = {
    overview:      <OverviewSection resident={{ ...profile, _activity: activity }} lease={lease} />,
    lease:         <LeaseSection resident={profile} lease={lease} />,
    payments:      <PaymentsSection resident={profile} payments={data.payments} onRefresh={loadOverview} csrfToken={csrfToken} loading={loading} />,
    maintenance:   <MaintenanceSection maintenance={data.maintenance} onRefresh={loadOverview} csrfToken={csrfToken} />,
    addons:        <AddOnsSection addons={data.addons} onRefresh={loadOverview} csrfToken={csrfToken} />,
    documents:     <DocumentsSection resident={profile} documents={data.documents} />,
    notifications: <NotificationsSection notifications={data.notifications} />,
  };

  const initials = (profile.name || 'R')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', flexDirection: isMobile ? 'column' : 'row', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: isMobile ? '100%' : 240,
        backgroundColor: C.sidebar,
        borderRight: isMobile ? 'none' : `1px solid ${C.border}`,
        borderBottom: isMobile ? `1px solid ${C.border}` : 'none',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'column',
        flexShrink: 0,
      }}>
        {/* Profile */}
        <div style={{ padding: isMobile ? '1.1rem 1.2rem' : '1.75rem 1.4rem 1.4rem', borderBottom: `1px solid ${C.border}`, display: isMobile ? 'flex' : 'block', alignItems: isMobile ? 'center' : 'initial', gap: '0.9rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, ${C.info})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: isMobile ? '0' : '0.85rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f1117', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem' }}>{profile.name || 'Resident'}</div>
            <div style={{ color: C.muted, fontSize: '0.78rem', marginTop: '0.1rem' }}>Unit #{profile.unit_number || '—'}</div>
            <div style={{ marginTop: isMobile ? '0.35rem' : '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#14532d', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4ade80' }} />
              <span style={{ color: '#4ade80', fontSize: '0.7rem', fontWeight: 700 }}>{profile.status || 'Good Standing'}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, padding: isMobile ? '0.6rem 0.75rem' : '1rem 0.75rem',
          display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '0.2rem',
          overflowX: isMobile ? 'auto' : 'visible',
        }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeSection === id;
            return (
              <button key={id} onClick={() => setActiveSection(id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.9rem', borderRadius: 10, cursor: 'pointer', border: 'none',
                backgroundColor: active ? C.accentGlow : 'transparent',
                color: active ? C.accent : C.muted,
                fontWeight: active ? 700 : 500, fontSize: '0.875rem',
                width: isMobile ? 'auto' : '100%', textAlign: 'left', flexShrink: 0,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = C.text; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.muted; } }}
              >
                {active && <div style={{ width: 3, height: 18, backgroundColor: C.accent, borderRadius: 4, marginLeft: -6, marginRight: 3 }} />}
                <Icon size={17} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: isMobile ? '0.6rem 0.75rem 1rem' : '1rem 0.75rem', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '0.3rem' }}>
          <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 0.9rem', borderRadius: 10, cursor: 'pointer', border: 'none', backgroundColor: 'transparent', color: C.muted, fontWeight: 500, fontSize: '0.875rem', width: isMobile ? 'auto' : '100%', textAlign: 'left' }}>
            <ChevronRight size={17} /> Back to Website
          </button>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 0.9rem', borderRadius: 10, cursor: 'pointer', border: 'none', backgroundColor: 'transparent', color: C.muted, fontWeight: 500, fontSize: '0.875rem', width: isMobile ? 'auto' : '100%', textAlign: 'left' }}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1.25rem 1rem 2.5rem' : '2.5rem 2.5rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ color: C.text, fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 800, margin: 0 }}>
              Welcome back, {(profile.name || 'Resident').split(' ')[0]}! 👋
            </h1>
            <p style={{ color: C.muted, fontSize: '0.875rem', margin: '0.3rem 0 0' }}>
              Monar Pass Apartments · Resident Portal
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div style={{ color: C.muted, fontSize: '0.75rem' }}>Fort Worth, TX</div>
            </div>
          </div>
        </div>

        {error && <Notice type="error" text={error} />}
        {loading && !overview && (
          <div style={{ color: C.muted, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <RefreshCw size={14} className="animate-spin" /> Loading your dashboard…
          </div>
        )}

        {/* Active section */}
        <div className="animate-fade-in" key={activeSection}>
          {sectionMap[activeSection]}
        </div>
      </main>
    </div>
  );
}
