import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miguel's Blog",
  description: "A personal blog about tech and programming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-screen-lg mx-auto w-full px-4">
          <nav className="flex justify-center space-x-4 p-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/posts" className="hover:underline">
              Posts
            </a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
  }
