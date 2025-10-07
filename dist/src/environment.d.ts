export declare const env: Readonly<{
    AUTO_SEED: boolean;
    BCRYPT_SALT: string;
    DATABASE_URL: string;
    DEFAULT_ADMINS: {
        name: string;
        email: string;
    }[];
    JWT_SECRET: string;
    PORT: number;
    FRONTEND_BASE_URL: string;
    SMTPEXPRESS_PROJECT_ID: string;
    SMTPEXPRESS_PROJECT_SECRET: string;
    SMTPEXPRESS_SENDER_EMAIL: string;
} & import("envalid").CleanedEnvAccessors>;
