# MVP Implementation Plan - Nomadiqe
**Last Updated:** November 18, 2025 (Week 1 Complete)
**Timeline:** 6 weeks
**Goal:** Launch revenue-generating MVP with legal compliance

---

## 📊 Executive Summary

This plan outlines the path to MVP launch focusing on:
1. **Critical bug fixes** blocking user acquisition ✅ **WEEK 1 COMPLETE**
2. **Revenue-generating features** (booking & payment system)
3. **Legal compliance** (Terms, Privacy, GDPR) ✅ **WEEK 1 COMPLETE**
4. **Core UX improvements** for launch readiness

**Current Status:**
- ✅ Supabase migration: **COMPLETE**
- ✅ OAuth authentication: **COMPLETE**
- ✅ Property listings: **COMPLETE**
- ✅ Week 1 Critical Fixes: **COMPLETE**
- ✅ Legal Compliance: **COMPLETE**
- 🔴 Booking system: **NOT STARTED**
- 🔴 Payment integration: **NOT STARTED**

---

## 🚨 CRITICAL BLOCKERS (Week 1) ✅ **COMPLETE**

All critical bugs have been resolved:

### 1. Guest Sign-up Flow Blocked ✅
- **Issue:** Users cannot complete guest registration
- **Impact:** HIGHEST - Blocks new user acquisition
- **Status:** ✅ COMPLETE (Fixed in previous session)
- **Notion:** https://www.notion.so/2a84416f2145800584b1ded92c53e0a6

### 2. Lower Nav Bar Missing Elements ✅
- **Issue:** Profile and + button missing from mobile nav
- **Impact:** HIGHEST - Breaks mobile navigation
- **Status:** ✅ COMPLETE (Already fixed in commit 7982bae)
- **Notion:** https://www.notion.so/2a04416f214580cbb0a4fba084acff49

### 3. Reserve/Share/Save Buttons Not Working ✅
- **Issue:** Primary CTAs on property pages don't function
- **Impact:** HIGHEST - Blocks potential bookings
- **Status:** ✅ COMPLETE - In Biz Review
- **Solution:** Created PropertyActionButtons and ReserveButton client components with auth checks
- **Notion:** https://www.notion.so/29a4416f2145806fb864dd89c6aa6e6d

### 4. Media Kit Not Visible ✅
- **Issue:** Influencer media kit not displaying on profiles
- **Impact:** HIGH - Affects creator value proposition
- **Status:** ✅ COMPLETE - In Biz Review
- **Solution:** Created MediaKitDisplay component and integrated into profile tabs
- **Notion:** https://www.notion.so/2a64416f2145808aac2cd712978b2db7

---

## ⚖️ LEGAL REQUIREMENTS (Week 1) ✅ **COMPLETE**

**REQUIRED for public launch** - All legal requirements met:

### Terms of Service & Privacy Policy ✅
- **Issue:** Pages currently return 404
- **Impact:** CRITICAL - Legal requirement for GDPR, CCPA, app stores
- **Status:** ✅ COMPLETE - In Biz Review
- **Solution:** Created comprehensive GDPR/CCPA-compliant legal pages
  - `/app/terms/page.tsx` - 15 sections, 238 lines, Italian law compliance
  - `/app/privacy/page.tsx` - 14 sections, 300 lines, full GDPR rights detailed
  - Proper metadata, back navigation, Italian formatting
- **Notion:** https://www.notion.so/0517d2d6f9044e8696646087a8f514d2

### Fix 404 Errors ✅
- **Issue:** Favicon and other static assets returning 404
- **Impact:** MEDIUM - Professional appearance
- **Status:** ✅ COMPLETE - In Biz Review
- **Solution:**
  - Verified all favicon files exist in `/public` directory
  - Added manifest.json link to app metadata
  - PWA icons properly configured
- **Notion:** https://www.notion.so/36f8a0af041e437aa241a73ede36af1f

---

## 💰 REVENUE-CRITICAL FEATURES

### 1. Complete Booking/Reservation Flow (Weeks 2-4)

**Status:** Not Started
**Priority:** CRITICAL - Core revenue feature
**Notion:** https://www.notion.so/32a82e207b0546d8a4e651e9f3d25f28

#### Phase 1: Foundation (Week 2)
**Email Notification System**
- Setup Resend account and API keys
- Install dependencies: `resend`, `react-email`, `@react-email/components`
- Create email templates:
  - Booking confirmation (guest)
  - New booking notification (host)
  - Password reset
- Create email service in `lib/email.ts`
- **Est. Time:** 2-3 days

**Database Schema**
- Design booking schema in Supabase
- Create necessary tables:
  - `bookings` (main booking records)
  - `booking_availability` (calendar/blocked dates)
- Set up RLS policies
- **Est. Time:** 1 day

