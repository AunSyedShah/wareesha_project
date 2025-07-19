export interface User {
  _id: string;
  id?: string; // Computed property for compatibility
  email: string;
  name: string;
  role: 'attendee' | 'organizer' | 'exhibitor';
  password?: string; // Only for registration/update
  __v?: number;
}

// Login/Register request interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'attendee' | 'organizer' | 'exhibitor';
}

// Auth response interface
export interface AuthResponse {
  message: string;
  status: boolean;
  data?: User;
}

export interface Expo {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  location: string;
  theme: string;
  maxExhibitors: number;
  registrationDeadline: Date;
  status: 'upcoming' | 'active' | 'completed';
  floorPlan: FloorPlan;
  createdBy: string;
  createdAt: Date;
}

export interface FloorPlan {
  width: number;
  height: number;
  booths: Booth[];
}

export interface Booth {
  id: string;
  number: string;
  x: number;
  y: number;
  width: number;
  height: number;
  price: number;
  status: 'available' | 'reserved' | 'occupied';
  exhibitorId?: string;
  category?: string;
}

export interface Exhibitor {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  logo?: string;
  website?: string;
  contactPerson: string;
  email: string;
  phone: string;
  products: string[];
  services: string[];
  boothIds: string[];
  expoId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
}

export interface Schedule {
  id: string;
  expoId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  speaker?: string;
  location: string;
  category: string;
  maxAttendees?: number;
  registeredAttendees: string[];
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Registration {
  id: string;
  userId: string;
  expoId: string;
  registeredAt: Date;
  sessions: string[];
}