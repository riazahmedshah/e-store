import { Router } from "express";
import { resgister, login } from "../controllers/exports.js";

const router = Router();

router.post("/register", resgister);
router.post("/login", login);

export {router as authRouter};

