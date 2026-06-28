import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function WorkspaceContainer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);

  // Initialize and scale the responsive canvas workspace
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Resolve the true Canvas constructor wrapper out of Vite's module bundle
    const CanvasConstructor = fabric.Canvas || (fabric.fabric && fabric.fabric.Canvas);

    if (!CanvasConstructor) {
      console.error("Fabric Canvas constructor could not be resolved from import. Check dependency version.");
      return;
    }

    // Determine initial container scale boundary
    const initialWidth = containerRef.current.clientWidth;

    // Create the Fabric canvas instance using the resolved constructor matrix
    const initCanvas = new CanvasConstructor(canvasRef.current, {
      width: initialWidth,
      height: initialWidth, // Maintain a sharp 1:1 square aspect ratio
      backgroundColor: '#171717',
      preserveObjectStacking: true,
    });

    setFabricCanvas(initCanvas);

    // Dynamic mobile and desktop browser resize listener engine
    const handleResize = () => {
      if (!containerRef.current || !initCanvas) return;
      
      const currentWidth = containerRef.current.clientWidth;
      
      // Update canvas viewport configurations dynamically
      initCanvas.setWidth(currentWidth);
      initCanvas.setHeight(currentWidth);
      initCanvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    // Clean up connections on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      initCanvas.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      
      {/* Responsive Workspace Grid Split */}
      {/* Mobile: Stacked columns (flex-col) | Desktop: Side-by-Side (md:grid-cols-12) */}
      <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 p-4 md:p-8 max-w-7xl w-full mx-auto">
        
        {/* Left Column: Canvas Interface Host Container */}
        <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
          <div 
            id="canvas-container-parent" 
            ref={containerRef} 
            className="w-full aspect-square bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <canvas ref={canvasRef} className="absolute inset-0" />
          </div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest text-center mt-3">
            Interactive Vector Engine Canvas
          </p>
        </div>

        {/* Right Column: Custom Component Controls & Options */}
        <div className="col-span-12 md:col-span-7 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-200">Parts Inventory Explorer</h2>
            <p className="text-xs text-neutral-500 mt-1">Select structural profiles to customize your build.</p>
            
            {/* Parts Picker Stubs Placeholders */}
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
                <span className="text-xs uppercase text-neutral-500 font-bold block">Case Profile</span>
                <span className="text-sm font-medium text-neutral-300">38mm 62GS Style Stainless Steel</span>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
                <span className="text-xs uppercase text-neutral-500 font-bold block">Dial Face Selection</span>
                <span className="text-sm font-medium text-neutral-300">White Sakura Frost</span>
              </div>
            </div>
          </div>

          {/* Core Action Trigger button */}
          <button className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-sm uppercase py-4 rounded-xl tracking-wider transition-colors shadow-lg shadow-amber-500/10">
            Generate Build Spec Sheet
          </button>
        </div>

      </main>
    </div>
  );
}