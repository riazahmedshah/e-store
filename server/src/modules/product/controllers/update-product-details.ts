import { asyncHandler } from "@/utils/asyncHandler.js";
import { Request, Response } from "express";
import { updateProductSchema } from "../validations/product.validation.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { toLowercase } from "../utils/toLowerCase.js";
import { createSku } from "../utils/createSku.js";
import { ResponseHandle } from "@/utils/responseHandler.js";

export const updateProductDetails = asyncHandler(
  async(req:Request, res:Response) => {
    const { productId }= req.params;
    const {success, data, error} = updateProductSchema.safeParse(req.body);
    if(!success) throw error;

    const existingProduct = await Product.findById(productId).select('+variants.stock').lean();
    if(!existingProduct) throw new AppError("Product not found to update",404);
    // console.log(existingProduct);

    if(data.keywords){
      data.keywords = toLowercase(data.keywords);
    };

    const newTitle = data.title ?? existingProduct.title;

    let finalVariants:any = existingProduct.variants;
    if(data.variants){

      const incomingSizes = data.variants.map(v => v.size);
      const hasDuplicates = new Set(incomingSizes).size !== incomingSizes.length;
      if (hasDuplicates) {
        throw new AppError("Duplicate sizes found in update request", 400);
      }

      finalVariants = existingProduct.variants.map((existing) => {
        // console.log(existing);
        const update = data.variants?.find((v) => v.size === existing.size);
        if (update) {
          return {
            ...existing,        
            ...update,           
            stock: existing.stock, 
            sku: existing.sku && data.title === undefined 
                 ? existing.sku : createSku(newTitle, update.size!)
          };
        }
        return existing;
      });
    }

    const dataToUpdate = {
      ...data,
      title: newTitle,
      variants: finalVariants
    };
    await Product.updateOne({_id: productId}, {$set: dataToUpdate});

    return ResponseHandle.success(res, "Product details updated successfully!");
  }
)