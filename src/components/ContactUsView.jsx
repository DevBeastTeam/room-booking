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
  Building 
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
      await fetch('/api/contact.php', {
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
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* ── 1. HERO HEADER ── */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 1rem',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/36-web-or-mls-4500%20campus%20dr%201005-s2104-002.jpg')`,
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
            We Are Here to Help
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
            Contact Monarch Pass
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
            Reach out to our on-site leasing office for current availability, rent rates, income qualification, or to schedule a private tour.
          </p>
        </div>
      </section>

      {/* ── 2. CONTACT CONTENT (TWO COLUMNS) ── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 380px) 1fr',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Office Details */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'serif', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
                Leasing Office Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {/* Address */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#ccfbf1',
                      color: '#0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Address</div>
                    <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      4500 Campus Drive<br />
                      Fort Worth, TX 76119
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#ccfbf1',
                      color: '#0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Phone Numbers</div>
                    <a
                      href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+18178578782'}`}
                      style={{ color: '#0f766e', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', display: 'block' }}
                    >
                      {siteSettings?.phone || '+1 817-857-8782'}
                    </a>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                      Main Office: <a href={`tel:${siteSettings?.secondaryPhone?.replace(/[^0-9+]/g, '') || '+18175311750'}`} style={{ color: '#0f766e', fontWeight: 600 }}>{siteSettings?.secondaryPhone || '+1 817-531-1750'}</a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#ccfbf1',
                      color: '#0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Email</div>
                    <a
                      href={`mailto:${siteSettings?.email || 'leasing@monarchpassapts.com'}`}
                      style={{ color: '#0f766e', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                      {siteSettings?.email || 'leasing@monarchpassapts.com'}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: '#ccfbf1',
                      color: '#0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Office Hours</div>
                    <div style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      <strong>Monday – Friday:</strong> {siteSettings?.officeHours?.monFri || '10:00 AM – 6:00 PM'}<br />
                      <strong>Saturday:</strong> {siteSettings?.officeHours?.sat || '10:00 AM – 5:00 PM'}<br />
                      <strong>Sunday:</strong> {siteSettings?.officeHours?.sun || '1:00 PM – 5:00 PM'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cushman & Wakefield badge */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Building size={16} style={{ color: '#0f766e' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    Professionally Managed
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Monarch Pass Apartments is proudly managed by Cushman & Wakefield, ensuring top-tier maintenance and resident services.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Inquiry Form */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2.5rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
              }}
            >
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#ccfbf1',
                      color: '#0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Message Sent Successfully!
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                    Thank you for reaching out to Monarch Pass. A member of our leasing staff will contact you shortly via email or phone.
                  </p>
                  <button
                    onClick={handleReset}
                    style={{
                      backgroundColor: '#0f766e',
                      color: '#ffffff',
                      padding: '0.65rem 1.5rem',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                    Send Us a Message
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1.75rem' }}>
                    Fill out the form below and we will get back to you within 24 business hours.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
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
                          padding: '0.7rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
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
                          padding: '0.7rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(817) 000-0000"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                        Desired Move-In Date
                      </label>
                      <input
                        type="date"
                        value={formData.moveInDate}
                        onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                        Interested Bedroom Layout
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          backgroundColor: '#ffffff',
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
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Message or Questions
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ask about current availability, pet policies, income qualifications, or move-in specials..."
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
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
                    <label htmlFor="contact-consent" style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                      I agree to receive calls and text messages from Monarch Pass regarding my inquiry at the contact number provided. Message & data rates may apply.
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSchedule()}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f766e',
                        border: '1px solid #0f766e',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Calendar size={16} />
                      <span>Schedule a Tour</span>
                    </button>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#0f766e',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.75rem 1.85rem',
                        borderRadius: '6px',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d6460')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f766e')}
                    >
                      <Send size={16} />
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
