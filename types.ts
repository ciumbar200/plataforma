
export enum UserRole {
  INQUILINO = 'INQUILINO',
  PROPIETARIO = 'PROPIETARIO',
  ADMIN = 'ADMIN',
}

export enum RentalGoal {
  FIND_ROOMMATES_AND_APARTMENT = 'FIND_ROOMMATES_AND_APARTMENT',
  FIND_ROOM_WITH_ROOMMATES = 'FIND_ROOM_WITH_ROOMMATES',
  BOTH = 'BOTH',
}

export interface User {
  id: string;
  name: string;
  email?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  locality?: string;
  rentalGoal?: RentalGoal;
  age: number;
  profilePicture: string;
  videoUrl?: string;
  interests: string[];
  noiseLevel: 'Bajo' | 'Medio' | 'Alto';
  compatibility: number;
  role: UserRole;
  bio?: string;
  lifestyle?: string[];
  commuteDistance?: number; // in minutes
  isBanned?: boolean;
}

export type AmenityId = 
  | 'pool' | 'wifi' | 'airConditioning' | 'heating' | 'furnished' 
  | 'kitchen' | 'washingMachine' | 'parking' | 'elevator' | 'balcony' 
  | 'petsAllowed' | 'gym' | 'doorman';

export type PropertyFeatures = {
  [key in AmenityId]?: boolean;
};

export enum PropertyType {
  FLAT = 'Piso',
  APARTMENT = 'Apartamento',
  HOUSE = 'Casa',
  STUDIO = 'Estudio',
  ROOM = 'Habitación',
}

export interface Property {
  id: number;
  // FIX: Added owner_id to align the type with the database schema and application logic.
  owner_id: string;
  title: string;
  address: string; // Street address
  city?: string;
  locality?: string;
  postalCode?: string;
  propertyType: PropertyType;
  imageUrls: string[];
  videoUrl?: string;
  price: number;
  visibility: 'Pública' | 'Privada';
  views: number;
  compatibleCandidates: number;
  conditions?: string;
  features?: PropertyFeatures;
  availableFrom: string;
  lat: number;
  lng: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface OwnerStats {
    monthlyEarnings: { name: string; earnings: number }[];
    totalProperties: number;
    totalViews: number;
    totalCandidates: number;
}

export enum NotificationType {
  NEW_MATCH = 'NEW_MATCH',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PROPERTY_INQUIRY = 'PROPERTY_INQUIRY',
  CANDIDATE_ALERT = 'CANDIDATE_ALERT',
  SAVED_SEARCH_MATCH = 'SAVED_SEARCH_MATCH',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export interface Notification {
  id: number;
  userId: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  relatedEntityId?: number;
}

export interface SavedSearch {
  id: number;
  userId: string;
  name: string;
  filters: {
    city?: string;
    // FIX: Added optional 'locality' property to align with mock data and application features.
    locality?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: AmenityId[];
  };
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  content: string; 
  author: string;
  authorImageUrl: string;
  publishDate: string;
}