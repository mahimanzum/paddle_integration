import { Pool } from 'pg';

let pool: Pool;

export const getDBPool = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    pool = new Pool({
      connectionString,
    });
  }
  return pool;
}; 