import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, HelpCircle, DollarSign, ShieldCheck, Home } from 'lucide-react';
import FloorPlanViewer from './FloorPlanViewer';

export default function CostBreakdown({
  floorPlan,
  unitNumber,
  baseRent,
  leaseTerm,
  occupants,
  pets,
  addOns,
  onOpenEmailModal,
}) {
  // Accordions open state
  const [openAccordions, setOpenAccordions] = useState({
    application: false,
    moveIn: false,
    monthly: true,
    situational: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fees calculation
  const appFee = 55.0 * occupants;
  const adminFee = 90.0;
  const totalApplicationCost = appFee + adminFee;

  const securityDeposit = 250.0;
  const petDeposit = pets * 300.0;
  const totalMoveInCost = securityDeposit + petDeposit;

  // Mandatory monthly fees
  const valetTrash = 25.0;
  const pestControl = 13.0;
  const trashFee = 5.0;
  const amenityFee = 15.0;
  const mandatoryMonthlyFees = valetTrash + pestControl + trashFee + amenityFee; // $58.00

  // Optional add-ons & pets
  const petRent = pets * 20.0;
  const selectedAddOnsTotal = addOns
    .filter((a) => a.selected)
    .reduce((sum, item) => sum + item.price, 0);

  const totalMonthlyLeasingPrice =
    baseRent + mandatoryMonthlyFees + petRent + selectedAddOnsTotal;

  return (
    <div>
      {/* Unit Overview & Main Total Card */}
      <div
        style={{
          backgroundColor: 'rgba(16, 20, 34, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(201, 169, 110, 0.25)',
          padding: '2rem',
          marginBottom: '1.75rem',
          boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#f8fafc', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Apartment Home #{unitNumber}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              {floorPlan.beds} Bed / {floorPlan.baths} Bath · {floorPlan.sqft} sq.ft.
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#c9a96e', textTransform: 'uppercase' }}>
              TOTAL ESTIMATED MONTHLY
            </div>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#dfc285', lineHeight: 1.15, marginTop: '4px' }}>
              ${totalMonthlyLeasingPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '3px' }}>
              Base rent ${baseRent.toFixed(2)} &middot; {leaseTerm}-month term
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Visual Viewer */}
      <FloorPlanViewer floorPlan={floorPlan} unitNumber={unitNumber} />

      {/* Information Disclaimer Box */}
      <div
        style={{
          backgroundColor: 'rgba(201, 169, 110, 0.1)',
          border: '1px solid rgba(201, 169, 110, 0.25)',
          borderRadius: '10px',
          padding: '1.1rem 1.4rem',
          marginBottom: '1.75rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}
      >
        <Info size={20} style={{ color: '#dfc285', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '0.85rem', color: '#f4efe6', margin: 0, lineHeight: 1.6 }}>
          Estimated monthly leasing price includes base rent, mandatory utility fees, and any selected options. Excludes variable usage-based utilities and one-time refundable deposits due prior to move-in.
        </p>
      </div>

      {/* Accordion 1: Application Cost */}
      <div style={{ backgroundColor: 'rgba(16, 20, 34, 0.85)', borderRadius: '12px', border: '1px solid rgba(201, 169, 110, 0.2)', marginBottom: '1rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('application')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(12, 16, 28, 0.95)',
            border: 'none',
            borderBottom: openAccordions.application ? '1px solid rgba(201, 169, 110, 0.15)' : 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Application & Processing Cost
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dfc285' }}>
              ${totalApplicationCost.toFixed(2)}
            </span>
            {openAccordions.application ? <ChevronUp size={18} style={{ color: '#c9a96e' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
          </div>
        </button>

        {openAccordions.application && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(8, 10, 18, 0.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>Administrative Fee</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>One-time administrative processing fee (non-refundable)</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>${adminFee.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>Application Fee</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>${(55).toFixed(2)} per adult applicant × {occupants} occupant(s)</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>${appFee.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Move-in Cost */}
      <div style={{ backgroundColor: 'rgba(16, 20, 34, 0.85)', borderRadius: '12px', border: '1px solid rgba(201, 169, 110, 0.2)', marginBottom: '1rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('moveIn')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(12, 16, 28, 0.95)',
            border: 'none',
            borderBottom: openAccordions.moveIn ? '1px solid rgba(201, 169, 110, 0.15)' : 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Move-in Deposits
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dfc285' }}>
              ${totalMoveInCost.toFixed(2)}
            </span>
            {openAccordions.moveIn ? <ChevronUp size={18} style={{ color: '#c9a96e' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
          </div>
        </button>

        {openAccordions.moveIn && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(8, 10, 18, 0.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>Security Deposit</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Refundable security deposit with approved credit</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>${securityDeposit.toFixed(2)}</div>
            </div>

            {pets > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>Pet Deposit</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>$300.00 refundable pet deposit × {pets} pet(s)</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>${petDeposit.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: Monthly Cost */}
      <div style={{ backgroundColor: 'rgba(16, 20, 34, 0.85)', borderRadius: '12px', border: '1px solid rgba(201, 169, 110, 0.2)', marginBottom: '1rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('monthly')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(12, 16, 28, 0.95)',
            border: 'none',
            borderBottom: openAccordions.monthly ? '1px solid rgba(201, 169, 110, 0.15)' : 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Recurring Monthly Cost
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dfc285' }}>
              ${totalMonthlyLeasingPrice.toFixed(2)}
            </span>
            {openAccordions.monthly ? <ChevronUp size={18} style={{ color: '#c9a96e' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
          </div>
        </button>

        {openAccordions.monthly && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(8, 10, 18, 0.75)' }}>
            {/* Base Rent */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(201, 169, 110, 0.15)' }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f4efe6' }}>Base Rent</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Based on {leaseTerm}-month lease agreement</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#dfc285' }}>${baseRent.toFixed(2)}</div>
            </div>

            {/* Utility Fees */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#c9a96e', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                Utility Fees (Mandatory)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Valet Trash Service</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f4efe6' }}>${valetTrash.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Pest Control Fee</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f4efe6' }}>${pestControl.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Community Trash Service</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f4efe6' }}>${trashFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Water / Sewer / Stormwater</span>
                <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#94a3b8' }}>Usage Based</span>
              </div>
            </div>

            {/* Amenity Fees */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#c9a96e', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                Amenity Fees (Mandatory)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Monthly Exterior Amenity Fee</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f4efe6' }}>${amenityFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Optional Selected Add-ons */}
            {(pets > 0 || addOns.some((a) => a.selected)) && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#dfc285', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  Selected Add-ons & Pet Fees
                </div>
                {pets > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Pet Rent ({pets} pet{pets > 1 ? 's' : ''})</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f4efe6' }}>${petRent.toFixed(2)}</span>
                  </div>
                )}
                {addOns
                  .filter((a) => a.selected)
                  .map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>{item.name}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#dfc285' }}>+${item.price.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 4: Situational Fees */}
      <div style={{ backgroundColor: 'rgba(16, 20, 34, 0.85)', borderRadius: '12px', border: '1px solid rgba(201, 169, 110, 0.2)', marginBottom: '1.75rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('situational')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(12, 16, 28, 0.95)',
            border: 'none',
            borderBottom: openAccordions.situational ? '1px solid rgba(201, 169, 110, 0.15)' : 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Incidental / Situational Fees
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>As Incurred</span>
            {openAccordions.situational ? <ChevronUp size={18} style={{ color: '#c9a96e' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
          </div>
        </button>

        {openAccordions.situational && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(8, 10, 18, 0.75)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>Rent / Ancillary Billing Fee</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Monthly billing administration charge</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>$5.00 / mo</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>Late Payment Fee</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Assessed if rent is received after grace period</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>$50.00</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>NSF / Returned Payment Fee</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Per returned electronic payment or check</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#dfc285' }}>$35.00</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Section */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenEmailModal}
          className="btn-outline-gold"
          style={{ flex: '1 1 200px', padding: '1rem', fontSize: '0.9rem' }}
        >
          Email My Breakdown
        </button>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-paddle-checkout', {
              detail: {
                item: 'holding_deposit',
                amount: 250.00,
                unit: unitNumber || '',
              }
            }));
          }}
          className="btn-gold"
          style={{
            flex: '1 1 240px',
            padding: '1rem',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span>Reserve Unit & Pay Deposit ($250)</span>
        </button>
      </div>
    </div>
  );
}
