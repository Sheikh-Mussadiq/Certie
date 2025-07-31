// Example usage for the create-products-and-prices edge function
// This creates BOTH Stripe products AND their prices across all building types

const products = [
  {
    name: "Gas Safety Certificate",
    description: "Gas Safety Certificate Certie.co"
  },
  {
    name: "Smoke and Carbon Monoxide Testing", 
    description: "Smoke and Carbon Monoxide Testing Certie.co"
  },
  {
    name: "Lift Inspection",
    description: "Lift Inspection Assessment Certie.co"
  },
  {
    name: "Emergency Light Testing",
    description: "Emergency Light Testing Assessment"
  },
  {
    name: "Fire Risk Assessment",
    description: "Fire Risk Assessment"
  },
  {
    name: "PAT Testing",
    description: "PAT Testing"
  }
];

// Function to call the edge function
async function createProductsAndPrices() {
  try {
    console.log('🚀 Creating products and prices...');
    
    const response = await fetch('YOUR_SUPABASE_URL/functions/v1/create-products-and-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY'
      },
      body: JSON.stringify({
        products: products
      })
    });

    const result = await response.json();
    console.log('📋 Result:', result);
    
    if (result.success) {
      console.log(`\n✅ ${result.message}`);
      
      result.results.forEach(product => {
        if (product.success) {
          console.log(`\n📦 ${product.product_name} (${product.product_id}):`);
          console.log(`   Created ${product.prices_created.length} prices`);
          
          product.prices_created.forEach(price => {
            if (price.service_id) {
              console.log(`   ✅ ${price.property_type}: £${price.amount / 100} (Stripe: ${price.price_id}, Service: ${price.service_id})`);
            } else {
              console.log(`   ❌ ${price.property_type}: £${price.amount / 100} - ${price.error || 'Failed'}`);
            }
          });
        } else {
          console.log(`\n❌ ${product.product_name}: ${product.error}`);
        }
      });

      // Summary
      const totalProducts = result.results.filter(r => r.success).length;
      const totalPrices = result.results.reduce((sum, r) => sum + r.prices_created.filter(p => p.service_id).length, 0);
      const totalErrors = result.results.reduce((sum, r) => sum + r.prices_created.filter(p => p.error).length, 0);
      
      console.log(`\n📊 Summary:`);
      console.log(`   Products created: ${totalProducts}/${products.length}`);
      console.log(`   Prices created: ${totalPrices}`);
      console.log(`   Errors: ${totalErrors}`);
      
    } else {
      console.error('❌ Error:', result.error);
    }
    
  } catch (error) {
    console.error('🚨 Fetch error:', error);
  }
}

// Uncomment to run
// createProductsAndPrices();

/* 
Expected Output:
- 6 Stripe products created
- ~58 prices created (6 products × ~9.7 building types average, some skipped for 0 prices)
- ~58 service records in database

CURL Example:

curl -X POST 'YOUR_SUPABASE_URL/functions/v1/create-products-and-prices' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -d '{
    "products": [
      {
        "name": "Gas Safety Certificate",
        "description": "Gas Safety Certificate Certie.co"
      },
      {
        "name": "Smoke and Carbon Monoxide Testing", 
        "description": "Smoke and Carbon Monoxide Testing Certie.co"
      },
      {
        "name": "Lift Inspection",
        "description": "Lift Inspection Assessment Certie.co"
      },
      {
        "name": "Emergency Light Testing",
        "description": "Emergency Light Testing Assessment"
      },
      {
        "name": "Fire Risk Assessment",
        "description": "Fire Risk Assessment"
      },
      {
        "name": "PAT Testing",
        "description": "PAT Testing"
      }
    ]
  }'

*/