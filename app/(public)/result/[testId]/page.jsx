"use client";

import { useEffect, useState } from "react";
import supabase from '@/lib/supabaseClient'
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

export default function ResultPage({ params }) {
  const { testId } = params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to view results.");
          setLoading(false);
          return;
        }

        // Fetch attempt data for user and testId
        const { data, error } = await supabase
          .from("test_attempts")
          .select("*")
          .eq("test_id", testId)
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          setError("Result not found.");
          setLoading(false);
          return;
        }

        setResult(data);
      } catch (err) {
        setError(err.message || "Failed to fetch result.");
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => router.push("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  const totalQuestions = result.total_questions || 50;
  const correct = result.correct_answers || 0;
  const wrong = result.wrong_answers || 0;
  const skipped = totalQuestions - correct - wrong;
  const accuracy = ((correct / totalQuestions) * 100).toFixed(2);
  const timeTaken = result.time_taken || 0; // in seconds

  const pieData = [
    { name: "Correct", value: correct },
    { name: "Wrong", value: wrong },
    { name: "Skipped", value: skipped },
  ];

  function downloadPDF() {
    alert("PDF download feature coming soon!");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Test Result</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-lg">
            <strong>Score:</strong> {correct} / {totalQuestions}
          </p>
          <p className="text-lg">
            <strong>Accuracy:</strong> {accuracy}%
          </p>
          <p className="text-lg">
            <strong>Time Taken:</strong> {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
          </p>
        </div>

        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className="block mx-auto bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Download Scorecard (PDF)
      </button>
    </div>
  );
}
