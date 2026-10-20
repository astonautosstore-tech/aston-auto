# Aston Auto Stores — World-Class Luxury Automotive E-Commerce

> **Curators of Extraordinary Motoring**  
> West Africa's most prestigious automotive dealership platform, rebuilt with Apple/Tesla-level craftsmanship, GSAP pinned storytelling, Lenis smooth scrolling, and complete e-commerce flow.

---

## 🏎️ Features & Highlights

- **Awwwards-Level Design (Light Theme Only)**:
  - Clean luxury palette: Pure Studio White (`#FFFFFF`), Alabaster (`#F7F7F8`), Obsidian Typography (`#0A0A0A`).
  - Refined British Racing Emerald (`#0D5C3A`) and Champagne Gold (`#C5A059`) accents.
  - 8px systematic grid throughout with strict accessibility compliance and `prefers-reduced-motion` support.
- **Cinematic Motion & Animations**:
  - Silk-smooth scrolling via **Lenis** synchronized with **GSAP ScrollTrigger**.
  - Custom desktop luxury morphing cursor (`LuxuryCursor.tsx`).
  - Web Audio synthetic tactile micro-interaction haptics with mute toggle.
  - Apple/Tesla-style pinned scroll car showcase with live counters and 3D angle shifts.
  - Interactive **360° Studio Frame Rotator** on vehicle detail pages.
  - Flying Add-to-Cart flight animation into sticky frosted glass navbar.
- **Full E-Commerce Flow Up to Payment**:
  - Persistent **Zustand** cart with deposit mode toggle (10% reservation hold vs full purchase).
  - Multi-step checkout: Client Profile &bull; Handover Method &bull; Review & Guarantee &bull; Payment Channel.
  - Payment abstraction in `/lib/payments` (Paystack stub, webhook signature verification, bank wire, showroom terminal).
  - Vehicles automatically marked **Reserved** in the database upon reservation to prevent double-selling.
  - Printable luxury acquisition certificate/invoice with tracking code.
- **Supabase Backend with Row Level Security (RLS)**:
  - Full schema migrations for `cars`, `car_images`, `profiles`, `wishlists`, `orders`, `order_items`, `comments`, `inquiries`, `test_drives`, `trade_in_requests`, `site_settings`.
  - Storage bucket `car-images` with public read and admin upload permissions.
  - Hybrid client with automatic local persistence fallback so the app works seamlessly even before entering remote credentials.
- **Comprehensive Admin Dashboard (`/admin`)**:
  - Metrics overview: Total portfolio volume, available vs reserved vs sold cars, pending moderation count.
  - Vehicle management: Add, edit, delete cars, set prices in ₦, configure specs.
  - Order management: Filter by status, update status workflow, export CSV.
  - Comment moderation: Approve, hide, reply to customer reviews.
  - Dealership settings: Update contact details, delivery fees, and deposit rate.
- **SEO & Production Excellence**:
  - Next.js 14+ App Router, 100% SSG pre-rendered car pages (`generateStaticParams`).
  - Structured JSON-LD metadata (`Vehicle`, `Product`, `AutoDealer`).
  - Dynamic `sitemap.xml` and `robots.txt`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, custom CSS variables, glassmorphism
- **Animation**: GSAP 3, ScrollTrigger, Lenis, Framer Motion
- **State & Forms**: Zustand (persisted), React Hook Form, Zod
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Storage)
- **Currency**: Nigerian Naira (₦) with localized formatting

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Paystack (Nigeria Luxury Payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key-here
PAYSTACK_SECRET_KEY=your-paystack-secret-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
> **Note**: The platform includes a built-in hybrid data store initialized with 12 pristine luxury cars. The site works immediately out of the box in development even before connecting to remote Supabase!

### 3. Run Supabase Database Migrations
Open your Supabase Project SQL Editor and execute the script located in:
```
supabase/migrations/001_initial_schema.sql
```
This script creates all tables, triggers, storage bucket policies, and sets up Row Level Security.

### 4. Creating the First Admin
To grant admin privileges to a user, run this in the Supabase SQL Editor after the user registers:
```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@domain.com';
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. In Project Settings &rarr; **Environment Variables**, add the variables from `.env.example`.
4. Deploy. Next.js App Router will generate static pages for all 12 supercars automatically!

---

## 🏛️ Showroom Salons
- **Ikoyi Flagship Salon**: 14 Alexander Avenue, Ikoyi, Lagos, Nigeria
- **Victoria Island Gallery**: Luxury Boulevard, Victoria Island, Lagos
- **Abuja Executive Suite**: Maitama Diplomatic Zone, Abuja
- **Telephone / WhatsApp**: `+234 812 345 6789`
- **Executive Email**: `concierge@astonautostores.com`
