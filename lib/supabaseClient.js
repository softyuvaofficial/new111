// lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// These values should be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables');
}

// Create a single supabase client for use throughout your app
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
