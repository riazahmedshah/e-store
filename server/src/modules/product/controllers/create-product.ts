import { NextFunction, Request, Response } from "express";
import { createProductSchema } from "../validations/product.validation.js";
import { AppError } from "@/utils/appError.js";
import mongoose, { Types } from "mongoose";
import { UploadService } from "@/services/upload.service.js";
import { Category } from "@/models/category.model.js";
import { Product } from "@/models/product.model.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { toLowercase } from "../utils/toLowerCase.js";
import { createSku } from "../utils/createSku.js";
import { StorageService } from "@/services/storage/storageService.js";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productsPhoto = req.files as Express.Multer.File[];
  const session = await mongoose.startSession();
  const productId = new Types.ObjectId();
  let images:string[] = [];
  try {
    session.startTransaction();
    const { success, data, error } = createProductSchema.safeParse(req.body);
    if (!success) throw error;
  
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) throw new AppError("Category not found", 404);
  
    // const data = {...data};
    if (!productsPhoto || productsPhoto?.length === 0)
      throw new AppError("Product images not provided...", 400);
  
    const images = await UploadService.uploadImageArray(
      productId.toString(),
      productsPhoto,
    );
  
    const keywords = toLowercase(data.keywords);
    const variantsWithSku = data.variants.map((variant) => ({
      ...variant,
      sku: createSku(data.title, variant.size),
    }));
  
    const product = new Product({
      ...data,
      _id: productId,
      images,
      variants: variantsWithSku,
      keywords,
    });
    await product.save();
    await session.commitTransaction();
    return ResponseHandle.success(res, "Product added!", product);
  } catch (error) {
    await session.abortTransaction();
    if (images.length > 0) {
      StorageService.deleteFile(`products/${productId}`).catch(console.error);
    }
    next(error)
  } finally{
    session.endSession();
  }
};
