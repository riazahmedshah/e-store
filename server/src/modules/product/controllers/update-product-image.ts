import { Product } from "@/models/product.model.js";
import { UploadService } from "@/services/upload.service.js";
import { AppError } from "@/utils/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { photoSchema } from "@/validations/image.validation.js";
import { Request, Response } from "express";

export const updateProductImage = asyncHandler(
  async(req:Request, res:Response) => {
    const { productId } = req.params;
    const productPhoto = req.file as Express.Multer.File;
    const { oldImgKey } = req.body;

    const {success, error} = photoSchema.safeParse(productPhoto);
    if(!success) throw error;
    const existingProduct = await Product.findById(productId).lean();
    if(!existingProduct) throw new AppError("Product not found", 404);

    const key = await UploadService.updateProductImage(oldImgKey, existingProduct._id.toString(), productPhoto.buffer);

    await Product.updateOne(
      {_id: productId, images: oldImgKey},
      {$set: {"images.$": key}}
    );

    return ResponseHandle.success(res, "Image updated successfully");
  }
)