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
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    const { bookingIds, userId } = await req.json();
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      throw new Error("Booking IDs are required.");
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")
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
    let customerId = userData.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email
      });
      customerId = customer.id;
      await supabase.from("users").update({
        stripe_customer_id: customerId
      }).eq("id", user.id);
    }
    // Updated join using service_id foreign key
    const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("*, services:service_id(*)").in("id", bookingIds);
    if (bookingsError) throw bookingsError;
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 30
    });
    for (const booking of bookings){
      if (!booking.services?.stripe_price_id) {
        throw new Error(`Missing stripe_price_id for booking ID: ${booking.id}`);
      }
      await stripe.invoiceItems.create({
        customer: customerId,
        price: booking.services.stripe_price_id,
        invoice: invoice.id
      });
    }
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
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
