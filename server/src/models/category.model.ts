import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
  name:string;
  slug:string;
  section: 'Men' | 'Women' | 'Accessories';
  createdAt:Date;
  updatedAt:Date;
}

const categorySchema = new Schema<ICategory>({
  name:{
    type:String,
    required:true
  },
  slug:{
    type:String,
    unique:true,
    index: true,
    required:true,
  },
  section:{
    type:String,
    enum:['Men', 'Women', 'Accessories'],
    required:true
  }
},{
  strict:'throw',
  timestamps: true,
  versionKey:false
});

export const Category = model<ICategory>("Category", categorySchema);