-- Safe migration: adds missing tables and columns without deleting anything
-- Uses IF NOT EXISTS and safe ALTER TABLE ADD COLUMN statements

-- Add missing enum values to existing enums
DO $$ BEGIN
  ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'GUEST';
  ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'INFLUENCER';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create new enums
DO $$ BEGIN
  CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'YOUTUBE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add missing columns to users table (IF NOT EXISTS not supported, so we check first)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingStatus" "OnboardingStatus" DEFAULT 'PENDING';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingStep" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fullName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profilePictureUrl" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "coverPhotoUrl" TEXT;

-- Create unique index on username if not exists
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");

-- Add missing columns to host_profiles table
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "identityVerified" BOOLEAN DEFAULT false;
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "verificationStatus" "VerificationStatus" DEFAULT 'PENDING';
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "verificationDate" TIMESTAMP(3);
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "standardOffer" JSONB;
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "minFollowerCount" INTEGER;
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "preferredNiches" TEXT[];
ALTER TABLE "host_profiles" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "host_profiles_referralCode_key" ON "host_profiles"("referralCode");

-- Create OnboardingProgress table
CREATE TABLE IF NOT EXISTS "onboarding_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStep" TEXT NOT NULL,
    "completedSteps" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "onboarding_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "onboarding_progress_userId_key" ON "onboarding_progress"("userId");

-- Create GuestPreferences table
CREATE TABLE IF NOT EXISTS "guest_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "travelInterests" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "guest_preferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "guest_preferences_userId_key" ON "guest_preferences"("userId");

-- Create InfluencerProfile table
CREATE TABLE IF NOT EXISTS "influencer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationDate" TIMESTAMP(3),
    "contentNiches" TEXT[] NOT NULL,
    "deliverables" JSONB,
    "portfolioUrl" TEXT,
    "profileLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "influencer_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "influencer_profiles_userId_key" ON "influencer_profiles"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "influencer_profiles_profileLink_key" ON "influencer_profiles"("profileLink");

-- Create SocialConnection table
CREATE TABLE IF NOT EXISTS "social_connections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "platformUserId" TEXT NOT NULL,
    "username" TEXT,
    "followerCount" INTEGER,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "social_connections_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "social_connections_userId_platform_key" ON "social_connections"("userId", "platform");

-- Create Conversations table
CREATE TABLE IF NOT EXISTS "conversations" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "conversations_userAId_userBId_key" ON "conversations"("userAId", "userBId");

-- Create Messages table
CREATE TABLE IF NOT EXISTS "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Create UserPoints table
CREATE TABLE IF NOT EXISTS "user_points" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "currentPoints" INTEGER NOT NULL DEFAULT 0,
    "lifetimeEarned" INTEGER NOT NULL DEFAULT 0,
    "lifetimeRedeemed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_points_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_points_userId_key" ON "user_points"("userId");
CREATE INDEX IF NOT EXISTS "user_points_userId_idx" ON "user_points"("userId");

-- Create PointTransaction table
CREATE TABLE IF NOT EXISTS "point_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "metadata" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "point_transactions_userId_createdAt_idx" ON "point_transactions"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "point_transactions_action_createdAt_idx" ON "point_transactions"("action", "createdAt");
CREATE INDEX IF NOT EXISTS "point_transactions_userId_action_createdAt_idx" ON "point_transactions"("userId", "action", "createdAt");

-- Create DailyCheckIn table
CREATE TABLE IF NOT EXISTS "daily_check_ins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 10,
    "streakCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_check_ins_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "daily_check_ins_userId_checkInDate_key" ON "daily_check_ins"("userId", "checkInDate");
CREATE INDEX IF NOT EXISTS "daily_check_ins_userId_checkInDate_idx" ON "daily_check_ins"("userId", "checkInDate");

-- Create PointsRule table
CREATE TABLE IF NOT EXISTS "points_rules" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "dailyLimit" INTEGER,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "points_rules_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "points_rules_action_key" ON "points_rules"("action");

-- Add foreign keys (only if they don't exist)
DO $$ BEGIN
  ALTER TABLE "onboarding_progress" ADD CONSTRAINT "onboarding_progress_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "guest_preferences" ADD CONSTRAINT "guest_preferences_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "influencer_profiles" ADD CONSTRAINT "influencer_profiles_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "social_connections" ADD CONSTRAINT "social_connections_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userAId_fkey" 
    FOREIGN KEY ("userAId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userBId_fkey" 
    FOREIGN KEY ("userBId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" 
    FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" 
    FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "user_points" ADD CONSTRAINT "user_points_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
