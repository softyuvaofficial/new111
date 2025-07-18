import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <a className="text-2xl font-bold text-blue-600">TestYukti</a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="/test-series">
            <a className="text-gray-700 hover:text-blue-600 transition">Test Series</a>
          </Link>
          <Link href="/leaderboard">
            <a className="text-gray-700 hover:text-blue-600 transition">Leaderboard</a>
          </Link>
          <Link href="/profile">
            <a className="text-gray-700 hover:text-blue-600 transition">Profile</a>
          </Link>
          <Link href="/auth">
            <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login / Signup
            </a>
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
          <Link href="/test-series">
            <a className="block text-gray-700 hover:text-blue-600">Test Series</a>
          </Link>
          <Link href="/leaderboard">
            <a className="block text-gray-700 hover:text-blue-600">Leaderboard</a>
          </Link>
          <Link href="/profile">
            <a className="block text-gray-700 hover:text-blue-600">Profile</a>
          </Link>
          <Link href="/auth">
            <a className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login / Signup
            </a>
          </Link>
        </nav>
      )}
    </header>
  );
}
