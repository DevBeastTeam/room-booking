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
  Calendar,
  Sparkles
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
    name: 'Planet Fitness Fort Worth',
    category: 'health',
    distance: '2.4 miles',
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
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
      {/* ── 1. HERO HEADER ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1rem',
          backgroundImage: `linear-gradient(rgba(8, 9, 15, 0.8), rgba(8, 9, 15, 0.9)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/60-web-or-mls-campus%20dr-2104-906.jpg')`,
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
            <span>Prime Southeast Fort Worth</span>
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
            Map & Driving Directions
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#b5a999', lineHeight: 1.7, margin: '0 auto 1.75rem', maxWidth: '680px' }}>
            Conveniently situated on Campus Drive with immediate access to I-20 and I-35W in Southeast Fort Worth.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(201, 169, 110, 0.15)', border: '1px solid rgba(201, 169, 110, 0.35)', padding: '0.55rem 1.4rem', borderRadius: '6px' }}>
            <MapPin size={16} style={{ color: '#c9a96e' }} />
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f4efe6' }}>{destinationAddress}</span>
          </div>
        </div>
      </section>

      {/* ── 2. MAP & GET DIRECTIONS SECTION ── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
              marginBottom: '4.5rem',
            }}
          >
            {/* Driving Directions Box */}
            <div
              style={{
                backgroundColor: 'rgba(14, 18, 30, 0.85)',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                borderRadius: '12px',
                padding: '2.25rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Navigation size={22} style={{ color: '#c9a96e' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.65rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                  Get Driving Directions
                </h3>
              </div>
              <p style={{ color: '#9e9282', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Enter your starting location or address to get step-by-step navigation directly to Monarch Pass Apartments.
              </p>

              <form onSubmit={handleGetDirections}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                    Your Starting Address
                  </label>
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="e.g. Downtown Fort Worth, TX"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      borderRadius: '6px',
                      padding: '0.75rem 0.9rem',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                    Destination
                  </label>
                  <div
                    style={{
                      padding: '0.75rem 0.9rem',
                      backgroundColor: 'rgba(8, 9, 15, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: '#dfc285',
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
                    background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                    color: '#08090f',
                    padding: '0.85rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
                  }}
                >
                  <Navigation size={15} />
                  <span>Open in Google Maps</span>
                  <ExternalLink size={14} />
                </button>
              </form>

              {/* Office Contact Info */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(201, 169, 110, 0.15)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>
                  Leasing Office
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dfc285', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <Phone size={15} style={{ color: '#c9a96e' }} />
                  <a href="tel:+18178578782" style={{ color: 'inherit', textDecoration: 'none' }}>
                    (817) 857-8782
                  </a>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8c8273', lineHeight: 1.6 }}>
                  Mon – Fri: 10:00 AM – 6:00 PM<br />
                  Sat: 10:00 AM – 5:00 PM<br />
                  Sun: 1:00 PM – 5:00 PM
                </div>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div
              style={{
                height: '520px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -10px rgba(0,0,0,0.8)',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                backgroundColor: '#0a0d16',
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
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
                <span>Area Highlights</span>
                <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 500, color: '#f4efe6', margin: 0 }}>
                Neighborhood & Points of Interest
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '30px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.03em',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #c9a96e' : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: isActive ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#dfc285' : '#8c8273',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? '#c9a96e' : '#8c8273' }} />
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
                gap: '1.5rem',
              }}
            >
              {filteredPOIs.map((poi, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(14, 18, 30, 0.75)',
                    border: '1px solid rgba(201, 169, 110, 0.14)',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.14)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                      {poi.name}
                    </h3>
                    <span
                      style={{
                        backgroundColor: 'rgba(201, 169, 110, 0.15)',
                        color: '#dfc285',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {poi.distance}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#8c8273', marginBottom: '0.65rem' }}>
                    {poi.address}
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#b5a999', margin: 0, lineHeight: 1.5 }}>
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
