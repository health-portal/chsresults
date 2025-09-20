import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from './environment';
import { db } from './db';
import { bearer, openAPI } from 'better-auth/plugins';

export function createAuth() {
  return betterAuth({
    database: drizzleAdapter(db, { provider: 'pg' }),
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      disableSignUp: true,
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
    plugins: [bearer(), openAPI()],
  });
}

// Uncomment to migrate to database
export const auth = createAuth();
