/*
  Warnings:

  - You are about to drop the column `address` on the `businesses` table. All the data in the column will be lost.
  - The `language` column on the `businesses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'FRENCH', 'GERMAN', 'ITALIAN', 'PORTUGUESE', 'RUSSIAN', 'CHINESE');

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "address",
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'ENGLISH';

-- CreateTable
CREATE TABLE "business_addresses" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_addresses_business_id_key" ON "business_addresses"("business_id");

-- CreateIndex
CREATE INDEX "business_addresses_business_id_idx" ON "business_addresses"("business_id");

-- AddForeignKey
ALTER TABLE "business_addresses" ADD CONSTRAINT "business_addresses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
