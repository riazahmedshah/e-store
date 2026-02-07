import { checkAuth } from "@/middlewares/auth.middleware.js";
import { checkRoles } from "@/middlewares/role.middleware.js";
import { authRouter } from "@/modules/auth/routes/auth.routes.js";
import { cartRouter } from "@/modules/cart/routes/cart.routes.js";
import { categoryRouter } from "@/modules/category/routes/routes.js";
import { productRouter } from "@/modules/product/routes/product.routes.js";
import { userRouter } from "@/modules/user/routes/user.routes.js";
import { Router } from "express";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", checkAuth,userRouter);
router.use("/categories", checkAuth, checkRoles('admin', 'superAdmin'), categoryRouter);
router.use("/products", productRouter);
router.use("/carts", checkAuth, cartRouter);
