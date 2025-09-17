# Nomadiqe Onboarding Testing Guide

## 🧪 **Complete Testing Instructions**

This guide provides step-by-step instructions for testing the complete Nomadiqe onboarding wizard system.

## 🚀 **Getting Started**

### **Prerequisites**
1. Development server running: `npm run dev` (should be on http://localhost:3001)
2. Database schema applied: `npx prisma db push`
3. Environment variables configured (at minimum `DATABASE_URL` and `NEXTAUTH_SECRET`)

### **Test Environment Setup**
- Use incognito/private browsing to test fresh user experience
- Clear browser data between test runs if needed
- Check browser console for any errors

## 📋 **Testing Checklist**

### **🔐 Authentication & Signup Flow**

#### **Test 1: Email/Password Signup**
1. **Navigate to**: Landing page (or directly to `/auth/signup`)
2. **Click**: "Get Started" or signup button → Should go to `/auth/signup`
3. **Fill Form**: 
   - Full Name: "John Doe"
   - Email: "john.doe.test@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
4. **Submit**: Click "Create account"
5. **Expected**: Redirect to `/onboarding/welcome`

#### **Test 2: Google OAuth (if configured)**
1. **Navigate to**: `/auth/signup`
2. **Click**: "Continue with Google"
3. **Expected**: OAuth flow → Redirect to `/onboarding/welcome`

---

### **👤 Guest Onboarding Flow (3 Steps)**

#### **Step 1: Profile Setup**
1. **URL**: `/onboarding/welcome` → `/onboarding/profile-setup`
2. **Test Form**:
   - Full Name: "Jane Guest"
   - Username: "jane_guest"
   - Profile Picture: Skip for now
3. **Validation**: Try invalid usernames (spaces, special chars)
4. **Submit**: Click "Continue"
5. **Expected**: Navigate to `/onboarding/role-selection`

#### **Step 2: Role Selection**
1. **URL**: `/onboarding/role-selection`
2. **UI Check**: Guest should be marked as "Popular"
3. **Test**: Click "More Options" to reveal Influencer option
4. **Select**: Guest role
5. **Submit**: Click "Continue as Guest"
6. **Expected**: Navigate to `/onboarding/interest-selection`

#### **Step 3: Interest Selection**
1. **URL**: `/onboarding/interest-selection`
2. **Test Features**:
   - Select individual interests (Adventure, Beach, etc.)
   - Try quick selection presets (Adventure Seeker, Culture Lover)
   - Test skip functionality
3. **Navigation**: Test "Back" button to role selection
4. **Submit**: Click "Complete Setup"
5. **Expected**: Redirect to `/dashboard` with guest dashboard

---

### **🏠 Host Onboarding Flow (4 Steps)**

#### **Step 1-2: Profile + Role** (Same as Guest)
1. **Complete**: Profile setup with host-focused info
2. **Select**: Host role
3. **Expected**: Navigate to `/onboarding/listing-creation`

#### **Step 3: Listing Creation (6-Step Wizard)**
1. **URL**: `/onboarding/listing-creation`
2. **Test Wizard Steps**:

   **4a. Basic Information**
   - Title: "Beautiful Apartment in Paris"
   - Property Type: Select "Apartment"
   - Description: "A stunning 2-bedroom apartment located in the heart of Paris with amazing city views and modern amenities. Perfect for couples or small families visiting the city of lights."
   
   **4b. Location Details**
   - Address: "123 Rue de Rivoli"
   - City: "Paris"
   - Country: "France"
   
   **4c. Property Details**
   - Max Guests: 4 (use +/- buttons)
   - Bedrooms: 2
   - Bathrooms: 1
   
   **4d. Amenities**
   - Select multiple amenities (WiFi, Kitchen, AC, etc.)
   - Test selection/deselection
   
   **4e. Photos**
   - Note: Demo placeholder with sample image
   - In full version: Upload multiple photos
   
   **4f. Pricing**
   - Base Price: €150
   - Cleaning Fee: €30
   - Currency: EUR

3. **Navigation Testing**:
   - Test "Previous" between wizard steps
   - Test "Back to Role Selection" on first step
   - Test validation on each step
4. **Submit**: Click "Create Listing"
5. **Expected**: Navigate to `/onboarding/collaboration-setup`

#### **Step 4: Collaboration Setup**
1. **URL**: `/onboarding/collaboration-setup`
2. **Test Form**:
   - Offer Type: Select "Free Stay" (Popular option)
   - Min/Max Nights: 2-7 nights
   - Deliverables: Select multiple (Instagram posts, stories, etc.)
   - Min Follower Count: 10000
   - Preferred Niches: Select travel, lifestyle, photography
   - Collaboration Terms: "Stay must be promoted on social media..."
3. **Navigation**: Test "Back to Listing" button
4. **Submit**: Click "Complete Host Setup"
5. **Expected**: Redirect to `/dashboard/host`

---

### **📱 Influencer Onboarding Flow (4 Steps)**

#### **Step 1-2: Profile + Role** (Same as Guest)
1. **Complete**: Profile setup
2. **Show Influencer**: Click "More Options" to reveal
3. **Select**: Influencer role
4. **Note**: Should show beta warning
5. **Expected**: Navigate to `/onboarding/social-connect`

#### **Step 3: Social Media Connection**
1. **URL**: `/onboarding/social-connect`
2. **Test Platforms**:
   
   **Connect Instagram**:
   - Click Instagram card
   - Demo form: Username "travel_jane", Followers "15000"
   - Click "Connect Account"
   - Success screen with account details
   
   **Connect Additional** (Optional):
   - Click "Connect Another Platform"
   - Try TikTok or YouTube
   - Test multiple connections

3. **Navigation**: Test "Back to Role Selection" button
4. **Continue**: Click "Continue to Profile Setup"
5. **Expected**: Navigate to `/onboarding/media-kit-setup`

#### **Step 4: Media Kit Setup**
1. **URL**: `/onboarding/media-kit-setup`
2. **Test Form**:
   - Content Niches: Select 3-5 niches (travel, lifestyle, photography)
   - Deliverables: Set Instagram posts (2), Stories (5), TikTok (1)
   - Custom Deliverables: Add "Reels package"
   - Portfolio URL: "https://jane-travel.com"
   - Collaboration Terms: Detailed terms about content quality
3. **Navigation**: Test "Back to Social Connect" button
4. **Submit**: Click "Complete Influencer Setup"
5. **Expected**: 
   - Success message with unique profile link
   - Redirect to `/dashboard/influencer`

---

## ✅ **Wizard UI Testing**

### **Visual Elements**
- [ ] **Progress Bar**: Shows correct percentage for each role
- [ ] **Step Indicators**: Circular breadcrumbs with completion states
- [ ] **Current Step Highlighting**: Active step clearly marked
- [ ] **Responsive Design**: Test on mobile, tablet, desktop
- [ ] **Loading States**: Spinners during API calls
- [ ] **Error States**: Form validation and API errors

### **Navigation Testing**
- [ ] **Back Buttons**: All steps have appropriate back navigation
- [ ] **Continue Buttons**: Properly disabled until valid
- [ ] **URL Navigation**: Direct URL access to any step
- [ ] **Browser Back/Forward**: Should work correctly
- [ ] **Deep Linking**: Each step accessible via direct URL

### **Form Validation**
- [ ] **Client-Side**: Real-time validation feedback
- [ ] **Server-Side**: API validation with error messages
- [ ] **Field-Specific**: Individual field error highlighting
- [ ] **General Errors**: API errors displayed clearly

---

## 🔍 **Advanced Testing Scenarios**

### **Edge Cases**
1. **Incomplete Session**: What happens if session expires mid-flow?
2. **Network Errors**: Test with slow/failed network requests
3. **Database Errors**: Test with connection issues
4. **Invalid States**: Accessing steps out of order
5. **Browser Refresh**: Resuming onboarding mid-flow

### **Role Switching**
1. **Start as Guest**: Complete flow, then test switching roles later
2. **Start as Host**: Test the comprehensive 5-step flow
3. **Start as Influencer**: Test social connection requirements

### **Data Persistence**
1. **Partial Completion**: Leave mid-flow, return later
2. **Progress Tracking**: Verify completed steps are marked
3. **Form Data**: Check if form data persists between steps

---

## 🐛 **Common Issues to Watch For**

### **Frontend Issues**
- [ ] Buttons not appearing or non-functional
- [ ] Form validation not working
- [ ] Progress indicators showing wrong state
- [ ] Mobile responsiveness issues
- [ ] Loading states not showing

### **Backend Issues**
- [ ] API endpoints returning errors
- [ ] Database constraint violations
- [ ] Session management problems
- [ ] Role assignment errors
- [ ] Progress tracking failures

### **Navigation Issues**
- [ ] URLs not matching expected routes
- [ ] Back buttons going to wrong steps
- [ ] Middleware redirect loops
- [ ] Deep linking not working

---

## 📊 **Success Criteria**

### **Completion Rates**
- [ ] **Guest Flow**: 100% completion in under 2 minutes
- [ ] **Host Flow**: 95% completion in under 10 minutes
- [ ] **Influencer Flow**: 90% completion in under 8 minutes

### **User Experience**
- [ ] **Intuitive Navigation**: Users understand next steps
- [ ] **Clear Progress**: Always know where they are in the flow
- [ ] **Error Recovery**: Clear error messages and recovery paths
- [ ] **Mobile Friendly**: Full functionality on all devices

### **Technical Performance**
- [ ] **Fast Loading**: Steps load within 1 second
- [ ] **No Errors**: Clean console logs
- [ ] **Smooth Transitions**: No jarring page changes
- [ ] **Data Integrity**: All user data properly saved

---

## 🎯 **Quick Test Command**

For rapid testing, use this sequence:

```bash
# 1. Reset database if needed
npx prisma db push --accept-data-loss

# 2. Start dev server
npm run dev

# 3. Test flows:
# - Guest: /auth/signup → complete 3-step flow
# - Host: /auth/signup → complete 5-step flow  
# - Influencer: /auth/signup → complete 5-step flow
```

## 📝 **Test Results Template**

```
Date: ___________
Tester: ___________

Guest Flow:
□ Signup: _____ (Pass/Fail)
□ Profile: _____ (Pass/Fail)
□ Role: _____ (Pass/Fail)
□ Interests: _____ (Pass/Fail)
□ Completion: _____ (Pass/Fail)

Host Flow:
□ Signup: _____ (Pass/Fail)
□ Profile: _____ (Pass/Fail)
□ Role: _____ (Pass/Fail)
□ Verification: _____ (Pass/Fail)
□ Listing: _____ (Pass/Fail)
□ Collaboration: _____ (Pass/Fail)
□ Completion: _____ (Pass/Fail)

Influencer Flow:
□ Signup: _____ (Pass/Fail)
□ Profile: _____ (Pass/Fail)
□ Role: _____ (Pass/Fail)
□ Verification: _____ (Pass/Fail)
□ Social Connect: _____ (Pass/Fail)
□ Media Kit: _____ (Pass/Fail)
□ Completion: _____ (Pass/Fail)

Issues Found:
________________
________________

Overall Rating: ___/10
```

---

*Ready to test the complete Nomadiqe onboarding experience! 🚀*
