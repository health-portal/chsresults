import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { db, pool } from 'src/lib/db';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public readonly client = db;

  constructor() {}

  async onModuleDestroy() {
    await pool.end();
  }
}
