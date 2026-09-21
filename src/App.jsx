import React, { useState, useEffect } from 'react';
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
import ContactSupportModal from './components/ContactSupportModal';
import LegalModal from './components/LegalModal';
import PhotoGallery from './components/PhotoGallery';
import IncomeGuidelines from './components/IncomeGuidelines';
import ScheduleTourModal from './components/ScheduleTourModal';
import HomeView from './components/HomeView';
import AmenitiesView from './components/AmenitiesView';
import VirtualTourView from './components/VirtualTourView';
import MapDirectionsView from './components/MapDirectionsView';
import ContactUsView from './components/ContactUsView';
import FAQView from './components/FAQView';
import SummerSavingsModal from './components/SummerSavingsModal';
import {
  getSiteSettings,
  getLegalPages,
  getSupportInquiries,
} from './services/siteDataService';

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
  // Current active view: 'home' | 'floorplans' | 'estimator' | 'photos' | 'guidelines' | 'amenities' | 'virtualtour' | 'map' | 'faq' | 'contact' | 'dashboard' | 'admin'
  const [currentView, setCurrentView] = useState('home');

  // Global settings, pages, and support inquiries
  const [siteSettings, setSiteSettings] = useState(() => getSiteSettings());
  const [legalPages, setLegalPages] = useState(() => getLegalPages());
  const [supportInquiries, setSupportInquiries] = useState(() => getSupportInquiries());

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulePreset, setSchedulePreset] = useState({ bed: '', unit: '' });
  const [legalModalType, setLegalModalType] = useState(null); // 'terms' | 'privacy' | null

  const handleOpenScheduleTour = (bed = '', unit = '') => {
    setSchedulePreset({
      bed: typeof bed === 'string' ? bed : '',
      unit: typeof unit === 'string' ? unit : '',
    });
    setIsScheduleModalOpen(true);
  };

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

  // Sync settings and theme when modified from anywhere
  useEffect(() => {
    const onSettingsUpdate = (e) => setSiteSettings(e.detail);
    const onLegalUpdate = (e) => setLegalPages(e.detail);
    const onSupportUpdate = (e) => setSupportInquiries(e.detail);
    const onThemeUpdate = () => {
      // Force trigger state update so all React trees re-render
      setSiteSettings(prev => ({ ...prev }));
    };

    window.addEventListener('site-settings-updated', onSettingsUpdate);
    window.addEventListener('legal-pages-updated', onLegalUpdate);
    window.addEventListener('support-inquiries-updated', onSupportUpdate);
    window.addEventListener('theme-updated', onThemeUpdate);

    return () => {
      window.removeEventListener('site-settings-updated', onSettingsUpdate);
      window.removeEventListener('legal-pages-updated', onLegalUpdate);
      window.removeEventListener('support-inquiries-updated', onSupportUpdate);
      window.removeEventListener('theme-updated', onThemeUpdate);
    };
  }, []);

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

  // Navigation helpers
  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFloorPlans = () => {
    setCurrentView('floorplans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePhotos = () => {
    setCurrentView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateGuidelines = () => {
    setCurrentView('guidelines');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAmenities = () => {
    setCurrentView('amenities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateVirtualTour = () => {
    setCurrentView('virtualtour');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateMap = () => {
    setCurrentView('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFAQ = () => {
    setCurrentView('faq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateContact = () => {
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <UserDashboard onBack={() => setCurrentView('home')} />
      )}

      {/* ── Admin Panel (full-page) ── */}
      {currentView === 'admin' && (
        <AdminPanel
          onBack={() => setCurrentView('home')}
          siteSettings={siteSettings}
          onUpdateSiteSettings={setSiteSettings}
          legalPages={legalPages}
          onUpdateLegalPages={setLegalPages}
          supportInquiries={supportInquiries}
          onUpdateSupportInquiries={setSupportInquiries}
        />
      )}

      {/* ── Main website ── */}
      {currentView !== 'dashboard' && currentView !== 'admin' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          {/* Top Header & Navigation Tabs */}
          <Header
            currentView={currentView}
            onNavigateHome={handleNavigateHome}
            onNavigateFloorPlans={handleNavigateFloorPlans}
            onNavigatePhotos={handleNavigatePhotos}
            onNavigateGuidelines={handleNavigateGuidelines}
            onNavigateAmenities={handleNavigateAmenities}
            onNavigateVirtualTour={handleNavigateVirtualTour}
            onNavigateMap={handleNavigateMap}
            onNavigateFAQ={handleNavigateFAQ}
            onNavigateContact={handleNavigateContact}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            onNavigateAdmin={() => setCurrentView('admin')}
            siteSettings={siteSettings}
            onOpenContactSupport={() => setIsContactModalOpen(true)}
            onOpenScheduleTour={handleOpenScheduleTour}
          />

          {/* Main Content Area */}
          <main style={{ flex: 1 }}>
            {/* ========================================================================= */}
            {/* VIEW 1: HOMEPAGE (HERO SLIDER, WELCOME, TEASERS & INLINE CONTACT) */}
            {/* ========================================================================= */}
            {currentView === 'home' && (
              <div className="animate-fade-in">
                <HomeView
                  onNavigateFloorPlans={handleNavigateFloorPlans}
                  onNavigatePhotos={handleNavigatePhotos}
                  onNavigateGuidelines={handleNavigateGuidelines}
                  onNavigateAmenities={handleNavigateAmenities}
                  onNavigateVirtualTour={handleNavigateVirtualTour}
                  onNavigateMap={handleNavigateMap}
                  onNavigateContact={handleNavigateContact}
                  onOpenScheduleTour={handleOpenScheduleTour}
                  siteSettings={siteSettings}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: FLOOR PLANS CATALOG GALLERY */}
            {/* ========================================================================= */}
            {currentView === 'floorplans' && (
              <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
                <div className="container">
                  {/* Introductory Paragraph */}
                  <div style={{ marginBottom: '1.75rem', color: '#334155', fontSize: '0.975rem', lineHeight: 1.6 }}>
                    Check out our 1-, 2-, 3-, and 4-bedroom apartments for rent in Fort Worth, TX and see which of our various layouts fits your lifestyle! We ensure that our stunning homes at {siteSettings?.siteName || 'Monarch Pass'} can accommodate your every need. Call today to schedule a tour!
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

                  <FloorPlansGallery
                    onSelectCalculate={handleSelectCalculate}
                    onOpenGuidedTour={(plan) => handleOpenScheduleTour(plan?.name || plan?.title || '', plan?.availableUnits?.[0]?.unit || '')}
                  />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 3: 2-COLUMN COST ESTIMATOR CALCULATOR */}
            {/* ========================================================================= */}
            {currentView === 'estimator' && (
              <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
                <div className="container">
                  <CostEstimateHeader
                    totalMonthlyPrice={totalMonthlyPrice}
                    baseRent={baseRent}
                    leaseTerm={leaseTerm}
                    onOpenEmailModal={() => setIsEmailModalOpen(true)}
                    onBack={() => setCurrentView('floorplans')}
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
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 4: PHOTO GALLERY (MONARCH PASS TILED CAROUSEL & LIGHTBOX) */}
            {/* ========================================================================= */}
            {currentView === 'photos' && (
              <div className="animate-fade-in" style={{ padding: '1.5rem 0 3rem' }}>
                <div className="container">
                  <PhotoGallery onOpenTourModal={() => handleOpenScheduleTour()} />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 5: INCOME GUIDELINES (MONARCH PASS AMI PROGRAM) */}
            {/* ========================================================================= */}
            {currentView === 'guidelines' && (
              <div className="animate-fade-in" style={{ padding: '1.5rem 0 3rem' }}>
                <div className="container">
                  <IncomeGuidelines
                    onNavigateFloorPlans={handleNavigateFloorPlans}
                    onOpenContactSupport={() => handleOpenScheduleTour()}
                    siteSettings={siteSettings}
                  />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 6: AMENITIES (29 COMMUNITY & APARTMENT FEATURES + PET POLICY) */}
            {/* ========================================================================= */}
            {currentView === 'amenities' && (
              <div className="animate-fade-in">
                <AmenitiesView
                  onNavigateFloorPlans={handleNavigateFloorPlans}
                  onOpenScheduleTour={handleOpenScheduleTour}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 7: VIRTUAL TOUR (TOURBUILDER 360 & ZILLOW 3D PANOS) */}
            {/* ========================================================================= */}
            {currentView === 'virtualtour' && (
              <div className="animate-fade-in">
                <VirtualTourView
                  onNavigateFloorPlans={handleNavigateFloorPlans}
                  onOpenScheduleTour={handleOpenScheduleTour}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 8: MAP & DIRECTIONS (GOOGLE MAP & NEIGHBORHOOD POIS) */}
            {/* ========================================================================= */}
            {currentView === 'map' && (
              <div className="animate-fade-in">
                <MapDirectionsView
                  onOpenScheduleTour={handleOpenScheduleTour}
                  siteSettings={siteSettings}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 9: FREQUENTLY ASKED QUESTIONS */}
            {/* ========================================================================= */}
            {currentView === 'faq' && (
              <div className="animate-fade-in">
                <FAQView
                  onNavigateGuidelines={handleNavigateGuidelines}
                  onOpenScheduleTour={handleOpenScheduleTour}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 10: CONTACT US (OFFICE DETAILS & INQUIRY FORM) */}
            {/* ========================================================================= */}
            {currentView === 'contact' && (
              <div className="animate-fade-in">
                <ContactUsView
                  onOpenScheduleTour={handleOpenScheduleTour}
                  siteSettings={siteSettings}
                />
              </div>
            )}
          </main>

          {/* Footer */}
          <Footer
            siteSettings={siteSettings}
            onOpenContactSupport={() => setIsContactModalOpen(true)}
            onOpenLegal={(type) => setLegalModalType(type)}
            onNavigateHome={handleNavigateHome}
            onNavigateFloorPlans={handleNavigateFloorPlans}
            onNavigatePhotos={handleNavigatePhotos}
            onNavigateGuidelines={handleNavigateGuidelines}
            onNavigateAmenities={handleNavigateAmenities}
            onNavigateVirtualTour={handleNavigateVirtualTour}
            onNavigateMap={handleNavigateMap}
            onNavigateFAQ={handleNavigateFAQ}
            onNavigateContact={handleNavigateContact}
            onNavigateDashboard={() => setCurrentView('dashboard')}
          />

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

          {/* Contact Support Modal */}
          <ContactSupportModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            siteSettings={siteSettings}
            onInquirySubmitted={() => {
              setSupportInquiries(getSupportInquiries());
            }}
          />

          {/* Schedule with Monarch Pass Tour Modal */}
          <ScheduleTourModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            siteSettings={siteSettings}
            onTourScheduled={() => {
              setSupportInquiries(getSupportInquiries());
            }}
            initialBedrooms={schedulePreset.bed}
            initialUnit={schedulePreset.unit}
          />

          {/* Legal Pages Modal (Terms & Conditions / Privacy Policy) */}
          <LegalModal
            isOpen={Boolean(legalModalType)}
            pageType={legalModalType || 'terms'}
            onClose={() => setLegalModalType(null)}
            legalPages={legalPages}
          />

          {/* Promotional Summer Savings Nudge Modal & Mobile Nudge Strip */}
          <SummerSavingsModal onNavigateFloorPlans={handleNavigateFloorPlans} />

          {/* Knock Doorway & Accessibility Floating Widgets */}
          <Widgets onOpenScheduleTour={handleOpenScheduleTour} />
        </div>
      )}
    </>
  );
}
