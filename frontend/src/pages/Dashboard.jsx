import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CloudRain,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { dataAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dataAPI.getDashboard();
        setDashboard(res.data.data);
      } catch (e) {
        console.error('Failed to load dashboard', e);
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-secondary-900">
      <Header />
      <main className="max-w-[1200px] mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-2 sm:px-0">
          <div className="rounded-lg p-2">
            <h1 className="text-2xl font-semibold text-white mb-1">Welcome back, {user?.name}!</h1>
            <p className="text-secondary-300 mb-4">Real-time visualization of flood zones, cyclone paths, and risk areas.</p>

            {/* Grid layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left widgets */}
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-secondary-300 text-sm">Rainfall</p>
                      <p className="text-3xl font-bold text-white">{dashboard?.schedule?.rainfallPercent ?? '--'}%</p>
                      <p className="text-secondary-400 text-xs">{dashboard?.schedule?.note}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-secondary-700" />
                  </div>
                </div>

                <div className="card">
                  <p className="text-sm text-secondary-300 mb-2">Wind Speed</p>
                  <p className="text-3xl font-bold text-white">{dashboard?.wind?.speed ?? '--'}°</p>
                  <p className="text-secondary-400 text-xs">{dashboard?.wind?.altitude}</p>
                </div>

                <div className="card">
                  <p className="text-sm text-secondary-300 mb-3">Temperature</p>
                  <div className="flex items-end space-x-2 h-24">
                    {(dashboard?.temperatureSeries || []).map((t, i) => (
                      <div key={i} className="flex flex-col items-center justify-end">
                        <div className="w-3 bg-gradient-to-t from-amber-500 to-orange-400" style={{ height: `${t.value}px` }} />
                        <span className="text-[10px] text-secondary-400 mt-1">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center map placeholder */}
              <div className="col-span-12 lg:col-span-6">
                <div className="card h-[380px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <button className="px-3 py-1 bg-secondary-700 text-white rounded">Layers</button>
                    <button className="px-3 py-1 bg-secondary-700 text-white rounded">My Location</button>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto h-28 w-28 rounded-full border-4 border-secondary-600 grid place-items-center text-white">
                      Interactive<br />Map
                    </div>
                    <p className="text-secondary-300 text-sm mt-3">Click on regions for detailed predictions.</p>
                  </div>
                  <div className="absolute bottom-3 left-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-secondary-300"><span className="h-2 w-2 rounded-full bg-red-500"></span>High Risk</div>
                    <div className="flex items-center gap-2 text-xs text-secondary-300"><span className="h-2 w-2 rounded-full bg-amber-500"></span>Medium Risk</div>
                    <div className="flex items-center gap-2 text-xs text-secondary-300"><span className="h-2 w-2 rounded-full bg-green-500"></span>Low Risk</div>
                  </div>
                </div>
              </div>

              {/* Right widgets */}
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="card">
                  <p className="text-sm text-secondary-300 mb-2">Cyclone Stibs</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-secondary-400 text-xs">Humidity</p>
                      <p className="text-2xl font-semibold text-white">{dashboard?.cycloneStats?.humidityPercent ?? '--'}%</p>
                    </div>
                    <div>
                      <p className="text-secondary-400 text-xs">Temperature</p>
                      <p className="text-2xl font-semibold text-white">{dashboard?.cycloneStats?.temperaturePercent ?? '--'}%</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <p className="text-sm text-secondary-300 mb-2">Emergency</p>
                  <div className="space-y-2">
                    {(dashboard?.emergencyTips || []).map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-secondary-200 text-sm">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>{tip.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom charts */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card h-64">
                  <p className="text-sm text-secondary-300 mb-4">Cyclone Trajectory & Intensity</p>
                  <div className="flex items-end gap-4 h-40">
                    {(dashboard?.cycloneTrajectory || []).map((v, i) => (
                      <div key={i} className="w-8 bg-primary-500/40 border border-primary-500" style={{ height: `${(v/2)}px` }} />
                    ))}
                  </div>
                </div>
                <div className="card h-64">
                  <p className="text-sm text-secondary-300 mb-4">Water Level Prediction</p>
                  <div className="h-40 w-full relative">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                      <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={(dashboard?.waterLevelPrediction||[]).map((y,i)=>`${i*(100/6)},${40 - (y*10)}`).join(' ')} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
