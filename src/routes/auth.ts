import { Router } from "express";
import { login, logout } from "../controllers/auth.controller";
import { validateLoginInput } from "../middleware/validation";

const router = Router();

router.post("/login", validateLoginInput, login);
router.post("/logout", logout);

export default router;
