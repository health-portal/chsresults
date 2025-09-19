import { cleanEnv, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  BETTER_AUTH_SECRET: str(),
  BETTER_AUTH_URL: str(),
  DATABASE_URL: str(),
});
