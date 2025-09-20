import { cleanEnv, json, str } from 'envalid';
import * as dotenv from 'dotenv';
import { Admin } from 'src/auth/auth.schema';

dotenv.config();

export const env = cleanEnv(process.env, {
  BETTER_AUTH_SECRET: str(),
  BETTER_AUTH_URL: str(),
  DATABASE_URL: str(),
  DEFAULT_ADMINS: json<Admin[]>(),
});
