import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from 'src/environment';

@Injectable()
export class DatabaseService {
  client: NodePgDatabase;

  constructor() {
    this.client = drizzle(env.DATABASE_URL);
  }
}
