'use client';

import { useRouter } from 'next/navigation';
import { usePaddleContext } from '@/context/PaddleContext'; // Import the context hook
// Import relevant types from @paddle/paddle-js if needed for options, e.g., CheckoutOpenOptions
// For now, we assume options passed to paddle.Checkout.open will align with its expected type.

// Old PaddleSDK-related interfaces are removed as we now get a typed `paddle` instance from context.
// declare global {
//   interface Window {
//     Paddle?: PaddleSDK;
//     isPaddleInitialized?: boolean;
//   }
// }

interface PaddleHook {
  isLoaded: boolean; // This will now reflect isLoading from context
  checkoutWithPaddle: (priceId: string) => Promise<void>;
  error: Error | null; // Expose error state from context
}

export function usePaddle(): PaddleHook {
  const { paddle, isLoading, error } = usePaddleContext(); // Consume context
  const router = useRouter();

  // The useEffect for checking window.Paddle and window.isPaddleInitialized is removed.
  // isLoaded directly reflects isLoading from the context.

  const checkoutWithPaddle = async (priceId: string) => {
    console.log('checkoutWithPaddle called with priceId (NPM):', priceId);

    if (isLoading) {
      console.error('Paddle is still initializing (isLoading is true).');
      // Optionally, you could throw an error or wait, but ProductCard should prevent this call.
      return;
    }

    if (error) {
      console.error('Paddle initialization failed:', error);
      router.push('/error');
      return;
    }

    if (!paddle || !paddle.Checkout) {
      console.error('Paddle instance or Paddle.Checkout is not available.');
      router.push('/error');
      return;
    }

    try {
      console.log('Creating transaction via API (NPM flow)...');
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to create transaction:', errorBody);
        throw new Error(`Failed to create transaction: ${errorBody}`);
      }

      const { transactionId } = await response.json();
      console.log('Transaction created (NPM flow) with ID:', transactionId);

      // Use the paddle instance from context
      paddle.Checkout.open({
        transactionId: transactionId,
        //settings: {
          //successUrl: `${window.location.origin}/success`
          // theme: 'light', // Example customization
        //}
      });
      console.log('Paddle Checkout opened with transactionId and successUrl (NPM flow).');
    } catch (err) {
      console.error('Error during Paddle checkout process (NPM flow):', err);
      router.push('/error');
      // No re-throw, router.push handles it
    }
  };

  return {
    isLoaded: !isLoading, // isLoaded is true when isLoading is false
    checkoutWithPaddle,
    error,
  };
} 