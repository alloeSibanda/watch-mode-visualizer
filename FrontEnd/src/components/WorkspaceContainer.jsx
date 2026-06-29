import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function WorkspaceContainer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  
  // Track structural build selections
  const [activeConfig, setActiveConfig] = useState({
    case: 'None Selected',
    dial: 'None Selected'
  });

  // Hands calibration degree matrices
  const [hourAngle, setHourAngle] = useState(300); 
  const [minuteAngle, setMinuteAngle] = useState(24); 

  // Modal UI State Management
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Structural layer reference hooks
  const caseLayerRef = useRef(null);
  const dialLayerRef = useRef(null);
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);

  // Initialize the workspace canvas
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const initialWidth = containerRef.current.clientWidth;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: initialWidth,
      height: initialWidth,
      backgroundColor: '#171717',
      preserveObjectStacking: true,
    });

    setFabricCanvas(initCanvas);

    const handleResize = () => {
      if (!containerRef.current || !initCanvas) return;
      const currentWidth = containerRef.current.clientWidth;
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

  // Sync transformation state matrices with the canvas layers
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
   * Safe Component Layer Stacker
   */
  const loadWatchPart = (type, fileName, cleanName) => {
    if (!fabricCanvas) return;

    const currentLayerRef = type === 'case' ? caseLayerRef : dialLayerRef;
    if (currentLayerRef.current) {
      fabricCanvas.remove(currentLayerRef.current);
      currentLayerRef.current = null;
    }

    fabric.Image.fromURL(`/assets/parts/${fileName}`).then((img) => {
      const canvasWidth = fabricCanvas.getWidth();
      const targetScale = type === 'case' ? 0.82 : 0.56;

      img.scaleToWidth(canvasWidth * targetScale);
      img.set({
        selectable: false,
        hoverCursor: 'default'
      });

      fabricCanvas.add(img);
      currentLayerRef.current = img;
      fabricCanvas.centerObject(img);

      // Programmatically sort the stacking layer order safely
      if (type === 'case') {
        fabricCanvas.sendObjectToBack(img);
      } else {
        fabricCanvas.sendObjectToBack(img);
        if (caseLayerRef.current) {
          fabricCanvas.bringObjectForward(img);
        }
      }

      // Keep hands resting on the top visual field
      if (hourHandRef.current) fabricCanvas.bringObjectToFront(hourHandRef.current);
      if (minuteHandRef.current) fabricCanvas.bringObjectToFront(minuteHandRef.current);

      fabricCanvas.calcOffset();
      fabricCanvas.renderAll();

      setActiveConfig(prev => ({ ...prev, [type]: cleanName }));
    }).catch(err => console.error("Component loader fault line:", err));
  };

  /**
   * Dynamic Independent Hand Loader
   * Pulls dedicated standalone files and maps center-pivoting mechanics
   */
  const loadSingleHand = (type, fileName) => {
    if (!fabricCanvas) return;

    const currentHandRef = type === 'hour' ? hourHandRef : minuteHandRef;
    if (currentHandRef.current) {
      fabricCanvas.remove(currentHandRef.current);
      currentHandRef.current = null;
    }

    fabric.Image.fromURL(`/assets/parts/${fileName}`).then((img) => {
      const canvasWidth = fabricCanvas.getWidth();
      
      // Use clean proportional bounding matching your isolated files
      const targetScale = type === 'hour' ? 0.44 : 0.54; 

      img.scaleToWidth(canvasWidth * targetScale);
      img.set({
        selectable: false,
        hoverCursor: 'default',
        originX: 'center',
        originY: 'center',
        angle: type === 'hour' ? hourAngle : minuteAngle
      });

      currentHandRef.current = img;
      fabricCanvas.add(img);
      fabricCanvas.centerObject(img);
      fabricCanvas.bringObjectToFront(img);
      fabricCanvas.renderAll();
    }).catch(err => console.error(`Error loading isolated ${type} hand:`, err));
  };

  // Bootstrap your decoupled handset assets cleanly upon boot
  useEffect(() => {
    if (fabricCanvas) {
      loadSingleHand('hour', 'hands_hour.svg');
      loadSingleHand('minute', 'hands_minute.svg');
    }
  }, [fabricCanvas]);

  const isCanvasReady = fabricCanvas !== null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col relative overflow-x-hidden">
      <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 p-4 md:p-8 max-w-7xl w-full mx-auto">
        
        {/* Left Column: Canvas Viewport */}
        <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
          <div 
            ref={containerRef} 
            className="w-full aspect-square bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <canvas ref={canvasRef} className="absolute inset-0" />
            {!isCanvasReady && (
              <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest">
                Booting Graphic Matrix Engine...
              </div>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest text-center mt-3">
            Interactive Vector Engine Canvas
          </p>
        </div>

        {/* Right Column: Layout Controls Sidebar */}
        <div className={`col-span-12 md:col-span-7 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col justify-between transition-opacity duration-300 ${isCanvasReady ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-200">Parts Inventory Explorer</h2>
              <p className="text-xs text-neutral-500 mt-1">Select structural profiles to customize your build.</p>
            </div>
            
            <div className="space-y-4">
              {/* Cases */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Case Profiles</span>
                <div 
                  onClick={() => loadWatchPart('case', 'case_sub_42mm.svg', '42mm Submariner Style Stainless Steel')}
                  className={`p-4 bg-neutral-900 border rounded-xl cursor-pointer transition-all ${activeConfig.case.includes('Submariner') ? 'border-amber-500 shadow-md shadow-amber-500/5 bg-neutral-800/50' : 'border-neutral-800 hover:border-neutral-700'}`}
                >
                  <span className="text-sm font-medium text-neutral-300">42mm Submariner Style Case</span>
                </div>
              </div>

              {/* Dials */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Dial Options</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => loadWatchPart('dial', 'dial_285mm_black.svg', '28.5mm Classic Matte Black')}
                    className={`p-4 bg-neutral-900 border rounded-xl cursor-pointer transition-all ${activeConfig.dial.includes('Black') ? 'border-amber-500 shadow-md shadow-amber-500/5 bg-neutral-800/50' : 'border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <span className="text-sm font-medium text-neutral-300">28.5mm Classic Matte Black</span>
                  </div>
                  <div 
                    onClick={() => loadWatchPart('dial', 'dial_305mm_blue.svg', '30.5mm Sunburst Deep Blue')}
                    className={`p-4 bg-neutral-900 border rounded-xl cursor-pointer transition-all ${activeConfig.dial.includes('Blue') ? 'border-amber-500 shadow-md shadow-amber-500/5 bg-neutral-800/50' : 'border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <span className="text-sm font-medium text-neutral-300">30.5mm Sunburst Deep Blue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand Alignment Controls */}
            <div className="border-t border-neutral-800/60 pt-4 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Handset Alignment Calibration</span>
              <div className="space-y-3 bg-neutral-900/60 border border-neutral-800/50 rounded-xl p-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Hour Hand Rotation</span>
                    <span className="text-amber-500 font-mono">{hourAngle}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" value={hourAngle}
                    onChange={(e) => setHourAngle(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Minute Hand Rotation</span>
                    <span className="text-amber-500 font-mono">{minuteAngle}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" value={minuteAngle}
                    onChange={(e) => setMinuteAngle(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-sm uppercase py-4 rounded-xl tracking-wider transition-colors shadow-lg shadow-amber-500/10"
          >
            Generate Build Spec Sheet
          </button>
        </div>
      </main>

      {/* Spec Sheet Build Data Modal Overlay Window */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-neutral-100 tracking-tight">Custom Build Specification Sheet</h3>
            <p className="text-xs text-neutral-500 mt-1">Compiled bill of materials metadata checklist.</p>
            
            <div className="mt-6 space-y-4 border-y border-neutral-800 py-4 font-sans text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs uppercase tracking-wider">Case Reference</span>
                <span className="text-neutral-200 font-medium text-right">{activeConfig.case}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs uppercase tracking-wider">Dial Profile</span>
                <span className="text-neutral-200 font-medium text-right">{activeConfig.dial}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs uppercase tracking-wider">Handset Configuration</span>
                <span className="text-neutral-200 font-medium text-right">Mercedes Handset (Silver Polish)</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold py-3 rounded-xl transition-colors border border-neutral-700"
              >
                Print Build Spec
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold py-3 rounded-xl transition-colors"
              >
                Back to Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}