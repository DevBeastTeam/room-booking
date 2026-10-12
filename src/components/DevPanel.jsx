import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Users, UserCog, KeyRound, Eye, EyeOff, Power, PowerOff,
  LogOut, UserPlus, Activity, Check, X, AlertCircle, ExternalLink, Database,
  Search, RefreshCw, Copy, BarChart3, MousePointerClick, TrendingUp,
  Eye as EyeIcon, Smartphone, Monitor, Tablet, Download, Sliders, Save,
} from 'lucide-react';
import DatabaseManager from './DatabaseManager.jsx';
import '../devpanel.css';

// ── Config ─────────────────────────────────────────────────────────────────────
const API = '/backend/api/auth.php';

const TABS = [
  ['floorplans',   'Floor Plans'],
  ['units',        'Units'],
  ['applications', 'Applications'],
  ['residents',    'Residents'],
  ['maintenance',  'Maintenance'],
  ['addons',       'Add-ons'],
  ['emaillogs',    'Email Logs'],
  ['livechat',     'Live Chat'],
  ['support',      'Contact Support'],
  ['pages',        'Pages & Legal'],
  ['settings',     'Site Settings'],
  ['theme',        'Theme & Colors'],
  ['adminactivity', 'Admin Activity'],
];

const NAV = [
  { id: 'overview', label: 'Overview',        Icon: Users },
  { id: 'analytics', label: 'Analytics',      Icon: BarChart3 },
  { id: 'menu',      label: 'Admin Menu',     Icon: Sliders },
  { id: 'admins',   label: 'Admin Accounts',  Icon: UserCog },
  { id: 'database', label: 'Database Manager', Icon: Database },
  { id: 'logs',     label: 'Activity Logs',   Icon: Activity },
];

const S = {
  bg:       '#0a0d14',
  sidebar:  '#0d1117',
  card:     '#111827',
  card2:    '#1a2234',
  border:   '#1f2d44',
  accent:   '#f59e0b',
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

async function api(action, body) {
  const opts = { credentials: 'same-origin' };
  if (body) {
    opts.method = 'POST';
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify({ action, ...body });
  } else {
    opts.method = 'GET';
  }
  const res = await fetch(`${API}${body ? '' : `?action=${action}`}`, opts);
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok && (json.success !== false), data: json };
}

const fullPermissions = () => Object.fromEntries(TABS.map(([k]) => [k, true]));

// ── Reusable UI atoms ──────────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children, width = 560 }) {
  return (
    <div className="dev-modal-overlay">
      <div className="dev-modal" style={{ maxWidth: width }}>
        <div className="dev-modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="dev-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, color = S.accent, disabled, title, small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`dev-btn${small ? ' dev-btn-sm' : ''}`}
      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
    >
      {children}
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="dev-field">
      <span className="dev-field-label">{label}</span>
      {children}
      {hint && <span className="dev-field-hint">{hint}</span>}
    </label>
  );
}

