import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Map from '../components/map/Map'
// Mock data for cyclone prediction
const cycloneData = {
  name: "Cyclone",
  speed: "85 km/h",
  latitude: "21.5°N",
  longitude: "86.5°E",
  intensity: "Severe Cyclonic Storm",
  direction: "North-Northeast",
  pressure: "982 hPa",
  lastUpdated: "2 hours ago"
};

// Mock data for flood predictions
const floodData = [
  {
    id: 1,
    location: "Brahmaputra River Basin",
    riskLevel: "High",
    waterLevel: "8.5m",
    dangerMark: "7.2m",
    rainfall: "185mm (24h)",
    affectedArea: "~2,500 km²",
    estimatedPeople: "150,000"
  },
  {
    id: 2,
    location: "Mahanadi Delta Region",
    riskLevel: "Moderate",
    waterLevel: "6.2m",
    dangerMark: "6.8m",
    rainfall: "95mm (24h)",
    affectedArea: "~1,200 km²",
    estimatedPeople: "45,000"
  },
  {
    id: 3,
    location: "Godavari Downstream",
    riskLevel: "Low",
    waterLevel: "4.8m",
    dangerMark: "6.5m",
    rainfall: "42mm (24h)",
    affectedArea: "~400 km²",
    estimatedPeople: "12,000"
  }
];

// Flood zones for map
const floodZones = [
  { position: [26.8, 92.8], risk: "high", name: "Brahmaputra Basin" },
  { position: [20.3, 85.8], risk: "moderate", name: "Mahanadi Delta" },
  { position: [16.8, 81.5], risk: "low", name: "Godavari Downstream" }
];

const DisasterPredictionDashboard = () => {
  const [activeTab, setActiveTab] = useState('cyclone');

  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getRiskDotColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMapColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'moderate': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Disaster Prediction Center
          </h1>
          {/* <p className="text-slate-300 text-lg">Real-time monitoring and forecasting system</p> */}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('cyclone')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'cyclone'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/70 border border-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cyclone Prediction</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('flood')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'flood'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/70 border border-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Flood Prediction</span>
            </div>
          </button>
        </div>

        {/* Cyclone Section */}
        {activeTab === 'cyclone' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cyclone Data Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{cycloneData.name}</h2>
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                </div>
                
                <div className="space-y-4">
                  {/* <div className={`px-4 py-3 rounded-lg border ${getRiskColor(cycloneData.intensity.split(' ')[0])}`}>
                    <p className="text-xs uppercase tracking-wide opacity-70 mb-1">Intensity</p>
                    <p className="text-lg font-semibold">{cycloneData.intensity}</p>
                  </div> */}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Speed</p>
                      <p className="text-xl font-bold text-white">{cycloneData.speed}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Direction</p>
                      <p className="text-xl font-bold text-white">{cycloneData.direction}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Position</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Latitude</p>
                        <p className="text-lg font-bold text-white">{cycloneData.latitude}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-700"></div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Longitude</p>
                        <p className="text-lg font-bold text-white">{cycloneData.longitude}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Pressure</p>
                    <p className="text-xl font-bold text-white">{cycloneData.pressure}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400">Last Updated: {cycloneData.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cyclone Map */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl h-full">
                <h3 className="text-xl font-semibold text-white mb-4">Trajectory Map</h3>
                <div className="rounded-lg overflow-hidden h-[600px]">
                    <Map/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flood Section */}
        {activeTab === 'flood' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Flood Data Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Flood Risk Zones</h2>
                
                <div className="space-y-3">
                  {floodData.map((flood) => (
                    <div key={flood.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold text-sm">{flood.location}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getRiskColor(flood.riskLevel)}`}>
                          {flood.riskLevel}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Water Level:</span>
                          <span className="text-white font-semibold">{flood.waterLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Danger Mark:</span>
                          <span className="text-white font-semibold">{flood.dangerMark}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rainfall (24h):</span>
                          <span className="text-white font-semibold">{flood.rainfall}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Affected Area:</span>
                          <span className="text-white font-semibold">{flood.affectedArea}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Est. People:</span>
                          <span className="text-white font-semibold">{flood.estimatedPeople}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flood Map */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl h-full">
                <h3 className="text-xl font-semibold text-white mb-4">Risk Assessment Map</h3>
                <div className="rounded-lg overflow-hidden h-[600px]">
                  <MapContainer
                    center={[20.5, 85.0]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {floodZones.map((zone, idx) => (
                      <React.Fragment key={idx}>
                        <CircleMarker
                          center={zone.position}
                          radius={25}
                          fillColor={getMapColor(zone.risk)}
                          color="transparent"
                          weight={0}
                          fillOpacity={0.15}
                        />
                        <CircleMarker
                          center={zone.position}
                          radius={18}
                          fillColor={getMapColor(zone.risk)}
                          color="transparent"
                          weight={0}
                          fillOpacity={0.3}
                        />
                        <CircleMarker
                          center={zone.position}
                          radius={12}
                          fillColor={getMapColor(zone.risk)}
                          color={getMapColor(zone.risk)}
                          weight={2}
                          fillOpacity={0.6}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-bold">{zone.name}</p>
                              <p>Risk Level: <span className="capitalize">{zone.risk}</span></p>
                            </div>
                          </Popup>
                        </CircleMarker>
                      </React.Fragment>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterPredictionDashboard;