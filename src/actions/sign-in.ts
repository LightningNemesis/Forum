"use server";

import * as auth from "@/auth";

export async function signIn() {
  console.log("signing in");
  return auth.signIn("github"); // github is the provider
}
