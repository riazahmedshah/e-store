import { asyncHandler } from "@/utils/asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import { Order } from "@/models/order.model.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { orderSchema } from "../validations/order.validation.js";
import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import mongoose from "mongoose";

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id
  const { success, data, error } = orderSchema.safeParse(req.body);
  if (!success) throw error;

  const { items, address } = data;
  
  const itemsMap = new Map();
  for (const item of items){
    const currentQty = itemsMap.get(item.sku) || 0;
    itemsMap.set(item.sku, currentQty + item.quantity);
  }
  
  
  const skus = [...new Set(items.map(item => item.sku))]
  
  const products = await Product.find({ "variants.sku": { $in: skus } })
  .select("title price variants.stock variants.sku")
  .slice("images", 1)
  .lean();
  
  const stockMap = new Map();
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      stockMap.set(variant.sku, { title: product.title, productId: product._id,stock: variant.stock, image: product.images[0],price: product.price });
    });
  });

  const orderItems = [];
  let totalAmount = 0;

  for (const [sku, totalRequestedQty] of itemsMap) {
    const productData = stockMap.get(sku);
    if (!productData)
      throw new AppError(`Product ${sku} does not exists`, 404);
    const { stock, price } = productData;
    if (stock < totalRequestedQty) {
      throw new AppError("Insufficient stock available for this size", 422);
    }
    orderItems.push({
      productId: productData.productId,
      sku: sku,
      title: productData.title,
      price,
      quantity: totalRequestedQty,
      image: productData.image
    });
    totalAmount += price * totalRequestedQty;
  }

  const order = new Order({
    userId,
    totalAmount,
    address,
    items: orderItems
  });
  await order.save();

  return ResponseHandle.success(res, "Order created successfully", order);
});

export const confirmOrder = async(req:Request, res:Response, next:NextFunction) => {
  const orderId = req.params.orderId;
  const userId = req.user?._id
  const mongooseTransaction = await mongoose.startSession();
  try {
    mongooseTransaction.startTransaction();

    const order = await Order.findOne({_id: orderId, userId}).lean().session(mongooseTransaction);
    if(!order) throw new AppError("Order not found", 404);

    // payment Service(later).

    const orderedProducts = order.items.map((item) => item);

    for (const item of orderedProducts){
      const result = await Product.updateOne({
        _id: item.productId,
        "variants.sku": item.sku,
        "variants.stock": {$gte: item.quantity}
      },{
        $inc: {"variants.$.stock": -item.quantity}
      }, {
        session: mongooseTransaction
      });
      if(result.matchedCount === 0) throw new AppError(`Stock check failed for ${item.title}`, 422)
    }

    await Order.findOneAndUpdate({_id: orderId}, {status: 'CONFIRMED'}, {session: mongooseTransaction});
    await mongooseTransaction.commitTransaction()
    return ResponseHandle.success(res, "Order is confirmed", 200);
    
  } catch (error) {
    await mongooseTransaction.abortTransaction();
    next(error)
  } finally {
    await mongooseTransaction.endSession();
  }

}