# Aston — Curators of Extraordinary Motoring

> **Beverly Hills Flagship Automotive Catalog**  
> A high-performance luxury automotive catalog built with Next.js 16, Supabase, Tailwind CSS, and full Row-Level Security (RLS). Visitors browse luxury vehicles, submit private inquiries, reserve VIP showroom test drives, and engage via approved owner reviews.

---

## 🏎️ Overview & Architecture

Aston is engineered as a pure **Luxury Car Catalog & Private Concierge Platform**:
- **Car Catalog**: Real-time inventory browsing, filterable by price, brand, transmission, and body style.
- **Vehicle Detail Pages**: High-resolution gallery, comprehensive specs matrix, certified inspection guarantees, and approved community reviews.
- **Lead Generation**: Direct private client inquiries, VIP showroom test-drive bookings, and one-click WhatsApp pre-filled chats.
- **Zero E-Commerce Bloat**: Strictly no cart, checkout, payment gateways, deposits, trade-ins, or customer accounts.
- **Executive Admin Console (`/admin`)**:
  - Protected by Next.js 16 `src/proxy.ts` network proxy and server-side authorization layout.
  - Role-based security verified against the `admin_users` table.
  - Multi-image drag-and-drop upload directly to Supabase Storage (`car-images`) with automatic browser canvas WebP compression (max 2000px, quality 0.82).
  - One-click WhatsApp client replies.
  - CSV lead export for inquiries and test drive appointments.
  - Review moderation pipeline with executive replies.
  - Direct site cache revalidation via `/api/revalidate`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, React 19)
- **Supabase**: `@supabase/ssr` (PostgreSQL, Row Level Security, Storage, Auth)
- **Proxy**: Next.js 16 `src/proxy.ts` (replaces deprecated middleware convention)
- **Styling**: Tailwind CSS v4 with curated light-mode luxury aesthetic
- **Validation**: Zod schema validation
- **Currency**: United States Dollar ($ USD)
- **Showroom**: 450 North Rodeo Drive, Beverly Hills, CA 90210

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*(Notice: No `service_role` key is required or accepted by the application code. All operations strictly adhere to Supabase Row Level Security).*

---

## 🗄️ Database & Supabase Configuration

### 1. Run Schema Migration
Open your **Supabase Project &rarr; SQL Editor**, paste and run the contents of:
```
supabase/schema.sql
```
*(or `supabase/migrations/001_catalog_schema.sql`)*

This script:
- Creates `admin_users`, `cars`, `comments`, `inquiries`, `test_drives`, and `site_settings`.
- Configures Row Level Security (RLS) policies allowing public read of inventory, public inserts for leads and pending reviews (without `.select()`), and full read/write for verified administrators.
- Configures the `car-images` public storage bucket and upload policies.

### 2. Seed Initial Inventory
In the **Supabase SQL Editor**, run:
```
supabase/seed.sql
```
This populates the database with 20 world-class luxury vehicles (Aston Martin, Ferrari, Rolls-Royce, Porsche, Lamborghini, Bentley, McLaren), Beverly Hills showroom settings, and initial owner reviews.

### 3. Create First Administrator
1. In your **Supabase Dashboard &rarr; Authentication &rarr; Users**, click **"Add user"** and create your admin account (e.g. `admin@aston.com`).
2. Run this SQL command in the Supabase SQL Editor to grant administrative privileges:
```sql
INSERT INTO public.admin_users (id, email)
VALUES ('<PASTE-USER-UUID-HERE>', 'admin@aston.com')
ON CONFLICT (id) DO NOTHING;
```
3. You can now log into the executive portal at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 💻 Development & Production

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. In **Project Settings &rarr; Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain, e.g. `https://astonauto.com`)
4. Deploy. Next.js 16 will build static pages and configure the edge proxy automatically.

---

## 📍 Showroom Concierge
- **Showroom Address**: 450 North Rodeo Drive, Beverly Hills, CA 90210
- **Direct Phone**: `+1 448 226 4666`
- **WhatsApp Concierge**: `+1 448 226 4666`
- **Email**: `concierge@aston.com`
