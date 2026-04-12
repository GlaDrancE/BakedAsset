import { prisma } from "@repo/db";
import { Language } from "@repo/db/enums";
import { assertNonEmptyString, businessLinksQueue, coachingDetailsSchema, googleImagesQueue, InitBusinessDataSourceInput, instagramQueue, type InitWebsiteInput } from "@repo/common";
import z from "zod";
import { findOrCreateCategory } from "../utils/create-business-category.ts";
import { createCompetitorQuery } from "../utils/competitor-query.ts";



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

    async initWebsiteQuestions(userId: string, input: z.infer<typeof coachingDetailsSchema>) {
        try {
            if (!userId) {
                throw new Error("Invalid userId");
            }

            if (!input?.businessId) {
                throw new Error("Invalid businessId");
            }

            const business = await prisma.business.findFirst({
                where: {
                    id: input.businessId,
                    userId,
                },
                select: { id: true },
            });

            if (!business) {
                throw new Error("Business not found");
            }

            const result = await prisma.$transaction(async (tx) => {
                const coachingDetails = await tx.coachingDetails.upsert({
                    where: { businessId: input.businessId },
                    create: {
                        businessId: input.businessId,
                        coachingType: assertNonEmptyString(input.coachingType, "coachingType"),
                        subjects: input.subjects,
                        targetGrades: input.targetGrades,
                        examFocus: input.examFocus,
                        batchTypes: input.batchTypes,
                        demoClassAvailable: input.demoClassAvailable ?? false,
                        resultTrackRecord: input.resultTrackRecord ?? null,
                        studentsPerBatch: input.studentsPerBatch ?? null,
                        facultyCount: input.facultyCount ?? null,
                        feeRange: input.feeRange ?? null,
                        hasOnlineMode: input.hasOnlineMode ?? false,
                    },
                    update: {
                        coachingType: assertNonEmptyString(input.coachingType, "coachingType"),
                        subjects: input.subjects,
                        targetGrades: input.targetGrades,
                        examFocus: input.examFocus,
                        batchTypes: input.batchTypes,
                        demoClassAvailable: input.demoClassAvailable ?? false,
                        resultTrackRecord: input.resultTrackRecord ?? null,
                        studentsPerBatch: input.studentsPerBatch ?? null,
                        facultyCount: input.facultyCount ?? null,
                        feeRange: input.feeRange ?? null,
                        hasOnlineMode: input.hasOnlineMode ?? false,
                    },
                });

                if (input.facultyDetails) {
                    await tx.facultyMember.deleteMany({
                        where: { businessId: input.businessId },
                    });

                    if (input.facultyDetails.length > 0) {
                        await tx.facultyMember.createMany({
                            data: input.facultyDetails.map((faculty, index) => ({
                                businessId: input.businessId,
                                name: faculty.name,
                                photoAssetId: faculty.photoAssetId,
                                qualification: faculty.qualification,
                                specialization: faculty.specialization,
                                experienceYears: faculty.experienceYears,
                                achievement: faculty.achievement ?? null,
                                displayOrder: index,
                            })),
                        });
                    }
                }

                return tx.business.findUnique({
                    where: { id: input.businessId },
                    include: {
                        coachingDetails: true,
                        facultyMembers: {
                            orderBy: { displayOrder: "asc" },
                        },
                    },
                });
            });

            if (!result) {
                throw new Error("Failed to initialize website questions");
            }

            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Internal Server Error";
            if (message.startsWith("Invalid ") || message === "Business not found") {
                throw new Error(message);
            }

            throw new Error("Failed to initialize website questions");
        }
    }

    async initBusinessDataSources(userId: string, inputs: z.infer<typeof InitBusinessDataSourceInput>) {
        try {
            if (!userId) {
                throw new Error("Invalid userId");
            }

            if (!Array.isArray(inputs) || inputs.length === 0) {
                throw new Error("Invalid data sources");
            }

            const businessIds = Array.from(new Set(inputs.map((i) => i.businessId)));

            if (businessIds.length !== 1) {
                throw new Error("Invalid businessId");
            }

            const businessId = businessIds[0];

            const businesses = await prisma.business.findMany({
                where: {
                    id: businessId,
                    userId,
                },
                select: { id: true },
            });

            if (businesses.length === 0) {
                throw new Error("Business not found");
            }


            const result = await prisma.$transaction(async (tx) => {
                await tx.businessDataSource.createMany({
                    data: inputs.map((input) => ({
                        businessId: businessId!,
                        sourceType: input.sourceType,
                        url: input.url,
                        scrapedAt: input.scrapedAt ?? null,
                    })),
                });

                return tx.businessDataSource.findMany({
                    where: {
                        businessId,
                    },
                });
            });
            result.forEach(async (dataSource) => {
                if (dataSource.sourceType === "google") {
                    console.log("adding google business link to queue", dataSource.url);
                    await businessLinksQueue.add("google_business_link", { url: dataSource.url, dataSourceId: dataSource.id });
                    await googleImagesQueue.add("google_images", { url: dataSource.url, businessId });
                } else if (dataSource.sourceType === "instagram") {
                    console.log("adding instagram link to queue", dataSource.url);
                    await instagramQueue.add("instagram_link", { url: dataSource.url, dataSourceId: dataSource.id });
                }
            })
            return result;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Internal Server Error";
            if (message.startsWith("Invalid ") || message === "Business not found") {
                throw new Error(message);
            }

            throw new Error("Failed to initialize business data sources");
        }
    }

    async initCreateCompetitorQuery(userId: string, businessId: string, query?: string) {
        try {
            const business = await prisma.business.findUnique({
                where: {
                    id: businessId,
                    userId,
                },
                select: {
                    id: true,
                    category: true,
                    address: true,
                },
            });
            if (!business) {
                throw new Error("Business not found");
            }
            if (!business.address) {
                throw new Error("Business address not found");
            }
            if (!query) {
                query = createCompetitorQuery(business.category.name, business.address.address);
            }
            await businessLinksQueue.add("google_business_competitors", { query, businessId: business.id })
            return true;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to initialize create competitor query");
        }
    }
    async getCategory() {
        const categories = await prisma.businessCategory.findMany({
            where: {
                parent: null
            },
            include: {
                children: true
            }
        })
        if (!categories) {
            throw new Error("Something went wrong while fetching categories")
        }
        return categories
    }
}

