import { z } from 'zod'
export const InitCreateCompetitorQuery = z.object({
    businessId: z.string().uuid(),
    query: z.string().optional(),
})
export type InitCreateCompetitorQuery = z.infer<typeof InitCreateCompetitorQuery>