import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { User } from '../types';

// --- PRODUCTION: USE ENVIRONMENT VARIABLES ---
// This is the secure way to handle your keys for both local development and deployment.
// 1. Create a file named .env in the root of your project.
// 2. Add your Supabase credentials to the .env file like this:
//    VITE_SUPABASE_URL="https://vogzzdnxoldgfpsrobps.supabase.co"
//    VITE_SUPABASE_ANON_KEY="your-anon-key-here"
// 3. Make sure the .env file is listed in your .gitignore file.

const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // This warning is helpful for local development. Vercel will provide the variables in production.
    console.warn("Supabase URL and Anon Key are not set in .env file. This is expected during Vercel build, but will cause issues in local dev if not set.");
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
