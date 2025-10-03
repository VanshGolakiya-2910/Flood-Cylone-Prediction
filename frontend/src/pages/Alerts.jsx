import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import { dataAPI } from '../services/api';
import { MoreHorizontal, Search } from 'lucide-react';

const Pill = ({ children, color = 'bg-secondary-700', text = 'text-white' }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs ${color} ${text}`}>{children}</span>
);

const Alerts = () => {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dataAPI.getAlerts();
        setAlerts(res.data.data);
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
        <div className="px-4 sm:px-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-secondary-200">
              <span className="h-2 w-2 rounded-full bg-primary-500"></span>
              <span className="font-semibold">Alert Page</span>
              <span className="text-secondary-400">Early Disaster Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary-400" />
                <input className="pl-9 pr-3 py-2 rounded-md bg-secondary-800 border border-secondary-700 text-sm text-white placeholder-secondary-400" placeholder="Search..." />
              </div>
              <button className="px-3 py-2 rounded-md bg-primary-600 text-white text-sm">Sorted</button>
            </div>
          </div>

          <h2 className="text-white text-xl font-bold mb-4">Active Alerts Prediction</h2>

          <div className="grid grid-cols-12 gap-4">
            {/* Left large red card */}
            <div className="col-span-12 md:col-span-4">
              <div className="card bg-gradient-to-br from-rose-500 to-rose-400 border-0 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">Active Alerts</p>
                    <p className="text-lg font-semibold">Flood</p>
                    <div className="flex gap-2 mt-2">
                      <Pill color="bg-white/20">New</Pill>
                      <Pill color="bg-white/20">High</Pill>
                    </div>
                  </div>
                  <MoreHorizontal className="opacity-80" />
                </div>
                <div className="flex justify-end mt-10">
                  <div className="text-right">
                    <p className="text-2xl font-bold">50 s</p>
                    <p className="text-sm opacity-80">Issued</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle blue card */}
            <div className="col-span-12 md:col-span-5">
              <div className="card bg-gradient-to-br from-blue-600 to-blue-500 border-0 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="opacity-90 text-sm">Flood</p>
                    <p className="text-lg font-bold">Cyclone</p>
                    <p className="opacity-90 text-xs mt-3">LG AiO Cysteri</p>
                    <p className="opacity-90 text-xs">This simulation <span className="font-semibold">30.6h</span></p>
                  </div>
                  <MoreHorizontal className="opacity-80" />
                </div>
                <div className="mt-8 h-16 rounded-lg bg-white/10 grid place-items-center">
                  <div className="h-8 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                </div>
              </div>
            </div>

            {/* Right acute alerts map card */}
            <div className="col-span-12 md:col-span-3">
              <div className="card bg-gradient-to-b from-white/80 to-white/60 text-secondary-800 border-0 relative">
                <span className="absolute top-3 right-3 bg-primary-600 text-white text-xs px-2 py-0.5 rounded">Acute Alerts</span>
                <div className="h-60 relative rounded bg-white/60">
                  {(alerts?.acuteMap?.points || []).map((p, i) => (
                    <span key={i} className="absolute rounded" style={{ left: `${p.x}%`, top: `${p.y}%`, width: 24, height: 18, background: p.color }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Lower row two cards */}
            <div className="col-span-12 md:col-span-4">
              <div className="card">
                <div className="flex justify-between">
                  <div>
                    <p className="text-secondary-300 text-sm">Active Alerts</p>
                    <p className="text-white text-2xl font-semibold">37.6h</p>
                    <div className="flex gap-2 mt-2">
                      <Pill>Low</Pill>
                      <Pill>High</Pill>
                    </div>
                    <div className="mt-3">
                      <Pill color="bg-rose-500/20" text="text-rose-300">Reduced</Pill>
                    </div>
                  </div>
                  <div className="text-right text-secondary-300">
                    <p>254 lms</p>
                    <p className="text-xs">Issued</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5">
              <div className="card">
                <p className="text-secondary-300 text-sm">Cyclone</p>
                <p className="text-white text-2xl font-semibold">20.8h</p>
                <div className="flex gap-2 mt-2">
                  <Pill>Low</Pill>
                  <Pill>High</Pill>
                </div>
                <div className="mt-4 flex justify-end text-secondary-300">
                  <div className="text-right">
                    <p>189 lms</p>
                    <p className="text-xs">Issued</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Past Alerts split */}
            <div className="col-span-12 md:col-span-4">
              <h3 className="text-white font-semibold mb-2">Past Alerts</h3>
              <div className="card">
                <div className="flex justify-between">
                  <div>
                    <p className="text-secondary-300 text-sm">Active Alerts</p>
                    <p className="text-white text-2xl font-semibold">41.6h</p>
                    <div className="flex gap-2 mt-2">
                      <Pill>Low</Pill>
                      <Pill>High</Pill>
                    </div>
                    <div className="mt-3">
                      <Pill color="bg-rose-500/20" text="text-rose-300">Reduced</Pill>
                    </div>
                  </div>
                  <div className="text-right text-secondary-300">
                    <p>330 lms</p>
                    <p className="text-xs">Issued</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5">
              <h3 className="text-white font-semibold mb-2">Past Alerts</h3>
              <div className="card bg-gradient-to-br from-blue-600 to-blue-500 border-0 text-white">
                <p className="opacity-90 text-sm">Flood</p>
                <p className="text-lg font-bold">Cyclone</p>
                <p className="opacity-90 text-xs mt-3">LG AiO Cysteri</p>
                <p className="opacity-90 text-xs">This simulation <span className="font-semibold">10.6h</span></p>
                <div className="mt-6 flex justify-between">
                  <Pill color="bg-white/20">Flooded</Pill>
                  <div className="h-6 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3">
              <h3 className="text-white font-semibold mb-2">Past Alerts</h3>
              <div className="card divide-y divide-secondary-700">
                {(alerts?.past || []).slice(1).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary-200">
                      <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-white/90 font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;



