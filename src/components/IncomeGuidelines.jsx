import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Phone, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  DollarSign, 
  Info,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

export const INCOME_LIMITS = [
  { size: 1, ami80: 59760, ami140: 104580 },
  { size: 2, ami80: 68320, ami140: 119560 },
  { size: 3, ami80: 76800, ami140: 134400 },
  { size: 4, ami80: 85360, ami140: 149380 },
  { size: 5, ami80: 92160, ami140: 161280 },
  { size: 6, ami80: 99040, ami140: 173320 },
  { size: 7, ami80: 105840, ami140: 185220 },
  { size: 8, ami80: 112640, ami140: 197120 },
  { size: 9, ami80: 119520, ami140: 209160 },
  { size: 10, ami80: 133200, ami140: 233100 },
];

export default function IncomeGuidelines({
  onNavigateFloorPlans,
  onOpenContactSupport,
  siteSettings,
}) {
  const handleFloorPlans = onNavigateFloorPlans || (() => { window.location.href = '/floor-plans'; });
  const handleContactSupport = onOpenContactSupport || (() => { window.dispatchEvent(new CustomEvent('open-contact-modal')); });

  // Interactive Eligibility Checker state
  const [calcSize, setCalcSize] = useState(2);
  const [calcIncome, setCalcIncome] = useState('');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState({ 0: true });

  const toggleFaq = (index) => {
    setOpenFaq((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const selectedTier = INCOME_LIMITS.find((item) => item.size === calcSize) || INCOME_LIMITS[1];
  const parsedIncome = parseFloat(calcIncome.replace(/[^0-9.]/g, '')) || 0;

  let qualificationStatus = null;
  if (parsedIncome > 0) {
    if (parsedIncome <= selectedTier.ami80) {
      qualificationStatus = {
        level: '80% AMI',
        type: 'success',
        title: 'You likely qualify for 80% AMI reduced-rate housing!',
        desc: `Your entered gross annual income ($${parsedIncome.toLocaleString()}) is at or below the $${selectedTier.ami80.toLocaleString()} limit for a household size of ${calcSize}.`,
      };
    } else if (parsedIncome <= selectedTier.ami140) {
      qualificationStatus = {
        level: '140% AMI',
        type: 'info',
        title: 'You likely qualify for 140% AMI housing!',
        desc: `Your entered gross annual income ($${parsedIncome.toLocaleString()}) is within the 140% AMI bracket (up to $${selectedTier.ami140.toLocaleString()}) for a household size of ${calcSize}.`,
      };
    } else {
      qualificationStatus = {
        level: 'Over Limit',
        type: 'warning',
        title: 'Income exceeds program limits',
        desc: `Your entered income ($${parsedIncome.toLocaleString()}) exceeds the maximum 140% AMI threshold ($${selectedTier.ami140.toLocaleString()}) for ${calcSize} occupant(s). Contact our leasing concierge for alternative options.`,
      };
    }
  }

  const faqs = [
    {
      q: 'What if my household income changes?',
      a: 'Income eligibility is determined at the time of application certification. Our dedicated leasing specialists can review any updates or anticipated changes with you.',
    },
    {
      q: 'Does everyone qualify for affordable housing at Monarch Pass?',
      a: 'Affordable housing is program-based according to HUD Fort Worth guidelines. Reviewing the AMI limits table below is the ideal first step before scheduling your consultation.',
    },
    {
      q: 'How long does the qualification & approval process take?',
      a: 'Timelines typically range between 2 to 5 business days upon submission of complete proof-of-income documents. Our concierge keeps you informed at every milestone.',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem', color: '#f4efe6' }}>
      {/* ── Page Header / Intro ── */}
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 3rem', padding: '0 1rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
            color: '#dfc285',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            marginBottom: '1.25rem',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            boxShadow: '0 0 20px rgba(201, 169, 110, 0.12)',
          }}
        >
          <ShieldCheck size={16} />
          <span>Affordable Housing Program Guidelines</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 600,
            color: '#f8fafc',
            marginBottom: '1.25rem',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
          }}
        >
          Luxury Living with <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Affordable Program Limits</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '780px', margin: '0 auto 2rem' }}>
          {siteSettings?.siteName || 'Monarch Pass'} offers premium apartment residences with reduced rents through the Fort Worth affordable housing program. Eligibility is determined by total gross household income and household occupancy size.
        </p>

        <div
          style={{
            backgroundColor: 'rgba(16, 20, 34, 0.8)',
            border: '1px solid rgba(201, 169, 110, 0.25)',
            borderLeft: '4px solid #c9a96e',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            textAlign: 'left',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} style={{ color: '#c9a96e' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f4efe6', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Are you a Qualified Applicant?
            </h2>
          </div>
          <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
            Our bilingual leasing concierge is pleased to guide you step-by-step through the application. Eligibility is based on total annual household income before taxes, and all adult residents (18+) must participate in the verification process.
          </p>
        </div>
      </div>

      {/* ── Official Limits Table ── */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#f8fafc', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
            Maximum Income Limits by Number of Occupants
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            Annual gross household income thresholds based on the Fort Worth Area Median Income (AMI).
          </p>
        </div>

        <div
          style={{
            overflowX: 'auto',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(201, 169, 110, 0.25)',
            backgroundColor: 'rgba(12, 16, 28, 0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: '820px',
              borderCollapse: 'collapse',
              textAlign: 'center',
              fontFamily: 'inherit',
            }}
          >
            <thead>
              {/* Luxury Gold Banner */}
              <tr
                style={{
                  background: 'linear-gradient(90deg, rgba(201, 169, 110, 0.25) 0%, rgba(12, 16, 28, 0.95) 50%, rgba(201, 169, 110, 0.25) 100%)',
                  borderBottom: '1px solid rgba(201, 169, 110, 0.35)',
                }}
              >
                <th
                  colSpan={11}
                  style={{
                    padding: '1.1rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#dfc285',
                  }}
                >
                  Maximum Income Limits by Number of Occupants (Fort Worth AMI)
                </th>
              </tr>

              {/* Columns for Household Size 1 to 10 */}
              <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(201, 169, 110, 0.18)' }}>
                <th
                  style={{
                    padding: '0.95rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#c9a96e',
                    textAlign: 'left',
                    width: '150px',
                    borderRight: '1px solid rgba(201, 169, 110, 0.15)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Household Size &rarr;
                </th>
                {INCOME_LIMITS.map((item) => (
                  <th
                    key={item.size}
                    style={{
                      padding: '0.95rem 0.6rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#f4efe6',
                      backgroundColor: item.size % 2 === 0 ? 'rgba(201, 169, 110, 0.05)' : 'transparent',
                      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    {item.size} {item.size === 1 ? 'Person' : 'People'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 80% AMI Row */}
              <tr style={{ borderBottom: '1px solid rgba(201, 169, 110, 0.15)' }}>
                <td
                  style={{
                    padding: '1rem 1.25rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#dfc285',
                    textAlign: 'left',
                    backgroundColor: 'rgba(201, 169, 110, 0.08)',
                    borderRight: '1px solid rgba(201, 169, 110, 0.18)',
                  }}
                >
                  80% AMI Limit
                </td>
                {INCOME_LIMITS.map((item) => (
                  <td
                    key={item.size}
                    style={{
                      padding: '1rem 0.6rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#f4efe6',
                      backgroundColor: item.size % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.15)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    ${item.ami80.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* 140% AMI Row */}
              <tr>
                <td
                  style={{
                    padding: '1rem 1.25rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#93c5fd',
                    textAlign: 'left',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    borderRight: '1px solid rgba(201, 169, 110, 0.18)',
                  }}
                >
                  140% AMI Limit
                </td>
                {INCOME_LIMITS.map((item) => (
                  <td
                    key={item.size}
                    style={{
                      padding: '1rem 0.6rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#f4efe6',
                      backgroundColor: item.size % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.15)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    ${item.ami140.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Interactive Eligibility Quick Calculator ── */}
      <div
        style={{
          backgroundColor: 'rgba(16, 20, 34, 0.9)',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          borderRadius: '16px',
          padding: '2.5rem',
          marginBottom: '4rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              backgroundColor: 'rgba(201, 169, 110, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c9a96e',
            }}
          >
            <Calculator size={20} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#f8fafc', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
            Instant Income Eligibility Checker
          </h3>
        </div>
        <p style={{ fontSize: '0.925rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '640px' }}>
          Verify your preliminary qualification before initiating your online application. Select your household size and enter your estimated annual gross income.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Field 1: Household Size */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c9a96e', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Number of Occupants (Household Size)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {INCOME_LIMITS.map((item) => {
                const isSelected = calcSize === item.size;
                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setCalcSize(item.size)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 800 : 500,
                      background: isSelected
                        ? 'linear-gradient(135deg, #c9a96e, #a88448)'
                        : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#08090f' : '#f4efe6',
                      border: isSelected ? '1px solid #dfc285' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 15px rgba(201, 169, 110, 0.3)' : 'none',
                    }}
                  >
                    {item.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 2: Annual Gross Income */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#c9a96e', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Annual Gross Household Income ($)
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#c9a96e',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                $
              </span>
              <input
                type="number"
                placeholder={`e.g. ${selectedTier.ami80}`}
                value={calcIncome}
                onChange={(e) => setCalcIncome(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.4rem',
                  fontSize: '1.05rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(201, 169, 110, 0.35)',
                  backgroundColor: 'rgba(8, 10, 18, 0.75)',
                  color: '#f8fafc',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
                }}
              />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              80% AMI Max: <strong style={{ color: '#dfc285' }}>${selectedTier.ami80.toLocaleString()}</strong> · 140% AMI Max: <strong style={{ color: '#93c5fd' }}>${selectedTier.ami140.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Calculation Result Banner */}
        {qualificationStatus && (
          <div
            className="animate-slide-down"
            style={{
              backgroundColor:
                qualificationStatus.type === 'success'
                  ? 'rgba(6, 78, 59, 0.35)'
                  : qualificationStatus.type === 'info'
                  ? 'rgba(30, 58, 138, 0.35)'
                  : 'rgba(120, 53, 15, 0.35)',
              border: `1px solid ${
                qualificationStatus.type === 'success'
                  ? 'rgba(52, 211, 153, 0.4)'
                  : qualificationStatus.type === 'info'
                  ? 'rgba(96, 165, 250, 0.4)'
                  : 'rgba(251, 191, 36, 0.4)'
              }`,
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CheckCircle2
              size={24}
              style={{
                color:
                  qualificationStatus.type === 'success'
                    ? '#34d399'
                    : qualificationStatus.type === 'info'
                    ? '#60a5fa'
                    : '#fbbf24',
                flexShrink: 0,
                marginTop: '2px',
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color:
                    qualificationStatus.type === 'success'
                      ? '#6ee7b7'
                      : qualificationStatus.type === 'info'
                      ? '#93c5fd'
                      : '#fde68a',
                  marginBottom: '0.35rem',
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                }}
              >
                {qualificationStatus.title}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                }}
              >
                {qualificationStatus.desc}
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleFloorPlans}
                  className="btn-gold"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Explore Matching Floor Plans
                </button>
                <button
                  type="button"
                  onClick={handleContactSupport}
                  className="btn-outline-gold"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Consult Leasing Specialist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Alternating 3 Feature Sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '4rem' }}>
        
        {/* Section 1: How Affordable Housing Works */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(201, 169, 110, 0.25)',
            backgroundColor: 'rgba(16, 20, 34, 0.85)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              minHeight: '300px',
              backgroundImage: "url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/themes/gracia/images/../../common/images/pagelayouts/layout6-img-01.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              How Affordable Housing Works
            </h2>
            <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.9, margin: '0 0 2rem' }}>
              <li>Apartment rents are significantly reduced through the Fort Worth housing initiative</li>
              <li>Eligibility is calculated from gross household income and household occupancy</li>
              <li>Income limits are updated annually to reflect regional economic data</li>
              <li>All adult co-occupants (18+) are included in income verification</li>
              <li>Clear compliance verification guarantees your locked monthly rent</li>
            </ul>
            <div>
              <button
                type="button"
                onClick={handleFloorPlans}
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  fontSize: '0.9rem',
                }}
              >
                <span>View Available Residences</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: What Is Considered Household Income? */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(201, 169, 110, 0.25)',
            backgroundColor: 'rgba(16, 20, 34, 0.85)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: 1 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              What Is Considered Household Income?
            </h2>
            <p style={{ color: '#c9a96e', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>
              Household income review covers all recurring revenue sources, including:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.9, margin: 0 }}>
              <li>Employment wages, base salary, and recurring tips</li>
              <li>Consistent overtime, performance bonuses, or commissions</li>
              <li>Social Security, disability, or pension compensation</li>
              <li>Retirement distributions and annuity benefits</li>
              <li>Court-ordered child support or alimony receipts</li>
              <li>Self-employment net income from schedule C/1099 filings</li>
            </ul>
          </div>
          <div
            style={{
              minHeight: '300px',
              backgroundImage: "url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/themes/gracia/images/../../common/images/pagelayouts/layout6-img-03.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              order: 2,
            }}
          />
        </div>

        {/* Section 3: What You’ll Need to Apply */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(201, 169, 110, 0.25)',
            backgroundColor: 'rgba(16, 20, 34, 0.85)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              minHeight: '300px',
              backgroundImage: "url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/themes/gracia/images/../../common/images/pagelayouts/layout6-img-02.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              What You’ll Need to Apply
            </h2>
            <p style={{ color: '#c9a96e', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>
              For expedited compliance review, please assemble the following documentation:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.9, margin: '0 0 2rem' }}>
              <li>Government-issued photo identification for all adult household members</li>
              <li>Consecutive recent pay stubs (3 to 6 periods) or formal employer offer letter</li>
              <li>Bank statements and tax returns for self-employed applicants</li>
              <li>Official award letters for benefits, retirement, or child support</li>
            </ul>
            <div>
              <button
                type="button"
                onClick={handleContactSupport}
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  fontSize: '0.9rem',
                }}
              >
                <span>Initiate Application Review</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Next Steps Callout ── */}
      <div
        style={{
          textAlign: 'center',
          backgroundColor: 'rgba(16, 20, 34, 0.9)',
          border: '1px solid rgba(201, 169, 110, 0.35)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          marginBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(201, 169, 110, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
          Ready to Begin Your Residency?
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
          Our certified leasing professionals are available to review your qualification profile confidentially and answer any questions.
        </p>
        <button
          type="button"
          onClick={handleContactSupport}
          className="btn-gold"
          style={{
            padding: '1rem 2.5rem',
            fontSize: '0.95rem',
            letterSpacing: '0.08em',
          }}
        >
          CONTACT LEASING CONCIERGE
        </button>
      </div>

      {/* ── Frequently Asked Questions (FAQ) ── */}
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#f8fafc', textAlign: 'center', marginBottom: '1.75rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = Boolean(openFaq[idx]);
            return (
              <div
                key={idx}
                style={{
                  border: isOpen ? '1px solid rgba(201, 169, 110, 0.4)' : '1px solid rgba(201, 169, 110, 0.18)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 20, 34, 0.75)',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isOpen ? '#dfc285' : '#f4efe6',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} style={{ color: '#c9a96e' }} /> : <ChevronDown size={20} style={{ color: '#94a3b8' }} />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.5rem',
                      color: '#94a3b8',
                      fontSize: '0.925rem',
                      lineHeight: 1.7,
                      borderTop: '1px solid rgba(201, 169, 110, 0.12)',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
