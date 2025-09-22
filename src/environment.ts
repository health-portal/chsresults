import { cleanEnv, json, str, num } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  JWT_SECRET: str(),
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<{ name: string; email: string }[]>(),
  REDIS_HOST: str({ default: "redis" }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASS: str({ default: "" }),
});
