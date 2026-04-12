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
router.post(
    "/init-category-questions",
    authMiddleware,
    businessController.initCategoryQuestions.bind(businessController),
)
router.post(
    "/init-data-sources",
    authMiddleware,
    businessController.initBusinessDataSources.bind(businessController),
)
router.post(
    "/init-create-competitor-query",
    authMiddleware,
    businessController.initCreateCompetitorQuery.bind(businessController),
)
router.post(
    "/init-business-analysis",
    authMiddleware,
    businessController.initBusinessAnalysis.bind(businessController),
)
router.get("/categories", businessController.getCategory.bind(businessController));

export default router;