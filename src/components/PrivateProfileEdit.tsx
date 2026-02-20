import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Profile } from '../types/profile';
import { ChangePinForm } from './ChangePinForm';
import { ProfileUpdateForm } from './ProfileUpdateForm';
import { Modal } from './Modal';
import { Lock, ArrowLeft } from 'lucide-react';
import { getPublicProfile as apiGetPublicProfile, verifyById } from '../api/api';

export const PrivateProfileEdit = () => {
  const { uniqueCode } = useParams<{ uniqueCode: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (uniqueCode) {
      fetchProfile(uniqueCode);
    }
  }, [uniqueCode]);

  const fetchProfile = async (code: string) => {
    try {
      const p = await apiGetPublicProfile(code);
      if (p) {
        setProfile(p as Profile);
        setIdNumber((p as Profile).id);
        return;
      }
      setProfile(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const handleAuthenticate = async () => {
    if (!idNumber || !pin) {
      setAuthError('Please enter both ID Number and PIN');
      return;
    }

    if (pin.length !== 5 || !/^\d+$/.test(pin)) {
      setAuthError('PIN must be exactly 5 digits');
      return;
    }

    try {
      await verifyById({ id: idNumber, pin });
      setAuthError('');
      setIsAuthenticated(true);
      setShowAuth(false);
    } catch (e: any) {
      setAuthError(e?.message || 'Invalid ID Number or PIN. Please try again.');
    }
  };

  const handleSuccess = (message: string) => {
    setModalMessage(message);
    setModalOpen(true);
    // Refresh profile data
    if (uniqueCode) {
      fetchProfile(uniqueCode);
    }
  };

  const handleBackToProfile = () => {
    if (profile) {
      navigate(`/myprofile/${profile.uniqueCode}`);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] flex items-center justify-center">
        <p className="text-white font-medium">Loading profile...</p>
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] flex items-center justify-center p-4 pt-24 pb-20">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a4d6d] mb-2">Edit Profile</h2>
            <p className="text-gray-600 text-sm">Enter your credentials to edit your profile</p>
          </div>

          {authError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 shadow-sm">
              {authError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="20251001-0000-0001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <button
              onClick={handleAuthenticate}
              className="w-full bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] text-white py-3.5 rounded-lg hover:from-[#2563a5] hover:to-[#1a4d6d] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Verify & Edit Profile
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToProfile}
              className="inline-flex items-center space-x-2 text-[#1a4d6d] hover:text-[#2563a5] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={handleBackToProfile}
            className="inline-flex items-center space-x-2 text-white hover:text-orange-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-white/80">Update your profile information</p>
        </div>

        <ChangePinForm profile={profile} onSuccess={handleSuccess} />
        <ProfileUpdateForm profile={profile} onSuccess={handleSuccess} />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={modalMessage}
        />
      </div>
    </div>
  );
};
