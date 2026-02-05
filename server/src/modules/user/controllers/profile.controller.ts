import { User } from "@/models/user.model.js";
import { AppError } from "@/utils/appError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { NextFunction, Request, Response } from "express";
import { photoSchema, updateProfileSchema } from "../schemas/user.schema.js";
import { removeUndefinedFromObject } from "@/utils/removeUndefinedFromObject.js";
import { UploadService } from "../services/upload.service.js";

export const profile = asyncHandler(async (req:Request, res:Response) => {
  const user = req.user;
  return ResponseHandle.success(res,null,user);
});

export const updateProfile = asyncHandler(async(req:Request, res:Response, next:NextFunction) => {
  const { name } = req.body;
  const profilePhoto = req.file;
  const userId = req.params.id;
  
  const userToUpdate = await User.findById(userId).lean();
  if(!userToUpdate) throw new AppError("User Does not Exists", 404);

  const updatedUserData = {
    name: name !== userToUpdate.name ? name : undefined,
    image: undefined
  }

  const result = await updateProfileSchema.parseAsync(updatedUserData);

  if(profilePhoto){
    const { success, error} = photoSchema.safeParse(profilePhoto);
    if(!success) throw error;
    try {
      const path = await UploadService.uploadProfileImage(userId as string, profilePhoto.buffer, userToUpdate.image) 
      result.image = path;
    } catch (error) {
      console.log('S3 uploads error!');
      next(error)
    }
  }

  const data = removeUndefinedFromObject(result);
  await User.updateOne({_id: userId},{ $set: data});

  return ResponseHandle.success(res, "Profile Updated Successfully");
}); 