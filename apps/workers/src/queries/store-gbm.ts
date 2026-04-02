import { prisma } from '@repo/db'
export const storeGoogleBusinessDetailsInDb = async (details: any, dataSourceId: string) => {
    try {
        const { rating, reviewCount, businessHours, bio, number, reviews } = details;
        await prisma.scrapedProfile.create({
            data: {
                dataSourceId,
                rating: rating ? parseFloat(rating) : null,
                reviewCount: reviewCount ? parseInt(reviewCount) : null,
                businessHours,
            }
        })
    } catch (error) {
        throw error;
    }
}