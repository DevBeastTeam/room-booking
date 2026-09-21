import React, { useState } from 'react';
import {
  Home, Users, FileText, Wrench, DollarSign, BarChart2, Settings,
  LogOut, CheckCircle, XCircle, Clock,
  Edit2, Trash2, Plus, X, Eye,
  Package, Layers, Car, Archive, Search,
  Building, UserCheck, AlertCircle, Mail,
  Headphones, BookOpen, Sliders, Save, RotateCcw, Check,
  Phone, Send, TrendingUp
} from 'lucide-react';
import {
  getSiteSettings,
  saveSiteSettings,
  resetSiteSettings,
  getLegalPages,
  saveLegalPages,
  getSupportInquiries,
  saveSupportInquiries,
  addSupportInquiry
} from '../services/siteDataService';

// ── Colour tokens ──────────────────────────────────────────────────────────────
const A = {
  bg:       '#0a0d14',
  sidebar:  '#0d1117',
  card:     '#111827',
  card2:    '#1a2234',
  border:   '#1f2d44',
  accent:   '#f59e0b',   // amber – admin feel
  accentLt: '#fbbf24',
  text:     '#e2e8f0',
  muted:    '#6b7fa3',
  success:  '#22c55e',
  danger:   '#ef4444',
  info:     '#3b82f6',
  warning:  '#f59e0b',
  purple:   '#a855f7',
  teal:     '#5ec4b6',
};

// ── Mock data ──────────────────────────────────────────────────────────────────
const FLOOR_PLANS_DATA = [
  { id: 'one-bedroom',   name: 'One Bedroom',   beds: 1, baths: 1, sqft: 614,  total: 40, occupied: 27, price12: 898,  price10: 950,  price6: 1020, deposit: 250 },
  { id: 'two-bedroom',   name: 'Two Bedroom',   beds: 2, baths: 1, sqft: 769,  total: 55, occupied: 35, price12: 909,  price10: 960,  price6: 1050, deposit: 250 },
  { id: 'three-bedroom', name: 'Three Bedroom', beds: 3, baths: 2, sqft: 920,  total: 30, occupied: 10, price12: 1023, price10: 1090, price6: 1180, deposit: 250 },
  { id: 'four-bedroom',  name: 'Four Bedroom',  beds: 4, baths: 2, sqft: 1077, total: 25, occupied: 8,  price12: 1209, price10: 1290, price6: 1390, deposit: 250 },
];

const UNITS_DATA = [
  { unit: '1002', plan: 'Three Bedroom', beds: 3, floor: 1, sqft: 920,  rent: 1023, status: 'available',   tenant: null,              moveIn: null          },
  { unit: '1006', plan: 'Three Bedroom', beds: 3, floor: 1, sqft: 920,  rent: 1045, status: 'available',   tenant: null,              moveIn: null          },
  { unit: '2104', plan: 'Two Bedroom',   beds: 2, floor: 2, sqft: 769,  rent: 909,  status: 'occupied',    tenant: 'Sarah Johnson',    moveIn: '2025-02-01'  },
  { unit: '2108', plan: 'Two Bedroom',   beds: 2, floor: 2, sqft: 769,  rent: 925,  status: 'occupied',    tenant: 'Marcus Williams',  moveIn: '2025-04-01'  },
  { unit: '2115', plan: 'Two Bedroom',   beds: 2, floor: 2, sqft: 769,  rent: 909,  status: 'maintenance', tenant: null,              moveIn: null          },
  { unit: '3505', plan: 'One Bedroom',   beds: 1, floor: 3, sqft: 614,  rent: 898,  status: 'available',   tenant: null,              moveIn: null          },
  { unit: '3508', plan: 'One Bedroom',   beds: 1, floor: 3, sqft: 614,  rent: 908,  status: 'occupied',    tenant: 'Priya Sharma',     moveIn: '2025-06-01'  },
  { unit: '3512', plan: 'One Bedroom',   beds: 1, floor: 3, sqft: 614,  rent: 918,  status: 'available',   tenant: null,              moveIn: null          },
  { unit: '3520', plan: 'One Bedroom',   beds: 1, floor: 3, sqft: 614,  rent: 898,  status: 'occupied',    tenant: 'James Okafor',     moveIn: '2025-03-15'  },
  { unit: '4101', plan: 'Four Bedroom',  beds: 4, floor: 4, sqft: 1077, rent: 1209, status: 'occupied',    tenant: 'Chen Family',      moveIn: '2025-01-01'  },
  { unit: '4105', plan: 'Four Bedroom',  beds: 4, floor: 4, sqft: 1077, rent: 1240, status: 'available',   tenant: null,              moveIn: null          },
];

const APPLICATIONS_DATA = [
  { id: 'APP-001', name: 'David Martinez',    plan: 'Two Bedroom',   unit: '2115', date: 'Sep 15, 2026', income: '$4,800/mo', credit: 720, status: 'pending'  },
  { id: 'APP-002', name: 'Emily Chen',        plan: 'One Bedroom',   unit: '3505', date: 'Sep 16, 2026', income: '$3,200/mo', credit: 695, status: 'pending'  },
  { id: 'APP-003', name: 'Robert Thompson',   plan: 'Three Bedroom', unit: '1002', date: 'Sep 10, 2026', income: '$6,100/mo', credit: 760, status: 'approved' },
  { id: 'APP-004', name: 'Fatima Al-Hassan',  plan: 'One Bedroom',   unit: '3512', date: 'Sep 8, 2026',  income: '$2,900/mo', credit: 620, status: 'rejected' },
  { id: 'APP-005', name: 'Kevin Nguyen',      plan: 'Four Bedroom',  unit: '4105', date: 'Sep 18, 2026', income: '$7,200/mo', credit: 780, status: 'pending'  },
];

const RESIDENTS_DATA = [
  { name: 'Sarah Johnson',   unit: '2104', plan: 'Two Bedroom',   moveIn: '2025-02-01', leaseEnd: '2026-02-01', rent: 967,  status: 'current' },
  { name: 'Marcus Williams', unit: '2108', plan: 'Two Bedroom',   moveIn: '2025-04-01', leaseEnd: '2026-04-01', rent: 983,  status: 'current' },
  { name: 'Priya Sharma',    unit: '3508', plan: 'One Bedroom',   moveIn: '2025-06-01', leaseEnd: '2026-06-01', rent: 966,  status: 'current' },
  { name: 'James Okafor',    unit: '3520', plan: 'One Bedroom',   moveIn: '2025-03-15', leaseEnd: '2026-03-15', rent: 956,  status: 'notice'  },
  { name: 'Chen Family',     unit: '4101', plan: 'Four Bedroom',  moveIn: '2025-01-01', leaseEnd: '2026-01-01', rent: 1267, status: 'current' },
];

