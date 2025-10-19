import { EmailQueueService } from './email-queue.service';
export declare class EmailQueueController {
    private readonly emailQueueService;
    constructor(emailQueueService: EmailQueueService);
    enqueueEmails(): Promise<import("./email-queue.schema").QueueEmailSchema[] | undefined>;
}
