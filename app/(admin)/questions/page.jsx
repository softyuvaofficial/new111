"use client";

import { useEffect, useState } from "react";
import supabaseClient from '../../../lib/supabaseClient';
import Link from "next/link";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchQuestions();
  }, [search, page]);

  const fetchQuestions = async () => {
    let query = supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.ilike("content", `%${search}%`);
    }

    const { data } = await query;
    setQuestions(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await supabase.from("questions").delete().eq("id", id);
      fetchQuestions();
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <Link href="/(admin)/questions/create">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            + Add Question
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by content..."
        className="w-full p-3 mb-6 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions found.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="p-4 border rounded bg-white shadow-sm">
              <h3 className="font-semibold">{q.content}</h3>
              <p className="text-sm text-gray-500">
                {q.subject} / {q.chapter} / {q.topic} - {q.difficulty}
              </p>

              <div className="mt-2 flex gap-3">
                <Link href={`/(admin)/questions/${q.id}/edit`}>
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(q.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Previous
        </button>

        <span className="text-gray-600">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </main>
  );
}
