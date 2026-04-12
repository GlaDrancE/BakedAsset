import { BusinessContextService } from '@repo/common'
import { callAI } from './ai-sdk/gemini.sdk.ts';
import { businessInsightsPrompt } from './prompt/business-insights.ts';
import type { BusinessInsights } from '@repo/types';

const businessContextService = new BusinessContextService();

export async function getBusinessInsights(businessId: string): Promise<BusinessInsights> {
    const businessContext = await businessContextService.getBusinessContext(businessId);
    const scrappedDetails = await businessContextService.getScrappedDetails(businessId);
    if (!businessContext) {
        throw new Error("Business not found");
    }
    const googleDetails = scrappedDetails.filter((detail) => detail.dataSource.sourceType === "google");
    const instagramDetails = scrappedDetails.filter((detail) => detail.dataSource.sourceType === "instagram");

    const normalizedData = {
        business: {
            name: businessContext.name,
            address: businessContext.address,
            phone: businessContext.phone,
            whatsapp: businessContext.whatsapp,
            positioningTier: businessContext.positioningTier,
            positioningDetail: businessContext.positioningDetail,
            category: businessContext.category.name,
        },
        reviews: googleDetails.flatMap((detail) => detail.reviews.map((review) => ({
            author: review.author,
            content: review.content,
        }))),

        bio: instagramDetails.map((detail) => detail.bio).filter(Boolean),
        totalReviews: googleDetails.reduce((acc, detail) => acc + (detail.reviewCount ?? 0), 0),
        rating: googleDetails[0]?.rating ?? 0,
    }

    const insights: any = await callAI({ prompt: businessInsightsPrompt(normalizedData) })
    return insights;
}