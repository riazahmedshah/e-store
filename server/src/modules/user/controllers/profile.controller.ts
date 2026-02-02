import { asyncHandler } from "@/utils/asyncHandler.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { NextFunction, Request, Response } from "express";

export const profile = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
  const user = req.user;
  return ResponseHandle.success(res,null,user);
})