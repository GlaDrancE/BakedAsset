import { extractProfile } from "./profile.ts";
import { extractReviews } from "./review.ts";

export const searchCompetitors = async (page: any, topN: number = 5) => {

    const competitors = [];
    let prevTitle = await page.locator("h1.DUwDvf").first().innerText().catch(() => "");


    for (let i = 0; i < topN; i++) {
        // Re-query each iteration to avoid stale/updated locators
        const resultsNow = page.locator('.Nv2PK');

        // scroll into view in case list is scrollable
        await resultsNow.nth(i).scrollIntoViewIfNeeded();

        await resultsNow.nth(i).click();

        // wait for side panel to update
        await page.waitForFunction(
            (old: any) => {
                const el = document.querySelector("h1.DUwDvf");
                return el && el.textContent && el.textContent.trim() !== old;
            },
            prevTitle
        );

        prevTitle = await page.locator("h1.DUwDvf").first().innerText().catch(() => "");

        const profile = await extractProfile(page);

        // Important: ensure you’re on the Reviews tab before extractReviews(...)
        // e.g. page.getByRole("tab", { name: /Reviews/i }).click()

        const reviews = await extractReviews(page, 30);

        competitors.push({ ...profile, reviews });
    }
    return competitors;
}