function StatusPill({ active }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
      color: active ? S.success : S.danger,
      background: active ? `${S.success}1a` : `${S.danger}1a`,
      border: `1px solid ${active ? `${S.success}44` : `${S.danger}44`}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? S.success : S.danger }} />
      {active ? 'Active' : 'Disabled'}
    </span>
  );
}

function StatCard({ label, value, sub, color, Icon, onClick }) {
  return (
    <div className="dev-stat" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="dev-stat-head">
        <span>{label}</span>
        <span className="dev-stat-icon" style={{ background: `${color}1f`, color }}><Icon size={16} /></span>
      </div>
      <div className="dev-stat-value" style={{ color }}>{value}</div>
      {sub && <div className="dev-stat-sub">{sub}</div>}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Switch({ on, onChange, disabled, title }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={title}
      disabled={disabled}
      className={`dev-switch${on ? ' on' : ''}`}
      onClick={onChange}
    >
      <span className="dev-switch-knob" />
    </button>
  );
}

// ── Main Dev Panel ─────────────────────────────────────────────────────────────
export default function DevPanel({ user, onLogout }) {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [section, setSection] = useState('overview');
  const [search, setSearch] = useState('');

  const [credModal, setCredModal] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [menuAdminId, setMenuAdminId] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [menuEmail, setMenuEmail] = useState('');
  const [menuSaving, setMenuSaving] = useState(false);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => setNotice(null), 4500);
  };

  const loadAdmins = useCallback(async () => {
    const { ok, data } = await api('admins');
    if (ok) setAdmins(data.admins || []);
    else showNotice('error', data.error || 'Failed to load admins');
  }, []);

  const loadLogs = useCallback(async () => {
    const { ok, data } = await api('logs');
    if (ok) setLogs(data.logs || []);
  }, []);

  const loadDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/backend/api/data-manager.php?action=stats', { credentials: 'same-origin' });
      const json = await res.json();
      if (json.success) {
        const totalRows = Object.values(json.counts || {}).reduce((s, c) => s + (c || 0), 0);
        setDbStatus({ online: true, counts: json.counts || {}, totalRows });
      } else {
        setDbStatus({ online: false });
      }
    } catch {
      setDbStatus({ online: false });
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadAdmins(), loadLogs(), loadDbStatus()]);
      setLoading(false);
    })();
  }, [loadAdmins, loadLogs, loadDbStatus]);

  const clientAdmins = admins.filter(a => a.role !== 'super_admin');
  const activeCount = clientAdmins.filter(a => a.active).length;
  const disabledCount = clientAdmins.length - activeCount;

  const filteredAdmins = clientAdmins.filter(a => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (a.username || '').toLowerCase().includes(q) ||
      (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="dev-shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="dev-spinner" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dev-shell">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes devFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        input::placeholder { color: #46536e; }
        .dev-stat:hover { border-color: ${S.border}; transform: translateY(-1px); }
        .dev-btn { display: inline-flex; align-items: center; gap: .4rem; border: 1px solid; border-radius: 8px;
          padding: .5rem .85rem; font-size: .78rem; font-weight: 700; cursor: pointer; transition: all .15s; }
        .dev-btn:hover { filter: brightness(1.15); }
        .dev-btn:disabled { opacity: .5; cursor: not-allowed; }
        .dev-btn-sm { padding: .35rem .65rem; font-size: .72rem; }
        .dev-table-row:hover { background: rgba(255,255,255,.02); }
        .dev-nav-item:hover:not(.active) { background: rgba(255,255,255,.04); color: ${S.text}; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside className="dev-sidebar">
        <div className="dev-brand">
          <div className="dev-brand-icon"><ShieldCheck size={19} color={S.accent} /></div>
          <div>
            <div className="dev-brand-title">Super Admin</div>
            <div className="dev-brand-sub">Developer Control</div>
          </div>
        </div>

        <nav className="dev-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`dev-nav-item${section === id ? ' active' : ''}`}
              onClick={() => setSection(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="dev-sidebar-foot">
          <a className="dev-nav-item" href="/admin" target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Admin Panel
          </a>
          <button className="dev-nav-item" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dev-main">
        {/* Top bar */}
        <div className="dev-topbar">
          <div>
            <h1>{NAV.find(n => n.id === section)?.label}</h1>
            <p>Monarch Pass Apartments · Developer Dashboard</p>
          </div>
          <div className="dev-topbar-right">
            <div style={{ textAlign: 'right' }}>
              <div className="dev-topbar-name">{user.name || user.username}</div>
              <div style={{ color: S.accent, fontSize: '0.72rem', fontWeight: 700 }}>{user.role_label || user.role}</div>
            </div>
            <div className="dev-avatar">
              {(user.name || user.username || 'D').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {notice && (
          <div
            className="dev-notice"
            style={{
              color: notice.type === 'success' ? S.success : S.danger,
              borderColor: notice.type === 'success' ? `${S.success}44` : `${S.danger}44`,
              background: notice.type === 'success' ? `${S.success}12` : `${S.danger}12`,
            }}
          >
            {notice.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
            {notice.text}
          </div>
        )}

        {/* ═══ OVERVIEW ═══ */}
        {section === 'overview' && (
          <div style={{ animation: 'devFadeIn .25s ease' }}>
            <div className="dev-stats">
              <StatCard label="Client Admins" value={clientAdmins.length} color={S.accent} Icon={UserCog} onClick={() => setSection('admins')} />
              <StatCard label="Active" value={activeCount} color={S.success} Icon={Power} />
              <StatCard label="Disabled" value={disabledCount} color={disabledCount ? S.danger : S.muted} Icon={PowerOff} />
              <StatCard
                label="MySQL"
                value={dbStatus?.online ? 'Online' : 'Offline'}
                sub={dbStatus?.online ? `${(dbStatus.totalRows || 0).toLocaleString()} rows · click to manage` : 'Seed/Import ke liye DB chahiye'}
                color={dbStatus?.online ? S.success : S.warning}
                Icon={Database}
                onClick={() => setSection('database')}
              />
              <StatCard label="Super Admins" value={admins.filter(a => a.role === 'super_admin').length} color={S.purple} Icon={ShieldCheck} />
            </div>

            <div className="dev-panel">
              <div className="dev-panel-head">
                <h3><Activity size={16} color={S.accent} /> Latest Activity</h3>
                <Btn small onClick={() => setSection('logs')} color={S.info}>View all</Btn>
              </div>
              <div className="dev-panel-body">
                {logs.slice(0, 6).map(l => (
                  <div key={l.id} className="dev-log-row">
                    <span className="dev-log-time">{l.timestamp}</span>
                    <span className="dev-log-actor">{l.actor}</span>
                    <span className="dev-log-action">{l.action}</span>
                    {l.detail && <span className="dev-log-detail">{l.detail}</span>}
                  </div>
                ))}
                {(!logs || logs.length === 0) && <div className="dev-empty">No activity recorded yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {section === 'analytics' && (
          <AnalyticsSection />
        )}

        {/* ═══ ADMIN MENU (sidebar tab switches) ═══ */}
        {section === 'menu' && (
          <AdminMenuSection
            admins={clientAdmins}
            selectedId={menuAdminId}
            onSelect={setMenuAdminId}
            name={menuName} setName={setMenuName}
            email={menuEmail} setEmail={setMenuEmail}
            saving={menuSaving} setSaving={setMenuSaving}
            api={api}
            showNotice={showNotice}
            onChanged={loadAdmins}
          />
        )}

        {/* ═══ ADMIN ACCOUNTS ═══ */}
        {section === 'admins' && (
          <div style={{ animation: 'devFadeIn .25s ease' }}>
            <div className="dev-toolbar">
              <div className="dev-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Admin search karein (name, username, email)"
                />
              </div>
              <div className="dev-toolbar-actions">
                <Btn small onClick={loadAdmins} color={S.info}><RefreshCw size={13} /> Refresh</Btn>
                <Btn small onClick={() => setCreateModal(true)} color={S.success}><UserPlus size={14} /> New Admin</Btn>
              </div>
            </div>

            <div className="dev-panel">
              <div className="dev-table-wrap">
                <table className="dev-table">
                  <thead>
                    <tr>
                      <th>Admin</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Tab Access</th>
                      <th>Last Login</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map(a => {
                      const granted = TABS.filter(([k]) => a.permissions?.[k]).length;
                      return (
                        <tr key={a.id} className="dev-table-row">
                          <td>
                            <div className="dev-cell-strong">{a.name}</div>
                            <div className="dev-cell-sub">{a.username} · {a.email}</div>
                          </td>
                          <td><span className="dev-tag" style={{ color: S.info, borderColor: `${S.info}55`, background: `${S.info}14` }}>{a.role}</span></td>
                          <td><StatusPill active={a.active} /></td>
                          <td>
                            <span style={{ color: granted === TABS.length ? S.success : (granted ? S.warning : S.danger), fontWeight: 700, fontSize: '0.8rem' }}>
                              {granted}/{TABS.length} tabs
                            </span>
                          </td>
                          <td className="dev-cell-sub">{a.last_login || '—'}</td>
                          <td>
                            <div className="dev-actions">
                              <Btn small onClick={() => { setMenuAdminId(a.id); setSection('menu'); }} color={S.info}><Sliders size={12} /> Menu</Btn>
                              <Btn small onClick={async () => {
                                const { ok, data } = await api('admins_credentials', { id: a.id });
                                if (ok) setCredModal(data);
                                else showNotice('error', data.error || 'Failed');
                              }} color={S.accent}><KeyRound size={12} /> Credentials</Btn>
                              <Btn small onClick={() => setResetModal(a)} color={S.warning}>Reset Pwd</Btn>
                              <Btn small onClick={async () => {
                                const { ok, data } = await api('admins_toggle', { id: a.id });
                                if (ok) { showNotice('success', data.message); loadAdmins(); }
                                else showNotice('error', data.error || 'Failed');
                              }} color={a.active ? S.danger : S.success}>
                                {a.active ? <><PowerOff size={12} /> Disable</> : <><Power size={12} /> Enable</>}
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredAdmins.length === 0 && (
                      <tr><td colSpan={6}><div className="dev-empty">Koi client admin nahi mila{search ? ' (search clear karein)' : ''}.</div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DATABASE MANAGER ═══ */}
        {section === 'database' && (
          <div style={{ animation: 'devFadeIn .25s ease' }}>
            <div className="dev-toolbar">
              <div>
                <h2 className="dev-section-title">Database Manager</h2>
                <p className="dev-section-sub">
                  Table-wise seed / clear / export / import — <strong style={{ color: dbStatus?.online ? S.success : S.warning }}>
                    {dbStatus?.online ? 'MySQL Online' : 'MySQL Offline'}
                  </strong>
                  {!dbStatus?.online && ' — MySQL connect hone ke baad actions chalengi.'}
                </p>
              </div>
            </div>
            <DatabaseManager embedded onBack={() => setSection('overview')} />
          </div>
        )}

        {/* ═══ ACTIVITY LOGS ═══ */}
        {section === 'logs' && (
          <div style={{ animation: 'devFadeIn .25s ease' }}>
            <div className="dev-toolbar">
              <h2 className="dev-section-title">Activity Logs</h2>
              <Btn small onClick={loadLogs} color={S.info}><RefreshCw size={13} /> Refresh</Btn>
            </div>
            <div className="dev-panel">
              <div className="dev-panel-body">
                {logs.map(l => (
                  <div key={l.id} className="dev-log-row">
                    <span className="dev-log-time">{l.timestamp}</span>
                    <span className="dev-log-actor">{l.actor}</span>
                    <span className="dev-log-action" style={{ color:
                      l.action.includes('failed') || l.action.includes('blocked') ? S.danger
                      : /reset|credentials|created|disabled|toggled/.test(l.action) ? S.warning
                      : S.text }}>
                      {l.action}
                    </span>
                    {l.detail && <span className="dev-log-detail">{l.detail}</span>}
                    <span className="dev-log-ip">{l.ip}</span>
                  </div>
                ))}
                {logs.length === 0 && <div className="dev-empty">No logs yet.</div>}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ═══ MODALS ═══ */}
      {credModal && (
        <Modal title="Admin Credentials" subtitle={credModal.username} onClose={() => setCredModal(null)}>
          <div className="dev-cred">
            <div className="dev-cred-item">
              <span className="dev-field-label">Username</span>
              <div className="dev-cred-value">
                <code>{credModal.username}</code>
                <button title="Copy" onClick={() => navigator.clipboard?.writeText(credModal.username)}><Copy size={14} /></button>
              </div>
            </div>
            <div className="dev-cred-item">
              <span className="dev-field-label">Email</span>
              <div className="dev-cred-value"><code>{credModal.email}</code></div>
            </div>
            <div className="dev-cred-item">
              <span className="dev-field-label">Password</span>
              <div className="dev-cred-value" style={{ color: S.warning, borderColor: `${S.warning}55`, background: `${S.warning}0f` }}>
                <code>{credModal.password}</code>
                <button title="Copy" onClick={() => navigator.clipboard?.writeText(credModal.password)}><Copy size={14} /></button>
              </div>
            </div>
            <p className="dev-cred-note">
              <AlertCircle size={13} /> Yeh credentials dekhe gaye — yeh action activity log mein record ho gaya.
            </p>
          </div>
        </Modal>
      )}
      {resetModal && (
        <ResetPasswordModal
          admin={resetModal}
          onClose={() => setResetModal(null)}
          onSaved={(msg) => { setResetModal(null); showNotice('success', msg); loadAdmins(); }}
          onError={(msg) => showNotice('error', msg)}
        />
      )}
      {createModal && (
        <CreateAdminModal
          onClose={() => setCreateModal(false)}
          onSaved={(msg) => { setCreateModal(false); showNotice('success', msg); loadAdmins(); }}
          onError={(msg) => showNotice('error', msg)}
        />
      )}
    </div>
  );
}

// ── Analytics Section (visitors, buy clicks, charts, A-Z log) ──────────────────
function AnalyticsSection() {
  const [range, setRange] = useState('30'); // 7 | 30 | 90 | 365 | all
  const [typeFilter, setTypeFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [logType, setLogType] = useState('');
  const [loading, setLoading] = useState(false);

  const dateRange = () => {
    if (range === 'all') return { from: '2020-01-01', to: new Date().toISOString().slice(0, 10) };
    return {
      from: new Date(Date.now() - Number(range) * 86400000).toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
    };
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { from, to } = dateRange();
    try {
      const [statsRes, eventsRes] = await Promise.all([
        fetch(`/backend/api/analytics.php?action=stats&from=${from}&to=${to}&type=${typeFilter}`, { credentials: 'same-origin' }),
        fetch(`/backend/api/analytics.php?action=events&from=${from}&to=${to}&type=${logType}&limit=300&search=${encodeURIComponent(search)}`, { credentials: 'same-origin' }),
      ]);
      const statsJson = await statsRes.json();
      const eventsJson = await eventsRes.json();
      if (statsJson.success) setStats(statsJson);
      if (eventsJson.success) { setEvents(eventsJson.events || []); setEventsTotal(eventsJson.total || 0); }
    } catch { /* ignore */ }
    setLoading(false);
  }, [range, typeFilter, logType, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const series = stats?.series || [];
  const maxViews = Math.max(1, ...series.map(d => Math.max(d.pageview, d.buy_click)));
  const totals = stats?.totals || {};
  const devices = stats?.devices || {};
  const deviceTotal = Math.max(1, Object.values(devices).reduce((a, b) => a + b, 0));
  const deviceMeta = { mobile: Smartphone, desktop: Monitor, tablet: Tablet, unknown: Monitor };

  return (
    <div style={{ animation: 'devFadeIn .25s ease' }}>
      {/* Filters */}
      <div className="dev-toolbar">
        <div className="dev-filters">
          <div className="dev-filter-group">
            <span className="dev-field-label">Date Range</span>
            <div className="dev-seg">
              {[['7', '7D'], ['30', '30D'], ['90', '90D'], ['365', '1Y'], ['all', 'All']].map(([v, l]) => (
                <button key={v} className={range === v ? 'on' : ''} onClick={() => setRange(v)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="dev-filter-group">
            <span className="dev-field-label">Event Type (charts)</span>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="dev-select">
              <option value="">All Events</option>
              <option value="pageview">Page Views</option>
              <option value="buy_click">Buy Button Clicks</option>
              <option value="paddle_started">Payments Started</option>
              <option value="tour_scheduled">Tours Scheduled</option>
              <option value="inquiry">Inquiries</option>
            </select>
          </div>
          <Btn small onClick={load} color={S.info}><RefreshCw size={13} /> Refresh</Btn>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dev-stats">
        <StatCard label="Unique Visitors" value={(totals.unique_visitors || 0).toLocaleString()} color={S.accent} Icon={EyeIcon} />
        <StatCard label="Page Views" value={(totals.page_views || 0).toLocaleString()} color={S.info} Icon={BarChart3} />
        <StatCard label="Buy Clicks" value={(totals.buy_clicks || 0).toLocaleString()} sub="Reserve / checkout buttons" color={S.success} Icon={MousePointerClick} />
        <StatCard label="Unique Buyers" value={(totals.unique_buyers || 0).toLocaleString()} color={S.purple} Icon={Users} />
        <StatCard
          label="Click Rate"
          value={`${totals.unique_visitors ? ((totals.unique_buyers / totals.unique_visitors) * 100).toFixed(1) : '0.0'}%`}
          sub="visitors → buy click"
          color={S.warning} Icon={TrendingUp}
        />
      </div>

      {/* Daily chart */}
      <div className="dev-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="dev-panel-head">
          <h3><BarChart3 size={16} color={S.accent} /> Daily Activity — {stats?.from} to {stats?.to}</h3>
          <div className="dev-chart-legend">
            <span><i style={{ background: S.info }} /> Page Views</span>
            <span><i style={{ background: S.success }} /> Buy Clicks</span>
          </div>
        </div>
        <div className="dev-panel-body">
          {series.length === 0 && <div className="dev-empty">Is range mein koi event nahi mila.</div>}
          <div className="dev-chart">
            {series.map(d => (
              <div key={d.date} className="dev-chart-col" title={`${d.date}: ${d.pageview} views · ${d.buy_click} buy clicks · ${d.unique} unique`}>
                <div className="dev-chart-bars">
                  <div className="dev-bar views" style={{ height: `${(d.pageview / maxViews) * 100}%` }} />
                  <div className="dev-bar buys" style={{ height: `${(d.buy_click / maxViews) * 100}%` }} />
                </div>
                <span className="dev-chart-label">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dev-chart-row">
        {/* Top pages */}
        <div className="dev-panel" style={{ marginBottom: 0 }}>
          <div className="dev-panel-head"><h3><EyeIcon size={16} color={S.accent} /> Top Pages</h3></div>
          <div className="dev-panel-body">
            {Object.keys(stats?.topPages || {}).length === 0 && <div className="dev-empty">No data.</div>}
            {Object.entries(stats?.topPages || {}).map(([path, count]) => {
              const max = Math.max(1, ...Object.values(stats.topPages));
              return (
                <div key={path} className="dev-bar-row">
                  <span className="dev-bar-row-label" title={path}>{path}</span>
                  <div className="dev-bar-track"><div className="dev-bar-fill" style={{ width: `${(count / max) * 100}%` }} /></div>
                  <span className="dev-bar-row-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device split */}
        <div className="dev-panel" style={{ marginBottom: 0 }}>
          <div className="dev-panel-head"><h3><Smartphone size={16} color={S.accent} /> Devices</h3></div>
          <div className="dev-panel-body">
            {Object.entries(devices).length === 0 && <div className="dev-empty">No data.</div>}
            {Object.entries(devices).sort((a, b) => b[1] - a[1]).map(([dev, count]) => {
              const Icon = deviceMeta[dev] || Monitor;
              return (
                <div key={dev} className="dev-bar-row">
                  <span className="dev-bar-row-label" style={{ textTransform: 'capitalize' }}><Icon size={13} /> {dev}</span>
                  <div className="dev-bar-track"><div className="dev-bar-fill" style={{ width: `${(count / deviceTotal) * 100}%`, background: S.purple }} /></div>
                  <span className="dev-bar-row-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* A-Z event log */}
      <div className="dev-panel" style={{ marginTop: '1.5rem' }}>
        <div className="dev-panel-head">
          <h3><Activity size={16} color={S.accent} /> Complete Event Log (A–Z records)</h3>
          <span className="dev-log-count">{eventsTotal} matching events{loading ? ' — loading…' : ''}</span>
        </div>
        <div className="dev-toolbar" style={{ margin: '1rem 1.25rem 0', padding: 0 }}>
          <div className="dev-search">
            <Search size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search: page, visitor, unit, txn…" />
          </div>
          <select value={logType} onChange={e => setLogType(e.target.value)} className="dev-select">
            <option value="">All Types</option>
            <option value="pageview">Page Views</option>
            <option value="buy_click">Buy Clicks</option>
            <option value="paddle_started">Payments</option>
            <option value="tour_scheduled">Tours</option>
            <option value="inquiry">Inquiries</option>
          </select>
        </div>
        <div className="dev-table-wrap">
          <table className="dev-table">
            <thead>
              <tr>
                <th>Time</th><th>Type</th><th>Visitor</th><th>Page</th><th>Details</th><th>Device</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} className="dev-table-row">
                  <td className="dev-cell-sub" style={{ whiteSpace: 'nowrap' }}>{ev.ts}</td>
                  <td>
                    <span className="dev-tag" style={{
                      color: ev.type === 'buy_click' ? S.success : ev.type === 'pageview' ? S.info : S.purple,
                      borderColor: ev.type === 'buy_click' ? `${S.success}55` : ev.type === 'pageview' ? `${S.info}55` : `${S.purple}55`,
                      background: ev.type === 'buy_click' ? `${S.success}14` : ev.type === 'pageview' ? `${S.info}14` : `${S.purple}14`,
                    }}>{ev.type}</span>
                  </td>
                  <td className="dev-cell-sub" style={{ fontFamily: 'monospace' }}>{ev.visitor_id}</td>
                  <td className="dev-cell-strong" style={{ fontSize: '0.8rem' }}>{ev.path}</td>
                  <td className="dev-cell-sub">{Object.keys(ev.meta || {}).length ? JSON.stringify(ev.meta) : '—'}</td>
                  <td className="dev-cell-sub">{ev.device}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={6}><div className="dev-empty">No events match the current filters.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="dev-panel-head" style={{ borderBottom: 'none', borderTop: `1px solid ${S.border}` }}>
          <span className="dev-cell-sub">Latest 300 shown · {eventsTotal} total in range · export includes up to 1,000</span>
          <Btn small onClick={() => {
            const { from, to } = dateRange();
            window.open(`/backend/api/analytics.php?action=events&from=${from}&to=${to}&limit=1000`, '_blank');
          }} color={S.info}><Download size={13} /> Export JSON</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Admin Menu Section (sidebar tab enable/disable switches) ──────────────────
function AdminMenuSection({ admins, selectedId, onSelect, name, setName, email, setEmail, saving, setSaving, api, showNotice, onChanged }) {
  // Default select first admin
  React.useEffect(() => {
    if (!selectedId && admins.length) onSelect(admins[0].id);
  }, [selectedId, admins, onSelect]);

  // Sync edit fields when admin selection changes
  React.useEffect(() => {
    const a = admins.find(x => x.id === selectedId);
    if (a) { setName(a.name || ''); setEmail(a.email || ''); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const admin = admins.find(a => a.id === selectedId) || null;

  const save = async (payload, successMsg) => {
    if (!admin) return;
    setSaving(true);
    const { ok, data } = await api('admins_update', { id: admin.id, ...payload });
    setSaving(false);
    if (ok) {
      showNotice('success', successMsg);
      if (onChanged) onChanged();
    } else {
      showNotice('error', data.error || 'Save failed');
      if (onChanged) onChanged();
    }
  };

  const toggleTab = (key) => {
    if (!admin) return;
    const current = { ...(admin.permissions || {}) };
    current[key] = !current[key];
    if (!Object.values(current).some(Boolean)) {
      showNotice('error', 'Kam az kam ek tab allow karna zaroori hai.');
      return;
    }
    save({ name, email, permissions: current }, `${TABS.find(t => t[0] === key)?.[1] || key} ${current[key] ? 'enabled' : 'disabled'} ho gaya`);
  };

  const setAll = (value) => {
    if (!admin) return;
    if (!value) {
      // Kam az kam ek tab allow rehna chahiye — warna client admin sirf Overview dekhega
      showNotice('error', 'Kam az kam ek tab allow karna zaroori hai.');
      return;
    }
    const next = {};
    TABS.forEach(([k]) => { next[k] = value; });
    save({ name, email, permissions: next }, `Sab tabs ${value ? 'enabled' : 'disabled'} ho gaye`);
  };

  const saveProfile = () => save({ name, email, permissions: admin.permissions || {} }, 'Admin profile updated');

  const granted = admin ? TABS.filter(([k]) => admin.permissions?.[k]).length : 0;

  return (
    <div style={{ animation: 'devFadeIn .25s ease' }}>
      {/* Admin selector */}
      <div className="dev-toolbar">
        <div className="dev-filter-group" style={{ minWidth: 260 }}>
          <span className="dev-field-label">Admin Select Karein</span>
          <select
            className="dev-select"
            value={selectedId || ''}
            onChange={e => onSelect(e.target.value)}
            disabled={!admins.length}
          >
            {admins.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.username}){a.active ? '' : ' — disabled'}
              </option>
            ))}
          </select>
        </div>
        {admin && (
          <div className="dev-toolbar-actions">
            <Btn small onClick={() => setAll(true)} color={S.success}><Power size={13} /> Enable All</Btn>
            <Btn small onClick={() => setAll(false)} color={S.danger}><PowerOff size={13} /> Disable All</Btn>
          </div>
        )}
      </div>

      {!admins.length && (
        <div className="dev-panel"><div className="dev-empty">Koi client admin nahi mila — pehle Admin Accounts se admin create karein.</div></div>
      )}

      {admin && (
        <>
          {/* Profile editor */}
          <div className="dev-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="dev-panel-head">
              <h3><UserCog size={16} color={S.accent} /> Admin Profile</h3>
              <span className="dev-log-count">{granted}/{TABS.length} tabs enabled</span>
            </div>
            <div className="dev-panel-body" style={{ paddingTop: '1rem' }}>
              <div className="dev-form-grid">
                <Field label="Name">
                  <input value={name} onChange={e => setName(e.target.value)} />
                </Field>
                <Field label="Email">
                  <input value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
              </div>
              <div style={{ display: 'flex', gap: '.5rem', marginTop: '.9rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Btn small onClick={saveProfile} color={S.success} disabled={saving}>
                  <Save size={13} /> {saving ? 'Saving…' : 'Save Profile'}
                </Btn>
                <span className="dev-cell-sub">Status: {admin.active ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          {/* Sidebar tab switches */}
          <div className="dev-panel">
            <div className="dev-panel-head">
              <h3><Sliders size={16} color={S.accent} /> Sidebar Menu — Admin Dashboard Tabs</h3>
              <span className="dev-cell-sub">Switch on/off — instantly apply hota hai</span>
            </div>
            <div className="dev-panel-body">
              {/* Overview — always on */}
              <div className="dev-menu-item on locked">
                <div>
                  <div className="dev-menu-label">Overview</div>
                  <div className="dev-menu-sub">Hamesha visible — lock hai</div>
                </div>
                <Switch on disabled title="Overview tab locked rehta hai" />
              </div>

              {TABS.map(([key, label]) => {
                const on = Boolean(admin.permissions?.[key]);
                return (
                  <div key={key} className={`dev-menu-item${on ? ' on' : ''}`}>
                    <div>
                      <div className="dev-menu-label">{label}</div>
                      <div className="dev-menu-sub">{on ? 'Admin ke sidebar mein visible' : 'Admin ke sidebar se hidden'}</div>
                    </div>
                    <div className="dev-menu-right">
                      <span className={`dev-menu-state${on ? ' on' : ''}`}>{on ? 'ON' : 'OFF'}</span>
                      <Switch on={on} onChange={() => toggleTab(key)} disabled={saving} title={`${label} toggle`} />
                    </div>
                  </div>
                );
              })}

              <p className="dev-perm-note" style={{ marginTop: '1rem' }}>
                <Check size={13} /> Yeh settings server-side bhi enforce hoti hain — hidden tab ka data API se bhi nahi milega.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Reset Password Modal ───────────────────────────────────────────────────────
function ResetPasswordModal({ admin, onClose, onSaved, onError }) {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (pwd.length < 6) { onError('Password kam az kam 6 characters ka ho.'); return; }
    setSaving(true);
    const { ok, data } = await api('admins_reset_password', { id: admin.id, password: pwd });
    setSaving(false);
    if (ok) onSaved('Password reset ho gaya');
    else onError(data.error || 'Reset failed');
  };

  return (
    <Modal title="Reset Password" subtitle={admin.username} onClose={onClose} width={440}>
      <div className="dev-form">
        <p className="dev-perm-note">Naya password set karne ke baad ise admin ko manually batana parega (koi email nahi jata).</p>
        <Field label="New Password">
          <div className="dev-input-eye">
            <input type={show ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Min 6 characters" />
            <button type="button" onClick={() => setShow(v => !v)}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
        </Field>
        <div className="dev-modal-foot">
          <Btn onClick={onClose} color={S.muted}>Cancel</Btn>
          <Btn onClick={submit} color={S.warning} disabled={saving}>{saving ? 'Resetting…' : 'Reset Password'}</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ── Create Admin Modal ─────────────────────────────────────────────────────────
function CreateAdminModal({ onClose, onSaved, onError }) {
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '' });
  const [perms, setPerms] = useState(fullPermissions());
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.username.trim() || !form.password || !form.name.trim()) {
      onError('Username, password aur name required hain.');
      return;
    }
    if (form.password.length < 6) { onError('Password min 6 characters.'); return; }
    setSaving(true);
    const { ok, data } = await api('admins_create', { ...form, permissions: perms });
    setSaving(false);
    if (ok) onSaved('Admin create ho gaya');
    else onError(data.error || 'Create failed');
  };

  return (
    <Modal title="New Admin Account" subtitle="Client admin create karein" onClose={onClose} width={620}>
      <div className="dev-form">
        <div className="dev-form-grid">
          <Field label="Username"><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="manager2" /></Field>
          <Field label="Name"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Property Manager" /></Field>
          <Field label="Email"><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@monarchpass.com" /></Field>
          <Field label="Password"><input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" /></Field>
        </div>

        <div>
          <span className="dev-field-label" style={{ display: 'block', marginBottom: '.6rem' }}>Tab Access</span>
          <div className="dev-perm-grid">
            {TABS.map(([key, label]) => (
              <label key={key} className={`dev-perm-item${perms[key] ? ' on' : ''}`}>
                <input type="checkbox" checked={Boolean(perms[key])} onChange={e => setPerms({ ...perms, [key]: e.target.checked })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="dev-modal-foot">
          <Btn onClick={onClose} color={S.muted}>Cancel</Btn>
          <Btn onClick={submit} color={S.success} disabled={saving}>{saving ? 'Creating…' : 'Create Admin'}</Btn>
        </div>
      </div>
    </Modal>
  );
}
