import { z } from "zod";

export const InitBusinessAnalysisInput = z.object({
    businessId: z.string().uuid(),
});

export type InitBusinessAnalysisInput = z.infer<typeof InitBusinessAnalysisInput>;

