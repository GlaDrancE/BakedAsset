// This will search for the page using playwright
export async function searchBusiness(page: any, query: string) {
    const response = await page.goto("https://www.google.com/maps");

    // Omnibox has no placeholder; label "Search Google Maps" is wired via for/id (e.g. for="ucc-1").
    const omnibox = page.getByLabel("Search Google Maps");
    await omnibox.waitFor({ state: "visible" });

    await omnibox.fill(query);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000);

}