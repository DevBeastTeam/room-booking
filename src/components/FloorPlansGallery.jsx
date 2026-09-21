import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  ChevronDown,
  ChevronRight,
  Maximize2,
  X,
  CheckCircle,
  Home,
  SlidersHorizontal,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ALL_FLOOR_PLANS = [
  {
    id: 'one-bedroom',
    name: 'One Bedroom Residence',
    beds: 1,
    baths: 1,
    sqft: 614,
    availableCount: 12,
    startingPrice: 888.0,
    maxPrice: 1546.0,
    deposit: 250.0,
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_260/s3/2/58193/1691506136-aventine.png',
    highResImage: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1140/s3/2/58193/1691506136-aventine.png',
    prices: {
      12: 888.0,
      10: 940.0,
      6: 1010.0,
    },
    availableUnits: [
      { unit: '1005', sqft: 614, price: 888.0, availableDate: 'Available Now' },
      { unit: '1012', sqft: 614, price: 898.0, availableDate: 'Available Now' },
      { unit: '2004', sqft: 614, price: 908.0, availableDate: 'Available Immediately' },
      { unit: '3015', sqft: 614, price: 888.0, availableDate: 'Available Oct 15' },
    ],
  },
  {
    id: 'two-bedroom',
    name: 'Two Bedroom Residence',
    beds: 2,
    baths: 1,
    sqft: 786,
    availableCount: 20,
    startingPrice: 860.0,
    maxPrice: 1300.0,
    deposit: 250.0,
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_260/s3/2/58193/1691506115-cortesia.png',
    highResImage: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1140/s3/2/58193/1691506115-cortesia.png',
    prices: {
      12: 860.0,
      10: 915.0,
      6: 995.0,
    },
    availableUnits: [
      { unit: '2104', sqft: 786, price: 860.0, availableDate: 'Available Now' },
      { unit: '2108', sqft: 786, price: 880.0, availableDate: 'Available Now' },
      { unit: '2115', sqft: 786, price: 860.0, availableDate: 'Available Immediately' },
      { unit: '3102', sqft: 786, price: 895.0, availableDate: 'Available Immediately' },
    ],
  },
  {
    id: 'three-bedroom',
    name: 'Three Bedroom Residence',
    beds: 3,
    baths: 2,
    sqft: 920,
    availableCount: 20,
    startingPrice: 1013.0,
    maxPrice: 1837.0,
    deposit: 250.0,
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_260/s3/2/58193/1691506123-ridgecrest.png',
    highResImage: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1140/s3/2/58193/1691506123-ridgecrest.png',
    prices: {
      12: 1013.0,
      10: 1080.0,
      6: 1170.0,
    },
    availableUnits: [
      { unit: '1002', sqft: 920, price: 1013.0, availableDate: 'Available Now' },
      { unit: '1006', sqft: 920, price: 1035.0, availableDate: 'Available Now' },
      { unit: '2008', sqft: 920, price: 1013.0, availableDate: 'Available Immediately' },
    ],
  },
  {
    id: 'four-bedroom',
    name: 'Four Bedroom Residence',
    beds: 4,
    baths: 2,
    sqft: 1077,
    availableCount: 15,
    startingPrice: 1179.0,
    maxPrice: 2259.0,
    deposit: 250.0,
    image: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_260/s3/2/58193/1691506129-seabrook.png',
    highResImage: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1140/s3/2/58193/1691506129-seabrook.png',
    prices: {
      12: 1179.0,
      10: 1260.0,
      6: 1360.0,
    },
    availableUnits: [
      { unit: '4101', sqft: 1077, price: 1179.0, availableDate: 'Available Now' },
      { unit: '4105', sqft: 1077, price: 1210.0, availableDate: 'Available Now' },
    ],
  },
];

