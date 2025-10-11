export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string; // Base64 data URL or placeholder URL
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
  reply?: string;
}

export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email:string;
  logo: string; // Base64 data URL or placeholder URL
}
