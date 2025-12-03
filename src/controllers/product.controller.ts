import { Response } from "express";
import { AuthRequest } from "../types";
import { Product } from "../types/product";
import { createProduct, getAllProducts, getProduct, updateProductById, deleteProductById } from "../services/product.service";
import { handleError, sendSuccess } from "../utils/response-handler";
import { ValidationError, NotFoundError } from "../utils/custom-errors";

export const addProduct = async (request: AuthRequest, response: Response) => {
  try {
    const { name, description, price, status, category_id, stock_quantity } = request.body;

    const parsedPrice = typeof price === "string" ? parseFloat(price) : price;
    const parsedStockQuantity = typeof stock_quantity === "string" ? parseInt(stock_quantity) : stock_quantity;
    const parsedCategoryId = typeof category_id === "string" ? JSON.parse(category_id) : category_id;

    if (!name || typeof parsedPrice !== "number" || isNaN(parsedPrice) || !status) {
      throw new ValidationError("Invalid input data");
    }

    const imageUrls = request.files && Array.isArray(request.files)
      ? request.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const productData = {
      name,
      description,
      price: parsedPrice,
      status,
      category_id: parsedCategoryId || [],
      images: imageUrls,
      stock_quantity: parsedStockQuantity || 0,
    };

    const newProduct = await createProduct(productData);

    return sendSuccess(response, {
      message: "Product added successfully",
      productId: newProduct.id,
    }, 201);
  } catch (error) {
    return handleError(response, error, "Error adding product");
  }
};

export const getProducts = async (request: AuthRequest, response: Response) => {
  try {
    const products = await getAllProducts();
    return sendSuccess(response, { products });
  } catch (error) {
    return handleError(response, error, "Error fetching products");
  }
};

export const getProductById = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    const product = await getProduct(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return sendSuccess(response, { product });
  } catch (error) {
    return handleError(response, error, "Error fetching product");
  }
};

export const updateProduct = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    const { name, description, price, status, category_id, stock_quantity, existing_images } = request.body;

    const parsedPrice = price && (typeof price === "string" ? parseFloat(price) : price);
    const parsedStockQuantity = stock_quantity && (typeof stock_quantity === "string" ? parseInt(stock_quantity) : stock_quantity);
    const parsedCategoryId = category_id && (typeof category_id === "string" ? JSON.parse(category_id) : category_id);

    const parsedExistingImages = existing_images && (typeof existing_images === "string" ? JSON.parse(existing_images) : existing_images);

    const newImageUrls = request.files && Array.isArray(request.files)
      ? request.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const allImages = [...(parsedExistingImages || []), ...newImageUrls];

    const updates: Partial<Product> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (parsedPrice !== undefined) updates.price = parsedPrice;
    if (status !== undefined) updates.status = status;
    if (parsedCategoryId !== undefined) updates.category_id = parsedCategoryId;
    if (parsedStockQuantity !== undefined) updates.stock_quantity = parsedStockQuantity;
    updates.images = allImages;

    const updatedProduct = await updateProductById(id, updates);

    if (!updatedProduct) {
      throw new NotFoundError("Product not found");
    }

    return sendSuccess(response, {
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return handleError(response, error, "Error updating product");
  }
};

export const deleteProduct = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    const deleted = await deleteProductById(id);

    if (!deleted) {
      throw new NotFoundError("Product not found");
    }

    return sendSuccess(response, { message: "Product deleted successfully" });
  } catch (error) {
    return handleError(response, error, "Error deleting product");
  }
};
