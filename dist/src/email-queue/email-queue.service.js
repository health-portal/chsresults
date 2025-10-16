"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const common_1 = require("@nestjs/common");
const smtpexpress_1 = require("smtpexpress");
const environment_1 = require("../environment");
const email_queue_schema_1 = require("./email-queue.schema");
const email_queue_db_1 = require("./email-queue.db");
const drizzle_orm_1 = require("drizzle-orm");
let EmailQueueService = EmailQueueService_1 = class EmailQueueService {
    logger = new common_1.Logger(EmailQueueService_1.name);
    queueName = 'email_queue';
    failedQueueName = 'failed_queue';
    maxRetries = 5;
    emailClient = (0, smtpexpress_1.createClient)({
        projectId: environment_1.env.SMTPEXPRESS_PROJECT_ID,
        projectSecret: environment_1.env.SMTPEXPRESS_PROJECT_SECRET,
    });
    async enqueueEmails(emails) {
        if (!emails.length) {
            this.logger.warn('No emails to enqueue.');
            return;
        }
        const jsonMessages = emails.map((email) => JSON.stringify(email));
        const formattedArray = jsonMessages
            .map((m) => `'${m.replace(/'/g, "''")}'::jsonb`)
            .join(',');
        const result = await email_queue_db_1.supabaseDb.execute((0, drizzle_orm_1.sql) `
        select * from pgmq.send_batch(
          ${this.queueName}::text,
          array[${drizzle_orm_1.sql.raw(formattedArray)}]::jsonb[]
        )
      `);
        this.logger.log(`Queued ${emails.length} email(s)`);
        return result;
    }
    async readEmails(batchSize = 10) {
        const result = await email_queue_db_1.supabaseDb.execute((0, drizzle_orm_1.sql) `select * from pgmq.read(${this.queueName}::text, ${batchSize}, 30)`);
        return result.rows;
    }
    async deleteMessage(msgId) {
        await email_queue_db_1.supabaseDb.execute((0, drizzle_orm_1.sql) `select pgmq.delete(${this.queueName}::text, ${msgId}::bigint)`);
    }
    async pushToFailedQueue(payload) {
        await email_queue_db_1.supabaseDb.execute((0, drizzle_orm_1.sql) `select from pgmq.send(${this.failedQueueName}::text, ${JSON.stringify(payload)}::jsonb)`);
    }
    async processQueue() {
        const queues = await this.readEmails(20);
        for (const queue of queues) {
            const { title, message, portalLink, email, name } = queue.message;
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
            }
            catch (err) {
                this.logger.error(`Failed to send ${email}`, err);
                if (queue.read_ct < this.maxRetries) {
                    this.logger.warn(`Retrying (${queue.read_ct}/${this.maxRetries}) for ${email}`);
                    await email_queue_db_1.supabaseDb.execute((0, drizzle_orm_1.sql) `SELECT pgmq.send(${this.queueName}::text, ${JSON.stringify(queue.message)}::jsonb)`);
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
    async send({ subject, toEmail, htmlContent }) {
        this.logger.log(`Sending email to ${toEmail}`);
        this.logger.log(`Subject: ${subject}`);
        this.logger.log(`Subject: ${toEmail}`);
        this.logger.log(`Subject: ${htmlContent}`);
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
    (0, common_1.Injectable)()
], EmailQueueService);
//# sourceMappingURL=email-queue.service.js.map