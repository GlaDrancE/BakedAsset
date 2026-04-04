import { chromium } from "playwright";
export const createBrowser = async () => {
    const headed = process.env.PLAYWRIGHT_HEADED === "1" || process.env.PLAYWRIGHT_HEADED === "true";
    return await chromium.launch({
        headless: false,
    });
}