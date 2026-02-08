import { Document, model, Schema, Types } from "mongoose";

interface Items{
  productId: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image:string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: Items[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  address: string;
  orderDate: Date;
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
    required: true
  },
  address:{
    type: String,
    required: true
  },
  orderDate:{
    type: Date,
    required:true
  }
},{
  timestamps: true,
  versionKey: false
});

export const Order = model<IOrder>("Order", orderSchema);