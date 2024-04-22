import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) throw new Error("Missing env DATABASE_URL");

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: false,
} satisfies Config;
