import { asyncHandler } from "@/utils/asyncHandler.js";
import { Request, Response } from "express";
import { variantSchema } from "../validations/product.validation.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { createSku } from "../utils/createSku.js";
import { ResponseHandle } from "@/utils/responseHandler.js";

export const addVariant = asyncHandler(
  async (req:Request, res:Response) => {
    const { productId } = req.params;
    const {data, success, error} = variantSchema.safeParse(req.body);
    if(!success) throw error;

    const product = await Product.findById(productId);
    if(!product) throw new AppError("No product Found", 404);

    const isSizeExist = product.variants.find((variant) => variant.size === data.size);
    if(isSizeExist) throw new AppError("Size already exists, try with different size", 409);

    const dataToUpdate:any = {...data}
    dataToUpdate.sku = createSku(product.title, data.size);

    await Product.updateOne(
      {_id: productId}, 
      {$push:{variants: dataToUpdate}}
    );
    return ResponseHandle.success(res, "Variant Added Successfully!");
  }
)