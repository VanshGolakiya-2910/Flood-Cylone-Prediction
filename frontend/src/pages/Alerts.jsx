import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Search, Bell, AlertTriangle, Waves, Wind, X, Plus, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import axios from 'axios';

const Pill = ({ children, color = 'bg-blue-500/20', text = 'text-blue-300' }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color} ${text}`}>{children}</span>
);

const AlertModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    country: 'India',
    state: 'Gujarat',
    title: '',
    message: '',
    subject: '',
    ctaUrl: '',
    type: 'flood'
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="e.g., Severe Flood Warning"
            />
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="Email subject line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Alert Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
              placeholder="Enter detailed alert message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Call-to-Action URL (Optional)</label>
            <input
              type="text"
              value={formData.ctaUrl}
              onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="https://example.com/more-info"
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

const AlertCard = ({ alert, type }) => {
  const isFlood = type === 'flood';
  const gradients = {
    flood: ['from-blue-600 to-blue-700', 'from-cyan-600 to-cyan-700', 'from-teal-600 to-teal-700'],
    cyclone: ['from-purple-600 to-purple-700', 'from-indigo-600 to-indigo-700', 'from-violet-600 to-violet-700']
  };
  
  const colors = {
    flood: { border: 'border-blue-500/20', text: 'text-blue-100' },
    cyclone: { border: 'border-purple-500/20', text: 'text-purple-100' }
  };

  const getRandomGradient = () => {
    const grads = gradients[type];
    return grads[Math.floor(Math.random() * grads.length)];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`bg-gradient-to-br ${getRandomGradient()} rounded-xl p-6 border ${colors[type].border} shadow-xl hover:shadow-2xl transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            {isFlood ? <Waves className="w-5 h-5 text-white" /> : <Wind className="w-5 h-5 text-white" />}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{alert.title || 'Area Alert'}</p>
            <p className={`${colors[type].text} text-sm`}>{alert.state}, {alert.country}</p>
          </div>
        </div>
        <MoreHorizontal className="text-white/80 cursor-pointer" />
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Pill color="bg-white/20" text="text-white">
            <Calendar className="w-3 h-3 inline mr-1" />
            {formatDate(alert.createdAt)}
          </Pill>
          {alert.sentCount > 0 && (
            <Pill color="bg-green-500/30" text="text-green-100">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Sent
            </Pill>
          )}
        </div>
        
        <p className="text-white/90 text-sm line-clamp-3">{alert.message}</p>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <div>
            <p className="text-white font-bold text-xl flex items-center gap-1">
              <Users className="w-4 h-4" />
              {alert.sentCount}
            </p>
            <p className={`${colors[type].text} text-xs`}>Sent</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {alert.skippedCount}
            </p>
            <p className={`${colors[type].text} text-xs`}>Skipped</p>
          </div>
          {alert.recipients && (
            <div>
              <p className="text-white font-semibold text-xl">{alert.recipients.length}</p>
              <p className={`${colors[type].text} text-xs`}>Recipients</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countriesData, setCountriesData] = useState({});
  const [availableStates, setAvailableStates] = useState([]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/alerts');
      if (res.data.status === 'success') {
        const alertsData = res.data.data;
        // Handle both array and object responses
        if (Array.isArray(alertsData)) {
          setAlerts(alertsData);
        } else if (alertsData && typeof alertsData === 'object') {
          // If it's an object with arrays, flatten them
          const allAlerts = [
            ...(alertsData.active || []),
            ...(alertsData.past || []),
            ...(alertsData.alerts || [])
          ];
          setAlerts(allAlerts);
        } else {
          setAlerts([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch alerts', err);
      showNotification('Failed to fetch alerts', 'error');
      setAlerts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/alerts/area', {
        country: formData.country,
        state: formData.state,
        title: formData.title || 'Area Alert',
        message: formData.message,
        subject: formData.subject,
        ctaUrl: formData.ctaUrl,
        type: formData.type
      });

      if (response.data.status === 'success') {
        showNotification('Alert created and sent successfully!', 'success');
        setIsModalOpen(false);
        fetchAlerts();
      } else {
        showNotification('Failed to create alert', 'error');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error creating alert', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Ensure alerts is always an array
  const alertsArray = Array.isArray(alerts) ? alerts : [];

  const filteredAlerts = alertsArray.filter(alert => 
    alert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const floodAlerts = filteredAlerts.filter(a => 
    a.title?.toLowerCase().includes('flood') || 
    a.message?.toLowerCase().includes('flood')
  );
  
  const cycloneAlerts = filteredAlerts.filter(a => 
    a.title?.toLowerCase().includes('cyclone') || 
    a.message?.toLowerCase().includes('cyclone') ||
    a.title?.toLowerCase().includes('storm') || 
    a.message?.toLowerCase().includes('storm')
  );

  const totalSent = alertsArray.reduce((sum, alert) => sum + (alert.sentCount || 0), 0);
  const totalSkipped = alertsArray.reduce((sum, alert) => sum + (alert.skippedCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors w-64" 
                placeholder="Search alerts..." 
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Create Alert
            </button>
          </div>
        </div>

        {loading && alertsArray.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Waves className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Flood Alerts</h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                  {floodAlerts.length} Alert{floodAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {floodAlerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {floodAlerts.map((alert) => (
                    <AlertCard key={alert._id} alert={alert} type="flood" />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                  <Waves className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No flood alerts found</p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Cyclone Alerts</h2>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                  {cycloneAlerts.length} Alert{cycloneAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cycloneAlerts.length > 0 ? (
                  cycloneAlerts.map((alert) => (
                    <AlertCard key={alert._id} alert={alert} type="cyclone" />
                  ))
                ) : (
                  <div className="col-span-full bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                    <Wind className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No cyclone alerts found</p>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
                  <h3 className="text-white font-bold text-lg mb-4">Alert Statistics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">Flood Alerts</span>
                      </div>
                      <span className="text-white font-bold text-xl">{floodAlerts.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300 text-sm">Cyclone Alerts</span>
                      </div>
                      <span className="text-white font-bold text-xl">{cycloneAlerts.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Total Sent</span>
                      </div>
                      <span className="text-white font-bold text-xl">{totalSent}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">Total Skipped</span>
                      </div>
                      <span className="text-white font-bold text-xl">{totalSkipped}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Alerts;