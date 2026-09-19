import React, { useState } from 'react';
import { X, CheckCircle, Mail, FileText, Check } from 'lucide-react';

export default function EmailModal({
  isOpen,
  onClose,
  floorPlan,
  unitNumber,
  totalMonthlyPrice,
  baseRent,
  leaseTerm,
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [showMoreSms, setShowMoreSms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'Error: Please provide a valid First Name.';
    if (!lastName.trim()) newErrors.lastName = 'Error: Please provide a valid Last Name.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Error: Please provide a valid Email Address.';
    if (!phone.trim()) newErrors.phone = 'Error: Please provide a valid Phone Number.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setSmsOptIn(false);
    onClose();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '820px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Email My Costs
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              color: '#64748b',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', minHeight: '440px' }}>
          {/* Left Column: Summary Card */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRight: '1px solid #e2e8f0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  display: 'inline-block',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.25rem',
                }}
              >
                <img
                  src="https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_200,h_40/s3/2/58193/pn_monarchpass_logo_pms%20web.png"
                  alt="Monarch Pass Logo"
                  style={{ maxHeight: '28px', width: 'auto', display: 'block' }}
                />
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                {floorPlan.name} · Unit #{unitNumber}
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                {floorPlan.beds} Bed / {floorPlan.baths} Bath · {floorPlan.sqft} sq.ft.
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Total Monthly Leasing Price
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                  ${totalMonthlyPrice.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Base rent ${baseRent.toFixed(2)} · {leaseTerm}-month lease
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0d9488', fontSize: '0.85rem', fontWeight: 600 }}>
              <FileText size={18} />
              <span>Includes complete PDF breakdown</span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {isSubmitted ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#d1fae5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                  Estimate Sent Successfully!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  We've sent a customized PDF breakdown of your estimated costs for{' '}
                  <strong>Unit #{unitNumber}</strong> to <strong>{email}</strong>.
                </p>
                <button onClick={handleReset} className="btn-primary" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem' }}>
                  We'll send you a PDF with your costs for this unit.
                </p>

                {/* First & Last Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                      First Name*
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        border: errors.firstName ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                      }}
                    />
                    {errors.firstName && (
                      <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.firstName}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                      Last Name*
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        border: errors.lastName ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                      }}
                    />
                    {errors.lastName && (
                      <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.lastName}</span>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Email Address*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                  {errors.email && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.email}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: errors.phone ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                  {errors.phone && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.phone}</span>
                  )}
                </div>

                {/* SMS Checkbox */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={smsOptIn}
                      onChange={(e) => setSmsOptIn(e.target.checked)}
                      style={{ accentColor: '#68c7b7', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.825rem', color: '#334155' }}>
                      Yes, I'd be happy to receive text messages!
                    </span>
                  </label>

                  <div style={{ textAlign: 'right', marginTop: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setShowMoreSms(!showMoreSms)}
                      style={{ fontSize: '0.75rem', color: '#0d9488', textDecoration: 'underline' }}
                    >
                      {showMoreSms ? 'Show Less' : 'Show More'}
                    </button>
                  </div>

                  {showMoreSms && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem', lineHeight: 1.4 }}>
                      By checking this box, you agree to receive marketing text messages from Cushman & Wakefield. Msg & data rates may apply.
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem', backgroundColor: '#68c7b7', borderColor: '#68c7b7' }}
                >
                  Email My Costs
                </button>

                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.75rem' }}>
                  This site is protected by reCAPTCHA. Google Privacy Policy and Terms of Service apply.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
