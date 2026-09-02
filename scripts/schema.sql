-- Auto-generated from prisma/schema.prisma (relationMode=prisma: no FKs)
-- Regenerate with: python3 scripts/gen-schema-sql.py

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TYPE IF EXISTS "UserRole" CASCADE;
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'BARBER', 'SHOP_OWNER', 'ADMIN');

DROP TYPE IF EXISTS "BookingStatus" CASCADE;
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');

DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'CASH', 'WALLET');

DROP TYPE IF EXISTS "ShopStatus" CASCADE;
CREATE TYPE "ShopStatus" AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED');

DROP TYPE IF EXISTS "SubscriptionPlan" CASCADE;
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');

DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'UNPAID');

DROP TYPE IF EXISTS "DayOfWeek" CASCADE;
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

DROP TYPE IF EXISTS "DiscountType" CASCADE;
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

DROP TYPE IF EXISTS "NotificationType" CASCADE;
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CONFIRMED', 'BOOKING_REMINDER', 'BOOKING_CANCELLED', 'BOOKING_RESCHEDULED', 'REVIEW_RECEIVED', 'PROMO_OFFER', 'SYSTEM');

DROP TYPE IF EXISTS "SupportTicketStatus" CASCADE;
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

DROP TYPE IF EXISTS "WalkInStatus" CASCADE;
CREATE TYPE "WalkInStatus" AS ENUM ('WAITING', 'CALLED', 'SERVED', 'LEFT');

DROP TYPE IF EXISTS "ReviewStatus" CASCADE;
CREATE TYPE "ReviewStatus" AS ENUM ('VISIBLE', 'HIDDEN', 'FLAGGED');

