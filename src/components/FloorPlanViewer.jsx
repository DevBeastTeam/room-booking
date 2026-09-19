import React, { useState } from 'react';
import { Maximize2, Layers, Compass } from 'lucide-react';

export default function FloorPlanViewer({ floorPlan, unitNumber }) {
  const [activeTab, setActiveTab] = useState('2d'); // '2d', 'dimensions'

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {floorPlan.name} Layout Blueprint
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Unit #{unitNumber} · {floorPlan.beds} Bed / {floorPlan.baths} Bath · {floorPlan.sqft} Sq. Ft.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setActiveTab('2d')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: activeTab === '2d' ? '#2c3038' : '#f1f5f9',
              color: activeTab === '2d' ? '#ffffff' : '#475569',
            }}
          >
            2D Blueprint
          </button>
          <button
            onClick={() => setActiveTab('dimensions')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'dimensions' ? '#2c3038' : '#f1f5f9',
              color: activeTab === 'dimensions' ? '#ffffff' : '#475569',
            }}
          >
            Dimensions
          </button>
        </div>
      </div>

      {/* Blueprint Visual Representation */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '1rem',
        }}
      >
        {activeTab === '2d' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '6px',
              backgroundColor: '#e2e8f0',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            {/* Living / Dining Area */}
            <div
              style={{
                gridRow: '1 / 3',
                backgroundColor: '#ffffff',
                border: '2px solid #94a3b8',
                borderRadius: '4px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                LIVING / DINING
              </div>
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                13' 4" × 15' 8"
              </div>
              <div
                style={{
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '4px',
                  fontSize: '0.7rem',
                  color: '#0d9488',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Entry</span>
                <span>Patio Access &rarr;</span>
              </div>
            </div>

            {/* Bedroom */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #94a3b8',
                borderRadius: '4px',
                padding: '0.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                PRIMARY BEDROOM
              </div>
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                11' 6" × 12' 0"
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Walk-in Closet</div>
            </div>

            {/* Kitchen & Bath */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #94a3b8',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155' }}>KITCHEN</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>8' 2" × 9' 0"</div>
              </div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #94a3b8',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155' }}>BATH</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Tub / Vanity</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '0.4rem 0.6rem' }}>Room Area</th>
                  <th style={{ padding: '0.4rem 0.6rem' }}>Dimensions</th>
                  <th style={{ padding: '0.4rem 0.6rem' }}>Features</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>Living / Dining</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>13' 4" × 15' 8"</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>Ceiling Fan, Hardwood-Style Flooring</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>Primary Bedroom</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>11' 6" × 12' 0"</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>Spacious Walk-in Closet</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>Gourmet Kitchen</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>8' 2" × 9' 0"</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>Modern Appliances, Pantry</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600 }}>Private Patio/Balcony</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>6' 0" × 9' 6"</td>
                  <td style={{ padding: '0.5rem 0.6rem', color: '#64748b' }}>Exterior Storage Closet</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
