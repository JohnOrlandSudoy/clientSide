export interface Profile {
  id: string;                    // "20251001-0000-0001"
  pin: string;                   // "12345"
  uniqueCode: string;            // "gsdbhb7390bcsdhjughu"
  profilePhoto?: string;         // Uploaded photo URL
  fullName: string;              // "Default Name 1"
  email: string;                 // "default1@example.com"
  status?: string;
  jobTitle: string;              // "Default Job"
  companyName: string;           // "Default Company"
  location?: string;             // "Default Location"
  mobilePrimary: string;         // "123-456-7890"
  landlineNumber: string;        // "238490-9083287"
  address: string;               // "Default Address 1"
  facebookLink: string;          // "Update your Facebook Link"
  instagramLink: string;         // "Update your Instagram Link"
  tiktokLink: string;            // "Update your TikTok Link"
  whatsappNumber: string;        // "Update your WhatsApp Number"
  viberNumber?: string;          // "Update your Viber Number"
  websiteLink: string;           // "Update your web link"
  aboutText?: string;            // "About text"
  createdAt?: string;
  updatedAt?: string;
}
