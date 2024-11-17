import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";
import { Session, User } from "next-auth";

// When user signs into application, need to store user data in database
// avatar, email, name, etc.

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Github OAuth creds are not set!");
}

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // usually not needed, here we are fixing a bug in next-auth
    async session({ session, user }: { session: Session; user: User }) {
      if (session && user) {
        if (session.user) {
          session.user.id = user.id;
        }
      }

      return session;
    },
  },
});
