import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  next: z.iso.datetime().optional(),
  categorySlug: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional()
}).refine((data) => {
  if(data.minPrice && data.maxPrice){
    return data.maxPrice >= data.minPrice;
  };
  return true;
},{
  message:"Max price must be greater than min price",
  path: ['maxPrice']
});

export const adminPaginationSchema = z.object({
  page: z.coerce.number().int().nonnegative().default(1),
  limit: z.coerce.number().int().max(100, "LIMIT_CROSS").nonnegative().default(20),
  categorySlug: z.string().optional(),
})