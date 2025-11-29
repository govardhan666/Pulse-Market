import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseMarket - Real-Time Prediction Markets",
  description: "Decentralized prediction market platform powered by Somnia Data Streams with instant real-time updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pb-12">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
