import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from './environment';
import { db } from './db';
import { bearer, magicLink, openAPI } from 'better-auth/plugins';
import z from 'zod';
import { eq } from 'drizzle-orm';
import { user } from 'drizzle/schema';

export function createAuth() {
  return betterAuth({
    database: drizzleAdapter(db, { provider: 'pg' }),
    secret: env.BETTER_AUTH_SECRET,
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
    plugins: [
      bearer(),
      openAPI(),
      magicLink({
        disableSignUp: false,
        sendMagicLink: async ({ email, token, url }) => {
          let recipientEmail = email;
          const result = z.email().safeParse(email);

          if (!result.success) {
            const foundUser = await db.query.user.findFirst({
              where: eq(user.matricNumber, email),
            });

            if (!foundUser?.email) {
              throw new Error('No account found');
            }

            recipientEmail = foundUser.email;
          }

          console.log(`Sending ${url}?token=${token} to ${recipientEmail}`);
        },
      }),
    ],
  });
}

// Uncomment to migrate to database
export const auth = createAuth();
