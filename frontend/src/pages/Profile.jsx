import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import { authAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
        } else {
          setError('Failed to load profile');
          toast.error('Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        toast.error(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InfoCard = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`bg-secondary-800 rounded-lg p-4 border border-secondary-700 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-500/20 rounded-lg">
          <Icon className="h-5 w-5 text-primary-400" />
        </div>
        <span className="text-secondary-400 text-sm font-medium">{label}</span>
      </div>
      <p className="text-white text-lg font-semibold ml-12">{value || 'N/A'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-900">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-secondary-900">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <User className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">User Profile</h1>
              <p className="text-secondary-400 text-sm">View your account information and details</p>
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'N/A'}</h2>
              <p className="text-primary-100 text-sm">{user?.email || 'N/A'}</p>
              <div className="flex items-center gap-4 mt-2">
                {user?.role && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                    <Shield className="h-4 w-4" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-400" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
              icon={User} 
              label="Full Name" 
              value={user?.name} 
            />
            <InfoCard 
              icon={Mail} 
              label="Email Address" 
              value={user?.email} 
            />
            <InfoCard 
              icon={Phone} 
              label="Phone Number" 
              value={user?.phoneNumber} 
            />
            {(user?.fullLocation || (user?.state && user?.country)) && (
              <InfoCard 
                icon={MapPin} 
                label="Full Location" 
                value={user?.fullLocation || `${user?.state}, ${user?.country}`} 
              />
            )}
          </div>
        </div>

        {/* Account Information Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-400" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
              icon={Shield} 
              label="Account Role" 
              value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'} 
            />
          </div>
        </div>

        {/* Additional Information */}
        {user?._id && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-400" />
              System Information
            </h3>
            <div className="bg-secondary-800 rounded-lg p-4 border border-secondary-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <span className="text-secondary-400 text-sm font-medium">User ID</span>
                  <p className="text-white text-sm font-mono mt-1">{user._id}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;

