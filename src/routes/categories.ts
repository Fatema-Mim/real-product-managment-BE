import { Router } from "express";
import { addCategory, getCategories, updateCategory, deleteCategory } from "../controllers/category.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/add", authenticate, addCategory);
router.get("/", authenticate, getCategories);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
