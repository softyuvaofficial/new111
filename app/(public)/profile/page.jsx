"use client";

import { useEffect, useState } from "react";
import supabase from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      // Fetch test attempts
      const { data: attemptsData, error: attemptsError } = await supabase
        .from("test_attempts")
        .select("id, test_id, score, submitted_at")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(10);

      if (attemptsError) {
        console.error("Error fetching attempts:", attemptsError.message);
      } else {
        setAttempts(attemptsData || []);
      }

      // Fetch coins (dummy, replace with real logic)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching coins:", profileError.message);
      } else {
        setCoins(profileData?.coins || 0);
      }

      // Fetch certificates (dummy data here)
      setCertificates([
        { id: 1, testName: "SSC CGL Mock Test 1", date: "2025-06-10" },
        { id: 2, testName: "BPSC Prelims 2025", date: "2025-05-15" },
      ]);

      setLoading(false);
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Coins</h2>
        <div className="text-indigo-600 text-2xl font-bold">{coins}</div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Test Attempts</h2>
        {attempts.length === 0 ? (
          <p>No test attempts found.</p>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Test ID</th>
                <th className="py-2 px-4 text-left">Score</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="odd:bg-gray-50 even:bg-white"
                >
                  <td className="py-2 px-4">{attempt.test_id}</td>
                  <td className="py-2 px-4">{attempt.score}</td>
                  <td className="py-2 px-4">
                    {new Date(attempt.submitted_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Certificates</h2>
        {certificates.length === 0 ? (
          <p>No certificates earned yet.</p>
        ) : (
          <ul className="space-y-3">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="p-4 border rounded shadow-sm hover:shadow-md transition cursor-pointer bg-indigo-50"
                title={`Earned on ${new Date(cert.date).toLocaleDateString()}`}
              >
                {cert.testName} - <em>{new Date(cert.date).toLocaleDateString()}</em>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
