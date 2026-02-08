import { Router } from "express";
import { addToCart, deleteItem, getCartItems } from "../cart.controller.js";

const router = Router();

router.post("/", addToCart);
router.get("/", getCartItems);
router.delete("/:itemId", deleteItem);

export {router as cartRouter}