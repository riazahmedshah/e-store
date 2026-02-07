import { Router } from "express";
import { addToCart, getCartItems } from "../cart.controller.js";

const router = Router();

router.post("/", addToCart);
router.get("/", getCartItems);

export {router as cartRouter}