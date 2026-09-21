import React, { useState } from 'react';
import { 
  Phone, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  ShieldCheck, 
  Camera, 
  Layers, 
  MapPin, 
  Calendar, 
  HelpCircle,
  Home,
  Sparkles,
  Compass,
  CreditCard
} from 'lucide-react';

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

export default function Header({
  currentView = 'home',
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
  onNavigateAdmin,
  siteSettings,
  onOpenContactSupport,
  onOpenScheduleTour,
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isHomeActive = currentView === 'home';
  const isFloorPlansActive = currentView === 'floorplans' || currentView === 'estimator';
  const isPhotosActive = currentView === 'photos';
  const isGuidelinesActive = currentView === 'guidelines';
  const isAmenitiesActive = currentView === 'amenities';
  const isVirtualTourActive = currentView === 'virtualtour';
  const isMapActive = currentView === 'map';
  const isFAQActive = currentView === 'faq';
  const isContactActive = currentView === 'contact';

  const handleNavHome = onNavigateHome || (() => { window.location.href = '/'; });
  const handleNavFloorPlans = onNavigateFloorPlans || (() => { window.location.href = '/floor-plans'; });
  const handleNavPhotos = onNavigatePhotos || (() => { window.location.href = '/photos'; });
  const handleNavGuidelines = onNavigateGuidelines || (() => { window.location.href = '/income-guidelines'; });
  const handleNavAmenities = onNavigateAmenities || (() => { window.location.href = '/amenities'; });
  const handleNavVirtualTour = onNavigateVirtualTour || (() => { window.location.href = '/virtual-tour'; });
  const handleNavMap = onNavigateMap || (() => { window.location.href = '/map'; });
  const handleNavFAQ = onNavigateFAQ || (() => { window.location.href = '/faq'; });
  const handleNavContact = onNavigateContact || (() => { window.location.href = '/contact'; });
  const handleNavDashboard = onNavigateDashboard || (() => { window.location.href = '/dashboard'; });
  const handleNavAdmin = onNavigateAdmin || (() => { window.location.href = '/admin'; });
  const handleContactSupport = onOpenContactSupport || (() => { window.dispatchEvent(new CustomEvent('open-contact-modal')); });
  const handleScheduleTour = onOpenScheduleTour || ((bed = '', unit = '') => { window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } })); });

  const navLinks = [
    { label: 'Home', active: isHomeActive, onClick: handleNavHome, href: '/' },
    { label: 'Amenities', active: isAmenitiesActive, onClick: handleNavAmenities, href: '/amenities' },
    { label: 'Floor Plans', active: isFloorPlansActive, onClick: handleNavFloorPlans, href: '/floor-plans' },
    { 
      label: 'Photos', 
      active: isPhotosActive || isVirtualTourActive, 
      onClick: handleNavPhotos,
      href: '/photos',
      badge: '26',
      subLinks: [
        { label: 'Photos', active: isPhotosActive, onClick: handleNavPhotos, href: '/photos' },
        { label: 'Virtual Tour', active: isVirtualTourActive, onClick: handleNavVirtualTour, href: '/virtual-tour' },
      ]
    },
    { label: 'Income Guidelines', active: isGuidelinesActive, onClick: handleNavGuidelines, href: '/income-guidelines' },
    { label: 'Map', active: isMapActive, onClick: handleNavMap, href: '/map' },
    { label: 'Contact Us', active: isContactActive, onClick: handleNavContact, href: '/contact' },
    { label: 'FAQ', active: isFAQActive, onClick: handleNavFAQ, href: '/faq' },
    { label: 'Schedule a Tour', active: false, onClick: () => handleScheduleTour() },
  ];

  return (
    <header className="header-wrapper" style={{ position: 'relative', width: '100%' }}>
      {/* Top Utility Bar */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          zIndex: 40,
        }}
      >
        <div 
          className="container" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0.6rem 1.5rem',
            gap: '1.25rem',
          }}
        >
          {/* Phone Number */}
          <a 
            href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+18178578782'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'underline',
            }}
          >
            <Phone size={15} style={{ color: '#2c3038' }} />
            <span>{siteSettings?.phone || '+1 817-857-8782'}</span>
          </a>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1' }} />

          {/* Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a 
              href={siteSettings?.social?.facebook || 'https://www.facebook.com/MonarchPassAPTS'} 
              target="_blank" 
              rel="noreferrer"
              aria-label="Facebook"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #334155',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s',
              }}
            >
              <FacebookIcon size={16} />
            </a>
            <a 
              href={siteSettings?.social?.instagram || 'https://www.instagram.com/lifeatmonarchpass'} 
              target="_blank" 
              rel="noreferrer"
              aria-label="Instagram"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #334155',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s',
              }}
            >
              <InstagramIcon size={16} />
            </a>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1' }} />

          {/* Translate | Traducir Button (Google Translate Integration) */}
          <button
            id="btn-translate"
            onClick={() => {
              const currentUrl = encodeURIComponent(window.location.href);
              window.open(`https://translate.google.com/translate?sl=auto&tl=es&u=${currentUrl}`, '_blank');
            }}
            style={{
              backgroundColor: '#4a4e57',
              color: '#ffffff',
              padding: '0.42rem 0.9rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#373a42'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4a4e57'}
            title="Translate Page to Spanish | Traducir al Español"
          >
            <span>TRANSLATE | TRADUCIR</span>
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1' }} />

          {/* Login Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              style={{
                backgroundColor: 'var(--primary-color, #0f766e)',
                color: '#ffffff',
                padding: '0.45rem 1rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <User size={14} />
              <span>Login</span>
              <ChevronDown size={14} />
            </button>

            {isLoginOpen && (
              <div
                className="animate-slide-down"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  minWidth: '220px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <a
                  href={siteSettings?.portals?.resident || 'https://monarchpassapts.securecafe.com/residentservices/ladera-palms-0/userlogin.aspx'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsLoginOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    borderBottom: '1px solid #f1f5f9',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <span>Resident Portal</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-color, #0f766e)', backgroundColor: 'var(--primary-light, #ccfbf1)', padding: '2px 6px', borderRadius: '4px' }}>SecureCafe</span>
                </a>
                <a
                  href={siteSettings?.portals?.applicant || 'https://monarchpassapts.securecafe.com/onlineleasing/ladera-palms-0/guestlogin.aspx'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsLoginOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    borderBottom: '1px solid #f1f5f9',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <span>Applicant Portal</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-color, #0f766e)', backgroundColor: 'var(--primary-light, #ccfbf1)', padding: '2px 6px', borderRadius: '4px' }}>SecureCafe</span>
                </a>
                <a
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginOpen(false);
                    handleNavDashboard();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1rem',
                    fontSize: '0.825rem',
                    color: 'var(--primary-color, #0f766e)',
                    borderBottom: '1px solid #f1f5f9',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-light, #f0fdfa)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <LayoutDashboard size={14} />
                  <span>Resident Dashboard (Demo)</span>
                </a>
                <button
                  onClick={() => {
                    setIsLoginOpen(false);
                    window.dispatchEvent(new CustomEvent('open-paddle-checkout', {
                      detail: { item: 'holding_deposit', amount: 250.00 }
                    }));
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1rem',
                    fontSize: '0.825rem',
                    color: '#059669',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <CreditCard size={14} />
                  <span>Pay Deposit / Rent (Paddle)</span>
                </button>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginOpen(false);
                    handleNavAdmin();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1rem',
                    fontSize: '0.825rem',
                    color: '#b45309',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fffbeb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <ShieldCheck size={14} />
                  <span>Admin Panel (Demo)</span>
                </a>
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle navigation"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#1e293b',
              padding: '0.45rem 0.75rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '0.5rem',
            }}
          >
            {isNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Hero Banner with Monarch Pass Logo & Title */}
      <div
        style={{
          position: 'relative',
          height: '280px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.4)), url('${siteSettings?.heroImageUrl || 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          cursor: 'pointer',
        }}
        onClick={onNavigateHome || onNavigateFloorPlans}
      >
        {/* Monarch Pass Logo Badge */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            marginBottom: '1rem',
          }}
        >
          {siteSettings?.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings?.siteName || 'Monarch Pass Apartments'}
              style={{ maxHeight: '42px', width: 'auto', display: 'block' }}
            />
          ) : (
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color, #0f766e)', letterSpacing: '0.02em' }}>
              {siteSettings?.siteName || 'Monarch Pass Apartments'}
            </span>
          )}
        </div>

        {/* Hero Title */}
        <h2
          style={{
            color: '#ffffff',
            fontSize: '1.85rem',
            fontFamily: 'serif',
            fontWeight: 700,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          {siteSettings?.tagline || 'Spacious 1-4 Bedroom Apartments in Fort Worth'}
        </h2>
      </div>

      {/* Primary Navigation Tabs Bar */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.35rem',
            padding: '0.4rem 1rem',
          }}
        >
          {/* Home */}
          <a
            id="tab-home"
            href="/"
            onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isHomeActive ? 700 : 500,
              color: isHomeActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isHomeActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isHomeActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <Home size={15} />
            <span>Home</span>
          </a>

          {/* Floor Plans */}
          <a
            id="tab-floor-plans"
            href="/floor-plans"
            onClick={(e) => { if (onNavigateFloorPlans) { e.preventDefault(); onNavigateFloorPlans(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isFloorPlansActive ? 700 : 500,
              color: isFloorPlansActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isFloorPlansActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isFloorPlansActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <Layers size={15} />
            <span>Floor Plans</span>
          </a>

          {/* Photos */}
          <a
            id="tab-photos"
            href="/photos"
            onClick={(e) => { if (onNavigatePhotos) { e.preventDefault(); onNavigatePhotos(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isPhotosActive ? 700 : 500,
              color: isPhotosActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isPhotosActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isPhotosActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <Camera size={15} />
            <span>Photos</span>
            <span
              style={{
                backgroundColor: isPhotosActive ? 'var(--primary-color, #0f766e)' : '#e2e8f0',
                color: isPhotosActive ? '#ffffff' : '#475569',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '9999px',
              }}
            >
              26
            </span>
          </a>

          {/* Income Guidelines */}
          <a
            id="tab-guidelines"
            href="/income-guidelines"
            onClick={(e) => { if (onNavigateGuidelines) { e.preventDefault(); onNavigateGuidelines(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isGuidelinesActive ? 700 : 500,
              color: isGuidelinesActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isGuidelinesActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isGuidelinesActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <ShieldCheck size={15} />
            <span>Income Guidelines</span>
          </a>

          {/* Amenities */}
          <a
            id="tab-amenities"
            href="/amenities"
            onClick={(e) => { if (onNavigateAmenities) { e.preventDefault(); onNavigateAmenities(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isAmenitiesActive ? 700 : 500,
              color: isAmenitiesActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isAmenitiesActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isAmenitiesActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <Sparkles size={15} />
            <span>Amenities</span>
          </a>

          {/* Virtual Tour */}
          <a
            id="tab-virtual-tour"
            href="/virtual-tour"
            onClick={(e) => { if (onNavigateVirtualTour) { e.preventDefault(); onNavigateVirtualTour(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isVirtualTourActive ? 700 : 500,
              color: isVirtualTourActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isVirtualTourActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isVirtualTourActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <Compass size={15} />
            <span>Virtual Tour</span>
          </a>

          {/* Map & Directions */}
          <a
            id="tab-map"
            href="/map"
            onClick={(e) => { if (onNavigateMap) { e.preventDefault(); onNavigateMap(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isMapActive ? 700 : 500,
              color: isMapActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isMapActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isMapActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <MapPin size={15} />
            <span>Map</span>
          </a>

          {/* FAQ */}
          <a
            id="tab-faq"
            href="/faq"
            onClick={(e) => { if (onNavigateFAQ) { e.preventDefault(); onNavigateFAQ(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isFAQActive ? 700 : 500,
              color: isFAQActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isFAQActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isFAQActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <HelpCircle size={15} />
            <span>FAQ</span>
          </a>

          {/* Contact Us */}
          <a
            id="tab-contact"
            href="/contact"
            onClick={(e) => { if (onNavigateContact) { e.preventDefault(); onNavigateContact(); } }}
            style={{
              padding: '0.6rem 0.95rem',
              fontSize: '0.9rem',
              fontWeight: isContactActive ? 700 : 500,
              color: isContactActive ? 'var(--primary-color, #0f766e)' : '#475569',
              background: isContactActive ? 'var(--primary-light, #f0fdfa)' : 'transparent',
              borderRadius: '6px',
              border: isContactActive ? '1px solid var(--primary-border, #99f6e4)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            <Phone size={15} />
            <span>Contact Us</span>
          </a>

          {/* Schedule a Tour CTA */}
          <button
            id="btn-schedule-tour"
            onClick={() => handleScheduleTour()}
            style={{
              padding: '0.6rem 1.1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'var(--primary-color, #0f766e)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'background 0.2s ease',
              marginLeft: '0.25rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover, #0d6460)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color, #0f766e)')}
          >
            <Calendar size={15} />
            <span>Schedule a Tour</span>
          </button>
        </div>
      </nav>

      {/* Fullscreen Overlay Navigation Drawer */}
      {isNavOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--nav-overlay-bg-rgba, rgba(104, 199, 183, 0.98))',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => setIsNavOpen(false)}
            aria-label="Close navigation"
            style={{
              position: 'absolute',
              top: '24px',
              right: '32px',
              color: '#ffffff',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={28} />
          </button>

          <nav style={{ textAlign: 'center', width: '100%', maxWidth: '400px', maxHeight: '85vh', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  {link.subLinks ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          color: '#ffffff',
                          fontSize: '1.45rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          opacity: link.active ? 1 : 0.9,
                          borderBottom: link.active ? '3px solid #ffffff' : 'none',
                          paddingBottom: '2px',
                        }}
                      >
                        {link.label}
                      </span>
                      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.2rem' }}>
                        {link.subLinks.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              setIsNavOpen(false);
                              if (sub.onClick) sub.onClick();
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.22)',
                              border: sub.active ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.4)',
                              borderRadius: '20px',
                              padding: '0.35rem 0.9rem',
                              color: '#ffffff',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsNavOpen(false);
                        if (link.onClick) link.onClick();
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '1.45rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, opacity 0.2s',
                        display: 'inline-block',
                        opacity: link.active ? 1 : 0.85,
                        borderBottom: link.active ? '3px solid #ffffff' : 'none',
                        paddingBottom: '4px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = link.active ? '1' : '0.85'}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
