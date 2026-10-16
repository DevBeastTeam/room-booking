import React, { useState, useEffect } from 'react';
import {
  Lock, CreditCard, CheckCircle2, AlertCircle, X,
  Building, User, RefreshCw, Check, ArrowRight, Repeat
} from 'lucide-react';
import {
  createWorldFirstPayment,
  verifyWorldFirstPayment,
  fetchWorldFirstConfig
} from '../services/siteDataService';
import { trackEvent } from '../services/analytics.js';

const PAYMENT_OPTIONS = [
  {
    id: 'holding_deposit',
    title: 'Apartment Holding Deposit',
    amount: 250.00,
    badge: 'Reserve Unit',
    desc: 'Secures your selected apartment unit for 72 hours while your application is finalized.',
    icon: Building
  },
  {
    id: 'application_fee',
    title: 'Rental Application Screening Fee',
    amount: 50.00,
    badge: 'One-Time',
    desc: 'Mandatory background, income, and credit verification fee per adult applicant.',
    icon: User
  },
  {
    id: 'rent_payment',
    title: 'Monthly Apartment Rent',
    amount: 909.00,
    badge: 'Rent Payment',
    desc: 'Pay your standard monthly apartment rent securely via WorldFirst Pay Solution.',
    icon: CreditCard
  }
];

