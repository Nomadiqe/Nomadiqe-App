/**
 * Apply migration SQL to Supabase using direct API
 */

const fs = require('fs');
const { Client } = require('pg');

const SUPABASE_DIRECT_URL = process.env.DIRECT_URL || 'postgresql://postgres.fjltqzdcnqjloxxshywg:VbehZ4OxYGxgf2mp@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

async function main() {
  const sqlFile = process.argv[2] || 'migration_output.sql';
  
  console.log(`🚀 Applying ${sqlFile} to Supabase...\n`);
  
  const sql = fs.readFileSync(sqlFile, 'utf-8');
  
  // Split by empty lines and filter out comments and empty lines
  const statements = sql
    .split('\n\n')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));
  
  console.log(`📊 Found ${statements.length} statement blocks to execute\n`);
  
  const client = new Client({ connectionString: SUPABASE_DIRECT_URL });
  await client.connect();
  console.log('✅ Connected to Supabase\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await client.query(stmt);
      successCount++;
      if ((i + 1) % 10 === 0) {
        console.log(`   Executed ${i + 1}/${statements.length} statements...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error in statement ${i + 1}:`, error.message);
      // Continue with next statement
    }
  }
  
  await client.end();
  
  console.log(`\n✅ Migration complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${statements.length}\n`);
}

main().catch(console.error);







