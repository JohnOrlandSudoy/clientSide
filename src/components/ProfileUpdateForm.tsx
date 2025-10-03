import { useState } from 'react';
import { User, Briefcase, Building, Phone, Mail, MapPin, Facebook, Instagram, Music, MessageCircle, Globe, Upload } from 'lucide-react';
import { Profile } from '../types/profile';
import { updateProfile } from '../utils/storage';

interface ProfileUpdateFormProps {
  profile: Profile;
  onSuccess: (message: string) => void;
}

export const ProfileUpdateForm = ({ profile, onSuccess }: ProfileUpdateFormProps) => {
  const [formData, setFormData] = useState<Profile>(profile);

  const handleChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    onSuccess('Your profile updated successfully');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] p-2 rounded-lg mr-3">
          <User className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a4d6d]">Profile Information</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number (Read-only)
          </label>
          <input
            type="text"
            value={formData.id}
            readOnly
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building className="w-4 h-4 mr-1" />
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Mobile Number (Primary)
            </label>
            <input
              type="text"
              value={formData.mobilePrimary}
              onChange={(e) => handleChange('mobilePrimary', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number (Secondary)
            </label>
            <input
              type="text"
              value={formData.mobileSecondary || ''}
              onChange={(e) => handleChange('mobileSecondary', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Landline Number
            </label>
            <input
              type="text"
              value={formData.landline || ''}
              onChange={(e) => handleChange('landline', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-[#1a4d6d] mb-4 flex items-center">
            <div className="w-1 h-6 bg-orange-500 mr-3 rounded"></div>
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Facebook className="w-4 h-4 mr-1" />
                Facebook Link
              </label>
              <input
                type="url"
                value={formData.facebookLink || ''}
                onChange={(e) => handleChange('facebookLink', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Instagram className="w-4 h-4 mr-1" />
                Instagram Link
              </label>
              <input
                type="url"
                value={formData.instagramLink || ''}
                onChange={(e) => handleChange('instagramLink', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Music className="w-4 h-4 mr-1" />
                TikTok Link
              </label>
              <input
                type="url"
                value={formData.tiktokLink || ''}
                onChange={(e) => handleChange('tiktokLink', e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Website Link
              </label>
              <input
                type="url"
                value={formData.websiteLink || ''}
                onChange={(e) => handleChange('websiteLink', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Others
              </label>
              <input
                type="text"
                value={formData.others || ''}
                onChange={(e) => handleChange('others', e.target.value)}
                placeholder="Additional links"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563a5] focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-[#1a4d6d] mb-6 flex items-center">
            <div className="w-1 h-6 bg-orange-500 mr-3 rounded"></div>
            Logo / Photo ID
          </h3>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src="/image.png"
                  alt="Profile"
                  className="w-40 h-40 object-cover rounded-2xl border-4 border-white shadow-lg group-hover:shadow-2xl transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex-1 w-full">
                <label className="group flex flex-col items-center justify-center w-full px-6 py-8 border-3 border-dashed border-[#2563a5] rounded-xl cursor-pointer hover:border-orange-500 transition-all bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 shadow-sm hover:shadow-md">
                  <div className="bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-base font-semibold text-[#1a4d6d] mb-1">Upload Photo</span>
                  <span className="text-xs text-gray-500 mb-3">Click or drag and drop</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-4 py-1 rounded-full">PNG, JPG up to 5MB</span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] text-white py-3.5 rounded-lg hover:from-[#2563a5] hover:to-[#1a4d6d] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-[1.02]"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};
