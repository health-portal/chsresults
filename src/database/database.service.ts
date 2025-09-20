import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from 'drizzle/schema';
import { env } from 'src/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: env.DATABASE_URL });
  public readonly client: NodePgDatabase<typeof schema> = drizzle(this.pool, {
    schema,
  });

  async onModuleInit() {
    const defaultAdmins = env.DEFAULT_ADMINS;

    await this.client
      .insert(schema.admin)
      .values(
        defaultAdmins.map((admin) => ({
          id: uuidv4(),
          role: 'admin',
          ...admin,
        })),
      )
      .onConflictDoNothing({ target: schema.admin.email });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
