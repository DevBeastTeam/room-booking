import React from 'react';
import { Phone, MapPin, Mail, Clock, Shield, Award } from 'lucide-react';

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#212529', color: '#e2e8f0', marginTop: '4rem' }}>
      {/* Top Footer Section */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Column 1: Property Info */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <img
                src="https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_240,h_50/s3/2/58193/pn_monarchpass_logo_pms%20web.png"
                alt="Monarch Pass Apartments"
                style={{
                  maxHeight: '40px',
                  width: 'auto',
                  backgroundColor: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '4px',
                }}
              />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              Modern living nestled in Fort Worth, TX. Experience premier apartment amenities and exceptional community living.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: '#68c7b7', flexShrink: 0 }} />
                <span>4500 Campus Dr, Fort Worth, TX 76119</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} style={{ color: '#68c7b7', flexShrink: 0 }} />
                <a href="tel:+18173919347" style={{ color: '#ffffff' }}>+1 817-391-9347</a>
              </div>
            </div>
          </div>

          {/* Column 2: Management & Social */}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#ffffff' }}>
              Managed By
            </h4>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                padding: '1.25rem',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', color: '#ffffff' }}>
                CUSHMAN & WAKEFIELD
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                Excellence in Multifamily Living
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#3b5998',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e1306c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Column 3: Office Hours */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: '#ffffff' }}>
              Leasing Office Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                <span>Monday - Friday</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>8:30 AM - 5:30 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                <span>Saturday</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>10:00 AM - 5:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sunday</span>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>Closed</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

        {/* Footer Navigation Links */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: '1.5rem',
          }}
        >
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#ffffff')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>Resident Login</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#ffffff')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>Applicant Login</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#ffffff')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>Floor Plans</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#ffffff')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>Privacy Policy</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#ffffff')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>Terms & Conditions</a>
          <a href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#ffffff')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>Contact Us</a>
        </div>

        {/* Legal & Copyright */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.75rem',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={16} style={{ color: '#94a3b8' }} />
              <span>Equal Housing Opportunity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} style={{ color: '#94a3b8' }} />
              <span>Handicapped Accessible</span>
            </div>
          </div>
          <div>
            &copy; 2026 Monarch Pass Apartments · Cushman & Wakefield. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
