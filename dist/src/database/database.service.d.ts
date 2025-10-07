import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { JwtService } from '@nestjs/jwt';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly emailQueueService;
    private readonly jwtService;
    constructor(emailQueueService: EmailQueueService, jwtService: JwtService);
    private readonly pool;
    readonly client: NodePgDatabase<typeof schema>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private generateToken;
    seed(): Promise<void>;
}
