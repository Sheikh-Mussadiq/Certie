import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new document folder
 * @param {string} name - Folder name
 * @param {string} propertyId - Property ID
 * @param {string} createdBy - User ID who created the folder
 * @returns {Promise} Created folder
 */
export const createDocumentFolder = async (name, propertyId, createdBy) => {
  try {
    const { data, error } = await supabase
      .from('document_folders')
      .insert([{
        name,
        property_id: propertyId,
        created_by: createdBy
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating document folder:', error);
    throw error;
  }
};

/**
 * Get all document folders for a property
 * @param {string} propertyId - Property ID
 * @returns {Promise} Array of folders
 */
export const getDocumentFolders = async (propertyId) => {
  try {
    const { data, error } = await supabase
      .from('document_folders')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching document folders:', error);
    throw error;
  }
};

/**
 * Delete a document folder
 * @param {string} folderId - Folder ID
 * @returns {Promise} Success status
 */
export const deleteDocumentFolder = async (folderId) => {
  try {
    const { error } = await supabase
      .from('document_folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting document folder:', error);
    throw error;
  }
};

/**
 * Upload a document file to storage
 * @param {File} file - File to upload
 * @param {string} propertyId - Property ID
 * @param {string} userId - User ID
 * @returns {Promise} File path and public URL
 */
export const uploadDocumentFile = async (file, propertyId, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${propertyId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return { filePath, publicUrl };
  } catch (error) {
    console.error('Error uploading document file:', error);
    throw error;
  }
};

/**
 * Create a new document record
 * @param {Object} documentData - Document information
 * @returns {Promise} Created document
 */
export const createDocument = async (documentData) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

/**
 * Get all documents for a property
 * @param {string} propertyId - Property ID
 * @returns {Promise} Array of documents
 */
export const getDocuments = async (propertyId) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_folders (
          name
        )
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Get documents by folder
 * @param {string} folderId - Folder ID
 * @returns {Promise} Array of documents
 */
export const getDocumentsByFolder = async (folderId) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documents by folder:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @param {string} filePath - File path in storage
 * @returns {Promise} Success status
 */
export const deleteDocument = async (documentId, filePath) => {
  try {
    // Delete from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.warn('Error deleting file from storage:', storageError);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Download a document
 * @param {string} filePath - File path in storage
 * @param {string} fileName - Original file name
 * @returns {Promise} Download URL
 */
export const downloadDocument = async (filePath, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (error) throw error;

    // Create download URL
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

/**
 * Search documents by name
 * @param {string} propertyId - Property ID
 * @param {string} searchTerm - Search term
 * @returns {Promise} Array of matching documents
 */
export const searchDocuments = async (propertyId, searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_folders (
          name
        )
      `)
      .eq('property_id', propertyId)
      .ilike('name', `%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};