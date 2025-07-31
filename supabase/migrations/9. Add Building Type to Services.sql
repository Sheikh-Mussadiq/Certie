-- Add building_type column to services table
ALTER TABLE services 
ADD COLUMN building_type text;

-- Add a constraint to ensure building_type matches our property types
ALTER TABLE services 
ADD CONSTRAINT services_building_type_check 
CHECK (building_type IN (
  'Residential Block',
  'Single Residential Dwelling', 
  'Commercial Office',
  'Mixed-Use Building',
  'School / Education',
  'Retail Unit',
  'Warehouse / Industrial',
  'HMO (House in Multiple Occupation)',
  'Care Facility',
  'Hotel'
));

-- Add comment to explain the column
COMMENT ON COLUMN services.building_type IS 'Property type that this service price applies to';

-- Create an index for better performance when querying by building_type
CREATE INDEX idx_services_building_type ON services(building_type);

-- Create a composite index for product_id and building_type for efficient lookups
CREATE INDEX idx_services_product_building ON services(stripe_product_id, building_type);