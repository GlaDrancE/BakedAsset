import { Queue, QueueEvents } from 'bullmq';

export const businessLinksQueue = new Queue('business_links');

export const instagramQueue = new Queue('instagram');

export const googleImagesQueue = new Queue("google_images");