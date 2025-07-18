"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import supabase from '@/lib/supabaseClient'
import Button from '@/components/Button'

import TestCard from "@/components/TestCard";

export default function HomePage() {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      setLoading(true);
      const { data, error } = await supabase
        .from("test_series")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) console.error("Error fetching tests:", error.message);
      else setTestSeries(data);

      setLoading(false);
    }

    fetchTests();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">TestYukti</h1>
        <p className="text-lg md:text-xl mb-6">
          Practice. Improve. Succeed. Your Ultimate Test Series Platform.
        </p>
        <Link href="/test-series">
          <Button>Explore Test Series</Button>
        </Link>
      </section>

      {/* Featured Test Series */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Featured Test Series
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading tests...</p>
        ) : testSeries.length === 0 ? (
          <p className="text-center text-gray-500">No test series available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testSeries.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto py-12 px-4 bg-white shadow rounded">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Browse by Category
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {["SSC", "BPSC", "UPSC", "Railway", "Bank", "State Police", "Teaching", "Defence"].map(
            (cat) => (
              <Link
                key={cat}
                href={`/test-series?category=${cat}`}
                className="bg-gray-100 hover:bg-indigo-50 p-4 rounded shadow-sm transition"
              >
                <p className="text-lg font-medium">{cat}</p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Daily Quiz Section */}
      <section className="text-center py-16 bg-indigo-50 mt-10">
        <h3 className="text-2xl font-semibold mb-4">Daily Quiz</h3>
        <p className="mb-6 text-gray-600">Boost your streak & stay sharp every day!</p>
        <Link href="/test-series?category=Daily-Quiz">
          <Button>Start Daily Quiz</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} TestYukti. All rights reserved.
      </footer>
    </main>
  );
}
