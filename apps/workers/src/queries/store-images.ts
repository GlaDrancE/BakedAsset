import { prisma } from "@repo/db";
export const storeImagesInDb = async (uploadedImages: any, businessId: string) => {
    try {
        const mediaAssets = await prisma.mediaAsset.createMany({
            data: uploadedImages.map((row: any) => ({
                businessId,
                source: "google",
                originalUrl: row.publicUrl,
                storagePath: row.storagePath,
                fileType: "image/jpeg",
                status: "raw",
                width: row.width,
                height: row.height,
            })),
        });
        return mediaAssets;
    } catch (error) {
        throw error;
    }
}