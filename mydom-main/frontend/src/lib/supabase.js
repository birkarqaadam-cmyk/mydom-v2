import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// =====================================================
// STORAGE FUNCTIONS
// =====================================================

// Upload image to Supabase Storage
export const uploadImage = async (file, folder = 'listings') => {
  try {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('listings')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('listings')
      .getPublicUrl(filePath);

    return {
      filePath,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('listings')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

// =====================================================
// DATABASE FUNCTIONS - LISTINGS
// =====================================================

// Insert a new listing into database using fetch API directly
export const insertListing = async (listingData) => {
  console.log('Attempting to insert listing:', JSON.stringify(listingData, null, 2));
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/listings`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(listingData)
      }
    );

    console.log('Supabase response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Try to read the response body
    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.details || errorData.hint || JSON.stringify(errorData);
          console.error('Supabase error data:', errorData);
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }

    // Parse successful response (responseText already read above)
    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        console.log('Insert successful!', data);
        return Array.isArray(data) ? data[0] : data;
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        return null;
      }
    }
    
    return null;
  } catch (err) {
    console.error('insertListing error:', err.message || err);
    throw err;
  }
};

// Fetch all listings from database
export const fetchListings = async () => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch listings error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('fetchListings error:', error);
    return [];
  }
};

// Update a listing
export const updateListing = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('updateListing error:', error);
    throw error;
  }
};

// Delete a listing
export const deleteListing = async (id) => {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('deleteListing error:', error);
    throw error;
  }
};

// =====================================================
// DATABASE FUNCTIONS - AGENCIES
// =====================================================

export const fetchAgencies = async () => {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('fetchAgencies error:', error);
    return [];
  }
};

export const insertAgency = async (agencyData) => {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .insert([agencyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('insertAgency error:', error);
    throw error;
  }
};

// =====================================================
// DATABASE FUNCTIONS - COMPLEXES
// =====================================================

export const fetchComplexes = async () => {
  try {
    const { data, error } = await supabase
      .from('complexes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('fetchComplexes error:', error);
    return [];
  }
};

export const insertComplex = async (complexData) => {
  try {
    const { data, error } = await supabase
      .from('complexes')
      .insert([complexData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('insertComplex error:', error);
    throw error;
  }
};
