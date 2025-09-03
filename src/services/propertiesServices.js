import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export const createProperty = async (propertyData, userId) => {
  try {
    let imageUrl = null;

    if (propertyData.image) {
      const { url, error: uploadError } = await uploadPropertyImage(
        propertyData.image,
        userId
      );
      if (uploadError) throw uploadError;
      imageUrl = url;
    }

    const { data, error } = await supabase
      .from("properties")
      .insert([
        {
          ...propertyData,
          image: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const uploadPropertyImage = async (file, userId) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property_images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("property_images").getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getProperties = async () => {
  try {
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*");

    if (error) throw error;

    // Fetch site users for each property
    const propertiesWithUsers = await Promise.all(
      properties.map(async (property) => {
        const { data: siteUsers, error: siteUsersError } = await supabase
          .from("property_site_users")
          .select("*")
          .eq("property_id", property.id);

        if (siteUsersError) throw siteUsersError;

        const { data: managers, error: managersError } = await supabase
          .from("property_managers")
          .select("*")
          .eq("property_id", property.id);

        if (managersError) throw managersError;

        return {
          ...property,
          site_users: siteUsers || [],
          managers: managers || [],
        };
      })
    );

    return propertiesWithUsers;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Fetch properties without related managers and site users
export const getPropertiesBasic = async () => {
  try {
    const { data, error } = await supabase.from("properties").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching properties (basic):", error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const { data: property, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Fetch site users for the property
    const { data: siteUsers, error: siteUsersError } = await supabase
      .from("property_site_users")
      .select("*")
      .eq("property_id", id);

    if (siteUsersError) throw siteUsersError;

    // Fetch managers for the property
    const { data: managers, error: managersError } = await supabase
      .from("property_managers")
      .select("*")
      .eq("property_id", id);

    if (managersError) throw managersError;

    const data = {
      ...property,
      site_users: siteUsers || [],
      managers: managers || [],
    };

    return data;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData, userId) => {
  try {
    let imageUrl = propertyData.image;

    const { managers, site_users, ...updatedPropertyData } = propertyData;

    propertyData = updatedPropertyData;

    if (propertyData.image instanceof File) {
      const { url, error: uploadError } = await uploadPropertyImage(
        propertyData.image,
        userId
      );
      if (uploadError) throw uploadError;
      imageUrl = url;
    }

    const { data, error } = await supabase
      .from("properties")
      .update({
        ...propertyData,
        image: imageUrl,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

export const addPropertyManager = async (propertyId, email) => {
  try {
    const { data, error } = await supabase.rpc("add_property_manager", {
      property_id: propertyId,
      user_email: email,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('This user is already a manager for this property.');
      } else if (error.code === 'P0001' && error.message === 'Cannot assign a property owner as a manager') {
        toast.error('Cannot assign a property owner as a manager.');
      } else {
        toast.error('An error occurred while adding the manager.');
      }
      throw error;
   }
    return data;
  } catch (error) {
    console.error("Error adding property manager:", error);
    throw error;
  }
};

export const removePropertyManager = async (propertyId, userId) => {
  try {
    const { error } = await supabase
      .from("property_managers")
      .delete()
      .match({ property_id: propertyId, user_id: userId });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error removing property manager:", error);
    throw error;
  }
};

export const addPropertySiteUser = async (propertyId, email) => {
  try {
    const { data, error } = await supabase.rpc("add_site_user", {
      property_id: propertyId,
      user_email: email,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('This user is already a site user for this property.');
      } else if (error.code === 'P0001' && error.message === 'Cannot assign a property owner as a manager') {
        toast.error('Cannot assign a property owner as a site user.');
      } else {
        toast.error('An error occurred while adding the site user.');
      }
      throw error;
   }
    return data;
  } catch (error) {
    console.error("Error adding site user:", error);
    throw error;
  }
};

export const removeSiteUser = async (propertyId, userId) => {
  try {
    const { error } = await supabase
      .from("property_site_users")
      .delete()
      .match({ property_id: propertyId, user_id: userId });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error removing site user:", error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const updatePropertyBuildingType = async (propertyId, buildingType) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({ property_type: buildingType })
      .eq("id", propertyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating property building type:", error);
    throw error;
  }
};
