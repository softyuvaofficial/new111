"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from '@/lib/supabaseClient';

export default function CreateTestPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60, // in minutes
    category: "",
    isPaid: false,
    price: 0,
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    // Basic validation before next step
    if (step === 1 && !formData.title.trim()) {
      alert("Please enter a test title");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Test title is required");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("tests").insert([
      {
        title: formData.title,
        description: formData.description,
        duration: Number(formData.duration),
        category: formData.category,
        isPaid: formData.isPaid,
        price: Number(formData.price),
        active: formData.active,
      },
    ]);

    if (error) {
      alert("Error creating test: " + error.message);
      setLoading(false);
      return;
    }

    alert("Test created successfully!");
    router.push(`/(admin)/tests/${data[0].id}/edit`);
  };

  return (
    <main className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Create New Test</h1>

      {/* Step indicators */}
      <div className="flex justify-between mb-8">
        <div className={`flex-1 border-b-4 ${step >= 1 ? "border-indigo-600" : "border-gray-300"}`}>
          <p className={`text-center py-2 ${step === 1 ? "font-bold text-indigo-600" : "text-gray-500"}`}>Basic Info</p>
        </div>
        <div className={`flex-1 border-b-4 ${step >= 2 ? "border-indigo-600" : "border-gray-300"}`}>
          <p className={`text-center py-2 ${step === 2 ? "font-bold text-indigo-600" : "text-gray-500"}`}>Confirmation</p>
        </div>
      </div>

      {step === 1 && (
        <section className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Test Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              placeholder="Enter test title"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              rows={3}
              placeholder="Optional test description"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min={1}
                className="w-full p-3 border rounded"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="E.g. SSC, UPSC, etc."
                className="w-full p-3 border rounded"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPaid"
              id="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
            />
            <label htmlFor="isPaid" className="font-medium">Paid Test?</label>
          </div>

          {formData.isPaid && (
            <div>
              <label className="block mb-1 font-medium">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min={0}
                className="w-full p-3 border rounded"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <label htmlFor="active" className="font-medium">Active?</label>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Confirm Details</h2>
          <p><strong>Title:</strong> {formData.title}</p>
          <p><strong>Description:</strong> {formData.description || "N/A"}</p>
          <p><strong>Duration:</strong> {formData.duration} minutes</p>
          <p><strong>Category:</strong> {formData.category || "N/A"}</p>
          <p><strong>Paid Test:</strong> {formData.isPaid ? "Yes" : "No"}</p>
          {formData.isPaid && <p><strong>Price:</strong> ₹{formData.price}</p>}
          <p><strong>Active:</strong> {formData.active ? "Yes" : "No"}</p>
        </section>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="px-6 py-3 rounded border border-gray-400 hover:bg-gray-100"
          >
            Previous
          </button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Creating..." : "Create Test"}
          </button>
        )}
      </div>
    </main>
  );
}
