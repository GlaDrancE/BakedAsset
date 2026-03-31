import type { Request, Response } from "express";
import { BusinessService } from "../services/business.service.ts";
import { InitWebsiteInput } from "@repo/common";
import { z } from "zod";

export class BusinessController {
    private readonly businessService: BusinessService;

    constructor() {
        this.businessService = new BusinessService();
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
}