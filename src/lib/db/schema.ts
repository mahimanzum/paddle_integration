import { getDBPool } from './index';

export const createUsersTable = async () => {
  const pool = getDBPool();
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('Users table checked/created successfully.');
  } catch (err) {
    console.error('Error creating users table:', err);
    // In a real app, you might want to throw the error or handle it more gracefully
    throw err;
  }
}; 