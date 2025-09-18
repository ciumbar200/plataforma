import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { User } from '../types';

// --- PRODUCTION: USE ENVIRONMENT VARIABLES ---
// For deployment and local development, it's crucial to use a .env file.
// Create a file named .env in the root of your project and add:
// VITE_SUPABASE_URL="https://vogzzdnxoldgfpsrobps.supabase.co"
// VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
//
// Then, uncomment these lines and remove the hardcoded ones below:
// const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL;
// const supabaseAnonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY;

// --- DEVELOPMENT ONLY: HARDCODED KEYS (REMOVE FOR PRODUCTION) ---
// I have temporarily placed your keys here to make the app run as requested.
// WARNING: This is NOT secure for a real application. Anyone can see these keys.
// Please move these to a .env file as instructed above as soon as possible.
const supabaseUrl = "https://vogzzdnxoldgfpsrobps.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3p6ZG54b2xkZ2Zwc3JvYnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTIyOTQsImV4cCI6MjA3MzYyODI5NH0.c9H6a7zVtr7-eM1eOQxe6K-xdAVhqIHZqVQ8a6raNMk";


// The client will now be created with the hardcoded keys.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage.
 * @param bucket - The name of the storage bucket.
 * @param file - The file to upload.
 * @param fileName - An optional file name. A timestamp will be used if not provided.
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (bucket: string, file: File, fileName?: string): Promise<string> => {
    if (!supabase) {
        const errorMsg = "Supabase is not configured. Cannot upload file.";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName ? `${fileName}.${fileExt}` : `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(finalFileName, file, { upsert: true });

    if (error) {
        console.error('Error uploading file:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
};

/**
 * Fetches the extended user profile from the 'profiles' table.
 * @param userId - The ID of the user.
 * @returns The user profile data.
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  if (!supabase) {
    console.error("Supabase not configured. Cannot get user profile.");
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }
  
  // A simple type assertion, assuming the DB schema matches the TS type.
  // For more safety, you could use a validation library like Zod.
  return data as User;
};
