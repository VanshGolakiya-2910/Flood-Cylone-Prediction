import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const lerp = (start, end, t) => start + (end - start) * t;

/**
 * Props:
 *  - trajectory: array of points. each point can be {lat, lng} or [lat, lng]
 *  - speed: animation speed multiplier (default 0.0002)
 *  - centerAtFirst: boolean - whether to center the map on first point (default true)
 */
const CycloneMap = ({ trajectory: propsTrajectory = [], speed = 0.0002, centerAtFirst = true }) => {
  const [trajectory, setTrajectory] = useState([]); // normalized: [[lat, lng], ...]
  const [currentPosition, setCurrentPosition] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  const currentIndex = useRef(0);
  const t = useRef(0); // continuous progress accumulator (consumed when >=1)
  const rafIdRef = useRef(null);

  // Normalize incoming propsTrajectory to internal [[lat, lng], ...] form
  useEffect(() => {
    if (!propsTrajectory || !Array.isArray(propsTrajectory) || propsTrajectory.length === 0) {
      setTrajectory([]);
      setCurrentPosition(null);
      return;
    }

    const normalized = propsTrajectory
      .map((p) => {
        if (Array.isArray(p) && p.length >= 2) return [Number(p[0]), Number(p[1])];
        if (p && typeof p === 'object' && p.lat != null && p.lng != null) return [Number(p.lat), Number(p.lng)];
        if (p && (p.latitude != null || p.lat != null)) {
          const lat = p.lat ?? p.latitude;
          const lng = p.lng ?? p.longitude ?? p.lon ?? p.long;
          return [Number(lat), Number(lng)];
        }
        return null;
      })
      .filter(Boolean);

    setTrajectory(normalized);
    if (normalized.length > 0) {
      setCurrentPosition(normalized[0]);
      currentIndex.current = 0;
      t.current = 0;
    } else {
      setCurrentPosition(null);
    }
  }, [propsTrajectory]);

  // Smooth animation loop (handles t overflowing and advances index in a loop)
  useEffect(() => {
    // cleanup previous RAF if any
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (!trajectory || trajectory.length === 0) return;

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      // accumulate progress (delta * speed)
      t.current += delta * speed;

      // consume whole-segment units from t
      while (t.current >= 1) {
        t.current -= 1;
        currentIndex.current += 1;
        if (currentIndex.current >= trajectory.length - 1) {
          // reached end — snap to final point and stop
          setCurrentPosition(trajectory[trajectory.length - 1]);
          rafIdRef.current = null;
          return;
        }
      }

      const start = trajectory[currentIndex.current];
      const end = trajectory[currentIndex.current + 1];

      if (!start || !end) {
        setCurrentPosition(trajectory[trajectory.length - 1]);
        rafIdRef.current = null;
        return;
      }

      const lat = lerp(start[0], end[0], t.current);
      const lng = lerp(start[1], end[1], t.current);
      setCurrentPosition([lat, lng]);

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [trajectory, speed]);

  if (!trajectory.length || !currentPosition) {
    return <div className="text-white text-center mt-20">Loading cyclone data...</div>;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <style>
        {`
          @keyframes dash { to { stroke-dashoffset: -50; } }
          .animate-dash { animation: dash 2s linear infinite; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Cyclone Trajectory Tracker</h1>
          <p className="text-slate-300 text-lg">Real-time monitoring and path prediction</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
          <MapContainer
            center={centerAtFirst ? trajectory[0] : currentPosition}
            zoom={6}
            style={{ height: '600px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

            {/* Trail glow / path */}
            <Polyline positions={trajectory} color="#fbbf24" weight={16} opacity={0.15} />
            <Polyline positions={trajectory} color="#f97316" weight={10} opacity={0.3} />
            <Polyline positions={trajectory} color="#ef4444" weight={6} opacity={0.5} />
            <Polyline positions={trajectory} color="#dc2626" weight={3} opacity={0.9} dashArray="15,10" className="animate-dash" />
            <Polyline positions={trajectory} color="#ffffff" weight={1.5} opacity={0.6} />

            {/* Current animated marker (CircleMarker) with layered glow */}
            {/* Outer faint glow */}
            <CircleMarker center={currentPosition} radius={28} fillColor="#ef4444" color="transparent" weight={0} fillOpacity={0.08} />
            <CircleMarker center={currentPosition} radius={20} fillColor="#ef4444" color="transparent" weight={0} fillOpacity={0.12} />
            {/* Core marker */}
            <CircleMarker center={currentPosition} radius={10} fillColor="#ef4444" color="#dc2626" weight={2} fillOpacity={0.9} />
          </MapContainer>

          {/* Toggle legend button */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 shadow-xl hover:bg-slate-800/90 transition-all duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {showLegend && (
            <div className="absolute bottom-6 left-20 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white font-semibold">Cyclone Status: Active</span>
                </div>
                <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-white transition-colors ml-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-4 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded blur-sm opacity-50" />
                    <div className="absolute inset-0 w-4 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded" />
                  </div>
                  <span className="text-slate-300">Projected Path</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-red-600 blur-sm opacity-40" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-600 border-2 border-red-900" />
                    <div className="absolute inset-1 w-2 h-2 rounded-full bg-white opacity-70" />
                  </div>
                  <span className="text-slate-300">Current Position</span>
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
