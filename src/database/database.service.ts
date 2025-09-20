import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { user } from 'drizzle/schema';
import { db, pool } from 'src/lib/db';
import { env } from 'src/lib/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public readonly client = db;

  constructor() {}

  async onModuleInit() {
    const defaultAdmins = env.DEFAULT_ADMINS;

    await this.client
      .insert(user)
      .values(
        defaultAdmins.map((admin) => {
          return { id: uuidv4(), role: 'admin', ...admin };
        }),
      )
      .onConflictDoNothing({ target: user.id });
  }

  async onModuleDestroy() {
    await pool.end();
  }
}
