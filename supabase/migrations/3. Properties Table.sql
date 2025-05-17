
-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address JSONB,
  image text,
  compliance_score integer,
  manager text,
  assistant_manager text,
  square_ft integer,
  property_type text check (property_type in ('Residential', 'Commercial', 'Mixed-Use')),
  construction_year integer,
  tenure text check (tenure in ('Leasehold', 'Freehold')),
  insurance_provider text,
  contact_phone text,
  email text,
  floors integer,
  occupants integer,
  local_fire_brigade text,
  fire_strategy text,
  evacuation_policy text,
  emergency_contact text,
  contactor_hours text
);

-- Property Managers Junction Table
CREATE TABLE property_managers (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
full_name TEXT NOT NULL,
  PRIMARY KEY (property_id, user_id)
);

-- Property Site Users Junction Table
CREATE TABLE property_site_users (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
    full_name TEXT NOT NULL,
  PRIMARY KEY (property_id, user_id)
);

-- RLS Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Property Owner Access
CREATE POLICY "Property Insert Access" ON properties
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
);

-- Property Read Access
CREATE POLICY "Property Read Access" ON properties
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() AND
  is_user_role('property_owner')
);

-- Property Delete Access
CREATE POLICY "Property Delete Access" ON properties
FOR DELETE
TO authenticated
USING (
  owner_id = auth.uid() AND
  is_user_role('property_owner')
);


CREATE POLICY "Property Update Access" ON properties
FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid() AND
  is_user_role('property_owner')
)
WITH CHECK (
  owner_id = auth.uid() AND
  is_user_role('property_owner')
);


-- Add trigger to upgrade user role after property creation
CREATE OR REPLACE FUNCTION upgrade_to_property_owner()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET role = 'property_owner'
  WHERE id = NEW.owner_id
  AND role != 'super_admin'
  AND role != 'property_owner';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER property_creation_trigger
AFTER INSERT ON properties
FOR EACH ROW EXECUTE FUNCTION upgrade_to_property_owner();

-- 1. SELECT: Property managers can read the properties they manage
CREATE POLICY "Property Manager Select Properties"
  ON properties
  FOR SELECT
    TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM property_managers
       WHERE property_id = properties.id
         AND user_id = auth.uid()
    )
  );


-- 2. UPDATE: Property managers can update the properties they manage
CREATE POLICY "Property Manager Update Properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM property_managers
       WHERE property_id = properties.id
         AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM property_managers
       WHERE property_id = properties.id
         AND user_id = auth.uid()
    )
  );

-- Site User Access
CREATE POLICY "Site User Access" ON properties
FOR SELECT 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM property_site_users 
         WHERE property_id = properties.id 
         AND user_id = auth.uid())
);

-------------------------------------------------------------------