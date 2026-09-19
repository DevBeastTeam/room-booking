import React, { useState } from 'react';
import { Phone, User, Menu, X, ChevronDown, LayoutDashboard, ShieldCheck } from 'lucide-react';

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

export default function Header({ onNavigateFloorPlans, onNavigateDashboard, onNavigateAdmin }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#', onClick: onNavigateFloorPlans },
    { label: 'Amenities', href: '#' },
    { label: 'Floor Plans', href: '#', active: true, onClick: onNavigateFloorPlans },
    { label: 'Photos', href: '#' },
    { label: 'Virtual Tour', href: '#' },
    { label: 'Income Guidelines', href: '#' },
    { label: 'Map', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Schedule a Tour', href: '#' },
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
            href="tel:+18176465785"
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
            <span>+1 817-646-5785</span>
          </a>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1' }} />

          {/* Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a 
              href="https://facebook.com" 
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
              href="https://instagram.com" 
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

          {/* Dashboard Button */}
          <button
            id="btn-dashboard"
            onClick={onNavigateDashboard}
            style={{
              backgroundColor: '#0f766e',
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
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0d6460'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f766e'}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          {/* Admin Panel Button */}
          <button
            id="btn-admin"
            onClick={onNavigateAdmin}
            style={{
              backgroundColor: '#92400e',
              color: '#fbbf24',
              padding: '0.45rem 1rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#78350f'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#92400e'}
          >
            <ShieldCheck size={15} />
            <span>Admin</span>
          </button>

          {/* Login Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              style={{
                backgroundColor: '#4a4e57',
                color: '#ffffff',
                padding: '0.45rem 1rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
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
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  minWidth: '170px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <a
                  href="#resident-login"
                  onClick={(e) => { e.preventDefault(); setIsLoginOpen(false); onNavigateDashboard && onNavigateDashboard(); }}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: '#334155',
                    borderBottom: '1px solid #f1f5f9',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Resident Login
                </a>
                <a
                  href="#applicant-login"
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    color: '#334155',
                    fontWeight: 500,
                  }}
                >
                  Applicant Login
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
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.4)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          cursor: 'pointer',
        }}
        onClick={onNavigateFloorPlans}
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
          <img
            src="https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_325,h_60/s3/2/58193/pn_monarchpass_logo_pms%20web.png"
            alt="Monarch Pass Apartments"
            style={{ maxHeight: '42px', width: 'auto', display: 'block' }}
          />
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
          Spacious 1-4 Bedroom Apartments in Fort Worth
        </h2>
      </div>

      {/* Fullscreen Overlay Navigation Drawer */}
      {isNavOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(104, 199, 183, 0.97)',
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

          <nav style={{ textAlign: 'center' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    onClick={() => {
                      setIsNavOpen(false);
                      if (link.onClick) link.onClick();
                    }}
                    style={{
                      color: '#ffffff',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      textDecoration: 'none',
                      transition: 'transform 0.2s, opacity 0.2s',
                      display: 'inline-block',
                      opacity: link.active ? 1 : 0.85,
                      borderBottom: link.active ? '3px solid #ffffff' : 'none',
                      paddingBottom: '4px',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
