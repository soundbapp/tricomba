import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Neon Postgres connection string to .env.local.",
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

let cached: Database | null = null;

export function getDb() {
  if (!cached) cached = createDb();
  return cached;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}
