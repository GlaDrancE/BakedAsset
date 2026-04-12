import { getBusinessInsights } from './business-insights.ts';
import { getBusinessCompetitor } from './business-competitor.ts';
import { prisma } from '@repo/db';
import type { BusinessInsights, BusinessStrategies, CompetitorInsight } from '@repo/types';
import { getBusinessStrategies } from './business-strategies.ts';

export const businessAnalysis = async (businessId: string) => {
    const insights: BusinessInsights = await getBusinessInsights(businessId);
    const competitor: CompetitorInsight = await getBusinessCompetitor(businessId);
    const businessStrategies: BusinessStrategies = await getBusinessStrategies(insights, competitor);

    const business_insights = await prisma.businessSignalProfile.create({
        data: {
            businessId,
            keyStrengths: insights?.key_strengths,
            customerIntent: insights?.customer_intent,
            pricePositioning: insights?.price_positioning,
            urgencyTriggers: insights?.urgency_triggers,
            trustSignals: insights?.trust_signals,
            localSeoKeywords: insights?.local_seo_keywords,
        }
    })
    const competitor_insights = await prisma.competitorInsight.create({
        data: {
            businessId,
            marketGap: competitor?.market_gap,
            positioningGap: competitor?.positioning_gap,
            competitorsAnalyzed: competitor?.competitors_analyzed,
            commonComplaints: competitor?.common_complaints,
            commonStrengths: competitor?.common_strengths,
            avgCompetitorRating: competitor?.avg_competitor_rating,
        }
    })

    const business_strategies = await prisma.businessStrategy.create({
        data: {
            businessId,
            signalProfileId: business_insights.id,
            competitorInsightId: competitor_insights.id,
            positioningStrategy: businessStrategies?.positioning_strategy,
            differentiationAngle: businessStrategies?.differentiation_angle,
            primaryValueProp: businessStrategies?.primary_value_prop,
            trustDrivers: businessStrategies?.trust_drivers,
            contentPriority: businessStrategies?.content_priority,
            ctaPrimary: businessStrategies?.cta_primary,
            ctaSecondary: businessStrategies?.cta_secondary,
            targetAudienceProfile: businessStrategies?.target_audience_profile,
            urgencyTriggers: businessStrategies?.urgency_triggers,
        }
    })
    return business_strategies;
}
businessAnalysis("6c5af940-680f-4b5f-b22e-7d4c41d199b0").then(console.log).catch(console.error);