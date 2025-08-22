# Nomadiqe Platform

**Fairer Stays, Deeper Connections**

A revolutionary travel booking platform with blockchain integration, low fees, and authentic local experiences.

## 🚀 Features

### Core Features
- **Low Commission Model**: Only 5% commission vs 15-30% on traditional platforms
- **Crypto Payments**: Support for Bitcoin, Ethereum, and other cryptocurrencies
- **Social Features**: Follow hosts, like properties, and connect with local communities
- **Local Experiences**: Discover authentic local activities and artisans
- **AI Chatbot**: Intelligent assistance for onboarding and support
- **Dark Mode**: Modern, tech-oriented interface design

### Technical Features
- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Full type safety
- **Prisma**: Type-safe database ORM
- **NextAuth.js**: Authentication with Google OAuth and credentials
- **Stripe Integration**: Fiat payment processing
- **Coinbase Commerce**: Cryptocurrency payment processing
- **Tailwind CSS**: Utility-first styling with dark mode
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe (fiat), Coinbase Commerce (crypto)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Google OAuth credentials
- Stripe account
- Coinbase Commerce account

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd nomadiqe-platform
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nomadiqe"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (Fiat Payments)
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Coinbase Commerce (Crypto Payments)
COINBASE_COMMERCE_API_KEY="your-coinbase-commerce-api-key"
COINBASE_COMMERCE_WEBHOOK_SECRET="your-coinbase-webhook-secret"
```

### 4. Set up the database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed the database
pnpm db:seed
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
nomadiqe-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth-provider.tsx # Authentication provider
│   └── theme-provider.tsx # Theme provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database with sample data

## 🌟 Key Features Implementation

### Authentication
- Google OAuth integration
- Email/password authentication
- Role-based access (Host/Traveler)
- Protected routes

### Property Management
- CRUD operations for properties
- Image upload and management
- Availability calendar
- Pricing management

### Booking System
- Real-time availability checking
- Booking confirmation flow
- Payment processing (fiat + crypto)
- Escrow system for security

### Social Features
- Follow/unfollow hosts
- Like/unlike properties
- Review and rating system
- Social feed

### Payment Integration
- Stripe for fiat payments
- Coinbase Commerce for crypto
- Multi-currency support
- Automatic conversion

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Rate limiting
- Input validation with Zod
- SQL injection prevention with Prisma

## 🎨 Design System

The platform uses a custom design system with:
- Dark mode as default
- Nomadiqe brand colors
- Responsive components
- Accessibility features
- Smooth animations

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Progressive Web App features

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@nomadiqe.com or create an issue in the repository.

## 🔮 Roadmap

### Phase 2 (Future)
- Mobile app (React Native)
- Nomadiqe token ($NOMADIQE) launch
- DAO governance system
- Advanced AI features
- VR property tours
- Blockchain-based reviews

---

**Built with ❤️ by the Nomadiqe Team**
