-- ==============================================================================
-- ASTON AUTO - SHOWROOM CATALOG SCHEMA
-- Version: 001_catalog_schema.sql
-- Tables: admin_users, cars, comments, inquiries, test_drives, site_settings
-- Storage: car-images bucket
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE CATALOG TABLES
-- ==============================================================================

-- ADMIN USERS (Privileged staff authenticated via Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CARS (Vehicle Inventory Catalog)
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

-- COMMENTS (Approved Public Reviews & Admin Moderation)
CREATE TABLE IF NOT EXISTS public.comments (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_id text REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
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

-- TEST DRIVES (VIP Showroom Test Drive Requests - No License Number Required)
CREATE TABLE IF NOT EXISTS public.test_drives (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_id text REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  car_title text,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SITE SETTINGS (Singleton Dealership Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Aston',
  tagline text DEFAULT 'Curators of Extraordinary Motoring',
  phone text DEFAULT '+1 448 226 4666',
  whatsapp text DEFAULT '+1 448 226 4666',
  email text DEFAULT 'concierge@astonautostores.com',
  address text DEFAULT '450 North Rodeo Drive, Beverly Hills, CA 90210',
  showroom_hours text DEFAULT 'Monday – Saturday: 9:00 AM – 7:00 PM (By Appointment)',
  social_links jsonb DEFAULT '{"instagram": "https://instagram.com/astonautostores", "twitter": "https://twitter.com/astonautostores", "youtube": "https://youtube.com/@astonautostores", "linkedin": "https://linkedin.com/company/aston-auto-stores"}'::jsonb,
  hero_headline text DEFAULT 'The Apex of Automotive Artistry',
  hero_subheadline text DEFAULT 'North America''s premier curated portfolio of supercars and bespoke grand tourers.',
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. STORAGE BUCKET SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY & POLICIES
-- ==============================================================================

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ADMIN USERS
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (public.is_admin());

-- CARS
DROP POLICY IF EXISTS "Public can view cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can update cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;

CREATE POLICY "Public can view cars" ON public.cars
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert cars" ON public.cars
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update cars" ON public.cars
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete cars" ON public.cars
  FOR DELETE TO authenticated USING (public.is_admin());

-- COMMENTS
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can submit comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON public.comments;

CREATE POLICY "Public can view approved comments" ON public.comments
  FOR SELECT USING (status = 'approved' OR public.is_admin());

CREATE POLICY "Anyone can submit comments" ON public.comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update comments" ON public.comments
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete comments" ON public.comments
  FOR DELETE TO authenticated USING (public.is_admin());

-- INQUIRIES
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;

CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated USING (public.is_admin());

-- TEST DRIVES
DROP POLICY IF EXISTS "Anyone can request test drive" ON public.test_drives;
DROP POLICY IF EXISTS "Admins can view test drives" ON public.test_drives;
DROP POLICY IF EXISTS "Admins can update test drives" ON public.test_drives;
DROP POLICY IF EXISTS "Admins can delete test drives" ON public.test_drives;

CREATE POLICY "Anyone can request test drive" ON public.test_drives
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view test drives" ON public.test_drives
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update test drives" ON public.test_drives
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete test drives" ON public.test_drives
  FOR DELETE TO authenticated USING (public.is_admin());

-- SITE SETTINGS
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;

CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- STORAGE OBJECTS (car-images)
DROP POLICY IF EXISTS "Public can view car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete car images" ON storage.objects;

CREATE POLICY "Public can view car images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Admins can upload car images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'car-images' AND public.is_admin());

CREATE POLICY "Admins can update car images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'car-images' AND public.is_admin());

CREATE POLICY "Admins can delete car images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'car-images' AND public.is_admin());
