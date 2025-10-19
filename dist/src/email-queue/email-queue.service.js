"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const common_1 = require("@nestjs/common");
const smtpexpress_1 = require("smtpexpress");
const environment_1 = require("../environment");
const email_queue_schema_1 = require("./email-queue.schema");
const prisma_pgmq_1 = require("prisma-pgmq");
const prisma_service_1 = require("./prisma.service");
let EmailQueueService = EmailQueueService_1 = class EmailQueueService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    logger = new common_1.Logger(EmailQueueService_1.name);
    queueName = 'email_queue';
    failedQueueName = 'failed_queue';
    maxRetries = 3;
    emailClient = (0, smtpexpress_1.createClient)({
        projectId: environment_1.env.SMTPEXPRESS_PROJECT_ID,
        projectSecret: environment_1.env.SMTPEXPRESS_PROJECT_SECRET,
    });
    async enqueueEmails(emails) {
        this.logger.log(`Checking or creating queue: ${this.queueName}`);
        const recipients = emails.recipients;
        try {
            const queues = await prisma_pgmq_1.pgmq.listQueues(this.prisma);
            const foundQueue = queues.find((q) => q.queue_name === this.queueName);
            console.log(queues, foundQueue);
            if (foundQueue) {
                console.log(`Queue ${this.queueName} exists:`, foundQueue);
            }
            else {
                await prisma_pgmq_1.pgmq.createQueue(this.prisma, this.queueName);
            }
        }
        catch (error) {
            if (error instanceof Error &&
                String(error.message).includes('already exists')) {
                this.logger.log(`Queue "${this.queueName}" already exists.`);
            }
            else {
                this.logger.error(`Failed to initialize queue: ${String(error)}`);
            }
        }
        if (!recipients || !recipients.length) {
            this.logger.warn('No email recipients to enqueue.');
            return;
        }
        const emailQueueItems = recipients.map((recipient) => ({
            title: emails.title,
            message: emails.message,
            portalLink: emails.portalLink,
            name: recipient.name,
            email: recipient.email,
        }));
        return this.enqueue(emailQueueItems);
    }
    async enqueue(emails) {
        const result = await prisma_pgmq_1.pgmq.sendBatch(this.prisma, this.queueName, emails);
        this.logger.log(`Queued ${emails.length} email(s)`);
        const safeResult = JSON.parse(JSON.stringify(result, (_, value) => typeof value === 'bigint' ? value.toString() : value));
        return safeResult;
    }
    async readEmails(batchSize) {
        const result = await prisma_pgmq_1.pgmq.readWithPoll(this.prisma, this.queueName, 30, batchSize, 10, 500);
        return result;
    }
    async deleteMessage(msgId) {
        await prisma_pgmq_1.pgmq.deleteMessage(this.prisma, this.queueName, msgId);
    }
    async pushToFailedQueue(payload) {
        await prisma_pgmq_1.pgmq.send(this.prisma, this.failedQueueName, payload);
    }
    async processQueue() {
        const batchSize = 50;
        let totalProcessed = 0;
        let successCount = 0;
        while (true) {
            const queues = await this.readEmails(batchSize);
            if (!queues.length)
                break;
            for (const queue of queues) {
                const { title, message, portalLink, email, name } = queue.message;
                totalProcessed++;
                try {
                    const notification = (0, email_queue_schema_1.NotificationTemplate)({
                        name: name,
                        title,
                        message,
                        portalLink,
                    });
                    await this.send({
                        subject: title,
                        toEmail: email,
                        htmlContent: notification,
                    });
                    this.logger.log(` Sent email to ${email}`);
                    await this.deleteMessage(queue.msg_id);
                    successCount++;
                }
                catch (err) {
                    this.logger.error(`Failed to send ${email}`, err);
                    if (queue.read_ct < this.maxRetries) {
                        this.logger.warn(`Retrying (${queue.read_ct}/${this.maxRetries}) for ${email}`);
                        await prisma_pgmq_1.pgmq.send(this.prisma, this.queueName, queue.message);
                        await this.deleteMessage(queue.msg_id);
                    }
                    else {
                        await this.pushToFailedQueue(queue.message);
                        this.logger.warn(`Retried(${queue.read_ct}/${this.maxRetries}) for ${email}`);
                    }
                    await this.deleteMessage(queue.msg_id);
                }
            }
        }
        this.logger.log(`Processed ${totalProcessed} emails, ${successCount} sent successfully.`);
    }
    async send({ subject, toEmail, htmlContent }) {
        await this.emailClient.sendApi.sendMail({
            subject,
            message: htmlContent,
            sender: {
                name: 'Obafemi Awolowo University - College of Health Sciences',
                email: environment_1.env.SMTPEXPRESS_SENDER_EMAIL,
            },
            recipients: toEmail,
        });
    }
};
exports.EmailQueueService = EmailQueueService;
exports.EmailQueueService = EmailQueueService = EmailQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailQueueService);
//# sourceMappingURL=email-queue.service.js.map