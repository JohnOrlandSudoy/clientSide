import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Profile } from '../types/profile';
import { 
  User, Mail, Phone, Facebook, Instagram, Music, 
  Globe, Download, QrCode, Home, Smartphone, ChevronRight,
  Images, Scan, X, MessageCircle
} from 'lucide-react';
import { getPublicProfile as apiGetPublicProfile, toServerFileUrl, getGalleryImages, GalleryImage } from '../api/api';

export const PublicProfileView = () => {
  const { uniqueCode } = useParams<{ uniqueCode: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (uniqueCode) {
      fetchProfile(uniqueCode);
      fetchGallery(uniqueCode);
    }
  }, [uniqueCode]);

  const fetchGallery = async (code: string) => {
    try {
      const images = await getGalleryImages(code);
      setGalleryImages(images);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

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

  const handleSaveContact = async () => {
    if (!profile) return;

    // Helper to get image as base64
    const getBase64Image = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error('Error fetching image:', e);
            return null;
        }
    };

    let photoString = '';
    if (profile.profilePhoto) {
        const photoUrl = toServerFileUrl(profile.profilePhoto);
        const base64 = await getBase64Image(photoUrl);
        if (base64) {
            // Remove data:image/jpeg;base64, prefix
            const b64Data = base64.split(',')[1];
            photoString = `PHOTO;ENCODING=b;TYPE=JPEG:${b64Data}\n`;
        }
    }

    // Construct VCard 3.0 content
    const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${profile.fullName}`,
        `N:${profile.fullName.split(' ').reverse().join(';')};;;`,
        profile.companyName ? `ORG:${profile.companyName}` : '',
        profile.jobTitle ? `TITLE:${profile.jobTitle}` : '',
        profile.mobilePrimary ? `TEL;TYPE=CELL:${profile.mobilePrimary}` : '',
        profile.landlineNumber ? `TEL;TYPE=WORK:${profile.landlineNumber}` : '',
        profile.whatsappNumber && !profile.whatsappNumber.includes('Update') ? `TEL;TYPE=WHATSAPP:${profile.whatsappNumber}` : '',
        profile.viberNumber && !profile.viberNumber.includes('Update') ? `TEL;TYPE=VIBER:${profile.viberNumber}` : '',
        profile.email ? `EMAIL;TYPE=WORK:${profile.email}` : '',
        profile.websiteLink && !profile.websiteLink.includes('Update') ? `URL:${profile.websiteLink}` : '',
        profile.facebookLink && !profile.facebookLink.includes('Update') ? `X-SOCIALPROFILE;TYPE=facebook:${profile.facebookLink}` : '',
        profile.instagramLink && !profile.instagramLink.includes('Update') ? `X-SOCIALPROFILE;TYPE=instagram:${profile.instagramLink}` : '',
        profile.tiktokLink && !profile.tiktokLink.includes('Update') ? `X-SOCIALPROFILE;TYPE=tiktok:${profile.tiktokLink}` : '',
        profile.address ? `ADR;TYPE=WORK:;;${profile.address.replace(/,/g, ';')};;;;` : '',
        profile.aboutText ? `NOTE:${profile.aboutText}` : '',
        photoString, // Add photo if available
        `URL;TYPE=PROFILE:${window.location.href}`,
        'END:VCARD'
    ].filter(Boolean).join('\n');

    // Create file for sharing/downloading
    const file = new File([vCardData], `${profile.fullName.replace(/\s+/g, '_')}.vcf`, { type: 'text/vcard' });

    // Try Web Share API first (Mobile Native Experience)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${profile.fullName} Contact`,
          text: 'Save to contacts',
        });
        return; // Successfully shared
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
        // If share fails (or user cancels), fall back to download
      }
    }

    // Fallback: Direct Download (Desktop / Non-supported Mobile)
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.fullName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      {/* Mobile Container - Max Width 400px */}
      <div className="w-full max-w-[400px] bg-[#D9D9D9] min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Header Section */}
        <div 
          className="pt-8 pb-44 px-3 rounded-b-[0rem] relative z-0"
          style={{ background: profile.themeColor || '#333333' }}
        >
          <h1 className="text-white text-2xl font-rounded font-bold mb-2 tracking-wide ml-3">tapboss</h1>
        </div>
        
        {/* Profile Card */}
          <div className="relative z-10 -mt-44 px-3 mb-1">
            <div 
              className="rounded-[1rem] shadow-xl overflow-hidden flex flex-row min-h-[220px] relative"
              style={{ background: profile.themeColor || '#262626' }}
            >
              {profile.themeColor && <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />}
              {/* Left Side - Profile Image (40%) */}
              <div className="w-[40%] relative z-10">
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
              <div className="w-[60%] p-4 flex flex-col relative z-10">
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
          <div className="mb-1">
            <h3 className="text-gray-900 font-semibold text-lg mb-1">About</h3>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              {profile.aboutText || "No about information provided yet."}
            </p>
          </div>

          {/* Contact Icons Row */}
          <div className="flex justify-between items-center mb-1 gap-2">
            <a href={`tel:${profile.mobilePrimary}`} className="flex flex-col items-center group">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all shadow-md hover:brightness-110"
                style={{ background: profile.themeColor || '#333333' }}
              >
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </a>
            
            <a href={`tel:${profile.landlineNumber}`} className="flex flex-col items-center group">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all shadow-md hover:brightness-110"
                style={{ background: profile.themeColor || '#333333' }}
              >
                <Phone className="w-6 h-6 text-white" />
              </div>
            </a>
            
            <a href={`mailto:${profile.email}`} className="flex flex-col items-center group">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all shadow-md hover:brightness-110"
                style={{ background: profile.themeColor || '#333333' }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
            </a>
            
            <div className="flex flex-col items-center group">
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all shadow-md overflow-hidden hover:brightness-110 ${profile.logo ? 'p-0.5' : ''}`}
                style={{ background: profile.logo ? 'white' : (profile.themeColor || '#333333') }}
              >
                {profile.logo ? (
                  <img 
                    src={toServerFileUrl(profile.logo)} 
                    alt="Logo" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <Home className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Brand</span>
            </div>
            
            {!isDefaultValue(profile.websiteLink, 'Update your web link') ? (
              <a href={profile.websiteLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all shadow-md hover:brightness-110"
                  style={{ background: profile.themeColor || '#333333' }}
                >
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </a>
            ) : (
               <div className="flex flex-col items-center group opacity-50">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-1 shadow-md"
                  style={{ background: profile.themeColor || '#333333' }}
                >
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

              {/* WhatsApp */}
              {!isDefaultValue(profile.whatsappNumber, 'Update your Whatsapps No.') && (
                <a 
                  href={`https://wa.me/${profile.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">WhatsApp</span>
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
        <div 
          className="sticky bottom-0 left-0 right-0 p-6 z-10 rounded-t-[0rem]"
          style={{ background: profile.themeColor || '#333333' }}
        >
          <div className="flex justify-around items-center">
            <button 
              onClick={() => setShowGallery(true)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <Images className="w-5 h-5" />
              <span className="font-medium text-lg">Gallery</span>
            </button>
            <button 
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
              onClick={handleSaveContact}
            >
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
          {/* Always-visible close for mobile */}
          <button
            aria-label="Close"
            onClick={() => setShowQR(false)}
            className="absolute top-3 right-3 p-3 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors backdrop-blur-md ring-1 ring-white/30 z-[60]"
          >
            <X className="w-7 h-7" />
          </button>
          <div 
            className="w-full max-w-sm max-h-[90vh] overflow-y-auto bg-[#D9D9D9] rounded-[2rem] shadow-2xl transform transition-all animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#000000] px-6 py-14 flex justify-center items-center relative">
              <img src="/tapbos.png" alt="tapboss" className="h-48 object-contain mt-4" />
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

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md h-full flex flex-col bg-[#111] relative shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20">
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">
                <span className="bg-purple-500/20 p-2 rounded-lg">
                  <Images className="w-5 h-5 text-purple-400" />
                </span>
                Gallery
              </h2>
              <button 
                onClick={() => setShowGallery(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 pb-24 auto-rows-[150px]">
                  {galleryImages.map((img, index) => (
                    <div 
                      key={img.id} 
                      className={`relative group rounded-xl overflow-hidden shadow-lg border border-white/5 transition-all duration-300 hover:border-purple-500/30 cursor-pointer ${
                        index % 3 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                      }`}
                      onClick={() => setLightboxImage(toServerFileUrl(img.image_url))}
                    >
                      <img 
                        src={toServerFileUrl(img.image_url)} 
                        alt="Gallery Item" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                          VIEW
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
                      <Images className="w-12 h-12 text-purple-500/50" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <span className="text-white font-bold text-lg">0</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Empty Gallery</h3>
                    <p className="text-white/40 max-w-[200px] mx-auto text-sm leading-relaxed">This profile hasn't uploaded any flyers or photos yet.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center space-x-3 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (lightboxImage) {
                  fetch(lightboxImage)
                    .then(response => response.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.style.display = 'none';
                      a.href = url;
                      const filename = lightboxImage.split('/').pop() || 'gallery-image.jpg';
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    })
                    .catch(err => {
                      console.error('Download failed, opening in new tab', err);
                      window.open(lightboxImage, '_blank');
                    });
                }
              }}
              className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md group"
              title="Download Image"
            >
              <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md group"
              onClick={() => setLightboxImage(null)}
              title="Close"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={lightboxImage} 
              alt="Full Size" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};
