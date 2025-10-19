export declare class SendEmailSchema {
    toEmail: string;
    subject: string;
    htmlContent: string;
}
export declare class ResetPasswordSchema {
    name: string;
    otp: string;
}
export declare class InvitationSchema {
    name: string;
    registrationLink: string;
}
declare class Recipient {
    name: string;
    email: string;
}
export declare class InitialEmailSchema {
    title: string;
    message: string;
    portalLink: string;
    recipients: Recipient[];
}
export declare class QueueEmailSchema {
    title: string;
    message: string;
    portalLink: string;
    name: string;
    email: string;
}
export interface PGMQMessage<T = unknown> {
    msg_id: number;
    read_ct: number;
    vt: string;
    enqueued_at: string;
    message: T;
}
export declare class NotificationSchema {
    name: string;
    title: string;
    message: string;
    portalLink: string;
}
export declare const ResetPasswordTemplate: ({ name, otp }: ResetPasswordSchema) => string;
export declare const InvitationTemplate: ({ name, registrationLink, }: InvitationSchema) => string;
export declare const NotificationTemplate: ({ name, title, message, portalLink, }: NotificationSchema) => string;
export {};
