import { prisma } from "@repo/db"

export const storeInstagramProfileInDb = async (profile: any, dataSourceId: string) => {
    try {
        const { biography, posts } = profile;
        if (!dataSourceId) {
            throw new Error("DataSourceId is required");
        }
        const scrapedProfile = await prisma.scrapedProfile.create({
            data: {
                dataSourceId: dataSourceId,
                bio: biography,
                rawData: posts
            }
        })
        return scrapedProfile;
    } catch (error) {
        throw error;
    }
}