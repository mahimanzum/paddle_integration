import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the token cookie
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: -1, // Expire the cookie immediately
    });
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'An error occurred during logout.' }, { status: 500 });
  }
} 