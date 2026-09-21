import React, { useState, useEffect, useCallback } from 'react';
import {
  Database, Trash2, Download, Upload, RefreshCw, CheckSquare,
  Square, Zap, AlertTriangle, CheckCircle, XCircle, BarChart2,
  Table2, Users, FileText, Wrench, Package, Mail, Headphones,
  Calendar, Settings, Palette, BookOpen, Bell, CreditCard, Home, X
} from 'lucide-react';

// ── Design tokens ──────────────────────────────────────────────────────────────
const D = {
  bg:       '#08090f',
  panel:    '#0d1117',
  card:     '#111827',
  card2:    '#161d2e',
  border:   '#1f2d44',
  accent:   '#5ec4b6',
  accentLt: '#7dd4ca',
  amber:    '#f59e0b',
  red:      '#ef4444',
  green:    '#22c55e',
  blue:     '#3b82f6',
  purple:   '#a855f7',
  text:     '#e2e8f0',
  muted:    '#6b7fa3',
};

// ── Table metadata ─────────────────────────────────────────────────────────────
const ALL_TABLES = [
  { key: 'floor_plans',         label: 'Floor Plans',          Icon: Home,        color: D.accent, desc: 'Floor plan specs aur pricing (1–4 Bedroom)' },
  { key: 'units',               label: 'Units Inventory',      Icon: Table2,      color: D.blue,   desc: 'Har apartment unit ki status aur occupancy' },
  { key: 'applications',        label: 'Applications',         Icon: FileText,    color: D.purple, desc: 'Prospect rental applications (pending/approved)' },
  { key: 'residents',           label: 'Residents',            Icon: Users,       color: D.green,  desc: 'Current aur past tenant records' },
  { key: 'maintenance_tickets', label: 'Maintenance Tickets',  Icon: Wrench,      color: D.amber,  desc: 'Work orders aur repair tickets' },
  { key: 'addons',              label: 'Add-ons & Services',   Icon: Package,     color: D.accentLt, desc: 'Carport, Storage, Washer/Dryer pricing' },
  { key: 'email_logs',          label: 'Email Logs',           Icon: Mail,        color: D.blue,   desc: 'Automated emails sent to prospects/tenants' },
  { key: 'inquiries',           label: 'Contact Inquiries',    Icon: Headphones,  color: D.amber,  desc: 'Website se aayi sari inquiries aur leads' },
  { key: 'tours',               label: 'Tour Bookings',        Icon: Calendar,    color: D.purple, desc: 'Scheduled property visit appointments' },
  { key: 'site_settings',       label: 'Site Settings',        Icon: Settings,    color: D.green,  desc: 'Phone, email, address, office hours CMS config' },
  { key: 'theme_config',        label: 'Theme Config',         Icon: Palette,     color: D.accent, desc: 'Active color palette aur visual theme data' },
  { key: 'legal_pages',         label: 'Legal Pages',          Icon: BookOpen,    color: D.muted,  desc: 'Terms, Privacy, Accessibility CMS pages' },
  { key: 'documents',           label: 'Documents',            Icon: Download,    color: D.blue,   desc: 'Resident lease agreements aur downloadable files' },
  { key: 'notifications',       label: 'Notifications',        Icon: Bell,        color: D.amber,  desc: 'Resident community alerts aur notices' },
  { key: 'transactions',        label: 'Paddle Transactions',  Icon: CreditCard,  color: D.green,  desc: 'Paddle one-time payment records' },
];

