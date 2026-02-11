import { mongooseIdSchema } from "@/validations/id.validation.js";
import {z} from "zod";

const itemSchema = z.object({
  sku: z.string(),
  quantity: z.coerce.number()
})

export const orderSchema = z.object({
  address: z.string(),
  items: itemSchema.array()
});