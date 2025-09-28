export declare const env: Readonly<{
    DATABASE_URL: string;
    DEFAULT_ADMINS: {
        name: string;
        email: string;
    }[];
    JWT_SECRET: string;
    PORT: number;
    RESEND_API_KEY: string;
} & import("envalid").CleanedEnvAccessors>;
