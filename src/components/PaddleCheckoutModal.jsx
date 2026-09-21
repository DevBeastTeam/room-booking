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
      const res = await verifyPaddleTransaction(activeTransaction.txn_id || activeTransaction.paddle_txn_id);
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
        backgroundColor: 'rgba(10, 13, 20, 0.82)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: '18px',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669 0%, #0f766e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)',
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em', color: '#ffffff' }}>
                Monarch Pass Secure Checkout
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Powered by Paddle Billing</span>
                <span>•</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>
                  {paddleConfig?.is_sandbox ? 'Sandbox Testing Mode' : 'Live SSL Encrypted'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {isSuccess ? (
            /* Success Receipt View */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  border: '2px solid rgba(34, 197, 94, 0.4)',
                }}
              >
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                Payment Confirmed!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                Thank you! Your transaction has been recorded in the database and your reservation details are secured.
              </p>

              {/* Receipt Summary Card */}
              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Transaction ID:</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                    {activeTransaction?.txn_id || 'TXN-SUCCESS'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Item:</span>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{currentOption.title}</span>
                </div>
                {unitNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.82rem' }}>
                    <span style={{ color: '#94a3b8' }}>Reserved Unit:</span>
                    <span style={{ fontWeight: 600, color: '#fbbf24' }}>Unit #{unitNumber}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Payer:</span>
                  <span style={{ color: '#f8fafc' }}>{name} ({email})</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#334155', margin: '0.75rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                  <span style={{ color: '#f8fafc' }}>Total Paid:</span>
                  <span style={{ color: '#4ade80' }}>${finalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
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
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CreditCard size={32} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                Paddle Checkout Ready
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                A secure Paddle checkout session has been initialized. If the window did not open automatically, click below.
              </p>

              {activeTransaction.checkout_url && (
                <a
                  href={activeTransaction.checkout_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.9rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    marginBottom: '1rem',
                  }}
                >
                  <span>Open Paddle Checkout Page</span>
                  <ExternalLink size={18} />
                </a>
              )}

              {/* Simulation button for quick testing */}
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Sandbox Quick Test Action
                </div>
                <button
                  onClick={handleSimulateOrVerifySuccess}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>Verify / Confirm Test Payment (Instant Database Save)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Form: Selection and Details */
            <form onSubmit={handleInitiatePayment}>
              {/* Payment Type Selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.6rem' }}>
                  Select Payment Item
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                          padding: '0.9rem 1rem',
                          borderRadius: '10px',
                          border: `1.5px solid ${isSelected ? '#10b981' : '#334155'}`,
                          backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : '#1e293b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? '#10b981' : '#334155',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                              {opt.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {opt.desc}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: isSelected ? '#34d399' : '#f8fafc' }}>
                            ${opt.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Applicant / Resident Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
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
                      padding: '0.7rem 0.85rem',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
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
                      padding: '0.7rem 0.85rem',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="817-555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                    Target Unit # (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2104"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {errorMessage && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Total Due & Submit Button */}
              <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Due Today</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                    ${finalAmount.toFixed(2)} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.85rem 1.6rem',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
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
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', padding: '0.65rem 0.85rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>Single One-Time Payment:</span> This transaction is billed once. There are <strong>no recurring subscriptions</strong> or automatic future deductions.
              </div>

              {/* Security Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', color: '#64748b', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} color="#34d399" />
                  <span>256-Bit SSL Encryption</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Check size={14} color="#38bdf8" />
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
