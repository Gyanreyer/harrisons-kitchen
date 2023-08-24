import type { APIRoute } from 'astro';
import { AuthError } from '@supabase/supabase-js';
import { signup } from "../../supabase/auth";

export const post: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const household_id = formData.get("household_id");

  try {
    await signup(email, password, household_id ? Number(household_id) : undefined, cookies);

    const headers = new Headers();
    // Make HTMX redirect to /recipes
    headers.set("Hx-Redirect", "/recipes");
    // Set the cookie(s)
    for (const cookie of cookies.headers()) {
      headers.append("Set-Cookie", cookie);
    }

    return new Response(null, {
      status: 204,
      headers,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: 401 });
    } else {
      return new Response("An error occurred", { status: 500 });
    }
  }
};




