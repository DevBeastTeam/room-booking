import React, { useState } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  Calendar, 
  Layers, 
  ExternalLink, 
  Compass, 
  Home, 
  CheckCircle2 
} from 'lucide-react';

const TOURS = [
  {
    id: 'community-tour',
    title: 'Monarch Pass Community & Grounds Tour',
    badge: 'Interactive 360° Experience',
    description: 'Explore our grounds, splash park, courtyard, resident clubhouse, and community spaces from the comfort of your device.',
    embedUrl: 'https://tour.tourbuilder.com/?tour=62aca4fd2039d022020bc5de&sourceId=1001',
    type: 'TourBuilder 360',
  },
  {
    id: 'four-bed-tour',
    title: 'Four Bedroom (1,328 Sq Ft) Walkthrough',
    badge: '4 Bed / 2 Bath Floor Plan',
    description: 'Experience our largest open-concept layout featuring a spacious master suite, walk-in closets, modern kitchen, and expansive living room.',
    embedUrl: 'https://www.zillow.com/view-imx/531d4ad9-576b-40d2-ab5a-0ec89941388f?setAttribution=mls&wl=true&initialViewType=pano&utm_source=dashboard',
    type: 'Zillow 3D Home Pano',
  },
  {
    id: 'two-bed-tour',
    title: 'Two Bedroom (991 Sq Ft) Walkthrough',
    badge: '2 Bed / 2 Bath Floor Plan',
    description: 'Take a virtual walk inside our highly sought-after 2-bedroom home, featuring dual full baths, plush bedrooms, and energy-efficient appliances.',
    embedUrl: 'https://www.zillow.com/view-imx/f92eddf4-5c1a-4cbc-ae17-58753cfcf939?initialViewType=pano',
    type: 'Zillow 3D Home Pano',
  },
];

export default function VirtualTourView({
  onNavigateFloorPlans,
  onOpenScheduleTour,
}) {
  const handleFloorPlans = onNavigateFloorPlans || (() => { window.location.href = '/floor-plans'; });
  const handleSchedule = onOpenScheduleTour || ((bed = '', unit = '') => { window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } })); });

  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const activeTour = TOURS[activeTourIndex];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
      {/* ── 1. HEADER BANNER ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1rem',
          backgroundImage: `linear-gradient(rgba(8, 9, 15, 0.8), rgba(8, 9, 15, 0.9)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/7-web-or-mls-unit%201701-005%20virtually%20staged.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          textAlign: 'center',
          color: '#f4efe6',
          borderBottom: '1px solid rgba(201, 169, 110, 0.15)',
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(201, 169, 110, 0.15)',
              border: '1px solid rgba(201, 169, 110, 0.35)',
              color: '#dfc285',
              padding: '0.4rem 1.25rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} style={{ color: '#c9a96e' }} />
            <span>Immersive 3D Walkthroughs</span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)',
              fontWeight: 500,
              marginBottom: '1rem',
              lineHeight: 1.15,
              color: '#f4efe6',
            }}
          >
            Virtual Tours of Monarch Pass
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#b5a999', lineHeight: 1.7, margin: '0 auto 2.25rem', maxWidth: '680px' }}>
            Take an interactive walk inside our community grounds and actual staged apartment layouts anytime, from any device.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSchedule()}
              style={{
                padding: '0.85rem 2rem',
                borderRadius: '4px',
                border: 'none',
                background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                color: '#08090f',
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(201, 169, 110, 0.35)',
              }}
            >
              <Calendar size={16} />
              <span>Schedule In-Person Tour</span>
            </button>

            <button
              onClick={handleFloorPlans}
              style={{
                padding: '0.85rem 1.85rem',
                borderRadius: '4px',
                border: '1px solid rgba(201, 169, 110, 0.4)',
                backgroundColor: 'transparent',
                color: '#dfc285',
                fontSize: '0.84rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Layers size={16} />
              <span>Floor Plans & Pricing</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. TOUR SELECTION TABS ── */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {TOURS.map((tour, idx) => {
            const isActive = idx === activeTourIndex;
            return (
              <button
                key={tour.id}
                onClick={() => setActiveTourIndex(idx)}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  border: isActive ? '1px solid #c9a96e' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(201, 169, 110, 0.18)' : 'transparent',
                  color: isActive ? '#dfc285' : '#8c8273',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                {idx === 0 ? <Compass size={16} style={{ color: '#c9a96e' }} /> : <Home size={16} style={{ color: '#c9a96e' }} />}
                <span>{tour.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. INTERACTIVE 3D VIEWER CONTAINER ── */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          {/* Active Tour Info Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(201, 169, 110, 0.18)',
                    color: '#dfc285',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {activeTour.badge}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#8c8273' }}>Powered by {activeTour.type}</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.65rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                {activeTour.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={activeTour.embedUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: 'rgba(201, 169, 110, 0.1)',
                  color: '#dfc285',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                }}
              >
                <span>Open Fullscreen in New Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <p style={{ color: '#9e9282', fontSize: '0.94rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            {activeTour.description}
          </p>

          {/* Iframe Viewport */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '620px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -10px rgba(0,0,0,0.8)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              backgroundColor: '#0a0d16',
            }}
          >
            <iframe
              title={activeTour.title}
              src={activeTour.embedUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
              allowFullScreen
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>

          {/* Tips for Navigating 3D Tours */}
          <div
            style={{
              marginTop: '1.5rem',
              backgroundColor: 'rgba(12, 16, 28, 0.75)',
              border: '1px solid rgba(201, 169, 110, 0.15)',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              fontSize: '0.84rem',
              color: '#9e9282',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} style={{ color: '#c9a96e' }} />
              <span>Click and drag inside viewer to rotate your 360-degree field of view</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} style={{ color: '#c9a96e' }} />
              <span>Select floor hotspots to walk through interconnected rooms</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
