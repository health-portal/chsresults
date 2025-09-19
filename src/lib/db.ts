import { Pool } from 'pg';
import { env } from './environment';
import * as schema from '../../drizzle/schema';
import { drizzle } from 'drizzle-orm/node-postgres';

export function createDatabaseClient() {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  return drizzle(pool, { schema });
}
