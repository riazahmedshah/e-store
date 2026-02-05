import { asyncHandler } from "@/utils/asyncHandler.js";
import { Request, Response } from "express";
import { categorySchema, updateCategorySchema } from "./schemas/category.schema.js";
import { Category } from "@/models/category.model.js";
import { AppError } from "@/utils/appError.js";
import { ResponseHandle } from "@/utils/responseHandler.js";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { success, data, error } = categorySchema.safeParse(req.body);
    if (!success) throw error;

    const slug = `${data.name} ${data.section}`
      .toLowerCase()
      .replace(/ /g, "-");
    const existingCategory = await Category.findOne({ slug });

    if (existingCategory)
      throw new AppError("Category already exists in this section", 409);

    const dataObj = {
      name: data.name,
      slug: slug,
      section: data.section,
    };

    const category = new Category(dataObj);
    await category.save();
    return ResponseHandle.success(
      res,
      "Category created successfully",
      category,
      201,
    );
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const {data, error, success} = updateCategorySchema.safeParse(req.body);
    if(!success) throw error;

    if(Object.keys(data).length === 0) throw new AppError("No updated value found");

    const existing = await Category.findById(id).lean();
    if (!existing) throw new AppError("Category not found", 404);

    const newName = data.name ?? existing.name;
    const newSection = data.section ?? existing.section;

    let updateFields: any = { ...data };
    if(data.name  || data.section){
      updateFields.slug = `${newName} ${newSection}`
      .toLowerCase()
      .trim()
      .replace(/ /g, "-");
    }

    await Category.updateOne(
      {_id:id},
      updateFields
    );

    return ResponseHandle.success(res, "Category updated successfully")
  },
);

export const listCategory = asyncHandler(
  async(req:Request, res:Response) => {
    const categories = await Category.find().lean();
    if(!categories) throw new AppError("No Categories Available!", 404);

    return ResponseHandle.success(res, "",categories);
});

export const listCategoryById = asyncHandler(
  async(req:Request, res:Response) => {
    const {id} = req.params;
    const categories = await Category.findById(id).lean();
    if(!categories) throw new AppError("Category not found!", 404);

    return ResponseHandle.success(res, "",categories);
});

export const deleteCategory = asyncHandler(
  async(req:Request, res:Response) => {
    const {id} = req.params;

    await Category.findByIdAndDelete(id);
    return ResponseHandle.success(res,"Category Deleted!");
  }
)
