/* ============================================
   DB CONNECTION — Drizzle + postgres.js
   ============================================ */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;

// postgres.js client
const queryClient = postgres(connectionString);

// Drizzle instance with schema for relational queries
export const db = drizzle(queryClient, { schema });

export { queryClient };
