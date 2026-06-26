import React, { useState } from 'react';

function App() {
  // Master state tracking selected components
  const [dialSize, setDialSize] = useState('28.5'); // '28.5' or '30.5'
  const [currentDial, setCurrentDial] = useState('black'); // 'black' or 'blue'

  // Sizing calibration configuration constants
  const BENCH_SIZE = 450; // The fixed square width of our workspace viewport in pixels
  
  // Dynamic scale calculation based on real physical proportions
  // Case diameter context: 42mm visual boundary maps to 100% width of the bench
  const dialWidthPx = dialSize === '30.5' 
    ? (30.5 / 42) * BENCH_SIZE  // ~326.7px for Large dial profile
    : (28.5 / 42) * BENCH_SIZE; // ~305.3px for Standard dial profile

  // Handler for dial configuration selection updates
  const handleDialToggle = (size, type) => {
    setDialSize(size);
    setCurrentDial(type);
  };

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '0.5px' }}>watch-mod-visualizer</h1>
        <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '14px' }}>Phase 1.4 — Dynamic Asset Scale Calibration</p>
      </header>

      {/* Workspace Grid Layout */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Column: Interactive Watch Assembly Bench */}
        <div style={{ 
          position: 'relative', 
          width: `${BENCH_SIZE}px`, 
          height: `${BENCH_SIZE}px`, 
          backgroundColor: '#171717', 
          borderRadius: '8px', 
          border: '1px solid #2d2d2d',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}>
          
          {/* LAYER 1: WATCH CASE (Base Layer - Fixed 100% Frame Scale) */}
          <img 
            src="/assets/parts/case_sub_42mm.svg" 
            alt="Watch Case"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />

          {/* LAYER 2: THE DIAL (Dynamic Sizing Context Applied From Proportional Calculations) */}
          <img 
            src={currentDial === 'black' ? '/assets/parts/dial_285mm_black.svg' : '/assets/parts/dial_305mm_blue.svg'} 
            alt="Watch Dial"
            style={{
              position: 'absolute',
              // Dynamic centering offsets using bounding box dimensions
              top: `${(BENCH_SIZE - dialWidthPx) / 2}px`,
              left: `${(BENCH_SIZE - dialWidthPx) / 2}px`,
              width: `${dialWidthPx}px`,
              height: `${dialWidthPx}px`,
              zIndex: 30,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none'
            }}
          />

          {/* LAYER 3: WATCH HANDS (Top Layer - Fixed 100% Frame Scale matching Case pinions) */}
          <img 
            src="/assets/parts/hands_mercedes_silver.svg" 
            alt="Watch Hands"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 40,
              pointerEvents: 'none'
            }}
          />

        </div>

        {/* Right Column: Control Panel Dashboard Panel */}
        <div style={{ flex: '1', minWidth: '320px', backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '8px', border: '1px solid #2d2d2d' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '18px' }}>Parts Inventory Explorer</h3>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#aaa', fontSize: '14px' }}>Select Modular Dial Assembly:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Option A: Standard 28.5mm Dial option */}
              <button 
                onClick={() => handleDialToggle('28.5', 'black')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: currentDial === 'black' ? '#262626' : '#1e1e1e',
                  color: '#fff',
                  border: currentDial === 'black' ? '2px solid #00cc66' : '1px solid #333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>OEM Style Matte Black Dial</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Diameter: 28.5 mm (Standard)</div>
                </div>
                {currentDial === 'black' && <span style={{ color: '#00cc66', fontWeight: 'bold' }}>✓ ACTIVE</span>}
              </button>

              {/* Option B: Larger 30.5mm Dial option */}
              <button 
                onClick={() => handleDialToggle('30.5', 'blue')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: currentDial === 'blue' ? '#262626' : '#1e1e1e',
                  color: '#fff',
                  border: currentDial === 'blue' ? '2px solid #0066cc' : '1px solid #333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>Deep Marine Sunburst Dial</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Diameter: 30.5 mm (Large Layout)</div>
                </div>
                {currentDial === 'blue' && <span style={{ color: '#0066cc', fontWeight: 'bold' }}>✓ ACTIVE</span>}
              </button>

            </div>
          </div>

          {/* Infrastructure Metrics Readout */}
          <div style={{ padding: '15px', backgroundColor: '#222', borderRadius: '6px', fontSize: '13px', color: '#bbb', lineHeight: '1.6' }}>
            <strong>📐 Calculated Proportional Constraints:</strong><br />
            • Active Render Width: <code style={{color: '#ff66cc'}}>{dialWidthPx.toFixed(1)}px</code><br />
            • Aspect Ratio: <code style={{color: '#ff66cc'}}>1000 × 1000 (1:1 Unified Grid)</code><br />
            • Center Pinion Target Alignment: <code style={{color: '#ff66cc'}}>X: 225.0px, Y: 225.0px</code>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;