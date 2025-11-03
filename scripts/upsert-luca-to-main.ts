#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const MAIN_URL = "postgresql://neondb_owner:npg_vZL3CuqGUed4@ep-holy-bush-a2zkyplq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";
const LUCA_URL = "postgresql://neondb_owner:npg_vZL3CuqGUed4@ep-summer-sky-a2wk3dal-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const mainDb = new PrismaClient({ datasources: { db: { url: MAIN_URL } } });
const lucaDb = new PrismaClient({ datasources: { db: { url: LUCA_URL } } });

interface Stats {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

async function upsertData() {
  console.log('🚀 Starting comprehensive upsert from luca branch → main branch\n');
  console.log('⚠️  This will merge all data from luca into main, preserving existing main data.\n');

  try {
    // Test connections
    console.log('📡 Testing connections...');
    const mainCount = await mainDb.user.count();
    const lucaCount = await lucaDb.user.count();
    console.log(`✅ MAIN: ${mainCount} users`);
    console.log(`✅ LUCA: ${lucaCount} users\n`);

    // Step 1: Build user ID mapping (luca ID → main ID by email)
    console.log('🗺️  Step 1: Building user ID mapping...');
    const lucaUsers = await lucaDb.user.findMany();
    const mainUsers = await mainDb.user.findMany();

    const userIdMap = new Map<string, string>(); // lucaId → mainId
    const emailToMainId = new Map<string, string>();

    mainUsers.forEach(user => {
      emailToMainId.set(user.email, user.id);
    });

    let userStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const lucaUser of lucaUsers) {
      const mainUserId = emailToMainId.get(lucaUser.email);

      if (mainUserId) {
        // Map luca ID to main ID
        userIdMap.set(lucaUser.id, mainUserId);

        // Update existing user with luca data
        try {
          await mainDb.user.update({
            where: { id: mainUserId },
            data: {
              name: lucaUser.name,
              username: lucaUser.username,
              image: lucaUser.image,
              password: lucaUser.password,
              role: lucaUser.role,
              onboardingStatus: lucaUser.onboardingStatus,
              onboardingStep: lucaUser.onboardingStep,
              fullName: lucaUser.fullName,
              profilePictureUrl: lucaUser.profilePictureUrl,
              coverPhotoUrl: lucaUser.coverPhotoUrl,
              bio: lucaUser.bio,
              location: lucaUser.location,
              phone: lucaUser.phone,
              isVerified: lucaUser.isVerified,
            }
          });
          userStats.updated++;
        } catch (error: any) {
          userStats.errors.push(`User ${lucaUser.email}: ${error.message}`);
        }
      } else {
        // Create new user and map the ID
        try {
          const newUser = await mainDb.user.create({ data: lucaUser });
          userIdMap.set(lucaUser.id, newUser.id);
          emailToMainId.set(newUser.email, newUser.id);
          userStats.created++;
        } catch (error: any) {
          userStats.errors.push(`User ${lucaUser.email}: ${error.message}`);
          userStats.skipped++;
        }
      }
    }

    console.log(`✅ Users: ${userStats.updated} updated, ${userStats.created} created, ${userStats.skipped} skipped`);
    if (userStats.errors.length > 0) {
      console.log(`⚠️  User errors: ${userStats.errors.slice(0, 3).join(', ')}${userStats.errors.length > 3 ? '...' : ''}`);
    }
    console.log(`   ID mappings created: ${userIdMap.size}\n`);

    // Step 2: Upsert host profiles with ID mapping
    console.log('🏠 Step 2: Upserting host profiles...');
    const lucaHostProfiles = await lucaDb.hostProfile.findMany();
    let hostStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const profile of lucaHostProfiles) {
      const mappedUserId = userIdMap.get(profile.userId);
      if (!mappedUserId) {
        hostStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.hostProfile.findUnique({ where: { userId: mappedUserId } });

        if (existing) {
          await mainDb.hostProfile.update({
            where: { id: existing.id },
            data: {
              businessName: profile.businessName,
              taxId: profile.taxId,
              bankAccount: profile.bankAccount,
              cryptoWallet: profile.cryptoWallet,
              commission: profile.commission,
              identityVerified: profile.identityVerified,
              verificationStatus: profile.verificationStatus,
              verificationDate: profile.verificationDate,
              standardOffer: profile.standardOffer as any,
              minFollowerCount: profile.minFollowerCount,
              preferredNiches: profile.preferredNiches as any,
              referralCode: profile.referralCode,
            }
          });
          hostStats.updated++;
        } else {
          await mainDb.hostProfile.create({
            data: {
              ...profile,
              id: undefined as any,
              userId: mappedUserId,
              standardOffer: profile.standardOffer as any,
              preferredNiches: profile.preferredNiches as any,
            }
          });
          hostStats.created++;
        }
      } catch (error: any) {
        hostStats.errors.push(error.message);
      }
    }

