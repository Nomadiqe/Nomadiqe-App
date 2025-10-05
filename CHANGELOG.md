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
- Interactive map view for property search with Leaflet integration
- Property filtering by price, type, amenities, and rating
- Horizontal property card layout variant for list views
- iOS Safari compatibility improvements for sticky headers with backdrop-blur
- Favicons and logo assets

### Changed
- Updated color scheme with Nomadiqe brand colors
- Migrated from Cloudinary to Vercel Blob for image storage
- Enhanced UI components with shadcn/ui library
- Improved authentication flow with role selection
- Updated middleware for better route protection
- Replaced standard apostrophes with HTML entities in UI text
- Complete UX redesign of search page with shadcn components
- Optimized search page layout to fit above the fold
- Implemented 50/50 split view with fixed map and scrollable property list
- Improved property cards with compact horizontal layout (180px max height)
- Enhanced mobile layout for search page with full-width cards
- Updated property card component to support grid and list variants
- Improved image upload quality settings

### Fixed
- Image upload stability and error handling
- Theme consistency across all pages
- Navigation accessibility and user experience
- Authentication redirect issues
- Profile page rendering and data fetching
- SSR error with Leaflet map by using dynamic import
- Infinite loop in onboarding progress fetching
- Profile image display with fallback for null images
- Property display on about page with filter functionality
- Profile navigation 404 errors
- Date picker auto-closing issue in search bar
- Loading state issues on onboarding pages
- Horizontal overflow by constraining html/body
- TypeScript and ESLint build errors
- Favicon conflicts by removing dynamic icon
- Properties API route TypeScript errors
- Create-post component to fetch properties from database

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