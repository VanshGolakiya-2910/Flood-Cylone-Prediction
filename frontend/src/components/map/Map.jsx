import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CycloneSVG from '../../assets/SVG/cyclone.svg';
const staticPath = [
  [20.5, 85.5],
  [21.0, 86.0],
  [21.5, 86.5],
  [22.0, 87.0],
  [22.5, 87.5],
];

const lerp = (start, end, t) => start + (end - start) * t;

const CycloneMap = () => {
  const [currentPosition, setCurrentPosition] = useState(staticPath[0]);
  const [showLegend, setShowLegend] = useState(false);
  const currentIndex = useRef(0);
  const t = useRef(0);
  // Memoize the icon once
  const cycloneIcon = useRef(L.icon({
    iconUrl: CycloneSVG,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  }));

  useEffect(() => {
    const step = 0.02;
    const interval = setInterval(() => {
      const start = staticPath[currentIndex.current];
      const end = staticPath[currentIndex.current + 1];

      if (!end) {
        clearInterval(interval);
        return;
      }

      t.current += step;

      if (t.current >= 1) {
        t.current = 0;
        currentIndex.current += 1;
      }

      const lat = lerp(start[0], end[0], t.current);
      const lng = lerp(start[1], end[1], t.current);

      setCurrentPosition([lat, lng]);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -50;
            }
          }
          .animate-dash {
            animation: dash 2s linear infinite;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Cyclone Trajectory Tracker
          </h1>
          <p className="text-slate-300 text-lg">Real-time monitoring and path prediction</p>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
          <MapContainer
            center={staticPath[0]}
            zoom={6}
            style={{ height: '600px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Outer glow layer - widest */}
            <Polyline 
              positions={staticPath} 
              color="#fbbf24" 
              weight={16} 
              opacity={0.15}
            />
            
            {/* Middle glow layer */}
            <Polyline 
              positions={staticPath} 
              color="#f97316" 
              weight={10} 
              opacity={0.3}
            />
            
            {/* Inner glow layer */}
            <Polyline 
              positions={staticPath} 
              color="#ef4444" 
              weight={6} 
              opacity={0.5}
            />
            
            {/* Main trajectory line with animated dash */}
            <Polyline 
              positions={staticPath} 
              color="#dc2626" 
              weight={3} 
              opacity={0.9}
              dashArray="15,10"
              className="animate-dash"
            />
            
            {/* Bright core line */}
            <Polyline 
              positions={staticPath} 
              color="#ffffff" 
              weight={1.5} 
              opacity={0.6}
            />

            {/* SVG Cyclone eye */}
           <Marker position={currentPosition} icon={cycloneIcon.current} />


            {/* Enhanced trail markers with gradient colors */}
            {staticPath.map((pos, idx) => {
              const isPast = idx < currentIndex.current || 
                            (idx === currentIndex.current && t.current > 0.5);
              const isCurrent = idx === currentIndex.current;
              const progress = idx / (staticPath.length - 1);
              
              return (
                <React.Fragment key={idx}>
                  {/* Outer glow ring */}
                  <CircleMarker
                    center={pos}
                    radius={isCurrent ? 18 : 12}
                    fillColor={isPast ? "#dc2626" : "#fb923c"}
                    color="transparent"
                    weight={0}
                    fillOpacity={0.15}
                  />
                  
                  {/* Middle glow ring */}
                  <CircleMarker
                    center={pos}
                    radius={isCurrent ? 12 : 9}
                    fillColor={isPast ? "#ef4444" : "#fbbf24"}
                    color="transparent"
                    weight={0}
                    fillOpacity={0.3}
                  />
                  
                  {/* Main marker */}
                  <CircleMarker
                    center={pos}
                    radius={isCurrent ? 9 : 6}
                    fillColor={isPast ? "#dc2626" : "#fb923c"}
                    color={isPast ? "#7f1d1d" : "#c2410c"}
                    weight={2}
                    fillOpacity={isPast ? 0.9 : 0.7}
                    opacity={1}
                  />
                  
                  {/* Inner bright core */}
                  <CircleMarker
                    center={pos}
                    radius={isCurrent ? 5 : 3}
                    fillColor="#ffffff"
                    color="transparent"
                    weight={0}
                    fillOpacity={0.8}
                  />

                  {/* Pulsing effect for current position */}
                  {isCurrent && (
                    <>
                      <CircleMarker
                        center={pos}
                        radius={20}
                        fillColor="#ef4444"
                        color="transparent"
                        weight={0}
                        fillOpacity={0.2}
                        className="animate-pulse"
                      />
                      <CircleMarker
                        center={pos}
                        radius={15}
                        fillColor="#fbbf24"
                        color="#f97316"
                        weight={2}
                        fillOpacity={0.15}
                        opacity={0.6}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </MapContainer>
          
          {/* Toggle button for legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 shadow-xl hover:bg-slate-800/90 transition-all duration-200"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </button>
          
          {/* Info overlay - toggleable */}
          {showLegend && (
            <div className="absolute bottom-6 left-20 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-white font-semibold">Cyclone Status: Active</span>
                </div>
                <button 
                  onClick={() => setShowLegend(false)}
                  className="text-slate-400 hover:text-white transition-colors ml-4"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-4 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded blur-sm opacity-50"></div>
                    <div className="absolute inset-0 w-4 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded"></div>
                  </div>
                  <span className="text-slate-300">Projected Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-red-600 blur-sm opacity-40"></div>
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-600 border-2 border-red-900"></div>
                    <div className="absolute inset-1 w-2 h-2 rounded-full bg-white opacity-70"></div>
                  </div>
                  <span className="text-slate-300">Traversed Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-orange-400 blur-sm opacity-40"></div>
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-orange-400 border-2 border-orange-600"></div>
                    <div className="absolute inset-1 w-2 h-2 rounded-full bg-white opacity-70"></div>
                  </div>
                  <span className="text-slate-300">Upcoming Points</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CycloneMap;