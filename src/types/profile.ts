export interface Profile {
  id: string;
  pin: string;
  uniqueCode: string;
  fullName: string;
  email: string;
  jobTitle: string;
  companyName: string;
  mobilePrimary: string;
  mobileSecondary?: string;
  landline?: string;
  address: string;
  facebookLink?: string;
  instagramLink?: string;
  tiktokLink?: string;
  whatsappNumber?: string;
  others?: string;
  websiteLink?: string;
  logoPhoto?: string;
}
