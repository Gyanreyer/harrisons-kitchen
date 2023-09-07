import { defineMiddleware } from "astro:middleware";
import { getIsLoggedIn, getLoggedInUser } from "./supabase/auth";
import { getAccount } from "./supabase/accounts";

const loggedOutOnlyPages: {
  [path: string]: boolean;
} = {
  "/": true,
  "/login": true,
  "/signup": true,
};

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.isLoggedIn = getIsLoggedIn(context.cookies);

  const requestPathname = context.url.pathname;

  // If the request is not to an API route, check if the user is logged in and redirect them if necessary
  if (!requestPathname.startsWith("/api")) {
    const isLoggedOutOnlyPage = requestPathname in loggedOutOnlyPages;

    if (context.locals.isLoggedIn && isLoggedOutOnlyPage) {
      // Redirect to /recipes if logged in but on a logged-out-only page
      return context.redirect("/recipes");
    } else if (!context.locals.isLoggedIn && !isLoggedOutOnlyPage) {
      // Redirect to /login if logged out but not on a logged-out-only page
      return context.redirect("/login");
    }
  }

  context.locals.getAccount = async () => {
    const user = await getLoggedInUser(context.cookies);
    if (!user) {
      return null;
    }
    return await getAccount(user);
  };

  const response = await next();

  if (response.status === 200 && context.request.headers.has("HX-Request")) {
    const html = await response.text();
    // Remove any script tags from the response
    const sanitizedFragmentHTML = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    return new Response(
      sanitizedFragmentHTML,
      response,
    );
  }

  return response;
});