**Basic API Endpoints**
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `GET /api/bookings/my-bookings` - List guest bookings
- `GET /api/bookings/my-properties` - List host bookings
- **Est. Time:** 1 day

#### Phase 2: Guest Booking Interface (Week 3)
- Date picker component on property page
- Guest count selector
- Booking review page (`/booking/review`)
  - Booking summary
  - Price breakdown (nightly rate, service fee, total)
  - Guest information form
  - Terms & conditions checkbox
- **Est. Time:** 3 days

#### Phase 3: Stripe Integration (Week 3-4)
- Stripe account setup
- Install Stripe SDK (already installed)
- Create Stripe Checkout session
- Payment webhook handler (`/api/payments/webhook`)
- Payment confirmation flow
- Error handling
- **Est. Time:** 3 days

#### Phase 4: Confirmation & Host Dashboard (Week 4)
**Confirmation Flow**
- Booking confirmation page (`/booking/confirmation/[id]`)
- Email confirmations (guest + host)
- Add to calendar option
- **Est. Time:** 2 days

**Host Dashboard**
- Bookings list page (`/dashboard/host/bookings`)
- Booking details view
- Accept/decline actions (if needed)
- Payout management (`/dashboard/host/payouts`)
- Stripe Connect integration
- **Est. Time:** 3 days

### 2. Property Availability Calendar (Week 5)

**Status:** Not Started
**Priority:** HIGH - Prevents double bookings
**Notion:** https://www.notion.so/f88af1dce864459a9aff182458000349

**Implementation:**
- Install `react-big-calendar` or `@fullcalendar/react`
- Host calendar view (`/dashboard/host/properties/[id]/calendar`)
  - Monthly/weekly view
  - Show bookings
  - Show blocked dates
- Block dates interface
- Availability check API
- Real-time availability on guest booking flow
- Database schema for `property_availability`
- **Est. Time:** 3-4 days

---

## 🎯 QUICK WINS (Week 1 & 5)

### Forgot Password Functionality
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/29b4416f214580a8b879fbc195172005
- Supabase already has password reset built-in
- Create forgot password page
- Integrate with existing Supabase auth
- **Est. Time:** 1 day

### Fix Search Filters
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/28f4416f21458055a227d8f3e87dc697
- Close filters on apply
- **Est. Time:** 0.5 days

### Fix Map Filter Buttons
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/29a4416f214580d585e8c333584c19dd
- **Est. Time:** 0.5 days

### Fix Guest Count Selector
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/29a4416f214580b59b90c86af145f8f8
- **Est. Time:** 0.5 days

---

## 💅 MVP POLISH (Week 6)

### Delete Properties Feature
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/2a84416f21458069aad9ceb6a3954abb
- **Est. Time:** 1 day

### House Rules Management
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/2a84416f214580a3b008faec18a31e2d
- **Est. Time:** 2 days

### Italian Compliance Links
- **Status:** Dev To Do
- **Notion:** https://www.notion.so/29d4416f2145807e9d5ac2f031e0c978
- Add links to CIN registration, Alloggiati, etc.
- **Est. Time:** 0.5 days

---

## 📅 6-WEEK SPRINT TIMELINE

### **Week 1: Critical Bugs + Legal** (5-7 days)
**Goal:** Unblock users, achieve legal compliance

Priority order:
1. Fix guest sign-up flow (1-2 days) 🚨
2. Fix lower nav bar (1 day) 🚨
3. Fix reserve/share/save buttons (1-2 days) 🚨
4. Create Terms & Privacy pages (4-5 hours) ⚖️
5. Fix 404 errors - favicon (1 hour)
6. Fix media kit visibility (1 day)

**Deliverables:**
- All critical blockers resolved
- Legal pages live
- Professional polish (no 404s)

### **Week 2: Booking Foundation** (5 days)
**Goal:** Setup infrastructure for booking system

1. Forgot password functionality (1 day)
2. Email notification system (2-3 days)
   - Resend setup
   - React Email templates
3. Booking database schema (1 day)
4. Basic booking API endpoints (1 day)

**Deliverables:**
- Email system operational
- Database ready for bookings
- Password reset working

### **Week 3: Guest Booking Flow** (5 days)
**Goal:** Complete guest-facing booking interface

1. Date picker integration (1 day)
2. Guest count selector (0.5 days)
3. Booking review page (2 days)
4. Stripe Checkout integration (2 days)

**Deliverables:**
- Guests can select dates and create bookings
- Payment processing functional

### **Week 4: Complete Booking System** (5 days)
**Goal:** End-to-end booking flow operational

1. Payment webhook handling (1 day)
2. Confirmation flow + emails (2 days)
3. Host bookings dashboard (2 days)
4. Stripe Connect for payouts (2 days)

**Deliverables:**
- Complete booking flow live
- Hosts can receive bookings
- Revenue generation enabled! 💰

### **Week 5: Calendar & UX** (5 days)
**Goal:** Prevent double bookings, fix key UX issues

