import { NextFunction, Request, Response } from "express";

export function asyncHandler(fn: any){
  return async function(req:Request, res:Response, next:NextFunction){
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (error) {
      next(error)
    }
  }
}