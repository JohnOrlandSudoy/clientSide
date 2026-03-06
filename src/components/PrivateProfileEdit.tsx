import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Profile } from '../types/profile';
import { ProfileUpdateForm } from './ProfileUpdateForm';
import { Modal } from './Modal';
import { ArrowLeft } from 'lucide-react';
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
    // Check for existing session
    const sessionAuth = sessionStorage.getItem(`auth_${uniqueCode}`);
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      setShowAuth(false);
    }
    
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

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setAuthError('PIN must be exactly 6 digits');
      return;
    }

    try {
      const numericId = idNumber.replace(/\D/g, '');
      await verifyById({ id: numericId, pin });
      setAuthError('');
      setIsAuthenticated(true);
      setShowAuth(false);
      // Save session
      if (uniqueCode) {
        sessionStorage.setItem(`auth_${uniqueCode}`, 'true');
      }
    } catch (e: unknown) {
      setAuthError(e instanceof Error ? e.message : 'Invalid ID Number or PIN. Please try again.');
    }
  };

  const handleSuccess = (message: string, shouldRefresh = true) => {
    setModalMessage(message);
    setModalOpen(true);
    // Refresh profile data only if requested
    if (shouldRefresh && uniqueCode) {
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
      <div className="bg-black min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8  " >
        {/* Header Background to match new PIN form */}
        <div className="absolute top-0 right-0 w-full h-[20] z-0 pointer-events-none">
        <img
          src="/formlogo.png"
          alt="Background"
          className="w-full h-full object-cover opacity-60 object-top"
        />
      </div>

        <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-8">
          <img
            src="/tapbos.png"
            alt="tapboss"
            className="w-28 h-28 mx-auto object-contain"
          />
          <h2 className="mt-2 text-white tracking-wider text-2xl sm:text-3xl font-extrabold">
            TAP INTO THE FUTURE
          </h2>
        </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
              {authError}
            </div>
          )}

          <div className="  w-full bg-black rounded-t-[3rem] px-6 pt-4
         pb-0 h-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-gray-900">
            <div>
              <label className="block text-white text-center font-bold text-base mb-1">
                ID Number
              </label>
              <div className="relative w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] border border-white">
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter 16 Digits ID No."
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-full py-3 px-6 text-center placeholder-white/70 focus:outline-none italic"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-center font-bold text-base mb-1">
                PIN
              </label>
              <div className="relative w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] border border-white">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 6 Digits PIN"
                  maxLength={6}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-full py-3 px-6 text-center placeholder-white/70 focus:outline-none italic"
                />
              </div>
            </div>

            <button
              onClick={handleAuthenticate}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white py-3 font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.35)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              Verify & Edit Profile
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToProfile}
              className="inline-flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
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
    <>
      <ProfileUpdateForm profile={profile} onSuccess={handleSuccess} onExit={handleBackToProfile} />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />
    </>
  );
};
