# Paddle Payment Integration Demo

This is a simple Next.js application that demonstrates how to integrate with Paddle for processing payments.
use this commadn to check if authneticated or not 
```
curl https://sandbox-api.paddle.com/event-types -H "Authorization: Bearer pdl_sdbx_apikey_01jtvzvnx3eksdcpc4hwtjkdk0_YmGcj8weZwwQHC00AfXtNY_Agu" | cat
```
## Prerequisites

- Node.js 18+ and npm
- A Paddle account (sign up at [paddle.com](https://paddle.com))

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following content:
   ```
   # Paddle API keys (replace with your actual keys from Paddle dashboard)
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token
   PADDLE_SECRET_KEY=your_paddle_secret_key
   
   # Price ID for the product (replace with your actual Paddle price ID)
   NEXT_PUBLIC_PADDLE_PRICE_ID=pri_01h1vz7n8tp5drh97h3j4dhrqb
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Setting Up Paddle Sandbox

1. **Create a Paddle Account**:
   - Sign up at [paddle.com](https://paddle.com)
   - Go to the Developer section to access your sandbox environment

2. **Create a Product and Price**:
   - In the Paddle dashboard, navigate to "Products" > "Create Product"
   - Fill in the product details (name, description, etc.)
   - Add a price (e.g., $20 one-time payment)
   - Save the product

3. **Get Your API Keys**:
   - Go to "Developer" > "Authentication"
   - Create a new API key with the necessary scopes (transactions:read, transactions:write)
   - Copy your client token and secret key

4. **Update Your .env.local File**:
   - Replace the placeholder values with your actual API keys and price ID

5. **Test the Integration**:
   - For sandbox testing, use the test card details provided by Paddle:
     - Card Number: 4242 4242 4242 4242
     - Expiry Date: Any future date
     - CVC: Any 3 digits
     - Zip/Postal Code: Any 5 digits

## How It Works

1. The application displays a product card with a "Buy Now" button
2. When the button is clicked, the application calls our API endpoint to create a transaction
3. The API endpoint would normally call Paddle's API to create a transaction (in sandbox mode, we just return a dummy client secret)
4. The Paddle checkout overlay appears, allowing the user to enter payment details
5. After a successful payment, the user is redirected to a success page
6. If the payment fails, the user is redirected to an error page

## Production Considerations

For a production environment, you would need to:

1. Implement proper error handling and validation
2. Set up webhooks to receive payment status updates from Paddle
3. Store customer and transaction information in a database
4. Handle various edge cases (retries, refunds, etc.)
5. Switch to production API keys and URLs

## Learn More

- [Paddle API Documentation](https://developer.paddle.com/api-reference/overview)
- [Next.js Documentation](https://nextjs.org/docs)
