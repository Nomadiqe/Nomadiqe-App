# Database Branch Merging Guide

## Overview

This guide explains how to merge data from a Neon database branch into the main branch safely.

## Why This Is Needed

Neon database branches allow developers to work on schema changes and test data independently. However, when development is complete, you need to merge the branch data back into main. Unlike git, Neon doesn't have a built-in "merge" feature.

## The Challenge

When merging database branches, the main problem is **ID mismatches**:

1. **Same users, different IDs**: A user with email `test@example.com` might have ID `abc123` in main and `xyz789` in the branch
2. **Foreign key references**: All related data (posts, properties, profiles) reference these IDs
3. **Upsert requirements**: We want to update existing records and create new ones

## Our Solution

We created a comprehensive upsert script that:

1. **Maps users by email** (luca ID → main ID)
2. **Updates existing records** with branch data
3. **Creates new records** that don't exist in main
4. **Remaps all foreign keys** to use main branch IDs
5. **Handles missing tables** gracefully

## How to Use

### Quick Method

Run the npm script:

```bash
pnpm merge:luca-to-main
```

### Manual Method

Run the TypeScript script directly:

```bash
npx tsx scripts/upsert-luca-to-main.ts
```

### What Happens

The script will:

1. Connect to both main and luca branches
2. Build user ID mappings (by email)
3. Upsert all data in this order:
   - Users (29 updated)
   - Host Profiles (8 updated)
   - Traveler Profiles (16 updated)
   - Influencer Profiles (13 updated)
   - Social Connections (16 updated)
   - Properties (16 updated)
   - Posts (17 updated)
   - Post Likes (27 updated)
   - Post Comments (7 updated)
   - Follows (4 updated)
   - OAuth Accounts (10 updated)

4. Show final counts to verify success

### Expected Output

```
🚀 Starting comprehensive upsert from luca branch → main branch

📡 Testing connections...
✅ MAIN: 32 users
✅ LUCA: 29 users

🗺️  Step 1: Building user ID mapping...
✅ Users: 29 updated, 0 created, 0 skipped
   ID mappings created: 29

🏠 Step 2: Upserting host profiles...
✅ Host profiles: 8 updated, 0 created, 0 skipped

... (continues through all 13 steps) ...

🎉 Done! All data from luca branch has been upserted to main branch.

📊 Final counts in MAIN branch:
   Users: 32
   Properties: 11
   Posts: 24
   Social Connections: 18
   Post Likes: 51
   Post Comments: 11
   Follows: 6
```

## Configuration

The script uses hardcoded connection strings from `.env`:

```env
# Main branch (current production)
DATABASE_URL=postgresql://neondb_owner:***@ep-holy-bush-a2zkyplq-pooler.eu-central-1.aws.neon.tech/neondb

# Luca branch (development)
# DATABASE_URL=postgresql://neondb_owner:***@ep-summer-sky-a2wk3dal-pooler.eu-central-1.aws.neon.tech/neondb
```

**To merge a different branch:**

1. Open `scripts/upsert-luca-to-main.ts`
2. Update the `LUCA_URL` constant with your branch URL
3. Run the script

## Safety Features

✅ **No data deletion**: Only updates and inserts, never deletes
✅ **Idempotent**: Can run multiple times safely
✅ **ID mapping**: Preserves referential integrity
✅ **Error handling**: Skips missing tables gracefully
✅ **Detailed reporting**: Shows exactly what was changed

## Important Notes

### Main Branch Data Takes Priority

- If a user exists in both branches (by email), **main branch ID is kept**
- All luca branch records are updated to reference main branch IDs
- New users from luca get new IDs in main

### Foreign Key Handling

The script handles these relationships:

- Users → Host/Traveler/Influencer Profiles
- Users → Properties (hostId)
- Users → Posts (authorId)
- Users → Social Connections
- Properties → Posts (propertyId)
- Users → Post Likes/Comments
- Users → Follows (both directions)
- Users → OAuth Accounts

### Unique Constraints

The script respects unique constraints:

- `users.email` - Matches by email
- `users.username` - Updates if changed
- `hostProfile.userId` - One profile per user
- `socialConnection.userId + platform` - One connection per platform

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solution**: Run from the project root directory

```bash
cd /path/to/Nomadiqe-App
npx tsx scripts/upsert-luca-to-main.ts
```

### Error: "Foreign key constraint violated"

**Cause**: A record references a user ID that doesn't exist in either branch

**Solution**: The script automatically skips these records and reports them

### Table Not Found Errors

**Cause**: Branch schemas differ (e.g., conversations table missing)

**Solution**: Script automatically handles this and skips missing tables

### Duplicate Email Errors

**Cause**: Two different users have the same email in luca branch

**Solution**: Script will skip the duplicate and report it

## Best Practices

### Before Merging

1. **Backup main branch** (Neon makes automatic backups, but verify)
2. **Test the script** in a staging environment first
3. **Review the changes** you expect to see
4. **Coordinate with team** - pause development during merge

### During Merge

1. **Run during low traffic** hours if possible
2. **Monitor the output** - watch for unexpected skips
3. **Take note of counts** - verify they make sense

### After Merge

1. **Verify data in main** - spot check users, posts, properties
2. **Test the application** - ensure everything works
3. **Delete or archive branch** - keep workspace clean
4. **Document what was merged** - for team awareness

## Future Improvements

### Make It Configurable

Instead of hardcoding URLs, accept them as CLI arguments:

```bash
npx tsx scripts/upsert-luca-to-main.ts --from luca --to main
```

### Add Dry Run Mode

Preview changes without applying them:

```bash
pnpm merge:luca-to-main --dry-run
```

### Create Backup Before Merge

Automatically create a Neon branch backup:

```bash
neonctl branches create --name "main-backup-$(date +%Y%m%d)"
```

### Interactive Conflict Resolution

For duplicate emails or other conflicts, prompt the user:

```
⚠️  Conflict detected:
   Main: user@example.com (ID: abc123, name: "John Doe")
   Luca: user@example.com (ID: xyz789, name: "John D.")

   Which version should we keep?
   [1] Main  [2] Luca  [3] Merge fields
```

### Support More Tables

As the schema grows, add support for:

- Bookings
- Reviews
- Payments
- User Points
- Point Transactions
- Guest Preferences
- Onboarding Progress

## Alternative Approaches

### 1. Promote Branch to Main

**When to use**: Complete replacement, luca has all the data you need

```bash
neonctl branches set-primary <luca-branch-id>
```

**Pros**: Simple, one command
**Cons**: Loses all main branch data

### 2. pg_dump/restore

**When to use**: One-time bulk copy

```bash
pg_dump "$LUCA_URL" --data-only | psql "$MAIN_URL"
```

**Pros**: Fast for large datasets
**Cons**: Doesn't handle ID conflicts

### 3. Manual SQL Upserts

**When to use**: Small, specific data subsets

```sql
INSERT INTO users (id, email, name)
VALUES ('xyz', 'new@example.com', 'New User')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
```

**Pros**: Precise control
**Cons**: Tedious for large datasets

## Questions?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the script output for errors
3. Check Neon dashboard for database health
4. Ask the team for help

## Related Documentation

- [Neon Branching Docs](https://neon.tech/docs/guides/branching)
- [Prisma Upsert Docs](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert)
- [Database Migration Guide](./DEPLOYMENT.md)
