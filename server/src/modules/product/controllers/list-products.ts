import { Category } from "@/models/category.model.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { paginationSchema } from "@/validations/pagination.validation.js";
import { Request, Response } from "express";

export const listProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, error, success } = paginationSchema.safeParse(req.query);

    if (!success) throw error;

    const { limit, next, categorySlug, minPrice, maxPrice } = data;
    const query:any = {};

    if(categorySlug){
      const category = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      if(category){
        query.category = category._id;
      }
    }

    if(minPrice !== undefined || maxPrice !== undefined){
      query.price = {};
      if(minPrice !== undefined) query.price.$gte = minPrice;
      if(maxPrice !== undefined) query.price.$gte = maxPrice;
    }

    if(next){
      // next = 1770450358651
      query.createdAt = {$lt: new Date(next)}
    }
    

    const listOfProducts = await Product.find(query)
      .select("title price createdAt")
      .slice("images", 1)
      .sort({createdAt: -1})
      .limit(limit + 1)
      .lean();
    
    if(!listOfProducts) throw new AppError("No products avialable!", 404);

    const hasNextPage = listOfProducts.length > limit;
    const results = hasNextPage ? listOfProducts.slice(0, limit) : listOfProducts;

    const nextCursor = hasNextPage ? results[results.length - 1]!.createdAt : null
    
    return ResponseHandle.success(res, "Products fetched", {
      products: results,
      nextCursor,
      hasNextPage
    });
});


export const listProductsById = asyncHandler(
  async(req:Request, res:Response) => {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("category", "name slug")
      .lean();
    
    if(!product){
      throw new AppError("Invalid productId or not found", 404);
    }

    return ResponseHandle.success(res, "Product fetched", product);
  }
);