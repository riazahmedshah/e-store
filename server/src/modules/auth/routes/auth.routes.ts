import { Router } from "express";
import { resgister, login } from "../controllers/exports.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { errorHandler } from "@/middlewares/error.middleware.js";

const router = Router();

router.post("/register", resgister);
router.post("/login", login);

export {router as authRouter};

