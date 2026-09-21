import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export default function SummerSavingsModal({ onNavigateFloorPlans }) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-launch after 3.5 seconds if not dismissed in current session
  useEffect(() => {
    const hasDismissed = sessionStorage.getItem('monarch_savings_dismissed');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('monarch_savings_dismissed', 'true');
  };

  const handleAction = () => {
    handleClose();
    if (onNavigateFloorPlans) {
      onNavigateFloorPlans();
    }
  };

  return (
    <>
      {/* ── Mobile Sticky Nudge Strip (Fixed at Bottom on Mobile) ── */}
      <div
        className="d-md-none"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--promo-banner, #68c7b7)',
          padding: '0.65rem 1rem',
          zIndex: 990,
          boxShadow: '0 -4px 15px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: 'var(--promo-button, #0f766e)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <Sparkles size={16} />
          <span>Summer Savings Special Offers</span>
        </button>
      </div>

      {/* ── Modal Dialog ── */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(3px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="animate-scale-up"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '440px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--primary-color, #0f766e)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Sparkles size={18} style={{ color: 'var(--primary-color, #0f766e)' }} />
                <span>Summer Savings</span>
              </h3>
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem' }}>
              <div
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: '#f8fafc',
                }}
              >
                <img
                  src="https://cdngeneralcf.rentcafe.com/dmslivecafe/2/58193/Buchanan Pop Ups (4).png"
                  alt="Monarch Pass Summer Savings Promo"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '380px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  loading="eager"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  id="btn-nudge-view-floorplans"
                  onClick={handleAction}
                  style={{
                    backgroundColor: 'var(--promo-button, #0f766e)',
                    color: '#ffffff',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.35)',
                    transition: 'background 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover, #0d6460)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--promo-button, #0f766e)')}
                >
                  <span>View Floorplans</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0.4rem',
                  }}
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
