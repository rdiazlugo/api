import {
  getDbConnection,
  runMigrations as migrationsRunner,
} from "@rdiazlugo/db-schema";

if (!process.env.DATABASE_URL) throw new Error("Missing env DATABASE_URL");
const CONNECTION_URL = process.env.DATABASE_URL;

export const db = getDbConnection(CONNECTION_URL);

export const runMigrations = async () => migrationsRunner(CONNECTION_URL);
