import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric'; 

function App() {
  const [dialSize, setDialSize] = useState('28.5');
  const [currentDial, setCurrentDial] = useState('black');
  
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  
  const caseLayerRef = useRef(null);
  const dialLayerRef = useRef(null);
  const handsLayerRef = useRef(null);

  const BENCH_SIZE = 450;

  // Proportional math calibration based on a 42mm outer case boundary standard
  const getDialWidth = (size) => {
    return size === '30.5' ? (30.5 / 42) * BENCH_SIZE : (28.5 / 42) * BENCH_SIZE;
  };

  // 1. Initialize Canvas Instance on Mount
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: BENCH_SIZE,
      height: BENCH_SIZE,
      backgroundColor: '#111',
      selection: false, 
    });

    fabricCanvasRef.current = canvas;

    // Load Base Watch Case Layer
    fabric.FabricImage.fromURL('/assets/parts/case_sub_42mm.svg').then((img) => {
      img.set({
        originX: 'center', // Anchor the object from its true geometric center
        originY: 'center',
        left: BENCH_SIZE / 2, // Position center anchor dead-center of the canvas viewport
        top: BENCH_SIZE / 2,
        selectable: false, 
        hoverCursor: 'default',
      });
      img.scaleToWidth(BENCH_SIZE);
      caseLayerRef.current = img;
      canvas.add(img);
      img.sendToBack();
      canvas.requestRenderAll(); 
    });

    // Load Top Watch Hands Layer
    fabric.FabricImage.fromURL('/assets/parts/hands_mercedes_silver.svg').then((img) => {
      img.set({
        originX: 'center',
        originY: 'center',
        left: BENCH_SIZE / 2,
        top: BENCH_SIZE / 2,
        selectable: false,
        hoverCursor: 'default',
      });
      img.scaleToWidth(BENCH_SIZE);
      handsLayerRef.current = img;
      canvas.add(img);
      img.bringToFront();
      canvas.requestRenderAll(); 
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // 2. Dynamic Dial Layer Handling Engine
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (dialLayerRef.current) {
      canvas.remove(dialLayerRef.current);
    }

    const targetDialSrc = currentDial === 'black' 
      ? '/assets/parts/dial_285mm_black.svg' 
      : '/assets/parts/dial_305mm_blue.svg';

    const dialWidth = getDialWidth(dialSize);

    fabric.FabricImage.fromURL(targetDialSrc).then((img) => {
      img.set({
        originX: 'center',
        originY: 'center',
        left: BENCH_SIZE / 2, // Locks center coordinate cleanly above the case center axis
        top: BENCH_SIZE / 2,
        selectable: true, 
        hasControls: true, 
        cornerColor: '#00cc66',
        cornerSize: 8,
        transparentCorners: false,
      });
      img.scaleToWidth(dialWidth);

      dialLayerRef.current = img;
      canvas.add(img);

      if (caseLayerRef.current) {
        caseLayerRef.current.sendToBack();
      }
      if (handsLayerRef.current) {
        handsLayerRef.current.bringToFront();
      }
      
      canvas.requestRenderAll(); 
    });

  }, [dialSize, currentDial]);

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#f0f0f0', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '35px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#fff' }}>watch-mod-visualizer</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '13px' }}>Phase 1.6 — Canvas Engine Vector Workspace Migration</p>
        </div>
        <div style={{ backgroundColor: '#161616', padding: '6px 12px', borderRadius: '4px', border: '1px solid #222', fontSize: '12px', color: '#ffcc00', fontWeight: 'bold' }}>
          ● ENGINE: FABRIC.JS CANVAS ACTIVE
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: THE CANVAS VIEWPORT */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: '1px solid #222', 
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)' 
          }}>
            <canvas ref={canvasRef} />
          </div>
          <div style={{ marginTop: '15px', fontSize: '11px', color: '#444', letterSpacing: '1.5px' }}>FABRICJS GRAPHICS HARDWARE ENGINE HOST CONTAINER</div>
        </div>

        {/* RIGHT COLUMN: CONTROL DASHBOARD COMPONENT PANEL */}
        <div style={{ backgroundColor: '#141414', padding: '30px', borderRadius: '12px', border: '1px solid #222' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '12px', color: '#fff' }}>Parts Inventory Explorer</h2>
          
          {/* CASES SECTION */}
          <div style={{ SpecSection: 'case', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', color: '#888' }}>1. Select Case Profile (Locked Base)</h4>
            <div style={{ padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#aaa' }}>Submariner Style Steel Case (42mm)</span>
              <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>STATIC BACKDROP</span>
            </div>
          </div>

          {/* DYNAMIC MODULAR DIALS */}
          <div style={{ SpecSection: 'dial', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', color: '#888' }}>2. Select Interactive Dial Face</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              <div 
                onClick={() => { setDialSize('28.5'); setCurrentDial('black'); }}
                style={{
                  padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '8px',
                  border: currentDial === 'black' ? '2px solid #00cc66' : '1px solid #222', cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: currentDial === 'black' ? '#00cc66' : '#fff' }}>Matte Black OEM</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Size: 28.5mm (Standard)</div>
              </div>

              <div 
                onClick={() => { setDialSize('30.5'); setCurrentDial('blue'); }}
                style={{
                  padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '8px',
                  border: currentDial === 'blue' ? '2px solid #0066cc' : '1px solid #222', cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: currentDial === 'blue' ? '#0066cc' : '#fff' }}>Deep Sunburst Blue</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Size: 30.5mm (Large Profile)</div>
              </div>

            </div>
          </div>

          {/* ACTIVE SYSTEM DIAGNOSTIC SUMMARY INFO */}
          <div style={{ padding: '15px', backgroundColor: '#181818', borderRadius: '6px', borderLeft: '3px solid #ffcc00', fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Engine Status Readout:</span><br />
            • Active Layer Tracking Objects: <span style={{ color: '#00cc66' }}>True Object Vector Buffers</span><br />
            • Dial Interaction Mode: <span style={{ color: '#fff' }}>Selectable & Rotatable Sandbox Active</span><br />
            • Target Scale Framework: Proportional Center-Oriented Calibration Matrix.
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;