-- ASTON AUTO STORES - SUPABASE MIGRATION SCRIPT
-- Version: 001_initial_schema.sql

create extension if not exists "uuid-ossp";

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  address text,
  role text default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CARS
create table if not exists public.cars (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric(14, 2) not null,
  discount_price numeric(14, 2),
  mileage integer not null default 0,
  transmission text not null default 'Automatic',
  fuel_type text not null default 'Petrol',
  body_type text not null,
  color text not null,
  interior_color text,
  condition text not null default 'Brand New' check (condition in ('Brand New', 'Certified Pre-Owned', 'Classic / Collector')),
  engine text not null,
  acceleration_0_100 numeric(4, 2),
  top_speed_kmh integer,
  horsepower integer,
  torque_nm integer,
  description text not null,
  features text[] default '{}',
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  stock_quantity integer not null default 1,
  is_featured boolean not null default false,
  hero_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CAR IMAGES
create table if not exists public.car_images (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars on delete cascade not null,
  url text not null,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WISHLISTS
create table if not exists public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  car_id uuid references public.cars on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, car_id)
);

-- ORDERS
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text not null unique,
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'processing', 'completed', 'cancelled')),
  subtotal numeric(14, 2) not null,
  fees numeric(14, 2) not null default 0,
  deposit_amount numeric(14, 2),
  total numeric(14, 2) not null,
  delivery_method text not null default 'pickup' check (delivery_method in ('pickup', 'delivery')),
  delivery_address text,
  notes text,
  payment_method text default 'paystack',
  payment_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade not null,
  car_id uuid references public.cars on delete restrict not null,
  price_at_purchase numeric(14, 2) not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COMMENTS
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars on delete cascade not null,
  user_id uuid references auth.users on delete set null,
  user_name text not null,
  user_avatar text,
  rating integer not null check (rating >= 1 and rating <= 5),
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  admin_reply text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INQUIRIES & TEST DRIVES
create table if not exists public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  preferred_contact text default 'whatsapp',
  status text default 'new' check (status in ('new', 'contacted', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.test_drives (
  id uuid default uuid_generate_v4() primary key,
  car_id uuid references public.cars on delete cascade not null,
  user_id uuid references auth.users on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time text not null,
  license_number text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRADE-IN
create table if not exists public.trade_in_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  make text not null,
  model text not null,
  year integer not null,
  mileage integer not null,
  condition text not null,
  vin text,
  estimated_value numeric(14, 2),
  images text[] default '{}',
  notes text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TESTIMONIALS
create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  client_name text not null,
  client_role text,
  company text,
  quote text not null,
  car_purchased text,
  rating integer default 5,
  avatar_url text,
  is_featured boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SITE SETTINGS
create table if not exists public.site_settings (
  id integer primary key default 1,
  company_name text not null default 'Aston Auto Stores',
  tagline text default 'Curators of Extraordinary Motoring',
  phone text default '+234 812 345 6789',
  whatsapp text default '+234 812 345 6789',
  email text default 'concierge@astonautostores.com',
  address text default '14 Alexander Avenue, Ikoyi, Lagos, Nigeria',
  showroom_hours text default 'Mon - Sat: 9:00 AM - 7:00 PM',
  deposit_percentage numeric(5, 2) default 10.00,
  flat_delivery_fee numeric(14, 2) default 250000.00,
  social_links jsonb default '{"instagram": "https://instagram.com/astonautostores", "twitter": "https://twitter.com/astonautostores", "youtube": "https://youtube.com/@astonautostores", "linkedin": "https://linkedin.com/company/aston-auto-stores"}'::jsonb,
  hero_headline text default 'The Apex of Automotive Artistry',
  hero_subheadline text default 'Explore Nigeria’s most prestigious portfolio of curated supercars and luxury marques.',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint single_row_check check (id = 1)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.car_images enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.comments enable row level security;
alter table public.inquiries enable row level security;
alter table public.test_drives enable row level security;
alter table public.trade_in_requests enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

-- Admin function
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Cars RLS
create policy "Public can view active cars" on public.cars for select using (true);
create policy "Admins can insert cars" on public.cars for insert with check (public.is_admin());
create policy "Admins can update cars" on public.cars for update using (public.is_admin());
create policy "Admins can delete cars" on public.cars for delete using (public.is_admin());

-- Comments RLS
create policy "Public can read approved comments" on public.comments for select using (status = 'approved' or auth.uid() = user_id or public.is_admin());
create policy "Authenticated users can post comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Admins can moderate comments" on public.comments for update using (public.is_admin());
create policy "Admins can delete comments" on public.comments for delete using (public.is_admin());

-- Orders RLS
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Anyone can create orders" on public.orders for insert with check (true);
create policy "Admins can update orders" on public.orders for update using (public.is_admin());
