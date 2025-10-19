import { InitialEmailSchema, PGMQMessage, QueueEmailSchema, SendEmailSchema } from './email-queue.schema';
import { PrismaService } from './prisma.service';
export declare class EmailQueueService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly logger;
    private readonly queueName;
    private readonly failedQueueName;
    private readonly maxRetries;
    private readonly emailClient;
    enqueueEmails(emails: InitialEmailSchema): Promise<QueueEmailSchema[] | undefined>;
    enqueue(emails: QueueEmailSchema[]): Promise<QueueEmailSchema[]>;
    readEmails(batchSize: number): Promise<PGMQMessage<QueueEmailSchema>[]>;
    deleteMessage(msgId: number): Promise<void>;
    pushToFailedQueue(payload: QueueEmailSchema): Promise<void>;
    processQueue(): Promise<void>;
    send({ subject, toEmail, htmlContent }: SendEmailSchema): Promise<void>;
}
