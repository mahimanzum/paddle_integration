'use client';

// import { useEffect, useState } from 'react'; // Removed unused imports
import ProductCard from '@/components/ProductCard';
import { PaddleProvider } from '@/context/PaddleContext';

const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || 'pri_01jtvvpjw4jeh3kt5bv32v7f5w';

export default function Home() {
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const appEnv = process.env.NODE_ENV;
  const paddleEnv = appEnv === 'production' ? 'live' : 'sandbox';

  if (!paddleClientToken) {
    console.error('Paddle client token is not defined. App functionality may be limited.');
  }

  return (
    <PaddleProvider clientToken={paddleClientToken} environment={paddleEnv}>
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Paddle Payment Demo (NPM)
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Integrating Paddle via @paddle/paddle-js NPM package.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProductCard
              title="Premium Widget"
              description="High-quality premium widget with all the features you need."
              price={20}
              priceId={priceId}
            />
          </div>
        </div>
      </main>
    </PaddleProvider>
  );
}
