
-- Property Managers Table Policies
ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;

-- Owners has full access to property managers
CREATE POLICY "Owner Full access for Managers"
ON property_managers
FOR ALL
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


-- Property Managers can view their assignments
CREATE POLICY "Manager View Access" ON property_managers
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- Enable RLS if you haven’t already
-- Property Managers Table Policies
ALTER TABLE property_site_users ENABLE ROW LEVEL SECURITY;

-- Owners full access to site‐user for their properties
CREATE POLICY "Owner Full access for Site Users"
ON property_site_users
FOR ALL
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

CREATE POLICY "Manager can view Site Users" ON property_site_users
FOR SELECT 
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
    WHERE id = property_id AND owner_id = auth.uid()
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
    WHERE id = property_id AND owner_id = auth.uid()
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



