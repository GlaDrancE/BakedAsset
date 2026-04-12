import { BusinessContextService } from '@repo/common'
import { callAI } from './ai-sdk/gemini.sdk.ts';
import { businessInsightsPrompt } from './prompt/business-insights.ts';
import type { BusinessInsights, BusinessStrategies, CompetitorInsight } from '@repo/types';
import { businessStrategiesPrompt } from './prompt/business-strategies.ts';


export async function getBusinessStrategies(insights: BusinessInsights, competitor: CompetitorInsight): Promise<BusinessStrategies> {
    const strategies: BusinessStrategies = await callAI({ prompt: businessStrategiesPrompt(insights, competitor) })
    return strategies;
}