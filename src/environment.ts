import { cleanEnv, json, str, num } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<{ name: string; email: string }[]>(),
  JWT_SECRET: str(),
  PORT: num(),
  SMTPEXPRESS_PROJECT_ID: str(),
  SMTPEXPRESS_PROJECT_SECRET: str(),
  SMTPEXPRESS_SENDER_EMAIL: str(),
});
