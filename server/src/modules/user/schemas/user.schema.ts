import { z } from "zod";


export const passwordZodSchema = z.string().min(6, "PASSWORD_TOO_SHORT");
export const userNameZodSchema = z.string().min(1, 'NAME_IS_REQUIRED').max(30, 'NAME_TOO_LONG');

export const updateProfileSchema = z.object({
  name:userNameZodSchema.optional(),
  image: z.string().optional()
});

export const profilePhotoSchema = z.object({
  mimetype: z.string().refine((mimetype) => {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimetype);
  }, 'IMAGE_TYPE_NOT_SUPPORTED'),
  size: z.number().max(1024*1024*2, 'SIZE_IS_TOO_LARGE')
});
