# Nomadiqe App

A modern travel platform connecting travelers, hosts, and influencers. Built with Next.js, Prisma, and NextAuth.

## 📚 Documentation

**[View Complete Documentation →](./docs/README.md)**

### Quick Links
- 🚀 **[Quick Start: Social Auth](./docs/QUICKSTART_SOCIAL_AUTH.md)** - OAuth setup guide
- 🗺️ **[Geocoding Service](./docs/GEOCODING.md)** - Automatic address-to-coordinates
- ☁️ **[Vercel Deployment](./docs/VERCEL_SETUP.md)** - Production deployment guide
- 📝 **[Changelog](./docs/CHANGELOG.md)** - Version history

## Features

- **Multi-Role User System**: Support for Guests, Hosts, and Influencers with role-specific dashboards
- **Property Management**: List and manage properties with automatic geocoding
- **Interactive Maps**: Property search with Leaflet integration and smart coordinate fallback
- **Admin Dashboard**: Comprehensive admin interface with geocoding status tracking
- **Authentication**: Secure authentication via NextAuth with Google, Facebook, and Apple OAuth
- **Image Management**: Integrated image upload using Vercel Blob storage
- **Dark Mode**: Full dark mode support with theme toggling
- **Post Creation & Discovery**: Create and browse travel posts with image galleries
- **User Profiles**: Comprehensive user profiles with customizable information
- **Onboarding Flow**: Role-specific onboarding for new users
- **Search Functionality**: Advanced property filtering by price, type, amenities, and rating
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL database

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nomadiqe-App
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)
   - `NEXTAUTH_SECRET`: A random string for NextAuth
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID (optional)
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (optional)
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage token for image uploads

4. **Generate Prisma client**
   ```bash
   pnpm prisma generate
   ```

5. **Push database schema**
   ```bash
   pnpm prisma db push
   ```

6. **Seed the database (optional)**
   ```bash
   pnpm db:seed
   ```

## Development

```bash
pnpm dev
```

## Building for Production

### Local Build
```bash
pnpm build
```

### Vercel Deployment
The app is configured for Vercel deployment with automatic Prisma client generation.

## Troubleshooting

For detailed troubleshooting guides, see the [documentation](./docs/README.md).

### Quick Fixes

**Prisma Client Issues:**
```bash
pnpm prisma generate
rm -rf .next
pnpm build
```

**OAuth/Social Auth Issues:**
See [Social Auth Setup](./docs/SOCIAL_AUTH_SETUP.md) and [Fixes Applied](./docs/FIXES_APPLIED.md)

**Map/Geocoding Issues:**
See [Geocoding Documentation](./docs/GEOCODING.md#troubleshooting)

**Deployment Issues:**
See [Vercel Setup Guide](./docs/VERCEL_SETUP.md)

## Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database

### Utilities
- `npx tsx scripts/geocode-existing-properties.ts` - Bulk geocode properties without coordinates
  - Add `DRY_RUN=true` to preview changes
  - Add `LIMIT=10` to limit number of properties processed

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with OAuth (Google, Facebook, Apple)
- **Styling:** Tailwind CSS with CSS Variables
- **UI Components:** Radix UI (shadcn/ui)
- **Maps:** Leaflet with React Leaflet
- **Geocoding:** OpenStreetMap Nominatim API
- **Image Storage:** Vercel Blob
- **Package Manager:** pnpm
- **TypeScript:** Full type safety across the application

## Project Structure

```
Nomadiqe-App/
├── app/                    # Next.js app directory (routes & pages)
├── components/             # React components
│   ├── admin/             # Admin dashboard components
│   ├── ui/                # Reusable UI components (shadcn)
│   └── ...                # Feature-specific components
├── docs/                   # 📚 Documentation
│   ├── README.md          # Documentation index
│   ├── GEOCODING.md       # Geocoding service guide
│   ├── SOCIAL_AUTH_SETUP.md
│   └── ...
├── lib/                    # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── geocoding.ts       # Geocoding service
│   └── ...
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
└── scripts/               # Utility scripts
    └── geocode-existing-properties.ts
```

## Contributing

When contributing to this project:

1. Follow the existing code style and conventions
2. Update documentation when adding new features
3. Add entries to [CHANGELOG.md](./docs/CHANGELOG.md) for notable changes
4. Test thoroughly before submitting pull requests

## License

[Add your license here]

---

**Need Help?** Check the [documentation](./docs/README.md) or review [troubleshooting guides](./docs/FIXES_APPLIED.md).
