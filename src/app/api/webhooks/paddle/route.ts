import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure of the Paddle webhook event body
interface PaddleWebhookEvent {
  event_type?: string; // For older Paddle Classic webhooks if you might receive them
  name?: string;       // For Paddle Billing (e.g., 'subscription.activated')
  data?: Record<string, unknown> | object;
  // Add any other top-level fields you expect based on the example you provided
  event_id?: string;
  occurred_at?: string;
  notification_id?: string;
}

// Handler for POST requests
export async function POST(req: NextRequest) {
  try {
    const event = await req.json() as PaddleWebhookEvent;

    console.log('Received Paddle Webhook in /app/api/webhooks/paddle/route.ts:');

    // Check for Paddle Billing event 'name'
    if (event.name) {
      console.log(`Event Name: ${event.name}`);
      console.log('Event Data:', JSON.stringify(event.data || {}, null, 2));
      console.log('Full Event Body:', JSON.stringify(event, null, 2));


      // Specific handling for events
      switch (event.name) {
        case 'subscription.activated': // Matching the event you received
          console.log('Subscription Activated:', event.data);
          // TODO: Your logic for when a subscription is activated
          break;
        case 'subscription.created':
          console.log('Subscription Created:', event.data);
          // TODO: Your logic for when a subscription is created
          break;
        case 'subscription.updated':
          console.log('Subscription Updated:', event.data);
          // TODO: Your logic for when a subscription is updated
          break;
        case 'subscription.canceled':
          console.log('Subscription Canceled:', event.data);
          // TODO: Your logic for when a subscription is canceled
          break;
        case 'transaction.completed':
          console.log('Transaction Completed:', event.data);
          // TODO: Your logic for a completed transaction
          break;
        case 'transaction.paid':
          console.log('Transaction Paid:', event.data);
          // TODO: Your logic here
          break;
        default:
          console.log('Unhandled Paddle Billing event type:', event.name);
      }
    }
    // Fallback for older "event_type" if needed, or other structures
    else if (event.event_type) {
      console.log(`Event Type: ${event.event_type}`);
      console.log('Full Event Body:', JSON.stringify(event, null, 2));
    } else {
      console.log('Unknown Paddle Webhook structure or missing event name/type:');
      console.log(JSON.stringify(event, null, 2));
    }

    // Respond to Paddle with a 200 OK
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Error processing webhook', details: errorMessage }, { status: 500 });
  }
}

// Optional: You can also export a GET handler if you want to test
// the endpoint from a browser (though Paddle webhooks are POST)
export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active. Use POST for Paddle events.' }, { status: 200 });
} 