DROP TABLE IF EXISTS "User" CASCADE;
CREATE TABLE "User" (
  "id" text NOT NULL,
  "clerkId" text NOT NULL UNIQUE,
  "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER'::"UserRole",
  "email" text NOT NULL UNIQUE,
  "phone" text,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  "avatarUrl" text,
  "locale" text NOT NULL DEFAULT 'fr',
  "isVerified" boolean NOT NULL DEFAULT false,
  "isActive" boolean NOT NULL DEFAULT true,
  "loyaltyPoints" integer NOT NULL DEFAULT 0,
  "referralCode" text NOT NULL UNIQUE,
  "referredById" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "deletedAt" timestamp(3),
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "Shop" CASCADE;
CREATE TABLE "Shop" (
  "id" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "logoUrl" text,
  "coverUrl" text,
  "status" "ShopStatus" NOT NULL DEFAULT 'PENDING_REVIEW'::"ShopStatus",
  "isFeatured" boolean NOT NULL DEFAULT false,
  "phone" text,
  "email" text,
  "website" text,
  "address" text,
  "city" text,
  "country" text NOT NULL DEFAULT 'MA',
  "latitude" double precision,
  "longitude" double precision,
  "ownerId" text NOT NULL UNIQUE,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "deletedAt" timestamp(3),
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "ShopGallery" CASCADE;
CREATE TABLE "ShopGallery" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "imageUrl" text NOT NULL,
  "caption" text,
  "order" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "OpeningHours" CASCADE;
CREATE TABLE "OpeningHours" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "dayOfWeek" "DayOfWeek" NOT NULL,
  "openTime" text NOT NULL,
  "closeTime" text NOT NULL,
  "isClosed" boolean NOT NULL DEFAULT false,
  PRIMARY KEY ("id"),
  UNIQUE ("shopId", "dayOfWeek")
);

DROP TABLE IF EXISTS "ShopAmenity" CASCADE;
CREATE TABLE "ShopAmenity" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "name" text NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "Barber" CASCADE;
CREATE TABLE "Barber" (
  "id" text NOT NULL,
  "userId" text NOT NULL UNIQUE,
  "bio" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "isVerified" boolean NOT NULL DEFAULT false,
  "displayOrder" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "ShopBarber" CASCADE;
CREATE TABLE "ShopBarber" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "barberId" text NOT NULL,
  "isOwner" boolean NOT NULL DEFAULT false,
  "joinedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE ("shopId", "barberId")
);

DROP TABLE IF EXISTS "BarberPortfolioImage" CASCADE;
CREATE TABLE "BarberPortfolioImage" (
  "id" text NOT NULL,
  "barberId" text NOT NULL,
  "imageUrl" text NOT NULL,
  "caption" text,
  "order" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "BarberAvailability" CASCADE;
CREATE TABLE "BarberAvailability" (
  "id" text NOT NULL,
  "barberId" text NOT NULL,
  "dayOfWeek" "DayOfWeek" NOT NULL,
  "startTime" text NOT NULL,
  "endTime" text NOT NULL,
  "isAvailable" boolean NOT NULL DEFAULT true,
  PRIMARY KEY ("id"),
  UNIQUE ("barberId", "dayOfWeek")
);

DROP TABLE IF EXISTS "BarberBlockedTime" CASCADE;
CREATE TABLE "BarberBlockedTime" (
  "id" text NOT NULL,
  "barberId" text NOT NULL,
  "startAt" timestamp(3) NOT NULL,
  "endAt" timestamp(3) NOT NULL,
  "reason" text,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "ServiceCategory" CASCADE;
CREATE TABLE "ServiceCategory" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "name" text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("id"),
  UNIQUE ("shopId", "name")
);

DROP TABLE IF EXISTS "Service" CASCADE;
CREATE TABLE "Service" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "categoryId" text,
  "name" text NOT NULL,
  "description" text,
  "price" decimal(10, 2) NOT NULL,
  "duration" integer NOT NULL,
  "imageUrl" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "BarberService" CASCADE;
CREATE TABLE "BarberService" (
  "id" text NOT NULL,
  "barberId" text NOT NULL,
  "serviceId" text NOT NULL,
  "price" decimal(10, 2),
  PRIMARY KEY ("id"),
  UNIQUE ("barberId", "serviceId")
);

DROP TABLE IF EXISTS "Booking" CASCADE;
CREATE TABLE "Booking" (
  "id" text NOT NULL,
  "customerId" text NOT NULL,
  "barberId" text NOT NULL,
  "shopId" text NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING'::"BookingStatus",
  "scheduledAt" timestamp(3) NOT NULL,
  "endsAt" timestamp(3) NOT NULL,
  "customerNotes" text,
  "cancellationReason" text,
  "isWalkIn" boolean NOT NULL DEFAULT false,
  "rescheduledFromId" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "BookingService" CASCADE;
CREATE TABLE "BookingService" (
  "id" text NOT NULL,
  "bookingId" text NOT NULL,
  "serviceId" text NOT NULL,
  "price" decimal(10, 2) NOT NULL,
  "duration" integer NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("bookingId", "serviceId")
);

DROP TABLE IF EXISTS "Payment" CASCADE;
CREATE TABLE "Payment" (
  "id" text NOT NULL,
  "bookingId" text NOT NULL UNIQUE,
  "stripePaymentIntentId" text UNIQUE,
  "amount" decimal(10, 2) NOT NULL,
  "currency" text NOT NULL DEFAULT 'MAD',
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING'::"PaymentStatus",
  "method" "PaymentMethod" NOT NULL DEFAULT 'CASH'::"PaymentMethod",
  "paidAt" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "Review" CASCADE;
CREATE TABLE "Review" (
  "id" text NOT NULL,
  "bookingId" text NOT NULL UNIQUE,
  "authorId" text NOT NULL,
  "barberId" text NOT NULL,
  "shopId" text NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "ownerReply" text,
  "status" "ReviewStatus" NOT NULL DEFAULT 'VISIBLE'::"ReviewStatus",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "PromoCode" CASCADE;
CREATE TABLE "PromoCode" (
  "id" text NOT NULL,
  "shopId" text,
  "code" text NOT NULL UNIQUE,
  "discountType" "DiscountType" NOT NULL,
  "discountValue" decimal(10, 2) NOT NULL,
  "minBookingAmount" decimal(10, 2),
  "maxUsage" integer,
  "usageCount" integer NOT NULL DEFAULT 0,
  "validFrom" timestamp(3) NOT NULL,
  "validUntil" timestamp(3) NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "BookingPromo" CASCADE;
CREATE TABLE "BookingPromo" (
  "id" text NOT NULL,
  "bookingId" text NOT NULL UNIQUE,
  "promoCodeId" text NOT NULL,
  "discountAmount" decimal(10, 2) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "SavedShop" CASCADE;
CREATE TABLE "SavedShop" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "shopId" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE ("userId", "shopId")
);

DROP TABLE IF EXISTS "Notification" CASCADE;
CREATE TABLE "Notification" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "isRead" boolean NOT NULL DEFAULT false,
  "data" jsonb,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "LoyaltyEntry" CASCADE;
CREATE TABLE "LoyaltyEntry" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "points" integer NOT NULL,
  "reason" text NOT NULL,
  "bookingId" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "CustomerNote" CASCADE;
CREATE TABLE "CustomerNote" (
  "id" text NOT NULL,
  "barberId" text NOT NULL,
  "customerId" text NOT NULL,
  "note" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("barberId", "customerId")
);

DROP TABLE IF EXISTS "WalkInQueue" CASCADE;
CREATE TABLE "WalkInQueue" (
  "id" text NOT NULL,
  "shopId" text NOT NULL,
  "barberId" text,
  "customerName" text NOT NULL,
  "phone" text,
  "estimatedWaitMinutes" integer,
  "status" "WalkInStatus" NOT NULL DEFAULT 'WAITING'::"WalkInStatus",
  "joinedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "servedAt" timestamp(3),
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "Subscription" CASCADE;
CREATE TABLE "Subscription" (
  "id" text NOT NULL,
  "shopId" text NOT NULL UNIQUE,
  "stripeSubscriptionId" text UNIQUE,
  "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE'::"SubscriptionPlan",
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING'::"SubscriptionStatus",
  "currentPeriodStart" timestamp(3),
  "currentPeriodEnd" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "SupportTicket" CASCADE;
CREATE TABLE "SupportTicket" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "subject" text NOT NULL,
  "category" text,
  "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN'::"SupportTicketStatus",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "SupportMessage" CASCADE;
CREATE TABLE "SupportMessage" (
  "id" text NOT NULL,
  "ticketId" text NOT NULL,
  "authorId" text NOT NULL,
  "body" text NOT NULL,
  "isStaff" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "AdminLog" CASCADE;
CREATE TABLE "AdminLog" (
  "id" text NOT NULL,
  "adminId" text NOT NULL,
  "action" text NOT NULL,
  "entityType" text NOT NULL,
  "entityId" text,
  "metadata" jsonb,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

DROP INDEX IF EXISTS "User_clerkId_idx" CASCADE;
CREATE INDEX "User_clerkId_idx" ON "User" ("clerkId");
DROP INDEX IF EXISTS "User_email_idx" CASCADE;
CREATE INDEX "User_email_idx" ON "User" ("email");
DROP INDEX IF EXISTS "User_referredById_idx" CASCADE;
CREATE INDEX "User_referredById_idx" ON "User" ("referredById");
DROP INDEX IF EXISTS "Shop_slug_idx" CASCADE;
CREATE INDEX "Shop_slug_idx" ON "Shop" ("slug");
DROP INDEX IF EXISTS "Shop_ownerId_idx" CASCADE;
CREATE INDEX "Shop_ownerId_idx" ON "Shop" ("ownerId");
DROP INDEX IF EXISTS "Shop_city_idx" CASCADE;
CREATE INDEX "Shop_city_idx" ON "Shop" ("city");
DROP INDEX IF EXISTS "Shop_status_idx" CASCADE;
CREATE INDEX "Shop_status_idx" ON "Shop" ("status");
DROP INDEX IF EXISTS "Shop_isFeatured_idx" CASCADE;
CREATE INDEX "Shop_isFeatured_idx" ON "Shop" ("isFeatured");
DROP INDEX IF EXISTS "ShopGallery_shopId_idx" CASCADE;
CREATE INDEX "ShopGallery_shopId_idx" ON "ShopGallery" ("shopId");
DROP INDEX IF EXISTS "OpeningHours_shopId_idx" CASCADE;
CREATE INDEX "OpeningHours_shopId_idx" ON "OpeningHours" ("shopId");
DROP INDEX IF EXISTS "ShopAmenity_shopId_idx" CASCADE;
CREATE INDEX "ShopAmenity_shopId_idx" ON "ShopAmenity" ("shopId");
DROP INDEX IF EXISTS "Barber_userId_idx" CASCADE;
CREATE INDEX "Barber_userId_idx" ON "Barber" ("userId");
DROP INDEX IF EXISTS "ShopBarber_shopId_idx" CASCADE;
CREATE INDEX "ShopBarber_shopId_idx" ON "ShopBarber" ("shopId");
DROP INDEX IF EXISTS "ShopBarber_barberId_idx" CASCADE;
CREATE INDEX "ShopBarber_barberId_idx" ON "ShopBarber" ("barberId");
DROP INDEX IF EXISTS "BarberPortfolioImage_barberId_idx" CASCADE;
CREATE INDEX "BarberPortfolioImage_barberId_idx" ON "BarberPortfolioImage" ("barberId");
DROP INDEX IF EXISTS "BarberAvailability_barberId_idx" CASCADE;
CREATE INDEX "BarberAvailability_barberId_idx" ON "BarberAvailability" ("barberId");
DROP INDEX IF EXISTS "BarberBlockedTime_barberId_idx" CASCADE;
CREATE INDEX "BarberBlockedTime_barberId_idx" ON "BarberBlockedTime" ("barberId");
DROP INDEX IF EXISTS "BarberBlockedTime_startAt_idx" CASCADE;
CREATE INDEX "BarberBlockedTime_startAt_idx" ON "BarberBlockedTime" ("startAt");
DROP INDEX IF EXISTS "ServiceCategory_shopId_idx" CASCADE;
CREATE INDEX "ServiceCategory_shopId_idx" ON "ServiceCategory" ("shopId");
DROP INDEX IF EXISTS "Service_shopId_idx" CASCADE;
CREATE INDEX "Service_shopId_idx" ON "Service" ("shopId");
DROP INDEX IF EXISTS "Service_categoryId_idx" CASCADE;
CREATE INDEX "Service_categoryId_idx" ON "Service" ("categoryId");
DROP INDEX IF EXISTS "BarberService_barberId_idx" CASCADE;
CREATE INDEX "BarberService_barberId_idx" ON "BarberService" ("barberId");
DROP INDEX IF EXISTS "BarberService_serviceId_idx" CASCADE;
CREATE INDEX "BarberService_serviceId_idx" ON "BarberService" ("serviceId");
DROP INDEX IF EXISTS "Booking_customerId_idx" CASCADE;
CREATE INDEX "Booking_customerId_idx" ON "Booking" ("customerId");
DROP INDEX IF EXISTS "Booking_barberId_idx" CASCADE;
CREATE INDEX "Booking_barberId_idx" ON "Booking" ("barberId");
DROP INDEX IF EXISTS "Booking_shopId_idx" CASCADE;
CREATE INDEX "Booking_shopId_idx" ON "Booking" ("shopId");
DROP INDEX IF EXISTS "Booking_scheduledAt_idx" CASCADE;
CREATE INDEX "Booking_scheduledAt_idx" ON "Booking" ("scheduledAt");
DROP INDEX IF EXISTS "Booking_status_idx" CASCADE;
CREATE INDEX "Booking_status_idx" ON "Booking" ("status");
DROP INDEX IF EXISTS "Booking_rescheduledFromId_idx" CASCADE;
CREATE INDEX "Booking_rescheduledFromId_idx" ON "Booking" ("rescheduledFromId");
DROP INDEX IF EXISTS "BookingService_bookingId_idx" CASCADE;
CREATE INDEX "BookingService_bookingId_idx" ON "BookingService" ("bookingId");
DROP INDEX IF EXISTS "BookingService_serviceId_idx" CASCADE;
CREATE INDEX "BookingService_serviceId_idx" ON "BookingService" ("serviceId");
DROP INDEX IF EXISTS "Payment_bookingId_idx" CASCADE;
CREATE INDEX "Payment_bookingId_idx" ON "Payment" ("bookingId");
DROP INDEX IF EXISTS "Payment_stripePaymentIntentId_idx" CASCADE;
CREATE INDEX "Payment_stripePaymentIntentId_idx" ON "Payment" ("stripePaymentIntentId");
DROP INDEX IF EXISTS "Review_bookingId_idx" CASCADE;
CREATE INDEX "Review_bookingId_idx" ON "Review" ("bookingId");
DROP INDEX IF EXISTS "Review_barberId_idx" CASCADE;
CREATE INDEX "Review_barberId_idx" ON "Review" ("barberId");
DROP INDEX IF EXISTS "Review_shopId_idx" CASCADE;
CREATE INDEX "Review_shopId_idx" ON "Review" ("shopId");
DROP INDEX IF EXISTS "Review_authorId_idx" CASCADE;
CREATE INDEX "Review_authorId_idx" ON "Review" ("authorId");
DROP INDEX IF EXISTS "PromoCode_shopId_idx" CASCADE;
CREATE INDEX "PromoCode_shopId_idx" ON "PromoCode" ("shopId");
DROP INDEX IF EXISTS "PromoCode_code_idx" CASCADE;
CREATE INDEX "PromoCode_code_idx" ON "PromoCode" ("code");
DROP INDEX IF EXISTS "BookingPromo_bookingId_idx" CASCADE;
CREATE INDEX "BookingPromo_bookingId_idx" ON "BookingPromo" ("bookingId");
DROP INDEX IF EXISTS "BookingPromo_promoCodeId_idx" CASCADE;
CREATE INDEX "BookingPromo_promoCodeId_idx" ON "BookingPromo" ("promoCodeId");
DROP INDEX IF EXISTS "SavedShop_userId_idx" CASCADE;
CREATE INDEX "SavedShop_userId_idx" ON "SavedShop" ("userId");
DROP INDEX IF EXISTS "SavedShop_shopId_idx" CASCADE;
CREATE INDEX "SavedShop_shopId_idx" ON "SavedShop" ("shopId");
DROP INDEX IF EXISTS "Notification_userId_idx" CASCADE;
CREATE INDEX "Notification_userId_idx" ON "Notification" ("userId");
DROP INDEX IF EXISTS "Notification_isRead_idx" CASCADE;
CREATE INDEX "Notification_isRead_idx" ON "Notification" ("isRead");
DROP INDEX IF EXISTS "LoyaltyEntry_userId_idx" CASCADE;
CREATE INDEX "LoyaltyEntry_userId_idx" ON "LoyaltyEntry" ("userId");
DROP INDEX IF EXISTS "CustomerNote_barberId_idx" CASCADE;
CREATE INDEX "CustomerNote_barberId_idx" ON "CustomerNote" ("barberId");
DROP INDEX IF EXISTS "CustomerNote_customerId_idx" CASCADE;
CREATE INDEX "CustomerNote_customerId_idx" ON "CustomerNote" ("customerId");
DROP INDEX IF EXISTS "WalkInQueue_shopId_idx" CASCADE;
CREATE INDEX "WalkInQueue_shopId_idx" ON "WalkInQueue" ("shopId");
DROP INDEX IF EXISTS "WalkInQueue_status_idx" CASCADE;
CREATE INDEX "WalkInQueue_status_idx" ON "WalkInQueue" ("status");
DROP INDEX IF EXISTS "Subscription_shopId_idx" CASCADE;
CREATE INDEX "Subscription_shopId_idx" ON "Subscription" ("shopId");
DROP INDEX IF EXISTS "SupportTicket_userId_idx" CASCADE;
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket" ("userId");
DROP INDEX IF EXISTS "SupportTicket_status_idx" CASCADE;
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket" ("status");
DROP INDEX IF EXISTS "SupportMessage_ticketId_idx" CASCADE;
CREATE INDEX "SupportMessage_ticketId_idx" ON "SupportMessage" ("ticketId");
DROP INDEX IF EXISTS "AdminLog_adminId_idx" CASCADE;
CREATE INDEX "AdminLog_adminId_idx" ON "AdminLog" ("adminId");
DROP INDEX IF EXISTS "AdminLog_entityType_entityId_idx" CASCADE;
CREATE INDEX "AdminLog_entityType_entityId_idx" ON "AdminLog" ("entityType", "entityId");
