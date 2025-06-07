
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
         AND owner_id = (select auth.uid())
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
         AND owner_id = (select auth.uid())
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
         AND owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_managers.property_id
         AND owner_id = (select auth.uid())
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
         AND owner_id = (select (select auth.uid()))
    )
  );


-- Property Managers can view their assignments
CREATE POLICY "Manager View Access" ON property_managers
FOR SELECT
TO authenticated
USING (user_id = (select (select auth.uid())));

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
         AND owner_id = (select auth.uid())
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
         AND owner_id = (select auth.uid())
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
         AND owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM properties
       WHERE id = property_site_users.property_id
         AND owner_id = (select auth.uid())
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
         AND owner_id = (select auth.uid())
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
    AND user_id = (select auth.uid())
  )
);

-- Site Users can view their assignments
CREATE POLICY "Site User View Access" ON property_site_users
FOR SELECT USING (
  user_id = (select auth.uid())
);


-- Add Manager Function (called from frontend)
-- 2. Add a property manager using email
CREATE OR REPLACE FUNCTION add_property_manager(
  property_id UUID,
  user_email TEXT
) 
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO public
AS $$
DECLARE
  target_user_id UUID;
  target_full_name TEXT;
BEGIN
  -- Fetch user
  SELECT id, full_name INTO target_user_id, target_full_name
  FROM users 
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Verify current user is the property owner
  IF NOT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id AND owner_id = (select auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not property owner';
  END IF;

  -- Prevent assigning an owner as a manager
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = target_user_id AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Cannot assign a property owner as a manager';
  END IF;

  -- Add manager
  INSERT INTO property_managers (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);
END;
$$;


-- 3. Add a site user using email
CREATE OR REPLACE FUNCTION add_site_user(
  property_id UUID,
  user_email TEXT
)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO public
AS $$
DECLARE
  target_user_id UUID;
  target_full_name TEXT;
BEGIN
  -- Fetch user
  SELECT id, full_name INTO target_user_id, target_full_name
  FROM users 
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Verify current user is the property owner
  IF NOT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id AND owner_id = (select auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not property owner';
  END IF;

  -- Prevent assigning an owner as site user
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = target_user_id AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Cannot assign a property owner as a site user';
  END IF;

  -- Add site user
  INSERT INTO property_site_users (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);
END;
$$;


-- 4. Prevent owners from being assigned as managers or site users
CREATE OR REPLACE FUNCTION prevent_owner_assignment()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path TO public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = NEW.user_id AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Owners cannot be assigned as managers or site users';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_owner_assignment_trigger
BEFORE INSERT ON property_managers
FOR EACH ROW EXECUTE FUNCTION prevent_owner_assignment();

-- Repeat for property_site_users table
CREATE TRIGGER prevent_owner_assignment_trigger_site_user
BEFORE INSERT ON property_site_users
FOR EACH ROW EXECUTE FUNCTION prevent_owner_assignment();




-- 1. Upgrade user to 'property_owner' (via trigger)
CREATE OR REPLACE FUNCTION upgrade_to_property_owner() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO public
AS $$
BEGIN
  -- Set the flag to bypass the restriction
  PERFORM set_config('app.allow_role_update', 'true', true);

  UPDATE users
  SET role = 'property_owner'
  WHERE id = NEW.owner_id
    AND role NOT IN ('super_admin');

  RETURN NEW;
END;
$$;


-- Checks if current user is a manager of the given property
CREATE OR REPLACE FUNCTION is_property_manager(pid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM property_managers
    WHERE property_id = pid AND user_id = (select auth.uid())
  );
$$;

-- Checks if current user is a site user of the given property
CREATE OR REPLACE FUNCTION is_property_site_user(pid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM property_site_users
    WHERE property_id = pid AND user_id = (select auth.uid())
  );
$$;



-- 2. Add a property manager using email
CREATE OR REPLACE FUNCTION add_property_manager(
  property_id UUID,
  user_email TEXT
) 
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO public
AS $$
DECLARE
  target_user_id UUID;
  target_full_name TEXT;
BEGIN
  -- Fetch user
  SELECT id, full_name INTO target_user_id, target_full_name
  FROM users 
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Verify current user is the property owner
  IF NOT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id AND owner_id = (select auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not property owner';
  END IF;

  -- Prevent assigning an owner as a manager
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = target_user_id AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Cannot assign a property owner as a manager';
  END IF;

  -- Add manager
  INSERT INTO property_managers (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);
END;
$$;


-- 3. Add a site user using email
CREATE OR REPLACE FUNCTION add_site_user(
  property_id UUID,
  user_email TEXT
)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO public
AS $$
DECLARE
  target_user_id UUID;
  target_full_name TEXT;
BEGIN
  -- Fetch user
  SELECT id, full_name INTO target_user_id, target_full_name
  FROM users 
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Verify current user is the property owner
  IF NOT EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id AND owner_id = (select auth.uid())
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not property owner';
  END IF;

  -- Prevent assigning an owner as site user
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = target_user_id AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Cannot assign a property owner as a site user';
  END IF;

  -- Add site user
  INSERT INTO property_site_users (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);
END;
$$;


-- 4. Prevent owners from being assigned as managers or site users
CREATE OR REPLACE FUNCTION prevent_owner_assignment()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path TO public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = NEW.user_id AND role = 'property_owner'
  ) THEN
    RAISE EXCEPTION 'Owners cannot be assigned as managers or site users';
  END IF;
  RETURN NEW;
END;
$$;


-- Property Manager SELECT Policy
CREATE POLICY "Property Manager Select Properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (is_property_manager(id));


-- Property Manager UPDATE Policy
CREATE POLICY "Property Manager Update Properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (is_property_manager(id))
  WITH CHECK (is_property_manager(id));


-- Site User SELECT Policy
CREATE POLICY "Site User Access"
  ON properties
  FOR SELECT 
  TO authenticated
  USING (is_property_site_user(id));
