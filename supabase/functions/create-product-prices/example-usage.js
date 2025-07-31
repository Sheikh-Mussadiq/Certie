// Example usage for the create-product-prices edge function

const products = [
  {
    "id": "prod_Sl0hBlfGXnvqge",
    "Name": "Gas Safety Certificate",
    "Type": "service",
    "Date (UTC)": "7/27/2025 13:31",
    "Description": "Gas Safety Certificate Certie.co",
    "Statement Descriptor": "",
    "Unit Label": "",
    "Url": "",
    "Tax Code": ""
  },
  {
    "id": "prod_Sl0h7s19rpuJNk",
    "Name": "Smoke and Carbon Monoxide Testing",
    "Type": "service", 
    "Date (UTC)": "7/27/2025 13:31",
    "Description": "Smoke and Carbon Monoxide Testing Certie.co",
    "Statement Descriptor": "",
    "Unit Label": "",
    "Url": "",
    "Tax Code": ""
  },
  {
    "id": "prod_Sl0gFWPLb3NVUJ",
    "Name": "Lift Inspection",
    "Type": "service",
    "Date (UTC)": "7/27/2025 13:30",
    "Description": "Lift Inspection Assessment Certie.co",
    "Statement Descriptor": "",
    "Unit Label": "",
    "Url": "",
    "Tax Code": ""
  }
];

// Function to call the edge function
async function createProductPrices() {
  try {
    const response = await fetch('YOUR_SUPABASE_URL/functions/v1/create-product-prices', {
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
    console.log('Result:', result);
    
    if (result.success) {
      console.log(`Successfully created prices for ${result.results.length} products`);
      result.results.forEach(product => {
        console.log(`\n${product.product_name} (${product.product_id}):`);
        product.prices_created.forEach(price => {
          console.log(`  - ${price.property_type}: £${price.amount / 100} (Stripe: ${price.price_id}, Service: ${price.service_id})`);
        });
      });
    } else {
      console.error('Error:', result.error);
    }
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Uncomment to run
// createProductPrices();

/* 
CURL Example:

curl -X POST 'YOUR_SUPABASE_URL/functions/v1/create-product-prices' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -d '{
    "products": [
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
  }'
*/