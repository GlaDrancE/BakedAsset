import 'express';

declare global {
    namespace Express {
        interface Request {
            auth: { userId: string };
            language?: 'en' | 'es' | 'it';
        }
    }
}