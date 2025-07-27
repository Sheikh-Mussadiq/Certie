import { supabase } from "../lib/supabase";

/**
 * Get all services
 * @returns {Promise} Array of services
 */
export const getAllServices = async () => {
  try {
    const { data, error } = await supabase.from("services").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
