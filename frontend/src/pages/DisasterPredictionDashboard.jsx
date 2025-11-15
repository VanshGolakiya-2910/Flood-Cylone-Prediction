import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Map from '../components/map/Map'; // <-- use your Map component
import Header from '../components/layout/Header';

const DisasterPredictionDashboard = () => {
  const [activeTab, setActiveTab] = useState('cyclone');
  const [cycloneData, setCycloneData] = useState(null);
  const [floodData, setFloodData] = useState([]);
  const [floodZones, setFloodZones] = useState([]);
  const [loadingCyclone, setLoadingCyclone] = useState(true);
  const [loadingFlood, setLoadingFlood] = useState(true);

  // Utility functions
  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'moderate':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getProbabilityBadge = (probability) => {
    if (probability >= 0.7) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (probability >= 0.5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getMapColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'moderate':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchCyclone = async () => {
      setLoadingCyclone(true);
      try {
        // Use ?latest=true to get only the most recent cyclone prediction
        const res = await axios.get('http://localhost:5000/api/cyclone?latest=true');
        const data = res.data.data;

        if (data) {
          setCycloneData({
            probability: data.probability ?? 0,
            firstPoint: data.firstPoint ?? (data.trajectory && data.trajectory[0]) ?? null,
            trajectory: data.trajectory || [],
            affectedStates: data.affectedStates || [],
            lastUpdated: data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A',
            latitude: data.firstPoint?.lat ? Number(data.firstPoint.lat).toFixed(4) + '°N' : 'N/A',
            longitude: data.firstPoint?.lng ? Number(data.firstPoint.lng).toFixed(4) + '°E' : 'N/A',
          });
        } else {
          setCycloneData(null);
        }
      } catch (err) {
        console.error('Error fetching cyclone data:', err);
        setCycloneData(null);
      } finally {
        setLoadingCyclone(false);
      }
    };

    const fetchFloods = async () => {
      setLoadingFlood(true);
      try {
        const res = await axios.get('http://localhost:5000/api/floods');
        const data = res.data.data;

        if (data && Array.isArray(data)) {
          setFloodData(
            data.map((flood, idx) => ({
              id: idx,
              location: flood.region,
              riskLevel: flood.risk,
              waterLevel: flood.waterLevel,
              dangerMark: flood.dangerMark,
              rainfall: flood.forecastedRainfall,
              affectedArea: flood.affected ? '~' + (flood.affected / 60).toLocaleString() + ' km²' : 'N/A',
              estimatedPeople: flood.estimatedPeople ?? 'N/A',
            }))
          );

          setFloodZones(
            data.flatMap((flood) =>
              (flood.landCoordinates || []).map((coord) => ({
                position: [coord.lat, coord.lng],
                risk: (flood.risk || 'unknown').toLowerCase(),
                name: flood.region,
              }))
            )
          );
        } else {
          setFloodData([]);
          setFloodZones([]);
        }
      } catch (err) {
        console.error('Error fetching flood data:', err);
        setFloodData([]);
        setFloodZones([]);
      } finally {
        setLoadingFlood(false);
      }
    };

    fetchCyclone();
    fetchFloods();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="mb-8 mt-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Disaster Prediction Center</h1>
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
          <>
            {loadingCyclone ? (
              <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                  <p className="text-white text-lg font-semibold">Loading Cyclone Prediction...</p>
                  <p className="text-slate-400 text-sm mt-2">Analyzing atmospheric data</p>
                </div>
              </div>
            ) : cycloneData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cyclone Data Panel */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">Cyclone Alert</h2>
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    {/* Probability Badge */}
                    <div className="mb-6">
                      <div className={`px-4 py-3 rounded-lg border ${getProbabilityBadge(cycloneData.probability)} text-center`}>
                        <p className="text-xs uppercase tracking-wide mb-1">Formation Probability</p>
                        <p className="text-3xl font-bold">{(cycloneData.probability * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Position */}
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Predicted Origin Point</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Latitude</span>
                            <span className="text-lg font-bold text-white">{cycloneData.latitude}</span>
                          </div>
                          <div className="w-full h-px bg-slate-700" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Longitude</span>
                            <span className="text-lg font-bold text-white">{cycloneData.longitude}</span>
                          </div>
                        </div>
                      </div>

                      {/* Affected States */}
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Potentially Affected States</p>
                        {cycloneData.affectedStates.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {cycloneData.affectedStates.map((state, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30">
                                {state}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No states identified yet</p>
                        )}
                      </div>

                      {/* Trajectory Info */}
                      {cycloneData.trajectory && cycloneData.trajectory.length > 0 && (
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Trajectory Information</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-500">Total Points</span>
                              <span className="text-lg font-bold text-white">{cycloneData.trajectory.length}</span>
                            </div>
                            {cycloneData.trajectory[0]?.time && cycloneData.trajectory[cycloneData.trajectory.length - 1]?.time && (
                              <>
                                <div className="w-full h-px bg-slate-700" />
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-slate-500">Duration</span>
                                  <span className="text-sm font-semibold text-white">
                                    {Math.round((new Date(cycloneData.trajectory[cycloneData.trajectory.length - 1].time) - new Date(cycloneData.trajectory[0].time)) / (1000 * 60 * 60))} hours
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="pt-3 border-t border-slate-700/50">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Prediction Generated</span>
                          <span className="text-slate-300">{cycloneData.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-200 font-medium mb-1">AI-Powered Prediction</p>
                        <p className="text-xs text-blue-300/70">This prediction is generated using machine learning models analyzing atmospheric patterns and historical data.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cyclone Map (now uses your Map component) */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Predicted Trajectory Path</h3>
                      {cycloneData.trajectory && cycloneData.trajectory.length > 0 && (
                        <span className="text-sm text-slate-400">{cycloneData.trajectory.length} trajectory points</span>
                      )}
                    </div>
                    <div className="rounded-lg overflow-hidden h-[600px]">
                      {/* Pass trajectory and firstPoint into your Map component */}
                      <Map trajectory={cycloneData.trajectory} firstPoint={cycloneData.firstPoint} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                  <svg className="w-20 h-20 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-white text-lg font-semibold">No Cyclone Prediction Available</p>
                  <p className="text-slate-400 text-sm mt-2">No active cyclone predictions at this time</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Flood Section remains the same and still uses inline MapContainer */}
        {activeTab === 'flood' && (
          <>
            {loadingFlood ? (
              <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-white text-lg font-semibold">Loading Flood Data...</p>
                  <p className="text-slate-400 text-sm mt-2">Fetching real-time flood information</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Flood Risk Zones</h2>
                    <div className="space-y-3">
                      {floodData.map((flood) => (
                        <div key={flood.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-white font-semibold text-sm">{flood.location}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getRiskColor(flood.riskLevel)}`}>{flood.riskLevel}</span>
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

                <div className="lg:col-span-2">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl h-full">
                    <h3 className="text-xl font-semibold text-white mb-4">Risk Assessment Map</h3>
                    <div className="rounded-lg overflow-hidden h-[600px]">
                      <MapContainer center={[20.5, 85.0]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                        {floodZones.map((zone, idx) => (
                          <React.Fragment key={idx}>
                            <CircleMarker center={zone.position} radius={25} fillColor={getMapColor(zone.risk)} color="transparent" weight={0} fillOpacity={0.15} />
                            <CircleMarker center={zone.position} radius={18} fillColor={getMapColor(zone.risk)} color="transparent" weight={0} fillOpacity={0.3} />
                            <CircleMarker center={zone.position} radius={12} fillColor={getMapColor(zone.risk)} color={getMapColor(zone.risk)} weight={2} fillOpacity={0.6}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default DisasterPredictionDashboard;
