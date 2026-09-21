import React, { useState } from 'react';
import {
  Home, CreditCard, FileText, Wrench, Bell, LogOut, ChevronRight,
  CheckCircle, Clock, AlertCircle, Download, Plus, X, Star,
  TrendingUp, Calendar, Package, Wifi, Car, Archive, Layers,
  User, Settings, BarChart2, MessageSquare
} from 'lucide-react';

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: '#0f1117',
  sidebar: '#161b27',
  card: '#1a2235',
  cardHover: '#1f2a42',
  border: '#253048',
  accent: '#5ec4b6',
  accentDark: '#3da89a',
  accentGlow: 'rgba(94,196,182,0.15)',
  text: '#e2e8f0',
  muted: '#7a8ba8',
  warning: '#f59e0b',
  success: '#22c55e',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#a855f7',
};

// ── Mock resident data ─────────────────────────────────────────────────────────
const RESIDENT = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  unit: '2104',
  floorPlan: 'Two Bedroom',
  beds: 2, baths: 1, sqft: 769,
  rent: 967, // 909 + fees
  leaseStart: '2025-02-01',
  leaseEnd: '2026-02-01',
  leaseTerm: 12,
  moveInDate: '2025-02-01',
  status: 'Good Standing',
  deposit: 250,
};

const PAYMENT_HISTORY = [
  { id: 1, month: 'September 2026', amount: 967, status: 'paid', date: 'Sep 1, 2026', method: 'Auto-Pay' },
  { id: 2, month: 'August 2026',    amount: 967, status: 'paid', date: 'Aug 1, 2026', method: 'Auto-Pay' },
  { id: 3, month: 'July 2026',      amount: 967, status: 'paid', date: 'Jul 1, 2026', method: 'Online'   },
  { id: 4, month: 'June 2026',      amount: 967, status: 'paid', date: 'Jun 1, 2026', method: 'Auto-Pay' },
  { id: 5, month: 'May 2026',       amount: 967, status: 'paid', date: 'May 1, 2026', method: 'Auto-Pay' },
  { id: 6, month: 'April 2026',     amount: 967, status: 'late', date: 'Apr 6, 2026', method: 'Online'   },
];

const MAINTENANCE_REQUESTS = [
  { id: 'MR-001', title: 'AC not cooling properly', category: 'HVAC', priority: 'High',   status: 'in-progress', date: 'Sep 15, 2026', notes: 'Technician scheduled for Sep 20' },
  { id: 'MR-002', title: 'Kitchen faucet dripping',  category: 'Plumbing', priority: 'Medium', status: 'completed',  date: 'Aug 28, 2026', notes: 'Fixed — faucet replaced' },
  { id: 'MR-003', title: 'Bathroom light flickering', category: 'Electrical', priority: 'Low', status: 'pending',    date: 'Sep 18, 2026', notes: 'Awaiting assignment' },
];

const ADDONS_ACTIVE = [
  { id: 'carport',    name: 'Reserved Covered Carport', price: 35,  icon: Car,     active: true  },
  { id: 'storage',    name: 'Extra Storage Locker',     price: 45,  icon: Archive, active: false },
  { id: 'washer',     name: 'In-Unit Washer & Dryer',   price: 40,  icon: Layers,  active: true  },
];

const DOCUMENTS = [
  { name: 'Lease Agreement 2025–2026.pdf', size: '1.2 MB', date: 'Feb 1, 2025'  },
  { name: 'Move-In Inspection Report.pdf', size: '0.8 MB', date: 'Feb 1, 2025'  },
  { name: 'Community Rules & Regulations.pdf', size: '0.5 MB', date: 'Jan 15, 2025' },
  { name: 'Renter Insurance Policy.pdf', size: '2.1 MB', date: 'Feb 5, 2025'  },
];

