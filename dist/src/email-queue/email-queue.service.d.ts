import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SendEmailSchema } from './email-queue.schema';
export declare class EmailQueueService extends PrismaClient implements OnModuleInit {
    private readonly queueName;
    private readonly emailClient;
    onModuleInit(): Promise<void>;
    createTask(data: SendEmailSchema): Promise<void>;
    processTask(): Promise<void>;
}
