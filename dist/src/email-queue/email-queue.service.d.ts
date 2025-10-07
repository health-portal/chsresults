import { SendEmailSchema } from './email-queue.schema';
export declare class EmailQueueService {
    private readonly emailClient;
    send({ subject, toEmail, htmlContent }: SendEmailSchema): Promise<void>;
}
