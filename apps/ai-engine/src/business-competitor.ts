import { BusinessContextService } from '@repo/common'
import { callAI } from './ai-sdk/gemini.sdk.ts';
import { competitorInsightsPrompt } from './prompt/business-competitor.ts';
import type { CompetitorInsight } from '@repo/types';

const businessContextService = new BusinessContextService();

export async function getBusinessCompetitor(businessId: string): Promise<CompetitorInsight> {
    const competitorContext = await businessContextService.getCompetitors(businessId);
    if (!competitorContext) {
        throw new Error("Business not found");
    }
    const normalizedData = {
        ...competitorContext
    }
    const competitors: any = await callAI({ prompt: competitorInsightsPrompt(normalizedData) });
    return competitors;
}