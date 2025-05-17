-- Bookings Table
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  booked_by UUID REFERENCES users(id),
  booking_time TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  contact_details JSONB NOT NULL,
  attachments TEXT[],
  status booking_status DEFAULT 'pending'
);

-- RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Property Owner Booking Access
CREATE POLICY "Owner Booking Access" ON bookings
FOR ALL USING (
  EXISTS (SELECT 1 FROM properties 
         WHERE id = bookings.property_id 
         AND owner_id = auth.uid())
);

-- Property Manager Booking Access
CREATE POLICY "Manager Booking Access" ON bookings
FOR INSERT, SELECT, UPDATE WITH CHECK (
  status = 'pending' AND
  booked_by = auth.uid() AND
  EXISTS (SELECT 1 FROM property_managers 
         WHERE property_id = bookings.property_id 
         AND user_id = auth.uid())
);

-- Site User Booking Access
CREATE POLICY "Site User Booking Access" ON bookings
FOR SELECT USING (
  EXISTS (SELECT 1 FROM property_site_users 
         WHERE property_id = bookings.property_id 
         AND user_id = auth.uid())
);