import { Injectable } from '@nestjs/common';
import { SendEmailSchema } from './email.schema';

@Injectable()
export class EmailService {
  async sendMail({ subject, toEmail, htmlContent }: SendEmailSchema) {}
}
