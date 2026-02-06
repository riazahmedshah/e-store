import { Router } from "express";
import { createProduct } from "../controllers/create-product.js";
import { productImageMiddleware, productImagesMiddleware } from "@/configs/multer.js";
import { checkAuth } from "@/middlewares/auth.middleware.js";
import { checkRoles } from "@/middlewares/role.middleware.js";
import { updateProductDetails } from "../controllers/update-product-details.js";
import { updateProductImage } from "../controllers/update-product-image.js";
import { addVariant } from "../controllers/add-variant.js";
import { updateStock } from "../controllers/update-stock.js";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  productImagesMiddleware,
  createProduct,
);

router.patch(
  "/:productId",
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

router.patch(
  "/:productId/variant",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  addVariant
);

router.patch(
  "/:productId/stock",
  checkAuth,
  checkRoles("admin", "superAdmin"),
  updateStock
);

// router.get(
//   "/",
//   listProducts
// );

// router.get(
//   "/:id",
//   listProductsById
// );



export { router as productRouter };
