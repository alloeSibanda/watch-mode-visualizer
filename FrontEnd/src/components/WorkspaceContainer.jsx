import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

// 📂 Comprehensive Parts Inventory Manifest Matrix (Including Movements & Sourcing Data)
const PARTS_INVENTORY = {
  cases: [
    { id: 'case_sub_42mm', fileName: 'case_sub_42mm.svg', name: '42mm Submariner Style Stainless Steel', price: 45.00, link: 'https://namokimods.com' },
    { id: 'case_dress_36mm', fileName: 'case_dress_36mm.svg', name: '36mm Classic Explorer Dress Case', price: 39.99, link: 'https://luciusatelier.com' }
  ],
  dials: [
    { id: 'dial_285mm_black', fileName: 'dial_285mm_black.svg', name: '28.5mm Classic Matte Black', price: 22.50, link: 'https://namokimods.com' },
    { id: 'dial_305mm_blue', fileName: 'dial_305mm_blue.svg', name: '30.5mm Sunburst Deep Blue', price: 24.00, link: 'https://namokimods.com' },
    { id: 'dial_skeleton_nh70', fileName: 'dial_skeleton_nh70.svg', name: '28.5mm Open-Heart Skeleton Cutout', price: 28.00, link: 'https://luciusatelier.com' }
  ],
  movements: [
    { id: 'mov_nh70', fileName: 'movement_nh70.svg', name: 'SII Seiko Automatic NH70 (Nickel Skeleton)', price: 48.00, link: 'https://diywatch.club' },
    { id: 'mov_nh72', fileName: 'movement_nh72.svg', name: 'SII Seiko Automatic NH72 (Rhodium Dark Grey)', price: 55.00, link: 'https://diywatch.club' }
  ],
  hands: [
    { id: 'hands_mercedes_silver', hourFile: 'hands_hour.svg', minuteFile: 'hands_minute.svg', name: 'Mercedes Hands (Silver Polish)', price: 14.50, link: 'https://namokimods.com' }
  ]
};

