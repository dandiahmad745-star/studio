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

export type DayHours = {
  isOpen: boolean;
  open: string; // HH:mm
  close: string; // HH:mm
};

export type OperatingHours = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: DayHours;
};


export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email:string;
  logo: string; // Base64 data URL or placeholder URL
  operatingHours: OperatingHours;
  whatsappNumberForAbsence?: string;
  playlistUrl?: string;
}

export interface Barista {
  id: string;
  name: string;
  bio: string;
  image: string;
  instagram?: string;
  favoriteDrink?: string;
  skills?: string[];
}

export interface Schedule {
    date: string; // YYYY-MM-DD
    baristaId: string;
    shift: 'Morning' | 'Afternoon' | 'Night' | 'Off';
}

export interface LeaveRequest {
    id: string;
    baristaId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    doctorNoteImage?: string; // Base64 data URL
}

export interface JobVacancy {
    id: string;
    title: string;
    description: string;
    type: 'Full-time' | 'Part-time' | 'Internship';
    postedDate: string; // ISO date string
    isActive: boolean;
}

export interface CustomerMessage {
    id: string;
    customerName: string;
    baristaId: string;
    baristaName: string;
    message: string;
    date: string; // ISO date string
    status: 'read' | 'unread';
}
