import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const createProperty = async (propertyData, userId) => {
  try {
    let imageUrl = null;
    
    if (propertyData.image) {
      const { url, error: uploadError } = await uploadPropertyImage(propertyData.image, userId);
      if (uploadError) throw uploadError;
      imageUrl = url;
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([{
        ...propertyData,
        image: imageUrl
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const uploadPropertyImage = async (file, userId) => {
  try {
   const fileExt = file.name.split('.').pop();
const fileName = `${uuidv4()}.${fileExt}`;
const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property_images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('property_images')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    let imageUrl = propertyData.image;

    if (propertyData.image instanceof File) {
      const { url, error: uploadError } = await uploadPropertyImage(propertyData.image);
      if (uploadError) throw uploadError;
      imageUrl = url;
    }

    const { data, error } = await supabase
      .from('properties')
      .update({
        ...propertyData,
        image: imageUrl
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};