import { cleanEnv, json, str, num } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<{ name: string; email: string }[]>(),
  FRONTEND_BASE_URL: str(),
  JWT_SECRET: str(),
  PORT: num(),
  
});
