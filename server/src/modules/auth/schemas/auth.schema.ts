import { z } from "zod";

const emailZodSchema = z.email('EMAIL_IS_INVALID');
const passwordZodSchema = z.string().min(6, "PASSWORD_TOO_SHORT");

export const signupSchema = z.object({
  name:z.string().min(1, 'NAME_IS_REQUIRED').max(30, 'NAME_TOO_LONG'),
  email: emailZodSchema,
  password: passwordZodSchema
});

export const loginSchema = z.object({
  email: emailZodSchema,
  password: passwordZodSchema
})
