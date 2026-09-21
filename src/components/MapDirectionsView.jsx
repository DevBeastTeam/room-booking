import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Briefcase, 
  Dumbbell, 
  Trees, 
  Dog, 
  Utensils, 
  GraduationCap, 
  ShoppingBag, 
  ExternalLink, 
  Phone, 
  Calendar 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Places', icon: MapPin },
  { id: 'employers', label: 'Major Employers', icon: Briefcase },
  { id: 'schools', label: 'Schools & Colleges', icon: GraduationCap },
  { id: 'dining', label: 'Dining & Food', icon: Utensils },
  { id: 'parks', label: 'Parks & Recreation', icon: Trees },
  { id: 'health', label: 'Health & Fitness', icon: Dumbbell },
  { id: 'shopping', label: 'Shopping & Groceries', icon: ShoppingBag },
  { id: 'pets', label: 'Pet-Friendly', icon: Dog },
];

const POIS = [
  {
    name: 'Tarrant County College - South Campus',
    category: 'schools',
    distance: '0.4 miles (Walking distance)',
    address: '5301 Campus Dr, Fort Worth, TX 76119',
    note: 'Higher education and academic programs right next door.',
  },
  {
    name: 'GXO Logistics',
    category: 'employers',
    distance: '2.1 miles',
    address: 'Carter Industrial Park, Fort Worth, TX',
    note: 'Major logistics and supply chain employment center.',
  },
  {
    name: 'Lineage Logistics',
    category: 'employers',
    distance: '2.8 miles',
    address: 'Fort Worth, TX',
    note: 'Global cold-storage and temperature-controlled logistics hub.',
  },
  {
    name: 'Alcon Laboratories Global HQ',
    category: 'employers',
    distance: '6.5 miles',
    address: '6201 South Fwy, Fort Worth, TX 76134',
    note: 'World leader in eyecare medical devices and pharmaceuticals.',
  },
  {
    name: 'Fiesta Mart & Campus Drive Shopping Center',
    category: 'shopping',
    distance: '0.9 miles',
    address: 'Campus Dr & I-20, Fort Worth, TX',
    note: 'Fresh produce, international grocery items, bakery, and pharmacy.',
  },
  {
    name: 'Walmart Supercenter',
    category: 'shopping',
    distance: '3.2 miles',
    address: '6756 Bridge St, Fort Worth, TX',
    note: 'Complete grocery, home essentials, electronics, and pharmacy.',
  },
  {
    name: 'Rolling Hills Park & Recreation Grounds',
    category: 'parks',
    distance: '1.5 miles',
    address: 'Rolling Hills Dr, Fort Worth, TX',
    note: 'Walking trails, shaded green spaces, and sports fields.',
  },
  {
    name: 'Lake Arlington & Richard Simpson Park',
    category: 'parks',
    distance: '5.8 miles',
    address: 'Lake Arlington, TX',
    note: 'Boating, fishing piers, lakefront picnic shelters, and jogging trails.',
  },
  {
    name: "Madea's Down Home Cooking",
    category: 'dining',
    distance: '1.8 miles',
    address: 'Fort Worth, TX',
    note: 'Acclaimed authentic Southern soul food, fried chicken, and peach cobbler.',
  },
  {
    name: "Smokey's Ribs & Texas BBQ",
    category: 'dining',
    distance: '2.4 miles',
    address: 'Fort Worth, TX',
    note: 'Slow-smoked Texas brisket, ribs, sausage, and traditional sides.',
  },
  {
    name: 'Texas Health Resources - Fort Worth Hospital',
    category: 'health',
    distance: '7.2 miles',
    address: '1301 Pennsylvania Ave, Fort Worth, TX 76104',
    note: 'Level II Trauma hospital and comprehensive medical center.',
  },
  {
    name: 'Planet Fitness Fort Worth South',
    category: 'health',
    distance: '2.6 miles',
    address: 'Fort Worth, TX',
    note: '24/7 fitness facility with cardio, weight training, and wellness rooms.',
  },
  {
    name: 'Fort Worth ZBonz Dog Park',
    category: 'pets',
    distance: '8.4 miles',
    address: 'Fort Worth, TX',
    note: 'Fully fenced 10-acre park with agility equipment and dog swimming pond.',
  },
  {
    name: 'South Hills High School (FWISD)',
    category: 'schools',
    distance: '3.5 miles',
    address: '6101 McCart Ave, Fort Worth, TX 76133',
    note: 'Fort Worth Independent School District high school campus.',
  },
];

