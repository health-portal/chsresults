import { cleanEnv, json, str, num, bool } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  AUTO_SEED: bool(),
  BCRYPT_SALT: str(),
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<{ name: string; email: string }[]>(),
  JWT_SECRET: str(),
  PORT: num(),
  FRONTEND_BASE_URL: str(),
  SMTPEXPRESS_PROJECT_ID: str(),
  SMTPEXPRESS_PROJECT_SECRET: str(),
  SMTPEXPRESS_SENDER_EMAIL: str(),
});
