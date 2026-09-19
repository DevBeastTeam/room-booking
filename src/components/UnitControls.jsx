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
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '1.75rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <Key size={20} style={{ color: '#68c7b7' }} />
        <span>Lease Configuration</span>
      </h2>

      {/* Floor Plan Selection */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '0.4rem',
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
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            fontSize: '0.95rem',
            color: '#1e293b',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {floorPlans.map((fp) => (
            <option key={fp.id} value={fp.id}>
              {fp.name} ({fp.beds} Bed, {fp.baths} Bath · {fp.sqft} sq.ft.)
            </option>
          ))}
        </select>
      </div>

      {/* Available Unit Selection */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '0.4rem',
          }}
        >
          Select Available Unit
        </label>
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            fontSize: '0.95rem',
            color: '#1e293b',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {selectedFloorPlan.availableUnits.map((u) => (
            <option key={u} value={u}>
              Unit #{u} · Available Immediately
            </option>
          ))}
        </select>
      </div>

      {/* Move-in Date Picker */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '0.4rem',
          }}
        >
          Estimated Move-in Date
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.95rem',
              color: '#1e293b',
              fontWeight: 500,
            }}
          />
        </div>
      </div>

      {/* Lease Term Selector */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '0.5rem',
          }}
        >
          Lease Term
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {[12, 10, 6].map((term) => {
            const price = selectedFloorPlan.prices[term] || selectedFloorPlan.prices[12];
            const isSelected = leaseTerm === term;
            return (
              <button
                key={term}
                onClick={() => setLeaseTerm(term)}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid #68c7b7' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                  color: isSelected ? '#0f766e' : '#334155',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{term} Mos</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', color: isSelected ? '#0d9488' : '#64748b' }}>
                  ${price}/mo
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />

      {/* Personalize Your Cost Section */}
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Sparkles size={18} style={{ color: '#68c7b7' }} />
        <span>Personalize Your Cost</span>
      </h3>

      {/* Accordion 1: People */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.75rem', overflow: 'hidden' }}>
        <button
          onClick={() => setOpenSection(openSection === 'people' ? '' : 'people')}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            backgroundColor: openSection === 'people' ? '#f8fafc' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#1e293b',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={17} style={{ color: '#64748b' }} />
            <span>People ({occupants})</span>
          </div>
          {openSection === 'people' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSection === 'people' && (
          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>Number of Occupants</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Adults & Dependents living in home</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => handleOccupantChange(-1)}
                  disabled={occupants <= 1}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: occupants <= 1 ? '#f1f5f9' : '#ffffff',
                    color: occupants <= 1 ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1rem', minWidth: '16px', textAlign: 'center' }}>
                  {occupants}
                </span>
                <button
                  onClick={() => handleOccupantChange(1)}
                  disabled={occupants >= 6}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: occupants >= 6 ? '#f1f5f9' : '#ffffff',
                    color: occupants >= 6 ? '#cbd5e1' : '#1e293b',
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
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.75rem', overflow: 'hidden' }}>
        <button
          onClick={() => setOpenSection(openSection === 'pets' ? '' : 'pets')}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            backgroundColor: openSection === 'pets' ? '#f8fafc' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#1e293b',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Dog size={17} style={{ color: '#64748b' }} />
            <span>Pets ({pets})</span>
          </div>
          {openSection === 'pets' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSection === 'pets' && (
          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>Dogs & Cats</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>+$20.00/mo rent & $300 deposit each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => handlePetChange(-1)}
                  disabled={pets <= 0}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pets <= 0 ? '#f1f5f9' : '#ffffff',
                    color: pets <= 0 ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1rem', minWidth: '16px', textAlign: 'center' }}>
                  {pets}
                </span>
                <button
                  onClick={() => handlePetChange(1)}
                  disabled={pets >= 3}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pets >= 3 ? '#f1f5f9' : '#ffffff',
                    color: pets >= 3 ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            {pets > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#0d9488', backgroundColor: '#f0fdfa', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                ✓ Added ${pets * 20}.00/mo pet rent & ${pets * 300}.00 pet deposit
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: Optional Add-ons */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
        <button
          onClick={() => setOpenSection(openSection === 'addons' ? '' : 'addons')}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            backgroundColor: openSection === 'addons' ? '#f8fafc' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#1e293b',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={17} style={{ color: '#64748b' }} />
            <span>Optional Add-Ons ({addOns.filter((a) => a.selected).length})</span>
          </div>
          {openSection === 'addons' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSection === 'addons' && (
          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {addOns.map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: item.selected ? '#f0fdfa' : '#f8fafc',
                  border: item.selected ? '1px solid #68c7b7' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleAddon(item.id)}
                    style={{ accentColor: '#68c7b7', width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.description}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f766e' }}>
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