// ── Status Toast ───────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  const colors = {
    success: { bg: '#14532d', border: '#22c55e', icon: CheckCircle, color: D.green },
    error:   { bg: '#7f1d1d', border: '#ef4444', icon: XCircle,     color: D.red   },
    info:    { bg: '#1e3a5f', border: '#3b82f6', icon: BarChart2,   color: D.blue  },
    warning: { bg: '#78350f', border: '#f59e0b', icon: AlertTriangle,color: D.amber },
  };
  const c = colors[type] || colors.info;
  const Icon = c.icon;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12,
      padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)', minWidth: 280, maxWidth: 420,
      animation: 'slideUp 0.3s ease',
    }}>
      <Icon size={20} color={c.color} style={{ flexShrink: 0 }} />
      <span style={{ color: D.text, fontSize: '0.87rem', flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: D.muted, cursor: 'pointer', padding: 2 }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ── Table Card ─────────────────────────────────────────────────────────────────
function TableCard({ table, selected, onToggle, count }) {
  const { key, label, Icon, color, desc } = table;
  const active = selected.includes(key);
  return (
    <div
      onClick={() => onToggle(key)}
      style={{
        background: active
          ? `linear-gradient(135deg, ${color}18 0%, ${D.card2} 100%)`
          : D.card,
        border: `1px solid ${active ? color : D.border}`,
        borderRadius: 14, padding: '1.1rem 1.2rem',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: active ? `0 0 0 1px ${color}40, 0 6px 20px rgba(0,0,0,0.3)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = `${color}66`; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = D.border; }}
    >
      {/* Select indicator */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        {active
          ? <CheckSquare size={17} color={color} />
          : <Square size={17} color={D.muted} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={18} color={color} />
        </div>
        <div>
          <div style={{ color: D.text, fontWeight: 700, fontSize: '0.87rem' }}>{label}</div>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            color: count > 0 ? D.green : D.muted,
            marginTop: 1,
          }}>
            {count != null ? `${count} rows` : '—'}
          </div>
        </div>
      </div>
      <div style={{ color: D.muted, fontSize: '0.75rem', lineHeight: 1.4, paddingLeft: 2 }}>
        {desc}
      </div>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ msg, onConfirm, onCancel, danger }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: D.card, border: `1px solid ${danger ? D.red : D.border}`,
        borderRadius: 16, padding: '2rem', maxWidth: 420, width: '90%', textAlign: 'center',
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <AlertTriangle size={40} color={danger ? D.red : D.amber} style={{ margin: '0 auto 0.75rem' }} />
          <div style={{ color: D.text, fontSize: '0.95rem', lineHeight: 1.6 }}>{msg}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            padding: '0.6rem 1.4rem', borderRadius: 8, cursor: 'pointer',
            background: D.card2, border: `1px solid ${D.border}`, color: D.muted, fontWeight: 600, fontSize: '0.875rem',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            padding: '0.6rem 1.4rem', borderRadius: 8, cursor: 'pointer',
            background: danger ? D.red : D.amber, border: 'none',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
          }}>
            {danger ? 'Yes, Clear It' : 'Yes, Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, onClick, color, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.25rem', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? `${color}33` : `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        border: 'none', color: disabled ? `${color}88` : '#fff',
        fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
        boxShadow: disabled ? 'none' : `0 4px 16px ${color}44`,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {loading
        ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
        : <Icon size={16} />}
      {label}
    </button>
  );
}

// ── Main DatabaseManager Component ─────────────────────────────────────────────
export default function DatabaseManager({ onBack }) {
  const handleBack = onBack || (() => { window.location.href = '/admin'; });

  const [selected, setSelected]     = useState([]);
  const [counts, setCounts]         = useState({});
  const [toast, setToast]           = useState(null);
  const [loading, setLoading]       = useState('');
  const [confirm, setConfirm]       = useState(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const API = '/backend/api/data-manager.php';

  // Show a toast for 4 seconds
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch live row counts from DB
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}?action=stats`);
      const json = await res.json();
      if (json.success) setCounts(json.counts);
    } catch {
      // MySQL not running – ignore
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const toggleTable = (key) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const selectAll = () => setSelected(ALL_TABLES.map(t => t.key));
  const deselectAll = () => setSelected([]);

  // ── Seed ──────────────────────────────────────────────────────────────────────
  const handleSeed = () => {
    if (!selected.length) { showToast('Pehle kuch tables select karein', 'warning'); return; }
    setConfirm({
      msg: `Kya aap selected ${selected.length} table(s) mein DEMO DATA seed karna chahte hain? Existing rows delete ho jayengi.`,
      danger: false,
      onConfirm: async () => {
        setConfirm(null);
        setLoading('seed');
        try {
          const res = await fetch(`${API}?action=seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tables: selected }),
          });
          const json = await res.json();
          if (json.success) {
            showToast(`✅ ${selected.length} table(s) seed ho gaye!`, 'success');
            fetchStats();
          } else {
            showToast(`❌ Seeding error: ${json.error}`, 'error');
          }
        } catch { showToast('❌ Server se connection fail. MySQL chalu hai?', 'error'); }
        setLoading('');
      }
    });
  };

  // ── Clear ─────────────────────────────────────────────────────────────────────
  const handleClear = () => {
    if (!selected.length) { showToast('Pehle kuch tables select karein', 'warning'); return; }
    setConfirm({
      msg: `⚠️ Selected ${selected.length} table(s) ka SAARA DATA DELETE ho jayega (TRUNCATE). Kya aap sure hain?`,
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        setLoading('clear');
        try {
          const res = await fetch(`${API}?action=clear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tables: selected }),
          });
          const json = await res.json();
          if (json.success) {
            showToast(`🗑️ ${selected.length} table(s) clear ho gaye`, 'info');
            fetchStats();
          } else {
            showToast(`❌ Clear error: ${json.error}`, 'error');
          }
        } catch { showToast('❌ Server se connection fail. MySQL chalu hai?', 'error'); }
        setLoading('');
      }
    });
  };

  // ── Export ────────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!selected.length) { showToast('Pehle kuch tables select karein', 'warning'); return; }
    setLoading('export');
    try {
      const res = await fetch(`${API}?action=export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables: selected }),
      });
      const json = await res.json();
      if (json.success) {
        const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `monarch_db_export_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📁 JSON Export download ho gaya!', 'success');
      } else {
        showToast(`❌ Export error: ${json.error}`, 'error');
      }
    } catch { showToast('❌ Export fail. MySQL running hai?', 'error'); }
    setLoading('');
  };

  // ── Import ────────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!importText.trim()) { showToast('JSON text paste karein', 'warning'); return; }
    let parsed;
    try { parsed = JSON.parse(importText); } catch { showToast('❌ Invalid JSON format', 'error'); return; }

    setLoading('import');
    try {
      const res = await fetch(`${API}?action=import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✅ Import complete! ${Object.keys(json.imported || {}).length} table(s) restore hue`, 'success');
        setImportText('');
        setShowImport(false);
        fetchStats();
      } else {
        showToast(`❌ Import error: ${json.error}`, 'error');
      }
    } catch { showToast('❌ Import fail. MySQL running hai?', 'error'); }
    setLoading('');
  };

  // ── Import from file ──────────────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImportText(ev.target.result || ''); setShowImport(true); };
    reader.readAsText(file);
  };

  const totalRows = Object.values(counts).reduce((s, c) => s + (c || 0), 0);
  const noTablesSelected = !selected.length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: D.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", color: D.text }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: ${D.bg}; }
        ::-webkit-scrollbar-thumb { background: ${D.border}; border-radius: 3px; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: D.panel, borderBottom: `1px solid ${D.border}`,
        padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${D.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={20} color={D.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: D.text }}>Database Manager</div>
            <div style={{ fontSize: '0.72rem', color: D.muted }}>roombookingdb · {totalRows.toLocaleString()} total rows · {ALL_TABLES.length} tables</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={fetchStats} style={{ background: D.card2, border: `1px solid ${D.border}`, color: D.muted, cursor: 'pointer', borderRadius: 8, padding: '0.5rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={handleBack} style={{ background: D.card2, border: `1px solid ${D.border}`, color: D.muted, cursor: 'pointer', borderRadius: 8, padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
            ← Back to Admin
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem' }}>

        {/* ── Action Bar ── */}
        <div style={{
          background: D.panel, border: `1px solid ${D.border}`, borderRadius: 16,
          padding: '1.4rem 1.75rem', marginBottom: '1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          {/* Selection controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: D.muted, fontSize: '0.82rem' }}>
              {selected.length > 0 ? `${selected.length} table(s) selected` : 'Koi table select nahi'}
            </span>
            <button onClick={selectAll} style={{ background: `${D.accent}22`, border: `1px solid ${D.accent}55`, color: D.accent, cursor: 'pointer', borderRadius: 6, padding: '0.3rem 0.7rem', fontSize: '0.75rem', fontWeight: 600 }}>
              Select All
            </button>
            <button onClick={deselectAll} style={{ background: D.card2, border: `1px solid ${D.border}`, color: D.muted, cursor: 'pointer', borderRadius: 6, padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
              Deselect
            </button>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <ActionBtn icon={Zap}      label="Seed Data"     onClick={handleSeed}               color={D.green}  disabled={noTablesSelected} loading={loading === 'seed'}   />
            <ActionBtn icon={Trash2}   label="Clear Tables"  onClick={handleClear}              color={D.red}    disabled={noTablesSelected} loading={loading === 'clear'}  />
            <ActionBtn icon={Download} label="Export JSON"   onClick={handleExport}             color={D.blue}   disabled={noTablesSelected} loading={loading === 'export'} />
            <ActionBtn icon={Upload}   label="Import JSON"   onClick={() => setShowImport(v => !v)} color={D.purple} loading={loading === 'import'} />
          </div>
        </div>

        {/* ── Import Panel ── */}
        {showImport && (
          <div style={{
            background: D.panel, border: `1px solid ${D.purple}55`, borderRadius: 16,
            padding: '1.5rem', marginBottom: '1.75rem',
          }}>
            <div style={{ color: D.text, fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={17} color={D.purple} /> Import from JSON
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <label style={{
                background: `${D.purple}22`, border: `1px solid ${D.purple}55`, color: D.purple,
                borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              }}>
                📂 File Upload karo
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              <span style={{ color: D.muted, fontSize: '0.8rem', alignSelf: 'center' }}>Ya niche JSON paste karo:</span>
            </div>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={'{ "tables": { "floor_plans": [...], "units": [...] } }'}
              rows={6}
              style={{
                width: '100%', background: D.card, border: `1px solid ${D.border}`, color: D.text,
                borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem', fontFamily: 'monospace', resize: 'vertical',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <ActionBtn icon={Upload} label="Import Karo" onClick={handleImport} color={D.purple} loading={loading === 'import'} />
              <button onClick={() => { setShowImport(false); setImportText(''); }} style={{ background: D.card2, border: `1px solid ${D.border}`, color: D.muted, cursor: 'pointer', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Table Grid ── */}
        <div style={{ marginBottom: '0.75rem', color: D.muted, fontSize: '0.8rem' }}>
          Table cards click kar ke select/deselect karein, phir upar se action chalayein:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {ALL_TABLES.map(table => (
            <TableCard
              key={table.key}
              table={table}
              selected={selected}
              onToggle={toggleTable}
              count={counts[table.key] ?? null}
            />
          ))}
        </div>

        {/* ── Info footer ── */}
        <div style={{
          marginTop: '2rem', padding: '1.25rem 1.5rem',
          background: `${D.amber}11`, border: `1px solid ${D.amber}33`, borderRadius: 12,
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        }}>
          <AlertTriangle size={18} color={D.amber} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.82rem', color: D.muted, lineHeight: 1.6 }}>
            <strong style={{ color: D.amber }}>Important:</strong> Yeh page sirf MySQL server chalu hone par kaam karta hai
            (XAMPP / LAMPP / MySQL service on honi chahiye). Seed / Clear actions ko undo nahi kiya ja sakta.
            Export karke pehle backup lena recommended hai.
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Confirm Modal ── */}
      {confirm && (
        <ConfirmModal
          msg={confirm.msg}
          danger={confirm.danger}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
