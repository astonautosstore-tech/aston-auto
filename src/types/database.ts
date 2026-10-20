export type CarStatus = 'available' | 'reserved' | 'sold';
export type CarCondition = 'Brand New' | 'Certified Pre-Owned' | 'Classic / Collector';
export type CommentStatus = 'pending' | 'approved' | 'hidden';

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface Car {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  discount_price: number | null;
  mileage: number;
  transmission: string;
  fuel_type: string;
  body_type: string;
  color: string;
  interior_color?: string;
  condition: CarCondition;
  engine: string;
  acceleration_0_100: number; // in seconds
  top_speed_kmh: number; // km/h
  horsepower: number; // HP
  torque_nm: number; // Nm
  description: string;
  features: string[];
  status: CarStatus;
  stock_quantity: number;
  is_featured: boolean;
  hero_image: string;
  images: string[];
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  car_id: string;
  user_name: string;
  rating: number; // 1-5
  body: string;
  status: CommentStatus;
  admin_reply?: string;
  created_at: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  car_id?: string;
  car_title?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_contact: 'whatsapp' | 'call' | 'email';
  status: 'new' | 'contacted' | 'resolved';
  created_at: string;
}

export interface TestDriveRequest {
  id: string;
  car_id: string;
  car_title?: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export type TestDrive = TestDriveRequest;

export interface SiteSettings {
  id: number;
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  showroom_hours: string;
  social_links: {
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  hero_headline: string;
  hero_subheadline: string;
}
