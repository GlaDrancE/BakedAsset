import { imageSize } from "image-size";
import { getImagesFromGoogleMaps } from "./google-scraper.ts";
import { uploadBucket } from "@repo/common";

const generateKey = (businessId: string, index: number) => {
    return `business/${businessId}/images/${Date.now()}_${index}.jpg`;
}
export const scrapeAndStoreGoogleImages = async (url: string, businessId: string) => {
    const images = await getImagesFromGoogleMaps(url);
    console.log("Images fetched...")
    const uploadedImages = await Promise.all(images.map(async (imageUrl, i) => {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");
        const buffer = Buffer.from(await response.arrayBuffer());
        const { width, height } = imageSize(buffer);
        const storagePath = generateKey(businessId, i);
        const publicUrl = await uploadBucket(buffer, storagePath);
        return { publicUrl, storagePath, width, height };
    }));
    return uploadedImages;
}