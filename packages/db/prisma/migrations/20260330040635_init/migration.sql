-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" UUID,
    "cta_type" TEXT NOT NULL,
    "sitemap_template" JSONB NOT NULL,

    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "language" TEXT NOT NULL,
    "positioning_tier" TEXT NOT NULL,
    "positioning_detail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_data_sources" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "source_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scraped_at" TIMESTAMP(3),

    CONSTRAINT "business_data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped_profiles" (
    "id" UUID NOT NULL,
    "data_source_id" UUID NOT NULL,
    "rating" DOUBLE PRECISION,
    "review_count" INTEGER,
    "business_hours" JSONB,
    "bio" TEXT,
    "raw_data" JSONB,
    "scraped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraped_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_reviews" (
    "id" UUID NOT NULL,
    "scraped_profile_id" UUID NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "business_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "google_place_id" TEXT,
    "rating" DOUBLE PRECISION,
    "review_count" INTEGER,
    "address" TEXT,
    "website" TEXT,
    "raw_data" JSONB,
    "discovered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_signal_profile" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "key_strengths" TEXT[],
    "customer_intent" TEXT NOT NULL,
    "price_positioning" TEXT NOT NULL,
    "urgency_triggers" TEXT[],
    "trust_signals" TEXT[],
    "local_seo_keywords" TEXT[],
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_signal_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_insights" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "common_complaints" TEXT[],
    "common_strengths" TEXT[],
    "market_gap" TEXT NOT NULL,
    "positioning_gap" TEXT NOT NULL,
    "avg_competitor_rating" DOUBLE PRECISION,
    "competitors_analyzed" INTEGER NOT NULL,
    "analyzed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitor_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_strategies" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "signal_profile_id" UUID NOT NULL,
    "competitor_insight_id" UUID NOT NULL,
    "positioning_strategy" TEXT NOT NULL,
    "differentiation_angle" TEXT NOT NULL,
    "primary_value_prop" TEXT NOT NULL,
    "trust_drivers" TEXT[],
    "content_priority" TEXT[],
    "cta_primary" TEXT NOT NULL,
    "cta_secondary" TEXT,
    "target_audience_profile" TEXT NOT NULL,
    "urgency_triggers" TEXT[],
    "decided_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "storage_path" TEXT,
    "file_type" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'raw',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_images" (
    "id" UUID NOT NULL,
    "media_asset_id" UUID NOT NULL,
    "operation" TEXT NOT NULL,
    "output_path" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_pages" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "meta_description" TEXT,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "website_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_section_schemas" (
    "id" UUID NOT NULL,
    "section_type" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "json_schema" JSONB NOT NULL,
    "required_fields" TEXT[],
    "optional_fields" TEXT[],

    CONSTRAINT "website_section_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_sections" (
    "id" UUID NOT NULL,
    "website_page_id" UUID NOT NULL,
    "section_schema_id" UUID NOT NULL,
    "section_type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "processed_image_ids" UUID[],
    "display_order" INTEGER NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "validation_passed" BOOLEAN NOT NULL DEFAULT false,
    "validation_errors" TEXT[],

    CONSTRAINT "website_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_generations" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "iteration_number" INTEGER NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "overall_score" DOUBLE PRECISION,
    "passed_threshold" BOOLEAN NOT NULL DEFAULT false,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_change_log" (
    "id" UUID NOT NULL,
    "website_generation_id" UUID NOT NULL,
    "website_section_id" UUID NOT NULL,
    "website_page_id" UUID NOT NULL,
    "change_reason" TEXT NOT NULL,
    "triggered_by" TEXT NOT NULL,
    "previous_content" JSONB NOT NULL,
    "new_content" JSONB NOT NULL,
    "score_dimensions_failed" TEXT[],
    "score_before" DOUBLE PRECISION,
    "score_after" DOUBLE PRECISION,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "section_change_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_review_scores" (
    "id" UUID NOT NULL,
    "website_generation_id" UUID NOT NULL,
    "clarity_score" DOUBLE PRECISION NOT NULL,
    "trust_score" DOUBLE PRECISION NOT NULL,
    "visual_score" DOUBLE PRECISION NOT NULL,
    "conversion_score" DOUBLE PRECISION NOT NULL,
    "seo_score" DOUBLE PRECISION NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "failed_checks" TEXT[],
    "iteration_recommendations" TEXT[],
    "passed_threshold" BOOLEAN NOT NULL DEFAULT false,
    "scored_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_review_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_details" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "sub_type" TEXT NOT NULL,
    "experience_type" TEXT NOT NULL,
    "service_speed" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "cuisine_types" TEXT[],
    "avg_price_for_two" INTEGER,
    "has_delivery" BOOLEAN NOT NULL DEFAULT false,
    "delivery_platforms" TEXT[],
    "menu_highlights" TEXT[],
    "special_offerings" TEXT[],
    "accepts_reservation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "restaurant_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_details" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "clinic_type" TEXT NOT NULL,
    "specialty" TEXT,
    "doctor_name" TEXT NOT NULL,
    "qualification" TEXT,
    "experience_years" INTEGER,
    "appointment_type" TEXT NOT NULL,
    "target_patient" TEXT NOT NULL,
    "services" TEXT[],
    "insurance_accepted" BOOLEAN NOT NULL DEFAULT false,
    "consultation_fee_range" TEXT,
    "has_diagnostic_lab" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clinic_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salon_details" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "salon_type" TEXT NOT NULL,
    "price_range" TEXT NOT NULL,
    "target_customer" TEXT NOT NULL,
    "ambiance_type" TEXT NOT NULL,
    "services" TEXT[],
    "has_bridal_package" BOOLEAN NOT NULL DEFAULT false,
    "appointment_required" BOOLEAN NOT NULL DEFAULT false,
    "has_trained_stylists" BOOLEAN NOT NULL DEFAULT false,
    "specialty_treatments" TEXT[],

    CONSTRAINT "salon_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaching_details" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "coaching_type" TEXT NOT NULL,
    "subjects" TEXT[],
    "target_grades" TEXT[],
    "exam_focus" TEXT[],
    "batch_types" TEXT[],
    "demo_class_available" BOOLEAN NOT NULL DEFAULT false,
    "result_track_record" TEXT,
    "students_per_batch" INTEGER,
    "faculty_count" INTEGER,
    "fee_range" TEXT,
    "has_online_mode" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "coaching_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_categories_slug_key" ON "business_categories"("slug");

-- CreateIndex
CREATE INDEX "business_categories_parent_id_idx" ON "business_categories"("parent_id");

-- CreateIndex
CREATE INDEX "businesses_user_id_idx" ON "businesses"("user_id");

-- CreateIndex
CREATE INDEX "businesses_category_id_idx" ON "businesses"("category_id");

-- CreateIndex
CREATE INDEX "business_data_sources_business_id_idx" ON "business_data_sources"("business_id");

-- CreateIndex
CREATE INDEX "scraped_profiles_data_source_id_idx" ON "scraped_profiles"("data_source_id");

-- CreateIndex
CREATE INDEX "business_reviews_scraped_profile_id_idx" ON "business_reviews"("scraped_profile_id");

-- CreateIndex
CREATE INDEX "competitors_business_id_idx" ON "competitors"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_signal_profile_business_id_key" ON "business_signal_profile"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_insights_business_id_key" ON "competitor_insights"("business_id");

-- CreateIndex
CREATE INDEX "business_strategies_business_id_idx" ON "business_strategies"("business_id");

-- CreateIndex
CREATE INDEX "business_strategies_signal_profile_id_idx" ON "business_strategies"("signal_profile_id");

-- CreateIndex
CREATE INDEX "business_strategies_competitor_insight_id_idx" ON "business_strategies"("competitor_insight_id");

-- CreateIndex
CREATE INDEX "media_assets_business_id_idx" ON "media_assets"("business_id");

-- CreateIndex
CREATE INDEX "processed_images_media_asset_id_idx" ON "processed_images"("media_asset_id");

-- CreateIndex
CREATE INDEX "website_pages_business_id_idx" ON "website_pages"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "website_pages_business_id_slug_key" ON "website_pages"("business_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "website_section_schemas_section_type_version_key" ON "website_section_schemas"("section_type", "version");

-- CreateIndex
CREATE INDEX "website_sections_website_page_id_idx" ON "website_sections"("website_page_id");

-- CreateIndex
CREATE INDEX "website_sections_section_schema_id_idx" ON "website_sections"("section_schema_id");

-- CreateIndex
CREATE INDEX "website_generations_business_id_idx" ON "website_generations"("business_id");

-- CreateIndex
CREATE INDEX "section_change_log_website_generation_id_idx" ON "section_change_log"("website_generation_id");

-- CreateIndex
CREATE INDEX "section_change_log_website_section_id_idx" ON "section_change_log"("website_section_id");

-- CreateIndex
CREATE INDEX "section_change_log_website_page_id_idx" ON "section_change_log"("website_page_id");

-- CreateIndex
CREATE INDEX "website_review_scores_website_generation_id_idx" ON "website_review_scores"("website_generation_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_details_business_id_key" ON "restaurant_details"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_details_business_id_key" ON "clinic_details"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "salon_details_business_id_key" ON "salon_details"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "coaching_details_business_id_key" ON "coaching_details"("business_id");

-- AddForeignKey
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "business_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "business_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_data_sources" ADD CONSTRAINT "business_data_sources_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_profiles" ADD CONSTRAINT "scraped_profiles_data_source_id_fkey" FOREIGN KEY ("data_source_id") REFERENCES "business_data_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_reviews" ADD CONSTRAINT "business_reviews_scraped_profile_id_fkey" FOREIGN KEY ("scraped_profile_id") REFERENCES "scraped_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_signal_profile" ADD CONSTRAINT "business_signal_profile_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_insights" ADD CONSTRAINT "competitor_insights_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_strategies" ADD CONSTRAINT "business_strategies_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_strategies" ADD CONSTRAINT "business_strategies_signal_profile_id_fkey" FOREIGN KEY ("signal_profile_id") REFERENCES "business_signal_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_strategies" ADD CONSTRAINT "business_strategies_competitor_insight_id_fkey" FOREIGN KEY ("competitor_insight_id") REFERENCES "competitor_insights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_images" ADD CONSTRAINT "processed_images_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_pages" ADD CONSTRAINT "website_pages_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_sections" ADD CONSTRAINT "website_sections_website_page_id_fkey" FOREIGN KEY ("website_page_id") REFERENCES "website_pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_sections" ADD CONSTRAINT "website_sections_section_schema_id_fkey" FOREIGN KEY ("section_schema_id") REFERENCES "website_section_schemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_generations" ADD CONSTRAINT "website_generations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_change_log" ADD CONSTRAINT "section_change_log_website_generation_id_fkey" FOREIGN KEY ("website_generation_id") REFERENCES "website_generations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_change_log" ADD CONSTRAINT "section_change_log_website_section_id_fkey" FOREIGN KEY ("website_section_id") REFERENCES "website_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_change_log" ADD CONSTRAINT "section_change_log_website_page_id_fkey" FOREIGN KEY ("website_page_id") REFERENCES "website_pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_review_scores" ADD CONSTRAINT "website_review_scores_website_generation_id_fkey" FOREIGN KEY ("website_generation_id") REFERENCES "website_generations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_details" ADD CONSTRAINT "restaurant_details_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_details" ADD CONSTRAINT "clinic_details_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon_details" ADD CONSTRAINT "salon_details_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_details" ADD CONSTRAINT "coaching_details_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
