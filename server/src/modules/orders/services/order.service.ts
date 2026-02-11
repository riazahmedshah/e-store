import { Product } from "@/models/product.model.js";
import { AppError } from "@/utils/appError.js";
import { Types } from "mongoose";

export class OrderService{
  static async checkStock(sku:string, quantity:number){
    
    const product = await Product.findOne(
      {"variants.sku" : sku},
      {title: 1, price: 1, images: 1,"variants.$": 1}
    );

    if(!product || !product.variants[0] || product.variants[0]?.stock < quantity) return null;
    // console.log(product);
    // const variant = product.variants[0];
    // if(!variant || variant?.stock < quantity){
    //   return false;
    // }
    return product;
  }
    
    // await Product.findOneAndUpdate(
    //   {_id: productId, "variants.$.size" : size},
    //   {$inc: {"variants.$.stock": -1}}
    // );
}