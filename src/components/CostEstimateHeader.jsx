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
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: isSticky ? 'sticky' : 'relative',
        top: isSticky ? 0 : 'auto',
        zIndex: 30,
        boxShadow: isSticky ? '0 4px 15px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.25s ease',
        marginBottom: '1.5rem',
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
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#cbd5e1')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Cost Estimate
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
              borderLeft: '3px solid #68c7b7',
              paddingLeft: '1rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#64748b' }}>
              TOTAL MONTHLY LEASING PRICE
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b' }}>
                ${totalMonthlyPrice.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Base rent ${baseRent.toFixed(2)} · {leaseTerm}-month term
              </span>
            </div>
          </div>
        )}

        {/* Right: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onOpenEmailModal}
            className="btn-secondary"
            style={{
              borderColor: '#68c7b7',
              color: '#2a7c70',
              backgroundColor: '#f0fdfa',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
            }}
          >
            <Mail size={16} />
            <span>Email My Costs</span>
          </button>

          <a
            href="https://monarchpassapts.securecafe.com/onlineleasing/ladera-palms-0/oleapplication.aspx"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{
              backgroundColor: '#2c3038',
              padding: '0.65rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Apply Now</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
