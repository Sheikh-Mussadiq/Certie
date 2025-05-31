-- Bookings Table
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'assigned', 'completed', 'cancelled');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  property_name TEXT NOT NULL,
  booked_by UUID REFERENCES users(id) DEFAULT auth.uid(),
  booking_time TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  type TEXT NOT NULL,
  assignee JSONB,
  contact_details JSONB NOT NULL,
  status booking_status DEFAULT 'pending',
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Super Admin Booking Access
CREATE POLICY "Super Admin Booking Access" ON bookings
FOR ALL USING (
  EXISTS (SELECT 1 FROM users 
         WHERE id = auth.uid() AND role = 'super_admin')
);

-- -- Property Manager Booking Access
-- CREATE POLICY "Manager Booking Access" ON bookings
-- FOR INSERT, SELECT, UPDATE WITH CHECK (
--   status = 'pending' AND
--   booked_by = auth.uid() AND
--   EXISTS (SELECT 1 FROM property_managers 
--          WHERE property_id = bookings.property_id 
--          AND user_id = auth.uid())
-- );


CREATE POLICY "Manager Booking Insert Access" ON bookings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM property_managers 
    WHERE property_id = bookings.property_id 
      AND user_id = auth.uid()
  )
);

CREATE POLICY "Manager Booking Select Access" ON bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM property_managers 
    WHERE property_id = bookings.property_id 
      AND user_id = auth.uid()
  )
);


CREATE POLICY "Manager Booking Update Access" ON bookings
FOR UPDATE
WITH CHECK (
  status = 'pending' AND
  booked_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM property_managers 
    WHERE property_id = bookings.property_id 
      AND user_id = auth.uid()
  )
);

-- Site User Booking Access
CREATE POLICY "Site User Booking Access" ON bookings
FOR SELECT USING (
  EXISTS (SELECT 1 FROM property_site_users 
         WHERE property_id = bookings.property_id 
         AND user_id = auth.uid())
);


