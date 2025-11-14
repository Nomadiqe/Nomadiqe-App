-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Critical for data security in Supabase
-- ================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE traveler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_rules ENABLE ROW LEVEL SECURITY;

-- ================================================
-- USERS TABLE POLICIES
-- ================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can read profiles of other users (for social features)
CREATE POLICY "Users can read other profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ================================================
-- PROFILE TABLES POLICIES
-- ================================================

-- Host Profiles
CREATE POLICY "Users can read their own host profile"
  ON host_profiles FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can read other host profiles"
  ON host_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own host profile"
  ON host_profiles FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update their own host profile"
  ON host_profiles FOR UPDATE
  USING (auth.uid() = "userId");

-- Traveler Profiles
CREATE POLICY "Users can manage their own traveler profile"
  ON traveler_profiles FOR ALL
  USING (auth.uid() = "userId");

CREATE POLICY "Users can read other traveler profiles"
  ON traveler_profiles FOR SELECT
  USING (true);

-- Influencer Profiles
CREATE POLICY "Users can manage their own influencer profile"
  ON influencer_profiles FOR ALL
  USING (auth.uid() = "userId");

CREATE POLICY "Users can read influencer profiles"
  ON influencer_profiles FOR SELECT
  USING (true);

-- Guest Preferences
CREATE POLICY "Users can manage their own preferences"
  ON guest_preferences FOR ALL
  USING (auth.uid() = "userId");

-- Onboarding Progress
CREATE POLICY "Users can manage their own onboarding"
  ON onboarding_progress FOR ALL
  USING (auth.uid() = "userId");

-- Social Connections
CREATE POLICY "Users can manage their own social connections"
  ON social_connections FOR ALL
  USING (auth.uid() = "userId");

-- ================================================
-- PROPERTIES TABLE POLICIES
-- ================================================

-- Anyone can read active properties
CREATE POLICY "Anyone can read active properties"
  ON properties FOR SELECT
  USING ("isActive" = true OR auth.uid() = "hostId");

-- Hosts can create properties
CREATE POLICY "Hosts can create properties"
  ON properties FOR INSERT
  WITH CHECK (
    auth.uid() = "hostId" AND
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('HOST', 'ADMIN')
    )
  );

-- Hosts can update their own properties
CREATE POLICY "Hosts can update own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = "hostId");

-- Hosts can delete their own properties
CREATE POLICY "Hosts can delete own properties"
  ON properties FOR DELETE
  USING (auth.uid() = "hostId");

-- Admins can manage all properties
CREATE POLICY "Admins can manage all properties"
  ON properties FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'ADMIN'
    )
  );

-- ================================================
-- AVAILABILITY TABLE POLICIES
-- ================================================

-- Anyone can read availability
CREATE POLICY "Anyone can read availability"
  ON availability FOR SELECT
  USING (true);

-- Property hosts can manage availability
CREATE POLICY "Hosts can manage property availability"
  ON availability FOR ALL
  USING (
    "propertyId" IN (
      SELECT id FROM properties WHERE "hostId" = auth.uid()
    )
  );

-- ================================================
-- BOOKINGS TABLE POLICIES
-- ================================================

-- Users can read their own bookings (as traveler)
CREATE POLICY "Travelers can read own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = "travelerId");

-- Hosts can read bookings for their properties
CREATE POLICY "Hosts can read bookings for their properties"
  ON bookings FOR SELECT
  USING (
    "propertyId" IN (
      SELECT id FROM properties WHERE "hostId" = auth.uid()
    )
  );

-- Travelers can create bookings
CREATE POLICY "Travelers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = "travelerId");

-- Travelers can update their own bookings
CREATE POLICY "Travelers can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = "travelerId");

-- Hosts can update bookings for their properties
CREATE POLICY "Hosts can update property bookings"
  ON bookings FOR UPDATE
  USING (
    "propertyId" IN (
      SELECT id FROM properties WHERE "hostId" = auth.uid()
    )
  );

