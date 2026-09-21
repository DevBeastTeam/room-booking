import React, { useState } from 'react';
import { X, Send, Mail, Phone, User, MessageSquare, CheckCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { addSupportInquiry } from '../services/siteDataService';

export default function ContactSupportModal({ isOpen, onClose, siteSettings, onInquirySubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  if (!isOpen) return null;

  const categories = [
    'General Inquiry',
    'Tour Request',
    'Pricing & Availability',
    'Application Help',
    'Maintenance Support',
    'Resident Services',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = addSupportInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'N/A',
        category: formData.category,
        subject: formData.subject.trim() || `${formData.category} from ${formData.name.trim()}`,
        message: formData.message.trim(),
      });

      if (created) {
        setSubmittedId(created.id);
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onInquirySubmitted) onInquirySubmitted();
    }, 400);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: 'General Inquiry',
      subject: '',
      message: '',
    });
    setIsSubmitted(false);
    setSubmittedId('');
  };

  return (
    <div
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--modal-bg, var(--bg-surface))',
          color: 'var(--text-main)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: '1px solid var(--card-border)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--modal-header-bg, linear-gradient(135deg, rgba(201, 169, 110, 0.25) 0%, rgba(12, 16, 28, 0.95) 100%))',
            borderBottom: '1px solid var(--card-border)',
            padding: '1.5rem 1.75rem',
            color: 'var(--text-main)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(201, 169, 110, 0.15)',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dfc285',
              }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Contact & Support Concierge
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#dfc285' }}>
                {siteSettings?.siteName || 'Monarch Pass Residences'} · Executive Leasing Office
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c9a96e',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
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
                <CheckCircle size={36} />
              </div>

              <h4 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f8fafc', margin: '0 0 0.5rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Inquiry Successfully Logged
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                Thank you for contacting us! Your inquiry (Reference: <strong style={{ color: '#dfc285' }}>{submittedId}</strong>) has been routed to our on-site management team.
              </p>

              <div
                style={{
                  backgroundColor: 'rgba(16, 20, 34, 0.95)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontSize: '0.88rem',
                  color: '#94a3b8',
                  marginBottom: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Clock size={16} style={{ color: '#dfc285' }} />
                  <span>Expected response: <strong style={{ color: '#f4efe6' }}>Within 2-4 business hours</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Phone size={16} style={{ color: '#dfc285' }} />
                  <span>Immediate assistance: <a href={`tel:${siteSettings?.phone || '+18178578782'}`} style={{ color: '#dfc285', fontWeight: 700 }}>{siteSettings?.phone || '(817) 857-8782'}</a></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={handleReset}
                  className="btn-outline-gold"
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Send Another Inquiry
                </button>
                <button
                  onClick={onClose}
                  className="btn-gold"
                  style={{
                    padding: '0.65rem 1.75rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Info banner */}
              <div
                style={{
                  backgroundColor: 'rgba(201, 169, 110, 0.1)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  borderRadius: '10px',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                  color: '#dfc285',
                }}
              >
                <Sparkles size={18} style={{ color: '#c9a96e', flexShrink: 0 }} />
                <span>
                  Questions about leasing rates, current Move-in Specials, or Affordable Housing qualifications? Send our team a message below!
                </span>
              </div>

              {/* Name & Email Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#c9a96e' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        backgroundColor: 'rgba(8, 10, 18, 0.75)',
                        color: '#f4efe6',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#c9a96e' }} />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        backgroundColor: 'rgba(8, 10, 18, 0.75)',
                        color: '#f4efe6',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#c9a96e' }} />
                    <input
                      type="tel"
                      placeholder="+1 (817) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(201, 169, 110, 0.3)',
                        backgroundColor: 'rgba(8, 10, 18, 0.75)',
                        color: '#f4efe6',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                    Topic / Department
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      fontSize: '0.9rem',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      color: '#f4efe6',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} style={{ backgroundColor: '#0c101c' }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inquiring about 2-Bedroom availability next month"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    fontSize: '0.9rem',
                    backgroundColor: 'rgba(8, 10, 18, 0.75)',
                    color: '#f4efe6',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  Message Details <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your timeline, household size, or specific questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    fontSize: '0.9rem',
                    backgroundColor: 'rgba(8, 10, 18, 0.75)',
                    color: '#f4efe6',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline-gold"
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Sending...' : 'Transmit Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
