import { z } from "zod";

export const photoSchema = z.object({
  mimetype: z.string().refine((mimetype) => {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimetype);
  }, 'IMAGE_TYPE_NOT_SUPPORTED'),
  size: z.number().max(1024*1024*2, 'SIZE_IS_TOO_LARGE')
});

export const gallerySchema = z.array(photoSchema).max(4, "MAX_4_IMAGES_ALLOWED");