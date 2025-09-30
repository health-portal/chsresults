import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SendEmailSchema } from './email-queue.schema';
export declare class EmailQueueService implements OnModuleInit, OnModuleDestroy {
    private readonly queueName;
    private prisma;
    private readonly emailClient;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    createTask(data: SendEmailSchema): Promise<void>;
    processTask(): Promise<void>;
}
