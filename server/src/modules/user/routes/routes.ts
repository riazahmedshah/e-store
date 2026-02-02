import { Router } from "express";
import { logout, profile } from "../controllers/index.js";

const router = Router();

router.post("/logout", logout);
router.get("/profile", profile);

export {router as userRouter};