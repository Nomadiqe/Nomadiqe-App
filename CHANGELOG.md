# Changelog

All notable changes to the Nomadiqe platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Week 1 MVP Critical Fixes (2025-11-18)

#### Legal Compliance
- **Terms of Service Page** - Created comprehensive GDPR-compliant Terms of Service (`/app/terms/page.tsx`)
  - 15 sections covering user accounts, bookings, payments, influencer collaborations
  - Italian Data Protection Code compliance
  - GDPR references and user rights
  - Proper metadata and navigation

- **Privacy Policy Page** - Created comprehensive GDPR/CCPA-compliant Privacy Policy (`/app/privacy/page.tsx`)
  - 14 sections covering data collection, usage, sharing, and retention
  - GDPR user rights detailed (access, rectification, erasure, portability, etc.)
  - CCPA compliance for California residents
  - Cookie policy and tracking technologies
  - Italian Data Protection Authority contact information

- **Favicon Configuration** - Fixed 404 errors for favicon and static assets
  - Verified all favicon files exist in `/public` directory
  - Updated manifest.json link in app metadata
  - Proper PWA icon configuration

#### Core Features
- **Property Action Buttons** - Implemented interactive Reserve/Share/Save buttons (`/components/property/PropertyActionButtons.tsx`, `/components/property/ReserveButton.tsx`)
  - Share functionality with native Web Share API and clipboard fallback
  - Save/unsave properties with auth checks
  - Reserve button with authentication flow
  - User feedback via toast notifications
  - Italian localization

- **Media Kit Display** - Implemented complete influencer media kit visibility (`/components/MediaKitDisplay.tsx`)
  - Verification badge for verified influencers
  - Content niches display as styled badges
  - Deliverables grid showing platform capabilities (Instagram, TikTok, YouTube, Blog)
  - Custom deliverables list
  - Portfolio link with external link button
  - Empty state handling for incomplete media kits
  - Integrated into profile tabs for INFLUENCER role users
  - Added Media Kit tab to profile pages (`/components/profile-tabs.tsx`)
  - Fetched influencer profile data from database (`/app/profile/[id]/page.tsx`)

### Fixed
- **TypeScript Build Errors**
  - Fixed undefined value check in MediaKitDisplay component (line 132)
  - Fixed missing prop destructuring in ProfileTabs component
  - Build now completes successfully with zero errors

### Technical
- Next.js 14.0.4 build validation passed
- All TypeScript type checking passed
- ESLint warnings documented (image optimization recommendations)
- 68 static pages generated successfully
- Production build optimized and ready for deployment
- **Vercel Environment Variables** - Updated all environment variables for Supabase migration
  - Removed 26 legacy Neon database and Stack Auth environment variables
  - Added Supabase configuration variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  - Added Supabase database connection strings (DATABASE_URL, DIRECT_URL)
  - Updated NEXT_PUBLIC_SITE_URL to production domain (https://app.nomadiqe.com)
  - Configured for all environments: Production, Preview, and Development
  - Fixed deployment build errors related to missing Supabase environment variables

## Notes
- All Week 1 MVP critical blockers have been resolved
- Legal compliance achieved for GDPR, Italian law, and CCPA
- Platform ready for business review and beta testing
- Supabase warnings about Edge Runtime compatibility are expected and non-blocking
