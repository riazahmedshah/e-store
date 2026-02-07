import { z } from "zod"

export const cartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "INVALID_PRODUCT_ID"),
  quantity: z.coerce.number().int().default(1)
});