import React, { useState } from 'react';
import { 
  Waves, 
  Flame, 
  Trees, 
  Dumbbell, 
  Car, 
  WashingMachine, 
  Monitor, 
  ShieldCheck, 
  Wrench, 
  Dog, 
  Bus, 
  Languages, 
  Wifi, 
  Zap, 
  Sparkles, 
  Thermometer, 
  Wind, 
  Tv, 
  Fan, 
  Accessibility, 
  CheckCircle2, 
  Calendar, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

const COMMUNITY_AMENITIES = [
  { icon: Waves, name: 'Community Splash Park', desc: 'Cool off and relax under the Texas sun in our refreshing splash zone.' },
  { icon: Flame, name: 'Grilling Stations & Picnic Areas', desc: 'Outdoor charcoal and gas barbecue grills surrounded by shaded picnic tables.' },
  { icon: Trees, name: 'Courtyard & Manicured Green Spaces', desc: 'Lush open courtyards designed for peaceful strolls and outdoor relaxation.' },
  { icon: Sparkles, name: 'Tennis & Sports Pavilion', desc: 'Dedicated court area for outdoor recreation and games.' },
  { icon: Sparkles, name: "Children's Playground", desc: 'Safe, fun outdoor playground area with modern equipment for kids.' },
  { icon: Car, name: 'Covered & Reserved Parking', desc: 'Option to reserve covered carports protecting your vehicle year-round.' },
  { icon: Dumbbell, name: 'Fully Equipped Fitness Center', desc: 'Cardiovascular gear, resistance machines, and free weights for total wellness.' },
  { icon: WashingMachine, name: 'On-Site Clothes Care Center', desc: 'High-capacity laundry facility conveniently located within the community.' },
  { icon: Monitor, name: 'Resident Business Center & Clubhouse', desc: 'Dedicated computers, high-speed printing, and a spacious clubhouse for events.' },
  { icon: ShieldCheck, name: 'Professional On-Site Management', desc: 'Attentive community management powered by Cushman & Wakefield.' },
  { icon: Wrench, name: '24-Hour Emergency Maintenance', desc: 'Dedicated on-call maintenance technicians ready to assist anytime.' },
  { icon: Dog, name: 'Pet-Friendly Community', desc: 'Four-legged friends are welcome with pet waste stations throughout grounds.' },
  { icon: Bus, name: 'Public Transportation Access', desc: 'Convenient nearby transit stops connecting to downtown Fort Worth.' },
  { icon: Languages, name: 'Bilingual Office Staff', desc: 'Our helpful team speaks both English and Spanish to assist all residents.' },
  { icon: Wifi, name: 'High-Speed Internet Ready', desc: 'Fiber-optic high-speed internet capability available community-wide.' },
];

const APARTMENT_AMENITIES = [
  { icon: Zap, name: 'Energy-Efficient Appliances', desc: 'Eco-friendly appliances designed to reduce your monthly utility expenses.' },
  { icon: Sparkles, name: 'Modern Dishwasher & Disposal', desc: 'Streamlined kitchen cleanup with built-in dishwasher and food disposal.' },
  { icon: Sparkles, name: 'Frost-Free Refrigerator with Ice Maker', desc: 'Full-size refrigerator equipped with convenient freezer shelving.' },
  { icon: Layers, name: 'Spacious Walk-In Closets', desc: 'Generous storage room in primary bedrooms to organize your wardrobe.' },
  { icon: Sparkles, name: 'Tub & Shower Combo Bathrooms', desc: 'Bright, clean bathroom suites with full bathtubs and showers.' },
  { icon: Thermometer, name: 'Electronic Digital Thermostat', desc: 'Precise climate control for optimal temperature and energy savings.' },
  { icon: Wind, name: 'Central Air Conditioning & Heating', desc: 'Keep your home perfectly comfortable through hot summers and cool winters.' },
  { icon: Tv, name: 'Cable & High-Speed Internet Ready', desc: 'Pre-wired connections so you can connect your services immediately upon move-in.' },
  { icon: Sparkles, name: 'Designer Window Treatments & Blinds', desc: 'Quality mini blinds installed on all windows for privacy and light control.' },
  { icon: Fan, name: 'Decorative Ceiling Fans', desc: 'Stylish ceiling fans located in living areas and bedrooms for airflow.' },
  { icon: Sparkles, name: 'Wood-Style Plank Flooring', desc: 'Durable, elegant luxury plank flooring throughout high-traffic living areas.' },
  { icon: Sparkles, name: 'Plush Bedroom Carpeting', desc: 'Soft designer carpeting in all bedrooms for cozy underfoot comfort.' },
  { icon: Accessibility, name: 'Wheelchair-Accessible Layouts', desc: 'ADA compliant unit designs and accessible doorways available upon request.' },
  { icon: Trees, name: 'Private Patio or Balcony', desc: 'Enjoy your morning coffee outdoors on your private patio (select units).' },
];

export default function AmenitiesView({
  onNavigateFloorPlans,
  onOpenScheduleTour,
}) {
  const handleFloorPlans = onNavigateFloorPlans || (() => { window.location.href = '/floor-plans'; });
  const handleSchedule = onOpenScheduleTour || ((bed = '', unit = '') => { window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } })); });

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'community' | 'apartment'

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* ── 1. AMENITIES HERO BANNER ── */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 1rem',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg')`,
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
            Community & Home Features
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
            Amenities at Monarch Pass
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 auto 2rem' }}>
            From our refreshing community splash park to open-concept apartments with modern finishes, discover every comfort designed for you in Fort Worth, TX.
          </p>

          <button
            onClick={() => onOpenScheduleTour && onOpenScheduleTour()}
            style={{
              backgroundColor: '#0f766e',
              color: '#ffffff',
              padding: '0.8rem 1.8rem',
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
            <span>Schedule an In-Person Tour</span>
          </button>
        </div>
      </section>

      {/* ── 2. FILTER TABS BAR ── */}
      <section style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: activeTab === 'all' ? '1px solid #0f766e' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'all' ? '#0f766e' : '#ffffff',
              color: activeTab === 'all' ? '#ffffff' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            All Amenities ({COMMUNITY_AMENITIES.length + APARTMENT_AMENITIES.length})
          </button>

          <button
            onClick={() => setActiveTab('community')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: activeTab === 'community' ? '1px solid #0f766e' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'community' ? '#0f766e' : '#ffffff',
              color: activeTab === 'community' ? '#ffffff' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            Community Amenities ({COMMUNITY_AMENITIES.length})
          </button>

          <button
            onClick={() => setActiveTab('apartment')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: activeTab === 'apartment' ? '1px solid #0f766e' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'apartment' ? '#0f766e' : '#ffffff',
              color: activeTab === 'apartment' ? '#ffffff' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            Apartment Amenities ({APARTMENT_AMENITIES.length})
          </button>
        </div>
      </section>

      {/* ── 3. MAIN AMENITIES CONTENT ── */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          {/* Section: Community Amenities */}
          {(activeTab === 'all' || activeTab === 'community') && (
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '4px', height: '24px', backgroundColor: '#0f766e', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '1.65rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Community Amenities
                </h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Active recreation and social conveniences curated for the entire family.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {COMMUNITY_AMENITIES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          backgroundColor: '#ccfbf1',
                          color: '#0f766e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Apartment Amenities */}
          {(activeTab === 'all' || activeTab === 'apartment') && (
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '4px', height: '24px', backgroundColor: '#0f766e', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '1.65rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Apartment Interior Amenities
                </h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Modern conveniences and comfortable details in every 1, 2, 3, and 4-bedroom layout.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {APARTMENT_AMENITIES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 4. PET POLICY CALLOUT BOX ── */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '3.5rem',
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 240px) 1fr',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid #fef3c7', paddingRight: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Dog size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                Pet Policy
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600 }}>
                Pets Welcomed!
              </span>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>Max Pets</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>2 Pets Max per Unit</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>One-Time Pet Fee</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>$350 (Non-refundable)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>Monthly Pet Rent</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>$20.00 / month / pet</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>Pet Deposit</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f' }}>$150.00 (Refundable)</div>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#78350f', margin: 0, lineHeight: 1.6 }}>
                <strong>Important Policy Notes:</strong> Dogs and cats are welcome. Breed restrictions apply (including Pit Bulls, Staffordshire Terriers, Rottweilers, German Shepherds, Doberman Pinschers, and Chows). Assistance animals are exempt from pet fees and restrictions with proper documentation.
              </p>
            </div>
          </div>

          {/* ── 5. BOTTOM CTA BANNER ── */}
          <div
            style={{
              backgroundColor: '#0f766e',
              borderRadius: '12px',
              padding: '2.5rem',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'serif', fontWeight: 700, margin: '0 0 0.5rem' }}>
                Find Your Ideal Home Layout
              </h3>
              <p style={{ color: '#ccfbf1', margin: 0, fontSize: '0.95rem' }}>
                Compare 1, 2, 3, and 4-bedroom floor plans, see move-in specials, and calculate costs.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleFloorPlans}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f766e',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span>View Floor Plans</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => handleSchedule()}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Calendar size={16} />
                <span>Schedule a Tour</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
