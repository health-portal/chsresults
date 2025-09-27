import { OnModuleDestroy } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
export declare class DatabaseService implements OnModuleDestroy {
    private readonly pool;
    readonly client: NodePgDatabase<typeof schema>;
    onModuleDestroy(): Promise<void>;
}
