import { AppError } from "@/utils/appError.js";
import { NextFunction, Request, Response } from "express"

export const checkRoles = (...roles: string[]) => {
  return (req:Request, res:Response, next:NextFunction) => {
    if(!roles.includes(req.user?.role!)){
      throw new AppError("You do not have permission to perform this action", 403);
    };
    next();
  }
}