import { prisma } from "@repo/db";

export class BusinessContextService {
    async getBusinessContext(businessId: string) {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: {
                category: true,
                address: true,
            },
        });
        return business;
    }
    async getScrappedDetails(businessId: string) {
        const scrappedDetails = await prisma.scrapedProfile.findMany({
            where: { dataSource: { businessId } },
            include: {
                reviews: true,
                dataSource: true,
            },
        });
        return scrappedDetails;
    }
    async getCompetitors(businessId: string) {
        const competitors = await prisma.competitor.findMany({
            where: {
                businessId
            }
        })
        return competitors;
    }
}