export default function WorkspaceContainer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false); // ⚡ Race-Condition Shield state
  
  // Track complete structural build selections
  const [activeConfig, setActiveConfig] = useState({
    case: null,
    dial: null,
    movement: null,
    hands: null
  });

  // UI Open Dropdown Matrix Tracking
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildName, setBuildName] = useState('');

  // Hands calibration degree states
  const [hourAngle, setHourAngle] = useState(300); 
  const [minuteAngle, setMinuteAngle] = useState(24); 

  // Rigid Structural Canvas Layers
  const caseLayerRef = useRef(null);
  const dialLayerRef = useRef(null);
  const movementLayerRef = useRef(null);
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);

  // Initialize Canvas Viewport
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientWidth,
      backgroundColor: '#171717',
      preserveObjectStacking: true,
    });

    setFabricCanvas(initCanvas);
    setIsCanvasReady(true); // 🛡️ Lift the Shield: Interaction is now safely unfrozen

    const handleResize = () => {
      const currentWidth = containerRef.current?.clientWidth || 400;
      initCanvas.setWidth(currentWidth);
      initCanvas.setHeight(currentWidth);
      initCanvas.renderAll();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      initCanvas.dispose();
    };
  }, []);

  // Real-time Slider Transform Binder Matrices
  useEffect(() => {
    if (hourHandRef.current && fabricCanvas) {
      hourHandRef.current.set({ angle: hourAngle });
      fabricCanvas.renderAll();
    }
  }, [hourAngle, fabricCanvas]);

  useEffect(() => {
    if (minuteHandRef.current && fabricCanvas) {
      minuteHandRef.current.set({ angle: minuteAngle });
      fabricCanvas.renderAll();
    }
  }, [minuteAngle, fabricCanvas]);

  /**
   * Safe Multi-Layer Component Stacker
   */
  const loadWatchPart = (type, partObj) => {
    if (!fabricCanvas) return;

    let currentLayerRef;
    if (type === 'case') currentLayerRef = caseLayerRef;
    else if (type === 'dial') currentLayerRef = dialLayerRef;
    else if (type === 'movement') currentLayerRef = movementLayerRef;

    if (currentLayerRef?.current) {
      fabricCanvas.remove(currentLayerRef.current);
      currentLayerRef.current = null;
    }

    fabric.Image.fromURL(`/assets/parts/${partObj.fileName}`).then((img) => {
      const canvasWidth = fabricCanvas.getWidth();
      // Movements slice cleanly right under the dial face layout bounds
      const targetScale = type === 'case' ? 0.82 : type === 'movement' ? 0.54 : 0.56;

      img.scaleToWidth(canvasWidth * targetScale);
      img.set({ selectable: false, hoverCursor: 'default' });

      fabricCanvas.add(img);
      currentLayerRef.current = img;
      fabricCanvas.centerObject(img);

      // Enforce strict layer z-indexing pipeline order
      sortCanvasLayers();

      fabricCanvas.calcOffset();
      fabricCanvas.renderAll();

      setActiveConfig(prev => ({ ...prev, [type]: partObj }));
      setOpenDropdown(null);
    }).catch(err => console.error(`Failed layer loading asset sequence:`, err));
  };

  /**
   * On-Demand Dual Handet Engine
   */
  const loadHandset = (handsetObj) => {
    if (!fabricCanvas) return;

    if (hourHandRef.current) fabricCanvas.remove(hourHandRef.current);
    if (minuteHandRef.current) fabricCanvas.remove(minuteHandRef.current);

    const canvasWidth = fabricCanvas.getWidth();

    fabric.Image.fromURL(`/assets/parts/${handsetObj.hourFile}`).then((hourImg) => {
      hourImg.scaleToWidth(canvasWidth * 0.44);
      hourImg.set({ selectable: false, originX: 'center', originY: 'center', angle: hourAngle });
      hourHandRef.current = hourImg;
      fabricCanvas.add(hourImg);
      fabricCanvas.centerObject(hourImg);
      fabricCanvas.bringObjectToFront(hourImg);
      fabricCanvas.renderAll();
    });

    fabric.Image.fromURL(`/assets/parts/${handsetObj.minuteFile}`).then((minImg) => {
      minImg.scaleToWidth(canvasWidth * 0.54);
      minImg.set({ selectable: false, originX: 'center', originY: 'center', angle: minuteAngle });
      minuteHandRef.current = minImg;
      fabricCanvas.add(minImg);
      fabricCanvas.centerObject(minImg);
      fabricCanvas.bringObjectToFront(minImg);
      fabricCanvas.renderAll();
    });

    setActiveConfig(prev => ({ ...prev, hands: handsetObj }));
    setOpenDropdown(null);
  };

  const sortCanvasLayers = () => {
    // 1. Movement is the raw backplate engine baseline
    if (movementLayerRef.current) fabricCanvas.sendObjectToBack(movementLayerRef.current);
    // 2. Case envelopes the background window
    if (caseLayerRef.current) fabricCanvas.sendObjectToBack(caseLayerRef.current);
    // 3. Dial covers movement core plates
    if (dialLayerRef.current) {
      fabricCanvas.bringObjectToFront(dialLayerRef.current);
      if (hourHandRef.current) fabricCanvas.sendObjectToBack(dialLayerRef.current);
    }
    // 4. Hand indicators always sit on top of everything
    if (hourHandRef.current) fabricCanvas.bringObjectToFront(hourHandRef.current);
    if (minuteHandRef.current) fabricCanvas.bringObjectToFront(minuteHandRef.current);
  };

  // Calculate shopping cart total metrics dynamically
  const calculateTotalCost = () => {
    return Object.values(activeConfig).reduce((acc, curr) => acc + (curr?.price || 0), 0);
  };

  const handleSaveBuildLocal = () => {
    alert(`Build "${buildName || 'Custom Seiko Mod'}" saved locally! Milestone 2 will link this trigger directly to your live Firestore backend database.`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col relative overflow-x-hidden print:bg-white print:text-black">
      <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 p-4 md:p-8 max-w-7xl w-full mx-auto print:p-0 print:block">
        
        {/* Left Column: Interactive Visual Frame Canvas */}
        <div className="col-span-12 md:col-span-5 flex flex-col justify-center print:hidden">
          <div 
            ref={containerRef} 
            className="w-full aspect-square bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <canvas ref={canvasRef} className="absolute inset-0" />
            {!isCanvasReady && (
              <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-md flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest">
                Locking Canvas Memory Engine Layout Matrix...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interaction Control Center Sidebar */}
        <div className={`col-span-12 md:col-span-7 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 print:hidden ${isCanvasReady ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-200">The Roaming Razor Workshop</h2>
              <p className="text-xs text-neutral-500 mt-1">Select and calibrate your modular movement inventory specs.</p>
            </div>
            
            {/* Dynamic Dropdown Control Grid */}
            <div className="space-y-3">
              
              {/* DROPDOWN: CASE PROFILE */}
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Casing Reference</span>
                <button onClick={() => setOpenDropdown(openDropdown === 'case' ? null : 'case')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left flex justify-between items-center text-sm font-medium hover:border-neutral-700">
                  <span className={activeConfig.case ? 'text-amber-500' : 'text-neutral-400'}>{activeConfig.case?.name || 'Select Watch Casing Profile...'}</span>
                  <span className="text-xs text-neutral-600">{activeConfig.case ? `$${activeConfig.case.price.toFixed(2)}` : '▼'}</span>
                </button>
                {openDropdown === 'case' && (
                  <div className="absolute z-30 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden">
                    {PARTS_INVENTORY.cases.map(c => (
                      <div key={c.id} onClick={() => loadWatchPart('case', c)} className="p-3 hover:bg-neutral-800/60 text-sm cursor-pointer flex justify-between">{c.name} <span className="text-neutral-500">${c.price}</span></div>
                    ))}
                  </div>
                )}
              </div>

              {/* DROPDOWN: AUTOMATIC MOVEMENT CORES (NH70/NH72 Expansion) */}
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Caliber Movement Core</span>
                <button onClick={() => setOpenDropdown(openDropdown === 'movement' ? null : 'movement')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left flex justify-between items-center text-sm font-medium hover:border-neutral-700">
                  <span className={activeConfig.movement ? 'text-amber-500' : 'text-neutral-400'}>{activeConfig.movement?.name || 'Select Mechanical Caliber Engine...'}</span>
                  <span className="text-xs text-neutral-600">{activeConfig.movement ? `$${activeConfig.movement.price.toFixed(2)}` : '▼'}</span>
                </button>
                {openDropdown === 'movement' && (
                  <div className="absolute z-30 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden">
                    {PARTS_INVENTORY.movements.map(m => (
                      <div key={m.id} onClick={() => loadWatchPart('movement', m)} className="p-3 hover:bg-neutral-800/60 text-sm cursor-pointer flex justify-between">{m.name} <span className="text-neutral-500">${m.price}</span></div>
                    ))}
                  </div>
                )}
              </div>

              {/* DROPDOWN: DIAL DESIGNS (Skeleton Layout Expansion) */}
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Dial Display Plate</span>
                <button onClick={() => setOpenDropdown(openDropdown === 'dial' ? null : 'dial')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left flex justify-between items-center text-sm font-medium hover:border-neutral-700">
                  <span className={activeConfig.dial ? 'text-amber-500' : 'text-neutral-400'}>{activeConfig.dial?.name || 'Select Dial Design Plate...'}</span>
                  <span className="text-xs text-neutral-600">{activeConfig.dial ? `$${activeConfig.dial.price.toFixed(2)}` : '▼'}</span>
                </button>
                {openDropdown === 'dial' && (
                  <div className="absolute z-30 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden">
                    {PARTS_INVENTORY.dials.map(d => (
                      <div key={d.id} onClick={() => loadWatchPart('dial', d)} className="p-3 hover:bg-neutral-800/60 text-sm cursor-pointer flex justify-between">{d.name} <span className="text-neutral-500">${d.price}</span></div>
                    ))}
                  </div>
                )}
              </div>

              {/* DROPDOWN: HANDS SELECTION (Decoupled Pristine Start) */}
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Indicator Handset Stack</span>
                <button onClick={() => setOpenDropdown(openDropdown === 'hands' ? null : 'hands')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left flex justify-between items-center text-sm font-medium hover:border-neutral-700">
                  <span className={activeConfig.hands ? 'text-amber-500' : 'text-neutral-400'}>{activeConfig.hands?.name || 'Mount Handset Stack...'}</span>
                  <span className="text-xs text-neutral-600">{activeConfig.hands ? `$${activeConfig.hands.price.toFixed(2)}` : '▼'}</span>
                </button>
                {openDropdown === 'hands' && (
                  <div className="absolute z-30 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden">
                    {PARTS_INVENTORY.hands.map(h => (
                      <div key={h.id} onClick={() => loadHandset(h)} className="p-3 hover:bg-neutral-800/60 text-sm cursor-pointer flex justify-between">{h.name} <span className="text-neutral-500">${h.price}</span></div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Hand Alignment Calibration Sliders */}
            <div className={`border-t border-neutral-800/60 pt-3 space-y-3 transition-opacity duration-300 ${!activeConfig.hands ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Handset Alignment Calibration</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-900/60 border border-neutral-800/50 rounded-xl p-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Hour Hand</span>
                    <span className="text-amber-500 font-mono">{hourAngle}°</span>
                  </div>
                  <input type="range" min="0" max="360" value={hourAngle} onChange={(e) => setHourAngle(parseInt(e.target.value))} className="w-full accent-amber-500 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Minute Hand</span>
                    <span className="text-amber-500 font-mono">{minuteAngle}°</span>
                  </div>
                  <input type="range" min="0" max="360" value={minuteAngle} onChange={(e) => setMinuteAngle(parseInt(e.target.value))} className="w-full accent-amber-500 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="w-full mt-5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase py-3.5 rounded-xl tracking-wider transition-colors shadow-lg shadow-amber-500/10">
            Generate Build Spec Sheet & Invoice
          </button>
        </div>
      </main>

      {/* 📦 Option B Milestone: Obsidian Spec Sheet Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all print:absolute print:inset-0 print:bg-white print:p-0">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative print:border-none print:shadow-none print:bg-white print:max-w-none print:p-0">
            
            <div className="flex justify-between items-start print:block">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 tracking-tight print:text-black print:text-3xl">The Roaming Razor Sourcing Invoice</h3>
                <p className="text-xs text-neutral-500 mt-0.5 print:text-neutral-600">Verified Bench Bill of Materials Checklist</p>
              </div>
              <div className="text-right print:hidden">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Running Estimate</span>
                <span className="text-xl font-bold font-mono text-amber-500">${calculateTotalCost().toFixed(2)}</span>
              </div>
            </div>
            
            {/* Database Persistence Local State Input Channel */}
            <div className="mt-4 flex gap-2 print:hidden">
              <input type="text" placeholder="Assign Custom Build Name..." value={buildName} onChange={(e) => setBuildName(e.target.value)} className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none focus:border-amber-500 transition-colors" />
              <button onClick={handleSaveBuildLocal} className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-neutral-950 font-bold text-xs px-4 rounded-xl transition-all">Save Build</button>
            </div>

            {/* Scraped State Matrix Parts List Layout */}
            <div className="mt-5 border-t border-neutral-800 pt-4 space-y-4 print:border-neutral-300 print:mt-8">
              {['case', 'movement', 'dial', 'hands'].map((layerKey) => {
                const selectedPart = activeConfig[layerKey];
                return (
                  <div key={layerKey} className="flex justify-between items-center text-sm border-b border-neutral-800/40 pb-3 last:border-none print:border-neutral-200">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block print:text-neutral-500">{layerKey} Layer</span>
                      <span className="text-neutral-200 font-medium print:text-black">{selectedPart?.name || 'Unassigned / Missing Component'}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-neutral-300 font-mono font-medium print:text-black">{selectedPart ? `$${selectedPart.price.toFixed(2)}` : '—'}</span>
                      {selectedPart?.link && (
                        <a href={selectedPart.link} target="_blank" rel="noreferrer" className="text-[10px] text-amber-500 hover:underline mt-0.5 print:hidden">Source Component ↗</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sourcing Invoice Summary Core Totals Panel */}
            <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/60 print:bg-neutral-100 print:border-neutral-300 print:mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-neutral-700">Total Bench Procurement Cost</span>
              <span className="text-lg font-bold font-mono text-amber-500 print:text-black">${calculateTotalCost().toFixed(2)}</span>
            </div>

            {/* Modal Control Layer */}
            <div className="mt-5 flex gap-3 print:hidden">
              <button onClick={() => window.print()} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-3 rounded-xl transition-all border border-neutral-700">Print Workbench Spec</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold py-3 rounded-xl transition-all">Return to Workshop</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}