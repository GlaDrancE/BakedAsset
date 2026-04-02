import { Worker } from "bullmq";
import IORedis from 'ioredis';
import { scrapGoogleBusiness } from "@repo/scrappers";
import { storeGoogleBusinessDetailsInDb } from "../queries/store-gbm";

const connection = new IORedis({ maxRetriesPerRequest: null })
// TODO: add queue name into label
export const worker = new Worker("business_links", async (job) => {
    try {
        console.log("worker started", job.data);
        const query = (job.data?.url ?? job.data?.query ?? "").trim();

        if (!query) {
            throw new Error("Missing query/url in job payload");
        }

        scrapGoogleBusiness(query, job.data.dataSourceId).then(async result => {
            await storeGoogleBusinessDetailsInDb(result, job.data.dataSourceId)
            return result
        }).catch(error => {
            console.error(error)
            throw error
        })

    } catch (error) {
        console.error(error)
    }
}, { connection })

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err?.message}`);
});