import type { APIRoute } from 'astro';
import { logout } from "../../supabase/auth";

export const all: APIRoute = async ({ cookies }) => {
  await logout(cookies);

  const headers = new Headers();
  // Make HTMX redirect to home
  headers.set("Hx-Redirect", "/");
  // Set the cookie(s)
  for (const cookie of cookies.headers()) {
    headers.append("Set-Cookie", cookie);
  }

  return new Response(null, {
    status: 204,
    headers,
  });
};

