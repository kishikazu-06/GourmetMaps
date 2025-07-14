import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '../shared/schema.js';

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL is not set.");
  throw new Error('DATABASE_URL is not set');
}

console.log("DATABASE_URL is set. Attempting to create Pool...");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
console.log("Pool created. Attempting to initialize Drizzle ORM...");

let dbInstance;
try {
  console.log("Attempting to initialize Drizzle ORM...");
  dbInstance = drizzle(pool, { schema });
  console.log("Drizzle ORM initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Drizzle ORM:", error);
  throw error;
}

export const db = dbInstance;