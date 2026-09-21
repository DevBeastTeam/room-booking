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
  Calendar
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
        desc: `Your entered income ($${parsedIncome.toLocaleString()}) exceeds the maximum 140% AMI threshold ($${selectedTier.ami140.toLocaleString()}) for ${calcSize} occupant(s). Contact our leasing team for market-rate options.`,
      };
    }
  }

  const faqs = [
    {
      q: 'What if my income changes?',
      a: 'Income eligibility is determined at the time of application. Our team can help review any changes.',
    },
    {
      q: 'Does everyone qualify for affordable housing?',
      a: 'Affordable housing is income-based, and not all households will qualify. Reviewing the income limits above is the best first step.',
    },
    {
      q: 'How long does the approval process take?',
      a: 'Approval timelines may vary based on documentation provided. Our team will keep you informed throughout the process.',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* ── Page Header / Intro ── */}
      <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 2.5rem', padding: '0 1rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#e6fffa',
            color: '#0f766e',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            marginBottom: '1rem',
            border: '1px solid #99f6e4',
          }}
        >
          <ShieldCheck size={16} />
          <span>Affordable Housing Program Guidelines</span>
        </div>

        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: '#1e293b',
            marginBottom: '1rem',
            fontFamily: 'serif',
          }}
        >
          Modern Living with Maximum Income Limits
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {siteSettings?.siteName || 'Monarch Pass'} offers quality apartment homes with reduced rents through an affordable housing program. Eligibility is based on total household income and household size. Review the income limits below to see if you may qualify.
        </p>

        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.25rem 1.75rem',
            textAlign: 'left',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            Are you a Qualified Applicant?
          </h2>
          <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            Our leasing team is happy to guide you through the process. Eligibility is based on total household income before taxes and all adults in the household must be included in the application.
          </p>
        </div>
      </div>

      {/* ── Official Limits Table ── */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Maximum Income Limits by Number of Occupants
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Annual gross household income limits based on Fort Worth area median income (AMI).
          </p>
        </div>

        <div
          style={{
            overflowX: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #cbd5e1',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: '780px',
              borderCollapse: 'collapse',
              textAlign: 'center',
              fontFamily: 'inherit',
            }}
          >
            <thead>
              {/* Header Banner */}
              <tr style={{ backgroundColor: '#68c7b7', color: '#ffffff' }}>
                <th
                  colSpan={11}
                  style={{
                    padding: '0.9rem',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  Maximum Income Limits by Number of Occupants
                </th>
              </tr>
              {/* Columns for Household Size 1 to 10 */}
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                <th
                  style={{
                    padding: '0.85rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#334155',
                    textAlign: 'left',
                    width: '140px',
                    borderRight: '1px solid #cbd5e1',
                  }}
                >
                  Household Size &rarr;
                </th>
                {INCOME_LIMITS.map((item) => (
                  <th
                    key={item.size}
                    style={{
                      padding: '0.85rem 0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: item.size % 2 === 0 ? '#0f766e' : '#1e293b',
                      backgroundColor: item.size % 2 === 0 ? '#e6f4f1' : '#f8fafc',
                      borderRight: '1px solid #e2e8f0',
                    }}
                  >
                    {item.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 80% AMI Row */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td
                  style={{
                    padding: '0.9rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#0f766e',
                    textAlign: 'left',
                    backgroundColor: '#f8fafc',
                    borderRight: '1px solid #cbd5e1',
                  }}
                >
                  80% AMI
                </td>
                {INCOME_LIMITS.map((item) => (
                  <td
                    key={item.size}
                    style={{
                      padding: '0.9rem 0.5rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      backgroundColor: item.size % 2 === 0 ? '#d6e2ea' : '#e9f1f5',
                      borderRight: '1px solid #cbd5e1',
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
                    padding: '0.9rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#0369a1',
                    textAlign: 'left',
                    backgroundColor: '#f8fafc',
                    borderRight: '1px solid #cbd5e1',
                  }}
                >
                  140% AMI
                </td>
                {INCOME_LIMITS.map((item) => (
                  <td
                    key={item.size}
                    style={{
                      padding: '0.9rem 0.5rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      backgroundColor: item.size % 2 === 0 ? '#d6e2ea' : '#e9f1f5',
                      borderRight: '1px solid #cbd5e1',
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
          backgroundColor: '#f0fdfa',
          border: '1px solid #99f6e4',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3.5rem',
          boxShadow: '0 4px 15px rgba(15,118,110,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Calculator size={22} style={{ color: '#0f766e' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f766e', margin: 0 }}>
            Instant Income Eligibility Checker
          </h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem' }}>
          Quickly check if your household meets the qualifying gross income criteria before applying.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Field 1: Household Size */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Number of Occupants (Household Size)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {INCOME_LIMITS.map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => setCalcSize(item.size)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: calcSize === item.size ? 700 : 500,
                    backgroundColor: calcSize === item.size ? '#0f766e' : '#ffffff',
                    color: calcSize === item.size ? '#ffffff' : '#334155',
                    border: calcSize === item.size ? '1px solid #0f766e' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {/* Field 2: Annual Gross Income */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Total Annual Gross Household Income ($)
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  fontWeight: 600,
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
                  padding: '0.65rem 1rem 0.65rem 2rem',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
              80% AMI Max: <strong>${selectedTier.ami80.toLocaleString()}</strong> · 140% AMI Max: <strong>${selectedTier.ami140.toLocaleString()}</strong>
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
                  ? '#ecfdf5'
                  : qualificationStatus.type === 'info'
                  ? '#f0f9ff'
                  : '#fffbeb',
              border: `1px solid ${
                qualificationStatus.type === 'success'
                  ? '#6ee7b7'
                  : qualificationStatus.type === 'info'
                  ? '#7dd3fc'
                  : '#fcd34d'
              }`,
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <CheckCircle2
              size={22}
              style={{
                color:
                  qualificationStatus.type === 'success'
                    ? '#059669'
                    : qualificationStatus.type === 'info'
                    ? '#0284c7'
                    : '#d97706',
                flexShrink: 0,
                marginTop: '2px',
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color:
                    qualificationStatus.type === 'success'
                      ? '#065f46'
                      : qualificationStatus.type === 'info'
                      ? '#0369a1'
                      : '#92400e',
                  marginBottom: '0.2rem',
                }}
              >
                {qualificationStatus.title}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#475569',
                  lineHeight: 1.5,
                }}
              >
                {qualificationStatus.desc}
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleFloorPlans}
                  style={{
                    backgroundColor: '#0f766e',
                    color: '#ffffff',
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  View Qualifying Floor Plans
                </button>
                <button
                  type="button"
                  onClick={handleContactSupport}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#0f766e',
                    border: '1px solid #0f766e',
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Speak with Leasing Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Alternating 3 Feature Sections (Exact Monarch Pass Copy) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '3.5rem' }}>
        
        {/* Section 1: How Affordable Housing Works */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              minHeight: '260px',
              backgroundImage: "url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/themes/gracia/images/../../common/images/pagelayouts/layout6-img-01.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
              How Affordable Housing Works
            </h2>
            <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
              <li>Apartment rents are reduced through an affordable housing program</li>
              <li>Eligibility is based on total household income and household size</li>
              <li>Income limits are set annually and may change</li>
              <li>All adult household members must be included in the income review</li>
              <li>Income must be verified and approved prior to move-in</li>
            </ul>
            <div>
              <button
                type="button"
                onClick={handleFloorPlans}
                style={{
                  backgroundColor: '#4a4e57',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2c3038')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a4e57')}
              >
                <span>View Floorplans</span>
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
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: 1 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
              What Is Considered Household Income?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Household income may include, but is not limited to:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
              <li>Employment wages or salary</li>
              <li>Overtime, bonuses, or commissions</li>
              <li>Social Security or disability income</li>
              <li>Retirement or pension income</li>
              <li>Child support or alimony</li>
              <li>Self-employment income</li>
            </ul>
          </div>
          <div
            style={{
              minHeight: '260px',
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
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              minHeight: '260px',
              backgroundImage: "url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/themes/gracia/images/../../common/images/pagelayouts/layout6-img-02.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
              What You’ll Need to Apply
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1rem' }}>
              To complete the income qualification process, applicants should be prepared to provide:
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
              <li>Government-issued photo ID for all adult applicants</li>
              <li>Recent pay stubs or proof of income</li>
              <li>Additional documentation if applicable (self-employment, benefits, etc.)</li>
            </ul>
            <div>
              <button
                type="button"
                onClick={handleContactSupport}
                style={{
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d6460')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f766e')}
              >
                <span>Apply Now</span>
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
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem',
          marginBottom: '3.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          Next Steps
        </h2>
        <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '1.5rem' }}>
          If you believe your household may qualify, our leasing team is here to help.
        </p>
        <button
          type="button"
          onClick={handleContactSupport}
          style={{
            backgroundColor: '#4a4e57',
            color: '#ffffff',
            padding: '0.85rem 2rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2c3038')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a4e57')}
        >
          CONTACT US
        </button>
      </div>

      {/* ── Frequently Asked Questions (FAQ) ── */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', textAlign: 'center', marginBottom: '1.5rem' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = Boolean(openFaq[idx]);
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#1e293b',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: '#0f766e' }} /> : <ChevronDown size={18} style={{ color: '#64748b' }} />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.25rem 1.25rem',
                      color: '#475569',
                      fontSize: '0.925rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '0.75rem',
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
