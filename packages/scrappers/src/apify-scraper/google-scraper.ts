import { client } from "../config.ts";
export async function getImagesFromGoogleMaps(url: string) {

    const input = {
        startUrls: [
            {
                url,
            },
        ],
        maxImages: 50, // limit to control cost
        includeReviews: false,
        includeOpeningHours: false,
    };

    const run = await client
        .actor("compass/crawler-google-places")
        .call(input);

    const { items } = await client
        .dataset(run.defaultDatasetId)
        .listItems();

    if (!items.length) return [];

    const place = items[0];

    return (place?.imageUrls as string[] || []).filter(Boolean);
}
