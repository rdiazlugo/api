import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("Missing env DATABASE_URL");

const queryClient = postgres(process.env.DATABASE_URL);
export const dbConnection = drizzle(queryClient);
