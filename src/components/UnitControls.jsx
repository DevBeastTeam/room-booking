import React, { useState } from 'react';
import { Users, Dog, Calendar, Key, Sparkles, ChevronDown, ChevronUp, Plus, Minus, Check } from 'lucide-react';

export default function UnitControls({
  floorPlans,
  selectedFloorPlan,
  setSelectedFloorPlan,
  selectedUnit,
  setSelectedUnit,
  moveInDate,
  setMoveInDate,
  leaseTerm,
  setLeaseTerm,
  occupants,
  setOccupants,
  pets,
  setPets,
  addOns,
  setAddOns,
}) {
  const [openSection, setOpenSection] = useState('people'); // 'people', 'pets', 'addons'

  const toggleAddon = (id) => {
    setAddOns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handlePetChange = (delta) => {
    const newVal = Math.max(0, Math.min(3, pets + delta));
    setPets(newVal);
  };

  const handleOccupantChange = (delta) => {
    const newVal = Math.max(1, Math.min(6, occupants + delta));
    setOccupants(newVal);
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(16, 20, 34, 0.85)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        padding: '2rem',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <h2
        style={{
          fontSize: '1.35rem',
          fontWeight: 600,
          color: '#f8fafc',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
        }}
      >
        <Key size={20} style={{ color: '#c9a96e' }} />
        <span>Lease Configuration</span>
      </h2>

      {/* Floor Plan Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#c9a96e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}
        >
          Floor Plan
        </label>
        <select
          value={selectedFloorPlan.id}
          onChange={(e) => {
            const fp = floorPlans.find((f) => f.id === e.target.value);
            if (fp) setSelectedFloorPlan(fp);
          }}
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(201, 169, 110, 0.35)',
            backgroundColor: 'rgba(8, 10, 18, 0.75)',
            fontSize: '0.95rem',
            color: '#f4efe6',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {floorPlans.map((fp) => (
            <option key={fp.id} value={fp.id} style={{ backgroundColor: '#0c101c' }}>
              {fp.name} ({fp.beds} Bed, {fp.baths} Bath · {fp.sqft} sq.ft.)
            </option>
          ))}
        </select>
      </div>

      {/* Available Unit Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#c9a96e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}
        >
          Select Available Unit
        </label>
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(201, 169, 110, 0.35)',
            backgroundColor: 'rgba(8, 10, 18, 0.75)',
            fontSize: '0.95rem',
            color: '#f4efe6',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {selectedFloorPlan.availableUnits.map((u) => (
            <option key={u} value={u} style={{ backgroundColor: '#0c101c' }}>
              Unit #{u} · Available Immediately
            </option>
          ))}
        </select>
      </div>

      {/* Move-in Date Picker */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#c9a96e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}
        >
          Target Move-in Date
        </label>
        <input
          type="date"
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(201, 169, 110, 0.35)',
            backgroundColor: 'rgba(8, 10, 18, 0.75)',
            fontSize: '0.95rem',
            color: '#f4efe6',
            fontWeight: 500,
            outline: 'none',
          }}
        />
      </div>

      {/* Lease Term Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#c9a96e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
          }}
        >
          Lease Term Duration
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
          {[12, 10, 6].map((term) => {
            const price = selectedFloorPlan.prices[term] || selectedFloorPlan.prices[12];
            const isSelected = leaseTerm === term;
            return (
              <button
                key={term}
                onClick={() => setLeaseTerm(term)}
                style={{
                  padding: '0.8rem 0.5rem',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #dfc285' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected
                    ? 'linear-gradient(135deg, #c9a96e, #a88448)'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#08090f' : '#f4efe6',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 15px rgba(201, 169, 110, 0.3)' : 'none',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{term} Mos</div>
                <div style={{ fontSize: '0.78rem', fontWeight: isSelected ? 800 : 600, marginTop: '2px', color: isSelected ? '#08090f' : '#dfc285' }}>
                  ${price}/mo
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(201, 169, 110, 0.2)', margin: '1.75rem 0' }} />

      {/* Personalize Your Cost Section */}
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#f8fafc',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
        }}
      >
        <Sparkles size={18} style={{ color: '#c9a96e' }} />
        <span>Personalize Your Experience</span>
      </h3>

      {/* Accordion 1: People */}
      <div style={{ border: '1px solid rgba(201, 169, 110, 0.2)', borderRadius: '8px', marginBottom: '0.85rem', overflow: 'hidden' }}>
        <button
          onClick={() => setOpenSection(openSection === 'people' ? '' : 'people')}
          style={{
            width: '100%',
            padding: '0.9rem 1.1rem',
            backgroundColor: openSection === 'people' ? 'rgba(201, 169, 110, 0.08)' : 'rgba(12, 16, 28, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: openSection === 'people' ? '#dfc285' : '#f4efe6',
            fontWeight: 600,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={18} style={{ color: '#c9a96e' }} />
            <span>Household Occupants ({occupants})</span>
          </div>
          {openSection === 'people' ? <ChevronUp size={16} style={{ color: '#c9a96e' }} /> : <ChevronDown size={16} style={{ color: '#94a3b8' }} />}
        </button>

        {openSection === 'people' && (
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(8, 10, 18, 0.75)', borderTop: '1px solid rgba(201, 169, 110, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f4efe6' }}>Number of Occupants</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Adults & dependents in household</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <button
                  onClick={() => handleOccupantChange(-1)}
                  disabled={occupants <= 1}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: occupants <= 1 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(201, 169, 110, 0.15)',
                    color: occupants <= 1 ? 'rgba(255, 255, 255, 0.2)' : '#dfc285',
                    cursor: occupants <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '18px', textAlign: 'center', color: '#f4efe6' }}>
                  {occupants}
                </span>
                <button
                  onClick={() => handleOccupantChange(1)}
                  disabled={occupants >= 6}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: occupants >= 6 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(201, 169, 110, 0.15)',
                    color: occupants >= 6 ? 'rgba(255, 255, 255, 0.2)' : '#dfc285',
                    cursor: occupants >= 6 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Pets */}
      <div style={{ border: '1px solid rgba(201, 169, 110, 0.2)', borderRadius: '8px', marginBottom: '0.85rem', overflow: 'hidden' }}>
        <button
          onClick={() => setOpenSection(openSection === 'pets' ? '' : 'pets')}
          style={{
            width: '100%',
            padding: '0.9rem 1.1rem',
            backgroundColor: openSection === 'pets' ? 'rgba(201, 169, 110, 0.08)' : 'rgba(12, 16, 28, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: openSection === 'pets' ? '#dfc285' : '#f4efe6',
            fontWeight: 600,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Dog size={18} style={{ color: '#c9a96e' }} />
            <span>Pet Registration ({pets})</span>
          </div>
          {openSection === 'pets' ? <ChevronUp size={16} style={{ color: '#c9a96e' }} /> : <ChevronDown size={16} style={{ color: '#94a3b8' }} />}
        </button>

        {openSection === 'pets' && (
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(8, 10, 18, 0.75)', borderTop: '1px solid rgba(201, 169, 110, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f4efe6' }}>Dogs & Cats</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>+$20.00/mo pet rent & $300 deposit each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <button
                  onClick={() => handlePetChange(-1)}
                  disabled={pets <= 0}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pets <= 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(201, 169, 110, 0.15)',
                    color: pets <= 0 ? 'rgba(255, 255, 255, 0.2)' : '#dfc285',
                    cursor: pets <= 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '18px', textAlign: 'center', color: '#f4efe6' }}>
                  {pets}
                </span>
                <button
                  onClick={() => handlePetChange(1)}
                  disabled={pets >= 3}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pets >= 3 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(201, 169, 110, 0.15)',
                    color: pets >= 3 ? 'rgba(255, 255, 255, 0.2)' : '#dfc285',
                    cursor: pets >= 3 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            {pets > 0 && (
              <div style={{ fontSize: '0.82rem', color: '#dfc285', backgroundColor: 'rgba(201, 169, 110, 0.1)', border: '1px solid rgba(201, 169, 110, 0.25)', padding: '0.6rem 0.85rem', borderRadius: '6px', marginTop: '0.75rem' }}>
                ✓ Added ${pets * 20}.00/mo pet rent & ${pets * 300}.00 refundable pet deposit
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: Optional Add-ons */}
      <div style={{ border: '1px solid rgba(201, 169, 110, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
        <button
          onClick={() => setOpenSection(openSection === 'addons' ? '' : 'addons')}
          style={{
            width: '100%',
            padding: '0.9rem 1.1rem',
            backgroundColor: openSection === 'addons' ? 'rgba(201, 169, 110, 0.08)' : 'rgba(12, 16, 28, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: openSection === 'addons' ? '#dfc285' : '#f4efe6',
            fontWeight: 600,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={18} style={{ color: '#c9a96e' }} />
            <span>Optional Amenities & Add-Ons ({addOns.filter((a) => a.selected).length})</span>
          </div>
          {openSection === 'addons' ? <ChevronUp size={16} style={{ color: '#c9a96e' }} /> : <ChevronDown size={16} style={{ color: '#94a3b8' }} />}
        </button>

        {openSection === 'addons' && (
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(8, 10, 18, 0.75)', borderTop: '1px solid rgba(201, 169, 110, 0.15)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {addOns.map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: item.selected ? 'rgba(201, 169, 110, 0.12)' : 'rgba(16, 20, 34, 0.85)',
                  border: item.selected ? '1px solid #c9a96e' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleAddon(item.id)}
                    style={{ accentColor: '#c9a96e', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f4efe6' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.description}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#dfc285' }}>
                  +${item.price.toFixed(2)}/mo
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
