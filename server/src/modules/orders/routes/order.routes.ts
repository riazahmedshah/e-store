import { Router } from "express";
import { placeOrder } from "../controllers/order.controller.js";

const router = Router();

router.post("/", placeOrder);

export {router as ordersRouter}