export default function WorldFirstCheckoutModal({
  isOpen,
  onClose,
  initialItem = 'holding_deposit',
  initialUnit = '',
  initialAmount = null,
  customerPreset = null
}) {
  const [selectedItem, setSelectedItem] = useState(initialItem);
  const [customAmount, setCustomAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [unitNumber, setUnitNumber] = useState(initialUnit);
  const [name, setName] = useState(customerPreset?.name || '');
  const [email, setEmail] = useState(customerPreset?.email || '');
  const [phone, setPhone] = useState(customerPreset?.phone || '');

  // Subscription / Recurring toggle
  const [paymentMode, setPaymentMode] = useState('one_time'); // 'one_time' or 'subscription'
  const [subscriptionInterval, setSubscriptionInterval] = useState('monthly'); // 'monthly' or '3_days'

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [wfConfig, setWfConfig] = useState(null);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Sync props when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (initialItem) setSelectedItem(initialItem);
      setUnitNumber(initialUnit || '');
      setCustomAmount(initialAmount ? String(initialAmount) : '');
      setName(customerPreset?.name || '');
      setEmail(customerPreset?.email || '');
      setPhone(customerPreset?.phone || '');
      setPaymentMode(initialItem === 'rent_payment' ? 'subscription' : 'one_time');
      setSubscriptionInterval('monthly');
      setIsSuccess(false);
      setActiveTransaction(null);
      setErrorMessage('');
      setVerificationResult(null);

      fetchWorldFirstConfig().then(cfg => {
        if (cfg) setWfConfig(cfg);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen, initialItem, initialUnit, initialAmount, customerPreset]);

  if (!isOpen) return null;

  const currentOption = PAYMENT_OPTIONS.find(o => o.id === selectedItem) || PAYMENT_OPTIONS[0];
  const finalAmount = customAmount ? parseFloat(customAmount) : currentOption.amount;

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await createWorldFirstPayment({
        item_type: selectedItem,
        item_name: currentOption.title,
        amount: finalAmount,
        unit_number: unitNumber,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        payment_mode: paymentMode,
        subscription_interval: paymentMode === 'subscription' ? subscriptionInterval : null,
      });

      if (!res || !res.success) {
        throw new Error(res?.error || 'Failed to initialize WorldFirst payment transaction.');
      }

      setActiveTransaction(res);
      setIsLoading(false);

      // Track analytics
      trackEvent('worldfirst_payment_started', {
        item: selectedItem,
        unit: unitNumber || 'general',
        amount: String(finalAmount),
        mode: paymentMode,
        interval: subscriptionInterval,
        txn: res.txn_id || '',
      });

      // If live checkout URL returned from WorldFirst
      if (res.checkout_url && res.live_api) {
        window.open(res.checkout_url, '_blank', 'width=800,height=750,scrollbars=yes,resizable=yes');
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage(err.message || 'WorldFirst payment service is currently unavailable. Please try again.');
    }
  };

  const handleVerifyOrSimulateSuccess = async () => {
    if (!activeTransaction) return;
    setIsLoading(true);

    try {
      const result = await verifyWorldFirstPayment(activeTransaction.txn_id);
      setIsLoading(false);
      if (result && result.verified === true) {
        setVerificationResult(result);
        setIsSuccess(true);
      } else {
        setErrorMessage(result?.message || 'Payment is still being processed by WorldFirst. Please verify in a moment.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Verification request failed. Please check network connectivity.');
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(5, 7, 14, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          backgroundColor: '#0d111a',
          borderRadius: '20px',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(13, 17, 26, 0.95) 100%)',
            borderBottom: '1px solid rgba(201, 169, 110, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dfc285, #c9a96e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#08090f',
                fontWeight: 800,
                fontSize: '1.2rem',
                boxShadow: '0 4px 15px rgba(201, 169, 110, 0.3)',
              }}
            >
              W
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  WorldFirst Pay Solution
                </h3>
                <span
                  style={{
                    backgroundColor: wfConfig?.is_sandbox ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    color: wfConfig?.is_sandbox ? '#fbbf24' : '#4ade80',
                    border: `1px solid ${wfConfig?.is_sandbox ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                    borderRadius: '20px',
                    padding: '2px 9px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {wfConfig?.is_sandbox ? 'Sandbox Mode' : 'Live Gateway'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                Monarch Pass Apartments · Secure International & Domestic Checkout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {isSuccess ? (
            /* ── SUCCESS RECEIPT SCREEN ── */
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '2px solid rgba(34, 197, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: '#4ade80',
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <h4 style={{ color: '#f8fafc', fontSize: '1.45rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                {verificationResult?.payment_mode === 'subscription' ? 'Auto-Subscription Active!' : 'Payment Successful!'}
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
                {verificationResult?.message || 'Your transaction has been processed and confirmed via WorldFirst Pay Solution.'}
              </p>

              {/* Receipt Card */}
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  maxWidth: '480px',
                  margin: '0 auto 1.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Transaction ID:</span>
                  <span style={{ color: '#dfc285', fontWeight: 700, fontSize: '0.85rem' }}>{verificationResult?.txn_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Paid:</span>
                  <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.1rem' }}>${(verificationResult?.amount || finalAmount).toFixed(2)} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Billing Mode:</span>
                  <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                    {verificationResult?.payment_mode === 'subscription' ? `Auto-Debit (${verificationResult?.subscription_interval || 'Monthly'})` : 'One-Time Manual'}
                  </span>
                </div>
                {verificationResult?.next_billing_date && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Next Recurring Deduction:</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>{verificationResult.next_billing_date}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Status:</span>
                  <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={14} /> Completed & Confirmed
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '0.75rem 1.75rem',
                    backgroundColor: '#dfc285',
                    color: '#08090f',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : activeTransaction ? (
            /* ── ACTIVE CHECKOUT / VERIFICATION SCREEN ── */
            <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(223, 194, 133, 0.15)',
                  border: '2px solid rgba(223, 194, 133, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: '#dfc285',
                }}
              >
                <RefreshCw size={26} className="animate-spin" />
              </div>

              <h4 style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                Processing WorldFirst Checkout
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Transaction <strong style={{ color: '#dfc285' }}>{activeTransaction.txn_id}</strong> is ready for verification.
              </p>

              {errorMessage && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                  }}
                >
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  {errorMessage}
                </div>
              )}

              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  maxWidth: '480px',
                  margin: '0 auto 1.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Item:</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.85rem' }}>{currentOption.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Amount:</span>
                  <span style={{ color: '#dfc285', fontWeight: 700, fontSize: '0.95rem' }}>${finalAmount.toFixed(2)} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Billing Mode:</span>
                  <span style={{ color: paymentMode === 'subscription' ? '#4ade80' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem' }}>
                    {paymentMode === 'subscription' ? `Auto-Subscription (${subscriptionInterval})` : 'One-Time Payment'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Environment:</span>
                  <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.85rem' }}>WorldFirst Sandbox</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleVerifyOrSimulateSuccess}
                  disabled={isLoading}
                  style={{
                    padding: '0.85rem 1.75rem',
                    backgroundColor: '#dfc285',
                    color: '#08090f',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Confirm & Complete Payment
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTransaction(null)}
                  style={{
                    padding: '0.85rem 1.25rem',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #1f2d44',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  ← Back to Details
                </button>
              </div>
            </div>
          ) : (
            /* ── PAYMENT FORM SCREEN ── */
            <form onSubmit={handleInitiatePayment}>
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  {errorMessage}
                </div>
              )}

              {/* 1. Item Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#dfc285', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  Select Payment Item
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {PAYMENT_OPTIONS.map(opt => {
                    const active = selectedItem === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setSelectedItem(opt.id);
                          setCustomAmount('');
                          if (opt.id === 'rent_payment') setPaymentMode('subscription');
                          else setPaymentMode('one_time');
                        }}
                        style={{
                          backgroundColor: active ? 'rgba(201, 169, 110, 0.15)' : '#111827',
                          border: active ? '2px solid #dfc285' : '1px solid #1f2d44',
                          borderRadius: '12px',
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <Icon size={18} color={active ? '#dfc285' : '#94a3b8'} />
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: active ? '#dfc285' : '#64748b' }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                          {opt.title}
                        </div>
                        <div style={{ color: '#dfc285', fontWeight: 800, fontSize: '1.15rem' }}>
                          ${opt.amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Billing Mode: One-time vs Auto-Subscription */}
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f2d44',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Repeat size={16} color="#dfc285" /> Payment Method & Subscription
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>
                      Choose between single one-time payment or auto-renewing subscription.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: paymentMode === 'subscription' ? '1rem' : '0' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('one_time')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: paymentMode === 'one_time' ? '2px solid #dfc285' : '1px solid #1f2d44',
                      backgroundColor: paymentMode === 'one_time' ? 'rgba(201, 169, 110, 0.15)' : '#0d111a',
                      color: paymentMode === 'one_time' ? '#dfc285' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <CreditCard size={15} /> One-Time Payment
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('subscription')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: paymentMode === 'subscription' ? '2px solid #4ade80' : '1px solid #1f2d44',
                      backgroundColor: paymentMode === 'subscription' ? 'rgba(34, 197, 94, 0.15)' : '#0d111a',
                      color: paymentMode === 'subscription' ? '#4ade80' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Repeat size={15} /> Auto-Subscription (Recurring)
                  </button>
                </div>

                {paymentMode === 'subscription' && (
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Subscription Interval / Auto-Debit Cycle:
                    </label>
                    <select
                      value={subscriptionInterval}
                      onChange={e => setSubscriptionInterval(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#0a0d14',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    >
                      <option value="monthly">Monthly Rent Cycle — Auto-Debit Every 30 Days</option>
                      <option value="3_days">Developer Fast Test Cycle — Auto-Debit Every 3 Days</option>
                    </select>
                    <div style={{ color: '#4ade80', fontSize: '0.72rem', marginTop: '0.35rem', fontWeight: 600 }}>
                      ✓ After first payment, your card will be automatically charged on this recurring schedule until cancelled.
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#dfc285', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jordan Miller"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#111827',
                      border: '1px solid #1f2d44',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#dfc285', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jordan.m@example.com"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#111827',
                      border: '1px solid #1f2d44',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#dfc285', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(817) 555-0192"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#111827',
                      border: '1px solid #1f2d44',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#dfc285', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Apartment Unit #
                  </label>
                  <input
                    type="text"
                    value={unitNumber}
                    onChange={e => setUnitNumber(e.target.value)}
                    placeholder="e.g. 2104"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#111827',
                      border: '1px solid #1f2d44',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Footer Submit Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Total Amount Due:</div>
                  <div style={{ color: '#dfc285', fontWeight: 800, fontSize: '1.4rem' }}>
                    ${finalAmount.toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.85rem 2rem',
                    background: 'linear-gradient(135deg, #dfc285, #c9a96e)',
                    color: '#08090f',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 20px rgba(201, 169, 110, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <>
                      Proceed to WorldFirst <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>

              {/* Security info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: '#64748b', fontSize: '0.74rem' }}>
                <Lock size={12} />
                <span>256-Bit SSL Encrypted · Ant International WorldFirst Certified Merchant</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
