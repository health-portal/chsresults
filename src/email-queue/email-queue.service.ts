import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'smtpexpress';
import { env } from 'src/environment';
import {
  InitialEmailSchema,
  NotificationTemplate,
  PGMQMessage,
  QueueEmailSchema,
  SendEmailSchema,
} from './email-queue.schema';
import { pgmq, Task } from 'prisma-pgmq';
import { PrismaService } from './prisma.service';

@Injectable()
export class EmailQueueService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(EmailQueueService.name);
  private readonly queueName = 'email_queue';
  private readonly failedQueueName = 'failed_queue';
  private readonly maxRetries = 3;
  private readonly emailClient = createClient({
    projectId: env.SMTPEXPRESS_PROJECT_ID,
    projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
  });

  async enqueueEmails(emails: InitialEmailSchema) {
    this.logger.log(`Checking or creating queue: ${this.queueName}`);
    const recipients = emails.recipients;
    const queues = await pgmq.listQueues(this.prisma);
    const foundQueue = queues.find((q) => q.queue_name === this.queueName);
    if (!foundQueue) {
      await pgmq.createQueue(this.prisma, this.queueName);
    }

    this.logger.log(`Queue ${this.queueName} exists:`, foundQueue);
    if (!recipients || !recipients.length) {
      this.logger.warn('No email recipients to enqueue.');
      return;
    }

    const emailQueueItems: QueueEmailSchema[] = recipients.map((recipient) => ({
      title: emails.title,
      message: emails.message,
      portalLink: emails.portalLink,
      name: recipient.name,
      email: recipient.email,
    }));
    return this.enqueue(emailQueueItems);
  }

  // Enqueue multiple emails
  async enqueue(emails: QueueEmailSchema[]) {
    const result = await pgmq.sendBatch(
      this.prisma,
      this.queueName,
      emails as unknown as Task[],
    );
    this.logger.log(`Queued ${emails.length} email(s)`);
    const safeResult = JSON.parse(
      JSON.stringify(result, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    ) as QueueEmailSchema[];
    return safeResult;
  }

  // Read 50 messages from the queue and hide it for the next 30 secs
  async readEmails(
    batchSize: number,
  ): Promise<PGMQMessage<QueueEmailSchema>[]> {
    const result = await pgmq.readWithPoll(
      this.prisma,
      this.queueName,
      30,
      batchSize,
      10,
      500,
    );
    return result as unknown as PGMQMessage<QueueEmailSchema>[];
  }

  // Delete message after successful send
  async deleteMessage(msgId: number) {
    await pgmq.deleteMessage(this.prisma, this.queueName, msgId);
  }

  // Move to failed queue after max retries
  async pushToFailedQueue(payload: QueueEmailSchema) {
    await pgmq.send(
      this.prisma,
      this.failedQueueName,
      payload as unknown as Task,
    );
  }

  async processQueue() {
    const batchSize = 50; // Number of emails to process in one batch
    let totalProcessed = 0;
    let successCount = 0;
    while (true) {
      const queues = await this.readEmails(batchSize);

      if (!queues.length) break; // stop when queue is empty

      for (const queue of queues) {
        const { title, message, portalLink, email, name } = queue.message;
        totalProcessed++;

        try {
          const notification = NotificationTemplate({
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
        } catch (err) {
          this.logger.error(`Failed to send ${email}`, err);
          // Retry logic
          if (queue.read_ct < this.maxRetries) {
            this.logger.warn(
              `Retrying (${queue.read_ct}/${this.maxRetries}) for ${email}`,
            );
            // Requeue the message for another attempt
            await pgmq.send(
              this.prisma,
              this.queueName,
              queue.message as unknown as Task,
            );
            await this.deleteMessage(queue.msg_id);
          } else {
            await this.pushToFailedQueue(queue.message);
            this.logger.warn(
              `Retried(${queue.read_ct}/${this.maxRetries}) for ${email}`,
            );
          }
          await this.deleteMessage(queue.msg_id);
        }
      }
    }
    this.logger.log(
      `Processed ${totalProcessed} emails, ${successCount} sent successfully.`,
    );
  }

  async send({ subject, toEmail, htmlContent }: SendEmailSchema) {
    await this.emailClient.sendApi.sendMail({
      subject,
      message: htmlContent,
      sender: {
        name: 'Obafemi Awolowo University - College of Health Sciences',
        email: env.SMTPEXPRESS_SENDER_EMAIL,
      },
      recipients: toEmail,
    });
  }
}
