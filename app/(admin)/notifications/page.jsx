"use client";

import { useState } from "react";
import supabase from '../../../lib/supabaseClient';

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const { error } = await fetch("/api/notifications/send", {
      method: "POST",
      body: JSON.stringify({
        message,
        target,
      }),
    });

    if (error) {
      alert("Failed to send notification.");
    } else {
      setSuccessMsg("Notification sent successfully!");
      setMessage("");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Send Notification</h1>

      {successMsg && <p className="mb-4 text-green-600">{successMsg}</p>}

      <form onSubmit={handleSend} className="space-y-4">
        <textarea
          rows={4}
          placeholder="Write your notification message here..."
          className="w-full p-4 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <div>
          <label className="block mb-2 font-medium">Send To:</label>
          <select
            className="w-full border rounded p-2"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="all">All Students</option>
            <option value="batch">Specific Batch</option>
            <option value="test">Specific Test Participants</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded text-white ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </main>
  );
}
