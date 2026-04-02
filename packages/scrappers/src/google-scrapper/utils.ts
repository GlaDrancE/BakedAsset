import { chromium } from "playwright";

/** Set `PLAYWRIGHT_HEADED=1` to open a visible browser (same idea as `npx playwright test --headed`). */
export const createBrowser = async () => {
    const headed = process.env.PLAYWRIGHT_HEADED === "1" || process.env.PLAYWRIGHT_HEADED === "true";
    return await chromium.launch({
        headless: false,
    });
};
export const isGoogleMapsUrl = (input: string) => {
    try {
        const parsed = new URL(input);
        const host = parsed.hostname.toLowerCase();

        // Accept direct Google Maps links (full URLs and short-link redirects).
        const isGoogleDomain = host === "google.com" || host === "www.google.com" || host.endsWith(".google.com");

        return host === "maps.app.goo.gl" || host === "maps.google.com" || (isGoogleDomain && parsed.pathname.startsWith("/maps"));
    } catch {
        return false;
    }
}

export const isValidImage = (url: string) => {
    return url.includes("googleusercontent") && !url.includes("=s32");
}
