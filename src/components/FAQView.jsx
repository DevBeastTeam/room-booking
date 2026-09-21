import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShieldCheck, 
  Home, 
  DollarSign, 
  Calendar, 
  Phone,
  Sparkles
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'general',
    categoryLabel: 'General Information',
    items: [
      {
        q: 'Where is Monarch Pass Apartments located?',
        a: 'Monarch Pass is located at 4500 Campus Drive, Fort Worth, TX 76119. We are conveniently situated in Southeast Fort Worth right off Campus Drive, walking distance from Tarrant County College South Campus, with quick access to I-20 and I-35W.',
      },
      {
        q: 'What are your leasing office hours?',
        a: 'Our on-site leasing office is open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 5:00 PM, Sunday from 1:00 PM to 5:00 PM. You can call our office directly at (817) 857-8782.',
      },
      {
        q: 'Who manages Monarch Pass Apartments?',
        a: 'Monarch Pass is professionally managed by Cushman & Wakefield, one of the nation\'s premier residential and commercial real estate management firms.',
      },
      {
        q: 'Which school district serves this community?',
        a: 'Monarch Pass is served by the Fort Worth Independent School District (FWISD), including South Hills High School, nearby middle schools, and elementary campuses.',
      },
    ],
  },
  {
    category: 'income',
    categoryLabel: 'Income Guidelines & Eligibility',
    items: [
      {
        q: 'What is the Affordable Housing / AMI program?',
        a: 'Monarch Pass participates in established Section 42 Low-Income Housing Tax Credit (LIHTC) programs administered by the Texas Department of Housing and Community Affairs (TDHCA). This program offers high-quality apartment homes at restricted rental rates to households qualifying under 30%, 50%, or 60% Area Median Income (AMI) limits for the Fort Worth metro area.',
      },
      {
        q: 'What are the current maximum income limits?',
        a: 'Income limits are based on household occupancy. For instance, a 1-person household qualifies up to $43,740 at the 60% AMI tier, while a 4-person household limit extends up to $62,460. Visit our Income Guidelines page for full qualification tables.',
      },
      {
        q: 'What documentation is needed during the application?',
        a: 'Applicants provide: (1) Government-issued photo IDs for adults, (2) Social security cards or birth certificates for household members, (3) Consecutive recent paystubs from current employers, (4) Recent W-2s or tax filings, (5) Recent bank statements, and (6) Verification of any child support, disability, SSI, or pension income.',
      },
      {
        q: 'Can full-time college students live here?',
        a: 'Under federal LIHTC regulations, households comprised entirely of full-time students must qualify under statutory exemptions (e.g., married filing jointly, receiving TANF, single parent with dependent child). Contact our office for personalized evaluation.',
      },
    ],
  },
  {
    category: 'apartment',
    categoryLabel: 'Apartments & Amenities',
    items: [
      {
        q: 'What appliances come standard in each apartment?',
        a: 'Every residence features high-efficiency black appliance suites, including a frost-free refrigerator with ice maker, electric range and oven, built-in dishwasher, and garbage disposal.',
      },
      {
        q: 'What is your pet policy?',
        a: 'Monarch Pass welcomes up to 2 pets (cats and dogs) per apartment home. There is a one-time non-refundable fee of $350, monthly pet rent of $20 per pet, and a $150 refundable pet deposit. Breed restrictions apply.',
      },
      {
        q: 'Is parking included with the apartment?',
        a: 'Open resident permit parking is provided throughout the community grounds. Optional assigned covered carport parking is also available for a nominal monthly fee ($35/month).',
      },
      {
        q: 'Are washer and dryer connections available?',
        a: 'Select units feature full-size washer and dryer hookups. We also offer convenient on-site laundry facilities and appliance rental options.',
      },
    ],
  },
  {
    category: 'leasing',
    categoryLabel: 'Lease & Resident Services',
    items: [
      {
        q: 'How do I pay rent each month?',
        a: 'Residents can easily and securely submit payments 24/7 online through the Resident Portal using ACH bank transfer, debit card, or credit card. Autopay options can also be configured.',
      },
      {
        q: 'How do I submit routine or emergency maintenance requests?',
        a: 'Routine service tickets can be submitted anytime via the Resident Dashboard or Resident Portal with photos and notes. For 24/7 emergency maintenance, our on-call emergency service line is available around the clock.',
      },
      {
        q: 'How long are the lease terms offered?',
        a: 'We offer standard 12-month lease agreements. Flexible lease terms may also be discussed with our on-site leasing office based on current availability.',
      },
    ],
  },
];

