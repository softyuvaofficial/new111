"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from '@/lib/supabaseClient';

import Link from "next/link";

export default function EditTestPage() {
  const router = useRouter();
  const { testId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testData, setTestData] = useState({
    title: "",
    description: "",
    duration: 60, // in minutes
    category: "",
    price: 0,
    isPaid: false,
    active: true,
  });

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchTest();
    fetchQuestions();
  }, [page]);

  async function fetchTest() {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("id", testId)
      .single();

    if (error) {
      alert("Failed to load test data.");
      router.back();
    } else {
      setTestData({
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        price: data.price,
        isPaid: data.isPaid,
        active: data.active,
      });
      setLoading(false);
    }
  }

  async function fetchQuestions() {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", testId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Failed to load questions.");
    } else {
      setQuestions(data);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("tests")
      .update({
        title: testData.title,
        description: testData.description,
        duration: Number(testData.duration),
        category: testData.category,
        price: Number(testData.price),
        isPaid: testData.isPaid,
        active: testData.active,
      })
      .eq("id", testId);

    if (error) {
      alert("Failed to save test.");
    } else {
      alert("Test updated successfully!");
    }
    setSaving(false);
  };

  if (loading) return <p className="p-8 text-center">Loading test data...</p>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Test: {testData.title}</h1>

      <section className="mb-8 space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={testData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={testData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={testData.duration}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              min={1}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={testData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={testData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              min={0}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPaid"
              checked={testData.isPaid}
              onChange={handleChange}
              id="isPaid"
            />
            <label htmlFor="isPaid" className="font-medium">Paid Test?</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={testData.active}
              onChange={handleChange}
              id="active"
            />
            <label htmlFor="active" className="font-medium">Active?</label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-4 px-6 py-3 rounded text-white ${
            saving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          <Link href={`/(admin)/questions/create?testId=${testId}`}>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              + Add Question
            </button>
          </Link>
        </div>

        {questions.length === 0 ? (
          <p>No questions found for this test.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{q.content.slice(0, 100)}...</p>
                  <p className="text-sm text-gray-500">
                    {q.subject} | {q.chapter} | {q.topic} | {q.difficulty}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/(admin)/questions/${q.id}/edit`}>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          "Are you sure you want to delete this question?"
                        )
                      ) {
                        await supabase.from("questions").delete().eq("id", q.id);
                        fetchQuestions();
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
            disabled={questions.length < limit}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
