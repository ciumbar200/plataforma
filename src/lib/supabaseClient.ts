import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { User } from '../types';

// --- Vercel Environment Variables (Recommended for Production) ---
// These variables should be set in your Vercel project settings.
const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY;

// --- Fallback Hardcoded Keys (For local dev or if Vercel vars are not set) ---
const FALLBACK_SUPABASE_URL = "https://vogzzdnxoldgfpsrobps.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3p6ZG54b2xkZ2Zwc3JvYnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTIyOTQsImV4cCI6MjA3MzYyODI5NH0.c9H6a7zVtr7-eM1eOQxe6K-xdAVhqIHZqVQ8a6raNMk";

const finalUrl = supabaseUrl || FALLBACK_SUPABASE_URL;
const finalKey = supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (finalUrl && finalKey) {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn(
            "----------------------------------------------------------------\n" +
            "WARNING: Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are not set.\n" +
            "Falling back to hardcoded keys. This is NOT secure and should ONLY be used for local development.\n" +
            "For production deployment on Vercel, please set these variables in your project's Environment Variables settings.\n" +
            "----------------------------------------------------------------"
        );
    }
    supabaseInstance = createClient(finalUrl, finalKey);
} else {
    console.error("Supabase URL and Anon Key are missing. The application cannot start.");
}

export const supabase: SupabaseClient = supabaseInstance as SupabaseClient;


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