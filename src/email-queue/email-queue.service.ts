import { Injectable } from '@nestjs/common';
import { createClient } from 'smtpexpress';
import { env } from 'src/environment';
import { SendEmailSchema } from './email-queue.schema';

@Injectable()
export class EmailQueueService {
  private readonly emailClient = createClient({
    projectId: env.SMTPEXPRESS_PROJECT_ID,
    projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
  });

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
