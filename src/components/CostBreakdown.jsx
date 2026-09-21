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
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              Unit {unitNumber}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>
              {floorPlan.beds} Bed / {floorPlan.baths} Bath • {floorPlan.sqft} sq.ft.
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', color: '#64748b', textTransform: 'uppercase' }}>
              TOTAL MONTHLY LEASING PRICE
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.15, marginTop: '4px' }}>
              ${totalMonthlyLeasingPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
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
          backgroundColor: '#e6f7f4',
          border: '1px solid #c2ece5',
          borderRadius: '6px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
        }}
      >
        <Info size={18} style={{ color: '#0d9488', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '0.8rem', color: '#134e48', margin: 0, lineHeight: 1.5 }}>
          Total monthly leasing prices include base rent, all mandatory monthly fees and any
          user-selected optional fees. Excludes variable or usage-based fees and required charges due
          at or prior to move-in or at move-out.
        </p>
      </div>

      {/* Accordion 1: Application Cost */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('application')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderBottom: openAccordions.application ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
              Application Cost
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              ${totalApplicationCost.toFixed(2)}
            </span>
            {openAccordions.application ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {openAccordions.application && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#fafbfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Administrative Fee</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>One-time administrative processing fee (non-refundable)</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>${adminFee.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Application Fee</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>${(55).toFixed(2)} per applicant × {occupants} occupant(s)</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>${appFee.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Move-in Cost */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('moveIn')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderBottom: openAccordions.moveIn ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
              Move-in Cost
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              ${totalMoveInCost.toFixed(2)}
            </span>
            {openAccordions.moveIn ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {openAccordions.moveIn && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#fafbfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Security Deposit</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Refundable security deposit with approved credit</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>${securityDeposit.toFixed(2)}</div>
            </div>

            {pets > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Pet Deposit</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>$300.00 refundable pet deposit × {pets} pet(s)</div>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>${petDeposit.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: Monthly Cost */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('monthly')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderBottom: openAccordions.monthly ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
              Monthly Cost
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              ${totalMonthlyLeasingPrice.toFixed(2)}
            </span>
            {openAccordions.monthly ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {openAccordions.monthly && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#fafbfc' }}>
            {/* Base Rent */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Base Rent</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Based on {leaseTerm}-month lease agreement</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>${baseRent.toFixed(2)}</div>
            </div>

            {/* Utility Fees */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>
                Utility Fees (Mandatory)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#334155' }}>Valet Trash Service</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>${valetTrash.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#334155' }}>Pest Control Fee</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>${pestControl.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#334155' }}>Community Trash Service</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>${trashFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Water / Sewer / Stormwater</span>
                <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#64748b' }}>Usage Based</span>
              </div>
            </div>

            {/* Amenity Fees */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>
                Amenity Fees (Mandatory)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#334155' }}>Monthly Exterior Amenity Fee</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>${amenityFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Optional Selected Add-ons */}
            {(pets > 0 || addOns.some((a) => a.selected)) && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#0d9488', marginBottom: '0.5rem' }}>
                  Selected Add-ons & Pet Fees
                </div>
                {pets > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#334155' }}>Pet Rent ({pets} pet{pets > 1 ? 's' : ''})</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>${petRent.toFixed(2)}</span>
                  </div>
                )}
                {addOns
                  .filter((a) => a.selected)
                  .map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#334155' }}>{item.name}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>+${item.price.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 4: Situational Fees */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <button
          onClick={() => toggleAccordion('situational')}
          style={{
            width: '100%',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderBottom: openAccordions.situational ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
              Situational Fees
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>As Incurred</span>
            {openAccordions.situational ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {openAccordions.situational && (
          <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#fafbfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Rent / Ancillary Billing Fee</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly billing administration charge</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>$5.00 / mo</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Late Payment Fee</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assessed if rent is received after grace period</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>$50.00</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>NSF / Returned Payment Fee</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Per returned electronic payment or check</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>$35.00</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Section */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenEmailModal}
          className="btn-secondary"
          style={{ flex: '1 1 200px', padding: '1rem', fontSize: '0.9rem' }}
        >
          Email My Costs
        </button>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-paddle-checkout', {
              detail: {
                item: 'holding_deposit',
                amount: 250.00,
                unit: selectedUnit?.unit || '',
              }
            }));
          }}
          className="btn-primary"
          style={{ flex: '1 1 200px', padding: '1rem', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <span>Reserve Unit & Pay Deposit ($250)</span>
        </button>
      </div>
    </div>
  );
}
