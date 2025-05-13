import { cookies as nextCookies } from 'next/headers';
import { verifyToken, JwtPayload } from '@/lib/auth/jwtUtils';
import Link from 'next/link';
import LogoutButton from './LogoutButton'; // Re-use the button

async function getAuthUser(): Promise<JwtPayload | null> {
  const cookieStore = await nextCookies();
  const tokenCookie = cookieStore.get('token');
  if (tokenCookie?.value) {
    return verifyToken(tokenCookie.value);
  }
  return null;
}

export default async function AuthStatus() {
  const user = await getAuthUser();

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <span className="text-sm text-gray-600">Hi, {user.username}!</span>
          <LogoutButton className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:ring-red-400 rounded-md" />
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
} 