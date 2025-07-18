"use client";

import { useEffect, useState } from "react";
import supabase from '@/lib/supabaseClient'
import TestCard from "@/components/TestCard";
import { useSearchParams, useRouter } from "next/navigation";

const PAGE_SIZE = 9; // Number of tests per page

export default function TestSeriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tests, setTests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Query Params
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    async function fetchTestSeries() {
      setLoading(true);

      let query = supabase.from("test_series").select("*", { count: "exact" });

      if (category) query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);

      query = query
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
        .order("created_at", { ascending: false });

      const { data, count, error } = await query;

      if (error) console.error(error.message);
      else {
        setTests(data);
        setTotalCount(count);
      }

      setLoading(false);
    }

    fetchTestSeries();
  }, [category, search, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function handleCategoryChange(e) {
    const cat = e.target.value;
    router.push(`/test-series?category=${cat}`);
  }

  function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("query");
    router.push(`/test-series?search=${query}`);
  }

  function changePage(newPage) {
    let url = `/test-series?page=${newPage}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    router.push(url);
  }

  return (
    <main className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">All Test Series</h1>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            name="query"
            placeholder="Search test series..."
            defaultValue={search}
            className="border rounded-l px-4 py-2 w-64"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border px-4 py-2 rounded w-48"
        >
          <option value="">All Categories</option>
          <option value="SSC">SSC</option>
          <option value="BPSC">BPSC</option>
          <option value="UPSC">UPSC</option>
          <option value="Railway">Railway</option>
          <option value="Bank">Bank</option>
          <option value="Defence">Defence</option>
          <option value="Teaching">Teaching</option>
        </select>
      </div>

      {/* Test Series List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading test series...</p>
      ) : tests.length === 0 ? (
        <p className="text-center text-gray-500">No test series found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-4">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-medium text-lg">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
