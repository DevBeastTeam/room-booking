import React, { useState } from 'react';
import {
  Home, Users, FileText, Wrench, DollarSign, BarChart2, Settings,
  LogOut, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock,
  AlertTriangle, TrendingUp, Edit2, Trash2, Plus, X, Eye,
  Package, Layers, Car, Archive, Search, Filter, Download,
  Building, UserCheck, AlertCircle, Mail, RefreshCw
} from 'lucide-react';

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
];

// ── Main Export ────────────────────────────────────────────────────────────────
export default function AdminPanel({ onBack }) {
  const [activeSection, setActiveSection] = useState('overview');

  const sectionMap = {
    overview:     <OverviewSection />,
    floorplans:   <FloorPlansSection />,
    units:        <UnitsSection />,
    applications: <ApplicationsSection />,
    residents:    <ResidentsSection />,
    maintenance:  <AdminMaintenanceSection />,
    addons:       <AddOnsManagementSection />,
    emaillogs:    <EmailLogsSection />,
  };

  const pendingCount = APPLICATIONS_DATA.filter(a => a.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: A.bg, display: 'flex', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 230, backgroundColor: A.sidebar, borderRight: `1px solid ${A.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: '1.5rem 1.3rem', borderBottom: `1px solid ${A.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${A.accent}, #d97706)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={16} color="#0a0d14" />
            </div>
            <div>
              <div style={{ color: A.text, fontWeight: 800, fontSize: '0.9rem', lineHeight: 1 }}>Admin Panel</div>
              <div style={{ color: A.muted, fontSize: '0.7rem' }}>Monarch Pass</div>
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
            const isBadge = id === 'applications' && pendingCount > 0;
            return (
              <button key={id} onClick={() => setActiveSection(id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.7rem', justifyContent: 'space-between',
                padding: '0.65rem 0.85rem', borderRadius: 9, cursor: 'pointer', border: 'none', width: '100%',
                backgroundColor: active ? `${A.accent}18` : 'transparent',
                color: active ? A.accent : A.muted,
                fontWeight: active ? 700 : 500, fontSize: '0.855rem', textAlign: 'left',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = A.text; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = A.muted; } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  {active && <div style={{ width: 3, height: 16, backgroundColor: A.accent, borderRadius: 4, marginLeft: -5, marginRight: 2 }} />}
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
                {isBadge && <span style={{ backgroundColor: A.danger, color: '#fff', borderRadius: 10, padding: '0.1rem 0.45rem', fontSize: '0.65rem', fontWeight: 800 }}>{pendingCount}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.85rem 0.65rem', borderTop: `1px solid ${A.border}` }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 0.85rem', borderRadius: 9, cursor: 'pointer', border: 'none', backgroundColor: 'transparent', color: A.muted, fontWeight: 500, fontSize: '0.855rem', width: '100%', textAlign: 'left' }}>
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
              {ADMIN_NAV.find(n => n.id === activeSection)?.label}
            </h1>
            <p style={{ color: A.muted, fontSize: '0.82rem', margin: '0.25rem 0 0' }}>Monarch Pass Apartments · Admin Dashboard</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: A.text, fontSize: '0.82rem', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div style={{ color: A.accent, fontSize: '0.72rem', fontWeight: 700 }}>Admin: Property Manager</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${A.accent}, #d97706)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0a0d14', fontSize: '0.85rem' }}>PM</div>
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
