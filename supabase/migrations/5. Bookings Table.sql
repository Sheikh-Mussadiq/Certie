-- Bookings Table
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'assigned', 'completed', 'cancelled');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  property_name TEXT NOT NULL,
  booked_by UUID REFERENCES users(id) DEFAULT auth.uid(),
  assessment_time TIMESTAMPTZ,
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

-- Property Owner and Super Admin Booking Access
CREATE POLICY "Owner or Super Admin Booking Access"
ON bookings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM properties p
    WHERE p.id = bookings.property_id
      AND p.owner_id = (select auth.uid())
  )
  OR is_user_role('super_admin')
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM properties p
    WHERE p.id = bookings.property_id
      AND p.owner_id = (select auth.uid())
  )
  OR is_user_role('super_admin')
)


-- Property Manager Booking Access
-- CREATE POLICY "Manager Booking Access" ON bookings
-- FOR INSERT, SELECT, UPDATE WITH CHECK (
--   status = 'pending' AND
--   booked_by = auth.uid() AND
--   EXISTS (SELECT 1 FROM property_managers 
--          WHERE property_id = bookings.property_id 
--          AND user_id = auth.uid())
-- );


CREATE POLICY "Manager Booking Insert Access"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (
  bookings.status = 'pending' AND
  EXISTS (
    SELECT 1
    FROM property_managers
    WHERE property_id = bookings.property_id
      AND user_id = (select auth.uid())
  )
);


CREATE POLICY "Manager Booking Select Access" ON bookings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM property_managers 
    WHERE property_id = bookings.property_id 
      AND user_id = (select auth.uid())
  )
);


-- CREATE POLICY "Manager Booking Update Access" ON bookings
-- FOR UPDATE
-- TO authenticated
-- WITH CHECK (
--   status = 'pending' AND
--   booked_by = (select auth.uid()) AND
--   EXISTS (
--     SELECT 1 FROM property_managers 
--     WHERE property_id = bookings.property_id 
--       AND user_id = (select auth.uid())
--   )
-- );

-- Site User Booking Access
CREATE POLICY "Site User Booking Access" ON bookings
FOR SELECT
TO authenticated
 USING (
  EXISTS (SELECT 1 FROM property_site_users 
         WHERE property_id = bookings.property_id 
         AND user_id = (select auth.uid()))
);