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
  ArrowRight
} from 'lucide-react';

export const ALL_FLOOR_PLANS = [
  {
    id: 'one-bedroom',
    name: 'One Bedroom',
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
    name: 'Two Bedroom',
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
    name: 'Three Bedroom',
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
    name: 'Four Bedroom',
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
    <div style={{ paddingBottom: '3rem' }}>
      {/* ========================================================================= */}
      {/* 1. FILTER TOOLBAR */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          padding: '0.6rem 0.8rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Filter 1: Bedrooms */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedBedrooms}
            onChange={(e) => setSelectedBedrooms(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="all">Bedrooms (All)</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4 Bedrooms</option>
          </select>
        </div>

        {/* Filter 2: Bathrooms */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedBathrooms}
            onChange={(e) => setSelectedBathrooms(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="all">Bathrooms (All)</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
          </select>
        </div>

        {/* Filter 3: Unit Size */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedUnitSize}
            onChange={(e) => setSelectedUnitSize(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="all">Unit Size (All)</option>
            <option value="small">&lt; 800 sq.ft.</option>
            <option value="large">&gt; 800 sq.ft.</option>
          </select>
        </div>

        {/* Filter 4: Price Range */}
        <div style={{ position: 'relative', flex: '1 1 140px' }}>
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="all">Price Range (All)</option>
            <option value="under1000">Under $1,000 / mo</option>
            <option value="over1000">$1,000+ / mo</option>
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
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#334155',
            }}
          />
        </div>

        {/* Filter 6: Apartment Number Search */}
        <div style={{ position: 'relative', flex: '1 1 170px' }}>
          <input
            type="text"
            placeholder="Apartment Number"
            value={apartmentNumberQuery}
            onChange={(e) => setApartmentNumberQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#334155',
            }}
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            style={{
              padding: '0.55rem 0.9rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              color: '#475569',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          >
            <X size={14} />
            <span>Clear</span>
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
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Header / Title */}
            <div style={{ padding: '1.5rem 1.25rem 1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '0.25rem' }}>
                <span>🛏️ {plan.beds} Bed</span>
                <span>🚿 {plan.baths} Bath</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                📐 {plan.sqft} Sq. Ft.
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0d9488', marginTop: '0.5rem' }}>
                {plan.availableCount} Available
              </div>
            </div>

            {/* 3D Model Image with Click to Zoom */}
            <div
              onClick={() => setActiveLayoutModal(plan)}
              style={{
                position: 'relative',
                padding: '0.5rem 1.25rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '230px',
              }}
            >
              <img
                src={plan.image}
                alt={`${plan.name} layout`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '220px',
                  objectFit: 'contain',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '20px',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  padding: '4px',
                  borderRadius: '4px',
                  color: '#475569',
                }}
                title="Click to zoom layout"
              >
                <Maximize2 size={16} />
              </div>
            </div>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                Starting at <strong style={{ fontSize: '1.15rem', color: '#1e293b' }}>${plan.startingPrice.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                Deposit: ${plan.deposit.toFixed(0)}
              </div>
            </div>

            {/* Calculate My Costs Link Button */}
            <div style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>
              <button
                onClick={() => onSelectCalculate(plan)}
                style={{
                  color: '#1e293b',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  borderBottom: '2px solid #5ec4b6',
                  paddingBottom: '2px',
                }}
              >
                <span>CALCULATE MY COSTS</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Action Buttons: AVAILABILITY & GUIDED TOUR */}
            <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={() => setExpandedAvailability(expandedAvailability === plan.id ? null : plan.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#4a4e57',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>AVAILABILITY</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedAvailability === plan.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              <button
                onClick={() => onOpenGuidedTour(plan)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  border: '1.5px solid #1e293b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                }}
              >
                GUIDED TOUR
              </button>
            </div>

            {/* Expanded Available Units Section */}
            {expandedAvailability === plan.id && (
              <div
                className="animate-slide-down"
                style={{
                  backgroundColor: '#f1f5f9',
                  borderTop: '1px solid #cbd5e1',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>
                  Available Apartment Units ({plan.availableUnits.length})
                </div>

                {plan.availableUnits.map((u) => (
                  <div
                    key={u.unit}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>
                        Unit #{u.unit}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {u.availableDate} · {u.sqft} sq.ft.
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f766e', marginTop: '2px' }}>
                        ${u.price.toFixed(2)}/mo
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => onSelectCalculate(plan, u.unit)}
                        style={{
                          backgroundColor: '#f0fdfa',
                          color: '#0f766e',
                          border: '1px solid #5ec4b6',
                          borderRadius: '4px',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
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
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
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

      {/* RentCafe Bottom Legal Disclaimer */}
      <div
        style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.85rem',
          color: '#64748b',
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0 }}>
          All dimensions and square footage are approximate. Actual amenities and specifications may vary in dimension or detail. Not all features are available in every apartment. Pricing and availability are subject to change without notice.
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
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setActiveLayoutModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '820px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
              position: 'relative',
              padding: '1.75rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  {activeLayoutModal.name} Floor Plan
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '0.75rem' }}>
                  <span>{activeLayoutModal.beds} Bed</span>
                  <span>•</span>
                  <span>{activeLayoutModal.baths} Bath</span>
                  <span>•</span>
                  <span>{activeLayoutModal.sqft} Sq. Ft.</span>
                  <span>•</span>
                  <span style={{ color: '#0d9488', fontWeight: 700 }}>{activeLayoutModal.availableCount} Available</span>
                </div>
              </div>
              <button
                onClick={() => setActiveLayoutModal(null)}
                style={{
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                backgroundColor: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Starting at: </span>
                <strong style={{ fontSize: '1.15rem', color: '#1e293b' }}>
                  ${activeLayoutModal.startingPrice.toFixed(2)} - ${activeLayoutModal.maxPrice?.toFixed(2) || (activeLayoutModal.startingPrice * 1.5).toFixed(2)}
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / month</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  Available Now
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Deposit: ${activeLayoutModal.deposit.toFixed(0)}</span>
              </div>
            </div>

            {/* Blueprint Graphic */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.25rem',
                backgroundColor: '#fbfcfd',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                minHeight: '260px',
              }}
            >
              <img
                src={activeLayoutModal.highResImage || activeLayoutModal.image}
                alt={`${activeLayoutModal.name} floor plan layout`}
                style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain' }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  const plan = activeLayoutModal;
                  setActiveLayoutModal(null);
                  if (onOpenGuidedTour) onOpenGuidedTour(plan);
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #1e293b',
                  borderRadius: '4px',
                  color: '#1e293b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
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
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#68c7b7',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#0f3c34',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
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
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#0f766e',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
