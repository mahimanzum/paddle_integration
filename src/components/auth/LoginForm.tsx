'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Please check your credentials.');
      } else {
        // Login successful, redirect to a protected route (e.g., dashboard)
        // router.push('/dashboard'); // We'll create this page later
        router.refresh(); // Refresh to update authentication state from cookie
        router.push('/'); // For now, redirect to home page, or dashboard if it exists
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
      {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded">{error}</p>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log In
        </button>
      </div>
       <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
            </a>
        </p>
    </form>
  );
} 