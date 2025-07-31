# Updated Invoice Logic for Building-Type-Specific Pricing

## 🔄 What Changed

The invoice creation system has been updated to handle the new services table structure where each service has multiple price records - one for each building type.

## 🏗️ Old vs New Logic

### ❌ **Old Logic** (Broken with new structure)
```sql
-- Old: Simple join that would only get ONE price per service
SELECT * FROM bookings 
JOIN services ON bookings.service_id = services.id
```
**Problem**: This would get a random service record, not necessarily the one matching the booking's building type.

### ✅ **New Logic** (Building-type aware)
```sql
-- New: Match BOTH service name AND building type
1. Get booking.service_id to find service NAME
2. Find service WHERE name = service.name AND building_type = booking.building_type  
3. Use THAT service's stripe_price_id
```

## 🔧 Technical Implementation

### Step 1: Get Bookings with Service Names
```javascript
const { data: bookings } = await supabase
  .from("bookings")
  .select("*, services:service_id(name)")
  .in("id", bookingIds);
```

### Step 2: Find Correct Price for Each Booking
```javascript
for (const booking of bookings) {
  // Match service name + building type
  const { data: matchingService } = await supabase
    .from("services")
    .select("stripe_price_id, price_in_cents, name")
    .eq("name", booking.services.name)           // Same service
    .eq("building_type", booking.building_type)  // Same building type
    .single();
    
  // Use this specific price
  await stripe.invoiceItems.create({
    price: matchingService.stripe_price_id,
    // ...
  });
}
```

## 📊 Example Scenario

### Booking Data:
```javascript
{
  id: "booking-123",
  service_id: "service-uuid-1", // Points to "Gas Safety Certificate"  
  building_type: "Commercial Office",
  // ... other booking data
}
```

### Services Table:
```sql
| name                    | building_type      | price_in_cents | stripe_price_id |
|------------------------|-------------------|---------------|----------------|
| Gas Safety Certificate | Residential Block  | 15000         | price_abc123   |
| Gas Safety Certificate | Commercial Office  | 20000         | price_def456   | ← This one!
| Gas Safety Certificate | Hotel             | 35000         | price_ghi789   |
```

### Result:
- ✅ **Correct**: Uses `price_def456` (£200 for Commercial Office)
- ❌ **Old would use**: Random price, maybe `price_abc123` (£150 for Residential)

## 🛡️ Error Handling

The updated function includes comprehensive error checking:

```javascript
// Check service name exists
if (!booking.services?.name) {
  throw new Error(`Missing service name for booking ID: ${booking.id}`);
}

// Check building type exists  
if (!booking.building_type) {
  throw new Error(`Missing building_type for booking ID: ${booking.id}`);
}

// Check matching service found
if (!matchingService) {
  throw new Error(`No service found for ${booking.services.name} with building type ${booking.building_type}`);
}

// Check stripe price exists
if (!matchingService.stripe_price_id) {
  throw new Error(`Missing stripe_price_id for service`);
}
```

## 🎯 Benefits

1. **Accurate Pricing**: Invoices use correct price for building type
2. **Better Descriptions**: Invoice items show "Service Name - Building Type"  
3. **Data Integrity**: Multiple validation checks prevent errors
4. **Detailed Logging**: Console logs show exactly what prices are used

## 🔍 Testing

To test the updated logic:

1. **Create bookings** with different building types for same service
2. **Generate invoice** for multiple bookings  
3. **Verify** each line item uses correct price for its building type
4. **Check Stripe** invoice shows proper amounts and descriptions

Example: If you have 2 bookings for "Gas Safety Certificate":
- One for "Residential Block" → £150  
- One for "Commercial Office" → £200
- Invoice total should be £350, not £300 (2×£150) or £400 (2×£200)