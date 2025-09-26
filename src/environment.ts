import { cleanEnv, json, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  JWT_SECRET: str(),
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<{ name: string; email: string }[]>(),
});
