import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => supabaseClient || (supabaseClient = createClient<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY));