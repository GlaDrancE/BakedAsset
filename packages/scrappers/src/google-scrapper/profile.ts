// extract information on the page, like name, address, phone, website, etc.
export async function extractProfile(page: any) {
    // Side-panel place title (spans inside); generic `h1` matches unrelated headings on the page.
    const name = await page.locator("h1.DUwDvf").first().innerText();

    // Same summary row as the title: .F7nice holds numeric rating + "(N)" reviews; avoid other listings' stars.
    const placeSummary = page
        .locator(".lMbq3e")
        .filter({ has: page.locator("h1.DUwDvf") })
        .locator(".F7nice")
        .first();

    const rating = await placeSummary.locator("span[aria-hidden='true']").first().innerText().catch(() => null);

    const reviewCount = await placeSummary
        .locator('span[role="img"][aria-label*="reviews"]')
        .first()
        .innerText()
        .catch(() => null);

    const address = await page.locator('button[data-item-id="address"]').innerText().catch(() => null);

    // Business hours come from an expandable dropdown that renders a weekly table.
    // In your provided HTML, each day row has:
    // - day: `td.ylH6lf div`
    // - hours: `td.mxowUb[role="text"]` (visual value is typically `ul li`, and aria-label is like "8 am to 8:30 pm")
    const businessHours = await (async () => {
        // Prefer the toggle if it exists.
        const directToggle = page.locator('button[data-item-id="business_hours"]');
        if ((await directToggle.count()) > 0) {
            await directToggle.first().click().catch(() => null);
        } else {
            // Fallback: accessible "Hours" control (works on some Maps layouts).
            const hoursToggle = page.getByRole("button", { name: /hours/i });
            if ((await hoursToggle.count()) > 0) {
                await hoursToggle.first().click().catch(() => null);
            }
        }

        const rows = page.locator("table.eK4R0e tbody tr");
        const rowCount = await rows.count();
        if (rowCount === 0) return null;

        const weekly: Array<{ day: string; hours: string }> = [];
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);

            const day = await row.locator("td.ylH6lf div").first().innerText().catch(() => null);
            if (!day) continue;

            const hoursFromLi = await row
                .locator('td.mxowUb[role="text"] ul li')
                .first()
                .innerText()
                .catch(() => null);

            const hoursFromAria = await row
                .locator('td.mxowUb[role="text"]')
                .getAttribute("aria-label")
                .catch(() => null);

            const hours = (hoursFromLi ?? hoursFromAria ?? "").trim();
            if (!hours) continue;

            weekly.push({ day: day.trim(), hours });
        }

        return weekly.length > 0 ? { weekly } : null;
    })();

    const bio = await page.locator('button[data-item-id="bio"]').innerText().catch(() => null);

    const phone = await page.locator('button[data-item-id^="phone"]').innerText().catch(() => null);

    // Google Maps: the "Website:" entry is rendered as an <a> with aria-label like:
    //   aria-label="Website: idealacademyofscience.org "
    // We want the actual website URL (the anchor's `href`), not "Copy website" buttons.
    const rawWebsite =
        (await page
            .locator('a[href][aria-label^="Website:" i]')
            .first()
            .getAttribute("href")
            .catch(() => null)) ?? null;

    // Fallback for layouts where "Website:" isn't exposed but "Open website" is.
    const fallbackWebsite =
        (await page
            .locator('a[href][aria-label^="Open website" i]')
            .first()
            .getAttribute("href")
            .catch(() => null)) ?? null;

    const website = (rawWebsite ?? fallbackWebsite)?.trim() ?? null;

    return {
        name,
        rating,
        reviewCount,
        address,
        businessHours,
        bio,
        phone,
        website
    };
}