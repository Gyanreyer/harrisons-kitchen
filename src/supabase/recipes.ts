import { getSupabaseClient } from "./client";

interface Recipe {
  id: string
  created_at: string;
  name: string
  effort_level: number;
  estimated_cook_time: number;
  last_used?: string;
  season_start_date?: string;
  season_end_date?: string;
}

const RECIPES_TABLENAME = "recipes" as const;

export const getRecipeList = async () => {
  const client = getSupabaseClient();
  const { data, error } = await client.from(RECIPES_TABLENAME).select();
  if (error) throw error;
  return data as Recipe[];
};