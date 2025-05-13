import { cookies as nextCookies } from 'next/headers'; // Alias import for clarity
import { verifyToken, JwtPayload } from '@/lib/auth/jwtUtils'; // Adjust path as needed
import { redirect } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation
import LogoutButton from '@/components/auth/LogoutButton'; // Import LogoutButton

// This is a server component, so we can check cookies directly
// The middleware should already protect this route, but this is an additional check
// and allows us to get user information on the server side.

async function getUserData(): Promise<JwtPayload | null> {
  const cookieStore = await nextCookies(); // ADDED await back
  const tokenCookie = cookieStore.get('token');

  if (tokenCookie?.value) { // JWT_SECRET check is inside verifyToken
    const payload = verifyToken(tokenCookie.value); // Removed await
    return payload;
  }
  return null;
}

export default async function DashboardPage() {
  const user = await getUserData(); // getUserData is async due to component structure, not verifyToken

  if (!user) {
    // This should ideally not be hit if middleware is working correctly,
    // but it's a safeguard.
    redirect('/login?error=unauthorized&from=dashboard'); // Added more context to redirect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-800">
          Welcome to your Dashboard, {user.username}!
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          This is a protected page. Only logged-in users can see this.
        </p>
        <p className="mt-2 text-gray-500">Your User ID is: {user.userId}</p>

        {/* You can add more dashboard-specific content here */}
        <div className="mt-8 space-x-4 flex items-center justify-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </Link>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
} 