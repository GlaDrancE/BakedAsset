// combine all the utils into a single function
import { createBrowser } from './utils.ts'
import { searchBusiness } from './search.ts'
import { extractProfile } from './profile.ts'
import { extractReviews } from './review.ts'
import { isGoogleMapsUrl } from './utils.ts'
import { searchCompetitors } from './competitor-search.ts'



export const scrapGoogleBusiness = async (query: string, dataSourceId: string) => {
    const browser = await createBrowser();
    const page = await browser.newPage();

    try {
        const normalizedQuery = query.trim();

        if (isGoogleMapsUrl(normalizedQuery)) {
            await page.goto(normalizedQuery, { waitUntil: "domcontentloaded" });
            await page.waitForTimeout(3000);

            const profile = await extractProfile(page);

            const reviews = await extractReviews(page, 10)

            return {
                dataSourceId,
                ...profile,
                reviews
            }

        } else {
            await searchBusiness(page, normalizedQuery)
            const competitors = await searchCompetitors(page, 5)
            return {
                dataSourceId,
                ...competitors,
            }

        }
    } catch (error) {
        console.error(error)
        throw error
    } finally {
        await page.close().catch(() => null);
        await browser.close().catch(() => null);
    }
}