import { cleanEnv, str, json, url, port } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  CLOUDFLARE_R2_ACCESS_KEY_ID: str(),
  CLOUDFLARE_R2_ACCOUNT_ID: str(),
  CLOUDFLARE_R2_BUCKET: str(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: str(),
  CLOUDFLARE_R2_TOKEN: str(),
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<{ name: string; email: string }[]>(),
  FRONTEND_BASE_URL: url(),
  JWT_SECRET: str(),
  PORT: port(),
  SMTPEXPRESS_PROJECT_ID: str(),
  SMTPEXPRESS_PROJECT_SECRET: str(),
  SMTPEXPRESS_SENDER_EMAIL: str(),
});
