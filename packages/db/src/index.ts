import { PrismaClient } from "./generated/prisma/client.ts";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL as string)
export const prisma = new PrismaClient({
    adapter,
})
