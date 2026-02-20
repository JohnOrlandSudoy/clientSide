import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Profile } from '../types/profile';
import { User, Mail, Phone, MapPin, Facebook, Instagram, Music, MessageCircle, Globe, Edit3 } from 'lucide-react';
import { getPublicProfile as apiGetPublicProfile, toServerFileUrl } from '../api/api';

export const PublicProfileView = () => {
  const { uniqueCode } = useParams<{ uniqueCode: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4d6d] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
          <Link 
            to="/"
            className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] text-white px-6 py-3 rounded-lg hover:from-[#2563a5] hover:to-[#1a4d6d] transition-all font-semibold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isDefaultValue = (value: string, defaultText: string) => {
    return value === defaultText || value.includes('Update your');
  };

  const isBanned = profile.status === 'banned';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] p-8 text-center text-white">
            <div className="relative inline-block">
              {profile.profilePhoto ? (
                <img 
                  src={toServerFileUrl(profile.profilePhoto)} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-2xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 border-4 border-white shadow-2xl flex items-center justify-center">
                  <User className="w-16 h-16 text-white/60" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{profile.fullName}</h1>
            <p className="text-xl text-white/90 mb-1">{profile.jobTitle}</p>
            <p className="text-lg text-white/80">{profile.companyName}</p>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {isBanned && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-center font-semibold">
                This profile is currently banned.
              </div>
            )}
            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1a4d6d] mb-6 flex items-center">
                <div className="w-1 h-6 bg-orange-500 mr-3 rounded"></div>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#1a4d6d]" />
                    <div>
                      <p className="font-medium text-gray-800">Primary Mobile</p>
                      <p className="text-gray-600">{profile.mobilePrimary}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#1a4d6d]" />
                    <div>
                      <p className="font-medium text-gray-800">Landline</p>
                      <p className="text-gray-600">{profile.landlineNumber}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#1a4d6d]" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#1a4d6d] mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">{profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1a4d6d] mb-6 flex items-center">
                <div className="w-1 h-6 bg-orange-500 mr-3 rounded"></div>
                Social Media & Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isDefaultValue(profile.facebookLink, 'Update your Facebook Link') && (
                  <a 
                    href={profile.facebookLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-800 font-medium">Facebook</span>
                  </a>
                )}
                
                {!isDefaultValue(profile.instagramLink, 'Update your Instagram Link') && (
                  <a 
                    href={profile.instagramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-pink-600" />
                    <span className="text-pink-800 font-medium">Instagram</span>
                  </a>
                )}
                
                {!isDefaultValue(profile.tiktokLink, 'Update your TikTok Link') && (
                  <a 
                    href={profile.tiktokLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Music className="w-6 h-6 text-gray-800" />
                    <span className="text-gray-800 font-medium">TikTok</span>
                  </a>
                )}
                
                {!isDefaultValue(profile.whatsappNumber, 'Update your WhatsApp Number') && (
                  <a 
                    href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-800 font-medium">WhatsApp</span>
                  </a>
                )}
                
                {!isDefaultValue(profile.websiteLink, 'Update your web link') && (
                  <a 
                    href={profile.websiteLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Globe className="w-6 h-6 text-purple-600" />
                    <span className="text-purple-800 font-medium">Website</span>
                  </a>
                )}
              </div>
              
              {/* Show message if no social links are available */}
              {isDefaultValue(profile.facebookLink, 'Update your Facebook Link') &&
               isDefaultValue(profile.instagramLink, 'Update your Instagram Link') &&
               isDefaultValue(profile.tiktokLink, 'Update your TikTok Link') &&
               isDefaultValue(profile.whatsappNumber, 'Update your WhatsApp Number') &&
               isDefaultValue(profile.websiteLink, 'Update your web link') && (
                <div className="text-center py-8 text-gray-500">
                  <p>No social media links available yet.</p>
                  <p className="text-sm">Contact the profile owner to add their social media links.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
