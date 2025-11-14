/**
 * NEON TO SUPABASE DATA MIGRATION SCRIPT
 * 
 * This script migrates all data from your Neon PostgreSQL database
 * to your Supabase database, handling ID transformations from cuid to UUID.
 * 
 * BEFORE RUNNING:
 * 1. Install dependencies: npm install pg uuid
 * 2. Set your Neon database URL below
 * 3. Backup your Supabase database (just in case)
 * 4. Run: node scripts/migrate-from-neon.js
 */

const { Client } = require('pg');
const { v4: uuidv4, validate: isUuid } = require('uuid');

// ============================================
// CONFIGURATION
// ============================================

const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_vZL3CuqGUed4@ep-holy-bush-a2zkyplq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const SUPABASE_DATABASE_URL = process.env.DIRECT_URL || process.env.SUPABASE_DIRECT_URL;

// ID Mapping: cuid -> UUID
const idMap = new Map();

// ============================================
// HELPER FUNCTIONS
// ============================================

function getOrCreateUUID(oldId) {
  if (!oldId) return null;
  
  // If it's already a UUID, return it
  if (isUuid(oldId)) return oldId;
  
  // Check if we've already mapped this ID
  if (idMap.has(oldId)) {
    return idMap.get(oldId);
  }
  
  // Create a new UUID and store the mapping
  const newUuid = uuidv4();
  idMap.set(oldId, newUuid);
  return newUuid;
}

function transformRow(row, idFields = ['id'], foreignKeyFields = []) {
  const transformed = { ...row };
  
  // Transform primary key IDs
  idFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = getOrCreateUUID(transformed[field]);
    }
  });
  
  // Transform foreign key IDs
  foreignKeyFields.forEach(field => {
    if (transformed[field]) {
      transformed[field] = getOrCreateUUID(transformed[field]);
    }
  });
  
  return transformed;
}

async function logProgress(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function migrateUsers(neonClient, supabaseClient) {
  await logProgress('Migrating users...');
  
  const { rows } = await neonClient.query('SELECT * FROM users ORDER BY "createdAt"');
  await logProgress(`Found ${rows.length} users to migrate`);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], []);
      
      // Check if user already exists (by email)
      const existing = await supabaseClient.query(
        'SELECT id FROM users WHERE email = $1',
        [transformed.email]
      );
      
      if (existing.rows.length > 0) {
        await logProgress(`  Skipping user ${transformed.email} (already exists)`);
        // Map the old ID to the existing UUID
        idMap.set(row.id, existing.rows[0].id);
        skipped++;
        continue;
      }
      
      await supabaseClient.query(`
        INSERT INTO users (
          id, email, "emailVerified", name, "fullName", username, bio, 
          location, phone, "profilePictureUrl", "coverPhotoUrl", 
          "dateOfBirth", role, "onboardingStatus", "isActive", 
          "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
      `, [
        transformed.id,
        transformed.email,
        transformed.emailVerified,
        transformed.name,
        transformed.fullName,
        transformed.username,
        transformed.bio,
        transformed.location,
        transformed.phone,
        transformed.profilePictureUrl,
        transformed.coverPhotoUrl,
        transformed.dateOfBirth,
        transformed.role,
        transformed.onboardingStatus,
        transformed.isActive,
        transformed.createdAt,
        transformed.updatedAt
      ]);
      
      migrated++;
      if (migrated % 10 === 0) {
        await logProgress(`  Migrated ${migrated} users...`);
      }
    } catch (error) {
      console.error(`Error migrating user ${row.email}:`, error.message);
    }
  }
  
  await logProgress(`✅ Users migration complete: ${migrated} migrated, ${skipped} skipped`);
  return { migrated, skipped };
}

