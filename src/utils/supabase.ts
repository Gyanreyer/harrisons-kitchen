import { createClient } from "@supabase/supabase-js";


export const getSupabaseClient = () => createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY);