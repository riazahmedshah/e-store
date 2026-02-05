import { Router } from "express";
import { createProduct } from "../controllers/create-product.js";
import { productImagesMiddleware } from "@/configs/multer.js";
import { checkAuth } from "@/middlewares/auth.middleware.js";
import { checkRoles } from "@/middlewares/role.middleware.js";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  productImagesMiddleware,
  createProduct,
);

export { router as productRouter };
