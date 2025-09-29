import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { pgmq } from 'prisma-pgmq';
import { createClient } from 'smtpexpress';
import { env } from 'src/environment';
import { SendEmailSchema } from './email-queue.schema';

@Injectable()
export class EmailQueueService extends PrismaClient implements OnModuleInit {
  private readonly queueName = 'email';
  private readonly emailClient = createClient({
    projectId: env.SMTPEXPRESS_PROJECT_ID,
    projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
  });

  async onModuleInit() {
    await pgmq.createQueue(this, this.queueName);
    console.log('Message queue initialised');
  }

  async createTask(data: SendEmailSchema) {
    await pgmq.send(this, this.queueName, { data });
    console.log('Created task:', JSON.stringify(data));
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async processTask() {
    const [message] = await pgmq.pop(this, this.queueName);
    console.log('Popped task:', JSON.stringify(message));
    // const { subject, toEmail, htmlContent } =
    //   message.message as SendEmailSchema;
    // await this.emailClient.sendApi.sendMail({
    //   subject,
    //   message: htmlContent,
    //   sender: {
    //     name: 'Obafemi Awolowo University - College of Health Sciences',
    //     email: env.SMTPEXPRESS_SENDER_EMAIL,
    //   },
    //   recipients: toEmail,
    // });
  }
}
