// app/(public)/layout.jsx

import '@/styles/globals.css';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Test Yukti - Online Test Platform",
  description: "Mock tests, PYQs, quizzes and live tests for competitive exams. Prepare smarter with Test Yukti.",
  themeColor: "#2563EB",
  manifest: "/manifest.json",
};

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>

        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Test Yukti</h1>
            <nav className="space-x-4 text-sm">
              <a href="/" className="hover:underline">Home</a>
              <a href="/test-series" className="hover:underline">Test Series</a>
              <a href="/leaderboard" className="hover:underline">Leaderboard</a>
              <a href="/profile" className="hover:underline">Profile</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-blue-600 text-white text-center p-4 text-sm">
          © {new Date().getFullYear()} Test Yukti | All Rights Reserved.
        </footer>

      </body>
    </html>
  );
}
