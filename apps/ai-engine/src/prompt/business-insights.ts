export const businessInsightsPrompt = (data: any) => {
  return `
    You are a business intelligence engine for local businesses.

Your job is to analyze real customer feedback and business signals, and extract ONLY high-signal, non-generic insights.

INPUT:
You will receive structured data containing:
- business details
- customer reviews
- Instagram bio (optional)
- rating and total reviews

INPUT DATA: 
${JSON.stringify(data)}

---

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "key_strengths": string[],
  "customer_intent": "immediate_need" | "research" | "comparison",
  "price_positioning": "budget" | "mid" | "premium",
  "urgency_triggers": string[],
  "trust_signals": string[],
  "local_seo_keywords": string[]
}

---

EXTRACTION RULES:

1. KEY STRENGTHS:
- Extract from reviews and bio ONLY
- Must be specific (e.g. "quick takeaway service", not "good service")
- Max 5 items

2. CUSTOMER INTENT:
- immediate_need → urgent services (food delivery, clinic, repairs)
- research → people compare before choosing (education, high-cost services)
- comparison → competitive categories where users evaluate options
- Choose ONE based on review behavior

3. PRICE POSITIONING:
- Infer from wording in reviews (cheap, affordable, expensive, premium)
- If unclear, default to "mid"
- Do NOT guess randomly

4. URGENCY TRIGGERS:
- Extract real actionable triggers:
  - "same day delivery"
  - "walk-in available"
  - "quick service"
- Max 5 items

5. TRUST SIGNALS:
- Only include if implied or mentioned:
  - "10+ years", "certified", "experienced staff"
- If none exist, return empty array

6. LOCAL SEO KEYWORDS:
- Combine category + city naturally
- Example: "restaurant in Nagpur", "best clinic in Nagpur"
- Max 5 items

---

STRICT CONSTRAINTS:

- NO generic phrases like:
  "good service", "best quality", "nice place"

- DO NOT use business owner claims (positioningTier, positioningDetail) unless supported by reviews

- PRIORITIZE:
  reviews > bio > metadata

- If data is weak, return fewer items instead of guessing

- Output MUST be valid JSON (no explanations, no markdown)

---

Now analyze the provided input and return the result.
    `;
}


