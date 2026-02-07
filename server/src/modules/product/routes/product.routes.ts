import { Router } from "express";
import { createProduct } from "../controllers/create-product.js";
import { productImageMiddleware, productImagesMiddleware } from "@/configs/multer.js";
import { checkAuth } from "@/middlewares/auth.middleware.js";
import { checkRoles } from "@/middlewares/role.middleware.js";
import { updateProductDetails } from "../controllers/update-product-details.js";
import { updateProductImage } from "../controllers/update-product-image.js";
import { addVariant } from "../controllers/add-variant.js";
import { updateStock } from "../controllers/update-stock.js";
import { listProductByIdAdmin, listProductsAdmin } from "../controllers/admin-list-products.js";
import { listProducts, listProductsById } from "../controllers/list-products.js";

const router = Router();

router.get(
  "/",
  listProducts
);

router.get(
  "/:productId",
  listProductsById
);


router.use(checkAuth, checkRoles("admin", "superAdmin"));

router.get(
  "/admin/all",
  listProductsAdmin
);

router.get(
  "/admin/:productId",
  listProductByIdAdmin
);

router.post(
  "/",
  productImagesMiddleware,
  createProduct,
);

router.patch(
  "/:productId",
  updateProductDetails,
);

router.patch(
  "/:productId/image",
  productImageMiddleware,
  updateProductImage
);

router.patch(
  "/:productId/variant",
  addVariant
);

router.patch(
  "/:productId/stock",
  updateStock
);





export { router as productRouter };
