import type { Database } from "./database.types";

import { getSupabaseClient } from "./client";
import { ensureAccountHasHousehold } from "./households";
import type { Account } from "./accounts";

export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export const getRecipeList = async (account: Account): Promise<Recipe[]> => {
  const householdID = await ensureAccountHasHousehold(account);

  const supabase = getSupabaseClient();
  const { data: recipes, error } = await supabase.from("recipes").select("*").eq("household_id", householdID).order("created_at", {
    ascending: false,
  });

  if (error) {
    throw error;
  }

  return recipes || [];
};

export const createRecipe = async (account: Account, recipe: { name: string, effort_level: number, estimated_cook_time: number }) => {
  const householdID = await ensureAccountHasHousehold(account);

  const supabase = getSupabaseClient();
  const { data: createdRecipe, error } = await supabase.from("recipes").insert({
    name: recipe.name,
    effort_level: recipe.effort_level,
    estimated_cook_time: recipe.estimated_cook_time,
    household_id: householdID,
  }).select().single();

  if (error) {
    throw error;
  }

  return createdRecipe;
}