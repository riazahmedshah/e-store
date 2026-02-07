import { Cart } from "@/models/cart.model.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { Request, Response } from "express";
import { cartSchema } from "./validations/cart.validation.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { Types } from "mongoose";

// for Authorised Users...
export const addToCart = asyncHandler(
  async(req:Request, res:Response) => {
    const userId = req.user?._id;
    const {data, error, success} = cartSchema.safeParse(req.body);
    if(!success) throw error;

    const isProductExist = await Product.findById(data.productId);
    if(!isProductExist) throw new AppError("Product Does not exists", 404);

    const cart = await Cart.findOneAndUpdate(
      {
        userId,
        "cart.productId": data.productId
      },
      { $inc:{"cart.$.quantity": data.quantity}},
      { new: true}
    );

    if(!cart){
      await Cart.findOneAndUpdate(
        {userId},
        { $push:{
          cart:{
            productId: data.productId,
            quantity: data.quantity
          }
        }},
        {upsert: true, new:true}
      )
    }
    return ResponseHandle.success(res, "Cart updated successfully!");
  }
);

export const getCartItems = asyncHandler(
  async(req:Request, res:Response) => {
    const userId = req.user?._id;

    const cart = await Cart.findOne({userId});
    if(!cart) throw new AppError("Not items in cart", 404);

    return ResponseHandle.success(res, "Items Fetched", cart);
  }
)