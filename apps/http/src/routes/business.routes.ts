import { Router } from "express";
import { BusinessController } from "../controllers/business.controller.ts";
import { authMiddleware } from "../middleware/auth-middelware.ts";

const router: Router = Router();

const businessController = new BusinessController();

router.post(
    "/init-website",
    authMiddleware,
    businessController.initWebsite.bind(businessController),
);

export default router;