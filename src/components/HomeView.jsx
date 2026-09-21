import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Layers, 
  Sparkles, 
  MapPin, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { saveSupportInquiry } from '../services/siteDataService';

const HERO_SLIDES = [
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/7-web-or-mls-unit%201701-005%20virtually%20staged.jpeg',
    tagline: 'Modern 1, 2, 3 & 4 Bedroom Living',
    title: 'Welcome to Monarch Pass Apartments',
    subtitle: 'Affordable, spacious homes with elevated finishes in Southeast Fort Worth, TX',
  },
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/27-web-or-mls-unit%201701-020%20virtually%20staged.jpeg',
    tagline: 'Thoughtfully Designed Living Spaces',
    title: 'Open Concepts & Premium Comfort',
    subtitle: 'Wood-style plank flooring, energy-efficient appliances & walk-in closets',
  },
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/13-web-or-mls-unit%201701-008%20virtually%20staged.jpeg',
    tagline: 'Vibrant Community Atmosphere',
    title: 'Splash Park, Playgrounds & Courtyard',
    subtitle: 'Everything you and your household need right at your doorstep',
  },
];

export default function HomeView({
  onNavigateFloorPlans,
  onNavigatePhotos,
  onNavigateGuidelines,
  onNavigateAmenities,
  onNavigateVirtualTour,
  onNavigateMap,
  onNavigateContact,
  onOpenScheduleTour,
  siteSettings,
}) {
  const handleFloorPlans = onNavigateFloorPlans || (() => { window.location.href = '/floor-plans'; });
  const handlePhotos = onNavigatePhotos || (() => { window.location.href = '/photos'; });
  const handleGuidelines = onNavigateGuidelines || (() => { window.location.href = '/income-guidelines'; });
  const handleAmenities = onNavigateAmenities || (() => { window.location.href = '/amenities'; });
  const handleVirtualTour = onNavigateVirtualTour || (() => { window.location.href = '/virtual-tour'; });
  const handleMap = onNavigateMap || (() => { window.location.href = '/map'; });
  const handleContact = onNavigateContact || (() => { window.location.href = '/contact'; });
  const handleSchedule = onOpenScheduleTour || ((bed = '', unit = '') => { window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } })); });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bedrooms: '2 Beds',
    message: 'Hello, I am interested in learning more about available apartments at Monarch Pass.',
  });

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    try {
      await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: `Home Inquiry - ${formData.bedrooms}`,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.log('PHP API call fallback', err);
    }

    saveSupportInquiry({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      subject: `Home Inquiry - ${formData.bedrooms}`,
      message: formData.message,
      category: 'Leasing Inquiry',
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bedrooms: '2 Beds',
        message: 'Hello, I am interested in learning more about available apartments at Monarch Pass.',
      });
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* ── 1. HERO SLIDER SECTION ── */}
      <section style={{ position: 'relative', width: '100%', height: '580px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              pointerEvents: idx === currentSlide ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.75) 100%), url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                transform: idx === currentSlide ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 7s ease-out',
              }}
            />
          </div>
        ))}

        {/* Hero Overlay Content */}
        <div
          className="container"
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            color: '#ffffff',
            padding: '0 1.5rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(15, 118, 110, 0.9)',
              color: '#ffffff',
              padding: '0.4rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Sparkles size={14} />
            <span>{HERO_SLIDES[currentSlide].tagline}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontFamily: 'serif',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '1rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
              maxWidth: '860px',
            }}
          >
            {HERO_SLIDES[currentSlide].title}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              maxWidth: '720px',
              margin: '0 auto 2.25rem',
              color: '#f1f5f9',
              lineHeight: 1.6,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {HERO_SLIDES[currentSlide].subtitle}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleFloorPlans}
              style={{
                backgroundColor: 'var(--primary-color, #0f766e)',
                color: '#ffffff',
                padding: '0.85rem 1.85rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(15, 118, 110, 0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover, #0d6460)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color, #0f766e)')}
            >
              <Layers size={18} />
              <span>Explore Floor Plans</span>
            </button>

            <button
              onClick={() => handleSchedule()}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.85rem 1.85rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '2px solid rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              <Calendar size={18} />
              <span>Schedule Guided Tour</span>
            </button>
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)')}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next slide"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)')}
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 20,
          }}
        >
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === currentSlide ? '28px' : '10px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === currentSlide ? '#14b8a6' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* ── 2. QUICK HIGHLIGHT BAR ── */}
      <section style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-light, #f0fdfa)', color: 'var(--primary-color, #0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Layers size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>1 to 4 Bedrooms</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Spacious layouts up to 1,328 Sq Ft</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-light, #f0fdfa)', color: 'var(--primary-color, #0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Income Restricted</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Affordable 30%, 50% & 60% AMI programs</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-light, #f0fdfa)', color: 'var(--primary-color, #0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Community Splash Park</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Plus playground, courtyard & grill stations</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-light, #f0fdfa)', color: 'var(--primary-color, #0f766e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Fort Worth, TX</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>4500 Campus Dr near I-20 & I-35W</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. WELCOME SECTION (AUTHENTIC COPY & IMAGES) ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Image Column */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <img
                  src="https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/36-web-or-mls-4500%20campus%20dr%201005-s2104-002.jpg"
                  alt="Monarch Pass Community Exterior"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '20px',
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 10px 20px rgba(15, 118, 110, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Managed by Cushman & Wakefield
              </div>
            </div>

            {/* Text Column */}
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#0f766e',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                }}
              >
                Welcome to Monarch Pass
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.85rem, 3vw, 2.5rem)',
                  fontFamily: 'serif',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.25,
                  marginBottom: '1.25rem',
                }}
              >
                Comfortable Living in Fort Worth, TX
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: '#475569',
                  marginBottom: '1.25rem',
                }}
              >
                At Monarch Pass, modern convenience meets suburban charm in Fort Worth, TX. Our 1, 2, 3, and 4-bedroom affordable apartments feature open floor plans, energy-efficient appliances, and contemporary finishes designed to elevate your everyday living.
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: '#475569',
                  marginBottom: '2rem',
                }}
              >
                Discover our community splash park, grilling stations, courtyard, and community clubhouse, or explore easy access to downtown Fort Worth and nearby shopping and dining. Our friendly on-site team is here to assist you every step of the way.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={onNavigateFloorPlans}
                  style={{
                    backgroundColor: 'var(--primary-color, #0f766e)',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover, #0d6460)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color, #0f766e)')}
                >
                  <span>View Floor Plans</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onNavigateGuidelines}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#1e293b',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                >
                  <ShieldCheck size={16} style={{ color: 'var(--primary-color, #0f766e)' }} />
                  <span>Income Guidelines</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. AMENITIES SHOWCASE TEASER ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          color: '#ffffff',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span
              style={{
                color: '#2dd4bf',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Elevate Your Lifestyle
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontFamily: 'serif',
                fontWeight: 700,
                marginTop: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              Exceptional Community & Home Amenities
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7 }}>
              Designed for your convenience and recreation, Monarch Pass offers resort-inspired community features and comfortable in-home finishes.
            </p>
          </div>

          {/* 8 Feature Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3rem',
            }}
          >
            {[
              { title: 'Community Splash Park', desc: 'Cool off and relax under the Texas sun' },
              { title: 'Fitness Center', desc: 'State-of-the-art cardio and conditioning gear' },
              { title: "Children's Playground", desc: 'Active, open-air play areas for kids' },
              { title: 'Grilling Stations & Courtyard', desc: 'Picnic tables and green spaces for gatherings' },
              { title: 'Energy-Efficient Appliances', desc: 'Modern refrigerators, dishwashers, and ovens' },
              { title: 'Covered & Reserved Parking', desc: 'Dedicated parking options available on-site' },
              { title: 'Resident Business Center', desc: 'Computer access, printing, and community clubhouse' },
              { title: 'Pet-Friendly Living', desc: 'Welcoming community with pet exercise areas' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  transition: 'transform 0.2s ease, background 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onNavigateAmenities}
              style={{
                backgroundColor: 'var(--primary-color, #0f766e)',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(15, 118, 110, 0.4)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover, #0d6460)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color, #0f766e)')}
            >
              <span>Explore All 29 Amenities</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. PHOTO GALLERY TEASER ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ color: 'var(--primary-color, #0f766e)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Visual Tour
              </span>
              <h2 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.5rem)', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0 0' }}>
                Life at Monarch Pass
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={onNavigatePhotos}
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--primary-color, #0f766e)',
                  border: '1px solid var(--primary-color, #0f766e)',
                  borderRadius: '6px',
                  padding: '0.65rem 1.25rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <Camera size={16} />
                <span>View Full Photo Gallery (26)</span>
              </button>

              <button
                onClick={onNavigateVirtualTour}
                style={{
                  backgroundColor: 'var(--primary-color, #0f766e)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.65rem 1.25rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={16} />
                <span>Interactive 3D Tours</span>
              </button>
            </div>
          </div>

          {/* 3 Large Photos Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                url: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/55-web-or-mls-4500%20Campus%20Dr%201005-S2104-021.jpg',
                title: 'Community Grounds & Architecture',
              },
              {
                url: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/34-web-or-mls-4500%20campus%20dr%201005-s2104-001.jpg',
                title: 'Playground & Family Areas',
              },
              {
                url: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/58-web-or-mls-campus%20dr-2104-902.jpg',
                title: 'Community Splash Park',
              },
            ].map((img, idx) => (
              <div
                key={idx}
                onClick={onNavigatePhotos}
                style={{
                  position: 'relative',
                  height: '260px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1.25rem',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. NEIGHBORHOOD TEASER ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ color: 'var(--primary-color, #0f766e)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Prime Fort Worth Location
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.85rem, 3vw, 2.5rem)',
                  fontFamily: 'serif',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.25,
                  margin: '0.5rem 0 1.25rem',
                }}
              >
                Ideally Located in Southeast Fort Worth
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#475569', marginBottom: '1.25rem' }}>
                Nestled on Campus Drive just off I-20 and minutes from I-35W, Monarch Pass provides seamless connectivity across the Dallas-Fort Worth metroplex. Enjoy quick commutes to Tarrant County College South Campus, Lake Arlington, and major logistics and employment hubs.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary-color, #0f766e)', flexShrink: 0 }} />
                  <span>Minutes from Tarrant County College South Campus</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary-color, #0f766e)', flexShrink: 0 }} />
                  <span>Quick access to I-20, I-35W, and Southeast Parkway</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary-color, #0f766e)', flexShrink: 0 }} />
                  <span>Close to Lake Arlington recreation, parks & dining</span>
                </li>
              </ul>

              <button
                onClick={onNavigateMap}
                style={{
                  backgroundColor: 'var(--primary-color, #0f766e)',
                  color: '#ffffff',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <MapPin size={16} />
                <span>Explore Map & Directions</span>
              </button>
            </div>

            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
              }}
            >
              <img
                src="https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/60-web-or-mls-campus%20dr-2104-906.jpg"
                alt="Monarch Pass Neighborhood & Campus Drive"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. QUICK INQUIRY & CONTACT FORM STRIP ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--primary-light, #f0fdfa)', borderTop: '1px solid #ccfbf1' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--primary-color, #0f766e)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Connect with Our Leasing Team
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
              Ready to Call Monarch Pass Home?
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem' }}>
              Send us a message or request availability for your preferred floor plan. Our leasing specialists will respond promptly.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '2.5rem',
              boxShadow: '0 10px 30px rgba(15, 118, 110, 0.08)',
              border: '1px solid #e2e8f0',
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--primary-color, #0f766e)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Thank you for contacting Monarch Pass!
                </h3>
                <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                  Your inquiry has been received by our on-site leasing office. A representative will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter your first name"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter your last name"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@example.com"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(817) 000-0000"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Preferred Bedroom Layout
                  </label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="1 Bed">1 Bedroom (703 Sq Ft)</option>
                    <option value="2 Beds">2 Bedrooms (991 Sq Ft)</option>
                    <option value="3 Beds">3 Bedrooms (1,159 Sq Ft)</option>
                    <option value="4 Beds">4 Bedrooms (1,328 Sq Ft)</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Message / Questions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => onOpenScheduleTour && onOpenScheduleTour()}
                    style={{
                      backgroundColor: '#ffffff',
                      color: 'var(--primary-color, #0f766e)',
                      border: '1px solid var(--primary-color, #0f766e)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Schedule a Tour Instead
                  </button>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--primary-color, #0f766e)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.75rem',
                      borderRadius: '6px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover, #0d6460)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color, #0f766e)')}
                  >
                    <Send size={16} />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
