import { extractProfile } from "./profile.ts";

export type { InstagramPost, InstagramProfile } from "./profile.ts";
import { openInstagramProfile } from "./search.ts";
import { createBrowser } from "./utils.ts";

export const scrapInstagram = async (url: string) => {
    const browser = await createBrowser();
    const page = await browser.newPage();
    try {

        await openInstagramProfile(page, url);
        const profile = await extractProfile(page);
        return profile;
    } catch (error) {
        console.error(error);
    } finally {
        await page.close().catch(() => null);
        await browser.close().catch(() => null);
    }
}