'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage() {
  useEffect(() => {
    // You can log analytics or perform other actions on payment failure
    console.log('Payment failed');
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4">
        <svg 
          className="h-12 w-12 text-red-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="mb-2 text-3xl font-bold">Payment Failed</h1>
      <p className="mb-6 text-gray-600">
        We encountered an issue processing your payment. No charges were made.
      </p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try Again
      </Link>
    </div>
  );
} 