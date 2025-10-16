import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.MESSAGE_QUEUE_DATABASE_URL,
});

export const supabaseDb = drizzle(pool);
