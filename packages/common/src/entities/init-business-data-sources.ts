import { z } from "zod";

export const InitBusinessDataSourceInput = z.array(z.object({
  businessId: z.string().uuid(),
  sourceType: z.string().min(1),
  url: z.string().url(),
  scrapedAt: z.coerce.date().optional(),
}));

export type InitBusinessDataSourceInput = z.infer<typeof InitBusinessDataSourceInput>;

