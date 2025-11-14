export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          images: string[] | null
          isActive: boolean
          link: string | null
          priority: number
          propertyId: string | null
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          images?: string[] | null
          isActive?: boolean
          link?: string | null
          priority?: number
          propertyId?: string | null
          title: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          images?: string[] | null
          isActive?: boolean
          link?: string | null
          priority?: number
          propertyId?: string | null
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          createdAt: string
          date: string
          id: string
          isAvailable: boolean
          price: number | null
          propertyId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          date: string
          id?: string
          isAvailable?: boolean
          price?: number | null
          propertyId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          date?: string
          id?: string
          isAvailable?: boolean
          price?: number | null
          propertyId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          checkIn: string
          checkOut: string
          createdAt: string
          currency: string
          guests: number
          id: string
          notes: string | null
          propertyId: string
          status: Database["public"]["Enums"]["BookingStatus"]
          totalPrice: number
          travelerId: string
          updatedAt: string
        }
        Insert: {
          checkIn: string
          checkOut: string
          createdAt?: string
          currency?: string
          guests: number
          id?: string
          notes?: string | null
          propertyId: string
          status?: Database["public"]["Enums"]["BookingStatus"]
          totalPrice: number
          travelerId: string
          updatedAt?: string
        }
        Update: {
          checkIn?: string
          checkOut?: string
          createdAt?: string
          currency?: string
          guests?: number
          id?: string
          notes?: string | null
          propertyId?: string
          status?: Database["public"]["Enums"]["BookingStatus"]
          totalPrice?: number
          travelerId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_travelerId_fkey"
            columns: ["travelerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          createdAt: string
          id: string
          updatedAt: string
          userAId: string
          userBId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          updatedAt?: string
          userAId: string
          userBId: string
        }
        Update: {
          createdAt?: string
          id?: string
          updatedAt?: string
          userAId?: string
          userBId?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_userAId_fkey"
            columns: ["userAId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_userBId_fkey"
            columns: ["userBId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_check_ins: {
        Row: {
          checkInDate: string
          createdAt: string
          id: string
          pointsAwarded: number
          streakCount: number
          userId: string
        }
        Insert: {
          checkInDate: string
          createdAt?: string
          id?: string
          pointsAwarded?: number
          streakCount?: number
          userId: string
        }
        Update: {
          checkInDate?: string
          createdAt?: string
          id?: string
          pointsAwarded?: number
          streakCount?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_check_ins_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          createdAt: string
          followerId: string
          followingId: string
          id: string
        }
        Insert: {
          createdAt?: string
          followerId: string
          followingId: string
          id?: string
        }
        Update: {
          createdAt?: string
          followerId?: string
          followingId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followerId_fkey"
            columns: ["followerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_followingId_fkey"
            columns: ["followingId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_preferences: {
        Row: {
          createdAt: string
          id: string
          travelInterests: string[] | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          travelInterests?: string[] | null
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          travelInterests?: string[] | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_preferences_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      host_profiles: {
        Row: {
          bankAccount: string | null
          businessName: string | null
          commission: number
          createdAt: string
          cryptoWallet: string | null
          id: string
          identityVerified: boolean
          minFollowerCount: number | null
          preferredNiches: string[] | null
          referralCode: string | null
          standardOffer: Json | null
          taxId: string | null
          updatedAt: string
          userId: string
          verificationDate: string | null
          verificationStatus: Database["public"]["Enums"]["VerificationStatus"]
        }
        Insert: {
          bankAccount?: string | null
          businessName?: string | null
          commission?: number
          createdAt?: string
          cryptoWallet?: string | null
          id?: string
          identityVerified?: boolean
          minFollowerCount?: number | null
          preferredNiches?: string[] | null
          referralCode?: string | null
          standardOffer?: Json | null
          taxId?: string | null
          updatedAt?: string
          userId: string
          verificationDate?: string | null
          verificationStatus?: Database["public"]["Enums"]["VerificationStatus"]
        }
        Update: {
          bankAccount?: string | null
          businessName?: string | null
          commission?: number
          createdAt?: string
          cryptoWallet?: string | null
          id?: string
          identityVerified?: boolean
          minFollowerCount?: number | null
          preferredNiches?: string[] | null
          referralCode?: string | null
          standardOffer?: Json | null
          taxId?: string | null
          updatedAt?: string
          userId?: string
          verificationDate?: string | null
          verificationStatus?: Database["public"]["Enums"]["VerificationStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "host_profiles_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_profiles: {
        Row: {
          contentNiches: string[] | null
          createdAt: string
          deliverables: Json | null
          id: string
          identityVerified: boolean
          portfolioUrl: string | null
          profileLink: string | null
          updatedAt: string
          userId: string
          verificationDate: string | null
          verificationStatus: Database["public"]["Enums"]["VerificationStatus"]
        }
        Insert: {
          contentNiches?: string[] | null
          createdAt?: string
          deliverables?: Json | null
          id?: string
          identityVerified?: boolean
          portfolioUrl?: string | null
          profileLink?: string | null
          updatedAt?: string
          userId: string
          verificationDate?: string | null
          verificationStatus?: Database["public"]["Enums"]["VerificationStatus"]
        }
        Update: {
          contentNiches?: string[] | null
          createdAt?: string
          deliverables?: Json | null
          id?: string
          identityVerified?: boolean
          portfolioUrl?: string | null
          profileLink?: string | null
          updatedAt?: string
          userId?: string
          verificationDate?: string | null
          verificationStatus?: Database["public"]["Enums"]["VerificationStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "influencer_profiles_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          createdAt: string
          id: string
          propertyId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          propertyId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          propertyId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      local_experiences: {
        Row: {
          category: string
          contactInfo: string | null
          createdAt: string
          currency: string
          description: string
          id: string
          images: string[] | null
          isActive: boolean
          location: string
          price: number | null
          title: string
          updatedAt: string
        }
        Insert: {
          category: string
          contactInfo?: string | null
          createdAt?: string
          currency?: string
          description: string
          id?: string
          images?: string[] | null
          isActive?: boolean
          location: string
          price?: number | null
          title: string
          updatedAt?: string
        }
        Update: {
          category?: string
          contactInfo?: string | null
          createdAt?: string
          currency?: string
          description?: string
          id?: string
          images?: string[] | null
          isActive?: boolean
          location?: string
          price?: number | null
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversationId: string
          createdAt: string
          id: string
          isRead: boolean
          postId: string | null
          senderId: string
        }
        Insert: {
          content?: string | null
          conversationId: string
          createdAt?: string
          id?: string
          isRead?: boolean
          postId?: string | null
          senderId: string
        }
        Update: {
          content?: string | null
          conversationId?: string
          createdAt?: string
          id?: string
          isRead?: boolean
          postId?: string | null
          senderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completedAt: string | null
          completedSteps: Json
          currentStep: string
          id: string
          metadata: Json | null
          startedAt: string
          userId: string
        }
        Insert: {
          completedAt?: string | null
          completedSteps?: Json
          currentStep: string
          id?: string
          metadata?: Json | null
          startedAt?: string
          userId: string
        }
        Update: {
          completedAt?: string | null
          completedSteps?: Json
          currentStep?: string
          id?: string
          metadata?: Json | null
          startedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bookingId: string
          createdAt: string
          cryptoAmount: number | null
          cryptoCurrency: string | null
          currency: string
          id: string
          method: Database["public"]["Enums"]["PaymentMethod"]
          status: Database["public"]["Enums"]["PaymentStatus"]
          transactionId: string | null
          updatedAt: string
        }
        Insert: {
          amount: number
          bookingId: string
          createdAt?: string
          cryptoAmount?: number | null
          cryptoCurrency?: string | null
          currency: string
          id?: string
          method: Database["public"]["Enums"]["PaymentMethod"]
          status?: Database["public"]["Enums"]["PaymentStatus"]
          transactionId?: string | null
          updatedAt?: string
        }
        Update: {
          amount?: number
          bookingId?: string
          createdAt?: string
          cryptoAmount?: number | null
          cryptoCurrency?: string | null
          currency?: string
          id?: string
          method?: Database["public"]["Enums"]["PaymentMethod"]
          status?: Database["public"]["Enums"]["PaymentStatus"]
          transactionId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          action: string
          createdAt: string
          description: string | null
          id: string
          metadata: Json | null
          points: number
          referenceId: string | null
          referenceType: string | null
          userId: string
        }
        Insert: {
          action: string
          createdAt?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points: number
          referenceId?: string | null
          referenceType?: string | null
          userId: string
        }
        Update: {
          action?: string
          createdAt?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          referenceId?: string | null
          referenceType?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points_rules: {
        Row: {
          action: string
          createdAt: string
          dailyLimit: number | null
          description: string | null
          id: string
          isActive: boolean
          points: number
          updatedAt: string
        }
        Insert: {
          action: string
          createdAt?: string
          dailyLimit?: number | null
          description?: string | null
          id?: string
          isActive?: boolean
          points: number
          updatedAt?: string
        }
        Update: {
          action?: string
          createdAt?: string
          dailyLimit?: number | null
          description?: string | null
          id?: string
          isActive?: boolean
          points?: number
          updatedAt?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          id: string
          postId: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          id?: string
          postId: string
          updatedAt?: string
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          id?: string
          postId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          createdAt: string
          id: string
          postId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          postId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          id: string
          images: string[] | null
          isActive: boolean
          location: string | null
          propertyId: string | null
          updatedAt: string
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          id?: string
          images?: string[] | null
          isActive?: boolean
          location?: string | null
          propertyId?: string | null
          updatedAt?: string
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          id?: string
          images?: string[] | null
          isActive?: boolean
          location?: string | null
          propertyId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          createdAt: string
          currency: string
          description: string
          geocodingAccuracy: string | null
          geocodingFailed: boolean
          hostId: string
          id: string
          images: string[] | null
          isActive: boolean
          isVerified: boolean
          latitude: number | null
          longitude: number | null
          maxGuests: number
          price: number
          rules: string[] | null
          title: string
          type: Database["public"]["Enums"]["PropertyType"]
          updatedAt: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          createdAt?: string
          currency?: string
          description: string
          geocodingAccuracy?: string | null
          geocodingFailed?: boolean
          hostId: string
          id?: string
          images?: string[] | null
          isActive?: boolean
          isVerified?: boolean
          latitude?: number | null
          longitude?: number | null
          maxGuests: number
          price: number
          rules?: string[] | null
          title: string
          type: Database["public"]["Enums"]["PropertyType"]
          updatedAt?: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          city?: string
          country?: string
          createdAt?: string
          currency?: string
          description?: string
          geocodingAccuracy?: string | null
          geocodingFailed?: boolean
          hostId?: string
          id?: string
          images?: string[] | null
          isActive?: boolean
          isVerified?: boolean
          latitude?: number | null
          longitude?: number | null
          maxGuests?: number
          price?: number
          rules?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["PropertyType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_hostId_fkey"
            columns: ["hostId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          bookingId: string
          comment: string | null
          createdAt: string
          id: string
          propertyId: string
          rating: number
          reviewerId: string
          updatedAt: string
        }
        Insert: {
          bookingId: string
          comment?: string | null
          createdAt?: string
          id?: string
          propertyId: string
          rating: number
          reviewerId: string
          updatedAt?: string
        }
        Update: {
          bookingId?: string
          comment?: string | null
          createdAt?: string
          id?: string
          propertyId?: string
          rating?: number
          reviewerId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_propertyId_fkey"
            columns: ["propertyId"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewerId_fkey"
            columns: ["reviewerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_connections: {
        Row: {
          accessToken: string | null
          createdAt: string
          followerCount: number | null
          id: string
          isPrimary: boolean
          platform: Database["public"]["Enums"]["SocialPlatform"]
          platformUserId: string
          refreshToken: string | null
          tokenExpiresAt: string | null
          updatedAt: string
          userId: string
          username: string | null
        }
        Insert: {
          accessToken?: string | null
          createdAt?: string
          followerCount?: number | null
          id?: string
          isPrimary?: boolean
          platform: Database["public"]["Enums"]["SocialPlatform"]
          platformUserId: string
          refreshToken?: string | null
          tokenExpiresAt?: string | null
          updatedAt?: string
          userId: string
          username?: string | null
        }
        Update: {
          accessToken?: string | null
          createdAt?: string
          followerCount?: number | null
          id?: string
          isPrimary?: boolean
          platform?: Database["public"]["Enums"]["SocialPlatform"]
          platformUserId?: string
          refreshToken?: string | null
          tokenExpiresAt?: string | null
          updatedAt?: string
          userId?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_connections_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      traveler_profiles: {
        Row: {
          createdAt: string
          id: string
          preferences: Json | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          preferences?: Json | null
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          preferences?: Json | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "traveler_profiles_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          createdAt: string
          currentPoints: number
          id: string
          lifetimeEarned: number
          lifetimeRedeemed: number
          totalPoints: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          currentPoints?: number
          id?: string
          lifetimeEarned?: number
          lifetimeRedeemed?: number
          totalPoints?: number
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          currentPoints?: number
          id?: string
          lifetimeEarned?: number
          lifetimeRedeemed?: number
          totalPoints?: number
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          coverPhotoUrl: string | null
          createdAt: string
          email: string
          emailVerified: string | null
          fullName: string | null
          id: string
          image: string | null
          isVerified: boolean
          location: string | null
          name: string | null
          onboardingStatus: Database["public"]["Enums"]["OnboardingStatus"]
          onboardingStep: string | null
          phone: string | null
          profilePictureUrl: string | null
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
          username: string | null
        }
        Insert: {
          bio?: string | null
          coverPhotoUrl?: string | null
          createdAt?: string
          email: string
          emailVerified?: string | null
          fullName?: string | null
          id: string
          image?: string | null
          isVerified?: boolean
          location?: string | null
          name?: string | null
          onboardingStatus?: Database["public"]["Enums"]["OnboardingStatus"]
          onboardingStep?: string | null
          phone?: string | null
          profilePictureUrl?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
          username?: string | null
        }
        Update: {
          bio?: string | null
          coverPhotoUrl?: string | null
          createdAt?: string
          email?: string
          emailVerified?: string | null
          fullName?: string | null
          id?: string
          image?: string | null
          isVerified?: boolean
          location?: string | null
          name?: string | null
          onboardingStatus?: Database["public"]["Enums"]["OnboardingStatus"]
          onboardingStep?: string | null
          phone?: string | null
          profilePictureUrl?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          p_user_id: string
          p_action: string
          p_points: number
          p_reference_id?: string
          p_reference_type?: string
          p_description?: string
        }
        Returns: {
          success: boolean
          new_balance: number
          message: string
        }
      }
    }
    Enums: {
      BookingStatus:
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED"
        | "COMPLETED"
        | "REFUNDED"
      OnboardingStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
      PaymentMethod: "STRIPE" | "COINBASE" | "BANK_TRANSFER"
      PaymentStatus:
        | "PENDING"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED"
        | "REFUNDED"
      PropertyType:
        | "APARTMENT"
        | "HOUSE"
        | "VILLA"
        | "BNB"
        | "HOTEL"
        | "HOSTEL"
        | "CABIN"
        | "TENT"
        | "OTHER"
      SocialPlatform: "INSTAGRAM" | "TIKTOK" | "YOUTUBE"
      UserRole: "GUEST" | "HOST" | "INFLUENCER" | "TRAVELER" | "ADMIN"
      VerificationStatus: "PENDING" | "VERIFIED" | "REJECTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      BookingStatus: [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
        "REFUNDED",
      ],
      OnboardingStatus: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      PaymentMethod: ["STRIPE", "COINBASE", "BANK_TRANSFER"],
      PaymentStatus: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "REFUNDED",
      ],
      PropertyType: [
        "APARTMENT",
        "HOUSE",
        "VILLA",
        "BNB",
        "HOTEL",
        "HOSTEL",
        "CABIN",
        "TENT",
        "OTHER",
      ],
      SocialPlatform: ["INSTAGRAM", "TIKTOK", "YOUTUBE"],
      UserRole: ["GUEST", "HOST", "INFLUENCER", "TRAVELER", "ADMIN"],
      VerificationStatus: ["PENDING", "VERIFIED", "REJECTED"],
    },
  },
} as const
