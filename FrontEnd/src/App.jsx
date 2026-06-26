import React, { useState } from 'react';

function App() {
  // Configurator state variables
  const [dialSize, setDialSize] = useState('28.5');
  const [currentDial, setCurrentDial] = useState('black');
  const [caseType, setCaseType] = useState('sub42'); // For expanding cases later
  const [handsType, setHandsType] = useState('mercedes'); // For expanding hand variants later

  const BENCH_SIZE = 450;
  
  // Proportional math based on 42mm case boundary profile
  const dialWidthPx = dialSize === '30.5' 
    ? (30.5 / 42) * BENCH_SIZE  
    : (28.5 / 42) * BENCH_SIZE; 

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', padding: '30px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Top Navigation Bar Branding */}
      <header style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '35px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', color: '#fff' }}>The Roaming Razor <span style={{ fontWeight: '300', color: '#888' }}>/ watch-mod-visualizer</span></h1>
          <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '13px' }}>Phase 1.5 — Configurator Selector Dashboard Shell</p>
        </div>
        <div style={{ backgroundColor: '#161616', padding: '6px 12px', borderRadius: '4px', border: '1px solid #222', fontSize: '12px', color: '#00cc66', fontWeight: 'bold' }}>
          ● WORKSPACE MODE: LOCAL DEV
        </div>
      </header>

      {/* Responsive Workspace Split Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: ACTIVE BENCH PREVIEW ASSEMBLY */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            position: 'relative', 
            width: `${BENCH_SIZE}px`, 
            height: `${BENCH_SIZE}px`, 
            backgroundColor: '#111', 
            borderRadius: '12px', 
            border: '1px solid #222',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            
            {/* LAYER 1: WATCH CASE */}
            <img 
              src="/assets/parts/case_sub_42mm.svg" 
              alt="Watch Case"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}
            />

            {/* LAYER 2: THE WATCH DIAL */}
            <img 
              src={currentDial === 'black' ? '/assets/parts/dial_285mm_black.svg' : '/assets/parts/dial_305mm_blue.svg'} 
              alt="Watch Dial"
              style={{
                position: 'absolute',
                top: `${(BENCH_SIZE - dialWidthPx) / 2}px`,
                left: `${(BENCH_SIZE - dialWidthPx) / 2}px`,
                width: `${dialWidthPx}px`,
                height: `${dialWidthPx}px`,
                zIndex: 30,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none'
              }}
            />

            {/* LAYER 3: WATCH HANDS */}
            <img 
              src="/assets/parts/hands_mercedes_silver.svg" 
              alt="Watch Hands"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 40, pointerEvents: 'none' }}
            />
          </div>
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#555', letterSpacing: '1px' }}>WORKSPACE RENDER VIEWPORT (1:1 TARGET SCALE)</div>
        </div>

        {/* RIGHT COLUMN: REFACTOR CONTROL DASHBOARD COMPONENT PANEL */}
        <div style={{ backgroundColor: '#141414', padding: '30px', borderRadius: '12px', border: '1px solid #222', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '12px', color: '#fff' }}>Parts Inventory Explorer</h2>
          
          {/* CATEGORY SECTION A: WATCH CASES */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>1. Select Case Profile</h4>
            <div style={{ padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #00cc66', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Submariner Style Steel Case</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Outer Diameter: 42.0 mm • Lug Width: 20mm</div>
              </div>
              <span style={{ fontSize: '11px', color: '#00cc66', fontWeight: 'bold', backgroundColor: 'rgba(0,204,102,0.1)', padding: '4px 8px', borderRadius: '4px' }}>EQUIPPED</span>
            </div>
          </div>

          {/* CATEGORY SECTION B: MODULAR DIALS */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>2. Select Dial Face</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              {/* Card option item 1 */}
              <div 
                onClick={() => { setDialSize('28.5'); setCurrentDial('black'); }}
                style={{
                  padding: '16px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                  border: currentDial === 'black' ? '2px solid #00cc66' : '1px solid #222',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1a1a1a', border: '2px solid #fff', marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: currentDial === 'black' ? '#00cc66' : '#fff' }}>Matte Black OEM</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Size: 28.5mm (Standard)</div>
              </div>

              {/* Card option item 2 */}
              <div 
                onClick={() => { setDialSize('30.5'); setCurrentDial('blue'); }}
                style={{
                  padding: '16px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                  border: currentDial === 'blue' ? '2px solid #0066cc' : '1px solid #222',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#003366', border: '1px solid #004488', marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: currentDial === 'blue' ? '#0066cc' : '#fff' }}>Deep Sunburst Blue</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Size: 30.5mm (Large Profile)</div>
              </div>

            </div>
          </div>

          {/* CATEGORY SECTION C: HANDS SET */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>3. Select Hand Indicator Set</h4>
            <div style={{ padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Classic Mercedes Hands</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Material: Polished Silver Chrome Finish</div>
              </div>
              <span style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', backgroundColor: '#222', padding: '4px 8px', borderRadius: '4px' }}>LOCKED INDEX</span>
            </div>
          </div>

          {/* SYSTEM CALIBRATION SUMMARY BANNER LOG */}
          <div style={{ padding: '15px', backgroundColor: '#181818', borderRadius: '6px', borderLeft: '3px solid #666', fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Active Layer Core Metrics:</span><br />
            • Target Viewport Resolution: 450px Canvas Box Matrix<br />
            • Computed Active Layout Width: <span style={{ color: '#fff' }}>{dialWidthPx.toFixed(1)}px</span> for {dialSize}mm specification profile selection.
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;