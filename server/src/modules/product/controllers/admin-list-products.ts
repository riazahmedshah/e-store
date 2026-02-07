import { Category } from "@/models/category.model.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { adminPaginationSchema } from "@/validations/pagination.validation.js";
import { Request, Response } from "express";

export const listProductsAdmin = asyncHandler(
  async(req:Request, res:Response) => {
    const { data, error, success } = adminPaginationSchema.safeParse(req.query);
    
    if (!success) throw error;

    const { limit, page, categorySlug } = data;
    let query: any = {}
    if(categorySlug){
       const category = await Category.findOne({slug: categorySlug}).select("_id").lean();
       if(category){
        query.category = category._id;
      }
    }

    const totalProducts = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .select("+variants.stock")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({createdAt: -1})
      .lean()

    const totalPages = Math.ceil(totalProducts/limit);
    const hasNextPage = page < totalPages;

    return ResponseHandle.success(res, null, {
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        hasNextPage
      }
    })
  }
)

export const listProductByIdAdmin = asyncHandler(
  async(req:Request, res:Response) => {
    
    const {productId} = req.params;
    
    const product = await Product.findById(productId)
      .select("+variants.stock")
      .populate("category", "name slug")
      .lean()

    if(!product){
      throw new AppError("Invalid productId or not found", 404);
    }

    return ResponseHandle.success(res, "Product fetched", product);
  }
)
