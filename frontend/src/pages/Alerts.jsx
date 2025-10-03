import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Search, Bell, AlertTriangle, Waves, Wind, X, Plus } from 'lucide-react';

const Pill = ({ children, color = 'bg-blue-500/20', text = 'text-blue-300' }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color} ${text}`}>{children}</span>
);

const AlertModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    country: 'India',
    state: 'Gujarat',
    message: '',
    type: 'flood'
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Create New Alert</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Alert Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'flood' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'flood'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <Waves className={`w-6 h-6 mx-auto mb-2 ${formData.type === 'flood' ? 'text-blue-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${formData.type === 'flood' ? 'text-blue-300' : 'text-gray-400'}`}>
                  Flood
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'cyclone' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'cyclone'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <Wind className={`w-6 h-6 mx-auto mb-2 ${formData.type === 'cyclone' ? 'text-purple-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${formData.type === 'cyclone' ? 'text-purple-300' : 'text-gray-400'}`}>
                  Cyclone
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Alert Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
              placeholder="Enter alert message..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all font-medium shadow-lg shadow-red-500/20"
            >
              Create Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Alerts = () => {
  const [alerts, setAlerts] = useState({ active: [], past: [] });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateAlert = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/alerts/area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: formData.country,
          state: formData.state,
          message: formData.message
        })
      });

      if (response.ok) {
        showNotification('Alert created successfully!', 'success');
        setIsModalOpen(false);
      } else {
        showNotification('Failed to create alert', 'error');
      }
    } catch (error) {
      showNotification('Error creating alert', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.message}
          </div>
        </div>
      )}

      <AlertModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAlert}
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Alert Management</h1>
              <p className="text-gray-400 text-sm">Early Disaster Prediction & Response</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                className="pl-9 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors w-64" 
                placeholder="Search alerts..." 
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20"
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Waves className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Active Flood Alerts</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">3 Active</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 border border-blue-500/20 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Severe Flood</p>
                    <p className="text-blue-100 text-sm">Gujarat Region</p>
                  </div>
                </div>
                <MoreHorizontal className="text-white/80 cursor-pointer" />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Pill color="bg-red-500/30" text="text-red-100">Critical</Pill>
                  <Pill color="bg-white/20" text="text-white">New</Pill>
                </div>
                
                <p className="text-blue-50 text-sm">Heavy rainfall causing severe flooding in low-lying areas. Immediate evacuation recommended.</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white font-bold text-2xl">50s</p>
                    <p className="text-blue-100 text-xs">Issued</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xl">254 lms</p>
                    <p className="text-blue-100 text-xs">Affected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 border border-cyan-500/20 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Moderate Flood</p>
                    <p className="text-cyan-100 text-sm">Coastal Areas</p>
                  </div>
                </div>
                <MoreHorizontal className="text-white/80 cursor-pointer" />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Pill color="bg-orange-500/30" text="text-orange-100">High</Pill>
                  <Pill color="bg-white/20" text="text-white">Active</Pill>
                </div>
                
                <p className="text-cyan-50 text-sm">Rising water levels detected. Residents should prepare for possible evacuation.</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white font-bold text-2xl">2.5h</p>
                    <p className="text-cyan-100 text-xs">Issued</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xl">189 lms</p>
                    <p className="text-cyan-100 text-xs">Affected</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 border border-teal-500/20 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Flash Flood</p>
                    <p className="text-teal-100 text-sm">Mountain Region</p>
                  </div>
                </div>
                <MoreHorizontal className="text-white/80 cursor-pointer" />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Pill color="bg-yellow-500/30" text="text-yellow-100">Medium</Pill>
                  <Pill color="bg-white/20" text="text-white">Monitoring</Pill>
                </div>
                
                <p className="text-teal-50 text-sm">Potential flash flooding due to heavy rainfall upstream. Stay alert.</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white font-bold text-2xl">1.2h</p>
                    <p className="text-teal-100 text-xs">Issued</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xl">142 lms</p>
                    <p className="text-teal-100 text-xs">Affected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Active Cyclone Alerts</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">2 Active</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 border border-purple-500/20 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Wind className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Cyclone Biparjoy</p>
                    <p className="text-purple-100 text-sm">Arabian Sea</p>
                  </div>
                </div>
                <MoreHorizontal className="text-white/80 cursor-pointer" />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Pill color="bg-red-500/30" text="text-red-100">Severe</Pill>
                  <Pill color="bg-white/20" text="text-white">Tracking</Pill>
                </div>
                
                <p className="text-purple-50 text-sm">Category 3 cyclone approaching coastal regions. Expected landfall in 30.6h.</p>
                
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-100 text-xs">Wind Speed</span>
                    <span className="text-white font-bold">185 km/h</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                  <div>
                    <p className="text-white font-bold text-xl">30.6h</p>
                    <p className="text-purple-100 text-xs">ETA Landfall</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">High Risk</p>
                    <p className="text-purple-100 text-xs">Severity</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 border border-indigo-500/20 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Wind className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Tropical Storm</p>
                    <p className="text-indigo-100 text-sm">Bay of Bengal</p>
                  </div>
                </div>
                <MoreHorizontal className="text-white/80 cursor-pointer" />
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Pill color="bg-orange-500/30" text="text-orange-100">Moderate</Pill>
                  <Pill color="bg-white/20" text="text-white">Developing</Pill>
                </div>
                
                <p className="text-indigo-50 text-sm">Developing storm system with potential to intensify. Monitoring closely.</p>
                
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-indigo-100 text-xs">Wind Speed</span>
                    <span className="text-white font-bold">95 km/h</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-yellow-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/20">
                  <div>
                    <p className="text-white font-bold text-xl">48h</p>
                    <p className="text-indigo-100 text-xs">Monitoring</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">Medium Risk</p>
                    <p className="text-indigo-100 text-xs">Severity</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-4">Alert Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Flood Alerts</span>
                  </div>
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Cyclone Alerts</span>
                  </div>
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-gray-300 text-sm">Total Active</span>
                  </div>
                  <span className="text-white font-bold text-xl">5</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-gray-300 text-sm">Resolved Today</span>
                  </div>
                  <span className="text-white font-bold text-xl">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;