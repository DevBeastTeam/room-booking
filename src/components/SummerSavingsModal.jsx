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
              {/* ── In-house promo banner ──────────────────────────────────────
                  Previously this slot loaded a third-party RentCafe asset for a
                  different property, which carried the old "MONARCH PASS"
                  wordmark and offered terms we do not actually publish.
                  It is now rendered in-house so the branding and the offer
                  always match the site. */}
              <div
                role="img"
                aria-label="Monar Pass summer savings: rent from $898 per month, up to 4 weeks free on select lease terms, $250 holding deposit, pet friendly."
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  padding: '1.75rem 1.5rem',
                  textAlign: 'left',
                  background:
                    'linear-gradient(145deg, #1b1710 0%, #0d1017 45%, #101722 100%)',
                  border: '1px solid rgba(201, 169, 110, 0.35)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                  isolation: 'isolate',
                }}
              >
                {/* Decorative glow + hairline frame */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-60%',
                    right: '-18%',
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(201,169,110,0.30) 0%, rgba(201,169,110,0) 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '10px',
                    border: '1px solid rgba(201, 169, 110, 0.16)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Eyebrow */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#e3c78d',
                      background: 'rgba(201, 169, 110, 0.13)',
                      border: '1px solid rgba(201, 169, 110, 0.32)',
                      borderRadius: '999px',
                      padding: '0.28rem 0.7rem',
                      marginBottom: '0.9rem',
                    }}
                  >
                    <Sparkles size={11} />
                    Summer Specials
                  </div>

                  {/* Headline */}
                  <div
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '2.05rem',
                      lineHeight: 1.1,
                      fontWeight: 700,
                      color: '#f4efe6',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Up to <span style={{ color: '#d9b877' }}>4 Weeks Free</span>
                  </div>
                  <p
                    style={{
                      margin: '0 0 1.15rem',
                      fontSize: '0.8rem',
                      lineHeight: 1.6,
                      color: '#9fb0c6',
                      maxWidth: '30ch',
                    }}
                  >
                    On select 12-month lease terms at Monar Pass Apartments.
                    Availability is limited.
                  </p>

                  {/* Offer strip */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '0.5rem',
                      borderTop: '1px solid rgba(201, 169, 110, 0.18)',
                      paddingTop: '0.9rem',
                    }}
                  >
                    {[
                      { k: 'Rent from', v: '$898' },
                      { k: 'Deposit', v: '$250' },
                      { k: 'Pet friendly', v: 'Yes' },
                    ].map((s) => (
                      <div key={s.k}>
                        <div
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: '#f4efe6',
                            lineHeight: 1.2,
                          }}
                        >
                          {s.v}
                        </div>
                        <div
                          style={{
                            fontSize: '0.62rem',
                            letterSpacing: '0.09em',
                            textTransform: 'uppercase',
                            color: '#7e8ea6',
                            marginTop: '0.2rem',
                          }}
                        >
                          {s.k}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
