import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../drizzle/schema';
import { env } from './environment';

export const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
