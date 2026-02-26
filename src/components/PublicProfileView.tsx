import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Profile } from '../types/profile';
import { 
  User, Mail, Phone, Facebook, Instagram, Music, 
  Globe, Share2, Download, QrCode, Home, Smartphone, ChevronRight,
  Briefcase, Building2, MapPin, Images, Scan, X
} from 'lucide-react';
import { getPublicProfile as apiGetPublicProfile, toServerFileUrl } from '../api/api';

export const PublicProfileView = () => {
  const { uniqueCode } = useParams<{ uniqueCode: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (uniqueCode) {
      fetchProfile(uniqueCode);
    }
  }, [uniqueCode]);

  const fetchProfile = async (code: string) => {
    try {
      setLoading(true);
      setError('');

      const data = await apiGetPublicProfile(code);
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Profile not found or server error');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#D9D9D9] flex items-center justify-center font-sans">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#D9D9D9] flex items-center justify-center font-sans">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="bg-red-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
          <Link 
            to="/"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isDefaultValue = (value: string | undefined, defaultText: string) => {
    if (!value) return true;
    return value === defaultText || value.includes('Update your');
  };

  const isBanned = profile.status === 'banned';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      {/* Mobile Container - Max Width 400px */}
      <div className="w-full max-w-[400px] bg-[#D9D9D9] min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Header Section */}
        <div className="bg-[#333333] pt-8 pb-44 px-3 rounded-b-[0rem] relative z-0">
          <h1 className="text-white text-2xl font-rounded font-bold mb-2 tracking-wide ml-3">tapboss</h1>
        </div>
        
        {/* Profile Card */}
          <div className="relative z-10 -mt-44 px-3 mb-2">
            <div className="bg-[#262626] rounded-[1rem] shadow-xl overflow-hidden flex flex-row min-h-[220px]">
              {/* Left Side - Profile Image (40%) */}
              <div className="w-[40%] relative">
              {profile.profilePhoto ? (
                <img 
                  src={toServerFileUrl(profile.profilePhoto)} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-l-[0rem] rounded-r-none"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-l-[1.5rem] rounded-r-none">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Info Section (60%) */}
              <div className="w-[60%] p-4 flex flex-col relative">
                {/* QR Code Icon Top Right */}
                <div className="absolute top-4 right-4">
                  <div 
                    className="relative flex items-center justify-center w-10 h-10 cursor-pointer"
                    onClick={() => setShowQR(true)}
                  >
                    <Scan className="w-full h-full text-white/90" strokeWidth={1.5} />
                    <QrCode className="absolute w-5 h-5 text-white/90" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="flex flex-col justify-center h-full pt-10 pb-0">
                <h2 className="text-[2.2rem] font-rounded font-normal text-white leading-none mb-2 pr-12 tracking-wide">
                  {profile.fullName}
                </h2>
                
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-gray-200">
                    <p className="text-sm font-rounded font-normal tracking-wide leading-tight truncate">{profile.jobTitle}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-200">
                    <p className="text-sm font-rounded font-normal tracking-wide leading-tight truncate">{profile.companyName}</p>
                  </div>
                  
                  {profile.location !== 'Default Location' && (
                    <div className="flex items-center gap-2 text-gray-200">
                      <p className="text-sm font-rounded font-normal tracking-wide leading-tight truncate">{profile.location}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow px-6 mt-1 pb-24">
          
          {isBanned && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-center font-semibold shadow-sm">
              This profile is currently banned.
            </div>
          )}

          {/* About Section */}
          <div className="mb-3">
            <h3 className="text-gray-900 font-semibold text-lg mb-1">About</h3>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              {profile.aboutText || "No about information provided yet."}
            </p>
          </div>

          {/* Contact Icons Row */}
          <div className="flex justify-between items-center mb-3 gap-2">
            <a href={`tel:${profile.mobilePrimary}`} className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-[#333333] rounded-full flex items-center justify-center mb-1 group-hover:bg-[#444] transition-colors shadow-md">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </a>
            
            <a href={`tel:${profile.landlineNumber}`} className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-[#333333] rounded-full flex items-center justify-center mb-1 group-hover:bg-[#444] transition-colors shadow-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </a>
            
            <a href={`mailto:${profile.email}`} className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-[#333333] rounded-full flex items-center justify-center mb-1 group-hover:bg-[#444] transition-colors shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </a>
            
            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-[#333333] rounded-full flex items-center justify-center mb-1 group-hover:bg-[#444] transition-colors shadow-md">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {!isDefaultValue(profile.websiteLink, 'Update your web link') ? (
              <a href={profile.websiteLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                <div className="w-14 h-14 bg-[#333333] rounded-full flex items-center justify-center mb-1 group-hover:bg-[#444] transition-colors shadow-md">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </a>
            ) : (
               <div className="flex flex-col items-center group opacity-50">
                <div className="w-14 h-14 bg-[#333333] rounded-full flex items-center justify-center mb-1 shadow-md">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Social Network Section */}
          <div className="mb-8">
            <h3 className="text-gray-900 font-semibold text-lg mb-2">Social Network</h3>
            <div className="space-y-2">
              {/* Facebook */}
              {!isDefaultValue(profile.facebookLink, 'Update your Facebook Link') && (
                <a 
                  href={profile.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-blue-600 fill-current" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Facebook</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </a>
              )}

              {/* Tiktok */}
              {!isDefaultValue(profile.tiktokLink, 'Update your TikTok Link') && (
                <a 
                  href={profile.tiktokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Tiktok</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </a>
              )}

              {/* Instagram */}
              {!isDefaultValue(profile.instagramLink, 'Update your Instagram Link') && (
                <a 
                  href={profile.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Instagram</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </a>
              )}

              {/* Viber */}
              {!isDefaultValue(profile.viberNumber, 'Update your Viber Number') && (
                <a 
                  href={`viber://chat?number=${profile.viberNumber?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-[#7360f2] flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Viber</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-[#333333] p-6 z-10 rounded-t-[0rem]">
          <div className="flex justify-around items-center">
            <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
              <Images className="w-5 h-5" />
              <span className="font-medium text-lg">Gallery</span>
            </button>
            <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
              <Download className="w-5 h-5" />
              <span className="font-medium text-lg">Save</span>
            </button>
          </div>
        </div>
      </div>
      {/* QR Code Modal */}
      {showQR && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowQR(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#D9D9D9] rounded-[2rem] overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#000000] px-6 py-14 flex justify-center items-center relative">
              <img src="/tapboos.png" alt="tapboss" className="h-48 object-contain mt-4" />
              <button 
                onClick={() => setShowQR(false)}
                className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-10 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
              <div className="relative p-2 bg-white rounded-xl shadow-sm">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&color=000000&bgcolor=ffffff`}
                  alt="Profile QR Code" 
                  className="w-64 h-64 object-contain"
                />
                {/* Corner Accents to match screenshot style */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-black rounded-tl-lg -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-black rounded-tr-lg -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-black rounded-bl-lg -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-black rounded-br-lg -mb-1 -mr-1"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight text-center">
                {profile.fullName}
              </h3>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#000000] p-6">
              <div className="flex justify-center">
                <p className="text-white/40 text-sm font-light">Scan to view profile</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};