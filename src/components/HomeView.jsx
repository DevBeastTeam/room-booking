import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
  Layers,
  Camera,
  Compass,
  Phone,
  CreditCard,
  Star,
  SlidersHorizontal,
  Send,
  Check,
  Clock,
  Heart,
  Info,
  Maximize2
} from 'lucide-react';
import { ALL_FLOOR_PLANS } from './FloorPlansGallery';

const HERO_SLIDES = [
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg',
    tagline: '✦ FORT WORTH\'S PREMIER RESIDENCES',
    title: 'Refined Living, Elevated Design',
    subtitle: 'Discover spacious 1, 2, 3 & 4-bedroom luxury residences crafted for elevated comfort, vibrant community living, and exceptional value in Fort Worth.',
    priceBadge: 'Starting at $898 / mo',
  },
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/16-web-or-mls-unit%201701-010.jpg',
    tagline: '✦ CONTEMPORARY CHEF KITCHENS',
    title: 'Modern Finishes & Wood-Style Planks',
    subtitle: 'Step inside designer homes featuring open-concept dining, energy-efficient black appliance packages, and abundant natural light throughout.',
    priceBadge: '1 - 4 Bed Floor Plans',
  },
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/58-web-or-mls-campus%20dr-2104-902.jpg',
    tagline: '✦ RESORT-INSPIRED OUTDOOR LIVING',
    title: 'Community Splash Park & Sun Courtyard',
    subtitle: 'Cool off under the Texas sun, host weekend family gatherings at our grilling pavilions, and relax in landscaped green grounds.',
    priceBadge: '29 Community Perks',
  },
  {
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/8-web-or-mls-unit%201701-006.jpg',
    tagline: '✦ AFFORDABLE LUXURY LIVING',
    title: 'Spacious Comfort for Every Lifestyle',
    subtitle: 'Featuring generous floor plans up to 1,328 Sq Ft, dedicated professional management, and income-qualified AMI housing programs.',
    priceBadge: '30%, 50% & 60% AMI Options',
  },
];

