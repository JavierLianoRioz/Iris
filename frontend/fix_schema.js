import postgres from 'postgres';

// Connection string for local host access to Docker DB
const sql = postgres('postgres://midas:banana@localhost:10004/iris_db');

async function run() {
  try {
    console.log('Dropping old constraint...');
    await sql`ALTER TABLE user_subjects DROP CONSTRAINT IF EXISTS user_subjects_user_id_fkey`;
    
    console.log('Adding new constraint with CASCADE...');
    await sql`ALTER TABLE user_subjects ADD CONSTRAINT user_subjects_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`;
    
    console.log('Successfully fixed user_subjects constraint.');
  } catch (e) {
    console.error('Error fixing constraint:', e);
  } finally {
    await sql.end();
  }
}

run();
