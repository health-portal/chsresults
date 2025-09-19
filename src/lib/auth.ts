import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from './environment';
import { createDatabaseClient } from './db';

const db = createDatabaseClient();
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      matricNumber: {
        type: 'string',
        unique: true,
        required: false,
        fieldName: 'matric_number',
      },
      role: {
        type: 'string',
        required: true,
        fieldName: 'role',
      },
    },
  },
});
