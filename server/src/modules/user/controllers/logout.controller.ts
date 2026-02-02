import { asyncHandler } from "@/utils/asyncHandler.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { Request, Response } from "express";

export const logout = asyncHandler(async(req:Request, res:Response) => {
  res.clearCookie("token");
  return ResponseHandle.success(res, "Logged out successfully!");
})