"use server";

import * as auth from "@/auth";

export async function signOut() {
  console.log("signing out");
  return auth.signOut();
}
