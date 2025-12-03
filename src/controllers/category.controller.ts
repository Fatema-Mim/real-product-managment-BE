import { Response } from "express";
import { AuthRequest } from "../types";
import { createCategory, getAllCategories, updateCategoryById, deleteCategoryById } from "../services/category.service";
import { handleError, sendSuccess } from "../utils/response-handler";
import { ValidationError, NotFoundError } from "../utils/custom-errors";

export const addCategory = async (request: AuthRequest, response: Response) => {
  try {
    const { name } = request.body;

    if (!name || typeof name !== "string") {
      throw new ValidationError("Category name is required");
    }

    const newCategory = await createCategory({ name });

    return sendSuccess(response, {
      message: "Category added successfully",
      categoryId: newCategory.id,
    }, 201);
  } catch (error) {
    return handleError(response, error, "Error adding category");
  }
};

export const getCategories = async (request: AuthRequest, response: Response) => {
  try {
    const categories = await getAllCategories();
    return sendSuccess(response, { categories });
  } catch (error) {
    return handleError(response, error, "Error fetching categories");
  }
};

export const updateCategory = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    const updatedCategory = await updateCategoryById(id, updates);

    if (!updatedCategory) {
      throw new NotFoundError("Category not found");
    }

    return sendSuccess(response, {
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return handleError(response, error, "Error updating category");
  }
};

export const deleteCategory = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    const deleted = await deleteCategoryById(id);

    if (!deleted) {
      throw new NotFoundError("Category not found");
    }

    return sendSuccess(response, { message: "Category deleted successfully" });
  } catch (error) {
    return handleError(response, error, "Error deleting category");
  }
};
