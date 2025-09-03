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
/* ---------- Pricing calculators (return amounts in pence) ---------- */ function computePatAmountPence(devices) {
  const basePence = 9900; // £99.00
  const perDevicePence = 89; // £0.89
  const extra = devices > 100 ? (devices - 100) * perDevicePence : 0;
  return basePence + extra;
}
function computeFireDoorAmountPence(doors) {
  const basePence = 18000; // £180.00
  const included = 10;
  const perDoorPence = 1500; // £15.00
  const extra = doors > included ? (doors - included) * perDoorPence : 0;
  return basePence + extra;
}
/* ---------- Helpers to safely extract numeric counts from booking.meta ---------- */ /**
 * Try multiple keys and parsing strategies to extract an integer count from meta.
 * Returns integer >= 0 or null if not found/invalid.
 */ function extractCountFromMeta(meta, preferredKeys = []) {
  if (meta == null) return null;
  // if meta is a JSON string, try parse
  if (typeof meta === "string") {
    try {
      meta = JSON.parse(meta);
    } catch  {
    // fall through to try parse as plain number
    }
  }
  if (typeof meta === "number") {
    return Number.isInteger(meta) && meta >= 0 ? meta : null;
  }
  if (typeof meta === "object") {
    // try preferred keys first
    for (const key of preferredKeys){
      if (key in meta) {
        const val = meta[key];
        const parsed = parseCount(val);
        if (parsed !== null) return parsed;
      }
    }
    // common fallback keys
    const fallbackKeys = [
      "count",
      "quantity",
      "number",
      "items",
      "item_count"
    ];
    for (const key of fallbackKeys){
      if (key in meta) {
        const val = meta[key];
        const parsed = parseCount(val);
        if (parsed !== null) return parsed;
      }
    }
    // If meta itself is a single-key object with a numeric-ish value, try that
    const keys = Object.keys(meta);
    if (keys.length === 1) {
      const parsed = parseCount(meta[keys[0]]);
      if (parsed !== null) return parsed;
    }
  }
  return null;
}
function parseCount(value) {
  if (value == null) return null;
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 0 ? value : null;
  }
  if (typeof value === "string") {
    // trim and parse
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const asNum = Number(trimmed);
    return Number.isFinite(asNum) && Number.isInteger(asNum) && asNum >= 0 ? asNum : null;
  }
  return null;
}
/* ------------------------ Edge function ------------------------ */ Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    const { bookingIds } = await req.json();
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      throw new Error("Booking IDs are required.");
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing required environment variables");
    }
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({
        error
      }), {
        status: 401,
        headers: corsHeaders
      });
    }
    const { data: userData, error: userError } = await supabase.from("users").select("stripe_customer_id").eq("id", user.id).single();
    if (userError) throw userError;
    let customerId = userData?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email
      });
      customerId = customer.id;
      await supabase.from("users").update({
        stripe_customer_id: customerId
      }).eq("id", user.id);
    }
    // Get bookings and include related service info
    const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("*, services:service_id(*)").in("id", bookingIds);
    if (bookingsError) throw bookingsError;
    // create draft invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 30
    });
    for (const booking of bookings){
      const serviceName = booking.services?.name;
      if (!serviceName) {
        throw new Error(`Missing service name for booking ID: ${booking.id}`);
      }
      // --- PAT Testing (ignore building_type) ---
      if (serviceName === "PAT Testing") {
        const devices = extractCountFromMeta(booking.meta, [
          "devices",
          "device_count",
          "devices_count"
        ]);
        if (devices === null || !Number.isInteger(devices) || devices < 1) {
          throw new Error(`Invalid or missing devices count in booking.meta.devices for booking ID: ${booking.id}`);
        }
        const amountPence = computePatAmountPence(devices);
        console.log(`PAT Testing: booking=${booking.id} devices=${devices} amount=£${(amountPence / 100).toFixed(2)}`);
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: amountPence,
          currency: "gbp",
          description: `PAT Testing — ${devices} device${devices === 1 ? "" : "s"}, for Property: ${booking.property_name}.`
        });
        continue;
      }
      // --- Fire Door Inspection (ignore building_type) ---
      if (serviceName === "Fire Door Inspection") {
        const doors = extractCountFromMeta(booking.meta, [
          "doors",
          "door_count",
          "doors_count",
          "number_of_doors"
        ]);
        if (doors === null || !Number.isInteger(doors) || doors < 1) {
          throw new Error(`Invalid or missing doors count in booking.meta.doors for booking ID: ${booking.id}`);
        }
        const amountPence = computeFireDoorAmountPence(doors);
        console.log(`Fire Door Inspection: booking=${booking.id} doors=${doors} amount=£${(amountPence / 100).toFixed(2)}`);
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: amountPence,
          currency: "gbp",
          description: `Fire Door Inspection — ${doors} door${doors === 1 ? "" : "s"}, for Property: ${booking.property_name}.`
        });
        continue;
      }

      if (serviceName === "Fire Risk Assessment") {
        const meta = typeof booking.meta === "string" ? JSON.parse(booking.meta) : booking.meta;
        if (meta.fraMeta === null || meta.fraMeta.price === null) {
          throw new Error(`Invalid or missing FRA meta information for booking ID: ${booking.id}`);
        }
        const amountPence = meta.fraMeta.price * 100;
        console.log(`Fire Risk Assessment: booking=${booking.id} price=${meta.fraMeta.price} amount=£${(amountPence / 100).toFixed(2)}`);
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: amountPence,
          currency: "gbp",
          description: `Fire Risk Assessment, for Property: ${booking.property_name}. ${meta.fraMeta.label || ""}`
        });
        continue;
      }
      // --- Other services (original behavior: match by building_type + service id) ---
      if (!booking.building_type) {
        throw new Error(`Missing building_type for booking ID: ${booking.id}`);
      }
      const { data: matchingService, error: serviceError } = await supabase.from("services").select("stripe_price_id, price_in_cents, name").eq("id", booking.services.id).eq("building_type", booking.building_type).single();
      if (serviceError || !matchingService) {
        throw new Error(`No service found for ${serviceName} with building type ${booking.building_type} for booking ID: ${booking.id}`);
      }
      if (!matchingService.stripe_price_id) {
        throw new Error(`Missing stripe_price_id for service ${matchingService.name} with building type ${booking.building_type} for booking ID: ${booking.id}`);
      }
      console.log(`Adding invoice item: ${matchingService.name} - ${booking.building_type} (£${matchingService.price_in_cents / 100})`);
      await stripe.invoiceItems.create({
        customer: customerId,
        price: matchingService.stripe_price_id,
        invoice: invoice.id,
        description: `${matchingService.name} - ${booking.building_type} (Booking ${booking.id})`
      });
    }
    // finalize/send invoice
    const sentInvoiceData = await stripe.invoices.sendInvoice(invoice.id);
    const { data: dbInvoice, error: dbInvoiceError } = await supabase.from("invoices").insert({
      user_id: user.id,
      stripe_invoice_id: sentInvoiceData.id,
      status: sentInvoiceData.status,
      amount_due: sentInvoiceData.amount_due,
      due_date: new Date(sentInvoiceData.due_date * 1000),
      hosted_invoice_url: sentInvoiceData.hosted_invoice_url,
      invoice_pdf: sentInvoiceData.invoice_pdf
    }).select().single();
    if (dbInvoiceError) throw dbInvoiceError;
    const invoiceBookingData = bookingIds.map((bookingId)=>({
        invoice_id: dbInvoice.id,
        booking_id: bookingId
      }));
    await supabase.from("invoice_bookings").insert(invoiceBookingData);
    return new Response(JSON.stringify({
      success: true,
      invoice: dbInvoice
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
