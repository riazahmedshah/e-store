import { NextFunction, Request, Response } from "express";
import { User } from "@/models/user.model.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { AppError } from "@/utils/appError.js";
import { createToken } from "../utils/createToken.js";
import { ResponseHandle } from "@/utils/responseHandler.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {data, success, error} = loginSchema.safeParse(req.body);
    if(!success) throw error;
    const {email, password} = data;

    const user = await User.findOne({email}).select('+password');
    if(!user) throw new AppError("Invalid Credentials", 404);
    const isMatch = await user.isPasswordMatch(password);
    if(!isMatch) throw new AppError("Invalid Credentials", 401);

    // TODO(In future...): create sessions for admins;

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return ResponseHandle.success(res, "Login successful!", user);
  } catch (error) {
    next(error);
  }
};