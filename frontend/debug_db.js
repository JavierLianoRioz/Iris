import postgres from 'postgres';

// Manually constructed string based on my assumption of .env
const sql = postgres('postgres://midas:banana@localhost:10004/iris_db');

async function test() {
    try {
        const result = await sql`SELECT 1`;
        console.log('Connection success:', result);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await sql.end();
    }
}

test();
