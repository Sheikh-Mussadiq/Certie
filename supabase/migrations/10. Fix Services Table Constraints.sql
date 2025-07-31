-- Remove the unique constraint on name column 
-- since we want multiple services with the same name but different building_types
ALTER TABLE services DROP CONSTRAINT services_name_key;

-- Create a composite unique constraint on name + building_type + stripe_product_id
-- This ensures we don't have duplicate services for the same product and building type
ALTER TABLE services 
ADD CONSTRAINT services_name_building_product_key 
UNIQUE (name, building_type, stripe_product_id);

-- Add an index for better performance when querying by name and building_type
CREATE INDEX IF NOT EXISTS idx_services_name_building 
ON services(name, building_type);