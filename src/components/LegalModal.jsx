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
        backgroundColor: 'rgba(5, 7, 14, 0.85)',
        backdropFilter: 'blur(8px)',
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
          backgroundColor: '#0c101c',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          border: '1px solid rgba(201, 169, 110, 0.35)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.25) 0%, rgba(12, 16, 28, 0.95) 100%)',
            color: '#f8fafc',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(201, 169, 110, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: 'rgba(201, 169, 110, 0.15)',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pageType === 'privacy' ? (
                <Shield size={20} color="#dfc285" />
              ) : pageType === 'accessibility' ? (
                <Shield size={20} color="#93c5fd" />
              ) : (
                <FileText size={20} color="#dfc285" />
              )}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>{page.title}</h3>
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
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                borderRadius: '6px',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                color: '#dfc285',
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
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#c9a96e',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, backgroundColor: 'rgba(8, 10, 18, 0.75)' }}>
          <div
            style={{
              color: '#cbd5e1',
              fontSize: '0.925rem',
              lineHeight: 1.8,
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
            backgroundColor: 'rgba(16, 20, 34, 0.95)',
            borderTop: '1px solid rgba(201, 169, 110, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#94a3b8',
          }}
        >
          <span>Monarch Pass Residences · Cushman & Wakefield Management</span>
          <button
            onClick={onClose}
            className="btn-gold"
            style={{
              padding: '0.5rem 1.4rem',
              fontSize: '0.85rem',
            }}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