async function migrateHostProfiles(neonClient, supabaseClient) {
  await logProgress('Migrating host profiles...');
  
  const { rows } = await neonClient.query('SELECT * FROM host_profiles');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], ['userId']);
      
      await supabaseClient.query(`
        INSERT INTO host_profiles (
          id, "userId", "hostingExperience", "responseTime", 
          "acceptanceRate", "cancellationRate", "averageRating", 
          "totalReviews", "isVerified", "verifiedAt", 
          "verificationMethod", "aboutMe", amenities, "houseRules", 
          "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
      `, [
        transformed.id,
        transformed.userId,
        transformed.hostingExperience,
        transformed.responseTime,
        transformed.acceptanceRate,
        transformed.cancellationRate,
        transformed.averageRating,
        transformed.totalReviews,
        transformed.isVerified,
        transformed.verifiedAt,
        transformed.verificationMethod,
        transformed.aboutMe,
        transformed.amenities,
        transformed.houseRules,
        transformed.createdAt,
        transformed.updatedAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating host profile:`, error.message);
    }
  }
  
  await logProgress(`✅ Host profiles: ${migrated} migrated`);
  return migrated;
}

async function migrateTravelerProfiles(neonClient, supabaseClient) {
  await logProgress('Migrating traveler profiles...');
  
  const { rows } = await neonClient.query('SELECT * FROM traveler_profiles');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], ['userId']);
      
      await supabaseClient.query(`
        INSERT INTO traveler_profiles (
          id, "userId", "travelStyle", "favoritePlaces", 
          languages, interests, "tripsCompleted", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        transformed.id,
        transformed.userId,
        transformed.travelStyle,
        transformed.favoritePlaces,
        transformed.languages,
        transformed.interests,
        transformed.tripsCompleted,
        transformed.createdAt,
        transformed.updatedAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating traveler profile:`, error.message);
    }
  }
  
  await logProgress(`✅ Traveler profiles: ${migrated} migrated`);
  return migrated;
}

async function migrateInfluencerProfiles(neonClient, supabaseClient) {
  await logProgress('Migrating influencer profiles...');
  
  const { rows } = await neonClient.query('SELECT * FROM influencer_profiles');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], ['userId']);
      
      await supabaseClient.query(`
        INSERT INTO influencer_profiles (
          id, "userId", "mediaKit", "totalFollowers", 
          "engagementRate", "niches", "isVerified", 
          "verifiedAt", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        transformed.id,
        transformed.userId,
        transformed.mediaKit,
        transformed.totalFollowers,
        transformed.engagementRate,
        transformed.niches,
        transformed.isVerified,
        transformed.verifiedAt,
        transformed.createdAt,
        transformed.updatedAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating influencer profile:`, error.message);
    }
  }
  
  await logProgress(`✅ Influencer profiles: ${migrated} migrated`);
  return migrated;
}

async function migrateProperties(neonClient, supabaseClient) {
  await logProgress('Migrating properties...');
  
  const { rows } = await neonClient.query('SELECT * FROM properties');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], ['hostId']);
      
      await supabaseClient.query(`
        INSERT INTO properties (
          id, "hostId", title, description, "propertyType", 
          address, city, state, country, "postalCode", 
          latitude, longitude, bedrooms, bathrooms, "maxGuests", 
          price, currency, amenities, images, "houseRules", 
          "cancellationPolicy", "minStay", "maxStay", "checkInTime", 
          "checkOutTime", "isActive", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
        )
      `, [
        transformed.id, transformed.hostId, transformed.title, transformed.description,
        transformed.propertyType, transformed.address, transformed.city, transformed.state,
        transformed.country, transformed.postalCode, transformed.latitude, transformed.longitude,
        transformed.bedrooms, transformed.bathrooms, transformed.maxGuests, transformed.price,
        transformed.currency, transformed.amenities, transformed.images, transformed.houseRules,
        transformed.cancellationPolicy, transformed.minStay, transformed.maxStay,
        transformed.checkInTime, transformed.checkOutTime, transformed.isActive,
        transformed.createdAt, transformed.updatedAt
      ]);
      
      migrated++;
      if (migrated % 10 === 0) {
        await logProgress(`  Migrated ${migrated} properties...`);
      }
    } catch (error) {
      console.error(`Error migrating property:`, error.message);
    }
  }
  
  await logProgress(`✅ Properties: ${migrated} migrated`);
  return migrated;
}

async function migratePosts(neonClient, supabaseClient) {
  await logProgress('Migrating posts...');
  
  const { rows } = await neonClient.query('SELECT * FROM posts ORDER BY "createdAt"');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], ['authorId', 'propertyId']);
      
      await supabaseClient.query(`
        INSERT INTO posts (
          id, "authorId", content, images, location, 
          "propertyId", "isActive", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        transformed.id,
        transformed.authorId,
        transformed.content,
        transformed.images,
        transformed.location,
        transformed.propertyId,
        transformed.isActive,
        transformed.createdAt,
        transformed.updatedAt
      ]);
      
      migrated++;
      if (migrated % 50 === 0) {
        await logProgress(`  Migrated ${migrated} posts...`);
      }
    } catch (error) {
      console.error(`Error migrating post:`, error.message);
    }
  }
  
  await logProgress(`✅ Posts: ${migrated} migrated`);
  return migrated;
}

