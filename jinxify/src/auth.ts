import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import db from "./server/db";
import { sessions, users, verificationTokens } from "./server/db/schema/auth";
import { accounts } from "./server/db/schema/auth";
import Github from "next-auth/providers/github";
import { directory } from "./server/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	events: {
		async createUser({ user }) {
			console.log("createUser event triggered");
			try {
				const userId = user.id;
				console.log("User ID:", userId);
				if (!userId) {
					throw new Error("User ID not found on createUser event");
				}
				await db.insert(directory).values({
					title: "Home",
					userId,
					directoryId: null,
				});
			} catch (error) {
				console.error("Error initializing user data:", error);
			}
		},
	},
	providers: [Github],
});
