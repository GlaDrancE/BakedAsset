import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middleware/auth-middelware.ts";

const router: Router = Router();

const authController = new AuthController();

router.post("/me", authMiddleware, authController.me.bind(authController));
router.post("/sign-up", authController.signUp.bind(authController));
router.post("/sign-in", authController.signIn.bind(authController));

export default router;