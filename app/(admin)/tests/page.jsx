"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabaseClient from '../../../lib/supabaseClient';

export default function TestsListPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchTests();
  }, [page, search]);

  async function fetchTests() {
    setLoading(true);

    let query = supabase
      .from("tests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      alert("Failed to fetch tests.");
    } else {
      setTests(data || []);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this test?")) return;
    const { error } = await supabase.from("tests").delete().eq("id", id);
    if (error) {
      alert("Failed to delete test.");
    } else {
      alert("Test deleted successfully.");
      fetchTests();
    }
  }

  async function toggleActive(id, current) {
    const { error } = await supabase.from("tests").update({ active: !current }).eq("id", id);
    if (error) {
      alert("Failed to update status.");
    } else {
      fetchTests();
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Tests</h1>
        <Link href={`/(admin)/tests/create`}>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            + Create New Test
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border rounded"
        />
      </div>

      {loading ? (
        <p>Loading tests...</p>
      ) : tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Duration (min)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Price (₹)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Paid</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Active</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{test.title}</td>
                <td className="border border-gray-300 px-4 py-2">{test.category}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{test.duration}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{test.price || 0}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {test.isPaid ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => toggleActive(test.id, test.active)}
                    className={`px-3 py-1 rounded ${
                      test.active ? "bg-green-600 text-white" : "bg-gray-300"
                    }`}
                  >
                    {test.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <Link href={`/(admin)/tests/${test.id}/edit`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between max-w-md mx-auto">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={tests.length < limit}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
