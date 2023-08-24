import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";

export interface Account {
  id: number;
  user_id: string;
  household_id: number | null;
}

export const getAccount = async (user: User): Promise<Account> => {
  const supabase = getSupabaseClient();

  const { data: account, error } = await supabase.from("accounts").select("id, user_id, household_id").eq("user_id", user.id).single();

  if (error) { throw error; }

  if (!account) { throw new Error("No account found for user"); }

  return account;
};

export const ensureUserHasAccount = async (user: User, defaultHouseholdID?: number) => {
  const supabase = getSupabaseClient();

  const existingAccount = await getAccount(user);
  if (existingAccount) {
    return true;
  }

  const createAccountResponse = await supabase.from("accounts").insert({
    user_id: user.id,
    household_id: defaultHouseholdID,
  });

  if (createAccountResponse.error) {
    throw createAccountResponse.error;
  }

  return false;
};

