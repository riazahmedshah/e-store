
import { authRouter } from "@/modules/auth/routes/index.js";
import { Router } from "express";

export const router = Router();

router.use("/auth", authRouter);
