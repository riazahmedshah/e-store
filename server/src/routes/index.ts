
import { authRouter } from "@/modules/auth/routes/index.js";
import { userRouter } from "@/modules/user/routes/routes.js";
import { Router } from "express";

export const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
