# Changelog

All notable changes to the Nomadiqe App project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Automatic Geocoding Service**: Properties are now automatically geocoded using OpenStreetMap Nominatim API
  - Multi-level fallback strategy (exact address → street → city center)
  - Rate limiting compliance (1 request/second)
  - Geocoding accuracy tracking (`geocodingAccuracy` and `geocodingFailed` fields)
  - Admin interface for manual coordinate setting
  - Properties without coordinates show warning badges in admin dashboard
  - Bulk geocoding script for existing properties (`scripts/geocode-existing-properties.ts`)
- **Admin Dashboard**: Complete property management interface for administrators
  - View all properties with filtering (active/inactive/all)
  - Publish/unpublish properties
  - Verify hosts
  - Delete properties
  - Manual coordinate setting with validation
  - Visual geocoding status indicators
  - Admin menu item in main navigation (requires ADMIN role)
- **Social Authentication System**: Multi-provider OAuth implementation
  - Google OAuth with complete setup documentation
  - Facebook OAuth support
  - Apple Sign In support
  - Enhanced avatar fallback system (initials + gradient backgrounds)
  - Improved auth flow with better error handling
  - Simplified signup process (removed redundant name field)
- **Documentation Organization**: All documentation moved to `/docs` folder
  - Documentation index with categorized guides
  - Updated README with prominent documentation links
  - Cross-referenced documentation with navigation aids
  - Contributing guidelines and documentation standards
- Multi-role user system (Guest, Host, Influencer) with role-specific dashboards
- Complete onboarding flow for all user types
- Post creation and discovery features
- Image upload functionality using Vercel Blob storage
- Dark mode support with theme toggling and system preference detection
- Theme toggle button in navigation (desktop dropdown and mobile menu)
- Theme-aware map tiles with Sicilian color scheme
- Custom azure blue map markers matching brand colors
- CSS filters to adjust map colors to Mediterranean palette
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
- Updated to Sicilian island color theme (azure blues, sandy tans, arabesque whites, terracotta accents)
- Removed purple and pink gradients in favor of clean, Mediterranean-inspired palette
- Light mode: Warm arabesque white backgrounds with azure blue accents
- Dark mode: Deep night blue-gray backgrounds with bright azure accents
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
- TypeScript error in admin properties API route (added type annotation to properties.map)
- Image upload stability and error handling
- Theme consistency across all pages
- Navigation accessibility and user experience
- Authentication redirect issues
- Search functionality now properly updates URL parameters and filters properties
- Filter functionality fully integrated with URL state and database queries
- Filter panel z-index increased (z-999/z-1000) to appear above map
- Filter state initialization from URL parameters on page load
- Active filter count badge displays on filter button
- Profile page rendering and data fetching
- SSR error with Leaflet map by using dynamic import
- Infinite loop in onboarding progress fetching
- Profile image display with fallback for null images
- Map theme switching bug - map now properly updates between light and dark modes in real-time

### Enhanced
- **Admin Dashboard**: Comprehensive geocoding status display
  - Visual warnings for properties without coordinates (orange badges)
  - Accuracy level indicators for approximate locations (blue badges)
  - "Set Location" button for manual coordinate entry
  - Dialog interface with validation and instructions
- **Property Map Display**: Properties now appear on map even with approximate coordinates
  - City center fallback ensures properties are visible
  - Accuracy badges inform users of location precision
- **Navigation UI**: Consistent styling improvements
  - Theme toggle button with improved styling
  - Menu items with unified design language
  - LayoutDashboard icon for all dashboard menu items
  - Dark mode styling for map zoom controls
- Homepage feed with modern gradient header using Nomadiqe brand colors
- Post cards with hover effects, shadows, and smooth transitions
- Avatar components with ring effects on hover
- Like and comment buttons with color-coded hover states and scale animations
- Post images with full-width display and zoom effects on hover
- Create Post button with gradient background and shadow effects
- Overall visual hierarchy and spacing improvements across feed
- Property display on about page with filter functionality
- Dark mode map styling to better match Sicilian night blue-gray theme (brightness 0.3)
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