import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import db from "./server/db";
import { sessions, users, verificationTokens } from "./server/db/schema/auth";
import { accounts } from "./server/db/schema/auth";
import Github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),

	providers: [Github],
});
