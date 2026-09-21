import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import FloorPlansGallery, { ALL_FLOOR_PLANS } from './FloorPlansGallery';
import CostEstimateHeader from './CostEstimateHeader';
import UnitControls from './UnitControls';
import CostBreakdown from './CostBreakdown';
import EmailModal from './EmailModal';

const INITIAL_ADDONS = [
  {
    id: 'carport',
    name: 'Reserved Covered Carport',
    description: 'Guaranteed reserved covered parking space',
    price: 35.0,
    selected: false,
  },
  {
    id: 'storage',
    name: 'Extra Storage Locker',
    description: 'Private lockable storage space on-site',
    price: 45.0,
    selected: false,
  },
  {
    id: 'washer-dryer',
    name: 'In-Unit Washer & Dryer Rental',
    description: 'Full-size high efficiency appliance pair',
    price: 40.0,
    selected: false,
  },
];

export default function FloorPlansView() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'estimator' ? 'estimator' : 'gallery';
    }
    return 'gallery';
  });
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(ALL_FLOOR_PLANS[0]);
  const [selectedUnit, setSelectedUnit] = useState(ALL_FLOOR_PLANS[0].availableUnits[0].unit);
  const [moveInDate, setMoveInDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [leaseTerm, setLeaseTerm] = useState(12);
  const [occupants, setOccupants] = useState(1);
  const [pets, setPets] = useState(0);
  const [addOns, setAddOns] = useState(INITIAL_ADDONS);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleSelectCalculate = (plan, unitNum = null) => {
    setSelectedFloorPlan(plan);
    setSelectedUnit(unitNum || plan.availableUnits[0].unit);
    setActiveTab('estimator');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 260, behavior: 'smooth' });
    }
  };

  const handleFloorPlanChange = (fp) => {
    setSelectedFloorPlan(fp);
    setSelectedUnit(fp.availableUnits[0].unit);
  };

  const handleOpenGuidedTour = (plan) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-schedule-tour', {
          detail: {
            bed: plan?.name || plan?.title || '',
            unit: plan?.availableUnits?.[0]?.unit || '',
          },
        })
      );
    }
  };

  const baseRent = selectedFloorPlan.prices[leaseTerm] || selectedFloorPlan.startingPrice;
  const mandatoryMonthlyFees = 58.0;
  const petRent = pets * 20.0;
  const addOnsTotal = addOns
    .filter((a) => a.selected)
    .reduce((sum, item) => sum + item.price, 0);
  const totalMonthlyPrice = baseRent + mandatoryMonthlyFees + petRent + addOnsTotal;

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {activeTab === 'gallery' ? (
          <div>
            {/* Introductory Paragraph */}
            <div style={{ marginBottom: '1.75rem', color: '#b5a999', fontSize: '0.975rem', lineHeight: 1.7 }}>
              Discover our 1, 2, 3, and 4-bedroom luxury residences for rent in Fort Worth, TX. Each layout is designed with open-concept living, wood-style flooring, and high-efficiency features. Explore available units or calculate your exact monthly estimate below.
            </div>

            {/* Lease Cost Calculator Gold Info Box */}
            <div
              style={{
                backgroundColor: 'rgba(201, 169, 110, 0.08)',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                color: '#dfc285',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <Calculator size={22} style={{ color: '#c9a96e', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#f4efe6' }}>Lease Cost Calculator:</strong> This calculator estimates Move-In Costs and ongoing Monthly Costs for any floor plan and lease term. Move-In Costs may vary based on applicant qualification, unit selection, and any optional add-ons (parking, washer/dryer, storage).
              </div>
            </div>

            <FloorPlansGallery
              onSelectCalculate={handleSelectCalculate}
              onOpenGuidedTour={handleOpenGuidedTour}
            />
          </div>
        ) : (
          <div>
            <CostEstimateHeader
              totalMonthlyPrice={totalMonthlyPrice}
              baseRent={baseRent}
              leaseTerm={leaseTerm}
              onOpenEmailModal={() => setIsEmailModalOpen(true)}
              onBack={() => setActiveTab('gallery')}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 380px) 1fr',
                gap: '2rem',
                alignItems: 'start',
              }}
            >
              <UnitControls
                floorPlans={ALL_FLOOR_PLANS}
                selectedFloorPlan={selectedFloorPlan}
                setSelectedFloorPlan={handleFloorPlanChange}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                moveInDate={moveInDate}
                setMoveInDate={setMoveInDate}
                leaseTerm={leaseTerm}
                setLeaseTerm={setLeaseTerm}
                occupants={occupants}
                setOccupants={setOccupants}
                pets={pets}
                setPets={setPets}
                addOns={addOns}
                setAddOns={setAddOns}
              />

              <CostBreakdown
                floorPlan={selectedFloorPlan}
                unitNumber={selectedUnit}
                baseRent={baseRent}
                leaseTerm={leaseTerm}
                occupants={occupants}
                pets={pets}
                addOns={addOns}
                onOpenEmailModal={() => setIsEmailModalOpen(true)}
              />
            </div>
          </div>
        )}

        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          floorPlan={selectedFloorPlan}
          unitNumber={selectedUnit}
          totalMonthlyPrice={totalMonthlyPrice}
          baseRent={baseRent}
          leaseTerm={leaseTerm}
        />
      </div>
    </div>
  );
}
