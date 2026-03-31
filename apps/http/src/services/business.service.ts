import { prisma } from "@repo/db";
import { Language } from "@repo/db/enums";
import { assertNonEmptyString, type InitWebsiteInput } from "@repo/common";
import z from "zod";
import { findOrCreateCategory } from "../utils/create-business-category.ts";



export class BusinessService {

    async initWebsite(userId: string, input: z.infer<typeof InitWebsiteInput>) {
        if (!userId) {
            throw new Error("Invalid userId");
        }

        if (!input?.category) {
            throw new Error("Invalid category");
        }

        const categoryId = await findOrCreateCategory(input.category);

        // Create business record.
        return await prisma.business.create({
            data: {
                userId,
                categoryId,

                name: assertNonEmptyString(input.name, "name"),
                city: assertNonEmptyString(input.city, "city"),
                phone: input.phone ?? null,
                whatsapp: input.whatsapp ?? null,
                address: input.address ? {
                    create: {
                        address: assertNonEmptyString(input.address.address, "address"),
                        city: assertNonEmptyString(input.address.city, "city"),
                        state: assertNonEmptyString(input.address.state, "state"),
                        country: assertNonEmptyString(input.address.country, "country"),
                        postalCode: assertNonEmptyString(input.address.postalCode, "postalCode"),
                    }
                } : undefined,

                language: Language.ENGLISH,
                positioningTier: assertNonEmptyString(input.positioningTier, "positioningTier"),
                positioningDetail: input.positioningDetail ?? null,
                status: input.status ?? undefined,
            },
            include: {
                category: true,
            },
        });
    }
}

