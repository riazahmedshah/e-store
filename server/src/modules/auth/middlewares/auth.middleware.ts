import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { AppError } from "@/utils/appError.js";
import { JwtPayload } from "../utils/createToken.js";
import { User } from "@/models/user.model.js";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;
    if(!token) throw new AppError("Unauthorized", 401);
  
    const {id} = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if(!id) throw new AppError("Unauthorized", 401);
    
    const user = await User.findById(id);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};