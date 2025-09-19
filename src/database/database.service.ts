import { Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { createDatabaseClient } from 'src/lib/db';

@Injectable()
export class DatabaseService {
  private client: NodePgDatabase<typeof schema>;
  constructor() {
    this.client = createDatabaseClient();
  }
}
