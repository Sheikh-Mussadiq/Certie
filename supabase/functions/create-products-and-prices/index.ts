import { createClient } from "https://esm.sh/@supabase/supabase-js";
import Stripe from "https://esm.sh/stripe?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"), {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient()
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
  "Content-Type": "application/json"
};

// Property types based on your BuildingForm.jsx
const PROPERTY_TYPES = [
  "Residential Block",
  "Single Residential Dwelling", 
  "Commercial Office",
  "Mixed-Use Building",
  "School / Education",
  "Retail Unit",
  "Warehouse / Industrial",
  "HMO (House in Multiple Occupation)",
  "Care Facility",
  "Hotel"
];

// Price configuration - YOU CAN MODIFY THESE PRICES
const PRICE_CONFIG: Record<string, Record<string, number>> = {
  "Gas Safety Certificate": {
    "Residential Block": 15000, // £150.00 in pence
    "Single Residential Dwelling": 8000, // £80.00 in pence
    "Commercial Office": 20000, // £200.00 in pence
    "Mixed-Use Building": 18000, // £180.00 in pence
    "School / Education": 25000, // £250.00 in pence
    "Retail Unit": 12000, // £120.00 in pence
    "Warehouse / Industrial": 22000, // £220.00 in pence
    "HMO (House in Multiple Occupation)": 16000, // £160.00 in pence
    "Care Facility": 30000, // £300.00 in pence
    "Hotel": 35000 // £350.00 in pence
  },
  "Smoke and Carbon Monoxide Testing": {
    "Residential Block": 12000, // £120.00 in pence
    "Single Residential Dwelling": 6000, // £60.00 in pence
    "Commercial Office": 18000, // £180.00 in pence
    "Mixed-Use Building": 15000, // £150.00 in pence
    "School / Education": 22000, // £220.00 in pence
    "Retail Unit": 10000, // £100.00 in pence
    "Warehouse / Industrial": 20000, // £200.00 in pence
    "HMO (House in Multiple Occupation)": 14000, // £140.00 in pence
    "Care Facility": 25000, // £250.00 in pence
    "Hotel": 28000 // £280.00 in pence
  },
  "Lift Inspection": {
    "Residential Block": 40000, // £400.00 in pence
    "Single Residential Dwelling": 0, // Not applicable
    "Commercial Office": 50000, // £500.00 in pence
    "Mixed-Use Building": 45000, // £450.00 in pence
    "School / Education": 55000, // £550.00 in pence
    "Retail Unit": 35000, // £350.00 in pence
    "Warehouse / Industrial": 48000, // £480.00 in pence
    "HMO (House in Multiple Occupation)": 38000, // £380.00 in pence
    "Care Facility": 60000, // £600.00 in pence
    "Hotel": 65000 // £650.00 in pence
  },
  "Emergency Light Testing": {
    "Residential Block": 8000, // £80.00 in pence
    "Single Residential Dwelling": 5000, // £50.00 in pence
    "Commercial Office": 15000, // £150.00 in pence
    "Mixed-Use Building": 12000, // £120.00 in pence
    "School / Education": 18000, // £180.00 in pence
    "Retail Unit": 8000, // £80.00 in pence
    "Warehouse / Industrial": 16000, // £160.00 in pence
    "HMO (House in Multiple Occupation)": 10000, // £100.00 in pence
    "Care Facility": 20000, // £200.00 in pence
    "Hotel": 22000 // £220.00 in pence
  },
  "Fire Risk Assessment": {
    "Residential Block": 25000, // £250.00 in pence
    "Single Residential Dwelling": 15000, // £150.00 in pence
    "Commercial Office": 35000, // £350.00 in pence
    "Mixed-Use Building": 30000, // £300.00 in pence
    "School / Education": 45000, // £450.00 in pence
    "Retail Unit": 20000, // £200.00 in pence
    "Warehouse / Industrial": 40000, // £400.00 in pence
    "HMO (House in Multiple Occupation)": 28000, // £280.00 in pence
    "Care Facility": 50000, // £500.00 in pence
    "Hotel": 55000 // £550.00 in pence
  },
  "PAT Testing": {
    "Residential Block": 10000, // £100.00 in pence
    "Single Residential Dwelling": 6000, // £60.00 in pence
    "Commercial Office": 15000, // £150.00 in pence
    "Mixed-Use Building": 12000, // £120.00 in pence
    "School / Education": 18000, // £180.00 in pence
    "Retail Unit": 8000, // £80.00 in pence
    "Warehouse / Industrial": 16000, // £160.00 in pence
    "HMO (House in Multiple Occupation)": 10000, // £100.00 in pence
    "Care Facility": 20000, // £200.00 in pence
    "Hotel": 22000 // £220.00 in pence
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { products } = await req.json();
    
    if (!products || !Array.isArray(products)) {
      throw new Error("Products array is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing required environment variables");
    }

    const _supabase = createClient(supabaseUrl, supabaseKey);

    const results = [];

    for (const productInfo of products) {
      const productName = productInfo.name;
      const productDescription = productInfo.description;
      
      console.log(`🚀 Creating product: ${productName}`);

      const productPriceConfig = PRICE_CONFIG[productName];
      if (!productPriceConfig) {
        console.warn(`⚠️ No price configuration found for product: ${productName}`);
        results.push({
          product_name: productName,
          success: false,
          error: "No price configuration found",
          prices_created: []
        });
        continue;
      }

      try {
        // Step 1: Create Stripe Product
        console.log(`📦 Creating Stripe product for: ${productName}`);
        const stripeProduct = await stripe.products.create({
          name: productName,
          description: productDescription,
          type: "service",
          metadata: {
            created_by: "certie_automation"
          }
        });

        console.log(`✅ Created Stripe product: ${stripeProduct.id} for ${productName}`);

        // Step 2: Create prices for each building type
        const productPrices = [];
        console.log(`💰 Creating ${PROPERTY_TYPES.length} prices for ${productName}`);
        
        for (const propertyType of PROPERTY_TYPES) {
          console.log(`Processing ${productName} - ${propertyType}`);
          const priceAmount = productPriceConfig[propertyType];
          
          // Skip if price is 0 (not applicable)
          if (priceAmount === 0) {
            console.log(`⏭️ Skipping ${productName} for ${propertyType} - not applicable (price is 0)`);
            continue;
          }

          console.log(`💷 Creating price for ${productName} - ${propertyType} at ${priceAmount} pence`);

          try {
            // Create Stripe price
            const stripePrice = await stripe.prices.create({
              product: stripeProduct.id,
              unit_amount: priceAmount,
              currency: "gbp",
              metadata: {
                property_type: propertyType,
                product_name: productName
              },
              nickname: `${productName} - ${propertyType}`
            });

            console.log(`✅ Created Stripe price for ${productName} - ${propertyType}: ${stripePrice.id}`);
            
            // Save to services table
            const insertData = {
              name: productName,
              description: productDescription,
              price_in_cents: priceAmount,
              stripe_product_id: stripeProduct.id,
              stripe_price_id: stripePrice.id,
              building_type: propertyType
            };
            
            console.log(`💾 Inserting to services table:`, insertData);
            
            const { data: serviceData, error: serviceError } = await _supabase
              .from('services')
              .insert(insertData)
              .select()
              .single();

            if (serviceError) {
              console.error(`❌ Error saving service to database for ${productName} - ${propertyType}:`, serviceError);
              productPrices.push({
                property_type: propertyType,
                price_id: stripePrice.id,
                amount: priceAmount,
                currency: "gbp",
                service_id: null,
                error: serviceError.message
              });
            } else {
              console.log(`✅ Saved service to database: ${serviceData.id} for ${productName} - ${propertyType}`);
              productPrices.push({
                property_type: propertyType,
                price_id: stripePrice.id,
                amount: priceAmount,
                currency: "gbp",
                service_id: serviceData.id
              });
            }

          } catch (error) {
            console.error(`❌ Error creating price for ${productName} - ${propertyType}:`, error);
            productPrices.push({
              property_type: propertyType,
              price_id: null,
              amount: priceAmount,
              currency: "gbp",
              service_id: null,
              error: error instanceof Error ? error.message : "Unknown error"
            });
          }
        }
        
        console.log(`✅ Completed processing ${productName}. Created ${productPrices.length} price records.`);

        results.push({
          product_id: stripeProduct.id,
          product_name: productName,
          success: true,
          prices_created: productPrices
        });

      } catch (error) {
        console.error(`❌ Error creating product ${productName}:`, error);
        results.push({
          product_name: productName,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          prices_created: []
        });
      }
    }

    const totalPricesCreated = results.reduce((sum, result) => sum + result.prices_created.length, 0);
    const successfulProducts = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Created ${successfulProducts} products with ${totalPricesCreated} total prices`,
      results: results
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error("Error in create-products-and-prices:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});