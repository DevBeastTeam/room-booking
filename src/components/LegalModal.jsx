import React from 'react';
import { X, Shield, FileText, Calendar, Printer } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, pageType = 'terms', legalPages }) {
  if (!isOpen) return null;

  const page = legalPages?.[pageType] || {
    title: pageType === 'privacy' ? 'Privacy Policy' : pageType === 'accessibility' ? 'Accessibility Statement' : 'Terms & Conditions',
    lastUpdated: 'September 2026',
    content: 'No content available.',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pageType === 'privacy' ? (
                <Shield size={20} color="#68c7b7" />
              ) : pageType === 'accessibility' ? (
                <Shield size={20} color="#38bdf8" />
              ) : (
                <FileText size={20} color="#fbbf24" />
              )}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{page.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                <Calendar size={12} />
                <span>Last updated: {page.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              aria-label="Print policy"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          <div
            style={{
              color: '#334155',
              fontSize: '0.925rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
            }}
          >
            {page.content}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <span>Monarch Pass Apartments · Cushman & Wakefield Management</span>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              backgroundColor: '#0f766e',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
