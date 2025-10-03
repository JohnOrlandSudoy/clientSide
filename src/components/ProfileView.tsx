import { useState, useEffect } from 'react';
import { Profile } from '../types/profile';
import { getProfileById } from '../utils/storage';
import { ChangePinForm } from './ChangePinForm';
import { ProfileUpdateForm } from './ProfileUpdateForm';
import { Modal } from './Modal';

interface ProfileViewProps {
  userId: string;
}

export const ProfileView = ({ userId }: ProfileViewProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const userProfile = getProfileById(userId);
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userId]);

  const handleSuccess = (message: string) => {
    setModalMessage(message);
    setModalOpen(true);
    const updatedProfile = getProfileById(userId);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] flex items-center justify-center">
        <p className="text-white font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a4d6d] via-[#2563a5] to-[#1e5a7d] pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <ChangePinForm profile={profile} onSuccess={handleSuccess} />
        <ProfileUpdateForm profile={profile} onSuccess={handleSuccess} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};
