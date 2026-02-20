import { Profile } from '../types/profile';

const STORAGE_KEY = 'kontak-clients';

const initialProfiles: Profile[] = [
  {
    id: "20251001-0000-0001",
    pin: "12345",
    uniqueCode: "gsdbhb7390bcsdhjughu",
    fullName: "Default Name 1",
    email: "default1@example.com",
    jobTitle: "Default Job",
    companyName: "Default Company",
    mobilePrimary: "123-456-7890",
    landlineNumber: "238490-9083287",
    address: "Default Address 1",
    facebookLink: "Update your Facebook Link",
    instagramLink: "Update your Instagram Link",
    tiktokLink: "Update your TikTok Link",
    whatsappNumber: "Update your WhatsApp Number",
    websiteLink: "Update your web link"
  },
  {
    id: "20251001-0000-0002",
    pin: "67890",
    uniqueCode: "cjfidhverkscdkdscmkdsjf",
    fullName: "John Doe",
    email: "john@example.com",
    jobTitle: "Developer",
    companyName: "Tech Corp",
    mobilePrimary: "987-654-3210",
    landlineNumber: "555-123-4567",
    address: "123 Tech St",
    facebookLink: "https://facebook.com/johndoe",
    instagramLink: "https://instagram.com/johndoe",
    tiktokLink: "https://tiktok.com/@johndoe",
    whatsappNumber: "+1234567890",
    websiteLink: "https://johndoe.com"
  },
  {
    id: "20251001-0000-0003",
    pin: "54321",
    uniqueCode: "xyz789abc123def456",
    fullName: "Jane Smith",
    email: "jane@example.com",
    jobTitle: "Designer",
    companyName: "Creative Ltd",
    mobilePrimary: "555-123-4567",
    landlineNumber: "555-987-6543",
    address: "456 Art Ave",
    facebookLink: "https://facebook.com/janesmith",
    instagramLink: "https://instagram.com/janesmith",
    tiktokLink: "https://tiktok.com/@janesmith",
    whatsappNumber: "+0987654321",
    websiteLink: "https://janesmith.com"
  },
  {
    id: "20251001-0000-0004",
    pin: "11111",
    uniqueCode: "abc123xyz789ghi456",
    fullName: "Default Name 4",
    email: "default4@example.com",
    jobTitle: "Default Job",
    companyName: "Default Company",
    mobilePrimary: "111-222-3333",
    landlineNumber: "111-444-5555",
    address: "Default Address 4",
    facebookLink: "Update your Facebook Link",
    instagramLink: "Update your Instagram Link",
    tiktokLink: "Update your TikTok Link",
    whatsappNumber: "Update your WhatsApp Number",
    websiteLink: "Update your web link"
  },
  {
    id: "20251001-0000-0005",
    pin: "99999",
    uniqueCode: "def456jkl789mno123",
    fullName: "Default Name 5",
    email: "default5@example.com",
    jobTitle: "Default Job",
    companyName: "Default Company",
    mobilePrimary: "444-555-6666",
    landlineNumber: "444-777-8888",
    address: "Default Address 5",
    facebookLink: "Update your Facebook Link",
    instagramLink: "Update your Instagram Link",
    tiktokLink: "Update your TikTok Link",
    whatsappNumber: "Update your WhatsApp Number",
    websiteLink: "Update your web link"
  }
];

export const initializeStorage = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProfiles));
    console.log('Storage initialized with sample profiles');
  }
};

export const getProfiles = (): Profile[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getProfileById = (id: string): Profile | undefined => {
  const profiles = getProfiles();
  return profiles.find(p => p.id === id);
};

export const updateProfile = (updatedProfile: Profile): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === updatedProfile.id);

  if (index !== -1) {
    profiles[index] = updatedProfile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    console.log('Profile updated in localStorage:', updatedProfile);
  }
};

export const verifyCredentials = (id: string, pin: string): boolean => {
  const profile = getProfileById(id);
  return profile ? profile.pin === pin : false;
};
