/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
    getAccount: () => Promise<import("./supabase/accounts").Account | null>;
  }
}