const NOTIFICATIONS = [
  { id: 1, type: 'info',    msg: 'Your rent for October is due in 12 days.',           time: '2h ago'   },
  { id: 2, type: 'success', msg: 'Maintenance request MR-002 has been completed.',      time: '3d ago'   },
  { id: 3, type: 'warning', msg: 'Community pool will be closed Oct 1–5 for cleaning.', time: '5d ago'   },
  { id: 4, type: 'info',    msg: 'Your lease renewal offer is ready to review.',        time: '1w ago'   },
];

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
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ── Section: Overview ──────────────────────────────────────────────────────────
function OverviewSection() {
  const daysLeft = Math.ceil((new Date(RESIDENT.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24));
  return (
    <div>
      <SectionTitle>Overview</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={Home}       label="Your Unit"       value={`#${RESIDENT.unit}`}      sub={RESIDENT.floorPlan}           color={C.accent}   />
        <StatCard icon={CreditCard} label="Monthly Rent"    value={`$${RESIDENT.rent}`}      sub="Due on 1st of each month"     color={C.info}     />
        <StatCard icon={Calendar}   label="Lease Expires"   value={`${daysLeft}d`}           sub={RESIDENT.leaseEnd}            color={C.warning}  />
        <StatCard icon={Star}       label="Account Status"  value="Good"                     sub={RESIDENT.status}              color={C.success}  />
      </div>

      {/* Lease progress bar */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.4rem 1.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: C.text, fontWeight: 600, fontSize: '0.9rem' }}>Lease Progress</span>
          <span style={{ color: C.muted, fontSize: '0.8rem' }}>{RESIDENT.leaseStart} → {RESIDENT.leaseEnd}</span>
        </div>
        {(() => {
          const start = new Date(RESIDENT.leaseStart), end = new Date(RESIDENT.leaseEnd), now = new Date();
          const pct = Math.min(100, Math.round(((now - start) / (end - start)) * 100));
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
    </div>
  );
}

// ── Section: My Lease ──────────────────────────────────────────────────────────
function LeaseSection() {
  const rows = [
    ['Floor Plan',    RESIDENT.floorPlan],
    ['Unit Number',   `#${RESIDENT.unit}`],
    ['Bedrooms',      `${RESIDENT.beds} Bed / ${RESIDENT.baths} Bath`],
    ['Square Feet',   `${RESIDENT.sqft} sq. ft.`],
    ['Base Rent',     `$909.00 / month`],
    ['Mandatory Fees','$58.00 / month'],
    ['Total Monthly', `$${RESIDENT.rent}.00 / month`],
    ['Lease Term',    `${RESIDENT.leaseTerm} Months`],
    ['Move-in Date',  RESIDENT.moveInDate],
    ['Lease Start',   RESIDENT.leaseStart],
    ['Lease End',     RESIDENT.leaseEnd],
    ['Security Deposit', `$${RESIDENT.deposit}.00`],
  ];
  return (
    <div>
      <SectionTitle>My Lease</SectionTitle>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.4rem', borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
            <span style={{ color: C.muted, fontSize: '0.85rem' }}>{k}</span>
            <span style={{ color: C.text, fontWeight: 600, fontSize: '0.9rem' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button style={{ padding: '0.65rem 1.4rem', backgroundColor: C.accent, color: '#0f1117', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = C.accentDark}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = C.accent}>
          Request Renewal
        </button>
        <button style={{ padding: '0.65rem 1.4rem', backgroundColor: 'transparent', color: C.accent, borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', border: `1.5px solid ${C.accent}` }}>
          Download Lease PDF
        </button>
      </div>
    </div>
  );
}

// ── Section: Payments ──────────────────────────────────────────────────────────
function PaymentsSection() {
  return (
    <div>
      <SectionTitle>Payment History</SectionTitle>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 0, padding: '0.75rem 1.4rem', borderBottom: `1px solid ${C.border}`, backgroundColor: 'rgba(255,255,255,0.03)' }}>
          {['Month', 'Amount', 'Date', 'Method', 'Status'].map(h => (
            <span key={h} style={{ color: C.muted, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>
        {PAYMENT_HISTORY.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 0, padding: '0.9rem 1.4rem', borderBottom: i < PAYMENT_HISTORY.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}>
            <span style={{ color: C.text, fontSize: '0.87rem', fontWeight: 500 }}>{p.month}</span>
            <span style={{ color: C.accent, fontSize: '0.9rem', fontWeight: 700 }}>${p.amount}</span>
            <span style={{ color: C.muted, fontSize: '0.82rem' }}>{p.date}</span>
            <span style={{ color: C.muted, fontSize: '0.82rem', paddingRight: '1rem' }}>{p.method}</span>
            <Badge status={p.status} />
          </div>
        ))}
      </div>
      <button style={{ padding: '0.65rem 1.4rem', backgroundColor: C.accent, color: '#0f1117', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', border: 'none' }}>
        Pay Rent Online →
      </button>
    </div>
  );
}

// ── Section: Maintenance ───────────────────────────────────────────────────────
function MaintenanceSection() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Plumbing', priority: 'Medium', desc: '' });

  const priorityColor = { High: C.danger, Medium: C.warning, Low: C.success };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[['Issue Title', 'title', 'text', 'e.g. Leaking faucet'], ['Category', 'category', 'select', ''], ['Priority', 'priority', 'select', '']].map(([label, key, type, ph]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: C.muted, fontSize: '0.78rem', fontWeight: 600 }}>{label}</label>
                {type === 'select' ? (
                  <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ padding: '0.6rem 0.8rem', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: '0.85rem' }}>
                    {key === 'category'
                      ? ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Other'].map(o => <option key={o}>{o}</option>)
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
            <button style={{ padding: '0.6rem 1.2rem', backgroundColor: C.accent, color: '#0f1117', borderRadius: 8, fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer', border: 'none' }}>Submit Request</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', color: C.muted, borderRadius: 8, fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', border: `1px solid ${C.border}` }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MAINTENANCE_REQUESTS.map(req => (
          <div key={req.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.1rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: C.muted, fontSize: '0.75rem', fontWeight: 700 }}>{req.id}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: priorityColor[req.priority] }} />
                  <span style={{ color: priorityColor[req.priority], fontSize: '0.72rem', fontWeight: 700 }}>{req.priority} Priority</span>
                </div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{req.title}</div>
                <div style={{ color: C.muted, fontSize: '0.8rem' }}>{req.category} · {req.date}</div>
                <div style={{ color: C.muted, fontSize: '0.78rem', marginTop: '0.3rem', fontStyle: 'italic' }}>{req.notes}</div>
              </div>
              <Badge status={req.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Add-ons ───────────────────────────────────────────────────────────
function AddOnsSection() {
  const [addons, setAddons] = useState(ADDONS_ACTIVE);
  return (
    <div>
      <SectionTitle>My Add-ons & Amenities</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {addons.map(a => (
          <div key={a.id} style={{ background: C.card, border: `1px solid ${a.active ? C.accent + '55' : C.border}`, borderRadius: 14, padding: '1.2rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: a.active ? C.accentGlow : C.border + '40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={20} color={a.active ? C.accent : C.muted} />
              </div>
              <div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: '0.88rem' }}>{a.name}</div>
                <div style={{ color: C.accent, fontSize: '0.8rem', fontWeight: 700 }}>${a.price}/mo</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <Badge status={a.active ? 'active' : 'inactive'} />
              <button onClick={() => setAddons(prev => prev.map(x => x.id === a.id ? { ...x, active: !x.active } : x))}
                style={{ padding: '0.3rem 0.7rem', backgroundColor: a.active ? '#7f1d1d' : C.accent, color: a.active ? '#f87171' : '#0f1117', borderRadius: 6, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', border: 'none' }}>
                {a.active ? 'Remove' : 'Add'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Documents ─────────────────────────────────────────────────────────
function DocumentsSection() {
  return (
    <div>
      <SectionTitle>My Documents</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {DOCUMENTS.map((doc, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0.9rem 1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: `${C.info}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color={C.info} />
              </div>
              <div>
                <div style={{ color: C.text, fontWeight: 600, fontSize: '0.87rem' }}>{doc.name}</div>
                <div style={{ color: C.muted, fontSize: '0.75rem' }}>{doc.size} · {doc.date}</div>
              </div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.85rem', backgroundColor: `${C.info}22`, color: C.info, borderRadius: 7, fontWeight: 700, fontSize: '0.77rem', cursor: 'pointer', border: `1px solid ${C.info}44` }}>
              <Download size={13} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Notifications ─────────────────────────────────────────────────────
function NotificationsSection() {
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const iconMap = { info: { Icon: Bell, color: C.info }, success: { Icon: CheckCircle, color: C.success }, warning: { Icon: AlertCircle, color: C.warning } };
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
                <button onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))} style={{ color: C.muted, cursor: 'pointer', background: 'none', border: 'none', padding: '2px' }}>
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {notes.length === 0 && <div style={{ color: C.muted, textAlign: 'center', padding: '2rem', background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>No notifications</div>}
      </div>
    </div>
  );
}

// ── Sidebar nav items ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',        Icon: BarChart2      },
  { id: 'lease',         label: 'My Lease',         Icon: FileText       },
  { id: 'payments',      label: 'Payments',         Icon: CreditCard     },
  { id: 'maintenance',   label: 'Maintenance',      Icon: MessageSquare  },
  { id: 'addons',        label: 'Add-ons',          Icon: Package        },
  { id: 'documents',     label: 'Documents',        Icon: Download       },
  { id: 'notifications', label: 'Notifications',    Icon: Bell           },
];

// ── Main export ────────────────────────────────────────────────────────────────
export default function UserDashboard({ onBack }) {
  const handleBack = onBack || (() => { window.location.href = '/'; });
  const [activeSection, setActiveSection] = useState('overview');

  const sectionMap = {
    overview:      <OverviewSection />,
    lease:         <LeaseSection />,
    payments:      <PaymentsSection />,
    maintenance:   <MaintenanceSection />,
    addons:        <AddOnsSection />,
    documents:     <DocumentsSection />,
    notifications: <NotificationsSection />,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 240, backgroundColor: C.sidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Profile */}
        <div style={{ padding: '1.75rem 1.4rem 1.4rem', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, ${C.info})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', fontSize: '1.2rem', fontWeight: 800, color: '#0f1117' }}>
            {RESIDENT.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem' }}>{RESIDENT.name}</div>
          <div style={{ color: C.muted, fontSize: '0.78rem', marginTop: '0.1rem' }}>Unit #{RESIDENT.unit}</div>
          <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#14532d', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4ade80' }} />
            <span style={{ color: '#4ade80', fontSize: '0.7rem', fontWeight: 700 }}>Good Standing</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeSection === id;
            return (
              <button key={id} onClick={() => setActiveSection(id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.9rem', borderRadius: 10, cursor: 'pointer', border: 'none',
                backgroundColor: active ? C.accentGlow : 'transparent',
                color: active ? C.accent : C.muted,
                fontWeight: active ? 700 : 500, fontSize: '0.875rem', width: '100%', textAlign: 'left',
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
        <div style={{ padding: '1rem 0.75rem', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 0.9rem', borderRadius: 10, cursor: 'pointer', border: 'none', backgroundColor: 'transparent', color: C.muted, fontWeight: 500, fontSize: '0.875rem', width: '100%', textAlign: 'left' }}>
            <LogOut size={17} /> Back to Website
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 2.5rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              Welcome back, {RESIDENT.name.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: C.muted, fontSize: '0.875rem', margin: '0.3rem 0 0' }}>
              Monarch Pass Apartments · Resident Portal
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <div style={{ color: C.muted, fontSize: '0.75rem' }}>Fort Worth, TX</div>
            </div>
          </div>
        </div>

        {/* Active section */}
        <div className="animate-fade-in" key={activeSection}>
          {sectionMap[activeSection]}
        </div>
      </main>
    </div>
  );
}
