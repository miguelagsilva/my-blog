import type { Metadata } from "next";
import { Fira_Code, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./styles/highlight.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-alt",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaCode.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* 100% privacy-first analytics */}
        <Script
          src="https://scripts.simpleanalyticscdn.com/latest.js"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <Header />
          <main className="flex-1">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
              <div className="flex flex-col lg:flex-row gap-16 justify-center">
                <div className="flex-1 min-w-0 max-w-5xl">
                  {children}
                </div>
                <Sidebar />
              </div>
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
