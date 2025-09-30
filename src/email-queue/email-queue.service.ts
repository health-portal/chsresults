import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { pgmq } from 'prisma-pgmq';
import { createClient } from 'smtpexpress';
import { env } from 'src/environment';
import { SendEmailSchema } from './email-queue.schema';

@Injectable()
export class EmailQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly queueName = 'email';
  private prisma: PrismaClient;
  private readonly emailClient = createClient({
    projectId: env.SMTPEXPRESS_PROJECT_ID,
    projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
  });

  async onModuleInit() {
    this.prisma = new PrismaClient();
    await this.prisma.$connect();
    await pgmq.createQueue(this.prisma, this.queueName);
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async createTask(data: SendEmailSchema) {
    await pgmq.send(this.prisma, this.queueName, { data });
    console.log('Created task:', data);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async processTask() {
    const [message] = await pgmq.pop(this.prisma, this.queueName);
    if (message) {
      const { subject, toEmail, htmlContent } =
        message.message as unknown as SendEmailSchema;
      await this.emailClient.sendApi.sendMail({
        subject,
        message: htmlContent,
        sender: {
          name: 'Obafemi Awolowo University - College of Health Sciences',
          email: env.SMTPEXPRESS_SENDER_EMAIL,
        },
        recipients: toEmail,
      });

      console.log(`Popped task:`, message.message);
    }
  }
}
