"use client";

import { useEffect, useState } from "react";
import supabase from '../../../lib/supabaseClient';

import { saveAs } from "file-saver";

export default function ReportsPage() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const { data } = await supabase.from("tests").select("id, title");
    setTests(data);
  };

  const generateReport = async () => {
    if (!selectedTest) {
      alert("Please select a test");
      return;
    }

    const { data: attempts } = await supabase
      .from("attempts")
      .select("user_id, test_id, score, time_taken, created_at")
      .eq("test_id", selectedTest);

    setReportData(attempts);
  };

  const downloadCSV = () => {
    const csvRows = [
      ["User ID", "Test ID", "Score", "Time Taken (sec)", "Attempt Date"],
      ...reportData.map((a) => [
        a.user_id,
        a.test_id,
        a.score,
        a.time_taken,
        new Date(a.created_at).toLocaleString(),
      ]),
    ];

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `test-report-${selectedTest}.csv`);
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Generate Reports</h1>

      <div className="space-y-4 mb-8">
        <label className="block text-lg">Select Test:</label>
        <select
          className="w-full p-3 border rounded"
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
        >
          <option value="">-- Select Test --</option>
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.title}
            </option>
          ))}
        </select>

        <button
          onClick={generateReport}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Generate Report
        </button>
      </div>

      {reportData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Attempts Summary</h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Time Taken</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((a) => (
                <tr key={a.user_id + a.created_at}>
                  <td className="p-2 border">{a.user_id}</td>
                  <td className="p-2 border">{a.score}</td>
                  <td className="p-2 border">{a.time_taken} sec</td>
                  <td className="p-2 border">
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={downloadCSV}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>
      )}
    </main>
  );
}
