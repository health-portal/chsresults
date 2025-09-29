export declare class SendEmailSchema {
    toEmail: string;
    subject: string;
    htmlContent: string;
}
export declare class ResetPasswordSchema {
    name: string;
    resetLink: string;
}
export declare class InvitationSchema {
    name: string;
    registrationLink: string;
}
export declare class NotificationSchema {
    name: string;
    title: string;
    message: string;
    portalLink: string;
}
export declare const ResetPasswordTemplate: ({ name, resetLink, }: ResetPasswordSchema) => string;
export declare const InvitationTemplate: ({ name, registrationLink, }: InvitationSchema) => string;
export declare const NotificationTemplate: ({ name, title, message, portalLink, }: NotificationSchema) => string;
