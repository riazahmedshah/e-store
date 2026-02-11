import { Document, model, Schema, Types } from "mongoose";

export interface IItems{
  productId: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image:string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IItems[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId:{
    type:Schema.Types.ObjectId,
    required:true,
  },
  items:[{
    productId: {
      type: Schema.Types.ObjectId,
      required:true
    },
    title:{
      type:String,
      required:true
    },
    price:{
      type:Number,
      required:true
    },
    quantity:{
      type:Number,
      required:true
    },
    image:{
      type:String,
      required:true
    }
  }],
  totalAmount:{
    type: Number,
    required:true
  },
  status:{
    type:String,
    enum:["PENDING", "CONFIRMED", "CANCELLED"],
    default: 'PENDING'
  },
  address:{
    type: String,
    required: true
  }
},{
  timestamps: true,
  versionKey: false
});

export const Order = model<IOrder>("Order", orderSchema);