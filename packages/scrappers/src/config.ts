import { ApifyClient } from 'apify-client';
import "dotenv/config";

export const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});