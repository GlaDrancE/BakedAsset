import { z } from "zod"
import type { BusinessAddress } from "@repo/db/client";
export interface CategoryInput {
    name: string;
    slug?: string;
    ctaType: string;
    sitemapTemplate: unknown;
    parent?: CategoryInput | null;
};
export const InitWebsiteInput = z.object({
    category: z.custom<CategoryInput>(),
    name: z.string(),
    city: z.string(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.custom<BusinessAddress>().optional(),
    language: z.string(),
    positioningTier: z.string(),
    positioningDetail: z.string().optional(),
    status: z.string().optional(),
})