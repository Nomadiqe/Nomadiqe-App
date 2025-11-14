/**
 * SIMPLIFIED NEON TO SUPABASE MIGRATION
 * Uses pg for Neon and outputs SQL that you can run in Supabase
 */

const { Client } = require('pg');
const { v4: uuidv4, validate: isUuid } = require('uuid');
const fs = require('fs');

const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_vZL3CuqGUed4@ep-holy-bush-a2zkyplq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const idMap = new Map();

function getOrCreateUUID(oldId) {
  if (!oldId) return null;
  if (isUuid(oldId)) return oldId;
  if (idMap.has(oldId)) return idMap.get(oldId);
  
  const newUuid = uuidv4();
  idMap.set(oldId, newUuid);
  return newUuid;
}

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (value instanceof Date) return `'${value.toISOString()}'`;
  if (Array.isArray(value)) return `ARRAY[${value.map(v => sqlEscape(v)).join(',')}]::text[]`;
  if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  
  // String - escape single quotes
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function main() {
  console.log('🚀 Connecting to Neon database...\n');
  
  const client = new Client({ connectionString: NEON_DATABASE_URL });
  await client.connect();
  
  console.log('✅ Connected to Neon\n');
  
  let sqlOutput = [];
  
  sqlOutput.push('-- ============================================');
  sqlOutput.push('-- NEON TO SUPABASE MIGRATION SQL');
  sqlOutput.push('-- Generated: ' + new Date().toISOString());
  sqlOutput.push('-- ============================================\n');
  
  // Fetch all users
  console.log('📊 Fetching users from Neon...');
  const { rows: users } = await client.query('SELECT * FROM users ORDER BY "createdAt"');
  console.log(`   Found ${users.length} users\n`);
  
  sqlOutput.push('-- ============================================');
  sqlOutput.push(`-- USERS (${users.length} records)`);
  sqlOutput.push('-- ============================================\n');
  
  for (const user of users) {
    const newId = getOrCreateUUID(user.id);
    
    // Map image fields - use profilePictureUrl for image column
    const imageUrl = user.profilePictureUrl || user.image;
    
    sqlOutput.push(`INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")`);
    sqlOutput.push(`VALUES (${sqlEscape(newId)}, ${sqlEscape(user.email)}, ${sqlEscape(user.emailVerified)}, ${sqlEscape(user.name)}, ${sqlEscape(user.fullName)}, ${sqlEscape(user.username)}, ${sqlEscape(user.bio)}, ${sqlEscape(user.location)}, ${sqlEscape(user.phone)}, ${sqlEscape(imageUrl)}, ${sqlEscape(user.profilePictureUrl)}, ${sqlEscape(user.coverPhotoUrl)}, ${sqlEscape(user.role)}, ${sqlEscape(user.onboardingStatus)}, ${sqlEscape(user.createdAt)}, ${sqlEscape(user.updatedAt)})`);
    sqlOutput.push(`ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";\n`);
  }
  
  // Properties
  console.log('📊 Fetching properties from Neon...');
  const { rows: properties } = await client.query('SELECT * FROM properties');
  console.log(`   Found ${properties.length} properties\n`);
  
  sqlOutput.push('\n-- ============================================');
  sqlOutput.push(`-- PROPERTIES (${properties.length} records)`);
  sqlOutput.push('-- ============================================\n');
  
  for (const prop of properties) {
    const newId = getOrCreateUUID(prop.id);
    const hostId = getOrCreateUUID(prop.hostId);
    
    // Map to Supabase schema: type instead of propertyType, rules instead of houseRules
    // Provide default type 'HOUSE' if NULL (type is NOT NULL in Supabase)
    const propertyType = prop.propertyType || 'HOUSE';
    
    sqlOutput.push(`INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")`);
    sqlOutput.push(`VALUES (${sqlEscape(newId)}, ${sqlEscape(hostId)}, ${sqlEscape(prop.title)}, ${sqlEscape(prop.description)}, ${sqlEscape(propertyType)}, ${sqlEscape(prop.address)}, ${sqlEscape(prop.city)}, ${sqlEscape(prop.country)}, ${sqlEscape(prop.latitude)}, ${sqlEscape(prop.longitude)}, ${sqlEscape(prop.bedrooms)}, ${sqlEscape(prop.bathrooms)}, ${sqlEscape(prop.maxGuests)}, ${sqlEscape(prop.price)}, ${sqlEscape(prop.currency)}, ${sqlEscape(prop.amenities)}, ${sqlEscape(prop.images)}, ${sqlEscape(prop.houseRules)}, ${sqlEscape(prop.isActive)}, ${sqlEscape(prop.createdAt)}, ${sqlEscape(prop.updatedAt)})`);
    sqlOutput.push(`ON CONFLICT (id) DO NOTHING;\n`);
  }
  
  // Posts
  console.log('📊 Fetching posts from Neon...');
  const { rows: posts } = await client.query('SELECT * FROM posts');
  console.log(`   Found ${posts.length} posts\n`);
  
  sqlOutput.push('\n-- ============================================');
  sqlOutput.push(`-- POSTS (${posts.length} records)`);
  sqlOutput.push('-- ============================================\n');
  
  for (const post of posts) {
    const newId = getOrCreateUUID(post.id);
    const authorId = getOrCreateUUID(post.authorId);
    const propertyId = getOrCreateUUID(post.propertyId);
    
    sqlOutput.push(`INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")`);
    sqlOutput.push(`VALUES (${sqlEscape(newId)}, ${sqlEscape(authorId)}, ${sqlEscape(post.content)}, ${sqlEscape(post.images)}, ${sqlEscape(post.location)}, ${sqlEscape(propertyId)}, ${sqlEscape(post.isActive)}, ${sqlEscape(post.createdAt)}, ${sqlEscape(post.updatedAt)})`);
    sqlOutput.push(`ON CONFLICT (id) DO NOTHING;\n`);
  }
  
  await client.end();
  
  // Write to file
  const outputFile = 'migration_output.sql';
  fs.writeFileSync(outputFile, sqlOutput.join('\n'));
  
  console.log('✅ Migration SQL generated!');
  console.log(`📄 Output file: ${outputFile}`);
  console.log(`📊 Total ID mappings: ${idMap.size}`);
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Review the migration_output.sql file');
  console.log('2. Run it in Supabase SQL Editor');
  console.log('3. Or use: psql $DIRECT_URL < migration_output.sql');
}

main().catch(console.error);

