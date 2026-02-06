import { asyncHandler } from "@/utils/asyncHandler.js";
import { Request, Response } from "express";
import { stockUpdateSchema } from "../validations/product.validation.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { ResponseHandle } from "@/utils/responseHandler.js";

export const updateStock = asyncHandler(
  async(req:Request, res:Response) => {
    const { productId } = req.params;
    const {data, error, success} = stockUpdateSchema.safeParse(req.body);
    if(!success) throw error;

    const bulkOps = data.updates.map((update) => ({
      updateOne: {
        filter: {_id: productId, "variants.size": update.size},
        update: {$set: {"variants.$.stock": update.newStock}}
      }
    }));

    const result = await Product.bulkWrite(bulkOps);
    if (result.matchedCount === 0) {
      throw new AppError("Product or sizes not found", 404);
    }

    return ResponseHandle.success(res, "Inventory updated successfully!");
  }
)