import { Router } from "express";
import { createProduct } from "../controllers/create-product.js";
import { productImageMiddleware, productImagesMiddleware } from "@/configs/multer.js";
import { checkAuth } from "@/middlewares/auth.middleware.js";
import { checkRoles } from "@/middlewares/role.middleware.js";
import { updateProductDetails } from "../controllers/update-product-details.js";
import { updateProductImage } from "../controllers/update-product-image.js";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  productImagesMiddleware,
  createProduct,
);

router.patch(
  "/:id",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  updateProductDetails,
);

router.patch(
  "/:productId/image",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  productImageMiddleware,
  updateProductImage
);

export { router as productRouter };
