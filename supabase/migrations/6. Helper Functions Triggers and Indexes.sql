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