const MAINTENANCE_DATA = [
  { id: 'MR-001', unit: '2104', tenant: 'Sarah Johnson',   title: 'AC not cooling properly',       cat: 'HVAC',       priority: 'High',   status: 'in-progress', date: 'Sep 15' },
  { id: 'MR-002', unit: '2104', tenant: 'Sarah Johnson',   title: 'Kitchen faucet dripping',       cat: 'Plumbing',   priority: 'Medium', status: 'completed',   date: 'Aug 28' },
  { id: 'MR-003', unit: '2104', tenant: 'Sarah Johnson',   title: 'Bathroom light flickering',     cat: 'Electrical', priority: 'Low',    status: 'pending',     date: 'Sep 18' },
  { id: 'MR-004', unit: '2108', tenant: 'Marcus Williams', title: 'Dishwasher not draining',       cat: 'Appliance',  priority: 'Medium', status: 'pending',     date: 'Sep 17' },
  { id: 'MR-005', unit: '3508', tenant: 'Priya Sharma',    title: 'Parking lot light out',         cat: 'Exterior',   priority: 'Low',    status: 'completed',   date: 'Sep 10' },
  { id: 'MR-006', unit: '2115', tenant: 'Maintenance',     title: 'Unit turnover — deep clean',    cat: 'Turnover',   priority: 'High',   status: 'in-progress', date: 'Sep 19' },
];

const REVENUE_MONTHLY = [
  { month: 'Apr', revenue: 43200 },
  { month: 'May', revenue: 44800 },
  { month: 'Jun', revenue: 46100 },
  { month: 'Jul', revenue: 45700 },
  { month: 'Aug', revenue: 47200 },
  { month: 'Sep', revenue: 48900 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    available:    { bg: '#134e4a', color: '#2dd4bf', label: 'Available'    },
    occupied:     { bg: '#1e3a5f', color: '#60a5fa', label: 'Occupied'     },
    maintenance:  { bg: '#78350f', color: '#fbbf24', label: 'Maintenance'  },
    pending:      { bg: '#78350f', color: '#fbbf24', label: 'Pending'      },
    approved:     { bg: '#14532d', color: '#4ade80', label: 'Approved'     },
    rejected:     { bg: '#7f1d1d', color: '#f87171', label: 'Rejected'     },
    current:      { bg: '#14532d', color: '#4ade80', label: 'Current'      },
    notice:       { bg: '#78350f', color: '#fbbf24', label: 'Notice Given' },
    'in-progress':{ bg: '#1e3a5f', color: '#60a5fa', label: 'In Progress'  },
    completed:    { bg: '#14532d', color: '#4ade80', label: 'Completed'    },
  };
  const s = map[status] || { bg: '#1e293b', color: '#94a3b8', label: status };
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: A.card2, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: A.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: A.text, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: A.muted, marginTop: '0.25rem' }}>{sub}</div>}
      </div>
    </div>
  );
}

