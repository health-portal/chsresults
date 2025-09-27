import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from 'drizzle/schema';
import { env } from 'src/environment';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: env.DATABASE_URL });
  public readonly client: NodePgDatabase<typeof schema> = drizzle(this.pool, {
    schema,
  });

  async onModuleDestroy() {
    await this.pool.end();
  }
}
