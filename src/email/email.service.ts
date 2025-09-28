import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { env } from 'src/environment';
import { SendEmailSchema } from './email.schema';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private resendFromEmail = 'Acme <onboarding@resend.dev>';

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendMail({ subject, toEmail, htmlContent }: SendEmailSchema) {
    try {
      const result = await this.resend.emails.send({
        from: this.resendFromEmail,
        to: toEmail,
        subject,
        html: htmlContent,
      });

      this.logger.log(`Email sent successfully: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }
}
