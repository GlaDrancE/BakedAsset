import type { Request, Response } from "express";
import { BusinessService } from "../services/business.service.ts";
import { coachingDetailsSchema, InitBusinessDataSourceInput, InitWebsiteInput } from "@repo/common";
import { z } from "zod";

export class BusinessController {
    private readonly businessService: BusinessService;

    constructor() {
        this.businessService = new BusinessService();
    }
    sendServerError(res: Response, error: Error) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return res.status(message.startsWith("Invalid ") ? 400 : 500).json({ error: message });
    }

    async initWebsite(req: Request, res: Response): Promise<void> {
        const userId = req.auth?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            const payload = InitWebsiteInput.parse(req.body)
            const business = await this.businessService.initWebsite(userId, payload);

            res.status(201).json({ business });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Internal Server Error";
            res.status(message.startsWith("Invalid ") ? 400 : 500).json({ error: message });
        }

    }

    async initCategoryQuestions(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth?.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const payload = coachingDetailsSchema.parse(req.body)
            const business = await this.businessService.initWebsiteQuestions(userId, payload);
            res.status(201).json({ business });
        } catch (error) {
            this.sendServerError(res, error as Error);
        }
    }

    async initBusinessDataSources(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.auth;
            if (!userId) {
                this.sendServerError(res, new Error("Unauthorized"));
                return;
            }
            const payload = InitBusinessDataSourceInput.parse(req.body)
            const business = await this.businessService.initBusinessDataSources(userId, payload);
            res.status(201).json({ business });
        } catch (error) {
            this.sendServerError(res, error as Error);
        }
    }

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const categories = this.businessService.getCategory()
            res.status(200).json(await categories);
        } catch (error) {
            this.sendServerError(res, error as Error)
        }
    }

}