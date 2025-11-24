import { Pool } from 'pg';

// Use environment variable or default local connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/realmaker';

const pool = new Pool({
  connectionString,
});

export default pool;


