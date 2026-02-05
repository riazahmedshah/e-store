import { Router } from "express";
import { userProfileMiddleware } from "@/configs/multer.js";
import { logout, profile, updateProfile } from "../controllers/index.js";



const router = Router();

router.post("/logout", logout);
router.get("/", profile);
router.put("/:id", userProfileMiddleware,updateProfile)

export {router as userRouter};