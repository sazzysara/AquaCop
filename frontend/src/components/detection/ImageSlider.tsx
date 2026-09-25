import React, { useState, useRef } from 'react';
import { Columns, SplitSquareVertical } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeDate: string;
  afterDate: string;
  changedAreaSqM: number;
  changeType: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  beforeImage,
  afterImage,
  beforeDate,
  afterDate,
  changedAreaSqM,
  changeType
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  return (
    <div className="space-y-2">
      {/* Controls Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-200">Satellite Change Analysis</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
            {changeType} (+{changedAreaSqM} m²)
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded p-0.5">
          <button
            onClick={() => setViewMode('slider')}
            className={`p-1 rounded text-xs flex items-center space-x-1 ${
              viewMode === 'slider' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Split Slider Mode"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium hidden sm:inline">Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`p-1 rounded text-xs flex items-center space-x-1 ${
              viewMode === 'side-by-side' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Side-by-Side Comparison"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium hidden sm:inline">Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="relative w-full h-56 md:h-64 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 cursor-ew-resize select-none touch-none"
        >
          {/* After Image (Background) */}
          <img
            src={afterImage}
            alt="After satellite observation"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Before Image (Clipped Overlay) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeImage}
              alt="Before satellite observation"
              className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%'
              }}
            />
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-sky-400 pointer-events-none shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold">
              ↔
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-sky-300 text-[10px] font-mono border border-sky-500/30 backdrop-blur-sm">
            BEFORE: {beforeDate}
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/90 text-rose-300 text-[10px] font-mono border border-rose-500/30 backdrop-blur-sm">
            AFTER: {afterDate}
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-2 gap-2">
          <div className="relative rounded-lg overflow-hidden border border-slate-700 h-48 bg-slate-950">
            <img src={beforeImage} alt="Before observation" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-sky-300 text-[10px] font-mono border border-sky-500/30">
              BEFORE: {beforeDate}
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-slate-700 h-48 bg-slate-950">
            <img src={afterImage} alt="After observation" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-rose-300 text-[10px] font-mono border border-rose-500/30">
              AFTER: {afterDate}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Helper Text */}
      <p className="text-[10px] text-slate-400 text-center">
        {viewMode === 'slider'
          ? 'Drag the slider handle left/right to inspect construction footprint expansion against baseline.'
          : 'Dual synchronized view of the monitored parcel boundary.'}
      </p>
    </div>
  );
};
