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
          backgroundColor: 'var(--nav-bg)',
          borderTop: '1px solid var(--border-color)',
          padding: '0.65rem 1rem',
          zIndex: 990,
          boxShadow: '0 -8px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="btn-gold"
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '0.65rem 1.25rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={16} />
          <span>Exclusive Summer Specials</span>
        </button>
      </div>

      {/* ── Modal Dialog ── */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 14, 0.85)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="animate-scale-up"
            style={{
              backgroundColor: 'var(--modal-bg, var(--bg-surface))',
              color: 'var(--text-main)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--modal-header-bg, linear-gradient(135deg, rgba(201, 169, 110, 0.2) 0%, rgba(12, 16, 28, 0.95) 100%))',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#dfc285',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                }}
              >
                <Sparkles size={18} style={{ color: '#c9a96e' }} />
                <span>Limited-Time Summer Specials</span>
              </h3>
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  color: '#c9a96e',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              <div
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  backgroundColor: 'rgba(8, 10, 18, 0.8)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  padding: '0.5rem',
                }}
              >
                <img
                  src="https://cdngeneralcf.rentcafe.com/dmslivecafe/2/58193/Buchanan Pop Ups (4).png"
                  alt="Monarch Pass Summer Savings Promo"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '360px',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '8px',
                  }}
                  loading="eager"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  id="btn-nudge-view-floorplans"
                  onClick={handleAction}
                  className="btn-gold"
                  style={{
                    padding: '0.9rem 1.5rem',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Explore Available Residences</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={handleClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0.4rem',
                  }}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
