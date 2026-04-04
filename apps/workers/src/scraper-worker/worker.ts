import { Worker } from "bullmq";
import IORedis from 'ioredis';
import { scrapGoogleBusiness, scrapInstagram } from "@repo/scrappers";
import { storeGoogleBusinessDetailsInDb } from "../queries/store-gbm";
import { storeGoogleBusinessCompetitorsInDb } from "../queries/store-competitor";
import { storeInstagramProfileInDb } from "../queries/store-instagram";

const connection = new IORedis({ maxRetriesPerRequest: null })
// TODO: add queue name into label
export const worker = new Worker("business_links", async (job) => {
    try {
        const query = (job.data?.url ?? job.data?.query ?? "").trim();

        if (!query) {
            throw new Error("Missing query/url in job payload");
        }

        scrapGoogleBusiness(query, job.data?.dataSourceId, job.data?.businessId).then(async result => {
            if (job.data?.url) {
                await storeGoogleBusinessDetailsInDb(result, job.data.dataSourceId)
            } else if (job.data?.query) {
                console.log(result)
                await storeGoogleBusinessCompetitorsInDb(result.competitors, job.data.businessId)
            }
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


export const instagramWorker = new Worker('instagram', async (job) => {
    try {
        const url = (job.data?.url ?? "").trim();

        if (!url) {
            throw new Error("Missing username in job payload");
        }

        await scrapInstagram(url).then(async result => {
            await storeInstagramProfileInDb(result, job.data?.dataSourceId)
        }).catch(error => {
            console.error(error)
            throw error
        })

    } catch (error) {
        console.error(error)
        throw error
    }
}, { connection })