import { SendEmailSchema } from './email.schema';
export declare class EmailService {
    sendMail({ subject, toEmail, htmlContent }: SendEmailSchema): Promise<void>;
}
