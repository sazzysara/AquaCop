import React, { useState, useRef } from 'react';
import { Columns, SplitSquareVertical } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeDate?: string;
  afterDate?: string;
  beforeLabel?: string;
  afterLabel?: string;
  changedAreaSqM?: number;
  changeType?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  beforeImage,
  afterImage,
  beforeDate,
  afterDate,
  beforeLabel,
  afterLabel,
  changedAreaSqM,
  changeType
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const labelBefore = beforeLabel || beforeDate || 'Jan 2025 (Baseline)';
  const labelAfter = afterLabel || afterDate || 'Apr 2025 (Encroachment)';

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
          <span className="font-bold text-slate-800">Satellite Change Analysis</span>
          {changeType && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">
              {changeType} {changedAreaSqM ? `(+${changedAreaSqM} m²)` : ''}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('slider')}
            className={`p-1 rounded text-xs flex items-center space-x-1 ${
              viewMode === 'slider' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Split Slider Mode"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`p-1 rounded text-xs flex items-center space-x-1 ${
              viewMode === 'side-by-side' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Side-by-Side Mode"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="relative h-60 w-full overflow-hidden rounded-xl border border-slate-300 shadow-inner select-none cursor-ew-resize bg-slate-100"
        >
          {/* AFTER Image (Full background) */}
          <img
            src={afterImage}
            alt="After change observation"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* BEFORE Image (Clipped overlay) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeImage}
              alt="Before change observation"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%'
              }}
            />
          </div>

          {/* Slider Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border border-slate-300 shadow-lg flex items-center justify-center text-slate-700">
              <SplitSquareVertical className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>

          {/* Overlay Labels */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white pointer-events-none z-10">
            {labelBefore}
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600/90 text-[10px] font-mono text-white font-bold pointer-events-none z-10">
            {labelAfter}
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-2 gap-2">
          <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200">
            <img
              src={beforeImage}
              alt="Before observation"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
              {labelBefore}
            </div>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden border border-rose-300 ring-2 ring-rose-400/30">
            <img
              src={afterImage}
              alt="After observation"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-600 text-[9px] font-mono text-white font-bold">
              {labelAfter}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
