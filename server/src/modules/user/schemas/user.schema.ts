import { z } from "zod";


export const passwordZodSchema = z.string().min(6, "PASSWORD_TOO_SHORT");
export const userNameZodSchema = z.string().min(1, 'NAME_IS_REQUIRED').max(30, 'NAME_TOO_LONG');

export const updateProfileSchema = z.object({
  name:userNameZodSchema.optional(),
  image: z.string().optional()
});