function THead({ cols }) {
  return (
    <thead>
      <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
        {cols.map(c => (
          <th key={c} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: A.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${A.border}` }}>{c}</th>
        ))}
      </tr>
    </thead>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: 4, height: 22, backgroundColor: A.accent, borderRadius: 4 }} />
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: A.text, margin: 0 }}>{children}</h2>
    </div>
  );
}

// ── Overview Section ───────────────────────────────────────────────────────────
function OverviewSection() {
  const totalUnits = UNITS_DATA.length;
  const occupied = UNITS_DATA.filter(u => u.status === 'occupied').length;
  const available = UNITS_DATA.filter(u => u.status === 'available').length;
  const pending = APPLICATIONS_DATA.filter(a => a.status === 'pending').length;
  const monthRevenue = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 1].revenue;
  const maxRev = Math.max(...REVENUE_MONTHLY.map(r => r.revenue));

  return (
    <div>
      <SectionTitle>Dashboard Overview</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={Building}   label="Total Units"     value={totalUnits}          sub="All floor plans"          color={A.teal}    />
        <StatCard icon={UserCheck}  label="Occupancy"       value={`${Math.round((occupied/totalUnits)*100)}%`} sub={`${occupied}/${totalUnits} units`} color={A.success} />
        <StatCard icon={Home}       label="Available"       value={available}           sub="Ready to rent"            color={A.info}    />
        <StatCard icon={FileText}   label="Pending Apps"    value={pending}             sub="Awaiting review"          color={A.warning} />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${monthRevenue.toLocaleString()}`} sub="September 2026" color={A.purple} />
        <StatCard icon={Wrench}      label="Open Tickets"    value={MAINTENANCE_DATA.filter(m => m.status !== 'completed').length} sub="Maintenance requests" color={A.danger} />
      </div>

      {/* Revenue Chart */}
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ color: A.text, fontWeight: 700 }}>Monthly Revenue (Last 6 Months)</div>
          <div style={{ color: A.success, fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={14} /> +3.6% vs last month
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 140 }}>
          {REVENUE_MONTHLY.map((r, i) => {
            const pct = (r.revenue / maxRev) * 100;
            const isLast = i === REVENUE_MONTHLY.length - 1;
            return (
              <div key={r.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: isLast ? A.accent : A.muted, fontWeight: 700 }}>${(r.revenue / 1000).toFixed(1)}k</div>
                <div style={{ width: '100%', height: `${pct}%`, background: isLast ? `linear-gradient(180deg, ${A.accent}, ${A.accentLt})` : `linear-gradient(180deg, #253048, #1f2d44)`, borderRadius: '6px 6px 0 0', minHeight: 8, border: isLast ? `1px solid ${A.accent}44` : 'none', transition: 'height 0.5s ease' }} />
                <div style={{ fontSize: '0.72rem', color: isLast ? A.accent : A.muted, fontWeight: isLast ? 700 : 400 }}>{r.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Occupancy by plan */}
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: '1.5rem' }}>
        <div style={{ color: A.text, fontWeight: 700, marginBottom: '1.25rem' }}>Occupancy by Floor Plan</div>
        {FLOOR_PLANS_DATA.map(fp => {
          const pct = Math.round((fp.occupied / fp.total) * 100);
          return (
            <div key={fp.id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: A.text, fontSize: '0.85rem', fontWeight: 600 }}>{fp.name}</span>
                <span style={{ color: pct > 80 ? A.success : pct > 50 ? A.warning : A.danger, fontSize: '0.82rem', fontWeight: 700 }}>{pct}% ({fp.occupied}/{fp.total})</span>
              </div>
              <div style={{ height: 8, backgroundColor: A.border, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? `linear-gradient(90deg, ${A.success}, #16a34a)` : pct > 50 ? `linear-gradient(90deg, ${A.warning}, #d97706)` : `linear-gradient(90deg, ${A.danger}, #dc2626)`, borderRadius: 8 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Floor Plans Management ─────────────────────────────────────────────────────
function FloorPlansSection() {
  const [plans, setPlans] = useState(FLOOR_PLANS_DATA);
  const [editingId, setEditingId] = useState(null);
  const [editVals, setEditVals] = useState({});

  const startEdit = (fp) => { setEditingId(fp.id); setEditVals({ price12: fp.price12, price10: fp.price10, price6: fp.price6, deposit: fp.deposit }); };
  const saveEdit = (id) => { setPlans(prev => prev.map(p => p.id === id ? { ...p, ...editVals } : p)); setEditingId(null); };

  return (
    <div>
      <SectionTitle>Floor Plans Management</SectionTitle>
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['Plan', 'Bed/Bath', 'Sq Ft', '12-mo Rent', '10-mo Rent', '6-mo Rent', 'Deposit', 'Available', 'Actions']} />
          <tbody>
            {plans.map((fp) => {
              const avail = fp.total - fp.occupied;
              const isEditing = editingId === fp.id;
              return (
                <tr key={fp.id} style={{ borderBottom: `1px solid ${A.border}` }}>
                  <td style={{ padding: '0.85rem 1rem', color: A.text, fontWeight: 600, fontSize: '0.87rem' }}>{fp.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.83rem' }}>{fp.beds}bd/{fp.baths}ba</td>
                  <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.83rem' }}>{fp.sqft}</td>
                  {['price12', 'price10', 'price6', 'deposit'].map(key => (
                    <td key={key} style={{ padding: '0.85rem 1rem' }}>
                      {isEditing
                        ? <input type="number" value={editVals[key]} onChange={e => setEditVals(v => ({ ...v, [key]: Number(e.target.value) }))}
                            style={{ width: 80, padding: '0.3rem 0.5rem', backgroundColor: A.bg, border: `1px solid ${A.accent}`, borderRadius: 6, color: A.text, fontSize: '0.82rem' }} />
                        : <span style={{ color: A.accent, fontWeight: 700 }}>${fp[key]}</span>}
                    </td>
                  ))}
                  <td style={{ padding: '0.85rem 1rem' }}><Badge status={avail > 0 ? 'available' : 'occupied'} /></td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {isEditing
                      ? <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => saveEdit(fp.id)} style={{ padding: '0.3rem 0.7rem', backgroundColor: A.success, color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', border: 'none' }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={{ padding: '0.3rem 0.6rem', backgroundColor: A.card2, color: A.muted, borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer', border: `1px solid ${A.border}` }}>Cancel</button>
                        </div>
                      : <button onClick={() => startEdit(fp)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', backgroundColor: `${A.accent}22`, color: A.accent, borderRadius: 6, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', border: `1px solid ${A.accent}44` }}>
                          <Edit2 size={12} /> Edit
                        </button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Units Management ───────────────────────────────────────────────────────────
function UnitsSection() {
  const [units, setUnits] = useState(UNITS_DATA);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = units.filter(u => {
    if (filter !== 'all' && u.status !== filter) return false;
    if (search && !u.unit.toLowerCase().includes(search.toLowerCase()) && !u.plan.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const changeStatus = (unit, newStatus) => setUnits(prev => prev.map(u => u.unit === unit ? { ...u, status: newStatus } : u));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 4, height: 22, backgroundColor: A.accent, borderRadius: 4 }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: A.text, margin: 0 }}>Units Management</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: A.muted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search unit..." style={{ paddingLeft: 32, padding: '0.5rem 0.8rem 0.5rem 32px', backgroundColor: A.card2, border: `1px solid ${A.border}`, borderRadius: 8, color: A.text, fontSize: '0.82rem', width: 160 }} />
          </div>
          {['all', 'available', 'occupied', 'maintenance'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.45rem 0.9rem', borderRadius: 7, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', border: `1px solid ${filter === s ? A.accent : A.border}`, backgroundColor: filter === s ? `${A.accent}22` : 'transparent', color: filter === s ? A.accent : A.muted, textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['Unit', 'Floor Plan', 'Floor', 'Sq Ft', 'Rent', 'Tenant', 'Move-in', 'Status', 'Action']} />
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.unit} style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '0.8rem 1rem', color: A.text, fontWeight: 700, fontSize: '0.87rem' }}>#{u.unit}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.82rem' }}>{u.plan}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.82rem' }}>Floor {u.floor}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.82rem' }}>{u.sqft}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.accent, fontWeight: 700, fontSize: '0.87rem' }}>${u.rent}/mo</td>
                <td style={{ padding: '0.8rem 1rem', color: u.tenant ? A.text : A.muted, fontSize: '0.82rem' }}>{u.tenant || '—'}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.78rem' }}>{u.moveIn || '—'}</td>
                <td style={{ padding: '0.8rem 1rem' }}><Badge status={u.status} /></td>
                <td style={{ padding: '0.8rem 1rem' }}>
                  <select value={u.status} onChange={e => changeStatus(u.unit, e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', backgroundColor: A.card2, border: `1px solid ${A.border}`, borderRadius: 6, color: A.text, fontSize: '0.75rem', cursor: 'pointer' }}>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Applications Section ───────────────────────────────────────────────────────
function ApplicationsSection() {
  const [apps, setApps] = useState(APPLICATIONS_DATA);
  const updateStatus = (id, status) => setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const pending = apps.filter(a => a.status === 'pending');
  const reviewed = apps.filter(a => a.status !== 'pending');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 4, height: 22, backgroundColor: A.accent, borderRadius: 4 }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: A.text, margin: 0 }}>Applications</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ padding: '0.3rem 0.75rem', backgroundColor: '#78350f', color: '#fbbf24', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{pending.length} Pending</span>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <>
          <div style={{ color: A.warning, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠ Requires Action</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {pending.map(app => (
              <div key={app.id} style={{ background: A.card, border: `1px solid ${A.warning}33`, borderRadius: 14, padding: '1.1rem 1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: A.muted, fontSize: '0.72rem', fontWeight: 700 }}>{app.id}</span>
                      <span style={{ color: A.muted, fontSize: '0.78rem' }}>{app.date}</span>
                    </div>
                    <div style={{ color: A.text, fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{app.name}</div>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: A.muted, fontSize: '0.8rem' }}>Plan: <span style={{ color: A.text }}>{app.plan}</span></span>
                      <span style={{ color: A.muted, fontSize: '0.8rem' }}>Unit: <span style={{ color: A.text }}>#{app.unit}</span></span>
                      <span style={{ color: A.muted, fontSize: '0.8rem' }}>Income: <span style={{ color: A.success }}>{app.income}</span></span>
                      <span style={{ color: A.muted, fontSize: '0.8rem' }}>Credit: <span style={{ color: app.credit >= 700 ? A.success : app.credit >= 650 ? A.warning : A.danger }}>{app.credit}</span></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button onClick={() => updateStatus(app.id, 'approved')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', backgroundColor: A.success, color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => updateStatus(app.id, 'rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', backgroundColor: A.danger, color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', border: 'none' }}>
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reviewed */}
      <div style={{ color: A.muted, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reviewed</div>
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['ID', 'Applicant', 'Plan', 'Unit', 'Date', 'Income', 'Credit', 'Status']} />
          <tbody>
            {reviewed.map((app, i) => (
              <tr key={app.id} style={{ borderBottom: `1px solid ${A.border}` }}>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.75rem' }}>{app.id}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.text, fontWeight: 600, fontSize: '0.85rem' }}>{app.name}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.8rem' }}>{app.plan}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.8rem' }}>#{app.unit}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.muted, fontSize: '0.8rem' }}>{app.date}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.success, fontSize: '0.82rem', fontWeight: 600 }}>{app.income}</td>
                <td style={{ padding: '0.8rem 1rem', color: A.text, fontSize: '0.82rem' }}>{app.credit}</td>
                <td style={{ padding: '0.8rem 1rem' }}><Badge status={app.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Residents Section ──────────────────────────────────────────────────────────
function ResidentsSection() {
  return (
    <div>
      <SectionTitle>Current Residents</SectionTitle>
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['Name', 'Unit', 'Floor Plan', 'Move-in', 'Lease End', 'Rent', 'Status']} />
          <tbody>
            {RESIDENTS_DATA.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${A.border}`, backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '0.85rem 1rem', color: A.text, fontWeight: 600, fontSize: '0.87rem' }}>{r.name}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.accent, fontWeight: 700, fontSize: '0.87rem' }}>#{r.unit}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.82rem' }}>{r.plan}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.78rem' }}>{r.moveIn}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.78rem' }}>{r.leaseEnd}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.success, fontWeight: 700, fontSize: '0.87rem' }}>${r.rent}/mo</td>
                <td style={{ padding: '0.85rem 1rem' }}><Badge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Maintenance Section ────────────────────────────────────────────────────────
function AdminMaintenanceSection() {
  const [tickets, setTickets] = useState(MAINTENANCE_DATA);
  const updateStatus = (id, status) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const priorityColor = { High: A.danger, Medium: A.warning, Low: A.success };

  return (
    <div>
      <SectionTitle>Maintenance Requests</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tickets.map(t => (
          <div key={t.id} style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1rem 1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: A.muted, fontSize: '0.72rem', fontWeight: 700 }}>{t.id}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: priorityColor[t.priority] }} />
                  <span style={{ color: priorityColor[t.priority], fontSize: '0.7rem', fontWeight: 700 }}>{t.priority}</span>
                </div>
                <div style={{ color: A.text, fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{t.title}</div>
                <div style={{ color: A.muted, fontSize: '0.78rem' }}>Unit #{t.unit} · {t.tenant} · {t.cat} · {t.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Badge status={t.status} />
              <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                style={{ padding: '0.35rem 0.55rem', backgroundColor: A.card2, border: `1px solid ${A.border}`, borderRadius: 7, color: A.text, fontSize: '0.75rem', cursor: 'pointer' }}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Add-ons Management ─────────────────────────────────────────────────────────
function AddOnsManagementSection() {
  const [addons, setAddons] = useState([
    { id: 'carport',  name: 'Reserved Covered Carport', price: 35, active: 55, icon: Car     },
    { id: 'storage',  name: 'Extra Storage Locker',     price: 45, active: 30, icon: Archive },
    { id: 'washer',   name: 'In-Unit Washer & Dryer',   price: 40, active: 42, icon: Layers  },
  ]);
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <SectionTitle>Add-ons & Amenities Management</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {addons.map(a => (
          <div key={a.id} style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: `${A.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={20} color={A.accent} />
              </div>
              <div>
                <div style={{ color: A.text, fontWeight: 700, fontSize: '0.9rem' }}>{a.name}</div>
                <div style={{ color: A.muted, fontSize: '0.78rem' }}>{a.active} active subscriptions</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {editing === a.id
                ? <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: A.muted, fontSize: '0.82rem' }}>$</span>
                    <input type="number" defaultValue={a.price} id={`price-${a.id}`}
                      style={{ width: 70, padding: '0.4rem 0.5rem', backgroundColor: A.bg, border: `1px solid ${A.accent}`, borderRadius: 7, color: A.text, fontSize: '0.87rem' }} />
                    <span style={{ color: A.muted, fontSize: '0.78rem' }}>/mo</span>
                    <button onClick={() => { const v = Number(document.getElementById(`price-${a.id}`).value); setAddons(prev => prev.map(x => x.id === a.id ? { ...x, price: v } : x)); setEditing(null); }}
                      style={{ padding: '0.35rem 0.7rem', backgroundColor: A.success, color: '#fff', borderRadius: 7, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', border: 'none' }}>Save</button>
                  </div>
                : <div style={{ fontSize: '1.3rem', fontWeight: 800, color: A.accent }}>${a.price}<span style={{ fontSize: '0.78rem', fontWeight: 400, color: A.muted }}>/mo</span></div>
              }
              {editing !== a.id && (
                <button onClick={() => setEditing(a.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', backgroundColor: `${A.accent}22`, color: A.accent, borderRadius: 7, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', border: `1px solid ${A.accent}44` }}>
                  <Edit2 size={13} /> Edit Price
                </button>
              )}
            </div>
            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: `1px solid ${A.border}`, color: A.success, fontSize: '0.82rem', fontWeight: 600 }}>
              Monthly Revenue: ${(a.price * a.active).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Email Logs Section ─────────────────────────────────────────────────────────
function EmailLogsSection() {
  const logs = [
    { to: 'sarah.johnson@email.com', plan: 'Two Bedroom', unit: '#2104', total: '$967/mo', date: 'Sep 18, 2026 2:34 PM'  },
    { to: 'david.m@gmail.com',       plan: 'Two Bedroom', unit: 'TBD',   total: '$983/mo', date: 'Sep 17, 2026 5:12 PM'  },
    { to: 'emily.chen@yahoo.com',    plan: 'One Bedroom', unit: '#3505', total: '$956/mo', date: 'Sep 16, 2026 10:08 AM' },
    { to: 'k.nguyen@email.com',      plan: 'Four Bedroom', unit: 'TBD',  total: '$1,267/mo', date: 'Sep 16, 2026 1:44 PM' },
    { to: 'r.thompson@gmail.com',    plan: 'Three Bedroom', unit: '#1002', total: '$1,081/mo', date: 'Sep 15, 2026 9:21 AM' },
  ];
  return (
    <div>
      <SectionTitle>Email Logs — Cost Estimate Emails</SectionTitle>
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <THead cols={['Recipient', 'Floor Plan', 'Unit', 'Total Estimate', 'Sent At']} />
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${A.border}` }}>
                <td style={{ padding: '0.85rem 1rem', color: A.info, fontSize: '0.83rem', fontWeight: 500 }}>{l.to}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.text, fontSize: '0.83rem' }}>{l.plan}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.83rem' }}>{l.unit}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.accent, fontWeight: 700, fontSize: '0.85rem' }}>{l.total}</td>
                <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.78rem' }}>{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Contact Support Section ────────────────────────────────────────────────────
function ContactSupportSection({ supportInquiries = [], setSupportInquiries }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replySentToast, setReplySentToast] = useState(false);

  const inquiries = supportInquiries || [];

  const filtered = inquiries.filter((item) => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'in-progress').length;
  const resolvedCount = inquiries.filter((i) => i.status === 'resolved').length;

  const updateStatus = (id, newStatus) => {
    const updated = inquiries.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
    if (setSupportInquiries) setSupportInquiries(updated);
    saveSupportInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const saveNotes = (id) => {
    const updated = inquiries.map((i) => (i.id === id ? { ...i, notes: adminNote } : i));
    if (setSupportInquiries) setSupportInquiries(updated);
    saveSupportInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => ({ ...prev, notes: adminNote }));
    }
  };

  const deleteInquiry = (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    const updated = inquiries.filter((i) => i.id !== id);
    if (setSupportInquiries) setSupportInquiries(updated);
    saveSupportInquiries(updated);
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  };

  const simulateInquiry = () => {
    const sampleNames = ['Jessica Miller', 'David Ross', 'Sofia Hernandez', 'Tyler Bennett'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const newInquiry = addSupportInquiry({
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+1 817-555-0941',
      category: 'Tour Request',
      subject: 'Inquiry regarding 2-bedroom move-in special',
      message: 'Hello! I noticed the move-in specials on the website. Can you tell me if the $500 off first month promotion is still available for November?',
    });
    if (newInquiry && setSupportInquiries) {
      const updated = [newInquiry, ...inquiries];
      setSupportInquiries(updated);
    }
  };

  const handleSendSimulatedReply = () => {
    if (!replyText.trim()) return;
    const notesCombined = `${selectedInquiry.notes ? selectedInquiry.notes + '\n' : ''}[Reply sent on ${new Date().toLocaleDateString()}]: ${replyText.trim()}`;
    const updated = inquiries.map((i) => (i.id === selectedInquiry.id ? { ...i, status: 'resolved', notes: notesCombined } : i));
    if (setSupportInquiries) setSupportInquiries(updated);
    saveSupportInquiries(updated);
    setSelectedInquiry((prev) => ({ ...prev, status: 'resolved', notes: notesCombined }));
    setReplyText('');
    setReplySentToast(true);
    setTimeout(() => setReplySentToast(false), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <SectionTitle>Contact & Support Inquiries</SectionTitle>
        <button
          onClick={simulateInquiry}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            backgroundColor: `${A.accent}22`,
            color: A.accentLt,
            border: `1px solid ${A.accent}55`,
            borderRadius: 8,
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Simulate Incoming Inquiry
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon={Inbox} label="Total Inquiries" value={totalCount} color={A.info} />
        <StatCard icon={AlertCircle} label="New / Action Required" value={newCount} sub="Needs response" color={A.warning} />
        <StatCard icon={Clock} label="In Progress" value={inProgressCount} color={A.teal} />
        <StatCard icon={CheckCircle} label="Resolved" value={resolvedCount} color={A.success} />
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'new', label: `New (${newCount})` },
            { id: 'in-progress', label: `In Progress (${inProgressCount})` },
            { id: 'resolved', label: `Resolved (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                border: 'none',
                backgroundColor: filter === tab.id ? A.accent : A.card2,
                color: filter === tab.id ? '#0a0d14' : A.muted,
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: A.muted }} />
          <input
            type="text"
            placeholder="Search inquiries or sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2rem',
              backgroundColor: A.card2,
              border: `1px solid ${A.border}`,
              borderRadius: 8,
              color: A.text,
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div style={{ background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: A.muted, fontSize: '0.9rem' }}>
            No support inquiries found matching criteria.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <THead cols={['ID', 'Sender', 'Category & Subject', 'Received At', 'Status', 'Actions']} />
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${A.border}`, transition: 'background 0.15s' }}>
                  <td style={{ padding: '0.85rem 1rem', color: A.accent, fontWeight: 700, fontSize: '0.8rem' }}>
                    {item.id}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ color: A.text, fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ color: A.muted, fontSize: '0.75rem' }}>{item.email} · {item.phone}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', maxWidth: '320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 4, backgroundColor: `${A.teal}22`, color: A.teal, fontWeight: 700 }}>
                        {item.category}
                      </span>
                    </div>
                    <div style={{ color: A.text, fontWeight: 600, fontSize: '0.82rem' }}>{item.subject}</div>
                    <div style={{ color: A.muted, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.message}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: A.muted, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {item.date}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <Badge status={item.status} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setSelectedInquiry(item);
                          setAdminNote(item.notes || '');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.65rem',
                          backgroundColor: `${A.info}22`,
                          color: A.info,
                          border: `1px solid ${A.info}44`,
                          borderRadius: 6,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={13} /> View
                      </button>

                      {item.status !== 'resolved' ? (
                        <button
                          onClick={() => updateStatus(item.id, 'resolved')}
                          title="Mark Resolved"
                          style={{
                            padding: '0.35rem 0.55rem',
                            backgroundColor: `${A.success}22`,
                            color: A.success,
                            border: `1px solid ${A.success}44`,
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          <Check size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(item.id, 'in-progress')}
                          title="Reopen"
                          style={{
                            padding: '0.35rem 0.55rem',
                            backgroundColor: `${A.warning}22`,
                            color: A.warning,
                            border: `1px solid ${A.warning}44`,
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteInquiry(item.id)}
                        title="Delete inquiry"
                        style={{
                          padding: '0.35rem 0.55rem',
                          backgroundColor: `${A.danger}22`,
                          color: A.danger,
                          border: `1px solid ${A.danger}44`,
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInquiry(null);
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: A.card,
              border: `1px solid ${A.border}`,
              borderRadius: 16,
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: `1px solid ${A.border}`, paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ color: A.accent, fontWeight: 800, fontSize: '1rem' }}>{selectedInquiry.id}</span>
                <Badge status={selectedInquiry.status} />
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', color: A.muted, cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Sender details */}
            <div style={{ backgroundColor: A.card2, padding: '1rem', borderRadius: 10, marginBottom: '1.25rem', border: `1px solid ${A.border}` }}>
              <div style={{ color: A.text, fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                {selectedInquiry.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: A.muted }}>
                <div>Email: <a href={`mailto:${selectedInquiry.email}`} style={{ color: A.info }}>{selectedInquiry.email}</a></div>
                <div>Phone: <a href={`tel:${selectedInquiry.phone}`} style={{ color: A.teal }}>{selectedInquiry.phone}</a></div>
                <div>Date: {selectedInquiry.date}</div>
              </div>
            </div>

            {/* Message Body */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: A.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 700 }}>
                Subject: {selectedInquiry.subject}
              </div>
              <div style={{ backgroundColor: A.bg, border: `1px solid ${A.border}`, borderRadius: 10, padding: '1rem', color: A.text, fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Change row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ color: A.muted, fontSize: '0.82rem', fontWeight: 600 }}>Update Status:</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['new', 'in-progress', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(selectedInquiry.id, st)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: selectedInquiry.status === st ? A.accent : A.card2,
                      color: selectedInquiry.status === st ? '#0a0d14' : A.muted,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {st.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reply Form */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: A.text, fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Send size={13} color={A.accent} /> Quick Reply to Resident / Visitor
              </div>
              <textarea
                rows={3}
                placeholder={`Type message to send to ${selectedInquiry.email}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  onClick={handleSendSimulatedReply}
                  style={{
                    padding: '0.45rem 1rem',
                    backgroundColor: A.accent,
                    color: '#0a0d14',
                    border: 'none',
                    borderRadius: 7,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Send size={13} /> Send Reply & Resolve
                </button>
              </div>
              {replySentToast && (
                <div style={{ marginTop: '0.5rem', color: A.success, fontSize: '0.8rem', fontWeight: 600 }}>
                  ✓ Response sent to {selectedInquiry.email} and recorded in notes!
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: A.muted, fontWeight: 700, marginBottom: '0.4rem' }}>
                Internal Admin Notes / Activity Log:
              </div>
              <textarea
                rows={2}
                placeholder="Add private staff notes..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => saveNotes(selectedInquiry.id)}
                style={{
                  marginTop: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  backgroundColor: A.card2,
                  color: A.text,
                  border: `1px solid ${A.border}`,
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Save Notes
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{
                  padding: '0.5rem 1.2rem',
                  backgroundColor: A.card2,
                  color: A.text,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pages Management Section ───────────────────────────────────────────────────
function PagesManagementSection({ legalPages, setLegalPages }) {
  const [activeTab, setActiveTab] = useState('terms');
  const [currentPages, setCurrentPages] = useState(() => legalPages || getLegalPages());
  const [saveToast, setSaveToast] = useState(false);

  const activePage = currentPages[activeTab];

  const handleFieldChange = (field, val) => {
    setCurrentPages((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: val,
      },
    }));
  };

  const handleSave = () => {
    saveLegalPages(currentPages);
    if (setLegalPages) setLegalPages(currentPages);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleReset = () => {
    if (!window.confirm('Reset this page back to original defaults?')) return;
    const defaults = getLegalPages();
    const updated = {
      ...currentPages,
      [activeTab]: defaults[activeTab],
    };
    setCurrentPages(updated);
    saveLegalPages(updated);
    if (setLegalPages) setLegalPages(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <SectionTitle>Website Pages & Legal Content</SectionTitle>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 0.9rem',
              backgroundColor: A.card2,
              color: A.muted,
              border: `1px solid ${A.border}`,
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: A.accent,
              color: '#0a0d14',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: `0 4px 12px ${A.accent}44`,
            }}
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      {saveToast && (
        <div
          className="animate-fade-in"
          style={{
            backgroundColor: `${A.success}22`,
            border: `1px solid ${A.success}66`,
            color: A.success,
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={16} />
          <span>Page content successfully saved and published!</span>
        </div>
      )}

      {/* Page Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: `1px solid ${A.border}`, paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('terms')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 8,
            border: 'none',
            backgroundColor: activeTab === 'terms' ? `${A.accent}22` : 'transparent',
            color: activeTab === 'terms' ? A.accent : A.muted,
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FileText size={16} /> Terms & Conditions
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 8,
            border: 'none',
            backgroundColor: activeTab === 'privacy' ? `${A.accent}22` : 'transparent',
            color: activeTab === 'privacy' ? A.accent : A.muted,
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <BookOpen size={16} /> Privacy Policy
        </button>
      </div>

      {/* Editor & Preview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        {/* Left: Content Editor */}
        <div style={{ backgroundColor: A.card, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Page Title
            </label>
            <input
              type="text"
              value={activePage.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                backgroundColor: A.bg,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                color: A.text,
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Last Updated Label
            </label>
            <input
              type="text"
              value={activePage.lastUpdated}
              onChange={(e) => handleFieldChange('lastUpdated', e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                backgroundColor: A.bg,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                color: A.text,
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Page Body Content
            </label>
            <textarea
              rows={14}
              value={activePage.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              style={{
                width: '100%',
                flex: 1,
                padding: '0.75rem',
                backgroundColor: A.bg,
                border: `1px solid ${A.border}`,
                borderRadius: 8,
                color: A.text,
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Right: Live Public Preview */}
        <div style={{ backgroundColor: A.card, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: `1px solid ${A.border}`, paddingBottom: '0.6rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: A.muted, textTransform: 'uppercase' }}>
              Live Public Preview
            </div>
            <div style={{ fontSize: '0.72rem', color: A.teal, fontWeight: 700, padding: '0.15rem 0.5rem', backgroundColor: `${A.teal}22`, borderRadius: 4 }}>
              Preview Mode
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: '1.5rem',
              color: '#1e293b',
              flex: 1,
              overflowY: 'auto',
              maxHeight: '520px',
              border: '1px solid #cbd5e1',
            }}
          >
            <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              {activePage.title}
            </h3>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              Last updated: {activePage.lastUpdated}
            </div>
            <div style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>
              {activePage.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Site Settings Section ──────────────────────────────────────────────────────
function SiteSettingsSection({ siteSettings, setSiteSettings }) {
  const [formData, setFormData] = useState(() => siteSettings || getSiteSettings());
  const [saveToast, setSaveToast] = useState(false);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNestedChange = (parent, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: val,
      },
    }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveSiteSettings(formData);
    if (setSiteSettings) setSiteSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Restore all site settings and contact numbers to factory defaults?')) return;
    const defs = resetSiteSettings();
    setFormData(defs);
    if (setSiteSettings) setSiteSettings(defs);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <SectionTitle>Website Branding & Contact Settings</SectionTitle>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={handleResetDefaults}
            style={{
              padding: '0.5rem 0.9rem',
              backgroundColor: A.card2,
              color: A.muted,
              border: `1px solid ${A.border}`,
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <RotateCcw size={14} /> Restore Defaults
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: A.accent,
              color: '#0a0d14',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: `0 4px 12px ${A.accent}44`,
            }}
          >
            <Save size={14} /> Save All Settings
          </button>
        </div>
      </div>

      {saveToast && (
        <div
          className="animate-fade-in"
          style={{
            backgroundColor: `${A.success}22`,
            border: `1px solid ${A.success}66`,
            color: A.success,
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={16} />
          <span>Website settings successfully saved! Changes are now live across the Header, Footer, and Contact sections.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Card 1: Branding & Identity */}
        <div style={{ backgroundColor: A.card, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: A.text, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={16} color={A.accent} /> Property Branding & Identity
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Website / Property Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Hero Tagline / Banner Title
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Website Logo Image URL
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.8rem',
                    backgroundColor: A.bg,
                    border: `1px solid ${A.border}`,
                    borderRadius: 8,
                    color: A.text,
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {/* Logo Preview */}
                <div style={{ backgroundColor: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '120px', height: '36px' }}>
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo preview" style={{ maxHeight: '28px', maxWidth: '100%' }} />
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No logo preview</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact Details & Location */}
        <div style={{ backgroundColor: A.card, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: A.text, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} color={A.teal} /> Contact Numbers, Email & Address
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Primary Phone Number (Header & Footer)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Secondary Contact Phone
              </label>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Leasing & General Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Support / Resident Services Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Full Property Address (Street, City, State, ZIP)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Footer Description & Management */}
        <div style={{ backgroundColor: A.card, border: `1px solid ${A.border}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: A.text, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} color={A.purple} /> Footer Information & Management
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Footer Description Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.footerDescription}
                onChange={(e) => handleChange('footerDescription', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  backgroundColor: A.bg,
                  border: `1px solid ${A.border}`,
                  borderRadius: 8,
                  color: A.text,
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Management Company Name
                </label>
                <input
                  type="text"
                  value={formData.managedBy}
                  onChange={(e) => handleChange('managedBy', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: A.bg,
                    border: `1px solid ${A.border}`,
                    borderRadius: 8,
                    color: A.text,
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Management Subtitle
                </label>
                <input
                  type="text"
                  value={formData.managedBySub}
                  onChange={(e) => handleChange('managedBySub', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: A.bg,
                    border: `1px solid ${A.border}`,
                    borderRadius: 8,
                    color: A.text,
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Office Hours */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: A.muted, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Leasing Office Hours
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: A.muted }}>Monday - Friday:</span>
                  <input
                    type="text"
                    value={formData.officeHours?.monFri || ''}
                    onChange={(e) => handleNestedChange('officeHours', 'monFri', e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      padding: '0.55rem 0.75rem',
                      backgroundColor: A.bg,
                      border: `1px solid ${A.border}`,
                      borderRadius: 8,
                      color: A.text,
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: A.muted }}>Saturday:</span>
                  <input
                    type="text"
                    value={formData.officeHours?.sat || ''}
                    onChange={(e) => handleNestedChange('officeHours', 'sat', e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      padding: '0.55rem 0.75rem',
                      backgroundColor: A.bg,
                      border: `1px solid ${A.border}`,
                      borderRadius: 8,
                      color: A.text,
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: A.muted }}>Sunday:</span>
                  <input
                    type="text"
                    value={formData.officeHours?.sun || ''}
                    onChange={(e) => handleNestedChange('officeHours', 'sun', e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      padding: '0.55rem 0.75rem',
                      backgroundColor: A.bg,
                      border: `1px solid ${A.border}`,
                      borderRadius: 8,
                      color: A.text,
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: A.card2,
              color: A.muted,
              border: `1px solid ${A.border}`,
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Restore Factory Defaults
          </button>
          <button
            type="submit"
            style={{
              padding: '0.65rem 1.75rem',
              backgroundColor: A.accent,
              color: '#0a0d14',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: `0 4px 14px ${A.accent}44`,
            }}
          >
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Sidebar nav ────────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { id: 'overview',     label: 'Overview',          Icon: BarChart2   },
  { id: 'floorplans',   label: 'Floor Plans',        Icon: Building    },
  { id: 'units',        label: 'Units',              Icon: Home        },
  { id: 'applications', label: 'Applications',       Icon: FileText    },
  { id: 'residents',    label: 'Residents',          Icon: Users       },
  { id: 'maintenance',  label: 'Maintenance',        Icon: Wrench      },
  { id: 'addons',       label: 'Add-ons',            Icon: Package     },
  { id: 'emaillogs',    label: 'Email Logs',         Icon: Mail        },
  { id: 'support',      label: 'Contact Support',    Icon: Headphones  },
  { id: 'pages',        label: 'Pages & Legal',      Icon: BookOpen    },
  { id: 'settings',     label: 'Site Settings',      Icon: Sliders     },
];

// ── Main Export ────────────────────────────────────────────────────────────────
export default function AdminPanel({
  onBack,
  siteSettings: propSiteSettings,
  onUpdateSiteSettings,
  legalPages: propLegalPages,
  onUpdateLegalPages,
  supportInquiries: propSupportInquiries,
  onUpdateSupportInquiries,
}) {
  const [activeSection, setActiveSection] = useState('overview');
  const [supportInquiries, setSupportInquiries] = useState(() => propSupportInquiries || getSupportInquiries());
  const [siteSettings, setSiteSettings] = useState(() => propSiteSettings || getSiteSettings());
  const [legalPages, setLegalPages] = useState(() => propLegalPages || getLegalPages());

  const handleUpdateSiteSettings = (newSettings) => {
    setSiteSettings(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
  };

  const handleUpdateLegalPages = (newPages) => {
    setLegalPages(newPages);
    if (onUpdateLegalPages) onUpdateLegalPages(newPages);
  };

  const handleUpdateSupportInquiries = (newInquiries) => {
    setSupportInquiries(newInquiries);
    if (onUpdateSupportInquiries) onUpdateSupportInquiries(newInquiries);
  };

  const sectionMap = {
    overview:     <OverviewSection />,
    floorplans:   <FloorPlansSection />,
    units:        <UnitsSection />,
    applications: <ApplicationsSection />,
    residents:    <ResidentsSection />,
    maintenance:  <AdminMaintenanceSection />,
    addons:       <AddOnsManagementSection />,
    emaillogs:    <EmailLogsSection />,
    support:      <ContactSupportSection supportInquiries={supportInquiries} setSupportInquiries={handleUpdateSupportInquiries} />,
    pages:        <PagesManagementSection legalPages={legalPages} setLegalPages={handleUpdateLegalPages} />,
    settings:     <SiteSettingsSection siteSettings={siteSettings} setSiteSettings={handleUpdateSiteSettings} />,
  };

  const pendingCount = APPLICATIONS_DATA.filter((a) => a.status === 'pending').length;
  const newSupportCount = supportInquiries.filter((s) => s.status === 'new').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: A.bg, display: 'flex', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 235, backgroundColor: A.sidebar, borderRight: `1px solid ${A.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: '1.5rem 1.3rem', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${A.accent}, #d97706)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={16} color="#0a0d14" />
            </div>
            <div>
              <div style={{ color: A.text, fontWeight: 800, fontSize: '0.9rem', lineHeight: 1 }}>Admin Panel</div>
              <div style={{ color: A.muted, fontSize: '0.7rem' }}>{siteSettings?.siteName || 'Monarch Pass'}</div>
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', padding: '0.35rem 0.6rem', backgroundColor: `${A.accent}22`, borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', border: `1px solid ${A.accent}44` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: A.accent }} />
            <span style={{ color: A.accent, fontSize: '0.68rem', fontWeight: 700 }}>ADMIN ACCESS</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.85rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {ADMIN_NAV.map(({ id, label, Icon }) => {
            const active = activeSection === id;
            const isAppBadge = id === 'applications' && pendingCount > 0;
            const isSupportBadge = id === 'support' && newSupportCount > 0;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 9,
                  cursor: 'pointer',
                  border: 'none',
                  width: '100%',
                  backgroundColor: active ? `${A.accent}18` : 'transparent',
                  color: active ? A.accent : A.muted,
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.84rem',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = A.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = A.muted;
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  {active && <div style={{ width: 3, height: 16, backgroundColor: A.accent, borderRadius: 4, marginLeft: -5, marginRight: 2 }} />}
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
                {isAppBadge && (
                  <span style={{ backgroundColor: A.danger, color: '#fff', borderRadius: 10, padding: '0.1rem 0.45rem', fontSize: '0.65rem', fontWeight: 800 }}>
                    {pendingCount}
                  </span>
                )}
                {isSupportBadge && (
                  <span style={{ backgroundColor: A.accent, color: '#0a0d14', borderRadius: 10, padding: '0.1rem 0.45rem', fontSize: '0.65rem', fontWeight: 800 }}>
                    {newSupportCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.85rem 0.65rem', borderTop: `1px solid ${A.border}` }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 9,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              color: A.muted,
              fontWeight: 500,
              fontSize: '0.855rem',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <LogOut size={16} /> Back to Website
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2.25rem 2.5rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: `1px solid ${A.border}` }}>
          <div>
            <h1 style={{ color: A.text, fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {ADMIN_NAV.find((n) => n.id === activeSection)?.label}
            </h1>
            <p style={{ color: A.muted, fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
              {siteSettings?.siteName || 'Monarch Pass Apartments'} · Admin Dashboard
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: A.text, fontSize: '0.82rem', fontWeight: 600 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ color: A.accent, fontSize: '0.72rem', fontWeight: 700 }}>Admin: Property Manager</div>
            </div>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${A.accent}, #d97706)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#0a0d14',
                fontSize: '0.85rem',
              }}
            >
              PM
            </div>
          </div>
        </div>

        {/* Section */}
        <div className="animate-fade-in" key={activeSection}>
          {sectionMap[activeSection]}
        </div>
      </main>
    </div>
  );
}

