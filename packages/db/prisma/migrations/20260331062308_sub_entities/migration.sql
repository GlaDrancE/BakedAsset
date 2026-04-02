-- CreateTable
CREATE TABLE "faculty_members" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "photo_asset_id" UUID,
    "qualification" TEXT NOT NULL,
    "specialization" TEXT[],
    "experience_years" INTEGER NOT NULL,
    "achievement" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "ai_positioning_note" TEXT,

    CONSTRAINT "faculty_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "photo_asset_id" UUID,
    "qualification" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "services_offered" TEXT[],
    "consultation_fee_range" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "ai_positioning_note" TEXT,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "photo_asset_id" UUID,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "is_bestseller" BOOLEAN NOT NULL DEFAULT false,
    "is_vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "ai_positioning_note" TEXT,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salon_services" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "photo_asset_id" UUID,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "duration_minutes" TEXT,
    "price_range" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "ai_positioning_note" TEXT,

    CONSTRAINT "salon_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "faculty_members_business_id_idx" ON "faculty_members"("business_id");

-- CreateIndex
CREATE INDEX "faculty_members_photo_asset_id_idx" ON "faculty_members"("photo_asset_id");

-- CreateIndex
CREATE INDEX "doctors_business_id_idx" ON "doctors"("business_id");

-- CreateIndex
CREATE INDEX "doctors_photo_asset_id_idx" ON "doctors"("photo_asset_id");

-- CreateIndex
CREATE INDEX "menu_items_business_id_idx" ON "menu_items"("business_id");

-- CreateIndex
CREATE INDEX "menu_items_photo_asset_id_idx" ON "menu_items"("photo_asset_id");

-- CreateIndex
CREATE INDEX "salon_services_business_id_idx" ON "salon_services"("business_id");

-- CreateIndex
CREATE INDEX "salon_services_photo_asset_id_idx" ON "salon_services"("photo_asset_id");

-- AddForeignKey
ALTER TABLE "faculty_members" ADD CONSTRAINT "faculty_members_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_members" ADD CONSTRAINT "faculty_members_photo_asset_id_fkey" FOREIGN KEY ("photo_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_photo_asset_id_fkey" FOREIGN KEY ("photo_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_photo_asset_id_fkey" FOREIGN KEY ("photo_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon_services" ADD CONSTRAINT "salon_services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon_services" ADD CONSTRAINT "salon_services_photo_asset_id_fkey" FOREIGN KEY ("photo_asset_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
