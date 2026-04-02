
async function extractReviewBodyText(el: any): Promise<string | null> {
    const scrub = (s: string) =>
        s
            .replace(/\s*More\s*$/i, "")
            .replace(/\s*See less\s*$/i, "")
            .trim();

    const fromSpan = await el
        .locator(".MyEned")
        .first()
        .locator(".wiI7pd")
        .first()
        .innerText({ timeout: 5000 })
        .catch(() => null);
    if (fromSpan?.trim()) return scrub(fromSpan);

    const fromBlock = await el.locator(".MyEned").first().innerText({ timeout: 5000 }).catch(() => null);
    if (fromBlock?.trim()) return scrub(fromBlock);

    const fallback = await el.locator(".wiI7pd").first().innerText({ timeout: 5000 }).catch(() => null);
    if (fallback?.trim()) return scrub(fallback);

    const textContent = await el
        .locator(".MyEned")
        .first()
        .evaluate((n: HTMLElement) => n?.textContent ?? "")
        .catch(() => "");
    if (textContent.trim()) return scrub(textContent);

    return null;
}

export async function extractReviews(page: any, limit = 30) {
    // Footer control: aria-label is "More reviews (N)"; jsaction ids like pane.wfvdle148 are unstable.
    await page.getByRole("button", { name: /More reviews\s*\(/i }).click();
    await page.waitForTimeout(3000);

    const reviews = [];

    while (reviews.length < limit) {
        const reviewElements = await page.locator('.jftiEf').all();

        for (const el of reviewElements) {
            const expand = el.getByRole("button", { name: /see more/i });
            if ((await expand.count()) > 0) {
                await expand.first().click({ timeout: 3000 }).catch(() => null);
                await page.waitForTimeout(400);
            }

            const text = await extractReviewBodyText(el);
            const author = await el.locator(".d4r55").first().innerText().catch(() => null);

            reviews.push({ author, text });

            if (reviews.length >= limit) break;
        }

        await page.mouse.wheel(0, 2000);
        await page.waitForTimeout(1500);
    }

    return reviews;
}