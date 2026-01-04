
export type ProductStatus = 'available' | 'reserved' | 'sold' | 'archived';
export type ConditionGrade = 'New' | 'Refurbished' | 'Used (Good)' | 'Used (Fair)';
export type PowerSource = 'Electric (3-Phase)' | 'Electric (1-Phase)' | 'Gas' | 'Manual';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'views';

export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  location?: string;
  memberSince: string;
}

export interface Seller {
  id: string;
  name: string;
  type: 'individual' | 'supplier'; // Distinguish official shops
  isVerified: boolean; // Fayda verified
  rating: number;
  location: string;
  memberSince: string;
  logo?: string; // Brand logo for suppliers
  banner?: string; // Hero banner for shop page
  description?: string; // Shop bio
}

export interface TechnicalSpecs {
  [key: string]: string | number;
}

export interface ConditionReport {
  grade: 'A' | 'B' | 'C';
  inspectorName: string;
  inspectionDate: string;
  videoUrl?: string; // Proof of life
  notes: string;
}

export type ListingTier = 'basic' | 'standard' | 'premium';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  reserveAmount: number; // 10%
  condition: ConditionGrade;
  conditionReport?: ConditionReport; // New field for verification
  isRescaVerified?: boolean; // "Prime"-like status (Inspected at Hub)
  power: PowerSource;
  images: string[];
  specs: TechnicalSpecs;
  seller: Seller;
  status: ProductStatus;
  location: string; // Plus Code or general area
  isFeatured?: boolean; // For 2x2 grid span
  viewCount: number;
  
  // Listing Expiry & Packages
  listingTier?: ListingTier;
  expiryDate?: string; // ISO Date
  isExpired?: boolean;

  // Pay-Per-View Access Control
  isLocked?: boolean;
  
  // Offers
  negotiable?: boolean; // If true, "Make an Offer" button is shown

  // AI & External Integration Fields
  isImageCertified?: boolean; // Seller attestation
  aiDetectionStatus?: 'pending' | 'clear' | 'flagged'; // Result from external API scan
  externalIntegrationId?: string; // ID for mapping to external inventory systems
}

export interface FilterState {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  conditions: ConditionGrade[];
  onlyVerified?: boolean; // New filter
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}