export default function FloorPlansGallery({ onSelectCalculate, onOpenGuidedTour }) {
  // Filter States
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [selectedBathrooms, setSelectedBathrooms] = useState('all');
  const [selectedUnitSize, setSelectedUnitSize] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [moveInFilterDate, setMoveInFilterDate] = useState('');
  const [apartmentNumberQuery, setApartmentNumberQuery] = useState('');

  // Modals & Expand States
  const [activeLayoutModal, setActiveLayoutModal] = useState(null); // floorPlan object for zoom
  const [expandedAvailability, setExpandedAvailability] = useState(null); // floorPlan ID

  const handleClearFilters = () => {
    setSelectedBedrooms('all');
    setSelectedBathrooms('all');
    setSelectedUnitSize('all');
    setSelectedPriceRange('all');
    setMoveInFilterDate('');
    setApartmentNumberQuery('');
  };

  const hasActiveFilters =
    selectedBedrooms !== 'all' ||
    selectedBathrooms !== 'all' ||
    selectedUnitSize !== 'all' ||
    selectedPriceRange !== 'all' ||
    moveInFilterDate !== '' ||
    apartmentNumberQuery.trim() !== '';

  // Filter Logic
  const filteredPlans = useMemo(() => {
    return ALL_FLOOR_PLANS.filter((plan) => {
      if (selectedBedrooms !== 'all' && plan.beds !== Number(selectedBedrooms)) {
        return false;
      }
      if (selectedBathrooms !== 'all' && plan.baths !== Number(selectedBathrooms)) {
        return false;
      }
      if (selectedUnitSize === 'small' && plan.sqft >= 800) {
        return false;
      }
      if (selectedUnitSize === 'large' && plan.sqft < 800) {
        return false;
      }
      if (selectedPriceRange === 'under1000' && plan.startingPrice >= 1000) {
        return false;
      }
      if (selectedPriceRange === 'over1000' && plan.startingPrice < 1000) {
        return false;
      }
      if (apartmentNumberQuery.trim()) {
        const query = apartmentNumberQuery.trim().toLowerCase();
        const matchesUnit = plan.availableUnits.some((u) => u.unit.toLowerCase().includes(query));
        if (!matchesUnit) return false;
      }
      return true;
    });
  }, [selectedBedrooms, selectedBathrooms, selectedUnitSize, selectedPriceRange, apartmentNumberQuery]);

  return (
    <div style={{ paddingBottom: '3.5rem' }}>
      {/* ========================================================================= */}
      {/* 1. FILTER TOOLBAR */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Filter 1: Bedrooms */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedBedrooms}
            onChange={(e) => setSelectedBedrooms(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              backgroundColor: 'rgba(8, 10, 18, 0.75)',
              fontSize: '0.85rem',
              color: '#f4efe6',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all" style={{ backgroundColor: '#0c101c' }}>Bedrooms (All)</option>
            <option value="1" style={{ backgroundColor: '#0c101c' }}>1 Bedroom</option>
            <option value="2" style={{ backgroundColor: '#0c101c' }}>2 Bedrooms</option>
            <option value="3" style={{ backgroundColor: '#0c101c' }}>3 Bedrooms</option>
            <option value="4" style={{ backgroundColor: '#0c101c' }}>4 Bedrooms</option>
          </select>
        </div>

        {/* Filter 2: Bathrooms */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedBathrooms}
            onChange={(e) => setSelectedBathrooms(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              backgroundColor: 'rgba(8, 10, 18, 0.75)',
              fontSize: '0.85rem',
              color: '#f4efe6',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all" style={{ backgroundColor: '#0c101c' }}>Bathrooms (All)</option>
            <option value="1" style={{ backgroundColor: '#0c101c' }}>1 Bathroom</option>
            <option value="2" style={{ backgroundColor: '#0c101c' }}>2 Bathrooms</option>
          </select>
        </div>

        {/* Filter 3: Unit Size */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedUnitSize}
            onChange={(e) => setSelectedUnitSize(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              backgroundColor: 'rgba(8, 10, 18, 0.75)',
              fontSize: '0.85rem',
              color: '#f4efe6',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all" style={{ backgroundColor: '#0c101c' }}>Unit Size (All)</option>
            <option value="small" style={{ backgroundColor: '#0c101c' }}>&lt; 800 sq.ft.</option>
            <option value="large" style={{ backgroundColor: '#0c101c' }}>&gt; 800 sq.ft.</option>
          </select>
        </div>

        {/* Filter 4: Price Range */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              backgroundColor: 'rgba(8, 10, 18, 0.75)',
              fontSize: '0.85rem',
              color: '#f4efe6',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all" style={{ backgroundColor: '#0c101c' }}>Price Range (All)</option>
            <option value="under1000" style={{ backgroundColor: '#0c101c' }}>Under $1,000 / mo</option>
            <option value="over1000" style={{ backgroundColor: '#0c101c' }}>$1,000+ / mo</option>
          </select>
        </div>

        {/* Filter 5: Move-in Date */}
        <div style={{ position: 'relative', flex: '1 1 160px', display: 'flex', alignItems: 'center' }}>
          <input
            type="date"
            placeholder="Move-in Date"
            value={moveInFilterDate}
            onChange={(e) => setMoveInFilterDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              backgroundColor: 'rgba(8, 10, 18, 0.75)',
              fontSize: '0.85rem',
              color: '#f4efe6',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter 6: Apartment Number Search */}
        <div style={{ position: 'relative', flex: '1 1 170px' }}>
          <input
            type="text"
            placeholder="Apartment # Search"
            value={apartmentNumberQuery}
            onChange={(e) => setApartmentNumberQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              backgroundColor: 'rgba(8, 10, 18, 0.75)',
              fontSize: '0.85rem',
              color: '#f4efe6',
              outline: 'none',
            }}
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            style={{
              padding: '0.6rem 1rem',
              backgroundColor: 'rgba(201, 169, 110, 0.15)',
              border: '1px solid rgba(201, 169, 110, 0.35)',
              borderRadius: '8px',
              color: '#dfc285',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOOR PLANS 3-COLUMN GRID */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              backdropFilter: 'blur(16px)',
              position: 'relative',
            }}
          >
            {/* Header / Title */}
            <div style={{ padding: '1.75rem 1.5rem 1rem', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#dfc285',
                  backgroundColor: 'rgba(201, 169, 110, 0.12)',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  marginBottom: '0.75rem',
                }}
              >
                {plan.availableCount} Available Residences
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8', display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.35rem' }}>
                <span>🛏️ {plan.beds} Bed</span>
                <span>•</span>
                <span>🚿 {plan.baths} Bath</span>
                <span>•</span>
                <span>📐 {plan.sqft} Sq. Ft.</span>
              </div>
            </div>

            {/* 3D Model Image with Click to Zoom */}
            <div
              onClick={() => setActiveLayoutModal(plan)}
              style={{
                position: 'relative',
                padding: '0.75rem 1.5rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '230px',
                background: 'radial-gradient(circle, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
              }}
            >
              <img
                src={plan.image}
                alt={`${plan.name} layout`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '210px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '20px',
                  backgroundColor: 'rgba(12, 16, 28, 0.85)',
                  border: '1px solid rgba(201, 169, 110, 0.35)',
                  padding: '6px',
                  borderRadius: '8px',
                  color: '#dfc285',
                  backdropFilter: 'blur(8px)',
                }}
                title="Click to zoom layout"
              >
                <Maximize2 size={16} />
              </div>
            </div>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: 'rgba(8, 10, 18, 0.65)',
                borderTop: '1px solid rgba(201, 169, 110, 0.18)',
                borderBottom: '1px solid rgba(201, 169, 110, 0.18)',
                padding: '1.1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Starting at <strong style={{ fontSize: '1.35rem', color: '#dfc285', fontWeight: 800 }}>${plan.startingPrice.toFixed(2)}</strong> <span style={{ fontSize: '0.8rem' }}>/ month</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                Holding Deposit: ${plan.deposit.toFixed(0)} · Fort Worth AMI Program
              </div>
            </div>

            {/* Calculate My Costs Link Button */}
            <div style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => onSelectCalculate(plan)}
                style={{
                  color: '#dfc285',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(201, 169, 110, 0.4)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  paddingBottom: '3px',
                  cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                <span>ESTIMATE CUSTOM LEASE</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Action Buttons: AVAILABILITY & GUIDED TOUR */}
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => setExpandedAvailability(expandedAvailability === plan.id ? null : plan.id)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  color: '#f4efe6',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>VIEW APARTMENT AVAILABILITY</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedAvailability === plan.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: '#c9a96e',
                  }}
                />
              </button>

              <button
                onClick={() => onOpenGuidedTour(plan)}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                }}
              >
                SCHEDULE PRIVATE VIEWING
              </button>
            </div>

            {/* Expanded Available Units Section */}
            {expandedAvailability === plan.id && (
              <div
                className="animate-slide-down"
                style={{
                  backgroundColor: 'rgba(8, 10, 18, 0.95)',
                  borderTop: '1px solid rgba(201, 169, 110, 0.25)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Available Apartment Homes ({plan.availableUnits.length})
                </div>

                {plan.availableUnits.map((u) => (
                  <div
                    key={u.unit}
                    style={{
                      backgroundColor: 'rgba(16, 20, 34, 0.95)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      border: '1px solid rgba(201, 169, 110, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>
                        Apartment #{u.unit}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {u.availableDate} · {u.sqft} sq.ft.
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dfc285', marginTop: '2px' }}>
                        ${u.price.toFixed(2)} / mo
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => onSelectCalculate(plan, u.unit)}
                        style={{
                          backgroundColor: 'rgba(201, 169, 110, 0.12)',
                          color: '#dfc285',
                          border: '1px solid rgba(201, 169, 110, 0.35)',
                          borderRadius: '6px',
                          padding: '0.45rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Estimate
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('open-paddle-checkout', {
                            detail: {
                              item: 'holding_deposit',
                              unit: u.unit,
                              amount: 250.00
                            }
                          }));
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #c9a96e, #a88448)',
                          color: '#08090f',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(201, 169, 110, 0.3)',
                        }}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Legal Disclaimer */}
      <div
        style={{
          marginTop: '3.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(201, 169, 110, 0.2)',
          fontSize: '0.85rem',
          color: '#94a3b8',
          lineHeight: 1.7,
          textAlign: 'center',
          maxWidth: '840px',
          margin: '3.5rem auto 0',
        }}
      >
        <p style={{ margin: 0 }}>
          All dimensions and square footage are approximate. Actual amenities and architectural features may vary in dimension or detail. Not all features are available in every residence. Pricing and availability are subject to change without notice in accordance with Fort Worth housing guidelines.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLOOR PLAN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {activeLayoutModal && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 14, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setActiveLayoutModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0c101c',
              border: '1px solid rgba(201, 169, 110, 0.35)',
              borderRadius: '16px',
              maxWidth: '850px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              position: 'relative',
              padding: '2rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#f8fafc', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  {activeLayoutModal.name} Blueprint
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '0.85rem' }}>
                  <span>{activeLayoutModal.beds} Bed</span>
                  <span>•</span>
                  <span>{activeLayoutModal.baths} Bath</span>
                  <span>•</span>
                  <span>{activeLayoutModal.sqft} Sq. Ft.</span>
                  <span>•</span>
                  <span style={{ color: '#dfc285', fontWeight: 700 }}>{activeLayoutModal.availableCount} Available</span>
                </div>
              </div>
              <button
                onClick={() => setActiveLayoutModal(null)}
                style={{
                  color: '#c9a96e',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Price & Status Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(16, 20, 34, 0.85)',
                padding: '0.9rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(201, 169, 110, 0.25)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Starting at: </span>
                <strong style={{ fontSize: '1.25rem', color: '#dfc285' }}>
                  ${activeLayoutModal.startingPrice.toFixed(2)} - ${activeLayoutModal.maxPrice?.toFixed(2) || (activeLayoutModal.startingPrice * 1.5).toFixed(2)}
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}> / month</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(201, 169, 110, 0.15)',
                    color: '#dfc285',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                  }}
                >
                  Immediate Move-in Available
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Deposit: ${activeLayoutModal.deposit.toFixed(0)}</span>
              </div>
            </div>

            {/* Blueprint Graphic */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.5rem',
                backgroundColor: 'rgba(8, 10, 18, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 169, 110, 0.2)',
                marginBottom: '1.75rem',
                minHeight: '280px',
              }}
            >
              <img
                src={activeLayoutModal.highResImage || activeLayoutModal.image}
                alt={`${activeLayoutModal.name} floor plan layout`}
                style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))' }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
              <button
                onClick={() => {
                  const plan = activeLayoutModal;
                  setActiveLayoutModal(null);
                  if (onOpenGuidedTour) onOpenGuidedTour(plan);
                }}
                className="btn-outline-gold"
                style={{
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.85rem',
                }}
              >
                Guided Tour
              </button>

              <button
                onClick={() => {
                  const plan = activeLayoutModal;
                  setActiveLayoutModal(null);
                  onSelectCalculate(plan);
                }}
                className="btn-gold"
                style={{
                  padding: '0.7rem 1.5rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>Calculate Costs</span>
                <ChevronRight size={16} />
              </button>

              <a
                href="https://monarchpassapts.securecafe.com/onlineleasing/ladera-palms-0/oleapplication.aspx"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.7rem 1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#f4efe6',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Apply Online
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
