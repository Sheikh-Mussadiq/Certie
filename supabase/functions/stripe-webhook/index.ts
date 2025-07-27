import { createClient } from "https://esm.sh/@supabase/supabase-js";
import Stripe from "https://esm.sh/stripe?target=deno";
const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"), {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient()
});
// Initialize Supabase
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
  "Content-Type": "application/json"
};
Deno.serve(async (req)=>{
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  // Validate signature and parse body
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();
  let receivedEvent;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET"));
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const invoice = receivedEvent.data.object;
  try {
    switch(receivedEvent.type){
      case "invoice.payment_succeeded":
        await supabase.from("invoices").update({
          status: "paid",
          amount_paid: invoice.amount_paid
        }).eq("stripe_invoice_id", invoice.id);
        break;
      case "invoice.payment_failed":
        await supabase.from("invoices").update({
          status: "uncollectible"
        }).eq("stripe_invoice_id", invoice.id);
        break;
      default:
        console.log(`Unhandled event type ${receivedEvent.type}`);
    }
    return new Response(JSON.stringify({
      ok: true
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
