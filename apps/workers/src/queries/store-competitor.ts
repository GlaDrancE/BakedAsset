import { prisma } from '@repo/db';

const extractNumber = (value: unknown): number | null => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;
    const match = value.match(/-?\d+(?:\.\d+)?/);
    return match ? parseInt(match[0]) : null;
};

export const storeGoogleBusinessCompetitorsInDb = async (competitors: any, businessId: string) => {
    console.log(competitors)

    try {
        await prisma.competitor.createMany({
            data: competitors.map((competitor: any) => ({
                businessId: businessId,
                name: competitor.name,
                googlePlaceId: competitor.googlePlaceId,
                rating: competitor.rating ? parseFloat(competitor.rating) : null,
                reviewCount: extractNumber(competitor.reviewCount),
                address: competitor.address,
                website: competitor.website,
            })),
        });
    } catch (error) {
        throw error;
    }
}