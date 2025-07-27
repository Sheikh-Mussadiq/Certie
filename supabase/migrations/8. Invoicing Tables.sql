-- Invoicing Feature Tables

-- 1. Create a table for services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price INT NOT NULL, -- Storing price in pence to avoid floating point issues
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed services table
INSERT INTO public.services (name, description, price) VALUES
('PAT Testing', 'Portable Appliance Testing', 50), -- £50.00
('Emergency Light Testing', 'Monthly and annual testing of emergency lighting.', 75), -- £75.00
('Lift Inspection', 'Thorough examination of lifts and lifting equipment.', 150), -- £150.00
('Gas Safety Certificate', 'Annual gas safety check (CP12).', 60), -- £60.00
('Fire Risk Assessment', 'Comprehensive fire risk assessment for properties.', 200), -- £200.00
('Smoke and Carbon Monoxide Testing', 'Testing of smoke and CO alarms.', 40) -- £40.00
ON CONFLICT (name) DO NOTHING;


-- 2. Create a table for invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() ON DELETE SET NULL,
    stripe_invoice_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL, -- e.g., draft, open, paid, void, uncollectible
    amount_due INT,
    amount_paid INT,
    due_date TIMESTAMPTZ,
    invoice_pdf TEXT,
    hosted_invoice_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create a join table for invoices and bookings
CREATE TABLE IF NOT EXISTS public.invoice_bookings (
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    PRIMARY KEY (invoice_id, booking_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON public.invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_bookings_booking_id ON public.invoice_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoice_bookings_invoice_id ON public.invoice_bookings(invoice_id);

-- Row Level Security (RLS) Policies

-- 1. Enable RLS for all new tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_bookings ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for the 'services' table
DROP POLICY IF EXISTS "Allow public read-only access to services" ON public.services;
CREATE POLICY "Allow public read-only access to services"
ON public.services FOR SELECT
TO authenticated, anon
USING (true);

-- 3. Create policies for the 'invoices' table
DROP POLICY IF EXISTS "Users can view their own invoices and super admins can view all invoices" ON public.invoices;
CREATE POLICY "Users can view their own invoices and super admins can view all invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
  )
);

DROP POLICY IF EXISTS "Users can create their own invoices" ON public.invoices;
CREATE POLICY "Users can create their own invoices"
ON public.invoices FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
-- CREATE POLICY "Users can update their own invoices"
-- ON public.invoices FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = user_id);

-- 4. Create policies for the 'invoice_bookings' table
DROP POLICY IF EXISTS "Users can view their own invoice_bookings and super admins can view all invoice_bookings" ON public.invoice_bookings;
CREATE POLICY "Users can view their own invoice_bookings and super admins can view all invoice_bookings"
ON public.invoice_bookings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_bookings.invoice_id
      AND invoices.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
  )
);

DROP POLICY IF EXISTS "Users can create their own invoice_bookings" ON public.invoice_bookings;
CREATE POLICY "Users can create their own invoice_bookings"
ON public.invoice_bookings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_bookings.invoice_id
      AND invoices.user_id = auth.uid()
  )
);

-- Add stripe_customer_id to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT; 