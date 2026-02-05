import { z } from "zod";


export const categorySchema = z.object({
  name:z.string().min(3, "NAME_IS_TOO_SHORT"),
  section: z.enum(['Men', 'Women', 'Accessories'])
});

export const updateCategorySchema = categorySchema.partial();

