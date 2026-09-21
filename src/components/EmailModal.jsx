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
    if (!firstName.trim()) newErrors.firstName = 'Please provide a valid First Name.';
    if (!lastName.trim()) newErrors.lastName = 'Please provide a valid Last Name.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Please provide a valid Email Address.';
    if (!phone.trim()) newErrors.phone = 'Please provide a valid Phone Number.';

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
        backgroundColor: 'rgba(5, 7, 14, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--modal-bg, var(--bg-surface))',
          color: 'var(--text-main)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '820px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          border: '1px solid var(--card-border)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--card-border)',
            background: 'var(--modal-header-bg, linear-gradient(135deg, rgba(201, 169, 110, 0.2) 0%, rgba(12, 16, 28, 0.95) 100%))',
          }}
        >
          <h2 style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
            Email Cost Breakdown
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              color: '#c9a96e',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', minHeight: '440px' }}>
          {/* Left Column: Summary Card */}
          <div
            style={{
              backgroundColor: 'rgba(16, 20, 34, 0.95)',
              borderRight: '1px solid rgba(201, 169, 110, 0.2)',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dfc285, #c9a96e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#08090f',
                    fontWeight: 800,
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                  }}
                >
                  M
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: '#dfc285', textTransform: 'uppercase' }}>
                  Monarch Pass
                </span>
              </div>

              <h4 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.35rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                {floorPlan.name} · Unit #{unitNumber}
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                {floorPlan.beds} Bed / {floorPlan.baths} Bath · {floorPlan.sqft} sq.ft.
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(8, 10, 18, 0.75)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total Monthly Estimated
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dfc285', marginTop: '2px' }}>
                  ${totalMonthlyPrice.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                  Base rent ${baseRent.toFixed(2)} · {leaseTerm}-month lease
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#dfc285', fontSize: '0.85rem', fontWeight: 600 }}>
              <FileText size={18} />
              <span>Includes complete itemized PDF schedule</span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {isSubmitted ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(201, 169, 110, 0.15)',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    color: '#dfc285',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  Estimate Transmitted!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  A customized PDF breakdown of your estimated costs for{' '}
                  <strong style={{ color: '#f8fafc' }}>Unit #{unitNumber}</strong> has been emailed to <strong style={{ color: '#dfc285' }}>{email}</strong>.
                </p>
                <button onClick={handleReset} className="btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1.25rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  Receive your itemized PDF lease estimate
                </p>

                {/* First & Last Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: errors.firstName ? '1px solid #ef4444' : '1px solid rgba(201, 169, 110, 0.3)',
                        backgroundColor: 'rgba(8, 10, 18, 0.75)',
                        color: '#f4efe6',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    {errors.firstName && (
                      <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>{errors.firstName}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: errors.lastName ? '1px solid #ef4444' : '1px solid rgba(201, 169, 110, 0.3)',
                        backgroundColor: 'rgba(8, 10, 18, 0.75)',
                        color: '#f4efe6',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    {errors.lastName && (
                      <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>{errors.lastName}</span>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: errors.email ? '1px solid #ef4444' : '1px solid rgba(201, 169, 110, 0.3)',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {errors.email && (
                    <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>{errors.email}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(817) 000-0000"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(201, 169, 110, 0.3)',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      color: '#f4efe6',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {errors.phone && (
                    <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>{errors.phone}</span>
                  )}
                </div>

                {/* SMS Checkbox */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={smsOptIn}
                      onChange={(e) => setSmsOptIn(e.target.checked)}
                      style={{ accentColor: '#c9a96e', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                      Yes, text me availability updates and price locks
                    </span>
                  </label>

                  <div style={{ textAlign: 'right', marginTop: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setShowMoreSms(!showMoreSms)}
                      style={{ fontSize: '0.75rem', color: '#dfc285', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showMoreSms ? 'Show Less' : 'Show More'}
                    </button>
                  </div>

                  {showMoreSms && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem', lineHeight: 1.4 }}>
                      By checking this box, you agree to receive SMS communications from Monarch Pass leasing. Msg & data rates may apply.
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
                >
                  Email Itemized Breakdown
                </button>

                <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', marginTop: '0.75rem' }}>
                  Your personal information is kept strictly confidential.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
