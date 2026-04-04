import { prisma } from '@repo/db'
export const storeGoogleBusinessDetailsInDb = async (details: any, dataSourceId: string) => {
    try {
        const { rating, reviewCount, businessHours, bio, number, reviews } = details;
        const scrapedProfile = await prisma.scrapedProfile.create({
            data: {
                dataSourceId,
                rating: rating ? parseFloat(rating) : null,
                reviewCount: reviewCount ? parseInt(reviewCount) : null,
                businessHours,
            }
        })
        await prisma.businessReview.createMany({
            data: reviews.map((review: any) => (
                {
                    scrapedProfileId: scrapedProfile.id,
                    author: review.author,
                    content: review.text,
                    source: "google"
                }
            ))
        })
    } catch (error) {
        throw error;
    }
}