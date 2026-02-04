import { Router } from "express";
import { logout, profile, updateProfile } from "../controllers/index.js";

import multer, { memoryStorage } from "multer";

const upload = multer({
  storage: memoryStorage()
})

const router = Router();

router.post("/logout", logout);
router.get("/profile", profile);
router.put("/profile/:id", upload.single('profilePhoto'),updateProfile)

export {router as userRouter};