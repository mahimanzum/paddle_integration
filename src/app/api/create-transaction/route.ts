import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { priceId, quantity } = await request.json();

    // Validate the request
    if (!priceId || !quantity) {
      return NextResponse.json(
        { error: 'Price ID and quantity are required' },
        { status: 400 }
      );
    }

    // Call Paddle's API to create a transaction
    const PADDLE_API_HOST = process.env.NODE_ENV === 'production' 
      ? 'https://api.paddle.com' 
      : 'https://sandbox-api.paddle.com';

    console.log(`Creating Paddle transaction with Price ID: ${priceId} on host: ${PADDLE_API_HOST}`);
    console.log(`Using PADDLE_SECRET_KEY: ${process.env.PADDLE_SECRET_KEY ? 'Exists' : 'MISSING OR EMPTY'}`);

    const response = await fetch(`${PADDLE_API_HOST}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PADDLE_SECRET_KEY}`, // This is where PADDLE_SECRET_KEY is used
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity,
          },
        ],
        // You might want to include customer details or pass them on the client-side later
        // customer: { email: "customer@example.com" }, 
        // Or define how you want to handle return URLs if not using default Paddle success/error pages
        // collection_mode: 'manual', // if you want to handle payment confirmation yourself
        // success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?paddle_transaction_id={paddle_transaction_id}`,
        // cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      }),
    });

    const responseText = await response.text(); // Get raw response text for better debugging
    let data;
    try {
      data = JSON.parse(responseText); // Try to parse as JSON
    } catch {
      console.error('Failed to parse Paddle API response as JSON:', responseText);
      throw new Error(`Paddle API returned non-JSON response: ${response.status} ${response.statusText}`);
    }
    
    if (!response.ok) {
      console.error('Paddle API Error Response:', data); 
      throw new Error(data.error?.detail || data.error?.type || `Failed to create transaction. Status: ${response.status}`);
    }

    // Paddle Billing API often nests the main object within a 'data' field.
    if (!data.data || !data.data.id) {
      console.error('Unexpected Paddle API response structure. Missing data.data.id:', data);
      throw new Error('Failed to extract transaction ID from Paddle API response.');
    }
    const { id: transactionId } = data.data; 
    console.log('Successfully created Paddle transaction. ID:', transactionId);

    // Comment out the mock transaction ID generation
    // const transactionId = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    return NextResponse.json({ transactionId });

  } catch (error: unknown) {
    console.error('Error in /api/create-transaction:', error);
    let errorMessage = 'Failed to create transaction';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 