import { supabase } from "../lib/supabase";

/**
 * Get all invoices for the current user
 * @returns {Promise} Array of invoices
 */
export const getInvoicesForUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, invoice_bookings(*, bookings(*))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};
