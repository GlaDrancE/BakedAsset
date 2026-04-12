import { client } from "../config.ts";
// Ignore it for MVP version
// TODO: Complete this instagram scraper for images.
export const getImagesFromInstagram = async (url: string) => {

    const input = {
        startUrls: [
            {
                url,
            },
        ],
        maxImages: 10, // limit to control cost
    };

    const run = await client.actor("apify/instagram-scraper").call(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items.length) return [];

    return items.map((item: any) => item.imageUrls);
}