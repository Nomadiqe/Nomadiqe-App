# Nomadiqe Points Reward System - Design Document

## Overview
This document outlines the comprehensive point reward system for the Nomadiqe app. The system awards points for user engagement and activities, with values calibrated based on business value and effort required.

## Point Values & Rationale

### High-Value Actions (Critical for Business)
| Action | Points | Frequency | Rationale |
|--------|--------|-----------|-----------|
| **Sign Up & Email Verification** | 100 | One-time | Highest business value - acquiring new users |
| **Complete Onboarding** | 75 | One-time | Ensures users are fully set up and ready to engage |
| **Complete Booking** | 50 | Unlimited | Core revenue-generating action |
| **Leave Review** | 25 | Unlimited | Builds trust & content for platform |
| **Daily Check-In** | 10 | Once per day | Drives daily active users (DAU) |

### Medium-Value Actions (Engagement & Content)
| Action | Points | Frequency | Rationale |
|--------|--------|-----------|-----------|
| **Create Post** | 15 | Max 5/day = 75 pts | Generates content, limited to prevent spam |
| **Receive Comment on Post** | 5 | Max 20/day = 100 pts | Rewards engaging content |
| **Write Comment** | 3 | Max 10/day = 30 pts | Encourages community interaction |
| **Upload Property Listing** | 30 | Unlimited | Critical for supply side of marketplace |
| **Update Profile (First Time)** | 20 | One-time | Ensures quality profiles |

### Lower-Value Actions (Easy Engagement)
| Action | Points | Frequency | Rationale |
|--------|--------|-----------|-----------|
| **Like a Post** | 1 | Max 50/day = 50 pts | Easy action, prevent abuse |
| **Receive Like on Post** | 2 | Max 30/day = 60 pts | Rewards popular content |
| **Follow User** | 2 | Max 20/day = 40 pts | Builds network |
| **Get Followed** | 3 | Unlimited | Organic reward |

## Anti-Abuse Mechanisms

### Daily Limits
```typescript
const DAILY_LIMITS = {
  post_created: 5,
  post_liked: 50,        // User gives likes
  comment_created: 10,
  follow_user: 20,
  likes_received: 30,    // Points from receiving likes
  comments_received: 20, // Points from receiving comments
}
```

### Rate Limiting Strategy
- Track actions per user per day in `PointTransaction` with timestamps
- Reset limits at midnight UTC
- Block point awards when daily limit reached
- Log attempts for monitoring abuse patterns

### Abuse Prevention Rules
1. **Self-interaction blocked**: Cannot like own posts, follow self, etc.
2. **Duplicate action detection**: Same action on same entity within 24h = no points
3. **Velocity checks**: Too many actions in short time = temporary cooldown
4. **Pattern detection**: Repetitive behavior flagged for review

### Cooldown Periods
- Creating/deleting same post repeatedly: 1 hour cooldown
- Follow/unfollow same user: 24 hour cooldown
- Rapid commenting on same post: 10 minute delay between comments

## Database Schema

### UserPoints Model
Stores aggregate point totals for each user.

```prisma
model UserPoints {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  totalPoints     Int      @default(0)      // All-time points earned
  currentPoints   Int      @default(0)      // Available points to spend
  lifetimeEarned  Int      @default(0)      // Total earned (including redeemed)
  lifetimeRedeemed Int     @default(0)      // Total spent/redeemed
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@map("user_points")
}
```

### PointTransaction Model
Immutable transaction log for all point activities.

```prisma
model PointTransaction {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  points          Int                        // Positive for earned, negative for redeemed
  action          String                     // 'signup', 'post_created', 'like_received', etc.
  referenceId     String?                    // ID of related entity (post, booking, etc.)
  referenceType   String?                    // 'post', 'booking', 'comment', etc.
  metadata        Json?                      // Additional context
  description     String?                    // Human-readable description
  createdAt       DateTime @default(now())

  @@index([userId, createdAt])
  @@index([action, createdAt])
  @@map("point_transactions")
}
```

### DailyCheckIn Model
Tracks daily check-ins with streak bonuses.

```prisma
model DailyCheckIn {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  checkInDate     DateTime @default(now())   // Date of check-in (day only)
  pointsAwarded   Int      @default(10)
  streakCount     Int      @default(1)        // Consecutive days
  createdAt       DateTime @default(now())

  @@unique([userId, checkInDate])
  @@index([userId, checkInDate])
  @@map("daily_check_ins")
}
```

### PointsRule Model
Configurable rules for point values (admin-managed).

```prisma
model PointsRule {
  id              String   @id @default(cuid())
  action          String   @unique            // 'signup', 'post_created', etc.
  points          Int                         // Point value for action
  dailyLimit      Int?                        // Max times per day (null = unlimited)
  description     String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("points_rules")
}
```

## Core Points Service Architecture

### Service Location
`/lib/services/points-service.ts`

### Key Functions

```typescript
// Award points for an action
async function awardPoints(params: {
  userId: string
  action: string
  points?: number          // Optional override
  referenceId?: string
  referenceType?: string
  description?: string
  metadata?: any
}): Promise<{ success: boolean; points: number; message: string }>

// Check if user can receive points for action today
async function canAwardPoints(
  userId: string,
  action: string
): Promise<{ allowed: boolean; reason?: string }>

// Get user's current point balance
async function getPointsBalance(userId: string): Promise<{
  totalPoints: number
  currentPoints: number
  lifetimeEarned: number
  lifetimeRedeemed: number
}>

// Get transaction history with pagination
async function getPointsHistory(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<PointTransaction[]>

// Daily check-in logic with streak tracking
async function performDailyCheckIn(userId: string): Promise<{
  success: boolean
  points: number
  streakCount: number
  message: string
}>

// Admin: Update points rules
async function updatePointsRule(
  action: string,
  updates: { points?: number; dailyLimit?: number; isActive?: boolean }
): Promise<PointsRule>
```

### Transaction Safety
- All point operations use Prisma transactions
- Atomic updates to prevent race conditions
- Rollback on any failure in the chain

## API Endpoints

### User Endpoints
```
GET  /api/points/balance          # Get current points balance
GET  /api/points/history           # Get transaction history (paginated)
POST /api/points/check-in          # Perform daily check-in
GET  /api/points/stats             # Get user stats (streak, rank, etc.)
```

### Admin Endpoints
```
GET    /api/admin/points/rules     # List all point rules
PUT    /api/admin/points/rules/[action]  # Update specific rule
POST   /api/admin/points/adjust    # Manually adjust user points
GET    /api/admin/points/leaderboard     # Top users by points
```

## Integration Points

### Routes to Modify

1. **`/api/auth/signup/route.ts`**
   - Award 100 points on successful signup
   - Create UserPoints record

2. **`/api/onboarding/progress/route.ts`**
   - Award 75 points when onboarding completed
   - One-time bonus check

3. **`/api/posts/route.ts` (POST)**
   - Award 15 points per post created
   - Check daily limit (5 posts)

4. **`/api/posts/[id]/like/route.ts`**
   - Award 1 point to user giving like (limit 50/day)
   - Award 2 points to post author receiving like (limit 30/day)

5. **`/api/posts/[id]/comments/route.ts`**
   - Award 3 points to commenter (limit 10/day)
   - Award 5 points to post author receiving comment (limit 20/day)

6. **`/api/bookings/route.ts`** (when booking completed)
   - Award 50 points to user who booked

7. **`/api/reviews/route.ts`**
   - Award 25 points when review submitted

8. **Profile update endpoint**
   - Award 20 points on first complete profile update

## UI Components

### 1. Points Display Component
**Location:** `/components/points/PointsDisplay.tsx`

**Implemented in:**
- Mobile navigation header (scaled down for mobile)
- Desktop navigation header
- GuestDashboard header section
- HostDashboard header section
- InfluencerDashboard header section

Features:
- Show current points balance prominently
- Real-time fetching from `/api/points/balance`
- Gradient background (amber theme)
- Star emoji icon
- Responsive design for mobile and desktop
- Only visible when user is authenticated

### 2. Daily Check-In Button
**Location:** `/components/points/DailyCheckIn.tsx`

**Implemented in:**
- GuestDashboard header section (alongside points display)
- HostDashboard header section (alongside points display)
- InfluencerDashboard header section (alongside points display)

Features:
- Prominent button in dashboard header
- Show streak count
- Disable if already checked in today
- Celebration animation on check-in
- Countdown to next check-in
- Consistent placement across all dashboard types

### 3. Points History Modal
**Location:** `/components/points/PointsHistory.tsx`

Features:
- Filterable transaction list
- Group by date
- Icons for different action types
- Pagination
- Export option

### 4. Points Notification Toast
**Location:** `/components/points/PointsToast.tsx`

Features:
- Non-intrusive toast when points earned
- Show action and points awarded
- Auto-dismiss after 3 seconds
- Stack multiple notifications

### 5. Leaderboard Component (Optional)
**Location:** `/components/points/Leaderboard.tsx`

Features:
- Top users by points
- User's current rank
- Filter by timeframe (week, month, all-time)

## Daily Check-In System Details

### Streak Bonus System
```typescript
const STREAK_BONUSES = {
  7: 20,    // 7-day streak: +20 bonus points
  14: 50,   // 14-day streak: +50 bonus points
  30: 100,  // 30-day streak: +100 bonus points
  90: 300,  // 90-day streak: +300 bonus points
}
```

### Check-In Logic
1. User clicks "Check In" button
2. Verify not already checked in today
3. Calculate streak (consecutive days)
4. Award base points (10) + any streak bonus
5. Update DailyCheckIn record
6. Update UserPoints
7. Create PointTransaction
8. Return success with streak info

### Streak Calculation
- Compare last check-in date to today
- If yesterday: increment streak
- If today: already checked in
- If gap > 1 day: reset streak to 1

## Session Integration

### Update NextAuth Session
Extend session to include points:

```typescript
// In lib/auth.ts callbacks
session.user = {
  // ... existing fields
  points: {
    total: user.userPoints?.totalPoints || 0,
    current: user.userPoints?.currentPoints || 0,
  }
}
```

## Monitoring & Analytics

### Metrics to Track
- Daily active users (via check-ins)
- Most common point-earning actions
- Average points per user
- Point inflation rate
- User engagement correlation with points

### Admin Dashboard Insights
- Total points in circulation
- Points awarded per action type
- Abuse detection flags
- User growth via signup points

## Future Enhancements (Not in Initial Implementation)

1. **Point Redemption Store**
   - Badges, profile customization, premium features

2. **Referral System**
   - Award points for successful referrals

3. **Multiplier Events**
   - 2x points weekends
   - Special event bonuses

4. **Achievements/Badges**
   - Milestone rewards (first 1000 points, etc.)

5. **Social Features**
   - Share point milestones
   - Gift points to other users

## Implementation Order

1. Database schema & migration
2. Core points service with transaction safety
3. API endpoints for points operations
4. Integrate with existing signup/onboarding
5. Add daily check-in system
6. Integrate with posts, likes, comments
7. Integrate with bookings & reviews
8. UI components (points display, check-in button)
9. Points history and stats pages
10. Admin management interface
11. Testing & refinement

## Security Considerations

- All point operations server-side only
- Rate limiting on API endpoints
- Validate user authentication before awarding points
- Prevent client-side point manipulation
- Audit trail via immutable transactions
- Regular monitoring for abuse patterns

---

## Implementation Status

**Phase 1 - Core System:** ✅ Complete
- Database schema (UserPoints, PointTransaction, DailyCheckIn, PointsRule)
- Points service with all major actions
- Anti-abuse mechanisms and daily limits
- API endpoints for balance, history, check-in, stats

**Phase 2 - UI Components:** ✅ Complete
- PointsDisplay component with real-time balance
- DailyCheckIn component with streak tracking
- Integration in mobile navigation header
- Integration in all dashboard types (Guest, Host, Influencer)
- Responsive design for mobile and desktop

**Phase 3 - Testing:** ✅ Complete
- Production build verified (no TypeScript errors)
- Points display functional across all dashboards
- Mobile header displaying points correctly
- Daily check-in button working

**Next Steps:**
- Monitor user engagement and point distribution
- Fine-tune point values based on usage patterns
- Add points history modal for detailed transaction view
- Implement leaderboard feature (optional)