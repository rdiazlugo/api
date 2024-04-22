import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
export * as schema from "./schema";

if (!process.env.DATABASE_URL) throw new Error("Missing env DATABASE_URL");

const CONNECTION_URL = process.env.DATABASE_URL;

const sql = postgres(CONNECTION_URL, { max: 1 });
export const dbConnection = drizzle(sql);

export const runMigrations = async () => {
  try {
    const migrationClient = postgres(CONNECTION_URL, { max: 1 });
    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./db/migrations",
    });
    await migrationClient.end();
  } catch (error) {
    console.error("Error running migrations", error);
  }
};
