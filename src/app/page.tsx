import ProductCard from '@/components/ProductCard';
const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || 'pri_01jtvvpjw4jeh3kt5bv32v7f5w'; // Fallback for demo

export default function Home() {
  // You would typically get this from an API or environment variable
  // For this example, we'll use a hardcoded value - replace with your actual product ID from Paddle Classic
  // const paddleClassicProductId = 850254; // Remove this - Not needed for Paddle Billing
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Paddle Payment Demo
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            A simple example of integrating Paddle payments in a Next.js application
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            title="Premium Widget"
            description="High-quality premium widget with all the features you need."
            price={20}
            priceId={priceId} // Use environment variable with fallback
            // paddleProductId={paddleClassicProductId} // Remove this line
          />
        </div>
      </div>
    </main>
  );
}
