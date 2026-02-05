import { Document, model, Schema, Types } from "mongoose";

interface IVariant {
  sku:string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  stock:number;
  price:number
};

export interface IProduct extends Document {
  _id: Types.ObjectId,
  title:string;
  description: string;
  category: Types.ObjectId;
  gender:'Men' | 'Women';
  keywords: string[];
  images: string[];
  variants: IVariant[];
};

const productSchema = new Schema<IProduct>({
  title:{
    type:String,
    required: true
  },
  description:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    enum: ['Men', 'Women'],
    index: true,
    required:true
  },
  category:{
    type:Schema.Types.ObjectId,
    ref:'Category',
    required:true
  },
  keywords:{
    type:[String],
    required:true
  },
  images:{
    type:[String],
    required: true,
  },
  variants: [{
    sku: { 
      type: String, 
      required: true, 
      unique: true 
    },
    size: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    stock: { 
      type: Number, 
      required: true, 
      min: 0, 
      select: false 
    }
  }]
},{
  timestamps: true,
  versionKey:false
});

productSchema.index({title: 'text', keywords:'text'});

export const Product = model<IProduct>("Product", productSchema);