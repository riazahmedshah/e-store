import { passwordZodSchema, userNameZodSchema } from "@/modules/user/schemas/user.schema.js";
import { z } from "zod";

const emailZodSchema = z.email('EMAIL_IS_INVALID');

export const signupSchema = z.object({
  name:userNameZodSchema,
  email: emailZodSchema,
  password: passwordZodSchema
});

export const loginSchema = z.object({
  email: emailZodSchema,
  password: passwordZodSchema
})
