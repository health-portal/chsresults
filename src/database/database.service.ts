import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from 'src/environment';
import * as schema from '../../drizzle/schema';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;
  public client: NodePgDatabase<typeof schema>;

  constructor() {
    this.pool = new Pool({
      connectionString: env.DATABASE_URL,
    });

    this.client = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
