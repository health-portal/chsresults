import { Pool } from 'pg';
export declare const supabaseDb: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: Pool;
};