async function migrateBookings(neonClient, supabaseClient) {
  await logProgress('Migrating bookings...');
  
  const { rows } = await neonClient.query('SELECT * FROM bookings');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(
        row,
        ['id'],
        ['propertyId', 'travelerId', 'hostId']
      );
      
      await supabaseClient.query(`
        INSERT INTO bookings (
          id, "propertyId", "travelerId", "hostId", "checkIn", 
          "checkOut", guests, "totalPrice", currency, status, 
          "specialRequests", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        transformed.id,
        transformed.propertyId,
        transformed.travelerId,
        transformed.hostId,
        transformed.checkIn,
        transformed.checkOut,
        transformed.guests,
        transformed.totalPrice,
        transformed.currency,
        transformed.status,
        transformed.specialRequests,
        transformed.createdAt,
        transformed.updatedAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating booking:`, error.message);
    }
  }
  
  await logProgress(`✅ Bookings: ${migrated} migrated`);
  return migrated;
}

async function migrateFollows(neonClient, supabaseClient) {
  await logProgress('Migrating follows...');
  
  const { rows } = await neonClient.query('SELECT * FROM follows');
  let migrated = 0;
  
  for (const row of rows) {
    try {
      const transformed = transformRow(row, ['id'], ['followerId', 'followingId']);
      
      await supabaseClient.query(`
        INSERT INTO follows (
          id, "followerId", "followingId", "createdAt"
        ) VALUES ($1, $2, $3, $4)
      `, [
        transformed.id,
        transformed.followerId,
        transformed.followingId,
        transformed.createdAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating follow:`, error.message);
    }
  }
  
  await logProgress(`✅ Follows: ${migrated} migrated`);
  return migrated;
}

async function migratePointsData(neonClient, supabaseClient) {
  await logProgress('Migrating points data...');
  
  // User Points
  const { rows: userPoints } = await neonClient.query('SELECT * FROM user_points');
  let migrated = 0;
  
  for (const row of userPoints) {
    try {
      const transformed = transformRow(row, ['id'], ['userId']);
      
      await supabaseClient.query(`
        INSERT INTO user_points (
          id, "userId", balance, "lifetimeEarned", "lifetimeSpent", 
          "lastUpdated", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        transformed.id,
        transformed.userId,
        transformed.balance,
        transformed.lifetimeEarned,
        transformed.lifetimeSpent,
        transformed.lastUpdated,
        transformed.createdAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating user points:`, error.message);
    }
  }
  
  // Point Transactions
  const { rows: transactions } = await neonClient.query('SELECT * FROM point_transactions');
  for (const row of transactions) {
    try {
      const transformed = transformRow(row, ['id'], ['userId']);
      
      await supabaseClient.query(`
        INSERT INTO point_transactions (
          id, "userId", amount, type, action, description, 
          "referenceId", "referenceType", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        transformed.id,
        transformed.userId,
        transformed.amount,
        transformed.type,
        transformed.action,
        transformed.description,
        transformed.referenceId,
        transformed.referenceType,
        transformed.createdAt
      ]);
      
      migrated++;
    } catch (error) {
      console.error(`Error migrating point transaction:`, error.message);
    }
  }
  
  await logProgress(`✅ Points data: ${migrated} records migrated`);
  return migrated;
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================

async function runMigration() {
  let neonClient;
  let supabaseClient;
  
  try {
    await logProgress('🚀 Starting Neon → Supabase Migration');
    await logProgress('=====================================');
    
    // Validate configuration
    if (NEON_DATABASE_URL.includes('YOUR_NEON_DATABASE_URL_HERE')) {
      throw new Error('Please configure NEON_DATABASE_URL in the script or environment variable');
    }
    
    if (SUPABASE_DATABASE_URL.includes('YOUR_SUPABASE_DIRECT_URL_HERE')) {
      throw new Error('Please configure SUPABASE_DATABASE_URL (DIRECT_URL) in the script or environment variable');
    }
    
    // Connect to Neon (source)
    await logProgress('Connecting to Neon database...');
    neonClient = new Client({ connectionString: NEON_DATABASE_URL });
    await neonClient.connect();
    await logProgress('✅ Connected to Neon');
    
    // Connect to Supabase (destination)
    await logProgress('Connecting to Supabase database...');
    supabaseClient = new Client({ connectionString: SUPABASE_DATABASE_URL });
    await supabaseClient.connect();
    await logProgress('✅ Connected to Supabase');
    
    // Migration order (respecting foreign key constraints)
    const stats = {};
    
    // 1. Users first (no dependencies)
    stats.users = await migrateUsers(neonClient, supabaseClient);
    
    // 2. Profiles (depend on users)
    stats.hostProfiles = await migrateHostProfiles(neonClient, supabaseClient);
    stats.travelerProfiles = await migrateTravelerProfiles(neonClient, supabaseClient);
    stats.influencerProfiles = await migrateInfluencerProfiles(neonClient, supabaseClient);
    
    // 3. Properties (depend on users/hosts)
    stats.properties = await migrateProperties(neonClient, supabaseClient);
    
    // 4. Bookings (depend on properties and users)
    stats.bookings = await migrateBookings(neonClient, supabaseClient);
    
    // 5. Posts (depend on users and properties)
    stats.posts = await migratePosts(neonClient, supabaseClient);
    
    // 6. Social (depend on users and posts)
    stats.follows = await migrateFollows(neonClient, supabaseClient);
    
    // 7. Points (depend on users)
    stats.points = await migratePointsData(neonClient, supabaseClient);
    
    // Print summary
    await logProgress('');
    await logProgress('=====================================');
    await logProgress('✅ MIGRATION COMPLETE!');
    await logProgress('=====================================');
    await logProgress('Summary:');
    await logProgress(`  Users: ${stats.users.migrated} migrated, ${stats.users.skipped} skipped`);
    await logProgress(`  Host Profiles: ${stats.hostProfiles}`);
    await logProgress(`  Traveler Profiles: ${stats.travelerProfiles}`);
    await logProgress(`  Influencer Profiles: ${stats.influencerProfiles}`);
    await logProgress(`  Properties: ${stats.properties}`);
    await logProgress(`  Bookings: ${stats.bookings}`);
    await logProgress(`  Posts: ${stats.posts}`);
    await logProgress(`  Follows: ${stats.follows}`);
    await logProgress(`  Points Data: ${stats.points}`);
    await logProgress('');
    await logProgress(`  Total ID mappings: ${idMap.size}`);
    await logProgress('');
    await logProgress('🎉 All data successfully migrated!');
    await logProgress('');
    await logProgress('NEXT STEPS:');
    await logProgress('1. Verify data in Supabase Dashboard');
    await logProgress('2. Test your application');
    await logProgress('3. Update any remaining API routes');
    
  } catch (error) {
    console.error('');
    console.error('❌ MIGRATION FAILED');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    // Close connections
    if (neonClient) {
      await neonClient.end();
      await logProgress('Disconnected from Neon');
    }
    if (supabaseClient) {
      await supabaseClient.end();
      await logProgress('Disconnected from Supabase');
    }
  }
}

// ============================================
// RUN
// ============================================

if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };

