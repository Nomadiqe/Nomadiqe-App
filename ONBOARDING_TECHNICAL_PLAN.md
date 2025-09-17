# Nomadiqe Onboarding Feature - Technical Implementation Plan

## Table of Contents
1. [Overview](#overview)
2. [Technical Architecture](#technical-architecture)
3. [Database Schema](#database-schema)
4. [API Design](#api-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Implementation](#frontend-implementation)
7. [Third-Party Integrations](#third-party-integrations)
8. [Security & Compliance](#security--compliance)
9. [Implementation Phases](#implementation-phases)
10. [Testing Strategy](#testing-strategy)
11. [Performance Considerations](#performance-considerations)

## Overview

This document outlines the technical implementation plan for the Nomadiqe user onboarding feature. The onboarding system supports three distinct user roles (Guest, Host, Influencer) with a common initial flow that diverges based on role selection.

### Key Technical Requirements
- **Multi-role onboarding** with conditional flows
- **Social authentication** (Google, Apple, Facebook)
- **Identity verification** for Hosts and Influencers
- **Social media API integration** for Influencers
- **Listing creation wizard** for Hosts
- **Progressive disclosure** pattern for optional steps

## Technical Architecture

### System Components

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API Gateway    │────▶│  Backend APIs   │
│  (Next.js/React)│     │                  │     │   (Node.js)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                        │
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Auth Service  │     │ Identity Service │     │   Database      │
│  (NextAuth.js)  │     │   (3rd Party)    │     │  (PostgreSQL)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### State Management
- **Frontend**: React Context API or Zustand for onboarding flow state
- **Backend**: Session-based state management with Redis for progress tracking
- **Database**: PostgreSQL with Prisma ORM

## Database Schema

### Core Tables

```sql
-- Users table (extends existing schema)
users {
  id                    UUID PRIMARY KEY
  email                 VARCHAR(255) UNIQUE NOT NULL
  username              VARCHAR(50) UNIQUE NOT NULL
  full_name             VARCHAR(255) NOT NULL
  profile_picture_url   TEXT
  role                  ENUM('guest', 'host', 'influencer') NOT NULL
  onboarding_status     ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending'
  onboarding_step       VARCHAR(50)
  email_verified        BOOLEAN DEFAULT false
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
}

-- Onboarding progress tracking
onboarding_progress {
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id)
  current_step          VARCHAR(50) NOT NULL
  completed_steps       JSONB DEFAULT '[]'
  metadata              JSONB
  started_at            TIMESTAMP
  completed_at          TIMESTAMP
}

-- Guest preferences
guest_preferences {
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id) UNIQUE
  travel_interests      TEXT[] -- Array of interest tags
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
}

-- Host profiles
host_profiles {
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id) UNIQUE
  identity_verified     BOOLEAN DEFAULT false
  verification_status   ENUM('pending', 'verified', 'rejected')
  verification_date     TIMESTAMP
  standard_offer        JSONB
  min_follower_count    INTEGER
  preferred_niches      TEXT[]
  referral_code         VARCHAR(20) UNIQUE
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
}

-- Influencer profiles
influencer_profiles {
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id) UNIQUE
  identity_verified     BOOLEAN DEFAULT false
  verification_status   ENUM('pending', 'verified', 'rejected')
  verification_date     TIMESTAMP
  content_niches        TEXT[] NOT NULL
  deliverables          JSONB
  portfolio_url         TEXT
  profile_link          VARCHAR(100) UNIQUE
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
}

-- Social media connections
social_connections {
  id                    UUID PRIMARY KEY
  user_id               UUID REFERENCES users(id)
  platform              ENUM('instagram', 'tiktok', 'youtube') NOT NULL
  platform_user_id      VARCHAR(255) NOT NULL
  username              VARCHAR(255)
  follower_count        INTEGER
  access_token          TEXT -- Encrypted
  refresh_token         TEXT -- Encrypted
  token_expires_at      TIMESTAMP
  is_primary            BOOLEAN DEFAULT false
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
  UNIQUE(user_id, platform)
}

-- Property listings (for hosts)
property_listings {
  id                    UUID PRIMARY KEY
  host_id               UUID REFERENCES users(id)
  title                 VARCHAR(255) NOT NULL
  location              JSONB NOT NULL -- {address, city, country, coordinates}
  property_type         VARCHAR(50) NOT NULL
  amenities             JSONB NOT NULL -- Structured amenities data
  photos                JSONB -- Array of photo URLs
  pricing               JSONB NOT NULL -- {base_price, cleaning_fee, currency}
  availability          JSONB -- Calendar availability data
  status                ENUM('draft', 'published', 'inactive')
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
}
```

## API Design

### Authentication Endpoints

```typescript
// Social authentication
POST   /api/auth/social/{provider}
Body:  { token: string, provider: 'google' | 'apple' | 'facebook' }
Response: { user: User, token: string, isNewUser: boolean }

// Email authentication
POST   /api/auth/register
Body:  { email: string, password: string }
Response: { user: User, token: string }

POST   /api/auth/login
Body:  { email: string, password: string }
Response: { user: User, token: string }
```

### Onboarding Endpoints

```typescript
// Common onboarding
POST   /api/onboarding/profile
Body:  { fullName: string, username: string, profilePicture?: File }
Response: { success: boolean, nextStep: string }

POST   /api/onboarding/role
Body:  { role: 'guest' | 'host' | 'influencer' }
Response: { success: boolean, nextStep: string }

GET    /api/onboarding/progress
Response: { currentStep: string, completedSteps: string[], metadata: object }

// Guest onboarding
POST   /api/onboarding/guest/interests
Body:  { interests: string[] }
Response: { success: boolean, onboardingComplete: boolean }

// Host onboarding
POST   /api/onboarding/host/verify-identity
Body:  { verificationData: object }
Response: { verificationId: string, status: string }

POST   /api/onboarding/host/create-listing
Body:  { 
  location: object,
  propertyType: string,
  amenities: object,
  photos: File[],
  pricing: object,
  availability: object
}
Response: { listingId: string, success: boolean }

POST   /api/onboarding/host/collaboration-setup
Body:  { 
  standardOffer: object,
  minFollowerCount?: number,
  preferredNiches?: string[]
}
Response: { success: boolean, onboardingComplete: boolean }

// Influencer onboarding
POST   /api/onboarding/influencer/verify-identity
Body:  { verificationData: object }
Response: { verificationId: string, status: string }

POST   /api/onboarding/influencer/connect-social
Body:  { 
  platform: 'instagram' | 'tiktok' | 'youtube',
  authCode: string
}
Response: { connected: boolean, profile: object }

POST   /api/onboarding/influencer/setup-profile
Body:  { 
  contentNiches: string[],
  deliverables?: object,
  portfolioUrl?: string
}
Response: { success: boolean, profileLink: string, onboardingComplete: boolean }
```

## Authentication & Authorization

### Implementation Strategy

```typescript
// NextAuth.js configuration
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Custom email/password authentication logic
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Handle JWT token creation and updates
    },
    async session({ session, token }) {
      // Customize session data
    }
  },
  pages: {
    signIn: '/onboarding/signin',
    newUser: '/onboarding/welcome'
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
// Middleware for role-based route protection
export function withRole(allowedRoles: UserRole[]) {
  return async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const session = await getSession({ req });
    
    if (!session || !allowedRoles.includes(session.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}
```

## Frontend Implementation

### Component Structure

```
/components/onboarding/
├── common/
│   ├── OnboardingLayout.tsx
│   ├── ProgressIndicator.tsx
│   ├── StepNavigation.tsx
│   └── SkipButton.tsx
├── steps/
│   ├── AccountCreation.tsx
│   ├── ProfileSetup.tsx
│   ├── RoleSelection.tsx
│   ├── guest/
│   │   └── InterestSelection.tsx
│   ├── host/
│   │   ├── IdentityVerification.tsx
│   │   ├── ListingWizard/
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── AmenitiesSelector.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   └── PricingAvailability.tsx
│   │   └── CollaborationSetup.tsx
│   └── influencer/
│       ├── IdentityVerification.tsx
│       ├── SocialMediaConnect.tsx
│       └── ProfileMediaKit.tsx
└── OnboardingFlow.tsx
```

### State Management

```typescript
// Onboarding context
interface OnboardingState {
  currentStep: string;
  completedSteps: string[];
  role?: UserRole;
  formData: Record<string, any>;
  isLoading: boolean;
  error?: string;
}

interface OnboardingActions {
  setStep: (step: string) => void;
  completeStep: (step: string) => void;
  updateFormData: (data: Record<string, any>) => void;
  skipStep: () => void;
  goBack: () => void;
}
```

### Flow Control Logic

```typescript
// Step configuration
const ONBOARDING_STEPS = {
  common: ['account-creation', 'profile-setup', 'role-selection'],
  guest: ['interest-selection'],
  host: ['identity-verification', 'listing-creation', 'collaboration-setup'],
  influencer: ['identity-verification', 'social-connect', 'profile-setup']
};

// Dynamic step navigation
function getNextStep(currentStep: string, role: UserRole): string {
  const allSteps = [...ONBOARDING_STEPS.common, ...ONBOARDING_STEPS[role]];
  const currentIndex = allSteps.indexOf(currentStep);
  return allSteps[currentIndex + 1] || 'complete';
}
```

## Third-Party Integrations

### Identity Verification Service

```typescript
// Integration with identity verification provider (e.g., Jumio, Onfido)
interface IdentityVerificationService {
  createVerificationSession(userId: string): Promise<VerificationSession>;
  getVerificationStatus(sessionId: string): Promise<VerificationStatus>;
  webhookHandler(payload: any): Promise<void>;
}

// Webhook endpoint
POST /api/webhooks/identity-verification
```

### Social Media APIs

```typescript
// Instagram Basic Display API
interface InstagramService {
  getAuthorizationUrl(redirectUri: string): string;
  exchangeCodeForToken(code: string): Promise<AccessToken>;
  getUserProfile(accessToken: string): Promise<InstagramProfile>;
  refreshAccessToken(refreshToken: string): Promise<AccessToken>;
}

// TikTok Login Kit
interface TikTokService {
  getAuthorizationUrl(redirectUri: string): string;
  getAccessToken(code: string): Promise<AccessToken>;
  getUserInfo(accessToken: string): Promise<TikTokProfile>;
}

// YouTube Data API
interface YouTubeService {
  getAuthorizationUrl(redirectUri: string): string;
  exchangeCodeForToken(code: string): Promise<AccessToken>;
  getChannelInfo(accessToken: string): Promise<YouTubeChannel>;
}
```

### File Upload Service

```typescript
// S3 or similar cloud storage integration
interface FileUploadService {
  generatePresignedUrl(key: string): Promise<string>;
  uploadFile(file: File, key: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
```

## Security & Compliance

### Security Measures

1. **Input Validation**
   - Validate all user inputs server-side
   - Sanitize file uploads (type, size, content)
   - SQL injection prevention via parameterized queries

2. **Authentication Security**
   - JWT tokens with short expiration times
   - Refresh token rotation
   - Rate limiting on auth endpoints

3. **Data Protection**
   - Encrypt sensitive data at rest (social tokens, verification docs)
   - HTTPS-only communication
   - CORS configuration for API endpoints

4. **Privacy Compliance**
   - GDPR compliance for EU users
   - Data retention policies
   - User consent management

### Security Checklist

```typescript
// Security middleware stack
app.use(helmet()); // Security headers
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting
app.use(cors(corsOptions)); // CORS configuration
app.use(expressValidator()); // Input validation
```

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Database schema setup
- [ ] Authentication system (NextAuth.js)
- [ ] Basic API endpoints
- [ ] Common onboarding flow UI

### Phase 2: Role-Specific Features (Weeks 3-5)
- [ ] Guest onboarding flow
- [ ] Host identity verification integration
- [ ] Host listing creation wizard
- [ ] Basic file upload functionality

### Phase 3: Influencer Features (Weeks 6-7)
- [ ] Social media API integrations
- [ ] Influencer profile setup
- [ ] Media kit functionality

### Phase 4: Advanced Features (Weeks 8-9)
- [ ] Referral system for hosts
- [ ] Influencer feed functionality
- [ ] Collaboration matching algorithm

### Phase 5: Polish & Testing (Weeks 10-11)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

## Testing Strategy

### Unit Tests

```typescript
// Example test for username validation
describe('Username Validation', () => {
  it('should reject usernames with special characters', () => {
    expect(validateUsername('@user!')).toBe(false);
  });
  
  it('should accept valid usernames', () => {
    expect(validateUsername('john_doe123')).toBe(true);
  });
});
```

### Integration Tests

```typescript
// API endpoint testing
describe('POST /api/onboarding/profile', () => {
  it('should create user profile successfully', async () => {
    const response = await request(app)
      .post('/api/onboarding/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'John Doe',
        username: 'johndoe'
      });
      
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### E2E Tests

```typescript
// Cypress test for complete onboarding flow
describe('Host Onboarding Flow', () => {
  it('should complete host onboarding successfully', () => {
    cy.visit('/onboarding');
    cy.signIn({ email: 'test@example.com', password: 'password' });
    
    // Profile setup
    cy.get('[data-testid="full-name"]').type('John Doe');
    cy.get('[data-testid="username"]').type('johndoe');
    cy.get('[data-testid="continue"]').click();
    
    // Role selection
    cy.get('[data-testid="role-host"]').click();
    
    // Continue through remaining steps...
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Progressive Loading**
   - Lazy load heavy components (photo upload, maps)
   - Code splitting for role-specific flows
   - Optimize bundle size

2. **Caching Strategy**
   - Redis for session management
   - CDN for static assets
   - API response caching

3. **Database Optimization**
   - Indexed queries for username/email lookups
   - Connection pooling
   - Query optimization for complex joins

### Performance Metrics

```typescript
// Monitoring setup
const metrics = {
  onboardingStarted: new Counter({
    name: 'onboarding_started_total',
    help: 'Total number of onboarding flows started',
    labelNames: ['role']
  }),
  onboardingCompleted: new Counter({
    name: 'onboarding_completed_total',
    help: 'Total number of onboarding flows completed',
    labelNames: ['role']
  }),
  stepDuration: new Histogram({
    name: 'onboarding_step_duration_seconds',
    help: 'Duration of each onboarding step',
    labelNames: ['step', 'role']
  })
};
```

## Appendix

### Environment Variables

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Social Auth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_ID=
APPLE_SECRET=
FACEBOOK_ID=
FACEBOOK_SECRET=

# Third-party Services
IDENTITY_VERIFICATION_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Social Media APIs
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
YOUTUBE_API_KEY=

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nomadiqe
REDIS_URL=redis://localhost:6379
```

### Error Codes

```typescript
enum OnboardingErrorCodes {
  USERNAME_TAKEN = 'ONBOARDING_001',
  INVALID_USERNAME = 'ONBOARDING_002',
  VERIFICATION_FAILED = 'ONBOARDING_003',
  SOCIAL_CONNECTION_FAILED = 'ONBOARDING_004',
  FILE_UPLOAD_FAILED = 'ONBOARDING_005',
  INVALID_ROLE = 'ONBOARDING_006',
  SESSION_EXPIRED = 'ONBOARDING_007'
}
```

---

*Last Updated: September 2025*
*Version: 1.0.0*
