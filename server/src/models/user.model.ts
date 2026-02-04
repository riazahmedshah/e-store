import { model, Schema, type Document } from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends Document {
  name:string;
  email:string;
  password:string;
  image?:string;
  role: 'user' | 'superAdmin' | 'admin'
  isPasswordMatch(password:string):Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name:{
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type: String,
    required: true,
    minLength: 6,
    select: false
  },
  image:{
    type: String,
    default: 'users/default/10.webp'
  },
  role:{
    type: String,
    enum: ["user", "admin", "superAdmin"],
    default: 'user'
  }
},{
  timestamps: true,
  versionKey: false,
  toJSON:{
    transform: (doc, ret: Partial<IUser>) => {
      delete ret.password;
      ret.image = `https://pub-8272d00df7934560aa9675a2512365dc.r2.dev/${ret.image}`
      return ret;
    }
  }
});

userSchema.pre<IUser>('save', async function(){
  if(!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordMatch = async function(
  this:IUser,
  password:string
){
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password)
};

export const User = model<IUser>("User", userSchema);