import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthStatus from "@/components/auth/AuthStatus";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paddle Payment Demo with Auth",
  description: "A demo of Paddle payment integration with Next.js and basic authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN; // Removed
  // const appEnv = process.env.NODE_ENV; // Removed

  // const paddleSetupScript = ` ... `; // Removed entire paddleSetupScript block

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* <Script
          id="paddle-js"
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="beforeInteractive"
        />
        <Script
          id="paddle-setup"
          strategy="afterInteractive"
        >
          {paddleSetupScript}
        </Script> */}
        {/* Paddle scripts moved to page.tsx */}
      </head>
      <body className="antialiased">
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-gray-300">
              Payment App
            </Link>
            <AuthStatus />
          </nav>
        </header>
        <main>{children}</main>
        {/* You could add a footer here */}
      </body>
    </html>
  );
}
