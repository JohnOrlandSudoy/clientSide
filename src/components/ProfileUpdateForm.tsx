import { useState, useEffect } from 'react';
import { User, Instagram, Music, Globe, Upload, Crown, Check, X, Trash2 } from 'lucide-react';
import { Profile } from '../types/profile';
import { updateProfile as apiUpdateProfile, uploadProfilePhoto, uploadLogo, toServerFileUrl, uploadGalleryImage, getGalleryImages, deleteGalleryImage, GalleryImage } from '../api/api';

interface ProfileUpdateFormProps {
  profile: Profile;
  onSuccess: (message: string) => void;
  onExit?: () => void;
}

export const ProfileUpdateForm = ({ profile, onSuccess, onExit }: ProfileUpdateFormProps) => {
  const [formData, setFormData] = useState<Profile>(profile);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setFormData(profile);
    if (profile.uniqueCode) {
      loadGallery();
    }
  }, [profile]);

  const loadGallery = async () => {
    try {
      const images = await getGalleryImages(profile.uniqueCode);
      setGalleryImages(images);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const handleGalleryUpload = async (file: File) => {
    try {
      await uploadGalleryImage(formData.uniqueCode, file);
      await loadGallery();
      onSuccess('Flyer uploaded successfully');
    } catch (error) {
      alert('Failed to upload flyer');
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flyer?')) return;
    try {
      await deleteGalleryImage(formData.uniqueCode, id);
      await loadGallery();
    } catch (error) {
      alert('Failed to delete flyer');
    }
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
    const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

    const handleNext = () => {
    if (currentStep === 1) {
      if (newPin || confirmPin) {
         if (newPin.length !== 5 || !/^\d+$/.test(newPin)) {
           alert('PIN must be exactly 5 digits');
           return;
         }
         if (newPin !== confirmPin) {
           alert('PINs do not match');
           return;
         }
      }
    }
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      if (onExit) onExit();
      return;
    }
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    try {
      const payload: Partial<Profile> = {
        profilePhoto: formData.profilePhoto,
        fullName: formData.fullName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        location: formData.location,
        mobilePrimary: formData.mobilePrimary,
        landlineNumber: formData.landlineNumber,
        address: formData.address,
        facebookLink: formData.facebookLink,
        instagramLink: formData.instagramLink,
        tiktokLink: formData.tiktokLink,
        whatsappNumber: formData.whatsappNumber,
        websiteLink: formData.websiteLink,
        viberNumber: formData.viberNumber,
        aboutText: formData.aboutText,
        themeColor: formData.themeColor,
      };

      // Handle PIN update
      if (newPin) {
        if (newPin.length !== 5 || !/^\d+$/.test(newPin)) {
          alert('PIN must be exactly 5 digits');
          return;
        }
        if (newPin !== confirmPin) {
          alert('PINs do not match');
          return;
        }
        payload.pin = newPin;
      }

      await apiUpdateProfile(formData.uniqueCode, payload);
      if (newPin) {
        setNewPin('');
        setConfirmPin('');
      }
      setShowSuccessModal(true);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to update profile');
    }
  };

  const renderStep1 = () => (
    <div className="bg-black min-h-screen flex flex-col relative overflow-hidden h-[100vh]">
        {/* Top Background Image */}
        <div className="absolute top-0 left-0 w-full h-[20] z-0">
            <img 
                src="/formlogo.png" 
                alt="Background" 
                className="w-full h-full object-cover object-bottom"
            />
            {/* Gradient Overlay to blend with black bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-end">
            {/* Logo Section - Positioned above the card */}
            <div className="flex justify-center mb-4">
                <img src="/tapbos.png" alt="Tap Boss" className="w-40 object-contain drop-shadow-2xl" />
            </div>

            {/* Bottom Sheet Card */}
            <div className="  w-full bg-black rounded-t-[3rem] px-6 pt-4
         pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-gray-900">
                <div className="max-w-md mx-auto space-y-4">
                    <div>
                        <label className="block text-white text-center font-bold text-base mb-1">
                            New Pin
                        </label>
                        <div className="relative">
                            <div className="relative w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] border border-white">
                                <input 
                                    type="password"
                                    value={newPin}
                                    onChange={(e) => setNewPin(e.target.value)}
                                    placeholder="Enter 5 Digits"
                                    maxLength={5}
                                    className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-full py-3 px-6 text-center placeholder-white/70 focus:outline-none italic"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-white text-center font-bold text-base mb-1">
                            Confirm PIN
                        </label>
                         <div className="relative w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] border border-white ">
                            <input
                                type="password"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                                placeholder="Re-enter PIN"
                                maxLength={5}
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-full py-3 px-6 text-center placeholder-white/70 focus:outline-none italic"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all max-w-md mx-auto block"
                >
                    Next Step
                </button>
            </div>
        </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-black min-h-screen relative overflow-hidden flex flex-col">
        {/* Pasabog Popup for Photo Upload */}
        {showPhotoPopup && uploadedPhotoUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="relative flex flex-col items-center animate-bounce-in">
                    <div className="absolute -inset-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-75 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-2xl scale-150 transition-transform duration-500">
                        <img 
                            src={uploadedPhotoUrl} 
                            alt="New Profile" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <Upload className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="relative mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 animate-pulse text-center">
                        Photo Updated!
                    </h3>
                </div>
            </div>
        )}

        {/* Header Background */}
        <div className="absolute top-0 right-0 w-40 h-30 z-0 pointer-events-none">
             <img 
               src="/formlogo.png" 
               alt="Background" 
               className="w-full h-full object-cover opacity-60 object-top"
             />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex flex-col h-full">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Contact</h2>
                <h2 className="text-4xl font-bold text-white">Details</h2>
            </div>

            {/* ID Number Pill */}
            <div className="mb-8 flex justify-center">
                <div className="bg-black border border-white rounded-full px-8 py-3 text-white font-mono tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    ID Number <span className="font-bold ml-2">{formData.id}</span>
                </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pb-20 custom-scrollbar">
                <h3 className="text-white/80 italic text-sm mb-4">Profile Information</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Company Mobile No. <span className="text-gray-400 text-xs font-normal">(Primary No.)</span></label>
                        <input
                            type="text"
                            value={formData.mobilePrimary}
                            onChange={(e) => handleChange('mobilePrimary', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Company landline</label>
                        <input
                            type="text"
                            value={formData.landlineNumber}
                            onChange={(e) => handleChange('landlineNumber', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Company Email add.</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Viber No.</label>
                        <input
                            type="text"
                            value={formData.viberNumber || ''}
                            onChange={(e) => handleChange('viberNumber', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Whatsapps No.</label>
                        <input
                            type="text"
                            value={formData.whatsappNumber}
                            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-white text-black py-3 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-black min-h-screen relative overflow-hidden flex flex-col">
        {/* Pasabog Popup for Photo Upload */}
        {showPhotoPopup && uploadedPhotoUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="relative flex flex-col items-center animate-bounce-in">
                    <div className="absolute -inset-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-75 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-2xl scale-150 transition-transform duration-500">
                        <img 
                            src={uploadedPhotoUrl} 
                            alt="New Profile" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <Upload className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="relative mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 animate-pulse text-center">
                        Photo Updated!
                    </h3>
                </div>
            </div>
        )}

        {/* Header Background */}
        <div className="absolute top-0 right-0 w-40 h-30 z-0 pointer-events-none">
             <img 
               src="/formlogo.png" 
               alt="Background" 
               className="w-full h-full object-cover opacity-60 object-top"
             />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex flex-col h-full">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Let's</h2>
                <h2 className="text-4xl font-bold text-white mb-2">Create</h2>
                <h2 className="text-4xl font-bold text-white mb-2">Your</h2>
                <h2 className="text-4xl font-bold text-white">Account</h2>
            </div>

            {/* ID Number Pill */}
            <div className="mb-8 flex justify-center">
                <div className="bg-black border border-white rounded-full px-8 py-3 text-white font-mono tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    ID Number <span className="font-bold ml-2">{formData.id}</span>
                </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pb-20 custom-scrollbar">
                <h3 className="text-white/80 italic text-sm mb-4">Profile Information</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Job Title</label>
                        <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => handleChange('jobTitle', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Company Name</label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Branch or Location</label>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Company Complete address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Company Google Map</label>
                        <input
                            type="text"
                            value={formData.websiteLink}
                            onChange={(e) => handleChange('websiteLink', e.target.value)}
                            className="w-full bg-black border border-white rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 bg-white text-black py-3 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-black min-h-screen relative overflow-hidden flex flex-col">
        {/* Pasabog Popup for Photo Upload */}
        {showPhotoPopup && uploadedPhotoUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="relative flex flex-col items-center animate-bounce-in">
                    <div className="absolute -inset-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-75 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-2xl scale-150 transition-transform duration-500">
                        <img 
                            src={uploadedPhotoUrl} 
                            alt="New Profile" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <Upload className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="relative mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 animate-pulse text-center">
                        Photo Updated!
                    </h3>
                </div>
            </div>
        )}

        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-64 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-gray-800 to-black">
             <div className="absolute top-0 right-0">
                 <img 
                   src="/formlogo.png" 
                   alt="Background" 
                   className="w-40 h-30 object-cover object-top opacity-90"
                 />
             </div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex flex-col h-full">
            <div className="mb-8 mt-4">
                <h2 className="text-5xl font-black text-white leading-none tracking-tight">Social Media</h2>
                <h2 className="text-5xl font-black text-white leading-none tracking-tight">Links</h2>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pb-20 custom-scrollbar">
                <div className="space-y-4">
                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Facebook Business Page Link</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="url"
                                value={formData.facebookLink}
                                onChange={(e) => handleChange('facebookLink', e.target.value)}
                                className="w-full bg-black border border-white rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Instagram Business Page Link</label>
                        <div className="relative">
                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="url"
                                value={formData.instagramLink}
                                onChange={(e) => handleChange('instagramLink', e.target.value)}
                                className="w-full bg-black border border-white rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Tiktok Business Page Link</label>
                        <div className="relative">
                            <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="url"
                                value={formData.tiktokLink}
                                onChange={(e) => handleChange('tiktokLink', e.target.value)}
                                className="w-full bg-black border border-white rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">Website Link</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="url"
                                value={formData.websiteLink}
                                onChange={(e) => handleChange('websiteLink', e.target.value)}
                                className="w-full bg-black border border-white rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2 ml-1">About me <span className="text-gray-400 text-xs font-normal italic">max. 100 characters</span></label>
                        <textarea
                            value={formData.aboutText || ''}
                            onChange={(e) => handleChange('aboutText', e.target.value)}
                            maxLength={100}
                            rows={2}
                            className="w-full bg-black border border-white rounded-3xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Upload & Color Section */}
                <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-xl">
                    <h3 className="text-white font-bold text-lg mb-6 text-center tracking-wide">Customize Your Profile</h3>
                    
                    <div className="flex flex-col gap-8">
                        {/* Upload Buttons Container */}
                        <div className="flex justify-center items-start gap-8">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center group">
                                <label className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg group-hover:shadow-yellow-500/30 group-hover:-translate-y-1 transition-all duration-300">
                                    <Upload className="w-7 h-7 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                const updated = await uploadProfilePhoto(formData.uniqueCode, file);
                                                setFormData(prev => ({ ...prev, profilePhoto: updated.profilePhoto }));
                                                // Show pasabog popup
                                                setUploadedPhotoUrl(toServerFileUrl(updated.profilePhoto));
                                                setShowPhotoPopup(true);
                                                setTimeout(() => setShowPhotoPopup(false), 3000); // Hide after 3s
                                                onSuccess('Photo uploaded');
                                            } catch (err: unknown) {
                                                alert(err instanceof Error ? err.message : 'Failed to upload photo');
                                            }
                                        }
                                    }} />
                                </label>
                                <span className="mt-3 text-[11px] text-gray-300 font-medium text-center uppercase tracking-wider">Profile<br/>Photo</span>
                            </div>
                            
                            {/* Company Logo */}
                            <div className="flex flex-col items-center group">
                                <label className="relative w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg group-hover:shadow-pink-500/30 group-hover:-translate-y-1 transition-all duration-300">
                                    <Upload className="w-7 h-7 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                const updated = await uploadLogo(formData.uniqueCode, file);
                                                setFormData(prev => ({ ...prev, logo: updated.logo }));
                                                onSuccess('Logo uploaded');
                                            } catch (err: unknown) {
                                                alert(err instanceof Error ? err.message : 'Failed to upload logo');
                                            }
                                        }
                                    }} />
                                </label>
                                <span className="mt-3 text-[11px] text-gray-300 font-medium text-center uppercase tracking-wider">Company<br/>Logo</span>
                            </div>

                            {/* Flyers Upload */}
                            {formData.is_pro ? (
                                <div className="flex flex-col items-center group">
                                    <label className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg group-hover:shadow-purple-500/30 group-hover:-translate-y-1 transition-all duration-300 border border-purple-400/30">
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md z-10">
                                            <Crown className="w-3 h-3 text-yellow-900 fill-current" />
                                        </div>
                                        <Upload className="w-7 h-7 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleGalleryUpload(file);
                                        }} />
                                    </label>
                                    <span className="mt-3 text-[11px] text-gray-300 font-medium text-center uppercase tracking-wider">Flyers<br/>Upload</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center opacity-60 cursor-not-allowed grayscale">
                                    <label className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center cursor-not-allowed shadow-none border border-gray-600">
                                        <Crown className="w-7 h-7 text-gray-400" />
                                    </label>
                                    <span className="mt-3 text-[11px] text-gray-400 font-medium text-center uppercase tracking-wider">Pro Only</span>
                                </div>
                            )}
                        </div>

                        {/* Gallery Preview */}
                        {formData.is_pro ? (
                            <>
                                {galleryImages.length > 0 && (
                                    <div className="w-full bg-black/20 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xs text-gray-400 font-medium mb-3 text-center uppercase tracking-widest">Your Flyers Gallery</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {galleryImages.map((img) => (
                                                <div key={img.id} className="relative group aspect-square bg-gray-800 rounded-xl overflow-hidden border border-white/10 shadow-sm">
                                                    <img src={toServerFileUrl(img.image_url)} alt="Flyer" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleDeleteGalleryImage(img.id)}
                                                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 backdrop-blur-sm"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 text-center shadow-inner">
                                <div className="flex justify-center mb-2">
                                    <Crown className="w-8 h-8 text-yellow-500/80 animate-pulse" />
                                </div>
                                <h4 className="font-bold text-gray-200 text-sm tracking-wide">Unlock Pro Features</h4>
                                <p className="text-xs text-gray-400 mt-1">Upgrade to Pro to enable flyer uploads and more.</p>
                            </div>
                        )}

                        {/* Color Picker */}
                        <div className="text-center pt-2 border-t border-white/10">
                            <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-widest">Theme Color Template</p>
                            <div className="grid grid-cols-4 gap-4 max-w-[240px] mx-auto">
                                 {[
                                     'linear-gradient(135deg, #0f172a 0%, #334155 100%)',   // Navy Gradient
                                     'linear-gradient(135deg, #831843 0%, #db2777 100%)',   // Magenta Gradient
                                     'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',   // Purple Gradient
                                     'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',   // Green Gradient
                                     'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',   // Blue Gradient
                                     'linear-gradient(135deg, #0e7490 0%, #22d3ee 100%)',   // Cyan Gradient
                                     'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',   // Red Gradient
                                     'linear-gradient(135deg, #7c2d12 0%, #fb923c 100%)'    // Orange Gradient
                                 ].map((gradient) => (
                                     <button
                                         key={gradient}
                                          onClick={() => handleChange('themeColor', gradient)}
                                         className={`w-10 h-10 rounded-xl shadow-lg hover:scale-110 transition-all duration-300 ${formData.themeColor === gradient ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:shadow-white/20'}`}
                                     style={{ background: gradient }}
                                 />
                             ))}
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-4 pb-8">
                 <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-700 transition-all text-lg"
                >
                    Back
                </button>
                 <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all text-lg"
                >
                    Save profile
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <>
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-300 relative">
                <button 
                    onClick={() => {
                        setShowSuccessModal(false);
                        onSuccess('Profile updated successfully');
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Check className="w-12 h-12 text-green-600" style={{ animation: 'spin 1s ease-out' }} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                <p className="text-gray-600 text-center mb-8">Profile updated successfully</p>
                
                <button
                    onClick={() => {
                        setShowSuccessModal(false);
                        onSuccess('Profile updated successfully');
                    }}
                    className="w-full bg-[#1e40af] text-white py-3 rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
      )}
    </>
  );
};
