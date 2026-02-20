import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { verifyById } from '../api/api';

export const AuthView = () => {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    if (submitting) return;
    const id = idNumber.trim();
    const p = pin.trim();
    if (!id || !p) {
      setError('Please enter both ID Number and PIN');
      return;
    }

    if (p.length !== 5 || !/^\d+$/.test(p)) {
      setError('PIN must be exactly 5 digits');
      return;
    }

    try {
      setSubmitting(true);
      const res = await verifyById({ id, pin: p });
      setError('');
      if (!res?.uniqueCode) {
        setError('Verification succeeded but no unique code returned.');
        return;
      }
      navigate(`/edit/${encodeURIComponent(res.uniqueCode)}`);
    } catch (e: any) {
      setError(e?.message || 'Invalid ID Number or PIN. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] flex items-center justify-center p-4 pt-24 pb-20">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <img
            src="/kontacksharelogo.png"
            alt="Kontak Share Logo"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-orange-500 shadow-xl ring-4 ring-blue-100"
          />
          <h2 className="text-3xl font-bold text-[#1a4d6d] mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm">Sign in to update your profile</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="20251001-0000-0001"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] text-white py-3.5 rounded-lg hover:from-[#2563a5] hover:to-[#1a4d6d] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-700 mb-1">Demo Credentials</p>
          <p>IDs: 20251001-0000-0001 to 20251001-0000-0005</p>
          <p className="mt-1">PINs: 12345, 67890, 54321</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="font-medium text-gray-700 mb-1">View Public Profiles</p>
            <p className="text-xs">
              <a href="/myprofile/gsdbhb7390bcsdhjughu" className="text-blue-600 hover:underline">John Doe</a> | 
              <a href="/myprofile/cjfidhverkscdkdscmkdsjf" className="text-blue-600 hover:underline ml-1">Jane Smith</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
