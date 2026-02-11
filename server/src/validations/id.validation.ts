import { z } from "zod";

export const mongooseIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "INVALID_OBJECT_ID");
