import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from 'src/environment';

export default defineConfig({
  out: './drizzle/output',
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
});
