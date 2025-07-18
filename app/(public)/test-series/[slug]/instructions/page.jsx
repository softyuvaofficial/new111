"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from '@/lib/supabaseClient'
import Link from "next/link";

export default function InstructionsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestDetails() {
      setLoading(true);
      const { data, error } = await supabase
        .from("test_series")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching test:", error.message);
      } else {
        setTest(data);
      }
      setLoading(false);
    }

    fetchTestDetails();
  }, [slug]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading instructions...</p>;
  }

  if (!test) {
    return <p className="text-center py-10 text-red-500">Test not found.</p>;
  }

  const handleStartTest = () => {
    router.push(`/test-attempt/${test.id}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">{test.title}</h1>

      <div className="mb-6 text-gray-700 leading-relaxed">
        <p className="mb-2"><strong>Time Limit:</strong> {test.time_limit || 60} Minutes</p>
        <p className="mb-2"><strong>Total Questions:</strong> {test.total_questions || 100}</p>
        <p className="mb-2"><strong>Marking Scheme:</strong> +{test.marks_per_correct || 1} / -{test.negative_marks || 0.25}</p>
        <p className="mb-4"><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Do not refresh the page during the test.</li>
          <li>Questions will be shuffled for each student.</li>
          <li>Once you submit, you cannot reattempt the same test.</li>
          <li>Auto-submit will happen when time ends.</li>
          <li>Make sure your internet connection is stable.</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/test-series">
          <button className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            Back to Series
          </button>
        </Link>

        <button
          onClick={handleStartTest}
          className="px-8 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Start Test
        </button>
      </div>
    </main>
  );
}
