'use client';

import { useEffect, useState } from 'react';

// Define types for Paddle Billing SDK on window
interface PaddleCheckoutOptions {
  transactionId: string;
  // You can expand this with other options like customer, items, settings if needed
  // customer?: { email?: string; address?: { postalCode?: string } };
  // items?: Array<{ priceId: string; quantity: number }>;
  // settings?: { displayMode?: 'inline' | 'overlay'; theme?: 'light' | 'dark'; frameTarget?: string; frameInitialHeight?: number; frameStyle?: string; locale?: string; successUrl?: string; };
}

interface PaddleCheckout {
  open: (options: PaddleCheckoutOptions) => void;
}

interface PaddleInitializeOptions {
  token: string; // Client-side token
  environment?: 'sandbox' | 'live';
  eventCallback?: (data: unknown) => void; // data can be more specifically typed if you know the event structure
  // Other options like: customer, items, settings, etc.
}

interface PaddleSDK {
  Initialize: (options: PaddleInitializeOptions) => void;
  Checkout: PaddleCheckout;
  // You can add other Paddle functions here as you use them, e.g., Environment, Price, etc.
}

declare global {
  interface Window {
    Paddle?: PaddleSDK;
  }
}

interface PaddleHook {
  isLoaded: boolean;
  checkoutWithPaddle: (priceId: string) => Promise<void>; // Removed productId
}

export function usePaddle(): PaddleHook {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPaddleInitialized = () => {
      // For Paddle Billing, Paddle.Initialize is asynchronous.
      // A simple check for window.Paddle might not be enough to ensure it's ready for checkout.
      // Paddle.js itself sets up window.Paddle. You can also check for specific functions if needed.
      if (window.Paddle && window.Paddle.Checkout) { // Check for Checkout availability
        console.log('Paddle Billing SDK is available.');
        setIsLoaded(true);
      } else {
        console.log('Paddle Billing SDK not fully ready yet...');
      }
    };

    checkPaddleInitialized();
    const intervalId = setInterval(() => {
      if (window.Paddle && window.Paddle.Checkout) {
        setIsLoaded(true);
        clearInterval(intervalId);
      } else if (document.readyState === 'complete') { // Stop if page loaded and Paddle still not there
        // To prevent infinite loops if Paddle fails to load for some reason
        // console.warn('Paddle SDK did not initialize after page load.');
        // clearInterval(intervalId); 
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []); // Run once on mount

  const checkoutWithPaddle = async (priceId: string) => { // Removed productId
    console.log('checkoutWithPaddle called with priceId:', priceId);
    
    if (!isLoaded || !window.Paddle || !window.Paddle.Checkout) {
      console.error('Paddle is not initialized or Checkout is not available.');
      // Consider a user-facing error message here
      // For now, retrying or waiting a bit longer
      let attempts = 0;
      const maxAttempts = 10;
      while ((!window.Paddle || !window.Paddle.Checkout) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
        if (window.Paddle && window.Paddle.Checkout) {
          setIsLoaded(true); // Ensure isLoaded is true if it becomes available
          break;
        }
      }
      if (!window.Paddle || !window.Paddle.Checkout) {
         throw new Error('Paddle SDK did not initialize properly.');
      }
    }

    try {
      console.log('Creating transaction via API...');
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId, // This is the Paddle Billing Price ID
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to create transaction:', errorBody);
        throw new Error(`Failed to create transaction: ${errorBody}`);
      }

      const { transactionId } = await response.json(); // Expecting transactionId now
      console.log('Transaction created with ID:', transactionId, 'Opening Paddle Checkout...');

      if (window.Paddle?.Checkout?.open) {
        window.Paddle.Checkout.open({
          transactionId: transactionId, // Use the transactionId from your API
          // You can add customer details here if not already handled by create-transaction API
          // customer: { email: 'customer@example.com', address: { postalCode: '90210' } }, 
          // items: [{ priceId: priceId, quantity: 1}], // Not needed if using transactionId
        });
        console.log('Paddle Checkout opened with transactionId.');
      } else {
        console.error('Paddle Checkout is not available on window.Paddle');
        throw new Error('Paddle Checkout is not available.');
      }
    } catch (error) {
      console.error('Error during Paddle checkout process:', error);
      // Potentially show an error message to the user
      throw error;
    }
  };

  return {
    isLoaded,
    checkoutWithPaddle,
  };
} 