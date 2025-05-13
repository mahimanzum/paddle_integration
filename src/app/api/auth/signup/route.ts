import { NextResponse } from 'next/server';
import { getDBPool } from '@/lib/db';
import { hashPassword } from '@/lib/auth/passwordUtils';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    // Basic validation (you can add more complex rules)
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }
    if (username.length < 3) {
        return NextResponse.json({ message: 'Username must be at least 3 characters long.' }, { status: 400 });
    }


    const hashedPassword = await hashPassword(password);
    const pool = getDBPool();

    try {
      const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword]
      );
      const newUser = result.rows[0];
      return NextResponse.json({ user: { id: newUser.id, username: newUser.username }, message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') { // Unique constraint violation for username
        return NextResponse.json({ message: 'Username already exists.' }, { status: 409 });
      }
      console.error('Signup error:', error);
      return NextResponse.json({ message: 'Error creating user.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Invalid request:', error);
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }
} 