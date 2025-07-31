# Create Product Prices Edge Function

This edge function creates Stripe prices for your products based on different property types. It takes your Stripe products JSON and generates 10 prices for each product, one for each property type.

## Property Types Supported

1. Residential Block
2. Single Residential Dwelling  
3. Commercial Office
4. Mixed-Use Building
5. School / Education
6. Retail Unit
7. Warehouse / Industrial
8. HMO (House in Multiple Occupation)
9. Care Facility
10. Hotel

## Usage

### 1. Deploy the Function

```bash
supabase functions deploy create-product-prices
```

### 2. Call the Function

Send a POST request to the function endpoint with your products JSON:

```javascript
const response = await fetch('YOUR_SUPABASE_URL/functions/v1/create-product-prices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'apikey': 'YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    products: [
      {
        "id": "prod_Sl0hBlfGXnvqge",
        "Name": "Gas Safety Certificate"
      },
      {
        "id": "prod_Sl0h7s19rpuJNk", 
        "Name": "Smoke and Carbon Monoxide Testing"
      },
      {
        "id": "prod_Sl0gFWPLb3NVUJ",
        "Name": "Lift Inspection"
      }
    ]
  })
});
```

### 3. Customize Prices

Edit the `PRICE_CONFIG` object in `index.ts` to set your desired prices (in pence):

```typescript
const PRICE_CONFIG: Record<string, Record<string, number>> = {
  "Gas Safety Certificate": {
    "Residential Block": 15000, // £150.00 in pence
    "Single Residential Dwelling": 8000, // £80.00 in pence
    // ... etc
  },
  // ... other products
};
```

## Response Format

```json
{
  "success": true,
  "message": "Created prices for 3 products",
  "results": [
    {
      "product_id": "prod_Sl0hBlfGXnvqge",
      "product_name": "Gas Safety Certificate",
      "prices_created": [
        {
          "property_type": "Residential Block",
          "price_id": "price_1234567890",
          "amount": 15000,
          "currency": "gbp",
          "service_id": "uuid-of-service-record"
        }
        // ... more prices
      ]
    }
    // ... more products
  ]
}
```

## Database Operations

This function automatically saves each created price to your `services` table with:
- **name**: Product name (e.g., "Gas Safety Certificate")
- **description**: Product description from Stripe
- **price_in_cents**: The price in pence/cents
- **stripe_product_id**: Original Stripe product ID
- **stripe_price_id**: Newly created Stripe price ID
- **building_type**: Property type (e.g., "Residential Block")

## Notes

- Prices are set to 0 for property types where a service doesn't apply (e.g., Lift Inspection for Single Residential Dwelling)
- All prices are in GBP (British Pounds)
- Each price includes metadata with property_type and product_name
- Prices get a nickname in format: "Product Name - Property Type"
- **IMPORTANT**: Run migrations before using this function:
  1. `9. Add Building Type to Services.sql` - Adds building_type column
  2. `10. Fix Services Table Constraints.sql` - Fixes unique constraint issue that prevents multiple building types

## Troubleshooting

**Issue**: Only one record per product is created (instead of one per building type)
**Cause**: The services table has a unique constraint on the `name` column
**Solution**: Apply migration `10. Fix Services Table Constraints.sql` to remove the constraint

## Environment Variables Required

- `STRIPE_API_KEY`: Your Stripe secret key
- `SUPABASE_URL`: Your Supabase project URL  
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key