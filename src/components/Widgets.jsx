import React, { useState } from 'react';
import {
  MessageSquare,
  Calendar,
  Mail,
  Smartphone,
  ChevronRight,
  ChevronDown,
  X,
  Send,
  User,
  Clock,
  Phone,
  CheckCircle,
  Video,
  Users,
  Eye,
  ZoomIn,
  Contrast
} from 'lucide-react';

export default function Widgets() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'chat', 'tour', 'email', 'call', 'accessibility'

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: "Welcome, I'm Edward! If you have any questions about Monarch Pass or would like to schedule a tour, I'm happy to help. To start may I please have your name?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Tour State
  const [tourType, setTourType] = useState('guided'); // 'guided', 'virtual'
  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [selectedTime, setSelectedTime] = useState('11:00am');
  const [tourForm, setTourForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bedrooms: '1 Bedroom',
  });
  const [tourSubmitted, setTourSubmitted] = useState(false);

  // Email Agent State
  const [emailForm, setEmailForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Text State
  const [textPhone, setTextPhone] = useState('');
  const [textSubmitted, setTextSubmitted] = useState(false);

  const timeSlots = [
    '10:30am', '11:00am', '11:30am', '12:00pm',
    '12:30pm', '1:00pm', '1:30pm', '2:00pm',
    '2:30pm', '3:00pm', '3:30pm', '4:00pm',
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: msg }]);
    setInputMessage('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Nice to meet you! Thanks for asking about Monarch Pass. Our 1 to 4 bedroom floor plans in Fort Worth are currently leasing with special move-in incentives. Would you like me to reserve a guided tour slot for you?`,
        },
      ]);
    }, 800);
  };

  const handleTourSubmit = (e) => {
    e.preventDefault();
    if (!tourForm.firstName || !tourForm.email || !tourForm.phone) {
      alert('Please fill out all required contact fields.');
      return;
    }
    setTourSubmitted(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailForm.firstName || !emailForm.email || !emailForm.message) {
      alert('Please enter your name, email, and message.');
      return;
    }
    setEmailSubmitted(true);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textPhone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    setTextSubmitted(true);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING ACCESSIBILITY BUTTON (Bottom Left) */}
      {/* ========================================================================= */}
      <button
        onClick={() => setActiveModal(activeModal === 'accessibility' ? null : 'accessibility')}
        className="accessibility-floating-btn"
        aria-label="Open Accessibility Options"
      >
        <Eye size={24} />
      </button>

      {activeModal === 'accessibility' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '85px',
            left: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '1.25rem',
            width: '280px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            zIndex: 1000,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Accessibility</h4>
            <button onClick={() => setActiveModal(null)} style={{ color: '#64748b' }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              onClick={() => {
                document.body.style.fontSize = document.body.style.fontSize === '1.15rem' ? '1rem' : '1.15rem';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                width: '100%',
              }}
            >
              <ZoomIn size={16} />
              <span>Toggle Larger Text</span>
            </button>
            <button
              onClick={() => {
                document.body.style.filter = document.body.style.filter === 'contrast(1.3)' ? 'none' : 'contrast(1.3)';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                width: '100%',
              }}
            >
              <Contrast size={16} />
              <span>High Contrast</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING KNOCK DOORWAY STACKED MENU WIDGET (Bottom Right) */}
      {/* ========================================================================= */}
      {!activeModal && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontFamily: 'inherit',
          }}
        >
          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            aria-label="Toggle widget menu"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px 4px 0 0',
              padding: '0.2rem 0.6rem',
              color: '#64748b',
              boxShadow: '0 -2px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '-1px',
              zIndex: 2,
            }}
          >
            <ChevronDown
              size={16}
              style={{
                transform: isMenuCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {!isMenuCollapsed ? (
            <div
              className="animate-slide-down"
              style={{
                width: '215px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.16)',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 1. Chat with us (Active Highlighted Teal Item) */}
              <button
                onClick={() => setActiveModal('chat')}
                style={{
                  backgroundColor: '#5ec4b6',
                  color: '#1e293b',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  textAlign: 'left',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4eb5a7')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5ec4b6')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <MessageSquare size={18} style={{ color: '#1e293b' }} />
                  <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                    <strong>Chat</strong> with us
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: '#1e293b' }} />
              </button>

              {/* 2. Book a tour */}
              <button
                onClick={() => setActiveModal('tour')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #f1f5f9',
                  textAlign: 'left',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Calendar size={18} style={{ color: '#475569' }} />
                  <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                    <strong>Book</strong> a tour
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
              </button>

              {/* 3. Email an agent */}
              <button
                onClick={() => setActiveModal('email')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #f1f5f9',
                  textAlign: 'left',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Mail size={18} style={{ color: '#475569' }} />
                  <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                    <strong>Email</strong> an agent
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
              </button>

              {/* 4. Call or text us */}
              <button
                onClick={() => setActiveModal('call')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Smartphone size={18} style={{ color: '#475569' }} />
                  <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                    <strong>Call</strong> or <strong>text</strong> us
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsMenuCollapsed(false)}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#5ec4b6',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              }}
            >
              <MessageSquare size={24} />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CHAT MODAL WINDOW ('Chat with us') */}
      {/* ========================================================================= */}
      {activeModal === 'chat' && (
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '360px',
            height: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
            zIndex: 1000,
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Light Mint Top Header */}
          <div
            style={{
              backgroundColor: '#a4d8d1',
              padding: '0.9rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>
              Monarch Pass
            </div>
            <button onClick={() => setActiveModal(null)} style={{ color: '#1e293b' }}>
              <X size={20} />
            </button>
          </div>

          {/* Privacy Consent Notice */}
          <div
            style={{
              padding: '0.6rem 1rem',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              fontSize: '0.725rem',
              color: '#64748b',
              lineHeight: 1.35,
            }}
          >
            By interacting with this system, you consent to this privacy policy, including being contacted by AI or a human & having your conversation recorded and used by a third party.
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: '#f1f5f9',
            }}
          >
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.sender === 'user' ? '#2c3038' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  maxWidth: '85%',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Footer (Black Box) */}
          <form
            onSubmit={handleSendMessage}
            style={{
              backgroundColor: '#1e293b',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                width: '30px',
                height: '30px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={15} />
            </button>
          </form>

          {/* Quick Shortcuts Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '0.5rem 1rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#5ec4b6',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setActiveModal('tour')}
                title="Book a tour"
                style={{ color: '#64748b', padding: '4px' }}
              >
                <Calendar size={18} />
              </button>
              <button
                onClick={() => setActiveModal('email')}
                title="Email an agent"
                style={{ color: '#64748b', padding: '4px' }}
              >
                <Mail size={18} />
              </button>
              <button
                onClick={() => setActiveModal('call')}
                title="Call or text"
                style={{ color: '#64748b', padding: '4px' }}
              >
                <Smartphone size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SCHEDULE A TOUR MODAL ('Book a tour') */}
      {/* ========================================================================= */}
      {activeModal === 'tour' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
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
              borderRadius: '16px',
              width: '100%',
              maxWidth: '920px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
              padding: '2rem',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Schedule a Tour
              </h2>
              <button onClick={() => setActiveModal(null)} style={{ color: '#64748b', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>

            {tourSubmitted ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#d1fae5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  Tour Scheduled Successfully!
                </h3>
                <p style={{ color: '#64748b', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                  We've reserved your {tourType === 'guided' ? 'Guided Tour' : 'Virtual Tour'} on{' '}
                  <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>. A confirmation email has been sent to <strong>{tourForm.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setTourSubmitted(false);
                    setActiveModal(null);
                  }}
                  className="btn-primary"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTourSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Col 1: Tour Type */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.85rem' }}>
                      1. Select Tour Type
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div
                        onClick={() => setTourType('guided')}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: tourType === 'guided' ? '2px solid #5ec4b6' : '1px solid #e2e8f0',
                          backgroundColor: tourType === 'guided' ? '#f0fdfa' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <Users size={22} style={{ color: tourType === 'guided' ? '#0d9488' : '#64748b' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Guided tour</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Walkthrough with an agent</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setTourType('virtual')}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: tourType === 'virtual' ? '2px solid #5ec4b6' : '1px solid #e2e8f0',
                          backgroundColor: tourType === 'virtual' ? '#f0fdfa' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <Video size={22} style={{ color: tourType === 'virtual' ? '#0d9488' : '#64748b' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Virtual tour</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Over live video call</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Date & Time */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.85rem' }}>
                      2. Pick Date & Time
                    </h4>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        marginBottom: '0.85rem',
                      }}
                    />

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                      Available Times (CST)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '6px',
                            border: selectedTime === time ? '1.5px solid #5ec4b6' : '1px solid #e2e8f0',
                            backgroundColor: selectedTime === time ? '#5ec4b6' : '#f8fafc',
                            color: selectedTime === time ? '#ffffff' : '#334155',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: Your Information */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.85rem' }}>
                      3. Your Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <input
                        type="text"
                        placeholder="First Name*"
                        required
                        value={tourForm.firstName}
                        onChange={(e) => setTourForm({ ...tourForm, firstName: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Last Name*"
                        required
                        value={tourForm.lastName}
                        onChange={(e) => setTourForm({ ...tourForm, lastName: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <input
                        type="email"
                        placeholder="Email Address*"
                        required
                        value={tourForm.email}
                        onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number*"
                        required
                        value={tourForm.phone}
                        onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <select
                        value={tourForm.bedrooms}
                        onChange={(e) => setTourForm({ ...tourForm, bedrooms: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
                      >
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedrooms">2 Bedrooms</option>
                        <option value="3 Bedrooms">3 Bedrooms</option>
                        <option value="4 Bedrooms">4 Bedrooms</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                  <button type="button" onClick={() => setActiveModal(null)} style={{ color: '#64748b', fontWeight: 600 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ backgroundColor: '#5ec4b6', borderColor: '#5ec4b6', color: '#1e293b' }}>
                    Schedule tour
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EMAIL OUR LEASING TEAM MODAL ('Email an agent') */}
      {/* ========================================================================= */}
      {activeModal === 'email' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
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
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Email Our Leasing Team
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {emailSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={44} style={{ color: '#059669', margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Message Sent!</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem' }}>
                  Thank you, {emailForm.firstName}. A leasing consultant will respond to your email shortly.
                </p>
                <button onClick={() => { setEmailSubmitted(false); setActiveModal(null); }} className="btn-primary" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="First name*"
                    required
                    value={emailForm.firstName}
                    onChange={(e) => setEmailForm({ ...emailForm, firstName: e.target.value })}
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Last name*"
                    required
                    value={emailForm.lastName}
                    onChange={(e) => setEmailForm({ ...emailForm, lastName: e.target.value })}
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email*"
                  required
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={emailForm.phone}
                  onChange={(e) => setEmailForm({ ...emailForm, phone: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <textarea
                  placeholder="Your message*"
                  required
                  rows={4}
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    padding: '0.85rem',
                    borderRadius: '30px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    marginTop: '0.5rem',
                  }}
                >
                  SEND
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CALL OR TEXT OUR LEASING TEAM ('Call or text us') */}
      {/* ========================================================================= */}
      {activeModal === 'call' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
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
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Contact Our Leasing Team
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Direct Call Button */}
            <div style={{ marginBottom: '1.5rem' }}>
              <a
                href="tel:+18559844406"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                }}
              >
                <Phone size={20} style={{ color: '#5ec4b6' }} />
                <span>+1 (855) 984-4406</span>
              </a>
            </div>

            {/* Office Hours */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} style={{ color: '#5ec4b6' }} />
                <span>Office Hours</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginBottom: '2px' }}>
                <span>Mon – Fri:</span>
                <span>10:00am – 6:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginBottom: '2px' }}>
                <span>Saturday:</span>
                <span>10:00am – 5:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Sunday:</span>
                <span>1:00pm – 5:00pm</span>
              </div>
            </div>

            {/* Send Us a Text */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                Send Us a Text
              </div>
              {textSubmitted ? (
                <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
                  ✓ Text message invitation sent to {textPhone}!
                </div>
              ) : (
                <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="tel"
                    placeholder="Enter phone"
                    required
                    value={textPhone}
                    onChange={(e) => setTextPhone(e.target.value)}
                    style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    SEND
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
