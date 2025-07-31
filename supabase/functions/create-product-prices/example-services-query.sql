-- Example query to see the services table after running create-product-prices

-- View all services grouped by product
SELECT 
  name as product_name,
  building_type,
  price_in_cents,
  (price_in_cents::float / 100) as price_in_pounds,
  stripe_product_id,
  stripe_price_id,
  created_at
FROM services 
ORDER BY name, building_type;

-- Count services by product
SELECT 
  name as product_name,
  COUNT(*) as price_variations,
  MIN(price_in_cents) as min_price_pence,
  MAX(price_in_cents) as max_price_pence,
  (MIN(price_in_cents)::float / 100) as min_price_pounds,
  (MAX(price_in_cents)::float / 100) as max_price_pounds
FROM services 
GROUP BY name
ORDER BY name;

-- Find services for a specific building type
SELECT 
  name as service_name,
  description,
  price_in_cents,
  (price_in_cents::float / 100) as price_in_pounds,
  stripe_price_id
FROM services 
WHERE building_type = 'Residential Block'
ORDER BY name;

-- Get all building types and their service counts
SELECT 
  building_type,
  COUNT(*) as available_services,
  AVG(price_in_cents) as avg_price_pence,
  (AVG(price_in_cents)::float / 100) as avg_price_pounds
FROM services 
GROUP BY building_type
ORDER BY building_type;