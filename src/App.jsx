import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import Header from './components/Header';
import CostEstimateHeader from './components/CostEstimateHeader';
import UnitControls from './components/UnitControls';
import CostBreakdown from './components/CostBreakdown';
import FloorPlansGallery, { ALL_FLOOR_PLANS } from './components/FloorPlansGallery';
import EmailModal from './components/EmailModal';
import Footer from './components/Footer';
import Widgets from './components/Widgets';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';

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

export default function App() {
  // Current active view: 'gallery' | 'estimator' | 'dashboard' | 'admin'
  const [currentView, setCurrentView] = useState('gallery');

  // Selected floor plan & unit for calculator
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

  // Transition from Floor Plans Gallery to Cost Estimator
  const handleSelectCalculate = (plan, unitNum = null) => {
    setSelectedFloorPlan(plan);
    setSelectedUnit(unitNum || plan.availableUnits[0].unit);
    setCurrentView('estimator');
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  // When floor plan changes inside calculator
  const handleFloorPlanChange = (fp) => {
    setSelectedFloorPlan(fp);
    setSelectedUnit(fp.availableUnits[0].unit);
  };

  // Base rent calculation
  const baseRent = selectedFloorPlan.prices[leaseTerm] || selectedFloorPlan.startingPrice;

  // Mandatory fees: Valet trash ($25) + Pest ($13) + Trash ($5) + Amenity ($15) = $58
  const mandatoryMonthlyFees = 58.0;
  const petRent = pets * 20.0;
  const addOnsTotal = addOns
    .filter((a) => a.selected)
    .reduce((sum, item) => sum + item.price, 0);

  const totalMonthlyPrice = baseRent + mandatoryMonthlyFees + petRent + addOnsTotal;

  return (
    <>
      {/* ── User Dashboard (full-page) ── */}
      {currentView === 'dashboard' && (
        <UserDashboard onBack={() => setCurrentView('gallery')} />
      )}

      {/* ── Admin Panel (full-page) ── */}
      {currentView === 'admin' && (
        <AdminPanel onBack={() => setCurrentView('gallery')} />
      )}

      {/* ── Main website ── */}
      {currentView !== 'dashboard' && currentView !== 'admin' && (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Top Header & Hero */}
      <Header
        onNavigateFloorPlans={() => setCurrentView('gallery')}
        onNavigateDashboard={() => setCurrentView('dashboard')}
        onNavigateAdmin={() => setCurrentView('admin')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {/* Introductory Paragraph */}
          <div style={{ marginBottom: '1.75rem', color: '#334155', fontSize: '0.975rem', lineHeight: 1.6 }}>
            Check out our 1-, 2-, 3-, and 4-bedroom apartments for rent in Forth Worth, TX and see which of our various layouts fits your lifestyle! We ensure that our stunning homes at Monarch Pass can accommodate your every need. Call today to schedule a tour!
          </div>

          {/* Lease Cost Calculator Blue Info Box */}
          <div
            style={{
              backgroundColor: '#e0f7fa',
              border: '1px solid #b2ebf2',
              borderRadius: '4px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              color: '#006064',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <Calculator size={22} style={{ color: '#00838f', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Lease Cost Calculator:</strong> This calculator is designed to help estimate the Move-In Cost (including General and Special Fees) and the ongoing Monthly Cost of a lease. Please remember that the Move-In Cost and Monthly Cost will vary depending on the qualifications of the applicant, the price and amenities of the unit being rented, and the cost of any Special Fees that may apply to a specific unit. Additionally, the rent and the Standard and Special Fees and Fee ranges are accurate as currently displayed but may change until a lease is signed.
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW 1: FLOOR PLANS CATALOG GALLERY (Matching User Screenshot) */}
          {/* ========================================================================= */}
          {currentView === 'gallery' && (
            <div className="animate-fade-in">
              <FloorPlansGallery
                onSelectCalculate={handleSelectCalculate}
                onOpenGuidedTour={() => {
                  // Handled by widgets or open tour
                  const event = new CustomEvent('open-tour');
                  window.dispatchEvent(event);
                }}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: 2-COLUMN COST ESTIMATOR CALCULATOR */}
          {/* ========================================================================= */}
          {currentView === 'estimator' && (
            <div className="animate-fade-in">
              <CostEstimateHeader
                totalMonthlyPrice={totalMonthlyPrice}
                baseRent={baseRent}
                leaseTerm={leaseTerm}
                onOpenEmailModal={() => setIsEmailModalOpen(true)}
                onBack={() => setCurrentView('gallery')}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(300px, 380px) 1fr',
                  gap: '2rem',
                  alignItems: 'start',
                }}
              >
                {/* Left Column: Interactive Controls */}
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

                {/* Right Column: Pricing Breakdown & Details */}
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
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Email My Costs Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        floorPlan={selectedFloorPlan}
        unitNumber={selectedUnit}
        totalMonthlyPrice={totalMonthlyPrice}
        baseRent={baseRent}
        leaseTerm={leaseTerm}
      />

      {/* Knock Doorway & Accessibility Floating Widgets */}
      <Widgets />
    </div>
      )}
    </>
  );
}
