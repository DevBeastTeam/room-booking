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

  const handleSubmit = async (e) => {
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
      // Send to MySQL backend API
      try {
        await fetch('/backend/api/tour.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            tour_date: tourDate,
            tour_time: tourTime,
            move_date: moveDate,
            bedrooms,
            unit_number: selectedUnit,
            notes: message,
          }),
        });
      } catch (err) {
        console.warn('Backend tour API offline or unreachable, proceeding with local fallback', err);
      }

      // Persist in local storage via siteDataService
      addSupportInquiry({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        topic: 'Tour Scheduling',
        message: `Guided Tour on ${tourDate} at ${tourTime}. Unit/Floorplan: ${bedrooms || 'Any'} ${selectedUnit ? `(Unit #${selectedUnit})` : ''}. Move-in: ${moveDate || 'N/A'}. Message: ${message}`,
        status: 'Unread',
      });

      setIsSubmitted(true);
      if (onTourScheduled) {
        onTourScheduled({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          tourDate,
          tourTime,
          bedrooms,
          selectedUnit,
        });
      }
    } catch (err) {
      setErrorMessage('Unable to process your reservation at this moment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setErrorMessage('');
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
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={handleResetAndClose}
    >
      <div
        className="animate-slide-down"
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--modal-bg, var(--bg-surface))',
          color: 'var(--text-main)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Luxury Header Banner ── */}
        <div
          style={{
            background: 'var(--modal-header-bg, linear-gradient(135deg, rgba(201, 169, 110, 0.25) 0%, rgba(12, 16, 28, 0.95) 100%))',
            borderBottom: '1px solid var(--card-border)',
            padding: '1.75rem 1.75rem 1.25rem',
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
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              color: '#c9a96e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Gold Monogram Crest */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 50%, #9e7a3d 100%)',
              margin: '0 auto 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(201, 169, 110, 0.35)',
              color: '#08090f',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '1.8rem',
              fontWeight: 700,
            }}
          >
            M
          </div>

          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c9a96e', fontWeight: 700 }}>
            {siteSettings?.siteName || 'Monarch Pass Residences'}
          </span>
          <h2
            style={{
              color: '#f8fafc',
              fontSize: '1.45rem',
              fontWeight: 600,
              margin: '0.25rem 0 0',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
            }}
          >
            Schedule a Private Viewing
          </h2>
        </div>

        {/* ── Modal Body Content ── */}
        <div style={{ padding: '1.75rem 2rem 2.25rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <CheckCircle2
                size={56}
                style={{ color: '#dfc285', margin: '0 auto 1rem', display: 'block' }}
              />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Private Tour Confirmed
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Thank you, <strong>{firstName}</strong>! Your VIP private viewing has been scheduled for:
              </p>

              <div
                style={{
                  backgroundColor: 'rgba(16, 20, 34, 0.95)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'inline-block',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  fontSize: '0.92rem',
                  color: '#f4efe6',
                  width: '100%',
                }}
              >
                <div>📅 <strong>Date:</strong> {tourDate}</div>
                <div style={{ marginTop: '0.45rem' }}>⏰ <strong>Time:</strong> {tourTime}</div>
                {bedrooms && <div style={{ marginTop: '0.45rem' }}>🛏️ <strong>Residence:</strong> {bedrooms}</div>}
                {selectedUnit && <div style={{ marginTop: '0.45rem' }}>🚪 <strong>Unit:</strong> #{selectedUnit}</div>}
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.825rem', marginBottom: '1.5rem' }}>
                Our leasing concierge will reach out to you directly at <strong>{phone}</strong> or <strong>{email}</strong> with directions.
              </p>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-gold"
                style={{
                  padding: '0.8rem 2.5rem',
                  fontSize: '0.95rem',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
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
                    fontWeight: 700,
                    color: '#c9a96e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Choose an Available Date & Time
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f4efe6',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      outline: 'none',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <select
                      value={tourTime}
                      onChange={(e) => setTourTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2rem 0.75rem 0.85rem',
                        fontSize: '0.92rem',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        borderRadius: '8px',
                        color: '#f4efe6',
                        backgroundColor: 'rgba(8, 10, 18, 0.75)',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t} style={{ backgroundColor: '#0c101c' }}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#c9a96e',
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
                    fontWeight: 700,
                    color: '#c9a96e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Your Information
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
                      padding: '0.75rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f4efe6',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
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
                      padding: '0.75rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f4efe6',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f4efe6',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Phone & Move Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="tel"
                    placeholder="Phone number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f4efe6',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Target Move Date"
                    value={moveDate}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    onChange={(e) => setMoveDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f4efe6',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
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
                    fontWeight: 700,
                    color: '#c9a96e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Special Requests or Questions
                </label>
                <textarea
                  placeholder="Share any preferred layouts, move-in flexibility, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    fontSize: '0.92rem',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    borderRadius: '8px',
                    color: '#f4efe6',
                    backgroundColor: 'rgba(8, 10, 18, 0.75)',
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
                        fontWeight: 700,
                        color: '#c9a96e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Bedrooms
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 2rem 0.75rem 0.85rem',
                          fontSize: '0.92rem',
                          border: '1px solid rgba(201, 169, 110, 0.3)',
                          borderRadius: '8px',
                          color: '#f4efe6',
                          backgroundColor: 'rgba(8, 10, 18, 0.75)',
                          appearance: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#0c101c' }}>Select Bedrooms</option>
                        <option value="1 Bedroom" style={{ backgroundColor: '#0c101c' }}>1 Bedroom</option>
                        <option value="2 Bedrooms" style={{ backgroundColor: '#0c101c' }}>2 Bedrooms</option>
                        <option value="3 Bedrooms" style={{ backgroundColor: '#0c101c' }}>3 Bedrooms</option>
                        <option value="4 Bedrooms" style={{ backgroundColor: '#0c101c' }}>4 Bedrooms</option>
                      </select>
                      <ChevronDown
                        size={18}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#c9a96e',
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
                        fontWeight: 700,
                        color: '#c9a96e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Unit (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 2rem 0.75rem 0.85rem',
                          fontSize: '0.92rem',
                          border: '1px solid rgba(201, 169, 110, 0.3)',
                          borderRadius: '8px',
                          color: '#f4efe6',
                          backgroundColor: 'rgba(8, 10, 18, 0.75)',
                          appearance: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#0c101c' }}>Select Unit (optional)</option>
                        {AVAILABLE_UNITS.map((u) => (
                          <option key={u.unit} value={u.unit} style={{ backgroundColor: '#0c101c' }}>
                            Unit {u.unit} ({u.bed} Bed)
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={18}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#c9a96e',
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
                  fontSize: '0.72rem',
                  color: '#64748b',
                  lineHeight: 1.5,
                  margin: '1rem 0 1.5rem',
                }}
              >
                By reserving a tour, you agree to our Terms and consent to be contacted by our leasing office regarding availability and housing guidelines. Message frequency varies.
              </p>

              {/* 6. Book Tour Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  fontSize: '1rem',
                  letterSpacing: '0.08em',
                }}
              >
                {isSubmitting ? 'Confirming Tour...' : 'CONFIRM PRIVATE VIEWING'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
