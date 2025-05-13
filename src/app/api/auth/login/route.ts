import { NextResponse } from 'next/server';
import { getDBPool } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/passwordUtils';
import { generateToken, JwtPayload } from '@/lib/auth/jwtUtils';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    const pool = getDBPool();
    const result = await pool.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
    }

    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
    }

    const tokenPayload: JwtPayload = { userId: user.id, username: user.username };
    const token = generateToken(tokenPayload);

    const response = NextResponse.json({ message: 'Login successful', user: { id: user.id, username: user.username } });

    // Set token in an HTTP-Only cookie on the response
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/',
      sameSite: 'lax', // Or 'strict'
      maxAge: 60 * 60, // 1 hour, matches JWT_EXPIRES_IN. Adjust as needed.
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
} 