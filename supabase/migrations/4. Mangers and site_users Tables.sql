-- Property Managers Table Policies
ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Owners can read their property managers
CREATE POLICY "Owner Select Managers"
  ON property_managers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_managers.property_id
         AND owner_id = auth.uid()
    )
  );

-- 2. INSERT: Owners can add managers to their properties
CREATE POLICY "Owner Insert Managers"
  ON property_managers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM properties
        WHERE id = property_managers.property_id
         AND owner_id = auth.uid()
    )
  );

-- 3. UPDATE: Owners can modify managers for their properties
CREATE POLICY "Owner Update Managers"
  ON property_managers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_managers.property_id
         AND owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_managers.property_id
         AND owner_id = auth.uid()
    )
  );

-- 4. DELETE: Owners can remove managers from their properties
CREATE POLICY "Owner Delete Managers"
  ON property_managers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_managers.property_id
         AND owner_id = auth.uid()
    )
  );


-- Property Managers can view their assignments
CREATE POLICY "Manager View Access" ON property_managers
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Enable RLS if you haven’t already
-- Property Managers Table Policies
ALTER TABLE property_site_users ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Owners can read site‐user assignments for their properties
CREATE POLICY "Owner Select Site Users"
  ON property_site_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_site_users.property_id
         AND owner_id = auth.uid()
    )
  );

-- 2. INSERT: Owners can add site users to their properties
CREATE POLICY "Owner Insert Site Users"
  ON property_site_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM properties
        WHERE id = property_site_users.property_id
         AND owner_id = auth.uid()
    )
  );

-- 3. UPDATE: Owners can modify site‐user assignments on their properties
CREATE POLICY "Owner Update Site Users"
  ON property_site_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_site_users.property_id
         AND owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_site_users.property_id
         AND owner_id = auth.uid()
    )
  );

-- 4. DELETE: Owners can remove site users from their properties
CREATE POLICY "Owner Delete Site Users"
  ON property_site_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_site_users.property_id
         AND owner_id = auth.uid()
    )
  );

-- Property Managers can add site users
CREATE POLICY "Manager Add Site Users" ON property_site_users
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM property_managers
    WHERE property_id = property_site_users.property_id
    AND user_id = auth.uid()
  )
);

-- Site Users can view their assignments
CREATE POLICY "Site User View Access" ON property_site_users
FOR SELECT USING (
  user_id = auth.uid()
);


-- Add Manager Function (called from frontend)
CREATE OR REPLACE FUNCTION add_property_manager(
  property_id UUID,
  user_email TEXT
) 
RETURNS void AS $$
DECLARE
  target_user_id UUID;
  target_full_name TEXT;
BEGIN
  -- Get user ID and full_name from email
  SELECT id, full_name INTO target_user_id, target_full_name
  FROM users 
  WHERE email = user_email;

  -- Verify requester is property owner
  IF NOT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id 
    AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not property owner';
  END IF;

  -- Insert into junction table with full_name
  INSERT INTO property_managers (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add Site User Function (similar to above)
CREATE OR REPLACE FUNCTION add_site_user(
  property_id UUID,
  user_email TEXT
)
RETURNS void AS $$
DECLARE
  target_user_id UUID;
target_full_name TEXT;
BEGIN
  -- Get user ID and full_name from email
  SELECT id, full_name INTO target_user_id, target_full_name
  FROM users
  WHERE email = user_email;

  -- Verify requester is property owner
  IF NOT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id 
    AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not property owner';
  END IF;

  -- Insert into junction table
  INSERT INTO property_site_users (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION prevent_owner_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = NEW.user_id 
    AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Owners cannot be assigned as managers/site users';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_owner_assignment_trigger
BEFORE INSERT ON property_managers
FOR EACH ROW EXECUTE FUNCTION prevent_owner_assignment();

-- Repeat for property_site_users table
CREATE TRIGGER prevent_owner_assignment_trigger_site_user
BEFORE INSERT ON property_site_users
FOR EACH ROW EXECUTE FUNCTION prevent_owner_assignment();