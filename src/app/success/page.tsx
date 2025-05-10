'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    // You can log analytics or perform other actions on successful payment
    console.log('Payment successful');
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-green-100 p-4">
        <svg 
          className="h-12 w-12 text-green-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
      <p className="mb-6 text-gray-600">
        Thank you for your purchase. You will receive a confirmation email shortly.
      </p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Return to Home
      </Link>
    </div>
  );
} 