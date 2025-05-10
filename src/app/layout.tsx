import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paddle Payment Demo",
  description: "A demo of Paddle payment integration with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const appEnv = process.env.NODE_ENV;

  const paddleSetupScript = `
    // Ensure Paddle.js is loaded before trying to initialize
    const initPaddle = () => {
      if (window.Paddle) {
        console.log('Initializing Paddle Billing...');
        // Set environment first
        window.Paddle.Environment.set('${appEnv === 'production' ? 'live' : 'sandbox'}');
        // Then initialize with token and callback
        window.Paddle.Initialize({
          token: '${paddleClientToken}', // Client-side token
          eventCallback: function(data) {
            console.log('Paddle event:', data);
          }
        });
      } else {
        console.log('Paddle.js not loaded yet, retrying initPaddle...');
        setTimeout(initPaddle, 100);
      }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initPaddle();
    } else {
      document.addEventListener('DOMContentLoaded', initPaddle);
    }
  `;

  return (
    <html lang="en">
      <head>
        <Script
          id="paddle-js"
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="beforeInteractive"
        />
        <Script
          id="paddle-setup"
          strategy="afterInteractive"
        >
          {paddleSetupScript}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
