import z from 'zod';

export type UserRole = 'admin' | 'lecturer' | 'student';

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export const authUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});
export type AuthUserBody = z.infer<typeof authUserSchema>;

export const authStudentSchema = z
  .object({
    email: z.email().optional(),
    matricNumber: z.email().optional(),
    password: z.string(),
  })
  .refine((data) => data.email || data.matricNumber, {
    message: 'Either email or matricNumber must be provided',
  });
export type AuthStudentBody = z.infer<typeof authStudentSchema>;
