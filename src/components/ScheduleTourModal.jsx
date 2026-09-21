import React, { useState } from 'react';
import { X, ChevronDown, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';
import { addSupportInquiry } from '../services/siteDataService';

const TIME_SLOTS = [
  '9:00 am',
  '9:30 am',
  '10:00 am',
  '10:30 am',
  '11:00 am',
  '11:30 am',
  '1:00 pm',
  '1:30 pm',
  '2:00 pm',
  '2:30 pm',
  '3:00 pm',
  '3:30 pm',
  '4:00 pm',
  '4:30 pm',
  '5:00 pm',
];

const AVAILABLE_UNITS = [
  { unit: '1701', bed: '1' },
  { unit: '1702', bed: '1' },
  { unit: '1005', bed: '2' },
  { unit: '1006', bed: '2' },
  { unit: '2104', bed: '3' },
  { unit: '2105', bed: '3' },
  { unit: '3301', bed: '4' },
  { unit: '3302', bed: '4' },
];

export default function ScheduleTourModal({
  isOpen,
  onClose,
  siteSettings,
  onTourScheduled,
  initialBedrooms = '',
  initialUnit = '',
}) {
  const todayFormatted = new Date().toISOString().split('T')[0];

  const [tourDate, setTourDate] = useState(todayFormatted);
  const [tourTime, setTourTime] = useState('1:30 pm');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [message, setMessage] = useState('');
  const [bedrooms, setBedrooms] = useState(initialBedrooms || '');
  const [selectedUnit, setSelectedUnit] = useState(initialUnit || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter your first and last name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a phone number.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      addSupportInquiry({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        topic: 'Tour Request',
        subject: `Tour Request: ${tourDate} at ${tourTime} (${bedrooms || 'Any Bedrooms'})`,
        message: `Scheduled Tour:\n- Date: ${tourDate}\n- Time: ${tourTime}\n- Move-In Date: ${moveDate || 'Flexible'}\n- Bedrooms Preferred: ${bedrooms || 'Not specified'}\n- Unit Preferred: ${selectedUnit || 'Any available'}\n\nClient Notes:\n${message || 'None'}`,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        if (onTourScheduled) onTourScheduled();
      }, 500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage('Failed to schedule tour. Please try again.');
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMoveDate('');
    setMessage('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 49, 43, 0.85)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={handleResetAndClose}
    >
      <div
        className="animate-slide-down"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Teal Header Banner ── */}
        <div
          style={{
            backgroundColor: '#68c7b7',
            padding: '1.5rem 1.5rem 1.25rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Close X Button */}
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'opacity 0.2s',
            }}
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          {/* White Circular Logo Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              margin: '0 auto 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '8px',
            }}
          >
            <img
              src="https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_325,h_60/s3/2/58193/pn_monarchpass_logo_pms%20web.png"
              alt="Monarch Pass"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="font-size: 0.65rem; font-weight: 900; color: #0f766e; text-align: center; line-height: 1;">MONARCH<br/>PASS</span>';
              }}
            />
          </div>

          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.3rem',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            Schedule with Monarch Pass
          </h2>
        </div>

        {/* ── Modal Body Content ── */}
        <div style={{ padding: '1.5rem 1.75rem 2rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <CheckCircle2
                size={56}
                style={{ color: '#0f766e', margin: '0 auto 1rem', display: 'block' }}
              />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                Tour Successfully Booked!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Thank you, <strong>{firstName}</strong>! Your guided tour is confirmed for:
              </p>

              <div
                style={{
                  backgroundColor: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'inline-block',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                }}
              >
                <div>📅 <strong>Date:</strong> {tourDate}</div>
                <div style={{ marginTop: '0.35rem' }}>⏰ <strong>Time:</strong> {tourTime}</div>
                {bedrooms && <div style={{ marginTop: '0.35rem' }}>🛏️ <strong>Layout:</strong> {bedrooms}</div>}
                {selectedUnit && <div style={{ marginTop: '0.35rem' }}>🚪 <strong>Unit:</strong> {selectedUnit}</div>}
              </div>

              <p style={{ color: '#64748b', fontSize: '0.825rem', marginBottom: '1.5rem' }}>
                Our leasing agent will reach out at <strong>{phone}</strong> or <strong>{email}</strong> if any adjustments are needed.
              </p>

              <button
                type="button"
                onClick={handleResetAndClose}
                style={{
                  backgroundColor: '#68c7b7',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#52b5a5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#68c7b7')}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* 1. CHOOSE AN AVAILABLE TIME TO TOUR */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.45rem',
                  }}
                >
                  CHOOSE AN AVAILABLE TIME TO TOUR
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      color: '#1e293b',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <select
                      value={tourTime}
                      onChange={(e) => setTourTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 2rem 0.65rem 0.85rem',
                        fontSize: '0.92rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748b',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. YOUR INFO */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.45rem',
                  }}
                >
                  YOUR INFO
                </label>

                {/* First name & Last name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="First name *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      color: '#1e293b',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last name *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      color: '#1e293b',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      color: '#1e293b',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Phone & Move Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      color: '#1e293b',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Move Date"
                    value={moveDate}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    onChange={(e) => setMoveDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      color: '#1e293b',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* 3. MESSAGE */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.45rem',
                  }}
                >
                  MESSAGE:
                </label>
                <textarea
                  placeholder="Add your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.92rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#1e293b',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* 4. BEDROOMS & UNIT */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {/* BEDROOMS */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#1e293b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '0.45rem',
                      }}
                    >
                      BEDROOMS
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 2rem 0.65rem 0.85rem',
                          fontSize: '0.92rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          color: '#1e293b',
                          backgroundColor: '#ffffff',
                          appearance: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select Bedrooms</option>
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedrooms">2 Bedrooms</option>
                        <option value="3 Bedrooms">3 Bedrooms</option>
                        <option value="4 Bedrooms">4 Bedrooms</option>
                      </select>
                      <ChevronDown
                        size={18}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* UNIT */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#1e293b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '0.45rem',
                      }}
                    >
                      UNIT
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 2rem 0.65rem 0.85rem',
                          fontSize: '0.92rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          color: '#1e293b',
                          backgroundColor: '#ffffff',
                          appearance: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Select Unit (optional)</option>
                        {AVAILABLE_UNITS.map((u) => (
                          <option key={u.unit} value={u.unit}>
                            Unit {u.unit} ({u.bed} Bed)
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Legal Disclaimer Notice */}
              <p
                style={{
                  fontSize: '0.68rem',
                  color: '#64748b',
                  lineHeight: 1.45,
                  margin: '1rem 0 1.25rem',
                }}
              >
                By registering, you agree to <strong>Terms of Use</strong> and <strong>Privacy Policy</strong> and consent to be contacted at this phone number by text message, and/or by autodialer for any purpose, including marketing, by the property and anyone acting on their behalf. Consent not required to purchase or rent. Message frequency will vary. Text STOP to opt-out. Messages and data rates may apply.
              </p>

              {/* 6. Book Tour Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  backgroundColor: '#a3ded5',
                  color: '#ffffff',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  boxShadow: '0 2px 8px rgba(104, 199, 183, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#68c7b7';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#a3ded5';
                }}
              >
                {isSubmitting ? 'Booking tour...' : 'Book tour!'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
