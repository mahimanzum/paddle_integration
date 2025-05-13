'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Environments, initializePaddle, Paddle, PaddleEventData } from '@paddle/paddle-js';

interface PaddleContextType {
  paddle: Paddle | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export const usePaddleContext = () => {
  const context = useContext(PaddleContext);
  if (context === undefined) {
    throw new Error('usePaddleContext must be used within a PaddleProvider');
  }
  return context;
};

interface PaddleProviderProps {
  children: ReactNode;
  clientToken: string | undefined;
  environment: 'sandbox' | 'live';
}

export const PaddleProvider = ({ children, clientToken, environment }: PaddleProviderProps) => {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientToken) {
      console.error('Paddle client token is not provided. Cannot initialize Paddle.');
      setError(new Error('Paddle client token not provided.'));
      setIsLoading(false);
      return;
    }

    console.log(`Initializing Paddle with env: ${environment} and token: ${clientToken ? 'provided' : 'missing'}`);

    initializePaddle({
      token: clientToken, // Your client-side token from Paddle dashboard
      environment: environment as Environments,
      eventCallback: (event: PaddleEventData) => {
        // Safely access event properties
        const eventName = event?.name;
        const eventId = 'id' in event ? event.id : undefined; // event.id might not exist on all event types
        const eventTransactionId = 'transaction_id' in event ? event.transaction_id : undefined; // same for transaction_id
        const eventData = 'data' in event ? event.data : undefined;

        console.log('Paddle Event (NPM Package):', { name: eventName, id: eventId, transaction_id: eventTransactionId, data: eventData });

        if (eventName) { // Check if eventName is defined before using in switch
          switch (eventName) {
            case 'checkout.loaded':
              console.log('Checkout Loaded:', { id: eventId, data: eventData });
              break;
            case 'checkout.completed':
              console.log('Checkout Completed:', { id: eventId, transaction_id: eventTransactionId, data: eventData });
              // Call your API for successful payment
              break;
            // Note: The original 'checkout.canceled' case is removed as it seems 'checkout.closed' and 'checkout.error' 
            // are more appropriate based on Paddle.js documentation.
            case 'checkout.closed':
              console.log('Checkout Closed by User:', { id: eventId, data: eventData });
              break;
            case 'checkout.customer.created':
              console.log('Checkout Customer Created:', { id: eventId, data: eventData });
              break;
            case 'checkout.payment.selected':
              console.log('Checkout Payment Method Selected:', { id: eventId, data: eventData });
              break;
            case 'checkout.error':
              console.log('Checkout Error:', { id: eventId, data: eventData });
              break;
            // Add more event cases as needed from Paddle.js documentation
            default:
              console.log('Unhandled Paddle Event:', { name: eventName, id: eventId, data: eventData });
              break;
          }
        } else {
          console.log('Received Paddle event with no name:', event);
        }
      },
      // You can add other settings here if needed, like `checkout` for default checkout settings
      // settings: { displayMode: 'overlay' }
    })
      .then((paddleInstance) => {
        if (paddleInstance) {
          console.log('Paddle initialized successfully via NPM package.');
          setPaddle(paddleInstance);
        } else {
          console.error('initializePaddle resolved but paddleInstance is undefined.');
          setError(new Error('Failed to initialize Paddle: instance is undefined.'));
        }
      })
      .catch((err) => {
        console.error('Failed to initialize Paddle:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Paddle.'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [clientToken, environment]);

  return (
    <PaddleContext.Provider value={{ paddle, isLoading, error }}>
      {children}
    </PaddleContext.Provider>
  );
}; 