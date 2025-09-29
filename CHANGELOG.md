# Changelog

All notable changes to the Nomadiqe App project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Multi-role user system (Guest, Host, Influencer) with role-specific dashboards
- Complete onboarding flow for all user types
- Post creation and discovery features
- Image upload functionality using Vercel Blob storage
- Dark mode support with theme toggling
- User profile pages with customizable information
- Search functionality for users and posts
- Comments system for posts
- Profile actions (follow/unfollow, favorite)
- Profile tabs for posts and favorites
- Image galleries with multiple image support
- Legal pages (Privacy Policy, Terms of Service)
- Settings page for user preferences
- Responsive navigation with mobile support

### Changed
- Updated color scheme with Nomadiqe brand colors
- Migrated from Cloudinary to Vercel Blob for image storage
- Enhanced UI components with shadcn/ui library
- Improved authentication flow with role selection
- Updated middleware for better route protection
- Replaced standard apostrophes with HTML entities in UI text

### Fixed
- Image upload stability and error handling
- Theme consistency across all pages
- Navigation accessibility and user experience
- Authentication redirect issues
- Profile page rendering and data fetching

### Removed
- Old documentation files (onboarding plans, technical specs)
- Legacy Cloudinary image upload code
- Unused test data and demo files

## [0.1.0] - Initial Release

### Added
- Basic Next.js 14 application structure
- PostgreSQL database with Prisma ORM
- NextAuth.js authentication
- Google OAuth integration
- Basic user model and database schema
- Development and production build configurations