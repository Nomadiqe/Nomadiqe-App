# Nomadiqe App

A modern travel platform connecting travelers, hosts, and influencers. Built with Next.js, Prisma, and NextAuth.

## Features

- **Multi-Role User System**: Support for Guests, Hosts, and Influencers with role-specific dashboards
- **Authentication**: Secure authentication via NextAuth with Google OAuth
- **Image Management**: Integrated image upload using Vercel Blob storage
- **Dark Mode**: Full dark mode support with theme toggling
- **Post Creation & Discovery**: Create and browse travel posts with image galleries
- **User Profiles**: Comprehensive user profiles with customizable information
- **Onboarding Flow**: Role-specific onboarding for new users
- **Search Functionality**: Search for users and posts
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

### Prisma Client Issues
If you encounter "Module '@prisma/client' has no exported member 'PrismaClient'" errors:

1. **Regenerate Prisma client:**
   ```bash
   pnpm prisma generate
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   pnpm build
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### Build Issues
If the build fails during deployment:

1. Ensure `DATABASE_URL` is set in your environment variables
2. Check that Prisma client is generated before build
3. Verify all dependencies are properly installed

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with Google OAuth
- **Styling:** Tailwind CSS with CSS Variables
- **UI Components:** Radix UI (shadcn/ui)
- **Image Storage:** Vercel Blob
- **Package Manager:** pnpm
- **TypeScript:** Full type safety across the application
