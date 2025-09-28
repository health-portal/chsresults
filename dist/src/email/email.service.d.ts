import { SendEmailSchema } from './email.schema';
export declare class EmailService {
    private readonly resend;
    private readonly logger;
    private resendFromEmail;
    constructor();
    sendMail({ subject, toEmail, htmlContent }: SendEmailSchema): Promise<void>;
}
