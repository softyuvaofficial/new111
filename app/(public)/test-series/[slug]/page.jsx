"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from '@/lib/supabaseClient'
import Link from "next/link";

export default function TestSeriesDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [series, setSeries] = useState(null);
  const [tests, setTests] = useState([]);
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchSeriesDetails() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data: seriesData } = await supabase
        .from("test_series")
        .select("*")
        .eq("slug", slug)
        .single();

      setSeries(seriesData);

      const { data: testsData } = await supabase
        .from("tests")
        .select("*")
        .eq("series_id", seriesData.id)
        .order("order_no", { ascending: true });

      setTests(testsData);

      if (user) {
        const { data: purchaseData } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .eq("test_id", seriesData.id)
          .single();

        setPurchased(!!purchaseData);
      }

      setLoading(false);
    }

    fetchSeriesDetails();
  }, [slug]);

  const handleStart = () => {
    if (purchased || series.price === 0) {
      router.push(`/test-series/${slug}/instructions`);
    } else {
      router.push(`/test-series/${slug}/purchase`);
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  if (!series) {
    return <p className="text-center py-10 text-red-500">Test Series not found.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{series.title}</h1>

      <p className="text-gray-700 mb-6">{series.description || "No description available."}</p>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <p className="text-lg text-gray-600">
          Price:{" "}
          {series.price > 0 ? (
            <span className="font-bold text-indigo-600">₹{series.price}</span>
          ) : (
            <span className="font-bold text-green-600">Free</span>
          )}
        </p>

        <button
          onClick={handleStart}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          {purchased || series.price === 0 ? "Start Test" : "Unlock Now"}
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Included Tests:</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests added yet.</p>
        ) : (
          tests.map((test) => (
            <div key={test.id} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-bold text-lg">{test.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{test.type}</p>
              <p className="text-gray-500 mb-4">{test.description}</p>

              <Link href={`/test-attempt/${test.id}`}>
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm">
                  Attempt Now
                </button>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/test-series" className="text-indigo-500 underline">
          Back to Test Series List
        </Link>
      </div>
    </main>
  );
}
