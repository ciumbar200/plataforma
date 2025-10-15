
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vogzzdnxoldgfpsrobps.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3p6ZG54b2xkZ2Zwc3JvYnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTIyOTQsImV4cCI6MjA3MzYyODI5NH0.c9H6a7zVtr7-eM1eOQxe6K-xdAVhqIHZqVQ8a6raNMk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
