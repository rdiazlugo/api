import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
export * as schema from "./schema";

if (!process.env.DATABASE_URL) throw new Error("Missing env DATABASE_URL");

const queryClient = postgres(process.env.DATABASE_URL);
export const dbConnection = drizzle(queryClient);

export const runMigrations = async () => {
  migrate(dbConnection, { migrationsFolder: "./db/migrations" });
};
