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
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const activeTour = TOURS[activeTourIndex];

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* ── 1. HEADER BANNER ── */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 1rem',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/7-web-or-mls-unit%201701-005%20virtually%20staged.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span
            style={{
              backgroundColor: 'rgba(15, 118, 110, 0.9)',
              color: '#ffffff',
              padding: '0.35rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            Immersive 3D Experiences
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontFamily: 'serif',
              fontWeight: 700,
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Virtual Tours of Monarch Pass
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 auto 1.75rem' }}>
            Take an interactive walk inside our community and actual staged apartment layouts anytime, anywhere.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenScheduleTour && onOpenScheduleTour()}
              style={{
                backgroundColor: '#0f766e',
                color: '#ffffff',
                padding: '0.75rem 1.75rem',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              <Calendar size={18} />
              <span>Schedule In-Person Tour</span>
            </button>

            <button
              onClick={onNavigateFloorPlans}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.75rem 1.75rem',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Layers size={18} />
              <span>Floor Plans & Pricing</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. TOUR SELECTION TABS ── */}
      <section style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {TOURS.map((tour, idx) => {
            const isActive = idx === activeTourIndex;
            return (
              <button
                key={tour.id}
                onClick={() => setActiveTourIndex(idx)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  border: isActive ? '2px solid #0f766e' : '1px solid #cbd5e1',
                  backgroundColor: isActive ? '#f0fdfa' : '#ffffff',
                  color: isActive ? '#0f766e' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 118, 110, 0.15)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {idx === 0 ? <Compass size={18} /> : <Home size={18} />}
                <span>{tour.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. INTERACTIVE 3D VIEWER CONTAINER ── */}
      <section style={{ padding: '2.5rem 0' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    backgroundColor: '#ccfbf1',
                    color: '#0f766e',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {activeTour.badge}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Powered by {activeTour.type}</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {activeTour.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={activeTour.embedUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                  border: '1px solid #cbd5e1',
                }}
              >
                <span>Open Fullscreen in New Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
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
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)',
              border: '1px solid #cbd5e1',
              backgroundColor: '#0f172a',
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
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: '#64748b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: '#0f766e' }} />
              <span>Click and drag to rotate your 360-degree field of view</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: '#0f766e' }} />
              <span>Select room hotspots to walk through interconnected rooms</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
