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
RETURNS JSON
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
    WHERE id = target_user_id AND id = (select auth.uid())
  ) THEN
    RAISE EXCEPTION 'Cannot assign a property owner as a manager';
  END IF;

  -- Add manager
  INSERT INTO property_managers (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);

  -- Return JSON response
  RETURN json_build_object(
    'full_name', target_full_name,
    'email', user_email
  );
END;
$$;



-- 3. Add a site user using email
CREATE OR REPLACE FUNCTION add_site_user(
  property_id UUID,
  user_email TEXT
)
RETURNS JSON
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
    WHERE id = target_user_id AND id = (select auth.uid())
  ) THEN
    RAISE EXCEPTION 'Cannot assign a property owner as a manager';
  END IF;

  -- Add site user
  INSERT INTO property_site_users (property_id, user_id, email, full_name)
  VALUES (property_id, target_user_id, user_email, target_full_name);

  RETURN json_build_object(
    'full_name', target_full_name,
    'email', user_email
  );
END;
$$;


-- 4. Prevent owners from being assigned as managers or site users
CREATE OR REPLACE FUNCTION prevent_owner_assignment()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path TO public
AS $$
BEGIN
  -- Prevent assigning self as manager
  IF NEW.user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot assign yourself as a manager';
  END IF;

  -- Prevent assigning a property owner as a manager of their own property
  IF EXISTS (
    SELECT 1 
    FROM properties 
    WHERE id = NEW.property_id AND owner_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'A property owner cannot be assigned as a manager for their own property';
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


-- Check User Role
CREATE OR REPLACE FUNCTION is_user_role(role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (select auth.uid()) AND role = role_name
  );
END;
$$;



-- Auto-assign owner when property created
CREATE OR REPLACE FUNCTION set_property_owner()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_user_role('super_admin') THEN
    NEW.owner_id = (select auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_owner_trigger
BEFORE INSERT ON properties
FOR EACH ROW EXECUTE FUNCTION set_property_owner();

-- Prevent unauthorized status changes
CREATE OR REPLACE FUNCTION check_booking_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status != 'pending' THEN
    IF NOT is_user_role('super_admin') AND
       NOT EXISTS (SELECT 1 FROM properties 
                  WHERE id = NEW.property_id 
                  AND owner_id = (select auth.uid())) THEN
      RAISE EXCEPTION 'Only owner or admin can approve bookings';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_approval_trigger
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION check_booking_approval();


CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_property_managers_user ON property_managers(user_id);
CREATE INDEX idx_property_site_users_user ON property_site_users(user_id);


CREATE POLICY "Owner or Super Admin Full Access on Properties"
ON properties
FOR ALL
TO authenticated
USING (
  owner_id = auth.uid() OR
  is_user_role('super_admin')
)
WITH CHECK (
  owner_id = auth.uid() OR
  is_user_role('super_admin')
);



-- For table: public.bookings
CREATE INDEX IF NOT EXISTS idx_bookings_booked_by ON public.bookings (booked_by);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings (property_id);

-- For table: public.document_folders
CREATE INDEX IF NOT EXISTS idx_document_folders_created_by ON public.document_folders (created_by);

-- For table: public.documents
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON public.documents (created_by);
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON public.documents (folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON public.documents (property_id);

