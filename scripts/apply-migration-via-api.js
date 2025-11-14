/**
 * Apply migration SQL to Supabase by writing to a file that can be pasted in SQL Editor
 */

const fs = require('fs');

async function main() {
  const sqlFile = process.argv[2] || 'migration_output.sql';
  
  console.log(`🚀 Processing ${sqlFile}...\n`);
  
  const sql = fs.readFileSync(sqlFile, 'utf-8');
  
  // Remove comments and prepare for SQL Editor
  const cleanedSql = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');
  
  const outputFile = 'migration_for_supabase.sql';
  fs.writeFileSync(outputFile, cleanedSql);
  
  console.log(`✅ Created ${outputFile}\n`);
  console.log(`📋 NEXT STEPS:`);
  console.log(`1. Go to: https://supabase.com/dashboard/project/fjltqzdcnqjloxxshywg/sql/new`);
  console.log(`2. Copy the contents of ${outputFile}`);
  console.log(`3. Paste into the SQL Editor`);
  console.log(`4. Click "Run" to execute all statements\n`);
  console.log(`Alternatively, run this with the Supabase CLI:`);
  console.log(`   supabase db execute < ${outputFile}\n`);
}

main().catch(console.error);

