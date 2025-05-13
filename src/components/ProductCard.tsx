'use client';

import { useState } from 'react';
import { usePaddle } from '@/hooks/usePaddle';

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  priceId: string; // This is the Paddle Billing Price ID
  // paddleProductId?: number; // Remove Paddle Classic product ID
}

export default function ProductCard({ 
  title, 
  description, 
  price, 
  priceId, // Keep priceId
  // paddleProductId // Remove paddleProductId
}: ProductCardProps) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { checkoutWithPaddle, isLoaded: isPaddleReady, error: paddleError } = usePaddle();
  
  const handleCheckout = async () => {
    if (paddleError) {
      console.error('Paddle initialization failed, cannot checkout:', paddleError);
      // Optionally, show a more user-friendly message here
      return;
    }
    if (!isPaddleReady) {
      console.warn('Paddle is not ready yet. Please wait.');
      return;
    }
    setIsCheckoutLoading(true);
    try {
      await checkoutWithPaddle(priceId);
    } catch (error) {
      console.error('Checkout error from ProductCard:', error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-5 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-500 mt-2">{description}</p>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-bold">${price}</span>
        <span className="ml-1 text-gray-500">/one-time</span>
      </div>
      {paddleError && (
        <div className="mt-2 text-sm text-red-600">
          Error initializing payment system: {paddleError.message}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={isCheckoutLoading || !isPaddleReady || !!paddleError}
        className="mt-4 w-full rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
      >
        {isCheckoutLoading
          ? 'Processing...'
          : paddleError
          ? 'Payment Error'
          : isPaddleReady
          ? 'Buy Now'
          : 'Initializing Payment...'}
      </button>
    </div>
  );
} 