import type { Account } from "./accounts";
import { getSupabaseClient } from "./client";

export const ensureAccountHasHousehold = async (account: Account, defaultHouseholdID?: number) => {
  if (!account) {
    throw new Error("ensureAccountHasHousehold: No account provided");
  }

  if (account.household_id) {
    return account.household_id;
  }

  const supabase = getSupabaseClient();

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
  const updateHouseholdIDResponse = await supabase.from("accounts").update({
    id: account.id,
    household_id: defaultHouseholdID
  });
  if (updateHouseholdIDResponse.error) {
    throw updateHouseholdIDResponse.error;
  }

  return householdID;
}
