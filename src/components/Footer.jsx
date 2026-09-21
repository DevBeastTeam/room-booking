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

export default function Footer({
  siteSettings,
  onOpenContactSupport,
  onOpenLegal,
  onNavigateHome,
  onNavigateFloorPlans,
  onNavigatePhotos,
  onNavigateGuidelines,
  onNavigateAmenities,
  onNavigateVirtualTour,
  onNavigateMap,
  onNavigateFAQ,
  onNavigateContact,
  onNavigateDashboard,
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'var(--dark-color, #212529)', color: '#e2e8f0', marginTop: '4rem' }}>
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
              {siteSettings?.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings?.siteName || 'Monarch Pass Apartments'}
                  style={{
                    maxHeight: '40px',
                    width: 'auto',
                    backgroundColor: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {siteSettings?.siteName || 'Monarch Pass Apartments'}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              {siteSettings?.footerDescription || 'Modern living nestled in Fort Worth, TX. Experience premier apartment amenities and exceptional community living.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: 'var(--secondary-color, #68c7b7)', flexShrink: 0 }} />
                <a 
                  href={siteSettings?.mapsUrl || 'https://maps.app.goo.gl/E71XfBiE8dE9bAjV6'} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: '#ffffff', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {siteSettings?.address || '4500 Campus Dr, Fort Worth, TX 76119'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} style={{ color: 'var(--secondary-color, #68c7b7)', flexShrink: 0 }} />
                <a href={`tel:${siteSettings?.secondaryPhone?.replace(/[^0-9+]/g, '') || '+18175311750'}`} style={{ color: '#ffffff' }}>
                  {siteSettings?.secondaryPhone || '+1 817-531-1750'}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Management & Social */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <img
                src="https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_250,h_50/s3/2/58193/cw_logo_white-footer_resize-200h(1).png"
                alt="Cushman & Wakefield"
                style={{ height: '42px', width: 'auto', display: 'block' }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto 1.25rem' }}>
              Come explore the wonders of Monarch Pass and find the perfect home that fits your lifestyle!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <a
                href={siteSettings?.social?.facebook || 'https://www.facebook.com/MonarchPassAPTS'}
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
                href={siteSettings?.social?.instagram || 'https://www.instagram.com/lifeatmonarchpass'}
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
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{siteSettings?.officeHours?.monFri || '10:00 AM - 6:00 PM'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                <span>Saturday</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{siteSettings?.officeHours?.sat || '10:00 AM - 5:00 PM'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sunday</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{siteSettings?.officeHours?.sun || '1:00 PM - 5:00 PM'}</span>
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
            gap: '1.25rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: '1.5rem',
          }}
        >
          <a
            href="/"
            onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Home
          </a>
          <a
            href="/amenities"
            onClick={(e) => { if (onNavigateAmenities) { e.preventDefault(); onNavigateAmenities(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Amenities
          </a>
          <a
            href="/floor-plans"
            onClick={(e) => { if (onNavigateFloorPlans) { e.preventDefault(); onNavigateFloorPlans(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Floor Plans
          </a>
          <a
            href="/photos"
            onClick={(e) => { if (onNavigatePhotos) { e.preventDefault(); onNavigatePhotos(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Photos
          </a>
          <a
            href="/virtual-tour"
            onClick={(e) => { if (onNavigateVirtualTour) { e.preventDefault(); onNavigateVirtualTour(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Virtual Tour
          </a>
          <a
            href="/income-guidelines"
            onClick={(e) => { if (onNavigateGuidelines) { e.preventDefault(); onNavigateGuidelines(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Income Guidelines
          </a>
          <a
            href="/map"
            onClick={(e) => { if (onNavigateMap) { e.preventDefault(); onNavigateMap(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Map
          </a>
          <a
            href="/contact"
            onClick={(e) => { if (onNavigateContact) { e.preventDefault(); onNavigateContact(); } else if (onOpenContactSupport) { e.preventDefault(); onOpenContactSupport(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Contact Us
          </a>
          <a
            href="/faq"
            onClick={(e) => { if (onNavigateFAQ) { e.preventDefault(); onNavigateFAQ(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            FAQ
          </a>
          <a
            href={siteSettings?.portals?.resident || 'https://monarchpassapts.securecafe.com/residentservices/ladera-palms-0/userlogin.aspx'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Resident Login
          </a>
          <a
            href={siteSettings?.portals?.applicant || 'https://monarchpassapts.securecafe.com/onlineleasing/ladera-palms-0/guestlogin.aspx'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Applicant Login
          </a>
          <a
            href="#terms-conditions"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenLegal) onOpenLegal('terms');
              else window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { pageType: 'terms' } }));
            }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Terms and Conditions
          </a>
          <a
            href="#privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenLegal) onOpenLegal('privacy');
              else window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { pageType: 'privacy' } }));
            }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Privacy Policy
          </a>
          <a
            href="#accessibility"
            onClick={(e) => { e.preventDefault(); if (onOpenLegal) onOpenLegal('accessibility'); }}
            style={{ transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
          >
            Accessibility Statement
          </a>
        </div>

        {/* Legal & Copyright */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.78rem',
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          {/* Equal Housing Opportunity SVG */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg
              role="img"
              aria-label="Equal housing opportunity"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
              viewBox="0 0 15.2 10.72"
              fill="#cbd5e1"
            >
              <path d="M7.54,0,0,3.72V5.46H.84V10.7H14.19V5.46h1V3.72Zm5,9.12H2.48V4.34l5.06-2.6,5,2.6Z" />
              <polygon points="9.85 6.02 5.18 6.02 5.18 4.34 9.85 4.34 9.85 6.02 9.85 6.02" />
              <polygon points="9.85 8.44 5.18 8.44 5.18 6.76 9.85 6.76 9.85 8.44 9.85 8.44" />
            </svg>
            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Equal Housing Opportunity</span>
          </div>

          <div>
            {siteSettings?.copyrightText || '© 2026 Cushman & Wakefield All Rights Reserved. | Powered by RentCafe (© 2026 Yardi Systems, Inc. All Rights Reserved.)'}
          </div>
        </div>
      </div>
    </footer>
  );
}
