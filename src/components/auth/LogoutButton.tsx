'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/login'); // Redirect to login page after logout
        router.refresh(); // Ensure client-side cache is cleared for auth state
      } else {
        const data = await res.json();
        alert(data.message || 'Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An unexpected error occurred during logout.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${className || 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
    >
      Log Out
    </button>
  );
} 