export default function MapDirectionsView({
  onOpenScheduleTour,
  siteSettings,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [userAddress, setUserAddress] = useState('');

  const filteredPOIs = activeCategory === 'all' 
    ? POIS 
    : POIS.filter((item) => item.category === activeCategory);

  const destinationAddress = '4500 Campus Drive, Fort Worth, TX 76119';

  const handleGetDirections = (e) => {
    e.preventDefault();
    const origin = encodeURIComponent(userAddress.trim() || 'Fort Worth, TX');
    const dest = encodeURIComponent(destinationAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* ── 1. HERO HEADER ── */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 1rem',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/60-web-or-mls-campus%20dr-2104-906.jpg')`,
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
            Fort Worth, TX
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
            Map & Driving Directions
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
            Conveniently situated on Campus Drive near I-20 and I-35W in Southeast Fort Worth.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.5rem 1.25rem', borderRadius: '6px' }}>
            <MapPin size={18} style={{ color: '#2dd4bf' }} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{destinationAddress}</span>
          </div>
        </div>
      </section>

      {/* ── 2. MAP & GET DIRECTIONS SECTION ── */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 380px) 1fr',
              gap: '2rem',
              alignItems: 'start',
              marginBottom: '3.5rem',
            }}
          >
            {/* Driving Directions Box */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Navigation size={22} style={{ color: '#0f766e' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Get Driving Directions
                </h3>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Enter your current location or address to get step-by-step navigation directly to Monarch Pass Apartments.
              </p>

              <form onSubmit={handleGetDirections}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Your Starting Address
                  </label>
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="e.g. Downtown Fort Worth, TX"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Destination
                  </label>
                  <div
                    style={{
                      padding: '0.75rem 0.85rem',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  >
                    4500 Campus Drive, Fort Worth, TX 76119
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#0f766e',
                    color: '#ffffff',
                    padding: '0.8rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d6460')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f766e')}
                >
                  <Navigation size={16} />
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </button>
              </form>

              {/* Office Contact Info */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>
                  Leasing Office
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f766e', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <Phone size={16} />
                  <a href="tel:+18176465785" style={{ color: 'inherit', textDecoration: 'none' }}>
                    +1 817-646-5785
                  </a>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                  Mon - Fri: 9:00 AM - 6:00 PM<br />
                  Sat: 10:00 AM - 5:00 PM<br />
                  Sun: Closed
                </div>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div
              style={{
                height: '520px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f1f5f9',
              }}
            >
              <iframe
                title="Monarch Pass Location Map"
                src="https://maps.google.com/maps?q=4500%20Campus%20Drive%2C%20Fort%20Worth%2C%20TX%2076119&t=&z=14&ie=UTF8&iwloc=&output=embed"
                style={{ width: '100%', height: '100%', border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ── 3. POINTS OF INTEREST BY CATEGORY ── */}
          <div>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
              <h2 style={{ fontSize: '1.85rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                Neighborhood & Points of Interest
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Explore top employers, universities, parks, and dining options surrounding Monarch Pass.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #0f766e' : '1px solid #cbd5e1',
                      backgroundColor: isActive ? '#0f766e' : '#ffffff',
                      color: isActive ? '#ffffff' : '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* POI Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {filteredPOIs.map((poi, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {poi.name}
                    </h3>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#0f766e',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {poi.distance}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    {poi.address}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                    {poi.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
