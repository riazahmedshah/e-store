import { Document, model, Schema, Types } from "mongoose";

interface SingleCart {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  cart: SingleCart[]
};

const cartSchema = new Schema<ICart>({
  userId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref:'User'
  },
  cart:[{
    productId:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity:{
      type: Number,
      default: 1,
    }
  }]
});

export const Cart = model<ICart>("Cart", cartSchema);