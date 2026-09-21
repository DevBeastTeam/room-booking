import React, { useState, useEffect } from 'react';
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
  CreditCard,
  ArrowRight,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { getThemeMode, toggleThemeMode } from '../config/themeConfig';

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
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
  const [themeMode, setLocalThemeMode] = useState(() => getThemeMode());

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail?.mode) setLocalThemeMode(e.detail.mode);
    };
    window.addEventListener('theme-mode-changed', handleThemeChange);
    return () => window.removeEventListener('theme-mode-changed', handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const next = toggleThemeMode();
    setLocalThemeMode(next);
  };

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
  const handleScheduleTour = onOpenScheduleTour || ((bed = '', unit = '') => { 
    window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } })); 
  });

  const navLinks = [
    { label: 'Home', active: isHomeActive, onClick: handleNavHome, href: '/', id: 'tab-home' },
    { label: 'Floor Plans', active: isFloorPlansActive, onClick: handleNavFloorPlans, href: '/floor-plans', id: 'tab-floor-plans' },
    { label: 'Amenities', active: isAmenitiesActive, onClick: handleNavAmenities, href: '/amenities', id: 'tab-amenities' },
    { 
      label: 'Photos', 
      active: isPhotosActive, 
      onClick: handleNavPhotos, 
      href: '/photos', 
      id: 'tab-photos',
      badge: '26' 
    },
    { label: 'Virtual Tour', active: isVirtualTourActive, onClick: handleNavVirtualTour, href: '/virtual-tour', id: 'tab-virtual-tour' },
    { label: 'Income Guidelines', active: isGuidelinesActive, onClick: handleNavGuidelines, href: '/income-guidelines', id: 'tab-guidelines' },
    { label: 'Location', active: isMapActive, onClick: handleNavMap, href: '/map', id: 'tab-map' },
    { label: 'FAQ', active: isFAQActive, onClick: handleNavFAQ, href: '/faq', id: 'tab-faq' },
    { label: 'Contact', active: isContactActive, onClick: handleNavContact, href: '/contact', id: 'tab-contact' },
  ];

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* ── 1. Top Luxury Utility Bar ── */}
      <div 
        style={{
          backgroundColor: '#06070c',
          borderBottom: '1px solid rgba(201, 169, 110, 0.12)',
          fontSize: '0.78rem',
          letterSpacing: '0.03em',
          color: '#a39886',
        }}
      >
        <div 
          className="container" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 1.5rem',
            gap: '1rem',
          }}
        >
          {/* Left: Quick Contact & Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a 
              href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+18178578782'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#e8e0d4',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color, #c9a96e)'}
              onMouseLeave={e => e.currentTarget.style.color = '#e8e0d4'}
            >
              <Phone size={13} style={{ color: 'var(--primary-color, #c9a96e)' }} />
              <span>{siteSettings?.phone || '(817) 857-8782'}</span>
            </a>

            <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '0.4rem', color: '#82786a' }} className="hide-mobile">
              <MapPin size={13} style={{ color: 'var(--primary-color, #c9a96e)' }} />
              <span>4500 Campus Dr, Fort Worth, TX 76119</span>
            </div>
          </div>

          {/* Right: Actions, Translate, Portals & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Social Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <a 
                href={siteSettings?.social?.facebook || 'https://www.facebook.com/MonarchPassAPTS'} 
                target="_blank" 
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  color: '#c9a96e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                  e.currentTarget.style.borderColor = '#c9a96e';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.2)';
                }}
              >
                <FacebookIcon size={13} />
              </a>

              <a 
                href={siteSettings?.social?.instagram || 'https://www.instagram.com/lifeatmonarchpass'} 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  color: '#c9a96e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                  e.currentTarget.style.borderColor = '#c9a96e';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.2)';
                }}
              >
                <InstagramIcon size={13} />
              </a>
            </div>

            <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

            {/* Theme Switcher Button (Dark / Light) */}
            <button
              id="btn-theme-toggle"
              onClick={handleToggleTheme}
              aria-label={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} luxury theme`}
              style={{
                backgroundColor: themeMode === 'light' ? 'rgba(164, 124, 42, 0.12)' : 'rgba(201, 169, 110, 0.12)',
                color: themeMode === 'light' ? '#a47c2a' : '#dfc285',
                padding: '0.28rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                border: themeMode === 'light' ? '1px solid rgba(164, 124, 42, 0.3)' : '1px solid rgba(201, 169, 110, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
              }}
              title={themeMode === 'dark' ? 'Switch to Light Luxury Theme' : 'Switch to Dark Luxury Theme'}
            >
              {themeMode === 'dark' ? <Sun size={13} style={{ color: '#dfc285' }} /> : <Moon size={13} style={{ color: '#a47c2a' }} />}
              <span>{themeMode === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>

            {/* Translate Button */}
            <button
              id="btn-translate"
              onClick={() => {
                const currentUrl = encodeURIComponent(window.location.href);
                window.open(`https://translate.google.com/translate?sl=auto&tl=es&u=${currentUrl}`, '_blank');
              }}
              style={{
                backgroundColor: 'rgba(201, 169, 110, 0.08)',
                color: '#dfc285',
                padding: '0.28rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                e.currentTarget.style.borderColor = '#dfc285';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.25)';
              }}
              title="Translate Page to Spanish | Traducir al Español"
            >
              <span>ESPAÑOL</span>
            </button>

            {/* Login Menu Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#f0ebe0',
                  padding: '0.32rem 0.8rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color, #c9a96e)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
              >
                <User size={13} style={{ color: 'var(--primary-color, #c9a96e)' }} />
                <span>Portals</span>
                <ChevronDown size={12} />
              </button>

              {isLoginOpen && (
                <div
                  className="animate-slide-down"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '125%',
                    backgroundColor: '#0c0f18',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 0 1px rgba(201, 169, 110, 0.2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 169, 110, 0.2)',
                    minWidth: '240px',
                    zIndex: 60,
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
                      fontSize: '0.82rem',
                      color: '#f0ebe0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>Resident Portal</span>
                    <span style={{ fontSize: '0.65rem', color: '#c9a96e', backgroundColor: 'rgba(201, 169, 110, 0.15)', padding: '2px 6px', borderRadius: '3px' }}>SecureCafe</span>
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
                      fontSize: '0.82rem',
                      color: '#f0ebe0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>Applicant Portal</span>
                    <span style={{ fontSize: '0.65rem', color: '#c9a96e', backgroundColor: 'rgba(201, 169, 110, 0.15)', padding: '2px 6px', borderRadius: '3px' }}>SecureCafe</span>
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
                      padding: '0.7rem 1rem',
                      fontSize: '0.82rem',
                      color: '#dfc285',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
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
                      padding: '0.7rem 1rem',
                      fontSize: '0.82rem',
                      color: '#4ade80',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.1)'}
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
                      padding: '0.7rem 1rem',
                      fontSize: '0.82rem',
                      color: '#f59e0b',
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <ShieldCheck size={14} />
                    <span>Admin Panel (Demo)</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-label="Toggle navigation"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                color: '#e8e0d4',
                padding: '0.35rem 0.6rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Primary Luxury Navigation Bar ── */}
      <nav 
        style={{
          backgroundColor: 'rgba(8, 9, 15, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201, 169, 110, 0.16)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div 
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
            padding: '0 1.5rem',
            gap: '1.5rem',
          }}
        >
          {/* Brand Identity & Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavHome();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {/* Elegant Monogram Crest */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 50%, #8c6e3b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#08090f',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.55rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(201, 169, 110, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                flexShrink: 0,
              }}
            >
              M
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#f4efe6',
                  lineHeight: 1.1,
                }}
              >
                MONARCH PASS
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#c9a96e',
                }}
              >
                Luxury Residences · Fort Worth
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.35rem',
              flex: 1,
              justifyContent: 'center',
            }}
            className="desktop-nav-container"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  link.onClick();
                }}
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.84rem',
                  fontWeight: link.active ? 600 : 500,
                  color: link.active ? '#dfc285' : '#b8ada0',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  if (!link.active) e.currentTarget.style.color = '#f0ebe0';
                }}
                onMouseLeave={e => {
                  if (!link.active) e.currentTarget.style.color = '#b8ada0';
                }}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(201, 169, 110, 0.2)',
                      color: '#dfc285',
                      padding: '1px 5px',
                      borderRadius: '10px',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                    }}
                  >
                    {link.badge}
                  </span>
                )}
                {link.active && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '0.75rem',
                      right: '0.75rem',
                      height: '2px',
                      backgroundColor: '#c9a96e',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(201, 169, 110, 0.6)',
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <button
              id="btn-schedule-tour"
              onClick={() => handleScheduleTour()}
              className="btn-outline-gold"
              style={{
                padding: '0.55rem 1.15rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                borderRadius: '4px',
                border: '1px solid rgba(201, 169, 110, 0.45)',
                backgroundColor: 'rgba(201, 169, 110, 0.06)',
                color: '#dfc285',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.18)';
                e.currentTarget.style.borderColor = '#c9a96e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.45)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Calendar size={13} style={{ color: '#c9a96e' }} />
              <span>Schedule Tour</span>
            </button>

            <button
              onClick={handleNavFloorPlans}
              className="btn-gold"
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                border: 'none',
                background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                color: '#08090f',
                cursor: 'pointer',
                display: 'none',
                sm: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 169, 110, 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(201, 169, 110, 0.3)';
              }}
            >
              <span>Explore Units</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── 3. Mobile Navigation Drawer ── */}
      {isNavOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'fixed',
            inset: 0,
            top: '0',
            backgroundColor: 'rgba(8, 9, 15, 0.98)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            zIndex: 2000,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Top Bar inside Mobile Drawer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(201, 169, 110, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                  fontSize: '1.3rem',
                  fontWeight: 700,
                }}
              >
                M
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 600, color: '#f4efe6' }}>
                  MONARCH PASS
                </span>
                <span style={{ fontSize: '0.62rem', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Fort Worth, TX
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsNavOpen(false)}
              aria-label="Close menu"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Mobile Theme Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(201, 169, 110, 0.1)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main, #f4efe6)' }}>
              Appearance Theme
            </span>
            <button
              onClick={handleToggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary-color, #c9a96e)',
                color: 'var(--btn-gold-text, #08090f)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{themeMode === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>

          {/* Navigation Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`mobile-${link.id}`}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setIsNavOpen(false);
                  link.onClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: link.active ? 'rgba(201, 169, 110, 0.12)' : 'transparent',
                  border: link.active ? '1px solid rgba(201, 169, 110, 0.3)' : '1px solid transparent',
                  color: link.active ? '#dfc285' : '#e8e0d4',
                  fontSize: '1rem',
                  fontWeight: link.active ? 600 : 500,
                  textDecoration: 'none',
                }}
              >
                <span>{link.label}</span>
                {link.badge ? (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(201, 169, 110, 0.2)',
                      color: '#dfc285',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    {link.badge}
                  </span>
                ) : (
                  <ArrowRight size={16} style={{ opacity: 0.4 }} />
                )}
              </a>
            ))}
          </div>

          {/* Bottom Actions inside Mobile Drawer */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => {
                setIsNavOpen(false);
                handleScheduleTour();
              }}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                color: '#08090f',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Calendar size={16} />
              <span>Schedule a Guided Tour</span>
            </button>

            <a
              href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+18178578782'}`}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f0ebe0',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <Phone size={16} style={{ color: '#c9a96e' }} />
              <span>Call Leasing: {siteSettings?.phone || '(817) 857-8782'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