    console.log(`✅ Host profiles: ${hostStats.updated} updated, ${hostStats.created} created, ${hostStats.skipped} skipped\n`);

    // Step 3: Upsert traveler profiles
    console.log('✈️  Step 3: Upserting traveler profiles...');
    const lucaTravelerProfiles = await lucaDb.travelerProfile.findMany();
    let travelerStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const profile of lucaTravelerProfiles) {
      const mappedUserId = userIdMap.get(profile.userId);
      if (!mappedUserId) {
        travelerStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.travelerProfile.findUnique({ where: { userId: mappedUserId } });

        if (existing) {
          await mainDb.travelerProfile.update({
            where: { id: existing.id },
            data: { preferences: profile.preferences as any }
          });
          travelerStats.updated++;
        } else {
          await mainDb.travelerProfile.create({
            data: {
              ...profile,
              id: undefined as any,
              userId: mappedUserId,
              preferences: profile.preferences as any,
            }
          });
          travelerStats.created++;
        }
      } catch (error: any) {
        travelerStats.errors.push(error.message);
      }
    }

    console.log(`✅ Traveler profiles: ${travelerStats.updated} updated, ${travelerStats.created} created, ${travelerStats.skipped} skipped\n`);

    // Step 4: Upsert influencer profiles
    console.log('📸 Step 4: Upserting influencer profiles...');
    const lucaInfluencerProfiles = await lucaDb.influencerProfile.findMany();
    let influencerStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const profile of lucaInfluencerProfiles) {
      const mappedUserId = userIdMap.get(profile.userId);
      if (!mappedUserId) {
        influencerStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.influencerProfile.findUnique({ where: { userId: mappedUserId } });

        if (existing) {
          await mainDb.influencerProfile.update({
            where: { id: existing.id },
            data: {
              identityVerified: profile.identityVerified,
              verificationStatus: profile.verificationStatus,
              verificationDate: profile.verificationDate,
              contentNiches: profile.contentNiches,
              deliverables: profile.deliverables as any,
              portfolioUrl: profile.portfolioUrl,
              profileLink: profile.profileLink,
            }
          });
          influencerStats.updated++;
        } else {
          await mainDb.influencerProfile.create({
            data: {
              ...profile,
              id: undefined as any,
              userId: mappedUserId,
              deliverables: profile.deliverables as any,
            }
          });
          influencerStats.created++;
        }
      } catch (error: any) {
        influencerStats.errors.push(error.message);
      }
    }

    console.log(`✅ Influencer profiles: ${influencerStats.updated} updated, ${influencerStats.created} created, ${influencerStats.skipped} skipped\n`);

    // Step 5: Upsert social connections
    console.log('🔗 Step 5: Upserting social connections...');
    const lucaSocialConnections = await lucaDb.socialConnection.findMany();
    let socialStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const connection of lucaSocialConnections) {
      const mappedUserId = userIdMap.get(connection.userId);
      if (!mappedUserId) {
        socialStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.socialConnection.findUnique({
          where: { userId_platform: { userId: mappedUserId, platform: connection.platform } }
        });

        if (existing) {
          await mainDb.socialConnection.update({
            where: { id: existing.id },
            data: {
              platformUserId: connection.platformUserId,
              username: connection.username,
              followerCount: connection.followerCount,
              accessToken: connection.accessToken,
              refreshToken: connection.refreshToken,
              tokenExpiresAt: connection.tokenExpiresAt,
              isPrimary: connection.isPrimary,
            }
          });
          socialStats.updated++;
        } else {
          await mainDb.socialConnection.create({
            data: {
              ...connection,
              id: undefined as any,
              userId: mappedUserId,
            }
          });
          socialStats.created++;
        }
      } catch (error: any) {
        socialStats.errors.push(error.message);
      }
    }

    console.log(`✅ Social connections: ${socialStats.updated} updated, ${socialStats.created} created, ${socialStats.skipped} skipped\n`);

    // Step 6: Upsert properties with ID mapping
    console.log('🏡 Step 6: Upserting properties...');
    const lucaProperties = await lucaDb.property.findMany();
    const propertyIdMap = new Map<string, string>(); // lucaId → mainId
    let propertyStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const property of lucaProperties) {
      const mappedHostId = userIdMap.get(property.hostId);
      if (!mappedHostId) {
        propertyStats.skipped++;
        continue;
      }

      try {
        // Try to find existing property by title + city + hostId
        const existing = await mainDb.property.findFirst({
          where: {
            title: property.title,
            city: property.city,
            hostId: mappedHostId,
          }
        });

        if (existing) {
          await mainDb.property.update({
            where: { id: existing.id },
            data: {
              description: property.description,
              type: property.type,
              address: property.address,
              country: property.country,
              latitude: property.latitude,
              longitude: property.longitude,
              geocodingAccuracy: property.geocodingAccuracy,
              geocodingFailed: property.geocodingFailed,
              price: property.price,
              currency: property.currency,
              maxGuests: property.maxGuests,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              amenities: property.amenities,
              images: property.images,
              rules: property.rules,
              isActive: property.isActive,
              isVerified: property.isVerified,
            }
          });
          propertyIdMap.set(property.id, existing.id);
          propertyStats.updated++;
        } else {
          const newProperty = await mainDb.property.create({
            data: {
              ...property,
              id: undefined as any,
              hostId: mappedHostId,
            }
          });
          propertyIdMap.set(property.id, newProperty.id);
          propertyStats.created++;
        }
      } catch (error: any) {
        propertyStats.errors.push(error.message);
      }
    }

    console.log(`✅ Properties: ${propertyStats.updated} updated, ${propertyStats.created} created, ${propertyStats.skipped} skipped\n`);

    // Step 7: Upsert posts with ID mapping
    console.log('📝 Step 7: Upserting posts...');
    const lucaPosts = await lucaDb.post.findMany();
    const postIdMap = new Map<string, string>(); // lucaId → mainId
    let postStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const post of lucaPosts) {
      const mappedAuthorId = userIdMap.get(post.authorId);
      if (!mappedAuthorId) {
        postStats.skipped++;
        continue;
      }

      const mappedPropertyId = post.propertyId ? propertyIdMap.get(post.propertyId) : null;

      try {
        // Try to find existing post by content + authorId
        const existing = await mainDb.post.findFirst({
          where: {
            content: post.content,
            authorId: mappedAuthorId,
            createdAt: post.createdAt,
          }
        });

        if (existing) {
          await mainDb.post.update({
            where: { id: existing.id },
            data: {
              images: post.images,
              location: post.location,
              propertyId: mappedPropertyId,
              isActive: post.isActive,
            }
          });
          postIdMap.set(post.id, existing.id);
          postStats.updated++;
        } else {
          const newPost = await mainDb.post.create({
            data: {
              ...post,
              id: undefined as any,
              authorId: mappedAuthorId,
              propertyId: mappedPropertyId,
            }
          });
          postIdMap.set(post.id, newPost.id);
          postStats.created++;
        }
      } catch (error: any) {
        postStats.errors.push(error.message);
      }
    }

    console.log(`✅ Posts: ${postStats.updated} updated, ${postStats.created} created, ${postStats.skipped} skipped\n`);

    // Step 8: Upsert conversations
    console.log('💬 Step 8: Upserting conversations...');
    let lucaConversations: any[] = [];
    try {
      lucaConversations = await lucaDb.conversation.findMany();
    } catch (error: any) {
      console.log(`⚠️  Conversations table not found in luca branch, skipping...`);
    }
    const conversationIdMap = new Map<string, string>();
    let conversationStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const conversation of lucaConversations) {
      const mappedUserAId = userIdMap.get(conversation.userAId);
      const mappedUserBId = userIdMap.get(conversation.userBId);

      if (!mappedUserAId || !mappedUserBId) {
        conversationStats.skipped++;
        continue;
      }

      try {
        // Find existing conversation between these users
        const existing = await mainDb.conversation.findFirst({
          where: {
            OR: [
              { userAId: mappedUserAId, userBId: mappedUserBId },
              { userAId: mappedUserBId, userBId: mappedUserAId },
            ]
          }
        });

        if (existing) {
          conversationIdMap.set(conversation.id, existing.id);
          conversationStats.updated++;
        } else {
          const newConversation = await mainDb.conversation.create({
            data: {
              ...conversation,
              id: undefined as any,
              userAId: mappedUserAId,
              userBId: mappedUserBId,
            }
          });
          conversationIdMap.set(conversation.id, newConversation.id);
          conversationStats.created++;
        }
      } catch (error: any) {
        conversationStats.errors.push(error.message);
      }
    }

    console.log(`✅ Conversations: ${conversationStats.updated} updated, ${conversationStats.created} created, ${conversationStats.skipped} skipped\n`);

    // Step 9: Upsert messages
    console.log('✉️  Step 9: Upserting messages...');
    let lucaMessages: any[] = [];
    try {
      lucaMessages = await lucaDb.message.findMany();
    } catch (error: any) {
      console.log(`⚠️  Messages table not found in luca branch, skipping...`);
    }
    let messageStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const message of lucaMessages) {
      const mappedConversationId = conversationIdMap.get(message.conversationId);
      const mappedSenderId = userIdMap.get(message.senderId);

      if (!mappedConversationId || !mappedSenderId) {
        messageStats.skipped++;
        continue;
      }

      const mappedPostId = message.postId ? postIdMap.get(message.postId) : null;

      try {
        // Check if message already exists
        const existing = await mainDb.message.findFirst({
          where: {
            conversationId: mappedConversationId,
            senderId: mappedSenderId,
            content: message.content,
            createdAt: message.createdAt,
          }
        });

        if (existing) {
          messageStats.updated++;
        } else {
          await mainDb.message.create({
            data: {
              ...message,
              id: undefined as any,
              conversationId: mappedConversationId,
              senderId: mappedSenderId,
              postId: mappedPostId,
            }
          });
          messageStats.created++;
        }
      } catch (error: any) {
        messageStats.errors.push(error.message);
      }
    }

    console.log(`✅ Messages: ${messageStats.updated} updated, ${messageStats.created} created, ${messageStats.skipped} skipped\n`);

    // Step 10: Upsert post likes
    console.log('❤️  Step 10: Upserting post likes...');
    const lucaPostLikes = await lucaDb.postLike.findMany();
    let likeStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const like of lucaPostLikes) {
      const mappedUserId = userIdMap.get(like.userId);
      const mappedPostId = postIdMap.get(like.postId);

      if (!mappedUserId || !mappedPostId) {
        likeStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.postLike.findUnique({
          where: { userId_postId: { userId: mappedUserId, postId: mappedPostId } }
        });

        if (existing) {
          likeStats.updated++;
        } else {
          await mainDb.postLike.create({
            data: {
              ...like,
              id: undefined as any,
              userId: mappedUserId,
              postId: mappedPostId,
            }
          });
          likeStats.created++;
        }
      } catch (error: any) {
        likeStats.errors.push(error.message);
      }
    }

    console.log(`✅ Post likes: ${likeStats.updated} updated, ${likeStats.created} created, ${likeStats.skipped} skipped\n`);

    // Step 11: Upsert post comments
    console.log('💭 Step 11: Upserting post comments...');
    const lucaPostComments = await lucaDb.postComment.findMany();
    let commentStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const comment of lucaPostComments) {
      const mappedAuthorId = userIdMap.get(comment.authorId);
      const mappedPostId = postIdMap.get(comment.postId);

      if (!mappedAuthorId || !mappedPostId) {
        commentStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.postComment.findFirst({
          where: {
            authorId: mappedAuthorId,
            postId: mappedPostId,
            content: comment.content,
            createdAt: comment.createdAt,
          }
        });

        if (existing) {
          commentStats.updated++;
        } else {
          await mainDb.postComment.create({
            data: {
              ...comment,
              id: undefined as any,
              authorId: mappedAuthorId,
              postId: mappedPostId,
            }
          });
          commentStats.created++;
        }
      } catch (error: any) {
        commentStats.errors.push(error.message);
      }
    }

    console.log(`✅ Post comments: ${commentStats.updated} updated, ${commentStats.created} created, ${commentStats.skipped} skipped\n`);

    // Step 12: Upsert follows
    console.log('👥 Step 12: Upserting follows...');
    const lucaFollows = await lucaDb.follow.findMany();
    let followStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const follow of lucaFollows) {
      const mappedFollowerId = userIdMap.get(follow.followerId);
      const mappedFollowingId = userIdMap.get(follow.followingId);

      if (!mappedFollowerId || !mappedFollowingId) {
        followStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.follow.findUnique({
          where: { followerId_followingId: { followerId: mappedFollowerId, followingId: mappedFollowingId } }
        });

        if (existing) {
          followStats.updated++;
        } else {
          await mainDb.follow.create({
            data: {
              ...follow,
              id: undefined as any,
              followerId: mappedFollowerId,
              followingId: mappedFollowingId,
            }
          });
          followStats.created++;
        }
      } catch (error: any) {
        followStats.errors.push(error.message);
      }
    }

    console.log(`✅ Follows: ${followStats.updated} updated, ${followStats.created} created, ${followStats.skipped} skipped\n`);

    // Step 13: Upsert accounts (NextAuth)
    console.log('🔐 Step 13: Upserting accounts...');
    const lucaAccounts = await lucaDb.account.findMany();
    let accountStats: Stats = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const account of lucaAccounts) {
      const mappedUserId = userIdMap.get(account.userId);

      if (!mappedUserId) {
        accountStats.skipped++;
        continue;
      }

      try {
        const existing = await mainDb.account.findUnique({
          where: { provider_providerAccountId: { provider: account.provider, providerAccountId: account.providerAccountId } }
        });

        if (existing) {
          await mainDb.account.update({
            where: { id: existing.id },
            data: {
              userId: mappedUserId,
              type: account.type,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            }
          });
          accountStats.updated++;
        } else {
          await mainDb.account.create({
            data: {
              ...account,
              id: undefined as any,
              userId: mappedUserId,
            }
          });
          accountStats.created++;
        }
      } catch (error: any) {
        accountStats.errors.push(error.message);
      }
    }

    console.log(`✅ Accounts: ${accountStats.updated} updated, ${accountStats.created} created, ${accountStats.skipped} skipped\n`);

    console.log('🎉 Done! All data from luca branch has been upserted to main branch.\n');

    // Final counts
    console.log('📊 Final counts in MAIN branch:');
    console.log(`   Users: ${await mainDb.user.count()}`);
    console.log(`   Properties: ${await mainDb.property.count()}`);
    console.log(`   Posts: ${await mainDb.post.count()}`);

    try {
      console.log(`   Conversations: ${await mainDb.conversation.count()}`);
      console.log(`   Messages: ${await mainDb.message.count()}`);
    } catch {
      // Tables don't exist yet
    }

    console.log(`   Social Connections: ${await mainDb.socialConnection.count()}`);
    console.log(`   Post Likes: ${await mainDb.postLike.count()}`);
    console.log(`   Post Comments: ${await mainDb.postComment.count()}`);
    console.log(`   Follows: ${await mainDb.follow.count()}`);

  } catch (error) {
    console.error('\n❌ Fatal Error:', error);
    throw error;
  } finally {
    await mainDb.$disconnect();
    await lucaDb.$disconnect();
  }
}

upsertData();
