import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth";
import { uploadMultiple } from "../config/upload";
import { handleUploadError } from "../middleware/upload-error-handler";

const router = Router();

const uploadWithErrorHandling = (request: Request, response: Response, next: NextFunction) => {
  uploadMultiple(request, response, (error: any) => {
    if (error) {
      return handleUploadError(error, request, response, next);
    }
    next();
  });
};

router.post("/add", authenticate, uploadWithErrorHandling, addProduct);
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);
router.put("/:id", authenticate, uploadWithErrorHandling, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
