import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Profile } from '../types/profile';
import { updateProfile } from '../utils/storage';

interface ChangePinFormProps {
  profile: Profile;
  onSuccess: (message: string) => void;
}

export const ChangePinForm = ({ profile, onSuccess }: ChangePinFormProps) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleChangePin = () => {
    if (!newPin || !confirmPin) {
      setError('Please fill in both PIN fields');
      return;
    }

    if (newPin.length !== 5 || !/^\d+$/.test(newPin)) {
      setError('PIN must be exactly 5 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    const updatedProfile = { ...profile, pin: newPin };
    updateProfile(updatedProfile);

    setNewPin('');
    setConfirmPin('');
    setError('');
    onSuccess('PIN changed successfully!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] p-2 rounded-lg mr-3">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a4d6d]">Change PIN</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-4 text-sm shadow-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New PIN
          </label>
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="Enter 5 digits"
            maxLength={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm PIN
          </label>
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="Re-enter PIN"
            maxLength={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
          />
        </div>
      </div>

      <button
        onClick={handleChangePin}
        className="mt-4 bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] text-white px-8 py-3 rounded-lg hover:from-[#2563a5] hover:to-[#1a4d6d] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-[1.02]"
      >
        Change PIN
      </button>
    </div>
  );
};
