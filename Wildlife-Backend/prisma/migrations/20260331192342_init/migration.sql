-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CONSERVATIONIST', 'RESEARCHER');

-- CreateEnum
CREATE TYPE "ConservationStatus" AS ENUM ('CRITICALLY_ENDANGERED', 'ENDANGERED', 'VULNERABLE', 'NEAR_THREATENED', 'LEAST_CONCERN', 'DATA_DEFICIENT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('PATROL', 'WILDLIFE_SIGHTING', 'ILLEGAL_ACTIVITY', 'FOREST_FIRE', 'RESCUE_OPERATION', 'RESEARCH_SURVEY', 'AWARENESS_PROGRAM');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CONSERVATIONIST',
    "avatar" TEXT,
    "phone" TEXT,
    "organization" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT,
    "organizationType" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "verifiedBy" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "documents" TEXT[],
    "notes" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "area" DOUBLE PRECISION,
    "forestType" TEXT,
    "altitude" DOUBLE PRECISION,
    "climate" TEXT,
    "biodiversity" TEXT,
    "threats" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "commonName" TEXT,
    "category" TEXT NOT NULL,
    "conservationStatus" "ConservationStatus" NOT NULL,
    "population" INTEGER,
    "habitat" TEXT,
    "threats" TEXT[],
    "imageUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ActivityType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationId" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "participantId" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "images" TEXT[],
    "findings" TEXT,
    "actionTaken" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitoring_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species_reports" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "images" TEXT[],
    "location" TEXT,
    "behavior" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "locationId" TEXT,

    CONSTRAINT "species_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_reports" (
    "id" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "threats" TEXT[],
    "images" TEXT[],
    "notes" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "participants_email_key" ON "participants"("email");

-- CreateIndex
CREATE INDEX "participants_status_idx" ON "participants"("status");

-- CreateIndex
CREATE INDEX "participants_city_idx" ON "participants"("city");

-- CreateIndex
CREATE INDEX "locations_name_idx" ON "locations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "species_name_key" ON "species"("name");

-- CreateIndex
CREATE INDEX "species_name_idx" ON "species"("name");

-- CreateIndex
CREATE INDEX "species_conservationStatus_idx" ON "species"("conservationStatus");

-- CreateIndex
CREATE INDEX "monitoring_activities_date_idx" ON "monitoring_activities"("date");

-- CreateIndex
CREATE INDEX "monitoring_activities_type_idx" ON "monitoring_activities"("type");

-- CreateIndex
CREATE INDEX "monitoring_activities_status_idx" ON "monitoring_activities"("status");

-- CreateIndex
CREATE INDEX "monitoring_activities_locationId_idx" ON "monitoring_activities"("locationId");

-- CreateIndex
CREATE INDEX "species_reports_speciesId_idx" ON "species_reports"("speciesId");

-- CreateIndex
CREATE UNIQUE INDEX "species_reports_activityId_speciesId_key" ON "species_reports"("activityId", "speciesId");

-- CreateIndex
CREATE INDEX "location_reports_reportedAt_idx" ON "location_reports"("reportedAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "monitoring_activities" ADD CONSTRAINT "monitoring_activities_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_activities" ADD CONSTRAINT "monitoring_activities_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_activities" ADD CONSTRAINT "monitoring_activities_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_reports" ADD CONSTRAINT "species_reports_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "monitoring_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_reports" ADD CONSTRAINT "species_reports_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_reports" ADD CONSTRAINT "species_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_reports" ADD CONSTRAINT "species_reports_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_reports" ADD CONSTRAINT "location_reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_reports" ADD CONSTRAINT "location_reports_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
