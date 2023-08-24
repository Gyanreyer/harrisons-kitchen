import { getSupabaseClient } from "./client";
import type { User } from "@supabase/supabase-js";

export const ensureAccountHasHousehold = async (user: User, defaultHouseholdID?: number) => {
  const supabase = getSupabaseClient();

  const fetchCurrentAccountResponse = await supabase.from("accounts").select("household_id").eq("user_id", user.id).maybeSingle();

  if (fetchCurrentAccountResponse.data?.household_id) {
    return fetchCurrentAccountResponse.data.household_id;
  } else if (fetchCurrentAccountResponse.error) {
    throw fetchCurrentAccountResponse.error;
  }

  let householdID = defaultHouseholdID;

  if (!householdID) {
    const createHouseholdResponse = await supabase.from("households").insert({}).select("id").single();

    if (createHouseholdResponse.error) {
      throw createHouseholdResponse.error;
    } else if (!createHouseholdResponse.data?.id) {
      throw new Error("Failed to create household for account");
    }

    householdID = createHouseholdResponse.data.id;
  }

  // Update the account with the household ID, or create a new account if one doesn't exist
  const upsertHouseholdIDResponse = await supabase.from("accounts").upsert({
    user_id: user.id,
    household_id: defaultHouseholdID
  });
  if (upsertHouseholdIDResponse.error) {
    throw upsertHouseholdIDResponse.error;
  }

  return householdID;
}
