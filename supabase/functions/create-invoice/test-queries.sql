-- Test queries to verify the updated invoice logic works correctly

-- 1. View all services with their building types and prices
SELECT 
  name as service_name,
  building_type,
  price_in_cents,
  (price_in_cents::float / 100) as price_in_pounds,
  stripe_price_id,
  stripe_product_id
FROM services 
ORDER BY name, building_type;

-- 2. Check bookings and their associated services
SELECT 
  b.id as booking_id,
  b.building_type as booking_building_type,
  s.name as service_name,
  s.building_type as service_building_type,
  s.price_in_cents,
  (s.price_in_cents::float / 100) as price_in_pounds
FROM bookings b
LEFT JOIN services s ON b.service_id = s.id
ORDER BY b.id;

-- 3. Find correct service for a specific booking (simulates the new logic)
-- Replace 'YOUR_BOOKING_ID' with an actual booking ID
WITH booking_info AS (
  SELECT 
    b.id,
    b.building_type,
    s.name as service_name
  FROM bookings b
  JOIN services s ON b.service_id = s.id
  WHERE b.id = 'YOUR_BOOKING_ID'
)
SELECT 
  bi.id as booking_id,
  bi.building_type as booking_building_type,
  bi.service_name,
  s.building_type as matched_service_building_type,
  s.price_in_cents,
  (s.price_in_cents::float / 100) as price_in_pounds,
  s.stripe_price_id
FROM booking_info bi
JOIN services s ON s.name = bi.service_name 
             AND s.building_type = bi.building_type;

-- 4. Check for potential mismatches (bookings that won't find matching services)
SELECT 
  b.id as booking_id,
  b.building_type as booking_building_type,
  base_service.name as service_name,
  CASE 
    WHEN matching_service.id IS NULL THEN '❌ NO MATCHING SERVICE'
    ELSE '✅ MATCH FOUND'
  END as status
FROM bookings b
JOIN services base_service ON b.service_id = base_service.id
LEFT JOIN services matching_service ON matching_service.name = base_service.name 
                                   AND matching_service.building_type = b.building_type
WHERE matching_service.id IS NULL; -- Only show problematic bookings

-- 5. Simulate invoice totals for a set of booking IDs
-- Replace the booking IDs in the array with real ones
WITH invoice_bookings AS (
  SELECT unnest(ARRAY['booking-id-1', 'booking-id-2', 'booking-id-3']) as booking_id
),
booking_prices AS (
  SELECT 
    ib.booking_id,
    b.building_type,
    base_service.name as service_name,
    matching_service.price_in_cents,
    matching_service.stripe_price_id
  FROM invoice_bookings ib
  JOIN bookings b ON b.id::text = ib.booking_id
  JOIN services base_service ON b.service_id = base_service.id
  JOIN services matching_service ON matching_service.name = base_service.name 
                                AND matching_service.building_type = b.building_type
)
SELECT 
  booking_id,
  service_name,
  building_type,
  price_in_cents,
  (price_in_cents::float / 100) as price_in_pounds,
  SUM(price_in_cents) OVER() as total_pence,
  (SUM(price_in_cents) OVER()::float / 100) as total_pounds
FROM booking_prices
ORDER BY booking_id;

-- 6. Check for duplicate or missing building types
SELECT 
  name,
  COUNT(*) as building_type_count,
  ARRAY_AGG(building_type ORDER BY building_type) as building_types
FROM services 
GROUP BY name
ORDER BY name;