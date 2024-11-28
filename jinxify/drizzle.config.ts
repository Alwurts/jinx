import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const dbUrl = process.env.DATABASE_URL!;

export default defineConfig({
	out: "./src/server/db/migration",
	schema: "./src/server/db/schema/index.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: dbUrl,
	},
});
