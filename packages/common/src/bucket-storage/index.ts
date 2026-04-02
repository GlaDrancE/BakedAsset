import cloudinary from 'cloudinary'
import { cloudinaryConfig } from '@repo/config'

cloudinary.v2.config(cloudinaryConfig);

export const uploadBucket = async (buffer: Buffer, key: string) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                { public_id: key },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                }
            );

            stream.end(buffer);
        });
        return (result as any).secure_url;
    } catch (error) {
        throw error;
    }
}