1. Property availability calendar (3-4 days)
2. Fix search filters (0.5 days)
3. Fix map filter buttons (0.5 days)
4. Guest count selector fix (0.5 days)

**Deliverables:**
- No double bookings possible
- Search UX improved

### **Week 6: MVP Completion** (5 days)
**Goal:** Polish and launch readiness

1. Delete properties feature (1 day)
2. House rules management (2 days)
3. Italian compliance links (0.5 days)
4. Testing & bug fixes (2 days)
5. Final QA

**Deliverables:**
- MVP feature-complete
- All critical paths tested
- Ready for beta launch

---

## 🚫 OUT OF SCOPE (Post-MVP)

These features are explicitly deferred to Q1-Q2 2026:

**Long-term Features:**
- Stories system
- AI-powered search with voice
- WhatsApp/phone verification
- Face ID/biometric authentication
- Multi-language support (start with English/Italian only)
- Advanced wallet/crypto features
- Push notifications
- Infinite scroll
- In-app messaging
- Reviews & ratings system
- Advanced booking features (cancellation policies)
- Wishlists/Favorites

**Already Complete:**
- ✅ Supabase migration
- ✅ Google OAuth
- ✅ Property listings
- ✅ Map view
- ✅ User profiles
- ✅ Onboarding flow

---

## 📊 SUCCESS METRICS

### Week 1 Success Criteria ✅ **ALL COMPLETE**
- [x] Zero critical bugs blocking user flows
- [x] Terms & Privacy pages live (no 404)
- [x] Users can sign up as guests
- [x] Mobile navigation functional
- [x] Reserve/Share/Save buttons working
- [x] Media kit visible on influencer profiles
- [x] Build passes with zero errors
- [x] Legal compliance achieved

### Week 4 Success Criteria (MVP Complete)
- [ ] Guest can complete booking with payment
- [ ] Host receives booking notification
- [ ] Payment processed via Stripe
- [ ] Confirmation emails sent
- [ ] Host dashboard shows bookings
- [ ] First revenue transaction! 💰

### Week 6 Success Criteria (Launch Ready)
- [ ] Calendar prevents double bookings
- [ ] All MVP features tested
- [ ] No critical bugs
- [ ] Legal compliance verified
- [ ] Ready for beta user testing

---

## 🛠️ TECHNICAL STACK

**Current:**
- ✅ Next.js 14 (App Router)
- ✅ Supabase (Auth + Database)
- ✅ TypeScript
- ✅ Tailwind CSS + Radix UI
- ✅ Leaflet Maps
- ✅ Vercel Blob Storage

**To Add:**
- Stripe (payments) - already installed ✅
- Resend (emails) - need to install
- React Email (email templates) - need to install
- react-big-calendar (availability) - need to install

---

## 🔄 INTEGRATION POINTS

### Supabase
- Auth: Already integrated
- Database: Using for all data
- Storage: Could migrate from Vercel Blob (optional)
- RLS: Need to configure for bookings

### Stripe
- Checkout: For guest payments
- Connect: For host payouts
- Webhooks: For payment confirmation

### Resend
- Transactional emails
- React Email templates
- Delivery tracking

---

## 📝 DEVELOPMENT WORKFLOW

1. **Fix Critical Bugs First** (Week 1)
   - Immediate user impact
   - Unblocks testing

2. **Build Revenue Features** (Weeks 2-4)
   - Enables business model
   - Highest priority features

3. **Prevent Problems** (Week 5)
   - Calendar prevents double bookings
   - Quality of life improvements

4. **Polish for Launch** (Week 6)
   - Final testing
   - Edge case handling
   - Documentation

---

## 🎯 NEXT ACTIONS

**Immediate (Today):**
1. Start with Week 1, Task 1: Fix guest sign-up flow
2. Set up development environment
3. Review critical blocker issues in detail

**This Week:**
- Complete all Week 1 items
- Achieve legal compliance
- Unblock all user flows

**Next Week:**
- Setup email infrastructure
- Design booking database schema
- Start booking API development

---

## 📞 SUPPORT & RESOURCES

**Notion Roadmap:**
https://www.notion.so/MVP-Priority-Roadmap-b1596f6116d44b18bba7e94a4357ff4f

**Task Database:**
https://www.notion.so/27d4416f2145805b8b47d32fc2c41268

**Key Detailed Specs:**
- Booking Flow: https://www.notion.so/32a82e207b0546d8a4e651e9f3d25f28
- Calendar: https://www.notion.so/f88af1dce864459a9aff182458000349
- Email System: https://www.notion.so/c097d286c344492c839cac6a07872601
- Legal Pages: https://www.notion.so/0517d2d6f9044e8696646087a8f514d2

---

**Document Version:** 1.0
**Created:** November 18, 2025
**Author:** Development Team
**Status:** Active Implementation
