export declare const env: Readonly<{
    JWT_SECRET: string;
    DATABASE_URL: string;
    DEFAULT_ADMINS: {
        name: string;
        email: string;
    }[];
    PORT: number;
} & import("envalid").CleanedEnvAccessors>;
