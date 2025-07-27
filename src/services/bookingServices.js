import { supabase } from "../lib/supabase";

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise} Created booking
 */
export const createBooking = async (bookingData) => {
  try {
    // If a service name ('type') is provided, find its ID
    if (bookingData.type) {
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("id")
        .eq("name", bookingData.type)
        .single();

      if (serviceError) {
        console.error("Error fetching service ID:", serviceError);
        // Decide if you want to throw an error or book without the ID
        throw new Error(`Service with name "${bookingData.type}" not found.`);
      }

      if (service) {
        bookingData.service_id = service.id;
      }
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

/**
 * Get all bookings for a specific property
 * @param {string} propertyId - UUID of the property
 * @returns {Promise} Array of bookings
 */
export const getPropertyBookings = async (propertyId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        invoice_bookings (
          invoices (
            status,
            amount_due,
            hosted_invoice_url
          )
        )
      `)
      .eq("property_id", propertyId)
      .order("assessment_time", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching property bookings:", error);
    throw error;
  }
};

/**
 * Get a specific booking by ID
 * @param {string} bookingId - UUID of the booking
 * @returns {Promise} Booking details
 */
export const getBookingById = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

/**
 * Update a booking's status
 * @param {string} bookingId - UUID of the booking
 * @param {string} status - New status ('pending', 'approved', 'rejected', 'assigned', 'completed', 'cancelled')
 * @returns {Promise} Updated booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

/**
 * Update booking details
 * @param {string} bookingId - UUID of the booking
 * @param {Object} updateData - Object containing fields to update
 * @returns {Promise} Updated booking
 */
export const updateBooking = async (bookingId, updateData) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

/**
 * Complete a booking
 * @param {string} bookingId - UUID of the booking
 * @returns {Promise} Updated booking
 */
export const completeBooking = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error completing booking:", error);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - UUID of the booking
 * @returns {Promise} Updated booking
 */
export const cancelBooking = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "rejected" })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

/**
 * Get all bookings
 * @returns {Promise} Array of all bookings
 */
export const getAllBookings = async () => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        properties(name),
        invoice_bookings (
          invoices (
            status,
            amount_due,
            hosted_invoice_url
          )
        )
      `)
      .order("assessment_time", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};
