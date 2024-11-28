import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const db = drizzle(process.env.DATABASE_URL!, { schema });
export default db;
