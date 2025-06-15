
-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) default auth.uid(),
  name TEXT NOT NULL,
  address JSONB,
  image text,
  compliance_score integer,
  manager text,
  assistant_manager text,
  square_ft integer,
   property_type text check (
    property_type in (
      'Residential Block',
      'Single Residential Dwelling',
      'Commercial Office',
      'Mixed-Use Building',
      'School / Education',
      'Retail Unit',
      'Warehouse / Industrial',
      'HMO (House in Multiple Occupation)',
      'Care Facility',
      'Hotel',
      'Other'
    )
  ),
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
  contactor_hours text,
  created_at TIMESTAMPTZ DEFAULT NOW()
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


-- Add trigger to upgrade user role after property creation
CREATE OR REPLACE FUNCTION upgrade_to_property_owner() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO public
AS $$
BEGIN
  UPDATE users
  SET role = 'property_owner'
  WHERE id = NEW.owner_id
    AND role NOT IN ('super_admin');
  RETURN NEW;
END;
$$;

CREATE TRIGGER property_creation_trigger
AFTER INSERT ON properties
FOR EACH ROW EXECUTE FUNCTION upgrade_to_property_owner();

-------------------------------------------------------------------


/*
  # Property Images Storage

  1. Storage
    - Create property_images bucket for storing property images
    - Set up storage policies for secure access

  2. Security
    - Enable public access for viewing images
    - Restrict upload/delete to property owners
*/

-- Create property_images bucket
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('property_images', 'property_images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage Policies
CREATE POLICY "Property images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property_images');

CREATE POLICY "Property owners can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property_images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Property owners can update their images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property_images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Property owners can delete their images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property_images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );