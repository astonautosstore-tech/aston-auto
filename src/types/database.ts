export type CarStatus = 'available' | 'reserved' | 'sold';
export type CarCondition = 'Brand New' | 'Certified Pre-Owned' | 'Classic / Collector';
export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'completed' | 'cancelled';
export type DeliveryMethod = 'pickup' | 'delivery';
export type CommentStatus = 'pending' | 'approved' | 'hidden';

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

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  car_id: string;
  car?: Car;
  price_at_purchase: number;
  quantity: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  subtotal: number;
  fees: number;
  deposit_amount?: number;
  total: number;
  delivery_method: DeliveryMethod;
  delivery_address?: string;
  notes?: string;
  payment_method: string;
  payment_reference?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  car_id: string;
  user_id?: string | null;
  user_name: string;
  user_avatar?: string;
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
  license_number?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface TradeInRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  vin?: string;
  estimated_value?: number;
  images: string[];
  notes?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  created_at: string;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  showroom_hours: string;
  deposit_percentage: number;
  flat_delivery_fee: number;
  social_links: {
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  hero_headline: string;
  hero_subheadline: string;
}
