/* ═══════════════════════════════════════════════════════
   AURUM RESTAURANT — Types
   All TypeScript types/interfaces for the project
   ═══════════════════════════════════════════════════════ */

export interface FeaturedDish {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export interface TastingMenu {
  courses: number;
  price: string;
  description: string;
  items: string[];
}

export interface Experience {
  id: number;
  title: string;
  description: string;
  capacity: number;
  duration: string;
  priceRange: string;
  image: string;
  cta: string;
}

export interface Cocktail {
  name: string;
  description: string;
  price: string;
}

export interface Wine {
  name: string;
  producer: string;
  region: string;
  notes: string;
  price: string;
}

export interface TeaPairing {
  tea: string;
  pairedWith: string;
}

export interface WineProgram {
  philosophy: string;
  cocktails: Cocktail[];
  wines: Wine[];
  teaPairings: TeaPairing[];
}

export interface Testimonial {
  quote: string;
  author: string;
  occasion: string;
  rating: number;
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: 'Ambiance' | 'Food' | 'Behind-the-Scenes' | 'Ingredients' | 'Events';
  span?: 'tall' | 'wide' | 'normal';
  caption?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'starters' | 'kebabs' | 'biryanis' | 'mains' | 'breads' | 'desserts' | 'beverages';
  isAvailable: boolean;
  dietaryTags: string[];
  spiceLevel: number;
  badges: string[];
  story?: string;
}

export interface SeasonalDish {
  name: string;
  description: string;
  seasonalIngredient: string;
  availableUntil: string;
}

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: string;
  dietaryReqs: string;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface QuickNavCard {
  title: string;
  description: string;
  icon: string;
  scrollTo: string;
}

export interface Chef {
  name: string;
  bio: string;
  quote: string;
  image: string;
  kitchenImage: string;
}

export interface RestaurantHours {
  open: string;
  close: string;
}

export interface RestaurantAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  googleMapsUrl: string;
}

export interface Restaurant {
  name: string;
  tagline: string;
  taglineSubtitle: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: RestaurantAddress;
  hours: {
    monThu: RestaurantHours;
    friSat: RestaurantHours;
    sun: RestaurantHours;
  };
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}
