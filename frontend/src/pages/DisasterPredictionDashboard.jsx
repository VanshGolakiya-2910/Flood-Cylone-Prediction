import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Map from '../components/map/Map';
import Header from '../components/layout/Header';

const DisasterPredictionDashboard = () => {
  const [activeTab, setActiveTab] = useState('cyclone');
  const [cycloneData, setCycloneData] = useState(null);
  const [floodData, setFloodData] = useState([]);
  const [floodZones, setFloodZones] = useState([]);

  // Utility functions
  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
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

  // Fetch data from APIs
  useEffect(() => {
    const fetchCyclone = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cyclone');
        const data = res.data.data;

        setCycloneData({
          name: data.name,
          speed: data.windSpeed,
          direction: data.trajectory.length > 1 ? 
                     `${data.trajectory[1].lat - data.trajectory[0].lat >= 0 ? 'North' : 'South'}-${data.trajectory[1].lng - data.trajectory[0].lng >= 0 ? 'East' : 'West'}` 
                     : 'Unknown',
          latitude: data.trajectory[0]?.lat + '°N',
          longitude: data.trajectory[0]?.lng + '°E',
          pressure: data.pressure || 'N/A',
          lastUpdated: new Date(data.lastUpdated).toLocaleString(),
          trajectory: data.trajectory
        });
      } catch (err) {
        console.error('Error fetching cyclone data:', err);
      }
    };

    const fetchFloods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/floods');
        const data = res.data.data;

        setFloodData(
          data.map((flood, idx) => ({
            id: idx,
            location: flood.region,
            riskLevel: flood.risk,
            waterLevel: flood.waterLevel,
            dangerMark: flood.dangerMark,
            rainfall: flood.forecastedRainfall,
            affectedArea: '~' + (flood.affected / 60).toLocaleString() + ' km²', // optional approximation
            estimatedPeople: flood.estimatedPeople
          }))
        );

        setFloodZones(
          data.flatMap(flood => flood.landCoordinates.map(coord => ({
            position: [coord.lat, coord.lng],
            risk: flood.risk.toLowerCase(),
            name: flood.region
          })))
        );
      } catch (err) {
        console.error('Error fetching flood data:', err);
      }
    };

    fetchCyclone();
    fetchFloods();
  }, []);

  if (!cycloneData && activeTab === 'cyclone') {
    return <div className="text-white text-center mt-20">Loading Cyclone Data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Disaster Prediction Center
          </h1>
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
        {activeTab === 'cyclone' && cycloneData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cyclone Data Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{cycloneData.name}</h2>
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                </div>
                
                <div className="space-y-4">
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
                    <Map trajectory={cycloneData.trajectory}/>
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
