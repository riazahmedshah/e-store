import { z } from "zod"

const categoryIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "INVALID_OBJECT_ID");

export const variantSchema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
  stock: z.coerce.number().int().nonnegative("STOCK_CANNOT_BE_NEGATIVE"),
  price: z.coerce.number().positive("PRICE_MUST_BE_GREATER_THAN_0")
});

const updateVariantSchema = variantSchema.omit({'stock' : true}).partial();

export const createProductSchema = z.object({
  title: z.string().min(3,"TITLE_TOO_SHORT").max(50, "TITLE_TOO_LONG"),
  description: z.string().min(1, "DESCRIPTION_NOT_PROVIDED").max(500, "DESCRIPTION_TOO_LONG"),
  category: categoryIdSchema,
  gender: z.enum(["Men", "Women"]),
  keywords: z.string().array().nonempty("AT_LEAST_ONE_KEYWORD_REQUIRED"),
  images: z.string().array().optional(),
  variants: variantSchema.array().nonempty()
});

const baseUpdateSchema = createProductSchema.omit({images: true}).partial();

export const updateProductSchema = baseUpdateSchema.extend({
  variants: updateVariantSchema.array().nonempty().optional()
});

export const stockUpdateSchema = z.object({
  updates: z.array(z.object({
    size: z.enum(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
    newStock: z.coerce.number().int().nonnegative("STOCK_CANNOT_BE_NEGATIVE")
  })).min(1, "PROVIDE_AT_LEAST_ONE_UPDATE")
});
