import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Building,
  Sparkles
} from 'lucide-react';
import { saveSupportInquiry } from '../services/siteDataService';

export default function ContactUsView({
  onOpenScheduleTour,
  siteSettings,
}) {
  const handleSchedule = onOpenScheduleTour || (() => { window.dispatchEvent(new CustomEvent('open-schedule-tour')); });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    moveInDate: '',
    bedrooms: '2 Beds',
    message: '',
    consent: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    try {
      await fetch('/backend/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: `Contact Page Inquiry - ${formData.bedrooms} (Move-in: ${formData.moveInDate || 'Flexible'})`,
          message: formData.message || 'General leasing inquiry submitted via Contact Us page.',
        }),
      });
    } catch (err) {
      console.log('PHP API fallback', err);
    }

    saveSupportInquiry({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      subject: `Contact Page Inquiry - ${formData.bedrooms} (Move-in: ${formData.moveInDate || 'Flexible'})`,
      message: formData.message || 'General leasing inquiry submitted via Contact Us page.',
      category: 'Leasing Inquiry',
    });

    setFormSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      moveInDate: '',
      bedrooms: '2 Beds',
      message: '',
      consent: true,
    });
    setFormSubmitted(false);
  };

  return (
    <div style={{ backgroundColor: '#08090f', color: '#e8e0d4', minHeight: '100vh' }}>
      {/* ── 1. HERO HEADER ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1rem',
          backgroundImage: `linear-gradient(rgba(8, 9, 15, 0.8), rgba(8, 9, 15, 0.9)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/36-web-or-mls-4500%20campus%20dr%201005-s2104-002.jpg')`,
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
            <span>Dedicated Leasing Assistance</span>
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
            Contact Monarch Pass
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#b5a999', lineHeight: 1.7, margin: '0 auto 1.5rem', maxWidth: '680px' }}>
            Reach out to our on-site leasing specialists for unit availability, income qualification guidelines, or to reserve a private tour.
          </p>
        </div>
      </section>

      {/* ── 2. CONTACT CONTENT (TWO COLUMNS) ── */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Office Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c9a96e', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span style={{ width: '20px', height: '1px', backgroundColor: '#c9a96e', display: 'inline-block' }} />
                <span>On-Site Management</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 500, color: '#f4efe6', marginBottom: '1.5rem' }}>
                Leasing Office Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {/* Address */}
                <div
                  style={{
                    backgroundColor: 'rgba(14, 18, 30, 0.75)',
                    border: '1px solid rgba(201, 169, 110, 0.15)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(201, 169, 110, 0.12)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      color: '#c9a96e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f4efe6', fontSize: '0.95rem', marginBottom: '0.2rem' }}>Physical Address</div>
                    <div style={{ color: '#a89d8e', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      4500 Campus Drive<br />
                      Fort Worth, TX 76119
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div
                  style={{
                    backgroundColor: 'rgba(14, 18, 30, 0.75)',
                    border: '1px solid rgba(201, 169, 110, 0.15)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(201, 169, 110, 0.12)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      color: '#c9a96e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f4efe6', fontSize: '0.95rem', marginBottom: '0.2rem' }}>Direct Leasing Phone</div>
                    <a
                      href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+18178578782'}`}
                      style={{ color: '#c9a96e', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', display: 'block' }}
                    >
                      {siteSettings?.phone || '(817) 857-8782'}
                    </a>
                    <div style={{ fontSize: '0.82rem', color: '#7a7063', marginTop: '4px' }}>
                      Main Office: <a href={`tel:${siteSettings?.secondaryPhone?.replace(/[^0-9+]/g, '') || '+18175311750'}`} style={{ color: '#dfc285', textDecoration: 'none' }}>{siteSettings?.secondaryPhone || '(817) 531-1750'}</a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div
                  style={{
                    backgroundColor: 'rgba(14, 18, 30, 0.75)',
                    border: '1px solid rgba(201, 169, 110, 0.15)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(201, 169, 110, 0.12)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      color: '#c9a96e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f4efe6', fontSize: '0.95rem', marginBottom: '0.2rem' }}>Email Inquiries</div>
                    <a
                      href={`mailto:${siteSettings?.email || 'leasing@monarchpassapts.com'}`}
                      style={{ color: '#dfc285', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                      {siteSettings?.email || 'leasing@monarchpassapts.com'}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div
                  style={{
                    backgroundColor: 'rgba(14, 18, 30, 0.75)',
                    border: '1px solid rgba(201, 169, 110, 0.15)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(201, 169, 110, 0.12)',
                      border: '1px solid rgba(201, 169, 110, 0.25)',
                      color: '#c9a96e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f4efe6', fontSize: '0.95rem', marginBottom: '0.4rem' }}>Office Hours</div>
                    <div style={{ color: '#a89d8e', fontSize: '0.86rem', lineHeight: 1.6 }}>
                      <div><strong style={{ color: '#f4efe6' }}>Mon – Fri:</strong> {siteSettings?.officeHours?.monFri || '10:00 AM – 6:00 PM'}</div>
                      <div><strong style={{ color: '#f4efe6' }}>Saturday:</strong> {siteSettings?.officeHours?.sat || '10:00 AM – 5:00 PM'}</div>
                      <div><strong style={{ color: '#f4efe6' }}>Sunday:</strong> {siteSettings?.officeHours?.sun || '1:00 PM – 5:00 PM'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cushman & Wakefield badge */}
              <div
                style={{
                  backgroundColor: 'rgba(12, 16, 28, 0.75)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Building size={16} style={{ color: '#c9a96e' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Professionally Managed
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#9e9282', margin: 0, lineHeight: 1.6 }}>
                  Monarch Pass Apartments is proudly managed by Cushman & Wakefield, ensuring attentive customer care and prompt maintenance response.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Inquiry Form */}
            <div
              style={{
                backgroundColor: 'rgba(14, 18, 30, 0.85)',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                borderRadius: '14px',
                padding: '2.5rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              }}
            >
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(201, 169, 110, 0.15)',
                      border: '1px solid rgba(201, 169, 110, 0.35)',
                      color: '#c9a96e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.85rem', fontWeight: 600, color: '#f4efe6', marginBottom: '0.5rem' }}>
                    Message Sent Successfully
                  </h3>
                  <p style={{ color: '#a89d8e', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                    Thank you for contacting Monarch Pass. Our leasing team will respond via email or telephone within one business day.
                  </p>
                  <button
                    onClick={handleReset}
                    style={{
                      padding: '0.75rem 1.75rem',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                      color: '#08090f',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.75rem', fontWeight: 600, color: '#f4efe6', margin: '0 0 0.5rem' }}>
                    Send Us a Message
                  </h3>
                  <p style={{ color: '#8c8273', fontSize: '0.88rem', margin: '0 0 2rem' }}>
                    Complete the form below and an on-site representative will follow up promptly.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
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

                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
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
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
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

                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(817) 000-0000"
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
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                        Desired Move-In Date
                      </label>
                      <input
                        type="date"
                        value={formData.moveInDate}
                        onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
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

                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                        Preferred Residence Layout
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        style={{
                          width: '100%',
                          backgroundColor: '#0a0d16',
                          border: '1px solid rgba(201, 169, 110, 0.25)',
                          borderRadius: '6px',
                          padding: '0.75rem 0.9rem',
                          color: '#f4efe6',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      >
                        <option value="1 Bed">1 Bedroom (703 Sq Ft)</option>
                        <option value="2 Beds">2 Bedrooms (991 Sq Ft)</option>
                        <option value="3 Beds">3 Bedrooms (1,159 Sq Ft)</option>
                        <option value="4 Beds">4 Bedrooms (1,328 Sq Ft)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.45rem' }}>
                      Questions or Special Inquiries
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ask about current availability, pet deposit, income qualification, or tour dates..."
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 169, 110, 0.25)',
                        borderRadius: '6px',
                        padding: '0.75rem 0.9rem',
                        color: '#f4efe6',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.75rem' }}>
                    <input
                      type="checkbox"
                      id="contact-consent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      style={{ marginTop: '3px' }}
                    />
                    <label htmlFor="contact-consent" style={{ fontSize: '0.8rem', color: '#8c8273', lineHeight: 1.5 }}>
                      I agree to receive calls and text messages from Monarch Pass regarding my inquiry at the contact number provided. Message and data rates may apply.
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSchedule()}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#dfc285',
                        border: '1px solid rgba(201, 169, 110, 0.4)',
                        padding: '0.75rem 1.4rem',
                        borderRadius: '4px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <Calendar size={15} />
                      <span>Schedule a Tour Instead</span>
                    </button>

                    <button
                      type="submit"
                      style={{
                        padding: '0.8rem 2rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                        color: '#08090f',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
                      }}
                    >
                      <Send size={15} />
                      <span>Submit Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
