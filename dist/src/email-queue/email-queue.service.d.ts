import { PGMQMessage, QueueEmailSchema, SendEmailSchema } from './email-queue.schema';
export declare class EmailQueueService {
    private readonly logger;
    private readonly queueName;
    private readonly failedQueueName;
    private readonly maxRetries;
    private readonly emailClient;
    enqueueEmails(emails: QueueEmailSchema[]): Promise<import("pg").QueryResult<Record<string, unknown>> | undefined>;
    readEmails(batchSize?: number): Promise<PGMQMessage<QueueEmailSchema>[]>;
    deleteMessage(msgId: number): Promise<void>;
    pushToFailedQueue(payload: QueueEmailSchema): Promise<void>;
    processQueue(): Promise<void>;
    send({ subject, toEmail, htmlContent }: SendEmailSchema): Promise<void>;
}
