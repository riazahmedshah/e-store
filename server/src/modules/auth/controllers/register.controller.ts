import { NextFunction, Request, Response } from "express";
import { signupSchema } from "../schemas/auth.schema.js";
import { User } from "@/models/user.model.js";
import { AppError } from "@/utils/appError.js";
import { ResponseHandle } from "@/utils/responseHandler.js";
import { createToken } from "@/modules/auth/utils/createToken.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const resgister = asyncHandler(async (req: Request,res: Response,next: NextFunction) => {
    const {data, success, error} = signupSchema.safeParse(req.body);
    if(!success) throw error;
    const {name, email, password} = data;

    const isUserExists = await User.findOne({email});
    if(isUserExists) {
      throw new AppError('User Already Exists', 409)
    };

    const user = await User.create({
      name,
      email,
      password
    });

    const token = createToken(user);

    res.cookie("token", token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return ResponseHandle.success(res,'Account created!', user, 201)
  
});
