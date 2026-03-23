export interface Builder {
  builderId: number;
  name: string;
  tagLine: string;
  description: string;
  officeAddress: string;
  langLog: string;
  emailAddress: string;
  contact1: string;
  contact2: string;
  gstNo: string;
  ownerName: string;
  isActive: boolean;
  isVerified: boolean;
  logoUrl?: string;
  websiteUrl?: string;
  yearEstablished?: number;
  operatingCities?: string;
}
