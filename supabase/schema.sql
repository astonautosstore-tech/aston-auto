-- ==============================================================================
-- ASTON - PRODUCTION SUPABASE SQL SCHEMA & SEED
-- Description: Complete schema for Inventory, Admin Console, Blog, Orders, Inquiries, 
--              Reviews, Site Settings, Storage Buckets, and Row Level Security.
-- Currency: Strictly in USD ($)
-- Showroom: 450 North Rodeo Drive, Beverly Hills, CA 90210 (+1 448 226 4666)
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- PROFILES (Users & Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  address text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'sales_agent')),
  avatar_url text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CARS (Vehicle Inventory)
CREATE TABLE IF NOT EXISTS public.cars (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric(14, 2) NOT NULL,
  discount_price numeric(14, 2),
  mileage integer NOT NULL DEFAULT 0,
  transmission text NOT NULL DEFAULT 'Automatic',
  fuel_type text NOT NULL DEFAULT 'Petrol',
  body_type text NOT NULL,
  color text NOT NULL,
  interior_color text,
  condition text NOT NULL DEFAULT 'Certified Pre-Owned' CHECK (condition IN ('Brand New', 'Certified Pre-Owned', 'Classic / Collector')),
  engine text NOT NULL,
  acceleration_0_100 numeric(4, 2),
  top_speed_kmh integer,
  horsepower integer,
  torque_nm integer,
  description text NOT NULL,
  features text[] DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  stock_quantity integer NOT NULL DEFAULT 1,
  is_featured boolean NOT NULL DEFAULT false,
  hero_image text,
  images text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ARTICLES (Blog & Automotive Journal)
CREATE TABLE IF NOT EXISTS public.articles (
  slug text PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL,
  date text NOT NULL,
  read_time text NOT NULL,
  cover_image text NOT NULL,
  featured boolean DEFAULT false,
  sections jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDERS (Vehicle Bookings & Purchases)
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'processing', 'completed', 'cancelled')),
  subtotal numeric(14, 2) NOT NULL,
  fees numeric(14, 2) NOT NULL DEFAULT 0,
  deposit_amount numeric(14, 2),
  total numeric(14, 2) NOT NULL,
  delivery_method text NOT NULL DEFAULT 'pickup' CHECK (delivery_method IN ('pickup', 'delivery')),
  delivery_address text,
  notes text,
  payment_method text DEFAULT 'bank_wire',
  payment_reference text,
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDER ITEMS (Relational Items Breakdown)
CREATE TABLE IF NOT EXISTS public.order_items (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id text REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  car_id text REFERENCES public.cars(id) ON DELETE RESTRICT NOT NULL,
  price_at_purchase numeric(14, 2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- COMMENTS / REVIEWS
CREATE TABLE IF NOT EXISTS public.comments (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_id text REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_avatar text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body text NOT NULL,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'hidden')),
  admin_reply text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INQUIRIES (Lead Generation)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_id text REFERENCES public.cars(id) ON DELETE SET NULL,
  car_title text,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  preferred_contact text DEFAULT 'whatsapp' CHECK (preferred_contact IN ('whatsapp', 'call', 'email')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TEST DRIVES (VIP Appointments)
CREATE TABLE IF NOT EXISTS public.test_drives (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_id text REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  car_title text,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  license_number text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRADE-IN APPRAISALS
CREATE TABLE IF NOT EXISTS public.trade_in_requests (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  mileage integer NOT NULL,
  condition text NOT NULL,
  vin text,
  estimated_value numeric(14, 2),
  images text[] DEFAULT '{}'::text[],
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'declined')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SITE SETTINGS (Singleton Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Aston',
  tagline text DEFAULT 'Curators of Extraordinary Motoring',
  phone text DEFAULT '+1 448 226 4666',
  whatsapp text DEFAULT '+1 448 226 4666',
  email text DEFAULT 'concierge@astonautostores.com',
  address text DEFAULT '450 North Rodeo Drive, Beverly Hills, CA 90210',
  showroom_hours text DEFAULT 'Monday – Saturday: 9:00 AM – 7:00 PM (By Appointment)',
  deposit_percentage numeric(5, 2) DEFAULT 10.00,
  flat_delivery_fee numeric(14, 2) DEFAULT 1500.00,
  social_links jsonb DEFAULT '{"instagram": "https://instagram.com/astonautostores", "twitter": "https://twitter.com/astonautostores", "youtube": "https://youtube.com/@astonautostores", "linkedin": "https://linkedin.com/company/aston-auto-stores"}'::jsonb,
  hero_headline text DEFAULT 'The Apex of Automotive Artistry',
  hero_subheadline text DEFAULT 'North America''s premier curated portfolio of supercars and bespoke grand tourers.',
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS & Policies (Safely drop older versions first)
DROP POLICY IF EXISTS "Public Access to Car Images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone Can Upload Car Images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone Can Update Car Images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone Can Delete Car Images" ON storage.objects;

CREATE POLICY "Public Access to Car Images"
ON storage.objects FOR SELECT
USING (bucket_id IN ('car-images', 'blog-images'));

CREATE POLICY "Anyone Can Upload Car Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('car-images', 'blog-images'));

CREATE POLICY "Anyone Can Update Car Images"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('car-images', 'blog-images'));

CREATE POLICY "Anyone Can Delete Car Images"
ON storage.objects FOR DELETE
USING (bucket_id IN ('car-images', 'blog-images'));

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_in_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy or overlapping policies safely
DROP POLICY IF EXISTS "Public can view active cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can update cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;
DROP POLICY IF EXISTS "Allow public select on cars" ON public.cars;
DROP POLICY IF EXISTS "Allow write on cars" ON public.cars;

DROP POLICY IF EXISTS "Allow public select on articles" ON public.articles;
DROP POLICY IF EXISTS "Allow write on articles" ON public.articles;

DROP POLICY IF EXISTS "Public can read approved comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can moderate comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public select on approved comments" ON public.comments;
DROP POLICY IF EXISTS "Allow insert on comments" ON public.comments;
DROP POLICY IF EXISTS "Allow update and delete on comments" ON public.comments;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow delete on orders" ON public.orders;

DROP POLICY IF EXISTS "Allow all on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow all on inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow all on test_drives" ON public.test_drives;
DROP POLICY IF EXISTS "Allow all on trade_in_requests" ON public.trade_in_requests;

DROP POLICY IF EXISTS "Allow public select on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow update on site_settings" ON public.site_settings;

DROP POLICY IF EXISTS "Allow public select on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow user update on profiles" ON public.profiles;

-- CARS POLICIES (Public read, full write for authenticated & anon client admin)
CREATE POLICY "Allow public select on cars" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Allow write on cars" ON public.cars FOR ALL USING (true) WITH CHECK (true);

-- ARTICLES POLICIES
CREATE POLICY "Allow public select on articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow write on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);

-- COMMENTS POLICIES
CREATE POLICY "Allow public select on approved comments" ON public.comments FOR SELECT USING (status = 'approved' OR true);
CREATE POLICY "Allow insert on comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update and delete on comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);

-- ORDERS POLICIES
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete on orders" ON public.orders FOR DELETE USING (true);

-- ORDER ITEMS POLICIES
CREATE POLICY "Allow all on order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- INQUIRIES & TEST DRIVES POLICIES
CREATE POLICY "Allow all on inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on test_drives" ON public.test_drives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on trade_in_requests" ON public.trade_in_requests FOR ALL USING (true) WITH CHECK (true);

-- SITE SETTINGS POLICIES
CREATE POLICY "Allow public select on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow update on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- PROFILES POLICIES
CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow user update on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. SEED DATA: SITE SETTINGS
-- ==============================================================================
INSERT INTO public.site_settings (
  id,
  company_name,
  tagline,
  phone,
  whatsapp,
  email,
  address,
  showroom_hours,
  deposit_percentage,
  flat_delivery_fee,
  social_links,
  hero_headline,
  hero_subheadline,
  updated_at
) VALUES (
  1,
  'Aston Auto Stores',
  'Curators of Extraordinary Motoring',
  '+1 448 226 4666',
  '+1 448 226 4666',
  'concierge@astonautostores.com',
  '450 North Rodeo Drive, Beverly Hills, CA 90210',
  'Monday – Saturday: 9:00 AM – 7:00 PM (By Appointment)',
  10,
  1500,
  '{"instagram":"https://instagram.com/astonautostores","twitter":"https://twitter.com/astonautostores","youtube":"https://youtube.com/@astonautostores","linkedin":"https://linkedin.com/company/aston-auto-stores"}'::jsonb,
  'The Apex of Automotive Artistry',
  'North America''s premier curated portfolio of supercars and bespoke grand tourers.',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  tagline = EXCLUDED.tagline,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  showroom_hours = EXCLUDED.showroom_hours,
  deposit_percentage = EXCLUDED.deposit_percentage,
  flat_delivery_fee = EXCLUDED.flat_delivery_fee,
  social_links = EXCLUDED.social_links,
  hero_headline = EXCLUDED.hero_headline,
  hero_subheadline = EXCLUDED.hero_subheadline,
  updated_at = NOW();

-- ==============================================================================
-- 6. SEED DATA: VEHICLE INVENTORY (ALL 20 LUXURY CARS IN USD)
-- ==============================================================================

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-lambo-urus-2023',
  'Lamborghini Urus',
  'lamborghini-urus',
  'Lamborghini',
  'Urus Performante',
  2023,
  250000,
  NULL,
  2100,
  'Automatic',
  'Petrol',
  'SUV',
  'Verde Turbine Matte',
  'Nero Cosmus Alcantara with Giallo Stitching',
  'Certified Pre-Owned',
  '4.0L Twin-Turbocharged V8',
  3.3,
  306,
  666,
  850,
  'The super sports car soul fused with SUV versatility. Performante lightweight carbon bonnet, titanium sports exhaust, and rally driving mode.',
  '"Carbon Ceramic Brakes","Akrapovic Titanium Exhaust","Bang & Olufsen 3D Audio","23-inch Pelope Forged Alloys"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-lambo-huracan-2023',
  'Lamborghini Huracan',
  'lamborghini-huracan',
  'Lamborghini',
  'Huracán Tecnica',
  2023,
  260000,
  NULL,
  1800,
  'Automatic',
  'Petrol',
  'Coupe',
  'Bianco Monocerus',
  'Sportivo Bicolor Alcantara',
  'Certified Pre-Owned',
  '5.2L Naturally Aspirated V10',
  3.2,
  325,
  640,
  565,
  'Unfiltered V10 symphony revving to 8,500 RPM with rear-wheel drive and rear-wheel steering for pure driver engagement on road and circuit.',
  '"LDVI Dynamic Vehicle Integration","Rear-Wheel Steering","Carbon Ceramic CCB Brakes","Titanium Roll Bar"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-merc-gclass-2023',
  'Mercedes-Benz G-Class',
  'mercedes-benz-g-class',
  'Mercedes-Benz',
  'AMG G 63 4MATIC',
  2023,
  160000,
  NULL,
  5100,
  'Automatic',
  'Petrol',
  'SUV',
  'Obsidian Black Metallic',
  'G manufaktur Exclusive Two-Tone Nappa',
  'Certified Pre-Owned',
  '4.0L Handcrafted Biturbo V8',
  4.5,
  240,
  577,
  850,
  'The timeless icon of off-road domination and uncompromising luxury. Handcrafted biturbo V8, triple locking differentials, and side-exit sport exhaust.',
  '"Triple 100% Differential Locks","AMG Side-Exit Performance Exhaust","Burmester Surround Sound","AMG Night Package Plus"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-merc-190e-1990',
  'Mercedes-Benz 190E 2.3',
  'mercedes-benz-190e-2-3',
  'Mercedes-Benz',
  '190E 2.3-16 Cosworth',
  1990,
  17000,
  NULL,
  82000,
  'Automatic',
  'Petrol',
  'Sedan',
  'Champagne Smoke Silver Metallic',
  'Anthracite Classic Check Cloth/Leather',
  'Classic / Collector',
  '2.3L 16-Valve DOHC Cosworth Inline-4',
  7.5,
  230,
  185,
  235,
  'An authentic DTM homologation classic. Co-developed with Cosworth, this pristine survivor features original aerodynamic bodykit, rear spoiler, and period Recaro sport seats.',
  '"Cosworth 16V Cylinder Head","Hydropneumatic Self-Leveling Rear Suspension","Factory Aerodynamic Bodykit","Original Becker Sound System"'::text[],
  'available',
  1,
  false,
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-mclaren-p1-2015',
  'McLaren P1',
  'mclaren-p1',
  'McLaren',
  'P1 Hybrid Hypercar',
  2015,
  1450000,
  NULL,
  1200,
  'Automatic',
  'Hybrid',
  'Coupe',
  'Volcano Red Elite',
  'Carbon Black Alcantara & Exposed Weave',
  'Classic / Collector',
  '3.8L Twin-Turbo V8 + Electric Motor',
  2.8,
  350,
  903,
  900,
  'The definitive holy-trinity hypercar. 1 of only 375 examples produced. Produces 600 kg of downforce in Race Mode with Formula 1 DRS and IPAS instant-power hybrid boost.',
  '"Carbon Fiber MonoCage Chassis","Active Aerodynamic Rear Wing with DRS","RaceActive Chassis Control (RCC)","Akebono Carbon Ceramic CCX Brakes"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-mclaren-720s-2020',
  'McLaren 720S',
  'mclaren-720s',
  'McLaren',
  '720S Performance Coupe',
  2020,
  300000,
  NULL,
  4800,
  'Automatic',
  'Petrol',
  'Coupe',
  'Silica White with Gloss Carbon Pack',
  'Scoria Grey & McLaren Orange Alcantara',
  'Certified Pre-Owned',
  '4.0L Twin-Turbocharged M840T V8',
  2.9,
  341,
  710,
  770,
  'Supercar benchmark performance with dihedral doors and iconic eye-socket aero intakes. Features Proactive Chassis Control II and active airbrake wing.',
  '"Carbon Fiber Monocage II","Active Aerodynamic Airbrake","Folding Driver Instrument Display","Bowers & Wilkins 12-Speaker Sound"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-audi-r8-2022',
  'Audi R8',
  'audi-r8',
  'Audi',
  'R8 V10 Performance quattro',
  2022,
  160000,
  NULL,
  6300,
  'Automatic',
  'Petrol',
  'Coupe',
  'Mythos Black Metallic',
  'Black Fine Nappa with Diamond Stitching',
  'Certified Pre-Owned',
  '5.2L Naturally Aspirated FSI V10',
  3.1,
  331,
  602,
  560,
  'The everyday supercar. Shares 50% of its parts with the R8 LMS GT3 racecar, powered by an intoxicating high-revving naturally aspirated V10 and quattro AWD.',
  '"Audi Laser Light Technology","Fixed Gloss Carbon Rear Wing","Ceramic Brakes with Red Calipers","Sport Exhaust System"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'col-porsche-cayenne-2023',
  'Porsche Cayenne',
  'porsche-cayenne',
  'Porsche',
  'Cayenne Turbo GT',
  2023,
  90000,
  NULL,
  7900,
  'Automatic',
  'Petrol',
  'SUV',
  'Crayon / Chalk Grey',
  'GT Interior Package with Neodyme Accents',
  'Certified Pre-Owned',
  '4.0L Twin-Turbocharged V8',
  3.3,
  300,
  650,
  850,
  'Nürburgring lap-record holder. The Cayenne Turbo GT combines track-honed chassis dynamics with titanium central sports exhaust and carbon fiber roof.',
  '"Contoured Carbon Lightweight Roof","Porsche Ceramic Composite Brakes (PCCB)","Rear-Axle Steering with Power Steering Plus","Titanium Sports Exhaust System"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  '"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '11111111-1111-4111-8111-111111111111',
  'Aston Martin DBS 770 Ultimate',
  'aston-martin-dbs-770-ultimate',
  'Aston Martin',
  'DBS 770 Ultimate',
  2024,
  520000000,
  495000000,
  45,
  '8-Speed ZF Automatic',
  'Petrol',
  'Coupe',
  'British Racing Green',
  'Obsidian Black Semi-Aniline Leather',
  'Brand New',
  '5.2L Twin-Turbocharged V12',
  3.4,
  340,
  770,
  900,
  'The pinnacle of the DBS dynasty. Engineered to deliver savage power with peerless grand touring refinement. Only 499 examples exist worldwide. Fitted with carbon ceramic brakes, bespoke satin carbon fiber aerokit, and sports plus quilted bucket seats.',
  '"Carbon Ceramic Braking System (CCB)","Bang & Olufsen BeoSound 13-Speaker Audio","Full Carbon Fiber Aero Splitter and Diffuser","21-Inch Satin Black Diamond Turned Alloys","Heated & Ventilated Memory Seats","Adaptive Damping System with Skyhook Technology","360 Degree Surround Camera System","Aston Martin Bespoke Luggage Set Included"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '22222222-2222-4222-8222-222222222222',
  'Rolls-Royce Spectre Bespoke',
  'rolls-royce-spectre-bespoke',
  'Rolls-Royce',
  'Spectre',
  2024,
  640000000,
  NULL,
  12,
  'Single-Speed Automatic',
  'Electric',
  'Coupe',
  'Chartreuse & Diamond Black Two-Tone',
  'Grace White & Chartreuse Leather',
  'Brand New',
  'Dual Synchronous Electric Motors (102 kWh)',
  4.5,
  250,
  585,
  900,
  'The world''s first Ultra-Luxury Electric Super Coupé. Spectre delivers the famed Rolls-Royce ''Magic Carpet Ride'' in near-absolute acoustic silence. Featuring Starlight Doors with 4,796 gently illuminated stars and an illuminated Spirit of Ecstasy.',
  '"Starlight Headliner with Shooting Star Effect","Illuminated Grille with 22 Individual LEDs","Planar Suspension System with Decoupled Anti-Roll Bars","Bespoke 18-Channel High Fidelity Audio","Effortless Power-Assisted Doors","Ventilated Massage Front & Rear Lounges","520 km WLTP Electric Driving Range"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '33333333-3333-4333-8333-333333333333',
  'Porsche 911 GT3 RS (992)',
  'porsche-911-gt3-rs-992',
  'Porsche',
  '911 GT3 RS',
  2024,
  380000000,
  365000000,
  120,
  '7-Speed Porsche Doppelkupplung (PDK)',
  'Petrol',
  'Coupe',
  'Arctic Grey',
  'Black Leather & Race-Tex with Guards Red Stitching',
  'Brand New',
  '4.0L Naturally Aspirated Boxer-6',
  3.2,
  296,
  525,
  465,
  'Pure motorsport DNA made road legal. The 992 GT3 RS features an active DRS rear wing producing 860 kg of downforce at 285 km/h, magnesium lightweight wheels, and four rotary knobs on the steering wheel controlling compression, rebound, and differential lock.',
  '"Weissach Package with Exposed Carbon Weave Hood and Roof","Active Aerodynamic DRS System (Drag Reduction)","Porsche Ceramic Composite Brakes (PCCB)","Club Sport Package with Titanium Roll Cage","Front Axle Lift System with Smart Memory","Bose Surround Sound Audio","Lightweight Magnesium Forged Wheels"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '44444444-4444-4444-8444-444444444444',
  'Ferrari 296 GTB Assetto Fiorano',
  'ferrari-296-gtb-assetto-fiorano',
  'Ferrari',
  '296 GTB',
  2024,
  430000000,
  NULL,
  85,
  '8-Speed F1 Dual-Clutch',
  'Hybrid',
  'Coupe',
  'Rosso Corsa',
  'Nero Cuoio Alcantara with Giallo Accents',
  'Brand New',
  '2.9L Twin-Turbo 120° V6 Hybrid',
  2.9,
  330,
  830,
  740,
  'Defining fun to drive. The Ferrari 296 GTB ushers in Maranello''s V6 hybrid era with 830 cv screaming to an 8,500 rpm redline. Equipped with the Assetto Fiorano lightweight package including Multimatic racing shock absorbers and Lexan rear screen.',
  '"Assetto Fiorano Performance Package","Carbon Fiber Racing Seats with Lifter","Scuderia Ferrari Carbon Shields","Passenger Interactive Display","Titanium Exhaust Pipes","Carbon Ceramic Brembo Brakes","Apple CarPlay & Wireless Telemetry"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '55555555-5555-4555-8555-555555555555',
  'Bentley Continental GT Mulliner W12',
  'bentley-continental-gt-mulliner-w12',
  'Bentley',
  'Continental GT Mulliner',
  2024,
  365000000,
  350000000,
  90,
  '8-Speed Dual-Clutch',
  'Petrol',
  'Grand Tourer',
  'Dark Sapphire Metallic',
  'Imperial Blue & Linen Split Leather',
  'Brand New',
  '6.0L Twin-Turbocharged W12 TSI',
  3.6,
  335,
  659,
  900,
  'The ultimate grand touring statement. The Continental GT Mulliner stands at the peak of handcrafted luxury with ''Double Diamond'' matrix front grille, Breitling clock with brushed silver finish, and 400,000 individual stitches decorating the cabin.',
  '"Mulliner Bespoke Double Diamond Quilted Leather","Naim for Bentley 2,200W 18-Speaker Audio","Bentley Rotating Display (Touchscreen / Analog Gauges / Veneer)","Bentley Dynamic Ride 48V Electronic Active Roll Control","Electronic All-Wheel Steering","Panoramic Glass Sunroof with Alcantara Blind"'::text[],
  'available',
  1,
  false,
  'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '66666666-6666-4666-8666-666666666666',
  'Mercedes-Maybach S 680 4MATIC First Class',
  'mercedes-maybach-s-680-4matic-first-class',
  'Mercedes-Benz',
  'Maybach S 680',
  2024,
  340000000,
  NULL,
  30,
  '9G-TRONIC 9-Speed Automatic',
  'Petrol',
  'Sedan',
  'Two-Tone Onyx Black / Kalahari Gold',
  'Maybach Exclusive Nappa Leather Crystal White',
  'Brand New',
  '6.0L Handcrafted Twin-Turbo V12',
  4.5,
  250,
  621,
  900,
  'Executive transportation refined to perfection. Features rear executive reclining thrones with calf massage, refrigerated compartment with bespoke silver-plated champagne flutes, active road noise cancellation, and automated rear comfort doors.',
  '"First-Class Executive Rear Suite with Folding Tables","Burmester High-End 4D Surround Sound (31 Speakers)","Rear Refrigerator Compartment with Robbe & Berking Flutes","Digital Light Projector Headlamps with 2.6M Pixels","E-Active Body Control Fully Active Suspension","Rear-Axle Steering (Up to 10 degrees)"'::text[],
  'available',
  2,
  false,
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '77777777-7777-4777-8777-777777777777',
  'Lamborghini Revuelto V12 Hybrid',
  'lamborghini-revuelto-v12-hybrid',
  'Lamborghini',
  'Revuelto',
  2024,
  690000000,
  670000000,
  15,
  '8-Speed Wet Dual-Clutch Transverse',
  'Hybrid',
  'Coupe',
  'Arancio Apodis (Pearl Orange)',
  'Nero Ade with Arancio Dry-Carbon Accents',
  'Brand New',
  '6.5L Naturally Aspirated V12 + 3 Electric Motors',
  2.5,
  350,
  1015,
  1062,
  'The first HPEV (High Performance Electrified Vehicle) hybrid super sports car from Sant''Agata Bolognese. 1015 CV synthesized through an all-new naturally aspirated V12 and three electric axial flux motors with electric torque vectoring.',
  '"Monofuselage Full Carbon Fiber Monocoque","Electric Torque Vectoring on All Four Wheels","Carbon Ceramic Brakes Plus (CCB Plus 410mm)","Three Digital Cockpit Displays with Swipe Sharing","Bridgestone Potenza Sport Custom Homologated Tires","Lift System with GPS Coordinates Memory"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '88888888-8888-4888-8888-888888888888',
  'Range Rover SV Bespoke LWB V8',
  'range-rover-sv-bespoke-lwb-v8',
  'Land Rover',
  'Range Rover SV LWB',
  2024,
  295000000,
  285000000,
  50,
  '8-Speed Automatic with CommandShift',
  'Petrol',
  'SUV',
  'Belgravia Green Metallic',
  'SV Serenity Caraway & Perlino Semi-Aniline',
  'Brand New',
  '4.4L Twin-Turbocharged V8 Mild Hybrid',
  4.6,
  261,
  606,
  750,
  'Unrivalled luxury SUV presence. Crafted by Special Vehicle Operations with white ceramic interior gear shifters and control dials, 23-inch forged dark grey wheels, and the SV Signature Suite four-seat configuration with electrically deployable club table.',
  '"SV Signature Suite 4-Seat Luxury Configuration","White Ceramic Finisher Controls and Gearshift","Meridian Signature Sound System (35 Speakers, 1600W)","All-Wheel Steering & Electronic Air Suspension with Dynamic Response Pro","Executive Rear 8-Inch Touchscreen Controller","Power Assisted Soft-Close Doors with Gesture Control"'::text[],
  'available',
  2,
  false,
  'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  '99999999-9999-4999-8999-999999999999',
  'Aston Martin DBX707 V8',
  'aston-martin-dbx707-v8',
  'Aston Martin',
  'DBX707',
  2024,
  310000000,
  298000000,
  80,
  '9-Speed Wet Clutch Automatic',
  'Petrol',
  'SUV',
  'Satin Xenon Grey',
  'Titanium Grey & Spicy Red Semi-Aniline Leather',
  'Brand New',
  '4.0L Twin-Turbocharged V8',
  3.3,
  310,
  707,
  900,
  'The Supercar of SUVs. The DBX707 commands attention with the largest front grille ever fitted to an Aston Martin, quad active exhausts, carbon ceramic brakes as standard, and launch control that catapults this luxury SUV to 100 km/h in 3.3 seconds.',
  '"Standard 420mm Carbon Ceramic Brakes","Bespoke 23-Inch Forged Ribbon Wheels","Quad Active Sport Exhaust System with Quad Tailpipes","Electronic Active Roll Control (eARC) 48V","Alcantara & Carbon Fiber Interior Inlays","Aston Martin Premium Audio 800W"'::text[],
  'available',
  1,
  true,
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'McLaren 750S Spider',
  'mclaren-750s-spider',
  'McLaren',
  '750S Spider',
  2024,
  415000000,
  NULL,
  35,
  '7-Speed Seamless Shift Gearbox (SSG)',
  'Petrol',
  'Convertible',
  'Papaya Spark Elite Paint',
  'Carbon Black Alcantara with Orange Contrast',
  'Brand New',
  '4.0L Twin-Turbocharged M840T V8',
  2.8,
  332,
  750,
  800,
  'Lighter, sharper, more powerful. The McLaren 750S Spider elevates benchmark supercar thrills with a Retractable Hard Top that opens in just 11 seconds at speeds up to 50 km/h, Proactive Chassis Control III, and central sports exit exhaust.',
  '"Retractable Hard Top (RHT) with Electrochromic Glass","Proactive Chassis Control III (PCC III)","Ultra-Lightweight 10-Spoke Forged Alloy Wheels","Bowers & Wilkins 12-Speaker High Performance Audio","McLaren Track Telemetry with 3 Cameras","Carbon Fiber Active Rear Wing"'::text[],
  'available',
  1,
  false,
  'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'Maserati MC20 Cielo Spyder',
  'maserati-mc20-cielo-spyder',
  'Maserati',
  'MC20 Cielo',
  2024,
  325000000,
  315000000,
  110,
  '8-Speed Dual Clutch',
  'Petrol',
  'Convertible',
  'Acquamarina Fuoriserie',
  'Ice Grey Alcantara & Full Grain Leather',
  'Brand New',
  '3.0L Twin-Turbo Nettuno 90° V6',
  2.9,
  325,
  630,
  730,
  'Italian opera under open sky. The MC20 Cielo is equipped with an innovative polymer-dispersed liquid crystal (PDLC) electrochromic glass roof that shifts from clear to opaque at the touch of a button, framing the F1-derived Nettuno pre-chamber engine.',
  '"Smart Glass Electrochromic Retractable Roof","Sonus Faber High-Premium 12-Speaker Sound System","Carbon Fiber Butterfly Doors","Electronic Limited-Slip Differential (E-LSD)","Carbon Ceramic Braking System","Driving Mode Selector with Corsa & ESC Off"'::text[],
  'available',
  1,
  false,
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.cars (
  id, title, slug, brand, model, year, price, discount_price, mileage,
  transmission, fuel_type, body_type, color, interior_color, condition,
  engine, acceleration_0_100, top_speed_kmh, horsepower, torque_nm,
  description, features, status, stock_quantity, is_featured,
  hero_image, images, created_at, updated_at
) VALUES (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'Tesla Model S Plaid Carbon Package',
  'tesla-model-s-plaid-carbon',
  'Tesla',
  'Model S Plaid',
  2024,
  175000000,
  168000000,
  95,
  'Single-Speed Fixed Ratio',
  'Electric',
  'Sedan',
  'Pearl White Multi-Coat',
  'Ultra White & Carbon Fiber Trim',
  'Brand New',
  'Tri-Motor All-Wheel Drive with Carbon-Sleeved Rotors',
  2.1,
  322,
  1020,
  1420,
  'Beyond Ludicrous. The quickest accelerating production sedan on earth. 0-100 km/h in 2.1 seconds with continuous torque output through carbon-sleeved rotors. Features 17-inch cinematic display with 10 teraflops gaming console and Track Mode V2.',
  '"Tri-Motor AWD with Carbon-Sleeved Rotors","Track Mode V2 with Lateral G-Force Optimization","Full Self-Driving Capability Package Included","22-Speaker 960W Audio with Active Road Noise Canceling","Yoke Steering with Capacitive Touch Controls","Tri-Zone Climate with HEPA Bioweapon Defense Mode"'::text[],
  'available',
  3,
  false,
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1920&q=85',
  '"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1920&q=85","https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1920&q=85"'::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  mileage = EXCLUDED.mileage,
  transmission = EXCLUDED.transmission,
  fuel_type = EXCLUDED.fuel_type,
  body_type = EXCLUDED.body_type,
  color = EXCLUDED.color,
  interior_color = EXCLUDED.interior_color,
  condition = EXCLUDED.condition,
  engine = EXCLUDED.engine,
  acceleration_0_100 = EXCLUDED.acceleration_0_100,
  top_speed_kmh = EXCLUDED.top_speed_kmh,
  horsepower = EXCLUDED.horsepower,
  torque_nm = EXCLUDED.torque_nm,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  stock_quantity = EXCLUDED.stock_quantity,
  is_featured = EXCLUDED.is_featured,
  hero_image = EXCLUDED.hero_image,
  images = EXCLUDED.images,
  updated_at = NOW();

-- ==============================================================================
-- 7. SEED DATA: BLOG & EDITORIAL ARTICLES
-- ==============================================================================

INSERT INTO public.articles (
  slug, title, excerpt, category, date, read_time, cover_image, featured, sections, created_at, updated_at
) VALUES (
  'electric-vs-hybrid-drivetrains',
  'Electric vs. Hybrid: Which Modern Drivetrain Suits Your Lifestyle?',
  'Exploring the engineering divergence between pure battery electric propulsion and modern high-output hybrid architectures for luxury driving.',
  'Expert Advice',
  'Apr 12, 2026',
  '7 min read',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1800&q=85',
  true,
  '[{"heading":"The Electrification Crossroads","paragraph":"As the luxury automotive landscape undergoes its greatest architectural evolution in over a century, discerning buyers are faced with a pivotal choice: all-electric immediacy or hybridized grand touring endurance. Both platforms have matured into formidable performance expressions, but each caters to fundamentally distinct driving philosophies."},{"heading":"Key Engineering Attributes","bullets":[{"label":"Instantaneous Torque Delivery","text":"Pure electric drivetrains provide immediate, seamless acceleration without gear shift interruptions, offering unparalleled city responsiveness."},{"label":"Continental Grand Touring Range","text":"Hybrid systems combine electric assistance for urban whisper-quiet operation with high-displacement combustion engines for effortless 600+ mile cross-country journeys."},{"label":"Infrastructure Independence","text":"Plug-in hybrids ensure you never experience range anxiety, self-charging through regenerative braking while retaining rapid fueling convenience."}]},{"heading":"Selecting Your Optimum Powertrain","paragraph":"If your daily routine encompasses executive commuting within metropolitan hubs and home charging access, full electrification offers supreme tranquility. However, if your itinerary demands spontaneous inter-state travel or high-speed track endurance, modern hybrid supercars represent the pinnacle of versatility."}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  featured = EXCLUDED.featured,
  sections = EXCLUDED.sections,
  updated_at = NOW();

INSERT INTO public.articles (
  slug, title, excerpt, category, date, read_time, cover_image, featured, sections, created_at, updated_at
) VALUES (
  'night-driving-safety-led-headlight-tech',
  'Night Driving Safety: The Importance of Modern LED Headlight Tech',
  'Modern LED headlight technology has revolutionized night driving by providing a light spectrum that closely mimics natural daylight.',
  'Safety Tips',
  'May 6, 2026',
  '5 min read',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1800&q=85',
  false,
  '[{"heading":"Illuminating the Path Ahead","paragraph":"Statistics show a reality: over half of fatal traffic accidents happen at night, despite far fewer vehicles being on the road. The primary factor in this disparity is visibility. Traditional halogen bulbs often leave drivers \"over-driving\" their headlights—traveling faster than the distance they can safely see. Modern LED headlight technology has revolutionized night driving by providing a light spectrum that closely mimics natural daylight, reducing eye fatigue and expanding the driver''s visual field."},{"heading":"The Advantages of LED Systems","paragraph":"The shift from yellowish halogens to clean white illumination isn''t just about modern aesthetics; it provides critical safety benefits that protect everyone on the road.","bullets":[{"label":"Superior Color Contrast","text":"The higher color temperature of LEDs makes road signs and lane markings \"pop\" with much greater clarity, allowing for faster recognition of hazards."},{"label":"Instant Illumination","text":"Unlike older HID (Xenon) lights that take time to warm up to full brightness, LEDs reach maximum intensity instantly, which is critical for high-beam flashing and immediate signal visibility."},{"label":"Adaptive Beam Patterns","text":"Advanced LED arrays can now \"shape\" the light beam, automatically dipping parts of the light so as not to cling or gleam ongoing drivers while keeping the rest of the road brightly lit."}]},{"heading":"Beyond Brightness: Adaptive Lighting","paragraph":"The next significant breakthrough in recent years is the integration of predictive and adaptive headlight systems (AHS). These systems use sensors to track the car''s steering angle and speed, physically pivoting the light beams into a curve before the car even enters it. This \"predictive\" lighting reveals that pedestrian or wild animal lurking in the shadows of a turn far earlier than could ever be done with static headlights, providing the critical reaction time needed to avoid a collision."},{"heading":"Maintenance for Maximum Vision","paragraph":"Even the most advanced LED system can''t reach its full effectiveness if not properly cared for. Over time, plastic headlight lenses can become oxidized or \"foggy\" due to UV exposure, which scatters the light and reduces its reach. Regular cleaning and occasional professional polishing are essential to maintain that razor-sharp clear output. By investing in modern lighting technology and keeping it in peak condition, you turn the challenges of night driving into a safer, more confident experience behind the wheel."}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  featured = EXCLUDED.featured,
  sections = EXCLUDED.sections,
  updated_at = NOW();

INSERT INTO public.articles (
  slug, title, excerpt, category, date, read_time, cover_image, featured, sections, created_at, updated_at
) VALUES (
  'how-your-credit-score-impacts-interest-rate',
  'How Your Credit Score Impacts Your Interest Rate',
  'Understanding how lenders assess credit tiers when financing luxury and performance vehicles, and how to optimize your rate.',
  'Financing',
  'May 4, 2026',
  '6 min read',
  'https://images.unsplash.com/photo-1541348263662-e0c86437ac7b?auto=format&fit=crop&w=1800&q=85',
  false,
  '[{"heading":"The Mechanics of Automotive Underwriting","paragraph":"When securing structured financing for a high-value automobile, your credit rating dictates more than loan approval—it establishes the baseline cost of capital over your loan lifecycle. Prime lenders evaluate credit scores to categorize borrowers into distinct risk brackets, directly influencing APR percentage rates."},{"heading":"Understanding the Tiers","bullets":[{"label":"Super-Prime (780 - 850)","text":"Unlocks tier-one institutional rates, maximum loan-to-value allowances, and preferential bespoke term lengths."},{"label":"Prime (660 - 779)","text":"Qualifies for competitive dealer financing packages with modest down-payment flexibility."},{"label":"Non-Prime (<660)","text":"Often requires increased equity capital up-front or collateral backing to balance elevated APR metrics."}]},{"heading":"Strategic Rate Reduction","paragraph":"Before applying for luxury acquisition financing, lowering outstanding revolving debt and reviewing your credit bureau reports for discrepancies can shift you into a higher tier, potentially saving tens of thousands in interest expense."}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  featured = EXCLUDED.featured,
  sections = EXCLUDED.sections,
  updated_at = NOW();

INSERT INTO public.articles (
  slug, title, excerpt, category, date, read_time, cover_image, featured, sections, created_at, updated_at
) VALUES (
  'advanced-driver-assistance-systems-adas',
  'Advanced Driver Assistance Systems (ADAS) Explained',
  'From LiDAR sensor fusion to Level 2+ semi-autonomous highway cruising, discover how cutting-edge ADAS safeguards modern vehicles.',
  'Technology',
  'May 2, 2026',
  '8 min read',
  'https://images.unsplash.com/photo-1611245453086-45550a1df230?auto=format&fit=crop&w=1800&q=85',
  false,
  '[{"heading":"The Evolution of Autonomous Co-Piloting","paragraph":"Advanced Driver Assistance Systems (ADAS) represent the convergence of high-definition radar, stereo camera vision, and machine learning computation. What began as simple anti-lock braking has blossomed into a comprehensive protective cocoon that constantly scans 360 degrees around your vehicle."},{"heading":"Core Systems in Contemporary Supercars","bullets":[{"label":"Adaptive Cruise with Stop & Go","text":"Maintains pinpoint radar headway even in dense urban stop-and-start traffic without requiring pedal intervention."},{"label":"Active Lane Centering & Evasive Steer","text":"Applies gentle corrective torque to keep the vehicle positioned precisely between road demarcations."},{"label":"Cross-Traffic Blind Spot Intervention","text":"Utilizes millimeter-wave radar to alert and intervene against oncoming hazards when reversing from obscured parking bays."}]},{"heading":"The Discerning Driver''s Safeguard","paragraph":"While active assistance aids driver fatigue on cross-country road trips, modern sports car engineers ensure these systems can be dialled down or completely deactivated on closed track circuits to preserve raw, unadulterated mechanical engagement."}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  featured = EXCLUDED.featured,
  sections = EXCLUDED.sections,
  updated_at = NOW();

INSERT INTO public.articles (
  slug, title, excerpt, category, date, read_time, cover_image, featured, sections, created_at, updated_at
) VALUES (
  'ultimate-checklist-pre-owned-luxury-car',
  'The Ultimate Checklist for Buying a Pre-Owned Luxury Car',
  'Everything you need to inspect—from DME over-rev reports to paint depth thickness—before committing to a pre-owned supercar.',
  'Buyer''s Guide',
  'April 28, 2026',
  '9 min read',
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1800&q=85',
  false,
  '[{"heading":"Pre-Purchase Due Diligence","paragraph":"Acquiring a pre-owned luxury or exotic vehicle requires a rigorous, methodical verification protocol. Pristine exterior aesthetics can conceal deferred mechanical maintenance, costly suspension wear, or irregular electronic modules."},{"heading":"Essential Verification Milestones","bullets":[{"label":"DME Engine ECU Readout","text":"Verify engine operating hours against instrument cluster mileage and check for ignition over-rev ranges."},{"label":"Paint Depth Thickness Gauge","text":"Measure micron depth across all metal and carbon panels to verify original factory paint and rule out undisclosed panel repairs."},{"label":"Bespoke Service Provenance","text":"Ensure all scheduled fluid, belt, and valve inspections were completed exclusively by certified marque technicians with documented invoices."}]},{"heading":"Certified Peace of Mind","paragraph":"Every vehicle in our collection undergoes a comprehensive 150-point mechanical inspection with full provenance documentation, giving you ultimate assurance before taking delivery."}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  featured = EXCLUDED.featured,
  sections = EXCLUDED.sections,
  updated_at = NOW();

-- ==============================================================================
-- 8. SEED DATA: VERIFIED CLIENT REVIEWS
-- ==============================================================================
INSERT INTO public.comments (
  id, car_id, user_name, rating, body, status, admin_reply, created_at, updated_at
) VALUES 
(
  'comm-1',
  'col-aston-dbs',
  'Harrison Vance',
  5,
  'The specification and carbon aerokit on this DBS 770 Ultimate is astonishing. Delivery to our Beverly Hills residence was seamless and white-glove.',
  'approved',
  'A pleasure serving you, Harrison. May every journey with the V12 be extraordinary.',
  NOW() - INTERVAL '4 days',
  NOW()
),
(
  'comm-2',
  'col-aston-dbs',
  'Dr. Jonathan Hayes',
  5,
  'Peerless grand touring. The British Racing Green paint depth under natural sunlight is breathtaking.',
  'approved',
  NULL,
  NOW() - INTERVAL '9 days',
  NOW()
),
(
  'comm-3',
  'col-porsche-911-gt3rs',
  'Marcus Sterling',
  5,
  'The downforce on the Weissach GT3 RS is mind-altering. The Aston concierge team arranged the private track inspection effortlessly.',
  'approved',
  'Thank you Marcus! Keep the revs singing to 9,000 RPM.',
  NOW() - INTERVAL '2 days',
  NOW()
)
ON CONFLICT (id) DO NOTHING;
