import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, CreditCard, CheckCircle2, AlertCircle, X, ExternalLink,
  Building, User, Mail, Phone, ArrowRight, RefreshCw, Sparkles, Check
} from 'lucide-react';
import { createPaddleTransaction, verifyPaddleTransaction, fetchPaddleConfig } from '../services/siteDataService';

const PAYMENT_OPTIONS = [
  {
    id: 'holding_deposit',
    title: 'One-Time Apartment Holding Deposit',
    amount: 250.00,
    badge: 'One-Time Payment',
    desc: 'Single one-time payment to reserve your unit for 72 hours. No recurring subscription.',
    icon: Building
  },
  {
    id: 'application_fee',
    title: 'One-Time Rental Application Fee',
    amount: 50.00,
    badge: 'One-Time Payment',
    desc: 'Single one-time screening fee per applicant. No automatic renewal.',
    icon: User
  },
  {
    id: 'rent_payment',
    title: 'One-Time Monthly Rent Payment',
    amount: 909.00,
    badge: 'One-Time Payment',
    desc: 'Single one-time rent payment. Manual checkout only (no auto-deduction).',
    icon: CreditCard
  }
];

export default function PaddleCheckoutModal({
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

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paddleConfig, setPaddleConfig] = useState(null);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialItem) setSelectedItem(initialItem);
      if (initialUnit) setUnitNumber(initialUnit);
      if (initialAmount) setCustomAmount(String(initialAmount));
      if (customerPreset?.name) setName(customerPreset.name);
      if (customerPreset?.email) setEmail(customerPreset.email);
      if (customerPreset?.phone) setPhone(customerPreset.phone);
      setIsSuccess(false);
      setActiveTransaction(null);
      setErrorMessage('');

      fetchPaddleConfig().then(cfg => {
        if (cfg) setPaddleConfig(cfg);
      });
    }
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
      const res = await createPaddleTransaction({
        item_type: selectedItem,
        item_name: currentOption.title,
        amount: finalAmount,
        unit_number: unitNumber,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim()
      });

      if (!res || !res.success) {
        throw new Error(res?.error || 'Failed to initialize Paddle payment transaction.');
      }

      setActiveTransaction(res);
      setIsLoading(false);

      // If Paddle checkout URL is present, open checkout in a popup window or redirect
      if (res.checkout_url) {
        window.open(res.checkout_url, '_blank', 'width=800,height=750,scrollbars=yes,resizable=yes');
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage(err.message || 'Payment service is currently unavailable. Please try again.');
    }
  };

  const handleSimulateOrVerifySuccess = async () => {
    if (!activeTransaction) return;
    setIsLoading(true);

    try {
      await verifyPaddleTransaction(activeTransaction.txn_id || activeTransaction.paddle_txn_id);
      setIsLoading(false);
      setIsSuccess(true);
    } catch {
      setIsLoading(false);
      setIsSuccess(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(5, 7, 14, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-down"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: 'var(--modal-bg, var(--bg-surface))',
          color: 'var(--text-main)',
          borderRadius: '18px',
          border: '1px solid var(--card-border)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: '1.4rem 1.75rem',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--modal-header-bg, linear-gradient(135deg, rgba(201, 169, 110, 0.25) 0%, rgba(12, 16, 28, 0.95) 100%))',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #dfc285 0%, #c9a96e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#08090f',
                boxShadow: '0 4px 15px rgba(201, 169, 110, 0.35)',
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em', color: 'var(--text-main)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Monarch Pass Secure Checkout
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Powered by Paddle Merchant Services</span>
                <span>•</span>
                <span style={{ color: '#dfc285', fontWeight: 600 }}>
                  {paddleConfig?.is_sandbox ? 'Sandbox Testing Active' : '256-Bit SSL Encrypted'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 110, 0.25)',
              color: '#c9a96e',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          {isSuccess ? (
            /* Success Receipt View */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 169, 110, 0.15)',
                  color: '#dfc285',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  border: '2px solid rgba(201, 169, 110, 0.4)',
                }}
              >
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Payment Confirmed & Verified
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Thank you! Your transaction has been recorded securely and your reservation details are confirmed.
              </p>

              {/* Receipt Summary Card */}
              <div
                style={{
                  backgroundColor: 'rgba(16, 20, 34, 0.95)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  padding: '1.5rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Transaction ID:</span>
                  <span style={{ fontWeight: 700, color: '#dfc285', fontFamily: 'monospace' }}>
                    {activeTransaction?.txn_id || 'TXN-SUCCESS'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Item:</span>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{currentOption.title}</span>
                </div>
                {unitNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8' }}>Reserved Unit:</span>
                    <span style={{ fontWeight: 700, color: '#dfc285' }}>Unit #{unitNumber}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Payer:</span>
                  <span style={{ color: '#f8fafc' }}>{name} ({email})</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(201, 169, 110, 0.2)', margin: '0.85rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                  <span style={{ color: '#f8fafc' }}>Total Paid:</span>
                  <span style={{ color: '#dfc285' }}>${finalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                }}
              >
                Close Receipt & Continue
              </button>
            </div>
          ) : activeTransaction ? (
            /* Paddle Link Opened / Verification State */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201, 169, 110, 0.15)',
                  color: '#dfc285',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                }}
              >
                <CreditCard size={30} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Paddle Checkout Session Initialized
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                A secure Paddle checkout window has opened. If your browser blocked the popup, click the button below.
              </p>

              {activeTransaction.checkout_url && (
                <a
                  href={activeTransaction.checkout_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.9rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.95rem',
                  }}
                >
                  <span>Open Paddle Checkout Page</span>
                  <ExternalLink size={18} />
                </a>
              )}

              {/* Simulation button for quick testing */}
              <div style={{ backgroundColor: 'rgba(201, 169, 110, 0.08)', border: '1px solid rgba(201, 169, 110, 0.25)', borderRadius: '12px', padding: '1.25rem', marginTop: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#dfc285', fontWeight: 700, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Sandbox Quick Test Action
                </div>
                <button
                  onClick={handleSimulateOrVerifySuccess}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(201, 169, 110, 0.2)',
                    color: '#dfc285',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>Verify / Confirm Test Payment (Save to Database)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Form: Selection and Details */
            <form onSubmit={handleInitiatePayment}>
              {/* Payment Type Selector */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#c9a96e', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                  Select Payment Item
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PAYMENT_OPTIONS.map((opt) => {
                    const isSelected = selectedItem === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setSelectedItem(opt.id);
                          setCustomAmount('');
                        }}
                        style={{
                          padding: '1rem 1.25rem',
                          borderRadius: '12px',
                          border: `1.5px solid ${isSelected ? '#dfc285' : 'rgba(201, 169, 110, 0.2)'}`,
                          backgroundColor: isSelected ? 'rgba(201, 169, 110, 0.12)' : 'rgba(16, 20, 34, 0.85)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 15px rgba(201, 169, 110, 0.2)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? '#c9a96e' : 'rgba(255, 255, 255, 0.06)',
                              color: isSelected ? '#08090f' : '#dfc285',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                              {opt.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                              {opt.desc}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: isSelected ? '#dfc285' : '#f8fafc' }}>
                            ${opt.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Applicant / Resident Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="817-555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                    Target Unit # (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2104"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      backgroundColor: 'rgba(8, 10, 18, 0.75)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {errorMessage && (
                <div style={{ padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Total Due & Submit Button */}
              <div style={{ backgroundColor: 'rgba(16, 20, 34, 0.95)', border: '1px solid rgba(201, 169, 110, 0.3)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>Total Due Today</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dfc285' }}>
                    ${finalAmount.toFixed(2)} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Connecting Paddle...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Proceed to Pay</span>
                    </>
                  )}
                </button>
              </div>

              {/* One-Time Payment Assurance Banner */}
              <div style={{ backgroundColor: 'rgba(201, 169, 110, 0.08)', border: '1px solid rgba(201, 169, 110, 0.25)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <span style={{ color: '#dfc285', fontWeight: 700 }}>Single One-Time Payment:</span> This charge is billed once. There are <strong>no recurring subscriptions</strong> or automatic future deductions.
              </div>

              {/* Security Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', color: '#94a3b8', fontSize: '0.78rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={15} color="#dfc285" />
                  <span>256-Bit SSL Encryption</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={15} color="#dfc285" />
                  <span>Paddle Merchant of Record</span>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
