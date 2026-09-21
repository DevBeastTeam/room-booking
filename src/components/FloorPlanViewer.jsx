import React, { useState } from 'react';
import { Maximize2, Layers, Compass } from 'lucide-react';

export default function FloorPlanViewer({ floorPlan, unitNumber }) {
  const [activeTab, setActiveTab] = useState('2d'); // '2d', 'dimensions'

  return (
    <div
      style={{
        backgroundColor: 'rgba(16, 20, 34, 0.85)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        padding: '1.75rem',
        marginBottom: '1.75rem',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
            {floorPlan.name} Architectural Blueprint
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Unit #{unitNumber} · {floorPlan.beds} Bed / {floorPlan.baths} Bath · {floorPlan.sqft} Sq. Ft.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('2d')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: activeTab === '2d' ? 'linear-gradient(135deg, #c9a96e, #a88448)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === '2d' ? '#08090f' : '#dfc285',
              border: activeTab === '2d' ? '1px solid #dfc285' : '1px solid rgba(201, 169, 110, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            2D Blueprint
          </button>
          <button
            onClick={() => setActiveTab('dimensions')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: activeTab === 'dimensions' ? 'linear-gradient(135deg, #c9a96e, #a88448)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'dimensions' ? '#08090f' : '#dfc285',
              border: activeTab === 'dimensions' ? '1px solid #dfc285' : '1px solid rgba(201, 169, 110, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s',
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
          backgroundColor: 'rgba(8, 10, 18, 0.85)',
          border: '1px dashed rgba(201, 169, 110, 0.35)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0.85rem',
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
              gap: '8px',
              backgroundColor: 'rgba(12, 16, 28, 0.7)',
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            {/* Living / Dining Area */}
            <div
              style={{
                gridRow: '1 / 3',
                backgroundColor: 'rgba(16, 20, 34, 0.95)',
                border: '1px solid rgba(201, 169, 110, 0.35)',
                borderRadius: '6px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dfc285', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                LIVING / DINING SALON
              </div>
              <div style={{ textAlign: 'center', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 700 }}>
                13' 4" × 15' 8"
              </div>
              <div
                style={{
                  borderTop: '1px dashed rgba(201, 169, 110, 0.25)',
                  paddingTop: '6px',
                  fontSize: '0.72rem',
                  color: '#c9a96e',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Private Entry</span>
                <span>Terrace Access &rarr;</span>
              </div>
            </div>

            {/* Bedroom */}
            <div
              style={{
                backgroundColor: 'rgba(16, 20, 34, 0.95)',
                border: '1px solid rgba(201, 169, 110, 0.35)',
                borderRadius: '6px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dfc285', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                PRIMARY SUITE
              </div>
              <div style={{ textAlign: 'center', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 700 }}>
                11' 6" × 12' 0"
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Walk-in Dressing Closet</div>
            </div>

            {/* Kitchen & Bath */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(16, 20, 34, 0.95)',
                  border: '1px solid rgba(201, 169, 110, 0.35)',
                  borderRadius: '6px',
                  padding: '0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dfc285', textTransform: 'uppercase' }}>KITCHEN</div>
                <div style={{ fontSize: '0.72rem', color: '#f8fafc', fontWeight: 600 }}>8' 2" × 9' 0"</div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(16, 20, 34, 0.95)',
                  border: '1px solid rgba(201, 169, 110, 0.35)',
                  borderRadius: '6px',
                  padding: '0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dfc285', textTransform: 'uppercase' }}>BATH</div>
                <div style={{ fontSize: '0.72rem', color: '#f8fafc', fontWeight: 600 }}>Soaking Tub</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201, 169, 110, 0.3)', textAlign: 'left', color: '#c9a96e' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Room Area</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Dimensions</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Features</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#f4efe6' }}>Living / Dining</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#dfc285', fontWeight: 700 }}>13' 4" × 15' 8"</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>Ceiling Fan, Hardwood-Style Flooring</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#f4efe6' }}>Primary Bedroom</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#dfc285', fontWeight: 700 }}>11' 6" × 12' 0"</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>Spacious Walk-in Closet</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#f4efe6' }}>Gourmet Kitchen</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#dfc285', fontWeight: 700 }}>8' 2" × 9' 0"</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>Modern Appliances, Pantry</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#f4efe6' }}>Private Patio/Balcony</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#dfc285', fontWeight: 700 }}>6' 0" × 9' 6"</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>Exterior Storage Closet</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
