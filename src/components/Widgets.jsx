import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Calendar,
  Mail,
  Smartphone,
  ChevronRight,
  ChevronDown,
  X,
  Send,
  Clock,
  Phone,
  CheckCircle,
  Video,
  Users,
  Eye,
  ZoomIn,
  Contrast,
  UserCircle,
  Edit2,
  Check
} from 'lucide-react';
import { addSupportInquiry } from '../services/siteDataService';
import {
  getUserInfo,
  setUserInfo,
  getSession,
  ensureSession,
  sendUserMessage,
  formatTs,
} from '../services/chatService';

export default function Widgets({ onOpenScheduleTour }) {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'chat', 'tour', 'email', 'call', 'accessibility'

  // ── Real Chat State (Admin & Customer Live Chat) ──────────────────────────
  const [chatUser, setChatUser] = useState(() => {
    if (typeof window === 'undefined') return { userId: '', displayName: 'Guest', email: '', isLoggedIn: false };
    try { return getUserInfo(); } catch { return { userId: '', displayName: 'Guest', email: '', isLoggedIn: false }; }
  });
  const [chatMessages, setChatMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const info = getUserInfo();
      ensureSession(info.userId, info.displayName, info.email);
      const session = getSession(info.userId);
      return session?.messages || [];
    } catch { return []; }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const info = getUserInfo();
      return info.displayName.startsWith('Guest') ? '' : info.displayName;
    } catch { return ''; }
  });
  const [editEmail, setEditEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    try { return getUserInfo().email || ''; } catch { return ''; }
  });
  const messagesEndRef = useRef(null);

  // Sync user info and load conversation
  const syncChatState = () => {
    const info = getUserInfo();
    setChatUser(info);
    setEditName(info.displayName.startsWith('Guest') ? '' : info.displayName);
    setEditEmail(info.email || '');
    ensureSession(info.userId, info.displayName, info.email);
    const session = getSession(info.userId);
    if (session && session.messages) {
      setChatMessages(session.messages);
    }
  };

  // Real-time listener and polling for admin replies
  useEffect(() => {
    if (activeModal !== 'chat' || !chatUser.userId) return;
    const fetchLatest = () => {
      const s = getSession(chatUser.userId);
      if (s && s.messages) {
        setChatMessages(s.messages);
      }
    };
    const interval = setInterval(fetchLatest, 2000);
    const onUpdate = () => fetchLatest();
    window.addEventListener('chat-sessions-updated', onUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('chat-sessions-updated', onUpdate);
    };
  }, [activeModal, chatUser.userId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeModal === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeModal]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage.trim();
    const info = getUserInfo();
    const uid = chatUser.userId || info.userId;
    sendUserMessage(uid, msg, chatUser.displayName || info.displayName, chatUser.email || info.email);
    setInputMessage('');
    const s = getSession(uid);
    if (s && s.messages) setChatMessages(s.messages);
  };

  const handleSaveCustomerInfo = (e) => {
    e.preventDefault();
    if (!editName.trim() && !editEmail.trim()) return;
    setUserInfo(editName.trim(), editEmail.trim());
    const updated = getUserInfo();
    setChatUser(updated);
    setIsEditingInfo(false);
    const s = getSession(updated.userId);
    if (s && s.messages) setChatMessages(s.messages);
  };


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


  const handleTourSubmit = (e) => {
    e.preventDefault();
    if (!tourForm.firstName || !tourForm.email || !tourForm.phone) {
      alert('Please fill out all required contact fields.');
      return;
    }
    addSupportInquiry({
      name: `${tourForm.firstName} ${tourForm.lastName}`.trim(),
      email: tourForm.email.trim(),
      phone: tourForm.phone.trim(),
      category: 'Tour Request',
      subject: `Guided Tour (${tourType}) for ${tourForm.bedrooms}`,
      message: `Requested tour date: ${selectedDate} at ${selectedTime}.`,
    });
    setTourSubmitted(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailForm.firstName || !emailForm.email || !emailForm.message) {
      alert('Please enter your name, email, and message.');
      return;
    }
    addSupportInquiry({
      name: `${emailForm.firstName} ${emailForm.lastName}`.trim(),
      email: emailForm.email.trim(),
      phone: emailForm.phone.trim() || 'N/A',
      category: 'Widget Inquiry',
      subject: 'Message from Email Agent Widget',
      message: emailForm.message.trim(),
    });
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
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'var(--card-bg, #0c101c)',
          border: '1px solid var(--card-border, rgba(201, 169, 110, 0.3))',
          color: 'var(--primary-color, #c9a96e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.35))',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'all 0.25s ease',
        }}
      >
        <Eye size={22} />
      </button>

      {activeModal === 'accessibility' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '85px',
            left: '24px',
            backgroundColor: 'var(--modal-bg, #0c101c)',
            borderRadius: '12px',
            padding: '1.25rem',
            width: '280px',
            boxShadow: '0 20px 50px var(--shadow-color, rgba(0,0,0,0.5))',
            zIndex: 1000,
            border: '1px solid var(--card-border, rgba(201, 169, 110, 0.35))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main, #f8fafc)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>Accessibility</h4>
            <button onClick={() => setActiveModal(null)} style={{ color: 'var(--primary-color, #c9a96e)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--card-inner-bg, rgba(255, 255, 255, 0.05))',
                border: '1px solid var(--card-border, rgba(201, 169, 110, 0.25))',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-main, #f4efe6)',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <ZoomIn size={16} style={{ color: 'var(--primary-color, #dfc285)' }} />
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
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--card-inner-bg, rgba(255, 255, 255, 0.05))',
                border: '1px solid var(--card-border, rgba(201, 169, 110, 0.25))',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-main, #f4efe6)',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <Contrast size={16} style={{ color: 'var(--primary-color, #dfc285)' }} />
              <span>High Contrast Mode</span>
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
              backgroundColor: 'var(--card-bg, #0c101c)',
              border: '1px solid var(--card-border, rgba(201, 169, 110, 0.3))',
              borderBottom: 'none',
              borderRadius: '6px 6px 0 0',
              padding: '0.25rem 0.75rem',
              color: 'var(--primary-color, #c9a96e)',
              boxShadow: '0 -4px 12px var(--shadow-color, rgba(0,0,0,0.3))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '-1px',
              zIndex: 2,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
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
                width: '225px',
                backgroundColor: 'var(--card-bg, #0c101c)',
                borderRadius: '12px',
                boxShadow: '0 15px 40px var(--shadow-color, rgba(0,0,0,0.45))',
                overflow: 'hidden',
                border: '1px solid var(--card-border, rgba(201, 169, 110, 0.35))',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background-color 0.3s ease, border-color 0.3s ease',
              }}
            >
              {/* 1. Chat with us (Clean unified design, no artificial gold background) */}
              <button
                onClick={() => { syncChatState(); setActiveModal('chat'); }}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-main, #f4efe6)',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color, rgba(201, 169, 110, 0.15))',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-inner-bg, rgba(201, 169, 110, 0.12))')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <MessageSquare size={18} style={{ color: 'var(--primary-color, #dfc285)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main, #f4efe6)' }}>
                    <strong style={{ color: 'var(--primary-color, #dfc285)' }}>Chat</strong> Concierge
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              </button>

              {/* 2. Book a tour */}
              <button
                id="btn-widget-book-tour"
                onClick={() => {
                  if (onOpenScheduleTour) {
                    onOpenScheduleTour();
                  } else {
                    setActiveModal('tour');
                  }
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-main, #f4efe6)',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color, rgba(201, 169, 110, 0.15))',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-inner-bg, rgba(201, 169, 110, 0.12))')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Calendar size={18} style={{ color: 'var(--primary-color, #dfc285)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main, #f4efe6)' }}>
                    <strong style={{ color: 'var(--primary-color, #dfc285)' }}>Book</strong> a Tour
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              </button>

              {/* 3. Email an agent */}
              <button
                onClick={() => setActiveModal('email')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-main, #f4efe6)',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color, rgba(201, 169, 110, 0.15))',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-inner-bg, rgba(201, 169, 110, 0.12))')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Mail size={18} style={{ color: 'var(--primary-color, #dfc285)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main, #f4efe6)' }}>
                    <strong style={{ color: 'var(--primary-color, #dfc285)' }}>Email</strong> an Agent
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              </button>

              {/* 4. Call or text us */}
              <button
                onClick={() => setActiveModal('call')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-main, #f4efe6)',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-inner-bg, rgba(201, 169, 110, 0.12))')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Smartphone size={18} style={{ color: 'var(--primary-color, #dfc285)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main, #f4efe6)' }}>
                    <strong style={{ color: 'var(--primary-color, #dfc285)' }}>Call</strong> or Text
                  </span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsMenuCollapsed(false)}
              aria-label="Open widget menu"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285 0%, #c9a96e 100%))',
                color: 'var(--btn-gold-text, #08090f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px var(--shadow-color, rgba(201, 169, 110, 0.45))',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              <MessageSquare size={24} />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CHAT MODAL WINDOW (Real-time Live Chat with Admin) */}
      {/* ========================================================================= */}
      {activeModal === 'chat' && (
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '540px',
            backgroundColor: 'var(--modal-bg, #0c101c)',
            borderRadius: '16px',
            boxShadow: '0 25px 60px var(--shadow-color, rgba(0,0,0,0.7))',
            zIndex: 1000,
            overflow: 'hidden',
            border: '1px solid var(--card-border, rgba(201, 169, 110, 0.35))',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ background: 'var(--card-bg, #0c101c)', padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color, rgba(201, 169, 110, 0.25))', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285, #c9a96e))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-gold-text, #08090f)', fontWeight: 800, fontSize: '0.95rem' }}>M</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main, #f8fafc)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>Monarch Pass Concierge</div>
                <div style={{ fontSize: '0.68rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                  Live Chat with Leasing Staff
                </div>
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} style={{ color: 'var(--primary-color, #c9a96e)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
          </div>

          {/* User Identity Sub-bar */}
          <div style={{
            backgroundColor: 'var(--card-inner-bg, rgba(201, 169, 110, 0.08))',
            borderBottom: '1px solid var(--border-color, rgba(201, 169, 110, 0.15))',
            padding: '0.45rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main, #f4efe6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <UserCircle size={14} style={{ color: 'var(--primary-color, #c9a96e)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chatUser.email ? (
                  <span><strong>{chatUser.displayName}</strong> ({chatUser.email})</span>
                ) : (
                  <span>Chatting as <strong style={{ color: 'var(--primary-color, #dfc285)' }}>{chatUser.displayName}</strong></span>
                )}
              </span>
            </div>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color, #c9a96e)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                flexShrink: 0,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: isEditingInfo ? 'rgba(201, 169, 110, 0.15)' : 'transparent',
              }}
            >
              <Edit2 size={11} />
              {isEditingInfo ? 'Cancel' : (chatUser.email ? 'Edit' : 'Add Info')}
            </button>
          </div>

          {/* Collapsible Profile Edit Drawer */}
          {isEditingInfo && (
            <form onSubmit={handleSaveCustomerInfo} style={{
              backgroundColor: 'var(--card-bg, #0f1322)',
              borderBottom: '1px solid var(--border-color, rgba(201, 169, 110, 0.25))',
              padding: '0.8rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>
                Set your name and email so our leasing team can follow up with you:
              </div>
              <input
                type="text"
                placeholder="Your Name (e.g. John Doe)"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{
                  padding: '0.45rem 0.7rem',
                  borderRadius: '6px',
                  border: '1px solid var(--card-border, rgba(201,169,110,0.3))',
                  backgroundColor: 'var(--card-inner-bg, rgba(255,255,255,0.06))',
                  color: 'var(--text-main, #f4efe6)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <input
                type="email"
                placeholder="Your Email (e.g. john@example.com)"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                style={{
                  padding: '0.45rem 0.7rem',
                  borderRadius: '6px',
                  border: '1px solid var(--card-border, rgba(201,169,110,0.3))',
                  backgroundColor: 'var(--card-inner-bg, rgba(255,255,255,0.06))',
                  color: 'var(--text-main, #f4efe6)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.45rem 0.8rem',
                  borderRadius: '6px',
                  background: 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285, #c9a96e))',
                  color: 'var(--btn-gold-text, #08090f)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <Check size={13} /> Save & Update Profile
              </button>
            </form>
          )}

          {/* Message Thread */}
          <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', backgroundColor: 'var(--bg-page, rgba(8, 10, 18, 0.95))' }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted, #94a3b8)', fontSize: '0.8rem', marginTop: '2rem' }}>Send a message to start the conversation...</div>
            )}
            {chatMessages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: m.sender === 'user' ? 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285, #c9a96e))' : 'var(--card-bg, rgba(16,20,34,0.95))',
                  color: m.sender === 'user' ? 'var(--btn-gold-text, #08090f)' : 'var(--text-main, #f4efe6)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--card-border, rgba(201,169,110,0.25))',
                  padding: '0.65rem 0.9rem',
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  maxWidth: '82%',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
                  fontWeight: m.sender === 'user' ? 600 : 400,
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted, #64748b)', marginTop: '2px', padding: '0 4px' }}>
                  {m.sender === 'admin' ? '🏢 Leasing Staff · ' : ''}{formatTs(m.ts)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} style={{ backgroundColor: 'var(--card-bg, rgba(12,16,28,0.98))', borderTop: '1px solid var(--border-color, rgba(201,169,110,0.25))', padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask about floor plans, pricing, tour..."
              style={{ flex: 1, backgroundColor: 'var(--card-inner-bg, rgba(255,255,255,0.06))', border: '1px solid var(--card-border, rgba(201,169,110,0.25))', borderRadius: '8px', padding: '0.55rem 0.75rem', color: 'var(--text-main, #f8fafc)', fontSize: '0.84rem', outline: 'none' }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                background: inputMessage.trim() ? 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285 0%, #c9a96e 100%))' : 'rgba(201,169,110,0.25)',
                color: inputMessage.trim() ? 'var(--btn-gold-text, #08090f)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: inputMessage.trim() ? 'pointer' : 'default',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <Send size={15} />
            </button>
          </form>

          {/* Quick Shortcuts Footer */}
          <div style={{ backgroundColor: 'var(--card-bg, rgba(8,10,18,0.95))', padding: '0.45rem 1rem', borderTop: '1px solid var(--border-color, rgba(201,169,110,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '0.67rem', color: 'var(--text-muted, #64748b)' }}>
              Replies appear here in real time
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setActiveModal('tour')} title="Book a tour" style={{ color: 'var(--primary-color, #dfc285)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px' }}><Calendar size={15} /></button>
              <button onClick={() => setActiveModal('call')} title="Call us" style={{ color: 'var(--primary-color, #dfc285)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px' }}><Phone size={15} /></button>
            </div>
          </div>
        </div>
      )}


      {/* 4. SCHEDULE A TOUR MODAL ('Book a tour') */}
      {/* ========================================================================= */}
      {activeModal === 'tour' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--modal-backdrop, rgba(0,0,0,0.6))',
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
              backgroundColor: 'var(--modal-bg, #ffffff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '920px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px var(--shadow-color, rgba(0,0,0,0.3))',
              position: 'relative',
              padding: '2rem',
              border: '1px solid var(--card-border, rgba(201, 169, 110, 0.3))',
              color: 'var(--text-main)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main, #1e293b)', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Schedule a Tour
              </h2>
              <button onClick={() => setActiveModal(null)} style={{ color: 'var(--primary-color, #64748b)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
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
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main, #1e293b)', marginBottom: '0.5rem' }}>
                  Tour Scheduled Successfully!
                </h3>
                <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                  We've reserved your {tourType === 'guided' ? 'Guided Tour' : 'Virtual Tour'} on{' '}
                  <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>. A confirmation email has been sent to <strong>{tourForm.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setTourSubmitted(false);
                    setActiveModal(null);
                  }}
                  className="btn-gold"
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '6px',
                    background: 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285 0%, #c9a96e 100%))',
                    color: 'var(--btn-gold-text, #08090f)',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTourSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Col 1: Tour Type */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main, #1e293b)', marginBottom: '0.85rem' }}>
                      1. Select Tour Type
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div
                        onClick={() => setTourType('guided')}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: tourType === 'guided' ? '2px solid var(--primary-color, #c9a96e)' : '1px solid var(--border-color, #e2e8f0)',
                          backgroundColor: tourType === 'guided' ? 'var(--primary-light, rgba(201, 169, 110, 0.12))' : 'var(--card-inner-bg, transparent)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <Users size={22} style={{ color: tourType === 'guided' ? 'var(--primary-color, #c9a96e)' : 'var(--text-muted, #64748b)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main, #1e293b)' }}>Guided tour</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>Walkthrough with an agent</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setTourType('virtual')}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: tourType === 'virtual' ? '2px solid var(--primary-color, #c9a96e)' : '1px solid var(--border-color, #e2e8f0)',
                          backgroundColor: tourType === 'virtual' ? 'var(--primary-light, rgba(201, 169, 110, 0.12))' : 'var(--card-inner-bg, transparent)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <Video size={22} style={{ color: tourType === 'virtual' ? 'var(--primary-color, #c9a96e)' : 'var(--text-muted, #64748b)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main, #1e293b)' }}>Virtual tour</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>Over live video call</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Date & Time */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main, #1e293b)', marginBottom: '0.85rem' }}>
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
                        border: '1px solid var(--input-border, var(--border-color))',
                        backgroundColor: 'var(--input-bg, var(--card-inner-bg))',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem',
                        marginBottom: '0.85rem',
                      }}
                    />

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.4rem' }}>
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
                            border: selectedTime === time ? '1.5px solid var(--primary-color, #c9a96e)' : '1px solid var(--border-color, #e2e8f0)',
                            backgroundColor: selectedTime === time ? 'var(--primary-color, #c9a96e)' : 'var(--card-inner-bg, #f8fafc)',
                            color: selectedTime === time ? 'var(--btn-gold-text, #08090f)' : 'var(--text-main, #334155)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: Your Information */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main, #1e293b)', marginBottom: '0.85rem' }}>
                      3. Your Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <input
                        type="text"
                        placeholder="First Name*"
                        required
                        value={tourForm.firstName}
                        onChange={(e) => setTourForm({ ...tourForm, firstName: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Last Name*"
                        required
                        value={tourForm.lastName}
                        onChange={(e) => setTourForm({ ...tourForm, lastName: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="email"
                        placeholder="Email Address*"
                        required
                        value={tourForm.email}
                        onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number*"
                        required
                        value={tourForm.phone}
                        onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                      <select
                        value={tourForm.bedrooms}
                        onChange={(e) => setTourForm({ ...tourForm, bedrooms: e.target.value })}
                        style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', fontSize: '0.85rem', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)' }}
                      >
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedrooms">2 Bedrooms</option>
                        <option value="3 Bedrooms">3 Bedrooms</option>
                        <option value="4 Bedrooms">4 Bedrooms</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '1.25rem' }}>
                  <button type="button" onClick={() => setActiveModal(null)} style={{ color: 'var(--text-muted, #64748b)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold" style={{ padding: '0.65rem 1.4rem', borderRadius: '6px', background: 'var(--btn-gold-bg, #c9a96e)', color: 'var(--btn-gold-text, #08090f)', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
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
            backgroundColor: 'var(--modal-backdrop, rgba(0,0,0,0.6))',
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
              backgroundColor: 'var(--modal-bg, #ffffff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: '0 25px 50px var(--shadow-color, rgba(0,0,0,0.3))',
              position: 'relative',
              border: '1px solid var(--card-border, rgba(201, 169, 110, 0.3))',
              color: 'var(--text-main)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main, #1e293b)', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Email Our Leasing Team
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ color: 'var(--primary-color, #64748b)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {emailSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={44} style={{ color: '#16a34a', margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main, #1e293b)' }}>Message Sent!</h4>
                <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem' }}>
                  Thank you, {emailForm.firstName}. A leasing consultant will respond to your email shortly.
                </p>
                <button onClick={() => { setEmailSubmitted(false); setActiveModal(null); }} className="btn-gold" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', background: 'var(--btn-gold-bg, #c9a96e)', color: 'var(--btn-gold-text, #08090f)', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
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
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Last name*"
                    required
                    value={emailForm.lastName}
                    onChange={(e) => setEmailForm({ ...emailForm, lastName: e.target.value })}
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email*"
                  required
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={emailForm.phone}
                  onChange={(e) => setEmailForm({ ...emailForm, phone: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <textarea
                  placeholder="Your message*"
                  required
                  rows={4}
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }}
                />
                <button
                  type="submit"
                  className="btn-gold"
                  style={{
                    padding: '0.85rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    marginTop: '0.5rem',
                    background: 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285 0%, #c9a96e 100%))',
                    color: 'var(--btn-gold-text, #08090f)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  SEND MESSAGE
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
            backgroundColor: 'var(--modal-backdrop, rgba(0,0,0,0.6))',
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
              backgroundColor: 'var(--modal-bg, #ffffff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: '0 25px 50px var(--shadow-color, rgba(0,0,0,0.3))',
              position: 'relative',
              border: '1px solid var(--card-border, rgba(201, 169, 110, 0.3))',
              color: 'var(--text-main)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main, #1e293b)', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Contact Our Leasing Team
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ color: 'var(--primary-color, #64748b)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                  backgroundColor: 'var(--card-inner-bg, #f8fafc)',
                  border: '1.5px solid var(--primary-color, #cbd5e1)',
                  borderRadius: '10px',
                  color: 'var(--text-main, #1e293b)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Phone size={20} style={{ color: 'var(--primary-color, #c9a96e)' }} />
                <span>+1 (855) 984-4406</span>
              </a>
            </div>

            {/* Office Hours */}
            <div style={{ backgroundColor: 'var(--card-inner-bg, #f8fafc)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid var(--border-color, rgba(201, 169, 110, 0.15))' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main, #1e293b)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} style={{ color: 'var(--primary-color, #c9a96e)' }} />
                <span>Office Hours</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #475569)', marginBottom: '2px' }}>
                <span>Mon – Fri:</span>
                <span>10:00am – 6:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #475569)', marginBottom: '2px' }}>
                <span>Saturday:</span>
                <span>10:00am – 5:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #475569)' }}>
                <span>Sunday:</span>
                <span>1:00pm – 5:00pm</span>
              </div>
            </div>

            {/* Send Us a Text */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main, #1e293b)', marginBottom: '0.5rem' }}>
                Send Us a Text
              </div>
              {textSubmitted ? (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
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
                    style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--input-border, var(--border-color))', backgroundColor: 'var(--input-bg, var(--card-inner-bg))', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{
                      background: 'var(--btn-gold-bg, linear-gradient(135deg, #dfc285 0%, #c9a96e 100%))',
                      color: 'var(--btn-gold-text, #08090f)',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer',
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
