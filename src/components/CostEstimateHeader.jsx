import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react';

export default function CostEstimateHeader({ 
  totalMonthlyPrice, 
  baseRent, 
  leaseTerm, 
  onOpenEmailModal,
  onBack,
}) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'rgba(12, 16, 28, 0.95)',
        borderBottom: '1px solid rgba(201, 169, 110, 0.25)',
        position: isSticky ? 'sticky' : 'relative',
        top: isSticky ? 0 : 'auto',
        zIndex: 30,
        boxShadow: isSticky ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.25s ease',
        marginBottom: '2rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Left: Back Button & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBack}
            aria-label="Go back to floor plans"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              color: '#c9a96e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.15)';
              e.currentTarget.style.borderColor = '#dfc285';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)';
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c9a96e', fontWeight: 700 }}>
              Personalized Quote
            </span>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 600,
                color: '#f8fafc',
                lineHeight: 1.2,
                margin: 0,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
              }}
            >
              Lease Cost Estimate
            </h1>
          </div>
        </div>

        {/* Center / Sticky Summary */}
        {isSticky && (
          <div 
            className="animate-fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderLeft: '3px solid #c9a96e',
              paddingLeft: '1rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#dfc285', textTransform: 'uppercase' }}>
              Total Estimated Monthly
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc' }}>
                ${totalMonthlyPrice.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Base rent ${baseRent.toFixed(2)} · {leaseTerm}-month term
              </span>
            </div>
          </div>
        )}

        {/* Right: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onOpenEmailModal}
            className="btn-outline-gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              fontSize: '0.85rem',
            }}
          >
            <Mail size={16} />
            <span>Email Breakdown</span>
          </button>

          <a
            href="https://monarchpassapts.securecafe.com/onlineleasing/ladera-palms-0/oleapplication.aspx"
            target="_blank"
            rel="noreferrer"
            className="btn-gold"
            style={{
              padding: '0.65rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
            }}
          >
            <span>Apply Online</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