-- ================================================
-- PAYMENTS TABLE POLICIES
-- ================================================

-- Users can read payments for their bookings
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  USING (
    "bookingId" IN (
      SELECT id FROM bookings WHERE "travelerId" = auth.uid()
    )
  );

-- Hosts can read payments for their property bookings
CREATE POLICY "Hosts can read property payments"
  ON payments FOR SELECT
  USING (
    "bookingId" IN (
      SELECT b.id FROM bookings b
      JOIN properties p ON b."propertyId" = p.id
      WHERE p."hostId" = auth.uid()
    )
  );

-- System can create payments (consider using service role for this)
CREATE POLICY "Authenticated users can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ================================================
-- REVIEWS TABLE POLICIES
-- ================================================

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

-- Users can create reviews for their own bookings
CREATE POLICY "Users can create reviews for own bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = "reviewerId" AND
    "bookingId" IN (
      SELECT id FROM bookings WHERE "travelerId" = auth.uid()
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = "reviewerId");

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = "reviewerId");

-- ================================================
-- SOCIAL FEATURES POLICIES
-- ================================================

-- Likes
CREATE POLICY "Anyone can read likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON likes FOR ALL
  USING (auth.uid() = "userId");

-- Follows
CREATE POLICY "Anyone can read follows"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own follows"
  ON follows FOR ALL
  USING (auth.uid() = "followerId");

-- Posts
CREATE POLICY "Anyone can read active posts"
  ON posts FOR SELECT
  USING ("isActive" = true OR auth.uid() = "authorId");

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = "authorId");

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = "authorId");

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = "authorId");

-- Post Likes
CREATE POLICY "Anyone can read post likes"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own post likes"
  ON post_likes FOR ALL
  USING (auth.uid() = "userId");

-- Post Comments
CREATE POLICY "Anyone can read post comments"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create post comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = "authorId");

CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = "authorId");

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = "authorId");

-- ================================================
-- MESSAGING POLICIES
-- ================================================

-- Conversations
CREATE POLICY "Users can read their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = "userAId" OR auth.uid() = "userBId");

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = "userAId" OR auth.uid() = "userBId");

-- Messages
CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  USING (
    "conversationId" IN (
      SELECT id FROM conversations 
      WHERE "userAId" = auth.uid() OR "userBId" = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = "senderId" AND
    "conversationId" IN (
      SELECT id FROM conversations 
      WHERE "userAId" = auth.uid() OR "userBId" = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = "senderId");

-- ================================================
-- ADS & EXPERIENCES POLICIES
-- ================================================

-- Ads (read-only for users, admin-managed)
CREATE POLICY "Anyone can read active ads"
  ON ads FOR SELECT
  USING ("isActive" = true);

CREATE POLICY "Admins can manage ads"
  ON ads FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'ADMIN'
    )
  );

-- Local Experiences
CREATE POLICY "Anyone can read active experiences"
  ON local_experiences FOR SELECT
  USING ("isActive" = true);

CREATE POLICY "Authenticated users can create experiences"
  ON local_experiences FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ================================================
-- POINTS SYSTEM POLICIES
-- ================================================

-- User Points
CREATE POLICY "Users can read their own points"
  ON user_points FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can read other users points"
  ON user_points FOR SELECT
  USING (true);

-- Point Transactions
CREATE POLICY "Users can read their own transactions"
  ON point_transactions FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "System can create point transactions"
  ON point_transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Daily Check-ins
CREATE POLICY "Users can manage their own check-ins"
  ON daily_check_ins FOR ALL
  USING (auth.uid() = "userId");

-- Points Rules (read-only for users)
CREATE POLICY "Anyone can read points rules"
  ON points_rules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage points rules"
  ON points_rules FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'ADMIN'
    )
  );

-- ================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ================================================

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant select on all tables to authenticated users (RLS will filter)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant usage on all sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;








