-- Run this in your Supabase SQL Editor to create the required tables

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  source TEXT DEFAULT 'footer',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Welcome popup submissions table
CREATE TABLE IF NOT EXISTS welcome_popup_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book appointment table
CREATE TABLE IF NOT EXISTS appointment_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  event TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_state TEXT,
  customer_pincode TEXT,
  items JSONB NOT NULL,
  total TEXT NOT NULL,
  coupon_code TEXT,
  discount_amount TEXT,
  final_total TEXT NOT NULL,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table (individual product details per order)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  product_name TEXT NOT NULL,
  product_tagline TEXT,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price TEXT NOT NULL,
  price_number INTEGER NOT NULL,
  custom_measurements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Client Diaries (managed via the admin panel)
-- ============================================================
CREATE TABLE IF NOT EXISTS client_diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  outfit_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  city TEXT NOT NULL,
  occasion TEXT NOT NULL,
  description TEXT NOT NULL,
  testimonial TEXT,
  testimonial_author TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured_on_homepage BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Blogs (managed via the admin panel)
-- Content is stored as an ordered array of blocks in `blocks` (jsonb).
-- Each block: { id, type, ... } where type is one of
-- heading | subheading | paragraph | bullet | numbered | quote | image.
-- Rich text (paragraph/quote/heading/list items) stores sanitized HTML
-- supporting <b>/<strong>, <i>/<em>, <u>.
-- ============================================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Enable Row Level Security
-- ============================================================
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE welcome_popup_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- The service role key bypasses RLS, so the form-submission tables
-- (newsletter, appointments, orders) need no extra policies for server-side inserts.

-- ============================================================
-- Client Diaries RLS policies
-- Public can read; authenticated admins can create/update/delete.
-- ============================================================
DROP POLICY IF EXISTS "client_diaries_public_read" ON client_diaries;
CREATE POLICY "client_diaries_public_read"
  ON client_diaries FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "client_diaries_admin_insert" ON client_diaries;
CREATE POLICY "client_diaries_admin_insert"
  ON client_diaries FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "client_diaries_admin_update" ON client_diaries;
CREATE POLICY "client_diaries_admin_update"
  ON client_diaries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "client_diaries_admin_delete" ON client_diaries;
CREATE POLICY "client_diaries_admin_delete"
  ON client_diaries FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Storage bucket for client diary images
-- Run once. Public read, authenticated write.
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-diaries', 'client-diaries', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "client_diaries_storage_public_read" ON storage.objects;
CREATE POLICY "client_diaries_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'client-diaries');

DROP POLICY IF EXISTS "client_diaries_storage_admin_write" ON storage.objects;
CREATE POLICY "client_diaries_storage_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'client-diaries');

DROP POLICY IF EXISTS "client_diaries_storage_admin_update" ON storage.objects;
CREATE POLICY "client_diaries_storage_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'client-diaries');

DROP POLICY IF EXISTS "client_diaries_storage_admin_delete" ON storage.objects;
CREATE POLICY "client_diaries_storage_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'client-diaries');

-- ============================================================
-- Blogs RLS policies
-- Public can read published blogs; authenticated admins have full access.
-- Blog images are stored in the existing `client-diaries` bucket under the
-- `blogs/` folder, so the storage policies above already cover them.
-- ============================================================
DROP POLICY IF EXISTS "blogs_public_read" ON blogs;
CREATE POLICY "blogs_public_read"
  ON blogs FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "blogs_admin_read" ON blogs;
CREATE POLICY "blogs_admin_read"
  ON blogs FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "blogs_admin_insert" ON blogs;
CREATE POLICY "blogs_admin_insert"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "blogs_admin_update" ON blogs;
CREATE POLICY "blogs_admin_update"
  ON blogs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "blogs_admin_delete" ON blogs;
CREATE POLICY "blogs_admin_delete"
  ON blogs FOR DELETE
  TO authenticated
  USING (true);
