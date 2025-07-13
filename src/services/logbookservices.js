import { supabase } from '../lib/supabase';

// Fetch all logbooks (optionally by property_id)
export const getLogbooks = async (propertyId = null) => {
  try {
    let query = supabase
      .from('property_logbooks')
      .select('*');
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching logbooks:', error);
    throw error;
  }
};

// Set a logbook as active
export const activateLogbook = async (logbookId) => {
  try {
    const { data, error } = await supabase
      .from('property_logbooks')
      .update({ active: true })
      .eq('id', logbookId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error activating logbook:', error);
    throw error;
  }
};

// Set a logbook as inactive
export const deactivateLogbook = async (logbookId) => {
  try {
    const { data, error } = await supabase
      .from('property_logbooks')
      .update({ active: false })
      .eq('id', logbookId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deactivating logbook:', error);
    throw error;
  }
};

// Create a new logbook
export const createLogbook = async ({ logbook_type, description, frequency, property_id = null }) => {
  try {
    const { data, error } = await supabase
      .from('property_logbooks')
      .insert([
        {
          logbook_type,
          description,
          frequency,
          property_id,
          active: true,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating logbook:', error);
    throw error;
  }
};

// Fetch entries for a given logbook
export const getLogbookEntries = async (logbookId) => {
  try {
    const { data, error } = await supabase
      .from('logbook_entries')
      .select('*')
      .eq('logbook_id', logbookId)
      .order('performed_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching logbook entries:', error);
    throw error;
  }
};

// Delete a logbook
export const deleteLogbook = async (logbookId) => {
  try {
    const { error } = await supabase
      .from('property_logbooks')
      .delete()
      .eq('id', logbookId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting logbook:', error);
    throw error;
  }
};

// Create a new logbook entry
export const createLogbookEntry = async ({ logbook_id, completion_status, issue_comment, performed_by }) => {
  try {
    const performed_at = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const { data, error } = await supabase
      .from('logbook_entries')
      .insert([
        {
          logbook_id,
          completion_status,
          issue_comment: completion_status === 'Issue Identified' ? issue_comment : null,
          performed_by,
          performed_at,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating logbook entry:', error);
    throw error;
  }
}; 