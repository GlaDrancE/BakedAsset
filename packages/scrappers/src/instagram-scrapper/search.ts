import type { Page } from "playwright";

/** Strip @, trailing slashes, and surrounding whitespace from a handle or URL fragment. */
export function normalizeInstagramUsername(input: string): string {
    let s = input.trim();
    const asUrl = s.match(/instagram\.com\/([^/?#]+)/i);
    if (asUrl?.[1]) s = asUrl[1];
    s = s.replace(/^@/, "").replace(/\/+$/, "");
    return s;
}

/**
 * Open a single public profile: `https://www.instagram.com/{username}/`.
 * Parsing (name, bio, avatar, followers) belongs in `profile.ts`.
 */
export async function openInstagramProfile(page: Page, url: string): Promise<void> {
    url = url.trim();
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });
    // Grid links load after hydration; without this, post extraction often sees an empty DOM.
    await page
        .waitForSelector('a[href*="/p/"], a[href*="/reel/"]', { timeout: 25_000 })
        .catch(() => null);
}