export default function HomeView({
  onNavigateFloorPlans,
  onNavigateAmenities,
  onNavigatePhotos,
  onNavigateVirtualTour,
  onNavigateGuidelines,
  onNavigateMap,
  onNavigateContact,
  onOpenScheduleTour,
  onOpenContactSupport,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBedFilter, setSelectedBedFilter] = useState('all');
  const [quickDate, setQuickDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bedrooms: '2 Beds',
    message: 'Hello, I would like more information on available apartments at Monarch Pass.',
  });

  // Slide Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleFloorPlans = () => {
    if (onNavigateFloorPlans) onNavigateFloorPlans();
    else window.location.href = '/floor-plans';
  };

  const handleSchedule = (bed = '', unit = '') => {
    if (onOpenScheduleTour) onOpenScheduleTour(bed, unit);
    else window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } }));
  };

  const handleDepositCheckout = (planName) => {
    window.dispatchEvent(new CustomEvent('open-paddle-checkout', {
      detail: { item: `deposit_${planName.toLowerCase().replace(/\s+/g, '_')}`, amount: 250.00 }
    }));
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bedrooms: '2 Beds',
        message: 'Hello, I would like more information on available apartments at Monarch Pass.',
      });
      setFormSubmitted(false);
    }, 6000);
  };

  // Filtered plans for showcase
  const filteredPlans = ALL_FLOOR_PLANS.filter((plan) => {
    if (selectedBedFilter === 'all') return true;
    return plan.beds === parseInt(selectedBedFilter, 10);
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
      {/* ── 1. CINEMATIC LUXURY HERO SECTION ── */}
      <section className="hero-section" style={{ position: 'relative', width: '100%', minHeight: '86vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background Slide Images */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className="hero-slide-container"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentSlide ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              pointerEvents: idx === currentSlide ? 'auto' : 'none',
              zIndex: 0,
            }}
          >
            <div
              className="hero-slide-bg"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                transform: idx === currentSlide ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 7s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          </div>
        ))}

        {/* Multi-tier Luxury Vignette Overlay (Adaptive to Dark & Light Themes) */}
        <div className="hero-overlay-side" />
        <div className="hero-overlay-bottom" />

        {/* Hero Content Box */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '4rem 1.5rem 6rem',
            width: '100%',
          }}
        >
          <div style={{ maxWidth: '780px' }}>
            {/* Tagline Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(201, 169, 110, 0.14)',
                border: '1px solid rgba(201, 169, 110, 0.4)',
                color: '#dfc285',
                padding: '0.45rem 1.25rem',
                borderRadius: '50px',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <Sparkles size={13} style={{ color: '#c9a96e' }} />
              <span>{HERO_SLIDES[currentSlide].tagline}</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
                fontWeight: 600,
                color: '#f9f6f0',
                lineHeight: 1.08,
                letterSpacing: '-0.01em',
                marginBottom: '1.25rem',
                textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              }}
            >
              {HERO_SLIDES[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                lineHeight: 1.7,
                color: '#d4c9b8',
                maxWidth: '640px',
                marginBottom: '2.25rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.7)',
              }}
            >
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={handleFloorPlans}
                className="btn-hero-plans"
                style={{
                  padding: '0.9rem 2.25rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 50%, #b8955a 100%)',
                  color: '#0b0c12',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 8px 25px rgba(201, 169, 110, 0.35)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(201, 169, 110, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(201, 169, 110, 0.35)';
                }}
              >
                <Layers size={17} />
                <span>Explore Floor Plans</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => handleSchedule()}
                className="btn-hero-schedule"
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(201, 169, 110, 0.45)',
                  backgroundColor: 'rgba(10, 12, 20, 0.65)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#dfc285',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.15)';
                  e.currentTarget.style.borderColor = '#c9a96e';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(10, 12, 20, 0.65)';
                  e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.45)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Calendar size={17} style={{ color: '#c9a96e' }} />
                <span>Schedule Private Tour</span>
              </button>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: '#a89d8e',
                  fontSize: '0.84rem',
                  marginLeft: '0.5rem',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }} />
                <span>Move-in Ready Units Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls (Prev / Next & Dots) */}
        <button
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          className="hero-arrow-btn hero-arrow-prev"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(8, 9, 15, 0.6)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            color: '#dfc285',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.25)';
            e.currentTarget.style.borderColor = '#dfc285';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(8, 9, 15, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)';
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Next slide"
          className="hero-arrow-btn hero-arrow-next"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(8, 9, 15, 0.6)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            color: '#dfc285',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.25)';
            e.currentTarget.style.borderColor = '#dfc285';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(8, 9, 15, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)';
          }}
        >
          <ChevronRight size={22} />
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
                width: idx === currentSlide ? '32px' : '10px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: idx === currentSlide ? '#c9a96e' : 'rgba(255,255,255,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* ── 2. FLOATING RESIDENCE SEARCH & QUICK SELECTOR ── */}
      <section style={{ position: 'relative', zIndex: 30, marginTop: '-3rem', padding: '0 1.5rem' }}>
        <div
          className="container"
          style={{
            backgroundColor: 'rgba(12, 16, 28, 0.95)',
            border: '1px solid rgba(201, 169, 110, 0.25)',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {/* Bedroom Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>
                Residence Type
              </label>
              <select
                value={selectedBedFilter}
                onChange={(e) => setSelectedBedFilter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  borderRadius: '6px',
                  color: '#f4efe6',
                  padding: '0.7rem 0.9rem',
                  fontSize: '0.88rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="all" style={{ background: '#0c101c' }}>All Bedrooms (1 - 4 Beds)</option>
                <option value="1" style={{ background: '#0c101c' }}>1 Bedroom (614 - 703 Sq Ft)</option>
                <option value="2" style={{ background: '#0c101c' }}>2 Bedrooms (786 - 991 Sq Ft)</option>
                <option value="3" style={{ background: '#0c101c' }}>3 Bedrooms (986 - 1,159 Sq Ft)</option>
                <option value="4" style={{ background: '#0c101c' }}>4 Bedrooms (1,328 Sq Ft)</option>
              </select>
            </div>

            {/* Move-in Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>
                Move-In Target
              </label>
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  borderRadius: '6px',
                  color: '#f4efe6',
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Starting Range Pill */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>
                Price Range
              </label>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.88rem',
                  color: '#dfc285',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>$888 – $1,390</span>
                <span style={{ fontSize: '0.7rem', color: '#8c8273' }}>/ mo</span>
              </div>
            </div>

            {/* Search Action */}
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.2rem' }}>
              <button
                onClick={handleFloorPlans}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                  color: '#08090f',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 20px rgba(201, 169, 110, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <SlidersHorizontal size={15} />
                <span>Search Floor Plans</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LUXURY STATS STRIP ── */}
      <section style={{ padding: '4.5rem 0 2rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              backgroundColor: 'rgba(12, 16, 28, 0.6)',
              border: '1px solid rgba(201, 169, 110, 0.15)',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(201,169,110,0.1)', padding: '0.5rem 1rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.6rem', fontWeight: 600, color: '#c9a96e', lineHeight: 1 }}>
                1 – 4
              </div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9c9284', marginTop: '0.4rem', fontWeight: 600 }}>
                Spacious Bedrooms
              </div>
              <div style={{ fontSize: '0.78rem', color: '#685f52', marginTop: '0.2rem' }}>
                Up to 1,328 Sq Ft
              </div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(201,169,110,0.1)', padding: '0.5rem 1rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.6rem', fontWeight: 600, color: '#c9a96e', lineHeight: 1 }}>
                $888+
              </div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9c9284', marginTop: '0.4rem', fontWeight: 600 }}>
                Starting Monthly Rent
              </div>
              <div style={{ fontSize: '0.78rem', color: '#685f52', marginTop: '0.2rem' }}>
                Affordable & Income-Restricted
              </div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(201,169,110,0.1)', padding: '0.5rem 1rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.6rem', fontWeight: 600, color: '#c9a96e', lineHeight: 1 }}>
                29
              </div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9c9284', marginTop: '0.4rem', fontWeight: 600 }}>
                Community Amenities
              </div>
              <div style={{ fontSize: '0.78rem', color: '#685f52', marginTop: '0.2rem' }}>
                Splash park, clubhouse & grills
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.6rem', fontWeight: 600, color: '#c9a96e', lineHeight: 1 }}>
                100%
              </div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9c9284', marginTop: '0.4rem', fontWeight: 600 }}>
                Comfort & Quality
              </div>
              <div style={{ fontSize: '0.78rem', color: '#685f52', marginTop: '0.2rem' }}>
                Cushman & Wakefield Managed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THE MONARCH DISTINCTION (EDITORIAL STORY) ── */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Visual Column */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                  position: 'relative',
                }}
              >
                <img
                  src="https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/36-web-or-mls-4500%20campus%20dr%201005-s2104-002.jpg"
                  alt="Monarch Pass Architecture and Grounds"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              {/* Floating Luxury Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '1.5rem',
                  backgroundColor: '#0c101c',
                  border: '1px solid rgba(201, 169, 110, 0.4)',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <ShieldCheck size={26} style={{ color: '#c9a96e' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', fontWeight: 700 }}>
                    Official Community
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4efe6' }}>
                    Managed by Cushman & Wakefield
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
                <span>The Monarch Distinction</span>
              </div>

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
                  fontWeight: 500,
                  color: '#f4efe6',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                }}
              >
                Elevated Living in Southeast Fort Worth
              </h2>

              <p style={{ fontSize: '0.98rem', lineHeight: 1.8, color: '#b5a999', marginBottom: '1.25rem' }}>
                At Monarch Pass, contemporary convenience meets suburban tranquility. Our 1, 2, 3, and 4-bedroom affordable apartment homes feature expansive open layouts, wood-style flooring, and high-efficiency appliance packages tailored for effortless living.
              </p>

              <p style={{ fontSize: '0.98rem', lineHeight: 1.8, color: '#b5a999', marginBottom: '2rem' }}>
                Unwind under the Texas sun at our private community splash park, gather with neighbors at the courtyard grilling pavilions, or enjoy the peaceful resident clubhouse. With seamless access to I-20 and I-35W, you are just moments from downtown Fort Worth and Tarrant County College.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleFloorPlans}
                  className="btn-gold"
                  style={{
                    padding: '0.85rem 1.85rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                    color: '#08090f',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Explore All Residences</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => {
                    if (onNavigateGuidelines) onNavigateGuidelines();
                    else window.location.href = '/income-guidelines';
                  }}
                  className="btn-outline-gold"
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    backgroundColor: 'transparent',
                    color: '#dfc285',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldCheck size={16} style={{ color: '#c9a96e' }} />
                  <span>Income Guidelines</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURED FLOOR PLANS SHOWCASE ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
                <span>Selected Floor Plans</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, color: '#f4efe6', margin: 0 }}>
                Find Your Ideal Residence
              </h2>
            </div>

            {/* Bedroom Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'All Layouts', value: 'all' },
                { label: '1 Bed', value: '1' },
                { label: '2 Beds', value: '2' },
                { label: '3 Beds', value: '3' },
                { label: '4 Beds', value: '4' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedBedFilter(tab.value)}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    border: selectedBedFilter === tab.value ? '1px solid #c9a96e' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: selectedBedFilter === tab.value ? 'rgba(201, 169, 110, 0.18)' : 'transparent',
                    color: selectedBedFilter === tab.value ? '#dfc285' : '#8a8074',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Floor Plan Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {filteredPlans.slice(0, 4).map((plan) => (
              <div
                key={plan.id}
                className="plan-card"
                style={{
                  backgroundColor: 'rgba(13, 17, 30, 0.85)',
                  border: '1px solid rgba(201, 169, 110, 0.15)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.35s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Plan Image */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: '#0a0d16' }}>
                  <img
                    src={plan.highResImage || plan.image}
                    alt={plan.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem', transition: 'transform 0.4s' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(201, 169, 110, 0.95)',
                      color: '#08090f',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '3px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Available Now ({plan.availableCount})
                  </div>
                </div>

                {/* Plan Details */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.45rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                      {plan.name}
                    </h3>
                    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.65rem', fontWeight: 700, color: '#c9a96e' }}>
                      ${plan.startingPrice.toFixed(0)}
                      <span style={{ fontSize: '0.8rem', color: '#7a7063', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}> / mo</span>
                    </div>
                  </div>

                  {/* Specs Strip */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.82rem',
                      color: '#9e9282',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <span>{plan.beds} {plan.beds === 1 ? 'Bed' : 'Beds'}</span>
                    <span>•</span>
                    <span>{plan.baths} {plan.baths === 1 ? 'Bath' : 'Baths'}</span>
                    <span>•</span>
                    <span>{plan.sqft} Sq Ft</span>
                  </div>

                  {/* Pricing Tiers Preview */}
                  <div style={{ fontSize: '0.76rem', color: '#7a7063', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>12 Mo: ${plan.prices[12]}</span>
                    <span>10 Mo: ${plan.prices[10]}</span>
                    <span>6 Mo: ${plan.prices[6]}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={handleFloorPlans}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(201, 169, 110, 0.12)',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        color: '#dfc285',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.25)';
                        e.currentTarget.style.borderColor = '#c9a96e';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)';
                      }}
                    >
                      Cost Breakdown
                    </button>

                    <button
                      onClick={() => handleDepositCheckout(plan.name)}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                        color: '#08090f',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                      title="Reserve with $250 holding deposit"
                    >
                      <CreditCard size={13} />
                      <span>Reserve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={handleFloorPlans}
              style={{
                padding: '0.85rem 2.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(201, 169, 110, 0.45)',
                backgroundColor: 'rgba(201, 169, 110, 0.08)',
                color: '#dfc285',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.2)';
                e.currentTarget.style.borderColor = '#c9a96e';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.45)';
              }}
            >
              <span>View All Floor Plans & Interactive Estimator</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. RESORT AMENITIES SHOWCASE ── */}
      <section style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
              <span>Resort Amenities</span>
              <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
            </div>

            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.1rem, 3.8vw, 3rem)', fontWeight: 500, color: '#f4efe6', marginBottom: '1rem' }}>
              Crafted for Relaxation & Everyday Ease
            </h2>
            <p style={{ color: '#9e9282', fontSize: '1rem', lineHeight: 1.7 }}>
              From morning fitness sessions to sunset barbecue gatherings and weekend splash park fun, Monarch Pass provides a complete lifestyle sanctuary.
            </p>
          </div>

          {/* Amenities Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                title: 'Community Splash Park',
                desc: 'A vibrant outdoor water spray park designed for family fun and sunny Texas afternoons.',
                icon: Sparkles,
              },
              {
                title: 'Resident Clubhouse',
                desc: 'Warm, welcoming gathering lounge equipped with comfortable seating and community spaces.',
                icon: Heart,
              },
              {
                title: 'Health & Fitness Center',
                desc: 'Modern cardio machines and conditioning equipment accessible right within the community.',
                icon: Maximize2,
              },
              {
                title: 'Grill Stations & Courtyard',
                desc: 'Lush landscaped green courtyards with barbecue stations and picnic dining tables.',
                icon: Layers,
              },
              {
                title: "Children's Playground",
                desc: 'Safe, dedicated outdoor play spaces for young residents to explore and create friendships.',
                icon: CheckCircle2,
              },
              {
                title: 'Business & Study Center',
                desc: 'Dedicated workstation area with high-speed internet connectivity and resident printing.',
                icon: Compass,
              },
              {
                title: 'Energy-Efficient Kitchens',
                desc: 'Black appliance packages with high-efficiency refrigerators, electric ranges, and dishwashers.',
                icon: Star,
              },
              {
                title: 'Pet-Friendly Living',
                desc: 'We happily welcome four-legged family members with spacious grounds for daily dog walks.',
                icon: ShieldCheck,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="amenity-card"
                  style={{
                    backgroundColor: 'rgba(14, 18, 30, 0.7)',
                    border: '1px solid rgba(201, 169, 110, 0.12)',
                    borderRadius: '12px',
                    padding: '1.75rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(201, 169, 110, 0.1)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c9a96e',
                      marginBottom: '1.2rem',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#f4efe6', marginBottom: '0.45rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#9e9282', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => {
                if (onNavigateAmenities) onNavigateAmenities();
                else window.location.href = '/amenities';
              }}
              style={{
                padding: '0.85rem 2rem',
                borderRadius: '4px',
                border: '1px solid rgba(201, 169, 110, 0.35)',
                backgroundColor: 'transparent',
                color: '#dfc285',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.15)';
                e.currentTarget.style.borderColor = '#c9a96e';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.35)';
              }}
            >
              <span>Explore All 29 Community Amenities</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. INTERACTIVE 3D / VIRTUAL TOUR SHOWCASE ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-color)' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
                <span>Immersive 3D Experience</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, color: '#f4efe6', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                Walk Through Your New Home From Anywhere
              </h2>
              <p style={{ color: '#a39886', fontSize: '0.96rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Experience our curated 3D virtual walkthroughs. Tour open floor plans, inspect kitchen cabinets, examine closet spaces, and get an authentic feel for natural lighting before stepping foot on property.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    if (onNavigateVirtualTour) onNavigateVirtualTour();
                    else window.location.href = '/virtual-tour';
                  }}
                  style={{
                    padding: '0.85rem 1.85rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                    color: '#08090f',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Compass size={16} />
                  <span>Launch 3D Virtual Tour</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigatePhotos) onNavigatePhotos();
                    else window.location.href = '/photos';
                  }}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    backgroundColor: 'transparent',
                    color: '#dfc285',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Camera size={16} style={{ color: '#c9a96e' }} />
                  <span>Photo Gallery (26)</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Teaser Card */}
            <div
              onClick={() => {
                if (onNavigateVirtualTour) onNavigateVirtualTour();
                else window.location.href = '/virtual-tour';
              }}
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                cursor: 'pointer',
                height: '320px',
              }}
            >
              <img
                src="https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/16-web-or-mls-unit%201701-010.jpg"
                alt="Virtual Tour Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(8, 9, 15, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(8, 9, 15, 0.3)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(8, 9, 15, 0.5)'}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(201, 169, 110, 0.95)',
                    color: '#08090f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 25px rgba(201, 169, 110, 0.6)',
                  }}
                >
                  <Compass size={28} />
                </div>
                <div style={{ color: '#f4efe6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                  Click to Explore 360° Walkthrough
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. INCOME GUIDELINES CARD ── */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'rgba(14, 18, 30, 0.85)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              borderRadius: '14px',
              padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c9a96e', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={14} />
                  <span>Affordable Housing Programs</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.2rem', fontWeight: 500, color: '#f4efe6', lineHeight: 1.15, marginBottom: '0.85rem' }}>
                  Income-Qualified Living Guidelines
                </h3>
                <p style={{ color: '#a39886', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Monarch Pass is an affordable housing community operating under established Area Median Income (AMI) guidelines at 30%, 50%, and 60% levels. Total household gross income must qualify under the applicable limit for your household size.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      if (onNavigateGuidelines) onNavigateGuidelines();
                      else window.location.href = '/income-guidelines';
                    }}
                    style={{
                      padding: '0.75rem 1.6rem',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                      color: '#08090f',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    View Full Income Limits Table
                  </button>
                </div>
              </div>

              {/* Quick AMI Limits Snapshot */}
              <div
                style={{
                  backgroundColor: 'rgba(8, 9, 15, 0.75)',
                  border: '1px solid rgba(201, 169, 110, 0.15)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
                  Maximum Annual Household Income (60% AMI Limit)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4c9b8' }}>
                    <span>1 Person Household:</span>
                    <span style={{ fontWeight: 700, color: '#c9a96e' }}>$43,740</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4c9b8' }}>
                    <span>2 Persons Household:</span>
                    <span style={{ fontWeight: 700, color: '#c9a96e' }}>$49,980</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4c9b8' }}>
                    <span>3 Persons Household:</span>
                    <span style={{ fontWeight: 700, color: '#c9a96e' }}>$56,220</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4c9b8' }}>
                    <span>4 Persons Household:</span>
                    <span style={{ fontWeight: 700, color: '#c9a96e' }}>$62,460</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. RESIDENT REVIEWS & TESTIMONIALS ── */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
              <span>Resident Experiences</span>
              <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, color: '#f4efe6', margin: 0 }}>
              What Our Community Members Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                quote: 'The staff made the application and move-in process so smooth! The splash park is wonderful for my kids on hot weekends, and our 3-bedroom is huge.',
                name: 'Kendra W.',
                role: 'Resident of 2 Years',
                stars: 5,
              },
              {
                quote: 'Clean grounds, excellent maintenance team that fixes things quickly, and friendly neighbors. Having wood-style floors and a private patio makes it truly feel like home.',
                name: 'Marcus T.',
                role: 'Verified Resident',
                stars: 5,
              },
              {
                quote: 'Very affordable for how modern the interiors are. The location on Campus Drive right off I-20 makes my commute to work super easy.',
                name: 'Elena G.',
                role: 'Resident of 1 Year',
                stars: 5,
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="testimonial-card"
                style={{
                  backgroundColor: 'rgba(14, 18, 30, 0.85)',
                  border: '1px solid rgba(201, 169, 110, 0.15)',
                  borderRadius: '12px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem', color: '#c9a96e' }}>
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} size={15} fill="#c9a96e" />
                    ))}
                  </div>
                  <p style={{ color: '#d4c9b8', fontSize: '0.94rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    "{review.quote}"
                  </p>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#f4efe6', fontSize: '0.95rem' }}>{review.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#8c8273' }}>{review.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. VIP TOUR & INQUIRY FORM ── */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Sparkles size={14} />
              <span>Personalized Assistance</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.1rem, 3.8vw, 3rem)', fontWeight: 500, color: '#f4efe6', marginBottom: '0.75rem' }}>
              Schedule Your Private Tour Today
            </h2>
            <p style={{ color: '#9e9282', fontSize: '0.98rem' }}>
              Our dedicated on-site leasing specialists are delighted to walk you through available floor plans and answer any qualification questions.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(8, 9, 15, 0.8)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              borderRadius: '14px',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={54} style={{ color: '#c9a96e', margin: '0 auto 1.25rem' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.85rem', fontWeight: 600, color: '#f4efe6', marginBottom: '0.5rem' }}>
                  Thank You for Your Inquiry
                </h3>
                <p style={{ color: '#a89d8e', fontSize: '0.96rem' }}>
                  Your tour request has been delivered directly to the Monarch Pass on-site team. A leasing specialist will contact you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ color: '#c9a96e', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'block' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First name"
                    className="form-input"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: '#c9a96e', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'block' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last name"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: '#c9a96e', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'block' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: '#c9a96e', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'block' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(817) 000-0000"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ color: '#c9a96e', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'block' }}>
                    Desired Residence Layout
                  </label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: '#0a0d16',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="1 Bed">1 Bedroom (Starting from $888)</option>
                    <option value="2 Beds">2 Bedrooms (Starting from $860)</option>
                    <option value="3 Beds">3 Bedrooms (Starting from $1,050)</option>
                    <option value="4 Beds">4 Bedrooms (Starting from $1,150)</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ color: '#c9a96e', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'block' }}>
                    Special Requests or Questions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleSchedule()}
                    style={{
                      padding: '0.85rem 1.65rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(201, 169, 110, 0.4)',
                      backgroundColor: 'transparent',
                      color: '#dfc285',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Schedule Specific Date & Time
                  </button>

                  <button
                    type="submit"
                    style={{
                      padding: '0.85rem 2rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                      color: '#08090f',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Send size={15} />
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
