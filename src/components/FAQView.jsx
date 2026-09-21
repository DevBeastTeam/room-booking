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
  Phone 
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
        a: 'Our on-site leasing office is open Monday through Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 5:00 PM. We are closed on Sunday. You can call our office directly at +1 817-646-5785.',
      },
      {
        q: 'Who manages Monarch Pass Apartments?',
        a: 'Monarch Pass is professionally managed by Cushman & Wakefield, one of the nation’s leading property management and commercial real estate firms.',
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
        a: 'Monarch Pass participates in the Low-Income Housing Tax Credit (LIHTC) program under Section 42 of the Internal Revenue Code. This federal and state (TDHCA) program provides high-quality apartment homes at below-market rental rates to qualifying households whose gross annual income falls at or below 30%, 50%, or 60% of the Area Median Income (AMI) for the Dallas-Fort Worth metro area.',
      },
      {
        q: 'What are the current maximum income limits?',
        a: 'Income limits are determined by household size. For example: A 1-person household limit ranges from $22,410 (30% AMI) up to $44,820 (60% AMI); a 4-person household limit ranges from $32,010 up to $64,020. Please refer to our Income Guidelines page for the complete 1–10 person qualification chart.',
      },
      {
        q: 'What documents are required to certify income during the application?',
        a: 'Applicants must supply: (1) Government-issued photo IDs for all adults, (2) Social security cards or birth certificates for all household members, (3) Six consecutive recent paystubs from all current jobs, (4) Most recent W-2s or tax returns, (5) Six months of checking and savings bank statements, and (6) Verification of any child support, SSI/SSDI, pension, or other recurring income.',
      },
      {
        q: 'Can full-time college students live here?',
        a: 'Under federal LIHTC regulations, households comprised entirely of full-time students must meet one of several statutory exemptions to qualify (e.g., married filing jointly, receiving TANF, enrolled in a job training program, or single parents with dependent children). Contact our office for details.',
      },
    ],
  },
  {
    category: 'apartment',
    categoryLabel: 'Apartments & Amenities',
    items: [
      {
        q: 'What appliances come standard in each apartment?',
        a: 'Every apartment features energy-efficient appliances, including a frost-free refrigerator with ice maker, electric range/oven, built-in dishwasher, garbage disposal, electronic digital thermostat, and ceiling fans.',
      },
      {
        q: 'What is your pet policy?',
        a: 'Monarch Pass is proudly pet-friendly! We allow up to 2 pets (dogs and cats) per apartment home. There is a one-time non-refundable fee of $350, monthly pet rent of $20 per pet, and a $150 refundable pet deposit. Purebred or mixed breed restrictions apply.',
      },
      {
        q: 'Is parking included with the apartment?',
        a: 'Open resident permit parking is provided throughout the community grounds. Optional assigned covered carport parking is also available for a nominal monthly fee ($35/month).',
      },
      {
        q: 'Are washer and dryer connections available?',
        a: 'Yes, select units feature full-size washer and dryer hookups. We also offer convenient on-site laundry facilities and appliance rental options.',
      },
    ],
  },
  {
    category: 'leasing',
    categoryLabel: 'Lease & Resident Portal',
    items: [
      {
        q: 'How do I pay rent each month?',
        a: 'Residents can easily and securely submit payments 24/7 online through the Resident Portal using ACH bank transfer, debit card, or credit card. Autopay options can also be configured.',
      },
      {
        q: 'How do I submit routine or emergency maintenance requests?',
        a: 'Routine service tickets can be submitted anytime via the Resident Dashboard or Resident Portal with photos and notes. For 24/7 emergency maintenance (such as active leaks or AC issues in summer), our on-call emergency service line is available 24 hours a day.',
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
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* ── 1. HERO BANNER ── */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 1rem',
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
            Help & Information Center
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
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 auto 2rem' }}>
            Find immediate answers regarding apartment availability, affordable housing qualifications, pet guidelines, and resident services.
          </p>

          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword (e.g. income, pets, parking)..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.85rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.95rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY PILLS ── */}
      <section style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General Info' },
            { id: 'income', label: 'Income Guidelines' },
            { id: 'apartment', label: 'Apartments & Pets' },
            { id: 'leasing', label: 'Lease & Portal' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeCategory === cat.id ? '1px solid #0f766e' : '1px solid #cbd5e1',
                backgroundColor: activeCategory === cat.id ? '#0f766e' : '#ffffff',
                color: activeCategory === cat.id ? '#ffffff' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. FAQ ACCORDION LIST ── */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
              <HelpCircle size={44} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>No matching questions found</h3>
              <p>Try searching for a different keyword or view all questions.</p>
            </div>
          ) : (
            filteredCategories.map((group, gIdx) => (
              <div key={gIdx} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                  {group.categoryLabel}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {group.items.map((item, iIdx) => {
                    const itemKey = `${group.category}-${iIdx}`;
                    const isOpen = Boolean(openItems[itemKey]);

                    return (
                      <div
                        key={iIdx}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <button
                          onClick={() => toggleItem(itemKey)}
                          style={{
                            width: '100%',
                            padding: '1.1rem 1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            textAlign: 'left',
                            backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          <span style={{ fontSize: '0.98rem', fontWeight: 600, color: '#0f172a', paddingRight: '1rem' }}>
                            {item.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={20} style={{ color: '#0f766e', flexShrink: 0 }} />
                          ) : (
                            <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />
                          )}
                        </button>

                        {isOpen && (
                          <div
                            style={{
                              padding: '1rem 1.25rem 1.25rem',
                              borderTop: '1px solid #f1f5f9',
                              backgroundColor: '#ffffff',
                              fontSize: '0.92rem',
                              color: '#475569',
                              lineHeight: 1.65,
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
              backgroundColor: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              marginTop: '3rem',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Still have questions about Monarch Pass?
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Our friendly on-site leasing office is here to help with personal tours, income qualifications, and unit availability.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="tel:+18176465785"
                style={{
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  textDecoration: 'none',
                }}
              >
                <Phone size={16} />
                <span>Call (817) 646-5785</span>
              </a>

              <button
                onClick={() => onOpenScheduleTour && onOpenScheduleTour()}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f766e',
                  border: '1px solid #0f766e',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
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
