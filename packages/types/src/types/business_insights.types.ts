export interface BusinessInsights {
    key_strengths: string[];
    customer_intent: string;
    price_positioning: string;
    urgency_triggers: string[];
    trust_signals: string[];
    local_seo_keywords: string[];
}

export interface CompetitorInsight {
    common_complaints: string[];
    common_strengths: string[];
    market_gap: string;
    positioning_gap: string;
    avg_competitor_rating: number;
    competitors_analyzed: number;
}

export interface BusinessStrategies {
    business_id: string;
    signal_profile_id: string;
    competitor_insight_id: string;
    positioning_strategy: string;
    differentiation_angle: string;
    primary_value_prop: string;
    trust_drivers: string[];
    content_priority: string[];
    cta_primary: string;
    cta_secondary: string;
    target_audience_profile: string;
    urgency_triggers: string[];
}