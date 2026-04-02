import { isValidImage } from "./utils.ts";
import { uploadBucket } from "@repo/common";
// extract images from the page
async function downloadImage(url: string) {
    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch image");

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
function isValidBuffer(buffer: Buffer) {
    return buffer.length > 10_000; // ignore tiny images
}

function generateKey(businessId: string, index: number) {
    return `business/${businessId}/images/${Date.now()}_${index}.jpg`;
}
export const extractImages = async (page: any, businessId: string) => {
    const urls = await page.locator('img').evaluateAll((imgs: any) =>
        imgs.map((img: any) => img.src)
    );

    const filtered = urls.filter(isValidImage).slice(0, 10);

    const uploadedImages = [];

    for (let i = 0; i < filtered.length; i++) {
        try {
            const buffer = await downloadImage(filtered[i]);

            if (!isValidBuffer(buffer)) continue;

            const key = generateKey(businessId, i);

            const url = await uploadBucket(buffer, key);

            uploadedImages.push({
                original_url: filtered[i],
                storage_url: url,
            });

        } catch (err) {
            console.error("Image failed:", err);
        }
    }

    return uploadedImages;
}