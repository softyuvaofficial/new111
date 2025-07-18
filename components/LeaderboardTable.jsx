import React from "react";

export default function LeaderboardTable({
  data = [],
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  loading = false,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Accuracy</th>
            <th className="px-4 py-2">Time Taken</th>
            <th className="px-4 py-2">City/State</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                No leaderboard data found.
              </td>
            </tr>
          ) : (
            data.map((user, idx) => (
              <tr
                key={user.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2">{(page - 1) * 10 + idx + 1}</td>
                <td className="px-4 py-2 font-medium">{user.name || "N/A"}</td>
                <td className="px-4 py-2">{user.score ?? "-"}</td>
                <td className="px-4 py-2">{user.accuracy ? `${user.accuracy}%` : "-"}</td>
                <td className="px-4 py-2">{user.time_taken || "-"}</td>
                <td className="px-4 py-2">{user.location || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Prev
        </button>
        <span className="px-3 py-1 border rounded">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
