import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'smtpexpress';
import { env } from 'src/environment';
import {
  NotificationTemplate,
  PGMQMessage,
  QueueEmailSchema,
  SendEmailSchema,
} from './email-queue.schema';
import { supabaseDb } from './email-queue.db';
import { sql } from 'drizzle-orm';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);
  private readonly queueName = 'email_queue';
  private readonly failedQueueName = 'failed_queue';
  private readonly maxRetries = 3;
  private readonly emailClient = createClient({
    projectId: env.SMTPEXPRESS_PROJECT_ID,
    projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
  });

  async enqueueEmails(emails: QueueEmailSchema[]) {
    if (!emails.length) {
      this.logger.warn('No emails to enqueue.');
      return;
    }

    // Convert each email to JSON string and wrap for Postgres array
    const jsonMessages = emails.map((email) => JSON.stringify(email));
    const formattedArray = jsonMessages
      .map((m) => `'${m.replace(/'/g, "''")}'::jsonb`)
      .join(',');

    const result = await supabaseDb.execute(
      sql`
        select * from pgmq.send_batch(
          ${this.queueName}::text,
          array[${sql.raw(formattedArray)}]::jsonb[]
        )
      `,
    );

    this.logger.log(`Queued ${emails.length} email(s)`);
    return result;
  }

  // Read 50 messages from the queue and hide it for the next 30 secs
  async readEmails(
    batchSize: number,
  ): Promise<PGMQMessage<QueueEmailSchema>[]> {
    const result = await supabaseDb.execute(
      sql`select * from pgmq.read(${this.queueName}::text, ${batchSize}, 30)`,
    );
    return result.rows as unknown as PGMQMessage<QueueEmailSchema>[];
  }

  // Delete message after successful send
  async deleteMessage(msgId: number) {
    await supabaseDb.execute(
      sql`select pgmq.delete(${this.queueName}::text, ${msgId}::bigint)`,
    );
  }

  // Move to failed queue after max retries
  async pushToFailedQueue(payload: QueueEmailSchema) {
    await supabaseDb.execute(
      sql`select from pgmq.send(${this.failedQueueName}::text, ${JSON.stringify(payload)}::jsonb)`,
    );
  }

  async processQueue() {
    const batchSize = 50; // Number of emails to process in one batch
    let totalProcessed = 0;
    while (true) {
      const queues = await this.readEmails(batchSize);

      if (!queues.length) break; // stop when queue is empty

      let successCount = 0;
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
            await supabaseDb.execute(
              sql`SELECT pgmq.send(${this.queueName}::text, ${JSON.stringify(queue.message)}::jsonb)`,
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
        this.logger.log(
          `Processed ${totalProcessed} emails, ${successCount} sent successfully.`,
        );
      }
    }
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
