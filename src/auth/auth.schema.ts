import z from 'zod';

export const signinStudentSchema = z
  .object({
    email: z.email(),
    matricNumber: z.string(),
    password: z.string(),
  })
  .refine(
    (data) => {
      return !!data.matricNumber || !!data.email;
    },
    {
      message: 'Either matricNumber or email must be provided.',
      path: ['username'],
    },
  );

export type SigninStudentBody = z.infer<typeof signinStudentSchema>;

export type Admin = {
  name: string;
  email: string;
};
