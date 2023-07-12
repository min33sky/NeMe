import { z } from 'zod';

export const RegisterValidator = z.object({
  email: z.string().email({
    message: '올바른 이메일 형식이 아닙니다.',
  }),
  password: z
    .string()
    .min(6, {
      message: '패스워드는 최소 6자 이상이어야 합니다.',
    })
    .max(16, {
      message: '패스워드는 최대 16자 이하여야 합니다.',
    }),
  name: z
    .string()
    .min(2, {
      message: '닉네임은 최소 2자 이상이어야 합니다.',
    })
    .max(10, {
      message: '닉네임은 최대 10자 이하여야 합니다.',
    }),
});

export const LoginValidator = RegisterValidator.omit({ name: true });

export type RegisterRequest = z.infer<typeof RegisterValidator>;
export type LoginRequest = z.infer<typeof LoginValidator>;
