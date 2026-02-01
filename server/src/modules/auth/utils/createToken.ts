import { IUser } from "@/models/user.model.js";
import jwt from "jsonwebtoken"

export interface JwtPayload{
  id: string;
  role: 'user' | 'admin' | 'superAdmin';
}

export const createToken = (user:IUser) => {
  const payload: JwtPayload = {
    id:user._id.toString(), 
    role:user.role
  }
  return jwt.sign(payload, process.env.JWT_SECRET!,{
    expiresIn: '7d'
  });
}