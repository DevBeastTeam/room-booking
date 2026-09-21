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
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
      {/* ── 1. AMENITIES HERO BANNER ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1rem',
          backgroundImage: `linear-gradient(rgba(8, 9, 15, 0.8), rgba(8, 9, 15, 0.9)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg')`,
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
            <span>Community & Residence Perks</span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)',
              fontWeight: 500,
              color: '#f4efe6',
              marginBottom: '1rem',
              lineHeight: 1.15,
            }}
          >
            Curated Amenities at Monarch Pass
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#b5a999', lineHeight: 1.7, margin: '0 auto 2.25rem', maxWidth: '680px' }}>
            From our private community splash park and manicured courtyards to chef-style kitchens with wood-style flooring, experience every comfort designed for elevated living in Fort Worth, TX.
          </p>

          <button
            onClick={() => handleSchedule()}
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '4px',
              border: 'none',
              background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
              color: '#08090f',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(201, 169, 110, 0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Calendar size={16} />
            <span>Schedule an In-Person Tour</span>
          </button>
        </div>
      </section>

      {/* ── 2. FILTER TABS BAR ── */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Amenities (${COMMUNITY_AMENITIES.length + APARTMENT_AMENITIES.length})` },
            { id: 'community', label: `Community Amenities (${COMMUNITY_AMENITIES.length})` },
            { id: 'apartment', label: `Apartment Amenities (${APARTMENT_AMENITIES.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: isActive ? '1px solid #c9a96e' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(201, 169, 110, 0.18)' : 'transparent',
                  color: isActive ? '#dfc285' : '#8c8273',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. MAIN AMENITIES CONTENT ── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          {/* Section: Community Amenities */}
          {(activeTab === 'all' || activeTab === 'community') && (
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '4px', height: '24px', backgroundColor: '#c9a96e', borderRadius: '2px' }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.85rem', fontWeight: 500, color: '#f4efe6', margin: 0 }}>
                  Community Amenities
                </h2>
              </div>
              <p style={{ color: '#9e9282', fontSize: '0.94rem', marginBottom: '2rem' }}>
                Active recreation, private outdoor spaces, and social conveniences curated for the entire family.
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
                      className="amenity-card"
                      style={{
                        backgroundColor: 'rgba(14, 18, 30, 0.75)',
                        border: '1px solid rgba(201, 169, 110, 0.14)',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.35)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.14)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(201, 169, 110, 0.12)',
                          border: '1px solid rgba(201, 169, 110, 0.25)',
                          color: '#c9a96e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: '#9e9282', margin: 0, lineHeight: 1.6 }}>
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
                <span style={{ width: '4px', height: '24px', backgroundColor: '#c9a96e', borderRadius: '2px' }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.85rem', fontWeight: 500, color: '#f4efe6', margin: 0 }}>
                  Apartment Interior Finishes
                </h2>
              </div>
              <p style={{ color: '#9e9282', fontSize: '0.94rem', marginBottom: '2rem' }}>
                Designer finishes, energy-efficient appliances, and comfortable details in every 1, 2, 3, and 4-bedroom layout.
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
                      className="amenity-card"
                      style={{
                        backgroundColor: 'rgba(14, 18, 30, 0.75)',
                        border: '1px solid rgba(201, 169, 110, 0.14)',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.35)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.14)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(201, 169, 110, 0.12)',
                          border: '1px solid rgba(201, 169, 110, 0.25)',
                          color: '#c9a96e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: '#9e9282', margin: 0, lineHeight: 1.6 }}>
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
              backgroundColor: 'rgba(12, 16, 28, 0.85)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              borderRadius: '12px',
              padding: '2.25rem',
              marginBottom: '3.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(201,169,110,0.15)', paddingRight: '1rem' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 169, 110, 0.15)',
                  border: '1px solid rgba(201, 169, 110, 0.35)',
                  color: '#c9a96e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Dog size={28} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.45rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                Pet Policy
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#c9a96e', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                Pets Welcomed
              </span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c9a96e', fontWeight: 700 }}>Max Pets</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f4efe6' }}>2 Pets Max</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c9a96e', fontWeight: 700 }}>One-Time Fee</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f4efe6' }}>$350</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c9a96e', fontWeight: 700 }}>Monthly Rent</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f4efe6' }}>$20 / mo / pet</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c9a96e', fontWeight: 700 }}>Deposit</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f4efe6' }}>$150 (Refundable)</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#9e9282', margin: 0, lineHeight: 1.6 }}>
                <strong>Important Policy Notes:</strong> Dogs and cats are welcome. Breed restrictions apply. Assistance animals are exempt from pet fees and restrictions with proper documentation.
              </p>
            </div>
          </div>

          {/* ── 5. BOTTOM CTA BANNER ── */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(12, 16, 28, 0.95) 0%, rgba(20, 26, 44, 0.9) 100%)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              borderRadius: '12px',
              padding: '2.5rem',
              color: '#f4efe6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.75rem', fontWeight: 500, color: '#f4efe6', margin: '0 0 0.5rem' }}>
                Find Your Ideal Home Layout
              </h3>
              <p style={{ color: '#a89d8e', margin: 0, fontSize: '0.94rem' }}>
                Compare 1, 2, 3, and 4-bedroom floor plans, see availability, and calculate exact lease estimates.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleFloorPlans}
                style={{
                  background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                  color: '#08090f',
                  padding: '0.8rem 1.65rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>View Floor Plans</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => handleSchedule()}
                style={{
                  backgroundColor: 'transparent',
                  color: '#dfc285',
                  padding: '0.8rem 1.65rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(201, 169, 110, 0.4)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Calendar size={15} />
                <span>Schedule a Tour</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
