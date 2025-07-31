# Create Products and Prices Edge Function

This edge function provides **complete automation** for creating your Certie.co service catalog. It:

1. **Creates Stripe Products** for each service
2. **Creates Stripe Prices** for each product across all property types  
3. **Saves everything** to your Supabase services table

## 🎯 What This Function Does

- Creates 6 Stripe products (Gas Safety, Smoke Testing, Lift Inspection, etc.)
- Creates ~58 individual prices (6 products × ~9.7 property types each)
- Populates your services table with all the data your booking system needs

## 🏗️ Property Types Supported

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

## 💰 Products & Pricing

The function includes pricing for all 6 services:

### Gas Safety Certificate
- Residential Block: £150 | Single Dwelling: £80 | Commercial: £200
- School: £250 | Hotel: £350 | etc.

### Smoke and Carbon Monoxide Testing  
- Residential Block: £120 | Single Dwelling: £60 | Commercial: £180
- School: £220 | Hotel: £280 | etc.

### Lift Inspection
- Residential Block: £400 | Commercial: £500 | School: £550
- *Single Dwelling: Not applicable* | Hotel: £650 | etc.

### Emergency Light Testing
- Residential Block: £80 | Single Dwelling: £50 | Commercial: £150
- School: £180 | Hotel: £220 | etc.

### Fire Risk Assessment
- Residential Block: £250 | Single Dwelling: £150 | Commercial: £350
- School: £450 | Hotel: £550 | etc.

### PAT Testing
- Residential Block: £100 | Single Dwelling: £60 | Commercial: £150
- School: £180 | Hotel: £220 | etc.

## 🚀 Usage

### 1. Deploy the Function

```bash
supabase functions deploy create-products-and-prices
```

### 2. Call the Function

```javascript
const response = await fetch('YOUR_SUPABASE_URL/functions/v1/create-products-and-prices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'apikey': 'YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    products: [
      {
        name: "Gas Safety Certificate",
        description: "Gas Safety Certificate Certie.co"
      },
      {
        name: "Smoke and Carbon Monoxide Testing", 
        description: "Smoke and Carbon Monoxide Testing Certie.co"
      },
      // ... add all 6 products
    ]
  })
});
```

### 3. Customize Prices

Edit the `PRICE_CONFIG` object in `index.ts` to set your prices (in pence):

```typescript
const PRICE_CONFIG: Record<string, Record<string, number>> = {
  "Gas Safety Certificate": {
    "Residential Block": 15000, // £150.00 in pence
    "Commercial Office": 20000, // £200.00 in pence
    // ... customize all your prices
  },
  // ... all 6 products
};
```

## 📊 Response Format

```json
{
  "success": true,
  "message": "Created 6 products with 58 total prices",
  "results": [
    {
      "product_id": "prod_ABC123",
      "product_name": "Gas Safety Certificate",
      "success": true,
      "prices_created": [
        {
          "property_type": "Residential Block",
          "price_id": "price_XYZ789",
          "amount": 15000,
          "currency": "gbp",
          "service_id": "uuid-of-service-record"
        }
        // ... 9 more prices for this product
      ]
    }
    // ... 5 more products
  ]
}
```

## 🗄️ Database Schema

Each price creates a service record with:
- **name**: Product name (e.g., "Gas Safety Certificate")
- **description**: Product description 
- **price_in_cents**: Price in pence
- **stripe_product_id**: Stripe product ID
- **stripe_price_id**: Stripe price ID  
- **building_type**: Property type

## 📋 Prerequisites

**IMPORTANT**: Apply these migrations first:

1. `9. Add Building Type to Services.sql` - Adds building_type column
2. `10. Fix Services Table Constraints.sql` - Fixes unique constraint issue

## 🎯 Expected Results

After running successfully, you'll have:

- **6 Stripe Products** created
- **~58 Stripe Prices** created (some building types skipped where price = 0)
- **~58 Service Records** in your database
- **Complete service catalog** ready for your booking system

## 🔧 Environment Variables Required

- `STRIPE_API_KEY`: Your Stripe secret key
- `SUPABASE_URL`: Your Supabase project URL  
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## 🏃‍♂️ Quick Start

1. Apply migrations
2. Deploy function  
3. Run with your 6 products
4. Your entire service catalog is ready! 🎉

Perfect for setting up your complete Certie.co service pricing in one go!