export default function FAQView({
  onNavigateGuidelines,
  onOpenScheduleTour,
}) {
  const handleGuidelines = onNavigateGuidelines || (() => { window.location.href = '/income-guidelines'; });
  const handleSchedule = onOpenScheduleTour || ((bed = '', unit = '') => { window.dispatchEvent(new CustomEvent('open-schedule-tour', { detail: { bed, unit } })); });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_DATA.map((cat) => {
    if (activeCategory !== 'all' && cat.category !== activeCategory) {
      return null;
    }
    const matchingItems = cat.items.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    });
    return { ...cat, items: matchingItems };
  }).filter(Boolean);

  return (
    <div style={{ backgroundColor: '#08090f', color: '#e8e0d4', minHeight: '100vh' }}>
      {/* ── 1. HERO BANNER ── */}
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
            <span>Resident Knowledge Base</span>
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
            Frequently Asked Questions
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#b5a999', lineHeight: 1.7, margin: '0 auto 2.25rem', maxWidth: '680px' }}>
            Find immediate answers regarding apartment availability, affordable housing qualifications, pet guidelines, and resident portal services.
          </p>

          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#c9a96e',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. income, pets, deposit, parking)..."
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem 0.9rem 3.2rem',
                borderRadius: '8px',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                backgroundColor: 'rgba(12, 16, 28, 0.9)',
                color: '#f4efe6',
                fontSize: '0.92rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY PILLS ── */}
      <section style={{ backgroundColor: '#0c101c', borderBottom: '1px solid rgba(201, 169, 110, 0.15)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General Info' },
            { id: 'income', label: 'Income Guidelines' },
            { id: 'apartment', label: 'Apartments & Pets' },
            { id: 'leasing', label: 'Lease & Portal' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.55rem 1.3rem',
                  borderRadius: '4px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: isActive ? '1px solid #c9a96e' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(201, 169, 110, 0.18)' : 'transparent',
                  color: isActive ? '#dfc285' : '#8c8273',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. FAQ ACCORDION LIST ── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#8c8273' }}>
              <HelpCircle size={48} style={{ margin: '0 auto 1rem', color: '#c9a96e', opacity: 0.5 }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', color: '#f4efe6', marginBottom: '0.5rem' }}>No matching questions found</h3>
              <p style={{ fontSize: '0.92rem' }}>Try searching for a different keyword or reset category filter.</p>
            </div>
          ) : (
            filteredCategories.map((group, gIdx) => (
              <div key={gIdx} style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span style={{ width: '4px', height: '20px', backgroundColor: '#c9a96e', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.55rem', fontWeight: 600, color: '#f4efe6', margin: 0 }}>
                    {group.categoryLabel}
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {group.items.map((item, iIdx) => {
                    const itemKey = `${group.category}-${iIdx}`;
                    const isOpen = Boolean(openItems[itemKey]);

                    return (
                      <div
                        key={iIdx}
                        style={{
                          border: isOpen ? '1px solid rgba(201, 169, 110, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: isOpen ? 'rgba(16, 20, 34, 0.95)' : 'rgba(14, 18, 30, 0.75)',
                          transition: 'all 0.25s',
                        }}
                      >
                        <button
                          onClick={() => toggleItem(itemKey)}
                          style={{
                            width: '100%',
                            padding: '1.15rem 1.4rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontSize: '0.96rem', fontWeight: 600, color: isOpen ? '#dfc285' : '#f4efe6', paddingRight: '1rem', lineHeight: 1.4 }}>
                            {item.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={18} style={{ color: '#c9a96e', flexShrink: 0 }} />
                          ) : (
                            <ChevronDown size={18} style={{ color: '#7a7063', flexShrink: 0 }} />
                          )}
                        </button>

                        {isOpen && (
                          <div
                            style={{
                              padding: '1rem 1.4rem 1.35rem',
                              borderTop: '1px solid rgba(201, 169, 110, 0.12)',
                              fontSize: '0.92rem',
                              color: '#b5a999',
                              lineHeight: 1.7,
                            }}
                          >
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Still Have Questions Box */}
          <div
            style={{
              backgroundColor: 'rgba(14, 18, 30, 0.85)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              borderRadius: '12px',
              padding: '2.5rem',
              textAlign: 'center',
              marginTop: '3.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.85rem', fontWeight: 500, color: '#f4efe6', margin: '0 0 0.5rem' }}>
              Still have questions about Monarch Pass?
            </h3>
            <p style={{ color: '#a89d8e', fontSize: '0.94rem', maxWidth: '520px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Our dedicated on-site leasing office is here to help with personalized tours, income certification, and residence availability.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="tel:+18178578782"
                style={{
                  background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                  color: '#08090f',
                  padding: '0.75rem 1.65rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  textDecoration: 'none',
                }}
              >
                <Phone size={15} />
                <span>Call (817) 857-8782</span>
              </a>

              <button
                onClick={() => handleSchedule()}
                style={{
                  backgroundColor: 'transparent',
                  color: '#dfc285',
                  padding: '0.75rem 1.65rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(201, 169, 110, 0.4)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Calendar size={15} />
                <span>Schedule a Private Tour</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
