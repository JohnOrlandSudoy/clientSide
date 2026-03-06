import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyById } from '../api/api';

export const AuthView = () => {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    if (submitting) return;
    const id = idNumber.replace(/\D/g, '').trim();
    const p = pin.trim();
    if (!id || !p) {
      setError('Please enter both ID Number and PIN');
      return;
    }

    if (p.length !== 6 || !/^\d+$/.test(p)) {
      setError('PIN must be exactly 6 digits');
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid ID Number or PIN. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8  ">
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

        {error && (
          
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 shadow-sm">
            {error}
          </div>
        )}
 <div className="  w-full bg-black rounded-t-[3rem] px-6 pt-4
         pb-0 h-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-gray-900" >
        <div className="space-y-6">
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
            onClick={handleVerify}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white py-3 font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.35)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};
