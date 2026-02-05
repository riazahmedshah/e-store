import { Router } from "express";
import { createCategory, deleteCategory, listCategory, listCategoryById, updateCategory } from "../category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/", listCategory);
router.get("/:id", listCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory)

export {router as categoryRouter}