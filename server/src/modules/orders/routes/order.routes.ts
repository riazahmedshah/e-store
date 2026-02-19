import { Router } from "express";
import { placeOrder, confirmOrder } from "../controllers/order.controller.js";
import { checkAuth } from "@/middlewares/auth.middleware.js";

const router = Router();

router.use(checkAuth)
router.post("/", placeOrder);
router.post("/:orderId", confirmOrder);

export {router as ordersRouter}