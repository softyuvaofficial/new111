"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from '@/lib/supabaseClient'
import Pagination from "@/components/Pagination";

export default function LeaderboardPage({ params }) {
  const { testId } = params;
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      // Fetch total count
      const { count, error: countError } = await supabase
        .from("test_attempts")
        .select("*", { count: "exact", head: true })
        .eq("test_id", testId);

      if (countError) throw countError;
      setTotalCount(count);

      // Fetch paginated leaderboard data, order by score desc, time asc
      const { data, error } = await supabase
        .from("test_attempts")
        .select(`
          user_id,
          score,
          time_taken,
          rank,
          users(username)
        `)
        .eq("test_id", testId)
        .order("score", { ascending: false })
        .order("time_taken", { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, [page, testId]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-center text-gray-600">No attempts found for this test.</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="min-w-full bg-white rounded-md shadow-md">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-3 px-6 text-left">Rank</th>
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Score</th>
                <th className="py-3 px-6 text-left">Time Taken (sec)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, idx) => (
                <tr
                  key={item.user_id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-6">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="py-3 px-6">{item.users?.username || "Unknown"}</td>
                  <td className="py-3 px-6">{item.score}</td>
                  <td className="py-3 px-6">{item.time_taken}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
