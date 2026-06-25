import React, { useState } from 'react';

function App() {
  // State to test dynamic dial scaling logic later
  const [dialSize, setDialSize] = useState('28.5');

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '0.5px' }}>watch-mod-visualizer</h1>
        <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '14px' }}>Phase 1.2 — Optical Layer Stacking Engine</p>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Column: Interactive Watch Bench */}
        <div style={{ 
          position: 'relative', 
          width: '450px', 
          height: '450px', 
          backgroundColor: '#1a1a1a', 
          borderRadius: '8px', 
          border: '1px solid #2d2d2d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          
          {/* LAYER 1: WATCH CASE (Base Layer) */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '4px solid #555',
            backgroundColor: '#262626',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ position: 'absolute', top: '15px', color: '#555', fontSize: '11px', fontWeight: 'bold' }}>CASE (42mm)</span>
            
            {/* LAYER 2: CHAPTER RING footprint */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '2px dashed #ffcc00',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>

              {/* LAYER 3: THE DIAL FOOTPRINT (Dynamic sizing based on state) */}
              <div style={{
                position: 'absolute',
                // Proportional math: 30.5mm uses 290px footprint, 28.5mm uses 265px footprint
                width: dialSize === '30.5' ? '290px' : '265px',
                height: dialSize === '30.5' ? '290px' : '265px',
                borderRadius: '50%',
                backgroundColor: dialSize === '30.5' ? 'rgba(0, 102, 204, 0.4)' : 'rgba(0, 204, 102, 0.4)',
                border: dialSize === '30.5' ? '2px solid #0066cc' : '2px solid #00cc66',
                zIndex: 30,
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>DIAL ({dialSize}mm)</span>
              </div>

              {/* LAYER 4: WATCH HANDS (Top Layer) */}
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '130px',
                backgroundColor: '#ff3333',
                borderRadius: '3px',
                zIndex: 40,
                transform: 'translateY(-60px)' // Offsets center anchor point to act like a real indicator hand
              }} />
              <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '50%', zIndex: 41 }} />

            </div>
          </div>
        </div>

        {/* Right Column: Control Dashboard Blueprint */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '8px', border: '1px solid #2d2d2d' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>Component Calibration</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#aaa', fontSize: '14px' }}>Select Dial Diameter Standard:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setDialSize('28.5')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: dialSize === '28.5' ? '#00cc66' : '#2d2d2d',
                  color: dialSize === '28.5' ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                28.5 mm (Standard)
              </button>
              <button 
                onClick={() => setDialSize('30.5')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: dialSize === '30.5' ? '#0066cc' : '#2d2d2d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                30.5 mm (Large)
              </button>
            </div>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#222', borderRadius: '4px', fontSize: '13px', color: '#bbb', lineHeight: '1.5' }}>
            <strong>DevOps Spec Verification:</strong><br />
            • Layer 1 (Case): <code style={{color: '#ff66cc'}}>z-index: 10</code><br />
            • Layer 2 (Chapter): <code style={{color: '#ff66cc'}}>z-index: 20</code><br />
            • Layer 3 (Dial): <code style={{color: '#ff66cc'}}>z-index: 30</code><br />
            • Layer 4 (Hands): <code style={{color: '#ff66cc'}}>z-index: 40</code>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;