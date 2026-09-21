import React from 'react';
import { Phone, MapPin, Mail, Clock, Shield, Award } from 'lucide-react';

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
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
    <footer style={{ backgroundColor: '#05060a', color: '#e8e0d4', borderTop: '1px solid rgba(201, 169, 110, 0.16)', marginTop: '4rem' }}>
      {/* Top Footer Section */}
      <div className="container" style={{ padding: '4rem 1.5rem 2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Property Info & Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#08090f',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
                }}
              >
                M
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#f4efe6' }}>
                  MONARCH PASS
                </span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a96e' }}>
                  Luxury Apartment Residences
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#9e9282', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {siteSettings?.footerDescription || 'Elevated apartment living nestled in Fort Worth, TX. Featuring 1 to 4-bedroom layouts, resort-inspired amenities, and professional Cushman & Wakefield on-site management.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={15} style={{ color: '#c9a96e', flexShrink: 0 }} />
                <a 
                  href={siteSettings?.mapsUrl || 'https://maps.app.goo.gl/E71XfBiE8dE9bAjV6'} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: '#dfc285', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {siteSettings?.address || '4500 Campus Dr, Fort Worth, TX 76119'}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={15} style={{ color: '#c9a96e', flexShrink: 0 }} />
                <a 
                  href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+18178578782'}`} 
                  style={{ color: '#f4efe6', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.color = '#f4efe6'}
                >
                  {siteSettings?.phone || '(817) 857-8782'}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Management & Social */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <img
                src="https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_250,h_50/s3/2/58193/cw_logo_white-footer_resize-200h(1).png"
                alt="Cushman & Wakefield"
                style={{ height: '38px', width: 'auto', display: 'block', opacity: 0.9 }}
              />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#9e9282', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto 1.25rem' }}>
              Professionally managed community committed to exceptional residential service, prompt maintenance, and equal housing opportunity.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <a
                href={siteSettings?.social?.facebook || 'https://www.facebook.com/MonarchPassAPTS'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dfc285',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                  e.currentTarget.style.borderColor = '#c9a96e';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.25)';
                }}
              >
                <FacebookIcon size={15} />
              </a>

              <a
                href={siteSettings?.social?.instagram || 'https://www.instagram.com/lifeatmonarchpass'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dfc285',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                  e.currentTarget.style.borderColor = '#c9a96e';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.25)';
                }}
              >
                <InstagramIcon size={15} />
              </a>
            </div>
          </div>

          {/* Column 3: Office Hours */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
              <Clock size={16} style={{ color: '#c9a96e' }} />
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c9a96e', margin: 0 }}>
                Leasing Office Hours
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84rem', color: '#b5a999' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.45rem' }}>
                <span>Monday – Friday</span>
                <span style={{ fontWeight: 600, color: '#f4efe6' }}>{siteSettings?.officeHours?.monFri || '10:00 AM - 6:00 PM'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.45rem' }}>
                <span>Saturday</span>
                <span style={{ fontWeight: 600, color: '#f4efe6' }}>{siteSettings?.officeHours?.sat || '10:00 AM - 5:00 PM'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sunday</span>
                <span style={{ fontWeight: 600, color: '#f4efe6' }}>{siteSettings?.officeHours?.sun || '1:00 PM - 5:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(201, 169, 110, 0.12)', margin: '2rem 0 1.5rem' }} />

        {/* Footer Navigation Links */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#8c8273',
            marginBottom: '1.75rem',
          }}
        >
          <a
            href="/"
            onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Home
          </a>
          <a
            href="/floor-plans"
            onClick={(e) => { if (onNavigateFloorPlans) { e.preventDefault(); onNavigateFloorPlans(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Floor Plans
          </a>
          <a
            href="/amenities"
            onClick={(e) => { if (onNavigateAmenities) { e.preventDefault(); onNavigateAmenities(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Amenities
          </a>
          <a
            href="/photos"
            onClick={(e) => { if (onNavigatePhotos) { e.preventDefault(); onNavigatePhotos(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Photos
          </a>
          <a
            href="/virtual-tour"
            onClick={(e) => { if (onNavigateVirtualTour) { e.preventDefault(); onNavigateVirtualTour(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Virtual Tour
          </a>
          <a
            href="/income-guidelines"
            onClick={(e) => { if (onNavigateGuidelines) { e.preventDefault(); onNavigateGuidelines(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Income Guidelines
          </a>
          <a
            href="/map"
            onClick={(e) => { if (onNavigateMap) { e.preventDefault(); onNavigateMap(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Map
          </a>
          <a
            href="/faq"
            onClick={(e) => { if (onNavigateFAQ) { e.preventDefault(); onNavigateFAQ(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            FAQ
          </a>
          <a
            href="/contact"
            onClick={(e) => { if (onNavigateContact) { e.preventDefault(); onNavigateContact(); } else if (onOpenContactSupport) { e.preventDefault(); onOpenContactSupport(); } }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Contact
          </a>
          <a
            href="#terms-conditions"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenLegal) onOpenLegal('terms');
              else window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { pageType: 'terms' } }));
            }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Terms
          </a>
          <a
            href="#privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenLegal) onOpenLegal('privacy');
              else window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { pageType: 'privacy' } }));
            }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Privacy
          </a>
          <a
            href="#accessibility"
            onClick={(e) => { e.preventDefault(); if (onOpenLegal) onOpenLegal('accessibility'); }}
            style={{ transition: 'color 0.2s', cursor: 'pointer', color: '#8c8273', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8273')}
          >
            Accessibility
          </a>
        </div>

        {/* Legal & Copyright */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.76rem',
            color: '#6e6557',
            textAlign: 'center',
          }}
        >
          {/* Equal Housing Opportunity SVG */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg
              role="img"
              aria-label="Equal housing opportunity"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="18"
              viewBox="0 0 15.2 10.72"
              fill="#c9a96e"
            >
              <path d="M7.54,0,0,3.72V5.46H.84V10.7H14.19V5.46h1V3.72Zm5,9.12H2.48V4.34l5.06-2.6,5,2.6Z" />
              <polygon points="9.85 6.02 5.18 6.02 5.18 4.34 9.85 4.34 9.85 6.02 9.85 6.02" />
              <polygon points="9.85 8.44 5.18 8.44 5.18 6.76 9.85 6.76 9.85 8.44 9.85 8.44" />
            </svg>
            <span style={{ fontWeight: 600, color: '#b5a999' }}>Equal Housing Opportunity</span>
          </div>

          <div>
            {siteSettings?.copyrightText || '© 2026 Monarch Pass Apartments · Cushman & Wakefield. All Rights Reserved.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
