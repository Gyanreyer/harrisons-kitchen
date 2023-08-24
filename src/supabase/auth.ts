import type { AstroCookies } from "astro";

import { getSupabaseClient } from "./client";
import { ensureUserHasAccount } from "./accounts";

const LOGIN_TOKEN_COOKIE_NAME = "jwt";

const setLoginTokenCookie = (cookies: AstroCookies, token: string) => cookies.set(LOGIN_TOKEN_COOKIE_NAME, token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
});

export const signup = async (email: string, password: string, household_id: number | undefined, cookies: AstroCookies) => {
  const supabase = getSupabaseClient();
  const { data: {
    user, session
  }, error: signupError } = await supabase.auth.signUp({ email, password });

  if (signupError) { throw signupError; }

  if (!user || !session) { throw new Error("No user returned from Supabase"); }

  const { error: createAccountError } = await supabase.from("accounts").insert({
    user_id: user.id,
    household_id,
  });

  if (createAccountError) { throw createAccountError; }

  // Write a cookie with the login token
  setLoginTokenCookie(cookies, session.access_token);
};

export const login = async (email: string, password: string, cookies: AstroCookies) => {
  const supabase = getSupabaseClient();
  const { data: { user, session }, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) { throw loginError; }

  if (!user || !session) { throw new Error("No user returned from Supabase"); }

  // Write a cookie with the login token
  setLoginTokenCookie(cookies, session.access_token);

  // Ensure an account exists for this user
  ensureUserHasAccount(user);
};

export const logout = async (cookies: AstroCookies) => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) throw error;

  cookies.delete(LOGIN_TOKEN_COOKIE_NAME, {
    path: "/",
  });
};

export const getLoggedInUser = async (cookies: AstroCookies) => {
  const token = cookies.get(LOGIN_TOKEN_COOKIE_NAME).value;

  if (!token) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export const getIsLoggedIn = (cookies: AstroCookies) => cookies.has(LOGIN_TOKEN_COOKIE_NAME);